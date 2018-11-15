<template>
  <div class="text-template">
    <div class="container">
    <!-- <div> -->
      <p class="font-italic">数据和要求:</p>
      <div id="textContent" style="border: 1px solid #b3d8ff; padding-top: 3px">
        天气 网讯 ， 继 冷空气 势力 减弱 后 ， (今天)/today ( (17 日)/date ) 的 (北京城)/city (多云)/condition 天气 ， 气温 最高 回暖 至 (25 ℃)/temp_high ， 没有 了 前 阵子 的 寒意。<br/>
          不过 ， 受静稳 天气 的 影响 ， 市区 空气 (轻度 污染)/aqi_level ， 能见度 一般 ， 市民 出行 需注意 防霾。<br/>
      </div>
      <div class="d-flex justify-content-end" style="margin-top: 1rem;">
        <el-button v-if="PostButtonVisible === true" type="success" @click="postTask" >提交</el-button>
        <el-button v-if="PostButtonVisible === true" type="success" @click="clearAll" >清空</el-button>
        <slot></slot>
      </div>
    </div>
    <DragDiv title='工作区' dragHeight=300>
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
          <el-input type="textarea" placeholder="请输入内容" v-model="wholeInputContents[index]"></el-input>
        </div>
      </div>
      <div class="fh-list" v-show="annotations.length > 0">
        <div v-for="(item,oindex) in annotations" :key="item" :id="'d'+oindex" class="goodsForm" style="background: #ecf5ff">
          <div class="item-del">
            <span>id:{{oindex + 1}}</span>
            <el-button slot="append" type="danger" icon="el-icon-delete" size="mini" @click="delItem(oindex)"></el-button>
          </div>
          <div class="messageInLab" v-for="(messageLab,messIndex) in itemRadios" :key='messageLab.title'>
            <span>{{oindex + 1}}.{{messIndex + 1}}.{{messageLab.title}}:</span>
            <el-radio-group v-model="annotations[oindex].itemRadioContents[messIndex]" style="margin-top: 5px">
              <el-radio  v-for="(lab,num) in messageLab.labels" :key='lab' :label="num">{{lab.name}} </el-radio>
            </el-radio-group>
          </div>
          <div class="messageInLab" v-for="(messageLab,messIndex) in itemCheckBoxs" :key='messageLab.title'>
            <span>{{oindex + 1}}.{{messIndex + 1 + itemRadios.length}}.{{messageLab.title}}</span>
            <el-checkbox-group v-model="annotations[oindex].itemCheckBoxContents[messIndex]" style="margin-top: 5px">
              <el-checkbox v-for="(lab,num) in messageLab.labels" :key='lab' :label="num">{{lab.name}}</el-checkbox>
            </el-checkbox-group>
          </div>
          <div class="messageInLab" v-for="(title,index) in itemInputs" :key='index'>
            <span>{{oindex + 1}}.{{index + 1 + itemRadios.length + itemCheckBoxs.length}}.{{title}}</span>
            <el-input placeholder="请输入内容" v-model="annotations[oindex].itemInputContents[index]" style="margin-top: 5px"></el-input>
          </div>
        </div>
      </div>
      <div v-show="CommentVisible">
          <div>备注:</div>
          <div id="editor"></div>
      </div>
    </DragDiv>
  </div>
</template>

