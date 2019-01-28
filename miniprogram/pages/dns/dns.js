// pages/dns/dns.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    useServer: false
  },

  useServer: function(e) {
    this.setData({
      useServer: e.detail.value
    })
  },

  submit: function(e) {
    console.log(e);
    var data = e.detail.value;
    var pattern = /[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\.?/;
    if (!pattern.test(data.name)) {
      wx.showModal({
        content: "域名格式错误",
        showCancel: false
      });
      return false;
    }
    pattern = /^((2[0-4]\d|25[0-5]|[01]?\d\d?)\.){3}(2[0-4]\d|25[0-5]|[01]?\d\d?)$/;
    if (data.useServer && !pattern.test(data.server)) {
      wx.showModal({
        content: "DNS服务器IP格式错误",
        showCancel: false
      });
      return false;
    }
    wx.showLoading({
      title: '查询中...',
      mask: true
    });
    wx.cloud.callFunction({
      name: 'dns',
      data,
      success: res => {
        wx.hideLoading();
        console.log(res)
        this.setData({
          result: JSON.parse(res.result)
        });
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询失败',
        })
        console.error('调用失败：', err)
      }
    })
  }
})