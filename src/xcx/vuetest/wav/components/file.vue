<template>
  <div id="app">
    <ul>
      <li v-for="(item,index) in info" :key="index" @click="showMain(index)">
        {{item.name}}---{{item.id}}
      </li>
    </ul>
    <ul>
      <li v-for="item in infocon" :key="item">
        {{item}}
        <!-- <div v-for="itm in item.two_categroy" :key="itm.pid">
          {{itm.name}}--{{itm.pid}}--{{itm.id}}
        </div> -->
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      info: [
        {
          name: "防盗安全",
          pid: 1,
          id: 2,
          two_categroy: [
            { id: 32, name: "防盗门", pid: 2 },
            { id: 13, name: "开锁换锁", pid: 2 },
            { id: 3, name: "保险柜", pid: 2 }
          ]
        },
        {
          name: "欢庆摄影",
          pid: 1,
          id: 4,
          two_categroy: [
            { id: 32, name: "防盗门", pid: 4 },
            { id: 13, name: "开锁换锁", pid: 4 },
            { id: 3, name: "保险柜", pid: 4 }
          ]
        },
        {
          name: "防盗安全1",
          pid: 1,
          id: 3
        },
        {
          name: "防盗安全5",
          pid: 1,
          id: 5
        },
        {
          name: "防盗安全6",
          pid: 1,
          id: 8,
          two_categroy: [{ id: 32, name: "防盗门", pid: 8 }]
        }
      ],
      infocon: []
    };
  },
  mounted: function() {
    // newData.forEach(function(item) {
    //   console.log(item, "item");
    // });
    // rr.forEach(function(item) {
    //   console.log(item,'item')
    //   var parent = map[item.pid]; //根据当前遍历对象的pid，去map对象中找到对应索引的id
    //    console.log(parent,'parent')
    //   if (parent) {
    //     //如果找到索引，你们说明此项不在顶级当中，那么需要把此项添加到他对应的父级中
    //     (parent.children || (parent.children = [])).push(item);
    //   } else {
    //     //如果没有map中找到对应的id，那么直接把当前的item添加到newData结果集中作为顶级
    //     newData.push(item);
    //   }
    // });
    // console.log(newData,'newData')
  },
  methods: {
    showMain(index) {
      var map = {};
      this.info.forEach(function(item) {
        map[item.id] = item;
      });
      // console.log(map)
      var newD = []
      Object.keys(map).forEach(function(value){
        // console.log(map[value])
        for(let key in map[value].two_categroy){
          // console.log(map[value].two_categroy[key])
          if(map[value].two_categroy[key].pid===map[map[value].two_categroy[key].pid]){
            console.log(map[value].two_categroy[key].pid)
          }
        }
        
      })
      // var newData = [];
      // this.info.forEach(function(item) {
      //   for(let key in item.two_categroy){
      //     var parent=map[item.two_categroy[key].pid]
      //     if(parent && (parent.id===item.two_categroy[key].pid)){
      //       console.log(parent.id)
      //       console.log(item.two_categroy[key].pid)
      //       console.log('有數據呢')
      //       newData.push(item.two_categroy)
      //     }else{
      //       // newData.push(item.two_categroy);
      //       console.log('沒有數據呢')
      //     }
      //     console.log(newData)
      //     // this.infocon = newData;
      //   }
        
      // });
    }
  }
};
</script>
<style scoped>
</style>