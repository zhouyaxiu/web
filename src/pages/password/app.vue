<template>
<div class="main">
  <Header location="register"/>
  <div class="container">
    <p class="text-center my-5" style="font-size: 1.5rem;">{{$t("password.title")}}</p>
    <div class="row">
      <div class= "col-md-4 offset-md-4">
        <el-form :model="form" :rules="rules" ref="form">
          <div v-if="step === 1">
            <el-form-item prop="mobile" id="country-mobile">
              <el-input v-model="form.mobile" :placeholder="$t('password.mobile')">
                <el-select v-model="form.countryCode" slot="prepend">
                  <el-option v-for="item in options" :key="item.name" :label="item.label" :value="item.value">
                    <span style="float:left;padding-right:1rem;">{{ item.name }}</span>
                    <span style="float:right;color:#8492a6;font-size:13px">{{ item.label }}</span>
                  </el-option>
                </el-select>
              </el-input>
            </el-form-item>
            <el-form-item prop="code">
              <el-input v-model="form.code" :placeholder="$t('password.code')">
                <ButtonPIN ref="sendSms" action="/api/account/smsverificationcode" @click.native="sendSms('form')" slot="append"/>
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="password('form')" style="width: 100%;">确定</el-button>
            </el-form-item>
          </div>
          <div v-if="step === 2">
            <el-form-item prop="password">
              <el-input type="password" v-model="form.password" :placeholder="$t('password.password')"></el-input>
            </el-form-item>
            <el-form-item prop="confirm">
              <el-input type="password" v-model="form.confirm" :placeholder="$t('password.confirm')"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="password('form')" style="width: 100%;">{{$t("password.form")}}</el-button>
            </el-form-item>
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
// import $ from 'jquery'
import md5 from 'js-md5'
import * as util from 'assets/js/util.js'
import {language} from 'lang'
import country from 'assets/js/country-code.js'
import ButtonPIN from 'components/private/PIN'

var http = axios.create({})

export default {
  name: 'app',
  components: {
    Header,
    Footer,
    ButtonPIN
  },
  data () {
    // 自定义表单验证规则
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
    // 验证手机号码是否存在
    let validateMobile = (rule, value, callback) => {
      var vm = this
      var countryCode = vm.form.countryCode
      http.get('/api/account/mobile?countryCode=' + countryCode + '&mobile=' + value)
        .then(function (response) {
          if (response.data !== true) {
            vm.$refs.sendSms.sendCodeDisabled = true
            callback(new Error(language('validator.mobile.rule4')))
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
        countryCode: '86',
        mobile: '',
        code: '',
        password: '',
        confirm: ''
      },
      // 表单验证规则
      rules: {
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
        ]
      },
      options: country,
      step: 1 // 1手机验证2设置新密码
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
    password (form) {
      let vm = this
      this.$refs[form].validate((valid) => {
        // 表单验证
        if (valid) {
          return vm.step === 1 ? vm.mobilePost(vm.form)
            : (vm.step === 2 ? vm.passwordPost(vm.form) : false)
        }
      })
    },
    mobilePost (form) {
      let vm = this
      let url = '/api/password/verify'
      console.log('mobilePost')
      http.post(url, {
        phone: vm.form.countryCode + '-' + vm.form.mobile,
        code: vm.form.code
      })
        .then(function (response) {
          let rsp = response.data
          if (rsp.code === 0) {
            // vm.notify('success', rsp.message, 2000)
            vm.step = 2
          } else {
            vm.notify('error', rsp.message, 2000)
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    passwordPost (form) {
      let vm = this
      let url = '/api/password/new'
      console.log('passwordPost')
      http.post(url, {
        phone: vm.form.countryCode + '-' + vm.form.mobile,
        password: md5(vm.form.password)
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
          title: language('password.js.success'),
          message: message,
          duration: duration
        })
      } else if (type === 'error') {
        vm.$notify.error({
          title: language('password.js.error'),
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
