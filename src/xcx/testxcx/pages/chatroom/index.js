//index.js
//获取应用实例
const app = getApp()
var socketOpen = false
Page({
  data: {
    // socketOpen: false,
    inputValue: '',
    msgKey:0,
    items:[]
  },
  //事件处理函数
  onReady:function(){
    var self=this
    // https://s301.fanhantech.com/RIlXHvxP001/vnYsNIQxiA6HCyvBv6pVKqhthCXZi7tc.jpg
    // https://s301.fanhantech.com/RIlXHvxP001/JXIHavy5vC1T4QOGTd2Fi5319w8lYDmt.mp4
    if(!socketOpen){
      wx.connectSocket({
        // url:'ws://localhost:8088',
        // url:'ws://192.168.1.120:8088',
        url:'ws://10.0.0.40:3008',
        // success() {
        //   console.log('success');
        // },
        // fail() {
        //   console.log('fail')
        // }
      })
      wx.onSocketOpen(function(res){
        socketOpen = true
        console.log('websocket连接已打开')
        self.setData({
          socketOpen:true
        })
        wx.sendSocketMessage({
          data: JSON.stringify({
            state: 0,
            msg: app.globalData.userInfo.nickName + "登录聊天室"
        })
        })
      })
      wx.onSocketMessage(function(res){
        console.log(res,'RES1')
        self.setData({
          msgKey:self.data.msgKey++
        })
        res = JSON.parse(res.data)
        console.log(res)
        var data={
          nickName: res.nickName,
          avatarUrl: res.avatarUrl,
          text: res.text,
          time: res.time,
          key: self.data.msgKey,
          isSelf: false
        }
        var items=self.data.items
        items.push(data)
        self.setData({
          items:items
        })
        wx.pageScrollTo({
          scrollTop: 300,
          duration: 300,
        })
      })
      wx.onSocketError(function (res) {
        console.log(res,'RES3')
        wx.hideLoading();
        wx.showModal({
            title: '错误',
            content: '服务器连接失败，请联系管理员或者稍后再试',
        });
        self.setData({
          socketOpen: false
        });
      });
      wx.onSocketClose(function (res) {
        console.log(res)
        console.log('WebSocket连接已关闭！')
        self.setData({ socketOpen: false })
      })
    }else{
      wx.closeSocket()
    }
  },
  onLoad: function () {
    
  },
  getInput: function(e){
    this.setData({
      inputValue: e.detail.value
    })
  },
  send: function(e){
    var self = this
    if(this.data.inputValue.trim() !== ''){
      if(this.data.socketOpen){
        wx.sendSocketMessage({
          data: JSON.stringify({
            nickName: app.globalData.userInfo.nickName,
            avatarUrl: app.globalData.userInfo.avatarUrl,
            text: this.data.inputValue,
            time: new Date()
          })
        })
      }
      this.setData({
        inputValue: ""
      })
    }
  }
})
