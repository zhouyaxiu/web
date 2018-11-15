<template>
<div class="main">
  <Header/>
  <div class="container">
    <div class="text">
      <p>请录制如下文本内容</p>
      <p>{{question.prev.raw}}</p>
    </div>
    <div class="record mt-3">
      <p>录制的音频</p>
      <div class="wav">
        <audio :src="question.prev.res" controls="controls"></audio>
      </div>
    </div>
    <div v-show="reviewCommentVisible">
      <div id="editor"></div>
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
      // vm.question.raw = 'text'
      // vm.question.res = 'https://s301.fanhantech.com/waa001/0264fde98e8743346c591e6b16953451_00000000.wav'
      vm.getTask()
    })
  },
  methods: {
    getTask () {
      var vm = this
      var url = '/api/projects/' + projectId + '/task/review' + window.location.search
      http.get(url)
        .then(function (response) {
          var rsp = response.data
          if (rsp.code === 0) {
            vm.question = rsp.questions[0]
            vm.question.prev = JSON.parse(vm.question.prev)
            vm.question.prev.res = 'https://s301.fanhantech.com/' + vm.question.prev.key
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
</style>
