// my_works/course/pages/show/daily.js
var getCourse = require('../../utils/courseTool.js').getCourse;

Page({
  data: {
    dateString: null,
    date: null,
    courseList: null,
    touchX: null,
    touchY: null,
    nav: {
      type: "navigate",
      url: '/my_works/course/pages/course/course',
      show: true,
      // color: '#f70',
      text: "\ue00a"
    },
    close: "\ue00f",
    flush: "\ue009",
    pullUpMsg: ["上拉查看一周课表", "松开跳转"],
    pullUpMsgId: 0
  },

  bindDateChange: function(e) {
    var courseList = getCourse("day", e.detail.value);
    this.setData({
      date: e.detail.value,
      dateString: new Date(e.detail.value).format("yyyy-MM-dd W"),
      courseList: courseList
    })
  },

  touchMove: function(e) {
    if (e.changedTouches.length == 1) {
      var touchX = this.data["touchX"] || [];
      var touchY = this.data["touchY"] || [];
      var moveX = e.changedTouches[0].clientX;
      var moveY = e.changedTouches[0].clientY;
      touchX.push(moveX);
      touchY.push(moveY);
      this.setData({
        touchX: touchX,
        touchY: touchY
      });
    } else {
      this.setData({
        touchEnd: null
      });
    }
  },

  touchEnd: function(e) {
    const mathTool = {
      sum: function(x, y) {
        return x + y;
      },
      　　 //求和函数
      square: function(x) {
        return x * x;
      },
      　 //数组中每个元素求它的平方
      init: function(mathArray) {
        //平均值
        var mean = mathArray.reduce(this.sum) / mathArray.length;
        //偏差
        var deviations = mathArray.map(function(x) {
          return x - mean;
        });
        //标准差：
        var stddev = Math.sqrt(deviations.map(this.square).reduce(this.sum) / (mathArray.length - 1));

        return {
          mean: mean,
          stddev: stddev
        }
      }
    };

    var touchX = this.data["touchX"];
    var touchY = this.data["touchY"] || [];
    if (touchY.length == 0) {
      return false;
    }
    var endX = e.changedTouches[0].clientX;
    var date = this.data["date"];
    var startDate = Math.round(new Date(this.data["startDate"]).getTime() / 1000);
    var endDate = Math.round(new Date(this.data["endDate"]).getTime() / 1000);
    var stddevY = mathTool.init(touchY).stddev;
    var move = endX - touchX[0];
    var timeStamp = Math.round(new Date(date).getTime() / 1000);

    if (stddevY < 20 && Math.abs(move) > 100) {
      wx.showLoading({
        title: '查询中...',
        mask: true
      });
      if (move < 0) {
        timeStamp += 3600 * 24;
      } else {
        timeStamp -= 3600 * 24;
      }
      if (timeStamp >= startDate && timeStamp <= endDate) {
        var date = new Date(timeStamp * 1000);
        this.setData({
          date: date.format("yyyy-MM-dd"),
          dateString: date.format("yyyy-MM-dd W"),
        });
        this.getCourseList();
      } else {
        wx.showModal({
          content: "超范围了\t(๑•́ ₃ •̀๑)",
          showCancel: false
        });
      }
    }
    this.setData({
      touchX: null,
      touchY: null
    });
    setTimeout(function() {
      wx.hideLoading();
    }, 300);
  },

  onLoad: function() {
    var course = wx.getStorageSync('course');
    var date = new Date().format("yyyy-MM-dd");
    var startDate, endDate;
    if (course != '' && (typeof course.startDate) == "string") {
      startDate = course.startDate;
      endDate = startDate.split("-");
      endDate[0] = parseInt(endDate[0]) + 1;
      endDate = endDate.join('-');
    } else {
      startDate = date;
      endDate = date;
    }
    var subjects = (typeof course.subjects) == "object" ? course.subjects : [];
    this.setData({
      date,
      dateString: new Date(date).format("yyyy-MM-dd W"),
      subjects,
      startDate,
      endDate
    });
    console.log(this.data["date"]);
    this.getCourseList();
  },

  onPullDownRefresh: function() {
    if (this.data.showMenu) {
      this.onLoad();
      this.closeMenu();
      wx.stopPullDownRefresh();
    } else {
      wx.stopPullDownRefresh();
      this.setData({
        showMenu: true
      });
      wx.showToast({
        title: '再次下拉刷新',
        icon: 'none'
      })
    }
  },

  closeMenu: function() {
    this.setData({
      showMenu: false
    });
  },

  getCourseList: function(options) {
    var courseList = getCourse("day", this.data["date"]);
    if (courseList === false) {
      this.setData({
        msgBoxData: {
          show: true,
          title: "数据异常",
          content: "是否前往数据配置页面",
          complete: function(res) {
            if (res) {
              wx.navigateTo({
                url: "/my_works/course/pages/course/course",
              })
            }
          }
        }
      })
    }
    this.setData({
      courseList
    });
  },

  onReachBottom: function() {
    this.setData({
      pullUp: true,
      pullUpMsgHeigh: 0
    });
  },

  pullUp: function(e) {
    switch (e.type) {
      case "touchstart":
        {
          console.log(e);
          this.setData({
            startY: e.changedTouches[0].clientY
          });
        }
        break;
      case "touchend":
        {
          console.log(e);
          if (this.data.pullUpMsgId == 1) {
            wx.navigateTo({
              url: '/my_works/course/pages/show/weekly',
            });
            wx.pageScrollTo({
              scrollTop: 0
            });
          }
          this.setData({
            pullUpMsgHeigh: 0,
            pullUpMsgId: 0,
            pullUp: false
          });
        }
        break;
      case "touchmove":
        {
          var startY = this.data["startY"];
          var pullUpMsgHeigh = (startY - e.changedTouches[0].clientY) / 2;
          var pullUpMsgId = pullUpMsgHeigh > 50 ? 1 : 0;
          this.setData({
            pullUpMsgHeigh,
            pullUpMsgId
          });
        }
        break;
    }
  }
})