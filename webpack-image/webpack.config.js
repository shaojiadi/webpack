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
        test: /\.less$/,
        //使用多个loader处理use
        use: [
          'style-loader',
          'css-loader',
          'less-loader'
        ]
      },
      {
        //问题： 默认处理不了html中img图片
        //处理图片资源
        test: /\.(jpg|png|gif )$/,
        //写法：使用一个loader
        //下载url-loader file-loader
        loader: 'url-loader',
        options: {
          // 图片大小小于8kb,就会被base64处理(不会在build中展示)    优点:减少请求数量(减轻服务器压力)   缺点：图片体积会更大(文件请求速度更慢)
          limit: 8*1024,
          //问题： 因为url-loader默认使用es6模块化解析，而html-loader引入图片是commonjs  解析问题时会出现：[object Module]
          //解决： 关闭url-loader的es6模块化，使用commonjs解析
          esModule: false,
          //给图片进行重命名
          //[hash:10]取图片的hash的前十位
          //[ext]取文件原来的扩展名
          name: '[hash:10].[ext]'
        }
      },
      {
        test: /\.html$/,
        //处理html文件的img图片（负责引入img,从而能被url-loader进行处理）
        loader: 'html-loader'
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