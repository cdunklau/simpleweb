'use strict';
/**
 * Parse a route pattern into components and return the array.
 *
 * @param {string} routePattern - The pattern for URL matching
 */
let parseRoutePattern = function parseRoutePattern(routePattern) {
  // Ensure pattern starts with a slash
  if (routePattern.length === 0 || routePattern[0] !== '/') {
    routePattern = '/' + routePattern;
  }
  let parsed = [];
  let rawParts = routePattern.split('/');
  rawParts.forEach(function(part, index, arr) {
    // Ignore empty (skip components from leading/doubled/trailing slashes)
    if (part) {
      parsed.push(part);
    }
  });
  return parsed;
};

exports.parseRoutePattern = parseRoutePattern;
