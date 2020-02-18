// pages/cloudflare/DNS/list.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    menus: [{
      icon: '\ue016',
      title: "添加记录",
      color: "#f70",
      type: "function",
      funName: "addRecord"
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    var zone = wx.getStorageSync("zones")[options.zoneId];
    this.setData({
      zone
    });
    this.getRecords();

    wx.createSelectorQuery().select('#pageSelect').boundingClientRect((res) => {
      console.log(res)
      this.setData({
        pageSelectHeight: res.height
      })
    }).exec()
  },

  menuEvent: function(e) {
    var menu = e.detail.menu;
    this[menu.funName]();
  },

  addRecord: function() {
    wx.navigateTo({
      url: './edit',
      success: e => {
        e.eventChannel.emit('getZoneInfo', this.data.zone);
      }
    });
  },

  changePage: function(e) {
    console.log(e)
    var {
      page,
      type
    } = e.target.dataset;
    this.getRecords(type == "previous" ? page - 1 : page + 1);
  },

  getRecords(page) {
    var _this = this;
    var data = {
      token: this.data.zone.token,
      zoneId: this.data.zone.zoneId
    }
    data.action = "getDnsRecords";
    data.page = page || 1;

    wx.showLoading({
      title: "查询中...",
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
      wx.hideLoading();
      var body = JSON.parse(result.body);
      this.setData({
        records: body
      });
    }).catch(err => {
      wx.hideLoading();
      wx.showModal({
        title: "查询失败",
        showCancel: false
      })
      console.error("调用失败：", err)
    });
  },

  update: function(e) {
    console.log(e);
    var record = e.target.dataset.record;

    var {
      zoneId,
      token,
      domainName
    } = this.data.zone;
    var zone = {
      zoneId,
      token,
      domainName,
      record
    }

    wx.navigateTo({
      url: './edit',
      success: e => {
        e.eventChannel.emit('getZoneInfo', zone);
      }
    });
  },

  deleteRecord: function(e) {
    console.log(e);
    var record = e.target.dataset.record;
    wx.showModal({
      title: "删除确认",
      content: `${record.type}, ${record.name}, ${record.content}`,
      success(res) {
        if (res.confirm) {
          var data = {
            token: this.data.zone.token,
            zoneId: this.data.zone.zoneId,
            recordId: e.target.dataset.recordId
          }
          data.action = "deleteDnsRecord";

          wx.cloud.callFunction({
            name: "cloudflare",
            data
          }).then(res => {
            console.log(res)
            var result = res.result;
            if (result.statusCode != 200) {
              throw result.statusCode + result.body;
            }
            wx.hideLoading();
            var body = JSON.parse(result.body);
            if (body.result.id == data.recordId) {
              this.getRecords();
            }
          }).catch(err => {
            wx.hideLoading();
            wx.showModal({
              title: "删除失败",
              showCancel: false
            })
            console.error("调用失败：", err)
          });
        }
      }
    });
  }
})