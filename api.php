<?php
use App\Http\Controllers\Api\LinkController as ApiLinkController;

Route::middleware(['auth:api'])->group(function () {
    Route::post('/shorten', [ApiLinkController::class, 'shorten']);
    Route::get('/links', [ApiLinkController::class, 'index']);
    Route::get('/statistics', [ApiLinkController::class, 'statistics']);
});