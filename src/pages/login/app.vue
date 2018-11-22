<template>
<div class="main login-new">
  <Header ref="Header" location="login"/>
  <div class="container">
    <!-- Content here -->
    <p class="text-center my-5" style="font-size: 1.5rem">{{$t("login.title")}}</p>
    <div class="row">
      <div class= "col-md-4 offset-md-4" v-if="loginWay !== 3">
        <el-form :model="form" :rules="rules" ref="form">
          <!-- 密码登录 -->
          <div v-if="loginWay === 1">
            <el-form-item prop="name">
              <el-input v-model="form.name" placeholder="用户名/邮箱"></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input type="password" v-model="form.password" :placeholder="$t('login.password')" required></el-input>
            </el-form-item>
          </div>
          <!-- 手机登录 -->
          <div v-if="loginWay === 2">
            <el-form-item prop="mobile" id="country-mobile">
              <el-input v-model="form.mobile" :placeholder="$t('register.mobile')">
                <el-select v-model="form.countryCode" slot="prepend">
                  <el-option v-for="item in options" :key="item.name" :label="item.label" :value="item.value">
                    <span style="float:left;padding-right:1rem;">{{ item.name }}</span>
                    <span style="float:right;color:#8590a6;">{{ item.label }}</span>
                  </el-option>
                </el-select>
              </el-input>
            </el-form-item>
            <el-form-item prop="code">
              <el-input v-model="form.code" :placeholder="$t('register.code')">
                <ButtonPIN ref="sendSms" action="/api/account/smsverificationcode" @click.native="sendSms('form')" slot="append"/>
              </el-input>
            </el-form-item>
          </div>
          <el-form-item class="mb-2">
            <a href="javascript:void(0);" v-if="loginWay === 1" @click="loginWay = 2">使用手机登录</a>
            <a href="javascript:void(0);" v-if="loginWay === 2" @click="loginWay = 1">使用密码登录</a>
            <a href="/password" style="float:right">{{$t("login.forgot")}}</a>
          </el-form-item>
          <el-button type="primary" @click="login('form')" style="width:100%">{{$t("login.login")}}</el-button>
          <!-- 微信登录 -->
          <!-- <div class="login-other g-hide f-pointer"><p @click="loginWay = 3">二维码登录&nbsp;&bull;&nbsp;</p></div> -->
          <div class="pt-1 text-center">
            <div class="position-relative border-bottom mt-4 mb-4">
              <span class="text-muted position-absolute bg-white login-other-title">{{$t("login.socialAccount")}}</span>
            </div>
            <div class="login-socialBun">
              <a class="g-hide h6" :href="oauth.weixin" style="color:#33c433">
                <i class="fa fa-wechat fa-lg"></i>
              </a>
              <a class="h6" :href="oauth.facebook" style="color:#0077b9">
                <i class="fa fa-facebook-square fa-lg"></i>
              </a>
              <a class="h6" :href="oauth.google" style="color:#3182f6">
                <i class="fa fa-google fa-lg"></i>
              </a>
            </div>
          </div>
        </el-form>
      </div>
      <!-- 二维码登录 -->
      <!-- <div class= "col-md-4 offset-md-4" v-if="loginWay === 3">
        <el-card class="box-card" style="padding-top: 25px;">
          <div class="font-center">
            <p>上泛函，随时随地做任务</p>
            <div class="login-app-img">
              <img src="/static/img/appTest.png" alt="app" style="width:100%">
            </div>
            <p class="login-app-note">打开泛函App</p>
          </div>
          <div class="login-app-button">
            <span class="f-pointer" @click="() => {loginWay = 1; loginShow = 0}">使用密码登录</span>
          </div>
        </el-card>
      </div> -->
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
import country from 'assets/js/country-code.js'
import ButtonPIN from 'components/private/PIN'
var http = axios.create({
  headers: {'X-Xsrftoken': $('meta[name=_xsrf]').attr('content')}
})
export default {
  name: 'app',
  components: {
    Header,
    Footer,
    ButtonPIN
  },
  data () {
    // 验证手机号码是否存在
    let validateMobile = (rule, value, callback) => {
      var vm = this
      var countryCode = vm.form.countryCode
      http.get('/api/account/mobile?countryCode=' + countryCode + '&mobile=' + value)
        .then(function (response) {
          if (response.data === true) {
            vm.$refs.sendSms.sendCodeDisabled = false
            callback()
          } else {
            vm.$refs.sendSms.sendCodeDisabled = true
            callback(new Error(language('validator.mobile.rule4')))
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    }
    let validateName = (rule, value, callback) => {
      var vm = this
      var reUsername = /^[a-zA-Z][a-zA-Z0-9_-]{4,29}$/
      var reEmail = /^[\w!#$%&'*+/=?^_` + "`" + `{|}~-]+(?:\.[\w!#$%&'*+/=?^_` + "`" + `{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[a-zA-Z0-9](?:[\w-]*[\w])?$/
      if (reUsername.test(value)) {
        vm.nameType = 'username'
        callback()
      } else if (reEmail.test(value)) {
        vm.nameType = 'email'
        callback()
      } else {
        callback(new Error(language('validator.name.rule2')))
      }
    }
    return {
      loginWay: 1, // 登录方式：默认密码登录1，手机登录2，二维码登录3
      loginShow: 0,
      nameType: '',
      oauth: {
        weixin: 'https://open.weixin.qq.com/connect/qrconnect?appid=wx31bd8c7fe1628298&redirect_uri=https://www.fanhantech.com/api/oauth/login/weixin&response_type=code&scope=snsapi_login&state=',
        facebook: 'https://www.facebook.com/v3.2/dialog/oauth?client_id=1875757705826407&redirect_uri=https://www.fanhantech.com/api/oauth/login/facebook/&response_type=code&scope=email',
        google: 'https://accounts.google.com/o/oauth2/auth?client_id=437691762848-oktemnfuvdm1qpd83cd2cs3m68df2e9v.apps.googleusercontent.com&redirect_uri=https%3A%2F%2Fwww.fanhantech.com%2Fapi%2Foauth%2Flogin%2Fgoogle%2F&response_type=code&scope=email'
      },
      options: country,
      form: {
        name: '',
        password: '',
        countryCode: '86',
        mobile: '',
        code: '',
        remember: true
      },
      // 表单验证规则
      rules: {
        name: [
          {required: true, message: language('validator.name.rule1'), trigger: 'blur'},
          {validator: validateName, trigger: 'blur'}
        ],
        password: [
          {required: true, message: language('validator.password.rule1'), trigger: 'blur'}
        ],
        mobile: [
          {required: true, message: language('validator.mobile.rule1'), trigger: 'blur'},
          {type: 'string', pattern: /^\d+$/, message: language('validator.mobile.rule3'), trigger: 'blur'},
          {validator: validateMobile, trigger: 'blur'}
        ],
        code: [
          {required: true, message: language('validator.code.rule1'), trigger: 'blur'},
          {type: 'string', pattern: /^[0-9]{6}$/, message: language('validator.code.rule2'), trigger: 'blur'}
        ],
        remember: [
          {required: true, type: 'boolean', trigger: 'change'}
        ]
      }
    }
  },
  methods: {
    // 提交发送手机验证码请求
    sendSms (form) {
      let vm = this
      let valid = true
      vm.$refs[form].validateField('mobile', () => {
        // 表单验证
        valid = false
      })
      if (valid) {
        vm.$refs.sendSms.postData = {
          countryCode: vm.form.countryCode,
          mobile: vm.form.mobile
        }
        vm.$refs.sendSms.sendSmsPost()
      }
      console.log(vm.$refs.sendSms.postData)
    },
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
      // loginWay = 1 为密码登录，2为手机验证登录
      let url = vm.loginWay === 1 ? '/api/login' : (vm.loginWay === 2 ? '/api/login/quick' : '')
      let postJson = vm.loginWay === 1
        ? (vm.nameType === 'username' ? {
          username: vm.form.name,
          password: md5(vm.form.password)
        } : {
          email: vm.form.name,
          password: md5(vm.form.password)
        })
        : (vm.loginWay === 2 ? {
          phone: vm.form.countryCode + '-' + vm.form.mobile,
          code: vm.form.code
        } : '')
      console.log(postJson)
      http.post(url, postJson)
        .then(function (response) {
          let rsp = response.data
          if (rsp.code === 0) {
            vm.notify('success', rsp.message, 2000)
            // 更新cookie
            vm.$refs.Header.updateCookie()
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

<style lang="less" scope>
@color-gley: #8590a6;
@text-size: .875rem;
.font-center {
  text-align: center;
}
#country-mobile .el-select .el-input {
  width: 70px;
}
#country-mobile .el-select .el-input__inner {
  padding-left: 0px;
  padding-right: 10px;
  text-align: center;
}
#country-mobile .el-input__suffix {
  right: 0px;
}
#country-mobile .el-button {
  padding-left: 10px;
  padding-right: 10px;
}
.g-flex-center {
  display:flex;
  justify-content: center;
}
.login-new a {
  text-decoration: none;
}
.login-other-title {
  font-size: 14px;
  top:-10px;
  padding:0 10px;
  left: calc(50% - 52px);
}
.f-pointer {
  cursor: pointer;
}
.login-socialBun {
  a{
    margin-right: .5rem;
  }
  a:hover {
    color: #656d7d;
    opacity: .8;
    transition: .5s;
  }
}
// 二维码登录
.login-app-note {
  font-size: @text-size;
  color:@color-gley;
  margin-top: 10px;
}
.login-app-button {
  border-top: 1px solid #ebebeb;
  padding: 14px 0;
  font-size: @text-size;
  color: #007bff;
  .font-center;
}
.login-app-img {
  width:150px;
  margin:0 auto;
}
@media only screen and (max-width: 768px) {
  .g-hide {
    display: none;
  }
}
</style>
