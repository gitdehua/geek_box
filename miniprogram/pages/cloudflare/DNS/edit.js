// pages/cloudflare/DNS/edit.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    types: ["A", "AAAA", "CNAME", "TXT", "MX", "NS"],
    typeId: 0
  },

  selectType: function(e) {
    console.log(e);
    this.setData({
      typeId: e.detail.value
    });
  },

  submit: function(e) {
    var _this = this;
    var {
      zoneId,
      token,
      domainName
    } = this.data.zone;

    var record = e.detail.value;
    record.type = this.data.types[record.type];
    record.ttl = parseInt(record.ttl);
    if (record.priority) record.priority = parseInt(record.priority);

    var data = {
      action: "createDnsRecord",
      record,
      zoneId,
      token
    }

    if (this.data.record.recordId) {
      data.action = "updateDnsRecord";
      data.recordId = this.data.record.recordId;
    }

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
      var body = JSON.parse(result.body);
      if (body.success == true) {
        wx.hideLoading();
        wx.showToast({
          title: '提交成功',
        })
      }
    }).catch(err => {
      wx.hideLoading();
      _this.setData({
        errMsg: JSON.stringify(err)
      });
      console.error('调用失败：', err)
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let eventChannel = this.getOpenerEventChannel();
    if (!eventChannel.on) {
      wx.navigateBack({
        delta: 1
      });
    }
    eventChannel.on('getZoneInfo', (data) => {
      var record = {
        name: data.domainName,
        typeId: 0,
        ttl: 1
      }
      if (data.record) {
        record.name = data.record.name;
        record.typeId = this.data.types.indexOf(data.record.type);
        record.recordId = data.record.id;
        record.content = data.record.content;
        record.ttl = data.record.ttl;
        record.priority = parseInt(data.record.priority);
      }
      this.setData({
        zone: data,
        record,
        typeId: record.typeId
      });
    });
  }
})