module.exports = {
  entry: {
    include: ['app/web/page'],
    exclude: ['app/web/page/[a-z]+/component', 'app/web/page/test'],
    loader: {
      client: 'app/web/framework/entry/client-loader.js',
      server: 'app/web/framework/entry/server-loader.js'
    }
  },
  loaders:{ 
    less: true
  },
  alias:{
    // asset: 'app/web/asset',
    // component: 'app/web/component',
    // framework: 'app/web/framework',
    service: 'app/web/service'
  }
};
