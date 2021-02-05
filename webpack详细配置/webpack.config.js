const {resolve} = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: '[name].js',       //默认名称为main
    path: resolve(__dirname,'build')
  },
  plugins: [
    new HtmlWebpackPlugin()
  ],
  mode: 'development'
}