<template>
<div class="main">
  <Header/>
  <div class="container mb-5">
    <!-- <div class="userinfo clearfix">
      <p class="text-muted float-right">今日完成：--</p>
    </div> -->
    <div class="question-title">
      <p class="font-italic">{{$t("task3Do.title")}}{{question.raw}}</p>
    </div>
    <div class="workbench">
      <Wave ref="audio"/>
    </div>
    <div class="action d-flex justify-content-end">
      <el-button type="danger" plain @click="invalidTask">{{$t("task3Do.invalidTask")}}</el-button>
      <el-button type="primary" @click="submitTask">{{$t("taskPublic.submitTask")}}</el-button>
    </div>
  </div>
  <Footer/>
</div>
</template>

<script>
import Header from 'components/header'
import Footer from 'components/footer'
import Wave from './wave'
import axios from 'axios'
import $ from 'jquery'
import {language} from 'lang'

var projectId = document.location.pathname.split('/')[2]
var url = '/api/projects/' + projectId + '/task'
var http = axios.create({
  headers: {'X-Xsrftoken': $('meta[name=_xsrf]').attr('content')}
})

export default {
  name: 'app',
  components: {
    Header,
    Footer,
    Wave
  },
  data () {
    return {
      audio: '',
      projectid: '',
      question: {}
    }
  },
  mounted: function () {
    this.$nextTick(function () {
      // Code that will run only after the
      // entire view has been rendered
      this.audio = this.$refs['audio']
      // this.audio.waveLoad('https://s301.fanhantech.com/waa001/0264fde98e8743346c591e6b16953451_00000000.wav')
      this.getTask()
    })
  },
  methods: {
    getTask () {
      var vm = this
      http.get(url)
        .then(function (response) {
          var rsp = response.data
          if (rsp.code === 0) {
            vm.question = rsp.questions[0]
            // var prev = JSON.parse(vm.question.prev)
            // var prevNew = []
            // for (var i = 0, len = prev.length; i < len; i++) {
            //   var tmp = {}
            //   tmp.start = Number(prev[i].begin)
            //   tmp.end = Number(prev[i].end)
            //   prevNew.push(tmp)
            // }
            vm.audio.waveLoad(vm.question.raw)
            // vm.audio.regionLoad(prevNew)
          } else {
            vm.notify('error', rsp.message, 2000)
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    checkData () {
      var msg = language('task3Do.appNotify1')
      var regions = this.audio.wavesurfer.regions.list
      var regionsLength = regions.length
      // 至少有一段
      if (regionsLength < 1) {
        this.notify('error', msg + language('task3Do.appNotify2'), 2000)
        return false
      }
      // 保证起始位置在0.000
      if (regions[0].start.toFixed(3) !== '0.000') {
        this.notify('error', msg + language('task3Do.appNotify3'), 2000)
        return false
      }
      // 保证末尾位置在最后
      if (regions[regionsLength - 1].end.toFixed(3) !== this.audio.wavesurfer.getDuration().toFixed(3)) {
        this.notify('error', msg + language('task3Do.appNotify4'), 2000)
        return false
      }
      // 保证每段首尾相接
      for (var i = 0; i < regionsLength - 1; i++) {
        var end = regions[i].end.toFixed(3)
        var start = regions[i + 1].start.toFixed(3)
        if (end !== start) {
          this.notify('error', msg + ',' + (i + 1) + language('task3Do.add') + (i + 2) + language('task3Do.appNotify5'), 2000)
          return false
        }
      }
      // 保证每段内容完整
      for (i = 0; i < regionsLength; i++) {
        if ((regions[i].data.valid === true) && (regions[i].data.role === '' || regions[i].data.note === '')) {
          regions[i].color = 'rgba(201, 61, 24, 0.15)'
          regions[i].updateRender()
          this.notify('error', msg + '，' + (i + 1) + language('task3Do.appNotify6'), 2000)
          return false
        }
      }
      return true
    },
    submitTask () {
      var vm = this
      var result = []
      if (!this.checkData()) {
        return
      }
      vm.audio.wavesurfer.regions.list.forEach((region, index) => {
        var tmp = {}
        tmp.id = index.toString()
        tmp.start = region.start.toFixed(3)
        tmp.end = region.end.toFixed(3)
        tmp.valid = region.data.valid
        tmp.role = region.data.role
        tmp.note = region.data.note
        result.push(tmp)
      })
      vm.post(result)
    },
    invalidTask () {
      var vm = this
      var result = []
      var tmp = {}
      tmp.id = '0'
      tmp.start = (0.000).toFixed(3)
      tmp.end = vm.audio.wavesurfer.getDuration().toFixed(3)
      tmp.valid = false
      result.push(tmp)
      vm.post(result)
    },
    post (result) {
      var vm = this
      http.post(url, {
        id: vm.question.id,
        uuid: vm.question.uuid,
        result: JSON.stringify(result)
      })
        .then(function (response) {
          var rsp = response.data
          // console.log(rsp)
          if (rsp.code === 0) {
            vm.notify('success', rsp.message, 2000)
            // 通过refresh页面获取下一个任务
            setTimeout(() => {
              window.location.reload()
            }, 1000)
          } else {
            vm.notify('error', rsp.message, 2000)
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    notify (type, message, duration) {
      if (type === 'success') {
        this.$notify.success({
          title: language('taskPublic.success'),
          message: message,
          duration: duration
        })
      } else if (type === 'warning') {
        this.$notify.warning({
          title: language('taskPublic.warning'),
          message: message,
          duration: duration
        })
      } else if (type === 'error') {
        this.$notify.error({
          title: language('taskPublic.error'),
          message: message,
          duration: duration
        })
      }
    }
  }
}
</script>

<style>
.btn-sm {
  font-size: 0.75rem;
}
/* region{
  border-style: dashed;
  border-width: 1.2px;
  border-color: #000000;
  box-sizing: border-box;
}
handle {
  background: grey;
  opacity: 0.3;
} */
/* .reginRow{
  margin: 1.3rem 0;
}
.el-radio-button__inner {
  margin-left: 15px;
  border: 1px solid #d8dce6;
}

.active{
  background-color: red;
}
.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
} */
.mx-auto{
  margin-top: 1rem;
  margin-bottom: 1rem;
}
.annotation{
  margin-bottom: 2rem;
  margin-top:.3rem;
}

</style>
