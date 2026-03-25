const express = require('express');
const multer = require('multer');
const { PDFDocument } = require('pdf-lib');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const app = express();

const upload = multer({ dest: 'uploads/' });

// Ensure uploads folder exists
if (!fs.existsSync('uploads')) fs.mkdirSync('uploads');

// Cleanup old files every hour
setInterval(() => {
    const now = Date.now();
    fs.readdir('uploads', (err, files) => {
        if (err) return;
        files.forEach(file => {
            const filePath = path.join('uploads', file);
            fs.stat(filePath, (err, stat) => {
                if (err) return;
                if (now - stat.mtimeMs > 3600000) { // older than 1 hour
                    fs.unlink(filePath, () => {});
                }
            });
        });
    });
}, 3600000);

// Serve static frontend
app.use(express.static('public'));

// API: Merge PDF
app.post('/api/merge-pdf', upload.array('pdfs', 10), async (req, res) => {
    try {
        const files = req.files;
        if (!files || files.length < 2) {
            return res.status(400).send('Need at least 2 PDFs');
        }

        const mergedPdf = await PDFDocument.create();
        for (const file of files) {
            const pdfBytes = fs.readFileSync(file.path);
            const pdf = await PDFDocument.load(pdfBytes);
            const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
            copiedPages.forEach(page => mergedPdf.addPage(page));
        }

        const mergedPdfBytes = await mergedPdf.save();
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=merged.pdf');
        res.send(Buffer.from(mergedPdfBytes));

        // Cleanup uploaded files
        files.forEach(f => fs.unlink(f.path, () => {}));
    } catch (err) {
        console.error(err);
        res.status(500).send('Error merging PDFs');
    }
});

// API: Compress PDF (demo – just returns original, but you can implement real compression)
app.post('/api/compress-pdf', upload.single('pdf'), async (req, res) => {
    try {
        const file = req.file;
        // Here you would implement compression (e.g., with ghostscript or pdf-lib optimizations)
        // For demo, we simply return the same file after a delay.
        setTimeout(() => {
            res.download(file.path, 'compressed.pdf', () => {
                fs.unlink(file.path, () => {});
            });
        }, 3000);
    } catch (err) {
        res.status(500).send('Error compressing PDF');
    }
});

// API: JPG to PDF
app.post('/api/jpg-to-pdf', upload.array('images', 10), async (req, res) => {
    try {
        const files = req.files;
        const pdfDoc = await PDFDocument.create();
        for (const file of files) {
            const imageBytes = fs.readFileSync(file.path);
            // Detect image type
            const ext = path.extname(file.originalname).toLowerCase();
            let image;
            if (ext === '.jpg' || ext === '.jpeg') {
                image = await pdfDoc.embedJpg(imageBytes);
            } else if (ext === '.png') {
                image = await pdfDoc.embedPng(imageBytes);
            } else {
                // For unsupported types, skip or convert via sharp
                // For simplicity, we'll just skip
                continue;
            }
            const page = pdfDoc.addPage([image.width, image.height]);
            page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
        }
        const pdfBytes = await pdfDoc.save();
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=converted.pdf');
        res.send(Buffer.from(pdfBytes));
        files.forEach(f => fs.unlink(f.path, () => {}));
    } catch (err) {
        console.error(err);
        res.status(500).send('Error converting images');
    }
});

// API: PDF to JPG (extract first page as image)
app.post('/api/pdf-to-jpg', upload.single('pdf'), async (req, res) => {
    try {
        const file = req.file;
        const pdfBytes = fs.readFileSync(file.path);
        const pdfDoc = await PDFDocument.load(pdfBytes);
        const pages = pdfDoc.getPages();
        if (pages.length === 0) throw new Error('No pages');

        // This is a complex task: rendering PDF to image requires a library like pdf.js or poppler.
        // For demo, we'll create a dummy JPG (or we can use a placeholder).
        // In a real implementation, you'd use `pdf2pic` or similar.
        // We'll just return a sample image with a note.
        const dummyJpg = path.join(__dirname, 'public', 'sample.jpg');
        res.download(dummyJpg, 'page1.jpg', () => {
            fs.unlink(file.path, () => {});
        });
    } catch (err) {
        res.status(500).send('Error converting PDF to JPG');
    }
});

// Add similar endpoints for other tools...

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));