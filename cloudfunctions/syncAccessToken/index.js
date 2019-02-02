// 云函数入口文件
const cloud = require('wx-server-sdk');
var request = require('request');
var crypto = require('crypto');

cloud.init();
const db = cloud.database();

// 云函数入口函数
exports.main = async(event, context) => new Promise((resolve, reject) => {
  var appid = "wx684dbb6844c8943a";
  var secret = "4ba300e73cb68eb1c269a3bb17568e8b";
  var url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appid}&secret=${secret}`;

  request(url, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log(body) // 请求成功的处理逻辑
      try {
        body = JSON.parse(body);
        syncDB(body).then(() => {
          db.collection('app_config').doc('AccessToken').update({
            data: {
              value: body.access_token
            }
          }).then(function() {
            resolve(body);
          })
        })
      } catch (e) {
        resolve(e);
      }
    } else {
      resolve({
        error,
        response,
        body
      })
    }
  });
});

function syncDB(data) {
  return new Promise((resolve, reject) => {
    try {
      var md5 = crypto.createHash('md5');
      request({
        url: "https://www.dehuaio.com/api/UpdateAccessToken.php",
        method: "POST",
        json: true,
        headers: {
          "content-type": "application/json",
          "content-md5": md5.update(JSON.stringify(data)).digest('hex')
        },
        body: data
      }, function(error, response, body) {
        console.log(error, body);
        resolve({
          error,
          response,
          body
        })
      });
    } catch (err) {
      console.log("try", err);
    }
  });
}