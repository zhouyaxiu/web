<template>
  <div id="con" class="img-template position-relative">
    <!-- S 工具区 -->
    <div id="navtools" class="position-absolute position-div nav-tools z-index-999" @mouseleave="leavenavtools">
      <div class="position-absolute z-index-999 d-flex flex-column" style="right:-42px;">
        <button type="button" class="btn btn-primary rounded-0"
          @click="showNav('navtools')" >
          <i class="el-icon-menu"></i>
        </button>
        <el-popover
          effect="dark"
          placement="right-start"
          width="300"
          trigger="click">
          <p class="mb-2">快捷键说明</p>
          <ul class="pl-4">
            <li>ctrl + D	删除点</li>
            <li>ctrl + Z 	撤销上一次打点</li>
            <li>ctrl + A	完成</li>
            <li>ctrl + S	提交</li>
            <li>按住alt		进入移动图片模式，松开后切换为原有模式</li>
            <li>按住shift	进入预览模式，松开后切换为原有模式</li>
            <li>在矩形模式下，按住ctrl进入矩形选中和移动模式，可以对矩形进行选中和移动，松开后进入绘制矩形模式</li>
            <li>滑动鼠标滚轮会以鼠标所指坐标为中心，放大缩小图片</li>
            <li>鼠标右键，会以鼠标所指坐标为中心，顺时针旋转图片</li>
          </ul>
          <button type="button" class="btn btn-secondary rounded-0" slot="reference">
            <i class="el-icon-info"></i>
          </button>
        </el-popover>
      </div>
      <div class="text-white w-100 h-100 nav-tools-box p-3" style="overflow:auto">
        <section class="mb-4">
          <p class="mb-2" style="font-size: .875rem">工具</p>
          <div v-show="mode===1" id="tools" class="mb-3">
            <div id="preboard">
              <p class="mb-1" style="font-size: .875rem">当前标签:{{PTindex}}</p>
              <el-input-number v-model="PTindex" :min="1" :max="1000" size="small"></el-input-number>
            </div>
          </div>
          <el-tooltip class="item" effect="dark" content="移动图片" :enterable="false" placement="top">
            <div id="move" class="rounded btn-primary mt-2 d-inline-block" style="width: 40px;height: 40px;padding:.35rem" @click="mode0" data-tool="button">
              <img src="/static/img/icon/move.png" alt="move" width=100%>
            </div>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="预览" :enterable="false" placement="top">
            <div id="preview" class="rounded btn-primary mt-2 d-inline-block" style="width: 40px;height: 40px;padding:.35rem" @click="mode999" data-tool="button">
              <img src="/static/img/icon/eye.png" alt="preview" width=100%>
            </div>
          </el-tooltip>
          <el-tooltip v-if="SopType >= 1002 && SopType <=1003" class="item" effect="dark" content="矩形" :enterable="false" placement="top">
            <div id="rect" class="rounded btn-primary mt-2 d-inline-block" style="width: 40px;height: 40px;padding:.35rem" @click="mode2" data-tool="button">
              <img src="/static/img/icon/rect.png" alt="rect" width=100%>
            </div>
          </el-tooltip>
          <el-tooltip v-if="SopType ===1003" class="item" effect="dark" content="曲线区域" :enterable="false" placement="top">
            <div id="bezier" class="rounded btn-primary mt-2 d-inline-block" style="width: 40px;height: 40px;padding:.35rem" @click="mode4" data-tool="button">
              <img src="/static/img/icon/bezier.png" alt="bezier" width=100%>
            </div>
          </el-tooltip>
          <el-tooltip v-if="SopType ===1003" class="item" effect="dark" content="描点" :enterable="false" placement="top">
            <div id="point" class="rounded btn-primary mt-2 d-inline-block" style="width: 40px;height: 40px;padding:.35rem" @click="mode1" data-tool="button">
              <img src="/static/img/icon/point.png" alt="point" width=100%>
            </div>
          </el-tooltip>
          <el-tooltip v-if="SopType ===1003" class="item" effect="dark" content="折线" :enterable="false" placement="top">
            <div id="polyline" class="rounded btn-primary mt-2 d-inline-block" style="width: 40px;height: 40px;padding:.35rem" @click="polyline" data-tool="button">
              <img src="/static/img/icon/line.png" alt="line" width=100%>
            </div>
          </el-tooltip>
          <el-tooltip v-if="SopType ===1003" class="item" effect="dark" content="多边形" :enterable="false" placement="top">
          <div id="polygon" class="rounded btn-primary mt-2 d-inline-block" style="width: 40px;height: 40px;padding:.35rem" @click="mode3" data-tool="button">
            <img src="/static/img/icon/polygon.png" alt="polygon" width=100%>
          </div>
          </el-tooltip>
          <el-tooltip v-if="SopType ===1003" class="item" effect="dark" content="拟合曲线" :enterable="false" placement="top">
            <div id="splinezone" class="rounded btn-primary mt-2 d-inline-block" style="width: 40px;height: 40px;padding:.35rem" @click="mode5" data-tool="button">
              <img src="/static/img/icon/splinezone.png" alt="splinezone" width=100%>
            </div>
          </el-tooltip>
          <el-tooltip v-if="SopType ===1003" class="item" effect="dark" content="曲线" :enterable="false" placement="top">
            <div id="spline" class="rounded btn-primary mt-2 d-inline-block" style="width: 40px;height: 40px;padding:.35rem" @click="spline" data-tool="button">
              <img src="/static/img/icon/spline.png" alt="spline" width=100%>
            </div>
          </el-tooltip>
        </section>
        <section class="d-flex mb-4">
          <div style="flex:1">
            <p style="font-size: .75rem">标注颜色</p>
            <div class="pl-2">
              <el-color-picker v-model="filstyNor" :predefine="precolors" size="medium"></el-color-picker>
            </div>
          </div>
          <div style="flex:1">
            <p style="font-size: .75rem">选中点</p>
            <div class="pl-2">
              <el-color-picker v-model="filstySP" :predefine="precolors" size="medium"></el-color-picker>
            </div>
          </div>
          <div style="flex:1">
            <p style="font-size: .75rem">选中集</p>
            <div class="pl-2">
              <el-color-picker v-model="filstySPs" :predefine="precolors" size="medium"></el-color-picker>
            </div>
          </div>
        </section>
        <section class="mb-3">
          <p class="mb-0" style="font-size: .875rem">标注点大小</p>
          <div class="pl-2 pr-2">
            <el-slider :min=0 :max=10 v-model="pointradius"></el-slider>
          </div>
          <p class="mb-0" style="font-size: .875rem">标注序号大小</p>
          <div class="pl-2 pr-2">
            <el-slider :min=0 :max=40 v-model="numsize"></el-slider>
          </div>
          <p class="mb-0" style="font-size: .875rem">标注线宽</p>
          <div class="pl-2 pr-2">
            <el-slider :min=1 :max=10 v-model="linewidth"></el-slider>
          </div>
          </section>
        <section class="mb-4">
          <p class="mb-3 mt-3" style="font-size: .875rem">操作</p>
          <el-tooltip content="ctrl + D" placement="top" :enterable="false">
            <button id="delpt" type="button" class="btn btn-danger btn-sm mb-2" style="width:5rem" @click="Delpt">删除点</button>
          </el-tooltip>
          <!-- <button id="delset" type="button" class="btn btn-danger btn-sm mb-2" style="width:5rem" @click="Delset">删除集</button> -->
          <button id="reset" type="button" class="btn btn-danger btn-sm mb-2" style="width:5rem" @click="Reset">重置图片</button>
          <el-tooltip content="ctrl + Z" placement="top" :enterable="false">
            <button id="undo" type="button" class="btn btn-danger btn-sm mb-2" style="width:5rem" @click="Undo">撤销</button>
          </el-tooltip>
          <button id="clear" type="button" class="btn btn-danger btn-sm mb-2" style="width:5rem" @click="Clear">清空</button>
          <el-tooltip content="ctrl + A" placement="top" :enterable="false">
            <button id="comp" type="button" class="btn btn-danger btn-sm mb-2" style="width:5rem" @click="Complete">完成</button>
          </el-tooltip>
          <!-- <button id="test" type="button" class="btn btn-danger btn-sm mb-2" style="width:5rem" @click="test">测试</button> -->
        </section>
        <section class="mb-4">
          <p class="mb-3 mt-3" style="font-size: .875rem">任务</p>
          <el-tooltip content="ctrl + S" placement="top" :enterable="false">
            <button id="postTask" v-if="PostButtonVisible === true" type="button" class="btn btn-danger btn-sm mb-2" style="width:5rem" @click="postTask">提交</button>
          </el-tooltip>
          <slot></slot>
        </section>
      </div>
    </div>
    <!-- E 工具区 -->
    <!-- S 蒙版 -->
    <div id="mask" class="position-absolute h-100 w-100" style="z-index: 100; display:none"></div>
    <!-- E 蒙版 -->
    <!-- S 工作区 -->
    <div id="workbench" class="position-absolute position-div workbench z-index-999" @mouseleave="leaveworkbench">
      <button type="button"
        class="btn btn-primary mb-2 position-absolute z-index-999 rounded-0"
        @click="showNav('workbench')" style="left:-42px;">
        <i class="el-icon-document"></i>
      </button>
      <div id="rLeft" class="position-absolute h-100 rLeft" @mousedown = "sizeChange()"></div>
      <div id="scroll" class="text-white w-100 h-100 nav-tools-box p-3" style="overflow:auto">
        <div id="vQuesDoDiv" class="border border-primary rounded mb-3" v-if="vQuesDo.length>0">
          <div class="p-3" v-for="(messageLab,messIndex) in vQuesDo" :key='messageLab.title'>
            <p class="text-light mb-2 ques-title">{{messIndex + 1}}.{{messageLab.title}}:</p>
            <el-radio-group v-model="vQuesDoContents[messIndex].label" style="display:block">
              <el-radio  v-for="(lab,num) in messageLab.vlabels" :key='lab' :label="num">{{lab.name}} </el-radio>
            </el-radio-group>
            <el-input v-model="vQuesDoContents[messIndex].text"
              v-if="otherItem(messageLab.vlabels, vQuesDoContents[messIndex], messIndex)">
            </el-input>
          </div>
        </div>
        <div id="vQuesCheckDiv" class="border border-primary rounded mb-3" v-if="vQuesCheck.length>0">
          <div class="p-3" v-for="(messageLab,messIndex) in vQuesCheck" :key='messageLab.title'>
            <p class="text-light mb-2 ques-title">{{messIndex + 1}}.{{messageLab.title}}:</p>
            <el-radio-group v-model="vQuesCheckContents[messIndex].label" style="display:block" disabled>
              <el-radio  v-for="(lab,num) in messageLab.vlabels" :key='lab' :label="num">{{lab.name}} </el-radio>
            </el-radio-group>
            <el-input v-model="vQuesCheckContents[messIndex].text" disabled
              v-if="messageLab.needText === true">
            </el-input>
          </div>
        </div>
        <div v-if="request !== ''" id="titleMark" style="border: 1px solid #b3d8ff;">
          <span>{{request}}</span><br>
        </div>
        <div id="wholeMark" class="border border-primary rounded mb-3 p-2" v-if="wholeRadios.length>0 || wholeCheckBoxs.length>0 || wholeInputs.length>0">
          <div class="m-2" v-for="(messageLab,messIndex) in wholeRadios" :key='messageLab.title'>
            <p class="text-light mb-2 ques-title">{{messIndex + 1}}.{{messageLab.title}}:</p>
            <el-radio-group v-model="wholeRadioContents[messIndex]" style="display:block">
              <el-radio  v-for="(lab,num) in messageLab.labels" :key='lab' :disabled="TagDisabled" :label="num">{{lab.name}} </el-radio>
            </el-radio-group>
          </div>
          <div class="m-2" v-for="(messageLab,messIndex) in wholeCheckBoxs" :key='messageLab.title'>
            <p class="text-light mb-2 ques-title">{{messIndex + 1 + wholeRadios.length}}.{{messageLab.title}}:</p>
            <el-checkbox-group v-model="wholeCheckBoxContents[messIndex]">
              <el-checkbox v-for="(lab,num) in messageLab.labels" :key='lab' :disabled="TagDisabled" :label="num">{{lab.name}}</el-checkbox>
            </el-checkbox-group>
          </div>
          <div class="m-2" v-for="(title,index) in wholeInputs" :key='index'>
            <p class="text-light mb-2 ques-title">{{index + 1 + wholeRadios.length + wholeCheckBoxs.length}}.{{title}}</p>
            <el-input :placeholder="$t('labelTool.please')" :disabled="TagDisabled" v-model="wholeInputContents[index]"></el-input>
          </div>
        </div>
        <div id="mon" class="mb-3" v-show="options.length > 0">
          <div v-for="(item,oindex) in options" :key="item" class="goodsForm" @click="select(oindex)" style="background: #ecf5ff">
            <div class="item-del">
              <span class="text-secondary">id:{{oindex}}</span>
              <el-button slot="append" type="danger" icon="el-icon-delete" size="mini" @click="delradio(oindex)"></el-button>
            </div>
            <div class="m-2" v-for="(messageLab,messIndex) in itemRadios" :key='messageLab.title'>
              <p class="text-secondary mb-2 ques-title">{{oindex}}.{{messIndex + 1}}.{{messageLab.title}}:</p>
              <el-radio-group v-model="options[oindex].itemRadioContents[messIndex]" style="margin-top: 5px">
                <el-radio  v-for="(lab,num) in messageLab.labels" :key='lab' :disabled="TagDisabled" :label="num">{{lab.name}} </el-radio>
              </el-radio-group>
            </div>
            <div class="m-2" v-for="(messageLab,messIndex) in itemCheckBoxs" :key='messageLab.title'>
              <p class="text-secondary mb-2 ques-title">{{oindex}}.{{messIndex + 1 + itemRadios.length}}.{{messageLab.title}}</p>
              <el-checkbox-group v-model="options[oindex].itemCheckBoxContents[messIndex]" style="margin-top: 5px">
                <el-checkbox v-for="(lab,num) in messageLab.labels" :key='lab' :disabled="TagDisabled" :label="num">{{lab.name}}</el-checkbox>
              </el-checkbox-group>
            </div>
            <div class="m-2" v-for="(title,index) in itemInputs" :key='index'>
              <p class="text-secondary mb-2 ques-title">{{oindex}}.{{index + 1 + itemRadios.length + itemCheckBoxs.length}}.{{title}}</p>
              <el-input :placeholder="$t('labelTool.please')" :disabled="TagDisabled" v-model="options[oindex].itemInputContents[index]" style="margin-top: 5px"></el-input>
            </div>
          </div>
        </div>
        <div v-show="CommentVisible">
          <div>{{$t("taskPublic.editor")}}:</div>
          <div id="editor"></div>
        </div>
      </div>
    </div>
    <!-- E 工作区 -->
    <!-- S 画布 -->
    <div id="canvascontainer" onselectstart="return false">
      <canvas id="bot" ref="botcanvas"></canvas>
      <canvas id="top" ref="topcanvas" @mousedown="CanvasClick" @mousemove="Drag" @mouseup="StopDrag" @mousewheel="mousescale" @mouseleave="leavecanvas"></canvas>
    </div>
    <!-- E 画布 -->
  </div>
