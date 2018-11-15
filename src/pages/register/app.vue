<template>
<div class="main">
  <Header location="register"/>
  <div class="container">
    <p class="text-center my-5" style="font-size: 1.5rem;">{{$t("register.title")}}</p>
    <div class="row">
      <div class= "col-md-4 offset-md-4">
        <el-form :model="form" :rules="rules" ref="form">
          <el-form-item prop="username">
            <el-input v-model="form.username" :placeholder="$t('register.username')"></el-input>
          </el-form-item>
          <el-form-item prop="mobile" id="country-mobile">
            <el-input v-model="form.mobile" :placeholder="$t('register.mobile')">
              <el-select v-model="form.countryCode" slot="prepend">
                <el-option v-for="item in options" :key="item.name" :label="item.label" :value="item.value">
                  <span style="float:left;padding-right:1rem;">{{ item.name }}</span>
                  <span style="float:right;color:#8492a6;font-size:13px">{{ item.label }}</span>
                </el-option>
              </el-select>
              <ButtonPIN ref="sendSms" action="/api/account/smsverificationcode" @click.native="sendSms('form')" slot="append"/>
            </el-input>
          </el-form-item>
          <el-form-item prop="code">
            <el-input v-model="form.code" :placeholder="$t('register.code')"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input type="password" v-model="form.password" :placeholder="$t('register.password')"></el-input>
          </el-form-item>
          <el-form-item prop="confirm">
            <el-input type="password" v-model="form.confirm" :placeholder="$t('register.confirm')"></el-input>
          </el-form-item>
          <el-form-item prop="email">
            <el-input v-model="form.email" :placeholder="$t('register.email')"></el-input>
          </el-form-item>
          <el-form-item prop="agree">
            <el-checkbox v-model="form.agree">{{$t("register.agree")}}</el-checkbox>
            <a href="/agreement" style="color:#0000ff">{{$t("register.agreement")}}</a>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="register('form')" style="width: 100%;">{{$t("register.register")}}</el-button>
          </el-form-item>
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
import md5 from 'js-md5'
import * as util from 'assets/js/util.js'
import {language} from 'lang'
import country from 'assets/js/country-code.js'
import ButtonPIN from 'components/private/PIN'

var url = '/api/register'
var http = axios.create()

export default {
  name: 'app',
  components: {
    Header,
    Footer,
    ButtonPIN
  },
  data () {
    // 自定义表单验证规则
    // 必须勾选同意用户服务协议
    let validateAgree = (rule, value, callback) => {
      if (value !== true) {
        callback(new Error(language('validator.agree.rule1')))
      } else {
        callback()
      }
    }
    // 验证两次密码是否一致
    let validateConfirm = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(language('validator.confirm.rule1')))
      } else if (value !== this.form.password) {
        callback(new Error(language('validator.confirm.rule2')))
      } else {
        callback()
      }
    }
    // 验证用户名是否存在
    let validateUsername = (rule, value, callback) => {
      http.get('/api/account/username?username=' + value)
        .then(function (response) {
          if (response.data === true) {
            callback(new Error(language('validator.username.rule5')))
          } else {
            callback()
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    }
    // 验证手机号码是否存在
    let validateMobile = (rule, value, callback) => {
      var vm = this
      var countryCode = vm.form.countryCode
      http.get('/api/account/mobile?countryCode=' + countryCode + '&mobile=' + value)
        .then(function (response) {
          if (response.data === true) {
            vm.$refs.sendSms.sendCodeDisabled = true
            callback(new Error(language('validator.mobile.rule2')))
          } else {
            vm.$refs.sendSms.sendCodeDisabled = false
            callback()
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    }
    return {
      // 表单数据
      form: {
        username: '',
        countryCode: '86',
        mobile: '',
        code: '',
        password: '',
        confirm: '',
        email: '',
        agree: true
      },
      // 表单验证规则
      rules: {
        username: [
          {required: true, message: language('validator.username.rule1'), trigger: 'blur'},
          {type: 'string', min: 5, message: language('validator.username.rule2'), trigger: 'blur'},
          {type: 'string', max: 30, message: language('validator.username.rule3'), trigger: 'blur'},
          {type: 'string', message: language('validator.username.rule4'), pattern: /^[a-zA-Z][a-zA-Z0-9_-]{4,29}$/, trigger: 'blur'},
          {validator: validateUsername, trigger: 'blur'}
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
        password: [
          {required: true, message: language('validator.password.rule1'), trigger: 'blur'},
          {type: 'string', min: 6, message: language('validator.password.rule2'), trigger: 'blur'}
        ],
        confirm: [
          {required: true, message: language('validator.confirm.rule1'), trigger: 'blur'},
          {validator: validateConfirm, trigger: 'blur'}
        ],
        email: [
          { required: true, message: language('validator.email.rule1'), trigger: 'blur' },
          { type: 'email', message: language('validator.email.rule2'), trigger: ['blur', 'change'] }
        ],
        agree: [
          {required: true, type: 'boolean', message: language('validator.agree.rule1'), trigger: 'change'},
          {validator: validateAgree, trigger: 'change'}
        ]
      },
      options: country
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
    },
    register (form) {
      let vm = this
      this.$refs[form].validate((valid) => {
        // 表单验证
        if (valid) {
          vm.registerPost(vm.form)
        }
      })
    },
    registerPost (form) {
      let vm = this
      http.post(url, {
        username: vm.form.username,
        countryCode: vm.form.countryCode,
        mobile: vm.form.mobile,
        code: vm.form.code,
        password: md5(vm.form.password),
        confirm: md5(vm.form.confirm),
        email: vm.form.email,
        agree: vm.form.agree
      })
        .then(function (response) {
          let rsp = response.data
          if (rsp.code === 0) {
            vm.notify('success', rsp.message, 2000)
            util.Redirect('/login', 1000)
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
          title: language('register.js.success'),
          message: message,
          duration: duration
        })
      } else if (type === 'error') {
        vm.$notify.error({
          title: language('register.js.error'),
          message: message,
          duration: duration
        })
      }
    }
  }
}
</script>

<style>
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
</style>
