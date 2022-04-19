/**
 *  休眠函数
 * @param {*} ms 
 * @returns 
 */
 function sleep (ms) {
  return new Promise((reslove, reject) => {
    setTimeout(reslove, ms);
  })
}
module.exports = {
  sleep
}