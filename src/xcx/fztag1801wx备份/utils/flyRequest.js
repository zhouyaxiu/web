import Fly from "./fly.min.js";
var fly=new Fly();
fly.intercetors.request.use((config,promise)=>{
  wx.showLoading({
    title:'加载中',
    mask:true
  })
  return config;
})
fly.intercetors.response.use((response,promise)=>{
  if(typeof (response.data)=='string' && response.data !=''){
    response.data=JSON.parse(response.data);
  }
  if(response.data.code===0){

  }
  wx.hideLoading()
},(err,promise)=>{
  wx.hideLoading()
})
fly.config.baseURL="http://10.0.0.19"
module.exports = {
  fly
};
