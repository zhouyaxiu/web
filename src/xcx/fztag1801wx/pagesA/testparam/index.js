var cfg = require('../../utils/cfg.js')
var app = getApp()
Page({
  data:{
    comment_list:[
      {name:'jack',age:20},
      {name:'jack',age:243},
      {name:'jack',age:46},
      {name:'jack',age:57},
      {name:'jack',age:13},
      {name:'jack',age:68},
      {name:'jack',age:4635},
      {name:'jack',age:68}
    ]
  },
  onLoad:function(){
    wx.setNavigationBarTitle({
      title: app.language('validator.agreetitle')
    });
    this.setData({
      id:10
    })
  },
  onMyEvent:function(e){
    console.log(e)
    this.setData({
      paramZiToFu:e.detail.paramZiToFu
    })
  },
  get_emit:function(e){
    console.log(e)
    this.setData({
      is_show:e.detail.val
    })
  }
})