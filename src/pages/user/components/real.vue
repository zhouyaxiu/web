<template>
<div class="card">
  <div class="card-header">
    <div class="d-flex">
      <div class="d-inline-block" style="font-size:1.2rem;">{{$t("user.real.realname")}}</div>
      <div class="d-inline-block align-self-center ml-auto" v-if="showReIdentify">
        <router-link :to="{ name: 'realForm'}">
          <i class="el-icon-edit-outline">{{$t("user.real.reform")}}</i>
        </router-link>
      </div>
    </div>
  </div>
  <div class="card-body" v-if="form.realType === 'idcard'">
    <div class="row">
      <div class="col-md-3">
        <span class="real-name"><span style="color:#F56C6C">*</span>{{$t("user.real.truename")}}{{form.realName}}</span>
      </div>
      <div class="col-md-5">
        <span class="id-card-num"><span style="color:#F56C6C">*</span>{{$t("user.real.idcardnum")}}{{form.idCardNum}}</span>
      </div>
      <div class="col-md-4">
        <span class="real-status">{{$t("user.real.status")}}{{getRealStatus('form')}}</span>
      </div>
    </div>
    <div class="row mt-5">
      <div class="col">
        <img :src="form.idCardFront" class="img-thumbnail">
      </div>
      <div class="col">
        <img :src="form.idCardBack" class="img-thumbnail">
      </div>
      <div class="col">
        <img :src="form.idCardHold" class="img-thumbnail">
      </div>
    </div>
  </div>
  <div class="card-body" v-if="form.realType === 'passport'">
    <div class="row">
      <div class="col-md-3">
        <span class="real-name"><span style="color:#F56C6C">*</span>{{$t("user.real.truename")}}{{form.realName}}</span>
      </div>
      <div class="col-md-5">
        <span class="id-card-num"><span style="color:#F56C6C">*</span>{{$t("user.real.passportNum")}}{{form.passportNum}}</span>
      </div>
      <div class="col-md-4">
        <span class="real-status">{{$t("user.real.status")}}{{getRealStatus('form')}}</span>
      </div>
    </div>
    <div class="row mt-5">
      <div class="col-md-4">
        <img :src="form.passportFront" class="img-thumbnail">
      </div>
    </div>
  </div>
</div>
</template>
<script>
import axios from 'axios'
import {language} from 'lang'

var url = '/api/user/real'
var http = axios.create()
export default {
  name: 'app',
  data () {
    return {
      form: {
        realName: '',
        realType: 'idcard',
        idCardNum: '',
        idCardFront: '',
        idCardBack: '',
        idCardHold: '',
        passportNum: '',
        passportFront: '',
        realComplete: '',
        realStatus: 3,
        realValid: ''
      }
    }
  },
  mounted: function () {
    this.$nextTick(function () {
      // Code that will run only after the
      // entire view has been rendered
      this.getReal()
    })
  },
  computed: {
    getRealStatus () {
      let vm = this
      return function (formName) {
        let realStatus = vm[formName].realStatus
        if (realStatus === 1) {
          return language('user.real.js.realStatus1')
        } else if (realStatus === 2) {
          return language('user.real.js.realStatus2')
        } else if (realStatus === 3) {
          return language('user.real.js.realStatus3')
        } else {
          return '--'
        }
      }
    },
    showReIdentify () {
      if (this.form.realStatus === 1 || this.form.realStatus === 2) {
        return false
      }
      return true
    }
  },
  methods: {
    getReal () {
      var vm = this
      http.get(url)
        .then(function (response) {
          var rsp = response.data
          if (rsp.code !== 0) {
            vm.toRealForm()
          } else {
            vm.form = rsp.data
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    toRealForm () {
      this.$router.push({ path: '/realForm' })
    }
  }
}
</script>

<style>
.real-name, .id-card-num, .real-status {
  color: #48576A;
}
</style>
