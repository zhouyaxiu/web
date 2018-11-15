var event = require("../../utils/event.js");
Page({
  onLoad(options) {
    this.data.query={
      taskid: options.taskid
    }
    event.emit('sendMsg',this.data.query)
    wx.setNavigationBarTitle({
      title: options.taskid
    })
  }
})