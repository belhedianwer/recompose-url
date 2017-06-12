var recomposeUrl = require('./index.js');

// hasProtocol function
var hasProtocol = recomposeUrl.hasProtocol('domain.com');
console.log('hasProtocol Result:', hasProtocol);

// hasWww function
var hasWww = recomposeUrl.hasWww('https://www.domain.com');
console.log('hasWww Result:', hasWww);

// setUrls function
recomposeUrl.setUrls('domain.com', true, function (err, result) {
  console.log('setUrls Result:', result);
});

// setUrls function
recomposeUrl.setUrls('http://www.domain.com', true, function (err, result) {
  console.log('setUrls Result:', result);
});

// setProtocol function
recomposeUrl.setProtocol('www.domain.com', true, function (err, result) {
  console.log('setProtocol Result:', result);
});