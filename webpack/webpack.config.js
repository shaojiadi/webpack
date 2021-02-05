/*
  开发环境配置：运行即可

  运行项目指令：
    webpack 会将打包结果输出
    npx webpack serve 只会在内存中编译，没有输出
*/

const {resolve,join} = require('path');  //用来处理绝对路径
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');   //将css打包成单独的文件
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');  //压缩css
const PurgeCSSPlugin = require('purgecss-webpack-plugin');   //去除没有用的css代码
const glob = require('glob');  //node全局环境
const PATHS = {src:join(__dirname,'src')};      //代表当前目录下的src
const WorkboxWebpackPlugin = require('workbox-webpack-plugin')     //pwa插件
const webpack = require('webpack');
const AddAssetHtmlWebpackPlugin = require('add-asset-html-webpack-plugin');

//定义nodejs环境变量，决定使用browserlist的哪个环境，默认是生产环境
process.env.NODE_ENV = 'production';



module.exports = {
  entry: ['./src/js/index.js','./src/index.html'],   //单入口，以index.js为打包入口    
  /*
  数组形式：
  多入口形式["./src/js/index.js","./src/js/main.js"]，所有的入口文件都会形成一个chunk，名称是默认的，输出也只有一个bundle


  对象形式：
  多入口，有几个入口文件就会生成几个chunk,并输出几个bundle,chunk的名称是key
  entry: {
    one: './src/js/index.js',
    two: './src/js/main.js'
  }

  //特殊用法  
  entry: {
    vendor: ["./src/js/jquery.js","./src/js/common.js"],
    index: './src/js/index.js',
    cart: './src/js/cart.js',
  },
 */
  output: {
    //filename: 'js/built.js',    //css代码都会打包到这     如果entry是对象形式 filename: 'js/[name].js',
    filename: 'js/built.[contenthash:10].js',
    //输出文件目录(将来所有资源输出的公共目录)
    path: resolve(__dirname,'build'),
    //chunkFilename: '[name]_chunk.js',     //非入口chunk的名称，例如import引入、optimization生成js等资源文件
    //library: '[name]',   //整个库向外暴露的变量名 一般不使用
    //libraryTarget: 'window'    //变量名添加到哪个上 browser
    //libraryTarget: 'global'   //变量名添加到哪个上 node
    //libraryTarget: 'commonjs'   
  },
  module:{
    rules: [
      {
        //以下loader只会匹配一个,提升构建速度
        //注意： 不能有两个配置处理同一种文件类型
        oneOf:[
          {
            test: /\.css$/,   
            //使用哪些loader进行处理
            use: [
              //use数组中loader执行顺序：从右到左，从下到上
              //把样式插入到DOM中，方法是在head中插入一个style标签，并把样式写入到这个标签的innerHTML里
              // 'style-loader',
    
              //这个loader取代style-loader.作用：提取js中的css成单独文件
              {
                loader: MiniCssExtractPlugin.loader,
                options: {
                  publicPath: '../',
                },
              },
              //作用(处理css中的import和url这样的外部资源)   将css文件变成commonjs模块加载js中，里面内容是样式字符串
              'css-loader'
            ]
          },
          //loader配置
          {
            test: /\.less$/,
            //使用多个loader处理use
            use: [
              {
                loader: MiniCssExtractPlugin.loader,
                options: {
                  publicPath: '../',
                },
              },
              // 'style-loader',
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
            test: /\.(jpg|png|jpeg|gif )$/,
            //写法：使用一个loader
            //下载url-loader file-loader
            loader: 'url-loader',      //是file-loader的一个优化
            options: {
              // 图片大小小于8kb,就会被base64处理(不会在build中展示)    优点:减少请求数量(减轻服务器压力)   缺点：图片体积会更大(文件请求速度更慢)
              limit: 8*1024,
              /*
              问题： 因为url-loader默认使用es6模块化解析，而html-loader引入图片是commonjs  解析问题时会出现：[object Module]
              解决： 关闭url-loader的es6模块化，使用commonjs解析
              esModule: false,           webpack5都支持，不需要设置
              */
    
              //给图片进行重命名
              //[hash:10]取图片的hash的前十位
              //[ext]取文件原来的扩展名
              name: '[name][hash:10].[ext]',
              // name: '[name].[ext]',
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
            exclude: /\.(js|css|less|jpg|png|html|gif|jpeg)$/,
            loader: 'file-loader',
            options: {
              name: '[name][hash:10].[ext]',
              outputPath: 'media'
            }
          }
        ]
      },
      /*
      正常来讲, 一个文件只能被一个loader处理
      当一个文件被多个loader处理，那么一定要指定loader的执行顺序
        先执行eslint  再执行babel
      */

      /*  {
        //eslint只检查js语法
        test: /\.js$/,
        //排除node_modules下的js文件
        exclude: /node_modules/,
        //只检查src下的js文件
        include: resolve(__dirname,'src'),
        enforce: 'pre',   //优先执行   'post'延后执行   不加中间执行
        loader: 'eslint-loader',
        options: {
          //自动修复错误
          fix: true  
        }
      }, */
      /*
        JS兼容性处理: babel-loader @babel/preset-env @babel/core
          1.基本js兼容性处理 --> @babel/preset-env
            问题: 只能转换基本语法:如promise不能转换
          2.全部js兼容性处理 --> @babel/polyfill   直接引入即可
            问题：只要解决部分兼容性问题，但是将所有兼容性代码全部引入。体积太大
          3.需要做兼容性处理的就做： 按需加载 --> core-js
      */
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          /* 
            开启多进程打包 
            进程启动大概有600ms,进程通信也有开销。
            只有工作消耗时间比较长，才需要多进程打包

            */
        /*   {
            loader: 'thread-loader',
            options: {
              workers: 2  //进程2个
            }
          }, */
          {
            loader: 'babel-loader',
            options: {
              //预设： 指示babel做怎么样的兼容性处理
              presets: [
                [
                  '@babel/preset-env',
                  {
                    //按需加载
                    useBuiltIns: 'usage',
                    //指定corejs版本
                    corejs:{
                      version: 3
                    },
                    //指定兼容性做到哪个版本浏览器
                    targets: {
                      chrome: '60',
                      firefox: '60',
                      ie: '9',
                      safari: '10',
                      edge: '17'
                    }
                  }
                ]
              ],
              //开启babel缓存
              //第二次构建时，会读取之前的缓存
              cacheDirectory: true
            }
          }
        ]
      }
    ]
  },
  plugins: [
    //html-webpack-plugin  功能：默认会创建一个空的html,自动引入打包输出的所有资源(js/css)
    //需求：需要有结构的html文件
    new HtmlWebpackPlugin({
      //复制'./src/index.html'文件，并自动引入打包输出的所有资源(js/css)
      template: './src/index.html',
      //filename: 'index.html',        //文件名称，默认为index.html
   /*    minify: {
        //移除空格
        collapseWhitespace: true,
        //移除注释
        removeComments: true
      } */
    }),
    new MiniCssExtractPlugin({
      // 对输出文件进行重命名
      filename: 'css/built.[contenthash:10].css',
    }),
    //new OptimizeCssAssetsWebpackPlugin()   
    new PurgeCSSPlugin({
      paths: glob.sync(`${PATHS.src}/**/*`,  { nodir: true }),    //子层下的所有文件
    }),
    new WorkboxWebpackPlugin.GenerateSW({
      /*
      1.帮助serviceworker快速启动
      2.删除旧的serviceworker

      生成一个serviceworker配置文件
      */
     clientsClaim: true,
     skipWaiting: true
    }),
    //告诉webpack哪些库不参与打包，同时使用时的名称也得变
    new webpack.DllReferencePlugin({            //与externals相似
      manifest: resolve(__dirname,'dll/manifest.json')
    }),
    //将某个文件打包输出出去，并在html中自动引入该资源
    new AddAssetHtmlWebpackPlugin({
      filepath: resolve(__dirname,'dll/jquery.js'),
      publicPath:  './'
    })
  ],
  //在webpack5 需要加上这个配置选项可以自动刷新
  target: "web",
  // mode: 'production',  //development自动会压缩代码
  devServer: {
    // contentBase: resolve(__dirname,'build'),
    compress: true,
    port: 3200,
    open: true,
    hot: true       //HRM 模块热更新  只更新改变的文件
  },
 /*  externals: {
    //忽略库名 -- npm包名
    jquery: 'jQuery'
  } */
  // devtool: 'eval-source-map'
}

