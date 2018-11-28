const app = getApp()

Page({
  data: {
    // 虚拟数据
   
  },
  onLoad: function() {
    wx.chooseAddress({
      success (res) {
        console.log(res.userName)
        console.log(res.postalCode)
        console.log(res.provinceName)
        console.log(res.cityName)
        console.log(res.countyName)
        console.log(res.detailInfo)
        console.log(res.nationalCode)
        console.log(res.telNumber)
      }
    })
    
    let tab= wx.getMenuButtonBoundingClientRect()
    console.log(tab)
    wx.showTabBar({
      success(res){
        console.log(res)
      },
      fail(res){
        console.log(res)
      }
    })
    tab.top=100
    tab.bottom=200
    tab.right=200
     console.log(tab)
     wx.setTopBarText({
      text: 'hello, world!'
    })
  },
  addAddressBook(){
    const accountInfo = wx.getAccountInfoSync();
    console.log(accountInfo) // 小程序 appId
   let tab= wx.getMenuButtonBoundingClientRect()
   console.log(tab)
  }
})