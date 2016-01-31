#!/usr/bin/env node

var zmq = require('zmq'),
  sock = zmq.socket('pub'),
  server = require('pinoccio-server');


var opts = {
  apiHost: process.env.PINOCCIO_API || 'pool.base.pinocc.io',
  apiPort: process.env.PINOCCIO_PORT || 22756
};
var zmqAddress = process.env.ZMQ_ADDRESS || 'tcp://127.0.0.1:3000';
sock.bindSync(zmqAddress);
console.log('Publisher bound to :' + zmqAddress);
server(opts, function(troop) {
  troop.on('data', function(ev) {
    console.log(troop.token + '>', JSON.stringify(ev));
    sock.send(['sensor', JSON.stringify({
      "sensor": "temperature",
      "type":"pinoccio",
      "data": ev
    })]);
  });

}).on('listening', function() {
  console.log('local pinoccio server listening on ', this.address());
});
