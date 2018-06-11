const http = require('http');
const url = require('url');

const Moment = require('moment');
const SystemInformation = require('systeminformation');

let requestCount = 0;
let throughputData = {
  'last_date': Moment.utc(),
  'tx_sec': 0,
  'rx_sec': 0,
  'total_sec': 0
};
let defaultNic = null;

SystemInformation.networkInterfaceDefault()
  .then((nic) => {

    defaultNic = nic;

    // run network stats once (to initialize tx/rx_sec start values)
    return SystemInformation.networkStats(defaultNic)
      .then(() => {

        // begin interval to grab throughput data
        setInterval(() => {

          SystemInformation.networkStats(defaultNic)
            .then((stats) => {

              throughputData['last_date'] = Moment.utc();
              throughputData['tx_sec'] = stats.tx_sec;
              throughputData['rx_sec'] = stats.rx_sec;
              throughputData['total_sec'] = (stats.rx_sec + stats.tx_sec);

            });

        }, 1000);

      })
  });

let webServer = http.createServer((req, res) => {

  console.log(`Requested! ${req.url}`);
  let urlObj = url.parse(req.url);

  if (urlObj.pathname === '/health') {
    res.statusCode = 200;
    res.end('all ok');
    return;
  }

  if (urlObj.pathname === '/metrics/requestCount') {
    res.statusCode = 200;
    res.end(`{"metric": ${requestCount}`);
    return;
  }

  if (urlObj.pathname === '/metrics/networkThroughput') {
    res.statusCode = 200;
    res.end(`{"metric": ${throughputData.total_sec}`);
    return;
  }

  // ignore health and metric queries from request count
  requestCount++;

  // all else 404
  res.statusCode = 404;
  res.end();

});

webServer.listen(8080, () => {
  console.log('Webserver started');
});
