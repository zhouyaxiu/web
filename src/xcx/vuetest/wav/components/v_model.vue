<template>
  <div id="app">
    <input type="text" id="a">
    <span id="b"></span>
  </div>
</template>

<script>
var dom=nodeToFragment(document.getElementById('app'))
console.log(dom)
function nodeToFragment(node,vm){
  var flag=document.createDocumentFragment();
  var child;
  while(child=node.firstChild){
    compile(child,vm);
    flag.appendChild(child)
  }
  return flag;
}
document.getElementById('app')
function compile(node,vm){
  var reg=/\{\{(.*)\}\}/;
  //节点类型为元素
  if(node.nodeType===1){
    var attr=node.attributes;
    //解析属性
    for(var i=0;i<attr.length;i++){
      if(attr[i].nodeName=='v-model'){
        var name=attr[i].nodeValue;//获取v-model绑定的属性名
        node.value=vm.data[name];//将data的值赋给该node
        node.removeAttribute('v-model');
      }
    }
  }
  //节点类型为text
  if(node.nodeType===3){
    if(reg.test(node.nodeValue)){
      var name=RegExp.$1;
      name=name.trim();
      node.nodeValue=vm.data[name];
    }
  }
}
function Vue(options){
  this.data=options.data;
  var id=options.el;
  var dom=nodeToFragment(document.getElementById(id),this);
  //编译完成后，将dom返回到app中
  document.getElementById(id).appendChild(dom)
}
export default {
  data() {
    return {
      text:'hello worrld'
    };
  },
};
</script>
<style scoped>
</style>