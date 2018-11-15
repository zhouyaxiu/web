<template>
  <div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10">
    <figure v-show="leftData.length > 0" v-for="(data,index) in leftData" :key="index" @click="selectDetails(data.createdAt)">
      <!-- <v-img :imgUrl="data.url"></v-img> -->
      <!-- <img :src="data.url" alt="" width="300" height="300"> -->
      <lazyloadimg :imgUrl="data.url" alt="" width="300" height="300" />
    </figure>
    <figure v-show="rightData.length > 0" v-for="(data,index) in rightData" :key="index" @click="selectDetails(data.createdAt)">
      <!-- <v-img :imgUrl="data.url"></v-img> -->
      <lazyloadimg :imgUrl="data.url" alt="" width="300" height="300" />
    </figure>
    <vdetails ref="detailss" :time="time" :detailsData="detailsData"></vdetails>
  </div>
</template>

<script>
import axios from "axios";
import lazyloadimg from "./lazyloadimg";
import { objectDate } from "./../common/date";
import vdetails from "./details";
export default {
  data() {
    return {
      leftData: [],
      rightData: [],
      busy: false,
      page: 1,
      detailsData: {},
      time: "",
    };
  },
  components: {
    lazyloadimg,
    vdetails,
  },
  computed: {
    // ...mapState(["headerTitle", "menuShow"])
  },
  mounted() {
    // this.$store.commit("UPDATE_MENUSHOW");
  },
  methods: {
    loadTop() {
      this.$store.commit("UPDATE_LOADING", true);
      this.page = 4;
      axios
        .get(`https://gank.io/api/data/福利/10/${this.page}`)
        .then(response => {
          // this.$http.get(`https://gank.io/api/data/福利/10/${this.page}`).then((response) => {
          let left = response.data.results.filter((data, i) => {
            return (i + 1) % 2 === 1;
          });
          let right = response.data.results.filter((data, i) => {
            return (i + 1) % 2 !== 1;
          });
          this.leftData = this.leftData.concat(left);
          this.rightData = this.rightData.concat(right);
          this.busy = false;
          // $nextTick() 在dom 重新渲染完后执行
          this.$nextTick(() => {
            this.$store.commit("UPDATE_LOADING", false);
          });
        });
    },
    loadMore() {
      this.busy = true;
      this.loadTop();
      this.page++;
    },
    selectDetails(time) {
      this.time = time;
      this.$store.commit("UPDATE_LOADING", true);
      let object = objectDate(this.time);
      axios
        .get(
          `https://gank.io/api/history/content/day/${object.Y}/${object.M}/${
            object.D
          }`
        )
        .then(response => {
          let data = response.data.results;
          this.detailsData = data[0];
          this.$refs.detailss.show();
          // this.showFlag = true;
          this.$nextTick(() => {
            this.$store.commit("UPDATE_LOADING", false);
          });
        });
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