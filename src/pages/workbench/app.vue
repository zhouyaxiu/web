<template>
<div class="main">
  <Header ref="header"/>
  <div class="container content">
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
          titleH1: language('workbench.navTitle1'),
          titleH2: [
            {
              id: 1,
              title: language('workbench.subNavTit1'),
              router: '/join'
            },
            {
              id: 2,
              title: language('workbench.subNavTit2'),
              router: '/publish'
            }
          ]
        },
        {
          titleH1: language('workbench.navTitle2'),
          titleH2: [
            {
              id: 1,
              title: language('workbench.subNavTit3'),
              router: '/account'
            },
            {
              id: 2,
              title: '提现记录',
              router: '/records'
            },
            {
              id: 3,
              title: '充值记录',
              router: '/recRecords'
            },
            {
              id: 4,
              title: '发票管理',
              router: '/receipt'
            }
          ]
        },
        {
          titleH1: '审核',
          titleH2: [
            {
              id: 1,
              title: '发布审核',
              router: '/taskcheck'
            }
          ]
        }
      ]
    }
  },
  computed: {
  },
  methods: {
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
