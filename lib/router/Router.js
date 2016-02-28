var Route = require('./Route.js');
var RouteTree = require('./RouteTree.js');

/**
 * Maps routes to views
 */
var Router = function() {
  this._routes = new RouteTree();
};

/**
 * Add a route and corresponding view function to the router.
 *
 * @param {String} routePattern -
 * Route pattern with optional replacement markers
 * @param {Function} -
 * View function, called with the... TODO
 */
Router.prototype.addRoute = function addRoute(name, routePattern, viewFunction) {
  var route = Route(name, routePattern, viewFunction);
  this._routes.add(route);
};

/**
 * Search for a route that matches the pattern
 */
Router.prototype.findRoute = function findRoute(path) {
  // TODO
};

module.exports = Router;
