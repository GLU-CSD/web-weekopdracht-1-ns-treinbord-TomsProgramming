<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json');

function getDepartures($stationCode) {
    $apiKey = '2ebfd784a79a4470be6818c17d8ff046';

    $url = "https://gateway.apiportal.ns.nl/reisinformatie-api/api/v2/departures?station=" . urlencode($stationCode);

    $ch = curl_init($url);

    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Ocp-Apim-Subscription-Key: ' . $apiKey,
    ]);

    $response = curl_exec($ch);

    if (curl_errno($ch)) {
        throw new Exception('Fout bij het ophalen van data: ' . curl_error($ch));
    }

    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    if ($httpCode !== 200) {
        throw new Exception("Fout bij ophalen data: HTTP-code $httpCode");
    }

    curl_close($ch);

    $data = json_decode($response, true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception('Fout bij het decoderen van JSON: ' . json_last_error_msg());
    }

    return $data;
}

$raw_post_data = file_get_contents('php://input');
$post_data = json_decode($raw_post_data, true);

if(isset($post_data['function'])){
    $function = $post_data['function'];

    if($function == 'getDepartures'){
        if(isset($post_data['stationCode'])){
            $stationCode = $post_data['stationCode'];
            $departures = getDepartures($stationCode);
            echo json_encode($departures);
        } else {
            echo json_encode(['error' => 'Station code is missing']);
        }
    } else {
        echo json_encode(['error' => 'Function not found']);
    }
}
?>