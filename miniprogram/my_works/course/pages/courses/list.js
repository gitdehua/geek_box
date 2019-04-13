// my_works/course/pages/courses/list.js
var courseTool = require('../../utils/courseTool.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    courses: null,
    subjects: null,
    filter: 0,
    whenBack: null
  },

  bindPickerChange: function (e) {
    this.setData({
      filter: e.detail.value
    })
  },

  //跳转编辑页面
  navigateTo: function (e) {
    wx.navigateTo({
      url: "my_works/pages/course/courses/edit?index=" + e.currentTarget.dataset.index
    });
  },

  //删除数据
  deleteData: function (e) {
    var _Page = this;
    courseTool.setStorage({
      action: "deleteCourse",
      index: e.currentTarget.dataset.index,
      init: function (course) {
        wx.showLoading({
          title: 'loading',
          mask: true
        });
        _Page.setData({
          courses: course.courses
        });
        wx.hideLoading();
      }
    });
  },

  onShow: function (options) {
    var courses = wx.getStorageSync('course').courses || [];
    var subjects = wx.getStorageSync('course').subjects || [];
    subjects.unshift({ "subjectId": null, "subject": "所有" });
    this.setData({
      courses,
      subjects
    });
  }
})