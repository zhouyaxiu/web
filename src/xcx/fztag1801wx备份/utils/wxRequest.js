import Promise from "./es6_promise.js";

function wxPromiseify(fn) {
  return function (obj = {}) {
    return new Promise((resolve, reject) => {
      obj.success = function (res) {
        resolve(res)
      }
      obj.fail = function (res) {
        reject(res)
      }
      fn(obj)
    })
  }
}
function getRequest(url, header) {
  var getRequest = wxPromiseify(wx.request)
  return getRequest({
    url: url,
    method: 'GET',
    // data: data,
    header: header
  })
}
function postRequest(url, header, data) {
  var postRequest = wxPromiseify(wx.request)
  return postRequest({
    url: url,
    method: 'POST',
    data: data,
    header: header
  })
}
function wxLogin() {
  return wxPromiseify(wx.login)
}
function wxGetSystemInfo() {
  return wxPromiseify(wx.getSystemInfo)
}
function wxNavigateTo(url,params) {
  var wxNavigateTo=wxPromiseify(wx.navigateTo)
  const serializedParams=this.paramSerializer(params)
  if(serializedParams.length>0){
    url += ((url.indexOf('?') == -1) ? '?' : '&') + serializedParams
  }
  return wxNavigateTo({url:url})
}
module.exports = {
  getRequest,
  postRequest,
  wxPromiseify,
  wxLogin,
  wxGetSystemInfo,
  wxNavigateTo
};
