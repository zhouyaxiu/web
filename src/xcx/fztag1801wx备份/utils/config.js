
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
function getRequest(url,data,header) {
  var getRequest = wxPromiseify(wx.request)
  return getRequest({
    url: url,
    method: 'GET',
    data: data,
    header: header
  })
}
function postRequest(url,header,data) {
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
function setStorage(key,value){
  return new Promise((resolve,reject)=>{
    wx.setStorage({
      key:key,
      data:value,
      success:resolve,
      fail:reject
    })
  })
}
function getStorage(key){
  return new Promise((resolve,reject)=>{
    wx.setStorage({
      key:key,
      success:resolve,
      fail:reject
    })
  })
}
module.exports = {
  wxPromiseify,
  getRequest,
  postRequest,
  wxLogin,
  setStorage,
  getStorage
}