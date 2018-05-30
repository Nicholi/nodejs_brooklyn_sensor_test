const http = require('http');
const url = require('url');

let webServer = http.createServer((req, res) => {

  console.log(`Requested! ${req.url}`);
  let urlObj = url.parse(req.url);

  if (urlObj.pathname === '/health') {
    res.statusCode = 200;
    res.end('all ok');
    return;
  }

  // all else 404
  res.statusCode = 404;
  res.end();

});

webServer.listen(8080, () => {
  console.log('Webserver started');
});
