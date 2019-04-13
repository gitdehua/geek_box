// my_works/course/pages/courses/edit.js
var courseTool = require('../../utils/courseTool.js');

function idToIndex(array, id) {
  for (var i = 0; i < array.length; i++) {
    if (array[i].subjectId == id) {
      return i;
    }
  }
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    options: null,
    week: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
    subjectIndex: 0,
    condition: "3",
    weekIndex: 0
  },

  subjectChange: function (e) {
    this.setData({
      subjectIndex: e.detail.value
    })
  },

  weekChange: function (e) {
    this.setData({
      weekIndex: e.detail.value
    })
  },

  //提交事件
  formSubmit: function (e) {
    var formData = e.detail.value;
    if ((typeof this.data["subjects"]) != "object" || this.data["subjects"].length == 0) {
      wx.showModal({
        content: "无科目信息",
        showCancel: false
      });
      return false;
    }
    if ((JSON.stringify(formData).search(/\"\"/i)) > 0) {
      wx.showModal({
        content: "所有数据必填",
        showCancel: false
      });
      return false;
    }
    if (parseInt(formData.start) > parseInt(formData.end)) {
      wx.showModal({
        content: "开始日期不得大于结束日期",
        showCancel: false
      });
      return false;
    }
    if (parseInt(formData.courseTime) > 10 || parseInt(formData.timeEnd) > 10) {
      wx.showModal({
        content: "开始结束时间不得大于10",
        showCancel: false
      });
      return false;
    }
    if (parseInt(formData.courseTime) > parseInt(formData.timeEnd)) {
      wx.showModal({
        content: "开始时间不得大于结束时间",
        showCancel: false
      });
      return false;
    }
    var data = {
      subjectId: this.data["subjects"][formData.subjectIndex].subjectId,
      start: formData.start,
      end: formData.end,
      condition: formData.condition.toString(),
      dayInWeek: String(formData.weekIndex),
      courseTime: String(formData.courseTime),
      timeLength: String(parseInt(formData.timeEnd) - parseInt(formData.courseTime) + 1),
      locale: formData.locale
    };
    console.log(data);

    var action, index;
    if (this.data["options"] != null) {
      action = "updateCourse";
      index = this.data["options"].index;
    } else {
      action = "insertCourse";
    }
    courseTool.setStorage({
      action,
      data: data,
      index,
      init: function () {
        wx.showModal({
          content: "完成",
          showCancel: false,
          complete: function () {
            wx.navigateBack({
              delta: 1
            });
          }
        });
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.index != null) {
      try {
        var course = wx.getStorageSync('course');
        var courseData = course.courses[options.index];
        if (courseData) {
          this.setData({
            options: options,
            subjectIndex: idToIndex(course.subjects, courseData.subjectId),
            start: courseData.start,
            end: courseData.end,
            condition: courseData.condition,
            weekIndex: parseInt(courseData.dayInWeek),
            locale: courseData.locale,
            courseTime: courseData.courseTime,
            timeEnd: parseInt(courseData.courseTime) + parseInt(courseData.timeLength) - 1
          });
        }
      } catch (e) {
        console.log(e);
      }
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (e) {
    var subjects = wx.getStorageSync('course').subjects;
    this.setData({
      subjects: subjects || []
    });
  }
})