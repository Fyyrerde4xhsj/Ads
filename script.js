// script.js
document.getElementById('shortenForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const longUrl = document.getElementById('longUrl').value;
    const resultDiv = document.getElementById('result');
    
    try {
        const response = await fetch('shorten.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `long_url=${encodeURIComponent(longUrl)}`
        });
        
        const data = await response.json();
        if (data.short_url) {
            document.getElementById('shortUrl').value = data.short_url;
            resultDiv.classList.remove('hidden');
        }
    } catch (error) {
        alert('Error shortening URL');
    }
});

document.getElementById('copyBtn').addEventListener('click', () => {
    const shortUrl = document.getElementById('shortUrl');
    shortUrl.select();
    document.execCommand('copy');
    alert('URL copied to clipboard!');
});