function demo() {
  console.log('print中的demo被调用');
  // console.log(content)();
}

function demo2() {
  console.log('print中的demo2被调用');
}

module.exports = {
  demo,
  demo2,
};
