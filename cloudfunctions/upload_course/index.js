const cloud = require('wx-server-sdk')
cloud.init();
const db = cloud.database();


Date.prototype.getTimezone = function() {
  var offset = this.getTimezoneOffset();
  var mark = offset < 0 ? "+" : "-";
  offset = Math.abs(offset);
  return "GMT" + mark + [
    parseInt(offset / 60),
    offset % 60
  ].map(e => {
    return e.toString()[1] ? e : '0' + e;
  }).join('');
}

Date.prototype.Format = function(fmt, timezone) {
  var _date = this;
  if (timezone) {
    if (typeof timezone != "string" || !/\+\d{4}/.test(timezone)) throw "param timezone error";
    var timestamp = this.getTime() + this.getTimezoneOffset() * 60 * 1000;
    var offset = (parseInt(timezone[1] + timezone[2]) * 60 + parseInt(timezone[3] + timezone[4])) * 60 * 1000;
    timestamp = timestamp + (timezone[0] == "+" ? offset : -offset);
    _date = new Date(timestamp)
    console.log(_date, _date.getHours(), new Date())
  }

  var o = {
    "M+": _date.getMonth() + 1, //月份 
    "d+": _date.getDate(), //日 
    "h+": _date.getHours(), //小时 
    "m+": _date.getMinutes(), //分 
    "s+": _date.getSeconds(), //秒 
    "S": _date.getMilliseconds(), //毫秒 
    "Z": timezone ? "GMT" + timezone : _date.getTimezone()
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}

exports.main = async(event, context) => {
  console.log(event);
  var db_res, course_data = event.data;
  course_data._openid = event.userInfo.openId;
  if (event._id) {
    db_res = await db.collection('course').doc(event._id).update({
      // data 传入需要局部更新的数据
      data: course_data
    });
    db_res._id = event._id;
  } else {
    db_res = await db.collection('course').add({
      // data 字段表示需新增的 JSON 数据
      data: course_data
    })
  }
  console.log("\n---- 数据库：", db_res)

  try {
    const result = await cloud.openapi.templateMessage.send({
      touser: event.userInfo.openId,
      page: 'my_works/course/pages/courses/list',
      data: {
        keyword1: {
          value: course_data.title
        },
        keyword2: {
          value: course_data.user
        },
        keyword3: {
          value: new Date(course_data.time).Format("yyyy-MM-dd hh:mm:ss Z", "+0800")
        },
        keyword4: {
          value: db_res._id
        },
        keyword5: {
          value: "序号是你更新数据的唯一标识\n上传的数据非私有储存，课表数据将公开给本小程序所有使用者",
          color: "#09bb07"
        }
      },
      templateId: 'ONqET2ofGxqJytii5MldQyICp5ZTknSN4qYJSZMqI3M',
      formId: event.form_id,
    })
    console.log("消息发送结果", result)
  } catch (err) {
    console.log(err)
  }
  return db_res
}