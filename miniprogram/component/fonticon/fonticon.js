// component/fonticon/fonticon.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    code: {
      type: String,
      value: '极客宝箱',
      observer: function (newVal, oldVal, changedPath) {
        this.setData({
          char: String.fromCharCode(parseInt(newVal, 16))
        });
      }
    }
  }
})
