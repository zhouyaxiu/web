<template>
<div class="d-inline-block mb-3">
  <div v-if="queArr.length > 0">
    <p>{{buttonName}}</p>
    <div class="q-content" v-for="(items, index) in queArr" :key="items.title + index">
      <span>Q{{index + 1}}</span>
      <div class="choice-box">
        <div contenteditable="true" class="choice pl-2" @blur="titleChange(index, $event.target.innerText, queArr)">{{items.title}}</div>
      </div>
      <div v-for="(item, num) in items.labels" :key="item + num">
        <span :class="icon"></span>
        <div class="choice-box">
          <div contenteditable="true" class="choice  pl-2" @blur="choiceChange(index, num, $event.target.innerText, queArr, 'name')">{{item.name}}</div>
        </div>
        <el-button type="primary" icon="el-icon-delete" size="mini" @click="delChoice(queArr, index, num)"></el-button>
      </div>
      <div class="q-group-btn">
        <el-button icon="el-icon-plus" size="small" @click="addChoice(queArr, index)"></el-button>
        <el-button icon="el-icon-delete" size="small" @click="delQuestion(queArr, index)"></el-button>
      </div>
    </div>
  </div>
  <el-button type="primary" plain icon="el-icon-plus" @click="addQuestion(queArr)">{{buttonName}}</el-button>
</div>
</template>

<script>
// import $ from 'jquery'
import {language} from 'lang'

export default {
  name: 'app',
  components: {
  },
  props: {
    buttonName: String,
    queArr: Array
  },
  data () {
    return {
      // queArr: []
    }
  },
  computed: {
    icon () {
      let icon = ''
      if (this.buttonName === '单选题') {
        icon = 'el-radio__inner'
      }
      if (this.buttonName === '多选题') {
        icon = 'el-checkbox__inner'
      }
      return icon
    }
  },
  methods: {
    addQuestion (arr, name) {
      let thisId = arr.length.toString()
      if (name === 'input') {
        arr.push(language('pushimage.business.js.text'))
      } else {
        arr.push({
          id: thisId,
          title: language('pushimage.business.js.title'),
          labels: [{
            name: language('pushimage.business.js.label'),
            content: language('pushimage.business.js.labelContent')
          }, {
            name: language('pushimage.business.js.label'),
            content: language('pushimage.business.js.labelContent')
          }]
        })
      }
    },
    addChoice (arr, index, name) {
      arr[index].labels.push({
        name: language('pushimage.business.js.label'),
        content: language('pushimage.business.js.labelContent')
      })
    },
    titleChange (index, text, arr, name) {
      if (name === 'input') {
        arr[index] = text
      } else {
        arr[index].title = text
      }
    },
    choiceChange (index, num, text, arr, change) {
      if (change === 'name') {
        arr[index].labels[num].name = text
      } else {
        arr[index].labels[num].content = text
      }
    },
    delQuestion (arr, index) {
      arr.splice(index, 1)
    },
    delChoice (arr, index, num) {
      if (arr[index].labels.length < 2) {
        arr.splice(index, 1)
      } else {
        arr[index].labels.splice(num, 1)
      }
    }
  }
}
</script>

<style>
.choice:hover {
  box-shadow: 0 0 3px #409EFF
}
</style>
