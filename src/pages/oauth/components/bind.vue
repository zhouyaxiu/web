<template>
<div>
  <p class="text-center my-5" style="font-size: 1.5rem;">{{$t("oauth.connected")}}</p>
  <el-form :model="form" :rules="rules" ref="form">
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
    <p class="login-other text-left">{{$t("oauth.agree")}}<a href="/agreement">{{$t("register.agreement")}}</a></p>
    <el-form-item>
      <el-button type="primary" @click="bind('form')" style="width: 100%;">确定{{$t("oauth.confirm")}}</el-button>
    </el-form-item>
  </el-form>
  <p class="login-other">
    <router-link :to="{ name: 'register'}">
      <a href="javascript:void(0)">{{$t("oauth.noAccount")}}</a>
    </router-link>
  </p>
</div>
</template>

<script>
import axios from 'axios'
import * as util from 'assets/js/util.js'
import {language} from 'lang'
import country from 'assets/js/country-code.js'
import ButtonPIN from 'components/private/PIN'

var url = '/api/oauth/bind'
var http = axios.create()

export default {
  name: 'app',
  components: {
    ButtonPIN
  },
  data () {
    // 自定义表单验证规则
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
        code: ''
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
    bind (form) {
      let vm = this
      this.$refs[form].validate((valid) => {
        if (valid) {
          http.post(url, {
            username: vm.form.username,
            countryCode: vm.form.countryCode,
            mobile: vm.form.mobile,
            code: vm.form.code
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
        }
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
.login-other {
  color: #8590a6;
  font-size: 14px;
  text-align: center;
}
.login-other a {
  text-decoration: none;
}
.text-left {
  text-align: left;
}
</style>
