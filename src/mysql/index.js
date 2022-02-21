var mysql = require("mysql");
var pool = mysql.createPool({
  host: "39.101.202.100",
  user: "root",
  password: "123456a",
  database: "mall_tiny",
});

class Mysql {
  connect() {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) {
          console.log("连接失败！！");
          reject(err);
        } else {
          resolve(connection);
        }
      });
    });
  }
  async query(param) {
    let connection = await this.connect();
    return new Promise((resolve, reject) => {
      //  ums_menu 数据表
      connection.query(
        `select * from ums_menu where name = '${param}'`,
        (error, result) => {
          if (error) {
            return reject(error);
          }
          resolve(result);
        }
      );
      // 释放
      connection.release();
    });
  }
}
module.exports = new Mysql();
