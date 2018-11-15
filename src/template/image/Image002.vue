<template>
  <div id="con">
    <el-button-group display="inline" class="work-btn">
      <el-button type="primary" @click="preview" icon="el-icon-view">{{$t("labelTool.preview")}}</el-button>
      <el-button id="move" type="primary" @click="mode0" icon="el-icon-rank">{{$t("labelTool.move")}}</el-button>
      <el-button id="rect" type="primary" @click="mode3" icon="el-icon-edit-outline">{{$t("labelTool.rect")}}</el-button>
      <!-- <el-button v-if="SopType ===1003" id="point" type="primary" @click="mode1">描点</el-button>
      <el-button v-if="SopType ===1003" id="ploygon" type="primary" @click="mode2">多边形</el-button>
      <el-button v-if="SopType ===1003" type="primary" @click="polyline">折线</el-button>
      <el-button v-if="SopType ===1003" id="bezier" type="primary" @click="mode4">曲线区域</el-button>
      <el-button v-if="SopType ===1003" type="primary" @click="bezierline">曲线</el-button>
      <el-button v-if="SopType ===1003 && mode !== 3" id="comp" type="primary" @click="complete">完成</el-button> -->
      <el-button id="del" type="primary" @click="del" icon="el-icon-delete">{{$t("labelTool.delete")}}</el-button>
      <el-button id="undo" type="primary" @click="undo" icon="el-icon-delete">{{$t("labelTool.recall")}}</el-button>
      <el-button id="clear" type="primary" @click="clear" icon="el-icon-refresh">{{$t("labelTool.clear")}}</el-button>
      <el-button id="reset" type="primary" @click="reset" icon="el-icon-refresh">{{$t("labelTool.reset")}}</el-button>
      <el-button v-if="PostButtonVisible === true" id="post" type="primary" @click="postTask" icon="el-icon-check">{{$t("taskPublic.submitTask")}}</el-button>
      <!-- <el-button id="test" type="primary" @click="test">测试</el-button> -->
      <slot></slot>
    </el-button-group>
    <div display="inline" style="padding:0; margin:0 auto">
      <el-button type="text">{{$t("labelTool.filstySP")}}</el-button>
      <el-color-picker v-model="filstySP"></el-color-picker>
      <el-button type="text">{{$t("labelTool.filstySPs")}}</el-button>
      <el-color-picker v-model="filstySPs"></el-color-picker>
      <el-button type="text">{{$t("labelTool.pointradius")}}</el-button>
      <el-slider v-model="pointradius"></el-slider>
    </div>
    <div id="canvascontainer">
      <canvas id="bot" ref="botcanvas" ></canvas>
      <canvas id="top" ref="topcanvas" @mousedown="canvasClick" @mousemove="drag" @mouseup="stopDrag" @mousewheel="mousescale"></canvas>
    </div>
    <DragDiv :title="$t('labelTool.workbanch')" dragHeight=620>
      <!-- <el-card class="box-card"> -->
      <div id="wholeMark" style="border: 1px solid #b3d8ff;">
        <div class="messageInLab" v-for="(messageLab,messIndex) in wholeRadios" :key='messageLab.title'>
          <span>{{messIndex + 1}}.{{messageLab.title}}:</span>
          <el-radio-group v-model="wholeRadioContents[messIndex]" style="display:block">
            <el-radio  v-for="(lab,num) in messageLab.labels" :key='lab' :label="num">{{lab.name}} </el-radio>
          </el-radio-group>
        </div>
        <div class="messageInLab" v-for="(messageLab,messIndex) in wholeCheckBoxs" :key='messageLab.title'>
          <span>{{messIndex + 1 + wholeRadios.length}}.{{messageLab.title}}:</span>
          <el-checkbox-group v-model="wholeCheckBoxContents[messIndex]">
            <el-checkbox v-for="(lab,num) in messageLab.labels" :key='lab' :label="num">{{lab.name}}</el-checkbox>
          </el-checkbox-group>
        </div>
        <div class="messageInLab" v-for="(title,index) in wholeInputs" :key='index'>
          <span>{{index + 1 + wholeRadios.length + wholeCheckBoxs.length}}.{{title}}</span>
          <el-input :placeholder="$t('labelTool.please')" v-model="wholeInputContents[index]"></el-input>
        </div>
      </div>
      <!-- 添加工作区的颜色展示 -->
      <div id="mon" class="fh-list" v-if="itemRadios.length > 0 && itemRadios[0]">
        <div class="goodsForm" v-for="(value, index) in itemRadios[0].labels" :key='index' @click="select(index)">
            <el-color-picker v-model="value.content"></el-color-picker>
            <el-button type="text">{{value.name}}</el-button>
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
import {language} from 'lang'

// 解除浏览器右键事件
document.oncontextmenu = function (e) {
  e.cancelBubble = true
  return false
}

var clickflag = false
var filstyZone = 'rgba(255,255,255,0.5)'

var bezierlines = []
var bezierline = []
var completeflag = true
// var childnode = 0 // 选中位置常量，用来判断选中位置
var Left = 0
var Top = 0
// var maxcanvasheight
// var maxcanvaswidth
var points = []
var polygon = []
var rect
// var submitdata = []
var pointsets = []
var polygons = []
var rects = []

