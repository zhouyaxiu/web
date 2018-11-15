<template>
<div class="card">
  <div class="card-header">
    <div class="d-flex" style="justify-content:space-between">
      <div style="font-size:1.2rem;" >{{$t("workbench.account.overfiew")}}</div>
    </div>
  </div>
  <div class="card-body">
    <h3 class="card-title text-center">{{remainPoints}}</h3>
    <p class="card-subtitle text-muted text-center">{{$t("workbench.account.integral")}}</p>
    <div class="row mt-5">
      <div class="mx-auto">
        <el-button type="primary" @click="toRecharge">账户充值</el-button>
        <el-button type="primary" @click="withdraw" :disabled="withdrawDisabled">{{$t("workbench.account.exchange")}}</el-button>
      </div>
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
  data () {
    return {
      remainPoints: '--',
      withdrawDisabled: false
    }
  },
  mounted: function () {
    var vm = this
    this.$nextTick(function () {
      vm.getBalance()
    })
  },
  methods: {
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
            vm.$notify.error({
              title: language('workbench.js.error'),
              message: rsp.message,
              duration: 2000
            })
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    withdraw () {
      var vm = this
      var url = '/api/user/balance/withdraw'
      http.get(url)
        .then(function (response) {
          var rsp = response.data
          if (rsp.code === 0) {
            vm.toWithdraw()
          } else {
            vm.withdrawDisabled = true
            vm.$notify.error({
              title: language('workbench.js.error'),
              message: rsp.message,
              duration: 4000
            })
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    toWithdraw () {
      this.$router.push({ path: '/withdraw' })
    },
    toRecharge () {
      this.$router.push({ path: '/recharge' })
    }
  }
}
</script>

<style>
</style>
