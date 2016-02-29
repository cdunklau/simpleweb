var Router = require('../lib/router');

describe('A Router object', function() {
  var router;
  beforeEach(function() {
    router = new Router();
    router.addRoute('index', '/', function() {});
    router.addRoute('posts:index', '/posts', function() {});
  });

  it('resolves routes based on the URL path', function() {
    expect(router.getMatch('/').route.name).toBe('index');
    expect(router.getMatch('/posts').route.name).toBe('posts:index');
  });

  it('allows adding routes without intermediate routes in between',
          function() {
    router.addRoute('people:index', '/api/people', function() {});
    expect(router.getMatch('/api/people').route.name).toBe('people:index');
  });

  it('throws on duplicate route names', function() {
    expect(router.addRoute.bind(router, 'index', '/newindex', function() {})).
          toThrowError(/Route already exists with name/);
  });

  it('throws on duplicate patterns', function() {
    expect(router.addRoute.bind(router, 'newindexname', '/', function() {})).
          toThrowError(/Route already exists at/);
  });

  it('resolves URL paths matching replacement markers', function() {
    router.addRoute('posts:detail', '/posts/{postId}', function() {});
    var match = router.getMatch('/posts/123');
    expect(match.route.name).toBe('posts:detail');
    expect(match.fields).toEqual({postId: '123',});
  });

  it('resolves URL paths matching multiple replacement markers', function() {
    router.addRoute(
      'posts:detail', '/posts/{postId}/history/{revision}', function() {}
    );
    var match = router.getMatch('/posts/123/history/456');
    expect(match.route.name).toBe('posts:detail');
    expect(match.fields).toEqual({postId: '123', revision: '456',});
  });

  it('throws if replacement markers conflict', function() {
    expect(
      router.addRoute.bind(
        router, 'posts:edit', '/posts/{postId}/{postId}', function() {}
      )
    ).toThrowError(/Duplicate replacement markers/);
  });

});
