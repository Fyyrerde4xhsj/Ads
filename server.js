const express = require('express');
const multer = require('multer');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Ensure directories exist
const uploadsDir = path.join(__dirname, 'uploads');
const compressedDir = path.join(__dirname, 'compressed');

if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
if (!fs.existsSync(compressedDir)) fs.mkdirSync(compressedDir, { recursive: true });

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
        cb(null, uniqueName);
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 100 * 1024 * 1024 // 100MB limit
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('video/')) {
            cb(null, true);
        } else {
            cb(new Error('Only video files are allowed!'), false);
        }
    }
});

// Serve static files
app.use(express.static(__dirname));
app.use('/uploads', express.static(uploadsDir));
app.use('/compressed', express.static(compressedDir));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/compress', upload.single('video'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, error: 'No video file uploaded' });
    }

    const quality = parseInt(req.body.quality) || 5;
    const format = req.body.format || 'mp4';
    const inputPath = req.file.path;
    const originalSize = req.file.size;
    const outputFilename = `compressed-${Date.now()}.${format}`;
    const outputPath = path.join(compressedDir, outputFilename);

    // Map quality (1-10) to CRF values (higher CRF = more compression)
    const crf = Math.max(23, 51 - (quality * 3)); // Range: 21-48 (lower is better quality)

    const command = ffmpeg(inputPath)
        .videoCodec('libx264')
        .audioCodec('aac')
        .outputOptions([
            `-crf ${crf}`,
            '-preset medium',
            '-movflags +faststart'
        ])
        .on('start', (commandLine) => {
            console.log('Spawned Ffmpeg with command: ' + commandLine);
        })
        .on('progress', (progress) => {
            console.log('Processing: ' + progress.percent + '% done');
        })
        .on('end', () => {
            console.log('Compression finished');
            
            const compressedSize = fs.statSync(outputPath).size;
            const reduction = ((originalSize - compressedSize) / originalSize * 100).toFixed(1);

            // Clean up uploaded file
            fs.unlinkSync(inputPath);

            res.json({
                success: true,
                filename: outputFilename,
                downloadUrl: `/compressed/${outputFilename}`,
                originalSize,
                compressedSize,
                reduction
            });
        })
        .on('error', (err) => {
            console.error('Error:', err);
            
            // Clean up files on error
            if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
            if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
            
            res.status(500).json({ 
                success: false, 
                error: 'Compression failed: ' + err.message 
            });
        })
        .save(outputPath);
});

// Error handling middleware
app.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ success: false, error: 'File too large. Maximum size is 100MB.' });
        }
    }
    res.status(500).json({ success: false, error: error.message });
});

// Cleanup old files function
function cleanupOldFiles() {
    const now = Date.now();
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours

    [uploadsDir, compressedDir].forEach(dir => {
        fs.readdir(dir, (err, files) => {
            if (err) return;
            
            files.forEach(file => {
                const filePath = path.join(dir, file);
                fs.stat(filePath, (err, stats) => {
                    if (err) return;
                    
                    if (now - stats.mtime.getTime() > maxAge) {
                        fs.unlink(filePath, err => {
                            if (err) console.error('Error deleting old file:', err);
                        });
                    }
                });
            });
        });
    });
}

// Cleanup old files every hour
setInterval(cleanupOldFiles, 60 * 60 * 1000);

app.listen(PORT, () => {
    console.log(`Video Compressor server running on http://localhost:${PORT}`);
    console.log('Make sure FFmpeg is installed on your system!');
});