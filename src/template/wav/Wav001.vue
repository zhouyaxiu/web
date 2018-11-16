<template>
    <!-- <transition name="el-fade-in">
      <div class="message2" v-show="messageStatus === 2">
        <i class="el-icon-error" v-on:click="closeVoice()"></i> -->
        <div class="container mb-5 content">
          <div class="userinfo clearfix">
            <p class="text-muted float-right" style="margin-bottom：0">{{$t("voiceExample.finish")}}：--</p>
            <p class="font-italic">{{$t("voiceExample.title")}}</p>
          </div>
          <div class="question-title">
          </div>
          <div class="playlist-toolbar">
            <el-button-group>
              <el-button type="warning" size="small" @click="waveformPause">{{$t("voiceExample.pause")}}</el-button>
              <el-button type="primary" size="small" @click="waveformPlay">{{$t("voiceExample.play")}}</el-button>
              <el-button type="info" size="small" @click="waveformStop">{{$t("voiceExample.stop")}}</el-button>

              <div style="display:inline" v-show="businessTypes === 2 || businessTypes === 3">
                <el-button plain size="small" @click="waveformZoomin">{{$t("voiceExample.zoomin")}}</el-button>
                <el-button plain size="small" @click="waveformZoomout">{{$t("voiceExample.zoomout")}}</el-button>
                <el-button plain size="small" @click="waveformCut">{{$t("voiceExample.add")}}</el-button>
              </div>

            </el-button-group>
            <!-- <div style="display:inline" v-if="businessTypes === 2 || businessTypes === 3">
              <el-button type="primary" @click="waveformCut">增加</el-button>
            </div> -->
          </div>
          <div v-show="businessTypes === 2">
            <div class="messageInLab" v-for="(messageLab, messIndex) in tagMutexLabels" :key='messIndex' >
              <span>{{messageLab.title}}:</span>
              <el-tooltip placement="top" v-for="(lab, num) in messageLab.labels" :key='num'>
                <div slot="content">{{lab.content}}</div>
                <el-button class="btn-clipboard" v-bind:data-clipboard-text="'['+lab.name+']'" type="primary" plain size="small">{{lab.name}}</el-button>
              </el-tooltip>
            </div>
            <div class="messageInLab" v-for="(messageLab, messIndex) in tagNormalLabels" :key='messageLab.title + messIndex'>
              <span>{{messageLab.title}}:</span>
              <el-checkbox-group v-model="tagNormalContents">
                <el-checkbox v-for="(tagNormal, index) in messageLab.labels" :key='tagNormal.content' :label="index">{{tagNormal.name}} ({{tagNormal.content}})</el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
          <div v-loading="loading" :element-loading-text="$t('voiceExample.loading')" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)">
            <div id="playlist"></div>
          </div>
          <div v-show="businessTypes === 1" style="margin-top:30px;margin-bottom:30px;">
            <div class="messageInLab" v-for="(messageLab, messIndex) in tagMutexLabels" :key='messageLab.title'>
              <p>{{messIndex+1}}.{{messageLab.title}}:</p>
              <el-radio-group v-model="tagMutexContents[messIndex]" style="display:block">
                <el-radio  v-for="(lab,num) in messageLab.labels" :key='lab.content' :label="num" @change="MutexLabelClick(messIndex,lab,num)">{{lab.name}} ({{lab.content}})</el-radio>
              </el-radio-group>
            </div>
            <div class="messageInLab" v-for="(messageLab, messIndex) in tagNormalLabels" :key='messageLab.title + messIndex'>
              <p>{{messageLab.title}}:</p>
              <el-checkbox-group v-model="tagNormalContents">
                <el-checkbox v-for="(tagNormal, index) in messageLab.labels" :key='tagNormal.content' :label="index">{{tagNormal.name}} ({{tagNormal.content}})</el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
          <div>{{$t("voiceExample.current")}}：{{currentTime}}</div>
          <div v-show="CommentVisible">
            <div>{{$t("voiceExample.editor")}}:</div>
            <div id="editor"></div>
          </div>
          <div class="d-flex justify-content-end">
            <el-button type="success" @click="postTask">{{$t("voiceExample.save")}}</el-button>
          </div>
        </div>
      <!-- </div>
    </transition> -->
</template>
<script>
import Quill from 'quill'
import $ from 'jquery'
import ClipboardJS from 'clipboard'
import {language} from 'lang'

