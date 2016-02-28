/**
 * Simple object that links together a route pattern with a view function
 */
var Route = function Route(name, routePattern, viewFunction) {
  this.name = name;
  this.pattern = routePattern;
  this.view = viewFunction;
};

module.exports = Route;
