require('module-alias/register') // 文件别名，详细见package.json _moduleAliases
const { dateFormat } = require("./src/utils/dateFormat");

const Koa = require("koa");
const bodyParser = require("koa-bodyparser")
const path = require('path')
// 引入https 以及 koa-ssl
const https = require('https')
const sslify = require('koa-sslify').default
const fs = require('fs')
const options = {
  key: fs.readFileSync('./src/httpskey/www.yuangauss287.top.key'),
  cert: fs.readFileSync('./src/httpskey/www.yuangauss287.top.pem'),
 }
 

const InitManager = require('./src/core/init')
const catchError = require('./src/middlewares/exception')
const static = require('koa-static')
const app = new Koa();

app.use(sslify())  // 使用ssl

app.use(bodyParser())
app.use(catchError)
app.use(static(path.join(__dirname,'./static')))
InitManager.initCore(app)

// 监听端口
const port = process.env.PORT || 8080;
https.createServer(options, app.callback()).listen(port, (err) => {
  if (err) {
    console.log('服务启动出错', err);
  } else {
    console.log('guessWord-server运行在' + port + '端口');
    console.log(app)
  }	
});