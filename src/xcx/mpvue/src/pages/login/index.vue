<template>
  <div></div>
</template>
<script>
import app from '../../App.vue'

export default {
  methods: {
    getUserInfo () {
      // 调用登录接口
      wx.login({
        success: res => {
          if (res.code) {
            wx.request({
              url: 'https://www.fanhantech.com/api/oauth/login/xiaochengxu',
              data: {
                code: res.code
              },
              method: 'GET',
              header: { 'content-type': 'application/json' },
              success: function (response) {
                if (response.data.code === 0) {
                  app.setSid(response.data.data)
                  app.setCookie(response.header['Set-Cookie'])
                  wx.navigateTo({
                    url: '/pages/index/main'
                  })
                } else if (response.data.code === 1) {
                  app.setCookie(response.header['Set-Cookie'])
                  wx.navigateTo({
                    url: '/pages/index/main'
                  })
                } else {
                  wx.showToast({
                    title: response.errMsg
                  })
                }
              },
              fail: function (response) {
                console.log(response)
                wx.showToast({
                  title: response.errMsg
                })
              }
            })
          } else {
            wx.showToast({
              title: res.errMsg
            })
            console.log('获取用户登录态失败！' + res.errMsg)
          }
        },
        fail: function () {
          console.log('fail-login')
          wx.showToast({
            title: '微信授权失败'
          })
        }
      })
    }
  },

  created () {
    // 调用应用实例的方法获取全局数据
    // this.getUserInfo()
  },
  onLoad () {
    this.getUserInfo()
  }
}
</script>

<style scoped>

</style>
