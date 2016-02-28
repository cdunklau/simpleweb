var RouteTreeNode = require('./RouteTreeNode.js');

/**
 * Tree structure for route lookup.
 *
 * @property {RouteTreeNode} root - the node representing the root resource
 * @property {Object} names - maps route name to route object
 */
var RouteTree = function RouteTree() {
  this.root = new RouteTreeNode(null, null);
  this.names = {};
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
 * Add a route to the tree, throw if the route already exists.
 */
RouteTree.prototype.addRoute = function addRoute(route) {
  // TODO finish this
  var pathComponentStack = parseRoutePattern(route.pattern).reverse();
  var candidateNode = this.resolvePath(pathComponentStack);
  var leafNode = this.addRemainingPath(candidateNode, pathComponentStack);
  if (pathComponentStack.length !== 0) {
    throw new Error("Path component stack was not exhausted by addRemainingPath");
  }
  if (candidateNode.route !== null) {
    throw new Error("Route already exists at " + this.getNodePath(candidateNode));
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
 * @param {Array} pathComponentStack - stack of path components to generate as children.
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
        'Child node ' + component + ' already exists at ' + this.getNodePath(node)
      );
    }
    newNode = new RouteTreeNode(component, node);
    node.children.set('component', newNode);
    node = newNode;
  }
  return node;
};

module.exports = RouteTree;
