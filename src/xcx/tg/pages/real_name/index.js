var cfg = require("../../utils/cfg.js");
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
    wx.getStorage({
      key: 'langIndex',
      success: function(res)  {
        that.setData({
          langIndex: res.data
        })
      }
    });
    that.setLang();
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
    wx.request({
      url: cfg.getAPIURL() + '/api/user/real',
      method: 'GET',
      header: app.globalData.header,
      success: function(response) {
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
      },
      fail: function(response) {
        wx.showToast({
          title: response.errMsg,
        })
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
      success: function(res) {
        var imgsrc = res.tempFilePaths[0];
        var f = res.tempFilePaths;
        if (res.tempFiles.path == "") {
          wx.showToast({
            title: app.language('validator.picmust'),
            icon: "none",
            duration: 1000
          });
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
            success: function(res1) {
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
      fail: function(res) {
        wx.showToast({
          title: "error",
          icon: "none",
          duration: 2000
        });
      }
    })
  },
  refresh:function(){
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
      display:''
    })
    // this.realname_auth();
    // this.onLoad();
  },
  realname_auth: function (e) {
    var that = this
    if (this.data.truename === '') {
      wx.showToast({
        title: app.language('validator.realnamenull'),
        icon: "none",
        duration: 1000
      });
    } else if (this.data.idcard === '') {
      wx.showToast({
        title: app.language('validator.idcardnull'),
        icon: "none",
        duration: 1000
      });
    } else if (this.data.idcard.length < 15 || this.data.idcard.length > 18) {
      wx.showToast({
        title: app.language('validator.idcardmiddle'),
        icon: "none",
        duration: 1000
      });
    } else {
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
        wx.showToast({
          title: app.language('validator.allpic'),
          icon: "none",
          duration: 1000
        });
      } else {
        wx.request({
          url: cfg.getAPIURL() + '/api/user/real',
          method: 'POST',
          data: {
            realName: this.data.truename,
            idCardNum: this.data.idcard,
            realType: "idcard",
            idCardFront: this.data.tempic['front'],
            idCardBack: this.data.tempic['back'],
            idCardHold: this.data.tempic['hold']
          },
          header: app.globalData.header,
          success: function(response) {
            wx.showToast({
              title: app.language('validator.uploadsuccess'),
              icon: "none",
              duration: 1000
            });
            that.onLoad()
          },
          fail: function(response) {
            wx.showToast({
              title: response.errMsg,
            })
          }
        })
      }
    }
  },
});