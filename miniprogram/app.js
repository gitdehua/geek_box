//app.js
import "./utils/init.js";
class GlobalData {
  userInfo;
  getUserInfo() {
    if (this.userInfo) {
      return this.userInfo;
    } else {
      wx.navigateTo({
        url: '/pages/authorize/authorize?scope=userInfo',
      });
      return;
    }
  }
}

App({
  globalData: new GlobalData(),

  onLaunch: function() {

    wx.cloud.init();

    getUserInfo();

    // 获取主机
    getAppHost();

    syncCourse();
  },

  onPageNotFound(res) {
    wx.switchTab({
      url: 'pages/index/index'
    })
  }
});

function getUserInfo() {
  wx.getStorage({
    key: 'user_info',
    success: function(res) {
      getApp().globalData.userInfo = res.data;
    }
  })
}

function syncCourse() {
  wx.getStorage({
    key: 'sync_course',
    success: function(res) {
      const db = wx.cloud.database();
      const _ = db.command;
      db.collection('course').orderBy('date', 'desc').where({
        _id: res.data._id,
        time: _.gt(res.data.time)
      }).limit(1).get().then(res => {
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
}

function getAppHost() {
  const db = wx.cloud.database()
  db.collection('app_config').doc('host').get().then(res => {
    getApp().globalData.host = res.data.value;
  });
}