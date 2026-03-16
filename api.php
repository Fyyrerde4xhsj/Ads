<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

if (isset($_GET['url'])) {
    $url = $_GET['url'];
    
    if (filter_var($url, FILTER_VALIDATE_URL)) {
        $encoded = base64_encode($url);
        $protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http";
        $short = $protocol . "://" . $_SERVER['HTTP_HOST'] . "/?u=" . $encoded;
        
        echo json_encode([
            "status" => "success",
            "long_url" => $url,
            "short_url" => $short
        ]);
    } else {
        echo json_encode(["status" => "error", "message" => "Invalid URL"]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "URL parameter missing"]);
}