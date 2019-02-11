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
      url: `${host}/WXAppletInfo.php`,
      method: 'GET',
      success: res => {
        console.log(res);
        this.setData(res.data);
      }
    });
  },
  update: () => {
    const updateManager = wx.getUpdateManager()

    updateManager.onCheckForUpdate(function(res) {
      // 请求完新版本信息的回调
      console.log("更新检测结果:", res.hasUpdate)
    })

    updateManager.onUpdateReady(function() {
      // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
      updateManager.applyUpdate()
    });

    updateManager.onUpdateFailed(function() {
      wx.showToast({
        title: '更新失败 \n请检查网络',
        mask: true
      })
      // 新的版本下载失败
    })
  }
})