<script>
// import $ from 'jquery'
import Quill from 'quill'
import DragDiv from 'lib/dragdiv/dragdiv'
import Annotate from 'lib/annotate/annotate'
import 'lib/annotate/css/annotate.css'
// import Vue from 'vue'

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
      wholeRadioContents: [],
      wholeCheckBoxContents: [],
      wholeInputContents: [],
      projectid: '',
      storageKey: '',
      quill: {},
      option: '',
      options: [],
      text: 'sefef ase we fwea fwa fe f',
      annotations: {},
      oindex: 1,
      content: [],
      result: []
    }
  },
  computed: {
    workAreaWidth: function () {
      let w = document.documentElement.scrollWidth || document.body.scrollWidth
      let curWidth = 0
      if (w > 1650) {
        curWidth = 1000
      } else if (w > 1350) {
        curWidth = 845
      } else if (w > 1200) {
        curWidth = 730
      } else {
        curWidth = 610
      }
      return curWidth
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
    // annotations: function () {
    //   console.log('annotations change')
    //   for (let key in this.annotations) {
    //     if (!Array.isArray(this.annotations[key].itemRadioContents)) {
    //       let vm = this
    //       vm.annotations[key].itemRadioContents = []
    //       // vm.annotations[key].itemCheckBoxContents = []
    //       // vm.annotations[key].itemInputContents = []

    //       // for (let num in this.itemCheckBoxs) {
    //       //   if (!Array.isArray(this.annotations[key].itemCheckBoxContents[num])) {
    //       //     // 将itemCheckBoxContents变成三维数组
    //       //     this.$set(this.annotations[key].itemCheckBoxContents, num, [])
    //       //   }
    //       // }
    //     }
    //     // // // 标注项单选
    //     // if (!Array.isArray(this.itemRadioContents[key])) {
    //     //   this.$set(this.itemRadioContents, key, [])
    //     // }
    //     // // // 标注项多选
    //     // if (!Array.isArray(this.itemCheckBoxContents[key])) {
    //     //   // 将itemCheckBoxContents变成二维数组
    //     //   this.$set(this.itemCheckBoxContents, key, [])
    //     //   for (let num in this.itemCheckBoxs) {
    //     //     if (!Array.isArray(this.itemCheckBoxContents[key][num])) {
    //     //       // 将itemCheckBoxContents变成三维数组
    //     //       this.$set(this.itemCheckBoxContents[key], num, [])
    //     //     }
    //     //   }
    //     // }
    //     // // 标注项填空
    //     // if (!Array.isArray(this.itemInputContents[key])) {
    //     //   this.$set(this.itemInputContents, key, [])
    //     // }
    //   }
    // },
    itemCheckBoxs: function () {
      window.annotations.itemCheckBoxLen = this.itemCheckBoxs.length
      for (let key in this.annotations) {
        for (let num in this.itemCheckBoxs) {
          if (!Array.isArray(this.annotations[key].itemCheckBoxContents[num])) {
            // 将itemCheckBoxContents变成三维数组
            this.$set(this.annotations[key].itemCheckBoxContents, num, [])
          }
        }
      }
    }
  },
  mounted: function () {
    let vm = this
    console.log('text002 mounted')
    var element = document.getElementById('textContent')
    let Annopts = {
      prompt: {
        width: 200,
        height: 50,
        text: 'Adding notes',
        className: 'annotation-prompt'
      },
      content: {
        className: 'annotation-content'
      },
      itemCheckBoxLen: vm.itemCheckBoxs.length,
      vueRoot: this
    }
    window.annotations = new Annotate(element, Annopts)
    // let annotations = new Annotate(element, Annopts)
    vm.annotations = window.annotations.annotations
    // console.log(annotations)
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
  },
  methods: {
    getResult: function () {
      let vm = this
      var submit = {
        data: window.annotations.getResult(),
        wholeRadioContents: vm.wholeRadioContents,
        wholeCheckBoxContents: vm.wholeCheckBoxContents,
        wholeInputContents: vm.wholeInputContents
      }
      return submit
    },
    getComment: function () {
      return this.quill.getText()
    },
    postTask: function (form) {
      // window.annotations.Reset()
      let vm = this
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
      console.log('clearAll')
      window.annotations.Reset()
    },
    load: function (data, result, commit) {
      console.log('text002 load')
      console.log(data, result, commit)
      let vm = this
      if (commit) {
        vm.quill.setText(commit)
      } else {
        vm.quill.setText('')
      }
      // document.getElementById('textContent').innerText = 'data'
      let formatData = data.replace(/[\n\r]/g, '<br>')
      window.annotations.changeContent(formatData)
      this.$nextTick(function () {
        window.annotations.onResize()
      })
      if (!result || result === '') {
        return
      }
      vm.clearAll()
      // console.log(result)
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
      this.$nextTick(function () {
        window.annotations.Load(result.data)
      })
    },
    delItem: function (index) {
      window.annotations.deleteAnnotation(index + 1)
    }
  }
}
</script>

<style scoped>

.el-radio-button__inner {
  margin-left: 15px;
  border: 1px solid #d8dce6;
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
.text-template {
  width: 100%;
}

#textContent {
  height:700px;
  overflow: auto;
  margin-top: 15px;
}
</style>
