<template>
  <div>
    <input type="text" id="a">
    <span id="b"></span>
  </div>
</template>

<script>
export default {
  data() {
    return {
     
    };
  },
  mounted:function() {
    var obj={};
    //为obj定义一个名为hello的访问器属性
    Object.defineProperty(obj,'hello',{
      get:function(){

      },
      set:function(val){
        document.getElementById('a').value=val;
        document.getElementById('b').innerHTML=val;
      }
    })
    obj.hello  //可以像普通属性一样读取服务器属性
    obj.hello='abc' //为属性赋值，就是调用set函数，赋值就是传参
    document.addEventListener('keyup',function(e){
      console.log(e.target.value)
      obj.hello=e.target.value
    })
  }
};
</script>
<style scoped>
</style>