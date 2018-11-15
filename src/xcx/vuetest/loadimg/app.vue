<template>
  <div class="main">
    <Header />
    <loading :show="loadingShow"></loading>
    <router-view></router-view>
    <Footer/>
  </div>
</template>

<script>
import Header from "./components/header";
import Footer from "components/footer";
import welcome from "./components/welcome";
import loading from "./components/loading";
import { mapState } from "vuex";
export default {
  name: "app",
  components: {
    Header,
    Footer,
    welcome,
    loading
  },
  data() {
    return {
      show: false
    };
  },
  computed: {
    ...mapState([
      'loadingShow'
    ])
  },
  // computed: mapState({
  //   loadingShow: state => state.loadingShow
  // }),
  methods: {
    isShow() {
      this.show = !this.show;
    }
  }
};
</script>

<style>
.login-social {
  margin-top: 16px;
  line-height: 25px;
  color: #8590a6;
  font-size: 14px;
  text-align: center;
}
.login-social p {
  cursor: pointer;
}
.login-socialBun {
  margin-left: 2px;
  transition: opacity 0.3s ease;
}
.login-socialBun a {
  color: #8590a6;
}
.login-socialBun i {
  font-size: 18px;
}
</style>
