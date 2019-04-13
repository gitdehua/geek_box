// my_works/course/pages/subjects/edit.js
var courseTool = require('../../utils/courseTool.js');

function maxId(subjects) {
  var maxId = 0;
  if ((typeof subjects) == "object" && (typeof subjects.length) == "number") {
    for (var i = 0; i < subjects.length; i++) {
      if (parseInt(subjects[i].subjectId) > maxId) {
        maxId = parseInt(subjects[i].subjectId);
      }
    }
  }
  return (maxId + 1).toString();
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    options: null
  },

  //提交事件
  formSubmit: function (e) {
    console.log(e.detail.value);
    var formData = e.detail.value;
    if (formData.course == "" || formData.teacher == "") {
      wx.showModal({
        content: '数据不能为空',
        showCancel: false
      });
      return false;
    }
    var action, index;
    if (this.data["options"] != null) {
      formData.subjectId = this.data["subjectInfo"].subjectId;
      action = "updateSubject";
      index = this.data["options"].index;
    } else {
      formData.subjectId = maxId(this.data["subjects"]);
      action = "insertSubject";
    }
    courseTool.setStorage({
      action,
      data: formData,
      index,
      init: function () {
        wx.showModal({
          content: "完成",
          showCancel: false,
          complete: function () {
            wx.navigateBack({
              delta: 1
            })
          }
        });
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var subjects = wx.getStorageSync('course').subjects || [];
    this.setData({
      subjects
    })
    if (options.index != null) {
      var subjectInfo = subjects[options.index];
      this.setData({
        subjectInfo,
        options
      });
    }
  }
})