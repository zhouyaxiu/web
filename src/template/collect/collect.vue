<template>
  <div class="text-template">
    <div class="container">
      <p class="font-italic">{{$t('collect.title')}}:</p>
      <div>
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
        <div class="messageInLab max-width" v-for="(title,index) in wholeInputs" :key='index'>
          <span>{{index + 1 + wholeRadios.length + wholeCheckBoxs.length}}.{{title}}</span>
          <el-input :placeholder="$t('labelTool.please')" v-model="wholeInputContents[index]"></el-input>
        </div>
      </div>
      <div v-show="data.length > 0">
        <p>{{$t('collect.upload')}}</p>
        <div class="g-item-box" v-for="(item,oindex) in data" :key="item">
          <div>
            <div>
              <p class="g-itembox-title">id:{{oindex+1}}</p>
              <p class="font-italic">{{item.name}}：</p>
              <div style="display:flex">
                <div>
                  <div class="collect-show" v-if="item.type === 1 && item.sample">
                    <img :src="item.sample" style="width: 100%;">
                  </div>
                  <div class="collect-show-audio" v-if="item.type === 2 && item.sample">
                    <audio :src="item.sample" controls="controls"></audio>
                  </div>
                  <div class="collect-show" v-if="item.type === 3 && item.sample">
                    <video preload="auto" controls="controls" :src="item.sample" style="width: 100%;"></video>
                  </div>
                  <div class="el-upload__tip s-item-sample" v-if="item.sample">{{$t('collect.sample')}}</div>
                </div>
                <div>
                  <div class="collect-show" v-if="item.type === 1 && result[oindex].raw">
                    <img :src="result[oindex].raw" style="width: 100%;">
                  </div>
                  <div class="collect-show-audio" v-if="item.type === 2 && result[oindex].raw">
                    <audio :src="result[oindex].raw" controls="controls"></audio>
                  </div>
                  <div class="collect-show" v-if="item.type === 3 && result[oindex].raw">
                    <video preload="auto" controls="controls" :src="result[oindex].raw" style="width: 100%;"></video>
                  </div>
                </div>
              </div>
              <span v-if="UploadButtonVisible === true" class="btn btn-primary btn-sm fileinput-button">
                <span>{{$t('collect.upload')}}</span>
                <input type="file" :accept="upLoadFile(item.type)" :id="'select-file'+oindex" @change="(value) => addFile(value, oindex)">
              </span>
              <el-progress :percentage="progress[oindex]" style="max-width:360px;" v-show="progress[oindex] > 0"></el-progress>
            </div>
            <div class="messageInLab" v-for="(messageLab,messIndex) in itemRadios" :key='messageLab.title'>
              <span>{{oindex+1}}.{{messIndex + 1}}.{{messageLab.title}}:</span>
              <el-radio-group v-model="result[oindex].itemRadioContents[messIndex]" style="margin-top: 5px">
                <el-radio  v-for="(lab,num) in messageLab.labels" :key='lab' :label="num">{{lab.name}} </el-radio>
              </el-radio-group>
            </div>
            <div class="messageInLab" v-for="(messageLab,messIndex) in itemCheckBoxs" :key='messageLab.title'>
              <span>{{oindex+1}}.{{messIndex + 1 + itemRadios.length}}.{{messageLab.title}}</span>
              <el-checkbox-group v-model="result[oindex].itemCheckBoxContents[messIndex]" style="margin-top: 5px">
                <el-checkbox v-for="(lab,num) in messageLab.labels" :key='lab' :label="num">{{lab.name}}</el-checkbox>
              </el-checkbox-group>
            </div>
            <div class="messageInLab max-width" v-for="(title,index) in itemInputs" :key='index'>
              <span>{{oindex+1}}.{{index + 1 + itemRadios.length + itemCheckBoxs.length}}.{{title}}</span>
              <el-input :placeholder="$t('labelTool.please')" v-model="result[oindex].itemInputContents[index]" style="margin-top: 5px"></el-input>
            </div>
          </div>
          <div class="result" v-if="CheckRadioVisible">
            <span>{{$t('collect.result')}}：</span>
            <el-radio-group v-model="checkRadio[oindex]">
              <el-radio :label=0>{{$t('collect.qualified')}}</el-radio>
              <el-radio :label=1>{{$t('collect.unqualified')}}</el-radio>
            </el-radio-group>
          </div>
        </div>
      </div>
      <div class="d-flex justify-content-end" style="margin-top: 1rem;">
        <el-button v-if="PostButtonVisible === true" type="success" @click="postTask" >{{$t('collectWav.submit')}}</el-button>
      </div>
    </div>
    <div v-show="CommentVisible">
      <div>{{$t('collect.editor')}}:</div>
      <div id="editor"></div>
    </div>
    <slot></slot>
  </div>
