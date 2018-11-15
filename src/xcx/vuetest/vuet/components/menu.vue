<template>
  <div>
    <img class="menu-avatar" src="https://avatars0.githubusercontent.com/u/11735533?v=3&amp;u=02b515725d0e52cdf5f02e2dbdc98c1de3ddbcc2&amp;s=400" alt="">
    <div class="menu-title">YangYi && liangxiaojuan</div>
    <div v-for="(menu,index) in menus" :key="index" @click="updateHeader(MENU_CONVERT[menu],menu)">
      <router-link :to="menu">
        <i :class="'icon-'+menu"></i>
        <span>{{MENU_CONVERT[menu]}}</span>
      </router-link>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
const MENU_CONVERT = {
  welfare: "福利",
  day: "每日推荐",
  ios: "IOS",
  android: "Android",
  web: "前端"
};
export default {
  name: "v-menu",
  props: {
    show: {
      type: Boolean
    }
  },
  data() {
    return {
      MENU_CONVERT: MENU_CONVERT
    };
  },
  // computed: mapState({
  //   menus: state => state.menus
  // }),
  computed: {
    ...mapState(["menus"])
  },
  methods: {
    updateHeader(title,menu){
      this.$store.commit('UPDATE_TITLE',title);
      this.$store.commit('UPDATE_MENUSHOW');
    }
    // this.menus=this.$store.state.menus
  }
};
</script>
<style scoped>
.details {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 30;
  width: 100%;
  height: 100%;
  background-color: #fff;
}
</style>