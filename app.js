function shortenUrl() {
    const longUrl = document.getElementById('longUrl').value;
    
    // Simple Validation
    if(!longUrl || !longUrl.startsWith('http')) {
        alert("Please enter a valid URL starting with http:// or https://");
        return;
    }

    // Encode to Base64 (Standard btoa works for simple URLs)
    const encoded = btoa(longUrl);
    const domain = window.location.origin + window.location.pathname;
    const shortLink = `${domain}?u=${encoded}`;

    // Display Result
    document.getElementById('resultSection').classList.remove('d-none');
    document.getElementById('shortLinkText').innerText = shortLink;
    document.getElementById('openLinkBtn').href = shortLink;

    // Clear previous QR
    document.getElementById('qrcode').innerHTML = "";
    
    // Generate QR
    new QRCode(document.getElementById("qrcode"), {
        text: shortLink,
        width: 128,
        height: 128
    });

    // Scroll to result
    document.getElementById('resultSection').scrollIntoView({ behavior: 'smooth' });
}

function copyToClipboard() {
    const text = document.getElementById('shortLinkText').innerText;
    navigator.clipboard.writeText(text).then(() => {
        alert("Link copied to clipboard!");
    });
}

function downloadQR() {
    const img = document.querySelector('#qrcode img');
    const link = document.createElement('a');
    link.download = 'short-link-qr.png';
    link.href = img.src;
    link.click();
}