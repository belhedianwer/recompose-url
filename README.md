# recompose-url

This nodejs module allows you to parse the url and return urls with or without protocol and with or without www.

How to use:
-----------

        var recomposeUrl = require('recompose-url');
        recomposeUrl.setUrls('domain.com', true, function (err, result) { 
          console.log('Urls:', result);
        });

        recomposeUrl.setUrls('http://www.domain.com', true, function (err, result) { 
          console.log('Urls:', result);
        });


Result e.g.,
------------

{ 
  { originUrl: 'http://domain.com' },
  { withHttpWww: 'http://www.domain.com' },
  { withHttpsWww: 'https://www.domain.com' },
  { withHttp: 'http://domain.com' },
  { withHttps: 'https://domain.com' } 
}

