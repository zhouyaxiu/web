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
                <div v-if="wholeRadios.length > 0">
                  <p>{{$t("pushimage.business.singlechoice")}}</p>
                  <div class="q-content" v-for="(items, index) in wholeRadios" :key="items.title + index">
                    <span>Q{{index + 1}}</span><div class="choice-box"><div contenteditable="true" class="choice" @blur="titleChange(index, $event.target.innerText, wholeRadios)">{{items.title}}</div></div>
                    <div v-for="(item, num) in items.labels" :key="item + num">
                      <span class="el-radio__inner"></span>
                      <div class="choice-box">
                        <div contenteditable="true" class="choice" @blur="choiceChange(index, num, $event.target.innerText, wholeRadios, 'name')">{{item.name}}</div>
                      </div>
                      <el-button type="primary" icon="el-icon-delete" size="mini" @click="delChoice(wholeRadios, index, num)"></el-button>
                    </div>
                    <div class="q-group-btn">
                      <el-button icon="el-icon-plus" size="small" @click="addChoice(wholeRadios, index)"></el-button>
                      <el-button icon="el-icon-delete" size="small" @click="delQuestion(wholeRadios, index)"></el-button>
                    </div>
                  </div>
                </div>
                <el-button type="primary" plain icon="el-icon-plus" @click="addQuestion(wholeRadios)">{{$t("pushimage.business.singlechoice")}}</el-button>
                <div v-if="wholeCheckBoxs.length > 0">
                  <p>{{$t("pushimage.business.multiplechoice")}}</p>
                  <div class="q-content" v-for="(items, index) in wholeCheckBoxs" :key="items.title + index">
                    <span>Q{{index + 1}}</span><div class="choice-box"><div contenteditable="true" class="choice" @blur="titleChange(index, $event.target.innerText, wholeCheckBoxs)">{{items.title}}</div></div>
                    <div v-for="(item, num) in items.labels" :key="item + num">
                      <span class="el-checkbox__inner"></span>
                      <div class="choice-box">
                        <div contenteditable="true" class="choice" @blur="choiceChange(index, num, $event.target.innerText, wholeCheckBoxs, 'name')">{{item.name}}</div>
                      </div>
                      <el-button type="primary" icon="el-icon-delete" size="mini" @click="delChoice(wholeCheckBoxs, index, num)"></el-button>
                    </div>
                    <div class="q-group-btn">
                      <el-button icon="el-icon-plus" size="small" @click="addChoice(wholeCheckBoxs, index)"></el-button>
                      <el-button icon="el-icon-delete" size="small" @click="delQuestion(wholeCheckBoxs, index)"></el-button>
                    </div>
                  </div>
                </div>
                <el-button type="primary" plain icon="el-icon-plus" @click="addQuestion(wholeCheckBoxs)">{{$t("pushimage.business.multiplechoice")}}</el-button>
                <div v-if="wholeInputs.length > 0">
                  <p>{{$t("pushimage.business.fillblank")}}</p>
                  <div class="q-content" v-for="(items, index) in wholeInputs" :key="items + index">
                    <span>Q{{index + 1}}</span><div class="choice-box"><div contenteditable="true" class="choice" @blur="titleChange(index, $event.target.innerText, wholeInputs, 'input')">{{items}}</div></div>
                    <el-input :placeholder="$t('pushimage.business.entercontent')"></el-input>
                    <div class="q-group-btn">
                      <el-button icon="el-icon-delete" size="small" @click="delQuestion(wholeInputs, index)"></el-button>
                    </div>
                  </div>
                </div>
                <el-button type="primary" plain icon="el-icon-plus" @click="addQuestion(wholeInputs, 'input')">{{$t("pushimage.business.fillblank")}}</el-button>
              </div>
              <div class="taskTit">
                <h3>{{$t("pushimage.business.labelproblem")}}</h3>
              </div>
              <div class="taskInfos">
                <div v-if="itemRadios.length > 0">
                  <p>{{$t("pushimage.business.singlechoice")}}</p>
                  <div class="q-content" v-for="(items, index) in itemRadios" :key="items.title + index">
                    <span>Q{{index + 1}}</span><div class="choice-box"><div contenteditable="true" class="choice" @blur="titleChange(index, $event.target.innerText, itemRadios)">{{items.title}}</div></div>
                    <div v-for="(item, num) in items.labels" :key="item + num">
                      <span class="el-radio__inner"></span>
                      <div class="choice-box">
                        <div contenteditable="true" class="choice" @blur="choiceChange(index, num, $event.target.innerText, itemRadios, 'name')">{{item.name}}</div>
                      </div>
                      <el-button type="primary" icon="el-icon-delete" size="mini" @click="delChoice(itemRadios, index, num)"></el-button>
                    </div>
                    <div class="q-group-btn">
                      <el-button icon="el-icon-plus" size="small" @click="addChoice(itemRadios, index)"></el-button>
                      <el-button icon="el-icon-delete" size="small" @click="delQuestion(itemRadios, index)"></el-button>
                    </div>
                  </div>
                </div>
                <el-button type="primary" plain icon="el-icon-plus" @click="addQuestion(itemRadios)">{{$t("pushimage.business.singlechoice")}}</el-button>
                <div v-if="itemCheckBoxs.length > 0">
                  <p>{{$t("pushimage.business.multiplechoice")}}</p>
                  <div class="q-content" v-for="(items, index) in itemCheckBoxs" :key="items.title + index">
                    <span>Q{{index + 1}}</span><div class="choice-box"><div contenteditable="true" class="choice" @blur="titleChange(index, $event.target.innerText, itemCheckBoxs)">{{items.title}}</div></div>
                    <div v-for="(item, num) in items.labels" :key="item + num">
                      <span class="el-checkbox__inner"></span>
                      <div class="choice-box">
                        <div contenteditable="true" class="choice" @blur="choiceChange(index, num, $event.target.innerText, itemCheckBoxs, 'name')">{{item.name}}</div>
                      </div>
                      <el-button type="primary" icon="el-icon-delete" size="mini" @click="delChoice(itemCheckBoxs, index, num)"></el-button>
                    </div>
                    <div class="q-group-btn">
                      <el-button icon="el-icon-plus" size="small" @click="addChoice(itemCheckBoxs, index)"></el-button>
                      <el-button icon="el-icon-delete" size="small" @click="delQuestion(itemCheckBoxs, index)"></el-button>
                    </div>
                  </div>
                </div>
                <el-button type="primary" plain icon="el-icon-plus" @click="addQuestion(itemCheckBoxs)">{{$t("pushimage.business.multiplechoice")}}</el-button>
                <div v-if="itemInputs.length > 0">
                  <p>{{$t("pushimage.business.fillblank")}}</p>
                  <div class="q-content" v-for="(items, index) in itemInputs" :key="items + index">
                    <span>Q{{index + 1}}</span><div class="choice-box"><div contenteditable="true" class="choice" @blur="titleChange(index, $event.target.innerText, itemInputs, 'input')">{{items}}</div></div>
                    <el-input :placeholder="$t('pushimage.business.entercontent')"></el-input>
                    <div class="q-group-btn">
                      <el-button icon="el-icon-delete" size="small" @click="delQuestion(itemInputs, index)"></el-button>
                    </div>
                  </div>
                </div>
                <el-button type="primary" plain icon="el-icon-plus" @click="addQuestion(itemInputs, 'input')">{{$t("pushimage.business.fillblank")}}</el-button>
              </div>
              <div class="taskTit">
                <h3>数据类型</h3>
              </div>
              <div class="taskInfos">
                <div v-if="data.length > 0">
                  <div class="q-content" v-for="(items, index) in data" :key="items.type + index">
                    <p>{{items.type === 1 ? '图片' : (items.type === 2 ? '音频' : '视频')}}</p>
                    <span>Q{{index + 1}}</span><div class="choice-box"><div contenteditable="true" class="choice" @blur="nameChange(index, $event.target.innerText, data)">{{items.name}}</div></div>
                    <div style="display: flex;">
                      <div>
                        <div class="collect-show" v-if="items.type === 1 && items.sample">
                          <img :src="items.sample" style="width: 100%;">
                        </div>
                        <div class="collect-show-audio" v-if="items.type === 2 && items.sample">
                          <audio :src="items.sample" controls="controls"></audio>
                        </div>
                        <div class="collect-show" v-if="items.type === 3 && items.sample">
                          <video preload="auto" controls="controls" :src="items.sample" style="width: 100%;"></video>
                        </div>
                      </div>
                    </div>
                    <el-progress :percentage="progressPush[index]" style="max-width: 325px;" v-show = "progressPush[index] > 0"></el-progress>
                    <span class="btn btn-primary btn-sm fileinput-button g-formelement-top">
                      <span>如有样例，请上传</span>
                      <input type="file"
                        :accept="upLoadFile(items.type)"
                        :id="'select-file'+index"
                        @change="(value) => addFile(value, index)">
                    </span>
                    <div class="q-group-btn">
                      <el-button icon="el-icon-delete" size="small" @click="delQuestion(data, index)"></el-button>
                    </div>
                  </div>
                </div>
                <el-button type="primary" icon="el-icon-picture-outline" plain @click="addCollect({type:1})">图片+1</el-button>
                <el-button type="primary" icon="el-icon-service" plain @click="addCollect({type:2})">音频+1</el-button>
                <el-button type="primary" icon="el-icon-view" plain @click="addCollect({type:3})">视频+1</el-button>
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
          <el-button type="primary" @click="submitForm('paramForm',false)" >{{$t("pushTask.submit")}}</el-button>
          <el-button type="primary" @click="submitForm('paramForm',true)" >{{$t("pushTask.next")}}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <Footer/>
    <transition name="el-fade-in">
      <div class="message2" v-show="messageStatus === 2" style="overflow: auto;">
        <i class="el-icon-error" v-on:click="close()"></i>
        <collect :wholeRadios="wholeRadios"
          :wholeCheckBoxs="wholeCheckBoxs"
          :wholeInputs="wholeInputs"
          :itemRadios="itemRadios"
          :itemCheckBoxs="itemCheckBoxs"
          :itemInputs="itemInputs"
          :data="data"
          :projectId="projectId"
          @postTask="templetPostTask"
        >
        </collect>
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
import Collect from 'template/collect/collect'
import * as qiniu from 'qiniu-js'