</template>
<script>
import $ from 'jquery'
import Quill from 'quill'
import * as EXIF from './009/exif.js'
import * as RECT from './009/rect.js'
import * as PT from './009/pointset.js'
import * as POLY from './009/polygon.js'
import * as BEZIER from './009/bezier.js'
import * as PIC from './009/picop.js'
// import * as FIT from './pathfit.js'
import * as SPLINE from './009/spline.js'
import {language} from 'lang'

// 解除浏览器右键事件
document.oncontextmenu = function (e) {
  e.cancelBubble = true
  return false
}
// 点
function Pointer (x, y) {
  this.x = x
  this.y = y
}
// 提交数据类型
function SubmitData (type, color, flag, pointset, markres) {
  this.type = type
  this.color = color
  this.flag = flag
  this.pointset = pointset
  this.markres = markres
}

function Mark (itemRadioContents, itemCheckBoxContents, itemInputContents) {
  this.itemRadioContents = itemRadioContents
  this.itemCheckBoxContents = itemCheckBoxContents
  this.itemInputContents = itemInputContents
}

/******************************
*         全局变量定义         *
******************************/
// 画布定义
var botcanvas
var topcanvas
var botctx
var topctx
var img
// 画布容器宽高
var height
var width
// 图片实际展示大小
var width0
var height0
// 保存环境
var vm
// 图片左上顶点位置
var lefti = 0
var topi = 0
let scalei = 1.0
// 存储画布点击的结果，以判定之后的相关动作
var res = null
// 存储画布点击的 位置信息
var pos = null
var rate = 1.0
// 由于删除按钮元素的覆盖，执行delradio后会执行select，引入delflag
var delflag = true
// 初始图片位置，以便于重置图片
var initangle = 0
var inittopi, initlefti
// 判断所处元素位置，避免鼠标从一个元素位移到另一个元素时触发错误事件
var fromnavtools = false
var fromworkbench = false
var mytestsrc
export default {
  name: 'app',
  props: {
    wholeRadios: Array,
    wholeCheckBoxs: Array,
    wholeInputs: Array,
    itemRadios: Array,
    itemCheckBoxs: Array,
    itemInputs: Array,
    // helptools: Array,
    vQuesDo: Array,
    vQuesCheck: Array,
    vQuesCheckContents: Array,
    pointSetRest: {
      type: Object,
      default: () => {}
    },
    rectMinH: {
      type: Number,
      default: 20
    }, // 矩形最小高
    rectMinW: {
      type: Number,
      default: 20
    }, // 矩形最小宽
    rectMinArea: {
      type: Number,
      default: 40
    }, // 矩形最小面积
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
    TagDisabled: {
      type: Boolean,
      default: false
    },
    // 1001 整图，1002 规则图形， 1003 不规则图形
    SopType: {
      type: Number,
      default: 1001
    },
    request: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      // 图片参数
      vQuesDoContents: [],
      wholeRadioContents: [],
      wholeCheckBoxContents: [],
      wholeInputContents: [],
      itemRadioContents: [],
      itemCheckBoxContents: [],
      itemInputContents: [],
      alpha: 0,
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
      mode: 0,
      tmpmode: 0,
      rotateangle: 0,
      curindex: 1,
      changecolor: false,
      completeflag: true,
      moverect: false,
      PTindex: 0,
      // 选中图形后返回的在options中的索引
      optionindex: -1,
      filstyNor: '#ff0000',
      filstySPs: '#00ff00',
      filstySP: '#0000ff',
      filstyZone: 'rgba(255,255,255,0)',
      numsize: 20,
      pointradius: 2,
      linewidth: 2,
      projectid: '',
      storageKey: '',
      quill: {},
      rectRadio: '',
      contract: 0,
      brightness: 0,
      optionstype: [],
      options: [],
      desc: '',
      otherInput: [],
      pointset: [],
      form: {
        type: '',
        color: ''
      },
      effect: {
        navtools: true,
        workbench: true
      }
    }
  },
  computed: {
    // 其他原因情况下显示填空
    otherItem () {
      let vm = this
      return (ques, content, queIndex) => {
        let index = content.label
        let showInput = false
        if (index !== '') {
          if (ques[index].needText) {
            showInput = true
          } else {
            if (content.text) {
              content.text = ''
            }
          }
          vm.otherInput[queIndex] = showInput
        }
        return showInput
      }
    }
  },

  watch: {
    // 如果 `wholeCheckBoxs` 发生改变，这个函数就会运行，将wholeCheckBoxContents变成二维数组
    wholeCheckBoxs: function () {
      for (let key in this.wholeCheckBoxs) {
        if (!Array.isArray(this.wholeCheckBoxContents[key])) {
          this.$set(this.wholeCheckBoxContents, key, [])
          // console.log(this.wholeCheckBoxContents)
        }
      }
    },
    pointradius: function () {
      if (vm.mode === 0) {
        // nothing
      } else {
        vm.cleantopcanvas()
        vm.DrawTmpmode(vm.mode)
      }
    },
    numsize: function () {
      if (vm.mode === 0) {
        // nothing
      } else {
        vm.cleantopcanvas()
        vm.DrawTmpmode(vm.mode)
      }
    },
    linewidth: function () {
      if (vm.mode === 0) {
        // nothing
      } else {
        vm.cleantopcanvas()
        vm.DrawTmpmode(vm.mode)
      }
    },
    completeflag: function () {
      for (var i = 0; i < $('[data-tool=button]').length; i++) {
        $('[data-tool=button]')[i].style.backgroundColor = ''
      }
      if (vm.mode === 3) {
        if (vm.completeflag) {
          $('#polygon')[0].style.backgroundColor = '#FF0000'
        } else {
          $('#polyline')[0].style.backgroundColor = '#FF0000'
        }
      } else if (vm.mode === 5) {
        if (vm.completeflag) {
          $('#splinezone')[0].style.backgroundColor = '#FF0000'
        } else {
          $('#spline')[0].style.backgroundColor = '#FF0000'
        }
      }
    },
    mode: function () {
      for (var i = 0; i < $('[data-tool=button]').length; i++) {
        $('[data-tool=button]')[i].style.backgroundColor = ''
      }
      if (vm.mode === 0) {
        $('#move')[0].style.backgroundColor = '#FF0000'
      } else if (vm.mode === 1) {
        $('#point')[0].style.backgroundColor = '#FF0000'
      } else if (vm.mode === 2) {
        $('#rect')[0].style.backgroundColor = '#FF0000'
      } else if (vm.mode === 3) {
        if (vm.completeflag) {
          $('#polygon')[0].style.backgroundColor = '#FF0000'
        } else {
          $('#polyline')[0].style.backgroundColor = '#FF0000'
        }
      } else if (vm.mode === 4) {
        $('#bezier')[0].style.backgroundColor = '#FF0000'
      } else if (vm.mode === 5) {
        if (vm.completeflag) {
          $('#splinezone')[0].style.backgroundColor = '#FF0000'
        } else {
          $('#spline')[0].style.backgroundColor = '#FF0000'
        }
      } else if (vm.mode === 999) {
        $('#preview')[0].style.backgroundColor = '#FF0000'
      }
    },
    vQuesDo: function () {
      this.vQuesDoContents = []
      this.vQuesDo.forEach(() => {
        this.vQuesDoContents.push({
          label: '',
          text: ''
        })
      })
    },
    vQuesCheck: function () {
      this.vQuesCheckContents = []
      this.vQuesCheck.forEach(() => {
        this.vQuesCheckContents.push({
          label: '',
          text: ''
        })
      })
    },
    options: function () {
      for (let key in this.options) {
        for (let num in this.itemCheckBoxs) {
          if (!Array.isArray(this.options[key].itemCheckBoxContents[num])) {
            // 将itemCheckBoxContents变成三维数组
            this.$set(this.options[key].itemCheckBoxContents, num, [])
          }
        }
      }
    },
    itemCheckBoxs: function () {
      for (let key in this.options) {
        for (let num in this.itemCheckBoxs) {
          if (!Array.isArray(this.options[key].itemCheckBoxContents[num])) {
            // 将itemCheckBoxContents变成三维数组
            this.$set(this.options[key].itemCheckBoxContents, num, [])
          }
        }
      }
    }
  },
  mounted: function () {
    vm = this
    $('#move')[0].style.backgroundColor = '#FF0000'
    // tempurl = './static/samung/' + window.location.search.split('=')[1] + '.jpg'
    this.$nextTick(function () {
      /************************************************************/
      // 初始化编辑器
      vm.quill = new Quill('#editor', {
        placeholder: '请输入...',
        modules: {
          toolbar: ['bold', 'italic', 'underline', 'strike']
        },
        theme: 'snow'
      })
      if (vm.CommentReadOnly) {
        vm.quill.enable(false)
      }
      // 事件绑定按后来者覆盖之前的修改，因此放到mouted里，用哪个模板，哪个模板来绑定
      bindKeyEvent()
    })
  },
  methods: {
    test: function () {
      var sres = vm.getResult()
      vm.imageload(mytestsrc, sres, '')
    },
    sizeChange (ev) {
      let oEvent = ev || window.event
      $('#mask').css('display', 'block')
      let disX = oEvent.clientX - $('#rLeft')[0].offsetLeft
      let oParent = $(`#workbench`)
      oEvent.cancelBubble = true
      let oRrsizeX1 = 0
      document.onmousemove = function (ev) {
        let oEvent = ev || window.event
        let oRrsizeX = oEvent.clientX - disX
        oParent[0].style.width = oParent[0].offsetWidth - oRrsizeX + oRrsizeX1 + 'px'
        oRrsizeX1 = oRrsizeX
      }
      document.onmouseup = function () {
        document.onmousemove = null
        document.onmouseup = null
        $('#mask').css('display', 'none')
      }
    },
    showNav (el) {
      let _element = $(`#${el}`)
      let distance = _element.outerWidth()
      let direction = (rule, val) => rule ? {left: val} : {right: val}
      if (this.effect[el]) {
        _element.animate(direction(el === 'navtools', `-${distance}px`), 'slow')
        this.effect[el] = false
      } else {
        _element.animate(direction(el === 'navtools', '0'), 'slow')
        this.effect[el] = true
      }
    },
    valid () {
      let vm = this
      // 质检性任务
      if (vm.TagDisabled === true) {
        if (vm.vQuesDo.length > 0 && Array.isArray(vm.vQuesDoContents)) {
          if (vm.vQuesDoContents.length !== vm.vQuesDo.length) {
            return false
          } else {
            let doContents = vm.vQuesDoContents
            for (let key in doContents) {
              if (doContents[key].label === '') {
                return false
              } else {
                // 验证其他原因的填空
                console.log(vm.otherInput)
                for (let num in vm.otherInput) {
                  if (vm.otherInput[num] === true && doContents[key].text === '') {
                    return false
                  }
                }
              }
            }
            return true
          }
        } else {
          return false
        }
      }
      // else if
      // 非质检性任务
      if (vm.vQuesDo) {
        if (vm.vQuesDo.length === 1 && Array.isArray(vm.vQuesDoContents)) {
          if (vm.vQuesDoContents.length !== 1) {
            return false
          } else {
            if (vm.vQuesDoContents[0].label === 1) {
              // 选了无效
              return true
            }
          }
        }
      }
      // 有效
      let i = 0
      if (vm.wholeRadios.length > 0 && Array.isArray(vm.wholeRadioContents)) {
        if (vm.wholeRadioContents.length !== vm.wholeRadios.length) {
          console.log(language('labelTool.radio') + language('labelTool.lengthErr'))
          return false
        }
        for (i = 0; i < vm.wholeRadioContents.length; i++) {
          if (!vm.wholeRadioContents[i] && vm.wholeRadioContents[i] !== 0) {
            console.log(language('labelTool.radio'), i, language('labelTool.noChoice'))
            return false
          }
        }
      }

      if (vm.wholeCheckBoxs.length > 0 && Array.isArray(vm.wholeCheckBoxContents)) {
        if (vm.wholeCheckBoxContents.length !== vm.wholeCheckBoxs.length) {
          console.log(language('labelTool.checkbox') + language('labelTool.lengthErr'))
          return false
        }
        for (i = 0; i < vm.wholeCheckBoxContents.length; i++) {
          if (vm.wholeCheckBoxContents[i].length === 0) {
            console.log(language('labelTool.checkbox'), i, language('labelTool.noChoice'))
            return false
          }
        }
      }

      if (vm.wholeInputs.length > 0 && Array.isArray(vm.wholeInputContents)) {
        if (vm.wholeInputContents.length !== vm.wholeInputs.length) {
          console.log(language('labelTool.input') + language('labelTool.lengthErr'))
          return false
        }
        for (i = 0; i < vm.wholeInputContents.length; i++) {
          if (vm.wholeInputContents[i].trim() === '') {
            console.log(language('labelTool.input'), i, language('labelTool.noNull'))
            return false
          }
        }
      }
      let j = 0
      for (j = 0; j < vm.options.length; j++) {
        if (vm.itemRadios.length > 0 && Array.isArray(vm.options[j].itemRadioContents)) {
          if (vm.options[j].itemRadioContents.length !== vm.itemRadios.length) {
            console.log(language('labelTool.radio') + language('labelTool.lengthErr'))
            return false
          }
          for (i = 0; i < vm.options[j].itemRadioContents.length; i++) {
            if (!vm.options[j].itemRadioContents[i] && vm.options[j].itemRadioContents[i] !== 0) {
              console.log(language('labelTool.radio'), i, language('labelTool.noChoice'))
              return false
            }
          }
        }

        if (vm.itemCheckBoxs.length > 0 && Array.isArray(vm.options[j].itemCheckBoxContents)) {
          if (vm.options[j].itemCheckBoxContents.length !== vm.itemCheckBoxs.length) {
            console.log(language('labelTool.checkbox') + language('labelTool.lengthErr'))
            return false
          }
          for (i = 0; i < vm.options[j].itemCheckBoxContents.length; i++) {
            if (vm.options[j].itemCheckBoxContents[i].length === 0) {
              console.log(language('labelTool.checkbox'), i, language('labelTool.noChoice'))
              return false
            }
          }
        }

        if (vm.itemInputs.length > 0 && Array.isArray(vm.options[j].itemInputContents)) {
          if (vm.options[j].itemInputContents.length !== vm.itemInputs.length) {
            console.log(language('labelTool.input') + language('labelTool.lengthErr'))
            return false
          }
          for (i = 0; i < vm.options[j].itemInputContents.length; i++) {
            if (vm.options[j].itemInputContents[i].trim() === '') {
              console.log(language('labelTool.input'), i, language('labelTool.noNull'))
              return false
            }
          }
        }
      }
      return true
      // item 相关
    },
    getAngle (url, cb) {
      // var url = 'https://s301.fanhantech.com/Mm2jsHFM001/0idTCRqCQGJuXHcao0vmBioawDb52jGw.JPG'
      var fileReader = new FileReader()
      vm.objectURLToBlob(url, function (blob) {
        fileReader.readAsArrayBuffer(blob)
        fileReader.onload = function (e) {
          var angle = EXIF.getOrientation(e.target.result)
          cb(angle)
        }
      })
    },
    objectURLToBlob (url, callback) {
      var http = new XMLHttpRequest()
      http.open('GET', url, true)
      http.responseType = 'blob'
      http.onload = function (e) {
        if (this.status === 200 || this.status === 0) {
          callback(this.response)
        }
      }
      http.send()
    },
    getoptionsindex (index, type) {
      var cnt = index
      for (var i = 0; i < vm.optionstype.length; i++) {
        if (vm.optionstype[i] === type) {
          if (cnt === 0) {
            return i
          }
          cnt--
        }
      }
    },
    /****************************************************************************/
    /*                              图形绘制                                    */
    /****************************************************************************/
    drawPTLine: function (pointSetRest, pts) {
      let connlines = pointSetRest.connLines
      topctx.strokeStyle = vm.filstyNor
      for (var i = 0; i < connlines.length; i++) {
        if (pts.length < connlines[i]['s'] || pts.length <= connlines[i]['d']) {
          continue
        }
        topctx.beginPath()
        if (connlines[i].type === 1 || connlines[i].type === 2) {
          topctx.moveTo(pts[connlines[i]['s'] - 1].x, pts[connlines[i]['s'] - 1].y)
          for (var j = 1; j < connlines[i]['d'] - connlines[i]['s'] + 1; j++) {
            topctx.lineTo(pts[connlines[i]['s'] + j - 1].x, pts[connlines[i]['s'] + j - 1].y)
          }
          if (connlines[i].type === 2) {
            topctx.closePath()
          }
        } else if (connlines[i].type === 0) {
          topctx.moveTo(pts[connlines[i]['s'] - 1].x, pts[connlines[i]['s'] - 1].y)
          topctx.lineTo(pts[connlines[i]['d'] - 1].x, pts[connlines[i]['d'] - 1].y)
        }
        topctx.stroke()
      }
    },
    drawNPTLine: function (pointSetRest, pts) {
      let pointIndex = []
      for (let i = 0; i < pts.length; i++) {
        // 如果有重复index的索引，画靠后的点
        pointIndex[pts[i].index] = i
      }
      let connlines = pointSetRest.connLines
      topctx.strokeStyle = vm.filstyNor
      for (let i = 0; i < connlines.length; i++) {
        let s = connlines[i]['s']
        let d = connlines[i]['d']
        if (pointIndex[s] === undefined || pointIndex[d] === undefined) {
          continue
        }
        let sP = pts[pointIndex[s]]
        let dP = pts[pointIndex[d]]
        topctx.beginPath()
        if (connlines[i].type === 1 || connlines[i].type === 2) {
          // 从s 依次画到 d
          topctx.moveTo(sP.x, sP.y)
          for (let j = 1; j < d - s + 1; j++) {
            let NextI = pointIndex[s + j]
            if (NextI === undefined) {
              continue
            }
            let NestP = pts[NextI]
            topctx.lineTo(NestP.x, NestP.y)
          }
          if (connlines[i].type === 2) {
            topctx.closePath()
          }
        } else if (connlines[i].type === 0) {
          // 只画sd
          topctx.moveTo(sP.x, sP.y)
          topctx.lineTo(dP.x, dP.y)
        }
        topctx.stroke()
      }
    },
    // 点集的连线设定
    drawConnline: function (pointSetRest, pts) {
      // if (pts.length > connlines['max'] || pts.length < connlines['min']) {
      //   return
      // }
      if (!pointSetRest || !pointSetRest.connLines) {
        return
      }
      if (!pts || pts.length === 0) {
        return
      }
      if (pts[0].index === undefined) {
        vm.drawPTLine(pointSetRest, pts)
      } else {
        vm.drawNPTLine(pointSetRest, pts)
      }
    },
    // 绘制点集中点的序号,仅限带index的PT
    DrawPTNum: function (ctx, ptset) {
      if (ptset.length < 1) {
        return
      }
      ctx.beginPath()
      if (ptset[0].hasOwnProperty('index')) {
        for (var i = 0; i < ptset.length; i++) {
          ctx.font = vm.numsize + 'px Arial'
          ctx.fillStyle = vm.filstyNor
          ctx.fillText(ptset[i].index, ptset[i].x, ptset[i].y)
        }
      } else {
        for (i = 0; i < ptset.length; i++) {
          ctx.font = vm.numsize + 'px Arial'
          ctx.fillStyle = vm.filstyNor
          ctx.fillText(i + 1, ptset[i].x, ptset[i].y)
        }
      }
    },
    // 绘制点集的序号
    DrawSetNum: function (ctx, x, y, i) {
      ctx.beginPath()
      ctx.font = vm.numsize + 'px Arial'
      ctx.fillStyle = vm.filstySPs
      ctx.fillText(i, x, y)
    },
    // 绘制矩形信息
    DrawRectInfo: function (rect) {
      if (rect === null) {
        return
      }
      topctx.beginPath()
      topctx.font = vm.numsize + 'px Arial'
      topctx.fillStyle = rect.color
      topctx.fillText(Math.round(rect.width * rate) + ' * ' + Math.round(rect.height * rate) + ' S:' + Math.round(rect.width * rect.height * rate * rate), rect.x + vm.numsize, rect.y)
      topctx.stroke()
      topctx.fill()
      topctx.closePath()
    },
    DrawPTs: function () {
      var points = PT.GetPoints()
      var pointsets = PT.GetPointsets()
      topctx.save()
      topctx.translate(lefti, topi)
      topctx.scale(scalei, scalei)
      topctx.rotate(vm.rotateangle * Math.PI / 2)
      PT.Draw(topctx, points, vm.filstyNor, -1, vm.filstySP, vm.pointradius / scalei)
      vm.DrawPTNum(topctx, points)
      for (var i = 0; i < pointsets.length; i++) {
        if (res !== null && i === res.selectset) {
          vm.drawConnline(vm.pointSetRest, pointsets[i].pointset)
          PT.Draw(topctx, pointsets[i].pointset, vm.filstySPs, res.selectpt, vm.filstySP, vm.pointradius / scalei)
          vm.DrawPTNum(topctx, pointsets[i].pointset)
        } else {
          vm.drawConnline(vm.pointSetRest, pointsets[i].pointset)
          PT.Draw(topctx, pointsets[i].pointset, pointsets[i].color, -1, vm.filstySP, vm.pointradius / scalei)
          vm.DrawSetNum(topctx, pointsets[i].pointset[0].x, pointsets[i].pointset[0].y, vm.getoptionsindex(i, 'pointset'))
        }
      }
      topctx.restore()
    },
    DrawRect: function () {
      var rect = RECT.GetRect()
      var rects = RECT.GetRects()
      topctx.save()
      topctx.translate(lefti, topi)
      topctx.scale(scalei, scalei)
      topctx.rotate(vm.rotateangle * Math.PI / 2)
      RECT.Draw(topctx, rect, vm.filstyNor, vm.filstyZone, vm.linewidth / scalei, vm.pointradius / scalei)
      vm.DrawRectInfo(rect)
      for (var i = 0; i < rects.length; i++) {
        if (res !== null && i === res.i) {
          RECT.Draw(topctx, rects[i], vm.filstySP, vm.filstyZone, vm.linewidth / scalei, vm.pointradius / scalei)
          vm.DrawRectInfo(rects[i])
        } else {
          RECT.Draw(topctx, rects[i], rects[i].color, vm.filstyZone, vm.linewidth / scalei, vm.pointradius / scalei)
        }
        vm.DrawSetNum(topctx, rects[i].x, rects[i].y, vm.getoptionsindex(i, 'rect'))
      }
      topctx.restore()
    },
    DrawPoly: function () {
      var polygon = POLY.GetPolygon()
      var polygons = POLY.GetPolygons()
      topctx.save()
      topctx.translate(lefti, topi)
      topctx.scale(scalei, scalei)
      topctx.rotate(vm.rotateangle * Math.PI / 2)
      if (res !== null) {
        POLY.Draw(topctx, polygon, vm.filstyNor, vm.filstyZone, res.selectpt, vm.filstySPs, vm.pointradius / scalei, vm.linewidth / scalei, false)
      } else {
        POLY.Draw(topctx, polygon, vm.filstyNor, vm.filstyZone, -1, vm.filstySPs, vm.pointradius / scalei, vm.linewidth / scalei, false)
      }
      for (var i = 0; i < polygons.length; i++) {
        if (res !== null && res.selectset === i) {
          POLY.Draw(topctx, polygons[i].pointset, vm.filstySP, vm.filstyZone, res.selectpt, vm.filstySPs, vm.pointradius / scalei, vm.linewidth / scalei, polygons[i].flag)
        } else {
          POLY.Draw(topctx, polygons[i].pointset, polygons[i].color, vm.filstyZone, -1, polygons[i].color, vm.pointradius / scalei, vm.linewidth / scalei, polygons[i].flag)
        }
        vm.DrawSetNum(topctx, polygons[i].pointset[0].x, polygons[i].pointset[0].y, vm.getoptionsindex(i, 'polygon'))
      }
      topctx.restore()
    },
    DrawBezier: function () {
      var bezierline = BEZIER.GetBezierline()
      var bezierlines = BEZIER.GetBezierlines()
      topctx.save()
      topctx.translate(lefti, topi)
      topctx.scale(scalei, scalei)
      topctx.rotate(vm.rotateangle * Math.PI / 2)
      if (res !== null && res.selectset === -1) {
        BEZIER.Draw(topctx, bezierline, vm.filstyNor, vm.filstyZone, vm.pointradius / scalei, vm.linewidth / scalei, res.selectpt, vm.filstySPs)
      } else {
        BEZIER.Draw(topctx, bezierline, vm.filstyNor, vm.filstyZone, vm.pointradius / scalei, vm.linewidth / scalei, -1, vm.filstySPs)
      }
      for (var i = 0; i < bezierlines.length; i++) {
        if (res !== null && res.selectset === i) {
          BEZIER.Draw(topctx, bezierlines[i].pointset, vm.filstySPs, vm.filstyZone, vm.pointradius / scalei, vm.linewidth / scalei, res.selectpt, vm.filstySP)
        } else {
          BEZIER.Draw(topctx, bezierlines[i].pointset, bezierlines[i].color, vm.filstyZone, vm.pointradius / scalei, vm.linewidth / scalei, -1, vm.filstySP)
        }
        vm.DrawSetNum(topctx, bezierlines[i].pointset[0].x, bezierlines[i].pointset[0].y, vm.getoptionsindex(i, 'bezierline'))
      }
      topctx.restore()
    },
    DrawSpline: function () {
      var bezierline = SPLINE.GetBezierline()
      var bezierlines = SPLINE.GetBezierlines()
      topctx.save()
      topctx.translate(lefti, topi)
      topctx.scale(scalei, scalei)
      topctx.rotate(vm.rotateangle * Math.PI / 2)
      BEZIER.Draw(topctx, bezierline, vm.filstyNor, vm.filstyZone, vm.pointradius / scalei, vm.linewidth / scalei, -1, vm.filstySPs)
      for (var i = 0; i < bezierlines.length; i++) {
        if (res !== null && res.selectset === i) {
          BEZIER.Draw(topctx, bezierlines[i].pointset, vm.filstySPs, vm.filstyZone, vm.pointradius / scalei, vm.linewidth / scalei, res.selectpt, vm.filstySP)
        } else {
          BEZIER.Draw(topctx, bezierlines[i].pointset, bezierlines[i].color, vm.filstyZone, vm.pointradius / scalei, vm.linewidth / scalei, -1, vm.filstySP)
        }
        vm.DrawSetNum(topctx, bezierlines[i].pointset[0].x, bezierlines[i].pointset[0].y, vm.getoptionsindex(i, 'spline'))
      }
      topctx.restore()
    },
    DrawTmpmode: function (tmpmode) {
      if (tmpmode === 0) {
        topctx.clearRect(0, 0, topcanvas.width, topcanvas.height)
      }
      if (tmpmode === 1) {
        topctx.clearRect(0, 0, topcanvas.width, topcanvas.height)
        vm.DrawPTs()
      } else if (tmpmode === 2) {
        topctx.clearRect(0, 0, topcanvas.width, topcanvas.height)
        vm.DrawRect()
      } else if (tmpmode === 3) {
        topctx.clearRect(0, 0, topcanvas.width, topcanvas.height)
        vm.DrawPoly()
      } else if (tmpmode === 4) {
        topctx.clearRect(0, 0, topcanvas.width, topcanvas.height)
        vm.DrawBezier()
      } else if (tmpmode === 5) {
        topctx.clearRect(0, 0, topcanvas.width, topcanvas.height)
        vm.DrawSpline()
      } else if (tmpmode === 999) {
        topctx.clearRect(0, 0, topcanvas.width, topcanvas.height)
        vm.DrawAll()
      }
    },
    DrawAll: function () {
      vm.DrawPTs()
      vm.DrawRect()
      vm.DrawPoly()
      vm.DrawBezier()
      vm.DrawSpline()
    },
    /****************************************************************************/
    /*                     前后端交互接口,get,post,getresult                     */
    /****************************************************************************/
    // 数据验证
    // 提交任务，包含点集，描述，url等一系列数据
    postTask (form) {
      let vm = this
      if (!vm.valid()) {
        vm.$notify.error({
          title: language('taskPublic.error'),
          message: language('labelTool.errorMessage'),
          duration: 2000
        })
        return
      }
      if (PT.GetPoints().length > 0) {
        vm.$notify.error({
          title: '描点',
          message: '存在未完成点集，请先完成',
          duration: 2000
        })
        return
      }
      if (POLY.GetPolygon().length > 0) {
        vm.$notify.error({
          title: '多边形',
          message: '存在未完成多边形或折线，请先完成',
          duration: 2000
        })
        return
      }
      if (BEZIER.GetBezierline().length > 0 || SPLINE.GetBezierline().length > 0) {
        vm.$notify.error({
          title: '曲线',
          message: '存在未完成曲线',
          duration: 2000
        })
        return
      }
      let result = vm.getResult()
      let params = {
        result: result,
        commit: vm.quill.getText()
      }
      this.$emit('postTask', params, vm.vQuesDoContents)
    },
    clearAll () {
      vm.wholeRadioContents = []
      vm.wholeInputContents = []
      for (let key in this.wholeCheckBoxs) {
        this.$set(this.wholeCheckBoxContents, key, [])
      }
    },
    getComment: function () {
      return this.quill.getText()
    },
    getVQuesDoRes: function () {
      return this.vQuesDoContents
    },
    setVQuesDoRes: function (vQuesDoContents) {
      this.vQuesDoContents = vQuesDoContents
      this.$forceUpdate()
    },
    transIntptset: function (ptset, radio) {
      var newptset = []
      for (var i = 0; i < ptset.length; i++) {
        var newpt = new Pointer(Math.round(ptset[i].x * radio), Math.round(ptset[i].y * radio))
        if (ptset[i].index !== undefined) {
          newpt.index = ptset[i].index
        }
        newptset.push(newpt)
      }
      return newptset
      // for (var i = 0; i < ptset.length; i++) {
      //   ptset[i].x = Math.round(ptset[i].x * radio)
      //   ptset[i].y = Math.round(ptset[i].y * radio)
      // }
      // return ptset
    },
    transptset: function (ptset, radio) {
      var newptset = []
      for (var i = 0; i < ptset.length; i++) {
        var newpt = new Pointer(ptset[i].x * radio, ptset[i].y * radio)
        if (ptset[i].index !== undefined) {
          newpt.index = ptset[i].index
        }
        newptset.push(newpt)
      }
      return newptset
      // for (var i = 0; i < ptset.length; i++) {
      //   ptset[i].x = ptset[i].x * radio
      //   ptset[i].y = ptset[i].y * radio
      // }
      // return ptset
    },
    // 获取提交数据
    getResult: function () {
      var submit = {
        data: [],
        wholeRadioContents: [],
        wholeCheckBoxContents: [],
        wholeInputContents: []
      }
      var PreSubmit = []
      var pointsets = PT.GetPointsets()
      var rects = RECT.GetRects()
      var polygons = POLY.GetPolygons()
      var bezierlines = BEZIER.GetBezierlines()
      var splines = SPLINE.GetBezierlines()
      let pointseti = 0
      let recti = 0
      let polygoni = 0
      let bezierlinei = 0
      let splinei = 0
      for (var i = 0; i < vm.optionstype.length; i++) {
        if (vm.optionstype[i] === 'pointset') {
          var pointset = pointsets[pointseti]
          if (pointset !== null) {
            var data = new SubmitData('pointset', pointset.color, true, vm.transIntptset(pointset.pointset, rate), vm.options[i])
            PreSubmit.push(data)
          }
          pointseti++
        } else if (vm.optionstype[i] === 'rect') {
          var rect = rects[recti]
          var pt1 = new Pointer(rect.x, rect.y)
          var pt2 = new Pointer(rect.x + rect.width, rect.y + rect.height)
          var rectpt = []
          rectpt.push(pt1)
          rectpt.push(pt2)
          data = new SubmitData('rect', rect.color, true, vm.transIntptset(rectpt, rate), vm.options[i])
          PreSubmit.push(data)
          recti++
        } else if (vm.optionstype[i] === 'polygon') {
          var poly = polygons[polygoni]
          if (poly !== null) {
            data = new SubmitData('polygon', poly.color, poly.flag, vm.transIntptset(poly.pointset, rate), vm.options[i])
            PreSubmit.push(data)
          }
          polygoni++
        } else if (vm.optionstype[i] === 'bezierline') {
          var bezierline = bezierlines[bezierlinei]
          if (bezierline !== null) {
            data = new SubmitData('bezierline', bezierline.color, bezierline.flag, vm.transIntptset(bezierline.pointset, rate), vm.options[i])
            PreSubmit.push(data)
          }
          bezierlinei++
        } else if (vm.optionstype[i] === 'spline') {
          var spline = splines[splinei]
          if (spline !== null) {
            data = new SubmitData('spline', spline.color, spline.flag, vm.transIntptset(spline.pointset, rate), vm.options[i])
            PreSubmit.push(data)
          }
          splinei++
        }
      }
      submit.data = PreSubmit
      submit.wholeRadioContents = vm.wholeRadioContents
      submit.wholeInputContents = vm.wholeInputContents
      submit.wholeCheckBoxContents = vm.wholeCheckBoxContents
      // console.log(JSON.stringify(submit))
      return submit
    },
    imageload: function (src, result, commit) {
      mytestsrc = src
      vm.getAngle(src, function (angle) {
        /************************************************************/
        lefti = $('#navtools')[0].clientWidth
        topi = 0
        scalei = 1
        var polygons = []
        var bezierlines = []
        var pointsets = []
        var rects = []
        var splines = []
        vm.options = []
        vm.optionstype = []

        botcanvas = $('#bot')[0]
        topcanvas = $('#top')[0]
        topcanvas.style.cursor = 'crosshair'
        botctx = botcanvas.getContext('2d')
        topctx = topcanvas.getContext('2d')
        // 画布容器宽高
        height = $('#canvascontainer')[0].clientHeight
        width = $('#canvascontainer')[0].clientWidth
        img = new Image()
        img.src = src
        vm.commit = commit
        if (commit) {
          vm.quill.setText(commit)
        } else {
          vm.quill.setText('')
        }

        // width0,height0为图片的实时大小
        // width1,height1为画布的大小
        // img.width,height为图片原始尺寸
        img.onload = function () {
          // height = $('#canvascontainer')[0].clientHeight
          // width = $('#canvascontainer')[0].clientWidth
          width0 = img.width
          height0 = img.height
          if (angle === 6 || angle === 8) {
            // if (width0 > height || height0 > width) {
            if (width0 / height > height0 / (width - $('#navtools')[0].clientWidth - $('#workbench')[0].clientWidth)) {
              rate = width0 / height
              height0 = height0 / rate
              width0 = width0 / rate
              lefti = (width - height0) / 2
            } else {
              rate = height0 / (width - $('#navtools')[0].clientWidth - $('#workbench')[0].clientWidth)
              height0 = height0 / rate
              width0 = width0 / rate
              topi = (height - width0) / 2
            }
            // }
          } else {
            // if ((width0 > width) || (height0 > height)) {
            if (width0 / (width - $('#navtools')[0].clientWidth - $('#workbench')[0].clientWidth) > height0 / height) {
              rate = width0 / (width - $('#navtools')[0].clientWidth - $('#workbench')[0].clientWidth)
              height0 = height0 / rate
              width0 = (width - $('#navtools')[0].clientWidth - $('#workbench')[0].clientWidth)
              topi = (height - height0) / 2
            } else {
              rate = height0 / height
              width0 = width0 / rate
              height0 = height
              lefti = (width - width0) / 2
            }
            // }
          }
          topcanvas.width = width
          topcanvas.height = height
          botcanvas.width = width
          botcanvas.height = height
          // jpeg图片的exif处理
          if (angle === 3) {
            vm.rotateangle = 2
            initangle = 2
            lefti += width0
            topi += height0
          } else if (angle === 6) {
            vm.rotateangle = 1
            initangle = 1
            lefti += height0
            topi += 0
          } else if (angle === 8) {
            vm.rotateangle = 3
            initangle = 3
            lefti += 0
            topi += width0
          } else {
            vm.rotateangle = 0
            lefti += 0
            topi += 0
          }
          inittopi = topi
          initlefti = lefti
          botctx.save()
          botctx.translate(lefti, topi)
          botctx.rotate(vm.rotateangle * Math.PI / 2)
          botctx.drawImage(img, 0, 0, width0, height0)
          botctx.restore()

          if (!result || result === '') {
            vm.clearAll()
            return
          }
          if (result.wholeRadioContents) {
            vm.wholeRadioContents = result.wholeRadioContents
          } else {
            vm.wholeRadioContents = []
          }
          if (result.wholeCheckBoxContents) {
            vm.wholeCheckBoxContents = result.wholeCheckBoxContents
          } else {
            for (let key in this.wholeCheckBoxs) {
              this.$set(this.wholeCheckBoxContents, key, [])
            }
          }
          if (result.wholeInputContents) {
            vm.wholeInputContents = result.wholeInputContents
          } else {
            vm.wholeRadioContents = []
          }
          let data = result.data
          // 数据导入
          if (data) {
            vm.mode = 999
            for (var i = 0; i < data.length; i++) {
              var recvptset = vm.transptset(data[i].pointset, 1 / rate)
              if (data[i].type === 'pointset' || data[i].type === 'newPTset') {
                var newpointset = new PT.PTseter(recvptset, data[i].color)
                pointsets.push(newpointset)
                vm.options.push(data[i].markres)
                vm.optionstype.push('pointset')
              } else if (data[i].type === 'rect') {
                var rect = new RECT.Recter(recvptset[0].x, recvptset[0].y, recvptset[1].x - recvptset[0].x, recvptset[1].y - recvptset[0].y, data[i].color)
                rects.push(rect)
                vm.options.push(data[i].markres)
                vm.optionstype.push('rect')
              } else if (data[i].type === 'polygon') {
                var newpolygon = new POLY.Polygoner(recvptset, data[i].color, data[i].flag)
                polygons.push(newpolygon)
                vm.options.push(data[i].markres)
                vm.optionstype.push('polygon')
              } else if (data[i].type === 'bezierline') {
                var newbezierline = new BEZIER.Bezierliner(recvptset, data[i].color, data[i].flag)
                bezierlines.push(newbezierline)
                vm.options.push(data[i].markres)
                vm.optionstype.push('bezierline')
              } else if (data[i].type === 'spline') {
                var newspline = new BEZIER.Bezierliner(recvptset, data[i].color, data[i].flag)
                splines.push(newspline)
                vm.options.push(data[i].markres)
                vm.optionstype.push('spline')
              }
            }
            RECT.LoadRects(rects)
            PT.LoadPTs(pointsets)
            BEZIER.LoadBezierlines(bezierlines)
            POLY.LoadPolygons(polygons)
            SPLINE.LoadSplines(splines)
          }
          vm.cleantopcanvas()
          vm.DrawTmpmode(vm.mode)
        }
      })
    },
    /****************************************************************************/
    /*                       前端DIV样式，动作相关设计                            */
    /****************************************************************************/
    // 点击标注图形,选中对应工作区
    MarkTodiv: function (type) {
      for (var i = 0; i < $('.goodsForm').length; i++) {
        $('.goodsForm')[i].style.backgroundColor = '#FFFFFF'
      }
      if (type !== 'rect') {
        if (res.selectpt > -1 && res.selectset > -1) {
          var lencnt = res.selectset
          for (i = 0; i < vm.optionstype.length; i++) {
            if (vm.optionstype[i] === type) {
              if (lencnt === 0) {
                $('.goodsForm')[i].style.backgroundColor = '#ecf5ff'
                $('#scroll')[0].scrollTop = $('.goodsForm')[i].offsetTop
                vm.optionindex = i
                break
              } else {
                lencnt--
              }
            }
          }
        }
      } else {
        if (res.i > -1) {
          lencnt = res.i
          for (i = 0; i < vm.optionstype.length; i++) {
            if (vm.optionstype[i] === type) {
              if (lencnt === 0) {
                $('.goodsForm')[i].style.backgroundColor = '#ecf5ff'
                $('#scroll')[0].scrollTop = $('.goodsForm')[i].offsetTop
                vm.optionindex = i
                break
              } else {
                lencnt--
              }
            }
          }
        }
      }
    },
    // 选中工作区文本时，选中对应图形
    select: function (index) {
      for (var i = 0; i < $('.goodsForm').length; i++) {
        if (i === index) {
          $('.goodsForm')[i].style.backgroundColor = '#ecf5ff'
        } else {
          $('.goodsForm')[i].style.backgroundColor = '#FFFFFF'
        }
      }
      if (!delflag) {
        delflag = true
        return
      }
      if (vm.optionstype[index] === 'pointset') {
        vm.mode1()
        var num = 0
        for (i = 0; i < index + 1; i++) {
          if (vm.optionstype[i] === 'pointset') {
            num = num + 1
          }
        }
        var pointset = PT.GetPointseti(num - 1)
        if (pointset !== null && pointset.pointset.length > 0) {
          res = PT.CanvasClick(pointset.pointset[0].x, pointset.pointset[0].y, 1, vm.PTindex)
          res.selectset = num - 1
          res.selectpt = 0
        }
        vm.cleantopcanvas()
        vm.DrawPTs()
      } else if (vm.optionstype[index] === 'rect') {
        vm.mode2()
        num = 0
        for (i = 0; i < index + 1; i++) {
          if (vm.optionstype[i] === 'rect') {
            num = num + 1
          }
        }
        var rect = RECT.GetRecti(num - 1)
        if (rect !== null) {
          res = RECT.CanvasClick(rect.x, rect.y, 1, res)
          res.i = num - 1
        }
        vm.cleantopcanvas()
        vm.DrawRect()
      } else if (vm.optionstype[index] === 'polygon') {
        vm.mode3()
        num = 0
        for (i = 0; i < index + 1; i++) {
          if (vm.optionstype[i] === 'polygon') {
            num = num + 1
          }
        }
        var poly = POLY.GetPolygoni(num - 1)
        if (poly !== null) {
          res = POLY.CanvasClick(poly.pointset[0].x, poly.pointset[0].y, 1)
          res.selectset = num - 1
          res.selectpt = 0
        }
        vm.cleantopcanvas()
        vm.DrawPoly()
      } else if (vm.optionstype[index] === 'bezierline') {
        vm.mode4()
        num = 0
        for (i = 0; i < index + 1; i++) {
          if (vm.optionstype[i] === 'bezierline') {
            num = num + 1
          }
        }
        var bezierline = BEZIER.GetBezierlinei(num - 1)
        if (bezierline !== null) {
          res = BEZIER.CanvasClick(bezierline.pointset[0].x, bezierline.pointset[0].y, 1)
          res.selectset = num - 1
          res.selectpt = 0
        }
        vm.cleantopcanvas()
        vm.DrawBezier()
      } else if (vm.optionstype[index] === 'spline') {
        vm.mode5()
        num = 0
        for (i = 0; i < index + 1; i++) {
          if (vm.optionstype[i] === 'spline') {
            num = num + 1
          }
        }
        var spline = SPLINE.GetSplinei(num - 1)
        if (spline !== null) {
          res = SPLINE.CanvasClick(spline.pointset[0].x, spline.pointset[0].y, 1)
          res.selectset = num - 1
          res.selectpt = 0
        }
        vm.cleantopcanvas()
        vm.DrawSpline()
      }
    },
    delradio: function (index) {
      vm.select(index)
      delflag = false
      vm.Delset()
      vm.options.splice(index, 1)
      vm.optionstype.splice(index, 1)
    },
    /****************************************************************************/
    /*                           canvas画布相关事件                              */
    /****************************************************************************/
    // 获取画布相对于浏览器的偏移
    GetTop: function (ele) {
      var offset = ele.offsetTop
      if (ele.offsetParent !== null) {
        offset += vm.GetTop(ele.offsetParent)
      }
      return offset
    },
    GetLeft: function (ele) {
      var offset = ele.offsetLeft
      if (ele.offsetParent !== null) {
        offset += vm.GetLeft(ele.offsetParent)
      }
      return offset
    },
    GetClickInfo: function (x, y) {
      let top = $('#top')
      var clickX = x - vm.GetLeft(top[0])
      var clickY = y - vm.GetTop(top[0])
      // console.log(vm.GetTop($('#top')[0]), vm.GetLeft($('#top')[0]))
      var moveclickX, moveclickY
      if (vm.rotateangle % 4 === 0) {
        moveclickX = (clickX - lefti) / scalei
        moveclickY = (clickY - topi) / scalei
      } else if (vm.rotateangle % 4 === 1) {
        moveclickX = (clickY - topi) / scalei
        moveclickY = (lefti - clickX) / scalei
      } else if (vm.rotateangle % 4 === 2) {
        moveclickX = (lefti - clickX) / scalei
        moveclickY = (topi - clickY) / scalei
      } else {
        moveclickX = (topi - clickY) / scalei
        moveclickY = (clickX - lefti) / scalei
      }
      return {
        clickX: clickX,
        clickY: clickY,
        moveclickX: moveclickX,
        moveclickY: moveclickY
      }
    },
    Rotate: function (clickX, clickY, moveclickX, moveclickY) {
      botctx.clearRect(0, 0, topcanvas.width, topcanvas.height)
      vm.rotateangle += 1
      if (vm.rotateangle >= 4) {
        vm.rotateangle = vm.rotateangle % 4
      }
      var tmpleft = lefti
      lefti = clickX + (clickY - topi)
      topi = clickY - (clickX - tmpleft)
      botctx.save()
      botctx.translate(lefti, topi)
      botctx.rotate(vm.rotateangle * Math.PI / 2)
      botctx.drawImage(img, 0, 0, width0 * scalei, height0 * scalei)
      botctx.restore()
      if (vm.mode === 0) {
        vm.DrawTmpmode(vm.tmpmode)
      } else {
        vm.DrawTmpmode(vm.mode)
      }
    },
    // 鼠标点击操作，包含点击位置的记录，不同模式下点击位置的判定
    CanvasClick: function (e) {
      pos = vm.GetClickInfo(event.clientX, event.clientY)
      // 右键旋转
      if (e.button !== 0) {
        // pos = vm.GetClickInfo(e.clientX, e.clientY)
        vm.Rotate(pos.clickX, pos.clickY, pos.moveclickX, pos.moveclickY)
        // 相关绘图--todo
        return
      }
      switch (vm.mode) {
        case 0:
          res = PIC.CanvasClick(pos.clickX, pos.clickY)
          // 移动图片
          break
        case 1:
          // 点集操作
          vm.cleantopcanvas()
          res = PT.CanvasClick(pos.moveclickX, pos.moveclickY, vm.pointradius / scalei, vm.PTindex)
          if (res.selectpt < 0) {
            vm.PTindex++
          }
          vm.DrawPTs()
          // 工作区的选中
          vm.MarkTodiv('pointset')
          break
        case 2:
          // 矩形操作
          vm.cleantopcanvas()
          res = RECT.CanvasClick(pos.moveclickX, pos.moveclickY, vm.pointradius / scalei, res)
          if (!vm.moverect) {
            res.i = -1
          }
          vm.DrawRect()
          // 工作区的选中
          vm.MarkTodiv('rect')
          break
        case 3:
          // 多边形操作
          vm.cleantopcanvas()
          res = POLY.CanvasClick(pos.moveclickX, pos.moveclickY, vm.pointradius / scalei)
          vm.DrawPoly()
          // 工作区的选中
          vm.MarkTodiv('polygon')
          break
        case 4:
          // 曲线操作
          vm.cleantopcanvas()
          res = BEZIER.CanvasClick(pos.moveclickX, pos.moveclickY, vm.pointradius / scalei)
          vm.DrawBezier()
          vm.MarkTodiv('bezierline')
          break
        case 5:
          // 拟合曲线
          vm.cleantopcanvas()
          res = SPLINE.CanvasClick(pos.moveclickX, pos.moveclickY, vm.pointradius / scalei)
          vm.DrawSpline()
          vm.MarkTodiv('spline')
          break
        default:
          break
      }
    },
    Drag: function (e) {
      if (fromnavtools || fromworkbench) {
        return
      }
      pos = vm.GetClickInfo(e.clientX, e.clientY)
      // 鼠标样式
      if (vm.mode === 0) {
        topcanvas.style.cursor = 'auto'
      } else if (vm.mode === 1) {
        topcanvas.style.cursor = PT.CursorStyle(pos.moveclickX, pos.moveclickY, vm.pointradius / scalei)
      } else if (vm.mode === 2) {
        if (!vm.moverect) {
          topcanvas.style.cursor = 'crosshair'
          vm.cleantopcanvas()
          topctx.save()
          topctx.translate(lefti, topi)
          topctx.scale(scalei, scalei)
          topctx.rotate(vm.rotateangle * Math.PI / 2)
          topctx.lineWidth = vm.linewidth / scalei
          RECT.DrawCrossline(topctx, pos.moveclickX, pos.moveclickY, width0, height0, vm.filstyNor)
          topctx.restore()
          vm.DrawRect()
        } else {
          topcanvas.style.cursor = RECT.CursorStyle(pos.moveclickX, pos.moveclickY, vm.rotateangle, vm.pointradius / scalei, res)
        }
      } else if (vm.mode === 3) {
        topcanvas.style.cursor = POLY.CursorStyle(pos.moveclickX, pos.moveclickY, vm.pointradius / scalei)
      } else if (vm.mode === 4) {
        // 相交点
        // BEZIER.IsPointOnStroke(topctx, pos.moveclickX, pos.moveclickY, lefti, topi, scalei)
        topcanvas.style.cursor = BEZIER.CursorStyle(pos.moveclickX, pos.moveclickY, vm.pointradius / scalei)
      } else if (vm.mode === 5) {
        topcanvas.style.cursor = SPLINE.CursorStyle(pos.moveclickX, pos.moveclickY, vm.pointradius / scalei)
      }
      if (e.which !== 1) {
        return
      }
      switch (vm.mode) {
        case 0:
          // 图片
          topcanvas.style.cursor = 'move'
          botctx.clearRect(0, 0, botcanvas.width, botcanvas.height)
          var ltres = PIC.Drag(pos.clickX, pos.clickY, res, lefti, topi)
          if (ltres !== null) {
            lefti = ltres.left
            topi = ltres.top
          }
          res.x = pos.clickX
          res.y = pos.clickY
          botctx.save()
          botctx.translate(lefti, topi)
          botctx.rotate(vm.rotateangle * Math.PI / 2)
          botctx.drawImage(img, 0, 0, width0 * scalei, height0 * scalei)
          botctx.restore()
          vm.DrawTmpmode(vm.tmpmode)
          break
        case 1:
          // 点集
          vm.cleantopcanvas()
          PT.Drag(pos.moveclickX, pos.moveclickY, res)
          vm.DrawPTs()
          break
        case 2:
          // 矩形
          vm.cleantopcanvas()
          topcanvas.style.cursor = RECT.CursorStyle(pos.moveclickX, pos.moveclickY, vm.pointradius / scalei, res)
          RECT.Drag(pos.moveclickX, pos.moveclickY, vm.filstyNor, res)
          if (res.i < 0) {
            topctx.save()
            topctx.translate(lefti, topi)
            topctx.scale(scalei, scalei)
            topctx.rotate(vm.rotateangle * Math.PI / 2)
            topctx.lineWidth = vm.linewidth / scalei
            RECT.DrawCrossline(topctx, pos.moveclickX, pos.moveclickY, width0, height0, vm.filstyNor, scalei)
            topctx.restore()
          }
          vm.DrawRect()
          break
        case 3:
          // 多边形
          vm.cleantopcanvas()
          POLY.Drag(pos.moveclickX, pos.moveclickY, res)
          vm.DrawPoly()
          break
        case 4:
          // 曲线
          vm.cleantopcanvas()
          BEZIER.Drag(pos.moveclickX, pos.moveclickY, res)
          vm.DrawBezier()
          break
        case 5:
          vm.cleantopcanvas()
          SPLINE.Drag(pos.moveclickX, pos.moveclickY, res)
          var points = SPLINE.Getpoints()
          topctx.save()
          topctx.translate(lefti, topi)
          topctx.scale(scalei, scalei)
          topctx.rotate(vm.rotateangle * Math.PI / 2)
          POLY.Draw(topctx, points, '#FF0000', vm.filstyZone, -1, vm.filstySP, vm.pointradius / scalei, vm.linewidth / scalei, false)
          topctx.restore()
          vm.DrawSpline()
          break
        default:
          break
      }
    },
    StopDrag: function (e) {
      fromnavtools = false
      fromworkbench = false
      if (e.which !== 1) {
        return
      }
      switch (vm.mode) {
        case 1:
          topcanvas.style.cursor = 'auto'
          break
        case 2:
          vm.cleantopcanvas()
          var addflag = RECT.StopDrag(res)
          var rect = RECT.GetRecti(-1)
          if (addflag && rect !== null) {
            var markrect = new Mark([], [], [])
            vm.options.push(markrect)
            vm.optionstype.push('rect')
          }
          vm.DrawRect()
          break
        case 3:
          topcanvas.style.cursor = 'auto'
          break
        case 4:
          topcanvas.style.cursor = 'auto'
          break
        case 5:
          topcanvas.style.cursor = 'auto'
          vm.cleantopcanvas()
          SPLINE.StopDrag(res)
          vm.DrawSpline()
          break
        default:
          break
      }
    },
    mousescale: function (e) {
      pos = vm.GetClickInfo(e.clientX, e.clientY)
      var delta = 1 + e.wheelDelta / 1200
      lefti -= (pos.clickX - lefti) * (delta - 1)
      topi -= (pos.clickY - topi) * (delta - 1)
      scalei = scalei * delta
      botctx.save()
      botctx.clearRect(0, 0, botcanvas.width, botcanvas.height)
      botctx.translate(lefti, topi)
      botctx.rotate(vm.rotateangle * Math.PI / 2)
      botctx.drawImage(img, 0, 0, width0 * scalei, height0 * scalei)
      botctx.restore()
      vm.cleantopcanvas()
      if (vm.mode === 0) {
        vm.DrawTmpmode(vm.tmpmode)
      } else {
        vm.DrawTmpmode(vm.mode)
      }
    },
    leavecanvas: function (e) {
      // 移出画布
      console.log('leavecanvas')
    },
    leavenavtools: function (e) {
      if (e.which === 1) {
        fromnavtools = true
      }
    },
    leaveworkbench: function (e) {
      if (e.which === 1) {
        fromworkbench = true
      }
    },
    // 画布清除操作
    cleantopcanvas: function () {
      topctx.clearRect(0, 0, topcanvas.width, topcanvas.height)
    },
    /****************************************************************************/
    /*                                 功能函数                                  */
    /****************************************************************************/
    changemode: function (mode) {
      switch (mode) {
        case 0:
          vm.mode0()
          break
        case 1:
          vm.mode1()
          break
        case 2:
          vm.mode2()
          break
        case 3:
          vm.mode3()
          break
        case 4:
          vm.mode4()
          break
        case 5:
          vm.mode5()
          break
        case 999:
          vm.mode999()
          break
      }
    },
    // 移动图片
    mode0: function () {
      res = null
      vm.tmpmode = vm.mode
      vm.mode = 0
    },
    // 预览模式
    mode999: function () {
      res = null
      vm.tmpmode = vm.mode
      vm.mode = 999
      vm.cleantopcanvas()
      vm.DrawAll()
    },
    // 描点显示模式
    mode1: function () {
      res = null
      vm.completeflag = false
      vm.mode = 1
      vm.cleantopcanvas()
      vm.DrawPTs()
    },
    // 矩形显示模式
    mode2: function () {
      res = null
      vm.completeflag = true
      vm.mode = 2
      vm.cleantopcanvas()
      vm.DrawRect()
    },
    // 多边形显示模式
    mode3: function () {
      res = null
      vm.completeflag = true
      vm.mode = 3
      vm.cleantopcanvas()
      vm.DrawPoly()
    },
    // 贝塞尔区域显示模式
    mode4: function () {
      res = null
      vm.completeflag = true
      vm.mode = 4
      vm.cleantopcanvas()
      vm.DrawBezier()
    },
    // 拟合曲线
    mode5: function () {
      res = null
      vm.completeflag = true
      vm.mode = 5
      vm.cleantopcanvas()
      vm.DrawSpline()
    },
    // 折线
    polyline: function () {
      res = null
      vm.mode3()
      vm.completeflag = false
    },
    // 曲线
    spline: function () {
      res = null
      vm.mode5()
      vm.completeflag = false
    },
    Complete: function () {
      switch (vm.mode) {
        case 0:
          window.alert('不能在移动模式下完成，请切换回相应模式')
          break
        case 1:
          var points = PT.GetPoints()
          if (vm.pointSetRest && vm.pointSetRest.max) {
            if (points.length > vm.pointSetRest.max) {
              vm.$notify.error({
                title: '描点',
                message: '点数超过' + vm.pointSetRest.max,
                duration: 2000
              })
              return
            }
          }
          if (vm.pointSetRest && vm.pointSetRest.min) {
            if (points.length < vm.pointSetRest.min) {
              vm.$notify.error({
                title: '描点',
                message: '点数少于' + vm.pointSetRest.min,
                duration: 2000
              })
              return
            }
          }
          vm.cleantopcanvas()
          var len1 = PT.Complete(vm.filstyNor)
          if (len1 > 0) {
            var markpointset = new Mark([], [], [])
            vm.options.push(markpointset)
            vm.optionstype.push('pointset')
          }
          vm.PTindex = 0
          vm.DrawPTs()
          break
        case 2:
          // stopdrag中处理
          break
        case 3:
          vm.cleantopcanvas()
          len1 = POLY.Complete(vm.filstyNor, vm.completeflag)
          if (len1 > 0) {
            var markpolygon = new Mark([], [], [])
            vm.options.push(markpolygon)
            vm.optionstype.push('polygon')
          }
          vm.DrawPoly()
          break
        case 4:
          vm.cleantopcanvas()
          len1 = BEZIER.Complete(vm.filstyNor, vm.completeflag)
          if (len1 > 0) {
            var markbezierline = new Mark([], [], [])
            vm.options.push(markbezierline)
            vm.optionstype.push('bezierline')
          }
          vm.DrawBezier()
          break
        case 5:
          vm.cleantopcanvas()
          len1 = SPLINE.Complete(vm.filstyNor, vm.completeflag)
          if (len1 > 0) {
            var markspline = new Mark([], [], [])
            vm.options.push(markspline)
            vm.optionstype.push('spline')
          }
          vm.DrawSpline()
          break
        default:
          break
      }
    },
    Undo: function () {
      if (vm.mode === 1) {
        vm.cleantopcanvas()
        PT.Undo()
        if (vm.PTindex > 0) {
          vm.PTindex = vm.PTindex - 1
        }
        vm.DrawPTs()
      } else if (vm.mode === 2) {
        // Nothing
      } else if (vm.mode === 3) {
        vm.cleantopcanvas()
        POLY.Undo()
        vm.DrawPoly()
      } else if (vm.mode === 4) {
        vm.cleantopcanvas()
        BEZIER.Undo()
        vm.DrawBezier()
      } else if (vm.mode === 5) {
        vm.cleantopcanvas()
        SPLINE.Undo()
        vm.DrawSpline()
      }
    },
    Delpt: function () {
      if (res === null) {
        return
      }
      if (vm.mode === 1) {
        vm.cleantopcanvas()
        if (PT.Delpt(res) === 0) {
          if (vm.optionindex > -1) {
            vm.options.splice(vm.optionindex, 1)
            vm.optionstype.splice(vm.optionindex, 1)
          }
        }
        res.selectpt = -1
        vm.optionindex = -1
        vm.DrawPTs()
      } else if (vm.mode === 2) {
        vm.cleantopcanvas()
        RECT.Del(res)
        if (vm.optionindex > -1) {
          vm.options.splice(vm.optionindex, 1)
          vm.optionstype.splice(vm.optionindex, 1)
        }
        res.i = -1
        vm.optionindex = -1
        vm.DrawRect()
      } else if (vm.mode === 3) {
        vm.cleantopcanvas()
        if (POLY.Delpt(res) === 0) {
          if (vm.optionindex > -1) {
            vm.options.splice(vm.optionindex, 1)
            vm.optionstype.splice(vm.optionindex, 1)
          }
        }
        res.selectpt = -1
        vm.optionindex = -1
        vm.DrawPoly()
      } else if (vm.mode === 4) {
        vm.cleantopcanvas()
        if (BEZIER.Delpt(res) === 0) {
          if (vm.optionindex > -1) {
            vm.options.splice(vm.optionindex, 1)
            vm.optionstype.splice(vm.optionindex, 1)
          }
        }
        res.selectpt = -1
        vm.optionindex = -1
        vm.DrawBezier()
      } else if (vm.mode === 5) {
        vm.cleantopcanvas()
        if (SPLINE.Delpt(res) === 0) {
          if (vm.optionindex > -1) {
            vm.options.splice(vm.optionindex, 1)
            vm.optionstype.splice(vm.optionindex, 1)
          }
        }
        res.selectpt = -1
        vm.optionindex = -1
        vm.DrawSpline()
      }
    },
    Delset: function () {
      if (res === null) {
        return
      }
      if (vm.mode === 1) {
        vm.cleantopcanvas()
        PT.Delset(res)
        res.selectpt = -1
        res.selectset = -1
        vm.DrawPTs()
      } else if (vm.mode === 2) {
        vm.cleantopcanvas()
        RECT.Del(res)
        res.i = -1
        vm.DrawRect()
      } else if (vm.mode === 3) {
        vm.cleantopcanvas()
        POLY.Delset(res)
        res.selectpt = -1
        res.selectset = -1
        vm.DrawPoly()
      } else if (vm.mode === 4) {
        vm.cleantopcanvas()
        BEZIER.Delset(res)
        res.selectpt = -1
        res.selectset = -1
        vm.DrawBezier()
      } else if (vm.mode === 5) {
        vm.cleantopcanvas()
        SPLINE.Delset(res)
        res.selectpt = -1
        res.selectset = -1
        vm.DrawSpline()
      }
    },
    // reset需要初始旋转角度
    Reset: function () {
      lefti = initlefti
      topi = inittopi
      scalei = 1
      vm.rotateangle = initangle
      botctx.clearRect(0, 0, botcanvas.width, botcanvas.height)
      botctx.save()
      botctx.translate(lefti, topi)
      botctx.rotate(vm.rotateangle * Math.PI / 2)
      botctx.drawImage(img, 0, 0, width0 * scalei, height0 * scalei)
      botctx.restore()

      vm.cleantopcanvas()
      vm.DrawTmpmode(vm.mode)
    },
    Clear: function () {
      res = null
      PT.Clear()
      RECT.Clear()
      POLY.Clear()
      BEZIER.Clear()
      SPLINE.Clear()
      vm.options = []
      vm.optionstype = []
      vm.PTindex = 0
      vm.cleantopcanvas()
      // vm.DrawTmpmode(vm.mode)
    }
  }
}
/****************************************************************************/
/*                                 快捷键                                   */
/****************************************************************************/
var tmpcode = true
function bindKeyEvent () {
  document.onkeydown = function (event) {
    if (event.keyCode === 18 && tmpcode) {
    // vm.tmpmode = vm.mode
      vm.mode0()
      tmpcode = false
    }
    if (event.keyCode === 16 && tmpcode) {
      vm.mode999()
      tmpcode = false
    }
    if (event.ctrlKey && tmpcode) {
      vm.moverect = true
      tmpcode = false
    }
    if (event.keyCode === 90 && event.ctrlKey) {
    // ctrl + z 撤销
    // 屏蔽浏览器的默认快捷键
      event.returnValue = false
      vm.Undo()
    }
    if (event.keyCode === 65 && event.ctrlKey) {
      // ctrl + A 保存
      event.returnValue = false
      vm.Complete()
    }
    if (event.keyCode === 83 && event.ctrlKey) {
      // ctrl + S 提交
      if (vm.PostButtonVisible === false) {
        return
      }
      event.returnValue = false
      vm.postTask()
    }
    if (event.keyCode === 68 && event.ctrlKey) {
      // ctrl + D 删除
      event.returnValue = false
      vm.Delpt()
    }
  }
  document.onkeyup = function (event) {
    tmpcode = true
    if (event.keyCode === 18 || event.keyCode === 16) {
      // vm.mode = vm.tmpmode
      vm.changemode(vm.tmpmode)
    }
    if (event.keyCode === 17) {
      vm.moverect = false
    }
  }
}
</script>
<style>
body {
  padding-top:56px;
}
.content {
  flex: 1 0 auto;
}
.ql-container {
  height: 150px;
}
.goodsForm {
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #b3d8ff;
}
/* .el-select .el-input {
  width: 100px;
} */
.input-with-select .el-input-group__prepend {
  background: rgba(255,255,255,0.5);
}
#con {
  height: 100%;
  width: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column
}
#canvascontainer {
	position: relative;
	margin:0 auto;
	height:100%;
	width:100%;
}
#bot {
	position: absolute;
	background: #C0C4CC;
	z-index: 1;
}
#top {
	position: absolute;
	z-index: 2;
}
.item-del{
  display: flex;
  justify-content: space-between;
}
#wholeMark .el-radio,
#wholeMark .el-checkbox,
#vQuesDoDiv .el-radio,
#vQuesDoDiv .el-checkbox,
#vQuesCheckDiv .el-radio,
#vQuesCheckDiv .el-checkbox{
  color: #f8f9fa
}
</style>
<style scoped>
.position-div {
  top: 0;
  bottom: 0;
  background:rgba(0,0,0,0.2);
}
.nav-tools {
  left: 0;
  max-width:220px;
}
.workbench {
  right: 0;
  width: 280px;
  min-width:250px;
  max-width: 700px;
}
.z-index-999 {
  z-index: 999;
}
.nav-tools-box::-webkit-scrollbar {
  width: 8px;
  height: 4px;
}
.nav-tools-box::-webkit-scrollbar-thumb {
  border-radius: 5px;
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, .3);
   background: rgba(0, 0, 0, .2);
}
.nav-tools-box::-webkit-scrollbar-track {
  border-radius: 0;
}
.rLeft {
  cursor:e-resize;
  z-index:1000;
  background:rgba(0, 0, 0, 0.2);
  width:.25rem;
}
</style>
