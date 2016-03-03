'use strict';
/**
 * Create a simple object that links together a route pattern with a view
 * function.
 *
 * @param {string} name - The route's unique name
 * @param {string} routePattern - The pattern for URL matching
 * @param {Function} viewFunction -
 * The function that processes the incoming request
 */
function createRoute(name, routePattern, viewFunction) {
  return {
    name: name,
    pattern: routePattern,
    view: viewFunction,
  };
}

module.exports = createRoute;
