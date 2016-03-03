'use strict';
/**
 * Create a simple object to link a route together with any matched
 * replacement fields.
 *
 * @param {Route} route - the route matched in the search
 * @param {Object} fields - the values matched by the replacement markers
 */
function createRouteMatch(route, fields) {
  return {
    route: route,
    fields: fields,
  };
}

module.exports = createRouteMatch;