// var tmpurl
// let str = window.location.search
// tmpurl = str.split('=')[1]

export default {
  name: 'app',
  components: {
    Header,
    Footer,
    Collect
  },
  data () {
    return {
      projectId: '',
      templet: 2,
      messageStatus: 1,
      speakeStatus: false,
      wholeRadios: [], // 整图单选题
      wholeCheckBoxs: [], // 整图多选题
      wholeInputs: [], // 整图填空题
      itemRadios: [], // 标注项单选题
      itemCheckBoxs: [], // 标注项多选题
      itemInputs: [], // 标注项填空题
      progressPush: [],
      data: [
        // {
        //   type: 1, // 1 代表图片，2.代表音频 3.代表视频
        //   name: '大笑',
        //   sample: 'https://s301.fanhantech.com/NN3yBPNa001/7jzc2L9Q8Eb4k9bHWjqJYsZqe6DXUkkU.jpg'
        // },
        // {
        //   type: 2, // 1 代表图片，2.代表音频 3.代表视频
        //   name: '大笑',
        //   sample: 'https://s301.fanhantech.com/lingopioneer001/eIroQcFVM5Nhnp7feBbvvfFxFmc5OIvt.wav'
        // },
        // {
        //   type: 3, // 1 代表图片，2.代表音频 3.代表视频
        //   name: '大笑',
        //   sample: 'https://s301.fanhantech.com/lXHrao41001/QNfyOmU6ySUx9sHw1dKzCP8237WtrtTy.mp4'
        // }
      ],
      SopType: 5001,
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
    * 控制上传类型
    * fileType为传入的数据类型（1为图片2为音频3为视频）
    */
    upLoadFile () {
      return (fileType) => fileType === 1 ? 'image/*' : (fileType === 2 ? 'audio/*' : (fileType === 3 ? 'video/*' : ''))
    }
  },
  mounted: function () {
    let vm = this
    let projectId = document.location.pathname.split('/')[3]
    // projectId = 'subVVOzI32Q001'
    console.log('projectId:', projectId)
    if (projectId !== '') {
      vm.projectId = projectId
    }
    this.$nextTick(function () {
      // 获取基本信息（可能是新建任务后，自动跳转过来，也可能是从控制台跳转过来）
      let xsrftoken = $('meta[name=_xsrf]').attr('content')
      axios.post('/api/get-business-info/collect',
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
            switch (vm.SopType) {
              case 5001:
              case 5002:
              case 5003:
              case 5004:
                vm.templet = 1
                break
              default:
                console.log('SopType err')
                vm.error('SopType err')
            }
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
            if (rsp.pageCfg.wholeCfg) {
              let wholeCfg = rsp.pageCfg.wholeCfg
              if (wholeCfg.tagMutexLabels) {
                vm.wholeRadios = wholeCfg.tagMutexLabels
              }
              if (wholeCfg.tagNormalLabels) {
                vm.wholeCheckBoxs = wholeCfg.tagNormalLabels
              }
              if (wholeCfg.TextInputs) {
                vm.wholeInputs = wholeCfg.TextInputs
              }
            }
            if (rsp.pageCfg.itemCfg) {
              let itemCfg = rsp.pageCfg.itemCfg
              if (itemCfg) {
                if (itemCfg.tagMutexLabels) {
                  vm.itemRadios = itemCfg.tagMutexLabels
                }
                if (itemCfg.tagNormalLabels) {
                  vm.itemCheckBoxs = itemCfg.tagNormalLabels
                }
                if (itemCfg.TextInputs) {
                  vm.itemInputs = itemCfg.TextInputs
                }
              }
            }
            if (rsp.pageCfg.data) {
              vm.data = rsp.pageCfg.data
              // console.log(vm.data)
            }
            // if (rsp.pageCfg.templet) {
            //   vm.templet = rsp.pageCfg.templet
            // }
            // console.log(vm.templet)
          }
          vm.paramForm.offer = rsp.price
        } else {
          vm.$notify.error({
            title: language('pushTask.js.error'),
            message: rsp.message,
            duration: 2000
          })
        }
      })
        .catch(function (error) {
          console.log(error)
        })
    })
  },
  methods: {
    getUploadToken (file) {
      let vm = this
      let xsrftoken = $('meta[name=_xsrf]').attr('content')
      let token = ''
      let key = ''
      let url = ''
      // 同步请求，	获取上传的token

      $.ajax({
        url: '/api/get-collect-token/collect',
        type: 'POST', // GET
        async: false, // 或false,是否异步
        data: {
          filename: file.name,
          filesize: file.size,
          taskid: vm.projectId
        },
        transformRequest: [function (data) {
          // Do whatever you want to transform the data
          let ret = ''
          for (let it in data) {
            ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
          }
          return ret
        }],
        timeout: 5000, // 超时时间
        dataType: 'json', // 返回的数据格式：
        beforeSend: function (xhr) {},
        success: function (data, textStatus, jqXHR) {
          let rsp = data
          if (rsp.code === 0) {
            token = rsp.token
            key = rsp.key
            url = rsp.url
          } else {
            vm.$notify.error({
              title: language('pushimage.sample.js.error.type1'),
              message: rsp.message,
              duration: 2000
            })
          }
        },
        error: function (xhr, textStatus) {
          console.log('error')
          vm.$notify.error({
            title: language('collectWav.js.error.type1'),
            message: '',
            duration: 2000
          })
        },
        complete: function () {
          console.log('complete')
        },
        headers: {
          'X-Xsrftoken': xsrftoken
        }
      })
      return [token, key, url]
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
          // console.log('next', res)
          // vm.progressPush[index] = res.total.percent
          // vm.$forceUpdate()
          vm.$set(vm.progressPush, index, ~~res.total.percent)
          // console.log(vm.progressPush[index])
        },
        error (err) {
          vm.$set(vm.progressPush, index, 0)
          console.log('error', err)
        },
        complete (res) {
          // vm.progressPush[index] = 100
          console.log('complete', res)
          console.log(vm.data[index])
          vm.data[index].sample = url
          vm.$set(vm.progressPush, index, 100)
          // vm.$forceUpdate()
          console.log(vm.data[index])
        }
      }
      vm.subscription = observable.subscribe(observer)
    },
    error (msg) {
      let vm = this
      vm.$notify.error({
        title: '失败',
        message: msg,
        duration: 2000
      })
    },
    templetPostTask (param) {
      console.log(JSON.stringify(param))
    },
    stringToDate (fDate) {
      var fullDate = fDate.split('-')
      return new Date(fullDate[0], fullDate[1] - 1, fullDate[2], 0, 0, 0)
    },
    showTemplate () {
      this.messageStatus = 2
      this.$nextTick(function () {
        // this.$refs.Template.imageload('https://s302.fanhantech.com/samplefiledir/L7wPToxfGNRo7G56tHzcXXtYvDGAzhlt.jpg')
        // this.$refs.Template.imageload('../../../../static/test/' + tmpurl)
      })
    },
    submitForm (formName, forward) {
      let vm = this
      let wholeMutex = vm.wholeRadios
      let wholeNormal = vm.wholeCheckBoxs
      let itemMutex = vm.itemRadios
      let itemNormal = vm.itemCheckBoxs

      this.$refs[formName].validate(valid => {
        if (!valid) {
          return false
        }
        let xsrftoken = $('meta[name=_xsrf]').attr('content')
        axios
          .post(
            '/api/push-project-business/collect',
            {
              taskid: vm.projectId,
              brief: vm.paramForm.brief, // 简介
              introduce: vm.paramForm.introduce, // 介绍
              date: vm.paramForm.date1, // 起止时间
              price: vm.paramForm.offer,
              templet: vm.templet,
              wholeCfg: {
                tagMutexLabels: wholeMutex,
                tagNormalLabels: wholeNormal,
                TextInputs: vm.wholeInputs
              },
              itemCfg: {
                tagMutexLabels: itemMutex,
                tagNormalLabels: itemNormal,
                TextInputs: vm.itemInputs
              },
              data: vm.data
            },
            {
              headers: {
                'X-Xsrftoken': xsrftoken
              }
            }
          )
          .then(function (response) {
            let rsp = response.data
            if (rsp.code === 0) {
              vm.$notify.success({
                title: language('pushTask.js.success'),
                message: language('pushTask.js.successNote'),
                duration: 2000
              })
              // 延时500ms跳转
              if (forward) {
                util.Redirect(
                  '/workbench#/publish',
                  1000
                )
              }
            } else {
              vm.$notify.error({
                title: language('pushTask.js.error'),
                message: rsp.message,
                duration: 2000
              })
            }
          })
          .catch(function (error) {
            console.log(error)
          })
      })
    },
    close () {
      this.messageStatus = 1
    },
    hidePanel () {
      this.speakeStatus = false
    },
    addQuestion (arr, name) {
      let thisId = arr.length.toString()
      if (name === 'input') {
        arr.push(language('pushimage.business.js.text'))
      } else {
        arr.push({id: thisId, title: language('pushimage.business.js.title'), labels: [{name: language('pushimage.business.js.label'), content: language('pushimage.business.js.labelContent')}, {name: language('pushimage.business.js.label'), content: language('pushimage.business.js.labelContent')}]})
      }
      // console.log(thisId)
      // console.log(arr)
    },
    addChoice (arr, index, name) {
      arr[index].labels.push({name: language('pushimage.business.js.label'), content: language('pushimage.business.js.labelContent')})
      // console.log(arr)
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
      // console.log(arr[index].labels[num])
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
    },
    delColorItem (arr, index, num) {
      arr[index].labels.splice(num, 1)
    },
    addColorItem (arr, index, name) {
      arr[index].labels.push({name: language('pushimage.business.js.label'), content: '#ff0000'})
    },
    addCollect ({type = 1, name = '数据描述'} = {}) {
      const vm = this
      const data = vm.data
      data.push({
        type: type, // 1 代表图片，2.代表音频 3.代表视频
        name: name,
        sample: '',
        itemRadioContents: [],
        itemCheckBoxContents: [[]],
        itemInputContents: []
      })
    },
    nameChange (index, text, arr) {
      arr[index].name = text
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
