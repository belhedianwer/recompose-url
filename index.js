var url = require('url');
var request = require('request');

module.exports = {
  httpProtocol: 'http://',
  httpsProtocol: 'https://',

  /**
   * Parse the url and return urls with or without protocol and with or without www.
   *
   * @param {string} _url
   * @param {boolean} callRequest (optional) | Force verification of the protocol by calling the url
   * @return {Array} 
   * 
   *  IN e.g., function ('domain.com', false) | function ('www.domain.com', true) | function ('http://domain.com, false')
   *  
   *  OUT e.g.,
   *  [ { originUrl: 'http://domain.com' },
   *  { withHttpWww: 'http://www.domain.com' },
   *  { withHttpsWww: 'https://www.domain.com' },
   *  { withHttp: 'http://domain.com' },
   *  { withHttps: 'https://domain.com' } ]
   * 
   */
  setUrls: function (_url, callRequest = false, callback) {
    var self = this,
        urls = [];

    self.setProtocol(_url, callRequest, function (err, result) {
      _url = result;

      var parts = url.parse(_url);

      if (parts.host && parts.href) {
        urls.push({originUrl: parts.protocol + '//' + parts.host});

        if (!self.hasWww(_url)) {
          urls.push({withHttpWww: self.httpProtocol + 'www.' + parts.host});
          urls.push({withHttpsWww: self.httpsProtocol + 'www.' + parts.host});
          urls.push({withHttp: self.httpProtocol + parts.host});
          urls.push({withHttps: self.httpsProtocol + parts.host});
        }
        else {
          urls.push({withHttpWww: self.httpProtocol + parts.host});
          urls.push({withHttpsWww: self.httpsProtocol + parts.host});
          urls.push({withHttp: self.httpProtocol + parts.host.replace(/^www\./, '')});
          urls.push({withHttps: self.httpsProtocol + parts.host.replace(/^www\./, '')});
        }
      }
      callback(null, urls);
    });
  },

  /**
   * Define the url protocol if it does not exist
   *
   * @param {string} _url
   * @param {boolean} callRequest (optional) | Force verification of the protocol by calling the url
   * @return {string} 
   * 
   *  IN e.g., function ('domain.com', false) | function ('www.domain.com', true) | function ('http://domain.com, false')
   *  
   *  OUT e.g.,  http://domain.com | https://domain.com | http://www.domain.com | https://www.domain.com
   * 
   */
  setProtocol: function (_url, callRequest = false, callback) {
    var self = this,
        _url = _url.trim();
    // Check if https or http
    if (!self.hasProtocol(_url)) {

      if (callRequest) {
        draftUrl = self.httpsProtocol + _url;
        request(draftUrl, function (error, response, body) {
          if (!error && response.statusCode == 200)
            _url = draftUrl;
          else
            _url = self.httpProtocol + _url;
          callback(null, _url);
        });
      }
      else
        callback(null, self.httpProtocol + _url);
    }
    else
      callback(null, _url);
  },

  /**
   * Check if https or http exists
   *
   * @param {string} _url
   * @return {boolean} 
   * 
   *  IN e.g., function ('www.domain.com', true) | function ('http://domain.com')
   *  
   *  OUT e.g.,  false | true
   */
  hasProtocol: function (_url) {
    var self = this,
        _url = _url.trim();

    if (_url.indexOf(self.httpProtocol) == -1 && _url.indexOf(self.httpsProtocol) == -1)
      return false;
    return true;
  },

  /**
   * Check if www exists
   *
   * @param {string} _url
   * @return {boolean} 
   * 
   *  IN e.g., function ('www.domain.com', true) | function ('http://domain.com')
   *  
   *  OUT e.g.,  true | false
   */
  hasWww: function (_url) {
    _url = _url.trim();

    if (_url.indexOf("www") == -1)
      return false;
    return true;
  }
};