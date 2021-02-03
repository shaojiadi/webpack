import '../css/iconfont.css';
import '../css/index.less';
import { demo} from './print.js';
// import '@babel/polyfill';
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

if (module.hot) {
  module.hot.accept('./print.js', () => { // 告诉webpack接受热替换的模块
    console.log('print.js这个文件内容有所改变');
    demo();
  });
}
