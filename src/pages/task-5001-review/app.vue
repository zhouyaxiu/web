<template>
<div class="main">
  <Header/>
  <div class="container mb-5 content">
    <div class="fh-card">
      <div class="el-form-item"><label class="el-form-item__label fh-list-title">姓名</label><label class="el-form-item__label">{{question.prev.name}}</label></div>
      <div class="el-form-item"><label class="el-form-item__label fh-list-title">地址</label><label class="el-form-item__label ">{{question.prev.address}}</label></div>
      <div class="el-form-item"><label class="el-form-item__label fh-list-title">上传设备</label><label class="el-form-item__label ">{{question.prev.equip}}</label></div>
      <div class="el-form-item"><label class="el-form-item__label fh-list-title">语言</label><label class="el-form-item__label ">{{question.prev.language}}</label></div>
      <div class="el-form-item"><label class="el-form-item__label fh-list-title">文件名</label><label class="el-form-item__label ">{{question.prev.filename}}</label></div>
      <div class="el-form-item"><label class="el-form-item__label fh-list-title">文件大小</label><label class="el-form-item__label ">{{fillSize}}</label></div>
      <div class="el-form-item">
        <label class="el-form-item__label fh-list-title">数据</label>
        <div id="thisdata"></div>
      </div>
      <div v-show="reviewCommentVisible" class="fh-magin-bottom">
        <div id="editor"></div>
      </div>
    </div>
    <div class="d-flex justify-content-end fh-magin-bottom">
      <el-button type="danger" @click="rejectTask">拒绝</el-button>
      <el-button type="success" @click="acceptTask">通过</el-button>
    </div>
  </div>
  <Footer/>
</div>
</template>

<script>
import Header from 'components/header'
import Footer from 'components/footer'
import axios from 'axios'
import Quill from 'quill'

var projectId = document.location.pathname.split('/')[2]
var http = axios.create()

