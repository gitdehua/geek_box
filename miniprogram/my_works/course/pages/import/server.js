// my_works/course/pages/import/server.js
const db = wx.cloud.database()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    courseList: null,
    index: 0
  },

  /**
   * 下拉列表
   */
  bindPickerChange: function(e) {
    console.log(e)
    this.setData({
      index: e.detail.value
    })
  },

  /**
   * 数据下载
   */
  formSubmit: function(e) {
    wx.showLoading({
      title: '下载数据...',
      mask: true
    });
    var index = this.data.courseList[e.detail.value.id]._id;
    db.collection('course').where({
      _id: index
    }).get().then(res => {
      console.log(res.data)
      var courseData = JSON.parse(res.data[0].data);
      wx.setStorageSync("course", courseData);
      if (e.detail.value.sync) {
        wx.setStorageSync("sync_course", {
          _id: res.data[0]._id,
          time: res.data[0].time
        })
      } else {
        wx.removeStorage({
          key: 'sync_course'
        })
      }
      wx.hideLoading();
      wx.showModal({
        title: '下载完成',
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: '获取列表...',
      mask: true
    });
    db.collection('course').orderBy('time', 'desc').field({
      _id: true,
      title: true,
      time: true,
      user: true
    }).get().then(res => {
      console.log(res.data)
      var courseList = res.data;
      for (var i = 0; i < courseList.length; i++) {
        console.log(courseList[i].time)
        courseList[i].time = new Date(courseList[i].time).format("yyyy-MM-dd hh:mm:ss");
      }
      this.setData({
        courseList
      });
      wx.hideLoading();
    });
    wx.getStorage({
      key: 'sync_course',
      success: (res) => {
        this.setData({
          syncId: res.data._id
        })
      },
    })
  }
})