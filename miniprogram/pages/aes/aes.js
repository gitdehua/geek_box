// pages/aes/aes.js
var CryptoJS = require('../../utils/crypto-js.min');

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  submit: function(e) {
    var result = "",
      content = e.detail.value.content,
      key = e.detail.value.key;
    if (e.detail.target.dataset.action == "encode") {
      result = CryptoJS.AES.encrypt(content, key).toString()
    } else {
      try {
        result = CryptoJS.enc.Utf8.stringify(CryptoJS.AES.decrypt(content, key));
        if (!result) throw "请核实密钥";
      } catch (err) {
        wx.showToast({
          title: `解密失败 ${err}`,
          icon: "none"
        });
      }
    }
    this.setData({
      result
    });
  },

  copy: function() {
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