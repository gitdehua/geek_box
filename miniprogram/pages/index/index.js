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
      }],
      [{
        title: "关于",
        url: "/pages/about/about"
      }]
    ]
  },

  onShareAppMessage: function(res) {
    var data = {
      title: "极客宝箱，开发者工具",
      path: "pages/index/index"
    }
    return data;
  }
})