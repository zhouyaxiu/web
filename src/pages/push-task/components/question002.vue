<template>
<div class="mb-3">
  <div v-if="queArr.length > 0">
    <div class="ques-items mb-3" v-for="(items, index) in queArr" :key="items.type + '' + index">
      <p>{{showType(items.type)}}</p>
      <div class="d-flex align-items-center mb-2">
        <span>Q{{index + 1}}</span>
        <div
          class="option pl-1 ml-2"
          contenteditable="true"
          @blur="titleChange($event.target.innerText, queArr[index], 'title')">
          {{items.title}}
        </div>
      </div>
      <el-input :placeholder="$t('pushimage.business.entercontent')" v-if="items.type === 3"></el-input>
      <el-slider show-input v-else-if="items.type === 4"></el-slider>
      <div class="d-flex align-items-center" v-for="(item, num) in items.labels" :key="item + num" v-else>
        <span
          :class="[items.type === 1 ? 'el-radio__inner' : 'el-checkbox__inner']"
          v-if="items.type === 1 || items.type === 2">
        </span>
        <div
          class="option pl-1 ml-2 mr-2"
          contenteditable="true"
          @blur="titleChange($event.target.innerText, queArr[index].labels[num], 'name')">
          {{item.name}}
        </div>
        <el-button
          type="primary"
          icon="el-icon-delete"
          size="mini"
          @click="delQuestion(queArr[index].labels, num)">
        </el-button>
      </div>
      <div class="d-flex justify-content-between mt-3 q-group-btn">
        <el-button
          icon="el-icon-plus"
          size="small"
          v-if="items.type === 1 || items.type === 2 || items.type === 5"
          @click="addChoice(queArr[index].labels)">
        </el-button>
        <el-button icon="el-icon-delete" size="small" @click="delQuestion(queArr, index)"></el-button>
      </div>
    </div>
  </div>
  <el-button-group>
    <el-button type="primary" @click="addQuestion(queArr, {type:1})">{{$t("pushimage.business.singlechoice")}}</el-button>
    <el-button type="primary" @click="addQuestion(queArr, {type:2})">{{$t("pushimage.business.multiplechoice")}}</el-button>
    <el-button type="primary" @click="addQuestion(queArr, {type:3})">{{$t("pushimage.business.fillblank")}}</el-button>
    <el-button type="primary" @click="addQuestion(queArr, {type:4})">滑块</el-button>
    <el-button type="primary" @click="addQuestion(queArr, {type:5})">下拉框</el-button>
  </el-button-group>
</div>
</template>

<script>
// import $ from 'jquery'
import {language} from 'lang'

export default {
  name: 'question002',
  components: {
  },
  props: {
    queArr: Array
  },
  data () {
    return {
    }
  },
  computed: {
    /*
    * 显示数据类型
    * type为传入的数据类型（1单选题2多选题3填空题4滑块5下拉框）
    */
    showType () {
      return (type) => {
        switch (type) {
          case 1:
            return '单选题'
          case 2:
            return '多选题'
          case 3:
            return '填空题'
          case 4:
            return '滑块'
          case 5:
            return '下拉框'
        }
      }
    }
  },
  methods: {
    /*
    * 添加类型
    * arr 需要插入数据的数组
    * type 传入的数据类型
    * 1 = Radio;2 = CheckBox;3 = Input;4 = 滑块;5=下拉框
    */
    addQuestion (arr, {type = 1, name = '题目'} = {}) {
      const data = arr
      const jsonStr = {
        type: type,
        required: false, // 是否必填
        title: name, // 题目
        labels: [{
          name: '选项', // 标签名
          content: '' // 标签含义，暂时不用，可为空
        },
        {
          name: '选项',
          content: ''
        }],
        valid: '',
        min: 0,
        max: 100
      }
      data.push(jsonStr)
    },
    // 添加选项
    addChoice (arr) {
      arr.push({name: language('pushimage.business.js.label'), content: ''})
    },
    /*
    * 修改题目
    * text 修改的内容
    * arrTitle 需要被修改的对象
    * string 需要被修改的key(传入目的：需求不同，key也会改变)
    */
    titleChange (text, arrTitle, string) {
      arrTitle[string] = text
    },
    // 删除类型或选项
    delQuestion (arr, index) {
      arr.splice(index, 1)
    }
  }
}
</script>

<style>
.ques-items{
  border: 1px solid #dcdfe6;
  box-sizing: border-box;
  padding: 10px 30px;
}
.option{
  width: 100%;
  min-height: 30px;
  line-height: 30px;
}
.option:hover {
  box-shadow: 0 0 3px #409EFF
}
.ques-items:hover .q-group-btn{
  visibility: visible;
}
.q-group-btn{
  visibility:hidden;
}
</style>
