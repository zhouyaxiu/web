Page({
  data: {
  },
  onLoad() {
    wx.createSelectorQuery().select('#nodes').boundingClientRect(function(rect){
      rect.id      // 节点的ID
      rect.dataset // 节点的dataset
      rect.left    // 节点的左边界坐标
      rect.right   // 节点的右边界坐标
      rect.top     // 节点的上边界坐标
      rect.bottom  // 节点的下边界坐标
      rect.width   // 节点的宽度
      rect.height  // 节点的高度
    }).exec()
    wx.createSelectorQuery().select('#nodes').fields({
      dataset: true,
      size: true,
      scrollOffset: true,
      properties: ['scrollX', 'scrollY'],
      computedStyle: ['margin', 'backgroundColor']
    },function(res){
      console.log(res)
    }).exec()
    wx.createSelectorQuery().selectViewport().scrollOffset(function(res){
      res.id      // 节点的ID
      res.dataset // 节点的dataset
      res.scrollLeft // 节点的水平滚动位置
      res.scrollTop  // 节点的竖直滚动位置
      console.log(res)
    }).exec()
  },
  onShow:function(){
    var query=wx.createSelectorQuery()
    query.select('#viewport').boundingClientRect()
    query.exec(function(res){
      console.log(res[0],'resss')
    })
  }
})
