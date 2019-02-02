// pages/about/about.js
const host = require("../../utils/util.js").host;
// var host = "https://local.dehuaio.com";

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
    wx.request({
      url: `${host}/WXMiniAppInfo.php`,
      method: 'GET',
      success: res => {
        console.log(res);
        this.setData(res.data);
      }
    })
  }
})