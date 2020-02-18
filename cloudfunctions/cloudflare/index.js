const qs = require('querystring');
var request = require("request");

// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async(event, context) => new Promise((resolve, reject) => {
  switch (event.action) {
    case 'getZones':
      getZones(event, resolve, reject);
      break;
    case 'getDnsRecords':
      getDnsRecords(event, resolve, reject);
      break;
    case 'createDnsRecord':
      createDnsRecord(event, resolve, reject);
      break;
    case 'updateDnsRecord':
      updateDnsRecord(event, resolve, reject);
      break;
    case 'deleteDnsRecord':
      deleteDnsRecord(event, resolve, reject);
      break;
    default:
      reject("error");
  }
});

function getZones(event, resolve, reject) {
  let options = {
    url: 'https://api.cloudflare.com/client/v4/zones?' + qs.stringify({
      name: event.domainName
    }),
    headers: {
      "Authorization": `Bearer ${event.token}`,
      "Content-Type": "application/json"
    }
  };

  request.get(options, function(err, res, body) {
    console.log(err, res, body)
    if (!err) {
      resolve(res);
    } else {
      reject(JSON.stringify({
        err,
        res
      }));
    }
  });
}

function getDnsRecords(event, resolve, reject) {
  let options = {
    url: `https://api.cloudflare.com/client/v4/zones/${event.zoneId}/dns_records?page=${event.page}`,
    headers: {
      "Authorization": `Bearer ${event.token}`,
      "Content-Type": "application/json"
    }
  };

  request.get(options, function(err, res, body) {
    console.log(err, res, body)
    if (!err) {
      resolve(res);
    } else {
      reject(JSON.stringify({
        err,
        res
      }));
    }
  });
}

function createDnsRecord(event, resolve, reject) {
  let options = {
    url: `https://api.cloudflare.com/client/v4/zones/${event.zoneId}/dns_records`,
    headers: {
      "Authorization": `Bearer ${event.token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(event.record)
  };

  request.post(options, function(err, res, body) {
    console.log(err, res, body)
    if (!err) {
      resolve(res);
    } else {
      reject(JSON.stringify({
        err,
        res
      }));
    }
  });
}

function updateDnsRecord(event, resolve, reject) {
  let options = {
    url: `https://api.cloudflare.com/client/v4/zones/${event.zoneId}/dns_records/${event.recordId}`,
    headers: {
      "Authorization": `Bearer ${event.token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(event.record)
  };

  request.put(options, function(err, res, body) {
    console.log(err, res, body)
    if (!err) {
      resolve(res);
    } else {
      reject(JSON.stringify({
        err,
        res
      }));
    }
  });
}

function deleteDnsRecord(event, resolve, reject) {
  let options = {
    url: `https://api.cloudflare.com/client/v4/zones/${event.zoneId}/dns_records/${event.recordId}`,
    headers: {
      "Authorization": `Bearer ${event.token}`,
      "Content-Type": "application/json"
    }
  };

  request.delete(options, function(err, res, body) {
    console.log(err, res, body)
    if (!err) {
      resolve(res);
    } else {
      reject(JSON.stringify({
        err,
        res
      }));
    }
  });
}