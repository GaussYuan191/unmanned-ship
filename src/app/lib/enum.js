function isThisType(val) {
  for(let key in this) {
    //如果使用===,在使用x-www-form-urlencoded时值为字符串，只能用Json的方式
    //这个解决方法不好，会照成检测不出type是否合法
    if(this[key] == val){
      return true
    }
  }
  return false
}

const LoginType = {
  // 小程序登录
  USER_MINI_PROGRAM: 100,
  // 邮箱登录
  USER_EMAIL: 101,
  // 手机登录
  USER_MOBILE: 102,
  // 管理员邮箱登录
  ADMIN_EMAIL: 200,
  isThisType
}
const ArtType = {
  MOVIE: 100,
  MUSIC: 200,
  SENTENCE: 300,
  BOOK:400,
  isThisType
}
module.exports = { 
  LoginType,
  ArtType
}