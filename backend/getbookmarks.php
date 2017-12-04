<?php

    header('Content-type: application/json');
    header('Cache-Control: no-cache');

    include 'lib/pinboard-api.php';

    $conf = parse_ini_file("conf.ini");

    $t = $_GET["tags"];
    $tags = empty($t) ? null : explode(',', $t);

    $limit = $_GET["limit"];
    if (!is_numeric($limit)) $limit = empty($tags) ? 100 : 1000;

    $force_refresh = $_GET["refresh"] == '1';

    $cache_entry = empty($tags) ? '_' : preg_replace("/[^A-Za-z0-9_]/", '', trim(implode('_', $tags)));
    $cache_file = $conf['cache'].'/'.$cache_entry;

    $refresh_cache = false;
    $pins = null;

    if (!$force_refresh) {
        if (file_exists($cache_file)) {
            $pins = unserialize(file_get_contents($cache_file));
            $refresh_cache = time() > (filemtime($cache_file) + intval($conf['cache_ttl']));
        }
    }

    if (empty($pins) || $refresh_cache) {
        $pinboard = new PinboardAPI($conf['username'], $conf['password'], 10, 30, $conf['proxy']);
        $pins = $pinboard->get_all($limit, null, $tags);
        file_put_contents($cache_file, serialize($pins));
    }

    print(json_encode($pins));

/*
    foreach ($pins as $pin) {
        //echo "{$pin->title} [{$pin->url}]<br />";
        $t = print_r($pin->tags, true);
        echo "{$pin->title} [{$t}]<br />";
    }
*/

