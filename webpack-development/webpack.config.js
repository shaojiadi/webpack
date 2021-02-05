/*
  开发环境配置：运行即可

  运行项目指令：
    webpack 会将打包结果输出
    npx webpack serve 只会在内存中编译，没有输出
*/

const {resolve} = require('path');  //用来处理绝对路径
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const t = require('terser-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');


module.exports = {
  //entry: './src/js/index.js',   //单入口，以index.js为打包入口    
  /*
  数组形式：
  多入口形式["./src/js/index.js","./src/js/main.js"]，所有的入口文件都会形成一个chunk，名称是默认的，输出也只有一个bundle


  对象形式：
  多入口，有几个入口文件就会生成几个chunk,并输出几个bundle,chunk的名称是key
  entry: {
    one: './src/js/index.js',
    two: './src/js/main.js'
  }
 */
 //特殊用法
  entry: {
    vendor: ["./src/js/jquery.js","./src/js/common.js"],
    index: './src/js/index.js',
    cart: './src/js/cart.js',
  },
  output: {
    //filename: 'js/built.js',    //css代码都会打包到这     如果entry是对象形式 filename: 'js/[name].js',
    filename: 'js/[name].js',
    path: resolve(__dirname,'build'),
    chunkFilename: 'js/[name].[contenthash:10]_chunk.js',
  },
  module:{
    rules: [
      {
        test: /\.css$/,   
        //使用哪些loader进行处理
        use: [
          //use数组中loader执行顺序：从右到左，从下到上
          //把样式插入到DOM中，方法是在head中插入一个style标签，并把样式写入到这个标签的innerHTML里
          'style-loader',
         /*  {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../',
            },
          }, */
          //作用(处理css中的import和url这样的外部资源)   将css文件变成commonjs模块加载js中，里面内容是样式字符串
          'css-loader'
        ]
      },
      //loader配置
      {
        test: /\.less$/,
        //使用多个loader处理use
        use: [
          'style-loader',
          //这个loader取代style-loader.作用：提取js中的css成单独文件
        /*   {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../',
            },
          }, */
          'css-loader',
          'less-loader',
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
          'postcss-loader',
        ]
      },
     /*  {
        test: /\.scss$/,
        //使用多个loader处理use
        use: [
          'style-loader',
          'css-loader',
          'sass-loader'
        ]
      }, */
      {
        //问题： 默认处理不了html中img图片
        //处理图片资源
        test: /\.(jpg|png|gif )$/,
        //写法：使用一个loader
        //下载url-loader file-loader
        loader: 'url-loader',      //是file-loader的一个优化
        options: {
          // 图片大小小于8kb,就会被base64处理(不会在build中展示)    优点:减少请求数量(减轻服务器压力)   缺点：图片体积会更大(文件请求速度更慢)
          limit: 8*1024,
          //问题： 因为url-loader默认使用es6模块化解析，而html-loader引入图片是commonjs  解析问题时会出现：[object Module]
          //解决： 关闭url-loader的es6模块化，使用commonjs解析
          esModule: false,
          //给图片进行重命名
          //[hash:10]取图片的hash的前十位
          //[ext]取文件原来的扩展名
          name: '[hash:10].[ext]',
          outputPath: 'img'  //输出目录
        }
      },
      {
        test: /\.html$/,
        //处理html文件的img图片（负责引入img,从而能被url-loader进行处理）
        loader: 'html-loader'
      },
      //打包其他资源(除了html/js/css以外的资源)
      {
        //排除css/js/html资源
        exclude: /\.(js|css|less|jpg|png|html|gif)$/,
        loader: 'file-loader',
        options: {
          name: '[hash:10].[ext]',
          outputPath: 'media'
        }
      }
      
    ]
  },
  plugins: [
    //html-webpack-plugin  功能：默认会创建一个空的html,自动引入打包输出的所有资源(js/css)
    //需求：需要有结构的html文件
    new HtmlWebpackPlugin({
      //复制'./src/index.html'文件，并自动引入打包输出的所有资源(js/css)
      template: './src/index.html',
      chunks: ['index','vendor'],      //指定引入的js文件
      minify: {
        //移除空格
        collapseWhitespace: true,
        //移除注释
        removeComments: true
      }
    }),
    new HtmlWebpackPlugin({
      template: './src/cart.html',
      filename: 'cart.html',        //文件名称，默认为index.html
      chunks: ['cart','vendor'],
    }),
   /*  new MiniCssExtractPlugin({
      // 对输出文件进行重命名
      filename: 'css/[name].css'
    }),    */
  ],
  /*
    1.可以将node_modules中代码单独打包一个chunk最终输出
    2.自动分析多入口chunk,有无公共的文件。如果有会打包成一个chunk
  */
  optimization: {
    splitChunks: {
      chunks: 'all'
    },
    //将当前模块记录其他模块的并打包为一个runtime文件
    //解决： 修改a文件导致b文件的contenthash变化（要加）
    runtimeChunk: {
      name: entrypoint => `runtime-${entrypoint.name}`
    },
    minimizer: [
      //配置生产环境的压缩方案：js和css 
      new TerserWebpackPlugin({
        //开启缓存
        //cache: true,
        //开启多进程打包
        //parallel: true,
        //启动source-map
        //sourceMap: true
      })
    ]
  },
  //在webpack5 需要加上这个配置选项可以自动刷新
  target: "web",
  mode: 'development',
  devServer: {
    compress: true,
    port: 3000,
    open: true,
    hot: true
  }
}