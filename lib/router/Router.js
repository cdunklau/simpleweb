'use strict';
let createRoute = require('./Route.js');
let createRouteTree = require('./RouteTree.js');
let createRouteMatch = require('./RouteMatch.js');
let parseRoutePattern = require('./utils.js').parseRoutePattern;


/**
 * Create an object that maps routes to views
 */
function createRouter() {
  return {
    routes: createRouteTree(),

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
    addRoute: function(name, routePattern, viewFunction) {
      let route = createRoute(name, routePattern, viewFunction);
      this.routes.addRoute(route);
    },

    /**
     * Return the route match for the given URL path, or undefined if no
     * match was found.
     *
     * @param {string} path - The URL path
     */
    getMatch: function(path) {
      let pathComponentStack = parseRoutePattern(path).reverse();
      let node = this.routes.resolvePath(pathComponentStack);
      if (!pathComponentStack.length && node.route !== null) {
        return createRouteMatch(node.route, {});
      }
    },

    /**
     * Retrieve a route based on a name, or undefined if no route exists for
     * that name.
     *
     * @param {string} routeName - The name of the route to look up
     */
    getRouteByName: function(routeName) {
      return this.routes.routesByNames.get(routeName);
    },
  };
}

module.exports = createRouter;
