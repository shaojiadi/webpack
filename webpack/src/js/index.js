import '../css/iconfont.css';
import '../css/index.less';
import {demo,demo2} from'./print.js';

function add(x, y) {
  return x + y;
}

add(1, 2);

// 下一行eslint所有规则无效
// eslint-disable-next-line
console.log(66666);



if(module.hot){
  console.log(module.hot);
  module.hot.accept('./print.js',function(){    //告诉webpack接受热替换的模块
    console.log('print.js这个文件内容有所改变');
    demo()
  })
}
