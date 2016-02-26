var http = require('http');
var url = require('url');

/**
 * A simple web server implementation.
 *
 * @param {Router} router - the router instance used for this server
 */
var SimpleWebServer = function SimpleWebServer(router) {
  this.router = router;
  this.server = undefined;
};

/**
 * Start the web server on port.
 *
 * @param {Number} port - the listening port (integer)
 */
SimpleWebServer.prototype.listen = function listen(port) {
  this.server = http.createServer(this.handleRequest);
  this.server.listen(port);
};

/**
 * Handle the raw http.IncomingMessage and http.ServerResponse objects.
 *
 * @param {http.IncomingMessage} bareRequest - the http server's request
 * @param {http.ServerResponse} bareResponse - the http server's response
 */
SimpleWebServer.prototype._dispatchRequest =
        function _dispatchRequest(bareRequest, bareResponse) {
  var parsedUrl = url.parse(bareRequest.url);
  route = router.findRoute(parsedUrl.pathname);
};

module.exports = SimpleWebServer;

// for reference, remove this
var handleRequest = function(request, response) {
  response.end('It Works!! Path Hit: ' + request.url);
};


var server = http.createServer(handleRequest);

server.listen(config.port, function() {
  console.log('Server listening on http://localhost:%s', config.port);
});
