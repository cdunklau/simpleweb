/**
 * Represents a node in the route tree.
 *
 * @property {String} pathComponent -
 * the component of the path represented, or null if this is the root node.
 * @property {RouteTreeNode} parent -
 * parent of this node, or null if this is the root node.
 * @property {Map} children - maps child path component -> child node
 * @property {Route} route -
 * the route at this node, or null if no route is assigned here.
 */
var RouteTreeNode = function RouteTreeNode(pathComponent, parent) {
  this.pathComponent = pathComponent;
  this.parent = parent;
  this.children = new Map();
  this.route = null;
};

module.exports = RouteTreeNode;
