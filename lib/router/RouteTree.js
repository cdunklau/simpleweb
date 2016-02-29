var assert = require('assert');

var RouteTreeNode = require('./RouteTreeNode.js');
var parseRoutePattern = require('./utils.js').parseRoutePattern;

/**
 * Tree structure for route lookup.
 *
 * @property {RouteTreeNode} root - the node representing the root resource
 * @property {Map} names - maps route name to route object
 */
var RouteTree = function RouteTree() {
  this.root = new RouteTreeNode(null, null);
  this.routesByNames = new Map();
};

/**
 * Return a string with the full path of the node
 *
 * @param {RouteTreeNode} node - the node for which to get the path.
 */
RouteTree.prototype.getNodePath = function getNodePath(node) {
  var pathComponentStack = [];
  while (node.parent !== null) {
    pathComponentStack.push(node.pathComponent);
    node = node.parent;
  }
  return '/' + pathComponentStack.reverse().join('/');
};

/**
 * Add a route to the tree and update the name map, throw if a route
 * already exists on the node or the route name has already been used.
 *
 * @param {Route} route - the route object to add
 */
RouteTree.prototype.addRoute = function addRoute(route) {
  if (this.routesByNames.has(route.name)) {
    throw new Error('Route already exists with name ' + route.name);
  }
  var pathComponentStack = parseRoutePattern(route.pattern).reverse();
  var candidateNode = this.resolvePath(pathComponentStack);
  candidateNode = this.addRemainingPath(candidateNode, pathComponentStack);
  assert.strictEqual(
    pathComponentStack.length, 0,
    'Path component stack was not exhausted by addRemainingPath'
  );
  if (candidateNode.route === null) {
    candidateNode.route = route;
    this.routesByNames.set(route.name, route);
  } else {
    throw new Error(
      'Route already exists at ' + this.getNodePath(candidateNode)
    );
  }
};

/**
 * Walk through the tree using the components in the stack, return the
 * deepest node found. The stack's top component will be the first not found.
 *
 * @param {Array} pathComponentStack - stack of path components to attempt.
 */
RouteTree.prototype.resolvePath = function resolvePath(pathComponentStack) {
  var node = this.root;
  var component;
  while (pathComponentStack.length) {
    component = pathComponentStack.pop();
    if (node.children.has(component)) {
      node = node.children.get(component);
    } else {
      pathComponentStack.push(component);
      return node;
    }
  }
  return node;
};

/**
 * Create children from the stack until exhausted, and return the leaf. Throw
 * if the child already exists.
 *
 * @param {RouteTreeNode} startNode - starting node
 * @param {Array} pathComponentStack -
 * stack of path components to generate as children.
 */
RouteTree.prototype.addRemainingPath = function addRemainingPath(
  node, pathComponentStack
) {
  var component;
  var newNode;
  while (pathComponentStack.length) {
    component = pathComponentStack.pop();
    if (node.children.has(component)) {
      throw new Error(
        'Child node ' + component +
        ' already exists at ' + this.getNodePath(node)
      );
    }
    newNode = new RouteTreeNode(component, node);
    node.children.set(component, newNode);
    node = newNode;
  }
  return node;
};

module.exports = RouteTree;
