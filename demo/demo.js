'use strict';
let SimpleWebServer = require('../lib/server.js');
let Router = require('../lib/router');
let renderJSON = require('../lib/renderers.js').renderJSON;
let config = require('./config.js');


let router = new Router();

router.addRoute('/api', renderJSON, function(request) {
  return {page: 'API Root'};
});
router.addRoute('/api/hello/{name}', renderJSON, function(request) {
  return {page: 'Hello Endpoint', message: 'Hello, ' + request.vars.name};
});


let webServer = new SimpleWebServer(router);
webServer.listen(config.port);
