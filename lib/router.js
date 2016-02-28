var url = require('url');


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


/**
 * Maps routes to views
 */
var Router = function() {
  this._routes = new RouteTree();
};

/**
 * Add a route and corresponding view function to the router.
 *
 * @param {String} routePattern -
 * Route pattern with optional replacement markers
 * @param {Function} -
 * View function, called with the... TODO
 */
Router.prototype.addRoute = function addRoute(name, routePattern, viewFunction) {
  var route = Route(name, routePattern, viewFunction);
  this._routes.add(route);
};

/**
 * Search for a route that matches the pattern
 */
Router.prototype.findRoute = function findRoute(path) {
  // TODO
};
exports.Router = Router;


/**
 * Simple object that links together a route pattern with a view function
 */
var Route = function Route(name, routePattern, viewFunction) {
  this.name = name;
  this.pattern = routePattern;
  this.view = viewFunction;
};


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
exports.RouteTreeNode = RouteTreeNode;


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
  while (true) {
    pathComponentStack.push(node.pathComponent);
    if (node.parent === null) {
      break;
    } else {
      node = node.parent;
    }
  }
  return '/' + pathComponentStack.reverse().join('/');
};

/**
 * Add a route to the tree, throw if the route already exists.
 */
RouteTree.prototype.addRoute = function addRoute(route) {
  throw new Error("This isn't finished yet!");
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

exports.RouteTree = RouteTree;
