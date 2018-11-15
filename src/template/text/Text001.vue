<template>
  <div class="text-template">
    <div class="container">
      <p class="font-italic">数据和要求:</p>
      <div>
        <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 40}" v-model="text" readonly></el-input>
      </div>
      <div class="d-flex justify-content-end" style="margin-top: 1rem;">
        <el-button v-if="PostButtonVisible === true" type="success" @click="postTask" >提交</el-button>
        <slot></slot>
      </div>
    </div>
    <DragDiv title='工作区' dragHeight=500 :startX="workAreaWidth" startY=80>
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
      <div class="fh-list" v-show="options.length > 0">
        <div v-for="(item,oindex) in options" :key="item" class="goodsForm" @click="select(oindex)" style="background: #ecf5ff">
          <div class="item-del">
            <span>id:{{oindex}}</span>
            <el-button slot="append" type="danger" icon="el-icon-delete" size="mini" @click="delradio(oindex)"></el-button>
          </div>
          <div class="messageInLab" v-for="(messageLab,messIndex) in itemRadios" :key='messageLab.title'>
            <span>{{oindex}}.{{messIndex + 1}}.{{messageLab.title}}:</span>
            <el-radio-group v-model="options[oindex].itemRadioContents[messIndex]" style="margin-top: 5px">
              <el-radio  v-for="(lab,num) in messageLab.labels" :key='lab' :label="num">{{lab.name}} </el-radio>
            </el-radio-group>
          </div>
          <div class="messageInLab" v-for="(messageLab,messIndex) in itemCheckBoxs" :key='messageLab.title'>
            <span>{{oindex}}.{{messIndex + 1 + itemRadios.length}}.{{messageLab.title}}</span>
            <el-checkbox-group v-model="options[oindex].itemCheckBoxContents[messIndex]" style="margin-top: 5px">
              <el-checkbox v-for="(lab,num) in messageLab.labels" :key='lab' :label="num">{{lab.name}}</el-checkbox>
            </el-checkbox-group>
          </div>
          <div class="messageInLab" v-for="(title,index) in itemInputs" :key='index'>
            <span>{{oindex}}.{{index + 1 + itemRadios.length + itemCheckBoxs.length}}.{{title}}</span>
            <el-input placeholder="请输入内容" v-model="options[oindex].itemInputContents[index]" style="margin-top: 5px"></el-input>
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
import {language} from 'lang'

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
      itemRadioContents: [],
      itemCheckBoxContents: [],
      itemInputContents: [],
      projectid: '',
      storageKey: '',
      quill: {},
      option: '',
      options: [],
      text: ''
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
          console.log(this.wholeCheckBoxContents)
        }
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
    let vm = this
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
      // item 相关
    },
    getResult: function () {
      let vm = this
      var submit = {
        data: [],
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
      let vm = this
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
    load: function (data, result, commit) {
      let vm = this
      if (commit) {
        vm.quill.setText(commit)
      } else {
        vm.quill.setText('')
      }
      vm.text = data
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
      console.log(result)
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
</style>
