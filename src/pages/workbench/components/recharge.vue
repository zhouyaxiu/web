<template>
<div class="card">
  <div class="card-header">
    <div class="d-flex" style="justify-content:space-between">
      <div style="font-size:1.2rem;" >账户充值</div>
    </div>
  </div>
  <div class="card-body">
    <div style="max-width: 450px;">
      <h4 class="card-title">{{$t("workbench.withdraw.availintegral")}}{{remainPoints}}</h4>
      <el-form :model="form" :rules="rules" ref="form" label-width="110px">
        <div class="mt-5">
          <el-form-item prop="spendPoints" label="充值金额：">
            <el-input v-model.number="form.spendPoints" :placeholder="$t('workbench.withdraw.pleaseinput')"></el-input>
          </el-form-item>
          <el-form-item :label="$t('workbench.withdraw.putforward')">
            <div class="border p-1" style="max-width:150px">
              <img src="~assets/img/alipay_4030.png" alt="">
              <span>{{$t("workbench.withdraw.alipay")}}</span>
            </div>
          </el-form-item>
          <el-form-item prop="account" :label="$t('workbench.withdraw.alipayaccount')">
            <el-input v-model="form.account" :placeholder="$t('workbench.withdraw.pleaseinput')"></el-input>
          </el-form-item>
          <p class="text-muted ml-3 mb-5">本次充值：{{nowCash ? nowCash : '0.00'}}元 = {{nowCash ? nowCash*100 : '0'}}积分</p>
          <el-form-item>
            <el-button type="primary" @click="checkRecharge('form')">立刻充值</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
</div>
</template>

<script>
import axios from 'axios'
import {language} from 'lang'

var http = axios.create()
export default {
  name: 'app',
  components: {
  },
  data () {
    // 验证是否超过2位小数
    let validateWithdraw = (rule, value, callback) => {
      const REG = /^[0-9]+([.]{1}[0-9]{1,2})?$/
      if (!REG.test(value) || value < 1) {
        return callback(new Error('充值金额不能小于1元且小数不能超过2位'))
      } else {
        callback()
      }
    }
    return {
      remainPoints: 100,
      form: {
        account: '',
        spendPoints: ''
      },
      rules: {
        spendPoints: [
          {required: true, message: '请输入提现金额', trigger: 'blur'},
          {type: 'number', message: '提现金额必须为数值', trigger: 'blur'},
          {validator: validateWithdraw, trigger: 'blur'}
        ],
        account: [
          {required: true, message: language('workbench.withdraw.js.rules.account'), trigger: 'blur'}
        ]
      }
    }
  },
  computed: {
    // 本次充值保留2位小数 不为空且为数值状态
    nowCash () {
      const vm = this
      let reg = /[0-9]./
      if (vm.form.spendPoints && reg.test(vm.form.spendPoints)) {
        return (vm.form.spendPoints).toFixed(2)
      }
    }
  },
  mounted: function () {
    var vm = this
    this.$nextTick(function () {
      vm.getBalance()
    })
  },
  methods: {
    // 获得当前积分
    getBalance () {
      var vm = this
      var url = '/api/user/balance'
      http.get(url)
        .then(function (response) {
          var rsp = response.data
          if (rsp.code === 0) {
            var data = rsp.data
            vm.remainPoints = data.balance
          } else {
            vm.notify('error', rsp.message, 2000)
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    checkRecharge (formName) {
      let vm = this
      this.$refs[formName].validate((valid, object) => {
        console.log(valid, object)
        if (!valid) {
          return false
        } else {
          vm.recharge()
        }
      })
    },
    // 充值信息
    recharge () {
      var vm = this
      var url = '/api/user/balance/recharge'
      // console.log({
      //   account: vm.form.account,
      //   point: vm.form.spendPoints * 100
      // })
      http.post(url, {
        account: vm.form.account,
        point: vm.form.spendPoints * 100
      })
        .then(function (response) {
          var rsp = response.data
          if (rsp.code === 0) {
            vm.notify('success', rsp.message, 2000)
          } else {
            vm.notify('error', rsp.message, 2000)
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    notify (type, message, duration) {
      var vm = this
      if (type === 'success') {
        vm.$notify.success({
          title: language('workbench.js.success'),
          message: message,
          duration: duration
        })
      } else if (type === 'error') {
        vm.$notify.error({
          title: language('workbench.js.error'),
          message: message,
          duration: duration
        })
      }
    }
  }
}
</script>

<style>
</style>
