// my_works/course/pages/config/setDate.js
var courseTool = require('../../utils/courseTool');
var util = require('../../utils/util');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: null,
    weekString: null
  },

  dateChange: function (e) {
    console.log(e);
    var date = new Date(e.detail.value);
    var timeStamp = ((date.getDay() == 0 ? 7 : date.getDay()) - 1) * 1000 * 3600 * 24;
    date = new Date(date.getTime() - timeStamp);
    this.setData({
      date: util.formatTime(date, "-").date,
      weekString: util.formatWeek(date.getDay())
    });
  },

  saveDate: function (e) {
    console.log("设置日期", e.detail.value.startDate);
    courseTool.setStorage({
      action: "setDate",
      data: e.detail.value.startDate,
      init: function () {
        wx.showToast({
          title: "已保存"
        });
        setTimeout(function () {
          wx.navigateBack({
            delta: 1
          });
        }, 1000)
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    try {
      var startDate = wx.getStorageSync('course').startDate;
      startDate = startDate ? new Date(startDate) : new Date();
      this.setData({
        date: util.formatTime(startDate, "-").date,
        weekString: util.formatWeek(startDate.getDay())
      });
    } catch (e) {
      console.log(e);
    }
  }
})