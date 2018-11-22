<template>
<div class="accountSet">
  <h2>账号信息</h2>
  <div class="user-form-list">
    <div class="user-list-label">电子邮箱</div>
    <div class="user-list-content">{{userInfo.mail}}</div>
  </div>
  <div class="user-form-list">
    <div class="user-list-label">手机号</div>
    <div class="user-list-content">{{userInfo.phone}}</div>
  </div>
  <div class="user-form-list">
    <div class="user-list-label">密码</div>
    <div class="user-list-content"><a href="/password.html">更改密码</a></div>
  </div>
  <h2 class="mt-20">账号关联</h2>
  <div class="user-form-list">
    <div class="user-list-label"><i class="fa fa-weixin weixin-color"></i>Weixin</div>
    <div class="user-list-content">{{weixinStatus}}</div>
    <div class="user-list-edit" v-if="userInfo.weixin === 0"><a href="javascript:void(0)">关联</a></div>
  </div>
  <div class="user-form-list">
    <div class="user-list-label"><i class="fa fa-weibo weibo-color"></i>Weibo</div>
    <div class="user-list-content">{{weiboStatus}}</div>
    <div class="user-list-edit" v-if="userInfo.weibo === 0">开发中</div>
  </div>
  <div class="user-form-list">
    <div class="user-list-label"><i class="fa fa-qq qq-color"></i>QQ</div>
    <div class="user-list-content">{{qqStatus}}</div>
    <div class="user-list-edit" v-if="userInfo.qq === 0">开发中</div>
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
        mail: '您的电子邮箱',
        phone: '您的手机号',
        weixin: 0,
        weibo: 0,
        qq: 0
      }
    }
  },
  computed: {
    weixinStatus () {
      if (this.userInfo.weixin === 0) {
        return '未关联'
      } else {
        return '已关联'
      }
    },
    weiboStatus () {
      if (this.userInfo.weibo === 0) {
        return '未关联'
      } else {
        return '已关联'
      }
    },
    qqStatus () {
      if (this.userInfo.qq === 0) {
        return '未关联'
      } else {
        return '已关联'
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
</style>
