<template>
  <div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10">
    <a :href="data.url" v-for="(data,index) in datas" :key="index" target="view_window">
      <vcard :data="data"></vcard>
    </a>
  </div>
</template>

<script>
import vcard from "./card";
import axios from "axios";
export default {
  name: "v-list",
  components: {
    vcard
  },
  props:{
    type:{
      type:String
    }
  },
  data() {
    return {
      datas: [],
      page: 1,
      busy: false
    };
  },
  methods: {
    loadTop() {
      this.$store.commit("UPDATE_LOADING", true);
       axios
        .get(`https://gank.io/api/data/${this.type}/10/${this.page}`)
        .then(response => {
          this.datas = this.datas.concat(response.data.results);
          this.busy = false;
          this.$nextTick(() => {
            this.$store.commit("UPDATE_LOADING", false);
          });
        });
    },
    loadMore() {
      this.busy = true;
      this.loadTop();
      this.page++;
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