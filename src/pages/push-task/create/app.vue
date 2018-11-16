<template>
  <div id="main" class="main push-task">
    <Header/>
    <Layout :selStep="0" :active="0" :type="1" :show="false" style="flex: 1">
      <el-tabs v-model="activeName" @tab-click="handleClick" type="card">
        <el-tab-pane v-for="(item, index) in taskArr" :key="index" :label="item.taskName" :name="item.dataType">
          <div class="item-box" v-for="info in item.info" :key="info.task">
            <div class="item-info">
              <i :class="info.icon"></i>
              <h2>{{info.task}}</h2>
              <p>{{info.taskNote}}</p>
            </div>
            <div class="item-btn">
              <el-button
                type="primary"
                @click="showTemplate(info.task,info.image)">
                {{$t("selectProjectType.taskImg")}}
              </el-button><br/>
              <el-button
                type="danger"
                @click="createFirst(info.task, info.sopType, item.dataType, info.thePageCfg)"
                style="margin-top:10px;">
                {{$t("selectProjectType.creatBtn")}}
              </el-button>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane :label="$t('selectProjectType.video')" name="vedio">
          <div class="item-box">
            <div class="item-info">
              <i class="fa fa-arrows-alt"></i>
              <h2>视频抠图</h2>
              <p>视频抠图</p>
            </div>
            <div class="item-btn">
              <el-button
                type="primary"
                @click="showTemplate('视频抠图','/static/img/voideMatting.png')">
                {{$t("selectProjectType.taskImg")}}
              </el-button><br/>
              <!-- <el-button type="danger" @click="createFirst('视频抠图', 2002, 'text')" style="margin-top:10px;">{{$t("selectProjectType.creatBtn")}}</el-button> -->
              <el-button
                type="danger"
                @click="developing('视频抠图')"
                style="margin-top:10px;">
                {{$t("selectProjectType.creatBtn")}}
              </el-button>
            </div>
          </div>
          <div class="item-box">
            <div class="item-info">
              <i class="fa fa-crosshairs"></i>
              <h2>视频目标跟踪</h2>
              <p>视频目标跟踪</p>
            </div>
            <div class="item-btn">
              <el-button
                type="primary"
                @click="showTemplate('视频目标跟踪','/static/img/voideMatting.png')">
                {{$t("selectProjectType.taskImg")}}
              </el-button><br/>
              <!-- <el-button type="danger" @click="createFirst('视频目标跟踪', 2002, 'text')" style="margin-top:10px;">{{$t("selectProjectType.creatBtn")}}</el-button> -->
              <el-button
                type="danger"
                @click="developing('视频目标跟踪')"
                style="margin-top:10px;">
                {{$t("selectProjectType.creatBtn")}}
              </el-button>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </Layout>
    <el-dialog :title="taskTitle" :visible.sync="dialogFormVisible" custom-class="creat-task-name">
      <el-form :model="form" :rules="rules" ref="form">
        <el-form-item :label="$t('selectProjectType.js.please')" prop="name">
          <el-input v-model="form.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item prop="agree">
            <el-checkbox v-model="form.agree">{{$t("register.agree")}}</el-checkbox>
            <a href="/agreement/requester" style="color:#0000ff">{{$t("register.agreement")}}</a>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelOperation">{{$t("selectProjectType.js.cancel")}}</el-button>
        <el-button type="primary" @click="createSecond('form')">{{$t("selectProjectType.js.true")}}</el-button>
      </div>
    </el-dialog>
    <Footer/>
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
import axios from 'axios'
import Header from 'components/header'
import Footer from 'components/footer'
import Layout from '../components/layoutPage'
import Sendmail from 'components/private/sendmail'
import $ from 'jquery'
import * as util from 'assets/js/util.js'
import {language} from 'lang'
import pageCfg from './initPageCfg'

