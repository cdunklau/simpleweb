/**
 * Parse a route pattern into components and return the array.
 */
var parseRoutePattern = function parseRoutePattern(routePattern) {
  // Ensure pattern starts with a slash
  if (routePattern.length === 0 || routePattern[0] !== '/') {
    routePattern = '/' + routePattern;
  }
  var parsed = [];
  var rawParts = routePattern.split('/');
  rawParts.forEach(function(part, index, arr) {
    // ignore empty (skip components from leading/doubled/trailing slashes)
    if (part) {
      parsed.push(part);
    }
  });
  return parsed;
};

exports.parseRoutePattern = parseRoutePattern;
