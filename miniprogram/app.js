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

    wx.getStorage({
      key: 'sync_course',
      success: function(res) {
        console.log(res.data)
        const db = wx.cloud.database();
        const _ = db.command;
        db.collection('course').orderBy('date', 'desc').where({
          _id: res.data._id,
          time: _.gt(res.data.time)
        }).limit(1).get().then(res => {
          console.log(res)
          if (res.data.length == 0) return;
          var courseData = JSON.parse(res.data[0].data);
          wx.setStorageSync("course", courseData);
          wx.setStorageSync("sync_course", {
            _id: res.data[0]._id,
            time: res.data[0].time
          });
          wx.showModal({
            title: '课程更新完成',
            content: '相关组件需要重新加载',
            showCancel: false,
            complete: () => {
              wx.switchTab({
                url: '/pages/index/index',
              })
            }
          })
          console.log("导入数据：", courseData);
        });
      },
    });
  },

  onPageNotFound(res) {
    wx.switchTab({
      url: 'pages/index/index'
    })
  }
})