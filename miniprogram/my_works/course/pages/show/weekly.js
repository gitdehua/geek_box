// my_works/course/pages/show/weekly.js
var getCourse = require('../../utils/courseTool.js').getCourse;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    courses: null,
    color: ["#f66", "#6c3", "#c3c", "#3ca", "#83c", "#d63", "#a06", "#07f", "#f90", "#c39", "#5b5"],
    maxWeek: 0,
    animationData: {},
    controlLeft: "560rpx"
  },

  onLoad: function(options) {
    var course = wx.getStorageSync("course");
    var week;
    if ((typeof this.data["week"]) == "number") {
      week = this.data["week"];
      console.log("num", week)
    } else {
      week = parseInt((new Date().getTime() - new Date(course.startDate).getTime()) / (1000 * 3600 * 24 * 7)) + 1;
      week = week <= 0 ? 1 : week;
    }
    var courses = getCourse("week", week);
    if (course == "" || (typeof course.startDate) != "string" || (typeof course.courses) != "object") {
      return false;
    }
    var maxWeek = 0;
    for (var i = 0; i < course.courses.length; i++) {
      if (parseInt(course.courses[i].end) > maxWeek) {
        maxWeek = course.courses[i].end;
      }
    }
    this.setData({
      courses,
      subjects: course.subjects,
      week,
      maxWeek: parseInt(maxWeek) + 1
    });
  },

  changeWeek: function(e) {
    if (e.changedTouches.length == 0) {
      return false;
    }
    console.log(e);
    if (e.type == "touchstart") {
      this.setData({
        touchstartX: e.changedTouches[0].clientX
      });
      return false;
    }
    var index = e.changedTouches[0].clientX >= this.data["touchstartX"] ? 1 : -1;
    index += this.data["week"];
    if (index <= 0 || index > this.data["maxWeek"]) {
      var content = index > 0 ? "没课了，放假了 ^ ‿ ^" : "超范围了 ⊙ o ⊙ ";
      wx.showModal({
        content,
        showCancel: false
      });
      return false;
    }
    this.setData({
      courses: null
    });
    var courses = getCourse("week", index);
    this.setData({
      courses,
      week: index
    });
  },

  onReady: function() {
    const $ = wx.createSelectorQuery()
    const target = $.select('.getsize')
    target.boundingClientRect()

    $.exec((res) => {
      const rect = res[0]
      if (rect) {
        this.setData({
          cell_w: rect.width,
          cell_h: rect.height
        });
      }
    })
  }
})