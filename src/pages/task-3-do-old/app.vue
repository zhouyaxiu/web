<template>
<div id="main">
  <Header/>
  <div class="container mb-5 content">
    <div class="userinfo clearfix">
      <p class="text-muted float-right" style="margin-bottom：0">今日完成：--</p>
      <p class="font-italic">请按要求标注下面一段语音。</p>
    </div>
    <div class="question-title">
    </div>
    <div class="playlist-toolbar">
      <el-button-group>
        <el-button type="warning" size="small" @click="waveformPause">暂停</el-button>
        <el-button type="success" size="small" @click="waveformPlay">播放</el-button>
        <el-button type="danger" size="small" @click="waveformStop">停止</el-button>
        <!--el-button type="success" size="small" class="fa fa-fast-backward" @click="waveformBackward"></el-button-->
        <!--el-button type="success" size="small" class="fa fa-fast-forward" @click="waveformForward"></el-button-->
        <el-button size="small" @click="waveformZoomin">放大</el-button>
        <el-button size="small" @click="waveformZoomout">缩小</el-button>
      </el-button-group>
      <el-button-group>
        <el-button type="info" size="small" class="btn-clipboard" data-clipboard-text="<STA/>">背景持续噪音</el-button>
        <el-button type="info" size="small" class="btn-clipboard" data-clipboard-text="<NON/>">突发的非语音类噪音</el-button>
        <el-button type="info" size="small" class="btn-clipboard" data-clipboard-text="<FIL/>">无实际意义的语气词(本人)</el-button>
        <el-button type="info" size="small" class="btn-clipboard" data-clipboard-text="<RSP/>">无实际意义的语气词(非本人)</el-button>
        <el-button type="info" size="small" class="btn-clipboard" data-clipboard-text="<SPK/>">语音噪音</el-button>
        <el-button type="info" size="small" class="btn-clipboard" data-clipboard-text="<NPS/>">非发音人发出的语音噪音</el-button>
        <el-button type="info" size="small" class="btn-clipboard" data-clipboard-text="**">听不清</el-button>
        <el-button type="info" size="small" class="btn-clipboard" data-clipboard-text="<无效>">无效</el-button>
      </el-button-group>
      <el-button type="primary" @click="waveformCut">增加</el-button>
    </div>
    <div v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)">
      <div id="playlist"></div>
    </div>
    <div>当前：{{currentTime}}</div>
    <div class="d-flex justify-content-end">
      <!-- <el-button type="info" @click="waveformSave">暂时保存</el-button> -->
      <el-button type="success" @click="postTask">提交</el-button>
    </div>
  </div>
  <Footer/>
</div>
</template>

<script>
import Header from 'components/header'
import Footer from 'components/footer'
import axios from 'axios'
import $ from 'jquery'
import ClipboardJS from 'clipboard'

