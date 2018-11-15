<template>
<div class="wavesufer">
  <div class="waveform"
    v-loading="waveLoading"
    :element-loading-text="$t('taskPublic.loading')"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)">
    <p class="text-center text-secondary">{{formatRegionTime}}</p>
    <div id="waveform"></div>
    <div id="waveform-timeline"></div>
    <div id="waveform-timeprogress" >
      <div class="float-left">{{waveCurrent}}</div>
      <div class="float-right">{{waveDuration}}</div>
    </div>
  </div>
  <div id="waveform-control" class="row">
    <div class="mx-auto">
      <el-button-group>
        <el-button type="primary" size="small" @click="wavePlayPause">{{playPauseButton}}(F1)</el-button>
        <el-button type="primary" size="small" @click="waveStop">{{$t("taskPublic.stop")}}</el-button>
        <el-button type="primary" size="small" @click="waveZoomOut">{{$t("taskPublic.zoomout")}}(-)</el-button>
        <el-button type="primary" size="small" @click="waveZoomIn">{{$t("taskPublic.zoomin")}}(+)</el-button>
        <el-button type="primary" size="small" @click="waveCut">{{$t("taskPublic.cut")}}(Alt+c)</el-button>
        <el-button type="primary" size="small" @click="regionPlay">{{$t("taskPublic.regionPlay")}}(F2)</el-button>
        <el-button type="primary" size="small" @click="regionDelete">{{$t("taskPublic.regionDelete")}}</el-button>
      </el-button-group>
      <el-select size="small" v-model="playRateValue" @change="wavePlayRate" style="width:75px">
        <el-option v-for="option in playRateOptions" :key="option.value" :label="option.label" :value="option.value"></el-option>
      </el-select>
    </div>
  </div>
  <div id="waveform-annotation">
    <el-form ref="region" :model="region">
      <el-form-item :label="$t('task3Do.region')" style="margin-bottom:0px">
         <el-radio-group v-model="region.data.valid">
          <el-radio :label="true">{{$t("taskPublic.valid")}}</el-radio>
          <el-radio :label="false">{{$t("taskPublic.noValid")}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <div class="row mb-2">
        <div class="col-md-1 pr-1">
          <el-form-item style="margin-bottom:0px">
            <el-input v-model="region.data.role" @change="regionUpdateLabel" :placeholder="$t('task3Do.role')" tabindex="1" :disabled="!region.data.valid" autofocus></el-input>
          </el-form-item>
        </div>
        <div class="col-md-11 pl-1">
          <div class="waveform-label ">
            <el-button-group>
              <el-button plain size="mini" style="padding-left:7px;padding-right:7px" @click="regionInsertTag('<STA/>')">{{$t("task3Do.STA")}}&lt;STA/&gt;</el-button>
              <el-button plain size="mini" style="padding-left:7px;padding-right:7px" @click="regionInsertTag('<NON/>')">{{$t("task3Do.NON")}}&lt;NON/&gt;</el-button>
              <el-button plain size="mini" style="padding-left:7px;padding-right:7px" @click="regionInsertTag('<FIL/>')">{{$t("task3Do.FIL")}}&lt;FIL/&gt;</el-button>
              <el-button plain size="mini" style="padding-left:7px;padding-right:7px" @click="regionInsertTag('<RSP/>')">{{$t("task3Do.RSP")}}&lt;RSP/&gt;</el-button>
              <el-button plain size="mini" style="padding-left:7px;padding-right:7px" @click="regionInsertTag('<SPK/>')">{{$t("task3Do.SPK")}}&lt;SPK/&gt;</el-button>
              <el-button plain size="mini" style="padding-left:7px;padding-right:7px" @click="regionInsertTag('<NPS/>')">{{$t("task3Do.NPS")}}&lt;NPS/&gt;</el-button>
              <!-- <el-button plain size="mini" style="padding-left:7px;padding-right:7px" @click="regionInsertTag('**')">听不清**</el-button> -->
              <!-- <el-button type="info" size="mini" style="padding-left:7px;padding-right:7px" @click="regionInsertTag('<无效>')">无效&lt;无效&gt;</el-button> -->
            </el-button-group>
          </div>
          <el-form-item>
            <el-input id="region-note" type="textarea" :autosize="{ minRows: 4, maxRows: 6}" v-model="region.data.note" :placeholder="$t('task3Do.please')" tabindex="2" :disabled="!region.data.valid"></el-input>
          </el-form-item>
        </div>
      </div>
    </el-form>
  </div>
</div>
</template>

<script>
import WaveSurfer from '@fanhantech-npm/wavesurfer.js'
import RegionsPlugin from '@fanhantech-npm/wavesurfer.js/dist/plugin/wavesurfer.regions.min.js'
import TimelinePlugin from '@fanhantech-npm/wavesurfer.js/dist/plugin/wavesurfer.timeline.min.js'
import $ from 'jquery'
import * as Region from './region.js'
import * as util from './util.js'
import {language} from 'lang'

export default {
  name: 'app',
  data () {
    return {
      wavesurfer: {},
      waveLoading: true,
      waveCurrent: '00:00.000',
      waveDuration: '00:00.000',
      waveZoomValue: 20,
      waveValidity: language('taskPublic.valid'),
      playPauseButton: language('taskPublic.play'),
      playRateValue: '1.0',
      playRateOptions: [
        {label: 'x0.7', value: '0.7'},
        {label: 'x0.8', value: '0.8'},
        {label: 'x0.9', value: '0.9'},
        {label: 'x1.0', value: '1.0'},
        {label: 'x1.1', value: '1.1'},
        {label: 'x1.2', value: '1.2'},
        {label: 'x1.5', value: '1.5'}
      ],
      projectid: '',
      question: {},
      regionActive: false,
      region: {
        start: '',
        end: '',
        data: {
          valid: true,
          role: '',
          note: ''
        }
      }
    }
  },
  mounted: function () {
    this.$nextTick(function () {
      // Code that will run only after the
      // entire view has been rendered
      this.waveInit()
      this.keyMapInit()
    })
  },
  watch: {
    regionActive: function () {
      $('#waveform-annotation').css('opacity', '1')
    }
  },
  computed: {
    formatStart () {
      return util.formatTime(this.region.start)
    },
    formatEnd () {
      return util.formatTime(this.region.end)
    },
    formatRegionTime () {
      var time = '-'
      if (this.region.start !== '') {
        time = util.formatTime(this.region.start) + '  ' + util.formatTime(this.region.end)
      }
      return time
    }
  },
  methods: {
    waveInit () {
      this.wavesurfer = WaveSurfer.create({
        container: '#waveform',
        waveColor: 'skyblue',
        // progressColor: '#3B8686',
        progressColor: 'skyblue',
        cursorColor: 'darkorange',
        // barWidth: 2,
        barHeight: 1.5,
        scrollParent: true,
        autoCenter: false,
        plugins: [
          TimelinePlugin.create({
            container: '#waveform-timeline'
          }),
          RegionsPlugin.create({
            dragSelection: false
          })
        ]
      })
      // bind event
      this.wavesurfer.on('ready', () => {
        this.waveLoading = false
        this.wavesurfer.disableDragSelection()
        this.waveDuration = util.formatTime(this.wavesurfer.getDuration())
        this.waveZoomValue = Math.round(this.wavesurfer.drawer.getWidth() / this.wavesurfer.getDuration() / this.wavesurfer.params.pixelRatio)
        this.wavesurfer.addRegion({ start: 0, end: this.wavesurfer.getDuration() })
      })
      this.wavesurfer.on('audioprocess', (time) => {
        this.waveCurrent = util.formatTime(time)
      })
      this.wavesurfer.on('seek', (progress) => {
        // this.waveCurrent = util.formatTime(this.wavesurfer.getDuration() * progress)
        this.waveCurrent = util.formatTime(this.wavesurfer.getCurrentTime())
      })
      this.wavesurfer.on('play', () => {
        this.playPauseButton = language('taskPublic.pause')
      })
      this.wavesurfer.on('pause', () => {
        this.playPauseButton = language('taskPublic.play')
      })
      this.wavesurfer.on('region-created', Region.created)
      this.wavesurfer.on('region-updated', Region.updated)
      this.wavesurfer.on('region-remove-end', Region.removeEnd)
      this.wavesurfer.on('region-click', (region) => {
        console.log('region-click')
        this.region = region
        this.regionHighlight(region)
      })
      // this.wavesurfer.on('region-updated', (region) => {
      //   this.region = region
      //   this.regionHighlight(region)
      // })
    },
    waveLoad (url) {
      this.waveLoading = true
      this.wavesurfer.load(url)
    },
    wavePlayPause () {
      this.wavesurfer.playPause()
    },
    waveStop () {
      this.wavesurfer.stop()
    },
    waveZoomIn () {
      if (this.waveZoomValue < 200) {
        this.waveZoomValue += 2
        this.wavesurfer.zoom(this.waveZoomValue)
      } else {
        this.notify('warning', language('task3Do.waveNotify1'), 2000)
      }
    },
    waveZoomOut () {
      var parentWidth = this.wavesurfer.drawer.getWidth()
      var waveWidth = Math.round(this.wavesurfer.getDuration() * this.wavesurfer.params.minPxPerSec * this.wavesurfer.params.pixelRatio)
      if (this.waveZoomValue > 0 && waveWidth > parentWidth) {
        this.waveZoomValue -= 2
        this.wavesurfer.zoom(this.waveZoomValue)
      } else {
        this.notify('warning', language('task3Do.waveNotify2'), 2000)
      }
    },
    wavePlayRate () {
      this.wavesurfer.setPlaybackRate(this.playRateValue)
    },
    waveCut () {
      var regions = this.wavesurfer.regions.list
      var region = this.wavesurfer.getCurrentRegion()
      var index = regions.indexOf(region)
      var currentTime = this.wavesurfer.getCurrentTime()
      // 更新当前 region
      region.end = currentTime
      region.updateRender()
      // 插入新 region
      var endTime = this.wavesurfer.getDuration()
      if (index < regions.length - 1) {
        endTime = regions[index + 1].start
      }
      this.wavesurfer.insertRegion(index + 1, {
        start: currentTime,
        end: endTime
      })
    },
    regionLoad (regions) {
      this.wavesurfer.on('ready', () => {
        regions.forEach((region) => {
          this.wavesurfer.addRegion(region)
        })
      })
    },
    regionUpdateLabel () {
      if (this.region.attributes) {
        this.region.attributes.label = this.region.data.role
        this.region.updateRender()
      }
    },
    regionHighlight (curr) {
      console.log('region-highlight')
      this.wavesurfer.regions.list.forEach((region, index) => {
        if (region.id === curr.id) {
          if (region.color !== 'rgba(0, 0, 0, 0.1)') {
            region.color = 'rgba(0, 0, 0, 0.1)'
            region.updateRender()
            this.regionActive = true
          }
        } else {
          if (region.color === 'rgba(0, 0, 0, 0.1)') {
            region.color = 'rgba(0, 0, 0, 0.0)'
            region.updateRender()
          }
        }
      })
    },
    regionPlay () {
      if (this.region.play) {
        this.region.play()
      }
    },
    regionDelete () {
      if (this.wavesurfer.regions.list.length <= 1) {
        return
      }
      if (this.region.remove) {
        this.region.remove()
        this.region = {
          start: '',
          end: '',
          data: {
            role: '',
            note: ''
          }
        }
      }
    },
    regionInsertTag (value) {
      var field = document.getElementById('region-note')
      if (document.selection) {
        // IE Support
        field.focus()
        var selectRange = document.selection.createRange()
        selectRange.text = value
        field.focus()
      } else if (field.selectionStart || field.selectionStart === '0') {
        // Firefox support
        var startPos = field.selectionStart
        var endPos = field.selectionEnd
        var scrollTop = field.scrollTop
        field.value = field.value.substring(0, startPos) + value + field.value.substring(endPos, field.value.length)
        field.focus()
        field.selectionStart = startPos + value.length
        field.selectionEnd = startPos + value.length
        field.scrollTop = scrollTop
      } else {
        field.value += value
        field.focus()
      }
      this.region.data.note = field.value
    },
    keyMapInit () {
      var vm = this
      var map = {
        'F1': vm.wavePlayPause,
        'F2': vm.regionPlay
      }
      document.onkeydown = function keydown (e) {
        if (e.key in map) {
          e.preventDefault()
          map[e.key](e)
        }
        if (e.altKey && e.key === 'c') {
          e.preventDefault()
          vm.waveCut()
        }
      }
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
.el-button--small, .el-input--small {
  font-size: 14px;
}
#role {
  width: 40%;
}
.btn-sm {
  font-size: 0.75rem;
}
/* region{
  border-style: dashed;
  border-width: 1.2px;
  border-color: black;
  box-sizing: border-box;
} */
region.wavesurfer-region:before {
  content: attr(data-region-label);
  background-color: yellow;
  color: red;
  font-size: 1.2rem;
  margin-left: 3px;
}
/* handle {
  background: grey;
  opacity: 0.3;
} */
.mx-auto{
  margin-top: 1rem;
  margin-bottom: 1rem;
}
#waveform-annotation{
  margin-bottom: 2rem;
  margin-top:.3rem;
  opacity: 0;
  transition: opacity 300ms linear;
}
</style>
