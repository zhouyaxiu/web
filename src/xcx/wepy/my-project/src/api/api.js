// var apiURL = "https://www.fanhantech.com";
var apiURL = "http://10.0.0.19";
var globalData = {
  userInfo: null,
  Sid: '',
  header: {
    "Content-Type": "application/json;charset=utf-8",
    "Cookie": ""
  }
}
function setSid (sid) {
  this.globalData.Sid = sid
}

function getSid () {
  return this.globalData.Sid
}

function setCookie (cookie) {
  this.globalData.header["Cookie"] = cookie
}

function getCookie () {
  return this.globalData.header["Cookie"]
}
function _apiURL() {
  return apiURL;
};
module.exports = {
  apiURL: _apiURL,
  setSid,
  getSid,
  setCookie,
  getCookie
};
