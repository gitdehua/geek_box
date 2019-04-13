// my_works/course/pages/import/school.js
const util = require('../../utils/util')
const host = util.host

Page({

  /**
   * 页面的初始数据
   */
  data: {
    options: null,
    step: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.request({
      url: `${host}/importCourse.php?action=getCookie`,
      complete: res => {
        console.log(res.data);
        if ((typeof res.data.msg) == "string" && res.data.msg == "ok") {
          this.setData({
            options: res.data.options
          });
          this.flush();
        } else {
          wx.showModal({
            content: "服务器异常",
            showCancel: false,
            complete: function() {
              wx.navigateBack({
                delta: 1
              });
            }
          });
        }
      }
    });
  },

  formSubmit: function(e) {
    var formData = e.detail.value;
    if ((JSON.stringify(formData).search(/\"\"/i)) > 0) {
      wx.showModal({
        content: "所有数据必填",
        showCancel: false
      });
      return false;
    }
    this.data.step.push("填写信息");
    this.data.step.push("登陆");
    this.setData({
      step: this.data.step
    });
    var options = this.data["options"];
    options.action = "login";
    options.checkCode = formData.checkCode;
    options.pass = formData.pass;
    options.stuId = formData.stuId
    wx.request({
      url: `${host}/importCourse.php`,
      method: "POST",
      data: options,
      success: res => {
        if (res.data.msg != "ok") {
          wx.showModal({
            title: "登录失败",
            content: res.data.log || "",
            showCancel: false,
            complete: () => {
              this.flush();
            }
          });
          return false;
        }
        console.log(res);
        this.getData();
        this.data.step.push("下载数据");
        this.setData({
          step: this.data.step
        });
      }
    });
  },

  getData: function(e) {
    wx.request({
      url: `${host}/importCourse.php`,
      method: "POST",
      data: {
        action: "getData",
        cookie: this.data["options"].cookie,
        stuId: this.data["options"].stuId
      },
      complete: res => {
        if ((typeof res.data.msg) == "string" && res.data.msg != "ok") {
          wx.showModal({
            content: "获取失败",
            showCancel: false
          });
          return false;
        }
        this.data.step.push("保存数据");
        this.setData({
          step: this.data.step
        });
        var course = res.data.result;
        this.saveData(course);
      }
    });
  },

  saveData: function(course) {
    wx.setStorage({
      key: 'course',
      data: course,
      success: () => {
        wx.showToast({
          title: `导入${course.courses.length}条数据`
        });
        setTimeout(function() {
          wx.navigateBack({
            delta: 1
          });
        }, 1000)
      }
    });
  },

  flush: function() {
    this.setData({
      checkCode: null,
      step: []
    })
    var options = this.data.options;
    wx.request({
      url: `${host}/importCourse.php`,
      data: {
        action: "getCheckCode",
        cookie: this.data["options"].cookie,
      },
      method: 'POST',
      responseType: "ArrayBuffer",
      success: (res) => {
        var uint8 = new Uint8Array(res.data);
        this.setData({
          checkCode: "data:image/gif;base64," + util.base64Encode(uint8)
        })
      }
    })
  }
})