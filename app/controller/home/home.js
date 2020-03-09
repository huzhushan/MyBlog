
const MILESTONE = {
  'work': 1,
  'travel': 2
}

const getLanguage = (language) => {
  if (language !== 'en' && language !== 'zh') {
    return 'zh'
  }
  return language
}

module.exports = app => {
  return class AppController extends app.Controller {
    async index() {
      const { ctx } = this;
      let {language} = ctx.query;

      const responseData = {
        locale: getLanguage(language),
        title: '我的博客',
        keywords: 'blog, egg, react',
        description: '强大的博客，哈哈哈'
      }

      const {data, status, message} = await ctx.service.blog.getBlogList();
      if (status !== 200) {
          ctx.status = status;   
      }

      const {data: labels} = await ctx.service.blog.getLabels();

      await ctx.render('home/home.js', {...responseData, list: status === 200 ? data : null, labels});
    }

    async search () {
      const { ctx } = this;
      let {language} = ctx.query
      

      const responseData = {
        locale: getLanguage(language),
        title: '我的博客',
        keywords: 'blog, egg, react',
        description: '强大的博客，哈哈哈'
      }

      const {labels: label} = ctx.query;

      const {data, status, message} = await ctx.service.blog.getBlogList({
        labels: label
      });
      if (status !== 200) {
          ctx.status = status;   
      }

      const {data: labels} = await ctx.service.blog.getLabels();

      await ctx.render('home/home.js', {...responseData, page: 'search', list: status === 200 ? data : null, labels});
    }

    async work() {
      const { ctx } = this;
      let {language} = ctx.query
      

      const responseData = {
        locale: getLanguage(language),
        title: '工作 - 我的博客',
        keywords: 'blog, egg, react',
        description: '强大的博客，哈哈哈'
      }

      const {data, status, message} = await ctx.service.blog.getBlogList({
        milestone: 1
      });
      if (status !== 200) {
          ctx.status = status;   
      }
      const {data: labels} = await ctx.service.blog.getLabels();
      await ctx.render('home/home.js', {...responseData, page: 'work', list: status === 200 ? data : null, labels});
    }

    async travel() {
      const { ctx } = this;
      let {language} = ctx.query
      

      const responseData = {
        locale: getLanguage(language),
        title: '工作 - 我的博客',
        keywords: 'blog, egg, react',
        description: '强大的博客，哈哈哈'
      }

      const {data, status, message} = await ctx.service.blog.getBlogList({
        milestone: 2
      });
      if (status !== 200) {
          ctx.status = status;   
      }
      const {data: labels} = await ctx.service.blog.getLabels();
      await ctx.render('home/home.js', {...responseData, page: 'travel', list: status === 200 ? data : null, labels});
    }

    // async client() {
    //   const { ctx } = this;
    //   await ctx.renderClient('home/home.js', Model.getPage(1, 10));
    // }

    async list() {
      const { ctx } = this;
      const {pageNum, type, labels} = ctx.query;

      const res = await ctx.service.blog.getBlogList({
        page: pageNum || 1,
        milestone: MILESTONE[type] || '*',
        labels: labels || ''
      });

      ctx.body = res
    }


    async detail() {
      const { ctx } = this;

      const number = ctx.helper.AesDecode(ctx.params.id, 'huzhushan123');

      let {language} = ctx.query
      

      const responseData = {
        locale: getLanguage(language),
        title: '博客详情页',
        keywords: 'blog, egg, react',
        description: '强大的博客，哈哈哈'
      }

      const {data, status, message} = await ctx.service.blog.getBlogDetail(number);
      const {data: labels} = await ctx.service.blog.getLabels();
      
      await ctx.render('detail/index.js', {...responseData, page: status === 200 ? data.type.value : 'index', data: {...data, aid: ctx.params.id, userInfo: ctx.session.userInfo}, labels});
    }

    async reactions () {
      const { ctx } = this;

      if (!ctx.session.accessToken) {
        ctx.body = {
          code: 401,
          message: 'Unauthorized'
        }
        return;
      }

      const number = ctx.helper.AesDecode(ctx.params.id, 'huzhushan123');
      const {content} = ctx.request.body;

      const res = await ctx.service.blog.postReactions(number, content === 'good' ? '+1' : '-1', ctx.session.accessToken);
      
      ctx.body = res
      

    }

    async comment () {
      const { ctx } = this;
      if (!ctx.session.accessToken) {
        ctx.body = {
          code: 401,
          message: 'Unauthorized'
        }
        return;
      }

      const number = ctx.helper.AesDecode(ctx.params.id, 'huzhushan123');
      const {comments} = ctx.request.body;
      
      const res = await ctx.service.blog.postComments(number, comments, ctx.session.accessToken);
      
      ctx.body = res
    }

    async oauth () {
      const { ctx } = this;
      const {code, referrer} = ctx.request.query;
      const access_token = await ctx.service.blog.getAccessToken(code)
      let userInfo = null

      if (access_token) {
        ctx.session.accessToken = access_token;
        userInfo = await ctx.service.blog.getUserInfo(access_token)
        ctx.session.userInfo = userInfo;
      }

      await ctx.render('oauth/index.js', {data: {authorized: !!userInfo, userInfo}});
      
    }

  };
};
