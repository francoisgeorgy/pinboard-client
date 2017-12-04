# pinboard

pinboard.in client

# Anonymous access

Ref: https://pinboard.in/howto/

    http://feeds.pinboard.in/json/u:username/t:tag1/t:tag2/t:tag3/

Exemple:

    https://feeds.pinboard.in/json/u:fgeorgy/t:guitar/t:theory

# With React

__No easyly doable in react because of CORS protection.__

Selected lib for doing ajax requests: fetch

Doc:
- https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
- https://developers.google.com/web/updates/2015/03/introduction-to-fetch?hl=en
- https://reactjs.org/docs/faq-ajax.html#how-can-i-make-an-ajax-call
- https://www.andrewhfarmer.com/react-ajax-best-practices/
- https://davidwalsh.name/fetch



# With PHP

Access done by the back-end, no CORS limitation.

    https://github.com/kijin/pinboard-api    
    sudo apt-get install php5-curl
    
## Cache
    
    $ mkdir .cache
    $ chmod a+w .cache/
