// my_works/course/pages/subjects/list.js
var courseTool = require('../../utils/courseTool.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    subjects: null
  },

  //跳转编辑页面
  navigateTo: function (e) {
    wx.navigateTo({
      url: "my_works/my_works/course/pages/subjects/edit?index=" + e.currentTarget.dataset.index
    });
  },

  //删除数据
  deleteData: function (e) {
    var _Page = this;
    courseTool.setStorage({
      action: "deleteSubject",
      index: e.currentTarget.dataset.index,
      init: function (course) {
        wx.showLoading({
          title: 'loading',
          mask: true
        });
        _Page.setData({
          subjects: course.subjects
        });
        wx.hideLoading();
      }
    });
  },

  onShow: function (options) {
    var subjects = wx.getStorageSync('course').subjects || [];
    this.setData({
      subjects
    })
  }
})