
const host = "https://www.dehuaio.com/api";

const formatTime = function (date, delimiter) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  const _date = [year, month, day].map(formatNumber).join(delimiter);
  const time = [hour, minute, second].map(formatNumber).join(':');
  const datetime = _date + " " + time;

  return {
    date: _date,
    datetime: datetime,
    time: time
  }
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/**
 * formatWeek
 */
const formatWeek = day => {
  var str = null;
  switch (day) {
    case 0: str = "日"; break;
    case 1: str = "一"; break;
    case 2: str = "二"; break;
    case 3: str = "三"; break;
    case 4: str = "四"; break;
    case 5: str = "五"; break;
    case 6: str = "六"; break;
  }
  return "星期" + str;
}

const template = function (msgData, form_id, pageURL) {
  wx.request({
    url: `${host}/template.php`,
    method: "POST",
    dataType: "json",
    data: {
      form_id,
      sessionKey: wx.getStorageSync("loginData").sessionKey,
      msgData: JSON.stringify(msgData),
      pageURL
    },
    success: res => {
      console.log(res.data);
    }
  });
}

function getMediaType(name) {
  var mediaType;
  switch (name) {
    case "png": mediaType = "image/png"; break;
    case "gif": mediaType = "image/gif"; break;
    case "jpg":
    case "jpeg": mediaType = "image/jpeg"; break;
    case "svg": mediaType = "image/svg+xml"; break;
    case "image/webp": mediaType = "image/webp"; break;
    default: mediaType = null; break;
  }
  console.log(name, mediaType);
  return mediaType
}

function base64Encode(option) {
  if ((typeof option) == "string") {
    option = utf16to8(option);
  }
  var _Uint8Array = new Uint8Array(option);
  var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  var i = 0;
  var string = "";
  while (i < _Uint8Array.length) {
    var n1, n2, n3;
    n1 = _Uint8Array[i++];
    if (i == _Uint8Array.length) {
      var tempNumber = (n1 << 16);
      string += base64EncodeChars[tempNumber >>> 18 & 0x3f];
      string += base64EncodeChars[tempNumber >>> 12 & 0x3f];
      string += "==";
      break;
    }
    n2 = _Uint8Array[i++];
    if (i == _Uint8Array.length) {
      var tempNumber = (n1 << 16) + (n2 << 8);
      string += base64EncodeChars[tempNumber >>> 18 & 0x3f];
      string += base64EncodeChars[tempNumber >>> 12 & 0x3f];
      string += base64EncodeChars[tempNumber >>> 6 & 0x3f];
      string += "=";
      break;
    }
    n3 = _Uint8Array[i++];
    var tempNumber = (n1 << 16) + (n2 << 8) + n3;
    string += base64EncodeChars[tempNumber >>> 18 & 0x3f];
    string += base64EncodeChars[tempNumber >>> 12 & 0x3f];
    string += base64EncodeChars[tempNumber >>> 6 & 0x3f];
    string += base64EncodeChars[tempNumber & 0x3f];
  }
  return string;
}

function utf16to8(str) {
  var out = [];
  for (var i = 0; i < str.length; i++) {
    var c = str.charCodeAt(i);
    if ((c >= 0x0001) && (c <= 0x007F)) {
      out.push(c);
    } else if (c > 0x07FF) {
      out.push(0xE0 | ((c >> 12) & 0x0F));
      out.push(0x80 | ((c >> 6) & 0x3F));
      out.push(0x80 | ((c >> 0) & 0x3F));
    } else {
      out.push(0xC0 | ((c >> 6) & 0x1F));
      out.push(0x80 | ((c >> 0) & 0x3F));
    }
  }
  return out;
}

module.exports = {
  host,
  formatTime: formatTime,
  formatWeek: formatWeek,
  template: template,
  base64Encode,
  getMediaType
}
