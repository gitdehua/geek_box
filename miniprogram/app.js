//app.js
App({
  onLaunch: function() {

    wx.cloud.init({
      traceUser: true,
    });

    wx.request({
      url: 'https://www.dehuaio.com/api/GetClientIP.php',
      method: 'GET',
      success: function(res) {
        console.log(res);
        if (res.statusCode == 200) {
          const db = wx.cloud.database();
          db.collection('AppLaunchLog').add({
            data: {
              ip: res.data,
              date: new Date()
            }
          })
        }
      },
    });

    this.globalData = {
      userInfo: null
    }

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