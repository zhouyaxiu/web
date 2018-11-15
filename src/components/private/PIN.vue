<template>
  <el-button :disabled="sendCodeDisabled" >{{sendCodeName}}</el-button>
</template>

<script>
import axios from 'axios'
import {language} from 'lang'

var http = axios.create()
export default {
  name: 'app',
  props: {
    action: ''
  },
  data () {
    return {
      sendCodeName: language('register.js.send'),
      sendCodeDisabled: false,
      sendCodetime: 59,
      postData: ''
    }
  },
  mounted: function () {
  },
  methods: {
    sendSmsPost () {
      let vm = this
      // console.log('进入子组件了')
      http.post(this.action, this.postData)
        .then(function (response) {
          let rsp = response.data
          if (rsp.code === 0) {
            vm.notify('success', rsp.message, 2000)
          } else {
            vm.notify('error', rsp.message, 2000)
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      vm.disableSendButton()
    },
    disableSendButton () {
      // 60s倒计时
      let vm = this
      vm.sendCodeDisabled = true
      vm.sendCodeName = language('register.js.sendAgain') + '(60s)'
      let interval = window.setInterval(function () {
        vm.sendCodeName = language('register.js.sendAgain') + '(' + vm.sendCodetime + 's)'
        --vm.sendCodetime
        if (vm.sendCodetime < 0) {
          vm.sendCodeName = language('register.js.send')
          vm.sendCodetime = 59
          vm.sendCodeDisabled = false
          window.clearInterval(interval)
        }
      }, 1000)
    }
  }
}
</script>
<style >
</style>
