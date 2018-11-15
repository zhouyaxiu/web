<template>
<div class="main">
  <Header location="login"/>
  <div class="container">
    <!-- Content here -->
    <p class="text-center my-5" style="font-size: 1.5rem">{{$t("login.title")}}</p>
    <div class="row">
      <div class= "col-md-4 offset-md-4">
        <el-form :model="form" :rules="rules" ref="form">
          <el-form-item prop="username">
            <el-input v-model="form.username" :placeholder="$t('login.username')"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input type="password" v-model="form.password" :placeholder="$t('login.password')" required></el-input>
          </el-form-item>
          <el-form-item prop="remember">
            <el-checkbox v-model="form.remember">{{$t("login.remember")}}</el-checkbox>
            <a href="/password" style="float:right">{{$t("login.forgot")}}</a>
          </el-form-item>
          <el-button type="primary" @click="login('form')" style="width:100%">{{$t("login.login")}}</el-button>
          <div class="login-social">
            <p @click="loginShow = 1" v-show="loginShow === 0">{{$t("login.socialAccount")}}</p>
            <div class="login-socialBun" v-show="loginShow === 1">
              <a :href="oauth.weixin">
                <i class="fa fa-wechat"></i>
              </a>
            </div>
          </div>
        </el-form>
      </div>
    </div>
  </div>
  <Footer/>
</div>
</template>

<script>
import Header from 'components/header'
import Footer from 'components/footer'
import axios from 'axios'
import $ from 'jquery'
import md5 from 'js-md5'
import * as util from 'assets/js/util.js'
import {language} from 'lang'
var url = '/api/login'
var http = axios.create({
  headers: {'X-Xsrftoken': $('meta[name=_xsrf]').attr('content')}
})
export default {
  name: 'app',
  components: {
    Header,
    Footer
  },
  data () {
    return {
      loginShow: 0,
      oauth: {
        weixin: 'https://open.weixin.qq.com/connect/qrconnect?appid=wx31bd8c7fe1628298&redirect_uri=https://www.fanhantech.com/api/oauth/login/weixin&response_type=code&scope=snsapi_login&state='
      },
      form: {
        username: '',
        password: '',
        remember: true
      },
      // 表单验证规则
      rules: {
        username: [
          {required: true, message: language('validator.username.rule1'), trigger: 'blur'},
          {type: 'string', min: 5, message: language('validator.username.rule2'), trigger: 'blur'},
          {type: 'string', max: 30, message: language('validator.username.rule3'), trigger: 'blur'},
          {type: 'string', message: language('validator.username.rule4'), pattern: /^[a-zA-Z][a-zA-Z0-9_-]{4,29}$/, trigger: 'blur'}
        ],
        password: [
          {required: true, message: language('validator.password.rule1'), trigger: 'blur'}
        ],
        remember: [
          {required: true, type: 'boolean', trigger: 'change'}
        ]
      }
    }
  },
  methods: {
    login (form) {
      let vm = this
      vm.$refs[form].validate((valid) => {
        // 表单验证
        if (valid) {
          vm.loginPost(vm.form)
        }
      })
    },
    loginPost (form) {
      let vm = this
      http.post(url, {
        username: vm.form.username,
        password: md5(vm.form.password),
        remember: vm.form.remember
      })
        .then(function (response) {
          let rsp = response.data
          if (rsp.code === 0) {
            vm.notify('success', rsp.message, 2000)
            util.Redirect('/projects', 1000)
          } else {
            vm.notify('error', rsp.message, 2000)
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    notify (type, message, duration) {
      let vm = this
      if (type === 'success') {
        vm.$notify.success({
          title: language('login.js.success'),
          message: message,
          duration: duration
        })
      } else if (type === 'error') {
        vm.$notify.error({
          title: language('login.js.error'),
          message: message,
          duration: duration
        })
      }
    }
  }
}
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
.login-socialBun a{
  color: #8590a6;
}
.login-socialBun i {
  font-size: 18px;
}
</style>
