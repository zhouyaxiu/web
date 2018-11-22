const qiniuUploader = require("../../utils/qiniuUploader");
var cfg = require("../../utils/cfg.js");

var app = getApp();
var uploadList = [], res = {}
Page({
  data: {
    gender: [
      {
        value: '男',
        checked: false
      }, {
        value: '女',
        checked: false
      }
    ],
    model: [
      {
        value: '苹果手机',
        checked: false
      }, {
        value: '安卓手机',
        checked: false
      }
    ],
    cameratype: [
      {
        value: '前置摄像头',
        checked: false
      }, {
        value: '后置摄像头',
        checked: false
      }
    ],
    photos: [ // key  imgsrc:本地路径 defaultImg:样例图片
      {
        defaultImg: "../../images/img25/t20_1.jpg",
        info: "大笑",
      },
      {
        defaultImg: "../../images/img25/t20_2.jpg",
        info: "微笑",
      }
      ,
      {
        defaultImg: "../../images/img25/t20_3.jpg",
        info: "张嘴",
      },
      {
        defaultImg: "../../images/img25/t20_4.jpg",
        info: "伤心（撇嘴+眼睛朝下看）",
      },
      {
        defaultImg: "../../images/img25/t20_5.jpg",
        info: "恐惧（咬牙+皱眉）",
      },
      {
        defaultImg: "../../images/img25/t20_6.jpg",
        info: "惊讶（张嘴+瞪眼）",
      },
      {
        defaultImg: "../../images/img25/t20_7.jpg",
        info: "厌恶（皱眉+斜眼）",
      },
      {
        defaultImg: "../../images/img25/t20_8.jpg",
        info: "生气（皱眉+抿嘴）",
      },
      {
        defaultImg: "../../images/img25/t20_9.jpg",
        info: "皱眉",
      },
      {
        defaultImg: "../../images/img25/t20_10.jpg",
        info: "瞪眼",
      },
      {
        defaultImg: "../../images/img25/t20_11.jpg",
        info: "鼓气",
      },
      {
        defaultImg: "../../images/img25/t20_12.jpg",
        info: "嘟嘴",
      },
      {
        defaultImg: "../../images/img25/t20_13.jpg",
        info: "白眼",
      },
      {
        defaultImg: "../../images/img25/t20_14.jpg",
        info: "坏笑",
      },
      {
        defaultImg: "../../images/img25/t20_15.jpg",
        info: "下唇包住上唇",
      },
      {
        defaultImg: "../../images/img25/t20_16.jpg",
        info: "撇嘴挤眼",
      },
      {
        defaultImg: "../../images/img25/t20_17.jpg",
        info: "嘟嘴+皱眉",
      },
      {
        defaultImg: "../../images/img25/t20_18.jpg",
        info: "鼓气+皱眉",
      },
      {
        defaultImg: "../../images/img25/t20_19.jpg",
        info: "斜眼",
      },
      {
        defaultImg: "../../images/img25/t20_20.jpg",
        info: "手机在左上30°(五官必须看清楚)",
      },
      {
        defaultImg: "../../images/img25/t20_21.jpg",
        info: "手机在右上30°(五官必须看清楚)",
      },
      {
        defaultImg: "../../images/img25/t20_22.jpg",
        info: "手机在左边20°(五官必须看清楚)",
      },
      {
        defaultImg: "../../images/img25/t20_23.jpg",
        info: "手机在右边20°(五官必须看清楚)",
      },
      {
        defaultImg: "../../images/img25/t20_24.jpg",
        info: "手机在下方(五官必须看清楚)",
      },
      {
        defaultImg: "../../images/img25/t20_25.jpg",
        info: "自然",
      }
    ],
    age: "", // 用户输入参数
    teamid: "", // teamid
    selectgender: "", // 用户输入参数
    selectmodel: "", // 用户输入参数
    selectcamera: "", // Front_camera / Rear_camera
    uuid: "",
    taskid: "",
    canupload: true,
    account: 0,
    allaccount: 0
  },
  onLoad: function (options) {
    this.data.taskid = options.taskid
    getUUID(this)
    wx.setNavigationBarTitle({
      title: options.taskid
    })
    this.setData({
      allaccount: this.data.photos.length
    })
  },
  bindAgeInput: function (e) {
    this.setData({
      age: e.detail.value
    });
  },
  bindTeamidInput: function (e) {
    this.setData({
      teamid: e.detail.value
    });
  },
  choiceGender: function (e) {
    this.data.selectgender = e.detail.value
    var gender = this.data.gender;
    for (var i = 0, len = gender.length; i < len; ++i) {
      gender[i].checked = gender[i].value == e.detail.value
    }
    this.setData({
      gender: gender
    });
  },
  choiceModel: function (e) {
    this.data.selectmodel = e.detail.value
    var model = this.data.model;
    for (var i = 0, len = model.length; i < len; ++i) {
      model[i].checked = model[i].value == e.detail.value
    }
    this.setData({
      model: model
    });
  },
  choiceCamera: function (e) {
    this.data.selectcamera = e.detail.value
    var cameratype = this.data.cameratype;
    for (var i = 0, len = cameratype.length; i < len; ++i) {
      cameratype[i].checked = cameratype[i].value == e.detail.value
    }
    this.setData({
      cameratype: cameratype
    });
  },
  frontTask: function () {
    var that = this;
    if (that.data.account > 0) {
      that.setData({
        account: that.data.account - 1
      })
    } else {
      console.log('已经是第一个了')
      return;
    }
  },
  validate: function () {
    var that = this;
    var rule = {
      age:[{
        validate: that.data.age === "",
        message: '年龄不能为空'
      }, {
        validate: Number(that.data.age) <= 1 || Number(that.data.age) > 100,
        message: '年龄 1至100'
      }],
      teamid: [{
        validate: that.data.teamid === "",
        message: "请选择组号"
      }],
      gender: [{
        validate: that.data.selectgender === "",
        message: "请选择性别"
      }],
      camera: [{
        validate: that.data.selectcamera === "",
        message: "请选择摄像头"
      }],
      model: [{
        validate: that.data.selectmodel === "",
        message: "必须选择机型"
      }],
      img: [{
        validate: that.data.account !== 0 && that.data.photos[that.data.account - 1].imgsrc === "" ,
        message: "请上传图片"
      }]
    }
    for (var key in rule) {
      for(var i in rule[key]){
        if (rule[key][i].validate){
          wx.showToast({
            title: rule[key][i].message,
            icon: "loading",
            duration: 1000
          });
          console.log(rule[key][i].message)
          return false
        }
      }
    }
    return true
  },
  nextTask: function () {
    var that = this;
    if (that.validate()){
      if (that.data.account === that.data.allaccount){
        submit(that)
      }
      that.setData({
        account: that.data.account + 1
      })
    }
      
  },
  // 开始拍照
  chooseImage: function (e) {
    // console.log(e)
    var that = this
    if (!that.data.canupload) {
      wx.showToast({
        title: "文件正在上传", // 文件正在上传
        icon: "loading",
        duration: 2000
      });
      return
    }
    var index = e.currentTarget.dataset.id;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original'], // 可以指定是原图还是压缩图，默认二者都有 'original', 'compressed'
      sourceType: ['camera', 'album'], // 可以指定来源是相册还是相机，默认二者都有
      // camera: 'front',
      success: function (res) {
        var tempFile = res.tempFilePaths[0];
        // 获取上传token
        upload(that, index, tempFile);
      },
      fail: function () {

      }
    })
  },
});

