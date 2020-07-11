// component/help/help.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    msg: String
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    show: function () {
      wx.showModal({
        title: '提示',
        content: this.data.msg,
        showCancel: false
      })
    }
  }
})
