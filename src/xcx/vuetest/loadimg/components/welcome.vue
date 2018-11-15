<template>
  <div>
    welcome
    <!-- <router-link :to="{path:'/welfare'}">fsf</router-link> -->
    <router-view></router-view>
  </div>
</template>

<script>
import {savaToLocal} from './../common/store'
export default {
  data() {
    return {
      
    };
  },
  mounted() {
    setTimeout(()=>{
      this.$router.push({
        name:'welfare'
      });
      savaToLocal('gank','welcome',true)
    },2000)
  }
};
</script>
<style scoped>
</style>