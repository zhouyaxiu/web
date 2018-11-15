<template>
  <div class="main">
    <Header/>
    <div class="container content">
      <div class="row">
        <div class="col-md-3" style="padding-left: 10px; padding-right: 10px;">
          <div class="left-menu-box panel-bg">
            <Side :navCon="navCon" />
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
// import { language } from 'lang'

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
          titleH1: '项目管理',
          titleH2: [
            {
              id: 1,
              title: '权限管理',
              router: '/data'
            },
            {
              id: 2,
              title: '数据管理',
              router: '/data'
            },
            {
              id: 2,
              title: '报表管理',
              router: '/data'
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
    box-shadow: 0 1px 6px 0 rgba(0, 0, 0, 0.12);
    border-radius: 3px;
}
</style>
