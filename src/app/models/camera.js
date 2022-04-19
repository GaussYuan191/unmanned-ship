const { Sequelize, Model } = require("sequelize");
const { sequelize } = require("../../core/db");
class Camera extends Model {
  static async getVideo(queryParam) {
    let { cid = "" } = queryParam;
    let data = await Camera.findAndCountAll({
      where:{
        cid
      }
    })
    console.log(data.rows)
    if (data.rows.length == 0) {
      throw new global.errs.QueryError("该摄像头的视频地址不存在", 60002);
    }
    return data.rows;
  }
}

Camera.init(
  {
    cid: {
      type: Sequelize.INTEGER,
      //设置为主键  关系型数据库
      //不能重复 不能为空
      //最好为数字，便于查询
      //如果只是简单的自增，并发条件下可能出错
      primaryKey: true,
      //设置自增
      autoIncrement: true,
    },
    cstatus: Sequelize.INTEGER,
    url: Sequelize.STRING,
  },
  { sequelize, tableName: "camera" }
);

module.exports = {
  Camera,
};
//数据迁移 SQL 更新 风险
