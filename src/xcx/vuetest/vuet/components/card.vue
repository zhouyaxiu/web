<template>
  <div>
    <img v-lazy="data.images?data.images[0]+'?imageView2/0/w/200':null" alt="">
    <div>
      <div>{{data.desc}}</div>
      <div>{{data.who}}</div>
      <div>2018/10/30</div>
    </div>
  </div>
</template>

<script>
export default {
  name:'v-card',
  props:{
    data:{
      type:Object
    }
  }
};
</script>
<style scoped>
</style>