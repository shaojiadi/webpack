function demo(){
  console.log('print中的demo被调用');
  return;
} 

function demo2(){
  console.log('print中的demo2被调用');
  return;
} 

module.exports = {
  demo,
  demo2
}
