// component/navbar/navbar.js

Component({
  properties: {
    showCapsule: { // 属性名
      type: Boolean, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: true, // 属性初始值（可选），如果未指定则会根据类型选择一个
    },
    title: {
      type: String,
      value: '极客宝箱',
    }
  },
  data: {
    height: 60,
    showBack: true,
    showCapsule: true,
    title: "极客宝箱"
  },
  attached: function() {
    this.setData({
      height: wx.getMenuButtonBoundingClientRect().bottom + 10,
      showBack: getCurrentPages().length != 1,
    })
  },
  methods: {}
})