<template>
<div class="main">
  <Header ref="header"/>
  <div class="warp">
    <div class="user-top">
      <div class="user-top-img"></div>
      <div class="container">
        <el-dialog class="upload-dialog-box" :title="$t('user.profile.uploadavatar')" :visible.sync="dialogFormVisible" :width="dialogWidtn" center>
          <el-form :model="form" class="uploadDialog">
            <el-upload
              class="avatar-uploader"
              action="/api/user/avatar"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload">
              <img v-if="form.avatar" :src="form.avatar" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="updateProfile(form)">{{$t("user.save")}}</el-button>
            <el-button @click="dialogFormVisible = false">{{$t("user.reset")}}</el-button>
          </div>
        </el-dialog>
        <el-row class="user-top-title">
          <el-col :span="6" :xs="24" class="user-upload-box">
            <div class="user-upload" @click="dialogFormVisible = true">
              <img :src="imgUrl" >
              <i class="el-icon-plus showImg"></i>
            </div>
          </el-col>
          <el-col :span="6" :xs="24"><span>{{username === '' ? $t("user.profile.username") : username}}</span></el-col>
        </el-row>
      </div>
    </div>
    <div class="user-content container">
      <el-row>
        <el-col :span="6" :xs="24">
          <div class="user-nav">
            <div class="user-set">{{$t("user.nav.settings")}}</div>
            <el-menu
              :default-active="$route.path"
              class="el-menu-vertical-demo"
              @open="handleOpen"
              @close="handleClose"
              router>
              <router-link :to="{ name: 'archives'}">
                <el-menu-item index="/" @click="hideMenu()">
                  <i class="el-icon-tickets"></i>
                  <span slot="title">{{$t("user.nav.profile")}}</span>
                </el-menu-item>
              </router-link>
              <router-link :to="{ name: 'accountSet'}">
                <el-menu-item index="/accountSet" @click="hideMenu()">
                  <i class="el-icon-setting"></i>
                  <span slot="title">{{$t("user.nav.accountset")}}</span>
                </el-menu-item>
              </router-link>
              <router-link :to="{ name: 'realShow'}">
                <el-menu-item index="/realShow" @click="hideMenu()">
                  <i class="el-icon-location"></i>
                  <span slot="title">{{$t("user.nav.real")}}</span>
                </el-menu-item>
              </router-link>
            </el-menu>
          </div>
        </el-col>
        <el-col :span="18" :xs="24" class="g-mobile-con">
          <div class="g-mobile-back"><i class="el-icon-back" @click="hideMenu"></i></div>
          <div class="g-mobile-menu"><i class="el-icon-menu" @click="showMenu"></i></div>
          <div class="user-form">
            <router-view/>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
  <Footer class="g-mobile-hide"/>
</div>
</template>

<script>
import axios from 'axios'
import Header from 'components/header'
import Footer from 'components/footer'
import $ from 'jquery'
import {language} from 'lang'

