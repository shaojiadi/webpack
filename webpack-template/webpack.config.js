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
const PATHS = {src:join(__dirname,'src')}      //代表当前目录下的src

//定义nodejs环境变量，决定使用browserlist的哪个环境，默认是生产环境
process.env.NODE_ENV = 'production';

//复用loader
const commonCssLoader = [
  {
    loader: MiniCssExtractPlugin.loader,
    options: {
      publicPath: '../',
    },
  },
  'css-loader'
]

module.exports = {
  entry: ['./src/js/index.js','./src/index.html'],   //单入口，以index.js为打包入口    
  output: {
    filename: 'js/built.js',
    path: resolve(__dirname,'build'),
  },
  module:{
    rules: [
      {
        test: /\.css$/,   
        use: [...commonCssLoader]
      },
      //loader配置
      {
        test: /\.less$/,
        //使用多个loader处理use
        use: [...commonCssLoader,'less-loader']
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
        test: /\.(jpg|png|jpeg|gif )$/,
        loader: 'url-loader',    
        options: {
          // 图片大小小于8kb,就会被base64处理(不会在build中展示)    优点:减少请求数量(减轻服务器压力)   缺点：图片体积会更大(文件请求速度更慢)
          limit: 8*1024,
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
      },
     /*  {
        //eslint只检查js语法
        test: /\.js$/,
        //只检查自己写的代码
        exclude: /node_modules/,
        loader: 'eslint-loader',
        options: {
          //自动修复错误
          fix: true  
        }
      } */
      /*
        JS兼容性处理: babel-loader @babel/preset-env @babel/core
          需要做兼容性处理的就做： 按需加载 --> cnpm i core-js -D
      */
      {
        test: /\.js$/,
        exclude: /node_modules/,
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
          ]
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
      filename: 'css/built.css',
    }),
    //new OptimizeCssAssetsWebpackPlugin()   
    new PurgeCSSPlugin({
      paths: glob.sync(`${PATHS.src}/**/*`,  { nodir: true }),    //子层下的所有文件
    })
  ],
  //在webpack5 需要加上这个配置选项可以自动刷新
  target: "web",
  // mode: 'production',  //development自动会压缩代码
  devServer: {
    // contentBase: resolve(__dirname,'build'),
    compress: true,
    port: 3000,
    open: true,
    hot: true       //HRM 模块热更新  只更新改变的文件
  },
  // devtool: 'eval-source-map'
}
