module.exports = {
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      const HtmlWebpackPlugin = webpackConfig.plugins.find(
        p => p.constructor && p.constructor.name === 'HtmlWebpackPlugin'
      );
      if (HtmlWebpackPlugin) {
        HtmlWebpackPlugin.userOptions = HtmlWebpackPlugin.userOptions || {};
        HtmlWebpackPlugin.userOptions.template = require('path').resolve(__dirname, 'src', 'index.html');
      }
      return webpackConfig;
    }
  }
};
