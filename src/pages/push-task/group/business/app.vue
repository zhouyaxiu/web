<template>
  <div id="main" class="push-task main">
    <Header/>
    <Layout :selStep="2" :active="2" :type="'group'" :projectId="projectId" style="flex:1">
      <div class="taskTit">
        <h3>{{$t("pushimage.business.wholemap")}}</h3>
      </div>
      <div class="taskInfos">
        <div v-if="wholeQues.length > 0">
          <div class="q-content" v-for="(items, index) in wholeQues" :key="items.type + '' + index">
            <p>{{showType(items.type)}}</p>
            <div class="mb-2">
              <span>Q{{index + 1}}</span>
              <div class="choice-box">
                <div contenteditable="true" class="choice" @blur="titleChange($event.target.innerText, wholeQues[index], 'title')">{{items.title}}</div>
              </div>
            </div>
            <el-input :placeholder="$t('pushimage.business.entercontent')" v-if="items.type === 3" style="max-width:640px"></el-input>
            <el-slider show-input v-else-if="items.type === 4" style="max-width:640px"></el-slider>
            <div v-for="(item, num) in items.labels" :key="item + num" v-else>
              <span :class="[items.type === 1 ? 'el-radio__inner' : 'el-checkbox__inner']"
              v-if="items.type === 1 || items.type === 2"></span>
              <div class="choice-box">
                <div contenteditable="true" class="choice" @blur="titleChange($event.target.innerText, wholeQues[index].labels[num], 'name')">{{item.name}}</div>
              </div>
              <el-button type="primary" icon="el-icon-delete" size="mini" @click="delQuestion(wholeQues[index].labels, num)"></el-button>
            </div>
            <div class="q-group-btn">
              <el-button icon="el-icon-plus" size="small" @click="addChoice(wholeQues[index].labels)" v-if="items.type === 1 || items.type === 2 || items.type === 5"></el-button>
              <el-button icon="el-icon-delete" size="small" @click="delQuestion(wholeQues, index)"></el-button>
            </div>
          </div>
        </div>
        <el-button-group>
          <el-button type="primary" @click="addQuestion(wholeQues, {type:1})">{{$t("pushimage.business.singlechoice")}}</el-button>
          <el-button type="primary" @click="addQuestion(wholeQues, {type:2})">{{$t("pushimage.business.multiplechoice")}}</el-button>
          <el-button type="primary" @click="addQuestion(wholeQues, {type:3})">{{$t("pushimage.business.fillblank")}}</el-button>
          <el-button type="primary" @click="addQuestion(wholeQues, {type:4})">滑块</el-button>
          <el-button type="primary" @click="addQuestion(wholeQues, {type:5})">下拉框</el-button>
        </el-button-group>
      </div>
      <div class="taskTit mt-5">
        <h3>{{$t("pushimage.business.labelproblem")}}</h3>
      </div>
      <div class="taskInfos">
        <div v-if="itemQues.length > 0">
          <div class="q-content" v-for="(items, index) in itemQues" :key="items.type + '' + index">
            <p>{{showType(items.type)}}</p>
            <span>Q{{index + 1}}</span>
            <div class="choice-box">
              <div contenteditable="true" class="choice" @blur="titleChange($event.target.innerText, itemQues[index], 'title')">{{items.title}}</div>
            </div>
            <el-input :placeholder="$t('pushimage.business.entercontent')" v-if="items.type === 3" style="max-width:640px"></el-input>
            <el-slider show-input v-else-if="items.type === 4" style="max-width:640px"></el-slider>
            <div v-for="(item, num) in items.labels" :key="item + num" v-else>
              <span :class="[items.type === 1 ? 'el-radio__inner' : 'el-checkbox__inner']"
              v-if="items.type === 1 || items.type === 2"></span>
              <div class="choice-box">
                <div contenteditable="true" class="choice" @blur="titleChange($event.target.innerText, itemQues[index].labels[num], 'name')">{{item.name}}</div>
              </div>
              <el-button type="primary" icon="el-icon-delete" size="mini" @click="delQuestion(itemQues[index].labels, num)"></el-button>
            </div>
            <div class="q-group-btn">
              <el-button icon="el-icon-plus" size="small" @click="addChoice(itemQues[index].labels)" v-if="items.type === 1 || items.type === 2 || items.type === 5"></el-button>
              <el-button icon="el-icon-delete" size="small" @click="delQuestion(itemQues, index)"></el-button>
            </div>
          </div>
        </div>
        <el-button-group>
          <el-button type="primary" @click="addQuestion(itemQues, {type:1})">{{$t("pushimage.business.singlechoice")}}</el-button>
          <el-button type="primary" @click="addQuestion(itemQues, {type:2})">{{$t("pushimage.business.multiplechoice")}}</el-button>
          <el-button type="primary" @click="addQuestion(itemQues, {type:3})">{{$t("pushimage.business.fillblank")}}</el-button>
          <el-button type="primary" @click="addQuestion(itemQues, {type:4})">滑块</el-button>
          <el-button type="primary" @click="addQuestion(itemQues, {type:5})">下拉框</el-button>
        </el-button-group>
      </div>
      <div class="d-flex justify-content-center mt-5">
        <el-button @click="goBack()">{{$t("pushTask.goback")}}</el-button>
        <el-button plain @click="submitForm(false)">{{$t("pushTask.submit")}}</el-button>
        <el-button type="primary" @click="submitForm(true)">{{$t("pushTask.next")}}</el-button>
      </div>
    </Layout>
    <Footer/>
    <transition name="el-fade-in">
      <div class="message2" v-show="messageStatus === 2" style="overflow: auto;display: flex;justify-content: center;padding-top: 2rem;">
        <i class="el-icon-error" v-on:click="close()"></i>
        <Group001 ref="Template"
          @postTask="templetPostTask"
          :imgUrl="datas"
          :wholeQues="wholeQues"
          :itemQues="itemQues"
        >
        </Group001>
      </div>
    </transition>
    <div class="speake-box">
      <el-button type="primary" @click="showTemplate()">{{$t("pushimage.business.preview")}}</el-button>
    </div>
  </div>
