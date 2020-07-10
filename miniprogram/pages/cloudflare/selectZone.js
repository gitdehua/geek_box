// pages/cloudflare/selectZone.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    slideButtons: [{
      type: 'warn',
      text: '删除'
    }],
  },

  slideButtonTap(e) {
    console.log(e)
    switch (e.detail.index) {
      case 0: // 删除
        this.removeZone(e.target.dataset.zoneId);
        break;
    }
  },

  removeZone: function (id) {
    let zones = this.data.zones;
    delete zones[id]
    wx.setStorage({
      data: zones,
      key: "zones",
      success: () => {
        wx.showToast({
          title: "删除成功",
        });
        this.setData({
          zones
        });
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    wx.getStorage({
      key: 'zones',
      success: function (res) {
        _this.setData({
          zones: res.data
        })
      },
    })
  },

  navToBindToken: function (e) {
    console.log(e);
    var _this = this;
    wx.navigateTo({
      url: "./bindToken",
      events: {
        getZones: function (data) {
          _this.setData({
            zones: data
          });
        }
      },
    })
  }
})