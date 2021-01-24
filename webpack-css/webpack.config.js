const {resolve} = require('path');  //用来处理绝对路径
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: './src/js/index.js',   //以index.js为打包入口
  output: {
    filename: 'js/built.js',    //css代码都会打包到这
    path: resolve(__dirname,'build'),
  },
  module:{
    rules: [
      {
        test: /\.css$/,   
        use: [
          //创建style标签，将样式放入
          //'style-loader',
          //这个loader取代style-loader.作用：提取js中的css成单独文件
          MiniCssExtractPlugin.loader,
          //将css文件整合到js文件中
          'css-loader'  
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    }),
    //
    new MiniCssExtractPlugin({
      // 对输出文件进行重命名
      filename: 'css/built.css'
    })
  ],
  mode: 'development',
}