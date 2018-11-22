Page({
  data: {
    selectFileInfo:[],
    index:0,
  },
  
  onLoad: function (options) {
    wx.getStorage({
      key:'selectfileinfo',
      success:res=>{
        console.log(res);
        this.setData({
          selectFileInfo:res.data
        })
      }
    })
    console.log(this.data.selectFileInfo)
  },
  bindSelectFile: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
})
