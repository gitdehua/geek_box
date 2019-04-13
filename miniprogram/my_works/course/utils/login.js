const host = require('./util').host;

function login(options) {
  // 登录
  wx.login({
    success: function(res) {
      if (res.code) {
        //发起网络请求
        wx.request({
          url: `${host}/loginFromWechat.php`,
          data: {
            id: "wxapp",
            code: res.code
          },
          success: res => {
            console.log("session: ", res.data);
            if (res.data.msg == "ok") {
              wx.setStorageSync("loginData", res.data.result);
              if ((typeof options == "object")&&(typeof options.complete == "function")) {
                options.complete(res.data.result);
              }
            }
          }
        })
      } else {
        console.log('获取用户登录态失败！' + res.errMsg);
      }
    }
  });
}

module.exports = login;