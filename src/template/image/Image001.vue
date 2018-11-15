<template>
  <div id="con">
    <el-button-group display="inline" class="work-btn">
      <el-button type="primary" @click="preview" icon="el-icon-view">{{$t("labelTool.preview")}}</el-button>
      <el-button id="move" type="primary" @click="mode0" icon="el-icon-rank">{{$t("labelTool.move")}}</el-button>
      <el-button v-if="SopType >= 1002 && SopType <=1003" id="rect" type="primary" @click="mode3" icon="el-icon-edit-outline">{{$t("labelTool.rect")}}</el-button>
      <el-button v-if="SopType ===1003" id="point" type="primary" @click="mode1">{{$t("labelTool.point")}}</el-button>
      <el-button v-if="SopType ===1003" id="polygon" type="primary" @click="mode2">{{$t("labelTool.ploygon")}}</el-button>
      <el-button v-if="SopType ===1003" id="polyline" type="primary" @click="polyline">{{$t("labelTool.polyline")}}</el-button>
      <el-button v-if="SopType ===1003" id="bezier" type="primary" @click="mode4">{{$t("labelTool.bezier")}}</el-button>
      <el-button v-if="SopType ===1003" id="bezierline" type="primary" @click="bezierline">{{$t("labelTool.bezierline")}}</el-button>
      <el-button v-if="SopType ===1003" id="keypoint" type="primary" @click="mode11">关键点</el-button>
      <!-- <el-button v-if="SopType ===1003" type="primary" @click="magicmode">魔法</el-button> -->
      <!-- <el-button v-if="SopType ===1003" type="primary" @click="test110">测试加载</el-button> -->
      <el-button v-if="SopType ===1003 && mode !== 3" id="comp" type="primary" @click="complete">{{$t("labelTool.complete")}}</el-button>
      <el-button id="del" type="primary" @click="del" icon="el-icon-delete">{{$t("labelTool.delete")}}</el-button>
      <el-button v-if="SopType >= 1002 && SopType <=1003 || SopType ===1010" id="undo" type="primary" @click="undo" icon="el-icon-delete">{{$t("labelTool.recall")}}</el-button>
      <el-button id="clear" type="primary" @click="clear" icon="el-icon-refresh">{{$t("labelTool.clear")}}</el-button>
      <el-button id="reset" type="primary" @click="reset" icon="el-icon-refresh">{{$t("labelTool.reset")}}</el-button>
      <el-button v-if="PostButtonVisible === true" id="post" type="primary" @click="postTask" icon="el-icon-check">{{$t("taskPublic.submitTask")}}</el-button>
      <!-- <el-button id="test" type="primary" @click="test">测试</el-button> -->
      <el-button v-if="SopType ===1010" id="facept" type="primary" @click="mode110">卡通人脸</el-button>
      <slot></slot>
    </el-button-group>
    <div display="inline" style="padding:0; margin:0 auto;display:flex">
      <el-button type="text">{{$t("labelTool.filstyNor")}}</el-button>
      <el-color-picker v-model="filstyNor"></el-color-picker>
      <el-button type="text">{{$t("labelTool.filstySP")}}</el-button>
      <el-color-picker v-model="filstySP"></el-color-picker>
      <el-button type="text">{{$t("labelTool.filstySPs")}}</el-button>
      <el-color-picker v-model="filstySPs"></el-color-picker>
      <el-button type="text">{{$t("labelTool.pointradius")}}</el-button>
      <el-slider v-model="pointradius" :min=0 :max=10 style="width:100px"></el-slider>
      <el-button type="text">{{$t("labelTool.linewidth")}}</el-button>
      <el-slider v-model="linewidth" :min=0 :max=10 style="width:100px"></el-slider>
      <el-button type="text">标号大小</el-button>
      <el-slider v-model="numsize" :min=1 :max=40 style="width:100px"></el-slider>
    </div>
    <div id="canvascontainer" onselectstart="return false">
      <canvas id="bot" ref="botcanvas" ></canvas>
      <canvas id="top" ref="topcanvas" @mousedown="canvasClick" @mousemove="drag" @mouseup="stopDrag" @mousewheel="mousescale" @mouseleave="leavecanvas"></canvas>
      <div v-show="mode===11" id="tools">
        <div id="preboard">
          <span>当前标签:{{curindex}}</span><br>
          <el-input-number v-model="curindex" :min="1" :max="100000"></el-input-number>
          <!-- <span><h1>当前编号:{{curindex}}</h1></span>
          <el-button @click="curindex = curindex + 1">下一个</el-button>
          <el-button @click="curindex = curindex - 1">上一个</el-button> -->
        </div>
      </div>
    </div>
    <DragDiv class="drag-div" :title="$t('labelTool.workbanch')" :dragHeight="dragHeight" startY=80 startX=5>
      <div id="vQuesDoDiv" class="border border-primary rounded mb-3">
        <div class="p-3" v-for="(messageLab,messIndex) in vQuesDo" :key='messageLab.title'>
          <p class="text-secondary mb-2 ques-title">{{messIndex + 1}}.{{messageLab.title}}:</p>
          <el-radio-group v-model="vQuesDoContents[messIndex].label" style="display:block">
            <el-radio  v-for="(lab,num) in messageLab.vlabels" :key='lab' :label="num">{{lab.name}} </el-radio>
          </el-radio-group>
          <el-input v-model="vQuesDoContents[messIndex].text"
            v-if="otherItem(messageLab.vlabels, vQuesDoContents[messIndex], messIndex)">
          </el-input>
        </div>
      </div>
      <div id="vQuesCheckDiv" class="border border-primary rounded mb-3">
        <div class="p-3" v-for="(messageLab,messIndex) in vQuesCheck" :key='messageLab.title'>
          <p class="text-secondary mb-2 ques-title">{{messIndex + 1}}.{{messageLab.title}}:</p>
          <el-radio-group v-model="vQuesCheckContents[messIndex].label" style="display:block" disabled>
            <el-radio  v-for="(lab,num) in messageLab.vlabels" :key='lab' :label="num">{{lab.name}} </el-radio>
          </el-radio-group>
          <el-input v-model="vQuesCheckContents[messIndex].text" disabled
            v-if="messageLab.needText === true">
          </el-input>
        </div>
      </div>
      <!-- <el-card class="box-card"> -->
      <div v-if="request !== ''" id="titleMark" style="border: 1px solid #b3d8ff;">
        <span>{{request}}</span><br>
      </div>
      <div id="wholeMark" class="border border-primary rounded mb-3 p-2">
        <div class="m-2" v-for="(messageLab,messIndex) in wholeRadios" :key='messageLab.title'>
          <p class="text-secondary mb-2 ques-title">{{messIndex + 1}}.{{messageLab.title}}:</p>
          <el-radio-group v-model="wholeRadioContents[messIndex]" style="display:block">
            <el-radio  v-for="(lab,num) in messageLab.labels" :key='lab' :disabled="TagDisabled" :label="num">{{lab.name}} </el-radio>
          </el-radio-group>
        </div>
        <div class="m-2" v-for="(messageLab,messIndex) in wholeCheckBoxs" :key='messageLab.title'>
          <p class="text-secondary mb-2 ques-title">{{messIndex + 1 + wholeRadios.length}}.{{messageLab.title}}:</p>
          <el-checkbox-group v-model="wholeCheckBoxContents[messIndex]">
            <el-checkbox v-for="(lab,num) in messageLab.labels" :key='lab' :disabled="TagDisabled" :label="num">{{lab.name}}</el-checkbox>
          </el-checkbox-group>
        </div>
        <div class="m-2" v-for="(title,index) in wholeInputs" :key='index'>
          <p class="text-secondary mb-2 ques-title">{{index + 1 + wholeRadios.length + wholeCheckBoxs.length}}.{{title}}</p>
          <el-input :placeholder="$t('labelTool.please')" :disabled="TagDisabled" v-model="wholeInputContents[index]"></el-input>
        </div>
      </div>
      <div id="mon" class="border border-primary rounded mb-3 p-2" v-show="options.length > 0">
        <div v-for="(item,oindex) in options" :key="item" class="goodsForm" @click="select(oindex)" style="background: #ecf5ff">
          <div class="item-del">
            <span>id:{{oindex}}</span>
            <el-button slot="append" type="danger" icon="el-icon-delete" size="mini" @click="delradio(oindex)"></el-button>
          </div>
          <!-- <div style="margin-top:30px;margin-bottom:30px;"> -->
        <!-- <el-form :model="options" ref="options"> -->
          <div class="m-2" v-for="(messageLab,messIndex) in itemRadios" :key='messageLab.title'>
            <p class="text-secondary mb-2 ques-title">{{oindex}}.{{messIndex + 1}}.{{messageLab.title}}:</p>
            <!-- <el-radio-group v-model="itemRadioContents[oindex][messIndex]" style="margin-top: 5px"> -->
            <!-- <el-form-item :prop="'options.' + oindex + '.itemRadioContents.' + messIndex" :rules="{required:true}"> -->
            <el-radio-group v-model="options[oindex].itemRadioContents[messIndex]" style="margin-top: 5px">
              <el-radio  v-for="(lab,num) in messageLab.labels" :key='lab' :disabled="TagDisabled" :label="num">{{lab.name}} </el-radio>
            </el-radio-group>
            <!-- </el-form-item> -->
          </div>
        <!-- </el-form> -->
          <div class="m-2" v-for="(messageLab,messIndex) in itemCheckBoxs" :key='messageLab.title'>
            <p class="text-secondary mb-2 ques-title">{{oindex}}.{{messIndex + 1 + itemRadios.length}}.{{messageLab.title}}</p>
            <!-- <el-checkbox-group v-model="itemCheckBoxContents[oindex][messIndex]" style="margin-top: 5px"> -->
            <el-checkbox-group v-model="options[oindex].itemCheckBoxContents[messIndex]" style="margin-top: 5px">
              <el-checkbox v-for="(lab,num) in messageLab.labels" :key='lab' :disabled="TagDisabled" :label="num">{{lab.name}}</el-checkbox>
            </el-checkbox-group>
          </div>
          <div class="m-2" v-for="(title,index) in itemInputs" :key='index'>
            <p class="text-secondary mb-2 ques-title">{{oindex}}.{{index + 1 + itemRadios.length + itemCheckBoxs.length}}.{{title}}</p>
            <!-- <el-input placeholder="请输入内容" v-model="itemInputContents[oindex][index]" style="margin-top: 5px"></el-input> -->
            <el-input :placeholder="$t('labelTool.please')" :disabled="TagDisabled" v-model="options[oindex].itemInputContents[index]" style="margin-top: 5px"></el-input>
          </div>
          <!-- </div> -->
        </div>
      </div>
      <!-- </el-card> -->
      <div v-show="CommentVisible">
        <div>{{$t("taskPublic.editor")}}:</div>
        <div id="editor"></div>
      </div>
    </DragDiv>
  </div>
</template>
<script>
import $ from 'jquery'
import ClipboardJS from 'clipboard'
import Quill from 'quill'
import DragDiv from 'lib/dragdiv/dragdiv'
import * as floodFill from './floodfill.js'
import {language} from 'lang'

// 解除浏览器右键事件
document.oncontextmenu = function (e) {
  e.cancelBubble = true
  return false
}
var addface = false
var facept = []
var facepts = []
// 卡通人脸的保存
function Facepter (pointset, color) {
  this.pointset = pointset
  this.color = color
}
// 旋转缩放相关
var tmpl = 0
var tmpt = 0
// 魔法选取相关定义
var tmpdata = []
var img001 = new Image()
// 暂存
var tscale
var ttop
var tleft

var filstyZone = 'rgba(255,255,255,0)'
// 连续描点，笔迹标志clickflag
var clickflag = false
var bezierlines = []
var bezierline = []
// var completeflag = true
var childnode = 0 // 选中位置常量，用来判断选中位置
var Left = 0
var Top = 0
// var maxcanvasheight
// var maxcanvaswidth
var newPTs = []
var newPTsets = []
var points = []
var polygon = []
var rect
// var submitdata = []
var pointsets = []
var polygons = []
var rects = []
// 由于删除按钮元素的覆盖，执行delradio后会执行select，引入delflag
var delflag = true
// 点
function Pointer (x, y) {
  this.x = x
  this.y = y
  this.isSelected = false
}
function NewPt (x, y, index) {
  this.x = x
  this.y = y
  this.index = index
  this.isSelected = false
}
function PNpt (x, y, index) {
  this.x = Math.round(x)
  this.y = Math.round(y)
  this.index = index
}
// 存储的点
function Pt (x, y) {
  this.x = Math.round(x)
  this.y = Math.round(y)
}
// 矩形
function Recter (x, y, width, height) {
  this.x = x
  this.y = y
  this.width = width
  this.height = height
  this.isSelected = false
}
// function Markrect (value, text) {
//   this.value = value
//   this.text = text
// }
// 提交数据类型
function SubmitData (type, color, flag, pointset, markres) {
  this.type = type
  this.color = color
  this.flag = flag
  this.pointset = pointset
  this.markres = markres
}

// 点集的保存
function Pointseter (pointset, color) {
  this.pointset = pointset
  this.color = color
}
// 点集的标注
// function Markpointset (value, text) {
//   this.value = value
//   this.text = text
// }

// 多边形的保存
function Polygoner (pointset, color, flag) {
  this.pointset = pointset
  this.color = color
  this.flag = flag
}
// 图像标注结果的结构体，方便进行序列化
// function Markploygon (value, text) {
//   this.value = value
//   this.text = text
// }
// 曲线的保存
function Bezierliner (pointset, color, flag) {
  this.pointset = pointset
  this.color = color
  this.flag = flag
}
// function Markbezierline (value, text) {
//   this.value = value
//   this.text = text
// }
// 矩形的保存
function Rect (rect, color) {
  this.rect = rect
  this.color = color
}

function Mark (itemRadioContents, itemCheckBoxContents, itemInputContents) {
  this.itemRadioContents = itemRadioContents
  this.itemCheckBoxContents = itemCheckBoxContents
  this.itemInputContents = itemInputContents
}

// 将options数组分为四个栈，依次存储矩形，多边形，点阵，曲线，便于前端的选中以及查找
var rectlen = 0
var polygonlen = 0
var pointslen = 0
var bezierlen = 0
// 矩形选取相关参数
var rectx
var recty
var addrect
var lefttop
var leftbot
var righttop
var rightbot

var moveRect = false
var preflag = true
// var SelectedPointset = null
var topcanvas
var botcanvas
// var bground
var img = new Image()
var topctx
var botctx
var height0
var width0

// 坐标系顶点位置
var lefti = 0
var topi = 0
let scalei = 1.0

// clickX,clickY为相对canvascontainer的坐标
var clickX
var clickY

// moveclickX,moveclickY为相对于canvas坐标轴的坐标（若图片绘制以（0，0）为起点，即为相对图片的坐标）
var moveclickX
var moveclickY

var pointx
var pointy
var pointx0
var pointy0

var movepointx
var movepointy
var SelectedPoint = null
var SelectedRect = null
var SelectedRectNum
var SelectedPointNum
var SelectedPointsetNum
// var url = 'static/img/timg.jpg'
// var tempurl = 'static/1.jpg'
var movePoint = false
var movePicture = false

var x1
var y1
var mode = 0
var width1
var height1
var rate = 1.0
// 旋转参数
var cnt = 0

