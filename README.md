# pinboard

pinboard.in client

## Backend configuration

    $ cp conf.ini.template conf.ini

### Cache

The back-end needs a directory where to store its cache files.
    
    $ mkdir .cache
    $ chmod a+w .cache/
    
Configure the cache path in `backend/conf.ini`.    

## Frontend configuration

Set the backend base URL in `.env.development` and `.env.production`. 
