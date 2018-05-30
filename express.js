const http = require('http');
const url = require('url');

const Express = require('express');

let app = new Express();

app.get('/health', (req, res) => {
  console.log('Health request');
  res.send('all ok');
});

let webServer = http.createServer(app);

webServer.listen(8080, () => {
  console.log('Webserver started');
});
