const timeStamp = new Date().getTime();
module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/sakai-vue' : '/',

  css: {
    extract: {
      filename: `css/[name].${timeStamp}.css`,
      chunkFilename: `css/[name].${timeStamp}.css`,
    },
  },
  configureWebpack: {
    output: {
      filename: `js/[name].${process.env.VUE_APP_Version}.${timeStamp}.js`,
      chunkFilename: `js/[name].${process.env.VUE_APP_Version}.${timeStamp}.js`,
    },
  },
};