</template>

<script>
import Header from 'components/header'
import Footer from 'components/footer'
import Layout from '../../components/layoutPage'
import $ from 'jquery'
import axios from 'axios'
import * as util from 'assets/js/util.js'
import {language} from 'lang'
import Group001 from 'template/group/Group001'

export default {
  name: 'app',
  components: {
    Header,
    Footer,
    Layout,
    Group001
  },
  data () {
    return {
      projectId: '',
      templet: 2,
      messageStatus: 1,
      speakeStatus: false,
      wholeQues: [], // 整图
      itemQues: [], // 标注项
      SopType: 6001,
      datas: [
        {type: 1, raw: 'https://s301.fanhantech.com/cartoon/0hIr4xkgInoz2q2LYhSE47bjKvdMzCla.jpg'},
        {type: 1, raw: 'https://s301.fanhantech.com/cartoon/0hIr4xkgInoz2q2LYhSE47bjKvdMzCla.jpg'},
        {type: 1, raw: 'https://s301.fanhantech.com/cartoon/0hIr4xkgInoz2q2LYhSE47bjKvdMzCla.jpg'},
        {type: 1, raw: 'https://s301.fanhantech.com/cartoon/0hIr4xkgInoz2q2LYhSE47bjKvdMzCla.jpg'},
        {type: 1, raw: 'https://s301.fanhantech.com/cartoon/0hIr4xkgInoz2q2LYhSE47bjKvdMzCla.jpg'},
        {type: 1, raw: 'https://s301.fanhantech.com/cartoon/0hIr4xkgInoz2q2LYhSE47bjKvdMzCla.jpg'},
        {type: 1, raw: 'https://s301.fanhantech.com/cartoon/0hIr4xkgInoz2q2LYhSE47bjKvdMzCla.jpg'}
      ]
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
  mounted: function () {
    let vm = this
    let projectId = document.location.pathname.split('/')[3]
    // projectId = 'subwUVrB77R001'
    console.log('projectId:', projectId)
    if (projectId !== '') {
      vm.projectId = projectId
    }
    this.$nextTick(function () {
      // 获取基本信息（可能是新建任务后，自动跳转过来，也可能是从控制台跳转过来）
      let xsrftoken = $('meta[name=_xsrf]').attr('content')
      axios.post('/api/get-business-info/group',
        {
          taskid: vm.projectId
        },
        {
          headers: {
            'X-Xsrftoken': xsrftoken
          }
        }
      ).then(function (response) {
        let rsp = response.data
        if (rsp.code === 0) {
          if (rsp.SopType) {
            vm.SopType = rsp.SopType
          }

          if (rsp.pageCfg) {
            if (rsp.pageCfg.wholeQues) {
              vm.wholeQues = rsp.pageCfg.wholeQues
            }
            if (rsp.pageCfg.itemQues) {
              vm.itemQues = rsp.pageCfg.itemQues
            }
          }
        } else {
          vm.notify('error', rsp.message, 2000)
        }
      })
        .catch(function (error) {
          console.log(error)
        })
    })
  },
  methods: {
    // 错误提示
    notify (type, message, duration) {
      let vm = this
      if (type === 'success') {
        vm.$notify.success({
          title: language('login.js.success'),
          message: message,
          duration: duration
        })
      } else if (type === 'error') {
        vm.$notify.error({
          title: language('login.js.error'),
          message: message,
          duration: duration
        })
      }
    },
    templetPostTask (param) {
      console.log(JSON.stringify(param))
    },
    showTemplate () {
      let vm = this
      this.messageStatus = 2
      vm.$refs.Template.load(vm.datas)
    },
    // 返回后台的数据
    submitRes () {
      const vm = this
      let res = {
        taskid: vm.projectId,
        templet: vm.templet,
        wholeQues: vm.wholeQues,
        itemQues: vm.itemQues
      }
      return res
    },
    // 提交
    submitForm (forward) {
      let vm = this
      console.log(vm.wholeQues)
      console.log(vm.itemQues)
      let xsrftoken = $('meta[name=_xsrf]').attr('content')
      axios
        .post(
          '/api/push-project-business/group',
          vm.submitRes(),
          {
            headers: {
              'X-Xsrftoken': xsrftoken
            }
          }
        )
        .then(function (response) {
          let rsp = response.data
          if (rsp.code === 0) {
            vm.notify('success', language('pushTask.js.successNote'), 2000)
            // 延时500ms跳转
            if (forward) {
              util.Redirect(
                '/push-project-qcprice/group/' + vm.projectId,
                1000
              )
            }
          } else {
            vm.notify('error', rsp.message, 2000)
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    // 控制浮层关闭
    close () {
      this.messageStatus = 1
    },
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
    // 删除选项
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
    // 删除类型
    delQuestion (arr, index) {
      arr.splice(index, 1)
    },
    goBack () {
      util.Redirect('/push-project-profile/group/' + this.projectId, 1000)
    }
  }
}
</script>

<style>
.push-task {
  background-color: #f0f2f5;
}
body {
  padding-top: 56px;
}
.message2 {
  background: #fff;
  position: fixed;
  top: 3rem;
  left: 4rem;
  right: 4rem;
  bottom: 5rem;
  min-width: 320px;
  z-index: 1050;
  overflow: hidden;
  border-radius: 0.5rem 0 0 0.5rem;
  box-shadow: 0 2px 52px 0 rgba(0, 0, 0, 0.5);
  border: 1px solid #ebeef5;
}
.message2 > i {
  position: absolute;
  cursor: pointer;
  font-size: 24px;
  right: 0.8rem;
  top: 0.8rem;
  color: #d1d4dc;
  z-index: 1050;
}
/*滚动条样式*/
.message2::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 6px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 4px;
}
.message2::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 5px;
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: rgba(0, 0, 0, 0.2);
}
.message2::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 0;
  background: rgba(0, 0, 0, 0.1);
}
.speake-box {
  position: fixed;
  right: 2rem;
  bottom: 2rem;
  z-index: 1051;
}
.q-content{
  border: 1px solid #dcdfe6;
  box-sizing: border-box;
  padding: 10px 30px;
  margin-bottom: 12px;
}
.q-content:hover .q-group-btn{
  visibility: visible;
}
.choice-box{
  display:inline-block;
}
.choice{
  width: 550px;
  min-height: 30px;
  line-height: 30px;
  vertical-align: middle;
}
.choice:hover {
  box-shadow: 0 0 3px #409EFF
}
.q-group-btn{
  margin-top: 10px;
  visibility:hidden;
  display: flex;
  justify-content: space-between;
}
</style>
