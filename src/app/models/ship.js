const { Sequelize, Model } = require("sequelize");
const { UserShipRelation } = require("./userShipRelation");
const { sequelize } = require("../../core/db");
const { Camera } = require("./camera");

class Ship extends Model {
  static async getShipData(queryParam) {
    let {
      reqPageNum = 1,
      reqPageSize = 10,
      uid = 0,
      admin = false,
    } = queryParam;
    reqPageNum = Number(reqPageNum);
    reqPageSize = Number(reqPageSize);
    let data;
    if (!admin) {
      let userShipRelation = await UserShipRelation.findOne({
        where: {
          uid: uid,
        },
      });
      if (!userShipRelation) {
        throw new global.errs.QueryError(
          "该用户没有所属的无人船, 请先绑定无人船",
          60001
        );
      }
      data = await Ship.findAndCountAll({
        where: {
          sid: userShipRelation.sid,
        },
        include: [
          {
            association: Ship.hasMany(Camera, { foreignKey: "cid" }),
          },
        ],
      });
    } else {
      data = await Ship.findAndCountAll({
        offset: (reqPageNum - 1) * reqPageSize,
        limit: reqPageSize,
        distinct: true,
        include: [
          {
            association: Ship.hasMany(Camera, { foreignKey: "cid" }),
          },
        ],
      });
      console.log("data", data);
    }
    if (!data) {
      throw new global.errs.QueryError("该无人船的数据不存在", 60002);
    }

    // console.log(req)
    return { shipInfoList: data.rows, ...queryParam };
  }
  static async updateStatus(param) {
    let data = await Ship.update(
      {
        status: param.status, //要修改的数据
      },
      {
        where: { sid: param.sid }, //查询修改项的条件
      }
    );
    if (!data[0]) {
      throw new global.errs.NotFound("该无人船不存在");
    }
  }
  static async addShip(param) {
    let { cid = 0 } = param;
    let camera = await Ship.findAndCountAll({
      where: {
        cid: cid,
      },
    });
    if (camera.rows.length != 0) {
      throw new global.errs.QueryError("摄像头已经绑定, 添加失败", 60002);
    }
    await Ship.create(param);
  }
  static async updateShip(param) {
    let { sid } = param;
    let data = await Ship.update(
      {
        ...param,
      },
      {
        where: { sid }, //查询修改项的条件
      }
    );
    // console.log("修改", data)
    if (data.length != 0) {
      throw new global.errs.Success("", 0, "修改成功");
    } else {
      throw new global.errs.EditError("修改失败");
    }
  }
}

Ship.init(
  {
    sid: {
      type: Sequelize.INTEGER,
      //设置为主键  关系型数据库
      //不能重复 不能为空
      //最好为数字，便于查询
      //如果只是简单的自增，并发条件下可能出错
      primaryKey: true,
      //设置自增
      autoIncrement: true,
    },
    cid: Sequelize.INTEGER,
    name: Sequelize.STRING,
    status: {
      type: Sequelize.INTEGER,
      defaultValue: 2,
    },
  },
  { sequelize, tableName: "ship" }
);

module.exports = {
  Ship,
};
//数据迁移 SQL 更新 风险
