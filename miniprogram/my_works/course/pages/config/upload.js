// pages/course/upload/upload.js
const util = require('../../utils/util')
const host = util.host

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 上传数据
   */
  uploadData: function(e) {
    if (e.detail.value.title.length < 10) {
      wx.showModal({
        title: '提示',
        content: '标题长度不能小于10',
        showCancel: false
      })
      return false;
    };
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    var course = this.data.course;
    var jsonString = JSON.stringify(course);
    var courseData = {
      title: e.detail.value.title,
      user: e.detail.value.nickName,
      data: jsonString,
      time: new Date().getTime()
    }
    wx.cloud.callFunction({
      name: 'upload_course',
      data: {
        _id: e.detail.value.id,
        data: courseData,
        form_id: e.detail.formId
      },
      success: res => {
        wx.hideLoading();
        console.log(res)
        wx.setStorage({
          key: 'course_upload',
          data: {
            title: courseData.title,
            nickName: courseData.user,
            id: res.result._id
          }
        })
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询失败',
        })
        console.error('调用失败：', err)
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var course = wx.getStorageSync('course');
    if (course == "" || course.courses.length == 0) {
      wx.showModal({
        title: "错误",
        content: '无内容',
        showCancel: false,
        complete: () => {
          wx.navigateBack({
            delta: 1
          })
        }
      });
      return false;
    }
    this.setData({
      course
    });
    wx.getStorage({
      key: 'course_upload',
      success: (res) => {
        this.setData(res.data)
      },
    })
  }
})