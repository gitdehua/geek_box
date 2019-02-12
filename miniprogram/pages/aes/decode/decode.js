// pages/aes/decode/decode.js
var CryptoJS = require('../../../utils/crypto-js.min');

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData(options);
    wx.showLoading({
      title: "查询密文",
    })
    const db = wx.cloud.database();
    db.collection('aes').where({
      _id: options.aes_id
    }).get({
      success: res => {
        console.log(res.data)
        if (!res.data || res.data.length == 0) {
          wx.hideLoading();
          wx.showToast({
            title: "该卡片已过期",
            icon: "loading"
          });
          return;
        }
        this.setData({
          content: res.data[0].content
        })
        db.collection('aes').doc(options.aes_id).update({
          data: {
            count: res.data[0].count + 1
          }
        });
        wx.hideLoading();
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
  },

  submit: function(e) {
    var result = "",
      content = this.data.content,
      key = e.detail.value.key;

    try {
      result = CryptoJS.enc.Utf8.stringify(CryptoJS.AES.decrypt(content, key));
      if (!result) throw "";
    } catch (err) {
      wx.showToast({
        title: `解密失败,请核实密钥\n${err}`,
        icon: "none"
      });
    }
    this.setData({
      result
    });
  },

  onShareAppMessage: function() {
    var nickName = "好友";
    try {
      nickName = getApp().globalData.userInfo.nickName;
    } catch (e) {}
    return {
      title: `【加密内容】看看 ${nickName} 说了什么`,
      path: `pages/aes/decode/decode?aes_id=${this.data.aes_id}`,
      imageUrl: "https://www.dehuaio.com/encrypt.jpg"
    }
  }
})