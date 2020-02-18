// component/navbar/navbar.js

Component({
  properties: {
    showNav: { // 属性名
      type: Boolean, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: true, // 属性初始值（可选），如果未指定则会根据类型选择一个
    },
    title: {
      type: String,
      value: 'demo',
      observer: function(newVal, oldVal, changedPath) {
        this.setData({
          title: newVal
        });
      }
    },
    menus: {
      type: Object,
      value: null,
      observer: function(newVal, oldVal, changedPath) {
        var menus = this.data.menus;
        this.setData({
          menus,
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
    title: "demo",
    navs: [{
      type: "navigateBack",
      show: true,
      img: "./arrow_left.png"
    }, {
      type: "switchTab",
      url: '/pages/index/index',
      show: true,
      img: "./home.png"
    }],
    menus: []
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
    },

    showMenus: function(e) {
      this.setData({
        showMenus: !this.data.showMenus
      })
    },

    menu: function(e) {
      var menu = e.currentTarget.dataset.item;

      this.triggerEvent("menuEvent", {
        menu
      }, {});

      this.setData({
        showMenus: !this.data.showMenus
      });
    }
  }
})