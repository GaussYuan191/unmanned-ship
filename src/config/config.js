module.exports = {
  // prod dev
  env: 'dev',
  database: {
    dbName: 'unmanned_ship',
    host: '124.222.218.232',
    port: 3306,
    user: 'root',
    password: '123456a'
  },
  security: {
    secretKey: "kumaloveslife",
    expiresIn: 60*60*24
  },
  wx: {
    appId: 'wxadee006ee825d93f',
    appSecret: '1e192f2069faac1458d3194e1c608bb5',
    loginUrl: 'https://api.weixin.qq.com/sns/jscode2session?appid=%s&secret=%s&js_code=%s&grant_type=authorization_code'
  },
  yushu: {
    detailUrl: 'http://t.yushu.im/v2/book/id/%s',
    keywordUrl: 'http://t.yushu.im/v2/book/search?q=%s&start=%s&count=%s&summary=%s'
  },
  host: 'http://localhost:3000/'
}