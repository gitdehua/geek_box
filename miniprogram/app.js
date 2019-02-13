//app.js
App({
  globalData: {},

  onLaunch: function() {

    wx.cloud.init();

    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success(res) {
              getApp().globalData.userInfo = res.userInfo
            }
          })
        }
      }
    });
  },

  onPageNotFound(res) {
    wx.switchTab({
      url: 'pages/index/index'
    })
  }
})