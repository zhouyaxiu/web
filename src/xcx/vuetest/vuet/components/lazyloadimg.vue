<template>
  <div id="app">
    <img v-lazy="imgObj" lazy="loading" width="300" height="300">
  </div>
</template>

<script>
export default {
  props:{
    imgUrl:{
      type:String
    }
  },
  computed: {
   imgObj(){
     return `${this.imgUrl}?imageView2/0/w/200`;
   }
  },
};
</script>
<style scoped>
</style>