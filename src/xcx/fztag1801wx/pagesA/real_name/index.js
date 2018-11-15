var cfg = require("../../utils/cfg.js");
import WxValidate from "../../utils/wxValidate.js";
var app = getApp();
Page({
  data: {
    imagePaths: [{
      name: app.language('realname.front'),
      key: 'front'
    },
    {
      name: app.language('realname.negative'),
      key: 'back'
    },
    {
      name: app.language('realname.handheld'),
      key: 'hold'
    }
    ],
    truename: '',
    idcard: '',
    alipay: '',
    tempic: [],
    realStatus: 0,
    status: '',
    display: false
  },
  onLoad: function () {
    var that = this
    wx.setNavigationBarTitle({
      title: app.language('validator.realnametitle')
    });
    that.setLang();
    this.validate()
    that.setData({
      imagePaths: [{
        name: app.language('realname.front'),
        key: 'front'
      },
      {
        name: app.language('realname.negative'),
        key: 'back'
      },
      {
        name: app.language('realname.handheld'),
        key: 'hold'
      }
      ],
    })
    cfg.wxPromise(wx.request)({
      url: cfg.getAPIURL() + '/api/user/real',
      header: app.globalData.header,
    })
      .then(response => {
        that.setData({
          realStatus: response.data.data.realStatus,
          truename: response.data.data.realName,
          idcard: response.data.data.idCardNum,
          'imagePaths[0].imgsrc': cfg.getAPIURL() + response.data.data.idCardFront,
          'imagePaths[1].imgsrc': cfg.getAPIURL() + response.data.data.idCardBack,
          'imagePaths[2].imgsrc': cfg.getAPIURL() + response.data.data.idCardHold,
        })
        if (that.data.realStatus === 1) {
          that.setData({
            realStatus: app.language('realname.realStatus1'),
            status: 'audit',
            display: 'display'
          })
        } else if (that.data.realStatus === 2) {
          that.setData({
            realStatus: app.language('realname.realStatus2'),
            status: 'pass',
            display: 'display'
          })
        } else if (that.data.realStatus === 3) {
          that.setData({
            realStatus: app.language('realname.realStatus3'),
            status: 'nopass',
            display: 'display'
          })
        } else {
          return '--'
        }
      })
  },
  bindNameInput: function (e) {
    this.setData({
      truename: e.detail.value
    })
  },
  bindIdCardInput: function (e) {
    this.setData({
      idcard: e.detail.value
    })
  },
  setLang() {
    const set = wx.T._
    this.setData({
      realname: set('realname'),
    })
  },
  chooseImage: function (e) {
    var that = this
    var id = e.currentTarget.dataset.id;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original'], // 可以指定是原图还是压缩图，默认二者都有 'original', 'compressed'
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        var imgsrc = res.tempFilePaths[0];
        var f = res.tempFilePaths;
        if (res.tempFiles.path == "") {
          cfg.titleToast(app.language('validator.picmust'))
        } else {
          var newImgs = that.data.imagePaths;
          newImgs[id].imgsrc = imgsrc;
          that.setData({
            imagePaths: newImgs
          });
          wx.uploadFile({
            url: cfg.getAPIURL() + '/api/upload/user/idcard?type=' + newImgs[id].key,
            header: app.globalData.header,
            filePath: newImgs[id].imgsrc,
            name: 'file',
            success: function (res1) {
              var path = JSON.parse(res1.data).path;
              if (RegExp(/front/).test(path)) {
                that.data.tempic.front = path
              } else if (RegExp(/back/).test(path)) {
                that.data.tempic.back = path
              } else {
                that.data.tempic.hold = path
              }
              console.log(that.data.tempic);
            }
          })
        }
      },
      fail: function (res) {
        cfg.titleToast(app.language('validator.networkerror'))
      }
    })
  },
  refresh: function () {
    this.setData({
      truename: '',
      idcard: '',
      imagePaths: [{
        name: app.language('realname.front'),
        key: 'front'
      },
      {
        name: app.language('realname.negative'),
        key: 'back'
      },
      {
        name: app.language('realname.handheld'),
        key: 'hold'
      }
      ],
      display: ''
    })
  },
  validate: function () {
    const rules = {
      truename: {
        required: true
      },
      idcard: {
        required: true,
      }
    }
    const message = {
      truename: {
        required: app.language('validator.realnamenull'),
      },
      idcard: {
        required: app.language('validator.idcardnull'),
      }
    }
    this.Validate = new WxValidate(rules, message)
  },
  showToast: function (error) {
    wx.showToast({
      title: error.msg,
      icon: 'none',
      duration: 1000
    });
  },
  realname_auth: function (e) {
    if (!this.Validate.checkForm(e.detail.value)) {
      const error = this.Validate.errorList[0]
      this.showToast(error)
      return
    }
    var imgflag = false
    var photolist = []
    for (var i = 0, len = this.data.imagePaths.length; i < len; ++i) {
      if (this.data.imagePaths[i].imgsrc === "" || this.data.imagePaths[i].imgsrc === undefined) {
        imgflag = true
        break
      } else {
        photolist.push(this.data.imagePaths[i].imgsrc);
      }
    }
    if (imgflag) {
      cfg.titleToast(app.language('validator.allpic'))
    }
    this.submit(e)
  },
  submit: function (e) {
    var that=this
    cfg.wxPromise(wx.request)({
      url: cfg.getAPIURL() + '/api/user/real',
      method: 'POST',
      header: app.globalData.header,
      data: {
        realName: that.data.truename,
        idCardNum: that.data.idcard,
        realType: "idcard",
        idCardFront: that.data.tempic['front'],
        idCardBack: that.data.tempic['back'],
        idCardHold: that.data.tempic['hold']
      },
    })
      .then(response => {
        cfg.titleToast(app.language('validator.uploadsuccess'))
        that.onLoad()
      })
      .catch(res => {
        cfg.titleToast(app.language('validator.networkerror'))
      })
  }
});