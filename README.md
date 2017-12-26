# pinboard.in front-end

This application allows you to quickly browse your _pinboard.in_ bookmarks. 
All data are cached after being retrieved from the pinboard.in service. 
Once the data are in the cache, navigating your bookmarks is lightning fast.

## Backend configuration

The backend must be deployed in a web server supporting PHP5+ with the `json` extension enabled.

You need to create a `conf.ini` file containing your poinboard.in credentials and the cache configuration.
`conf.ini.template` is provided as a template for this. 

    $ cp conf.ini.template conf.ini

### Cache

The back-end needs a directory where to store its cache files.
    
    $ mkdir .cache
    $ chmod a+w .cache/
    
Configure the cache path in `conf.ini`.    

## Frontend configuration

Set the backend base URL in `.env.development` and `.env.production`. 
