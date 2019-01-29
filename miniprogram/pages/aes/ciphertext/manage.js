// pages/aes/ciphertext/manage.js

Page({

  /**
   * 页面的初始数据
   */
  data: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: '查询中...',
    })
    wx.cloud.callFunction({
      name: 'ciphertext_manage',
      success: res => {
        wx.hideLoading();
        console.log(res)
        this.setData({
          result: res.result.data
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

  },

  onRemove: function (e) {
    const db = wx.cloud.database();
    db.collection('aes').doc(e.target.dataset.aesId).remove({
      success: res => {
        wx.showToast({
          title: '删除成功',
        });
        this.onLoad();
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '删除失败',
        })
        console.error('[数据库] [删除记录] 失败：', err)
      }
    });
  }
})