// 云函数入口文件
const cloud = require('wx-server-sdk');
var request = require('request');

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => new Promise((resolve, reject) => {
  var url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${process.env.appid}&secret=${process.env.secret}`;

  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log(body) // 请求成功的处理逻辑
      try {
        body = JSON.parse(body);
        var connection = mysql.createConnection({
          host: process.env.dbHost,
          user: process.env.dbUser,
          password: process.env.dbPassword,
          database: process.env.dbDatabase,
          timezone: '-06:00'
        });

        connection.connect();

        var modSql = "UPDATE `wxapp` SET `value` = ?, `update_time` = NOW() WHERE `key` = 'accessToken';";
        var modSqlParams = [body.access_token];

        connection.query(modSql, modSqlParams, function (err, result) {
          if (err) {
            reject('[UPDATE ERROR] - ', err.message);
            return;
          }
          console.log('--------------------------UPDATE----------------------------');
          console.log('UPDATE affectedRows', result.affectedRows);
          console.log('-----------------------------------------------------------------\n\n');
          db.collection('app_config').doc('AccessToken').update({
            data: {
              value: body.access_token
            }
          }).then(function () {
            resolve(body);
          })
        });
      } catch (e) {
        reject(e);
      }
    } else {
      reject({
        error,
        response,
        body
      })
    }
  });
});