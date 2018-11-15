<template>
  <div>
    <div class="page-cover" v-show="menuShow" @click="isShow"></div>
    <div @click="isShow">
      <header>
        <div>{{headerTitle}}</div>
      </header>
    </div>
    <vmenu :show="menuShow"></vmenu>
  </div>
</template>

<script>
import { mapState } from "vuex";
import vmenu from "./menu";
export default {
  components: {
    vmenu
  },
  data() {
    return {
      show: false
    };
  },
  // computed: mapState({
  //   headerTitle: state => state.headerTitle,
  //   menuShow: state => state.menuShow
  // }),
  computed: {
    ...mapState([
      'headerTitle','menuShow'
    ])
  },
  mounted() {
    // this.headerTitle=this.$store.state.headerTitle
    // console.log(this.$store.state.headerTitle)
    // console.log(this.$store.state.menuShow)
    // this.menuShow=this.$store.state.menuShow
  },
  methods: {
    isShow() {
      this.$store.commit("UPDATE_MENUSHOW");
    }
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