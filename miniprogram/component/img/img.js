// component/img/img.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    src: String
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
    _previewImage: function(e) {
      console.log(e, this.data);
      wx.previewImage({
        urls: [this.data.src] // 需要预览的图片http链接列表
      })
    }
  }
})