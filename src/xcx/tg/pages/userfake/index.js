Page({
  data: {
    changelangs:[]
  },
  onLoad: function () {
    wx.setNavigationBarTitle({
      title: '个人中心'
    })
    wx.getStorage({
      key: 'changelang',
      success: res => {
        console.log(res)
        this.setData({
          changelangs: res.data
        })
        app.getTabbarLang(this.data.changelangs)
      }
    });
  }
})