export default {
  name: 'app',
  components: {
    DragDiv
  },
  props: {
    wholeRadios: Array,
    wholeCheckBoxs: Array,
    wholeInputs: Array,
    itemRadios: Array,
    itemCheckBoxs: Array,
    itemInputs: Array,
    vQuesDo: Array,
    vQuesCheck: Array,
    vQuesCheckContents: Array,
    pointSetRest: {
      type: Object,
      default: () => {}
    },
    // helptools: Array,
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
      filstySP: '#00ff00',
      filstyNor: '#ff0000',
      filstySPs: '#0000ff',
      mode: 0,
      completeflag: true,
      curindex: 1,
      numsize: 8,
      pointradius: 2,
      linewidth: 2,
      projectid: '',
      storageKey: '',
      quill: {},
      rectRadio: '',
      option: '',
      options: [],
      desc: '',
      threshold: 30,
      tabvisable: false,
      dialogVisible: false,
      picwidth: 800,
      picheight: 800,
      markflag: false,
      buttonflag: false,
      pointset: [],
      dragHeight: 500,
      form: {
        type: '',
        color: ''
      },
      // 用于判断其他原因是否存在
      otherInput: []
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
    completeflag: function () {
      let vm = this
      if ($('#polygon')[0]) {
        $('#polygon')[0].style.backgroundColor = ''
      }
      if ($('#polyline')[0]) {
        $('#polyline')[0].style.backgroundColor = ''
      }
      if ($('#bezier')[0]) {
        $('#bezier')[0].style.backgroundColor = ''
      }
      if ($('#bezierline')[0]) {
        $('#bezierline')[0].style.backgroundColor = ''
      }
      if (vm.mode === 2) {
        if (vm.completeflag) {
          $('#polygon')[0].style.backgroundColor = '#FF0000'
        } else {
          $('#polyline')[0].style.backgroundColor = '#FF0000'
        }
      }
      if (vm.mode === 4) {
        if (vm.completeflag) {
          $('#bezier')[0].style.backgroundColor = '#FF0000'
        } else {
          $('#bezierline')[0].style.backgroundColor = '#FF0000'
        }
      }
    },
    mode: function () {
      let vm = this
      $('#move')[0].style.backgroundColor = ''
      if ($('#point')[0]) {
        $('#point')[0].style.backgroundColor = ''
      }
      if ($('#polygon')[0]) {
        $('#polygon')[0].style.backgroundColor = ''
      }
      if ($('#polyline')[0]) {
        $('#polyline')[0].style.backgroundColor = ''
      }
      if ($('#rect')[0]) {
        $('#rect')[0].style.backgroundColor = ''
      }
      if ($('#bezier')[0]) {
        $('#bezier')[0].style.backgroundColor = ''
      }
      if ($('#bezierline')[0]) {
        $('#bezierline')[0].style.backgroundColor = ''
      }
      if ($('#keypoint')[0]) {
        $('#keypoint')[0].style.backgroundColor = ''
      }
      if (vm.mode === 0) {
        $('#move')[0].style.backgroundColor = '#FF0000'
      } else if (vm.mode === 1) {
        $('#point')[0].style.backgroundColor = '#FF0000'
      } else if (vm.mode === 2) {
        if (vm.completeflag) {
          $('#polygon')[0].style.backgroundColor = '#FF0000'
        } else {
          $('#polyline')[0].style.backgroundColor = '#FF0000'
        }
      } else if (vm.mode === 3) {
        $('#rect')[0].style.backgroundColor = '#FF0000'
      } else if (vm.mode === 4) {
        if (vm.completeflag) {
          $('#bezier')[0].style.backgroundColor = '#FF0000'
        } else {
          $('#bezierline')[0].style.backgroundColor = '#FF0000'
        }
      } else if (vm.mode === 11) {
        $('#keypoint')[0].style.backgroundColor = '#FF0000'
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
      console.log('vQuesCheck watch')
      this.vQuesCheckContents = []
      this.vQuesCheck.forEach(() => {
        this.vQuesCheckContents.push({
          label: '',
          text: ''
        })
      })
    },
    pointradius: function () {
      let vm = this
      if (mode === 1) {
        vm.cleantopcanvas()
        vm.drawPoints()
      } else if (mode === 2) {
        vm.cleantopcanvas()
        vm.drawPolygons()
      } else if (mode === 3) {
        vm.cleantopcanvas()
        vm.drawRects()
      } else if (mode === 4) {
        vm.cleantopcanvas()
        vm.drawBezierlines()
      } else if (mode === 11) {
        vm.cleantopcanvas()
        vm.drawNewPt()
      }
    },
    numsize: function () {
      let vm = this
      if (mode === 1) {
        vm.cleantopcanvas()
        vm.drawPoints()
      } else if (mode === 11) {
        vm.cleantopcanvas()
        vm.drawNewPt()
      }
    },
    linewidth: function () {
      let vm = this
      if (mode === 1) {
        vm.cleantopcanvas()
        vm.drawPoints()
      } else if (mode === 2) {
        vm.cleantopcanvas()
        vm.drawPolygons()
      } else if (mode === 3) {
        vm.cleantopcanvas()
        vm.drawRects()
      } else if (mode === 4) {
        vm.cleantopcanvas()
        vm.drawBezierlines()
      } else if (mode === 110) {
        vm.cleantopcanvas()
        vm.drawFacepts()
      }
    },
    options: function () {
      for (let key in this.options) {
        // // 标注项单选
        // if (!Array.isArray(this.itemRadioContents[key])) {
        //   this.$set(this.itemRadioContents, key, [])
        // }
        // // 标注项多选
        // if (!Array.isArray(this.itemCheckBoxContents[key])) {
        //   // 将itemCheckBoxContents变成二维数组
        //   this.$set(this.itemCheckBoxContents, key, [])
        //   for (let num in this.itemCheckBoxs) {
        //     if (!Array.isArray(this.itemCheckBoxContents[key][num])) {
        //       // 将itemCheckBoxContents变成三维数组
        //       this.$set(this.itemCheckBoxContents[key], num, [])
        //     }
        //   }
        // }
        // // 标注项多选 --options的添加！！！！！！！！
        // if (!Array.isArray(this.options[key].itemCheckBoxContents)) {
        //   // 将itemCheckBoxContents变成二维数组
        //   this.$set(this.options[key], 'itemCheckBoxsContents', [])
        //   // for (let num in this.itemCheckBoxs) {
        //   //   if (!Array.isArray(this.options[key].itemCheckBoxContents[num])) {
        //   //     // 将itemCheckBoxContents变成三维数组
        //   //     this.$set(this.options[key].itemCheckBoxContents, num, [])
        //   //   }
        //   // }
        // }
        for (let num in this.itemCheckBoxs) {
          if (!Array.isArray(this.options[key].itemCheckBoxContents[num])) {
            // 将itemCheckBoxContents变成三维数组
            this.$set(this.options[key].itemCheckBoxContents, num, [])
          }
        }
        // 标注项填空
        // if (!Array.isArray(this.itemInputContents[key])) {
        //   this.$set(this.itemInputContents, key, [])
        // }
      }
    },
    itemCheckBoxs: function () {
      for (let key in this.options) {
        // 标注项多选
        // if (!Array.isArray(this.itemCheckBoxContents[key])) {
        //   // 将itemCheckBoxContents变成二维数组
        //   this.$set(this.itemCheckBoxContents, key, [])
        // }
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
    // console.log('child mounted')
    let vm = this
    // 计算工作区高度=浏览器高度-上下组件高度和
    // 目前后者先写死成137吧
    let h = document.documentElement.clientHeight || document.body.clientHeight
    vm.dragHeight = h - 137
    tapp = this
    $('#move')[0].style.backgroundColor = '#FF0000'
    // console.log($('#canvascontainer').clientWidth())
    topcanvas = $('#top')[0]
    botcanvas = $('#bot')[0]
    topctx = topcanvas.getContext('2d')
    botctx = botcanvas.getContext('2d')
    // vm.gettask()
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
    /****************************/
    // // 初始缩放比例的计算
    // // 图片加载相关
    // // console.log($('#canvascontainer')[0].clientWidth)
    // width1 = $('#canvascontainer')[0].clientWidth * 0.5
    // height1 = $('#canvascontainer')[0].clientHeight
    // // topcanvas = this.$refs.topcanvas
    // // botcanvas = this.$refs.botcanvas
    // topcanvas = $('#top')[0]
    // botcanvas = $('#bot')[0]
    // // console.log(topcanvas)
    // topctx = topcanvas.getContext('2d')
    // // console.log(topctx)
    // botctx = botcanvas.getContext('2d')
    // img = new Image()
    // img.src = tempurl
    // // width0,height0为图片的实时大小
    // // width1,height1为画布的大小
    // // img.width,height为图片原始尺寸
    // img.onload = function () {
    //   // console.log('huatu')
    //   width0 = img.width
    //   height0 = img.height
    //   // console.log('width0:', width0, height0)
    //   // console.log('img:', img.width, img.height)
    //   if ((img.width > width1) || (img.height > height1)) {
    //     if (img.width / width1 > img.height / height1) {
    //       rate = width0 / width1
    //       height0 = img.height / (width0 / width1)
    //       width0 = width1
    //     } else {
    //       rate = height0 / height1
    //       width0 = img.width / (height0 / height1)
    //       height0 = height1
    //     }
    //   }
    //   topcanvas.width = width1
    //   topcanvas.height = height1
    //   botcanvas.width = width1
    //   botcanvas.height = height1
    //   // console.log(width1, height1)
    //   botctx.drawImage(img, 0, 0, width0, height0)
    //   // 创建魔法选取底图
    //   tmpdata = topctx.createImageData(botcanvas.width, botcanvas.height)
    // }
    /*************************************/

    // 初始化编辑器
    vm.quill = new Quill('#editor', {
      placeholder: '请输入...',
      modules: {
        toolbar: ['bold', 'italic', 'underline', 'strike']
      },
      theme: 'snow'
    })
    if (vm.CommentReadOnly === 'true') {
      vm.quill.enable(false)
    }
    // 事件绑定按后来者覆盖之前的修改，因此放到mouted里，用哪个模板，哪个模板来绑定
    bindKeyEvent()
  },
  methods: {
    // test () {
    //   let vm = this
    //   console.log(this.otherInput)
    //   // console.log(this.vQuesCheckContents)
    //   // console.log(this.wholeCheckBoxContents)
    //   // console.log(this.wholeCheckBoxs)
    //   // vm.imageload(tempurl, vm.getResult(), '')
    // },
    /****************************************************************************/
    /*                     前后端交互接口,get,post,getresult                     */
    /****************************************************************************/
    // 数据验证
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
    // 提交任务，包含点集，描述，url等一系列数据
    postTask (form) {
      let vm = this
      // console.log(this.$refs['options'])
      if (!vm.valid()) {
        vm.$notify.error({
          title: language('taskPublic.error'),
          message: language('labelTool.errorMessage'),
          duration: 2000
        })
        return
      }
      if (points.length > 0) {
        vm.$notify.error({
          title: '描点',
          message: '存在未完成点集，请先完成',
          duration: 2000
        })
        return
      }
      if (polygon.length > 0) {
        vm.$notify.error({
          title: '多边形',
          message: '存在未完成多边形或折线，请先完成',
          duration: 2000
        })
        return
      }
      if (bezierline.length > 0) {
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
      let vm = this
      vm.wholeRadioContents = []
      vm.wholeInputContents = []
      for (let key in this.wholeCheckBoxs) {
        this.$set(this.wholeCheckBoxContents, key, [])
      }
    },
    // imageload加载数据
    imageload: function (src, result, commit) {
      let vm = this
      // 初始化各项数据
      lefti = 0
      topi = 0
      scalei = 1.0
      vm.options = []
      rectlen = 0
      polygonlen = 0
      pointslen = 0
      bezierlen = 0
      pointsets = []
      newPTsets = []
      polygons = []
      rects = []
      rate = 1.0
      bezierlines = []
      // 初始缩放比例的计算
      // 图片加载相关
      // console.log($('#canvascontainer')[0].clientWidth)
      width1 = $('#canvascontainer')[0].clientWidth * 0.5
      height1 = $('#canvascontainer')[0].clientHeight
      // topcanvas = this.$refs.topcanvas
      // botcanvas = this.$refs.botcanvas
      topcanvas = $('#top')[0]
      botcanvas = $('#bot')[0]
      // console.log(topcanvas)
      topctx = topcanvas.getContext('2d')
      // console.log(topctx)
      botctx = botcanvas.getContext('2d')
      img = new Image()
      vm.commit = commit
      img.src = src
      // width0,height0为图片的实时大小
      // width1,height1为画布的大小
      // img.width,height为图片原始尺寸
      if (commit) {
        vm.quill.setText(commit)
      } else {
        vm.quill.setText('')
      }
      img.onload = function () {
        // console.log('huatu')
        width0 = img.width
        height0 = img.height
        // console.log('width0:', width0, height0)
        // console.log('img:', img.width, img.height)
        if ((img.width > width1) || (img.height > height1)) {
          if (img.width / width1 > img.height / height1) {
            rate = width0 / width1
            height0 = img.height / (width0 / width1)
            width0 = width1
          } else {
            rate = height0 / height1
            width0 = img.width / (height0 / height1)
            height0 = height1
          }
        }
        topcanvas.width = width1
        topcanvas.height = height1
        botcanvas.width = width1
        botcanvas.height = height1
        // console.log(width1, height1)
        botctx.drawImage(img, 0, 0, width0, height0)
        // 创建魔法选取底图
        tmpdata = topctx.createImageData(botcanvas.width, botcanvas.height)
        if (!result || result === '') {
          vm.clearAll()
          return
        }
        console.log(result)
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
        if (data) {
          for (var i = 0; i < data.length; i++) {
          // 矩形解析
            if (data[i].type === 'rect') {
              let recvrect = new Recter(data[i].pointset[0].x / rate, data[i].pointset[0].y / rate, data[i].pointset[1].x / rate - data[i].pointset[0].x / rate, data[i].pointset[1].y / rate - data[i].pointset[0].y / rate)
              let newrecvrect = new Rect(recvrect, data[i].color)
              rects.push(newrecvrect)
              vm.options.push(data[i].markres)
              rectlen = rectlen + 1
            } else if (data[i].type === 'polygon') {
              let newrecvpolygon = []
              for (var j = 0; j < data[i].pointset.length; j++) {
                let recvpolygonpoint = new Pointer(data[i].pointset[j].x / rate, data[i].pointset[j].y / rate)
                newrecvpolygon.push(recvpolygonpoint)
              }
              var newpolygon
              if (data[i].hasOwnProperty('color') && data[i].hasOwnProperty('flag')) {
                newpolygon = new Polygoner(newrecvpolygon, data[i].color, data[i].flag)
              } else {
                newpolygon = new Polygoner(newrecvpolygon, '#ff0000', true)
              }
              polygons.push(newpolygon)
              vm.options.push(data[i].markres)
              polygonlen = polygonlen + 1
            } else if (data[i].type === 'pointset') {
              let recvpoints = []
              for (j = 0; j < data[i].pointset.length; j++) {
                let recvpointspoint = new Pointer(data[i].pointset[j].x / rate, data[i].pointset[j].y / rate)
                recvpoints.push(recvpointspoint)
              }
              let newpoints = new Pointseter(recvpoints, data[i].color)
              pointsets.push(newpoints)
              vm.options.push(data[i].markres)
              pointslen = pointslen + 1
            } else if (data[i].type === 'bezierline') {
              let recvbezier = []
              for (j = 0; j < data[i].pointset.length; j++) {
                let recvbezierpoint = new Pointer(data[i].pointset[j].x / rate, data[i].pointset[j].y / rate)
                recvbezier.push(recvbezierpoint)
              }
              var newbezier
              if (data[i].hasOwnProperty('color') && data[i].hasOwnProperty('flag')) {
                newbezier = new Bezierliner(recvbezier, data[i].color, data[i].flag)
              } else {
                newbezier = new Bezierliner(recvbezier, '#ff0000', true)
              }
              bezierlines.push(newbezier)
              vm.options.push(data[i].markres)
              bezierlen = bezierlen + 1
            } else if (data[i].type === 'newPTset') {
              let recvnewPTs = []
              for (j = 0; j < data[i].pointset.length; j++) {
                let recvnewPTsnewPT = new NewPt(data[i].pointset[j].x / rate, data[i].pointset[j].y / rate, data[i].pointset[j].index)
                recvnewPTs.push(recvnewPTsnewPT)
              }
              let newnewPTs = new Pointseter(recvnewPTs, data[i].color)
              newPTsets.push(newnewPTs)
              vm.options.push(data[i].markres)
            } else if (data[i].type === 'facept') {
              let recvfacept = []
              for (j = 0; j < data[i].pointset.length; j++) {
                let recvfaceptpoint = new Pointer(data[i].pointset[j].x / rate, data[i].pointset[j].y / rate)
                recvfacept.push(recvfaceptpoint)
              }
              var newfacept
              newfacept = new Facepter(recvfacept, data[i].color)
              facepts.push(newfacept)
              // vm.options.push(data[i].markres)
            }
          }
        }
        if (pointsets.length > 0) {
          vm.drawPoints()
          tmpmode = 1
          mode = 0
          vm.mode = 0
        }
        if (polygons.length > 0) {
          vm.drawPolygons()
          tmpmode = 2
          mode = 0
          vm.mode = 0
        }
        if (rects.length > 0) {
          vm.drawRects()
          tmpmode = 3
          mode = 0
          vm.mode = 0
        }
        if (bezierlines.length > 0) {
          vm.drawBezierlines()
          tmpmode = 4
          mode = 0
          vm.mode = 0
        }
      }
      // vm.drawPoints()
      // vm.drawPolygons()
      // vm.drawRects()
      // vm.drawBezierlines()
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
    // 获取提交数据
    getResult: function () {
      let vm = this
      var submitdata = []
      var submit = {
        data: [],
        wholeRadioContents: [],
        wholeCheckBoxContents: [],
        wholeInputContents: [],
        vQuesDoContents: []
      }
      // 矩形的序列化
      for (var i = 0; i < rects.length; i++) {
        let rectpoint = []
        let rectpoint1 = new Pt(rects[i].rect.x * rate, rects[i].rect.y * rate)
        let rectpoint2 = new Pt(rects[i].rect.x * rate + rects[i].rect.width * rate, rects[i].rect.y * rate + rects[i].rect.height * rate)
        rectpoint.push(rectpoint1)
        rectpoint.push(rectpoint2)
        // let data = new SubmitData('rect', rectpoint, rects[i].string)
        let data = new SubmitData('rect', rects[i].color, true, rectpoint, vm.options[i])
        // console.log(this.itemCheckBoxContents[i])
        submitdata.push(data)
      }
      // 多边形的序列化
      for (i = 0; i < polygons.length; i++) {
        let newset2 = []
        for (var j = 0; j < polygons[i].pointset.length; j++) {
          let newpoint2 = new Pt(polygons[i].pointset[j].x * rate, polygons[i].pointset[j].y * rate)
          newset2.push(newpoint2)
        }
        let data = new SubmitData('polygon', polygons[i].color, polygons[i].flag, newset2, vm.options[i + rectlen])
        submitdata.push(data)
      }
      // 点集的序列化
      for (i = 0; i < pointsets.length; i++) {
        let newset1 = []
        for (j = 0; j < pointsets[i].pointset.length; j++) {
          let newpoint1 = new Pt(pointsets[i].pointset[j].x * rate, pointsets[i].pointset[j].y * rate)
          newset1.push(newpoint1)
        }
        let data = new SubmitData('pointset', pointsets[i].color, false, newset1, vm.options[i + rectlen + polygonlen])
        submitdata.push(data)
      }
      // 新点集的序列化
      for (i = 0; i < newPTsets.length; i++) {
        let newset5 = []
        for (j = 0; j < newPTsets[i].pointset.length; j++) {
          let newnewPT1 = new PNpt(newPTsets[i].pointset[j].x * rate, newPTsets[i].pointset[j].y * rate, newPTsets[i].pointset[j].index)
          newset5.push(newnewPT1)
        }
        let data = new SubmitData('newPTset', newPTsets[i].color, false, newset5, vm.options[i + rectlen + polygonlen + pointslen + bezierlen])
        submitdata.push(data)
      }
      // 曲线集的序列化
      for (i = 0; i < bezierlines.length; i++) {
        let newset3 = []
        for (j = 0; j < bezierlines[i].pointset.length; j++) {
          let newpoint3 = new Pt(bezierlines[i].pointset[j].x * rate, bezierlines[i].pointset[j].y * rate)
          newset3.push(newpoint3)
        }
        let data = new SubmitData('bezierline', bezierlines[i].color, bezierlines[i].flag, newset3, vm.options[i + rectlen + polygonlen + pointslen])
        submitdata.push(data)
      }
      // facept序列化
      for (i = 0; i < facepts.length; i++) {
        let newset4 = []
        for (j = 0; j < facepts[i].pointset.length; j++) {
          let newpoint4 = new Pt(facepts[i].pointset[j].x * rate, facepts[i].pointset[j].y * rate)
          newset4.push(newpoint4)
        }
        let data = new SubmitData('facept', facepts[i].color, true, newset4, '')
        submitdata.push(data)
      }
      submit.data = submitdata
      submit.wholeRadioContents = vm.wholeRadioContents
      submit.wholeInputContents = vm.wholeInputContents
      submit.wholeCheckBoxContents = vm.wholeCheckBoxContents
      submit.vQuesDoContents = vm.vQuesDoContents
      // console.log(JSON.stringify(submit))
      return submit
    },
    /****************************************************************************/
    /*                       前端DIV样式，动作相关设计                            */
    /****************************************************************************/

    // 选中工作区文本时，选中对应图形
    select: function (index) {
      let vm = this
      if (!delflag) {
        delflag = true
        return
      }
      if (index < rectlen) { // 矩形
        mode = 3
        vm.mode = 3
        if (SelectedRect != null) {
          SelectedRect.isSelected = false
          SelectedRect = null
          if (rects.length > 0) {
            $('#mon')[0].childNodes[childnode + SelectedRectNum].style = 'background:#ffffff'
          }
        }
        SelectedRectNum = index
        if (rects.length > index) {
          rects[index].rect.isSelected = true
          SelectedRect = rects[index].rect
          vm.cleantopcanvas()
          vm.drawRects()
        }
      } else if (index < rectlen + polygonlen) { // 多边形
        mode = 2
        vm.mode = 2
        if (SelectedPoint != null) {
          SelectedPoint.isSelected = false
          SelectedPoint = null
        }
        SelectedPointsetNum = index - rectlen
        vm.cleantopcanvas()
        vm.drawPolygons()
      } else if (index < rectlen + polygonlen + pointslen) { // 点阵
        mode = 1
        vm.mode = 1
        if (SelectedPoint != null) {
          SelectedPoint.isSelected = false
          SelectedPoint = null
        }
        SelectedPointsetNum = index - rectlen - polygonlen
        vm.cleantopcanvas()
        vm.drawPoints()
      } else if (index < rectlen + polygonlen + pointslen + bezierlen) { // 曲线
        mode = 4
        vm.mode = 4
        if (SelectedPoint != null) {
          SelectedPoint.isSelected = false
          SelectedPoint = null
        }
        SelectedPointsetNum = index - rectlen - polygonlen - pointslen
        vm.cleantopcanvas()
        vm.drawBezierlines()
      } else {
        mode = 11
        vm.mode = 11
        if (SelectedPoint != null) {
          SelectedPoint.isSelected = false
          SelectedPoint = null
        }
        SelectedPointsetNum = index - rectlen - polygonlen - pointslen - bezierlen
        vm.cleantopcanvas()
        vm.drawNewPt()
      }
    },
    // 删除文本时，删除对应的标注图形
    delradio: function (index) {
      let vm = this
      delflag = false
      if (index < rectlen) {
        if (SelectedRect != null) {
          SelectedRect.isSelected = false
          SelectedRect = null
        }
        vm.options.splice(index, 1)
        rects.splice(index, 1)
        rectlen = rectlen - 1
        // topctx.clearRect(0 - lefti, 0 - topi, topcanvas.width / scalei, topcanvas.height / scalei)
        vm.cleantopcanvas()
        vm.drawRects()
      } else if (polygonlen > 0 && index < rectlen + polygonlen) {
        if (SelectedPoint != null) {
          SelectedPoint.isSelected = false
          SelectedPoint = null
        }
        vm.options.splice(index, 1)
        polygons.splice(index - rectlen, 1)
        polygonlen = polygonlen - 1
        // topctx.clearRect(0 - lefti, 0 - topi, topcanvas.width / scalei, topcanvas.height / scalei)
        vm.cleantopcanvas()
        vm.drawPolygons()
      } else if (pointslen > 0 && index < rectlen + polygonlen + pointslen) {
        if (SelectedPoint != null) {
          SelectedPoint.isSelected = false
          SelectedPoint = null
        }
        vm.options.splice(index, 1)
        pointsets.splice(index - rectlen - polygonlen, 1)
        pointslen = pointslen - 1
        // topctx.clearRect(0 - lefti, 0 - topi, topcanvas.width / scalei, topcanvas.height / scalei)
        vm.cleantopcanvas()
        vm.drawPoints()
      } else if (bezierlen > 0 && index < rectlen + polygonlen + pointslen + bezierlen) {
        if (SelectedPoint != null) {
          SelectedPoint.isSelected = false
          SelectedPoint = null
        }
        vm.options.splice(index, 1)
        bezierlines.splice(index - rectlen - polygonlen - pointslen, 1)
        bezierlen = bezierlen - 1
        // topctx.clearRect(0 - lefti, 0 - topi, topcanvas.width / scalei, topcanvas.height / scalei)
        vm.cleantopcanvas()
        vm.drawBezierlines()
      } else {
        if (SelectedPoint != null) {
          SelectedPoint.isSelected = false
          SelectedPoint = null
        }
        vm.options.splice(index, 1)
        newPTsets.splice(index - rectlen - polygonlen - pointslen - bezierlen, 1)
        // topctx.clearRect(0 - lefti, 0 - topi, topcanvas.width / scalei, topcanvas.height / scalei)
        vm.cleantopcanvas()
        vm.drawNewPt()
      }
    },
    // 预览模式，可以观察整个视图 // 在预览模式下禁止修改？？？
    preview: function () {
      let vm = this
      if (preflag) {
        tmpmode = mode
        mode = 0
        vm.mode = 0
      }
      if (SelectedPoint != null) {
        SelectedPoint.isSelected = false
        SelectedPoint = null
        // SelectedPointset = null
      }
      if (SelectedRect != null) {
        SelectedRect.isSelected = false
        SelectedRect = null
      }
      if (preflag) {
        vm.cleantopcanvas()
        vm.drawPolygons()
        vm.drawRects()
        vm.drawPoints()
        vm.drawBezierlines()
        preflag = false
      } else {
        vm.cleantopcanvas()
        mode = tmpmode
        if (tmpmode === 1) {
          vm.drawPoints()
        } else if (tmpmode === 2) {
          vm.drawPolygons()
        } else if (mode === 3) {
          vm.drawRects()
        } else if (mode === 4) {
          vm.drawBezierlines()
        }
        preflag = true
      }
    },

    /****************************************************************************/
    /*                             标注图形的绘制                                */
    /****************************************************************************/

    // 68点的连接线
    drawConnline: function (pointSetRest, pts) {
      var vm = this
      // if (pts.length > connlines['max'] || pts.length < connlines['min']) {
      //   return
      // }
      if (!pointSetRest || !pointSetRest.connLines) {
        return
      }
      let connlines = pointSetRest.connLines
      topctx.fillStyle = filstyZone
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
    // 绘制点集
    drawPoints: function () {
      let vm = this
      topctx.fillStyle = filstyZone
      topctx.lineWidth = vm.linewidth / scalei
      if (points.length > 0) {
        for (var i = 0; i < points.length; i++) {
          topctx.beginPath()
          topctx.arc(points[i].x, points[i].y, vm.pointradius / scalei, 0, 2 * Math.PI)
          if (points[i].isSelected) {
            topctx.fillStyle = vm.filstySPs
            topctx.strokeStyle = vm.filstySPs
          } else {
            topctx.strokeStyle = vm.filstyNor
            topctx.fillStyle = vm.filstyNor
          }
          topctx.font = vm.numsize + 'px Arial'
          topctx.fillText(i + 1, points[i].x, points[i].y)
          topctx.stroke()
          topctx.fill()
          topctx.closePath()
        }
        // 点集的区域预览 --是否需要判断点集的选中状态
        // topctx.beginPath()
        // topctx.moveTo(points[0].x, points[0].y)
        // for (i = 1; i < points.length; i++) {
        //   topctx.lineTo(points[i].x, points[i].y)
        // }
        // topctx.fillStyle = 'rgba(255,255,255,0.5)'
        // topctx.fill()
        // topctx.closePath()
      }
      if (pointsets.length > 0) {
        var tempfill
        var tempstroke
        var selectfill
        var selectstroke
        // 画点
        for (i = 0; i < pointsets.length; i++) { // 每个点集的点
          // 68点连接线
          vm.drawConnline(vm.pointSetRest, pointsets[i].pointset)
          // 依据是否被选中确定点集的基色
          if (SelectedPointsetNum === i) {
            tempfill = vm.filstySP
            tempstroke = vm.filstySP
            selectfill = vm.filstySPs
            selectstroke = vm.filstySPs
          } else {
            tempfill = pointsets[i].color
            tempstroke = pointsets[i].color
            selectfill = vm.filstySPs
            selectstroke = vm.filstySPs
          }
          // 画每一个点
          for (var j = 0; j < pointsets[i].pointset.length; j++) {
            if (pointsets[i].pointset[j].isSelected) {
              topctx.beginPath()
              topctx.fillStyle = selectfill
              topctx.strokeStyle = selectstroke
              topctx.arc(pointsets[i].pointset[j].x, pointsets[i].pointset[j].y, vm.pointradius / scalei, 0, 2 * Math.PI)
              topctx.fill()
              topctx.stroke()
              topctx.closePath()
            } else {
              topctx.beginPath()
              topctx.fillStyle = tempfill
              topctx.strokeStyle = tempstroke
              topctx.arc(pointsets[i].pointset[j].x, pointsets[i].pointset[j].y, vm.pointradius / scalei, 0, 2 * Math.PI)
              topctx.fill()
              topctx.stroke()
              topctx.closePath()
            }
            if (SelectedPointsetNum === i) {
              topctx.font = vm.numsize + 'px Arial'
              topctx.fillText(j + 1, pointsets[i].pointset[j].x, pointsets[i].pointset[j].y)
            }
          }
          topctx.font = vm.numsize + 'px Arial'
          topctx.fillText(i + rectlen + polygonlen, pointsets[i].pointset[0].x, pointsets[i].pointset[0].y)
        }
      }
    },
    // 绘制关键点点集
    drawNewPt: function () {
      let vm = this
      topctx.fillStyle = filstyZone
      topctx.lineWidth = vm.linewidth / scalei
      if (newPTs.length > 0) {
        for (var i = 0; i < newPTs.length; i++) {
          topctx.beginPath()
          topctx.arc(newPTs[i].x, newPTs[i].y, vm.pointradius / scalei, 0, 2 * Math.PI)
          if (newPTs[i].isSelected) {
            topctx.fillStyle = vm.filstySPs
            topctx.strokeStyle = vm.filstySPs
          } else {
            topctx.strokeStyle = vm.filstyNor
            topctx.fillStyle = vm.filstyNor
          }
          topctx.font = vm.numsize + 'px Arial'
          topctx.fillText(newPTs[i].index, newPTs[i].x, newPTs[i].y)
          topctx.stroke()
          topctx.fill()
          topctx.closePath()
        }
        // 点集的区域预览 --是否需要判断点集的选中状态
        // topctx.beginPath()
        // topctx.moveTo(newPTs[0].x, newPTs[0].y)
        // for (i = 1; i < newPTs.length; i++) {
        //   topctx.lineTo(newPTs[i].x, newPTs[i].y)
        // }
        // topctx.fillStyle = 'rgba(255,255,255,0.5)'
        // topctx.fill()
        // topctx.closePath()
      }
      if (newPTsets.length > 0) {
        var tempfill
        var tempstroke
        var selectfill
        var selectstroke
        // 画点
        for (i = 0; i < newPTsets.length; i++) { // 每个点集的点
          // 68点连接线
          // vm.drawConnline(vm.pointSetRest['connLines'], newPTsets[i].pointset)
          // 依据是否被选中确定点集的基色
          if (SelectedPointsetNum === i) {
            tempfill = vm.filstySP
            tempstroke = vm.filstySP
            selectfill = vm.filstySPs
            selectstroke = vm.filstySPs
          } else {
            tempfill = newPTsets[i].color
            tempstroke = newPTsets[i].color
            selectfill = vm.filstySPs
            selectstroke = vm.filstySPs
          }
          // 画每一个点
          for (var j = 0; j < newPTsets[i].pointset.length; j++) {
            if (newPTsets[i].pointset[j].isSelected) {
              topctx.beginPath()
              topctx.fillStyle = selectfill
              topctx.strokeStyle = selectstroke
              topctx.arc(newPTsets[i].pointset[j].x, newPTsets[i].pointset[j].y, vm.pointradius / scalei, 0, 2 * Math.PI)
              topctx.fill()
              topctx.stroke()
              topctx.closePath()
            } else {
              topctx.beginPath()
              topctx.fillStyle = tempfill
              topctx.strokeStyle = tempstroke
              topctx.arc(newPTsets[i].pointset[j].x, newPTsets[i].pointset[j].y, vm.pointradius / scalei, 0, 2 * Math.PI)
              topctx.fill()
              topctx.stroke()
              topctx.closePath()
            }
            if (SelectedPointsetNum === i) {
              topctx.font = vm.numsize + 'px Arial'
              topctx.fillText(newPTsets[i].pointset[j].index, newPTsets[i].pointset[j].x, newPTsets[i].pointset[j].y)
            }
          }
          topctx.font = vm.numsize + 'px Arial'
          topctx.fillText(i + rectlen + polygonlen, newPTsets[i].pointset[0].x, newPTsets[i].pointset[0].y)
        }
      }
    },
    // 绘制多边形
    drawPolygons: function () {
      let vm = this
      topctx.fillStyle = filstyZone
      topctx.lineWidth = vm.linewidth / scalei
      if (polygon.length > 0) {
        for (var i = 0; i < polygon.length; i++) {
          topctx.beginPath()
          topctx.arc(polygon[i].x, polygon[i].y, vm.pointradius / scalei, 0, 2 * Math.PI)
          if (polygon[i].isSelected) {
            topctx.fillStyle = vm.filstySP
            topctx.strokeStyle = vm.filstySP
          } else {
            topctx.strokeStyle = vm.filstyNor
            topctx.fillStyle = vm.filstyNor
          }
          topctx.stroke()
          topctx.fill()
          topctx.closePath()
        }
        topctx.beginPath()
        topctx.moveTo(polygon[0].x, polygon[0].y)
        for (i = 1; i < polygon.length; i++) {
          topctx.lineTo(polygon[i].x, polygon[i].y)
        }
        topctx.fillStyle = filstyZone
        topctx.fill()
        topctx.stroke()
        topctx.closePath()
      }
      if (polygons.length > 0) {
        var tempfill
        var tempstroke
        var selectfill
        var selectstroke
        // 画点
        for (i = 0; i < polygons.length; i++) { // 每个点集的点
          // 依据是否被选中确定点集的基色
          if (SelectedPointsetNum === i) {
            tempfill = vm.filstySP
            tempstroke = vm.filstySP
            selectfill = vm.filstySPs
            selectstroke = vm.filstySPs
          } else {
            tempfill = polygons[i].color
            tempstroke = polygons[i].color
            selectfill = vm.filstySPs
            selectstroke = vm.filstySPs
          }
          // 画每一个点
          for (var j = 0; j < polygons[i].pointset.length; j++) {
            if (polygons[i].pointset[j].isSelected) {
              topctx.beginPath()
              topctx.fillStyle = selectfill
              topctx.strokeStyle = selectstroke
              topctx.arc(polygons[i].pointset[j].x, polygons[i].pointset[j].y, vm.pointradius / scalei, 0, 2 * Math.PI)
              topctx.fill()
              topctx.stroke()
              topctx.closePath()
            } else {
              topctx.beginPath()
              topctx.fillStyle = tempfill
              topctx.strokeStyle = tempstroke
              topctx.arc(polygons[i].pointset[j].x, polygons[i].pointset[j].y, vm.pointradius / scalei, 0, 2 * Math.PI)
              topctx.fill()
              topctx.stroke()
              topctx.closePath()
            }
          }
        }
        // 连线
        for (i = 0; i < polygons.length; i++) {
          if (SelectedPointsetNum === i) {
            topctx.beginPath()
            topctx.setLineDash([2, 0])
            topctx.moveTo(polygons[i].pointset[0].x, polygons[i].pointset[0].y)
            for (j = 1; j < polygons[i].pointset.length; j++) {
              topctx.lineTo(polygons[i].pointset[j].x, polygons[i].pointset[j].y)
            }
            topctx.strokeStyle = vm.filstySP
            topctx.fillStyle = filstyZone
            topctx.font = vm.numsize + 'px Arial'
            topctx.fillText(i + rectlen, polygons[i].pointset[0].x, polygons[i].pointset[0].y)
            // 若flag为true，则闭合
            if (polygons[i].flag) {
              topctx.closePath()
            }
            topctx.stroke()
            // 阴影填充
            // topctx.fill()
          } else {
            topctx.beginPath()
            topctx.setLineDash([2, 0])
            topctx.moveTo(polygons[i].pointset[0].x, polygons[i].pointset[0].y)
            for (j = 1; j < polygons[i].pointset.length; j++) {
              topctx.lineTo(polygons[i].pointset[j].x, polygons[i].pointset[j].y)
            }
            topctx.strokeStyle = polygons[i].color
            topctx.fillStyle = filstyZone
            // topctx.font = vm.numsize + 'px Arial'
            // topctx.fillText(i + rectlen, polygons[i].pointset[0].x, polygons[i].pointset[0].y)
            // flag为true，则闭合
            if (polygons[i].flag) {
              topctx.closePath()
            }
            topctx.stroke()
            // 阴影填充
            // topctx.fill()
          }
          topctx.beginPath()
          topctx.fillStyle = polygons[i].color
          topctx.font = vm.numsize + 'px Arial'
          // console.log(i + rectlen)
          topctx.fillText(i + rectlen, polygons[i].pointset[0].x, polygons[i].pointset[0].y)
        }
      }
    },
    // 绘制十字线
    drawCrossline: function (event) {
      let vm = this
      height1 = $('#canvascontainer').innerHeight()
      width1 = $('#canvascontainer').innerWidth()
      Left = (width1 - $('#top')[0].width) / 2.0
      Top = (height1 - $('#top')[0].height) / 2.0
      clickX = event.clientX - Left - $('#con')[0].offsetParent.offsetLeft
      clickY = event.clientY - $('#canvascontainer')[0].offsetTop - Top - $('#con')[0].offsetParent.offsetTop
      if (cnt % 4 === 0) {
        moveclickX = (clickX - lefti) / scalei
        moveclickY = (clickY - topi) / scalei
      } else if (cnt % 4 === 1) {
        // console.log(clickY, topi)
        moveclickX = (clickY - topi) / scalei
        moveclickY = (lefti - clickX) / scalei
      } else if (cnt % 4 === 2) {
        // console.log(lefti, clickX, topi, clickY)
        moveclickX = (lefti - clickX) / scalei
        moveclickY = (topi - clickY) / scalei
      } else {
        moveclickX = (topi - clickY) / scalei
        moveclickY = (clickX - lefti) / scalei
      }
      // console.log(moveclickX, moveclickY)
      topctx.beginPath()
      topctx.lineWidth = vm.linewidth / scalei
      topctx.strokeStyle = '#ff0000'
      topctx.setLineDash([4, 4])
      topctx.moveTo(0, moveclickY)
      topctx.lineTo(topcanvas.width, moveclickY)
      topctx.stroke()
      topctx.beginPath()
      topctx.strokeStyle = '#ff0000'
      topctx.setLineDash([4, 4])
      topctx.moveTo(moveclickX, 0)
      topctx.lineTo(moveclickX, topcanvas.height)
      topctx.stroke()
    },
    // 绘制矩形
    drawRects: function () {
      let vm = this
      topctx.fillStyle = filstyZone
      topctx.lineWidth = vm.linewidth / scalei
      if (rect != null) {
        topctx.beginPath()
        topctx.rect(rect.x, rect.y, rect.width, rect.height)
        topctx.strokeStyle = vm.filstyNor
        topctx.stroke()
        topctx.fill()
        topctx.fillStyle = vm.filstyNor
        topctx.font = vm.numsize + 'px Arial'
        topctx.fillText(Math.round(rect.width * rate) + ' * ' + Math.round(rect.height * rate) + ' S:' + Math.round(rect.width * rect.height * rate * rate), rect.x, rect.y)
        topctx.closePath()
      }
      if (rects.length > 0) {
        for (var i = 0; i < rects.length; i++) {
          if (rects[i].rect.isSelected) {
            topctx.setLineDash([2, 2])
            topctx.beginPath()
            topctx.arc(rects[i].rect.x, rects[i].rect.y, vm.pointradius / scalei, 0, 2 * Math.PI)
            topctx.stroke()
            topctx.closePath()
            topctx.beginPath()
            topctx.arc(rects[i].rect.x + rects[i].rect.width, rects[i].rect.y, vm.pointradius / scalei, 0, 2 * Math.PI)
            topctx.stroke()
            topctx.closePath()
            topctx.beginPath()
            topctx.arc(rects[i].rect.x, rects[i].rect.y + rects[i].rect.height, vm.pointradius / scalei, 0, 2 * Math.PI)
            topctx.stroke()
            topctx.closePath()
            topctx.beginPath()
            topctx.arc(rects[i].rect.x + rects[i].rect.width, rects[i].rect.y + rects[i].rect.height, vm.pointradius / scalei, 0, 2 * Math.PI)
            topctx.stroke()
            topctx.closePath()
            topctx.beginPath()
            topctx.rect(rects[i].rect.x, rects[i].rect.y, rects[i].rect.width, rects[i].rect.height)
            topctx.strokeStyle = vm.filstySP
            topctx.stroke()
            topctx.fillStyle = vm.filstyZone
            topctx.fill()
            topctx.fillStyle = vm.filstySPs
            topctx.font = vm.numsize + 'px Arial'
            topctx.fillText(i, rects[i].rect.x, rects[i].rect.y)
            topctx.font = vm.numsize + 'px Arial'
            topctx.fillText(Math.round(rects[i].rect.width * rate) + ' * ' + Math.round(rects[i].rect.height * rate) + ' S:' + Math.round(rects[i].rect.width * rects[i].rect.height * rate * rate), rects[i].rect.x + 40 / scalei, rects[i].rect.y)
            topctx.fillStyle = filstyZone
            topctx.closePath()
          } else {
            topctx.beginPath()
            topctx.fillStyle = vm.filstyZone
            topctx.strokeStyle = rects[i].color
            topctx.setLineDash([2, 0])
            topctx.rect(rects[i].rect.x, rects[i].rect.y, rects[i].rect.width, rects[i].rect.height)
            // topctx.strokeStyle = vm.filstyNor
            topctx.stroke()
            // topctx.fill()
            topctx.fillStyle = rects[i].color
            topctx.font = vm.numsize + 'px Arial'
            topctx.fillText(i, rects[i].rect.x, rects[i].rect.y)
            topctx.fillStyle = filstyZone
            topctx.closePath()
          }
        }
      }
    },
    // 绘制贝塞尔曲线
    drawBezierlines: function () {
      let vm = this
      topctx.fillStyle = filstyZone
      topctx.lineWidth = vm.linewidth / scalei
      // 绘制当前未入栈曲线
      if (bezierline.length === 1) {
        topctx.beginPath()
        topctx.arc(bezierline[0].x, bezierline[0].y, vm.pointradius / scalei, 0, 2 * Math.PI)
        if (bezierline[0].isSelected) {
          topctx.fillStyle = vm.filstySP
          topctx.strokeStyle = vm.filstySP
        } else {
          topctx.strokeStyle = vm.filstyNor
          topctx.fillStyle = vm.filstyNor
        }
        topctx.stroke()
        topctx.fill()
        // topctx.closePath()
      } else if (bezierline.length > 1) {
        for (var i = 0; i < bezierline.length; i = i + 1) {
          //  || SelectedPointNum % 3 !== 0
          // 选中点的绘制（包括其关联的控制点）
          if (bezierline[i].isSelected) {
            if (i % 3 === 0) {
              // 选中绘制点
              topctx.beginPath()
              topctx.fillStyle = vm.filstySP // vm.filstySP
              topctx.strokeStyle = vm.filstySP // vm.filstySP
              topctx.arc(bezierline[i].x, bezierline[i].y, vm.pointradius / scalei, 0, 2 * Math.PI)
              topctx.stroke()
              topctx.fill()
              if (i > 0) {
                var beginpoint
                beginpoint = bezierline[i - 3]
                topctx.beginPath()
                topctx.setLineDash([2, 2])
                topctx.moveTo(beginpoint.x, beginpoint.y)
                topctx.lineTo(bezierline[i - 2].x, bezierline[i - 2].y)
                topctx.stroke()

                topctx.beginPath()
                topctx.moveTo(bezierline[i].x, bezierline[i].y)
                topctx.lineTo(bezierline[i - 1].x, bezierline[i - 1].y)
                topctx.stroke()
                // 描点
                topctx.beginPath()
                topctx.arc(bezierline[i - 1].x, bezierline[i - 1].y, vm.pointradius / scalei, 0, 2 * Math.PI)
                topctx.arc(bezierline[i - 2].x, bezierline[i - 2].y, vm.pointradius / scalei, 0, 2 * Math.PI)
                topctx.fill()
              // topctx.stroke()
              }
            } else if (i % 3 === 1) {
              // 选中控制点1
              topctx.beginPath()
              topctx.fillStyle = vm.filstySP
              topctx.strokeStyle = vm.filstySP
              topctx.arc(bezierline[i].x, bezierline[i].y, vm.pointradius / scalei, 0, 2 * Math.PI)
              topctx.stroke()
              topctx.fill()
              beginpoint = bezierline[i - 1]
              topctx.beginPath()
              topctx.setLineDash([2, 2])
              topctx.moveTo(beginpoint.x, beginpoint.y)
              topctx.lineTo(bezierline[i].x, bezierline[i].y)
              topctx.stroke()

              topctx.beginPath()
              topctx.moveTo(bezierline[i + 1].x, bezierline[i + 1].y)
              topctx.lineTo(bezierline[i + 2].x, bezierline[i + 2].y)
              topctx.stroke()
              // 描点
              topctx.beginPath()
              topctx.arc(bezierline[i + 1].x, bezierline[i + 1].y, vm.pointradius / scalei, 0, 2 * Math.PI)
              // topctx.arc(bezierline[i - 2].x, bezierline[i - 2].y, vm.pointradius / scalei, 0, 2 * Math.PI)
              topctx.fill()
              // topctx.stroke()
            } else if (i % 3 === 2) {
              // 选中控制点2
              topctx.beginPath()
              topctx.fillStyle = vm.filstySP
              topctx.strokeStyle = vm.filstySP
              topctx.arc(bezierline[i].x, bezierline[i].y, vm.pointradius / scalei, 0, 2 * Math.PI)
              topctx.stroke()
              topctx.fill()
              beginpoint = bezierline[i - 2]
              topctx.beginPath()
              topctx.setLineDash([2, 2])
              topctx.moveTo(beginpoint.x, beginpoint.y)
              topctx.lineTo(bezierline[i - 1].x, bezierline[i - 1].y)
              topctx.stroke()

              topctx.beginPath()
              topctx.moveTo(bezierline[i].x, bezierline[i].y)
              topctx.lineTo(bezierline[i + 1].x, bezierline[i + 1].y)
              topctx.stroke()
              // 描点
              topctx.beginPath()
              topctx.arc(bezierline[i - 1].x, bezierline[i - 1].y, vm.pointradius / scalei, 0, 2 * Math.PI)
              // topctx.arc(bezierline[i - 2].x, bezierline[i - 2].y, vm.pointradius / scalei, 0, 2 * Math.PI)
              topctx.fill()
              // topctx.stroke()
            }
            // 添加控制点相关绘制
          } else {
            if (i % 3 === 0) {
              topctx.beginPath()
              topctx.strokeStyle = vm.filstyNor
              topctx.fillStyle = vm.filstyNor
              topctx.arc(bezierline[i].x, bezierline[i].y, vm.pointradius / scalei, 0, 2 * Math.PI)
              topctx.stroke()
              topctx.fill()
            }
          }
        }
        // 绘制贝塞尔连接线
        topctx.beginPath()
        topctx.setLineDash([2, 0])
        topctx.strokeStyle = vm.filstyNor
        topctx.moveTo(bezierline[0].x, bezierline[0].y)
        for (i = 0; i < bezierline.length - 3; i = i + 3) {
          topctx.bezierCurveTo(bezierline[i + 1].x, bezierline[i + 1].y, bezierline[i + 2].x, bezierline[i + 2].y, bezierline[i + 3].x, bezierline[i + 3].y)
        }
        topctx.fillStyle = 'rgba(255,255,255,0)'
        topctx.fill()
        topctx.stroke()
      }
      // 绘制已入栈曲线
      if (bezierlines.length > 0) {
        var tempfill
        var tempstroke
        var selectfill
        var selectstroke
        // 画点
        for (i = 0; i < bezierlines.length; i = i + 1) { // 每个点集的点
          // 依据是否被选中确定点集的基色
          if (SelectedPointsetNum === i) {
            tempfill = vm.filstySP
            tempstroke = vm.filstySP
            selectfill = vm.filstySPs
            selectstroke = vm.filstySPs
          } else {
            tempfill = bezierlines[i].color
            tempstroke = bezierlines[i].color
            selectfill = vm.filstySPs
            selectstroke = vm.filstySPs
          }
          // 先画第一个点
          // topctx.beginPath()
          // topctx.arc(bezierlines[i].pointset[0].x, bezierlines[i].pointset[0].y, vm.pointradius / scalei, 0, 2 * Math.PI)
          // if (bezierlines[i].pointset[0].isSelected) {
          //   topctx.fillStyle = '#0000ff'
          //   topctx.strokeStyle = '#0000ff'
          // } else {
          //   topctx.strokeStyle = '#ff0000'
          //   topctx.fillStyle = '#ff0000'
          // }
          // topctx.stroke()
          // topctx.fill()
          // topctx.closePath()
          // 接着画其他点
          for (var j = 0; j < bezierlines[i].pointset.length; j = j + 1) {
            // || SelectedPointNum % 3 !== 0
            if (bezierlines[i].pointset[j].isSelected) {
              // 绘制选中点及其关联控制点的连线
              if (j % 3 === 0) {
                topctx.beginPath()
                topctx.fillStyle = vm.filstySP
                topctx.strokeStyle = vm.filstySP
                topctx.arc(bezierlines[i].pointset[j].x, bezierlines[i].pointset[j].y, vm.pointradius / scalei, 0, 2 * Math.PI)
                topctx.stroke()
                topctx.fill()
                // var
                beginpoint = bezierlines[i].pointset[j]
                topctx.beginPath()
                topctx.setLineDash([2, 2])
                topctx.moveTo(beginpoint.x, beginpoint.y)
                topctx.lineTo(bezierlines[i].pointset[j + 1].x, bezierlines[i].pointset[j + 1].y)
                topctx.stroke()

                topctx.beginPath()
                topctx.moveTo(bezierlines[i].pointset[j + 2].x, bezierlines[i].pointset[j + 2].y)
                if (j !== bezierlines[i].pointset.length - 3) {
                  topctx.lineTo(bezierlines[i].pointset[j + 3].x, bezierlines[i].pointset[j + 3].y)
                } else {
                  topctx.lineTo(bezierlines[i].pointset[0].x, bezierlines[i].pointset[0].y)
                }
                topctx.stroke()
                // 绘制关联点
                topctx.beginPath()
                topctx.fillStyle = selectfill
                topctx.strokeStyle = selectstroke
                topctx.arc(bezierlines[i].pointset[j + 1].x, bezierlines[i].pointset[j + 1].y, vm.pointradius / scalei, 0, 2 * Math.PI)
                topctx.fill()
                topctx.stroke()
                topctx.beginPath()
                topctx.arc(bezierlines[i].pointset[j + 2].x, bezierlines[i].pointset[j + 2].y, vm.pointradius / scalei, 0, 2 * Math.PI)
                topctx.fill()
                topctx.stroke()
              } else if (j % 3 === 1) {
                topctx.beginPath()
                topctx.fillStyle = vm.filstySP
                topctx.strokeStyle = vm.filstySP
                topctx.arc(bezierlines[i].pointset[j].x, bezierlines[i].pointset[j].y, vm.pointradius / scalei, 0, 2 * Math.PI)
                topctx.stroke()
                topctx.fill()
                // var
                beginpoint = bezierlines[i].pointset[j - 1]
                topctx.beginPath()
                topctx.setLineDash([2, 2])
                topctx.moveTo(beginpoint.x, beginpoint.y)
                topctx.lineTo(bezierlines[i].pointset[j].x, bezierlines[i].pointset[j].y)
                topctx.stroke()

                topctx.beginPath()
                topctx.moveTo(bezierlines[i].pointset[j + 1].x, bezierlines[i].pointset[j + 1].y)
                if (j !== bezierlines[i].pointset.length - 2) {
                  topctx.lineTo(bezierlines[i].pointset[j + 2].x, bezierlines[i].pointset[j + 2].y)
                } else {
                  topctx.lineTo(bezierlines[i].pointset[0].x, bezierlines[i].pointset[0].y)
                }
                topctx.stroke()
                // 绘制关联点
                topctx.beginPath()
                topctx.fillStyle = selectfill
                topctx.strokeStyle = selectstroke
                topctx.arc(bezierlines[i].pointset[j + 1].x, bezierlines[i].pointset[j + 1].y, vm.pointradius / scalei, 0, 2 * Math.PI)
                topctx.fill()
                topctx.stroke()
                // topctx.beginPath()
                // topctx.arc(bezierlines[i].pointset[j + 2].x, bezierlines[i].pointset[j + 2].y, vm.pointradius / scalei, 0, 2 * Math.PI)
                // topctx.fill()
                // topctx.stroke()
              } else if (j % 3 === 2) {
                topctx.beginPath()
                topctx.fillStyle = vm.filstySP
                topctx.strokeStyle = vm.filstySP
                topctx.arc(bezierlines[i].pointset[j].x, bezierlines[i].pointset[j].y, vm.pointradius / scalei, 0, 2 * Math.PI)
                topctx.stroke()
                topctx.fill()
                // var
                beginpoint = bezierlines[i].pointset[j - 2]
                topctx.beginPath()
                topctx.setLineDash([2, 2])
                topctx.moveTo(beginpoint.x, beginpoint.y)
                topctx.lineTo(bezierlines[i].pointset[j - 1].x, bezierlines[i].pointset[j - 1].y)
                topctx.stroke()

                topctx.beginPath()
                topctx.moveTo(bezierlines[i].pointset[j].x, bezierlines[i].pointset[j].y)
                if (j !== bezierlines[i].pointset.length - 1) {
                  topctx.lineTo(bezierlines[i].pointset[j + 1].x, bezierlines[i].pointset[j + 1].y)
                } else {
                  topctx.lineTo(bezierlines[i].pointset[0].x, bezierlines[i].pointset[0].y)
                }
                topctx.stroke()
                // 绘制关联点
                topctx.beginPath()
                topctx.fillStyle = selectfill
                topctx.strokeStyle = selectstroke
                topctx.arc(bezierlines[i].pointset[j - 1].x, bezierlines[i].pointset[j - 1].y, vm.pointradius / scalei, 0, 2 * Math.PI)
                topctx.fill()
                topctx.stroke()
              }

              // topctx.closePath()
            } else {
              if (j % 3 === 0) {
                topctx.beginPath()
                topctx.fillStyle = tempfill
                topctx.strokeStyle = tempstroke
                topctx.arc(bezierlines[i].pointset[j].x, bezierlines[i].pointset[j].y, vm.pointradius / scalei, 0, 2 * Math.PI)

                topctx.stroke()
                topctx.fill()
              }
            }
          }
        }
        // 连线
        for (i = 0; i < bezierlines.length; i++) {
          if (SelectedPointsetNum === i) {
            topctx.beginPath()
            topctx.setLineDash([2, 0])
            topctx.strokeStyle = vm.filstySP
            topctx.fillStyle = filstyZone
            topctx.moveTo(bezierlines[i].pointset[0].x, bezierlines[i].pointset[0].y)
            for (j = 0; j < bezierlines[i].pointset.length; j = j + 3) {
              if (j !== bezierlines[i].pointset.length - 3) {
                topctx.bezierCurveTo(bezierlines[i].pointset[j + 1].x, bezierlines[i].pointset[j + 1].y, bezierlines[i].pointset[j + 2].x, bezierlines[i].pointset[j + 2].y, bezierlines[i].pointset[j + 3].x, bezierlines[i].pointset[j + 3].y)
              } else {
                // 首尾相连
                if (bezierlines[i].flag) {
                  topctx.bezierCurveTo(bezierlines[i].pointset[j + 1].x, bezierlines[i].pointset[j + 1].y, bezierlines[i].pointset[j + 2].x, bezierlines[i].pointset[j + 2].y, bezierlines[i].pointset[0].x, bezierlines[i].pointset[0].y)
                }
              }
            }
            // topctx.closePath()
            topctx.stroke()
            // 阴影填充
            // topctx.fill()
          } else {
            topctx.beginPath()
            topctx.setLineDash([2, 0])
            topctx.strokeStyle = bezierlines[i].color
            topctx.fillStyle = filstyZone
            topctx.moveTo(bezierlines[i].pointset[0].x, bezierlines[i].pointset[0].y)
            for (j = 0; j < bezierlines[i].pointset.length; j = j + 3) {
              if (j !== bezierlines[i].pointset.length - 3) {
                topctx.bezierCurveTo(bezierlines[i].pointset[j + 1].x, bezierlines[i].pointset[j + 1].y, bezierlines[i].pointset[j + 2].x, bezierlines[i].pointset[j + 2].y, bezierlines[i].pointset[j + 3].x, bezierlines[i].pointset[j + 3].y)
              } else {
                // 首尾相连
                if (bezierlines[i].flag) {
                  topctx.bezierCurveTo(bezierlines[i].pointset[j + 1].x, bezierlines[i].pointset[j + 1].y, bezierlines[i].pointset[j + 2].x, bezierlines[i].pointset[j + 2].y, bezierlines[i].pointset[0].x, bezierlines[i].pointset[0].y)
                }
              }
            }
            // topctx.closePath()
            topctx.stroke()
            // 阴影填充
            // topctx.fill()
          }
          topctx.beginPath()
          topctx.fillStyle = bezierlines[i].color
          topctx.font = vm.numsize + 'px Arial'
          topctx.fillText(i + rectlen + polygonlen + pointslen, bezierlines[i].pointset[0].x, bezierlines[i].pointset[0].y)
        }
      }
    },
    drawFacepts: function () {
      let vm = this
      // topctx.fillStyle = filstyZone
      topctx.lineWidth = vm.linewidth / scalei
      if (facept.length > 0) {
        for (var i = 0; i < facept.length; i++) {
          topctx.beginPath()
          topctx.arc(facept[i].x, facept[i].y, vm.pointradius / scalei, 0, 2 * Math.PI)
          if (facept[i].isSelected) {
            topctx.fillStyle = vm.filstySP
            topctx.strokeStyle = vm.filstySP
          } else {
            topctx.strokeStyle = vm.filstyNor
            topctx.fillStyle = vm.filstyNor
          }
          topctx.stroke()
          topctx.font = vm.numsize + 'px Arial'
          topctx.fillText(i, facept[i].x, facept[i].y)
          topctx.fill()
          // if (i % 10 === 0) {
          //   topctx.fillText(i, facept[i].x, facept[i].y)
          // }
          topctx.closePath()
        }
        if (facept.length === 7) {
          var bx, by, ex, ey
          let kx = facept[1].x - facept[0].x
          let ky = facept[1].y - facept[0].y
          if (kx === 0 && ky === 0) {
            // todo
          } else if (kx === 0) {
            bx = facept[5].x
            by = facept[6].y
            ex = facept[6].x
            ey = facept[5].y
          } else if (ky === 0) {
            bx = facept[6].x
            by = facept[5].y
            ex = facept[5].x
            ey = facept[6].y
          } else {
            var a = facept[5].x
            var b = facept[5].y
            var c = facept[6].x
            var d = facept[6].y
            var k = ky / kx
            bx = (k * d + k * k * a - k * b + c) / (k * k + 1)
            by = k * (bx - a) + b
            ex = (k * b + k * k * c - k * d + a) / (k * k + 1)
            ey = k * (ex - c) + d
          }
          topctx.beginPath()
          topctx.moveTo(facept[0].x, facept[0].y)
          topctx.lineTo(facept[1].x, facept[1].y)
          topctx.stroke()
          topctx.beginPath()
          topctx.moveTo(facept[5].x, facept[5].y)
          topctx.lineTo(bx, by)
          topctx.lineTo(facept[6].x, facept[6].y)
          topctx.lineTo(ex, ey)
          var facewidth = Math.sqrt((facept[5].x - bx) * (facept[5].x - bx) + (facept[5].y - by) * (facept[5].y - by))
          var faceheight = Math.sqrt((facept[6].x - bx) * (facept[6].x - bx) + (facept[6].y - by) * (facept[6].y - by))
          topctx.fillStyle = vm.filstyNor
          topctx.font = vm.numsize + 'px Arial'
          topctx.fillText(Math.round(facewidth * rate) + ' * ' + Math.round(faceheight * rate), facept[5].x, facept[5].y)
          // topctx.fill()
          topctx.closePath()
          topctx.stroke()
        }
      }
      if (facepts.length > 0) {
        var tempfill
        var tempstroke
        var selectfill
        var selectstroke
        // 画点
        for (i = 0; i < facepts.length; i++) { // 每个点集的点
          // 依据是否被选中确定点集的基色
          if (SelectedPointsetNum === i) {
            tempfill = vm.filstySP
            tempstroke = vm.filstySP
            selectfill = vm.filstySPs
            selectstroke = vm.filstySPs
          } else {
            tempfill = facepts[i].color
            tempstroke = facepts[i].color
            selectfill = vm.filstySPs
            selectstroke = vm.filstySPs
          }
          // 画每一个点
          for (var j = 0; j < facepts[i].pointset.length; j++) {
            if (facepts[i].pointset[j].isSelected) {
              topctx.beginPath()
              topctx.fillStyle = selectfill
              topctx.strokeStyle = selectstroke
              topctx.arc(facepts[i].pointset[j].x, facepts[i].pointset[j].y, vm.pointradius / scalei, 0, 2 * Math.PI)
              topctx.font = vm.numsize + 'px Arial'
              // todo--待删除（未选中set）
              for (var kk = 0; kk < facepts[i].pointset.length; kk++) {
                topctx.fillText(kk, facepts[i].pointset[kk].x, facepts[i].pointset[kk].y)
              }
              // topctx.fillText(j, facepts[i].pointset[j].x, facepts[i].pointset[j].y)
              topctx.fill()

              // topctx.fillText(j + 1,facepts[i].pointset[j].x,facepts[i].pointset[j].y)
              // topctx.stroke()
              // topctx.closePath()
            } else {
              topctx.beginPath()
              topctx.fillStyle = tempfill
              topctx.strokeStyle = tempstroke
              topctx.arc(facepts[i].pointset[j].x, facepts[i].pointset[j].y, vm.pointradius / scalei, 0, 2 * Math.PI)
              topctx.fill()
              // topctx.fillText(j + 1,facepts[i].pointset[j].x,facepts[i].pointset[j].y)
              topctx.stroke()
              topctx.closePath()
            }
          }
        }
        // 连线
        for (i = 0; i < facepts.length; i++) {
          if (SelectedPointsetNum === i) {
            topctx.beginPath()
            topctx.setLineDash([2, 0])
            // var bx, by, ex, ey
            let kx = facepts[i].pointset[1].x - facepts[i].pointset[0].x
            let ky = facepts[i].pointset[1].y - facepts[i].pointset[0].y
            if (kx === 0 && ky === 0) {
              // todo
            } else if (kx === 0) {
              bx = facepts[i].pointset[5].x
              by = facepts[i].pointset[6].y
              ex = facepts[i].pointset[6].x
              ey = facepts[i].pointset[5].y
            } else if (ky === 0) {
              bx = facepts[i].pointset[6].x
              by = facepts[i].pointset[5].y
              ex = facepts[i].pointset[5].x
              ey = facepts[i].pointset[6].y
            } else {
              a = facepts[i].pointset[5].x
              b = facepts[i].pointset[5].y
              c = facepts[i].pointset[6].x
              d = facepts[i].pointset[6].y
              k = ky / kx
              bx = (k * d + k * k * a - k * b + c) / (k * k + 1)
              by = k * (bx - a) + b
              ex = (k * b + k * k * c - k * d + a) / (k * k + 1)
              ey = k * (ex - c) + d
            }
            topctx.beginPath()
            topctx.moveTo(facepts[i].pointset[0].x, facepts[i].pointset[0].y)
            topctx.lineTo(facepts[i].pointset[1].x, facepts[i].pointset[1].y)
            topctx.stroke()
            topctx.beginPath()
            topctx.moveTo(facepts[i].pointset[5].x, facepts[i].pointset[5].y)
            topctx.lineTo(bx, by)
            topctx.lineTo(facepts[i].pointset[6].x, facepts[i].pointset[6].y)
            topctx.lineTo(ex, ey)
            topctx.fillStyle = filstyZone
            // topctx.fill()
            topctx.closePath()
            topctx.stroke()
            topctx.strokeStyle = vm.filstySP
            topctx.fillStyle = filstyZone
            topctx.font = vm.numsize + 'px Arial'
            // 长宽
            facewidth = Math.sqrt((facepts[i].pointset[5].x - bx) * (facepts[i].pointset[5].x - bx) + (facepts[i].pointset[5].y - by) * (facepts[i].pointset[5].y - by))
            faceheight = Math.sqrt((facepts[i].pointset[6].x - bx) * (facepts[i].pointset[6].x - bx) + (facepts[i].pointset[6].y - by) * (facepts[i].pointset[6].y - by))
            topctx.fillStyle = vm.filstyNor
            topctx.font = vm.numsize + 'px Arial'
            topctx.fillText(Math.round(facewidth * rate) + ' * ' + Math.round(faceheight * rate), facepts[i].pointset[5].x, facepts[i].pointset[5].y)
            // topctx.stroke()
            // 阴影填充
            // topctx.fill()
          } else {
            topctx.beginPath()
            topctx.setLineDash([2, 0])
            // var bx, by, ex, ey
            let kx = facepts[i].pointset[1].x - facepts[i].pointset[0].x
            let ky = facepts[i].pointset[1].y - facepts[i].pointset[0].y
            if (kx === 0 && ky === 0) {
              // todo
            } else if (kx === 0) {
              bx = facepts[i].pointset[5].x
              by = facepts[i].pointset[6].y
              ex = facepts[i].pointset[6].x
              ey = facepts[i].pointset[5].y
            } else if (ky === 0) {
              bx = facepts[i].pointset[6].x
              by = facepts[i].pointset[5].y
              ex = facepts[i].pointset[5].x
              ey = facepts[i].pointset[6].y
            } else {
              a = facepts[i].pointset[5].x
              b = facepts[i].pointset[5].y
              c = facepts[i].pointset[6].x
              d = facepts[i].pointset[6].y
              k = ky / kx
              bx = (k * d + k * k * a - k * b + c) / (k * k + 1)
              by = k * (bx - a) + b
              ex = (k * b + k * k * c - k * d + a) / (k * k + 1)
              ey = k * (ex - c) + d
            }
            topctx.beginPath()
            topctx.moveTo(facepts[i].pointset[0].x, facepts[i].pointset[0].y)
            topctx.lineTo(facepts[i].pointset[1].x, facepts[i].pointset[1].y)
            topctx.stroke()
            topctx.beginPath()
            topctx.moveTo(facepts[i].pointset[5].x, facepts[i].pointset[5].y)
            topctx.lineTo(bx, by)
            topctx.lineTo(facepts[i].pointset[6].x, facepts[i].pointset[6].y)
            topctx.lineTo(ex, ey)
            topctx.fillStyle = filstyZone
            // topctx.fill()
            topctx.closePath()
            topctx.stroke()
            topctx.strokeStyle = facepts[i].color
            topctx.fillStyle = filstyZone
            // topctx.font = vm.numsize + 'px Arial'
            // topctx.fillText(i + rectlen, facepts[i].pointset[0].x, facepts[i].pointset[0].y)
            // flag为true，则闭合
            topctx.stroke()
            // 阴影填充
            // topctx.fill()
          }
          topctx.beginPath()
          topctx.fillStyle = facepts[i].color
          topctx.font = 30 / scalei + 'px Arial'
          topctx.fillText(i, facepts[i].pointset[0].x, facepts[i].pointset[0].y)
        }
      }
    },

    /****************************************************************************/
    /*                           canvas画布相关事件                              */
    /****************************************************************************/

    // 鼠标点击操作，包含点击位置的记录，不同模式下点击位置的判定
    canvasClick: function (e) {
      let vm = this
      var i, j
      for (i = 0; i < $('#mon')[0].childNodes.length; i++) {
        $('#mon')[0].childNodes[i].style = 'background:#ffffff'
      }
      height1 = $('#canvascontainer')[0].clientHeight
      // console.log($('#canvascontainer')[0].clientHeight)
      width1 = $('#canvascontainer')[0].clientWidth
      Left = (width1 - $('#top')[0].width) / 2.0
      Top = (height1 - $('#top')[0].height) / 2.0

      clickX = event.clientX - Left - $('#con')[0].offsetParent.offsetLeft
      clickY = event.clientY - $('#canvascontainer')[0].offsetTop - Top - $('#con')[0].offsetParent.offsetTop
      pointx = event.clientX - Left - $('#con')[0].offsetParent.offsetLeft
      pointy = event.clientY - $('#canvascontainer')[0].offsetTop - Top - $('#con')[0].offsetParent.offsetTop
      // moveclickX = (clickX - lefti) / scalei
      // moveclickY = (clickY - topi) / scalei
      if (cnt % 4 === 0) {
        moveclickX = (clickX - lefti) / scalei
        moveclickY = (clickY - topi) / scalei
      } else if (cnt % 4 === 1) {
        // console.log(clickY, topi)
        moveclickX = (clickY - topi) / scalei
        moveclickY = (lefti - clickX) / scalei
      } else if (cnt % 4 === 2) {
        // console.log(lefti, clickX, topi, clickY)
        moveclickX = (lefti - clickX) / scalei
        moveclickY = (topi - clickY) / scalei
      } else {
        moveclickX = (topi - clickY) / scalei
        moveclickY = (clickX - lefti) / scalei
      }
      // 右键旋转
      if (e.button !== 0) {
        vm.cleantopcanvas()
        vm.cleanbotcanvas()
        cnt = cnt + 1
        topctx.translate(moveclickX, moveclickY)
        topctx.rotate(Math.PI / 2)
        topctx.translate(0 - moveclickX, 0 - moveclickY)

        botctx.translate(moveclickX, moveclickY)
        botctx.rotate(Math.PI / 2)
        botctx.translate(0 - moveclickX, 0 - moveclickY)
        tmpl = lefti
        tmpt = topi
        lefti = clickX + clickY - tmpt
        topi = clickY - clickX + tmpl
        botctx.drawImage(img, 0, 0, width0, height0)
        vm.drawRects()
        return
      }
      if (mode === 0) {
        movePicture = true
      } else if (mode === 1) {
        let breakflag = false
        let vm = this
        // 判断点是否在未入栈的点集内
        if (points.length > 0) {
          for (i = 0; i < points.length; i++) {
            if (Math.pow(moveclickX - points[i].x, 2) + Math.pow(moveclickY - points[i].y, 2) < Math.pow(vm.pointradius / scalei, 2)) {
              if (SelectedPoint != null) {
                SelectedPoint.isSelected = false
                SelectedPoint = null
              }
              // movePoint=true;
              points[i].isSelected = true
              SelectedPoint = points[i]
              // SelectedPointset = polygon
              breakflag = true
              SelectedPointsetNum = -1 // 选中了未入栈点集，所以清除选中点集的选中状态
              vm.cleantopcanvas()
              vm.drawPoints()
              break
            }
          }
        }
        // 判断点是否在以入栈的点集上
        if (breakflag === false && pointsets.length > 0) {
          for (i = 0; i < pointsets.length; i++) {
            for (j = 0; j < pointsets[i].pointset.length; j++) {
              let temppoint = pointsets[i].pointset[j]
              if (Math.pow(moveclickX - temppoint.x, 2) + Math.pow(moveclickY - temppoint.y, 2) < Math.pow(vm.pointradius / scalei, 2)) {
                if (SelectedPoint != null) {
                  SelectedPoint.isSelected = false
                  SelectedPoint = null
                }
                // if (SelectedPointsetNum !== -1) {
                //   $('#mon')[0].childNodes[4 + SelectedPointsetNum + rectlen + polygonlen].style = 'background:#ffffff'
                // }
                $('#mon')[0].childNodes[childnode + i + rectlen + polygonlen].style = 'background:#ecf5ff'
                // $('#mon')[0].childNodes[childnode + i + rectlen + polygonlen].style = 'background:#6dd9e7'
                let dragdiv = $('#dragcontent')[0]
                // let offsetdiv = $('.goodsForm')[0].offsetHeight
                // let wholeoffset = $('#wholeMark')[0].offSetHeight
                if ($('#mon')[0].childNodes[childnode + i + rectlen + polygonlen].offsetTop + $('#mon')[0].childNodes[childnode + i + rectlen + polygonlen].offsetHeight - dragdiv.offsetHeight > 0) {
                  dragdiv.scrollTop = $('#mon')[0].childNodes[childnode + i + rectlen + polygonlen].offsetTop - 30
                } else {
                  dragdiv.scrollTop = 0
                }
                temppoint.isSelected = true
                SelectedPoint = temppoint
                SelectedPointsetNum = i
                SelectedPointNum = j
                vm.cleantopcanvas()
                vm.drawPoints()
                breakflag = true
                break
              }
            }
            if (breakflag) {
              break
            }
          }
        }
        // 判断点是否在点集的路径内
        // if (breakflag === false) {
        //   for (i = 0; i < pointsets.length; i++) {
        //     topctx.beginPath()
        //     topctx.moveTo((pointsets[i].pointset[0].x - lefti) / scalei, (pointsets[i].pointset[0].y - topi) / scalei)
        //     for (j = 0; j < pointsets[i].pointset.length; j++) {
        //       topctx.lineTo((pointsets[i].pointset[j].x - lefti) / scalei, (pointsets[i].pointset[j].y - topi) / scalei)
        //     }
        //     topctx.closePath()
        //     if (topctx.isPointInPath(moveclickX, moveclickY)) {
        //       if (SelectedPoint != null) { // 切换了选中点集，所以需要清除之前的选中点的状态
        //         SelectedPoint.isSelected = false
        //         SelectedPoint = null
        //       }
        //       // 在路径内切换时，切换选中点集
        //       if (SelectedPointsetNum !== -1) {
        //         $('#mon')[0].childNodes[SelectedPointsetNum + childnode + rectlen + polygonlen].style = 'background:#ffffff'
        //         SelectedPointsetNum = i
        //         $('#mon')[0].childNodes[childnode + i + rectlen + polygonlen].style = 'background:#ecf5ff'
        //       } else {
        //         SelectedPointsetNum = i
        //         $('#mon')[0].childNodes[childnode + i + rectlen + polygonlen].style = 'background:#ecf5ff'
        //       }
        //       breakflag = true
        //       topctx.clearRect((0 - lefti) / scalei, (0 - topi) / scalei, topcanvas.width / scalei, topcanvas.height / scalei)
        //       vm.drawPoints()
        //       break
        //     }
        //   }
        // }
        if (breakflag) {
          movePoint = true
        } else {
        // 画点
          if (SelectedPoint != null) {
            SelectedPoint.isSelected = false
            SelectedPoint = null
          }
          // 取消原点集的选中状态
          // if (SelectedPointsetNum !== -1 && $('#mon')[0].childNodes.length > SelectedPointsetNum + 4 + rectlen + polygonlen) {
          //   $('#mon')[0].childNodes[4 + SelectedPointsetNum + rectlen + polygonlen].style = 'background:#ffffff'
          // }
          SelectedPointsetNum = -1
          let newpoint = new Pointer(moveclickX, moveclickY)
          points.push(newpoint)
          vm.cleantopcanvas()
          vm.drawPoints()
        }
      } else if (mode === 2) {
        let vm = this
        let breakflag = false
        if (SelectedRect != null && $('#mon')[0].childNodes.length > childnode + SelectedRectNum) {
          $('#mon')[0].childNodes[childnode + SelectedRectNum].style = 'background:#ffffff'
          SelectedRect.isSelected = false
          SelectedRect = null
        }
        if (SelectedPointsetNum !== -1 && $('#mon')[0].childNodes.length > childnode + rectlen + SelectedRectNum) {
          $('#mon')[0].childNodes[childnode + rectlen + SelectedRectNum].style = 'background:#ffffff'
          SelectedPointsetNum = -1
        }
        // 判断点是否在未入栈的点集内
        if (polygon.length > 0) {
          for (i = 0; i < polygon.length; i++) {
            if (Math.pow(moveclickX - polygon[i].x, 2) + Math.pow(moveclickY - polygon[i].y, 2) < Math.pow(vm.pointradius / scalei, 2)) {
              if (SelectedPoint != null) {
                SelectedPoint.isSelected = false
                SelectedPoint = null
              }
              polygon[i].isSelected = true
              SelectedPoint = polygon[i]
              breakflag = true
              if (SelectedPointsetNum !== -1 && $('#mon')[0].childNodes.length > SelectedPointsetNum + childnode + rectlen) {
                $('#mon')[0].childNodes[childnode + SelectedPointsetNum + rectlen].style = 'background:#ffffff'
              }
              SelectedPointsetNum = -1 // 选中了未入栈点集，所以清除选中点集的选中状态
              vm.cleantopcanvas()
              vm.drawPolygons()
              break
            }
          }
        }
        // 判断点是否在以入栈的点集上
        if (breakflag === false && polygons.length > 0) {
          for (i = 0; i < polygons.length; i++) {
            for (j = 0; j < polygons[i].pointset.length; j++) {
              let temppoint = polygons[i].pointset[j]
              if (Math.pow(moveclickX - temppoint.x, 2) + Math.pow(moveclickY - temppoint.y, 2) < Math.pow(vm.pointradius / scalei, 2)) {
                if (SelectedPoint != null) {
                  SelectedPoint.isSelected = false
                  SelectedPoint = null
                }
                if (SelectedPointsetNum !== -1 && $('#mon')[0].childNodes.length > childnode + rectlen + SelectedPointsetNum) {
                  $('#mon')[0].childNodes[childnode + rectlen + SelectedPointsetNum].style = 'background:#ffffff'
                }
                $('#mon')[0].childNodes[childnode + rectlen + i].style = 'background:#ecf5ff'
                let dragdiv = $('#dragcontent')[0]
                if ($('#mon')[0].childNodes[childnode + i + rectlen].offsetTop + $('#mon')[0].childNodes[childnode + i + rectlen].offsetHeight - dragdiv.offsetHeight > 0) {
                  dragdiv.scrollTop = $('#mon')[0].childNodes[childnode + i + rectlen].offsetTop - 30
                } else {
                  dragdiv.scrollTop = 0
                }
                temppoint.isSelected = true
                SelectedPoint = temppoint
                SelectedPointsetNum = i
                SelectedPointNum = j
                vm.cleantopcanvas()
                vm.drawPolygons()
                breakflag = true
                break
              }
            }
            if (breakflag) {
              break
            }
          }
        }
        // 判断点是否在点集的路径内
        // if (breakflag === false) {
        //   for (i = 0; i < polygons.length; i++) {
        //     topctx.beginPath()
        //     topctx.moveTo((polygons[i].pointset[0].x - lefti) / scalei, (polygons[i].pointset[0].y - topi) / scalei)
        //     for (j = 0; j < polygons[i].pointset.length; j++) {
        //       topctx.lineTo((polygons[i].pointset[j].x - lefti) / scalei, (polygons[i].pointset[j].y - topi) / scalei)
        //     }
        //     topctx.closePath()
        //     if (topctx.isPointInPath(moveclickX, moveclickY)) {
        //       if (SelectedPoint != null) { // 切换了选中点集，所以需要清除之前的选中点的状态
        //         SelectedPoint.isSelected = false
        //         SelectedPoint = null
        //       }
        //       // 在路径内切换时，切换选中点集
        //       if (SelectedPointsetNum !== -1) {
        //         SelectedPointsetNum = i
        //         $('#mon')[0].childNodes[childnode + i + rectlen].style = 'background:#ecf5ff'
        //         let dragdiv = $('#dragcontent')[0]
        //         // let offsetdiv = $('.goodsForm')[0].offsetHeight
        //         // let wholeoffset = $('#wholeMark')[0].offSetHeight
        //         if ($('#mon')[0].childNodes[childnode + i + rectlen].offsetTop + $('#mon')[0].childNodes[childnode + i + rectlen].offsetHeight - dragdiv.offsetHeight > 0) {
        //           dragdiv.scrollTop = $('#mon')[0].childNodes[childnode + i + rectlen].offsetTop - 30
        //         } else {
        //           dragdiv.scrollTop = 0
        //         }
        //       }
        //       breakflag = true
        //       vm.cleantopcanvas()
        //       vm.drawPolygons()
        //       break
        //     }
        //   }
        // }
        if (breakflag) {
          movePoint = true
        } else {
        // 画点
          if (SelectedPoint != null) {
            SelectedPoint.isSelected = false
            SelectedPoint = null
          }
          // 取消原点集的选中状态
          if (SelectedPointsetNum !== -1 && $('#mon')[0].childNodes.length > SelectedPointsetNum + childnode + rectlen) {
            $('#mon')[0].childNodes[childnode + SelectedPointsetNum + rectlen].style = 'background:#ffffff'
          }
          clickflag = true
          SelectedPointsetNum = -1
          let newpoint = new Pointer(moveclickX, moveclickY)
          polygon.push(newpoint)
          vm.cleantopcanvas()
          vm.drawPolygons()
        }
      } else if (mode === 3) {
        let vm = this
        let breakflag = false
        if (SelectedRect != null) {
          if (moveclickX > SelectedRect.x - 10 && moveclickX < SelectedRect.x + 10 && moveclickY > SelectedRect.y - 10 && moveclickY < SelectedRect.y + 10) {
            lefttop = true
            breakflag = true
          } else if (moveclickX > SelectedRect.x - 10 && moveclickX < SelectedRect.x + 10 && moveclickY > SelectedRect.y + SelectedRect.height - 10 && moveclickY < SelectedRect.y + SelectedRect.height + 10) {
            leftbot = true
            breakflag = true
          } else if (moveclickX > SelectedRect.x + SelectedRect.width - 10 && moveclickX < SelectedRect.x + SelectedRect.width + 10 && moveclickY > SelectedRect.y - 10 && moveclickY < SelectedRect.y + 10) {
            righttop = true
            breakflag = true
          } else if (moveclickX > SelectedRect.x + SelectedRect.width - 10 && moveclickX < SelectedRect.x + SelectedRect.width + 10 && moveclickY > SelectedRect.y + SelectedRect.height - 10 && moveclickY < SelectedRect.y + SelectedRect.height + 10) {
            rightbot = true
            breakflag = true
          }
          x1 = moveclickX - SelectedRect.x
          y1 = moveclickY - SelectedRect.y
          if (breakflag) {
            moveRect = true
            addrect = false
          }
        }
        if (breakflag === false && rects.length > 0) {
          for (i = 0; i < rects.length; i++) {
            if (moveclickX > rects[i].rect.x && moveclickX < rects[i].rect.x + rects[i].rect.width && moveclickY > rects[i].rect.y && moveclickY < rects[i].rect.y + rects[i].rect.height) {
              if (SelectedRect != null) {
                SelectedRect.isSelected = false
                SelectedRect = null
                if (rects.length > 0) {
                  $('#mon')[0].childNodes[childnode + SelectedRectNum].style = 'background:#ffffff'
                }
              }
              rects[i].rect.isSelected = true
              SelectedRect = rects[i].rect
              SelectedRectNum = i
              $('#mon')[0].childNodes[childnode + i].style = 'background:#ecf5ff'
              let dragdiv = $('#dragcontent')[0]
              if ($('#mon')[0].childNodes[childnode + i].offsetTop + $('#mon')[0].childNodes[childnode + i].offsetHeight - dragdiv.offsetHeight > 0) {
                dragdiv.scrollTop = $('#mon')[0].childNodes[childnode + i].offsetTop - 30
              } else {
                dragdiv.scrollTop = 0
              }
              moveRect = true
              addrect = false
              x1 = moveclickX - SelectedRect.x
              y1 = moveclickY - SelectedRect.y
              breakflag = true
              break
            }
          }
        }
        // 记录当前点为drag做准备
        rectx = moveclickX
        recty = moveclickY
        if (!breakflag) {
          addrect = true
          moveRect = false
          if (SelectedRect != null) {
            SelectedRect.isSelected = false
            SelectedRect = null
            if (rects.length > 0) {
              $('#mon')[0].childNodes[childnode + SelectedRectNum].style = 'background:#ffffff'
            }
          }
        }
        vm.cleantopcanvas()
        vm.drawRects()
      } else if (mode === 4) { // 贝塞尔曲线
        let vm = this
        let breakflag = false
        if (SelectedRect != null && $('#mon')[0].childNodes.length > childnode + SelectedRectNum) {
          $('#mon')[0].childNodes[childnode + SelectedRectNum].style = 'background:#ffffff'
          SelectedRect.isSelected = false
          SelectedRect = null
        }
        if (SelectedPointsetNum !== -1 && $('#mon')[0].childNodes.length > childnode + rectlen + SelectedRectNum + pointslen + polygonlen) {
          $('#mon')[0].childNodes[childnode + rectlen + polygonlen + pointslen + SelectedRectNum].style = 'background:#ffffff'
          SelectedPointsetNum = -1
        }
        // 判断点是否在未入栈的点集内
        if (bezierline.length > 0) {
          for (i = 0; i < bezierline.length; i++) {
            if (Math.pow(moveclickX - bezierline[i].x, 2) + Math.pow(moveclickY - bezierline[i].y, 2) < Math.pow(vm.pointradius / scalei, 2)) {
              if (SelectedPoint != null) {
                SelectedPoint.isSelected = false
                SelectedPoint = null
              }
              bezierline[i].isSelected = true
              SelectedPoint = bezierline[i]
              SelectedPointNum = i // ??????????????
              breakflag = true
              if (SelectedPointsetNum !== -1 && $('#mon')[0].childNodes.length > SelectedPointsetNum + childnode + rectlen + pointslen + polygonlen) {
                $('#mon')[0].childNodes[childnode + SelectedPointsetNum + rectlen + pointslen + polygonlen].style = 'background:#ffffff'
              }
              SelectedPointsetNum = -1 // 选中了未入栈点集，所以清除选中点集的选中状态
              vm.cleantopcanvas()
              vm.drawBezierlines()
              break
            }
          }
        }
        // 判断点是否在以入栈的点集上
        if (breakflag === false && bezierlines.length > 0) {
          for (i = 0; i < bezierlines.length; i++) {
            for (j = 0; j < bezierlines[i].pointset.length; j++) {
              let temppoint = bezierlines[i].pointset[j]
              if (Math.pow(moveclickX - temppoint.x, 2) + Math.pow(moveclickY - temppoint.y, 2) < Math.pow(vm.pointradius / scalei, 2)) {
                if (SelectedPoint != null) {
                  SelectedPoint.isSelected = false
                  SelectedPoint = null
                }
                if (SelectedPointsetNum !== -1 && $('#mon')[0].childNodes.length > SelectedPointsetNum + childnode + rectlen + polygonlen + pointslen) {
                  $('#mon')[0].childNodes[childnode + rectlen + SelectedPointsetNum + pointslen + polygonlen].style = 'background:#ffffff'
                }
                $('#mon')[0].childNodes[childnode + rectlen + i + pointslen + polygonlen].style = 'background:#ecf5ff'
                let dragdiv = $('#dragcontent')[0]
                if ($('#mon')[0].childNodes[childnode + i + rectlen + polygonlen + pointslen].offsetTop + $('#mon')[0].childNodes[childnode + i + rectlen + polygonlen + pointslen].offsetHeight - dragdiv.offsetHeight > 0) {
                  dragdiv.scrollTop = $('#mon')[0].childNodes[childnode + i + rectlen + polygonlen + pointslen].offsetTop - 30
                } else {
                  dragdiv.scrollTop = 0
                }
                temppoint.isSelected = true
                SelectedPoint = temppoint
                SelectedPointsetNum = i
                SelectedPointNum = j
                vm.cleantopcanvas()
                vm.drawBezierlines()
                breakflag = true
                break
              }
            }
            if (breakflag) {
              break
            }
          }
        }
        // 判断点是否在点集的路径内
        // if (breakflag === false) {
        //   for (i = 0; i < bezierlines.length; i++) {
        //     topctx.beginPath()
        //     topctx.moveTo((bezierlines[i].pointset[0].x - lefti) / scalei, (bezierlines[i].pointset[0].y - topi) / scalei)
        //     for (j = 0; j < bezierlines[i].pointset.length; j++) {
        //       topctx.lineTo((bezierlines[i].pointset[j].x - lefti) / scalei, (bezierlines[i].pointset[j].y - topi) / scalei)
        //     }
        //     topctx.closePath()
        //     if (topctx.isPointInPath(moveclickX, moveclickY)) {
        //       if (SelectedPoint != null) { // 切换了选中点集，所以需要清除之前的选中点的状态
        //         SelectedPoint.isSelected = false
        //         SelectedPoint = null
        //       }
        //       // 在路径内切换时，切换选中点集
        //       if (SelectedPointsetNum !== -1) {
        //         // $('#mon')[0].childNodes[SelectedPointsetNum + 4 + rectlen].style = 'background:#ffffff'
        //         SelectedPointsetNum = i
        //         $('#mon')[0].childNodes[4 + i + rectlen].style = 'background:#6dd9e7'
        //       } else {
        //         SelectedPointsetNum = i
        //         $('#mon')[0].childNodes[4 + i + rectlen].style = 'background:#6dd9e7'
        //       }
        //       breakflag = true
        //       topctx.clearRect((0 - lefti) / scalei, (0 - topi) / scalei, topcanvas.width / scalei, topcanvas.height / scalei)
        //       vm.drawBezierlines()
        //       break
        //     }
        //   }
        // }
        // 判断点是否为控制点 -- 转移到drawBezierlines???
        // if (breakflag === false) {
        //   if (controlpoint1 != null && controlpoint2 != null) {
        //     if (Math.pow(moveclickX - controlpoint1.x, 2) + Math.pow(moveclickY - controlpoint1.y, 2) < Math.pow(vm.pointradius / scalei, 2)) {
        //       controlpoint1.isSelected = true
        //       SelectedPoint = controlpoint1
        //       // SelectedPointNum = -1 // 控制点的特殊置位
        //       console.log('point1')
        //       breakflag = true
        //     } else if (Math.pow(moveclickX - controlpoint1.x, 2) + Math.pow(moveclickY - controlpoint1.y, 2) < Math.pow(vm.pointradius / scalei, 2)) {
        //       controlpoint2.isSelected = true
        //       SelectedPoint = controlpoint2
        //       // SelectedPointNum = -1 // 控制点的特殊置位
        //       console.log('point2')
        //       breakflag = true
        //     }
        //   }
        // }
        if (breakflag) {
          movePoint = true
        } else {
        // 画点
          if (SelectedPoint != null) {
            SelectedPoint.isSelected = false
            SelectedPoint = null
          }
          // 取消原点集的选中状态
          if (SelectedPointsetNum !== -1 && $('#mon')[0].childNodes.length > SelectedPointsetNum + childnode + rectlen + pointslen + polygonlen) {
            $('#mon')[0].childNodes[childnode + SelectedPointsetNum + rectlen + polygonlen + pointslen].style = 'background:#ffffff'
          }
          SelectedPointsetNum = -1
          let newpoint = new Pointer(moveclickX, moveclickY)
          if (bezierline.length < 1) {
            bezierline.push(newpoint)
          } else {
            let startx = bezierline[bezierline.length - 1].x
            let starty = bezierline[bezierline.length - 1].y
            // 以初始线为直线设置控制点
            let tempcontrolpoint1 = new Pointer(startx + (moveclickX - startx) / 3, starty + (moveclickY - starty) / 3)
            let tempcontrolpoint2 = new Pointer(startx + 2 * (moveclickX - startx) / 3, starty + 2 * (moveclickY - starty) / 3)
            bezierline.push(tempcontrolpoint1)
            bezierline.push(tempcontrolpoint2)
            bezierline.push(newpoint)
          }
          vm.cleantopcanvas()
          vm.drawBezierlines()
        }
      } else if (mode === 5) { // 魔法选取
        vm.magic()
      } else if (mode === 110) {
        let vm = this
        let breakflag = false
        // 判断点是否在未入栈的点集内
        if (facept.length > 0) {
          for (i = 0; i < facept.length; i++) {
            if (Math.pow(moveclickX - facept[i].x, 2) + Math.pow(moveclickY - facept[i].y, 2) < Math.pow(vm.pointradius / scalei, 2)) {
              if (SelectedPoint != null) {
                SelectedPoint.isSelected = false
                SelectedPoint = null
              }
              facept[i].isSelected = true
              SelectedPoint = facept[i]
              breakflag = true
              SelectedPointsetNum = -1 // 选中了未入栈点集，所以清除选中点集的选中状态
              vm.cleantopcanvas()
              vm.drawFacepts()
              break
            }
          }
        }
        // 判断点是否在以入栈的点集上
        if (breakflag === false && facepts.length > 0) {
          for (i = 0; i < facepts.length; i++) {
            for (j = 0; j < facepts[i].pointset.length; j++) {
              let temppoint = facepts[i].pointset[j]
              if (Math.pow(moveclickX - temppoint.x, 2) + Math.pow(moveclickY - temppoint.y, 2) < Math.pow(vm.pointradius / scalei, 2)) {
                if (SelectedPoint != null) {
                  SelectedPoint.isSelected = false
                  SelectedPoint = null
                }
                temppoint.isSelected = true
                SelectedPoint = temppoint
                SelectedPointsetNum = i
                SelectedPointNum = j
                vm.cleantopcanvas()
                vm.drawFacepts()
                breakflag = true
                break
              }
            }
            if (breakflag) {
              break
            }
          }
        }
        if (breakflag) {
          movePoint = true
        } else {
        // 画点
          if (SelectedPoint != null) {
            SelectedPoint.isSelected = false
            SelectedPoint = null
          }
          // clickflag = true
          SelectedPointsetNum = -1
          let newpoint = new Pointer(moveclickX, moveclickY)
          facept.push(newpoint)
          if (facept.length === 6) {
            addface = true
            var newfacept = new Pointer(facept[5].x, facept[5].y)
            facept.push(newfacept)
          }
          vm.cleantopcanvas()
          vm.drawFacepts()
        }
      } else if (mode === 11) {
        let breakflag = false
        let vm = this
        // 判断点是否在未入栈的点集内
        if (newPTs.length > 0) {
          for (i = 0; i < newPTs.length; i++) {
            if (Math.pow(moveclickX - newPTs[i].x, 2) + Math.pow(moveclickY - newPTs[i].y, 2) < Math.pow(vm.pointradius / scalei, 2)) {
              if (SelectedPoint != null) {
                SelectedPoint.isSelected = false
                SelectedPoint = null
              }
              // movePoint=true;
              newPTs[i].isSelected = true
              SelectedPoint = newPTs[i]
              SelectedPointNum = i
              // SelectedPointset = polygon
              breakflag = true
              SelectedPointsetNum = -1 // 选中了未入栈点集，所以清除选中点集的选中状态
              vm.cleantopcanvas()
              vm.drawNewPt()
              break
            }
          }
        }
        // 判断点是否在以入栈的点集上
        if (breakflag === false && newPTsets.length > 0) {
          for (i = 0; i < newPTsets.length; i++) {
            for (j = 0; j < newPTsets[i].pointset.length; j++) {
              let tempnewPT = newPTsets[i].pointset[j]
              if (Math.pow(moveclickX - tempnewPT.x, 2) + Math.pow(moveclickY - tempnewPT.y, 2) < Math.pow(vm.pointradius / scalei, 2)) {
                if (SelectedPoint != null) {
                  SelectedPoint.isSelected = false
                  SelectedPoint = null
                }
                // if (SelectedPointsetNum !== -1) {
                //   $('#mon')[0].childNodes[4 + SelectedPointsetNum + rectlen + polygonlen].style = 'background:#ffffff'
                // }
                $('#mon')[0].childNodes[childnode + i + rectlen + polygonlen + pointslen + bezierlen].style = 'background:#ecf5ff'
                // $('#mon')[0].childNodes[childnode + i + rectlen + polygonlen].style = 'background:#6dd9e7'
                let dragdiv = $('#dragcontent')[0]
                // let offsetdiv = $('.goodsForm')[0].offsetHeight
                // let wholeoffset = $('#wholeMark')[0].offSetHeight
                if ($('#mon')[0].childNodes[childnode + i + rectlen + polygonlen + pointslen + bezierlen].offsetTop + $('#mon')[0].childNodes[childnode + i + rectlen + pointslen + polygonlen].offsetHeight - dragdiv.offsetHeight > 0) {
                  dragdiv.scrollTop = $('#mon')[0].childNodes[childnode + i + rectlen + polygonlen + pointslen + bezierlen].offsetTop - 30
                } else {
                  dragdiv.scrollTop = 0
                }
                tempnewPT.isSelected = true
                SelectedPoint = tempnewPT
                SelectedPointsetNum = i
                SelectedPointNum = j
                vm.cleantopcanvas()
                vm.drawNewPt()
                breakflag = true
                break
              }
            }
            if (breakflag) {
              break
            }
          }
        }
        if (breakflag) {
          movePoint = true
        } else {
        // 画点
          if (SelectedPoint != null) {
            SelectedPoint.isSelected = false
            SelectedPoint = null
          }
          // 取消原点集的选中状态
          // if (SelectedPointsetNum !== -1 && $('#mon')[0].childNodes.length > SelectedPointsetNum + 4 + rectlen + polygonlen) {
          //   $('#mon')[0].childNodes[4 + SelectedPointsetNum + rectlen + polygonlen].style = 'background:#ffffff'
          // }
          SelectedPointsetNum = -1
          let newnewPT = new NewPt(moveclickX, moveclickY, vm.curindex)
          newPTs.push(newnewPT)
          vm.cleantopcanvas()
          vm.drawNewPt()
        }
      }
    },
    // 鼠标拖动事件，包含图片的拖动，标注图形的拖动 // 与canvclick合并成点击拖拽事件？？
    drag: function (e) {
      if (e.button !== 0) {
        return
      }
      // pointx,y为实时的clickX,Y;
      let vm = this
      pointx0 = pointx
      pointy0 = pointy
      pointx = event.clientX - Left - $('#con')[0].offsetParent.offsetLeft
      pointy = event.clientY - $('#canvascontainer')[0].offsetTop - Top - $('#con')[0].offsetParent.offsetTop
      movepointx = (pointx - lefti) / scalei
      movepointy = (pointy - topi) / scalei
      var movepointx0, movepointy0
      if (cnt % 4 === 0) {
        movepointx = (pointx - lefti) / scalei
        movepointy = (pointy - topi) / scalei
        movepointx0 = (pointx0 - lefti) / scalei
        movepointy0 = (pointy0 - topi) / scalei
      } else if (cnt % 4 === 1) {
        movepointx = (pointy - topi) / scalei
        movepointy = (lefti - pointx) / scalei
        movepointx0 = (pointy0 - topi) / scalei
        movepointy0 = (lefti - pointx0) / scalei
      } else if (cnt % 4 === 2) {
        movepointx = (lefti - pointx) / scalei
        movepointy = (topi - pointy) / scalei
        movepointx0 = (lefti - pointx0) / scalei
        movepointy0 = (topi - pointy0) / scalei
      } else {
        movepointx = (topi - pointy) / scalei
        movepointy = (pointx - lefti) / scalei
        movepointx0 = (topi - pointy0) / scalei
        movepointy0 = (pointx0 - lefti) / scalei
      }

      if (mode === 0 && movePicture) {
        topctx.translate(movepointx - movepointx0, movepointy - movepointy0)
        botctx.translate(movepointx - movepointx0, movepointy - movepointy0)
        lefti = lefti + (pointx - pointx0)
        topi = topi + (pointy - pointy0)
        vm.cleantopcanvas()
        vm.cleanbotcanvas()
        botctx.drawImage(img, 0, 0, width0, height0)
        if (tmpmode === 1) {
          vm.drawPoints()
        } else if (tmpmode === 2) {
          vm.drawPolygons()
        } else if (tmpmode === 3) {
          vm.drawRects()
        } else if (tmpmode === 4) {
          vm.drawBezierlines()
        } else if (tmpmode === 5) {
          topctx.drawImage(img001, 0, 0, width0, height0)
        } else if (tmpmode === 11) {
          vm.drawNewPt()
        }
      } else if (mode === 1 && movePoint) {
        if (SelectedPoint != null) {
          SelectedPoint.x = movepointx
          SelectedPoint.y = movepointy
        }
        vm.cleantopcanvas()
        vm.drawPoints()
      } else if (mode === 2) { // && movePoint) {
        if (movePoint && SelectedPoint != null) {
          SelectedPoint.x = movepointx
          SelectedPoint.y = movepointy
        }
        if (clickflag) {
          var newpoint1 = new Pointer(movepointx, movepointy)
          polygon.push(newpoint1)
        }
        vm.cleantopcanvas()
        vm.drawPolygons()
      } else if (mode === 3) {
        vm.cleantopcanvas()
        vm.drawCrossline(e)
        if (moveRect) {
          addrect = false
          if (SelectedRect != null) {
            if (lefttop) {
              SelectedRect.width = SelectedRect.x + SelectedRect.width - movepointx
              SelectedRect.x = movepointx
              SelectedRect.height = SelectedRect.y + SelectedRect.height - movepointy
              SelectedRect.y = movepointy
            } else if (leftbot) {
              SelectedRect.height = movepointy - SelectedRect.y
              SelectedRect.width = SelectedRect.x + SelectedRect.width - movepointx
              SelectedRect.x = movepointx
              SelectedRect.y = movepointy - SelectedRect.height
            } else if (righttop) {
              SelectedRect.width = movepointx - SelectedRect.x
              SelectedRect.height = SelectedRect.y + SelectedRect.height - movepointy
              SelectedRect.y = movepointy
            } else if (rightbot) {
              SelectedRect.width = movepointx - SelectedRect.x
              SelectedRect.height = movepointy - SelectedRect.y
            } else {
              SelectedRect.x = movepointx - x1
              SelectedRect.y = movepointy - y1
            }
            vm.cleantopcanvas()
          }
        } else if (addrect) {
          let rx = rectx
          let ry = recty
          if (rectx > movepointx) {
            rx = movepointx
          }
          if (recty > movepointy) {
            ry = movepointy
          }
          let rwidth = Math.abs(movepointx - rectx)
          let rheight = Math.abs(movepointy - recty)
          rect = new Recter(rx, ry, rwidth, rheight)
          vm.cleantopcanvas()
          vm.drawCrossline(e)
        }
        vm.drawRects()
      } else if (mode === 4 && movePoint) {
        if (SelectedPoint != null) {
          // 非圆润的曲线只需要下面两行即可
          SelectedPoint.x = movepointx
          SelectedPoint.y = movepointy
          // var seps
          // if (SelectedPointsetNum === -1) {
          //   seps = bezierline
          // } else {
          //   seps = bezierlines[SelectedPointsetNum].pointset
          // }
          // // 斜率控制
          // if (SelectedPointNum % 3 === 0) {
          //   // 123
          // } else if (SelectedPointNum % 3 === 1) {
          //   if (SelectedPointNum === 1) {
          //     // 判断一次是否为未入栈曲线，防止把末尾绘制点当作控制点
          //     if (seps.length % 3 !== 0) {
          //       // 空操作
          //     } else {
          //       let ky = seps[0].y - movepointy
          //       let kx = seps[0].x - movepointx
          //       let linelen = Math.sqrt((seps[seps.length - 1].x - seps[0].x) * (seps[seps.length - 1].x - seps[0].x) + (seps[seps.length - 1].y - seps[0].y) * (seps[seps.length - 1].y - seps[0].y))
          //       if (kx !== 0 && ky !== 0) {
          //         let k = ky / kx
          //         seps[seps.length - 1].x = kx / Math.abs(kx) * linelen / Math.sqrt(1 + k * k) + seps[0].x
          //         seps[seps.length - 1].y = ky / Math.abs(ky) * Math.abs(k) * linelen / Math.sqrt(1 + k * k) + seps[0].y
          //       } else if (kx === 0 && ky === 0) {
          //       // 没有移动，空操作
          //       } else if (kx === 0) {
          //         seps[seps.length - 1].x = seps[0].x
          //         seps[seps.length - 1].y = seps[0].y + ky / Math.abs(ky) * linelen
          //       } else if (ky === 0) {
          //         seps[seps.length - 1].x = seps[0].x + kx / Math.abs(kx) * linelen
          //         seps[seps.length - 1].y = seps[0].y
          //       }
          //     }
          //   } else {
          //     let ky = seps[SelectedPointNum - 1].y - movepointy
          //     let kx = seps[SelectedPointNum - 1].x - movepointx
          //     let linelen = Math.sqrt((seps[SelectedPointNum - 1].x - seps[SelectedPointNum - 2].x) * (seps[SelectedPointNum - 1].x - seps[SelectedPointNum - 2].x) + (seps[SelectedPointNum - 1].y - seps[SelectedPointNum - 2].y) * (seps[SelectedPointNum - 1].y - seps[SelectedPointNum - 2].y))
          //     if (kx !== 0 && ky !== 0) {
          //       let k = ky / kx
          //       seps[SelectedPointNum - 2].x = kx / Math.abs(kx) * linelen / Math.sqrt(1 + k * k) + seps[SelectedPointNum - 1].x
          //       seps[SelectedPointNum - 2].y = ky / Math.abs(ky) * Math.abs(k) * linelen / Math.sqrt(1 + k * k) + seps[SelectedPointNum - 1].y
          //     } else if (kx === 0 && ky === 0) {
          //       // 空操作
          //     } else if (kx === 0) {
          //       seps[SelectedPointNum - 2].x = seps[SelectedPointNum - 1].x
          //       seps[SelectedPointNum - 2].y = seps[SelectedPointNum - 1].y + ky / Math.abs(ky) * linelen
          //     } else if (ky === 0) {
          //       seps[SelectedPointNum - 2].x = seps[SelectedPointNum - 1].x + kx / Math.abs(kx) * linelen
          //       seps[SelectedPointNum - 2].y = seps[SelectedPointNum - 1].y
          //     }
          //   }
          // } else {
          //   if (SelectedPointNum === seps.length - 1) {
          //     let ky = seps[0].y - movepointy
          //     let kx = seps[0].x - movepointx
          //     let linelen = Math.sqrt((seps[1].x - seps[0].x) * (seps[1].x - seps[0].x) + (seps[1].y - seps[0].y) * (seps[1].y - seps[0].y))
          //     if (kx !== 0 && ky !== 0) {
          //       let k = ky / kx
          //       seps[1].x = kx / Math.abs(kx) * linelen / Math.sqrt(1 + k * k) + seps[0].x
          //       seps[1].y = ky / Math.abs(ky) * Math.abs(k) * linelen / Math.sqrt(1 + k * k) + seps[0].y
          //     } else if (kx !== 0 && ky !== 0) {
          //       // 空操作
          //     } else if (kx === 0) {
          //       seps[1].x = seps[seps.length - 1].x
          //       seps[1].y = seps[seps.length - 1].y + ky / Math.abs(ky) * linelen
          //     } else if (ky === 0) {
          //       seps[1].x = seps[seps.length - 1].x = seps[seps.length - 1].x + kx / Math.abs(kx) * linelen
          //       seps[1].y = seps[seps.length - 1].y
          //     }
          //   } else {
          //     let ky = seps[SelectedPointNum + 1].y - movepointy
          //     let kx = seps[SelectedPointNum + 1].x - movepointx
          //     // 需要在这里判断一次未入栈曲线，因为未入栈曲线缺少末尾的两个控制点会导致边界溢出
          //     if (SelectedPointNum + 2 > seps.length - 1) {
          //       // 空操作
          //     } else {
          //       let linelen = Math.sqrt((seps[SelectedPointNum + 1].x - seps[SelectedPointNum + 2].x) * (seps[SelectedPointNum + 1].x - seps[SelectedPointNum + 2].x) + (seps[SelectedPointNum + 1].y - seps[SelectedPointNum + 2].y) * (seps[SelectedPointNum + 1].y - seps[SelectedPointNum + 2].y))
          //       if (kx !== 0 && ky !== 0) {
          //         let k = ky / kx
          //         seps[SelectedPointNum + 2].x = kx / Math.abs(kx) * linelen / Math.sqrt(1 + k * k) + seps[SelectedPointNum + 1].x
          //         seps[SelectedPointNum + 2].y = ky / Math.abs(ky) * Math.abs(k) * linelen / Math.sqrt(1 + k * k) + seps[SelectedPointNum + 1].y
          //       } else if (kx !== 0 && ky !== 0) {
          //       // 空操作
          //       } else if (kx === 0) {
          //         seps[SelectedPointNum + 2].x = seps[SelectedPointNum].x
          //         seps[SelectedPointNum + 2].y = seps[SelectedPointNum].y + ky / Math.abs(ky) * linelen
          //       } else if (ky === 0) {
          //         seps[SelectedPointNum + 2].x = seps[SelectedPointNum].x + kx / Math.abs(kx) * linelen
          //         seps[SelectedPointNum + 2].y = seps[SelectedPointNum].y
          //       }
          //     }
          //   }
          // }
        }
        vm.cleantopcanvas()
        vm.drawBezierlines()
      } else if (mode === 5) {
        vm.cleantopcanvas()
        topctx.drawImage(img001, 0, 0, width0, height0)
      } else if (mode === 110) {
        if (movePoint) {
          if (SelectedPoint != null) {
            SelectedPoint.x = movepointx
            SelectedPoint.y = movepointy
          }
        }
        if (addface) {
          // var newfacept = new Pointer(movepointx, movepointy)
          facept[6].x = movepointx
          facept[6].y = movepointy
        }
        vm.cleantopcanvas()
        vm.drawFacepts()
      } else if (mode === 11 && movePoint) {
        if (SelectedPoint != null) {
          SelectedPoint.x = movepointx
          SelectedPoint.y = movepointy
        }
        vm.cleantopcanvas()
        vm.drawNewPt()
      }
    },
    // 停止拖拽动作，主要是一些标志位的重新置位。
    stopDrag: function (e) {
      if (e.button !== 0) {
        return
      }
      let vm = this
      if (mode === 0) {
        if (movePicture) {
          movePicture = false
        } else {
          movePicture = true
        }
      }
      if (mode === 1) {
        if (movePoint) {
          movePoint = false
        } else {
          movePoint = false
        }
      } else if (mode === 2) {
        movePoint = false
        clickflag = false
      } else if (mode === 3) {
        moveRect = false
        lefttop = false
        leftbot = false
        righttop = false
        rightbot = false
        if (SelectedRect != null) {
          if (SelectedRect.width < 0) {
            SelectedRect.x = SelectedRect.x + SelectedRect.width
            SelectedRect.width = Math.abs(SelectedRect.width)
          }
          if (SelectedRect.height < 0) {
            SelectedRect.y = SelectedRect.y + SelectedRect.height
            SelectedRect.height = Math.abs(SelectedRect.height)
          }
        }
        if (addrect) {
          if (rect != null && rect.width * rate >= vm.rectMinW && rect.height * rate >= vm.rectMinH && (rect.width * rate * rate * rect.height) >= vm.rectMinArea) {
            addrect = false
            let mark = new Mark([], [], [])
            let newrect = new Rect(rect, vm.filstyNor)
            rects.push(newrect)
            this.options.splice(rectlen, 0, mark)
            rectlen = rectlen + 1
            rect = null
          } else {
            rect = null
            addrect = false
          }
        }
        vm.cleantopcanvas()
        vm.drawRects()
      } else if (mode === 4) {
        movePoint = false
      } else if (mode === 110) {
        if (movePoint) {
          movePoint = false
        } else {
          movePoint = false
        }
        addface = false
        if (facept.length === 7) {
          var newface = new Facepter(facept, vm.filstyNor)
          facepts.push(newface)
          facept = []
        }
      } else if (mode === 11) {
        if (movePoint) {
          movePoint = false
        } else {
          // vm.curindex = vm.curindex % vm.helptools.length + 1
          vm.curindex = vm.curindex + 1
          movePoint = false
        }
      }
    },
    leavecanvas: function (e) {
      // 移出画布
      let vm = this
      if (mode !== 0 && mode !== 11) {
        vm.stopDrag(e)
      } else {
        movePicture = false
      }
    },
    // 画布清除操作
    cleantopcanvas: function () {
      // console.log('lefti topi:', lefti, topi)
      if (cnt % 4 === 0) {
        topctx.clearRect((0 - lefti) / scalei, (0 - topi) / scalei, topcanvas.width / scalei, topcanvas.height / scalei)
        // botctx.clearRect(0 - lefti, 0 - topi, botcanvas.width / scalei, botcanvas.height / scalei)
      } else if (cnt % 4 === 1) {
        topctx.clearRect((0 - topi) / scalei, (lefti - topcanvas.width) / scalei, topcanvas.height / scalei, topcanvas.width / scalei)
        // botctx.clearRect(topi, lefti - botcanvas.width, botcanvas.height / scalei, botcanvas.width / scalei)
      } else if (cnt % 4 === 2) {
        topctx.clearRect((lefti - topcanvas.width) / scalei, (topi - topcanvas.height) / scalei, topcanvas.width / scalei, topcanvas.height / scalei)
        // botctx.clearRect(lefti - botcanvas.width, topi - botcanvas.height, botcanvas.width / scalei, botcanvas.height / scalei)
      } else if (cnt % 4 === 3) {
        topctx.clearRect((topi - topcanvas.height) / scalei, (0 - lefti) / scalei, topcanvas.height / scalei, topcanvas.width / scalei)
        // botctx.clearRect(topi - botcanvas.height, 0 - lefti, botcanvas.height / scalei, botcanvas.width / scalei)
      }
    },
    cleanbotcanvas: function () {
      if (cnt % 4 === 0) {
        // topctx.clearRect(0 - lefti, 0 - topi, topcanvas.width / scalei, topcanvas.height / scalei)
        botctx.clearRect((0 - lefti) / scalei, (0 - topi) / scalei, botcanvas.width / scalei, botcanvas.height / scalei)
      } else if (cnt % 4 === 1) {
        // topctx.clearRect(topi, lefti - topcanvas.width, topcanvas.height / scalei, topcanvas.width / scalei)
        botctx.clearRect((0 - topi) / scalei, (lefti - botcanvas.width) / scalei, botcanvas.height / scalei, botcanvas.width / scalei)
      } else if (cnt % 4 === 2) {
        // topctx.clearRect(lefti - topcanvas.width, topi - topcanvas.height, topcanvas.width / scalei, topcanvas.height / scalei)
        botctx.clearRect((lefti - botcanvas.width) / scalei, (topi - botcanvas.height) / scalei, botcanvas.width / scalei, botcanvas.height / scalei)
      } else if (cnt % 4 === 3) {
        // topctx.clearRect(topi - topcanvas.height, 0 - lefti, topcanvas.height / scalei, topcanvas.width / scalei)
        botctx.clearRect((topi - botcanvas.height) / scalei, (0 - lefti) / scalei, botcanvas.height / scalei, botcanvas.width / scalei)
      }
    },
    /****************************************************************************/
    /*                                 功能函数                                  */
    /****************************************************************************/

    // 魔法选取
    magic: function () {
      let vm = this
      // 先恢复到原始大小
      vm.reset()
      // topctx.translate((0 - lefti) / scalei, (0 - topi) / scalei)
      // topctx.scale(1 / scalei, 1 / scalei)
      // botctx.translate((0 - lefti) / scalei, (0 - topi) / scalei)
      // botctx.scale(1 / scalei, 1 / scalei)
      // 进行漫水填充，点需要转化为对应的点
      var imgData = botctx.getImageData(0, 0, botcanvas.width, botcanvas.height)
      let result = floodFill.floodFill(imgData, Math.floor(moveclickX), Math.floor(moveclickY), vm.threshold)
      // let tmpdata = topctx.createImageData(botcanvas.width, botcanvas.height)
      for (var i = 0; i < result.length; i++) {
        if (result[i]) {
          tmpdata.data[4 * i] = 0
          tmpdata.data[4 * i + 1] = 0
          tmpdata.data[4 * i + 2] = 0
          tmpdata.data[4 * i + 3] = 255
        }
      }
      // console.log(tmpdata)
      topctx.putImageData(tmpdata, 0, 0)
      img001.src = topcanvas.toDataURL()

      img001.onload = function () {
        // console.log(img001.height)
        botctx.drawImage(img, 0, 0, width0, height0)
        topctx.drawImage(img001, 0, 0, width0, height0)
      }
      vm.unreset()
      // topctx.scale(scalei, scalei)
      // topctx.translate(lefti / scalei,topi / scalei)
      // botctx.scale(scalei, scalei)
      // botctx.translate(lefti / scalei,topi / scalei)
    },
    unmagic: function () {
      let vm = this
      vm.reset()
      var imgData = botctx.getImageData(0, 0, botcanvas.width, botcanvas.height)
      let result = floodFill.floodFill(imgData, Math.floor(moveclickX), Math.floor(moveclickY), vm.threshold)
      for (var i = 0; i < result.length; i++) {
        if (result[i]) {
          tmpdata.data[4 * i] = 0
          tmpdata.data[4 * i + 1] = 0
          tmpdata.data[4 * i + 2] = 0
          tmpdata.data[4 * i + 3] = 0
        }
      }
      topctx.putImageData(tmpdata, 0, 0)
      img001.src = topcanvas.toDataURL()
      img001.onload = function () {
        // console.log(img001.height)
        botctx.drawImage(img, 0, 0, width0, height0)
        topctx.drawImage(img001, 0, 0, width0, height0)
      }
      vm.unreset()
    },
    eraser: function (e) {
      // 空todo
    },
    // 多边形闭合，点阵闭合，曲线闭合
    complete: function () {
      let vm = this
      if (mode === 0) {
        window.alert('无法在移动图片时完成标注，请切换到对应的模式')
        return
      }
      if (mode === 2) { // 多边形
        if (SelectedPoint != null) {
          SelectedPoint.isSelected = false
          SelectedPoint = null
        }
        if (polygon.length > 1) {
          let newpolygon = new Polygoner(polygon, vm.filstyNor, vm.completeflag)
          let markpolygon = new Mark([], [], [])
          vm.options.splice(rectlen + polygonlen, 0, markpolygon)
          polygonlen = polygonlen + 1
          polygons.push(newpolygon)
          polygon = []
          vm.cleantopcanvas()
          vm.drawPolygons()
        }
      } else if (mode === 1) { // 点集
        if (SelectedPoint != null) {
          SelectedPoint.isSelected = false
          SelectedPoint = null
        }
        if (points.length > 0) {
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
          let newpointset = new Pointseter(points, vm.filstyNor)
          let markpointset = new Mark([], [], [])
          vm.options.splice(rectlen + polygonlen + pointslen, 0, markpointset)
          pointslen = pointslen + 1
          pointsets.push(newpointset)
          points = []
          vm.cleantopcanvas()
          vm.drawPoints()
        }
      } else if (mode === 4) { // 贝塞尔曲线
        if (SelectedPoint != null) {
          SelectedPoint.isSelected = false
          SelectedPoint = null
        }
        if (bezierline.length > 2) {
          // 起止点之间的控制点入栈
          let startx = bezierline[0].x
          let starty = bezierline[0].y
          let endx = bezierline[bezierline.length - 1].x
          let endy = bezierline[bezierline.length - 1].y
          let controlpoint1 = new Pointer(startx + (endx - startx) / 3, starty + (endy - starty) / 3)
          let controlpoint2 = new Pointer(startx + 2 * (endx - startx) / 3, starty + 2 * (endy - starty) / 3)
          bezierline.push(controlpoint1)
          bezierline.push(controlpoint2)
          let newbezierline = new Bezierliner(bezierline, vm.filstyNor, vm.completeflag)
          let markbezierline = new Mark([], [], [])
          vm.options.splice(rectlen + polygonlen + pointslen + bezierlen, 0, markbezierline)
          bezierlen = bezierlen + 1
          bezierlines.push(newbezierline)
          bezierline = []
          vm.cleantopcanvas()
          vm.drawBezierlines()
        }
      } else if (mode === 11) { // 关键点
        if (SelectedPoint != null) {
          SelectedPoint.isSelected = false
          SelectedPoint = null
        }
        if (newPTs.length > 0) {
          let newnewPTset = new Pointseter(newPTs, vm.filstyNor)
          let marknewPTset = new Mark([], [], [])
          vm.options.push(marknewPTset)
          newPTsets.push(newnewPTset)
          newPTs = []
          vm.curindex = 1
          vm.cleantopcanvas()
          vm.drawNewPt()
        }
      }
    },
    // 多边形删除操作，逐点删除，当该多边形内没有点时，移除该多边形
    delpolygon: function () {
      let vm = this
      if (SelectedPointsetNum === -1) { // 表明选中的是还未入栈的点集
        if (SelectedPoint != null) {
          SelectedPoint.isSelected = false
          SelectedPoint = null
          polygon.splice(SelectedPointNum, 1)
          vm.cleantopcanvas()
          vm.drawPolygons()
        }
      } else if (SelectedPoint != null) { // 表明选中了以入栈的点集
        SelectedPoint.isSelected = false
        SelectedPoint = null
        polygons[SelectedPointsetNum].pointset.splice(SelectedPointNum, 1)
        if (polygons[SelectedPointsetNum].pointset.length < 1) {
          polygons.splice(SelectedPointsetNum, 1)
          vm.options.splice(rectlen + SelectedPointsetNum, 1)
          polygonlen = polygonlen - 1
          if (SelectedPointsetNum !== -1 && $('#mon')[0].childNodes.length > SelectedPointsetNum + childnode + rectlen) {
            $('#mon')[0].childNodes[childnode + SelectedPointsetNum + rectlen].style = 'background:#ffffff'
          }
          SelectedPointsetNum = -1 // 清除以删除点集的选中状态
        }
        vm.cleantopcanvas()
        vm.drawPolygons()
      }
    },
    // 点阵的删除
    delpoints: function () {
      let vm = this
      if (SelectedPointsetNum === -1) { // 表明选中的是还未入栈的点集
        if (SelectedPoint != null) {
          SelectedPoint.isSelected = false
          SelectedPoint = null
          points.splice(SelectedPointNum, 1)
          vm.cleantopcanvas()
          vm.drawPoints()
        }
      } else if (SelectedPoint != null) { // 表明选中了以入栈的点集
        SelectedPoint.isSelected = false
        SelectedPoint = null
        pointsets[SelectedPointsetNum].pointset.splice(SelectedPointNum, 1)
        if (pointsets[SelectedPointsetNum].pointset.length < 1) {
          pointsets.splice(SelectedPointsetNum, 1)
          vm.options.splice(rectlen + polygonlen + SelectedPointsetNum, 1)
          pointslen = pointslen - 1
          SelectedPointsetNum = -1 // 清除以删除点集的选中状态
        }
        vm.cleantopcanvas()
        vm.drawPoints()
      }
    },
    delnewpt: function () {
      let vm = this
      console.log(SelectedPointsetNum)
      if (SelectedPointsetNum === -1) { // 表明选中的是还未入栈的点集
        if (SelectedPoint != null) {
          SelectedPoint.isSelected = false
          SelectedPoint = null
          newPTs.splice(SelectedPointNum, 1)
          vm.cleantopcanvas()
          vm.drawNewPt()
        }
      } else if (SelectedPoint != null) { // 表明选中了以入栈的点集
        SelectedPoint.isSelected = false
        SelectedPoint = null
        newPTsets[SelectedPointsetNum].pointset.splice(SelectedPointNum, 1)
        if (newPTsets[SelectedPointsetNum].pointset.length < 1) {
          newPTsets.splice(SelectedPointsetNum, 1)
          vm.options.splice(rectlen + polygonlen + pointslen + bezierlen + SelectedPointsetNum, 1)
          SelectedPointsetNum = -1 // 清除以删除点集的选中状态
        }
        vm.cleantopcanvas()
        vm.drawNewPt()
      }
    },
    // 曲线的删除
    delbezier: function () {
      let vm = this
      if (SelectedPointsetNum === -1) { // 表明选中的是还未入栈的点集
        if (SelectedPoint != null && SelectedPointNum % 3 === 0) {
          SelectedPoint.isSelected = false
          SelectedPoint = null
          bezierline.splice(SelectedPointNum, 3)
          vm.cleantopcanvas()
          vm.drawBezierlines()
        }
      } else if (SelectedPoint != null && SelectedPointNum % 3 === 0) { // 表明选中了以入栈的点集
        SelectedPoint.isSelected = false
        SelectedPoint = null
        bezierlines[SelectedPointsetNum].pointset.splice(SelectedPointNum, 3)
        if (bezierlines[SelectedPointsetNum].pointset.length < 1) {
          bezierlines.splice(SelectedPointsetNum, 1)
          vm.options.splice(pointslen + polygonlen + rectlen + SelectedPointsetNum, 1)
          // bezierlinelen = bezierlinelen - 1
          if (SelectedPointsetNum !== -1 && $('#mon')[0].childNodes.length > SelectedPointsetNum + childnode + rectlen + polygonlen + pointslen) {
            $('#mon')[0].childNodes[childnode + SelectedPointsetNum + polygonlen + pointslen + rectlen].style = 'background:#ffffff'
          }
          bezierlen = bezierlen - 1
          SelectedPointsetNum = -1 // 清除以删除点集的选中状态
        }
        vm.cleantopcanvas()
        vm.drawBezierlines()
      }
    },
    // 矩形的删除
    delrect: function () {
      let vm = this
      if (SelectedRect != null) {
        SelectedRect.isSelected = false
        SelectedRect = null
        rects.splice(SelectedRectNum, 1)
        rectlen = rectlen - 1
        vm.options.splice(SelectedRectNum, 1)
      }
      vm.cleantopcanvas()
      vm.drawRects()
    },
    delfacepts: function () {
      let vm = this
      if (SelectedPoint != null) { // 表明选中了以入栈的点集
        SelectedPoint.isSelected = false
        SelectedPoint = null
        facepts.splice(SelectedPointsetNum, 1)
        SelectedPointsetNum = -1 // 清除以删除点集的选中状态
        vm.cleantopcanvas()
        vm.drawFacepts()
      }
    },

    // 清空当前所有标注
    clear: function () {
      let vm = this
      points = []
      pointsets = []
      newPTs = []
      newPTsets = []
      rects = []
      rect = null
      polygon = []
      polygons = []
      bezierlines = []
      bezierline = []
      this.options = []
      rectlen = 0
      pointslen = 0
      polygonlen = 0
      bezierlen = 0
      facept = []
      facepts = []
      vm.cleantopcanvas()
    },

    // 重置图片的位置
    reset: function () {
      let vm = this
      // 先旋转回来
      while (cnt % 4 !== 0) {
        if (cnt % 4 === 0) {
          moveclickX = (clickX - lefti) / scalei
          moveclickY = (clickY - topi) / scalei
        } else if (cnt % 4 === 1) {
          moveclickX = (clickY - topi) / scalei
          moveclickY = (lefti - clickX) / scalei
        } else if (cnt % 4 === 2) {
          moveclickX = (lefti - clickX) / scalei
          moveclickY = (topi - clickY) / scalei
        } else {
          moveclickX = (topi - clickY) / scalei
          moveclickY = (clickX - lefti) / scalei
        }
        vm.cleantopcanvas()
        vm.cleanbotcanvas()
        cnt = cnt + 1
        topctx.translate(moveclickX, moveclickY)
        // console.log(moveclickX, moveclickY)
        topctx.rotate(Math.PI / 2)
        topctx.translate(0 - moveclickX, 0 - moveclickY)

        botctx.translate(moveclickX, moveclickY)
        botctx.rotate(Math.PI / 2)
        botctx.translate(0 - moveclickX, 0 - moveclickY)
        let l = lefti
        let t = topi
        lefti = clickX + clickY - t
        topi = clickY - clickX + l
        botctx.drawImage(img, 0, 0, width0, height0)
      }
      tleft = lefti
      ttop = topi
      tscale = scalei
      // 重置图片
      topctx.translate((0 - lefti) / scalei, (0 - topi) / scalei)
      topctx.scale(1 / scalei, 1 / scalei)
      topctx.clearRect(0, 0, topcanvas.width, topcanvas.height)
      botctx.translate((0 - lefti) / scalei, (0 - topi) / scalei)
      botctx.scale(1 / scalei, 1 / scalei)
      botctx.clearRect(0, 0, botcanvas.width, topcanvas.height)
      lefti = 0
      topi = 0
      scalei = 1
      if (mode === 1) {
        vm.drawPoints()
      } else if (mode === 2) {
        vm.drawPolygons()
      } else if (mode === 3) {
        vm.drawRects()
      } else if (mode === 4) {
        vm.drawBezierlines()
      } else if (mode === 5) {
        topctx.drawImage(img001, 0, 0, width0, height0)
      }
      botctx.drawImage(img, 0, 0, width0, height0)
    },
    unreset: function () {
      let vm = this
      lefti = tleft
      topi = ttop
      scalei = tscale
      topctx.scale(scalei, scalei)
      topctx.translate(lefti / scalei, topi / scalei)
      botctx.scale(scalei, scalei)
      botctx.translate(lefti / scalei, topi / scalei)
      vm.cleantopcanvas()
      vm.cleanbotcanvas()
      botctx.drawImage(img, 0, 0, width0, height0)
      topctx.drawImage(img001, 0, 0, width0, height0)
    },

    del: function () {
      let vm = this
      if (mode === 1 && SelectedPoint != null && SelectedPointNum !== -1) {
        vm.delpoints()
      }
      if (mode === 2 && SelectedPoint != null) {
        vm.delpolygon()
      }
      if (mode === 3 && SelectedRect != null) {
        vm.delrect()
      }
      if (mode === 4 && SelectedPoint != null) {
        vm.delbezier()
      }
      if (mode === 110) {
        vm.delfacepts()
      }
      if (mode === 11) {
        vm.delnewpt()
      }
    },

    undo: function () {
      let vm = this
      if (mode === 1 && points != null) {
        points.pop()
        vm.cleantopcanvas()
        vm.drawPoints()
      }
      if (mode === 2 && polygon != null) {
        polygon.pop()
        vm.cleantopcanvas()
        vm.drawPolygons()
      }
      if (mode === 3) {
        if (rects.length > 0) {
          rects.pop()
          rectlen = rectlen - 1
          this.options.splice(rectlen, 1)
          vm.cleantopcanvas()
          vm.drawRects()
        }
      }
      if (mode === 4 && bezierline != null) {
        bezierline.pop() // 先弹出两个控制点，再弹出绘制点
        bezierline.pop()
        bezierline.pop()
        vm.cleantopcanvas()
        vm.drawBezierlines()
      }
      if (mode === 110) {
        facept.pop()
        vm.cleantopcanvas()
        vm.drawFacepts()
      }
      if (mode === 11 && newPTs.length > 0) {
        newPTs.pop()
        // vm.curindex = vm.curindex === 1 ? vm.helptools.length : (vm.curindex - 1 + vm.helptools.length) % vm.helptools.length
        vm.curindex = vm.curindex - 1
        vm.cleantopcanvas()
        vm.drawNewPt()
      }
    },

    // 倾斜矩形 --临时功能
    mode110: function () {
      let vm = this
      mode = 110
      vm.mode = 110
    },
    // 移动图片
    mode0: function () {
      let vm = this
      tmpmode = mode
      mode = 0
      vm.mode = 0
      if (SelectedRect != null) {
        SelectedRect.isSelected = false
        SelectedRect = null
        if (rects.length > 0) {
          $('#mon')[0].childNodes[childnode + SelectedRectNum].style = 'background:#ffffff'
        }
      }
    },
    // 描点显示模式
    mode1: function () {
      preflag = true
      let vm = this
      tmpmode = mode
      vm.mode = 1
      mode = 1
      vm.cleantopcanvas()
      vm.drawPoints()
    },
    mode11: function () {
      preflag = true
      let vm = this
      vm.mode = 11
      tmpmode = mode
      mode = 11
      vm.cleantopcanvas()
      vm.drawNewPt()
    },
    // 多边形显示模式
    mode2: function () {
      preflag = true
      let vm = this
      tmpmode = mode
      mode = 2
      vm.mode = 2
      vm.completeflag = true
      vm.cleantopcanvas()
      vm.drawPolygons()
    },
    // 矩形显示模式
    mode3: function () {
      preflag = true
      let vm = this
      tmpmode = mode
      mode = 3
      vm.mode = 3
      vm.cleantopcanvas()
      vm.drawRects()
    },
    // 贝塞尔区域显示模式
    mode4: function () {
      preflag = true
      let vm = this
      tmpmode = mode
      mode = 4
      vm.mode = 4
      vm.completeflag = true
      vm.cleantopcanvas()
      vm.drawBezierlines()
    },
    // 折线
    polyline: function () {
      preflag = true
      let vm = this
      tmpmode = mode
      mode = 2
      vm.mode = 2
      vm.completeflag = false
      vm.cleantopcanvas()
      vm.drawPolygons()
    },
    // 贝塞尔曲线
    bezierline: function () {
      preflag = true
      let vm = this
      tmpmode = mode
      mode = 4
      vm.mode = 4
      vm.completeflag = false
      vm.cleantopcanvas()
      vm.drawBezierlines()
    },
    // 魔法选取
    magicmode: function () {
      preflag = false
      let vm = this
      tmpmode = mode
      mode = 5
      vm.cleantopcanvas()
      topctx.drawImage(img001, 0, 0, width0, width0)
    },
    // 鼠标缩放事件
    mousescale: function (e) {
      let vm = this
      var delta
      height1 = $('#canvascontainer')[0].clientHeight
      // console.log($('#canvascontainer')[0].clientHeight)
      width1 = $('#canvascontainer')[0].clientWidth
      Left = (width1 - $('#top')[0].width) / 2.0
      Top = (height1 - $('#top')[0].height) / 2.0
      clickX = event.clientX - Left - $('#con')[0].offsetParent.offsetLeft
      clickY = event.clientY - $('#canvascontainer')[0].offsetTop - Top - $('#con')[0].offsetParent.offsetTop
      moveclickX = (clickX - lefti) / scalei
      moveclickY = (clickY - topi) / scalei
      if (cnt % 4 === 0) {
        botctx.translate(moveclickX, moveclickY)
        topctx.translate(moveclickX, moveclickY)
        delta = 1 + e.wheelDelta / 1200
        botctx.scale(delta, delta)
        topctx.scale(delta, delta)

        topctx.translate(0 - moveclickX, 0 - moveclickY)
        botctx.translate(0 - moveclickX, 0 - moveclickY)
      } else if (cnt % 4 === 1) {
        botctx.translate(moveclickY, 0 - moveclickX)
        topctx.translate(moveclickY, 0 - moveclickX)
        delta = 1 + e.wheelDelta / 1200
        botctx.scale(delta, delta)
        topctx.scale(delta, delta)

        topctx.translate(0 - moveclickY, moveclickX)
        botctx.translate(0 - moveclickY, moveclickX)
      } else if (cnt % 4 === 2) {
        botctx.translate(0 - moveclickX, 0 - moveclickY)
        topctx.translate(0 - moveclickX, 0 - moveclickY)
        delta = 1 + e.wheelDelta / 1200
        botctx.scale(delta, delta)
        topctx.scale(delta, delta)

        topctx.translate(moveclickX, moveclickY)
        botctx.translate(moveclickX, moveclickY)
      } else if (cnt % 4 === 3) {
        botctx.translate(0 - moveclickY, moveclickX)
        topctx.translate(0 - moveclickY, moveclickX)
        delta = 1 + e.wheelDelta / 1200
        botctx.scale(delta, delta)
        topctx.scale(delta, delta)

        topctx.translate(moveclickY, 0 - moveclickX)
        botctx.translate(moveclickY, 0 - moveclickX)
      }
      // delta = 1 + e.wheelDelta / 1200
      // botctx.scale(delta, delta)
      // topctx.scale(delta, delta)

      // topctx.translate(0 - moveclickX, 0 - moveclickY)
      // botctx.translate(0 - moveclickX, 0 - moveclickY)

      lefti = lefti - moveclickX * (delta - 1) * scalei
      topi = topi - moveclickY * (delta - 1) * scalei
      scalei = scalei * delta
      vm.cleantopcanvas()
      vm.cleanbotcanvas()
      botctx.drawImage(img, 0, 0, width0, height0)
      if (mode === 0) {
        if (tmpmode === 1) {
          vm.drawPoints()
        } else if (tmpmode === 2) {
          vm.drawPolygons()
        } else if (tmpmode === 3) {
          vm.drawRects()
        } else if (tmpmode === 4) {
          vm.drawBezierlines()
        } else if (tmpmode === 110) {
          vm.drawFacepts()
        } else if (tmpmode === 11) {
          vm.drawNewPt()
        }
      } else if (mode === 1) {
        vm.drawPoints()
      } else if (mode === 2) {
        vm.drawPolygons()
      } else if (mode === 3) {
        vm.drawRects()
      } else if (mode === 4) {
        vm.drawBezierlines()
      } else if (mode === 110) {
        vm.drawFacepts()
      } else if (mode === 11) {
        vm.drawNewPt()
      }
    }
  }
}

/****************************************************************************/
/*                               快捷键设定                                  */
/****************************************************************************/

var tmpmode = 0
// onkeydown按住键盘触发的是连续事件添加tmpcode使其只执行一次
var tmpcode = true
// tapp用于保存vm环境
var tapp
function bindKeyEvent () {
  document.onkeydown = function (event) {
    if (event.keyCode === 18 && tmpcode) {
      tmpmode = mode
      mode = 0
      tapp.mode = 0
      tmpcode = false
    }
    if (event.keyCode === 90 && event.ctrlKey) {
      // ctrl + z 撤销
      if (mode === 5) {
        tapp.unmagic() // 暂时添加
      }
      event.returnValue = false
      tapp.undo()
    }
    if (event.keyCode === 65 && event.ctrlKey) {
      // ctrl + A 保存
      event.returnValue = false
      tapp.complete()
    }
    if (event.keyCode === 83 && event.ctrlKey) {
      // ctrl + S 提交
      event.returnValue = false
      tapp.postTask()
    }
    if (event.keyCode === 68 && event.ctrlKey) {
      // ctrl + D 删除
      event.returnValue = false
      tapp.del()
    }
  }
  document.onkeyup = function (event) {
    tmpcode = true
    if (event.keyCode === 18) {
      mode = tmpmode
      tapp.mode = tmpmode
    }
  }
  // document.onkeydown = function (event) {
  //   if (event.keyCode === 90 && event.ctrlKey) {
  //     console.log(event.keyCode)
  //     console.log(event.ctrlKey)
  //     // let vm = this
  //     console.log(this.$options)
  //   }
  // }
  // ctrl + 1,2,3,4 切换mode
  // document.onkeydown = function (e) {
  //   let vm = this
  //   if (e.keyCode === 97 && e.ctrlKey) {
  //     vm.mode1()
  //   } else if (e.keyCode === 98 && e.ctrlKey) {
  //     vm.mode2()
  //   } else if (e.keyCode === 99 && e.ctrlKey) {
  //     vm.mode3()
  //   } else if (e.keyCode === 100 && e.ctrlKey) {
  //     vm.mode4()
  //   }
  // }
}
// 自适应相关函数，存疑！！
// $(function () {
//   $(window).resize(function () {
//     width1 = $('#canvascontainer').clientWidth() * 0.7
//     height1 = $('#canvascontainer').clientHeight()
//     topcanvas.width = width1
//     topcanvas.height = height1
//     botcanvas.width = width1
//     botcanvas.height = height1
//     botctx.drawImage(img, 0, 0, width0, height0)
//   }).resize()
// })
</script>
<style>
.content {
  flex: 1 0 auto;
}
.ql-container {
  height: 150px;
}
.ques-title {
  letter-spacing: 2px;
  font-size: 14px;
}
.goodsForm {
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #b3d8ff;
}
.goods-input {
  width:40%;
}
.el-select .el-input {
  width: 100px;
}
.input-with-select .el-input-group__prepend {
  background: rgba(255,255,255,0.5);
}
.card-head {
  /* border:thin solid #6dd9e7; */
  width: 100%;
  height: 200px;
  overflow: scroll;
  margin: 0
}
.work-btn {
  padding: 40px 0 20px;
  margin: 0 auto;
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
.workspace {
  position: absolute;
  left: 15px;
  top: 5px;
  z-index: 3;
}
#bot {
	position: absolute;left:50%;top:50%;
	transform: translate(-50%, -50%);
	background: #C0C4CC;
	/* border: 4px solid #409EFF; */
	z-index: 1;
}

#top {
  position: absolute;
  /* left:50%;top:50%; */
	/* transform: translate(-50%, -50%); */
	/* border: 1px solid #DCDFE6; */
	z-index: 2;
}

#tools {
  position: absolute;
  left:75%;
  top:0%;
}
.item-del{
  display: flex;
  justify-content: space-between;
}
.drag-div .el-radio__input.is-disabled.is-checked+span.el-radio__label,
.drag-div .el-checkbox__input.is-disabled.is-checked+span.el-checkbox__label,
.drag-div .el-input.is-disabled .el-input__inner {
  color: #409EFF;
  font-weight: 600;
}
.drag-div .el-radio__input.is-disabled.is-checked .el-radio__inner {
  background-color: #409EFF;
  border-color: #409EFF;
}
.drag-div .el-radio__input.is-disabled.is-checked .el-radio__inner::after {
  background-color: #fff;
}
.drag-div .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner {
  background-color: #409EFF;
  border-color: #409EFF;
}
.drag-div .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner::after {
  border-color: #fff;
}
</style>
