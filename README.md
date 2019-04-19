# recompose-url

This nodejs module allows you to parse the url and return urls with or without protocol and with or without www.

How to use:
-----------

        var recomposeUrl = require('recompose-url');
        recomposeUrl.setUrls('domain.com', true, function (err, result) { 
          console.log('Urls:', result);
        });

        recomposeUrl.setUrls('http://www.domain.com/path?param=1', true, function (err, result) { 
          console.log('Urls:', result);
        });


Result e.g.,
------------

{ 
  { originUrl: 'http://www.domain.com/path?param=1' },
  { withHttpWwwHost: 'http://www.domain.com' },
  { withHttpsWwwHost: 'https://www.domain.com' },
  { withHttpHost: 'http://domain.com' },
  { withHttpsHost: 'https://domain.com' } 
  { withHttpWww: 'http://www.domain.com/path?param=1' },
  { withHttpsWww: 'https://www.domain.com/path?param=1' },
  { withHttp: 'http://domain.com/path?param=1' },
  { withHttps: 'https://domain.com/path?param=1' } 
}

