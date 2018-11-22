var api = require("../../utils/api.js");
var util = require("../../utils/util.js");
var app = getApp();
Page({
  data: {
    name: "",
    card: "",
    imagePaths: [{
        src: "../../images/add.png",
        name:  app.language('realname_auth.front')
      },
      {
        src: "../../images/add.png",
        name:  app.language('realname_auth.negative')
      },
      {
        src: "../../images/add.png",
        name:  app.language('realname_auth.handheld')
      }
    ]
  },
  onLoad: function() {
    wx.setNavigationBarTitle({
      title:  app.language('validator.authentitle')
    });
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
      realname_auth:set('realname_auth'),
    })
  },
  bindNameInput: function(e) {
    this.setData({
      name: e.detail.value
    });
  },

  bindCardInput: function(e) {
    this.setData({
      card: e.detail.value
    });
  },
  getNameauth() {
    var that = this;
    var name = this.data.name;
    var card = this.data.card;
    that.setData({
      name: name,
      card: card
    });
    wx.request({
      url: api.Nameauth(),
      method: "post",
      header: {
        "Content-Type": "application/json;charset=utf-8",
        Cookie: app.getSid()
      },
      data: {
        realName: name,
        idCardNum: card
      },
      success: function(res) {
        if (res.data == true) {
          wx.showToast({
            title:  app.language('validator.exists'),
            icon: "loading",
            duration: 1000
          });
        }
      },
      fail: function(res) {
        wx.showToast({
          title:  app.language('validator.networkerror'),
          icon: "loading",
          duration: 1500
        });
        setTimeout(function() {
          wx.hideToast();
        }, 2000);
      }
    });
  },
  realnme_auth: function(e) {
    var that = this;
    var name = this.data.name;
    var card = this.data.card;
    var name2 = e.detail.value.name2;
    var card2 = e.detail.value.card2;
    var truename = this.data.name ? this.data.name : name2;
    var truecard = this.data.card ? this.data.card : card2;
    var match = /^http.*$/;

    if (this.data.name == "") {
      wx.showToast({
        title:  app.language('validator.realname'),
        icon: "loading",
        duration: 1000
      });
    } else if (this.data.card == "") {
      wx.showToast({
        title:  app.language('validator.idcardnull'),
        icon: "loading",
        duration: 1000
      });
    } else if (card.length < 15 || card.length > 18) {
      wx.showToast({
        title:  app.language('validator.idcardmiddle'),
        icon: "loading",
        duration: 1000
      });
    } else if (!match.test(this.data.imagePaths[0].src) ||
      !match.test(this.data.imagePaths[1].src) ||
      !match.test(this.data.imagePaths[2].src)
    ) {
      wx.showToast({
        title:  app.language('validator.picmust'),
        icon: "loading",
        duration: 1000
      });
    } else {
      wx.showToast({
        title:  app.language('validator.audit'),
        icon: "loading",
        duration: 1000
      });
      that.getNameauth();
    }
  },

  delcont: function(e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var list = that.data.imagePaths;
    list[index].src = "";
    this.setData({
      imagePaths: list
    });
  },

  chooseimage: function(e) {
    var _this = this;
    var id = e.currentTarget.dataset.id;
    wx.showActionSheet({
      itemList: [ app.language('validator.album'),  app.language('validator.camera')],
      itemColor: "#f7982a",
      success: function(res) {
        if (!res.cancel) {
          if (res.tapIndex == 0) {
            wx.chooseImage({
              count: 1,
              sizeType: [app.language('validator.original'), app.language('validator.compressed')], // 可以指定是原图还是压缩图，默认二者都有
              sourceType: [app.language('validator.album'),app.language('validator.camera')], // 可以指定来源是相册还是相机，默认二者都有
              success: function(res) {
                var imgsrc = res.tempFilePaths[0];
                var f = res.tempFilePaths;
                if (res.tempFiles.path == "") {
                  wx.showToast({
                    title:  app.language('validator.picmust'),
                    icon: "loading",
                    duration: 1000
                  });
                } else {
                  var newImgs = _this.data.imagePaths.concat();
                  newImgs[id].src = imgsrc;
                  _this.setData({
                    imagePaths: newImgs
                  });
                }
              }
            });
          } else if (res.tapIndex == 1) {
            wx.chooseImage({
              count: 1, // 默认9
              sizeType: [ app.language('validator.original'),  app.language('validator.compressed')], // 可以指定是原图还是压缩图，默认二者都有
              sourceType: ["album", "camera"], // 可以指定来源是相册还是相机，默认二者都有
              success: function(res) {
                var imgsrc = res.tempFilePaths[0];
                var f = res.tempFilePaths;
                if (f == "") {
                  wx.showToast({
                    title:  app.language('validator.picmust'),
                    icon: "loading",
                    duration: 1000
                  });
                } else {
                  var newImgs = _this.data.imagePaths.concat();
                  newImgs[id].src = imgsrc;
                  _this.setData({
                    imagePaths: newImgs
                  });
                }
              }
            });
          }
        }
      }
    });
  },
  sourceTypeChange: function(e) {
    this.setData({
      sourceTypeIndex: e.detail.value
    });
  },
  previewImage: function(e) {
    var id = e.currentTarget.dataset.id;
    var current = e.target.dataset.src;
    wx.previewImage({
      current: current
    });
  }
});