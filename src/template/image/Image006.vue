<template>
  <div id="con" class="position-relative">
    <el-button-group id="fluse" class="m-auto pb-1 pt-2">
      <el-button type="primary" @click="fluse" round>链接</el-button>
      <el-button type="primary" @click="breakchain" round>断开链接</el-button>
      <el-button type="primary" @click="Delchain" round>删除链</el-button>
      <el-button type="primary" id="add" @click="addflag = !addflag" round>合并链</el-button>
      <!-- <el-button type="primary" @click="print" round>测试</el-button> -->
      <el-button type="primary" @click="prev" round>上一页</el-button>
      <el-button type="primary" @click="next" round>下一页</el-button>
      <el-button type="primary" v-if="PostButtonVisible === true" @click="postTask" round>提交</el-button>
      <slot></slot>
    </el-button-group>
    <div id="canvascontainer" class="d-flex w-100 h-100" onselectstart="return false">
      <div class="d-flex flex-column p-3" style="flex:1">
        <div class="position-relative" style="flex:1">
          <canvas id="botl" class="position-absolute w-100 h-100"></canvas>
          <canvas id="topl" class="position-absolute w-100 h-100" @mousedown="CanvasClickL" @mouseup="StopDragL"></canvas>
        </div>
        <div class="m-auto pt-3">
          第
          <el-input-number v-model="pageL" :min=0 :max="pageR - 1"></el-input-number>
          页
        </div>
      </div>
      <div class="d-flex flex-column p-3" style="flex:1">
        <div class="position-relative" style="flex:1">
          <canvas id="botr" class="position-absolute w-100 h-100"></canvas>
          <canvas id="topr" class="position-absolute w-100 h-100" @mousedown="CanvasClickR" @mouseup="StopDragR"></canvas>
        </div>
        <div class="m-auto pt-3">
          第
          <el-input-number v-model="pageR" :min="pageL + 1" :max="IMG.length - 1"></el-input-number>
          页
        </div>
      </div>
    </div>
    <!-- S 编辑区 -->
    <div id="workbench" class="position-absolute position-div workbench z-index-999" v-if="CommentVisible">
      <el-button type="warning" class="position-absolute z-index-999" icon="el-icon-message" circle style="left:-18px;top:-18px;" @click="showNav('workbench')"></el-button>
      <div class="text-white w-100 editor-box p-3" style="overflow:auto">
        <div class="pb-3">{{$t("taskPublic.editor")}}:</div>
        <div id="editor" style="max-height: 150px"></div>
      </div>
    </div>
    <!-- E 编辑区 -->
  </div>
</template>
<script>
import $ from 'jquery'
import * as RECT from './rect.js'
import Quill from 'quill'

// 解除浏览器右键事件
document.oncontextmenu = function (e) {
  e.cancelBubble = true
  return false
}

function Recter (x, y, width, height, color) {
  this.x = x
  this.y = y
  this.width = width
  this.height = height
  this.color = color
}
// 提交数据类型
// function SubmitData (type, color, flag, pointset, markres) {
//   this.type = type
//   this.color = color
//   this.flag = flag
//   this.pointset = pointset
//   this.markres = markres
// }

/******************************
*         全局变量定义         *
******************************/

var trackid = 1
// 画布定义
var botcanvasl
var topcanvasl
var botctxl
var topctxl
var botcanvasr
var topcanvasr
var botctxr
var topctxr
var imgl, imgr
var rectsr, rectsl
// 画布容器宽高
// var height
// var width
// 保存环境
var vm
// 坐标系顶点位置
var lefti = 0
var topi = 0
let scalei = 1.0
// 存储画布点击的结果，以判定之后的相关动作
var resL = null
var resR = null
// 存储画布点击的 位置信息
var pos = null
var rateL, rateR
// var tempurl
// var rate = 1.0