</template>

<script>
// import $ from 'jquery'
import * as qiniu from 'qiniu-js'
import {language} from 'lang'
import Quill from 'quill'

function startsWith (str, prefix) {
  return str.slice(0, prefix.length) === prefix
}

export default {
  name: 'app',
  components: {
  },
  props: {
    wholeRadios: Array,
    wholeCheckBoxs: Array,
    wholeInputs: Array,
    itemRadios: Array,
    itemCheckBoxs: Array,
    itemInputs: Array,
    data: Array,
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
    CheckRadioVisible: {
      type: Boolean,
      default: false
    },
    UploadButtonVisible: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      wholeRadioContents: [],
      wholeCheckBoxContents: [[]],
      wholeInputContents: [],
      itemRadioContents: [],
      itemCheckBoxContents: [[]],
      itemInputContents: [],
      progress: [],
      result: [],
      // 每个数据的质检结果，单选题，写死的选项 ==> 合格 or 不合格
      checkRadio: []
    }
  },
  computed: {
    /*
    * 控制上传类型
    * fileType为传入的数据类型（1为图片2为音频3为视频）
    */
    upLoadFile () {
      return (fileType) => fileType === 1 ? 'image/*' : (fileType === 2 ? 'audio/*' : (fileType === 3 ? 'video/*' : ''))
    }
  },
  watch: {
    /*
    * 使用场景：发布任务
    * 根据传入data的个数进行循环对应result个数
    * 执行条件：data个数实时变化时
    */
    data: function () {
      this.result = []
      this.data.forEach((currentValue, index) => {
        this.result.push({
          type: currentValue.type,
          raw: '',
          itemRadioContents: [],
          itemCheckBoxContents: [[]],
          itemInputContents: []
        })
      })
    }
  },
  created: function () {
    /*
    * 使用场景：做任务界面
    * 根据传入data的个数进行循环对应result个数
    * 执行条件：初始化时
    */
    this.data.forEach((currentValue, index) => {
      this.result.push({
        type: currentValue.type,
        raw: '',
        itemRadioContents: [],
        itemCheckBoxContents: [[]],
        itemInputContents: []
      })
    })
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
    errInfo (msg) {
      let vm = this
      vm.$notify.error({
        title: language('collect.js.error'),
        message: msg,
        duration: 2000
      })
    },
    valid () {
      let vm = this
      for (let i = 0; i < vm.data.length; i++) {
        if (!vm.result[i]) {
          return false
        }
        if (vm.result[i].raw === '') {
          vm.errInfo('id' + (i + 1) + ':' + language('collect.js.nodatas'))
          return false
        }
      }
      let i = 0
      if (vm.wholeRadios.length > 0 && Array.isArray(vm.wholeRadioContents)) {
        if (vm.wholeRadioContents.length !== vm.wholeRadios.length) {
          vm.errInfo((language('labelTool.radio') + language('collect.js.unfinished')))
          return false
        }
        for (i = 0; i < vm.wholeRadioContents.length; i++) {
          if (!vm.wholeRadioContents[i] && vm.wholeRadioContents[i] !== 0) {
            vm.errInfo((language('labelTool.radio'), i, language('labelTool.noChoice')))
            return false
          }
        }
      }

      if (vm.wholeCheckBoxs.length > 0 && Array.isArray(vm.wholeCheckBoxContents)) {
        if (vm.wholeCheckBoxContents.length !== vm.wholeCheckBoxs.length) {
          vm.errInfo(language('labelTool.checkbox') + language('collect.js.unfinished'))
          return false
        }
        for (i = 0; i < vm.wholeCheckBoxContents.length; i++) {
          if (vm.wholeCheckBoxContents[i].length === 0) {
            vm.errInfo((language('labelTool.checkbox'), i, language('labelTool.noChoice')))
            return false
          }
        }
      }

      if (vm.wholeInputs.length > 0 && Array.isArray(vm.wholeInputContents)) {
        if (vm.wholeInputContents.length !== vm.wholeInputs.length) {
          vm.errInfo(language('labelTool.input') + language('collect.js.unfinished'))
          return false
        }
        for (i = 0; i < vm.wholeInputContents.length; i++) {
          if (vm.wholeInputContents[i].trim() === '') {
            vm.errInfo(language('labelTool.input'), i, language('labelTool.noNull'))
            return false
          }
        }
      }
      // TODO item的题目验证
      return true
    },
    getUploadToken (file) {
      return this.$parent.getUploadToken(file)
    },
    addFile (e, index) {
      let vm = this
      let input = document.getElementById('select-file' + index)
      console.log(input)
      let file = e.target.files[0]
      if (!file) {
        return
      }
      let tokenKey = vm.getUploadToken(file)
      let token = tokenKey[0]
      let key = tokenKey[1]
      let url = tokenKey[2]
      console.log(token)
      console.log(key)
      if (token === '' || key === '') {
        return
      }
      let config = {
        useCdnDomain: true,
        region: qiniu.region.z0,
        checkByMD5: true
      }
      let putExtra = {
        fname: file.name,
        params: {},
        mimeType: null
      }
      let observable = qiniu.upload(file, key, token, putExtra, config)
      console.log(observable)
      let observer = {
        next (res) {
          vm.$set(vm.progress, index, ~~res.total.percent)
          console.log(vm.progress[index])
        },
        error (err) {
          vm.$set(vm.progress, index, 0)
          console.log('error', err)
        },
        complete (res) {
          console.log('complete', res)
          // console.log(vm.data[index])
          vm.result[index].raw = url
          vm.$set(vm.progress, index, 100)
          // console.log(vm.data[index])
        }
      }
      vm.subscription = observable.subscribe(observer)
    },
    getResult: function () {
      let vm = this
      var submit = {
        data: vm.result,
        wholeRadioContents: vm.wholeRadioContents,
        wholeCheckBoxContents: vm.wholeCheckBoxContents,
        wholeInputContents: vm.wholeInputContents
      }
      return submit
    },
    postTask: function (form) {
      let vm = this
      if (!vm.valid()) {
        return
      }
      let result = vm.getResult()
      let params = {
        result: result,
        commit: ''
      }
      console.log(params)
      this.$emit('postTask', params)
    },
    getComment: function () {
      return this.quill.getText()
    },
    getCheckRadio: function () {
      return this.checkRadio
    },
    load: function (result, comments, prev) {
      let vm = this
      vm.wholeRadioContents = result.wholeRadioContents
      vm.wholeCheckBoxContents = result.wholeCheckBoxContents
      vm.wholeInputContents = result.wholeInputContents
      vm.result = result.data
      for (let i = 0; i < vm.result.length; i++) {
        if (!startsWith(vm.result[i].raw, 'http')) {
          vm.result[i].raw = 'https://s301.fanhantech.com/' + vm.result[i].raw
        }
      }
      for (let i = vm.result.length; i < vm.data.length; i++) {
        vm.result.push({
          type: vm.data[i].type,
          raw: '',
          itemRadioContents: [],
          itemCheckBoxContents: [[]],
          itemInputContents: []
        })
      }
      try {
        let commentRes = JSON.parse(comments)
        if (commentRes && typeof commentRes === 'object') {
          vm.quill.setText(commentRes.comment)
          vm.checkRadio = commentRes.radioContents
        }
      } catch (e) {
        vm.quill.setText(comments)
      }
    }
  }
}
</script>

<style scoped>
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
.text-template {
  width: 100%;
}
.collect-show-audio {
  height: 100px;
  margin-left: 15px;
  display: flex;
  align-items: center;
}
.collect-show {
  width: 300px;
  margin-left: 15px;
  /* border: 1px solid #ccc; */
}
.g-item-box {
  border: 1px solid #d9d9d9;
  padding: 25px;
  margin-bottom: 20px;
}
.g-itembox-title {
  border-left: 20px solid #007bff;
  text-indent: .5rem;
}
.s-item-sample {
  text-align: center;
  padding-left:15px;
}
.max-width {
  max-width: 400px;
}
.fileinput-button {
  position: relative;
  display: inline-block;
  overflow: hidden;
  font-size: 0.8rem;
  padding: 9px 15px;
}
.fileinput-button input {
  position: absolute;
  left: 0px;
  top: 0px;
  opacity: 0;
  height: 100%;
  width: 100%;
}
.result {
  border: 1px solid #409eff;
  background: #ecf5ff;
  border-radius: 5px;
  padding:5px 10px
}
.result label {
  margin-bottom: 0;
}
</style>
