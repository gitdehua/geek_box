// my_works/course/pages/course/course.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var course = wx.getStorageSync("course");
    if (course != "") {
      var courses = course.courses.length > 0 ? course.courses : null;
      var subjects = course.subjects.length > 0 ? course.subjects : null;
      var startDate = course.startDate;
      this.setData({
        courses,
        subjects,
        startDate
      })
    }
  }
})