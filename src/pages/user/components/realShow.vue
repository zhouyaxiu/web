<template>
<div class="real">
  <div class="user-form-title">
    <h2>{{$t("user.real_from.realname")}}</h2>
    <div class="d-inline-block align-self-center ml-auto" v-if="showReIdentify">
      <router-link :to="{ name: 'real'}">
        <el-button type="primary" round size="mini">{{$t("user.real.reform")}}</el-button>
      </router-link>
    </div>
  </div>
  <div style="padding-top: 12px;" v-if="idTpye === 'idcard'">
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
      <div class="col g-mobile-realshow">
        <img :src="form.idCardFront" class="img-thumbnail">
      </div>
      <div class="col g-mobile-realshow">
        <img :src="form.idCardBack" class="img-thumbnail">
      </div>
      <div class="col g-mobile-realshow">
        <img :src="form.idCardHold" class="img-thumbnail">
      </div>
    </div>
  </div>
  <div style="padding-top: 12px;" v-if="idTpye === 'passport'">
    <div class="row">
      <div class="col-md-3">
        <span class="real-name"><span style="color:#F56C6C">*</span>{{$t("user.real.truename")}}{{form.realName}}</span>
      </div>
      <div class="col-md-5">
        <span class="id-card-num"><span style="color:#F56C6C">*</span>{{$t("user.real.passportNum")}}{{form.idCardNum}}</span>
      </div>
      <div class="col-md-4">
        <span class="real-status">{{$t("user.real.status")}}{{getRealStatus('passPortForm')}}</span>
      </div>
    </div>
    <div class="row mt-5">
      <div class="col">
        <img :src="passPortForm.PassportFront" class="img-thumbnail">
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
  name: 'real',
  data () {
    return {
      form: {
        realName: '',
        idCardNum: '',
        idCardFront: '',
        idCardBack: '',
        idCardHold: '',
        realComplete: '',
        realStatus: 3,
        realValid: ''
      },
      passPortForm: {
        realName: '',
        PassportNum: '',
        PassportFront: '',
        realComplete: '',
        realStatus: 2,
        realValid: ''
      },
      idTpye: 'idcard'
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
      let vm = this
      http.get(url)
        .then(function (response) {
          var rsp = response.data
          if (rsp.code !== 0) {
            vm.toRealForm()
          } else {
            if (vm.idTpye === 'idcard') {
              vm.form = rsp.data
            } else {
              vm.passPortForm = rsp.data
            }
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    toRealForm () {
      this.$router.push({ path: '/real' })
    }
  }
}
</script>

<style>
.real .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
</style>

<style scoped>
.user-form h2 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
  margin-left: 12px;
}
.user-form-title {
  display: flex;
  justify-content: space-between;
}
/* 上传图片 */
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 245px;
  height: 174px;
  line-height: 174px;
  text-align: center;
}
.avatar {
  width: 245px;
  height: 174px;
  display: block;
}
@media only screen and (max-width: 768px) {
  .g-mobile-realshow {
    margin-bottom: 1rem;
    flex-basis: auto;
  }
}
</style>
