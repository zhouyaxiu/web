<template>
  <div id="app">
    <h1>{{data.title}}</h1>
    <div v-html="data.content"></div>
  </div>
</template>

<script>
import lazyloadimg from "./lazyloadimg";
export default {
  components: {
    lazyloadimg
  },
  props: {
    data: {
      type: Object
    }
  },
  data() {
    return {
      content: false
    };
  },
  created() {
    this.clearStyle();
  },
  methods: {
    clearStyle() {
      this.$nextTick(() => {
        var tags = this.$el.getElementsByTagName("img");
        for (let i = 0; i < tags.length; i++) {
          tags[i].removeAttribute("style");
        }
      });
    }
  }
};
</script>
<style scoped>
</style>