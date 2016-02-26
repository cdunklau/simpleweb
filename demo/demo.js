var SimpleWebServer = require('../lib/server.js');
var Router = require('../lib/router.js');
var renderJSON = require('../lib/renderers.js').renderJSON;
var config = require('./config.js');


var router = new Router();

router.addRoute('/api', renderJSON, function(request) {
  return {page: 'API Root'};
});
router.addRoute('/api/hello/{name}', renderJSON, function(request) {
  return {page: 'Hello Endpoint', message: 'Hello, ' + request.vars.name};
});


var webServer = new SimpleWebServer(router);
webServer.listen(config.port);
