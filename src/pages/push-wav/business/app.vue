<template>
  <div id="main">
    <Header/>
    <div class="time-axis">
      <el-steps align-center :active="1" >
        <el-step :title="$t('pushTask.creat')" ></el-step>
        <el-step :title="$t('pushTask.business')" ></el-step>
        <el-step :title="$t('pushTask.baseinfo')" ></el-step>
        <el-step :title="$t('pushTask.qcprice')" ></el-step>
        <el-step :title="$t('pushTask.sample')" ></el-step>
        <el-step :title="$t('pushTask.tutorial')" ></el-step>
      </el-steps>
    </div>
    <div class="container content">
      <el-form :model="paramForm" :rules="rules" ref="paramForm" label-width="110px" class="demo-paramForm">
        <el-row :gutter="20" >
          <el-col class="task">
            <div class="taskInfo">
              <div class="taskTit">
                <h3>{{$t("pushWav.business.template")}}</h3>
              </div>
              <div class="taskInfos" style="position: relative;">
                <el-tooltip placement="right" class="tag-help" v-if="bsnStatus != 3">
                  <div v-html="helpinfo.labelHelpInfo" slot="content"></div>
                  <i class="el-icon-question forHelp"></i>
                </el-tooltip>
                <el-tabs type="card" class="add" v-model="activeName" @tab-click="handleClick" v-if="bsnStatus === 1">
                  <el-tab-pane :label="$t('pushWav.business.labelDesign')" name="first" >
                    <div v-if="tagMutexLabels.length > 0">
                      <p>{{$t("pushWav.business.radio")}}</p>
                      <div class="q-content" v-for="(items, index) in tagMutexLabels" :key="items.title + index">
                        <span>Q{{index + 1}}</span>
                        <div class="choice-box">
                          <div contenteditable="true" class="choice" @blur="titleChange(index, $event.target.innerText, tagMutexLabels)">{{items.title}}</div>
                        </div>
                        <div v-for="(item, num) in items.labels" :key="item + num">
                          <span class="el-radio__inner"></span>
                          <div class="choice-box">
                            <div contenteditable="true"
                              class="choice choice-have-content"
                              @blur="choiceChange(index, num, $event.target.innerText, tagMutexLabels, 'name')">{{item.name}}</div>
                            <div contenteditable="true"
                              class="choice choice-have-content"
                              @blur="choiceChange(index, num, $event.target.innerText, tagMutexLabels)">{{item.content}}</div>
                          </div>
                          <el-button type="primary" icon="el-icon-delete" size="mini" @click="delChoice(tagMutexLabels, index, num)"></el-button>
                        </div>
                        <div class="q-group-btn">
                          <el-button icon="el-icon-plus" size="small" @click="addChoice(tagMutexLabels, index)"></el-button>
                          <el-button icon="el-icon-delete" size="small" @click="delQuestion(tagMutexLabels, index)"></el-button>
                        </div>
                      </div>
                    </div>
                    <el-button type="primary" plain icon="el-icon-plus" @click="addQuestion(tagMutexLabels)">{{$t("pushWav.business.radio")}}</el-button>
                    <div v-if="tagNormalLabels.length > 0">
                      <p>{{$t("pushWav.business.checkbox")}}</p>
                      <div class="q-content" v-for="(items, index) in tagNormalLabels" :key="items.title + index">
                        <div class="choice-box">
                          <div contenteditable="true"
                            class="choice"
                            @blur="titleChange(index, $event.target.innerText, tagNormalLabels)">{{items.title}}</div></div>
                        <div v-for="(item, num) in items.labels" :key="item + num">
                          <span class="el-checkbox__inner"></span>
                          <div class="choice-box">
                            <div contenteditable="true"
                              class="choice choice-have-content"
                              @blur="choiceChange(index, num, $event.target.innerText, tagNormalLabels, 'name')">{{item.name}}</div>
                            <div contenteditable="true"
                              class="choice choice-have-content"
                              @blur="choiceChange(index, num, $event.target.innerText, tagNormalLabels)">{{item.content}}</div>
                          </div>
                          <el-button type="primary" icon="el-icon-delete" size="mini" @click="delChoice(tagNormalLabels, index, num)"></el-button>
                        </div>
                        <div class="q-group-btn">
                          <el-button icon="el-icon-plus" size="small" @click="addChoice(tagNormalLabels, index)"></el-button>
                          <el-button icon="el-icon-delete" size="small" @click="delQuestion(tagNormalLabels, index)"></el-button>
                        </div>
                      </div>
                    </div>
                    <el-button type="primary" plain
                      icon="el-icon-plus"
                      @click="addQuestion(tagNormalLabels)"
                      v-if="tagNormalLabels.length < 1">{{$t("pushWav.business.checkbox")}}</el-button>
                  </el-tab-pane>
                  <el-button type="text" v-on:click="showTemplate()" icon="el-icon-view">{{$t("pushWav.business.show1")}}</el-button>
                </el-tabs>
                <div v-if="bsnStatus === 2">
                  <el-tabs type="card" v-model="activeName" @tab-click="handleClick" >
                    <el-tab-pane :label="$t('pushWav.business.labelTag')" name="first" class="add">
                      <div v-if="tagMutexLabels.length > 0">
                        <p>{{$t("pushWav.business.radio")}}</p>
                        <div class="q-content" v-for="(items, index) in tagMutexLabels" :key="items.title + index">
                          <span>Q{{index + 1}}</span>
                          <div class="choice-box">
                            <div contenteditable="true"
                              class="choice"
                              @blur="titleChange(index, $event.target.innerText, tagMutexLabels)">{{items.title}}</div>
                          </div>
                          <div v-for="(item, num) in items.labels" :key="item + num">
                            <span class="el-radio__inner"></span>
                            <div class="choice-box">
                              <div contenteditable="true"
                                class="choice choice-have-content"
                                @blur="choiceChange(index, num, $event.target.innerText, tagMutexLabels, 'name')">{{item.name}}</div>
                              <div contenteditable="true"
                                class="choice choice-have-content"
                                @blur="choiceChange(index, num, $event.target.innerText, tagMutexLabels)">{{item.content}}</div>
                            </div>
                            <el-button type="primary" icon="el-icon-delete" size="mini" @click="delChoice(tagMutexLabels, index, num)"></el-button>
                          </div>
                          <div class="q-group-btn">
                            <el-button icon="el-icon-plus" size="small" @click="addChoice(tagMutexLabels, index)"></el-button>
                            <el-button icon="el-icon-delete" size="small" @click="delQuestion(tagMutexLabels, index)"></el-button>
                          </div>
                        </div>
                      </div>
                      <el-button type="primary" plain icon="el-icon-plus" @click="addQuestion(tagMutexLabels)">{{$t("pushWav.business.radio")}}</el-button>
                      <div v-if="tagNormalLabels.length > 0">
                        <p>{{$t("pushWav.business.checkbox")}}</p>
                        <div class="q-content" v-for="(items, index) in tagNormalLabels" :key="items.title + index">
                          <div class="choice-box">
                            <div contenteditable="true"
                            class="choice"
                            @blur="titleChange(index, $event.target.innerText, tagNormalLabels)">{{items.title}}</div>
                          </div>
                          <div v-for="(item, num) in items.labels" :key="item + num">
                            <span class="el-checkbox__inner"></span>
                            <div class="choice-box">
                              <div contenteditable="true"
                                class="choice choice-have-content"
                                @blur="choiceChange(index, num, $event.target.innerText, tagNormalLabels, 'name')">{{item.name}}</div>
                              <div contenteditable="true"
                                class="choice choice-have-content"
                                @blur="choiceChange(index, num, $event.target.innerText, tagNormalLabels)">{{item.content}}</div>
                            </div>
                            <el-button type="primary" icon="el-icon-delete" size="mini" @click="delChoice(tagNormalLabels, index, num)"></el-button>
                          </div>
                          <div class="q-group-btn">
                            <el-button icon="el-icon-plus" size="small" @click="addChoice(tagNormalLabels, index)"></el-button>
                            <el-button icon="el-icon-delete" size="small" @click="delQuestion(tagNormalLabels, index)"></el-button>
                          </div>
                        </div>
                      </div>
                      <el-button type="primary" plain
                        icon="el-icon-plus"
                        @click="addQuestion(tagNormalLabels)"
                        v-if="tagNormalLabels.length < 1">
                        {{$t("pushWav.business.checkbox")}}
                      </el-button>
                    </el-tab-pane>
                    <!-- </div> -->
                  <!-- </el-tab-pane> -->
                  </el-tabs>
                  <el-form-item :label="$t('pushWav.business.cut')" prop="cut">
                      <el-radio-group v-model="paramForm.cut">
                        <el-radio :label=1>{{$t("pushWav.business.cut1")}}</el-radio>
                        <el-radio :label=2>{{$t("pushWav.business.cut2")}}</el-radio>
                      </el-radio-group>
                  </el-form-item>
                  <el-form-item :label="$t('pushWav.business.invalid')">
                      <el-input v-model="paramForm.invalid"></el-input>
                  </el-form-item>
                  <el-form-item :label="$t('pushWav.business.special')" prop="special" >
                      <el-input v-model="paramForm.special"></el-input>
                  </el-form-item>
                  <el-button type="text" v-on:click="showTemplate()" icon="el-icon-view">{{$t("pushWav.business.show2")}}</el-button>
                </div>

                <!-- [lmm]隐藏插入标签，暂时只标注标签 -->
                <div v-if="bsnStatus === 3">
                  <el-button type="text" v-on:click="showTemplate()" icon="el-icon-view">{{$t("pushWav.business.show3")}}</el-button>
                </div>
              </div>
              <div class="taskTit">
                <h3>{{$t("pushWav.business.introduce")}}</h3>
              </div>
              <div class="taskInfos">
                <el-form-item :label="$t('pushWav.business.brief')" prop="brief">
                  <el-input type="textarea" :rows="3" v-model="paramForm.brief"></el-input>
                </el-form-item>
                <el-form-item :label="$t('pushWav.business.introduce')" prop="introduce">
                  <el-input type="textarea" :rows="5" v-model="paramForm.introduce"></el-input>
                </el-form-item>
              </div>
              <div class="taskTit">
                <h3>{{$t("pushWav.business.taskDate")}}</h3>
              </div>
              <div class="taskInfos">
                <el-form-item :label="$t('pushWav.business.date')" required prop="date1">
                  <el-date-picker
                    v-model="paramForm.date1"
                    type="daterange"
                    :range-separator="$t('pushWav.business.to')"
                    :start-placeholder="$t('pushWav.business.startDate')"
                    :end-placeholder="$t('pushWav.business.endDate')">
                  </el-date-picker>
                </el-form-item>
              </div>
            </div>
          </el-col>
        </el-row>
        <el-form-item class="task-submit">
          <el-button type="primary" @click="submitForm('paramForm',false)" >{{$t("pushTask.submit")}}</el-button>
          <el-button type="primary" @click="submitForm('paramForm',true)" >{{$t("pushTask.next")}}</el-button>
        </el-form-item>
      </el-form>
      <!-- [zzf]模板放到最后 -->
      <!-- <div class="taskTit">
        <h3>模板</h3>
      </div>
      <div class="taskInfos">
        <el-form-item label="模板选择" prop="templet" >
          <el-radio-group v-model="paramForm.templet">
            <el-radio :label="1">A模板（<a href="http://localhost:8081/taskRelease-2.html" target="_blank">点击查看</a>）</el-radio>
            <el-radio :label="2">B模板（<a href="http://localhost:8081/taskRelease-2.html" target="_blank">点击查看</a>）</el-radio>
          </el-radio-group>
        </el-form-item>
      </div> -->
    </div>
    <Footer/>
    <!-- 语音标注：1 语音转写：2 语音切割：3 默认为2-->
    <Wav001
      ref = "Wav001"
      :messageStatus = "messageStatus"
      :tagMutexLabels = "tagMutexLabels"
      @postTask = "templetPostTask"
      :tagNormalLabels = "tagNormalLabels" />
    <div class="speake-box">
      <div class="speake">{{$t("pushTask.note1")}}<br/>{{$t("pushTask.note2")}}</div>
      <div class="speake-icon">
        <div class="speake-icon-in" @click="speakeStatus = true"><i class="el-icon-service"></i></div>
      </div>
    </div>
    <sendmail @hidePanel = "hidePanel" :speakeStatus="speakeStatus"/>
  </div>

