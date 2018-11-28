<template>
<div class="accountSet">
  <h2>{{$t("user.nav.accountset")}}</h2>
  <div class="user-form-list">
    <div class="user-list-label">{{$t("register.email")}}</div>
    <div class="user-list-content">{{userInfo.mail === '' ? $t("user.your")+$t("register.email") : userInfo.mail}}</div>
  </div>
  <div class="user-form-list">
    <div class="user-list-label">{{$t("register.mobile")}}</div>
    <div class="user-list-content">{{userInfo.phone === '' ? $t("user.your")+$t("register.mobile") : userInfo.phone}}</div>
  </div>
  <div class="user-form-list">
    <div class="user-list-label">{{$t("user.account.password")}}</div>
    <div class="user-list-content"><a href="/password.html">{{$t("user.account.pwdchange")}}</a></div>
  </div>
  <h2 class="mt-20">{{$t("user.account.associate")}}</h2>
  <div class="user-form-list">
    <div class="user-list-label"><i class="fa fa-weixin weixin-color"></i>Weixin</div>
    <div class="user-list-content">{{userInfo.weixin === 0 ? $t("user.account.unassociated") : $t("user.account.associated")}}</div>
    <div class="user-list-edit" v-if="userInfo.weixin === 0"><a :href="oauth.weixin">{{$t("user.account.associate")}}</a></div>
  </div>
  <div class="user-form-list">
    <div class="user-list-label"><i class="fa fa-google google-color"></i>Google</div>
    <div class="user-list-content">{{userInfo.google === 0 ? $t("user.account.unassociated") : $t("user.account.associated")}}</div>
    <div class="user-list-edit" v-if="userInfo.google === 0"><a :href="oauth.google">{{$t("user.account.associate")}}</a></div>
  </div>
  <div class="user-form-list">
    <div class="user-list-label"><i class="fa fa-facebook facebook-color"></i>Facebook</div>
    <div class="user-list-content">{{userInfo.facebook === 0 ? $t("user.account.unassociated") : $t("user.account.associated")}}</div>
    <div class="user-list-edit" v-if="userInfo.facebook === 0"><a :href="oauth.facebook">{{$t("user.account.associate")}}</a></div>
  </div>
  <div class="user-form-list">
    <div class="user-list-label"><i class="fa fa-weibo weibo-color"></i>Weibo</div>
    <div class="user-list-content">{{userInfo.weibo === 0 ? $t("user.account.unassociated") : $t("user.account.associated")}}</div>
    <div class="user-list-edit" v-if="userInfo.weibo === 0">{{$t("user.account.developing")}}</div>
  </div>
  <div class="user-form-list">
    <div class="user-list-label"><i class="fa fa-qq qq-color"></i>QQ</div>
    <div class="user-list-content">{{userInfo.qq === 0 ? $t("user.account.unassociated") : $t("user.account.associated")}}</div>
    <div class="user-list-edit" v-if="userInfo.qq === 0">{{$t("user.account.developing")}}</div>
  </div>
</div>
</template>

<script>
// import axios from 'axios'
// import {language} from 'lang'

// let http = axios.create()
export default {
  name: 'accountSet',
  data () {
    return {
      userInfo: {
        mail: '',
        phone: '',
        weixin: 0,
        google: 0,
        facebook: 0,
        weibo: 0,
        qq: 0
      },
      oauth: {
        weixin: 'https://open.weixin.qq.com/connect/qrconnect?appid=wx31bd8c7fe1628298&redirect_uri=https://www.fanhantech.com/api/oauth/login/weixin&response_type=code&scope=snsapi_login&state=',
        facebook: 'https://www.facebook.com/v3.2/dialog/oauth?client_id=1875757705826407&redirect_uri=https://www.fanhantech.com/api/oauth/login/facebook/&response_type=code&scope=email',
        google: 'https://accounts.google.com/o/oauth2/auth?client_id=437691762848-oktemnfuvdm1qpd83cd2cs3m68df2e9v.apps.googleusercontent.com&redirect_uri=https%3A%2F%2Fwww.fanhantech.com%2Fapi%2Foauth%2Flogin%2Fgoogle%2F&response_type=code&scope=email'
      }
    }
  },
  mounted: function () {
    this.$nextTick(function () {
      // Code that will run only after the
      // entire view has been rendered
      this.getProfile()
    })
  },
  methods: {
    getProfile () {
      // let vm = this
      // http.get('/api/user/profile')
      //   .then(function (response) {
      //     var rsp = response.data
      //     var data = rsp.data
      //     vm.userInfo = data
      //   })
      //   .catch(function (error) {
      //     console.log(error)
      //   })
    }
  }
}
</script>

<style scoped>
.mt-20 {margin-top: 20px;}
.user-form h2 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
  margin-left: 12px;
}
.user-form-list {
  border-bottom: 1px solid #eee;
  display: flex;
  padding: 12px;
  box-sizing: border-box;
}
/* 单行 */
.user-list-label {
  width: 200px;
}
.user-list-content {
  flex: 1;
  color: #797979;
}
.user-list-edit {
  color: #409EFF;
  cursor: pointer;
  padding-left: 20px;
}
@media only screen and (max-width: 768px) {
  .user-list-label {
    width: 100px;
  }
}
.user-form-list a {
  color: #409EFF;
}
.user-form-list a:hover {
  text-decoration: none;
}
.user-list-label i {
  font-size: 14px;
  margin-right: 12px;
  border-radius: 13px;
  color: #fff;
  width: 26px;
  height: 26px;
  text-align: center;
  line-height: 26px;
}
.weixin-color {
  background: #2ec102;
}
.weibo-color {
  background: #e6162d;
}
.qq-color {
  background: #2d9fe2;
}
.facebook-color {
  background: #0077b9;
}
.google-color {
  background: #3182f6;
}
</style>
