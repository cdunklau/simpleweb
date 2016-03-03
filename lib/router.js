'use strict';
let assert = require('assert');



/**
 * Create an object that maps routes to views
 */
function createRouter() {
  return {
    routes: createRouteTree(),

    /**
     * Add a route for the view function to the router.
     *
     * @param {string} name -
     * The unique name of the route
     * @param {string} routePattern -
     * Route pattern with optional replacement markers
     * @param {Function} -
     * View function, will be called with the simpleweb.models.Request object
     */
    addRoute: function(name, routePattern, viewFunction) {
      let route = createRoute(name, routePattern, viewFunction);
      this.routes.addRoute(route);
    },

    /**
     * Return the route match for the given URL path, or undefined if no
     * match was found.
     *
     * @param {string} path - The URL path
     */
    getMatch: function(path) {
      let pathComponentStack = parseRoutePattern(path).reverse();
      let node = this.routes.resolvePath(pathComponentStack);
      if (!pathComponentStack.length && node.route !== null) {
        return createRouteMatch(node.route, {});
      }
    },

    /**
     * Retrieve a route based on a name, or undefined if no route exists for
     * that name.
     *
     * @param {string} routeName - The name of the route to look up
     */
    getRouteByName: function(routeName) {
      return this.routes.routesByNames.get(routeName);
    },
  };
}
exports.createRouter = createRouter;



/**
 * Create a tree structure for route lookup.
 *
 * @property {RouteTreeNode} root - the node representing the root resource
 * @property {Map} names - maps route name to route object
 */
function createRouteTree() {
  return {
    root: createRouteTreeNode(null, null),
    routesByNames: new Map(),

    /**
     * Return a string with the full path of the node
     *
     * @param {RouteTreeNode} node - the node for which to get the path.
     */
    getNodePath: function(node) {
      let pathComponentStack = [];
      while (node.parent !== null) {
        pathComponentStack.push(node.pathComponent);
        node = node.parent;
      }
      return '/' + pathComponentStack.reverse().join('/');
    },

    /**
     * Add a route to the tree and update the name map, throw if a route
     * already exists on the node or the route name has already been used.
     *
     * @param {Route} route - the route object to add
     */
    addRoute: function(route) {
      if (this.routesByNames.has(route.name)) {
        throw new Error('Route already exists with name ' + route.name);
      }
      let pathComponentStack = parseRoutePattern(route.pattern).reverse();
      let candidateNode = this.resolvePath(pathComponentStack);
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
    },

    /**
     * Walk through the tree using the components in the stack, return the
     * deepest node found. The stack's top component will be the first
     * component not found.
     *
     * @param {Array} pathComponentStack - stack of path components to attempt.
     */
    resolvePath: function(pathComponentStack) {
      let node = this.root;
      let component;
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
    },

    /**
     * Create children from the stack until exhausted, and return the leaf.
     * Throw if the child already exists.
     *
     * @param {RouteTreeNode} startNode - starting node
     * @param {Array} pathComponentStack -
     * stack of path components to generate as children.
     */
    addRemainingPath: function(node, pathComponentStack) {
      let component;
      let newNode;
      while (pathComponentStack.length) {
        component = pathComponentStack.pop();
        if (node.children.has(component)) {
          throw new Error(
            'Child node ' + component +
            ' already exists at ' + this.getNodePath(node)
          );
        }
        newNode = createRouteTreeNode(component, node);
        node.children.set(component, newNode);
        node = newNode;
      }
      return node;
    },
  };
}
exports.createRouteTree = createRouteTree;



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
exports.createRouteMatch = createRouteMatch;



/**
 * Create a simple object that links together a route pattern with a view
 * function.
 *
 * @param {string} name - The route's unique name
 * @param {string} routePattern - The pattern for URL matching
 * @param {Function} viewFunction -
 * The function that processes the incoming request
 */
function createRoute(name, routePattern, viewFunction) {
  return {
    name: name,
    pattern: routePattern,
    view: viewFunction,
  };
}
exports.createRoute = createRoute;



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
exports.createRouteTreeNode = createRouteTreeNode;


/**
 * Parse a route pattern into components and return the array.
 *
 * @param {string} routePattern - The pattern for URL matching
 */
function parseRoutePattern(routePattern) {
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
}
exports.parseRoutePattern = parseRoutePattern;
