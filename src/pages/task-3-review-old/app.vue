<template>
<div class="main">
  <Header/>
  <div class="container mb-5 content">
    <div class="userinfo clearfix">
      <p class="text-muted float-right" style="margin-bottom：0">{{$t("taskPublic.finish")}}：--</p>
      <p class="font-italic">{{$t("task3Do.title")}}</p>
    </div>
    <div class="question-title">
    </div>
    <div class="playlist-toolbar">
      <el-button-group>
        <el-button type="warning" size="small" @click="waveformPause">{{$t("taskPublic.pause")}}</el-button>
        <el-button type="success" size="small" @click="waveformPlay">{{$t("taskPublic.play")}}</el-button>
        <el-button type="danger" size="small" @click="waveformStop">{{$t("taskPublic.stop")}}</el-button>
        <!--el-button type="success" size="small" class="fa fa-fast-backward" @click="waveformBackward"></el-button-->
        <!--el-button type="success" size="small" class="fa fa-fast-forward" @click="waveformForward"></el-button-->
        <el-button size="small" @click="waveformZoomin">{{$t("taskPublic.zoomin")}}</el-button>
        <el-button size="small" @click="waveformZoomout">{{$t("taskPublic.zoomout")}}</el-button>
      </el-button-group>
      <el-button-group>
        <el-button type="info" size="small" class="btn-clipboard" data-clipboard-text="<STA/>">{{$t("task3Do.STA")}}</el-button>
        <el-button type="info" size="small" class="btn-clipboard" data-clipboard-text="<NON/>">{{$t("task3Do.NON")}}</el-button>
        <el-button type="info" size="small" class="btn-clipboard" data-clipboard-text="<FIL/>">{{$t("task3Do.FIL")}}</el-button>
        <el-button type="info" size="small" class="btn-clipboard" data-clipboard-text="<RSP/>">{{$t("task3Do.RSP")}}</el-button>
        <el-button type="info" size="small" class="btn-clipboard" data-clipboard-text="<SPK/>">{{$t("task3Do.SPK")}}</el-button>
        <el-button type="info" size="small" class="btn-clipboard" data-clipboard-text="<NPS/>">{{$t("task3Do.NPS")}}</el-button>
        <el-button type="info" size="small" class="btn-clipboard" data-clipboard-text="**">{{$t("task3Do.deafness")}}</el-button>
        <el-button type="info" size="small" class="btn-clipboard" data-clipboard-text="<无效>">{{$t("taskPublic.noValid")}}</el-button>
      </el-button-group>
      <el-button type="primary" @click="waveformCut">{{$t("taskPublic.add")}}</el-button>
    </div>
    <div v-loading="loading" :element-loading-text="$t('taskPublic.loading')" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)">
      <div id="playlist"></div>
    </div>
    <div>{{$t("task3Do.current")}}：{{currentTime}}</div>
    <!-- Create the editor container -->
    <div v-show="reviewCommentVisible">
      <div id="editor"></div>
    </div>
    <div class="d-flex justify-content-end">
      <el-button type="danger" @click="rejectTask">{{$t("taskPublic.rejectTask")}}</el-button>
      <el-button type="success" @click="acceptTask">{{$t("taskPublic.acceptTask")}}</el-button>
      <el-button type="warning" @click="reviseAndAcceptTask">{{$t("taskPublic.reviseAndAccept")}}</el-button>
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
import Quill from 'quill'
import ClipboardJS from 'clipboard'
import {language} from 'lang'

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
      reviewCommentVisible: false,
      reason: '',
      currentTime: '00:00.000',
      index: 1,
      WaveformPlaylist: '',
      playlist: '',
      question: {},
      quill: {}
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
      // 初始化编辑器
      vm.quill = new Quill('#editor', {
        placeholder: '请输入...',
        modules: {
          toolbar: ['bold', 'italic', 'underline', 'strike']
        },
        theme: 'snow'
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
      let url = '/api/projects/' + projectId + '/task/review' + window.location.search
      http.get(url)
        .then(function (response) {
          let rsp = response.data
          // console.log(rsp)
          if (rsp.code === 0) {
            // 成功
            vm.question = rsp.questions[0]
            let notes = JSON.parse(vm.question.prev)
            // 数据序列化
            let notesNew = []
            for (var i = 0, len = notes.length; i < len; i++) {
              var tmp = {}
              tmp.id = notes[i].id
              tmp.begin = notes[i].begin
              tmp.end = notes[i].end
              tmp.lines = [notes[i].text]
              notesNew.push(tmp)
            }
            notes = notesNew
            vm.waveformInit(notes, vm.question.raw)
          } else {
            // 失败
            vm.$notify.error({
              title: language('taskPublic.error'),
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
      let vm = this
      let url = '/api/projects/' + projectId + '/task/review' + window.location.search
      http.post(url, {
        accept: true,
        comment: language('taskPublic.acceptTask')
      })
        .then(function (response) {
          let rsp = response.data
          // console.log(rsp)
          if (rsp.code === 0) {
            vm.$notify.success({
              title: language('taskPublic.success'),
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
              title: language('taskPublic.error'),
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
      let vm = this
      if (vm.reviewCommentVisible === false) {
        vm.reviewCommentVisible = true
        return
      }
      vm.reason = vm.quill.getText()
      let url = '/api/projects/' + projectId + '/task/review' + window.location.search
      http.post(url, {
        accept: false,
        comment: vm.reason
      })
        .then(function (response) {
          let rsp = response.data
          // console.log(rsp)
          if (rsp.code === 0) {
            vm.$notify.success({
              title: language('taskPublic.success'),
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
              title: language('taskPublic.error'),
              message: rsp.message,
              duration: 2000
            })
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    reviseAndAcceptTask () {
      let vm = this
      let url = '/api/projects/' + projectId + '/task/revise' + window.location.search
      let result = []
      vm.playlist.annotationList.annotations.forEach((a, i) => {
        let tmp = {}
        tmp.id = a.id
        tmp.begin = a.start.toFixed(3)
        tmp.end = a.end.toFixed(3)
        tmp.text = a.lines[0]
        result.push(tmp)
      })
      http.post(url, {
        id: vm.question.id,
        uuid: vm.question.uuid,
        result: JSON.stringify(result)
      })
        .then(function (response) {
          let rsp = response.data
          // console.log(rsp)
          if (rsp.code === 0) {
            vm.acceptTask()
          } else {
            vm.$notify.error({
              title: language('taskPublic.error'),
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
