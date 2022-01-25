const { dateFormat } = require("./src/utils/dateFormat");
const Koa = require("koa");
// 引入 Mock
const Mock = require("mockjs");

const app = new Koa();
// 导入koa-router模块
const Router = require("koa-router");
// 创建koa-router的实例router
const router = new Router();
let Random = Mock.Random;
Date.prototype.format = dateFormat;

/**
 * @api {get} http://localhost:3033/dataList 无人船数据
 * @apiDescription 获取数据
 * @apiName dataList
 * @apiGroup Data
 *
 * @apiSuccess {Number} code 后台处理状态码.
 * @apiSuccess {Object} data 请求的数据.
 * @apiSuccess {String} msg  请求信息.
 * @apiSuccessExample {json} Success-Response:
 *{
 *	
	"code": 200,
	"data": {
		"id": 1643081494428,           // 数据id
		"name": "shipInfo",            // 数据名
		"time": "2022-01-25 11:31:34", // 数据获取的时间
		"total": 1,                    // 数据条数
		"battery": 80,                 // 小船电池电量
		"speed": 3.311,                // 小船速度
		"distance": 4                  // 与障碍物的距离

	},
	"msg": "操作成功"
}
 * @apiSampleRequest http://localhost:3033/dataList
 * @apiVersion 1.0.0
 */
router.get("/dataList", (ctx) => {
  var data = Mock.mock({
    code: 200,
    "data|1": [
      {
        id: new Date().getTime(),
        name: "shipInfo",
        time: new Date().format("yyyy-MM-dd hh:mm:ss"),
        total: 1,
        battery: 80,
        speed: Number(Random.float(0, 5).toFixed(3)),
        distance: Random.integer(0, 7)
      },
    ],
    msg: "操作成功",
  });
  ctx.body = data;
});
router.get("/apidoc", function (req, res, next) {
  res.type("text/html");
  res.sendfile("public/apidoc/index.html");
});
app.use(router.routes());
app.use(require("koa-static")(__dirname + "/public"));
app.use((ctx, next) => {
  // 设置允许跨域
  ctx.set("Access-Control-Allow-Origin", "*");
  ctx.set("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, OPTIONS");
  // 请求头设置
  ctx.set(
    "Access-Control-Allow-Headers",
    `Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild,x-token,sessionToken,token`
  );
  if (ctx.method == "OPTIONS") {
    ctx.body = 200;
  } else {
    next();
  }
});
// 监听端口
app.listen(3033, () => {
  console.log("服务器已启动，http://localhost:3033");
});
