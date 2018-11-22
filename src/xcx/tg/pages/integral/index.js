var app=getApp();
Page({
  data: {
    yours: '你的积分：',
    info: '提现到',
    url: 'https://www.fanhantech.com/',
    integral: 0,
  },
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: '你的积分'
    })
    this.setData({
      integral: 2000
    })
    wx.getSystemInfo({
      success:res=>{
        console.log(res.windowHeight)
        this.setData({
          screenHeight:res.windowHeight/2.618+"px",
        })
        console.log(this.data.screenHeight)
      }
    })
    app.getUserInfo()
  },
  copyTap: function() {
    wx.setClipboardData({
      data: this.data.url,
      success: function(res) {
        console.log(res);
        wx.showToast({
          title: "复制成功",
          icon: "success",
          duration: 1500
        });
      }
    })
  }
})