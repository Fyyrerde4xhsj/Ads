<?php
namespace App\Helpers;

class MobileRevenueCalculator
{
    protected $mobileRates = [
        'android' => [
            'US' => 0.08, 'UK' => 0.07, 'CA' => 0.06,
            'AU' => 0.06, 'DE' => 0.05, 'FR' => 0.05,
        ],
        'ios' => [
            'US' => 0.10, 'UK' => 0.09, 'CA' => 0.08,
            'AU' => 0.08, 'DE' => 0.07, 'FR' => 0.07,
        ],
        'mobile' => [
            'US' => 0.06, 'UK' => 0.05, 'CA' => 0.04,
        ],
        'tablet' => [
            'US' => 0.05, 'UK' => 0.04, 'CA' => 0.03,
        ]
    ];

    public function calculateMobileRevenue($deviceInfo, $country = 'US')
    {
        $deviceType = $deviceInfo['is_phone'] ? 'mobile' : ($deviceInfo['is_tablet'] ? 'tablet' : 'desktop');
        $os = stripos($deviceInfo['os'], 'android') !== false ? 'android' : 
              (stripos($deviceInfo['os'], 'ios') !== false ? 'ios' : 'mobile');

        $rate = $this->mobileRates[$os][$country] ?? 
                $this->mobileRates[$deviceType][$country] ?? 
                0.02;

        // Bonus for unique mobile clicks
        if ($deviceInfo['is_mobile']) {
            $rate *= 1.2; // 20% bonus for mobile
        }

        return round($rate, 4);
    }
}