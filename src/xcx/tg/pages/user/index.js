var app = getApp()
Page({
  data: {
    remain: 12,
    bag: 2,
    list: [{
      'id': 1,
      'img': '../../images/widthdraw.png',
      'name': "审核管理",
      'url': 'examine_list',
      'bg': '#34ff74'
    },
    {
      'id': 2,
      'img': '../../images/remain.png',
      'name': "收入记录",
      'url': 'remain',
      'bg': '#ff5c71'
    },
    {
      'id': 3,
      'img': '../../images/tixian.png',
      'name': "提现",
      'url': 'widthdraw',
      'bg': '#5c9cff'
    },
    {
      'id': 4,
      'img': '../../images/user_info.png',
      'name': "个人信息",
      'url': 'user_info',
      'bg': '#ffa15c'
    }
    ],
  },

  onLoad: function () {
    wx.setNavigationBarTitle({
      title: '个人中心'
    })
  },

  onShareAppMessage: function () {
    return {
      title: app.globaldata.ShareAppTitle,
      desc: app.globaldata.ShareAppDesc,
      path: '/pages/index/index'
    }
  }
})