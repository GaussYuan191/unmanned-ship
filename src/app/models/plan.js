const { Sequelize, Model } = require("sequelize");
const { sequelize } = require("../../core/db");
const { UserShipRelation } = require("./userShipRelation");
const { Ship } = require("./ship");

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
