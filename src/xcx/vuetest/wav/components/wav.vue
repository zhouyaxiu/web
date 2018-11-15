<template>
  <div>
    <el-button type="warning" size="small" @click="waveformPause">暂停</el-button>
    <el-button type="primary" size="small" @click="waveformPlay">播放</el-button>
    <el-button type="info" size="small" @click="waveformStop">停止</el-button>
    <div v-loading="loading" :element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)">
      <div id="playlist"></div>
    </div>
  </div>
</template>

<script>
import Quill from "quill";
export default {
  data() {
    return {
      playlist: "",
       currentTime: '00:00.000',
    };
  },
  methods: {
    waveformClear() {
      let vm = this;
      if (vm.playlist === "") {
        return;
      }
      vm.index = 1;
      vm.playlist.clear();
    },
    voiceLoad(src, result, commit) {
      let notes = [];
      let vm = this;
      notes = [{ id: "000", begin: "0.000", end: "1.000" }];
      // console.log('voiceLoad:', src, result, commit)

      // if (vm.businessTypes === 1) {
      //   // console.log('load:', vm.businessTypes)
      //   this.tagMutexContents = []
      //   this.tagNormalContents = []

      //   notes = [{ id: '000', begin: '0.000', end: '1.000' }]
      //   if (result && result.length >= 2) {
      //     vm.tagMutexContents = $.extend(true, [], result[0])
      //     vm.tagNormalContents = $.extend(true, [], result[1])
      //   }
      // } else if (vm.businessTypes === 2 || vm.businessTypes === 3) {
      //   if (!result || result.length === 0) {
      //     notes = [{ id: '000', begin: '0.000', end: '1.000' }]
      //   } else {
      //     notes = result
      //   }
      // }
      // console.log('notes:', notes)

      // if (commit) {
      //   vm.quill.setText(commit)
      // } else {
      //   vm.quill.setText('')
      // }
      let playlist = vm.playlist;
      if (playlist === "") {
        this.waveformInit(notes, src);
        return;
      }

      this.waveformClear();
      // // 清空条目
      let annotations = playlist.annotationList.annotations;
      // console.log(annotations)
      annotations.splice(0, annotations.length);

      vm.loading = true;
      vm.playlist
        .load([
          {
            src: src,
            states: {
              cursor: false
            }
          }
        ])
        .then(function() {
          vm.loading = false;
        });

      // [zzf] 反复开关这个子组件，会有错误提示，实际是正常的
      // 加载超过10秒弹出错误提示
      // setTimeout(function () {
      //   if (vm.loading) {
      //     console.log('加载失败')
      //     vm.voiceErrorOpen()
      //   }
      // }, 10000)

      var x = 0;
      for (x in notes) {
        annotations.push({
          id: ("00" + x).slice(-3),
          start: Number(notes[x].begin),
          end: Number(notes[x].end),
          lines: [notes[x].text],
          lang: "zh"
        });
      }

      playlist.annotationList.annotations = annotations;
      vm.index = notes.length;

      // console.log(playlist.annotationList.annotations)

      let resizeHandlers = vm.playlist.annotationList.resizeHandlers;
      resizeHandlers.splice(0, resizeHandlers.length);

      vm.playlist.annotationList.setupInteractions();

      vm.playlist.drawRequest();
    },
    waveformInit(notes, src) {
      let vm = this;
      vm.index = notes.length;

      // console.log('waveformInit, notes:', notes)
      var x = 0;
      var annotations = [];
      for (x in notes) {
        annotations.push({
          id: ("00" + x).slice(-3),
          begin: Number(notes[x].begin),
          end: Number(notes[x].end),
          lines: [notes[x].text],
          lang: "zh"
        });
      }

      // console.log(annotations)

      let WaveformPlaylist = require("@fanhantech-npm/waveform-playlist");

      document.getElementById("playlist").innerHTML = "";

      let playlist = WaveformPlaylist.init({
        container: document.getElementById("playlist"),
        timescale: true,
        samplesPerPixel: 3072,
        colors: {
          waveOutlineColor: "white",
          timeColor: "red",
          fadeColor: "red"
        },
        annotationList: {
          annotations: annotations,
          controls: vm.actions,
          editable: vm.textEditable,
          isContinuousPlay: false,
          linkEndpoints: true
        },
        zoomLevels: [128, 256, 512, 1024, 2048, 3072, 4096, 5120]
      });
      vm.playlist = playlist;
      vm.loading = true;
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
        .then(function() {
          vm.loading = false;
        });

      // [zzf] 反复打开关闭子组件，这里有bug
      // 加载超过10秒弹出错误提示
      // setTimeout(function () {
      //   if (vm.loading) {
      //     console.log('加载失败')
      //     vm.voiceErrorOpen()
      //   }
      // }, 10000)

      // 拖动条清空
      let resizeHandlers = vm.playlist.annotationList.resizeHandlers;
      resizeHandlers.splice(0, resizeHandlers.length);

      // 设置拖动条
      vm.playlist.annotationList.setupInteractions();
      vm.playlist.drawRequest();

      let ee = vm.playlist.getEventEmitter();
      ee.on("timeupdate", vm.updateTime);
    },
    updateTime(time) {
      let vm = this;
      vm.currentTime = vm.formatTime(time);
    },
    postTask: function() {
      let vm = this;
      let result = [];
      vm.playlist.annotationList.annotations.forEach((a, i) => {
        let tmp = {};
        tmp.id = a.id;
        tmp.begin = a.start.toFixed(3);
        tmp.end = a.end.toFixed(3);
        tmp.text = a.lines[0];
        result.push(tmp);
      });
      let params = {
        result: result.concat()
      };
      this.$emit("postTask", params);
    },
    waveformPause() {
      let vm = this;
      let ee = vm.playlist.getEventEmitter();
      ee.emit("pause");
    },
    waveformPlay() {
      let vm = this;
      let ee = vm.playlist.getEventEmitter();
      ee.emit("play", vm.playlist.playbackSeconds);
    },
    waveformStop() {
      let vm = this;
      let ee = vm.playlist.getEventEmitter();
      ee.emit("stop");
    }
  }
};
</script>
<style scoped>
</style>