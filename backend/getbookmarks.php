<?php

    header('Content-type: application/json');
    header('Cache-Control: no-cache');
    header('Access-Control-Allow-Origin: *');   //TODO: restrict access to front-end only

    include 'lib/pinboard-api.php';

    $conf = parse_ini_file("conf.ini");

    $t = isset($_GET['tags']) ? $_GET['tags'] : null;
    $tags = empty($t) ? null : explode(',', $t);

    $limit = isset($_GET['limit']) ? $_GET['limit'] : null;
    if (!is_numeric($limit)) $limit = empty($tags) ? 1000 : 1000;

    $force_refresh = isset($_GET['refresh']) ? $_GET['refresh'] == '1' : false;

    if (empty($tags)) {
        $cache_entry = '_';
    } else {
        sort($tags);
        $cache_entry = preg_replace("/[^A-Za-z0-9_]/", '', trim(implode('_', $tags)));
    }
    $cache_file = $conf['cache'].'/'.$cache_entry;

    $refresh_cache = false;
    $pins = null;

    if (!$force_refresh) {
        if (file_exists($cache_file)) {
            $refresh_cache = time() > (filemtime($cache_file) + intval($conf['cache_ttl']));
            if (!$refresh_cache) {
                $pins = unserialize(file_get_contents($cache_file));
            }
        }
    }

    if (empty($pins) || $refresh_cache) {
        $pinboard = new PinboardAPI($conf['username'], $conf['password'], 10, 30, $conf['proxy']);
        $pins = $pinboard->get_all($limit, null, $tags);

        // sort by title
        usort($pins, function ($a, $b) {
            return strcmp(strtolower($a->title), strtolower($b->title));
        });

        file_put_contents($cache_file, serialize($pins));
    }

    print(json_encode($pins));

