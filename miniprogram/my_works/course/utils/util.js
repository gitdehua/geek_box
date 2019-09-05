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
  base64Encode 
}
