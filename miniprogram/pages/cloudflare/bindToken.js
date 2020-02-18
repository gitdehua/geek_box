// pages/cloudflare/bindToken.js

let eventChannel;

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  onLoad: function(options) {
    eventChannel = this.getOpenerEventChannel();
  },

  addToken: function(e) {
    var _this = this;
    var data = e.detail.value;
    data.action = "getZones";
    wx.showLoading({
      title: '',
    });
    wx.cloud.callFunction({
      name: "cloudflare",
      data
    }).then(res => {
      console.log(res)
      var result = res.result;
      if (result.statusCode != 200) {
        throw result.statusCode + result.body;
      }
      var zones = wx.getStorageSync("zones") || {};
      var body = JSON.parse(result.body);
      if (body.result.length == 1) {
        var zoneId = body.result[0].id;
        zones[zoneId] = {
          token: data.token,
          domainName: data.domainName,
          zoneId: body.result[0].id
        };
        wx.setStorage({
          key: "zones",
          data: zones
        });
        wx.navigateBack({
          delta: 1,
          success: e => {
            wx.hideLoading();
            eventChannel.emit('getZones', zones);
          }
        })
      }
    }).catch(err => {
      wx.hideLoading();
      _this.setData({
        errMsg: JSON.stringify(err)
      });
      console.error('调用失败：', err)
    });
  }
})