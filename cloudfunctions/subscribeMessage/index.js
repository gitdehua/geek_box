const cloud = require('wx-server-sdk')
cloud.init()
exports.main = async(event, context) => {
  try {
    const result = await cloud.openapi.subscribeMessage.send({
      touser: cloud.getWXContext().OPENID,
      page: 'index',
      data: {
        thing1: {
          value: '新作品推荐提醒'
        },
        time2: {
          value: '2019-04-24 00:15:37'
        },
        name3: {
          value: 'user'
        }
      },
      templateId: 'IbwPY-EFDw3J0TzjRHg6lSw2uJodKUGeICvb-NL0VCI'
    })
    console.log(result)
    return result
  } catch (err) {
    console.log(err)
    return err
  }
}