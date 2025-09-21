<?php
// shorten.php
include 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $long_url = filter_var($_POST['long_url'], FILTER_SANITIZE_URL);
    
    if (!filter_var($long_url, FILTER_VALIDATE_URL)) {
        http_response_code(400);
        die(json_encode(['error' => 'Invalid URL']));
    }

    $short_code = generateShortCode();
    
    try {
        $stmt = $conn->prepare("INSERT INTO urls (long_url, short_code) VALUES (?, ?)");
        $stmt->execute([$long_url, $short_code]);
        
        $short_url = "http://urlshorter.wuaze.com/$short_code";
        echo json_encode(['short_url' => $short_url]);
    } catch (PDOException $e) {
        http_response_code(500);
        die(json_encode(['error' => 'Error shortening URL']));
    }
}

function generateShortCode($length = 6) {
    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $code = '';
    for ($i = 0; $i < $length; $i++) {
        $code .= $characters[rand(0, strlen($characters) - 1)];
    }
    return $code;
}
?>