// let url = '/api/user/profile'
let http = axios.create()
export default {
  name: 'app',
  components: {
    Header,
    Footer
  },
  data () {
    return {
      dialogWidtn: '30%',
      screenWidth: 0,
      dialogFormVisible: false,
      imgUrl: '',
      username: '',
      form: {
        avatar: ''
      },
      navIndex: '/'
    }
  },
  mounted: function () {
    const vm = this
    vm.getProfile()
    vm.screenWidth = document.documentElement.scrollWidth || document.body.scrollWidth
    window.onresize = function () {
      vm.screenWidth = document.documentElement.scrollWidth || document.body.scrollWidth
    }
  },
  watch: {
    screenWidth () {
      // 控制移动端dialog的宽度
      if (this.screenWidth < 500) {
        this.dialogWidtn = '80%'
      } else {
        this.dialogWidtn = '30%'
      }
    }
  },
  methods: {
    handleAvatarSuccess (res, file) {
      let vm = this
      vm.form.avatar = res.path
      console.log(res, file)
    },
    beforeAvatarUpload (file) {
      let vm = this
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG) {
        vm.$notify.error({
          title: language('user.profile.js.error.type1'),
          message: language('user.profile.js.error.type2'),
          duration: 2000
        })
      }
      if (!isLt2M) {
        vm.$notify.error({
          title: language('user.profile.js.error.type1'),
          message: language('user.profile.js.error.type3'),
          duration: 2000
        })
      }
      return isJPG && isLt2M
    },
    getProfile () {
      let vm = this
      console.log(vm.$refs.header)
      setTimeout(() => {
        const userInfo = vm.$refs.header.user
        console.log(vm.$refs.header.user)
        vm.username = userInfo.username || language('user.profile.username')
        vm.imgUrl = userInfo.avatar || ''
        vm.form.avatar = userInfo.avatar || ''
      }, 500)
    },
    updateProfile (form) {
      let vm = this
      http.post('/api/user/profile/update', {
        avatar: vm.form.avatar
      })
        .then(function (response) {
          let rsp = response.data
          if (rsp.code === 0) {
            vm.dialogFormVisible = false
            vm.$notify.success({
              title: language('user.profile.js.success'),
              message: rsp.message,
              duration: 2000
            })
            vm.imgUrl = vm.form.avatar
            vm.$refs.header.userSet(vm.form.avatar)
          } else {
            vm.$notify.error({
              title: language('user.profile.js.error.type1'),
              message: rsp.message,
              duration: 2000
            })
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    // updateProfile (form) {
    //   let vm = this
    //   http.post('/api/user/profile', {
    //     avatar: vm.form.avatar
    //   })
    //     .then(function (response) {
    //       let rsp = response.data
    //       if (rsp.code === 0) {
    //         vm.dialogFormVisible = false
    //         vm.$notify.success({
    //           title: language('user.profile.js.success'),
    //           message: rsp.message,
    //           duration: 2000
    //         })
    //         setTimeout(() => {
    //           vm.toProfile()
    //         }, 1000)
    //       } else {
    //         vm.$notify.error({
    //           title: language('user.profile.js.error.type1'),
    //           message: rsp.message,
    //           duration: 2000
    //         })
    //       }
    //     })
    //     .catch(function (error) {
    //       console.log(error)
    //     })
    // },
    showMenu () {
      $('.g-mobile-con').animate({left: '100%'})
    },
    hideMenu () {
      if (this.screenWidth < 765) {
        $('.g-mobile-con').animate({left: '0'})
      }
    }
  }
}
</script>

<style scoped>
a:hover {
  text-decoration: none;
}
.user-top {
  position: relative;
  height: 275px;
  margin-top: -1rem;
}
.user-top-img {
  position: absolute;
  z-index: -1;
  top: 0;
  left: 0;
  height: 347px;
  width: 100%;
  background-image: linear-gradient(to bottom right, #0c3483 0%, #a2b6df 100%, #6b8cce 100%, #a2b6df 100%);
  overflow: hidden;
}
.user-top-title {
  align-items: center;
  display: flex;
  padding-top: 65px;
}
.user-top-title span {
  margin-left: 20px;
  color: #fff;
  font-size: 24px;
}
.user-upload-box {
  display: flex;
  justify-content: center;
}
@media only screen and (max-width: 768px) {
  .user-top {
    height: 235px;
  }
  .user-top-img {
    height: 307px;
  }
  .user-top-title {
    flex-wrap: wrap;
    text-align: center;
  }
  .user-top-title span {
    margin-left: 0;
    font-size: 16px;
  }
  .user-upload-box {
    margin-bottom: 1rem;
  }
}
/* 用户头像 */
.user-upload {
  position: relative;
  width: 150px;
  height: 150px;
  border: 5px solid #fff;
  border-radius: 15px;
  cursor: pointer;
  overflow: hidden;
}
@media only screen and (max-width: 768px) {
  .user-upload {
    width: 120px;
    height: 120px;
  }
}
.showImg {
  position: absolute;
  left: 50%;
  top: 50%;
  font-size: 28px;
  color: #fff;
  text-align: center;
  visibility: hidden;
  transform: translate(-50%,-50%);
}
.user-upload:hover .showImg{
  visibility: visible;
}
.user-upload img {
  width: 100%;
  height: 100%;
}
/* 用户信息 */
.user-nav {
  min-height: 600px;
  padding: 0 1rem;
}
.user-nav .el-menu {
  border-right: none;
  margin-top: 3.5rem;
}
.user-set {
  position: relative;
  top: 30px;
  margin-left: 20px;
  color: white;
  font-size: 20px;
  font-weight: bold;
}
/* 内容 */
.user-form {
  min-height: 600px;
  background: white;
  border-radius: 5px;
  margin-bottom: 50px;
  font-size: 14px;
  -webkit-box-shadow: 0 5px 15px 0 rgba(0,0,0,0.08);
  box-shadow: 0 5px 15px 0 rgba(0,0,0,0.08);
  -webkit-transition: -webkit-box-shadow .4s;
  transition: -webkit-box-shadow .4s;
  -o-transition: box-shadow .4s;
  transition: box-shadow .4s;
  transition: box-shadow .4s, -webkit-box-shadow .4s;
  padding:20px;
}
@media only screen and (max-width: 768px) {
  .user-form {
    margin-bottom: 0;
  }
  .user-set {
    top: 32px;
    font-size: 16px;
  }
}
/* 弹框 */
.uploadDialog {
  display: flex;
  justify-content: center;
}
.avatar-uploader {
    border: 1px dashed #d9d9d9;
    display: inherit;
}
.avatar-uploader .el-upload {
    position: relative;
    cursor: pointer;
    overflow: hidden;
  }
  .avatar-uploader:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    width: 178px;
    height: 178px;
    font-size: 28px;
    color: #8c939d;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    display: block;
    width: 178px;
    height: 178px;
  }
  .g-mobile-menu {
    display: none;
  }
  .g-mobile-back{
    display: none;
  }
  @media only screen and (max-width: 768px) {
    .g-mobile-con {
      position: absolute;
      top: 0;
      left: 0;
    }
    .g-mobile-back {
      position: absolute;
      top: 0;
      left: -2.3rem;
      display: block;
      color: #fff;
      font-size: 1.8rem;
    }
    .g-mobile-menu {
      display: block;
      margin-left: .5rem;
      color: #fff;
      font-size: 1.5rem;
    }
    .g-mobile-hide {
      display: none;
    }
    .user-content.container {
      padding-right: 0;
      padding-left: 0;
    }
  }
</style>
