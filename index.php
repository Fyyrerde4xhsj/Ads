<?php
// REDIRECTION LOGIC (Must be at the very top)
if (isset($_GET['u']) && !empty($_GET['u'])) {
    $encoded_url = $_GET['u'];
    $decoded_url = base64_decode($encoded_url);

    // Validate if it's a real URL
    if (filter_var($decoded_url, FILTER_VALIDATE_URL)) {
        header("Location: " . $decoded_url, true, 301);
        exit;
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Free URL Shortener | Instant & Private Link Shortener</title>
    <meta name="description" content="Shorten long URLs instantly using our fast and secure URL shortener. No database, no registration. Free forever.">
    
    <!-- OpenGraph Tags -->
    <meta property="og:title" content="ShortenIt - Free Instant URL Shortener">
    <meta property="og:description" content="Fast, secure and simple URL shortener tool with no database required.">
    <meta property="og:type" content="website">
    
    <!-- Bootstrap 5 & Google Fonts -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="assets/css/style.css">
    
    <!-- QR Code Library -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
</head>
<body>

<nav class="navbar navbar-expand-lg navbar-dark pt-4">
    <div class="container">
        <a class="navbar-brand fw-bold" href="/">ShortenIt</a>
        <div class="navbar-nav ms-auto">
            <a class="nav-link" href="about.php">About</a>
            <a class="nav-link" href="faq.php">FAQ</a>
            <a class="nav-link" href="api.php">API</a>
        </div>
    </div>
</nav>

<main class="container mt-5 pt-5 text-center">
    <!-- TOP AD BANNER 728x90 -->
    <div class="ad-placeholder mb-5 mx-auto" style="max-width: 728px; height: 90px; background: #1e293b; border: 1px dashed #4F46E5;">
        <!-- Paste AdSense/Adsterra Code Here -->
        <span class="text-muted small">ADVERTISEMENT 728 X 90</span>
    </div>

    <div class="hero-section">
        <h1 class="display-3 fw-bold text-gradient">Free Instant<br>URL Shortener</h1>
        <p class="lead text-secondary mt-3">Fast, secure and simple URL shortener tool. No database required, just instant redirection using secure encoding logic.</p>
    </div>

    <!-- Input Box -->
    <div class="row justify-content-center mt-5">
        <div class="col-md-8">
            <div class="input-card p-2 rounded-pill shadow-lg d-flex align-items-center bg-dark border border-secondary">
                <input type="url" id="longUrl" class="form-control border-0 bg-transparent text-white px-4" placeholder="Paste long URL here..." required>
                <button onclick="shortenUrl()" class="btn btn-primary rounded-pill px-4 py-2 fw-bold">Shorten URL &rarr;</button>
            </div>
        </div>
    </div>

    <!-- Result Section (Hidden by default) -->
    <div id="resultSection" class="row justify-content-center mt-5 d-none">
        <div class="col-md-7">
            <div class="card bg-dark border-primary p-4 rounded-4 text-start">
                <label class="text-primary small fw-bold text-uppercase mb-2">Your Short Link</label>
                <div class="d-flex align-items-center mb-4">
                    <h4 id="shortLinkText" class="text-white mb-0 text-truncate">https://yourdomain.com/?u=...</h4>
                    <button onclick="copyToClipboard()" class="btn btn-sm btn-outline-light ms-3">Copy</button>
                </div>
                
                <div class="d-flex gap-2 mb-4">
                    <a id="openLinkBtn" href="#" target="_blank" class="btn btn-light fw-bold">Open Link</a>
                    <button onclick="downloadQR()" class="btn btn-outline-secondary">Download QR</button>
                </div>

                <div id="qrcode" class="bg-white p-2 d-inline-block rounded"></div>
                
                <!-- BELOW RESULT AD 300x250 -->
                <div class="ad-placeholder mt-4" style="width: 300px; height: 250px; background: #1e293b; border: 1px dashed #4F46E5;">
                    <span class="text-muted small">ADVERTISEMENT 300 X 250</span>
                </div>
            </div>
        </div>
    </div>

    <!-- Features Section -->
    <div class="row mt-5 pt-5 pb-5">
        <div class="col-md-4 mb-4">
            <div class="p-4 rounded-4 feature-card h-100">
                <h5 class="fw-bold">No Database</h5>
                <p class="text-secondary small">We don't store your URLs. Everything is encoded directly into the link parameters for maximum privacy.</p>
            </div>
        </div>
        <div class="col-md-4 mb-4">
            <div class="p-4 rounded-4 feature-card h-100">
                <h5 class="fw-bold">Instant Redirection</h5>
                <p class="text-secondary small">PHP-powered Base64 decoding ensures your users reach their destination without any middleman delay.</p>
            </div>
        </div>
        <div class="col-md-4 mb-4">
            <div class="p-4 rounded-4 feature-card h-100">
                <h5 class="fw-bold">Secure Encoding</h5>
                <p class="text-secondary small">Links are obfuscated using industry-standard encoding methods to keep your original URLs clean.</p>
            </div>
        </div>
    </div>
</main>

<footer class="py-5 border-top border-secondary mt-5">
    <div class="container">
        <div class="row">
            <div class="col-md-6 text-start">
                <h5 class="fw-bold">ShortenIt</h5>
                <p class="text-secondary small">The web's most transparent URL shortener. Built for speed, privacy, and simplicity. No accounts, no databases, just links.</p>
            </div>
            <div class="col-md-3">
                <h6 class="fw-bold">Product</h6>
                <ul class="list-unstyled small">
                    <li><a href="api.php" class="text-secondary text-decoration-none">API Docs</a></li>
                    <li><a href="faq.php" class="text-secondary text-decoration-none">How it works</a></li>
                </ul>
            </div>
            <div class="col-md-3">
                <h6 class="fw-bold">Legal</h6>
                <ul class="list-unstyled small">
                    <li><a href="privacy.php" class="text-secondary text-decoration-none">Privacy Policy</a></li>
                    <li><a href="terms.php" class="text-secondary text-decoration-none">Terms of Service</a></li>
                </ul>
            </div>
        </div>
        <div class="text-center text-muted small mt-4">
            &copy; 2024 ShortenIt. All rights reserved. Powered by PHP Base64 Logic.
        </div>
    </div>
</footer>

<script src="assets/js/app.js"></script>
</body>
</html>