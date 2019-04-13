// components/msg-box/msg-box.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    inputOptions: {
      type: Object,
      value: null,
      observer: function(newVal, oldVal, changedPath) {
        this.setData({
          show: true,
          title: newVal.title,
          content: newVal.content
        });

        this.click = function(res) {
          var result = res.target.dataset.type == "confirm" ? true : false;
          if (typeof newVal.complete == "function") {
            newVal.complete(result);
          }
          this.setData({
            show: null
          });
        };
      }
    }
  }
})