var util = require("../../utils/util.js")
var api = require("../../utils/api.js");
var md5 = require("../../utils/md5.js");
var app = getApp()
Page({
  data: {
    logo: '../../images/logo.png',
    username: "",
    mobile: "",
    code: "",
    password: null,
    confirm: null,
    getSmsCode: "获取验证码",
    getSmsCodeBtnColor: "#15b3e4",
    smsCodeDisabled: false
  },
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: '忘记密码'
    })
  },
  bindNameInput: function(e) {
    this.setData({
      username: e.detail.value
    });
  },
  bindMobileInput: function(e) {
    this.setData({
      mobile: e.detail.value
    });
  },
  bindCodeInput: function(e) {
    this.setData({
      code: e.detail.value
    });
  },
  bindPasswordInput: function(e) {
    this.setData({
      password:e.detail.value
    });
  },
  bindConfirmInput: function(e) {
    this.setData({
      confirm:e.detail.value
    });
  },
  checkMobile: function() {
    var mobile = this.data.mobile;
    var code = this.data.code;
    var that = this;
    var count = 60;
    if (this.data.mobile == "" && !util.isTel(this.data.mobile)) {
      // todo  验证是否符合格式 最简单:11位数字
      wx.showToast({
        title: '手机号码不能为空',
        icon: 'loading',
        duration: 1000
      });
    } else if (!util.isTel(this.data.mobile)) {
      wx.showToast({
        title: '手机号码格式不正确',
        icon: 'loading',
        duration: 1000
      });
    } else {
      wx.request({
        url: api.getCheckMobile() + mobile,
        method: "get",
        header: {
          "content-type": "application/json"
        },
        data: {
          CountryCode: "+86",
          Mobile: mobile,
          Code: code
        },
        success: function(res) {
          if (res.data !== true) {
            wx.showToast({
              title: '手机号码不存在',
              icon: 'loading',
              duration: 1000
            });
          } else {
            wx.request({
              url: api.getSmsverificationcode(),
              method: "post",
              header: {
                "content-type": "application/json"
              },
              data: {
                CountryCode: "+86",
                Mobile: mobile
              },
              success: function(res) {
                if (res.data.code === 0) {
                  wx.showToast({
                    title: '已发送验证码',
                    icon: 'loading',
                    duration: 1000
                  });
                  var si = setInterval(function() {
                    if (count > 0) {
                      count--;
                      that.setData({
                        getSmsCode: count + " s",
                        getSmsCodeBtnColor: "#dedede",
                        smsCodeDisabled: true
                      });
                    } else {
                      that.setData({
                        getSmsCode: "获取验证码",
                        getSmsCodeBtnColor: "#15b3e4",
                        smsCodeDisabled: false
                      });
                      count = 60;
                      clearInterval(si);
                    }
                  }, 1000);
                } else {
                  wx.showToast({
                    title: '手机输入不正确',
                    icon: 'loading',
                    duration: 1000
                  });
                }
              },
              fail: function(res) {
                wx.showToast({
                  title: "网络错误",
                  icon: "loading",
                  duration: 1500
                });
              },
              complete: function() {}
            });
          }
        },
        fail: function() {
          wx.showToast({
            title: "网络错误",
            icon: "loading",
            duration: 2000
          });
        }
      });
    }
  },
  indexTap: function() {
    var username = this.data.username;
    var mobile = this.data.mobile;
    var code = this.data.code;
    var password = this.data.password
    var confirm = this.data.confirm
    if (this.data.username == "") {
      wx.showToast({
        title: '请输入用户名',
        icon: 'loading',
        duration: 1000
      });
    } else if (this.data.mobile == '' && !util.isTel(this.data.mobile)) {
      wx.showToast({
        title: '请输入手机号码',
        icon: 'loading',
        duration: 1000
      });
    } else if (this.data.code == '') {
      wx.showToast({
        title: '请输入验证码',
        icon: 'loading',
        duration: 1000
      });
    } else if (this.data.password == null) {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '请输入密码'
      })
    } else if (this.data.confirm == null) {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '请输入确认密码'
      })
    } else if (password.length < 6 || password.length > 20) {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '密码在6-20位字符'
      })
    } else if (this.data.confirm != this.data.password) {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '两次密码不一致，请重新输入'
      })
    } else {
      var that = this;
      wx.request({
        url: api.getPassword(),
        data: {
          Username: username,
          CountryCode: "+86", // todo 目前只支持+86
          Mobile: mobile,
          Code: code,
          Password: md5(password), /// md5()
          Confirm: md5(confirm),
          Agree: true
        },
        method: "post",
        header: {
          "content-type": "application/json"
        },
        success: function(res) {
          if (res.data.code === 0) {
            wx.showToast({
              title: "重置密码成功",
              icon: "success",
              duration: 1000
            });
            setTimeout(function() {
              wx.navigateTo({
                url: "../login/index"
              });
            }, 2000);
          } else {
            wx.showToast({
              title: "填写的信息有误！",
              icon: "loading",
              duration: 2000
            });
          }
        },
        fail: function(res) {
          wx.showToast({
            title: "网络错误",
            icon: "loading",
            duration: 2000
          });
        },
        complete: function() {}
      });
    }
  }
})