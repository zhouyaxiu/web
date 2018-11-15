<template>
  <div id="main">
    <Header/>
    <div class="time-axis">
      <el-steps align-center :active="1" >
        <el-step :title="$t('pushTask.creat')" ></el-step>
        <el-step :title="$t('pushTask.business')" ></el-step>
        <el-step title="完成" ></el-step>
      </el-steps>
    </div>
    <div class="container content">
      <el-form :model="paramForm" :rules="rules" ref="paramForm" label-width="110px" class="demo-paramForm">
        <el-row :gutter="20" >
          <el-col class="task">
            <div class="taskInfo">
              <div class="taskTit">
                <h3>{{$t("pushimage.business.wholemap")}}</h3>
              </div>
              <div class="taskInfos">
                <div v-if="wholeQues.length > 0">
                  <div class="q-content" v-for="(items, index) in wholeQues" :key="items.type + '' + index">
                    <p>{{showType(items.type)}}</p>
                    <span>Q{{index + 1}}</span>
                    <div class="choice-box">
                      <div contenteditable="true" class="choice" @blur="titleChange($event.target.innerText, wholeQues[index], 'title')">{{items.title}}</div>
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
              <div class="taskTit">
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
              <div class="taskTit">
                <h3>{{$t("pushimage.business.rectChoice")}}</h3>
              </div>
              <div class="taskInfos">
                <div class="max-width">
                  <el-form-item label="报价(积分)" prop="offer">
                    <el-input type="text" v-model.number="paramForm.offer"></el-input>
                  </el-form-item>
                </div>
                <span class="text-muted" style="font-size: 14px">P：100积分=1元</span>
              </div>
              <div class="taskTit">
                <h3>{{$t("pushimage.business.taskintro")}}</h3>
              </div>
              <div class="taskInfos">
                <el-form-item :label="$t('pushimage.business.taskbref')" prop="brief">
                  <el-input type="textarea" :rows="3" v-model="paramForm.brief"></el-input>
                </el-form-item>
                <el-form-item :label="$t('pushimage.business.taskintro')" prop="introduce">
                  <el-input type="textarea" :rows="5" v-model="paramForm.introduce"></el-input>
                </el-form-item>
              </div>
              <div class="taskTit">
                <h3>{{$t("pushimage.business.tasktime")}}</h3>
              </div>
              <div class="taskInfos">
                <el-form-item :label="$t('pushimage.business.starttime')" required prop="date1">
                  <el-date-picker
                    v-model="paramForm.date1"
                    type="daterange"
                    :range-separator="$t('pushimage.business.to')"
                    :start-placeholder="$t('pushimage.business.startdate')"
                    :end-placeholder="$t('pushimage.business.stopdate')">
                  </el-date-picker>
                </el-form-item>
              </div>
            </div>
          </el-col>
        </el-row>
        <el-form-item class="task-submit">
          <!-- <el-button>取消</el-button> -->
          <el-button type="primary" @click="submitForm('paramForm',false)">{{$t("pushTask.submit")}}</el-button>
          <el-button type="primary" @click="submitForm('paramForm',true)">{{$t("pushTask.next")}}</el-button>
        </el-form-item>
      </el-form>
    </div>
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
      ],
      // 表单验证
      paramForm: {
        offer: '',
        brief: '', // 简介
        introduce: '', // 介绍
        date1: [] // 起止时间
      },
      rules: {
        brief: [
          { required: true, message: language('pushimage.business.js.rules.brief1'), trigger: 'blur' },
          { max: 128, message: language('pushimage.business.js.rules.brief2'), trigger: 'blur' }
        ],
        introduce: [
          { required: true, message: language('pushimage.business.js.rules.introduce1'), trigger: 'blur' },
          { max: 1024, message: language('pushimage.business.js.rules.introduce2'), trigger: 'blur' }
        ],
        date1: [
          { required: true, message: language('pushimage.business.js.rules.date1'), trigger: 'change' }
        ],
        offer: [
          { required: true, message: '报价不能为空' },
          { type: 'number', message: '报价必须为数字值' }
        ]
      }
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
    // projectId = 'subp4rFljel001'
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

          if (rsp.startTime && rsp.endTime) {
            vm.paramForm.date1.splice(0, vm.paramForm.date1.length)
            vm.paramForm.date1.push(vm.stringToDate(rsp.startTime.substring(0, 10)))
            vm.paramForm.date1.push(vm.stringToDate(rsp.endTime.substring(0, 10)))
          }
          if (rsp.Abstract) {
            vm.paramForm.brief = rsp.Abstract
          }
          if (rsp.Description) {
            vm.paramForm.introduce = rsp.Description
          }

          if (rsp.pageCfg) {
            if (rsp.pageCfg.wholeQues) {
              vm.wholeQues = rsp.pageCfg.wholeQues
            }
            if (rsp.pageCfg.itemQues) {
              vm.itemQues = rsp.pageCfg.itemQues
            }
          }
          vm.paramForm.offer = rsp.price
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
    stringToDate (fDate) {
      var fullDate = fDate.split('-')
      return new Date(fullDate[0], fullDate[1] - 1, fullDate[2], 0, 0, 0)
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
        brief: vm.paramForm.brief, // 简介
        introduce: vm.paramForm.introduce, // 介绍
        date: vm.paramForm.date1, // 起止时间
        price: vm.paramForm.offer,
        templet: vm.templet,
        wholeQues: vm.wholeQues,
        itemQues: vm.itemQues
      }
      return res
    },
    // 提交
    submitForm (formName, forward) {
      let vm = this
      console.log(vm.wholeQues)
      console.log(vm.itemQues)
      this.$refs[formName].validate(valid => {
        if (!valid) {
          return false
        }
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
                  '/workbench#/publish',
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
      })
    },
    // 控制浮层关闭
    close () {
      this.messageStatus = 1
    },
    hidePanel () {
      this.speakeStatus = false
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
    }
  }
}
</script>

