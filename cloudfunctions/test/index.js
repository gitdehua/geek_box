const cloud = require('wx-server-sdk')
cloud.init()
exports.main = async(event, context) => {
  try {
    const result = await cloud.openapi.templateMessage.send({
      touser: event.userInfo.openId,
      page: 'my_works/course/pages/config/upload',
      data: {
        keyword1: {
          value: '339208499'
        },
        keyword2: {
          value: '2015年01月05日 12:30'
        },
        keyword3: {
          value: '腾讯微信总部'
        },
        keyword4: {
          value: '广州市海珠区新港中路397号'
        },
        keyword5: {
          value: '广州市海珠区新港中路397号'
        }
      },
      templateId: 'ONqET2ofGxqJytii5MldQyICp5ZTknSN4qYJSZMqI3M',
      formId: event.formId
    })
    console.log(result)
    return result
  } catch (err) {
    console.log(err)
    return err
  }
}