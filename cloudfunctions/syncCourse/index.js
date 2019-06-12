// 云函数入口文件
const cloud = require('wx-server-sdk');
var mysql = require('mysql');

cloud.init();
const db = cloud.database();
const _ = db.command

// 云函数入口函数
exports.main = async(event, context) => new Promise((resolve, reject) => {
  try {
    var connection = mysql.createConnection({
      host: process.env.db_host,
      user: process.env.db_user,
      password: process.env.db_password,
      database: process.env.db_database,
      timezone: '+08:00'
    });

    connection.connect();
    var sql = 'SELECT * FROM `wxappCourse` ORDER BY `date` DESC  LIMIT 1;';
    //查
    connection.query(sql, function(err, result) {
      if (err) {
        reject('[SELECT ERROR] - ', err.message);
        return;
      }
      db.collection('course').where({
        _id: "XLB5aYnnuWjci1BP"
      }).update({
        data: {
          data: result[0].content,
          time: result[0].date.getTime()
        }
      }).then(function(res) {
        resolve(res, result[0].date.getTime());
      })
      console.log('--------------------------SELECT----------------------------');
      console.log(result);
      console.log('------------------------------------------------------------\n\n');
    });
    connection.end();
  } catch (e) {
    reject(e);
  }
});