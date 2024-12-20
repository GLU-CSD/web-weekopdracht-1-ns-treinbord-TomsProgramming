<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Weekopdracht - NS-Treinbord</title>
    <link rel="stylesheet" href="assets/css/style.css?v=<?php echo filemtime('assets/css/style.css') ?>">
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@700&display=swap" rel="stylesheet">
</head>
<body>
    <div id="container">
        <div id="left">
            <div class="analog-clock">
                <div class="hour-hand" id="hour"> </div>
                <div class="min-hand" id="minute"> </div>
                <div class="second-hand" id="second"> </div>
            </div>
        </div>
        <div id="middle">
            <div id="board">
                <img src="assets/img/ns_logo.png" alt="NS-logo">
                <p id="categoryName">Laden</p>
                <p id="departureMinutes"><span>0</span>Laden</p>
                <p id="direction">Laden</p>
                <p id="routeStations">Via: <span>Laden</span></p>
            </div>
            <div id="bottom">
                <p></p>
            </div>
        </div>
        <div id="right">
            <div id="track">
                <p id="spoor">spoor</p>
                <p id="number">18</p>
                <p id="letter">a</p>
            </div>
            <div id="blueBlock"></div>
        </div>
    </div>
</body>

<script src="assets/js/script.js?v=<?php echo filemtime('assets/js/script.js') ?>"></script>
</html>