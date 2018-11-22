var cfg = require("../../utils/cfg.js");
const qiniuUploader = require("../../utils/qiniuUploader");
var app = getApp();
var taskid = ""
Page({
  data: {
    objectType: [{
      value: app.language('camera1.carpet'),
      checked: false
    }, {
      value: app.language('camera1.pet_dung'),
      checked: false
    },
    {
      value: app.language('camera1.waterlogging'),
      checked: false
    }, {
      value: app.language('camera1.wire'),
      checked: false
    }, {
      value: app.language('camera1.pet'),
      checked: false
    }, {
      value: app.language('camera1.character'),
      checked: false
    }
    ],
    objectPhoto: [
      { imgsrc: '../../images/add.png', key: '' },
      { imgsrc: '../../images/add.png', key: '' }
    ],
    curid: 0,
    selectid: [],
    sop: {},
    uuid: "",
    taskid: "",
    progress: ""
  },
  onLoad: function (options) {
    console.log(options)
    var that = this
    getUUID(that)
    this.setData({
      taskid: options.taskid,
      objectType: [{
        value: app.language('camera1.carpet')
      }, {
        value: app.language('camera1.pet_dung')
      },
      {
        value: app.language('camera1.waterlogging')
      }, {
        value: app.language('camera1.wire')
      }, {
        value: app.language('camera1.pet')
      }, {
        value: app.language('camera1.character')
      }
      ],
    })
    wx.setNavigationBarTitle({
      title: options.taskid
    })
    wx.getStorage({
      key: 'langIndex',
      success: res => {
        that.setData({
          langIndex: res.data
        })
      }
    });
    this.setLang();
  },
  setLang(){
    const set=wx.T._
    this.setData({
      camera1:set('camera1'),
    })
  },
  onShow: function () {
  },
  submit: function () {
    if (this.data.progress !== "") {
      wx.showToast({
        title: app.language('validator.uploading'),
        icon: "loading",
        duration: 2000
      });
      return
    }
    var res = []
    var res0 = {}
    res0["key"] = this.data.objectPhoto[0].key
    res0["filename"] = this.data.objectPhoto[0].imgsrc
    res0["tags"] = this.data.selectid.join(",")
    res[0] = JSON.stringify(res0)

    var res1 = {}
    res1["key"] = this.data.objectPhoto[1].key
    res1["filename"] = this.data.objectPhoto[1].imgsrc
    res1["tags"] = this.data.selectid.join(",")
    res[1] = JSON.stringify(res1)

    if (res0["key"]===""||res1["key"] ===""){
      wx.showToast({
        title: app.language('validator.picmust'),
        icon: "loading",
        duration: 2000
      });
      return
    }

    var that = this
    wx.request({
      url: cfg.getAPIURL() + "/api/projects/" + that.data.taskid + "/task",
      data: {
        id: that.data.taskid,
        uuid: that.data.uuid,
        result: JSON.stringify(res),
      },
      method: "POST",
      header: app.globalData.header,
      success: function(res) {
        console.log(res)
        wx.showToast({
          title: app.language('validator.submission_success'),
          icon: "success",
          duration: 1000
        });
        getUUID(that) // 重新获取任务
        that.setData({ // seapub  [{ imgsrc: '' }, { imgsrc: '' }]
          objectPhoto: [{ imgsrc: '../../images/add.png' }, { imgsrc: '../../images/add.png' }],
        })
      },
      fail: function(res) {
        wx.showToast({
          title: "error",
          icon: "loading",
          duration: 2000
        });
      }
    });
  },
  choiceObject: function (e) {
    var objectType = this.data.objectType
    var checkArr = e.detail.value
    for (var i = 0; i < objectType.length; i++) {
      objectType[i].checked = false
      for (var j = 0; j < checkArr.length; j++) {
        if (objectType[i].value == checkArr[j]) {
          objectType[i].checked = true
          break
        }
      }
    }
    this.setData({
      objectType: objectType,
      selectid: checkArr
    })
  },
  chooseImage: function (e) {
    if (this.data.progress !== "") {
      wx.showToast({
        title: app.language('validator.uploading'),
        icon: "loading",
        duration: 2000
      });
      return
    }
    let _this = this;
    var id = e.currentTarget.dataset.id;
    _this.data.curid = id;
    wx.showActionSheet({
      itemList: [app.language('validator.album'), app.language('validator.camera')],
      itemColor: "#f7982a",
      success: function(res) {
        if (!res.cancel) {
          if (res.tapIndex == 0) {
            _this.chooseWxImage('album')
          } else if (res.tapIndex == 1) {
            _this.chooseWxImage('camera')
          }
        }
      }
    })
  },
  chooseWxImage: function (type) {
    let that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original'],
      sourceType: [type],
      success: function(res) {
        var imgsrc = res.tempFilePaths[0];
        var newImgs = that.data.objectPhoto;
        newImgs[that.data.curid].imgsrc = imgsrc
        that.setData({
          objectPhoto: newImgs
        })
        // 获取上传token
        getUploadToken(that, imgsrc);
      },
      fail:function(){
        
      }
    })
  },
  delcont: function (e) {
    var _this = this;
    var index = e.currentTarget.dataset.index;
    var list = _this.data.objectPhoto;
    list[index].imgsrc = ""
    this.setData({
      objectPhoto: list
    });
  },
  previewImage: function (e) {
    var index = e.currentTarget.dataset.index
    var imgArr = [];
    var objkeys = Object.keys(this.data.objectPhoto)
    // console.log(objkeys)
    for (var i = 0; i < objkeys.length; i++) {
      imgArr.push(this.data.objectPhoto[i].imgsrc)
    }
    wx.previewImage({
      current: imgArr[index],
      urls: imgArr,
    })
  },
})