</template>

<script>
import Header from 'components/header'
import Footer from 'components/footer'
import helpinfo from './help-info'
import Wav001 from 'template/wav/Wav001'
import $ from 'jquery'
import axios from 'axios'
import * as util from 'assets/js/util.js'
import Sendmail from 'components/private/sendmail'
import {language} from 'lang'

export default {
  name: 'app',
  components: {
    Header,
    Footer,
    Wav001,
    Sendmail
  },
  mounted: function () {
    // 这里调用waveform-playlist的删除上一条，加载当条的操作
    let vm = this
    this.$nextTick(function () {
      // Code that will run only after the
      // entire view has been rendered
      // get current page project id
      var projectid = document.location.pathname.split('/')[3]
      // var projectid = 'sub361LvNq7001'
      // console.log('projectid:', projectid)
      if (projectid !== '') {
        vm.projectid = projectid
      }
      // 获取基本信息（可能是新建任务后，自动跳转过来，也可能是从控制台跳转过来）
      let xsrftoken = $('meta[name=_xsrf]').attr('content')
      axios.post('/api/get-business-info/wav',
        {
          taskid: vm.projectid
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
            if (rsp.SopType) {
              switch (rsp.SopType) {
                case 0:
                  // 切割
                  vm.bsnStatus = 3
                  break
                case 1:
                  // 标记
                  vm.bsnStatus = 1
                  break
                case 3:
                  // 翻译
                  vm.bsnStatus = 2
                  break
                default:
                  console.log('unknow soptype')
              }
            } else {
              vm.bsnStatus = 3
            }
            vm.changeControllers(vm.bsnStatus)

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

            if (rsp.templet) {
              vm.paramForm.templet = rsp.templet
            }

            if (rsp.special) {
              vm.paramForm.special = rsp.special
            }
            if (rsp.invalid) {
              vm.paramForm.invalid = rsp.invalid
            }
            if (rsp.cut) {
              vm.paramForm.cut = rsp.cut
            }

            if (rsp.pageCfg) {
              if (rsp.pageCfg.wholeCfg) {
                let wholeCfg = rsp.pageCfg.wholeCfg
                if (wholeCfg.tagMutexLabels) {
                  vm.tagMutexLabels = wholeCfg.tagMutexLabels
                }
                if (wholeCfg.tagNormalLabels) {
                  // 目前音频任务只有一个多选题，还不支持多个多选题，因此只存了一个
                  vm.tagNormalLabels = wholeCfg.tagNormalLabels
                }
              }
            }
          } else {
            vm.$notify.error({
              title: '失败',
              message: rsp.message,
              duration: 2000
            })
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      // 获取simplist
    })
  },
  data () {
    return {
      // 与音频组件传值
      loading: false,
      currentTime: '00:00.000',
      projectid: '',
      index: 1,
      helpinfo: helpinfo,
      playlist: '',
      speakeStatus: false,
      sampleVoice: {
        notes: [
          { id: '000', begin: '0.000', end: '3.680' },
          { id: '001', begin: '3.680', end: '15.000' }
        ],
        src: 'https://s302.fanhantech.com/fanhan.mp3'
      },
      storageKey: '',
      //
      activeName: 'first',
      // 添加标签
      tagMutexLabels: [], // 标注标签中的互斥标签
      tagNormalLabels: [], // 标注标签的非互斥标签
      insertMutexLabels: [], // 插入标签中的互斥标签
      insertNormalLabels: [], // 插入标签中的非互斥标签
      // 显示与隐藏的相关状态
      checkStatus: 2,
      messageStatus: 1,
      bsnStatus: 1,
      // 表单验证
      paramForm: {
        brief: '', // 简介
        introduce: '', // 介绍
        date1: [], // 起止时间
        templet: 0,
        businessType: 2, // 音频模板类型（语音标注：1 语音转写：2 语音切割：3）
        cut: 0, // 是否切割
        invalid: '', // 无效音说明
        special: '', // 特殊转写说明
        labels: '',
        checking: 0 // 质检
      },
      rules: {
        brief: [
          { required: true, message: language('pushWav.business.js.rules.brief1'), trigger: 'blur', maxlength: 128 },
          { max: 128, message: language('pushWav.business.js.rules.brief2'), trigger: 'blur' }
        ],
        introduce: [
          { required: true, message: language('pushWav.business.js.rules.introduce1'), trigger: 'blur', maxlength: 1024 },
          { max: 1024, message: language('pushWav.business.js.rules.introduce2'), trigger: 'blur' }
        ],
        date1: [
          { required: true, message: language('pushWav.business.js.rules.date1'), trigger: 'change' }
        ]
        // templet: [
        //   { required: true, message: '请选择模板', trigger: 'change' }
        // ],
        // businessType: [{ required: true, message: "请选择任务类型", trigger: "change" }],
        // cut: [{ required: true, message: "请选择是否切割", trigger: "change" }],
        // special: [{ required: false, message: "请填写特殊转写说明", trigger: "blur" }],
      }
    }
  },
  methods: {
    stringToDate (fDate) {
      var fullDate = fDate.split('-')
      return new Date(fullDate[0], fullDate[1] - 1, fullDate[2], 0, 0, 0)
    },
    showTemplate () {
      this.$refs.Wav001.voiceLoad(
        this.sampleVoice.src,
        this.sampleVoice.notes
      )
      this.messageStatus = 2
    },
    changeControllers (value) {
      this.$refs.Wav001.changeBusinessMode(value)

      if (value === 1) {
        this.sampleVoice.notes = [[], []]
      }

      this.$refs.Wav001.voiceLoad(
        this.sampleVoice.src,
        this.sampleVoice.notes
      )
    },
    handleClick (tab, event) {
      // console.log(tab, event)
    },
    submitForm (formName, forward) {
      console.log(this.tagMutexLabels)
      let vm = this
      this.$refs[formName].validate(valid => {
        if (!valid) {
          return false
        }
        let xsrftoken = $('meta[name=_xsrf]').attr('content')
        axios
          .post(
            '/api/push-project-business/wav',
            {
              taskid: vm.projectid,
              brief: vm.paramForm.brief, // 简介
              introduce: vm.paramForm.introduce, // 介绍
              date: vm.paramForm.date1, // 起止时间
              cut: Number(vm.paramForm.cut), // 是否切割
              invalid: vm.paramForm.invalid, // 无效音说明
              special: vm.paramForm.special, // 特殊转写说明
              wholeCfg: {
                tagMutexLabels: vm.tagMutexLabels,
                tagNormalLabels: vm.tagNormalLabels
              },
              itemcfg: {

              },
              templet: vm.paramForm.templet
              // insertMutexLabels: vm.insertMutexLabels,
              // insertNormalLabels: vm.insertNormalLabels
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
                  '/push-project-baseinfo/wav/' + vm.projectid,
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
    templetPostTask (params) {
      console.log('提交成功')
    },
    hidePanel () {
      this.speakeStatus = false
    },
    addQuestion (arr, name) {
      let thisId = arr.length.toString()
      if (name === 'input') {
        arr.push(language('pushWav.business.js.text'))
      } else {
        arr.push({id: thisId, title: language('pushWav.business.js.title'), labels: [{name: language('pushWav.business.js.label'), content: language('pushWav.business.js.labelContent')}, {name: language('pushWav.business.js.label'), content: language('pushWav.business.js.labelContent')}]})
      }
      console.log(thisId)
      console.log(arr)
    },
    addChoice (arr, index, name) {
      arr[index].labels.push({name: language('pushWav.business.js.label'), content: language('pushWav.business.js.labelContent')})
      console.log(arr)
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
      console.log(arr[index].labels[num])
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
.mar-left-10{
  margin-left: 10px;
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
.infoTit {
  margin: 48px -65px;
  /* text-align: center; */
}
.infoTit h2 {
  font-size: 1.5rem;
  line-height: 2.25rem;
  padding-bottom: 20px;
  padding-top: 20px;
  color: #555;
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
  /*padding-left: 5px;*/
  padding-right: 10px;
}
.taskInfos p {
  color: #ccc;
}
.el-date-editor .el-range-separator {
  width: 8%;
}
.el-tabs__nav-wrap::after {
  background-color: transparent;
}
.el-tabs__content {
  padding-left: 15px;
}
.el-tag + .el-tag {
  margin-top: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
.el-tag {
  background-color: transparent;
  display: inline-block;
  height: auto;
}
.el-tabs.el-tabs--top {
  padding-left: 30px;
  padding-bottom: 1rem;
}
.add.el-tabs.el-tabs--card.el-tabs--top {
  padding-bottom: 60px;
}
.tagGroup {
  margin-top: 10px;
}
.add label > i {
  color: red;
  margin-right: 3px;
}
.text {
  font-size: 14px;
}
.item {
  padding: 18px 0;
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
.message {
  background: #fff;
  position: fixed;
  top: 3rem;
  left: 4rem;
  right: 4rem;
  bottom: 3rem;
  z-index: 1050;
  overflow: auto;
  border-radius: 0.5rem 0 0 0.5rem;
  box-shadow: 0 2px 52px 0 rgba(0, 0, 0, 0.5);
  border: 1px solid #ebeef5;
}
.message .mb-5 {
  padding-top: 2rem;
}
.message i {
  position: absolute;
  cursor: pointer;
  font-size: 24px;
  right: 0.8rem;
  top: 0.8rem;
  color: #d1d4dc;
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
span.annotation-lines {
  width: 100%;
  border: 1px solid #ccc;
}
/*滚动条样式*/
.message::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 6px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 4px;
}
.message::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 5px;
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: rgba(0, 0, 0, 0.2);
}
.message::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 0;
  background: rgba(0, 0, 0, 0.1);
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
.speake {
  padding: 12px 15px;
  position: relative;
  background-color: rgba(0, 0, 0, 0.5);
  display: inline-block;
  color: #fff;
  margin-right: 20px;
  border-radius: 5px;
}
.speake::after {
  position: absolute;
  content: "";
  width: 0;
  height: 0;
  left: 100%;
  top: 25px;
  border-top: 10px solid transparent;
  border-left: 15px solid rgba(0, 0, 0, 0.5);
  border-bottom: 10px solid transparent;
}
.speake-icon {
  display: inline-block;
}
.speake-icon-in {
  width: 60px;
  height: 60px;
  background-color: #d81b1b;
  text-align: center;
  line-height: 60px;
  font-size: 2em;
  border-radius: 30px;
  cursor: pointer;
  color: #fff;
}
.tag-help {
  position: absolute;
  left: 140px;
  top: 10px;
  z-index: 10;
}
.forHelp{
  color: #909399;
  font-size: 22px;
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
.choice-have-content {
  display: inline-block;
  width: 320px;
}
.q-group-btn{
  margin-top: 10px;
  visibility:hidden;
  display: flex;
  justify-content: space-between;
}
</style>
