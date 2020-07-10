// pages/base64/base64.js
var CryptoJS = require('../../utils/crypto-js.min');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    content: ""
  },

  submit: function (e) {
    var result = "",
      content = this.data.content;
    if (e.target.dataset.action == "encode") {
      result = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(content))
    } else {
      try {
        result = CryptoJS.enc.Utf8.stringify(CryptoJS.enc.Base64.parse(content));
      } catch (err) {
        wx.showToast({
          title: "解密失败",
          icon: "none"
        })
      }
    }
    this.setData({
      result
    });
  },

  copy: function () {
    if (!this.data.result) return;
    wx.setClipboardData({
      data: this.data.result,
      success: () => {
        wx.showToast({
          title: "复制成功",
          icon: "none"
        })
      }
    })
  }
})