<template>
<div class="main">
  <Header/>
  <div class="container">
    <div class="row">
      <div class="col-md-3" style="padding-left: 10px; padding-right: 10px;">
        <div class="left-menu-box panel-bg">
          <Side :navCon="navCon"/>
        </div>
      </div>
      <div class="col-md-9" style="padding-left: 10px; padding-right: 10px;">
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
import Side from 'components/side'
import {language} from 'lang'

export default {
  name: 'app',
  components: {
    Header,
    Footer,
    Side
  },
  data () {
    return {
      navCon: [
        {
          titleH1: language('user.nav.title1'),
          titleH2: [
            {
              id: 1,
              title: language('user.nav.profile'),
              router: '/'
            }
          ]
        },
        {
          titleH1: language('user.nav.title2'),
          titleH2: [
            {
              id: 2,
              title: language('user.nav.skill'),
              router: '/skill'
            }
          ]
        },
        {
          titleH1: language('user.nav.title3'),
          titleH2: [
            {
              id: 3,
              title: language('user.nav.real'),
              router: '/real'
            }
          ]
        }
      ]
    }
  }
}
</script>

<style>
.left-menu-box {
  height: 520px;
  min-height: 520px;
  border-top: 4px solid #2093ff;
}
.panel-bg {
  background: #fff;
  box-shadow: 0 1px 6px 0 rgba(0, 0, 0, .12);
  border-radius: 3px;
}
</style>