export default {
  name: 'app',
  props: {
    ImgDatas: Array,
    // helptools: Array,
    CommentVisible: {
      type: Boolean,
      default: false
    },
    CommentReadOnly: {
      type: Boolean,
      default: false
    },
    PostButtonVisible: {
      type: Boolean,
      default: true
    },
    // 1001 整图，1002 规则图形， 1003 不规则图形
    SopType: {
      type: Number,
      default: 1001
    }
  },
  data () {
    return {
      IMG: [],
      alpha: 0,
      mode: 3,
      addflag: false,
      filstySP: '#00ff00',
      precolors: [
        '#ff0000',
        '#ffff00',
        '#ffffff',
        '#00ff00',
        '#00ffff',
        '#0000ff',
        '#ff00ff',
        '#000000',
        '#78AE20',
        '#ee7700'
      ],
      maxpage: 1,
      pageL: 0,
      pageR: 1,
      curindex: 1,
      filstyNor: '#050505',
      filstySPs: '#0000ff',
      filstyZone: 'rgba(255,255,255,0)',
      pointradius: 3,
      linewidth: 3,
      quill: {},
      rectRadio: '',
      option: '',
      options: [],
      desc: '',
      pointset: [],
      form: {
        type: '',
        color: ''
      },
      // 动态效果
      effect: {
        workbench: true
      }

    }
  },
  mounted: function () {
    vm = this
    // vm = this
    // vm.filstyNor = vm.helptools[0]
    // console.log(vm.filstyNor)
    this.$nextTick(function () {
      /************************************************************/
      botcanvasl = $('#botl')[0]
      topcanvasl = $('#topl')[0]
      botcanvasr = $('#botr')[0]
      topcanvasr = $('#topr')[0]
      topcanvasl.height = topcanvasl.clientHeight
      topcanvasl.width = topcanvasl.clientWidth
      botcanvasl.height = botcanvasl.clientHeight
      botcanvasl.width = botcanvasl.clientWidth
      topcanvasr.height = topcanvasr.clientHeight
      topcanvasr.width = topcanvasr.clientWidth
      botcanvasr.height = botcanvasr.clientHeight
      botcanvasr.width = botcanvasr.clientWidth
      botctxl = botcanvasl.getContext('2d')
      topctxl = topcanvasl.getContext('2d')
      botctxr = botcanvasr.getContext('2d')
      topctxr = topcanvasr.getContext('2d')
      imgl = new Image()
      imgr = new Image()
      // imgl.src = tempurl
      // // width0,height0为图片的实时大小
      // // width1,height1为画布的大小
      // // img.width,height为图片原始尺寸
      // imgl.onload = function () {
      //   // var height, width
      //   var rate1 = imgl.width / botcanvasl.clientWidth
      //   var rate2 = imgl.height / botcanvasl.clientHeight
      //   var rate = rate1 > rate2 ? rate1 : rate2
      //   console.log(topcanvasl.width, topcanvasl.height, imgl.height / rate, imgl.width / rate)
      //   botctxl.drawImage(imgl, 0, 0, imgl.width / rate, imgl.height / rate)
      //   botctxr.drawImage(imgl, 0, 0, imgl.width / rate, imgl.height / rate)
      // }

      // 初始化编辑器
      if (vm.CommentVisible === true) {
        vm.quill = new Quill('#editor', {
          placeholder: '请输入...',
          modules: {
            toolbar: ['bold', 'italic', 'underline', 'strike']
          },
          theme: 'snow'
        })

        if (vm.CommentReadOnly === true) {
          vm.quill.enable(false)
        }
      }
    })

    /************************************************************/
  },
  watch: {
    pageL: function () {
      if (vm.pageL >= vm.pageR - 1) {
        vm.pageL = vm.pageR - 1
      }
      vm.LoadL(vm.pageL)
    },
    pageR: function () {
      if (vm.pageR <= vm.pageL + 1) {
        vm.pageR = vm.pageL + 1
      }
      if (vm.pageR > vm.maxpage) {
        vm.maxpage = vm.pageR
      }
      vm.LoadR(vm.pageR)
    },
    addflag: function () {
      $('#add')[0].style.backgroundColor = ''
      if (vm.addflag) {
        $('#add')[0].style.backgroundColor = '#FF0000'
      }
    }
  },
  methods: {
    showNav (el) {
      let _element = $(`#${el}`)
      let distanceX = _element.outerWidth()
      let distanceY = _element.outerHeight()
      if (this.effect[el]) {
        _element.animate({right: `-${distanceX - 22}px`, bottom: `-${distanceY - 22}px`}, 'slow')
        this.effect[el] = false
      } else {
        _element.animate({right: `0`, bottom: `0`}, 'slow')
        this.effect[el] = true
      }
    },
    next () {
      if (vm.pageR < vm.IMG.length - 1) {
        vm.pageL += 1
        vm.pageR += 1
      }
    },
    prev () {
      if (vm.pageL > 0) {
        vm.pageL -= 1
        vm.pageR -= 1
      }
    },
    print () {
      vm.getResult()
    },
    DrawID: function (LR, num) {
      var items = vm.IMG[num]['items']
      for (var i = 0; i < items.length; i++) {
        if (LR === 'L' && items[i]['trackid'] > 0) {
          topctxl.beginPath()
          topctxl.fillStyle = items[i]['color']
          topctxl.font = 33 / scalei + 'px Arial'
          topctxl.fillText(items[i]['trackid'], items[i]['pointset'][0].x / rateL, items[i]['pointset'][0].y / rateL + 33)
          topctxl.fill()
          topctxl.closePath()
        }
        if (LR === 'R' && items[i]['trackid'] > 0) {
          topctxr.beginPath()
          topctxr.fillStyle = items[i]['color']
          topctxr.font = 33 / scalei + 'px Arial'
          topctxr.fillText(items[i]['trackid'], items[i]['pointset'][0].x / rateR, items[i]['pointset'][0].y / rateR + 33)
          topctxr.fill()
          topctxr.closePath()
        }
      }
    },
    fluse: function () {
      var ImgDatas = vm.IMG
      var itemsL = ImgDatas[vm.pageL]['items']
      var itemsR = ImgDatas[vm.pageR]['items']
      if (resL === null || resR === null) {
        return
      }
      var l = resL.i
      var r = resR.i
      if (l > -1 && r > -1) {
        if (itemsL[l]['trackid'] > 0 && itemsR[r]['trackid'] > 0 && itemsL[l]['trackid'] !== itemsR[r]['trackid']) {
          // todo?是否支持覆盖
          trackid -= 1
          var maxid = Math.max(itemsL[l]['trackid'], itemsR[r]['trackid'])
          var minid = Math.min(itemsL[l]['trackid'], itemsR[r]['trackid'])
          for (var i = 0; i < vm.IMG.length; i++) {
            var cnt = 0
            for (var j = 0; j < vm.IMG[i]['items'].length; j++) {
              if (vm.IMG[i]['items'][j]['trackid'] === maxid) {
                cnt += 1
              }
              if (vm.IMG[i]['items'][j]['trackid'] === minid) {
                cnt += 1
              }
              if (cnt === 2) {
                window.alert('无法合并，若合并，会存在冲突trackid')
                trackid += 1
                return
              }
            }
            for (j = 0; j < vm.IMG[i]['items'].length; j++) {
              if (vm.IMG[i]['items'][j]['trackid'] === maxid) {
                vm.IMG[i]['items'][j]['trackid'] = minid
              } else if (vm.IMG[i]['items'][j]['trackid'] > maxid) {
                vm.IMG[i]['items'][j]['trackid'] -= 1
              }
            }
          }
        } else if (itemsL[l]['trackid'] === 0 && itemsR[r]['trackid'] === 0) {
          console.log('生成')
          ImgDatas[vm.pageL]['items'][l]['trackid'] = trackid
          ImgDatas[vm.pageR]['items'][r]['trackid'] = trackid
          trackid = trackid + 1
        } else {
          if (vm.addflag) {
            return
          }
          console.log('继承')
          if (itemsL[l]['trackid'] === 0) {
            itemsL[l]['trackid'] = itemsR[r]['trackid']
          }
          if (itemsR[r]['trackid'] === 0) {
            itemsR[r]['trackid'] = itemsL[l]['trackid']
          }
        }
      }
      RECT.LoadRects(rectsl)
      vm.DrawRect('L', topctxl, rateL)
      RECT.LoadRects(rectsr)
      vm.DrawRect('R', topctxr, rateR)
    },
    Delchain: function () {
      if (vm.addflag) {
        return
      }
      var ImgDatas = vm.IMG
      var itemsL = ImgDatas[vm.pageL]['items']
      var itemsR = ImgDatas[vm.pageR]['items']
      var ML = (resL !== null && resL.i > -1 && itemsL[resL.i]['trackid'] > 0)
      var MR = (resR !== null && resR.i > -1 && itemsR[resR.i]['trackid'] > 0)
      if (ML || MR) {
        trackid -= 1
        if (ML) {
          var tmp = itemsL[resL.i]['trackid']
        } else {
          tmp = itemsR[resR.i]['trackid']
        }
        for (var i = 0; i < vm.IMG.length; i++) {
          for (var j = 0; j < vm.IMG[i]['items'].length; j++) {
            if (vm.IMG[i]['items'][j]['trackid'] === tmp) {
              vm.IMG[i]['items'][j]['trackid'] = 0
            } else if (vm.IMG[i]['items'][j]['trackid'] > tmp) {
              vm.IMG[i]['items'][j]['trackid'] -= 1
            }
          }
        }
      }
      RECT.LoadRects(rectsl)
      vm.DrawRect('L', topctxl, rateL)
      RECT.LoadRects(rectsr)
      vm.DrawRect('R', topctxr, rateR)
    },
    FindidBetweenLR: function (L, R, id) {
      if (R - L < 2) {
        return -1
      }
      for (var i = L + 1; i < R; i++) {
        var items = vm.IMG[i]['items']
        for (var j = 0; j < items.length; j++) {
          if (items[j]['trackid'] === id) {
            return i
          }
        }
      }
      return -1
    },
    breakchain: function () {
      if (vm.addflag) {
        return
      }
      var ImgDatas = vm.IMG
      var itemsL = ImgDatas[vm.pageL]['items']
      var itemsR = ImgDatas[vm.pageR]['items']
      if (resL === null || resR === null) {
        return
      }
      if (resL.i < 0 || resR.i < 0) {
        return
      }
      var l = resL.i
      var r = resR.i
      if (itemsL[l]['trackid'] > 0 && itemsR[r]['trackid'] > 0) {
        var tmp = itemsL[l]['trackid']
        var id1 = vm.FindidBetweenLR(vm.pageL, vm.pageR, tmp)
        var idL = vm.FindidBetweenLR(-1, vm.pageL, tmp)
        var idR = vm.FindidBetweenLR(vm.pageR, vm.IMG.length, tmp)
        if (id1 > -1) {
          window.alert('在中间的第' + id1 + '页存在相同trackid，无法断开')
          return
        }

        if (idL === -1) {
          itemsL[l]['trackid'] = 0
        }
        if (idR === -1) {
          itemsR[r]['trackid'] = 0
        }
        if (idR === -1 && idL === -1) {
          resL.i = -1
          resR.i = -1
          trackid -= 1
        }
        if (idR > -1 && idL > -1) {
          for (var i = vm.pageL + 1; i < vm.IMG.length; i++) {
            for (var j = 0; j < vm.IMG[i]['items'].length; j++) {
              if (vm.IMG[i]['items'][j]['trackid'] === tmp) {
                vm.IMG[i]['items'][j]['trackid'] = trackid
              }
            }
          }
          resL.i = -1
          resR.i = -1
          trackid += 1
        }
      }
      RECT.LoadRects(rectsl)
      vm.DrawRect('L', topctxl, rateL)
      RECT.LoadRects(rectsr)
      vm.DrawRect('R', topctxr, rateR)
    },
    imageload: function (imgdatas, commit) {
      if (vm.CommentVisible === true) {
        if (commit) {
          vm.quill.setText(commit)
        } else {
          vm.quill.setText('')
        }
      }
      trackid = 1
      for (let i = 0; i < imgdatas.length; i++) {
        if (!imgdatas[i].items) {
          continue
        }
        for (let k = 0; k < imgdatas[i].items.length; k++) {
          let item = imgdatas[i].items[k]
          let pointset = item.pointset
          if (!item.color) {
            item.color = '#FF0000'
          }
          if (!item.trackid) {
            item.trackid = 0
          } else {
            if (item.trackid + 1 > trackid) {
              trackid = item.trackid + 1
            }
          }
          item.flag = true
          for (let j = 0; j < pointset.length; j++) {
            if (!pointset[j].x || pointset[j].x < 0) {
              pointset[j].x = 0
            }
            if (!pointset[j].y || pointset[j].y < 0) {
              pointset[j].y = 0
            }
            pointset[j].isSelected = false
          }
          item.pointset = pointset
          imgdatas[i].items[k] = item
        }
      }
      vm.IMG = imgdatas
      rectsl = []
      rectsr = []
      vm.$forceUpdate()
      vm.LoadL(0)
      vm.LoadR(1)
    },
    // Load: function () {
    //   trackid = 1
    //   rectsl = []
    //   rectsr = []
    // },
    LoadL: function (num) {
      rectsl = []
      resL = null
      imgl.src = vm.IMG[num]['src']
      var items = vm.IMG[num]['items']
      imgl.onload = function () {
        var rate1 = imgl.width / botcanvasl.clientWidth
        var rate2 = imgl.height / botcanvasl.clientHeight
        rateL = rate1 > rate2 ? rate1 : rate2
        for (var i = 0; i < items.length; i++) {
          if (items[i].type === 'rect') {
            let recvrect = new Recter(items[i].pointset[0].x / rateL, items[i].pointset[0].y / rateL, items[i].pointset[1].x / rateL - items[i].pointset[0].x / rateL, items[i].pointset[1].y / rateL - items[i].pointset[0].y / rateL, items[i].color)
            rectsl.push(recvrect)
          }
        }
        RECT.LoadRects(rectsl)
        // console.log(topcanvasl.width, topcanvasl.height, img.height / rate, img.width / rate)
        vm.cleancanvas(botctxl, botcanvasl)
        vm.cleancanvas(topctxl, topcanvasl)
        botctxl.drawImage(imgl, 0, 0, imgl.width / rateL, imgl.height / rateL)
        vm.DrawRect('L', topctxl, rateL)
      }
    },
    LoadR: function (num) {
      rectsr = []
      resR = null
      imgr.src = vm.IMG[num]['src']
      var items = vm.IMG[num]['items']
      imgr.onload = function () {
        var rate1 = imgr.width / botcanvasl.clientWidth
        var rate2 = imgr.height / botcanvasl.clientHeight
        rateR = rate1 > rate2 ? rate1 : rate2
        for (var i = 0; i < items.length; i++) {
          if (items[i].type === 'rect') {
            let recvrect = new Recter(items[i].pointset[0].x / rateR, items[i].pointset[0].y / rateR, items[i].pointset[1].x / rateR - items[i].pointset[0].x / rateR, items[i].pointset[1].y / rateR - items[i].pointset[0].y / rateR, items[i].color)
            rectsr.push(recvrect)
          }
        }
        RECT.LoadRects(rectsr)
        // console.log(topcanvasl.width, topcanvasl.height, img.height / rate, img.width / rate)
        vm.cleancanvas(topctxr, topcanvasr)
        vm.cleancanvas(botctxr, botcanvasr)
        botctxr.drawImage(imgr, 0, 0, imgr.width / rateR, imgr.height / rateR)
        vm.DrawRect('R', topctxr, rateR)
      }
    },
    // 调用绘制函数，要知道哪个rects被加载回去了
    DrawRect: function (LR, ctx, rate) {
      var rects = RECT.GetRects()
      if (LR === 'L') {
        vm.cleancanvas(topctxl, topcanvasl)
      }
      if (LR === 'R') {
        vm.cleancanvas(topctxr, topcanvasr)
      }
      for (var i = 0; i < rects.length; i++) {
        if (LR === 'L') {
          if (resL !== null && i === resL.i) {
            RECT.Draw(ctx, rects[i], vm.filstySP, vm.filstyZone, 2, 1, rate, scalei)
          } else {
            RECT.Draw(ctx, rects[i], rects[i].color, vm.filstyZone, 2, 1, rate, scalei)
          }
          vm.DrawID('L', vm.pageL)
        }
        if (LR === 'R') {
          if (resR !== null && i === resR.i) {
            RECT.Draw(ctx, rects[i], vm.filstySP, vm.filstyZone, 2, 1, rate, scalei)
          } else {
            RECT.Draw(ctx, rects[i], rects[i].color, vm.filstyZone, 2, 1, rate, scalei)
          }
          vm.DrawID('R', vm.pageR)
        }
      }
    },
    getResult: function () {
      let imgdatas = vm.IMG
      let ret = []
      for (let i = 0; i < imgdatas.length; i++) {
        if (!imgdatas[i].items) {
          continue
        }
        let imgdata = {
          src: imgdatas[i].src,
          items: []
        }
        for (let k = 0; k < imgdatas[i].items.length; k++) {
          let item = imgdatas[i].items[k]
          let pointset = item.pointset
          let nitem = {
            trackid: item.trackid,
            flag: item.flag,
            type: item.type
          }
          let npointset = []
          for (let j = 0; j < pointset.length; j++) {
            let np = {
              x: pointset[j].x,
              y: pointset[j].y
            }
            npointset.push(np)
          }
          nitem.pointset = npointset
          imgdata.items.push(nitem)
        }
        ret.push(imgdata)
      }
      console.log(ret)
      return ret
    },
    postTask (form) {
      if (vm.maxpage < vm.IMG.length - 1) {
        window.alert('第' + vm.maxpage + '页之后未标注')
        return
      }
      let result = vm.getResult()
      let params = {
        result: result
        // commit: vm.quill.getText()
      }
      this.$emit('postTask', params)
    },
    getComment: function () {
      return this.quill.getText()
    },
    GetClickInfo: function (LR, x, y) {
      var Left = $('#topl')[0].offsetParent.offsetLeft + $('#con')[0].offsetLeft
      var Top = $('#topl')[0].offsetParent.offsetTop + $('#con')[0].offsetTop
      if (LR === 'R') {
        Left = $('#topr')[0].offsetParent.offsetLeft + $('#con')[0].offsetLeft
        Top = $('#topr')[0].offsetParent.offsetTop + $('#con')[0].offsetTop
      }
      var clickX = x - Left
      var clickY = y - Top
      var moveclickX, moveclickY
      moveclickX = (clickX - lefti) / scalei
      moveclickY = (clickY - topi) / scalei
      return {
        clickX: clickX,
        clickY: clickY,
        moveclickX: moveclickX,
        moveclickY: moveclickY
      }
    },
    CanvasClick: function (LR, e) {
      if (LR === 'L') {
        pos = vm.GetClickInfo(LR, e.clientX, e.clientY)
        vm.cleancanvas(topctxl, topcanvasl)
        RECT.LoadRects(rectsl)
        resL = RECT.CanvasClick(pos.moveclickX, pos.moveclickY, 0, resL)
        vm.DrawRect('L', topctxl)
        // 两侧画布的trackid对应
        if (vm.addflag) {
          // todo
        } else {
          if (resL !== null && resL.i > -1) {
            RECT.LoadRects(rectsr)
            var trackidL = vm.IMG[vm.pageL]['items'][resL.i]['trackid']
            for (var j = 0; j < vm.IMG[vm.pageR]['items'].length; j++) {
              var trackidR = vm.IMG[vm.pageR]['items'][j]['trackid']
              if (trackidL > 0 && trackidR === trackidL) {
                resR = RECT.CanvasClick(0, 0, 0, resR)
                resR.i = j
                break
              }
            }
            if (trackidL > 0 && j >= vm.IMG[vm.pageR]['items'].length) {
              if (resR !== null && resR.i > -1 && vm.IMG[vm.pageR]['items'][resR.i]['trackid'] > 0) {
                resR = RECT.CanvasClick(0, 0, 0, resR)
                resR.i = -1
              }
            }
            if (trackidL === 0 && resR !== null && resR.i > -1 && vm.IMG[vm.pageR]['items'][resR.i]['trackid'] > 0) {
              for (var i = 0; i < vm.IMG[vm.pageL]['items'].length; i++) {
                if (vm.IMG[vm.pageL]['items'][i]['trackid'] === vm.IMG[vm.pageR]['items'][resR.i]['trackid']) {
                  break
                }
              }
              if (i < vm.IMG[vm.pageL]['items'].length) {
                resR = RECT.CanvasClick(0, 0, 0, resR)
                resR.i = -1
              }
            }
            vm.cleancanvas(topctxr, topcanvasr)
            vm.DrawRect('R', topctxr)
          }
        }
      }
      if (LR === 'R') {
        pos = vm.GetClickInfo(LR, e.clientX, e.clientY)
        vm.cleancanvas(topctxr, topcanvasr)
        RECT.LoadRects(rectsr)
        resR = RECT.CanvasClick(pos.moveclickX, pos.moveclickY, 0, resR)
        vm.DrawRect(LR, topctxr)
        // 两侧画布trackid的对应
        if (vm.addflag) {
          // todo
        } else {
          if (resR !== null && resR.i > -1) {
            RECT.LoadRects(rectsl)
            trackidR = vm.IMG[vm.pageR]['items'][resR.i]['trackid']
            for (j = 0; j < vm.IMG[vm.pageL]['items'].length; j++) {
              trackidL = vm.IMG[vm.pageL]['items'][j]['trackid']
              if (trackidR > 0 && trackidL === trackidR) {
                resL = RECT.CanvasClick(vm.IMG[vm.pageL]['items'][j]['pointset'][0].x / rateL + 2, vm.IMG[vm.pageL]['items'][j]['pointset'][0].y / rateL + 2, 0, resL)
                break
              }
            }
            if (trackidR > 0 && j >= vm.IMG[vm.pageL]['items'].length) {
              if (resL !== null && resL.i > -1 && vm.IMG[vm.pageL]['items'][resL.i]['trackid'] > 0) {
                resL = RECT.CanvasClick(0, 0, 0, resL)
                resL.i = -1
              }
            }
            if (trackidR === 0 && resL !== null && resL.i > -1 && vm.IMG[vm.pageL]['items'][resL.i]['trackid'] > 0) {
              for (i = 0; i < vm.IMG[vm.pageR]['items'].length; i++) {
                if (vm.IMG[vm.pageR]['items'][i]['trackid'] === vm.IMG[vm.pageL]['items'][resL.i]['trackid']) {
                  break
                }
              }
              if (i < vm.IMG[vm.pageR]['items'].length) {
                resL = RECT.CanvasClick(0, 0, 0, resL)
                resL.i = -1
              }
            }
            vm.cleancanvas(topctxl, topcanvasl)
            vm.DrawRect('L', topctxl)
          }
        }
      }
    },
    StopDrag: function (RL, e) {
      if (RL === 'R') {
        RECT.LoadRects(rectsr)
        RECT.StopDrag(resR)
      }
      if (RL === 'L') {
        RECT.LoadRects(rectsl)
        RECT.StopDrag(resL)
      }
    },
    CanvasClickL: function (e) {
      vm.CanvasClick('L', e)
    },
    CanvasClickR: function (e) {
      vm.CanvasClick('R', e)
    },
    StopDragL: function (e) {
      vm.StopDrag('L', e)
    },
    StopDragR: function (e) {
      vm.StopDrag('R', e)
    },
    cleancanvas: function (ctx, canvas) {
      ctx.clearRect((0 - lefti) / scalei, (0 - topi) / scalei, canvas.width / scalei, canvas.height / scalei)
    }
  }
}
</script>
<style>
#con {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
#botl {
	background: #C0C4CC;
	z-index: 1;
}
#topl {
  z-index: 2;
}
#botr {
  background: #C0C4CC;
  z-index: 1;
}
#topr {
  z-index: 2;
}
.position-div {
  bottom: 0;
  background:rgba(0,0,0,0.2);
}
.workbench {
  right: 0;
  width: 300px;
  min-width:250px;
  max-width: 700px;
}
.z-index-999 {
  z-index: 999;
}
.editor-box {
  height: 300px;
}
</style>
