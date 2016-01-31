#!/usr/bin/env node
var zmq = require('zmq'),
  sock = zmq.socket('pub'),
  server = require('pinoccio-server');

var opts = {
  apiHost: process.env.PINOCCIO_API || 'pool.base.pinocc.io',
  apiPort: process.env.PINOCCIO_PORT || 22756
};
var zmqAddress = process.env.ZMQ_ADDRESS || 'tcp://127.0.0.1:3000';
sock.connect(zmqAddress);
console.log('Publisher bound to : ' + zmqAddress);

function createMsg(data) {
  var msg = {
    "sensor": "temperature",
    "type": "pinoccio",
    "data": data
  }
  switch (data.id) {
    case 2:
      msg.name = "Study"
      break;
    default:
      msg.name = "Greenhouse"
  }
  return msg;
}

server(opts, function(troop) {
  troop.on('data', function(ev) {
    console.log(troop.token + '>', JSON.stringify(ev));
    sock.send(['sensor', JSON.stringify(createMsg(ev))]);
  });

}).on('listening', function() {
  console.log('local pinoccio server listening on ', this.address());
});