function getUUID(that) {
  wx.request({
    url: cfg.getAPIURL() + "/api/projects/" + that.data.taskid + "/task",
    method: "get",
    header: app.globalData.header,
    success: function(response) {
      if(response.data.code===0){
        that.setData({
          uuid: response.data.questions[0].uuid,
        });
      }else{
        wx.showToast({
          title: response.data.message,
          icon: "none",
          duration: 2000
        });
      }
    },
    fail: function(res) {
      wx.showToast({
        title: "error",
        icon: "loading",
        duration: 2000
      });
    }
  });
}


function uploadPhoto(that, filePath, key, token) {
  // 交给七牛上传
  qiniuUploader.upload(
    filePath,
    res => {
      console.log("uploadPhoto res");
      that.setData({
        imageObject: res,
        progress: '',
      });
    },
    error => {
      console.error("error: " + JSON.stringify(error));
    }, { // hard coding seapub_todo
      region: "ECN", // ECN, SCN, NCN, NA, ASG : 华东 华南 华北 北美 新加坡
      uptoken: token,
      key: key,
      shouldUseQiniuFileName: false,
      domain: "https://s301.fanhantech.com"
    },
    progress => {
      that.setData({
        progress: progress.progress
      });
      if (that.data.progress === 100) {
        setTimeout(() => {
          that.setData({
            progress: ''
          })
        }, 1000)
      }
      console.log("上传进度", progress.progress);
      // console.log("已经上传的数据长度", progress.totalBytesSent);
      // console.log(
      //   "预期需要上传的数据总长度",
      //   progress.totalBytesExpectedToSend
      // );
    },
    cancelTask => that.setData({
      cancelTask
    })
  );

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
      if (res.data.key !== "" && res.data.token !== "") {
        console.log(filename, res.data.key, res.data.token)
        uploadPhoto(that, filename, res.data.key, res.data.token)
        var newImgs = that.data.objectPhoto;
        newImgs[that.data.curid].key = res.data.key
        that.setData({
          objectPhoto: newImgs,
          // progress: '',
        })
        console.log(that.data.objectPhoto)
      } else {
        wx.showToast({
          title: app.language('validator.uploadfail'),
          icon: "loading",
          duration: 1500
        });
      }
    }
  });
}
