<?php
namespace App\Http\Controllers;

use App\Models\Link;
use App\Models\Click;
use App\Services\MobileDetection;
use App\Helpers\MobileRevenueCalculator;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class MobileLinkController extends Controller
{
    protected $mobileDetector;
    protected $revenueCalculator;

    public function __construct()
    {
        $this->mobileDetector = new MobileDetection();
        $this->revenueCalculator = new MobileRevenueCalculator();
    }

    public function mobileShorten(Request $request)
    {
        $request->validate([
            'long_url' => 'required|url',
            'title' => 'nullable|string|max:255',
        ]);

        $deviceInfo = $this->mobileDetector->getDeviceInfo($request);
        $shortUrl = $this->generateMobileFriendlyUrl();

        $link = Link::create([
            'user_id' => auth()->id(),
            'short_url' => $shortUrl,
            'long_url' => $request->long_url,
            'title' => $request->title,
            'device_type' => $deviceInfo['device_type'],
        ]);

        return response()->json([
            'success' => true,
            'short_url' => url($shortUrl),
            'qr_code' => route('link.qr', $shortUrl), // QR code generation
            'mobile_preview' => $this->generateMobilePreview($link)
        ]);
    }

    public function mobileRedirect($shortUrl, Request $request)
    {
        $link = Link::where('short_url', $shortUrl)
            ->where('is_active', true)
            ->firstOrFail();

        if ($link->isExpired()) {
            return $this->mobileErrorPage('Link has expired');
        }

        $deviceInfo = $this->mobileDetector->getDeviceInfo($request);

        // Mobile-specific ad logic
        if ($this->mobileDetector->shouldShowMobileAd($deviceInfo)) {
            return $this->showMobileInterstitialAd($link, $deviceInfo);
        }

        return $this->recordMobileClickAndRedirect($link, $request, $deviceInfo);
    }

    private function showMobileInterstitialAd(Link $link, $deviceInfo)
    {
        $adTemplate = $this->getMobileAdTemplate($deviceInfo);
        
        return view('mobile.ads.' . $adTemplate, [
            'link' => $link,
            'deviceInfo' => $deviceInfo,
            'countdown' => 5, // seconds
            'ad_content' => $this->getMobileAdContent($deviceInfo)
        ]);
    }

    private function getMobileAdTemplate($deviceInfo)
    {
        if ($deviceInfo['is_phone']) return 'interstitial-phone';
        if ($deviceInfo['is_tablet']) return 'interstitial-tablet';
        return 'interstitial-mobile';
    }

    private function getMobileAdContent($deviceInfo)
    {
        // Return mobile-optimized ad content based on device
        $os = $deviceInfo['os'];
        
        if (stripos($os, 'android') !== false) {
            return [
                'type' => 'android_app',
                'content' => 'Download our Android app for better experience!',
                'image' => asset('mobile/ads/android-banner.jpg')
            ];
        } elseif (stripos($os, 'ios') !== false) {
            return [
                'type' => 'ios_app',
                'content' => 'Available on the App Store',
                'image' => asset('mobile/ads/ios-banner.jpg')
            ];
        }
        
        return [
            'type' => 'mobile_web',
            'content' => 'Mobile-optimized content',
            'image' => asset('mobile/ads/mobile-banner.jpg')
        ];
    }

    private function recordMobileClickAndRedirect(Link $link, Request $request, $deviceInfo)
    {
        $revenue = $this->revenueCalculator->calculateMobileRevenue($deviceInfo);

        $clickData = [
            'link_id' => $link->id,
            'ip_address' => $request->ip(),
            'device_type' => $deviceInfo['device_type'],
            'os' => $deviceInfo['os'],
            'screen_resolution' => $deviceInfo['screen']['width'] . 'x' . $deviceInfo['screen']['height'],
            'is_mobile' => $deviceInfo['is_mobile'],
            'is_tablet' => $deviceInfo['is_tablet'],
            'revenue' => $revenue,
            'is_unique' => $this->isUniqueClick($request->ip(), $link->id),
        ];

        $click = Click::create($clickData);

        // Update statistics
        $link->increment('clicks');
        $link->increment('earnings', $revenue);
        $link->user->increment('balance', $revenue);

        return redirect()->away($this->addMobileParameters($link->long_url, $deviceInfo));
    }

    private function addMobileParameters($url, $deviceInfo)
    {
        $parsedUrl = parse_url($url);
        $params = [
            'utm_source' => 'adlinkfly',
            'utm_medium' => $deviceInfo['is_mobile'] ? 'mobile' : 'desktop',
            'utm_device' => $deviceInfo['device_type'],
        ];

        if (isset($parsedUrl['query'])) {
            parse_str($parsedUrl['query'], $existingParams);
            $params = array_merge($existingParams, $params);
        }

        $queryString = http_build_query($params);
        
        return $parsedUrl['scheme'] . '://' . $parsedUrl['host'] . $parsedUrl['path'] . '?' . $queryString;
    }

    private function generateMobileFriendlyUrl()
    {
        // Shorter URLs for mobile
        return Str::random(5);
    }

    public function generateQRCode($shortUrl)
    {
        // Generate QR code for mobile sharing
        $link = Link::where('short_url', $shortUrl)->firstOrFail();
        
        return response()->json([
            'qr_url' => 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=' . url($shortUrl),
            'download_url' => route('link.qr.download', $shortUrl)
        ]);
    }
}