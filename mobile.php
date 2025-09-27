<?php
use App\Http\Controllers\MobileLinkController;
use App\Http\Controllers\PWAController;

Route::prefix('mobile')->group(function () {
    // Mobile-specific routes
    Route::get('/', [MobileLinkController::class, 'mobileHome'])->name('mobile.home');
    Route::post('/shorten', [MobileLinkController::class, 'mobileShorten'])->name('mobile.shorten');
    Route::get('/{shortUrl}', [MobileLinkController::class, 'mobileRedirect'])->name('mobile.redirect');
    
    // PWA routes
    Route::get('/manifest.json', [PWAController::class, 'manifest']);
    Route::get('/offline', [PWAController::class, 'offline'])->name('mobile.offline');
    
    // QR Code routes
    Route::get('/qr/{shortUrl}', [MobileLinkController::class, 'generateQRCode'])->name('mobile.qr');
});

// Default route detection
Route::get('/', function (Request $request) {
    $mobileDetector = new \App\Services\MobileDetection();
    $deviceInfo = $mobileDetector->getDeviceInfo($request);
    
    if ($deviceInfo['is_mobile']) {
        return redirect()->route('mobile.home');
    }
    
    return redirect()->route('desktop.home');
});