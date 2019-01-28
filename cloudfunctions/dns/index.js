// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => new Promise((resolve, reject) => {
  console.log(event);
  if (event.useServer) {
    const {
      Resolver
    } = require('dns');
    const resolver = new Resolver();

    resolver.setServers([event.server]);
    resolver.resolveAny(event.name, (err, res) => {
      resolve(JSON.stringify(res));
    });
  } else {
    const dns = require('dns');

    dns.resolveAny(event.name, (err, res) => {
      resolve(JSON.stringify(res));
    });
  }
})