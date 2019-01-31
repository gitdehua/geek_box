// pages/curl/curl.js
var CryptoJS = require('../../utils/crypto-js.min');
var host = require('../../utils/util').host;
// var host = "https://local.dehuaio.com";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tab_id: 1,
    input: false,
    headers: {}
  },

  changeMethod: function(e) {
    this.setData({
      method: e.detail.value
    })
  },

  submit: function(e) {
    var values = e.detail.value;
    // if (values.port != '') {
    //   values.port = ":" + values.port;
    // }

    var pattern = /[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\.?/;
    if (!pattern.test(values.host)) {
      wx.showModal({
        content: "主机格式错误",
        showCancel: false
      });
      return false;
    }
    var pattern = /^(?!\/)[a-zA-Z0-9%\/\-_\.]*$/;
    if (!pattern.test(values.path)) {
      wx.showModal({
        content: "path格式错误",
        showCancel: false
      });
      return false;
    }
    var pattern = /^(?!\?)[a-zA-Z0-9%\-_\.&\=]*$/;
    if (!pattern.test(values.params)) {
      wx.showModal({
        content: "params格式错误",
        showCancel: false
      });
      return false;
    }
    wx.showLoading({
      title: '传输中...',
      mask: true
    })
    var headers = [],
      _headers = this.data.headers;
    for (var key in _headers) {
      headers.push(`${key}:${_headers[key]}`);
    }
    var postData = {
      url: `${values.scheme}://${values.host}/${values.path}?${values.params}`,
      method: values.method,
      body: values.content,
      headers
    }
    console.log(postData);
    wx.request({
      url: `${host}/curl.php`,
      data: postData,
      header: {
        'content-md5': CryptoJS.MD5("wx684dbb6844c8943a" + JSON.stringify(postData)).toString(CryptoJS.enc.Hex)
      },
      method: 'POST',
      // responseType: "ArrayBuffer",
      success: (res) => {
        console.log(res);
        wx.hideLoading();
        if (/base64/.test(res.data.type)) {
          wx.showToast({
            title: '数据非文本，已进行BASE64编码',
            icon: 'none'
          });
        } else if (/image/.test(res.data.type)) {
          wx.showLoading({
            title: '图片处理...',
            mask: true
          });

          try {
            const fs = wx.getFileSystemManager()
            var imgURL = wx.env.USER_DATA_PATH + "/cURL_" + res.data.type.replace("/", ".").replace(" ", "");
            fs.writeFileSync(imgURL, res.data.body, 'base64');
            this.setData({
              imgURL
            });
            console.log(imgURL);
            wx.hideLoading();
          } catch (err) {
            console.log(err);
            wx.hideLoading();
            wx.showToast({
              title: '图片异常',
              icon: 'none'
            })
          }
        }
        this.setData(res.data);
      }
    })
  },

  changTab: function(e) {
    this.setData(e.target.dataset)
  },

  remove_header: function(e) {
    var headers = this.data.headers;
    headers[e.target.dataset.key] = undefined;
    this.setData({
      headers
    });
    console.log(e, headers);
  },

  add_header: function(e) {
    this.setData({
      input: true,
    });
  },

  save_header: function(e) {
    var headers = this.data.headers;
    headers[this.data.header_key] = this.data.header_value;
    this.setData({
      headers,
      input: false
    });
  },

  inputChange: function(e) {
    var data = {};
    data[e.target.dataset.name] = e.detail.value;
    this.setData(data);
    console.log(data)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var headers = {};
    headers["Content-Type"] = "application/json";
    this.setData({
      headers
    });
  }
})