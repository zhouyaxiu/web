Page({
  data: {
    fileInfo: [{ imgsrc: '../../images/add.png' }],
    curid: 0,
    selectFileInfo: [],
    filename: ''
  },
  onLoad: function () {
    this.setLang()
  },
  setLang(){
    const set=wx.T._
    this.setData({
      task_save_file:set('task_save_file'),
    })
  },
  bindNameInput: function (e) {
    this.setData({
      filename: e.detail.value
    })
  },
  submit: function () {
    var match = /^http.*$/;
    if (!match.test(this.data.fileInfo[0].imgsrc)) {
      wx.showToast({
        title: app.language('validator.picmust'),
        icon: "loading",
        duration: 1000
      });
    } else if (this.data.filename === '') {
      wx.showToast({
        title: app.language('validator.filenull'),
        icon: "loading",
        duration: 1000
      });
    } else {
      var sinfile = this.data.fileInfo[0]
      sinfile.filename = this.data.filename
      this.data.selectFileInfo.push(sinfile)
      wx.setStorage({
        key: 'selectfileinfo',
        data: this.data.selectFileInfo,
        success: res => {
          this.setData({
            fileInfo: [{ imgsrc: '../../images/add.png' }],
            filename: ''
          })
        }
      })
    }

  },
  viewfile: function () {
    if(this.data.selectFileInfo.length ===0){
      wx.showToast({
        title: app.language('validator.filenull'),
        icon: "loading",
        duration: 1000
      });
      return;
    }else{
      wx.navigateTo({
        url: '../test_select_file/index'
      })
    }
    console.log(this.data.selectFileInfo)
  },
  chooseImage: function (e) {
    let _this = this;
    var id = e.currentTarget.dataset.id;
    _this.data.curid = id;
    wx.showActionSheet({
      itemList: [app.language('validator.album'), app.language('validator.camera')],
      itemColor: "#f7982a",
      success: function (res) {
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
      sizeType: [app.language('validator.original')],
      sourceType: [type],
      success: function (res) {
        if (res.tempFilePaths === "") {
          wx.showToast({
            title: app.language('validator.picmust'),
            icon: "loading",
            duration: 1000
          });
        } else {
          var imgsrc = res.tempFilePaths[0];
          var newImgs = that.data.fileInfo;
          newImgs[that.data.curid].imgsrc = imgsrc
          that.setData({
            fileInfo: newImgs
          })
        }
      }
    })
  },
  delcont: function (e) {
    console.log(e)
    var _this = this;
    var id = e.currentTarget.dataset.id;
    var list = _this.data.fileInfo[0];
    // list[id].imgsrc = ""
    this.setData({
      fileInfo: list
    });
  },
  previewImage: function (e) {
    var id = e.currentTarget.dataset.id
    console.log(id)
    var imgArr = [];
    var objkeys = Object.keys(this.data.fileInfo[0])
    // console.log(objkeys)
    for (var i = 0; i < objkeys.length; i++) {
      imgArr.push(this.data.fileInfo[i].imgsrc)
    }
    wx.previewImage({
      current: imgArr[id],
      urls: imgArr,
    })
  },
})
