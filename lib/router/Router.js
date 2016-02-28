var Route = require('./Route.js');
var RouteTree = require('./RouteTree.js');
var parseRoutePattern = require('./utils.js').parseRoutePattern;

/**
 * Maps routes to views
 */
var Router = function() {
  this.routes = new RouteTree();
};

/**
 * Add a route and corresponding view function to the router.
 *
 * @param {String} routePattern -
 * Route pattern with optional replacement markers
 * @param {Function} -
 * View function, called with the... TODO define the view API
 */
Router.prototype.addRoute = function addRoute(
        name, routePattern, viewFunction
) {
  var route = Route(name, routePattern, viewFunction);
  this.routes.add(route);
};

/**
 * Search for a route that matches the URL path
 */
Router.prototype.findMatchingRoute = function findMatchingRoute(path) {
  var pathComponentStack = parseRoutePattern(path).reverse();
  throw new Error('not finished');
};

module.exports = Router;
