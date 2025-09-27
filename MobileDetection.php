<?php
namespace App\Services;

use Jenssegers\Agent\Agent;

class MobileDetection
{
    protected $agent;

    public function __construct()
    {
        $this->agent = new Agent();
    }

    public function getDeviceInfo($request)
    {
        return [
            'is_mobile' => $this->agent->isMobile(),
            'is_tablet' => $this->agent->isTablet(),
            'is_phone' => $this->agent->isPhone(),
            'device_type' => $this->getDeviceType(),
            'os' => $this->agent->platform(),
            'os_version' => $this->agent->version($this->agent->platform()),
            'browser' => $this->agent->browser(),
            'browser_version' => $this->agent->version($this->agent->browser()),
            'screen' => $this->getScreenInfo($request),
        ];
    }

    private function getDeviceType()
    {
        if ($this->agent->isTablet()) return 'tablet';
        if ($this->agent->isMobile()) return 'mobile';
        return 'desktop';
    }

    private function getScreenInfo($request)
    {
        // Get screen info from client-side (will be sent via JavaScript)
        return [
            'width' => $request->header('Viewport-Width') ?: 'unknown',
            'height' => $request->header('Viewport-Height') ?: 'unknown',
        ];
    }

    public function getMobileOS()
    {
        $platform = $this->agent->platform();
        
        if (stripos($platform, 'android') !== false) return 'android';
        if (stripos($platform, 'ios') !== false) return 'ios';
        if (stripos($platform, 'windows') !== false) return 'windows';
        
        return $platform;
    }

    public function shouldShowMobileAd($deviceInfo)
    {
        // Higher ad probability for mobile users
        if ($deviceInfo['is_mobile']) {
            return rand(1, 100) <= 40; // 40% chance for mobile
        }
        
        return rand(1, 100) <= 25; // 25% chance for desktop
    }
}