export default {
  name: 'app',
  components: {
    Header,
    Footer,
    Layout,
    Sendmail
  },
  data () {
    let validateAgree = (rule, value, callback) => {
      if (value !== true) {
        callback(new Error(language('validator.agree.rule1')))
      } else {
        callback()
      }
    }
    return {
      taskArr: [
        // 语音任务
        {
          taskName: language('selectProjectType.voice'),
          dataType: 'wav',
          info: [{
            icon: 'fa fa-cut',
            task: language('selectProjectType.voiceCut'),
            taskNote: language('selectProjectType.voiceCutNote'),
            image: '/static/img/voiceCut.png',
            sopType: 0,
            thePageCfg: ''
          }, {
            icon: 'fa fa-tags',
            task: language('selectProjectType.voiceTags'),
            taskNote: language('selectProjectType.voiceTagsNote'),
            image: '/static/img/voiceTag.png',
            sopType: 1,
            thePageCfg: ''
          }, {
            icon: 'fa fa-audio-description',
            task: language('selectProjectType.voiceEdit'),
            taskNote: language('selectProjectType.voiceEditNote'),
            image: '/static/img/voiceWrite.png',
            sopType: 3,
            thePageCfg: ''
          }]
        },
        // 图片任务
        {
          taskName: language('selectProjectType.image'),
          dataType: 'image',
          info: [{
            icon: 'fa fa-photo',
            task: language('selectProjectType.imageWhole'),
            taskNote: language('selectProjectType.imageWholeNote'),
            image: '/static/img/picRead.png',
            sopType: 1001,
            thePageCfg: ''
          }, {
            icon: 'fa fa-object-ungroup',
            task: language('selectProjectType.imageRule'),
            taskNote: language('selectProjectType.imageRuleNote'),
            image: '/static/img/rulePicTag.png',
            sopType: 1002,
            thePageCfg: ''
          }, {
            icon: 'fa fa-map',
            task: language('selectProjectType.imageIrregular'),
            taskNote: language('selectProjectType.imageIrregularNote'),
            image: '/static/img/IrregularPicTag.png',
            sopType: 1003,
            thePageCfg: ''
          }, {
            icon: 'fa fa-object-group',
            task: language('selectProjectType.imageSimpleRect'),
            taskNote: language('selectProjectType.imageSimpleRectNote'),
            image: '/static/img/imageSimpleRect.png',
            sopType: 1005,
            thePageCfg: ''
          }]
        },
        // 文本任务
        {
          taskName: language('selectProjectType.text'),
          dataType: 'text',
          info: [{
            icon: 'fa fa-pencil-square-o',
            task: language('selectProjectType.textTranslate'),
            taskNote: language('selectProjectType.textTranslateNote'),
            image: '/static/img/textWrite.png',
            sopType: 2001,
            thePageCfg: pageCfg.TextTrans
          }, {
            icon: 'fa fa-comments-o',
            task: language('selectProjectType.textCouplet'),
            taskNote: language('selectProjectType.textCoupletNote'),
            image: '/static/img/textTalk.png',
            sopType: 2001,
            thePageCfg: pageCfg.TextDialog
          }, {
            icon: 'fa fa-hashtag',
            task: language('selectProjectType.textTags'),
            taskNote: language('selectProjectType.textTagsNote'),
            image: '/static/img/textTag.png',
            sopType: 2001,
            thePageCfg: pageCfg.TextSplite
          }, {
            icon: 'fa fa-bookmark',
            task: language('selectProjectType.textAnalysis'),
            taskNote: language('selectProjectType.textAnalysisNote'),
            image: '/static/img/textAnalysis.png',
            sopType: 2001,
            thePageCfg: ''
          }]
        },
        // 采集任务
        {
          taskName: '采集任务',
          dataType: 'collect',
          info: [{
            icon: 'fa fa-upload',
            task: '采集任务',
            taskNote: '可采集图片、音频、视频等类型数据',
            image: '/static/img/collect.jpg',
            sopType: 5004,
            thePageCfg: ''
          }]
        },
        // 组图任务
        {
          taskName: '组任务',
          dataType: 'group',
          info: [{
            icon: 'fa fa-upload',
            task: '组图任务',
            taskNote: '同时对一组图任务进行打标签',
            image: '/static/img/collect.jpg',
            sopType: 6001,
            thePageCfg: ''
          }]
        }
      ],
      dialogFormVisible: false,
      speakeStatus: false, // 控制定制界面
      // project_types: [],
      activeName: 'wav',
      pageCfg: pageCfg,
      form: {
        name: '',
        agree: ''
      },
      rules: {
        name: [
          { required: true, type: 'string', pattern: /^[\u4E00-\u9FA5A-Za-z0-9_]+$/, message: language('selectProjectType.js.validator'), trigger: 'blur' }
        ],
        agree: [
          {required: true, type: 'boolean', message: language('validator.agree.rule1'), trigger: 'change'},
          {validator: validateAgree, trigger: 'change'}
        ]
      },
      taskTitle: '',
      sopType: 0,
      dataType: '',
      thePageCfg: ''
    }
  },
  mounted: function () {
    this.$nextTick(function () {
      // this.getProjectTypes()
    })
  },
  methods: {
    createFirst (task, sopType, dataType, thePageCfg) {
      const vm = this
      vm.taskTitle = language('selectProjectType.js.creating') + task
      vm.sopType = sopType
      vm.dataType = dataType
      vm.thePageCfg = thePageCfg
      vm.dialogFormVisible = true
      console.log(vm.thePageCfg)
    },
    createSecond (form) {
      let vm = this
      this.$refs[form].validate((valid) => {
        // 表单验证
        if (valid) {
          vm.taskPost(vm.sopType, vm.dataType, vm.thePageCfg)
        }
      })
    },
    taskPost (sopType, dataType, thePageCfg) {
      let vm = this
      let xsrftoken = $('meta[name=_xsrf]').attr('content')
      let postForm = {
        taskname: vm.form.name,
        sopType: sopType,
        agree: vm.form.agree
      }
      if (thePageCfg && thePageCfg !== '') {
        postForm.pageCfg = thePageCfg
      }
      axios.post('/api/create-task',
        postForm,
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
              message: language('selectProjectType.js.successNote'),
              duration: 2000
            })
            vm.form = {
              name: '',
              agree: ''
            }
            vm.dialogFormVisible = false
            // 延时500ms跳转
            util.Redirect('/push-project-profile/' + dataType + '/' + rsp.taskid, 1000)
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
    },
    cancelOperation () {
      const vm = this
      vm.taskTitle = ''
      vm.sopType = 0
      vm.dataType = ''
      vm.thePageCfg = ''
      vm.form = {
        name: '',
        agree: ''
      }
      vm.dialogFormVisible = false
    },
    handleClick (tab, event) {
    },
    developing (task) {
      this.$alert(language('selectProjectType.js.contact'), '' + task + language('selectProjectType.js.developing'), {
        dangerouslyUseHTMLString: true,
        callback: action => {

        }
      })
    },
    // createTask (task, dataType, pageCfg) {
    //   let vm = this
    //   this.$prompt(language('selectProjectType.js.please'), language('selectProjectType.js.creating') + task + '', {
    //     confirmButtonText: language('selectProjectType.js.true'),
    //     cancelButtonText: language('selectProjectType.js.cancel'),
    //     inputPattern: /^[\u4E00-\u9FA5A-Za-z0-9_]+$/,
    //     inputErrorMessage: language('selectProjectType.js.validator')
    //   })
    //     .then(({ value }) => {
    //       let xsrftoken = $('meta[name=_xsrf]').attr('content')

    //       axios.post('/api/create-task',
    //         {
    //           taskname: value,
    //           taskType: task,
    //           pageCfg: pageCfg
    //         },
    //         {
    //           headers: {
    //             'X-Xsrftoken': xsrftoken
    //           }
    //         }
    //       )
    //         .then(function (response) {
    //           let rsp = response.data
    //           if (rsp.code === 0) {
    //             vm.$notify.success({
    //               title: language('pushTask.js.success'),
    //               message: language('selectProjectType.js.successNote'),
    //               duration: 2000
    //             })

    //             // 延时500ms跳转
    //             util.Redirect('/push-project-business/' + dataType + '/' + rsp.taskid, 1000)
    //           } else {
    //             vm.$notify.error({
    //               title: language('pushTask.js.error'),
    //               message: rsp.message,
    //               duration: 2000
    //             })
    //           }
    //         })
    //         .catch(function (error) {
    //           console.log(error)
    //         })
    //     })
    //     .catch(() => {
    //       this.$message({
    //         type: 'info',
    //         message: language('selectProjectType.js.cancelNote')
    //       })
    //     })
    // },
    showTemplate (task, url) {
      this.$alert("<div><img src='" + url + "' alt=\"task-img\"></div>", '' + task + language('selectProjectType.js.template'), {
        dangerouslyUseHTMLString: true,
        confirmButtonText: language('selectProjectType.js.true'),
        customClass: 'tool'
      })
    },
    getProjectTypes () {
      let vm = this
      axios
        .get('/api/project-type-selector')
        .then(function (response) {
          let rsp = response.data
          vm.project_types = rsp
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    hidePanel () {
      this.speakeStatus = false
    }
  }
}
</script>

<style>
.push-task {
  background-color: #f0f2f5;
}
/* footer 固定在页面底部 */
/* html,
body,
#main {
  height: 100%;
}
body,
#main {
  display: flex;
  flex-direction: column;
} */
body {
  padding-top: 56px;
}
/* .container {
  flex: 1 0 auto;
}
.navbar{
  flex-direction: row;
}
.project {
  border-radius: 5px;
  background-color: #fff;
  box-shadow: 0 1px 2px hsla(165, 9%, 74%, 0.95);
  margin-bottom: 20px;
  padding: 30px 50px;
  position: relative;
  min-height: 400px;
} */
.item-box {
  margin-top: 20px;
  margin-right: 0.5%;
  margin-left: 0.5%;
  margin-bottom: 15px;
  position: relative;
  min-height: 225px;
  min-width: 290px;
  width: 48%;
  display: inline-block;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 4px 0 rgba(204, 204, 204, 0.35);
  box-sizing: border-box;
}
.item-info {
  position: absolute;
  text-align: center;
  padding: 30px 20px 10px;
  width: 100%;
  box-sizing: border-box;
}
.item-info i {
  font-size: 70px;
  color: #409eff;
}
.item-info h2 {
  font-size: 20px;
  color: #333;
  font-weight: normal;
  padding-top: 18px;
  padding-bottom: 15px;
}
.item-info p {
  font-size: 14px;
  color: #999;
  line-height: 1.25;
}
.item-btn {
  position: absolute;
  opacity: 0;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0px rgba(96, 98, 102, 0.8);
  background-color: rgba(96, 98, 102, 0.8);
  width: 100%;
  height: 100%;
  cursor: pointer;
  transition: all ease-in-out 0.3s 0.05s;
  display: -moz-box;
  -moz-box-pack: center;
  -moz-box-align: center;
  display: -webkit-box;
  -webkit-box-pack: center;
  -webkit-box-align: center;
  display: box;
  box-pack: center;
  box-align: center;
}
.item-box:hover .item-btn {
  opacity: 1;
  transition: all ease-in-out 0.3s 0.05s;
}
/* .time-axis {
  margin-top: 50px;
  margin-bottom: 50px;
}
@media screen and (min-width: 1360px) {
  .time-axis {
    margin-left: 135px;
    margin-right: 135px;
  }
} */
.tool{
  width: 50%;
}
.tool img{
  width: 100%;
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
.creat-task-name {
  width: 445px;
}
.creat-task-name .el-dialog__body {
  padding:0 20px;
}
@media screen and (max-width: 500px) {
  .creat-task-name {
    width: 95%;
  }
}
</style>
