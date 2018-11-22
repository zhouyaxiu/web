var util = require('../../utils/util.js')
Page({
  data: {
    selectedid: null,
    id: 1,
    rmbList: [{
        id: 1,
        rmb: 10,
        active: true
      },
      {
        id: 2,
        rmb: 43
      },
      {
        id: 3,
        rmb: 25
      },
      {
        id: 4,
        rmb: 67
      },
      {
        id: 5,
        rmb: 67
      },
      {
        id: 6,
        rmb: 67
      }
    ],
    rest: 12,
    note: '注意事项',
    note_con: '微信扫底部二维码,或去微信搜索泛函关注公众号就能提到微信红包哦！'
  },
  onLoad: function() {
    wx.setNavigationBarTitle({
      title: '提交'
    })
  },
  widthTap: function() {
    wx.navigateTo({
      url: '../widthdraw_success/index',
      success: function() {}
    });
  },
  onSelectedTag: function(e) {
    const eid = e.currentTarget.dataset.id;
    const selected = this.data.selected;
    for (var i = 0, len = eid.length; i < len; ++i) {
      selected[i].checked = selected[i].value == e.detail.value;
    }
    this.setData({
      selectedid: eid
    })
  },
})