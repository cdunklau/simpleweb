'use strict';
let http = require('http');
let url = require('url');

/**
 * A simple web server implementation.
 *
 * @param {Router} router - the router instance used for this server
 */
function createServer(router) {
  return {
    router: router,
    server: null,

    /**
     * Start the web server on port.
     *
     * @param {number} port - the listening port (integer)
     */
    listen: function(port) {
      this.server = http.createServer(this.dispatchRequest);
      this.server.listen(port, function() {
        console.log('Listening on port %s', port);
      });
    },

    /**
     * Handle the raw http.IncomingMessage and http.ServerResponse objects.
     *
     * @param {http.IncomingMessage} bareRequest - the http server's request
     * @param {http.ServerResponse} bareResponse - the http server's response
     */
    dispatchRequest: function(bareRequest, bareResponse) {
      let parsedUrl = url.parse(bareRequest.url);
      let route = this.router.findRouteMatching(parsedUrl.pathname);
    },
  };
}


module.exports = createServer;
