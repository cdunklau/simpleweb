'use strict';
/**
 * Simple object that links a route together with any matched replacement
 * fields.
 *
 * @param {Route} route - the route matched in the search
 * @param {Object} fields - the values matched by the replacement markers
 */
let RouteMatch = function RouteMatch(route, fields) {
  this.route = route;
  this.fields = fields;
};

module.exports = RouteMatch;
