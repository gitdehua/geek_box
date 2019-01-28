// pages/number/number.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    n2: 0,
    n8: 0,
    n16: 0
  },

  getNumber: function (n10) {
    var n10 = n10.detail.value;
    
    console.log(n10.toString());
    this.setData({
      n2: parseInt(n10).toString(2),
      n8: parseInt(n10).toString(8),
      n16: parseInt(n10).toString(16)
    });
  }
})