<style>
/* footer 固定在页面底部 */
html,
body,
#main {
  height: 100%;
}
body,
#main {
  display: flex;
  flex-direction: column;
}
body {
  background-color: #f0f2f5;
  padding-top: 4.5rem;
}
label {
  color: #606266;
  font-size: 14px;
}
.navbar{
  flex-direction: row;
}
.container {
  flex: 1 0 auto;
  margin-bottom: 50px;
}
.task {
  border-radius: 5px;
  background-color: #fff;
  box-shadow: 0 1px 2px hsla(165, 9%, 74%, 0.95);
  margin-bottom: 20px;
  padding: 30px 10px 60px 10px;
}
.taskInfo {
  padding-left: 50px;
  padding-right: 50px;
}
.taskInfo .taskTit {
  border-bottom: 1px dashed #ccc;
  margin-bottom: 2rem;
}
.taskInfo h3 {
  border-left: 5px solid #5788cd;
  font-size: 1.25rem;
  text-indent: 0.5rem;
  line-height: 1.1rem;
  margin-bottom: 1rem;
  margin-top: 1rem;
}
.taskInfos {
  padding-right: 10px;
}
.taskInfos p {
  color: #777;
  font-weight: bold;
  margin-top: 1rem;
}
.el-date-editor .el-range-separator {
  width: 8%;
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
.task-submit {
  position: relative;
  margin-top: 50px;
}
.task-submit .el-form-item__content {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  margin-left: 0 !important;
}
span.annotation-lines {
  width: 100%;
  border: 1px solid #ccc;
}
.time-axis {
  margin-top: 50px;
  margin-bottom: 50px;
}
@media screen and (min-width: 1360px) {
  .time-axis {
    margin-left: 135px;
    margin-right: 135px;
  }
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
  width: 640px;
  min-height: 30px;
  line-height: 30px;
  vertical-align: middle;
}
.q-group-btn{
  margin-top: 10px;
  visibility:hidden;
  display: flex;
  justify-content: space-between;
}
.max-width {
  max-width: 400px;
}
.g-tag-describe {
  display: flex;
  align-items: center;
  margin: 10px 0;
}
.g-tag-describe .choice{
  margin: 0 10px;
  /* width: 590px; */
}
@media screen and (max-width: 1000px) {
  .g-tag-describe .choice{
    width: 300px;
  }
}
@media screen and (max-width: 769px) {
  .g-tag-describe .choice{
    width: 120px;
  }
}
.collect-show-audio {
  height: 100px;
  display: flex;
  align-items: center;
}
.collect-show {
  width: 300px;
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
.g-formelement-top {
  margin-top: 1rem;
}
</style>
