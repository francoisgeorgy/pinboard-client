<?php

    header('Content-type: application/json');
    header('Cache-Control: no-cache');
    header('Access-Control-Allow-Origin: *');   //TODO: restrict access to front-end only

    include 'lib/pinboard-api.php';

    $conf = parse_ini_file("conf.ini");

    $force_refresh = isset($_GET['refresh']) ? $_GET['refresh'] == '1' : false;

    $cache_entry = '_all-tags';
    $cache_file = $conf['cache'].'/'.$cache_entry;

    $refresh_cache = false;
    $tags = null;

    if (!$force_refresh) {
        if (file_exists($cache_file)) {
            $refresh_cache = time() > (filemtime($cache_file) + intval($conf['cache_ttl']));
            if (!$refresh_cache) {
                $tags = unserialize(file_get_contents($cache_file));
            }
        }
    }

    if (empty($tags) || $refresh_cache) {
        $pinboard = new PinboardAPI($conf['username'], $conf['password'], 10, 30, $conf['proxy']);
        $tags = $pinboard->get_tags();
        file_put_contents($cache_file, serialize($tags));
    }

    print(json_encode($tags));

