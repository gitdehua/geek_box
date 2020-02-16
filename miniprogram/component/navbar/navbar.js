// component/navbar/navbar.js

Component({
  properties: {
    showNav: { // 属性名
      type: Boolean, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: true, // 属性初始值（可选），如果未指定则会根据类型选择一个
    },
    title: {
      type: String,
      value: '极客宝箱',
      observer: function(newVal, oldVal, changedPath) {
        this.setData({
          title: newVal
        });
      }
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
    },
    loading: {
      type: Boolean,
      value: false,
      observer: function(newVal, oldVal, changedPath) {
        this.setData({
          loading: newVal
        });
      }
    }
  },
  data: {
    showNav: true,
    title: "极客宝箱",
    navs: [{
      type: "navigateBack",
      show: true,
      img: "./arrow_left.png"
    }, {
      type: "switchTab",
      url: '/pages/index/index',
      show: true,
      img: "./home.png"
    }]
  },
  attached: function() {
    var menuButton = wx.getMenuButtonBoundingClientRect();
    this.setData({
      menuButton: wx.getMenuButtonBoundingClientRect(),
      "navs[0].show": getCurrentPages().length > 1
    })
  },
  methods: {
    nav: function(e) {
      console.log(e);
      var {
        type,
        page
      } = e.target.dataset;
      switch (type) {
        case "switchTab":
          wx.switchTab({
            url: page,
          });
          break;
        case "navigateBack":
          wx.navigateBack({
            delta: 1
          });
          break;
      }
    }
  }
})