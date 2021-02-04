import '../css/iconfont.css';
import '../css/index.less';
// import { demo} from './print.js';
// import '@babel/polyfill';
import $ from 'jquery';

console.log($);

/* 
demo();
 */
function add(x, y) {
  return x + y;
}

add(1, 2);

// 下一行eslint所有规则无效
// eslint-disable-next-line
console.log(66666);

const getName = (a, b) => {
  console.log(a * b);
};
getName(5, 7);

const promise = new Promise((resolve) => {
  setTimeout(() => {
    resolve();
  }, 1000);
});
console.log(promise);

/* if (module.hot) {
  module.hot.accept('./print.js', () => { // 告诉webpack接受热替换的模块
    console.log('print.js这个文件内容有所改变');
    demo();
  });
} */

document.getElementById('d1').onclick = function(){
  //懒加载  当文件需要时文件才加载
  //预加载： prefetch：会在使用之前，提前加载js文件
  //正常加载可以认为是并行加载(同一时间加载多个文件)
  //预加载 prefetch: 等其他资源加载完毕，浏览器空闲，再偷偷加载资源(兼容性较差)
  import(/*webpackChunkName:'print',webpackPrefetch:true*/'./print').then(({demo})=>{
    demo();
  })
} 


/*
  1.eslint不认识window \ navigator全局变量
    解决： 需要修改package.json中的eslintConfig配置
    "env": {
      "browser": true   //支持浏览器全局变量
      //"node": true
    }
  2. sw代码必须运行在服务器上
  第一种
    -->nodejs
  第二种
    -->
    npm i serve -g
    serve -s build 启动服务器，将build目录下所有资源作为静态资源

*/

//serviceWorker
//处理兼容性问题
if('serviceWorker' in navigator){
  window.addEventListener('load',()=>{
    navigator.serviceWorker.register('/service-worker.js')
    .then(()=>{
      console.log('sw注册成功');
    })
    .catch(()=>{
      console.log('sw注册失败');
    })
  })
}