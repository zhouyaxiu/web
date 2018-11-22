Page({
  data: {
    navbar: [
      '收入', '支出'
    ],
    remain_money: 120,
    currentTab: 0,
    scrollviewH: 0, // 搜索结果的scrollview高度
    scrollFlag: true, // 上拉分页加载条件
    scrollToView: 'scrollTop', // 返回顶部位置
    backToTop: false, // 返回顶部
    income: [{
        'id': 1,
        'status': '收入',
        'time': '2018-03-12 12:00',
        'money': 120
      },
      {
        'id': 2,
        'status': '收入',
        'time': '2018-03-12 12:00',
        'money': 38
      },
      {
        'id': 3,
        'status': '收入',
        'time': '2018-03-12 12:00',
        'money': 120
      },
      {
        'id': 4,
        'status': '收入',
        'time': '2018-03-12 12:00',
        'money': 120
      },
    ],
    paid: [{
        'id': 1,
        'status': '支出',
        'time': '2018-03-12 12:00',
        'money': 45
      },
      {
        'id': 2,
        'status': '支出',
        'time': '2018-03-12 12:00',
        'money': 23
      },
      {
        'id': 3,
        'status': '支出',
        'time': '2018-03-12 12:00',
        'money': 120
      },
      {
        'id': 4,
        'status': '支出',
        'time': '2018-03-12 12:00',
        'money': 120
      },
    ]
  },
  omLoad: function() {
    wx.setNavigationBarTitle({
      title: '余额'
    })
  },
  onPullDownRefresh: function() {
    setTimeout(function() {
      wx.stopPullDownRefresh();
    }, 1000)
  },
  widthdrawTap: function() {
    wx: wx.redirectTo({
      url: '../widthdraw/index',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  onNavbarTap: function(ev) {
    this.setData({
      currentTab: ev.currentTarget.dataset.index
    });
  },
  onScroll: function(ev) {
    var scrollTop = ev.detail.scrollTop;
    if (scrollTop > 500) {
      that.setData({
        backToTop: true
      });
    } else {
      that.setData({
        backToTop: false
      });
    }
  },
  onBackToTop: function() {
    that.setData({
      scrollToView: 'scrollTop',
      backToTop: false
    });
  },
  onShareAppMessage: function() {
    return {
      title: app.globaldata.ShareAppTitle,
      desc: app.globaldata.ShareAppDesc,
      path: '/pages/index/index'
    }
  }
});