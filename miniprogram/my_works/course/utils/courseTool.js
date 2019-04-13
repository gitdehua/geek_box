//读取本地缓存
function getStorage() {
  try {
    var course = wx.getStorageSync('course') || { startDate: null, subjects: new Array(), courses: new Array() };
    return course;
  } catch (e) {
    console.log(e);
  }
}

//设置本地缓存
function setStorage(options) {
  var action = options.action;
  wx.showLoading({
    title: 'loading',
    mask: true
  });
  var course = getStorage();
  switch (action) {
    case "setDate": course.startDate = options.data; break;
    case "insertSubject": course.subjects.push(options.data); break;
    case "updateSubject": course.subjects.splice(options.index, 1, options.data); break;
    case "deleteSubject": course.subjects.splice(options.index, 1); break;
    case "insertCourse": course.courses.push(options.data); break;
    case "updateCourse": course.courses.splice(options.index, 1, options.data); break;
    case "deleteCourse": course.courses.splice(options.index, 1); break;
  }
  console.log(course);
  for (var i = 0; i < course.courses.length; i++) {
    course.courses[i].courseId = i.toString();
  }

  try {
    wx.setStorageSync('course', course);
    wx.hideLoading();

    if ((typeof options.init) == "function") {
      options.init(course);
    }
  } catch (e) {
    console.log(e);
    wx.showToast({
      title: '未完成',
      icon: 'none',
      mask: true
    });
  }
}

//获取课表
function getCourse(action, condition) {
  var subjects = getStorage().subjects;
  var courses = getStorage().courses;
  var startDate = getStorage().startDate;
  if (courses.length == 0 || subjects.length == 0 || startDate == null) {
    /*wx.showModal({
      title: "数据异常",
      content: "是否前往数据配置页面",
      confirmText: "前往",
      success: function (res) {
        if (res.confirm) {
          wx.navigateTo({
            url: "my_works/pages/course/course",
          })
        }
      }
    });*/
    return false;
  }
  var i, start, end;
  var courseData = [];
  if (action == "day") {
    //获取一天的数据
    var week = Math.floor((new Date(condition).getTime() - new Date(startDate).getTime()) / (1000 * 3600 * 24 * 7)) + 1;
    var dayInWeek = new Date(condition).getDay();
    for (i = 0; i < courses.length; i++) {
      start = parseInt(courses[i].start);
      end = parseInt(courses[i].end);
      if ((week >= start && week <= end) && (week % 2 == parseInt(courses[i].condition) || parseInt(courses[i].condition) == 3) && parseInt(courses[i].dayInWeek) == dayInWeek) {
        courseData.push(courses[i]);
      }
    }
    courseData = orderCourseList(courseData);
  } else {
    //获取一周的数据
    var week = condition;
    for (i = 0; i < courses.length; i++) {
      start = parseInt(courses[i].start);
      end = parseInt(courses[i].end);
      if ((week >= start && week <= end) && (week % 2 == parseInt(courses[i].condition) || parseInt(courses[i].condition) == 3)) {
        courseData.push(courses[i]);
      }
    }
  }
  return courseData;
}

/**
 * 根据id获取科目信息
 */
function getCourseInfo(array, courseId) {
  for (var i in array) {
    if (array[i].courseId == courseId) {
      return array[i];
    }
  }
}

/**
 * 排序
 */
function orderCourseList(array) {
  for (var i = 0; i < array.length; i++) {
    for (var j = 1; j < array.length; j++) {
      var temp = array[j - 1];
      if (parseInt(temp.classTime) > parseInt(array[j].classTime)) {
        array[j - 1] = array[j];
        array[j] = temp;
      }
    }
  }
  return array;
}

module.exports = {
  getCourse: getCourse,
  setStorage: setStorage
}