// 点
function Pointer (x, y) {
  this.x = x
  this.y = y
  this.isSelected = false
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
function SubmitData (type, flag, pointset, markres) {
  this.type = type
  this.flag = flag
  this.pointset = pointset
  this.markres = markres
}

// 点集的保存
function Pointseter (pointset, mark) {
  this.pointset = pointset
  this.mark = mark
}
// 点集的标注
// function Markpointset (value, text) {
//   this.value = value
//   this.text = text
// }

// 多边形的保存，flag表示是否闭合
function Polygoner (pointset, flag, mark) {
  this.pointset = pointset
  this.flag = flag
  this.mark = mark
}

// 曲线的保存，flag表示是否闭合
function Bezierliner (pointset, flag, mark) {
  this.pointset = pointset
  this.flag = flag
  this.mark = mark
}

// 矩形的保存
function Rect (rect, mark) {
  this.rect = rect
  this.mark = mark
}

// 将options数组分为四个栈，依次存储矩形，多边形，点阵，曲线，便于前端的选中以及查找
var rectlen = 0
var polygonlen = 0
var pointslen = 0
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
var movePoint = true
var movePicture = false

var x1
var y1
var mode = 3
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
    rectMinH: {
      type: Number,
      default: 5
    }, // 矩形最小高
    rectMinW: {
      type: Number,
      default: 5
    }, // 矩形最小宽
    rectMinArea: {
      type: Number,
      default: 5
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
    // 1001 整图，1002 规则图形， 1003 不规则图形
    SopType: {
      type: Number,
      default: 1001
    }
  },

  computed: {

  },
  data () {
    return {
      // 图片参数
      wholeRadioContents: [],
      wholeCheckBoxContents: [],
      wholeInputContents: [],
      //   itemRadioContents: [],
      //   itemCheckBoxContents: [],
      //   itemInputContents: [],
      filstySP: '#00ff00',
      filstyNor: '#ff0000',
      filstySPs: '#0000ff',
      pointradius: 50,
      projectid: '',
      storageKey: '',
      quill: {},
      rectRadio: '',
      option: '',
      desc: '',
      Tabledata: [],
      tabvisable: false,
      dialogVisible: false,
      picwidth: 800,
      picheight: 800,
      markflag: false,
      buttonflag: false,
      pointset: [],
      form: {
        type: '',
        color: ''
      }
    }
  },
  watch: {
    // 如果 `wholeCheckBoxs` 发生改变，这个函数就会运行，将wholeCheckBoxContents变成二维数组
    wholeCheckBoxs: function () {
      for (let key in this.wholeCheckBoxs) {
        if (!Array.isArray(this.wholeCheckBoxContents[key])) {
          this.$set(this.wholeCheckBoxContents, key, [])
        }
      }
    },
    pointradius: function () {
      let vm = this
      vm.cleantopcanvas()
      if (mode === 1) {
        vm.drawPoints()
      } else if (mode === 2) {
        vm.drawPolygons()
      } else if (mode === 3) {
        vm.drawRects()
      } else if (mode === 4) {
        vm.drawBezierlines()
      }
    }
  },
  mounted: function () {
    let vm = this
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
    vm.select(0)
    bindKeyEvent()
  },
  methods: {
    test () {
      let vm = this
      vm.getResult()
    },
    /****************************************************************************/
    /*                     前后端交互接口,get,post,getresult                     */
    /****************************************************************************/
    // 数据验证
    valid () {
      let vm = this
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
          console.log(vm.wholeInputContents[i].trim())
          if (vm.wholeInputContents[i].trim() === '') {
            console.log(language('labelTool.input'), i, language('labelTool.noNull'))
            return false
          }
        }
      }
      return true
    },
    // 提交任务，包含点集，描述，url等一系列数据
    postTask (form) {
      let vm = this
      // console.log(this.$refs['options'])
      // this.$refs['options'].validate((valid) => {
      //   if (valid) {
      //     alert('submit!')
      //   } else {
      //     console.log('error submit!!')
      //     return false
      //   }
      // })
      if (!vm.valid()) {
        vm.$notify.error({
          title: language('taskPublic.error'),
          message: language('labelTool.errorMessage'),
          duration: 2000
        })
        return
      }
      let result = vm.getResult()
      let params = {
        result: result,
        commit: vm.quill.getText()
      }
      this.$emit('postTask', params)
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
      rectlen = 0
      polygonlen = 0
      pointslen = 0
      pointsets = []
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
        if (data) {
          for (var i = 0; i < data.length; i++) {
          // 矩形解析
            if (data[i].type === 'rect') {
              let recvrect = new Recter(data[i].pointset[0].x / rate, data[i].pointset[0].y / rate, data[i].pointset[1].x / rate - data[i].pointset[0].x / rate, data[i].pointset[1].y / rate - data[i].pointset[0].y / rate)
              let newrecvrect = new Rect(recvrect, data[i].markres)
              rects.push(newrecvrect)
              rectlen = rectlen + 1
            } else if (data[i].type === 'polygon') {
              let newrecvpolygon = []
              for (var j = 0; j < data[i].pointset.length; j++) {
                let recvpolygonpoint = new Pointer(data[i].pointset[j].x / rate, data[i].pointset[j].y / rate)
                newrecvpolygon.push(recvpolygonpoint)
              }
              var newpolygon
              newpolygon = new Polygoner(newrecvpolygon, data[i].flag, data[i].markres)
              polygons.push(newpolygon)
              polygonlen = polygonlen + 1
            } else if (data[i].type === 'pointset') {
              let recvpoints = []
              for (j = 0; j < data[i].pointset.length; j++) {
                let recvpointspoint = new Pointer(data[i].pointset[j].x / rate, data[i].pointset[j].y / rate)
                recvpoints.push(recvpointspoint)
              }
              let newpoints = new Pointseter(recvpoints, data[i].markres)
              pointsets.push(newpoints)
              pointslen = pointslen + 1
            } else if (data[i].type === 'bezierline') {
              let recvbezier = []
              for (j = 0; j < data[i].pointset.length; j++) {
                let recvbezierpoint = new Pointer(data[i].pointset[j].x / rate, data[i].pointset[j].y / rate)
                recvbezier.push(recvbezierpoint)
              }
              var newbezier
              newbezier = new Bezierliner(recvbezier, data[i].flag, data[i].markres)
              bezierlines.push(newbezier)
            }
          }
        }
      }
      vm.drawPoints()
      vm.drawPolygons()
      vm.drawRects()
      vm.drawBezierlines()
    },
    getComment: function () {
      return this.quill.getText()
    },
    // 获取提交数据
    getResult: function () {
      let vm = this
      var submitdata = []
      var submit = {
        data: [],
        wholeRadioContents: [],
        wholeCheckBoxContents: [],
        wholeInputContents: []
      }
      // 矩形的序列化
      for (var i = 0; i < rects.length; i++) {
        let rectpoint = []
        let rectpoint1 = new Pointer(rects[i].rect.x * rate, rects[i].rect.y * rate)
        let rectpoint2 = new Pointer(rects[i].rect.x * rate + rects[i].rect.width * rate, rects[i].rect.y * rate + rects[i].rect.height * rate)
        rectpoint.push(rectpoint1)
        rectpoint.push(rectpoint2)
        // let data = new SubmitData('rect', rectpoint, rects[i].string)
        let data = new SubmitData('rect', true, rectpoint, rects[i].mark)
        // console.log(this.itemCheckBoxContents[i])
        submitdata.push(data)
      }
      // 多边形的序列化
      for (i = 0; i < polygons.length; i++) {
        let newset2 = []
        for (var j = 0; j < polygons[i].pointset.length; j++) {
          let newpoint2 = new Pointer(polygons[i].pointset[j].x * rate, polygons[i].pointset[j].y * rate)
          newset2.push(newpoint2)
        }
        let data = new SubmitData('polygon', polygons[i].flag, newset2, polygons[i].mark)
        submitdata.push(data)
      }
      // 点集的序列化
      for (i = 0; i < pointsets.length; i++) {
        let newset1 = []
        for (j = 0; j < pointsets[i].pointset.length; j++) {
          let newpoint1 = new Pointer(pointsets[i].pointset[j].x * rate, pointsets[i].pointset[j].y * rate)
          newset1.push(newpoint1)
        }
        let data = new SubmitData('pointset', false, newset1, pointsets[i].mark)
        submitdata.push(data)
      }
      // 曲线集的序列化
      for (i = 0; i < bezierlines.length; i++) {
        let newset3 = []
        for (j = 0; j < bezierlines[i].pointset.length; j++) {
          let newpoint3 = new Pointer(bezierlines[i].pointset[j].x * rate, bezierlines[i].pointset[j].y * rate)
          newset3.push(newpoint3)
        }
        let data = new SubmitData('bezierline', bezierlines[i].flag, newset3, bezierlines[i].mark)
        submitdata.push(data)
      }
      submit.data = submitdata
      submit.wholeRadioContents = vm.wholeRadioContents
      submit.wholeInputContents = vm.wholeInputContents
      submit.wholeCheckBoxContents = vm.wholeCheckBoxContents
      // console.log(JSON.stringify(submit))
      return submit
    },
    /****************************************************************************/
    /*                       前端DIV样式，动作相关设计                            */
    /****************************************************************************/

    // 选中工作区文本时，选中对应图形
    select: function (index) {
      let vm = this
      console.log()
      vm.filstyNor = vm.itemRadios[0].labels[index].content
      if ($('.goodsForm').length > 0) {
        for (var i = 0; i < $('.goodsForm').length; i++) {
          $('.goodsForm')[i].style = 'background:#ffffff'
        }
        $('.goodsForm')[index].style = 'background:#ecf5ff'
      }
    },
    // 预览模式，可以观察整个视图 // 在预览模式下禁止修改？？？
    preview: function () {
      let vm = this
      mode = 0
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
        preflag = true
      }
    },

    /****************************************************************************/
    /*                             标注图形的绘制                                */
    /****************************************************************************/

    // 绘制点集
    drawPoints: function () {
      let vm = this
      topctx.fillStyle = filstyZone
      topctx.lineWidth = 1 / scalei
      if (points.length > 0) {
        for (var i = 0; i < points.length; i++) {
          topctx.beginPath()
          topctx.arc(points[i].x, points[i].y, vm.pointradius / 10 / scalei, 0, 2 * Math.PI)
          if (points[i].isSelected) {
            topctx.fillStyle = vm.filstySPs
            topctx.strokeStyle = vm.filstySPs
          } else {
            topctx.strokeStyle = vm.filstyNor
            topctx.fillStyle = vm.filstyNor
          }
          topctx.font = 20 / scalei + 'px Arial'
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
          // 依据是否被选中确定点集的基色
          if (SelectedPointsetNum === i) {
            tempfill = vm.filstySP
            tempstroke = vm.filstySP
            selectfill = vm.filstySPs
            selectstroke = vm.filstySPs
          } else {
            tempfill = vm.markTocolor(pointsets[i].mark)
            tempstroke = vm.markTocolor(pointsets[i].mark)
            selectfill = vm.filstySPs
            selectstroke = vm.filstySPs
          }
          // 画每一个点
          for (var j = 0; j < pointsets[i].pointset.length; j++) {
            if (pointsets[i].pointset[j].isSelected) {
              topctx.beginPath()
              topctx.fillStyle = selectfill
              topctx.strokeStyle = selectstroke
              topctx.arc(pointsets[i].pointset[j].x, pointsets[i].pointset[j].y, vm.pointradius / 10 / scalei, 0, 2 * Math.PI)
              topctx.fill()
              topctx.stroke()
              topctx.closePath()
            } else {
              topctx.beginPath()
              topctx.fillStyle = tempfill
              topctx.strokeStyle = tempstroke
              topctx.arc(pointsets[i].pointset[j].x, pointsets[i].pointset[j].y, vm.pointradius / 10 / scalei, 0, 2 * Math.PI)
              topctx.fill()
              topctx.stroke()
              topctx.closePath()
            }
          }
          topctx.font = 40 / scalei + 'px Arial'
          topctx.fillText(i + rectlen + polygonlen, pointsets[i].pointset[0].x, pointsets[i].pointset[0].y)
        }
      }
    },

    // 绘制多边形
    drawPolygons: function () {
      let vm = this
      topctx.fillStyle = filstyZone
      topctx.lineWidth = 1 / scalei
      if (polygon.length > 0) {
        for (var i = 0; i < polygon.length; i++) {
          topctx.beginPath()
          topctx.arc(polygon[i].x, polygon[i].y, vm.pointradius / 10 / scalei, 0, 2 * Math.PI)
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
            tempfill = vm.markTocolor(polygons[i].mark)
            tempstroke = vm.markTocolor(polygons[i].mark)
            selectfill = vm.filstySPs
            selectstroke = vm.filstySPs
          }
          // 画每一个点
          for (var j = 0; j < polygons[i].pointset.length; j++) {
            if (polygons[i].pointset[j].isSelected) {
              topctx.beginPath()
              topctx.fillStyle = selectfill
              topctx.strokeStyle = selectstroke
              topctx.arc(polygons[i].pointset[j].x, polygons[i].pointset[j].y, vm.pointradius / 10 / scalei, 0, 2 * Math.PI)
              topctx.fill()
              topctx.stroke()
              topctx.closePath()
            } else {
              topctx.beginPath()
              topctx.fillStyle = tempfill
              topctx.strokeStyle = tempstroke
              topctx.arc(polygons[i].pointset[j].x, polygons[i].pointset[j].y, vm.pointradius / 10 / scalei, 0, 2 * Math.PI)
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
            topctx.font = 40 / scalei + 'px Arial'
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
            topctx.strokeStyle = vm.markTocolor(polygons[i].mark)
            topctx.fillStyle = filstyZone
            // topctx.font = 40 / scalei + 'px Arial'
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
          topctx.fillStyle = vm.markTocolor(polygons[i].mark)
          topctx.font = 40 / scalei + 'px Arial'
          topctx.fillText(i + rectlen, polygons[i].pointset[0].x, polygons[i].pointset[0].y)
        }
      }
    },
    // 绘制十字线
    drawCrossline: function (event) {
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
      topctx.lineWidth = 2 / scalei
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
      topctx.lineWidth = 1 / scalei
      if (rect != null) {
        topctx.beginPath()
        topctx.rect(rect.x, rect.y, rect.width, rect.height)
        topctx.strokeStyle = vm.filstyNor
        topctx.stroke()
        topctx.fill()
        topctx.closePath()
      }
      if (rects.length > 0) {
        for (var i = 0; i < rects.length; i++) {
          topctx.strokeStyle = vm.itemRadios[0].labels[rects[i].mark].content
          if (rects[i].rect.isSelected) {
            topctx.setLineDash([2, 2])
            topctx.beginPath()
            topctx.arc(rects[i].rect.x, rects[i].rect.y, vm.pointradius / 10 / scalei, 0, 2 * Math.PI)
            topctx.stroke()
            topctx.closePath()
            topctx.beginPath()
            topctx.arc(rects[i].rect.x + rects[i].rect.width, rects[i].rect.y, vm.pointradius / 10 / scalei, 0, 2 * Math.PI)
            topctx.stroke()
            topctx.closePath()
            topctx.beginPath()
            topctx.arc(rects[i].rect.x, rects[i].rect.y + rects[i].rect.height, vm.pointradius / 10 / scalei, 0, 2 * Math.PI)
            topctx.stroke()
            topctx.closePath()
            topctx.beginPath()
            topctx.arc(rects[i].rect.x + rects[i].rect.width, rects[i].rect.y + rects[i].rect.height, vm.pointradius / 10 / scalei, 0, 2 * Math.PI)
            topctx.stroke()
            topctx.stroke()
            topctx.closePath()

            topctx.beginPath()
            topctx.rect(rects[i].rect.x, rects[i].rect.y, rects[i].rect.width, rects[i].rect.height)
            topctx.strokeStyle = vm.filstySP
            topctx.stroke()
            topctx.fill()
            topctx.fillStyle = vm.filstySPs
            topctx.font = 40 / scalei + 'px Arial'
            topctx.fillText(i, rects[i].rect.x, rects[i].rect.y)
            topctx.fillStyle = filstyZone
            topctx.closePath()
          } else {
            topctx.beginPath()
            topctx.strokeStyle = vm.markTocolor(rects[i].mark)
            topctx.setLineDash([2, 0])
            topctx.rect(rects[i].rect.x, rects[i].rect.y, rects[i].rect.width, rects[i].rect.height)
            // topctx.strokeStyle = vm.filstyNor
            topctx.stroke()
            topctx.fill()
            topctx.fillStyle = vm.markTocolor(rects[i].mark)
            topctx.font = 40 / scalei + 'px Arial'
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
      topctx.lineWidth = 1 / scalei
      // 绘制当前未入栈曲线
      if (bezierline.length === 1) {
        topctx.beginPath()
        topctx.arc(bezierline[0].x, bezierline[0].y, vm.pointradius / 10 / scalei, 0, 2 * Math.PI)
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
              topctx.arc(bezierline[i].x, bezierline[i].y, vm.pointradius / 10 / scalei, 0, 2 * Math.PI)
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
                topctx.arc(bezierline[i - 1].x, bezierline[i - 1].y, vm.pointradius / 10 / scalei, 0, 2 * Math.PI)
                topctx.arc(bezierline[i - 2].x, bezierline[i - 2].y, vm.pointradius / 10 / scalei, 0, 2 * Math.PI)
                topctx.fill()
              // topctx.stroke()
              }
            } else if (i % 3 === 1) {
              // 选中控制点1
              topctx.beginPath()
              topctx.fillStyle = vm.filstySP
              topctx.strokeStyle = vm.filstySP
              topctx.arc(bezierline[i].x, bezierline[i].y, vm.pointradius / 10 / scalei, 0, 2 * Math.PI)
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
              topctx.arc(bezierline[i + 1].x, bezierline[i + 1].y, vm.pointradius / 10 / scalei, 0, 2 * Math.PI)
              // topctx.arc(bezierline[i - 2].x, bezierline[i - 2].y, vm.pointradius / 10 / scalei, 0, 2 * Math.PI)
              topctx.fill()
              // topctx.stroke()
            } else if (i % 3 === 2) {
              // 选中控制点2
              topctx.beginPath()
              topctx.fillStyle = vm.filstySP
              topctx.strokeStyle = vm.filstySP
              topctx.arc(bezierline[i].x, bezierline[i].y, vm.pointradius / 10 / scalei, 0, 2 * Math.PI)
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
              topctx.arc(bezierline[i - 1].x, bezierline[i - 1].y, vm.pointradius / 10 / scalei, 0, 2 * Math.PI)
              // topctx.arc(bezierline[i - 2].x, bezierline[i - 2].y, vm.pointradius / 10 / scalei, 0, 2 * Math.PI)
              topctx.fill()
              // topctx.stroke()
            }
            // 添加控制点相关绘制
          } else {
            if (i % 3 === 0) {
              topctx.beginPath()
              topctx.strokeStyle = vm.filstyNor
              topctx.fillStyle = vm.filstyNor
              topctx.arc(bezierline[i].x, bezierline[i].y, vm.pointradius / 10 / scalei, 0, 2 * Math.PI)
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
        topctx.fillStyle = 'rgba(255,255,255,0.5)'
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
            tempfill = vm.markTocolor(bezierlines[i].mark)
            tempstroke = vm.markTocolor(bezierlines[i].mark)
            selectfill = vm.filstySPs
            selectstroke = vm.filstySPs
          }
          // 先画第一个点
          // topctx.beginPath()
          // topctx.arc(bezierlines[i].pointset[0].x, bezierlines[i].pointset[0].y, vm.pointradius / 10 / scalei, 0, 2 * Math.PI)
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
                topctx.arc(bezierlines[i].pointset[j].x, bezierlines[i].pointset[j].y, vm.pointradius / 10 / scalei, 0, 2 * Math.PI)
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
                topctx.arc(bezierlines[i].pointset[j + 1].x, bezierlines[i].pointset[j + 1].y, vm.pointradius / 10 / scalei, 0, 2 * Math.PI)
                topctx.fill()
                topctx.stroke()
                topctx.beginPath()
                topctx.arc(bezierlines[i].pointset[j + 2].x, bezierlines[i].pointset[j + 2].y, vm.pointradius / 10 / scalei, 0, 2 * Math.PI)
                topctx.fill()
                topctx.stroke()
              } else if (j % 3 === 1) {
                topctx.beginPath()
                topctx.fillStyle = vm.filstySP
                topctx.strokeStyle = vm.filstySP
                topctx.arc(bezierlines[i].pointset[j].x, bezierlines[i].pointset[j].y, vm.pointradius / 10 / scalei, 0, 2 * Math.PI)
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
                topctx.arc(bezierlines[i].pointset[j + 1].x, bezierlines[i].pointset[j + 1].y, vm.pointradius / 10 / scalei, 0, 2 * Math.PI)
                topctx.fill()
                topctx.stroke()
                // topctx.beginPath()
                // topctx.arc(bezierlines[i].pointset[j + 2].x, bezierlines[i].pointset[j + 2].y, vm.pointradius / 10 / scalei, 0, 2 * Math.PI)
                // topctx.fill()
                // topctx.stroke()
              } else if (j % 3 === 2) {
                topctx.beginPath()
                topctx.fillStyle = vm.filstySP
                topctx.strokeStyle = vm.filstySP
                topctx.arc(bezierlines[i].pointset[j].x, bezierlines[i].pointset[j].y, vm.pointradius / 10 / scalei, 0, 2 * Math.PI)
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
                topctx.arc(bezierlines[i].pointset[j - 1].x, bezierlines[i].pointset[j - 1].y, vm.pointradius / 10 / scalei, 0, 2 * Math.PI)
                topctx.fill()
                topctx.stroke()
              }

              // topctx.closePath()
            } else {
              if (j % 3 === 0) {
                topctx.beginPath()
                topctx.fillStyle = tempfill
                topctx.strokeStyle = tempstroke
                topctx.arc(bezierlines[i].pointset[j].x, bezierlines[i].pointset[j].y, vm.pointradius / 10 / scalei, 0, 2 * Math.PI)

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
            topctx.strokeStyle = vm.markTocolor(bezierlines[i].mark)
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
          topctx.fillStyle = vm.markTocolor(bezierlines[i].mark)
          topctx.font = 40 / scalei + 'px Arial'
          topctx.fillText(i + rectlen + polygonlen + pointslen, bezierlines[i].pointset[0].x, bezierlines[i].pointset[0].y)
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
        let l = lefti
        let t = topi
        lefti = clickX + clickY - t
        topi = clickY - clickX + l
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
            if (Math.pow(moveclickX - points[i].x, 2) + Math.pow(moveclickY - points[i].y, 2) < Math.pow(vm.pointradius / 10 / scalei, 2)) {
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
              if (Math.pow(moveclickX - temppoint.x, 2) + Math.pow(moveclickY - temppoint.y, 2) < Math.pow(vm.pointradius / 10 / scalei, 2)) {
                if (SelectedPoint != null) {
                  SelectedPoint.isSelected = false
                  SelectedPoint = null
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
        if (breakflag) {
          movePoint = true
        } else {
        // 画点
          if (SelectedPoint != null) {
            SelectedPoint.isSelected = false
            SelectedPoint = null
          }
          SelectedPointsetNum = -1
          let newpoint = new Pointer(moveclickX, moveclickY)
          points.push(newpoint)
          vm.cleantopcanvas()
          vm.drawPoints()
        }
      } else if (mode === 2) {
        let vm = this
        let breakflag = false
        // 判断点是否在未入栈的点集内
        if (polygon.length > 0) {
          for (i = 0; i < polygon.length; i++) {
            if (Math.pow(moveclickX - polygon[i].x, 2) + Math.pow(moveclickY - polygon[i].y, 2) < Math.pow(vm.pointradius / 10 / scalei, 2)) {
              if (SelectedPoint != null) {
                SelectedPoint.isSelected = false
                SelectedPoint = null
              }
              polygon[i].isSelected = true
              SelectedPoint = polygon[i]
              breakflag = true
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
              if (Math.pow(moveclickX - temppoint.x, 2) + Math.pow(moveclickY - temppoint.y, 2) < Math.pow(vm.pointradius / 10 / scalei, 2)) {
                if (SelectedPoint != null) {
                  SelectedPoint.isSelected = false
                  SelectedPoint = null
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
        if (breakflag) {
          movePoint = true
        } else {
        // 画点
          if (SelectedPoint != null) {
            SelectedPoint.isSelected = false
            SelectedPoint = null
          }
          // 取消原点集的选中状态
          SelectedPointsetNum = -1
          clickflag = true
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
              }
              rects[i].rect.isSelected = true
              SelectedRect = rects[i].rect
              SelectedRectNum = i
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
          }
        }
        vm.cleantopcanvas()
        vm.drawRects()
      } else if (mode === 4) { // 贝塞尔曲线
        let vm = this
        let breakflag = false
        // 判断点是否在未入栈的点集内
        if (bezierline.length > 0) {
          for (i = 0; i < bezierline.length; i++) {
            if (Math.pow(moveclickX - bezierline[i].x, 2) + Math.pow(moveclickY - bezierline[i].y, 2) < Math.pow(vm.pointradius / 10 / scalei, 2)) {
              if (SelectedPoint != null) {
                SelectedPoint.isSelected = false
                SelectedPoint = null
              }
              bezierline[i].isSelected = true
              SelectedPoint = bezierline[i]
              SelectedPointNum = i // ??????????????
              breakflag = true
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
              if (Math.pow(moveclickX - temppoint.x, 2) + Math.pow(moveclickY - temppoint.y, 2) < Math.pow(vm.pointradius / 10 / scalei, 2)) {
                if (SelectedPoint != null) {
                  SelectedPoint.isSelected = false
                  SelectedPoint = null
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
        if (breakflag) {
          movePoint = true
        } else {
        // 画点
          if (SelectedPoint != null) {
            SelectedPoint.isSelected = false
            SelectedPoint = null
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
        vm.drawPoints()
        vm.drawPolygons()
        vm.drawRects()
        vm.drawBezierlines()
      } else if (mode === 1 && movePoint) {
        if (SelectedPoint != null) {
          SelectedPoint.x = movepointx
          SelectedPoint.y = movepointy
        }
        vm.cleantopcanvas()
        vm.drawPoints()
      } else if (mode === 2) {
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
          var seps
          if (SelectedPointsetNum === -1) {
            seps = bezierline
          } else {
            seps = bezierlines[SelectedPointsetNum].pointset
          }
          // 斜率控制
          if (SelectedPointNum % 3 === 0) {
            // 123
          } else if (SelectedPointNum % 3 === 1) {
            if (SelectedPointNum === 1) {
              // 判断一次是否为未入栈曲线，防止把末尾绘制点当作控制点
              if (seps.length % 3 !== 0) {
                // 空操作
              } else {
                let ky = seps[0].y - movepointy
                let kx = seps[0].x - movepointx
                let linelen = Math.sqrt((seps[seps.length - 1].x - seps[0].x) * (seps[seps.length - 1].x - seps[0].x) + (seps[seps.length - 1].y - seps[0].y) * (seps[seps.length - 1].y - seps[0].y))
                if (kx !== 0 && ky !== 0) {
                  let k = ky / kx
                  seps[seps.length - 1].x = kx / Math.abs(kx) * linelen / Math.sqrt(1 + k * k) + seps[0].x
                  seps[seps.length - 1].y = ky / Math.abs(ky) * Math.abs(k) * linelen / Math.sqrt(1 + k * k) + seps[0].y
                } else if (kx === 0 && ky === 0) {
                // 没有移动，空操作
                } else if (kx === 0) {
                  seps[seps.length - 1].x = seps[0].x
                  seps[seps.length - 1].y = seps[0].y + ky / Math.abs(ky) * linelen
                } else if (ky === 0) {
                  seps[seps.length - 1].x = seps[0].x + kx / Math.abs(kx) * linelen
                  seps[seps.length - 1].y = seps[0].y
                }
              }
            } else {
              let ky = seps[SelectedPointNum - 1].y - movepointy
              let kx = seps[SelectedPointNum - 1].x - movepointx
              let linelen = Math.sqrt((seps[SelectedPointNum - 1].x - seps[SelectedPointNum - 2].x) * (seps[SelectedPointNum - 1].x - seps[SelectedPointNum - 2].x) + (seps[SelectedPointNum - 1].y - seps[SelectedPointNum - 2].y) * (seps[SelectedPointNum - 1].y - seps[SelectedPointNum - 2].y))
              if (kx !== 0 && ky !== 0) {
                let k = ky / kx
                seps[SelectedPointNum - 2].x = kx / Math.abs(kx) * linelen / Math.sqrt(1 + k * k) + seps[SelectedPointNum - 1].x
                seps[SelectedPointNum - 2].y = ky / Math.abs(ky) * Math.abs(k) * linelen / Math.sqrt(1 + k * k) + seps[SelectedPointNum - 1].y
              } else if (kx === 0 && ky === 0) {
                // 空操作
              } else if (kx === 0) {
                seps[SelectedPointNum - 2].x = seps[SelectedPointNum - 1].x
                seps[SelectedPointNum - 2].y = seps[SelectedPointNum - 1].y + ky / Math.abs(ky) * linelen
              } else if (ky === 0) {
                seps[SelectedPointNum - 2].x = seps[SelectedPointNum - 1].x + kx / Math.abs(kx) * linelen
                seps[SelectedPointNum - 2].y = seps[SelectedPointNum - 1].y
              }
            }
          } else {
            if (SelectedPointNum === seps.length - 1) {
              let ky = seps[0].y - movepointy
              let kx = seps[0].x - movepointx
              let linelen = Math.sqrt((seps[1].x - seps[0].x) * (seps[1].x - seps[0].x) + (seps[1].y - seps[0].y) * (seps[1].y - seps[0].y))
              if (kx !== 0 && ky !== 0) {
                let k = ky / kx
                seps[1].x = kx / Math.abs(kx) * linelen / Math.sqrt(1 + k * k) + seps[0].x
                seps[1].y = ky / Math.abs(ky) * Math.abs(k) * linelen / Math.sqrt(1 + k * k) + seps[0].y
              } else if (kx !== 0 && ky !== 0) {
                // 空操作
              } else if (kx === 0) {
                seps[1].x = seps[seps.length - 1].x
                seps[1].y = seps[seps.length - 1].y + ky / Math.abs(ky) * linelen
              } else if (ky === 0) {
                seps[1].x = seps[seps.length - 1].x = seps[seps.length - 1].x + kx / Math.abs(kx) * linelen
                seps[1].y = seps[seps.length - 1].y
              }
            } else {
              let ky = seps[SelectedPointNum + 1].y - movepointy
              let kx = seps[SelectedPointNum + 1].x - movepointx
              // 需要在这里判断一次未入栈曲线，因为未入栈曲线缺少末尾的两个控制点会导致边界溢出
              if (SelectedPointNum + 2 > seps.length - 1) {
                // 空操作
              } else {
                let linelen = Math.sqrt((seps[SelectedPointNum + 1].x - seps[SelectedPointNum + 2].x) * (seps[SelectedPointNum + 1].x - seps[SelectedPointNum + 2].x) + (seps[SelectedPointNum + 1].y - seps[SelectedPointNum + 2].y) * (seps[SelectedPointNum + 1].y - seps[SelectedPointNum + 2].y))
                if (kx !== 0 && ky !== 0) {
                  let k = ky / kx
                  seps[SelectedPointNum + 2].x = kx / Math.abs(kx) * linelen / Math.sqrt(1 + k * k) + seps[SelectedPointNum + 1].x
                  seps[SelectedPointNum + 2].y = ky / Math.abs(ky) * Math.abs(k) * linelen / Math.sqrt(1 + k * k) + seps[SelectedPointNum + 1].y
                } else if (kx !== 0 && ky !== 0) {
                // 空操作
                } else if (kx === 0) {
                  seps[SelectedPointNum + 2].x = seps[SelectedPointNum].x
                  seps[SelectedPointNum + 2].y = seps[SelectedPointNum].y + ky / Math.abs(ky) * linelen
                } else if (ky === 0) {
                  seps[SelectedPointNum + 2].x = seps[SelectedPointNum].x + kx / Math.abs(kx) * linelen
                  seps[SelectedPointNum + 2].y = seps[SelectedPointNum].y
                }
              }
            }
          }
        }
        vm.cleantopcanvas()
        vm.drawBezierlines()
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
            let newrect = new Rect(rect, vm.colorTomark(vm.filstyNor))
            rects.push(newrect)
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
      if (!botctx) {
        return
      }
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

    // 多边形闭合，点阵闭合，曲线闭合
    complete: function () {
      let vm = this
      if (mode === 2) { // 多边形
        if (SelectedPoint != null) {
          SelectedPoint.isSelected = false
          SelectedPoint = null
        }
        if (polygon.length > 1) {
          let newpolygon = new Polygoner(polygon, completeflag, vm.colorTomark(vm.filstyNor))
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
        if (points.length > 2) {
          let newpointset = new Pointseter(points, vm.colorTomark(vm.filstyNor))
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
          let newbezierline = new Bezierliner(bezierline, completeflag, vm.colorTomark(vm.filstyNor))
          bezierlines.push(newbezierline)
          bezierline = []
          vm.cleantopcanvas()
          vm.drawBezierlines()
        }
      }
    },
    // 颜色转换标注字符串
    colorTomark: function (color) {
      let vm = this
      for (var i = 0; i < vm.itemRadios[0].labels.length; i++) {
        if (vm.itemRadios[0].labels[i].content === color) {
          return i
        }
      }
      console.log('color not found')
      return 0
    },
    // 标注字符串转颜色
    markTocolor: function (mark) {
      let vm = this
      return vm.itemRadios[0].labels[mark].content
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
          polygonlen = polygonlen - 1
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
          pointslen = pointslen - 1
          SelectedPointsetNum = -1 // 清除以删除点集的选中状态
        }
        vm.cleantopcanvas()
        vm.drawPoints()
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
      }
      vm.cleantopcanvas()
      vm.drawRects()
    },

    // 清空当前所有标注
    clear: function () {
      let vm = this
      this.Tabledata = []
      points = []
      pointsets = []
      rects = []
      rect = null
      polygon = []
      polygons = []
      bezierlines = []
      bezierline = []
      rectlen = 0
      pointslen = 0
      polygonlen = 0
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
        console.log(moveclickX, moveclickY)
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
        vm.drawRects()
      }

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
      vm.drawRects()
      botctx.drawImage(img, 0, 0, width0, height0)
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
    },

    // 移动图片
    mode0: function () {
      mode = 0
      if (SelectedRect != null) {
        SelectedRect.isSelected = false
        SelectedRect = null
      }
    },
    // 描点显示模式
    mode1: function () {
      let vm = this
      mode = 1
      vm.cleantopcanvas()
      vm.drawPoints()
    },
    // 多边形显示模式
    mode2: function () {
      let vm = this
      mode = 2
      completeflag = true
      vm.cleantopcanvas()
      vm.drawPolygons()
    },
    // 矩形显示模式
    mode3: function () {
      let vm = this
      mode = 3
      vm.cleantopcanvas()
      vm.drawRects()
    },
    // 贝塞尔区域显示模式
    mode4: function () {
      let vm = this
      mode = 4
      completeflag = true
      vm.cleantopcanvas()
      vm.drawBezierlines()
    },
    // 折线
    polyline: function () {
      let vm = this
      mode = 2
      completeflag = false
      vm.cleantopcanvas()
      vm.drawPolygons()
    },
    // 贝塞尔曲线
    bezierline: function () {
      let vm = this
      mode = 4
      completeflag = false
      vm.cleantopcanvas()
      vm.drawBezierlines()
    },
    // 鼠标缩放事件
    mousescale: function (e) {
      let vm = this
      let delta = 1 + e.wheelDelta / 1200
      botctx.scale(delta, delta)
      topctx.scale(delta, delta)
      scalei = scalei * delta
      vm.cleantopcanvas()
      vm.cleanbotcanvas()
      botctx.drawImage(img, 0, 0, width0, height0)
      if (mode === 0) {
        vm.drawRects()
        vm.drawPoints()
        vm.drawPolygons()
        vm.drawBezierlines()
      } else if (mode === 3) {
        vm.drawRects()
      } else if (mode === 1) {
        vm.drawPoints()
      } else if (mode === 2) {
        vm.drawPolygons()
      } else if (mode === 4) {
        vm.drawBezierlines()
      }
    }
  }
}

/****************************************************************************/
/*                               快捷键设定                                  */
/****************************************************************************/
var tempmode = 1
// onkeydown按住键盘触发的是连续事件添加tempcode使其只执行一次
var tempcode = true
function bindKeyEvent () {
  document.onkeydown = function (event) {
    if (event.keyCode === 18 && tempcode) {
      tempmode = mode
      mode = 0
      tempcode = false
    }
  }
  document.onkeyup = function (event) {
    tempcode = true
    if (event.keyCode === 18) {
      mode = tempmode
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
.messageInLab {
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}
.messageInLab > span {
  padding-right: 0.3rem;
  color: #777;
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
  position: absolute;
  /* left:50%;top:50%; */
	/* transform: translate(-50%, -50%); */
	background: #C0C4CC;
	/* border: 4px solid #409EFF; */
	z-index: 1;
}

#top {
  position: absolute;
  /* left:50%;top:50%; */
	/* transform: translate(-50%, -50%); */
	border: 1px solid #DCDFE6;
	z-index: 2;
}

.fh-list {
  margin-top:15px;
}
.fh-list-title {
  font-size: 14px;
  margin-bottom: 10px;
  color: #909399;
}
.fh-list-id {
  padding-top: 6px;
  padding-left: 2px;
  color: #909399;
}
.item-del{
  display: flex;
  justify-content: space-between;
}
</style>