var projectId = document.location.pathname.split('/')[2]
var http = axios.create({
  headers: {'X-Xsrftoken': $('meta[name=_xsrf]').attr('content')}
})
export default {
  name: 'app',
  components: {
    Header,
    Footer
  },
  data () {
    return {
      loading: false,
      currentTime: '0:00.000',
      index: 1,
      WaveformPlaylist: '',
      playlist: '',
      question: {},
      storageKey: ''
    }
  },
  mounted: function () {
    this.$nextTick(function () {
      // Code that will run only after the
      // entire view has been rendered
      let vm = this

      document.onkeydown = function keydown (e) {
        var keycode = e.keyCode
        // F2 播放暂停
        if (keycode === 113) {
          if (vm.playlist.isPlaying()) {
            vm.waveformPause()
          } else {
            vm.waveformPlay()
          }
        }
      }
      // 打包
      localStorage.clear()
      vm.getTask()
      // 初始化clipboard
      let clipboard = new ClipboardJS('.btn-clipboard')
      clipboard.on('success', function (e) {
        console.info('Action:', e.action)
        console.info('Text:', e.text)
        console.info('Trigger:', e.trigger)
        e.clearSelection()
      })
      clipboard.on('error', function (e) {
        console.error('Action:', e.action)
        console.error('Trigger:', e.trigger)
      })
    })
  },
  methods: {
    waveformInit (notes, src) {
      let vm = this
      vm.index = notes.length
      let actions = [{
        class: 'fa.fa-play',
        action: (annotation, i, annotations, opts) => {
          if (vm.playlist.isPlaying()) {
            vm.playlist.pause()
          } else {
            if (vm.playlist.playbackSeconds > annotation.start && vm.playlist.playbackSeconds < annotation.end) {
              vm.playlist.ee.emit('play', vm.playlist.playbackSeconds, annotation.end)
            } else {
              vm.playlist.ee.emit('play', annotation.start, annotation.end)
            }
          }
        }
      }, {
        class: 'fa.fa-minus',
        action: (annotation, i, annotations, opts) => {
          var next
          var delta = 0.010
          annotation.end -= delta

          if (opts.linkEndpoints) {
            next = annotations[i + 1]
            next && (next.start -= delta)
          }
        }
      }, {
        class: 'fa.fa-plus',
        action: (annotation, i, annotations, opts) => {
          var next
          var delta = 0.010
          annotation.end += delta
          if (opts.linkEndpoints) {
            next = annotations[i + 1]
            next && (next.start += delta)
          }
        }
      }, {
        class: 'fa.fa-trash',
        action: (annotation, i, annotations) => {
          if (annotations.length > 1) {
            annotations.splice(i, 1)
          }
        }
      }]
      let WaveformPlaylist = require('@fanhantech-npm/waveform-playlist')
      let playlist = WaveformPlaylist.init({
        container: document.getElementById('playlist'),
        timescale: true,
        samplesPerPixel: 3072,
        colors: {
          waveOutlineColor: 'white',
          timeColor: 'red',
          fadeColor: 'red'
        },
        annotationList: {
          annotations: notes,
          controls: actions,
          editable: true,
          isContinuousPlay: false,
          linkEndpoints: true
        },
        zoomLevels: [128, 256, 512, 1024, 2048, 3072, 4096, 5120]
      })
      vm.playlist = playlist
      vm.loading = true
      vm.playlist.load([{
        src: src,
        states: {
          cursor: false
        }
      }
      ]).then(function () {
        // can do stuff with the playlist.
        vm.loading = false
      })
      let ee = vm.playlist.getEventEmitter()
      ee.on('timeupdate', vm.updateTime)
    },
    waveformClear () {
      let vm = this
      if (vm.playlist === '') {
        return
      }
      vm.index = 1
      vm.playlist.clear()
    },
    waveformPlay () {
      let vm = this
      let ee = vm.playlist.getEventEmitter()
      ee.emit('play', vm.playlist.playbackSeconds)
    },
    waveformPause () {
      let vm = this
      let ee = vm.playlist.getEventEmitter()
      ee.emit('pause')
    },
    waveformStop () {
      let vm = this
      let ee = vm.playlist.getEventEmitter()
      ee.emit('stop')
    },
    waveformBackward () {
      let vm = this
      let ee = vm.playlist.getEventEmitter()
      ee.emit('rewind')
    },
    waveformForward () {
      let vm = this
      let ee = vm.playlist.getEventEmitter()
      ee.emit('fastforward')
    },
    waveformZoomin () {
      let vm = this
      let ee = vm.playlist.getEventEmitter()
      ee.emit('zoomin')
    },
    waveformZoomout () {
      let vm = this
      let ee = vm.playlist.getEventEmitter()
      ee.emit('zoomout')
    },
    waveformCut () {
      let vm = this
      let playlist = vm.playlist
      let annotations = playlist.annotationList.annotations
      if (annotations[annotations.length - 1].end === playlist.duration) {
        return
      }
      annotations.splice(annotations.length, 0, {
        id: ('00' + (vm.index++)).slice(-3),
        start: annotations[annotations.length - 1].end,
        end: ((annotations[annotations.length - 1].end + 10 < playlist.duration) ? annotations[annotations.length - 1].end + 10 : playlist.duration),
        lines: [''],
        lang: 'zh'
      })
      vm.playlist.annotationList.setupInteractions()
      vm.playlist.drawRequest()
    },
    waveformSave () {
      let vm = this
      let result = []
      vm.playlist.annotationList.annotations.forEach((a, i) => {
        let tmp = {}
        tmp.id = a.id
        tmp.begin = a.start.toFixed(3)
        tmp.end = a.end.toFixed(3)
        tmp.lines = a.lines
        result.push(tmp)
      })
      let value = JSON.stringify(result)
      try {
        localStorage.setItem(vm.storageKey, value)
      } catch (err) {
        vm.$notify.error({
          title: '失败',
          message: '您的浏览器可能不支持暂时保存',
          duration: 2000
        })
        console.log(err)
        return
      }
      if (value !== localStorage.getItem(vm.storageKey)) {
        vm.$notify.error({
          title: '失败',
          message: '您的浏览器可能不支持暂时保存',
          duration: 2000
        })
        return
      }
      vm.$notify.success({
        title: '成功',
        message: '保存成功',
        duration: 2000
      })
    },
    updateTime (time) {
      let vm = this
      vm.currentTime = vm.formatTime(time)
    },
    formatTime (seconds) {
      var minutes, secs, result
      minutes = parseInt(seconds / 60, 10) % 60
      secs = seconds % 60
      secs = secs.toFixed(3)
      result = (minutes < 10 ? '0' + minutes : minutes) + ':' + (secs < 10 ? '0' + secs : secs)
      return result
    },
    getTask () {
      let vm = this
      // get 请求中的url 需要从当前页面的url获取
      let url = '/api/projects/' + projectId + '/task'
      http.get(url)
        .then(function (response) {
          let rsp = response.data
          // console.log(rsp)
          if (rsp.code === 0) {
            // 成功
            vm.question = rsp.questions[0]
            let notes = JSON.parse(vm.question.prev)
            // 更新storageKey
            vm.storageKey = vm.question.id + '-' + vm.question.uuid
            let lastAnswer = localStorage.getItem(vm.storageKey)
            if (lastAnswer !== null) {
              notes = JSON.parse(lastAnswer)
            }
            vm.waveformInit(notes, vm.question.raw)
          } else {
            // 失败
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
    postTask () {
      let vm = this
      let result = []
      let url = '/api/projects/' + projectId + '/task'
      vm.playlist.annotationList.annotations.forEach((a, i) => {
        let tmp = {}
        tmp.id = a.id
        tmp.begin = a.start.toFixed(3)
        tmp.end = a.end.toFixed(3)
        tmp.text = a.lines[0]
        result.push(tmp)
      })
      // post 请求中的url 需要从当前页面的url获取
      http.post(url, {
        id: vm.question.id,
        uuid: vm.question.uuid,
        result: JSON.stringify(result)
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
            localStorage.removeItem(vm.storageKey)
            // 通过refresh页面获取下一个任务
            setTimeout(() => {
              window.location.reload()
            }, 1000)
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

<style scoped>
.ql-container {
  height: 150px;
}
</style>
