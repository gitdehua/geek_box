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
    },
    nav: {
      type: Object,
      value: null,
      observer: function(newVal, oldVal, changedPath) {
        var navs = this.data.navs;
        navs[2] = newVal;
        this.setData({
          navs,
        });
      }
    }
  },
  data: {
    height: 60,
    showCapsule: true,
    title: "极客宝箱",
    navs: [{
      type: "navigateBack",
      show: true,
      text: "\ue011"
    }, {
      type: "switchTab",
      url: '/pages/index/index',
      show: true,
      text: "\ue00b",
      color: '#f70'
    }]
  },
  attached: function() {
    this.setData({
      height: wx.getMenuButtonBoundingClientRect().bottom + 10,
      "navs[0].show": getCurrentPages().length > 1
    })
  },
  methods: {}
})