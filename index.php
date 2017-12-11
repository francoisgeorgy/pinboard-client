<!DOCTYPE HTML>
<html>
<head>
    <title>my board</title>
    <meta charset="UTF-8" />
</head>
<body>
<?php

    //stream_context_set_default(['http'=>['proxy'=>'localhost:8081']]);

    include 'lib/pinboard-api.php';

    $pinboard = new PinboardAPI('', '');

    $pins = $pinboard->get_all(100, null, ['guitar', 'theory']);

    //print_r($pins);

    foreach ($pins as $pin) {
        echo "{$pin->title} [{$pin->url}]<br />";
    }

?>
</body>
</html>

