// pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  onShareAppMessage: function(res) {
    var data = {
      title: "极客宝箱，开发者工具",
      path: "pages/index/index"
    }
    return data;
  }
})