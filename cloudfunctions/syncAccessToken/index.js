// 云函数入口文件
const cloud = require('wx-server-sdk');
var request = require('request');

cloud.init();
const db = cloud.database();

// 云函数入口函数
exports.main = async(event, context) => new Promise((resolve, reject) => {
  var url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${process.env.appid}&secret=${process.env.secret}`;

  request(url, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log(body) // 请求成功的处理逻辑
      try {
        body = JSON.parse(body);
        db.collection('app_config').doc('AccessToken').update({
          data: {
            value: body.access_token
          }
        }).then(function () {
          resolve(body);
        })
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
