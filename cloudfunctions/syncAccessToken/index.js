// 云函数入口文件
const cloud = require('wx-server-sdk');
var request = require('request');
var mysql = require('mysql');

cloud.init();
const db = cloud.database();

// 云函数入口函数
exports.main = async(event, context) => new Promise((resolve, reject) => {
  var url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${process.env.appid}&secret=${process.env.secret}`;

  request(url, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log(body) // 请求成功的处理逻辑

      var statuts = 0;

      function _return() {
        if (statuts == 1) {
          resolve(body);
        } else {
          statuts++;
        }
      }
      try {
        body = JSON.parse(body);
        db.collection('app_config').doc('AccessToken').update({
          data: {
            value: body.access_token
          }
        }).then(function () {
          console.log(`\n------------------UPDATE------------------ncloud db\n------------------n\n`);
          _return("cloud_db");
        });

        var connection = mysql.createConnection({
          host: process.env.dbHost,
          user: process.env.dbUser,
          password: process.env.dbPassword,
          database: process.env.dbDatabase
        });

        connection.connect();

        var modSql = "UPDATE `wxapp` SET `value` = ?, `update_time` = NOW() WHERE `key` = 'accessToken';";
        var modSqlParams = [body.access_token];

        connection.query(modSql, modSqlParams, function(err, result) {
          if (err) {
            reject('[UPDATE ERROR] - ', err.message);
            return;
          }
          console.log(`\n------------------UPDATE------------------nUPDATE affectedRows ${result.affectedRows}\n------------------n\n`);
          _return("mysql");
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