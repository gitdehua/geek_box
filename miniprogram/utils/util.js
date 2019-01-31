const host = "https://www.dehuaio.com";

const formatTime = function(date, delimiter) {
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

module.exports = {
  host,
  formatTime
}