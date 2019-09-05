// pages/authorize/authorize.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  getUserInfo: function(e) {
    console.log(e);
    getApp().globalData.userInfo = e.detail.userInfo;
    wx.setStorage({
      key: 'user_info',
      data: e.detail.userInfo,
    })
    wx.navigateBack({
      delta: 1
    })
  },

  cancel: function() {
    wx.navigateBack({
      delta: 2,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options);
  }
})