export default {
  name: 'app',
  components: {
    Header,
    Footer
  },
  data () {
    return {
      loading: false,
      reviewCommentVisible: false,
      reason: '',
      question: {
        prev: {}
      },
      quill: {}
    }
  },
  computed: {
    // 计算文件大小
    fillSize: function () {
      let fillSize = this.question.prev.filesize
      let returnSize, calSize
      if (fillSize > 1048576) {
        calSize = (fillSize / 1024 / 1024).toFixed(2)
        returnSize = calSize + 'MB'
      } else if (fillSize > 1024) {
        calSize = (fillSize / 1024).toFixed(2)
        returnSize = calSize + 'KB'
      } else {
        returnSize = fillSize + 'B'
      }
      return returnSize
    }
  },
  mounted: function () {
    this.$nextTick(function () {
      // Code that will run only after the
      // entire view has been rendered
      var vm = this

      // 初始化编辑器
      vm.quill = new Quill('#editor', {
        placeholder: '请输入...',
        modules: {
          toolbar: ['bold', 'italic', 'underline', 'strike']
        },
        theme: 'snow'
      })
      vm.getTask()
    })
  },
  methods: {
    testGetTask () {
      var vm = this
      var data = '{"code": 0,"message": "任务获取成功","questions": [{"id": "lingopioneer001","title": "请按要求标注下面的数据。","type": "","uuid": "pGlIrmdRX0CvZly377KEDcG9F3pVjQtn","raw": "","prev": "{\\"key\\":\\"lingopioneer001/LARFwmelLSugLh7Ak7fSeBuYqJP11it9.wav\\",\\"filesize\\":26595712,\\"filename\\":\\"Ar-Eg Ibrahim android.wav\\",\\"equip\\":\\"Android\\",\\"name\\":\\"Ibrahim Yourself\\",\\"address\\":\\"Egypt\\",\\"language\\":\\"阿拉伯语 / Arabic\\"}","answerType": "","comment": "未知"}]}'
      console.log(data)
      var rsp = JSON.parse(data)
      vm.question = rsp.questions[0]
      vm.question.prev = JSON.parse(vm.question.prev)
      console.log(vm.question.prev)
      vm.renderData()
      // {
      //   "key": "lingopioneer001/LARFwmelLSugLh7Ak7fSeBuYqJP11it9.wav", 音频url，需要补充前缀 https://s301.fanhantech.com/
      //   "filesize": 26595712,                                          音频文件大小，单位字节
      //   "filename": "Ar-Eg Ibrahim android.wav",                       音频文件名字
      //   "equip": "Android",                                            录制音频的设备
      //   "name": "Ibrahim Yourself",                                    录音者姓名
      //   "address": "Egypt",                                            录音者国籍
      //   "language": "阿拉伯语 / Arabic"                                 音频语言
      // }
    },
    renderData () {
      var vm = this
      // 判断数据类型
      var thisdata = document.getElementById('thisdata')
      var userData = vm.question.prev.key
      var urlArr = userData.split('.')
      var urlType = urlArr[urlArr.length - 1]
      if (urlType.length < 5 && urlType.length > 0) {
        if (urlType === 'mp4') {
          thisdata.innerHTML = `<video id="video1" width="550" controls  src="https://s301.fanhantech.com/${userData}"></video>`
        } else if (urlType === 'wav') {
          thisdata.innerHTML = `<audio src="https://s301.fanhantech.com/${userData}" controls="controls">`
        } else {
          thisdata.innerHTML = `<img src="https://s301.fanhantech.com/${userData}" width="500">`
        }
      } else {
        thisdata.innerHTML = `<p>${userData}</p>`
      }
    },
    getTask () {
      var vm = this
      var url = '/api/projects/' + projectId + '/task/review' + window.location.search
      http.get(url)
        .then(function (response) {
          var rsp = response.data
          if (rsp.code === 0) {
            vm.question = rsp.questions[0]
            vm.question.prev = JSON.parse(vm.question.prev)
            vm.renderData()
          } else {
            vm.$notify.error({
              title: '失败',
              message: rsp.message,
              duration: 2000
            })
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    acceptTask () {
      var vm = this
      var url = '/api/projects/' + projectId + '/task/review' + window.location.search
      http.post(url, {
        accept: true,
        comment: '通过'
      })
        .then(function (response) {
          let rsp = response.data
          // console.log(rsp)
          if (rsp.code === 0) {
            vm.$notify.success({
              title: '成功',
              message: rsp.message,
              duration: 2000
            })
            // 通过refresh页面获取下一个任务
            setTimeout(() => {
              // window.location.href="/projects/"+projectId+"/task/reviews"
              // window.close()
            }, 2000)
          } else {
            vm.$notify.error({
              title: '失败',
              message: rsp.message,
              duration: 2000
            })
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    rejectTask () {
      var vm = this
      if (vm.reviewCommentVisible === false) {
        vm.reviewCommentVisible = true
        return
      }
      vm.reason = vm.quill.getText()
      var url = '/api/projects/' + projectId + '/task/review' + window.location.search
      http.post(url, {
        accept: false,
        comment: vm.reason
      })
        .then(function (response) {
          let rsp = response.data
          // console.log(rsp)
          if (rsp.code === 0) {
            vm.$notify.success({
              title: '成功',
              message: rsp.message,
              duration: 2000
            })
            // 通过refresh页面获取下一个任务
            setTimeout(() => {
              // window.location.href="/projects/"+projectId+"/task/reviews"
              // window.close()
            }, 2000)
          } else {
            vm.$notify.error({
              title: '失败',
              message: rsp.message,
              duration: 2000
            })
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    }
  }
}
</script>
<style>
body {
    background-color: #f0f2f5;
}
</style>

<style scoped>
.ql-container {
  height: 150px;
}
.content{
    background-color: #f0f2f5;
    padding: 2rem;
    margin-bottom: 1rem;
}
.fh-card {
  border-radius: 6px;
  background-color: #fff;
  padding:24px;
}
.fh-magin-bottom {
  margin-top: 1rem;
  margin-bottom: 1rem;
}
.under-footer {
  position: fixed;
  bottom: 0;
  width: 100%;
}
.fh-list-title {
  width: 80px;
  text-align: left;
}
</style>
