
module.exports = app => {
  app.get('/', app.controller.home.home.index);
  app.get('/index', app.controller.home.home.index);
  app.get('/work', app.controller.home.home.work);
  app.get('/travel', app.controller.home.home.travel);
  app.get('/detail/:id', app.controller.home.home.detail);
  app.get('/blog/list', app.controller.home.home.list);
  app.post('/blog/like/:id', app.controller.home.home.reactions);
  app.get('/oauth/redirect', app.controller.home.home.oauth);
  app.post('/blog/comment/:id', app.controller.home.home.comment);
  app.get('/search', app.controller.home.home.search);
};
