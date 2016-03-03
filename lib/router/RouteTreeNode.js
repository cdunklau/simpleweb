'use strict';
/**
 * Create an object that represents a node in the route tree.
 *
 * @param {string} pathComponent -
 * the component of the path represented, or null if this is the root node.
 * @param {RouteTreeNode} parent -
 * parent of this node, or null if this is the root node.
 *
 * @property {Map} children - maps child path component -> child node
 * @property {Route} route -
 * the route at this node, or null if no route is assigned here.
 */
function createRouteTreeNode(pathComponent, parent) {
  return {
    pathComponent: pathComponent,
    parent: parent,
    children: new Map(),
    route: null,
  };
}

module.exports = createRouteTreeNode;
