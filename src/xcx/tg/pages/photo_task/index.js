var util = require('../../utils/util.js')
Page({
  data: {
    delBtnWidth: 60,
    imagePhotos: [{
        title: '向左转90度',
        defaultImg: '../../images/default.jpg',
        uploadImg: ''
      },
      {
        title: '向右转90度',
        defaultImg: '../../images/default.jpg',
        uploadImg: ''
      },
      {
        title: '向左转60度',
        defaultImg: '../../images/default.jpg',
        uploadImg: ''
      },
      {
        title: '向右转60度',
        defaultImg: '../../images/default.jpg',
        uploadImg: ''
      },
      {
        title: '向左转30度',
        defaultImg: '../../images/default.jpg',
        uploadImg: ''
      }
    ],
    editable: false,
    hide: true,
    photo: [{
      title: '上传图片',
      intro: '1.必须是西瓜，可以是切开的也可以是完整的，背景必须不同，不能是网上的图片，必须是自己拍摄的，不能是地里带叶子的西瓜',
    }],
  },

  chooseImage: function() {
    let _this = this;
    wx.showActionSheet({
      itemList: ['从相册中选择', '拍照'],
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
  chooseimage: function(e) {
    var _this = this,
      id = e.currentTarget.dataset.id;
    wx.chooseImage({
      count: 1, // 默认9  
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有  
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
      success: function(res) {
        var imgsrc = res.tempFilePaths[0];
        var newImgs = _this.data.imagePhotos.concat();
        newImgs[id].uploadImg = imgsrc
        _this.setData({
          imagePhotos: newImgs
        })
      }
    })
  },
  delcont: function(e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var list = that.data.imagePaths;
    list[index].src = ""
    this.setData({
      imagePaths: list
    });
  },
  last_step: function() {
    wx.navigateTo({
      url: '../task_detail/index',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  sub_step: function() {
    wx.navigateTo({
      url: '../commit/index',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
})