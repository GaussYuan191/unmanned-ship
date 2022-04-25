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
 // koa-websocket是koa封装好的websocket功能
const websocket = require('koa-websocket')
const ws = require('ws') // websocket
const app = websocket(new Koa())

const InitManager = require('./src/core/init')
const catchError = require('./src/middlewares/exception')
const static = require('koa-static')
// const app = new Koa();
// CORS是一个W3C标准，全称是"跨域资源共享"（Cross-origin resource sharing）。
const cors = require('koa2-cors');
app.use(cors({
  origin: function (ctx) {
     return "*"; // 允许来自所有域名请求
      
     // return ctx.header.origin;// 当*无法使用时，使用这句,同样允许所有跨域
      
     // return 'http://localhost:8080'; //单个跨域请求
      
     // 允许多个跨域
    //  var allowCors = ['http://localhost:8080',  'http://localhost:8081'];
      
     return allowCors.indexOf(ctx.header.origin) > -1 ? ctx.header.origin : '';
  },
  exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
  maxAge: 5,
  credentials: true,
  allowMethods: ['GET', 'POST', 'DELETE'],
  allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
}))
app.use(sslify())  // 使用ssl

app.use(bodyParser())
app.use(catchError)
app.use(static(path.join(__dirname,'./static')))
InitManager.initCore(app)

// 监听端口
const port = process.env.PORT || 8080;
let server =  https.createServer(options, app.callback()).listen(port, (err) => {
  if (err) {
    console.log('服务启动出错', err);
  } else {
    console.log('guessWord-server运行在' + port + '端口');
    console.log(app)
  }	
});

// let server = app.listen(port, () => {
//   console.log(`服务器已启动，http://127.0.0.1:${port}`);
// });

// websocket
const wss = new ws.Server({ server })
wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    console.log('received: %s', message)
  })
})