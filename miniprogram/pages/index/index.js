// pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navs: [
      [{
        title: "BASE64",
        url: "/pages/base64/base64"
      }, {
        title: "MD5",
        url: "/pages/md5/md5"
      }],
      [{
        title: "DNS查询",
        url: "/pages/dns/dns"
      }, {
        title: "CloudFlare DNS API",
        url: "/pages/cloudflare/selectZone"
      }]
    ]
  },

  onLoad: function(options) {
    const db = wx.cloud.database();
    const _ = db.command;
    db.collection("app_route").where({
      env: _.gte(getApp().globalData.env)
    }).get().then(res => {
      console.log(res);
      if (res.data.length == 0) return;
      this.data.navs.push(res.data);
      this.setData({
        navs: this.data.navs
      });
    }).catch(err => console.error);
  },

  onShareAppMessage: function(res) {
    var data = {
      title: "极客宝箱，开发者工具",
      path: "pages/index/index"
    }
    return data;
  }
})