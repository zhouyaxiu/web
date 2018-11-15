<template>
<div class="main">
  <Header/>
  <div class="container">
    <div class="row">
      <div class= "col-md-4 offset-md-4">
        <!-- <p>您正在进行微信登录</p> -->
        <router-view/>
      </div>
    </div>
  </div>
  <Footer/>
</div>
</template>

<script>
import Header from 'components/header'
import Footer from 'components/footer'

export default {
  name: 'app',
  components: {
    Header,
    Footer
  },
  data () {
  },
  methods: {
  }
}
</script>

<style>
.login-other {
  color: #8590a6;
  font-size: 14px;
  text-align: center;
}
</style>
