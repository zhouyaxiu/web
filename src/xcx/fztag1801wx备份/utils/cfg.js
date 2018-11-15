// var apiURL = "https://www.fanhantech.com";
var apiURL = "http://10.0.0.19";
import WxValidate from "./wxValidate.js";
import Promise from "./es6_promise.js";
function _apiURL() {
  return apiURL;
};
function validate() {
  const rules = {
    username: {
      required: true,
    },
    mobile: {
      required: true,
      tel: true,
    },
    code: {
      required: true,
    }
  }
  const message = {
    username: {
      required: '请输入用户名',
    },
    mobile: {
      required: '请输入手机号码',
      tel: '请输入正确的11位手机号码',
    },
    code: {
      required: '请输入验证码',
    }
  }
  this.Validate = new WxValidate(rules, message)
}
function showToast(error) {
  wx.showToast({
    title: error.msg,
    icon: 'none',
    duration: 1000
  });
}
function titleToast(title) {
  wx.showToast({
    title: title,
    icon: 'none',
    duration: 1000
  });
}
function wxPromise(fn) {
  wx.showLoading({title:'数据正在请求中...'})
  // let time=Date.now()
  // console.log(time)
  return function (obj = {}) {
    return new Promise((resolve, reject) => {
      obj.success = function (res) {
        resolve(res)
        wx.hideLoading();
        // console.log(Date.now()-time)
      }
      obj.fail = function (res) {
        reject(res)
      }
      fn(obj)
    })
  }
}
function get(url, header) {
  var get = wxPromise(wx.request)
  return get({
    url: url,
    method: 'GET',
    header: header
  })
}
function post(url, data, header) {
  var post = wxPromise(wx.request)
  return post({
    url: url,
    method: 'POST',
    data: data,
    header: header
  })
}
module.exports = {
  getAPIURL: _apiURL,
  validate: validate,
  showToast: showToast,
  post: post,
  get: get,
  wxPromise: wxPromise,
  titleToast: titleToast
};
