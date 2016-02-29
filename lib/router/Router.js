var Route = require('./Route.js');
var RouteTree = require('./RouteTree.js');
var RouteMatch = require('./RouteMatch.js');
var parseRoutePattern = require('./utils.js').parseRoutePattern;

/**
 * Maps routes to views
 */
var Router = function() {
  this.routes = new RouteTree();
};

/**
 * Add a route for the view function to the router.
 *
 * @param {string} name -
 * The unique name of the route
 * @param {string} routePattern -
 * Route pattern with optional replacement markers
 * @param {Function} -
 * View function, will be called with the simpleweb.models.Request object
 */
Router.prototype.addRoute = function addRoute(
        name, routePattern, viewFunction
) {
  var route = new Route(name, routePattern, viewFunction);
  this.routes.addRoute(route);
};

/**
 * Return the route match for the given URL path, or undefined if no
 * match was found.
 *
 * @param {string} path - The URL path
 */
Router.prototype.getMatch = function getMatch(path) {
  var pathComponentStack = parseRoutePattern(path).reverse();
  var node = this.routes.resolvePath(pathComponentStack);
  if (!pathComponentStack.length && node.route !== null) {
    return new RouteMatch(node.route, {});
  }
};

/**
 * Retrieve a route based on a name, or undefined if no route exists for
 * that name.
 *
 * @param {string} routeName - The name of the route to look up
 */
Router.prototype.getRouteByName = function getRouteByName(routeName) {
  return this.routes.routesByNames.get(routeName);
};

module.exports = Router;
