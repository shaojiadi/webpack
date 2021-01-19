const {resolve} = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'built.js',
    path: resolve(__dirname,'build'),
    publicPath: './'
  },
  module:{
    rules: [
      //loader配置
      {
        test: /\.css$/,
        //使用多个loader处理use
        use: [
          'style-loader',
          'css-loader',
        ]
      },
      //打包其他资源(除了html/js/css以外的资源)
      {
        //排除css/js/html资源
        exclude: /\.(css|js|html|less)$/,
        loader: 'file-loader',
        options: {
          name: '[hash:10].[ext]'
        }
      }
    
    ]
  },
  plugins: [
    //html-webpack-plugin  功能：默认会创建一个空的html,自动引入打包输出的所有资源(js/css)
    //需求：需要有结构的html文件
    new HtmlWebpackPlugin({
      //复制'./src/index.html'文件，并自动引入打包输出的所有资源(js/css)
      template: './src/index.html'
    })   
  ],
  mode: 'development'
}