function getUUID(that) {
  wx.request({
    url: cfg.getAPIURL() + "/api/projects/" + that.data.taskid + "/task",
    method: "get",
    header: app.globalData.header,
    success: function (response) {
      var photos = that.data.photos;
      for (var i = 0, len = photos.length; i < len; ++i) {
        photos[i].imgsrc = ""
        photos[i].key = ""
        photos[i].progress = 0
      }
      that.setData({
        uuid: response.data.questions[0].uuid,
        photos: photos,
      });
    },
    fail: function (response) {
      wx.showToast({
        title: "error",
        icon: "loading",
        duration: 2000
      });
    }
  });
}

function doUpload(that, index, tempFile, key, token) {
  // 交给七牛上传
  console.log("开始上传");
  qiniuUploader.upload(tempFile,
    function (res) {
      console.log("上传完成", key);
      that.data.canupload = true
      var photos = that.data.photos;
      photos[index].key = key
      photos[index].imgsrc = tempFile
      photos[index].progress = 0
      that.setData({
        photos: photos,
      })
      // console.log(photos)
      var uploadData = {
        key: res.key,
        imageURL: res.imageURL,
        hash: res.hash
      }
      console.log(index)
      if (uploadList[index]) {
        uploadList[index] = uploadData
      } else {
        uploadList.push(uploadData)
      }
      console.log(uploadList)
    },
    function (error) {
      console.log("上传失败", JSON.stringify(error));
      wx.showToast({
        title: "上传失败",
        icon: "loading",
        duration: 1500
      });
    }, { // hard coding seapub_todo
      region: "ECN", // ECN, SCN, NCN, NA, ASG : 华东 华南 华北 北美 新加坡
      uptoken: token,
      key: key,
      shouldUseQiniuFileName: false,
      domain: "https://s301.fanhantech.com"
    },
    function (res) {
      console.log("上传进度", res.progress);
      var photos = that.data.photos;
      var progress = 'photos[' + index + '].progress'
      that.setData({
        [progress]: res.progress || 1,
      })
      if (res.progress === 100) {
        setTimeout(function () {
          that.setData({
            [progress]: 0,
          })
        }, 2000);
      }
    }
  );
}
function upload(that, index, tempFile) {
  that.data.canupload = false
  wx.request({
    url: cfg.getAPIURL() + "/api/projects/" + that.data.taskid + "/token",
    data: {
      taskid: that.data.taskid,
      filename: tempFile,
    },
    header: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Cookie": app.getCookie()
    },
    method: "POST",
    success: function (res) {
      if (res.data.code === 0) {
        doUpload(that, index, tempFile, res.data.key, res.data.token)
      } else {
        wx.showToast({
          title: "获取上传token失败",
          icon: "loading",
          duration: 1500
        });
      }
    },
    fail: function (res) {
      console.log(res)
    }
  });
}

function submit(that) {
  var res = {}
  res["wholeInputContents"] = [
    that.data.age,
    that.data.selectgender,
    that.data.selectmodel,
    that.data.selectcamera,
    that.data.teamid,
  ]
  var photolist = []
  var photos = that.data.photos;
  for (var i = 0, len = photos.length; i < len; ++i) {
    photolist.push(photos[i].key)
  }
  res["fileList"] = photolist;
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
      // console.log(res)
     if(res.data.code===0){
      wx.showToast({
        title: "提交成功",
        icon: "success",
        duration: 1000
      });
      setTimeout(function () {
        wx.navigateTo({
          url: '../task_detail/index?taskid=' + that.data.taskid,
        })
      }, 1000);
     }else{
      wx.showToast({
        title: res.data.message,
        icon: "none",
        duration: 1000
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
