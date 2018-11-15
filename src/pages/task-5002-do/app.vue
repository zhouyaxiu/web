<template>
  <div class="main">
    <Header/>
    <div class="container">
      <div class="text">
        <p>请录制如下文本内容</p>
        <p>{{question.raw}}</p>
      </div>
      <div class="control">
        <el-button id="startBtn" type='primary' @click="startRecording()" :disabled="status.startWav">开始录制</el-button>
        <el-button id="endBtn" type='danger' @click="stopRecording()" :disabled="status.endWav">结束录制</el-button>
      </div>
      <div class="record mt-3">
        <p>录制的音频</p>
        <div class="wav">
        </div>
      </div>
      <div class="action d-flex justify-content-end">
        <el-button type="primary" @click="submitTask">下一个</el-button>
      </div>
    </div>
    <Footer/>
  </div>
</template>

<script>
import Header from 'components/header'
import Footer from 'components/footer'
import $ from 'jquery'
import axios from 'axios'
import {language} from 'lang'
import Recorder from 'recorder-js'

var http = axios.create()
var projectId = document.location.pathname.split('/')[2]
// projectId = 'testb001'

export default {
  name: 'app',
  components: {
    Footer: Footer,
    Header: Header
  },
  data () {
    return {
      status: {
        startWav: false,
        endWav: true
      },
      question: {},
      recorder: null,
      blob: null,
      filename: '',
      key: ''
    }
  },
  mounted: function () {
    this.$nextTick(function () {
      var vm = this
      vm.initRecording()
      vm.getTask()
    })
  },
  methods: {
    getTask () {
      var vm = this
      http.get('/api/projects/' + projectId + '/task')
        .then(function (response) {
          var rsp = response.data
          if (rsp.code === 0) {
            vm.question = rsp.questions[0]
            vm.question.raw = JSON.parse(vm.question.raw).raw
          } else {
            vm.notify('error', rsp.message, 2000)
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    submitTask () {
      var vm = this
      var config = {
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        transformRequest: [function (data) {
          // Do whatever you want to transform the data
          let ret = ''
          for (let it in data) {
            ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
          }
          return ret
        }]
      }
      http.post('/api/projects/' + projectId + '/token', {
        filename: vm.filename,
        taskid: projectId
      }, config)
        .then(function (response) {
          var rsp = response.data
          if (rsp.code === 0) {
            vm.upload(rsp.token)
          } else {
            vm.notify('error', rsp.message, 2000)
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    initRecording () {
      var vm = this
      try {
        var audioContext = new (window.AudioContext || window.webkitAudioContext)()
        var recorder = new Recorder(audioContext)
        navigator.mediaDevices.getUserMedia({audio: true})
          .then(stream => recorder.init(stream))
          .catch(err => console.log('Uh oh... unable to get stream...', err))
        vm.recorder = recorder
      } catch (e) {
        alert('No web audio support in this browser!')
      }
    },
    startRecording () {
      var vm = this
      vm.recorder.start()
        .then(() => {
          $('.wav').empty()
          $('.wav').append(`<pre>录音中...</pre>`)
        })
      let status = vm.status
      status.startWav = true
      status.endWav = false
    },
    stopRecording () {
      var vm = this
      vm.recorder.stop()
        .then(({blob, buffer}) => {
          $('.wav').empty()
          $('.wav').append('<pre>录音完成</pre>')
          vm.blob = blob
          vm.exportWav()
        })
      let status = vm.status
      status.endWav = true
      status.startWav = false
    },
    exportWav (blob) {
      var vm = this
      vm.filename = new Date().toISOString() + '.wav'
      var url = URL.createObjectURL(vm.blob)
      var div = document.createElement('div')
      var au = document.createElement('audio')
      var hf = document.createElement('a')
      au.controls = true
      au.controlsList = 'nodownload'
      au.oncontextmenu = function () {
        return false
      }
      au.src = url
      hf.href = url
      // hf.download = vm.filename
      // hf.innerHTML = hf.download
      div.appendChild(au)
      div.appendChild(hf)
      $('.wav').append(div)
    },
    upload (token) {
      var vm = this
      var param = new FormData()
      param.append('token', token)
      param.append('file', vm.blob)
      var config = {
        headers: {'Content-Type': 'multipart/form-data'}
      }
      http.post('https://upload.qiniup.com/', param, config)
        .then(function (response) {
          var rsp = response.data
          vm.key = rsp.key
          vm.submit()
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    submit () {
      var vm = this
      http.post('/api/projects/' + projectId + '/task', {
        id: projectId,
        uuid: vm.question.uuid,
        result: JSON.stringify({
          raw: vm.question.raw,
          key: vm.key,
          filename: vm.filename
        })
      })
        .then(function (response) {
          let rsp = response.data
          if (rsp.code === 0) {
            vm.$notify.success({
              title: language('collectWav.js.success.type1'),
              message: rsp.message,
              duration: 2000
            })
            setTimeout(() => {
              window.location.reload()
            }, 1000)
          } else {
            vm.$notify.error({
              title: language('collectWav.js.error.type1'),
              message: rsp.message,
              duration: 2000
            })
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    notify (type, message, duration) {
      if (type === 'success') {
        this.$notify.success({
          title: '成功',
          message: message,
          duration: duration
        })
      } else if (type === 'warning') {
        this.$notify.warning({
          title: '警告',
          message: message,
          duration: duration
        })
      } else if (type === 'error') {
        this.$notify.error({
          title: '失败',
          message: message,
          duration: duration
        })
      }
    }
  }
}
</script>

<style>
</style>
