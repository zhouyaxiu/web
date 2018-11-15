var event = require("../../utils/event.js");
var cfg = require("../../utils/cfg.js");
Page({
  onLoad(options) {
    this.data.query={
      status: options.status,
      taskid: options.taskid,
      uuid: options.uuid,
    }
    event.emit('sendMsg',this.data.query)
    wx.setNavigationBarTitle({
      title: options.taskid
    })
  }
});
