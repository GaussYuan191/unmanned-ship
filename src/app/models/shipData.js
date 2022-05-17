const { Sequelize, Model } = require("sequelize");
const { sequelize } = require("../../core/db");
const { UserShipRelation } = require("./userShipRelation");
const { Ship } = require("./ship");

class shipData extends Model {
  static async getData(queryParam) {
    let {
      reqPageNum = 1,
      reqPageSize = 10,
      sid = 0,
      admin = false,
      uid = 0,
    } = queryParam;
    reqPageNum = Number(reqPageNum);
    reqPageSize = Number(reqPageSize);
    console.log("请求参数", queryParam, sid);
    if (!admin) {
      let user_ship_relation = await UserShipRelation.findAndCountAll({
        where: {
          uid: uid,
        },
      });
      if (user_ship_relation.rows.length == 0) {
        throw new global.errs.QueryError("请先与无人船绑定", 60002);
      }
    }
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
      longitude: data.dataValues.longitude,
      latitude: data.dataValues.latitude,
    };
    if (!data) {
      throw new global.errs.QueryError("暂无无人船的航行数据", 60003);
    }
    let res = {
      msg: "ok",
      data: { ...data.dataValues, ...ship.dataValues },
      error_code: 0,
    };
    return res;
  }
  static async addData(param) {
    let status = 1;
    if (param.battery <= 0) {
      status = 0;
    } else if (param.speed > 20 || param.speed < 0) {
      status = 0;
    }
    param.status = status;
    console.log("无人船运行", param.status)
    await Ship.updateStatus({ sid: param.sid, status: param.status });
    let data = shipData.create(param);
    // console.log(data);
    return data;
  }
  // static async updateData(param) {
  //   let { id } = param;
  //   let paramData = {
  //     sid: 1,
  //     battery: 1,
  //     speed: 2.7,
  //     hum: 30,
  //     temp: 55,
  //     algae_finish: 25,
  //     algae_weight: 16,
  //     longitude: 113.032196,
  //     latitude: 28.236394,
  //     status: 1
  //   }
  //
  //   console.log("请求参数", param, uid);
  //   let data = await shipData.addData(
  //     {
  //       ...paramData, //要修改的数据
  //     },
  //     {
  //       where: { uid }, //查询修改项的条件
  //     }
  //   );
  //   if (data.length != 0) {
  //     throw new global.errs.Success("", 0, "修改成功");
  //   } else {
  //     throw new global.errs.EditError("修改失败");
  //   }
  // }
}
shipData.init(
  {
    id: {
      type: Sequelize.INTEGER,
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
    longitude: Sequelize.DECIMAL(10, 6),
    latitude: Sequelize.DECIMAL(10, 6),
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
