'use strict';
/**
 * Simple object that links together a route pattern with a view function
 *
 * @param {string} name - The route's unique name
 * @param {string} routePattern - The pattern for URL matching
 * @param {Function} viewFunction -
 * The function that processes the incoming request
 */
let Route = function(name, routePattern, viewFunction) {
  this.name = name;
  this.pattern = routePattern;
  this.view = viewFunction;
};

module.exports = Route;
