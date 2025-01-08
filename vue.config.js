const { defineConfig } = require('@vue/cli-service')
module.exports = {
  devServer: {
    proxy: {
      '/api/oxilor': {
        target: 'https://data.oxilor.ru',
        changeOrigin: true,
        pathRewrite: { '^/api/oxilor': '' }
      }
    }
  }
};
