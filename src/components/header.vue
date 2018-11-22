<template>
<div id="header">
  <nav class="navbar navbar-light navbar-expand-md fixed-top">
    <a class="navbar-brand" href="/">
      <img src="~assets/img/logo.jpg" height="56px" />
      <span>{{$t("navbar.title")}}</span>
    </a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#nav_collapse" aria-controls="nav_collapse" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="nav_collapse">
      <ul class="navbar-nav">
        <li class="nav-item mx-md-3">
          <a class="nav-link" href="/projects">{{$t("navbar.project")}}</a>
        </li>
        <li class="nav-item mx-md-3">
          <a class="nav-link" href="/help">{{$t("navbar.help")}}</a>
        </li>
      </ul>
      <ul class="navbar-nav ml-auto" v-if="location==='login'">
        <form class="form-inline">
          <span class="navbar-text mr-1">{{$t("navbar.notHaveAccount")}}</span>
          <a class="btn btn-outline-primary btn-sm px-3 mr-3" href="/register" role="button">{{$t("navbar.register")}}</a>
        </form>
      </ul>
      <ul class="navbar-nav ml-auto" v-else-if="location==='register'">
        <form class="form-inline">
          <span class="navbar-text mr-1">{{$t("navbar.haveAccount")}}</span>
          <a class="btn btn-outline-primary btn-sm px-3 mr-3" href="/login" role="button">{{$t("navbar.login")}}</a>
        </form>
      </ul>
      <ul class="navbar-nav ml-auto" v-else-if="isLogin">
        <li class="nav-item mx-md-3">
          <a class="nav-link" href="/workbench">{{$t("navbar.workbench")}}</a>
        </li>
        <li class="nav-item mx-md-3">
          <a class="nav-link" href="/ucenter">{{$t("navbar.ucenter")}}</a>
        </li>
        <li class="nav-item dropdown mx-md-3">
          <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            <img :src="user.avatar" rounded="circle" width="40px" height="40px" />
          </a>
          <div class="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdown">
            <h6 class="dropdown-header">Hello, {{user.username}}</h6>
            <div class="dropdown-divider"></div>
            <a class="dropdown-item" @click="logout">{{$t("navbar.logout")}}</a>
          </div>
        </li>
      </ul>
      <ul class="navbar-nav ml-auto" v-else>
        <li class="nav-item mx-md-3">
          <a class="nav-link" href="/login">{{$t("navbar.login")}}</a>
        </li>
        <li class="nav-item mx-md-3">
          <a class="nav-link" href="/register">{{$t("navbar.register")}}</a>
        </li>
      </ul>
    </div>
  </nav>
</div>
</template>

<script>
import axios from 'axios'
import $ from 'jquery'
import {language} from 'lang'
import bus from './eventBus.js'
var http = axios.create({
  headers: {'X-Xsrftoken': $('meta[name=_xsrf]').attr('content')}
})

function getsec (str) {
  let str1 = str.substring(1, str.length) * 1
  let str2 = str.substring(0, 1)
  if (str2 === 's') {
    return str1 * 1000
  } else if (str2 === 'h') {
    return str1 * 60 * 60 * 1000
  } else if (str2 === 'd') {
    return str1 * 24 * 60 * 60 * 1000
  }
}

function setCookie (name, value, time) {
  let strsec = getsec(time)
  let exp = new Date()
  exp.setTime(exp.getTime() + strsec * 1)
  document.cookie = name + '=' + escape(value) + ';expires=' + exp.toGMTString()
}

function delCookie (name) {
  let exp = new Date()
  exp.setTime(exp.getTime() - 1)
  let cval = getCookie(name)
  if (cval !== null) {
    document.cookie = name + '=' + cval + ';expires=' + exp.toGMTString()
  }
}

function getCookie (name) {
  let arr
  let reg
  reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)')
  arr = document.cookie.match(reg)
  if (arr) {
    return unescape(arr[2])
  } else {
    return null
  }
}

export default {
  name: 'app',
  props: ['location'],
  data () {
    return {
      isLogin: false,
      user: {}
    }
  },
  mounted: function () {
    this.$nextTick(function () {
      // Code that will run only after the
      // entire view has been rendered
      let vm = this
      vm.current()
    })
  },
  methods: {
    current () {
      let vm = this
      let url = '/api/user/current'
      let userstr = getCookie('user')
      if (userstr) {
        try {
          let user = JSON.parse(userstr)
          vm.user = user
          // console.log('get user from cookie', userstr)
          bus.$emit('user', user)
          this.$emit('getusername', vm.user.username)
          vm.isLogin = true
        } catch (e) {
          console.log('cookie user json str err')
          console.log(e)
        }
      }
      if (vm.isLogin) {
        return
      }

      http.get(url)
        .then(function (response) {
          let rsp = response.data
          if (rsp.code) {
            vm.isLogin = false
          } else {
            vm.isLogin = true
            vm.user = {
              username: rsp.data.username,
              avatar: rsp.data.avatar
            }
            // 设置10h的cookie
            setCookie('user', JSON.stringify(vm.user), 'h10')
            // console.log('set user in cookie')
            bus.$emit('user', vm.user) // 传信给侧边导航组件
            this.$emit('getusername', vm.user.username)
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    updateCookie () {
      delCookie('user')
      this.current()
    },
    logout () {
      let vm = this
      let url = '/api/logout'
      http.post(url)
        .then(function (response) {
          let rsp = response.data
          vm.$notify.success({
            title: language('navbar.js.success'),
            message: rsp.message
          })
          delCookie('user')
          // console.log('remove user from cookie')
          // 延时1000ms跳转
          setTimeout(() => {
            window.location.href = '/login'
          }, 1000)
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    userSet (val) {
      const vm = this
      vm.user.avatar = val
      console.log(val)
    }
  }
}
</script>
<style scoped>
#header .navbar {
  background-color:#FFFFFF;
  box-shadow: 0 1px 2px 0 rgba(31,45,61,.1);
  padding-top: 0rem;
  padding-bottom: 0rem;
}
#header .navbar-brand {
  padding-top: 0rem;
  padding-bottom: 0rem;
}
.nav-link.dropdown-toggle {
  padding-top: 0rem;
  padding-bottom: 0rem;
}
.btn-outline-secondary {
  border-color:#FFFFFF;
}
</style>
