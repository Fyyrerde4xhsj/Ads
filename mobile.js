class MobileAdLinkFly {
    constructor() {
        this.init();
    }

    init() {
        this.setupForm();
        this.setupPWA();
        this.detectTouch();
        this.preventZoom();
    }

    setupForm() {
        const form = document.getElementById('mobile-shorten-form');
        if (form) {
            form.addEventListener('submit', (e) => this.handleSubmit(e));
        }

        // Toggle advanced options
        const toggle = document.querySelector('input[name="custom_alias"]');
        if (toggle) {
            toggle.addEventListener('change', (e) => {
                const container = document.querySelector('.custom-alias-container');
                container.style.display = e.target.checked ? 'block' : 'none';
            });
        }
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        const form = e.target;
        const button = form.querySelector('.shorten-btn');
        const buttonText = button.querySelector('.btn-text');
        const buttonLoading = button.querySelector('.btn-loading');
        
        // Show loading state
        buttonText.style.display = 'none';
        buttonLoading.style.display = 'inline';
        button.disabled = true;

        try {
            const formData = new FormData(form);
            const response = await fetch('/mobile/shorten', {
                method: 'POST',
                body: formData,
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });

            const result = await response.json();

            if (result.success) {
                this.showResult(result);
            } else {
                this.showError(result.message);
            }
        } catch (error) {
            this.showError('Network error. Please try again.');
        } finally {
            // Reset button
            buttonText.style.display = 'inline';
            buttonLoading.style.display = 'none';
            button.disabled = false;
        }
    }

    showResult(data) {
        const container = document.getElementById('result-container');
        const input = document.getElementById('short-url');
        
        input.value = data.short_url;
        container.style.display = 'block';
        
        // Scroll to result
        container.scrollIntoView({ behavior: 'smooth' });
    }

    showError(message) {
        // Simple error notification
        alert('Error: ' + message);
    }

    setupPWA() {
        // Check if PWA is installable
        let deferredPrompt;
        const installPrompt = document.getElementById('pwa-prompt');

        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            if (installPrompt) {
                installPrompt.style.display = 'block';
            }
        });

        // Install handler
        if (installPrompt) {
            installPrompt.querySelector('.install-btn').addEventListener('click', async () => {
                if (deferredPrompt) {
                    deferredPrompt.prompt();
                    const { outcome } = await deferredPrompt.userChoice;
                    if (outcome === 'accepted') {
                        installPrompt.style.display = 'none';
                    }
                }
            });
        }
    }

    detectTouch() {
        // Add touch-specific classes
        document.body.classList.add('touch-device');
        
        // Prevent double-tap zoom
        let lastTouchEnd = 0;
        document.addEventListener('touchend', (e) => {
            const now = Date.now();
            if (now - lastTouchEnd <= 300) {
                e.preventDefault();
            }
            lastTouchEnd = now;
        }, false);
    }

    preventZoom() {
        // Disable pinch zoom
        document.addEventListener('touchmove', (e) => {
            if (e.scale !== 1) {
                e.preventDefault();
            }
        }, { passive: false });
    }
}

// Utility functions
function copyToClipboard() {
    const input = document.getElementById('short-url');
    input.select();
    document.execCommand('copy');
    
    // Show copied feedback
    const button = event.target;
    const originalText = button.textContent;
    button.textContent = 'Copied!';
    setTimeout(() => {
        button.textContent = originalText;
    }, 2000);
}

async function shareLink() {
    const url = document.getElementById('short-url').value;
    
    if (navigator.share) {
        try {
            await navigator.share({
                title: 'Check this link',
                url: url
            });
        } catch (error) {
            console.log('Share failed:', error);
        }
    } else {
        copyToClipboard();
        alert('Link copied to clipboard!');
    }
}

function generateQRCode() {
    const url = document.getElementById('short-url').value;
    // Implement QR code generation
    window.open('/qr-code?url=' + encodeURIComponent(url), '_blank');
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MobileAdLinkFly();
});