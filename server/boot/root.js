'use strict';

var path = require('path');
var seed = require(path.resolve(__dirname, '../../seed/seed'));

module.exports = function(server) {
  // Install a `/` route that returns server status
  var router = server.loopback.Router();
  router.get('/', server.loopback.status());
  server.use(router);

  seed(server, 'mysqlDs');
};
