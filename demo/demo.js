'use strict';
let createSimpleWebServer = require('../lib/server.js');
let createRouter = require('../lib/router');
let renderJSON = require('../lib/renderers.js').renderJSON;
let config = require('./config.js');


let router = createRouter();

router.addRoute('/api', renderJSON, function(request) {
  return {page: 'API Root'};
});
router.addRoute('/api/hello/{name}', renderJSON, function(request) {
  return {page: 'Hello Endpoint', message: 'Hello, ' + request.vars.name};
});


let webServer = createSimpleWebServer(router);
webServer.listen(config.port);
