// 导入koa-router模块
const Router = require("koa-router");
// 创建koa-router的实例router
const router = new Router();
/**
 * @api {get} /dataList 数据获取
 * @apiName reg
 * @apiGroup User
 *
 *
 * @apiSuccess {String} err Firstname of the User.
 * @apiSuccess {String} msg  Lastname of the User.
 * @apiSampleRequest http://localhost:3000/admin/user/reg
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