Page({
  data: {
    status: '提现成功',
    info: '交易详情已发送到微信请查收',
    use: '提现金额',
    money: 2000,
    widthdraw: [{
        title: '提现时间',
        con: '2018-03-22'
      },
      {
        title: '提现状态',
        con: '成功'
      },
      {
        title: '剩余金额',
        con: '22'
      }
    ]
  },
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: '提交成功'
    })
  },
  indexTap: function() {
    wx.switchTab({
      url: '../user/index'
    });
  },
  onShareAppMessage: function() {
    return {
      title: app.globaldata.ShareAppTitle,
      desc: app.globaldata.ShareAppDesc,
      path: '/pages/index/index'
    }
  }
})