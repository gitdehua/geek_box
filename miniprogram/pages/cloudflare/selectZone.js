// pages/cloudflare/selectZone.js
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
    var _this = this;
    wx.getStorage({
      key: 'zones',
      success: function(res) {
        _this.setData({
          zones: res.data
        })
      },
    })
  },

  navToBindToken: function(e) {
    console.log(e);
    var _this = this;
    wx.navigateTo({
      url: "./bindToken",
      events: {
        getZones: function(data) {
          _this.setData({
            zones: data
          });
        }
      },
    })
  }
})