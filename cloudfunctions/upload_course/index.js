const cloud = require('wx-server-sdk')
cloud.init();
const db = cloud.database();

exports.main = async(event, context) => {
  console.log(event);
  var db_res, course_data = event.data;
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
          value: course_data.time
        },
        keyword4: {
          value: db_res._id
        },
        keyword5: {
          value: "上传的数据非私有保存，本小程序暂不提供类似服务。\n课表数据将公开给本小程序所有使用者",
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