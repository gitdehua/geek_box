// pages/md5/md5.js
var CryptoJS = require('../../utils/crypto-js.min');

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  submit: function (e) {
    var content = e.detail.value.content;
    this.setData({
      result: CryptoJS.MD5(content).toString(CryptoJS.enc.Hex)
    })
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