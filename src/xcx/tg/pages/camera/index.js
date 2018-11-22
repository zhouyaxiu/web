var app = getApp();
var taskid = ""
Page({
  data: {
    items: [{
      title: app.language('camera.id_photo'),
      id: 0,
      defaultImg: "../../images/zhenjian.jpg",
      src: "../../images/add.png"
    },
    {
      title: app.language('camera.full_photo'),
      id: 1,
      defaultImg: "../../images/quanshen.jpg",
      src: "../../images/add.png"
    }
    ],
    curid: 0, // 当前的图片id
    devicePosition: "back", // back 后置摄像头; front 前置摄像头
    flash: "auto", // 闪光灯  auto on off
    isShow: false, // true:显示拍照界面
    username: "", // 用户输入参数
    age: "", // 用户输入参数
    agreement: 0, // true:同意协议
    needBorder: true
  },
  onLoad: function (options) {
    console.log(options)
    var that = this
    that.setData({
      taskid: options.taskid,
    })
    wx.setNavigationBarTitle({
      title: options.taskid
    })
    wx.getStorage({
      key: 'langIndex',
      success: function(res) {
        that.setData({
          langIndex: res.data
        })
      }
    });
    that.setLang()
  },
  setLang() {
    const set = wx.T._
    this.setData({
      camera: set('camera'),
    })
  },
  bindNameInput: function (e) {
    this.setData({
      username: e.detail.value
    });
  },
  bindAgeInput: function (e) {
    this.setData({
      age: e.detail.value
    });
  },
  bindAgreement: function (e) {
    this.data.agreement = e.detail.value.length;
  },
  submit: function () {
    var username = this.data.username;
    var age = this.data.age;
    var that = this;
    if (this.data.username === "") {
      wx.showToast({
        title: app.language('validator.username'),
        icon: "none",
        duration: 1500
      });
    } else if (this.data.age === "") {
      wx.showToast({
        title: app.language('validator.age'),
        icon: "none",
        duration: 1500
      });
    } else if (this.data.agreement === 0) {
      wx.showToast({
        title: app.language('validator.check'),
        icon: "none",
        duration: 1500
      });
    } else {
      wx.switchTab({
        url: "../index/index"
      });
    }
  },
  // 开始拍照
  chooseimage: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    that.data.curid = id;
    var isshow = that.data.isShow;
    if (that.data.curid === 1) {
      that.setData({
        needBorder: false
      });
    } else {
      that.setData({
        needBorder: true
      });
    }
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.camera']) {
          wx.authorize({
            scope: 'scope.camera',
            success() {
              that.setData({
                isShow: !isshow
              })
            },
            fail() {
              wx.showModal({
                title: app.language('validator.tips'),
                content: app.language('validator.notused'),
                showCancel: false,
                success: function (res) {
                  wx.navigateTo({
                    url: '../setting/index',
                  })
                  wx.setStorage({
                    key: "function",
                    data: 'camera',
                  })
                }
              })
            }
          })
        } else {
          that.setData({
            isShow: !isshow
          });
        }
      }
    })
  },
  // 快门
  takePhoto() {
    var that = this;
    const ctx = wx.createCameraContext();
    var isshow = that.data.isShow;
    ctx.takePhoto({ // 拍照后即开始上传
      quality: "high", // high
      success: function(res) {
        var imgsrc = res.tempImagePath;
        that.data.items[that.data.curid].src = imgsrc;
        if (that.data.curid === 1) {
          that.data.needBorder = that.data.noneed;
          that.setData({
            isShow: !isshow,
            items: that.data.items
          });
        } else {
          that.data.needBorder = that.data.need;
          that.setData({
            isShow: !isshow,
            items: that.data.items
          });
        }
        // 上传图片
        var keytoken = getUploadToken(that, res.tempImagePath);
        console.log(keytoken)
        uploadPhoto(that, res.tempImagePath, keytoken[0], keytoken[1])
      }
    });
  },
  deviceRadioChange: function (e) {
    var devicePosition = this.data.devicePosition;
    if (devicePosition === "front") {
      this.setData({
        devicePosition: "back"
      });
    } else {
      this.setData({
        devicePosition: "front"
      });
    }
  },
});


function uploadPhoto(that, filename, key, token) {
  wx.chooseImage({
    count: 1,
    success: function (res) {
      var filePath = res.tempFilePaths[0];
      // 交给七牛上传
      qiniuUploader.upload(filePath, function(res) {
          that.setData({
            imageObject: res
          });
        },
        function(error) {
          console.error("error: " + JSON.stringify(error));
        }, { // hard coding seapub_todo
          region: "ECN", // ECN, SCN, NCN, NA, ASG : 华东 华南 华北 北美 新加坡
          uptoken: token,
          key: key,
          shouldUseQiniuFileName: false,
          domain: "https://s301.fanhantech.com"
        },
        function(progress) {
          console.log("上传进度", progress.progress);
          console.log("已经上传的数据长度", progress.totalBytesSent);
          console.log(
            "预期需要上传的数据总长度",
            progress.totalBytesExpectedToSend
          );
        },
        function(cancelTask) {
          that.setData({
          cancelTask
        })}
      );
    }
  });
}

function getUploadToken(that, filename) {
  wx.request({
    url: cfg.getAPIURL() + "/api/projects/" + that.data.taskid + "/token",
    data: {
      taskid: that.data.taskid,
      filename: filename,
    },
    header: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Cookie": app.getCookie()
    },
    method: "POST",
    success: function (res) {
      if (res.data.code === 0) {
        return [res.data.key, res.data.token];
      } else {
        wx.showToast({
          title: app.language('validator.uploadfail'),
          icon: "none",
          duration: 1500
        });
      }
    }
  });
}
