const qiniuUploader = require("../../utils/qiniuUploader");

const regeneratorRuntime = require('../../utils/regenerator')

function myAsyncFunc() {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      console.log("myAsyncFunction done!");
      resolve({ data: "Hello,World" });
    }, 5000);
  });
}

async function test() {
  var result = await myAsyncFunc();
  console.log(result.data); //Hello,World
}

//获取应用实例
var app = getApp();
Page({
  data: {
    imageObject: {}
  },
  //事件处理函数
  onLoad: function () {
    console.log("onLoad");
    var that = this;
  },
  didPressChooseImage: function () {
    // var that = this;
    // didPressChooseImageWorker(that);

    console.log("didPressChooseImage begin");
    test()
    console.log("didPressChooseImage done");
  },
  didCancelTask: function () {
    this.data.cancelTask();
  }
});

function didPressChooseImageWorker(that) {
  wx.chooseImage({
    count: 1,
    success: function (res) {
      var filePath = res.tempFilePaths[0];
      // 交给七牛上传
      qiniuUploader.upload(
        filePath,
        res => {
          that.setData({
            imageObject: res
          });
        },
        error => {
          console.error("error: " + JSON.stringify(error));
        }, {
          region: "ECN",
          uptoken: "VR_A2ZaDEUzIJS5DVmrnlLqWbTnRSKb_O-XDjcpV:YK5NGe8_54RIlDaPYTpn_ti1Hns=:eyJzY29wZSI6InMzMDI6c2VhcHViL3Rlc3RmaWxlIiwiZGVhZGxpbmUiOjE1NjI5MTg0MjQsImZzaXplTGltaXQiOjIwOTcxNTIwfQ==",
          key: "seapub/testfile",
          shouldUseQiniuFileName: false,
          domain: "https://s302.fanhantech.com"
        },
        progress => {
          // ECN, SCN, NCN, NA, ASG : 华东 华南 华北 北美 新加坡
          console.log("上传进度", progress.progress);
          console.log("已经上传的数据长度", progress.totalBytesSent);
          console.log(
            "预期需要上传的数据总长度",
            progress.totalBytesExpectedToSend
          );
        },
        cancelTask => that.setData({
          cancelTask
        })
      );
    }
  });
}