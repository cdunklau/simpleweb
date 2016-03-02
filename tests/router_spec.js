var Router = require('../lib/router');


var fakeView = function fakeView(request) {};

describe('A Router object', function() {
  var router;
  beforeEach(function() {
    router = new Router();
    router.addRoute('index', '/', fakeView);
    router.addRoute('posts:index', '/posts', fakeView);
  });

  it('resolves routes based on the URL path', function() {
    expect(router.getMatch('/').route.name).toBe('index');
    expect(router.getMatch('/posts').route.name).toBe('posts:index');
  });

  it('allows adding routes without intermediate routes in between',
          function() {
    router.addRoute('people:index', '/api/people', fakeView);
    expect(router.getMatch('/api/people').route.name).toBe('people:index');
  });

  it('throws on duplicate route names', function() {
    expect(router.addRoute.bind(router, 'index', '/newindex', fakeView)).
          toThrowError(/Route already exists with name/);
  });

  it('throws on duplicate patterns', function() {
    expect(router.addRoute.bind(router, 'newindexname', '/', fakeView)).
          toThrowError(/Route already exists at/);
  });

  it('resolves a URL path matching a replacement marker', function() {
    router.addRoute('posts:detail', '/posts/{postId}', fakeView);
    var match = router.getMatch('/posts/123');
    expect(match.route.name).toBe('posts:detail');
    expect(match.fields).toEqual({postId: '123',});
  });

  it('resolves a URL path matching multiple replacement markers', function() {
    router.addRoute(
      'posts:detail', '/posts/{postId}/history/{revision}', fakeView
    );
    var match = router.getMatch('/posts/123/history/456');
    expect(match.route.name).toBe('posts:detail');
    expect(match.fields).toEqual({postId: '123', revision: '456',});
  });

  it('resolves a URL path matching multiple replacement markers in the ' +
           'same path component', function() {
    router.addRoute('people:multiformat', '/api/people/{personId}.{ext}',
                    fakeView);
    var match = router.getMatch('/api/people/123.json');
    expect(match.route.name).toBe('people:multiformat');
    expect(match.fields).toEqual({personId: '123', ext: 'json',});
  });

  it('throws if replacement markers conflict', function() {
    expect(
      router.addRoute.bind(
        router, 'posts:edit', '/posts/{postId}/{postId}', fakeView
      )
    ).toThrowError(/Duplicate replacement markers/);
  });

});
