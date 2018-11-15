<template>
  <div class="main">
    <Header />
    <router-view></router-view>
    <Footer/>
  </div>
</template>

<script>
import Header from "components/header";
import Footer from "components/footer";
export default {
  name: "app",
  components: {
    Header,
    Footer,
  },
  data() {
    return {
    };
  },
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
