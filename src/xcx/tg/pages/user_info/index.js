var api = require("../../utils/api.js");
var util = require("../../utils/util.js");
var app = getApp();
Page({
  data: {
    userInfo: {},
    hasUserInfo: false
  },
  onLoad: function() {
    wx.setNavigationBarTitle({
      //动态修改页面标题文字
      title: "个人信息"
    });
  },
  onShow: function() {
    this.getUserInfo();
  },
  getUserInfo() {
    // var username = this.data.username;
    // var avatar = this.data.avatar;
    // var gender = this.data.gender;
    // var birthday = this.data.birthday;
    // var country = this.data.country;
    // var province = this.data.province;
    // var city = this.data.city;
    // var location = this.data.location;
    // var nationality = this.data.nationality;
    // var ethnicity = this.data.ethnicity;
    // var marital = this.data.marital;
    // var motherLanguage = this.data.motherLanguage;
    // var education = this.data.education;
    // var industry = this.data.industry;
    // var income = this.data.income;
    var that = this;
    wx.request({
      url: api.UserInfo(),
      data: {
        // username: username,
        // avatar: "http://www.fanhantech.com/" + avatar,
        // gender: gender,
        // birthday: birthday,
        // country: country,
        // province: province,
        // city: city,
        // location: location,
        // nationality: nationality,
        // ethnicity: ethnicity,
        // marital: marital,
        // motherLanguage: motherLanguage,
        // education: education,
        // industry: industry,
        // income: income
      },
      method: "get",
      header: {
        "Content-Type": "application/json;charset=utf-8",
        Cookie: app.getSid()
      },
      success: function(res) {
        console.log(res.data.data)
        that.setData({
          username: res.data.data.username,
          avatar: "http://www.fanhantech.com" + res.data.data.avatar,
          gender: res.data.data.gender,
          birthday: res.data.data.birthday,
          country: res.data.data.country,
          province: res.data.data.province,
          city: res.data.data.city,
          nationality: res.data.data.nationality,
          ethnicity: res.data.data.ethnicity,
          marital: res.data.data.marital,
          motherLanguage: res.data.data.motherLanguage,
          education: res.data.data.education,
          industry: res.data.data.industry,
          income: res.data.data.income
        });
        if (res.data.code === 0) {
          app.globalData.header["cookie"] = res.header["set-cookie"];
          wx.showToast({
            title: "保存成功",
            icon: "success",
            duration: 1000
          });
        } else {
          wx.showToast({
            title: "保存失败",
            icon: "loading",
            duration: 1500
          });
        }
      }
    });
  },
  logout: function() {
    wx.removeStorageSync("username");
    wx.removeStorageSync("password]");
    wx.showToast({
      title: "您已经退出",
      icon: "success",
      duration: 2000
    });
    setTimeout(function() {
      wx.navigateTo({
        url: "../login/index"
      });
    }, 2000);
  },
  editinfo: function() {
    setTimeout(function() {
      wx.navigateTo({
        url: "../edit_userinfo/index"
      });
    }, 500);
  }
});