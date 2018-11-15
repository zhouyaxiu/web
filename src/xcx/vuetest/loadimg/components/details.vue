<template>
  <div id="app">
    <transition name="fade">
      <div class="details" v-show="showFlag">
        <div class="pull-left" @click="hide">
          <span class="iconfont icon-left">返回</span>
        </div>
        <header>{{detailsData.publishedAt || time | formatDate}}</header>
        <vday :data="detailsData" ref="day"></vday>
      </div>
    </transition>
  </div>
</template>

<script>
import vday from "./day";
import { formatDate } from "../common/date";
export default {
  props: {
    time: {
      type: String
    },
    detailsData: {
      type: Object
    }
  },
  components: {
    vday
  },
  data() {
    return {
      showFlag: false
    };
  },
  methods: {
    show() {
      this.showFlag = true;
    },
    hide() {
      this.showFlag = false;
    }
  },
  filters: {
    formatDate(time) {
      let date = new Date(time);
      return formatDate(date, "yyyy-MM-dd");
    }
  }
};
</script>
<style>
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
img {
  width: 300px;
  height: 300px;
}
</style>