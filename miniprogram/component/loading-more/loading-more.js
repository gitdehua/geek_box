// component/loading-more/loading-more.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    icon: {
      type: Boolean,
      value: true,
      observer: function(newVal, oldVal, changedPath) {
        this.setData({
          icon: newVal
        });
      }
    },
    tips: {
      type: String,
      value: null,
      observer: function(newVal, oldVal, changedPath) {
        this.setData({
          tips: newVal
        });
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {},

  /**
   * 组件的方法列表
   */
  methods: {

  }
})