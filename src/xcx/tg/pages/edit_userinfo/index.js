var api = require('../../utils/api.js')
var util = require('../../utils/util.js')
var md5 = require('../../utils/md5.js')
var nationalitylist = require('../../utils/nationalityList.js')
var location = require('../../utils/locations.js')
var app = getApp()
Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    username: '',
    avatar: '',
    customItem: app.language('edit_userinfo.all'),
    index: 0,
    gindex: 0,
    cindex: 0,
    mindex: 0,
    moindex: 0,
    eindex: 0,
    iindex: 0,
    nindex: 0,
    date: app.language('edit_userinfo.selectdate'),
    allValue: '',
    gender: [
      { name: app.language('edit_userinfo.choosesex')},
      { name: app.language('edit_userinfo.male')},
      { name: app.language('edit_userinfo.female')}
    ],
    countries: [
      { name: app.language('edit_userinfo.whiteperson')},
      { name: app.language('edit_userinfo.yellowrace')},
      { name: app.language('edit_userinfo.blackrace')}
    ],
    getMarital: [
      { name: app.language('edit_userinfo.unmarried')},
      { name: app.language('edit_userinfo.married')}
    ],
    motherLanguage: [
      { name: app.language('edit_userinfo.chinese')},
      { name: app.language('edit_userinfo.english')}
    ],
    result: '',
    education: [
      { name: app.language('edit_userinfo.junior')},
      { name: app.language('edit_userinfo.high')},
      { name: app.language('edit_userinfo.junirocollege')},
      { name: app.language('edit_userinfo.undergraduate')},
      { name: app.language('edit_userinfo.graduate')},
      { name: app.language('edit_userinfo.doctor')}
    ],
    industry: [
      { name: app.language('edit_userinfo.internet')},
      { name: app.language('edit_userinfo.finance')},
      { name: app.language('edit_userinfo.education')},
      { name: app.language('edit_userinfo.service')}
    ],
    income: [
      { name: app.language('edit_userinfo.lessthan')},
      { name: '1000~3000' },
      { name: '3000~5000' },
      { name: app.language('edit_userinfo.morethan')}
    ],
    nationality: [],
    actionSheetHidden: true,
    actionSheetItems: [app.language('edit_userinfo.china'), app.language('edit_userinfo.usa')],
    addTypeDis: false,
    actionType: true,
    addTypeData: app.language('edit_userinfo.china'),
    location: location.location,
  },
  onLoad: function () {
    wx.setNavigationBarTitle({
      title: app.language('validator.editusertitle')
    })
    this.getUserInfo()
    wx.getStorage({
      key: 'langIndex',
      success: res => {
        this.setData({
          langIndex: res.data
        })
      }
    });
    this.setLang()
  },
  setLang(){
    const set=wx.T._
    this.setData({
      edit_userinfo:set('edit_userinfo'),
    })
  },
  addType: function (e) {
    this.setData({
      addTypeDis: true,
      actionType: false,
    })
  },
  bindNationTap: function (e) {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden,
      addTypeDis: false,
      actionType: true,
      addTypeData: e.currentTarget.dataset.name,
    })
  },
  bindLocationTap: function (e) {
    console.log(e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  actionSheetChange: function (e) {
    this.setData({
      addTypeDis: false,
      actionType: true,
      actionSheetHidden: !this.data.actionSheetHidden
    })
  },
  getUserInfo() {
    var username = this.data.username;
    var avatar = this.data.avatar;
    var gender = this.data.gender;
    var birthday = this.data.birthday;
    var country = this.data.country;
    var province = this.data.province;
    var city = this.data.city;
    var location = this.data.location;
    var nationality = this.data.nationality;
    var ethnicity = this.data.ethnicity;
    var marital = this.data.marital;
    var motherLanguage = this.data.motherLanguage;
    var education = this.data.education;
    var industry = this.data.industry;
    var income = this.data.income;
    var that = this;
    wx.request({
      url: api.UserInfo(),
      method: 'get',
      header: {
        "Content-Type": "application/json;charset=utf-8",
        Cookie: app.getSid()
      },
      success: function (res) {
        console.log(res)
        that.setData({
          username: res.data.data.username,
          avatar: "http://www.fanhantech.com" + res.data.data.avatar,
        });
        if (res.data.code == 0) {
          app.globalData.header["cookie"] = res.header["set-cookie"];
          wx.showToast({
            title: app.language('validator.savesuccess'),
            icon: 'success',
            duration: 1000
          });
        } else {
          wx.showToast({
            title: app.language('validator.savefail'),
            icon: 'loading',
            duration: 1500
          });
        }
      },
    });
  },
  bindPickerChange: function (e) {
    this.setData({
      gindex: e.detail.value
    })
  },
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },
  bindCountryChange: function (e) {
    this.setData({
      cindex: e.detail.value
    })
  },
  bindgetmotherLanguageChange: function (e) {
    this.setData({
      moindex: e.detail.value
    })
  },
  bindgetMaritalChange: function (e) {
    this.setData({
      mindex: e.detail.value
    })
  },
  bindeducationChange: function (e) {
    this.setData({
      eindex: e.detail.value
    })
  },
  bindindustryChange: function (e) {
    this.setData({
      iindex: e.detail.value
    })
  },
  bindincomeChange: function (e) {
    this.setData({
      nindex: e.detail.value
    })
  },
  formSubmit: function (e) {
    var data = this.data
    var result =
      {
        gender: data.gender[data.gindex].name,
        date: data.date,
        // nationality:nationalitylist.national().list.national,
        nationality: e.detail.value.type,
        location: location.location[data.index].value,
        countries: data.countries[data.cindex].name,
        getMarital: data.getMarital[data.mindex].name,
        motherLanguage: data.motherLanguage[data.moindex].name,
        education: data.education[data.eindex].name,
        industry: data.industry[data.iindex].name,
        income: data.income[data.nindex].name
      }
      console.log(result)
      setTimeout(function () {
        wx.navigateTo({
          url: '../user_info/index',
        })
      }, 1000);
  },
  formReset: function () {
    this.setData({
      allValue: ""
    })
  }
})