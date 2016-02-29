var parseRoutePattern = require('../lib/router/utils.js').parseRoutePattern;
var RouteTree = require('../lib/router/RouteTree.js');
var RouteTreeNode = require('../lib/router/RouteTreeNode.js');
var Route = require('../lib/router/Route.js');


describe('The parseRoutePattern function', function() {
  /**
   * Expect that the input is parsed into the expectedResult
   *
   * @param {string} routePattern - the URL pattern to parse
   * @param {Array} expectedResult - the expected array of parts
   */
  var parseResultEquals = function parseResultEquals(
          routePattern, expectedResult
  ) {
    expect(parseRoutePattern(routePattern)).toEqual(expectedResult);
  };

  it('returns an empty array for empty patterns', function() {
    parseResultEquals('', []);
  });

  it('returns an empty array for single slash', function() {
    parseResultEquals('/', []);
  });

  it('returns the resource path components', function() {
    parseResultEquals('/foo', ['foo']);
    parseResultEquals('/foo/bar', ['foo', 'bar']);
  });

  it('ignores doubled slashes', function() {
    parseResultEquals('//', []);
    parseResultEquals('/foo//bar', ['foo', 'bar']);
  });

  it('ignores trailing slashes', function() {
    parseResultEquals('/foo/', ['foo']);
    parseResultEquals('/foo//', ['foo']);
  });
});


/**
 * Helper to make a small RouteTree structure for tests
 */
var makeTree = function makeTree() {
  var tree = new RouteTree();
  var child = new RouteTreeNode('child', tree.root);
  tree.root.children.set('child', child);
  var grandchild = new RouteTreeNode('grandchild', child);
  child.children.set('grandchild', grandchild);
  return {
    tree: tree,
    root: tree.root,
    child: child,
    grandchild: grandchild,
  };
};


describe('The makeTree fixture function returns a object that', function() {
  var fix;
  beforeEach(function() {
    fix = makeTree();
  });

  it('has the root node as an attribute', function() {
    expect(fix.root).toBe(fix.tree.root);
  });

  it('has the first child as an attribute', function() {
    expect(fix.child).toBe(fix.tree.root.children.get('child'));
  });

  it('has the grandchild as an attribute', function() {
    expect(fix.grandchild).toBe(
      fix.tree.root.children.get('child').children.get('grandchild')
    );
  });
});


describe('RouteTree\'s', function() {
  describe('getNodePath method', function() {
    var fix;
    beforeEach(function() {
      fix = makeTree();
    });

    it('returns a slash for the root node', function() {
      expect(fix.tree.getNodePath(fix.root)).toBe('/');
    });

    it('returns the first level path', function() {
      expect(fix.tree.getNodePath(fix.child)).toBe('/child');
    });

    it('returns the second level path', function() {
      expect(fix.tree.getNodePath(fix.grandchild)).toBe('/child/grandchild');
    });
  });

  describe('addRoute method', function() {
    var fix;
    beforeEach(function() {
      fix = makeTree();
    });

    it('adds a route to the root', function() {
      var newRoute = new Route('rootroute', '/', function() {});
      fix.tree.addRoute(newRoute);
      expect(fix.root.route).toBe(newRoute);
    });

    it('adds a route to a child', function() {
      var newRoute = new Route('childroute', '/child', function() {});
      fix.tree.addRoute(newRoute);
      expect(fix.child.route).toBe(newRoute);
    });

    it('adds a route to a previously undefined node', function() {
      var newRoute = new Route('grandchildroute', '/child/new', function() {});
      fix.tree.addRoute(newRoute);
      expect(fix.child.children.get('new').route).toBe(newRoute);
    });

    it('adds multiple routes', function() {
      var rootRoute = new Route('rootroute', '/', function() {});
      var childRoute = new Route('childroute', '/child', function() {});
      fix.tree.addRoute(rootRoute);
      fix.tree.addRoute(childRoute);
      expect(fix.root.route).toBe(rootRoute);
      expect(fix.root.children.get('child').route).toBe(childRoute);
    });

    it('adds routes into the names map', function() {
      var rootRoute = new Route('rootroute', '/', function() {});
      var childRoute = new Route('childroute', '/child', function() {});
      fix.tree.addRoute(rootRoute);
      fix.tree.addRoute(childRoute);
      expect(fix.tree.routesByNames.get('rootroute')).toBe(rootRoute);
      expect(fix.tree.routesByNames.get('childroute')).toBe(childRoute);
    });

    it('throws if a route already exists at the node specified', function() {
      fix.child.route = new Route('exists', '/child', function() {});
      var newRoute = new Route('new', '/child', function() {});
      expect(fix.tree.addRoute.bind(fix.tree, newRoute)).
            toThrowError(/Route already exists at/);
    });

    it('throws if the route name was already used', function() {
      fix.tree.addRoute(new Route('sameName', '/location', function() {}));
      var newRoute = new Route('sameName', '/otherLocation', function() {});
      expect(fix.tree.addRoute.bind(fix.tree, newRoute)).
            toThrowError(/Route already exists with name/);
    });
  });

  describe('resolvePath method', function() {
    var fix;
    beforeEach(function() {
      fix = makeTree();
    });

    it('returns the root node for an empty stack', function() {
      expect(fix.tree.resolvePath([])).toBe(fix.root);
    });

    it('returns the root node with the remainder in the stack', function() {
      var stack = ['notintree'];
      expect(fix.tree.resolvePath(stack)).toBe(fix.root);
      expect(stack).toEqual(['notintree']);
    });

    it('returns a child node as requested and exhausts the stack', function() {
      var stack = ['child'];
      expect(fix.tree.resolvePath(stack)).toBe(fix.child);
      expect(stack).toEqual([]);
    });

    it(
          'returns a deeper child node as requested and exhausts the stack',
          function() {
      var stack = ['child', 'grandchild'].reverse();
      expect(fix.tree.resolvePath(stack)).toBe(fix.grandchild);
      expect(stack).toEqual([]);
    });

    it('returns a child node with the remainder in the stack', function() {
      var stack = ['child', 'notintree'].reverse();
      expect(fix.tree.resolvePath(stack)).toBe(fix.child);
      expect(stack).toEqual(['notintree']);
    });
  });

  describe('addRemainingPath method', function() {
    var fix;
    beforeEach(function() {
      fix = makeTree();
    });

    it('returns the same node given if the stack is empty', function() {
      expect(fix.tree.addRemainingPath(fix.root, [])).toBe(fix.root);
      expect(fix.tree.addRemainingPath(fix.child, [])).toBe(fix.child);
    });

    it('throws if the child node exists', function() {
      expect(fix.tree.addRemainingPath.bind(fix.tree, fix.root, ['child'])).
            toThrow();
    });

    it('adds the child node with the correct path component name', function() {
      var leafNode = fix.tree.addRemainingPath(fix.root, ['new']);
      expect(leafNode.pathComponent).toBe('new');
      expect(fix.root.children.get('new')).toBe(leafNode);
    });

    it('returns the next node created and exhausts the stack', function() {
      var stack = ['newgrandchild'];
      var newNode = fix.tree.addRemainingPath(fix.child, stack);
      expect(newNode.parent).toBe(fix.child);
      expect(stack).toEqual([]);
    });

    it('returns the last node created and exhausts the stack', function() {
      var stack = ['newgreatgrandchild', 'newgrandchild'];
      var newNode = fix.tree.addRemainingPath(fix.child, stack);
      expect(newNode.parent.parent).toBe(fix.child);
      expect(stack).toEqual([]);
    });
  });

});
