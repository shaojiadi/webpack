import '../css/iconfont.css'
import '../css/index.less'
// import $ from 'jquery'

function add(x,y){
  return x+y;
}

/*
  通过js代码，让某个文件被单独打包成chunk
*/
import(/*webpackChunkName:'common'*/'./common')     //webpackChunkName取名
  .then((result)=>{
    //文件加载成功
    console.log(result);
  })
  .catch(()=>{
    console.log('文件加载失败');
  })

console.log(add(1,2));