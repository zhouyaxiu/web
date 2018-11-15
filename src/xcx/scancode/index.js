var app = getApp()
Page({
  data: {
   
  },
  onLoad: function () {
    wx.scanCode({
      success (res) {
        console.log(res,'res')
        let result={
          charSet:res.charSet,
          errMsg:res.errMsg,
          result:res.result,
          scanType:res.scanType
        }
        console.log(result)
        // scanCode:ok
        // PDF_417
        // 12345678
        // UTF-8
      },
      fail(err){
        console.log(err)
      }
    })
  },
  setLang() {
    const set = wx.T._
    this.setData({
      camera: set('camera'),
    })
  },
});