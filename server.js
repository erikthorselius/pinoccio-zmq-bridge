#!/usr/bin/env node

var server = require('pinoccio-server');

// The server will try to forward everything to Pinoccio's
// production servers. This can be nice because it gives you
// event persistence, and you can still use HQ.
// If you want to send it somewhere else, you can pass in
// the environment variables.
var opts = {
  apiHost: process.env.PINOCCIO_API || 'pool.base.pinocc.io',
  apiPort: process.env.PINOCCIO_PORT || 22756
};

server(opts, function(troop){    
  
  // Only one Troop will be connected to the server.
  // `troop` is a stream you can read from, and write to.

  // Log all the data streaming in from the Troop
  troop.on('data', function(ev){
    console.log(troop.token+'>', JSON.stringify(ev));
  });

}).on('listening', function(){
  console.log('local pinoccio server listening on ', this.address());
});
