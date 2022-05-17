const { Sequelize, Model } = require("sequelize");
const { sequelize } = require("../../core/db");
const { UserShipRelation } = require("./userShipRelation");
const { Ship } = require("./ship");
const { shipData } = require("./shipData");
class Plan extends Model {
  static async getPlanData(queryParam) {
    let { reqPageNum = "", reqPageSize = "", sid = "" } = queryParam;
    reqPageNum = Number(reqPageNum);
    reqPageSize = Number(reqPageSize);
    console.log("请求参数", queryParam, sid);
    let planList;

    if (sid) {
      let ship = await Ship.findOne({
        where: {
          sid: sid,
        },
      });
      if (!ship) {
        throw new global.errs.QueryError("该无人船的数据不存在", 60002);
      }
      planList = await Plan.findAndCountAll({
        where: {
          sid: sid,
        },
      });
    } else {
      planList = await Plan.findAndCountAll({
        offset: (reqPageNum - 1) * reqPageSize,
        limit: reqPageSize,
        attributes: { exclude: ["password"] },
        distinct: true,
      });
    }

    if (!planList) {
      throw new global.errs.QueryError("暂无无人船的航行数据", 60003);
    }
    let data = {
      planList: planList.rows,
      ...queryParam,
      total: planList.count,
    };
    return data;
  }
  static async addPlan(param) {
    let { sid } = param;
    let ship = await Ship.findAndCountAll({
      where: {
        sid: sid,
      },
    });
    if (ship.rows.length == 0) {
      throw new global.errs.NotFound("该无人船不存在, 添加失败");
    }
    await Plan.create(param);


  }
  static async doPlan(param) {
    let { id, pid } = param;
    console.log("执行计划的id pid", id,pid);
    let paramData = {
      sid: 1,
      battery: 1,
      speed: 2.70,
      hum: 30,
      temp: 55,
      algae_finish: 25,
      algae_weight: 16,
      longitude: 113.032196,
      latitude: 28.236394,
      status: 1
    }
    const updata = async () => {
      if (pid == 1) {
        console.log("执行计划1")
        paramData.longitude += 0.000045;
        paramData.speed = (Math.random() * 10).toFixed(2,2)
      } else {
        console.log("执行计划2")
        paramData.longitude += 0.000045
        paramData.latitude += 0.000020
        paramData.speed = (Math.random() * 10).toFixed(2,2)
      }
      let data = await shipData.addData(paramData);
    }
    let timer = setInterval(updata, 2000);

    setTimeout(() => {
      clearInterval(timer);
    },100000)
  }
  static async deletePlan(param) {
    let {id = 0} = param;
    let data = await Plan.destroy({
      where: {
        id: id,
      },
    });
    // console.log("data", data);
    if (data) {
      throw new global.errs.Success("", 0, "删除成功");
    } else {
      throw new global.errs.EditError("没有该用户，删除失败");
    }
  }
}
Plan.init(
  {
    id: {
      type: Sequelize.INTEGER,
      //设置为主键  关系型数据库
      //不能重复 不能为空
      //最好为数字，便于查询
      //如果只是简单的自增，并发条件下可能出错
      primaryKey: true,
      //设置自增
      autoIncrement: true,
    },
    sid: Sequelize.INTEGER,
    pname: Sequelize.STRING,
    operation: Sequelize.STRING,
  },
  { sequelize, tableName: "plan" }
);

module.exports = {
  Plan,
};
