var http = require('http');
var url = require('url');

/**
 * A simple web server implementation.
 *
 * @param {Router} router - the router instance used for this server
 */
var SimpleWebServer = function SimpleWebServer(router) {
  this.router = router;
  this.server = null;
};

/**
 * Start the web server on port.
 *
 * @param {number} port - the listening port (integer)
 */
SimpleWebServer.prototype.listen = function listen(port) {
  this.server = http.createServer(this.dispatchRequest);
  this.server.listen(port, function() {
    console.log('Listening on port %s', port);
  });
};

/**
 * Handle the raw http.IncomingMessage and http.ServerResponse objects.
 *
 * @param {http.IncomingMessage} bareRequest - the http server's request
 * @param {http.ServerResponse} bareResponse - the http server's response
 */
SimpleWebServer.prototype.dispatchRequest = function dispatchRequest(
        bareRequest, bareResponse
) {
  var parsedUrl = url.parse(bareRequest.url);
  var route = this.router.findRouteMatching(parsedUrl.pathname);
};

module.exports = SimpleWebServer;
