const { Sequelize, Model } = require("sequelize");
const { sequelize } = require("../../core/db");
const { UserShipRelation } = require("./userShipRelation");
const { Ship } = require("./ship");

class shipData extends Model {
  static async getData(queryParam) {
    let { reqPageNum = "", reqPageSize = "", sid = "" } = queryParam;
    reqPageNum = Number(reqPageNum);
    reqPageSize = Number(reqPageSize);
    console.log("请求参数", queryParam, sid);
    let ship = await Ship.findOne({
      where: {
        sid: sid,
      },
    });
    if (!ship) {
      throw new global.errs.QueryError("该无人船的数据不存在", 60002);
    }
    let data = await shipData.findOne({
      distinct: true,
      order: [["created_at", "DESC"]],
      where: {
        sid: ship.sid,
      },
    });

    
    data.dataValues.location = {
      longitude: 113.032091,
      latitude: 28.236334,
    };
    // console.log(item);

    if (!data) {
      throw new global.errs.QueryError("暂无无人船的航行数据", 60003);
    }
    return { ...data.dataValues, ...ship.dataValues };
  }
  static async addData(param) {
    await Ship.updateStatus({ sid: param.sid, status: param.status });
    let data = shipData.create(param);
    // console.log(data);
    return data;
  }
}
shipData.init(
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
    battery: Sequelize.INTEGER,
    created_at: Sequelize.DATE,
    // updated_at: Sequelize.DATE,
    // delete_at: Sequelize.DATE,
    temp: Sequelize.INTEGER,
    hum: Sequelize.INTEGER,
    speed: Sequelize.DECIMAL(10, 2),
    algae_finish: Sequelize.FLOAT,
    algae_weight: Sequelize.FLOAT,
  },
  {
    sequelize,
    tableName: "ship_data",
    // timestamps: false,
  }
);

module.exports = {
  shipData,
};
