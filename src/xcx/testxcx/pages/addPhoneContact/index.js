const app = getApp()

Page({
  data: {
    // 虚拟数据
    name: '交了',
    mobile: '13567740044',
    company: '公司名称',
    position: '我的职位'
  },
  onLoad: function() {
    console.log('代码片段是一种迷你、可分享的小程序或小游戏项目，可用于分享小程序和小游戏的开发经验、展示组件和 API 的使用、复现开发问题和 Bug 等。可点击以下链接查看代码片段的详细文档：')
    console.log('https://mp.weixin.qq.com/debug/wxadoc/dev/devtools/devtools.html')
  },

  addAddressBook: function(e) {
    const _this = this,
      firstName = _this.data.name,
      mobilePhoneNumber = _this.data.mobile,
      organization = _this.data.company,
      title = _this.data.position;

    _this.addPhoneContact({
      firstName,
      mobilePhoneNumber,
      organization,
      title
    });
  },

  addPhoneContact(parameter) {
    if (!parameter || typeof parameter != 'object') {
      console.log('请传入正确的手机系统通讯录参数！')
      return;
    }
    wx.addPhoneContact({
      firstName: parameter.firstName || '', // 姓名
      mobilePhoneNumber: parameter.mobilePhoneNumber || '', // 手机号
      organization: parameter.organization || '', // 公司
      title: parameter.title || '', // 职位
      success: function(e) {
        wx.showToast({
          icon: 'success',
          title: '添加成功',
        })
      },
      fail: function(e) {
        wx.showToast({
          icon: 'none',
          title: '添加失败',
        })
      }
    })
  }
})