<?php
// redirect.php
include 'db.php';

if (isset($_GET['code'])) {
    $short_code = $_GET['code'];
    
    try {
        $stmt = $conn->prepare("SELECT long_url FROM urls WHERE short_code = ?");
        $stmt->execute([$short_code]);
        $result = $stmt->fetch();
        
        if ($result) {
            header("Location: " . $result['long_url']);
            exit();
        } else {
            http_response_code(404);
            die("URL not found");
        }
    } catch (PDOException $e) {
        http_response_code(500);
        die("Database error");
    }
} else {
    http_response_code(400);
    die("Invalid request");
}
?>