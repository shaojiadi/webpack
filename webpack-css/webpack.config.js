const {resolve} = require('path');  //用来处理绝对路径
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');

//设置nodejs环境变量
process.env.NODE_ENV = 'development';

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
          'css-loader',
          /*
            css兼容性处理：postcss --> cnpm i postcss-loader postcss-preset-env

            帮postcss找到package.json中browserslist里面的配置，通过配置加载指定的css兼容性样式

             "browserslist": {
                "development": [
                  "last 1 chrome version",
                  "last 1 firefox version",
                  "last 1 safari version"
                ],
                "production": [
                  ">0.2%",
                  "not dead",
                  "not op_mini all"
                ]
              }
          */  
          //使用loader的默认配置
          //'postcss-loader',
          //修改loader的配置
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                ident: 'postcss',
                plugins: [
                  [
                  // postcss的插件
                  'postcss-preset-env'
                  ]
                ]
              }
            }
          }
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
    }),
    //压缩css
    new OptimizeCssAssetsWebpackPlugin()
  ],
  mode: 'development',
}