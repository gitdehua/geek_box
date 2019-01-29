// pages/aes/encode/encode.js
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
    wx.hideShareMenu();
  },

  submit: function(e) {
    wx.showLoading({
      title: "加密中",
      mask: true
    })
    var result,
      content = e.detail.value.content,
      key = e.detail.value.key;
    result = CryptoJS.AES.encrypt(content, key).toString()
    const db = wx.cloud.database();
    db.collection('aes').add({
      data: {
        count: 0,
        content: result,
        data: new Date()
      },
      success: res => {
        this.setData({
          counterId: res._id,
          result
        });
        console.log('新增记录成功，记录 _id: ', res._id);
        wx.hideLoading();
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '新增记录失败'
        })
        console.error('[数据库] [新增记录] 失败：', err)
      }
    })
  },

  onShareAppMessage: function(res) {
    var data = {
      title: '好友向你发送了一段密文',
      path: `pages/aes/decode/decode?aes_id=${this.data.counterId}`,
      imageUrl: "https://www.dehuaio.com/encrypt.jpg"
    }
    return data;
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