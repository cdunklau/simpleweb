var parseRoutePattern = require('../lib/router/utils.js').parseRoutePattern;
var RouteTree = require('../lib/router/RouteTree.js');
var RouteTreeNode = require('../lib/router/RouteTreeNode.js');


describe("The parseRoutePattern function", function() {
  var parseResultEquals = function parseResultEquals(input, expectedResult) {
    expect(parseRoutePattern(input)).toEqual(expectedResult);
  };

  it("returns an empty array for empty patterns", function() {
    parseResultEquals('', []);
  });

  it("returns an empty array for single slash", function() {
    parseResultEquals('/', []);
  });

  it("returns the resource path components", function() {
    parseResultEquals('/foo', ['foo']);
    parseResultEquals('/foo/bar', ['foo', 'bar']);
  });

  it("ignores doubled slashes", function() {
    parseResultEquals('//', []);
    parseResultEquals('/foo//bar', ['foo', 'bar']);
  });

  it("ignores trailing slashes", function() {
    parseResultEquals('/foo/', ['foo']);
    parseResultEquals('/foo//', ['foo']);
  });
});


describe("RouteTree's", function() {
  describe("getNodePath method", function() {
    var tree;
    var a, a_aa;
    beforeEach(function() {
      tree = new RouteTree();
      a = new RouteTreeNode('a', tree.root);
      tree.root.children.set('a', a);
      a_aa = new RouteTreeNode('aa', a);
      a.children.set('aa', a_aa);
    });

    it("returns a slash for the root node", function() {
      expect(tree.getNodePath(tree.root)).toBe('/');
    });

    it("returns the first level path", function() {
      expect(tree.getNodePath(a)).toBe('/a');
    });

    it("returns the second level path", function() {
      expect(tree.getNodePath(a_aa)).toBe('/a/aa');
    });
  });

  describe("addRoute method", function() {
    xit();
  });

  describe("resolvePath method", function() {
    var tree;
    var a, a_aa;
    beforeEach(function() {
      tree = new RouteTree();
      a = new RouteTreeNode('a', tree.root);
      tree.root.children.set('a', a);
      a_aa = new RouteTreeNode('aa', a);
      a.children.set('aa', a_aa);
    });

    it("returns the root node for an empty stack", function() {
      expect(tree.resolvePath([])).toBe(tree.root);
    });

    it("returns the root node with the remainder in the stack", function() {
      var stack = ['notintree'];
      expect(tree.resolvePath(stack)).toBe(tree.root);
      expect(stack).toEqual(['notintree']);
    });

    it("returns a child node as requested and exhausts the stack", function() {
      var stack = ['a'];
      expect(tree.resolvePath(stack)).toBe(a);
      expect(stack).toEqual([]);
    });

    it("returns a deeper child node as requested and exhausts the stack", function() {
      var stack = ['a', 'aa'].reverse();
      expect(tree.resolvePath(stack)).toBe(a_aa);
      expect(stack).toEqual([]);
    });

    it("returns a child node with the remainder in the stack", function() {
      var stack = ['a', 'notintree'].reverse();
      expect(tree.resolvePath(stack)).toBe(a);
      expect(stack).toEqual(['notintree']);
    });
  });

  describe("addRemainingPath method", function() {
    var tree;
    var a, a_aa;
    beforeEach(function() {
      tree = new RouteTree();
      a = new RouteTreeNode('a', tree.root);
      tree.root.children.set('a', a);
      a_aa = new RouteTreeNode('aa', a);
      a.children.set('aa', a_aa);
    });

    it("returns the same node given if the stack is empty", function() {
      expect(tree.addRemainingPath(tree.root, [])).toBe(tree.root);
      expect(tree.addRemainingPath(a, [])).toBe(a);
    });

    it("throws if the child node exists", function() {
      expect(tree.addRemainingPath.bind(tree, tree.root, ['a'])).toThrow();
    });

    it("returns the next node created and exhausts the stack", function() {
      var stack = ['ab'];
      var newNode = tree.addRemainingPath(a, stack);
      expect(newNode.parent).toBe(a);
      expect(stack).toEqual([]);
    });

    it("returns the last node created and exhausts the stack", function() {
      var stack = ['aba', 'ab'];
      var newNode = tree.addRemainingPath(a, stack);
      expect(newNode.parent.parent).toBe(a);
      expect(stack).toEqual([]);
    });
  });

});
