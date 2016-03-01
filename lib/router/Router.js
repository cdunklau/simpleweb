'use strict';
let Route = require('./Route.js');
let RouteTree = require('./RouteTree.js');
let RouteMatch = require('./RouteMatch.js');
let parseRoutePattern = require('./utils.js').parseRoutePattern;

/**
 * Maps routes to views
 */
let Router = function() {
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
  let route = new Route(name, routePattern, viewFunction);
  this.routes.addRoute(route);
};

/**
 * Return the route match for the given URL path, or undefined if no
 * match was found.
 *
 * @param {string} path - The URL path
 */
Router.prototype.getMatch = function getMatch(path) {
  let pathComponentStack = parseRoutePattern(path).reverse();
  let node = this.routes.resolvePath(pathComponentStack);
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