export default {
  name: 'app',
  props: {
    // messageStatus: '',
    tagMutexLabels: Array,
    tagNormalLabels: Array
  },
  data () {
    return {
      // 音频参数
      projectid: '',
      // 1 标记，2 翻译， 切割
      businessTypes: {
        type: Number,
        default: 2
      },
      loading: false,
      currentTime: '00:00.000',
      index: 1,
      WaveformPlaylist: '',
      playlist: '',
      // question: {},
      storageKey: '',
      actions: [],
      actionsNormal: [],
      actionsCut: [],
      textEditable: true,
      quill: {},
      CommentVisible: false,
      tagMutexContents: [],
      tagNormalContents: []
    }
  },
  updated: function () {
    if (this.businessTypes === 1) {
      $('.annotations').hide()
    } else {
      $('.annotations').show()
    }
  },
  mounted: function () {
    // console.log('child mounted')
    var vm = this
    this.$nextTick(function () {
      let clipboard = new ClipboardJS('.btn-clipboard')
      clipboard.on('success', function (e) {
        // console.info('Action:', e.action)
        // console.info('Text:', e.text)
        // console.info('Trigger:', e.trigger)
        e.clearSelection()
      })
      clipboard.on('error', function (e) {
        // console.error('Action:', e.action)
        // console.error('Trigger:', e.trigger)
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

    vm.actionsNormal = [
      {
        class: 'fa.fa-play',
        action: (annotation, i, annotations, opts) => {
          if (vm.playlist.isPlaying()) {
            vm.playlist.pause()
          } else {
            if (
              vm.playlist.playbackSeconds > annotation.start &&
              vm.playlist.playbackSeconds < annotation.end
            ) {
              vm.playlist.ee.emit(
                'play',
                vm.playlist.playbackSeconds,
                annotation.end
              )
            } else {
              vm.playlist.ee.emit('play', annotation.start, annotation.end)
            }
          }
        }
      },
      {
        class: 'fa.fa-minus',
        action: (annotation, i, annotations, opts) => {
          var next
          var delta = 0.01
          annotation.end -= delta

          if (opts.linkEndpoints) {
            next = annotations[i + 1]
            next && (next.start -= delta)
          }
        }
      },
      {
        class: 'fa.fa-plus',
        action: (annotation, i, annotations, opts) => {
          var next
          var delta = 0.01
          annotation.end += delta
          if (opts.linkEndpoints) {
            next = annotations[i + 1]
            next && (next.start += delta)
          }
        }
      },
      {
        class: 'fa.fa-trash',
        action: (annotation, i, annotations) => {
          if (annotations.length > 1) {
            annotations.splice(i, 1)
          }
        }
      }
    ]

    vm.actionsCut = [
      {
        class: 'fa.fa-check',
        action: (annotation, i, annotations, opts) => {
          annotation.lines = [`</${language('voiceExample.js.valid')}>`]
        }
      },
      {
        class: 'fa.fa-close',
        action: (annotation, i, annotations, opts) => {
          annotation.lines = [`</${language('voiceExample.js.noValid')}>`]
        }
      },
      {
        class: 'fa.fa-play',
        action: (annotation, i, annotations, opts) => {
          if (vm.playlist.isPlaying()) {
            vm.playlist.pause()
          } else {
            if (
              vm.playlist.playbackSeconds > annotation.start &&
              vm.playlist.playbackSeconds < annotation.end
            ) {
              vm.playlist.ee.emit(
                'play',
                vm.playlist.playbackSeconds,
                annotation.end
              )
            } else {
              vm.playlist.ee.emit('play', annotation.start, annotation.end)
            }
          }
        }
      },
      {
        class: 'fa.fa-minus',
        action: (annotation, i, annotations, opts) => {
          var next
          var delta = 0.01
          annotation.end -= delta

          if (opts.linkEndpoints) {
            next = annotations[i + 1]
            next && (next.start -= delta)
          }
        }
      },
      {
        class: 'fa.fa-plus',
        action: (annotation, i, annotations, opts) => {
          var next
          var delta = 0.01
          annotation.end += delta
          if (opts.linkEndpoints) {
            next = annotations[i + 1]
            next && (next.start += delta)
          }
        }
      },
      {
        class: 'fa.fa-trash',
        action: (annotation, i, annotations) => {
          if (annotations.length > 1) {
            annotations.splice(i, 1)
          }
        }
      }
    ]

    vm.actions = vm.actionsNormal
  },
  methods: {
    MutexLabelClick (messIndex, lab, num) {
      // console.log(messIndex, lab, num)
      // this.tagMutexContents[messIndex] = num;
      // this.myRadio[messIndex] = num;
      // console.log(this.tagMutexContents)
    },
    voiceErrorOpen () {
      this.$message.error(language('voiceExample.js.errVoice'))
    },
    // closeVoice () {
    //   this.$parent.messageStatus = 1
    //   this.waveformStop()
    //   this.clearAll()
    // },
    // 是否打开评论框
    changeCheckMode (visible) {
      this.CommentVisible = visible
      // console.log('changeCheckMode:', visible)
    },
    changeBusinessMode (businessMode) {
      businessMode = arguments[0] ? arguments[0] : 0
      let vm = this
      // console.log('changeBusinessMode', businessMode)
      if (businessMode > 0) {
        if (businessMode === 3) {
          vm.actions = vm.actionsCut
          vm.textEditable = false
        } else {
          vm.actions = vm.actionsNormal
          vm.textEditable = true
        }

        vm.businessTypes = Number(businessMode)
        // console.log('businessTypes:', vm.businessTypes)
      }
    },
    clearAll () {
      let vm = this
      let playlist = vm.playlist
      this.waveformClear()
      // 清空条目
      let annotations = playlist.annotationList.annotations
      // console.log(annotations)
      annotations.splice(0, annotations.length)
    },
    sleep () {
      var start = new Date().getTime()
      while (true) {
        if (new Date().getTime() - start > 1000) {
          break
        }
      }
    },
    voiceLoad (src, result, commit) {
      let notes = []
      let vm = this
      // console.log('voiceLoad:', src, result, commit)

      if (vm.businessTypes === 1) {
        // console.log('load:', vm.businessTypes)
        this.tagMutexContents = []
        this.tagNormalContents = []

        notes = [{ id: '000', begin: '0.000', end: '1.000' }]
        if (result && result.length >= 2) {
          vm.tagMutexContents = $.extend(true, [], result[0])
          vm.tagNormalContents = $.extend(true, [], result[1])
        }
      } else if (vm.businessTypes === 2 || vm.businessTypes === 3) {
        if (!result || result.length === 0) {
          notes = [{ id: '000', begin: '0.000', end: '1.000' }]
        } else {
          notes = result
        }
      }
      // console.log('notes:', notes)

      if (commit) {
        vm.quill.setText(commit)
      } else {
        vm.quill.setText('')
      }
      let playlist = vm.playlist
      if (playlist === '') {
        this.waveformInit(notes, src)
        return
      }

      this.waveformClear()
      // // 清空条目
      let annotations = playlist.annotationList.annotations
      // console.log(annotations)
      annotations.splice(0, annotations.length)

      vm.loading = true
      vm.playlist
        .load([
          {
            src: src,
            states: {
              cursor: false
            }
          }
        ])
        .then(function () {
          vm.loading = false
        })

      // [zzf] 反复开关这个子组件，会有错误提示，实际是正常的
      // 加载超过10秒弹出错误提示
      // setTimeout(function () {
      //   if (vm.loading) {
      //     console.log('加载失败')
      //     vm.voiceErrorOpen()
      //   }
      // }, 10000)

      var x = 0
      for (x in notes) {
        annotations.push({
          id: ('00' + x).slice(-3),
          start: Number(notes[x].begin),
          end: Number(notes[x].end),
          lines: [notes[x].text],
          lang: 'zh'
        })
      }

      playlist.annotationList.annotations = annotations
      vm.index = notes.length

      // console.log(playlist.annotationList.annotations)

      let resizeHandlers = vm.playlist.annotationList.resizeHandlers
      resizeHandlers.splice(0, resizeHandlers.length)

      vm.playlist.annotationList.setupInteractions()

      vm.playlist.drawRequest()
    },
    // 音频模板
    waveformInit (notes, src) {
      let vm = this
      vm.index = notes.length

      // console.log('waveformInit, notes:', notes)
      var x = 0
      var annotations = []
      for (x in notes) {
        annotations.push({
          id: ('00' + x).slice(-3),
          begin: Number(notes[x].begin),
          end: Number(notes[x].end),
          lines: [notes[x].text],
          lang: 'zh'
        })
      }

      // console.log(annotations)

      let WaveformPlaylist = require('@fanhantech-npm/waveform-playlist')

      document.getElementById('playlist').innerHTML = ''

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
          annotations: annotations,
          controls: vm.actions,
          editable: vm.textEditable,
          isContinuousPlay: false,
          linkEndpoints: true
        },
        zoomLevels: [128, 256, 512, 1024, 2048, 3072, 4096, 5120]
      })
      vm.playlist = playlist
      vm.loading = true
      // console.log(src, notes)

      vm.playlist
        .load([
          {
            src: src,
            states: {
              cursor: false
            }
          }
        ])
        .then(function () {
          vm.loading = false
        })

      // [zzf] 反复打开关闭子组件，这里有bug
      // 加载超过10秒弹出错误提示
      // setTimeout(function () {
      //   if (vm.loading) {
      //     console.log('加载失败')
      //     vm.voiceErrorOpen()
      //   }
      // }, 10000)

      // 拖动条清空
      let resizeHandlers = vm.playlist.annotationList.resizeHandlers
      resizeHandlers.splice(0, resizeHandlers.length)

      // 设置拖动条
      vm.playlist.annotationList.setupInteractions()
      vm.playlist.drawRequest()

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
    waveformDesctroy () {
      // console.group('waveformDesctroy')
      // console.log(this.playlist)
      // console.groupEnd()
      if (this.playlist === '') {
        return
      }
      if (this.playlist.ac === '') {
        return
      }
      this.playlist.ac.close()
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
      annotations.push({
        id: ('00' + vm.index++).slice(-3),
        start: annotations[annotations.length - 1].end,
        end:
          annotations[annotations.length - 1].end + 10 < playlist.duration
            ? annotations[annotations.length - 1].end + 10
            : playlist.duration,
        lines: [''],
        lang: 'zh'
      })

      // console.log('annotations', annotations)
      // console.groupEnd()
      // 先清空再重建，先这样吧，可以不修改源码，直接添加需要修改源码，或者引用他的lib自己创建
      let resizeHandlers = vm.playlist.annotationList.resizeHandlers
      resizeHandlers.splice(0, resizeHandlers.length)
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
          title: language('voiceExample.js.error'),
          message: language('voiceExample.js.errMessage'),
          duration: 2000
        })
        console.log(err)
        return
      }
      if (value !== localStorage.getItem(vm.storageKey)) {
        vm.$notify.error({
          title: language('voiceExample.js.error'),
          message: language('voiceExample.js.errMessage'),
          duration: 2000
        })
        return
      }
      vm.$notify.success({
        title: language('voiceExample.js.success'),
        message: language('voiceExample.js.sucMessage'),
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
      result =
        (minutes < 10 ? '0' + minutes : minutes) +
        ':' +
        (secs < 10 ? '0' + secs : secs)
      return result
    },
    postTask () {
      let vm = this
      let result = []

      // console.log(vm.businessTypes)
      if ((vm.businessTypes === 2) || (vm.businessTypes === 3)) {
        vm.playlist.annotationList.annotations.forEach((a, i) => {
          let tmp = {}
          tmp.id = a.id
          tmp.begin = a.start.toFixed(3)
          tmp.end = a.end.toFixed(3)
          tmp.text = a.lines[0]
          result.push(tmp)
        })
      } else if (vm.businessTypes === 1) {
        result = [vm.tagMutexContents, vm.tagNormalContents]
        // console.log('result:', result)
      }
      let params = {
        result: result.concat(),
        commit: vm.quill.getText()
      }
      this.$emit('postTask', params)
    }
  }
}
</script>
<style>
.content {
  flex: 1 0 auto;
}
.ql-container {
  height: 150px;
}
/* .message2 {
  background: #fff;
  position: fixed;
  top: 3rem;
  left: 4rem;
  right: 4rem;
  bottom: 5rem;
  min-width: 320px;
  z-index: 1050;
  overflow: auto;
  border-radius: 0.5rem 0 0 0.5rem;
  box-shadow: 0 2px 52px 0 rgba(0, 0, 0, 0.5);
  border: 1px solid #ebeef5;
}
.message2 .mb-5 {
  padding-top: 2rem;
}
.message2 > i {
  position: absolute;
  cursor: pointer;
  font-size: 24px;
  right: 0.8rem;
  top: 0.8rem;
  color: #d1d4dc;
  z-index: 1050;
}
.messageInLab {
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}
.messageInLab > span {
  padding-right: 0.3rem;
  color: #777;
  letter-spacing: 2px;
  font-size: 14px;
} */
span.annotation-lines {
  width: 100%;
  border: 1px solid #ccc;
}
span.annotation-actions {
  width: 220px !important;
}
</style>
