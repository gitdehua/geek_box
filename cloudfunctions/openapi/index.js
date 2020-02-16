// 云函数入口文件
const cloud = require('wx-server-sdk')
const wxContext = cloud.getWXContext()
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()

// 云函数入口函数
exports.main = async(event, context) => new Promise((resolve, reject) => {
  switch (event.action) {
    case 'wxacodeUnlimited':
      wxacodeUnlimited(event, resolve, reject);
      break;
    default:
      reject("error");
  }
});

function wxacodeUnlimited(event, resolve, reject) {
  var {
    scene,
    page,
    autoColor
  } = event;
  cloud.openapi.wxacode.getUnlimited({
    scene,
    page,
    autoColor
  }).then(resolve).catch(reject);
}