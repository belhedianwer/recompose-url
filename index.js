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
   * @return {Object} 
   * 
   *  IN e.g., function ('domain.com', false) | function ('www.domain.com', true) | function ('http://domain.com, false')
   *  
   *  OUT e.g.,
   *  { 
   *    { originUrl: 'http://domain.com' },
   *    { withHttpWww: 'http://www.domain.com' },
   *    { withHttpsWww: 'https://www.domain.com' },
   *    { withHttp: 'http://domain.com' },
   *    { withHttps: 'https://domain.com' } 
   *  }
   * 
   */
  setUrls: function (_url, callRequest = false, callback) {
    var self = this,
        urls = {};

    if (!self.validURL(_url)) {
      var error = {code: 10, status: 'ko', message: 'setUrls function: Url undefined! | Url value: ' + _url};
      return callback(error, urls);
    }

    self.setProtocol(_url, callRequest, function (err, result) {
      _url = result;

      var parts = url.parse(_url);

      urls = _.extend(urls, {originUrl: parts.protocol + '//' + parts.host});

      if (!self.hasWww(_url)) {
        urls = _.extend(urls, {withHttpWww: self.httpProtocol + 'www.' + parts.host});
        urls = _.extend(urls, {withHttpsWww: self.httpsProtocol + 'www.' + parts.host});
        urls = _.extend(urls, {withHttp: self.httpProtocol + parts.host});
        urls = _.extend(urls, {withHttps: self.httpsProtocol + parts.host});
      } else {
        urls = _.extend(urls, {withHttpWww: self.httpProtocol + parts.host});
        urls = _.extend(urls, {withHttpsWww: self.httpsProtocol + parts.host});
        urls = _.extend(urls, {withHttp: self.httpProtocol + parts.host.replace(/^www\./, '')});
        urls = _.extend(urls, {withHttps: self.httpsProtocol + parts.host.replace(/^www\./, '')});
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
    var self = this;

    if (!self.validURL(_url)) {
      var error = {code: 11, status: 'ko', message: 'setProtocol function: Url undefined! | Url value: ' + _url};
      return callback(error, _url);
    }

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
      } else
        callback(null, self.httpProtocol + _url);
    } else
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
    var self = this;

    if (!self.validURL(_url))
      return false;

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
    var self = this;

    if (!self.validURL(_url))
      return false;

    _url = _url.trim();

    if (_url.indexOf("www") == -1)
      return false;
    return true;
  },
  /**
   * Check if url is valid
   *
   * @param {string} _url
   * @return {boolean} 
   * 
   *  IN e.g., function ('www.domain.com', true) | function ('www.domain.', false)
   *  
   *  OUT e.g.,  true | false
   */
  validURL: function (_url) {
    var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    return !!pattern.test(_url);
  }
};