// pages/authorize/webAuth.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    weuiTheme: getApp().globalData.theme
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // scene 需要使用 decodeURIComponent 才能获取到生成二维码时传入的 scene
    const scene = decodeURIComponent(options.scene);
    this.setData(options);
  },

  copy: function () {
    if (!this.data.scene) return;
    wx.setClipboardData({
      data: this.data.scene,
      success: () => {
        wx.showToast({
          title: "复制成功",
          icon: "none"
        })
      }
    })
  }
})