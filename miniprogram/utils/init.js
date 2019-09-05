Date.prototype.getTimezone = function() {
  var offset = this.getTimezoneOffset();
  var mark = offset < 0 ? "+" : "-";
  offset = Math.abs(offset);
  return "GMT" + mark + [
    parseInt(offset / 60),
    offset % 60
  ].map(e => {
    return e.toString()[1] ? e : '0' + e;
  }).join('');
}

Date.prototype.format = function(fmt) {
  var o = {
    "M+": this.getMonth() + 1, //月份 
    "d+": this.getDate(), //日 
    "h+": this.getHours(), //小时 
    "m+": this.getMinutes(), //分 
    "s+": this.getSeconds(), //秒 
    "S": this.getMilliseconds(), //毫秒 
    "Z": this.getTimezone(),
    "W": "星期" + ["日", "一", "二", "三", "四", "五", "六"][this.getDay()]
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}
