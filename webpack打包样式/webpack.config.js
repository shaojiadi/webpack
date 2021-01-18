//所有构建工具都是基于nodejs平台运行的~模块化默认采用commonjs

//resolve用来拼接绝对路径的方法
const {resolve} = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    //输出路径   _dirname nodejs的变量，代表当前文件的目录绝对路径
    path: resolve(__dirname,'build'),  //打包在build目录下的文件名为bundle.js
    //输出文件名
    filename: "bundle.js"
  },
  //loader的配置  1.下载  2.使用
  module: {
    rules: [
      //详细loader配置
      {
        //匹配哪些文件
        test: /\.css$/,   //可以打包css文件
        //使用哪些loader进行处理
        use: [
          //use数组中loader执行顺序：先执行css-loader再执行style-loader
          //创建style标签，将js中的样式资源插入进去，添加到head中生效
          'style-loader',
          //将css文件变成commonjs模块加载js中，里面内容是样式字符串
          'css-loader'
        ]
      },
      {
        test: /\.less$/,
        use: [
          'style-loader',
          'css-loader',
          //将less文件编译成css文件
          //需要下载less-loader和less
          'less-loader'
        ]
      }
    ]
  },
  //plugins的配置 1.下载  2.引入 3.使用
  plugins: [
    //html-webpack-plugin  功能：默认会创建一个空的html,自动引入打包输出的所有资源(js/css)
    // new HtmlWebpackPlugin()   
  ],
  //模式
  mode: 'development',
  //mode: 'production'
}
