<template>
  <div id="main">
    <Header/>
    <div class="time-axis">
      <el-steps align-center :active="0" >
        <el-step :title="$t('pushTask.creat')" ></el-step>
        <el-step :title="$t('pushTask.business')" ></el-step>
        <el-step :title="$t('pushTask.baseinfo')" ></el-step>
        <el-step :title="$t('pushTask.qcprice')" ></el-step>
        <el-step :title="$t('pushTask.sample')" ></el-step>
        <el-step :title="$t('pushTask.tutorial')" ></el-step>
      </el-steps>
    </div>
    <div class="container content">
      <div class="project">
         <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane :label="$t('selectProjectType.voice')" name="first">
            <div class="item-box">
              <div class="item-info">
                <i class="fa fa-cut"></i>
                <h2>{{$t("selectProjectType.voiceCut")}}</h2>
                <p>{{$t("selectProjectType.voiceCutNote")}}</p>
              </div>
              <div class="item-btn">
                <el-button type="primary" @click="showTemplate($t('selectProjectType.voiceCut'),'/static/img/voiceCut.png')">{{$t("selectProjectType.taskImg")}}</el-button><br/>
                <el-button type="danger" @click="createFirst($t('selectProjectType.voiceCut'), 0, 'wav')" style="margin-top:10px;">{{$t("selectProjectType.creatBtn")}}</el-button>
              </div>
            </div>
            <div class="item-box">
              <div class="item-info">
                <i class="fa fa-tags"></i>
                <h2>{{$t("selectProjectType.voiceTags")}}</h2>
                <p>{{$t("selectProjectType.voiceTagsNote")}}</p>
              </div>
              <div class="item-btn">
                <el-button type="primary" @click="showTemplate($t('selectProjectType.voiceTags'),'/static/img/voiceTag.png')">{{$t("selectProjectType.taskImg")}}</el-button><br/>
                <el-button type="danger" @click="createFirst($t('selectProjectType.voiceTags'), 1, 'wav')" style="margin-top:10px;">{{$t("selectProjectType.creatBtn")}}</el-button>
              </div>
            </div>
            <div class="item-box">
              <div class="item-info">
                <i class="fa fa-audio-description"></i>
                <h2>{{$t("selectProjectType.voiceEdit")}}</h2>
                <p>{{$t("selectProjectType.voiceEditNote")}}</p>
              </div>
              <div class="item-btn">
                <el-button type="primary" @click="showTemplate($t('selectProjectType.voiceEdit'),'/static/img/voiceWrite.png')">{{$t("selectProjectType.taskImg")}}</el-button><br/>
                <el-button type="danger" @click="createFirst($t('selectProjectType.voiceEdit'), 3, 'wav')" style="margin-top:10px;">{{$t("selectProjectType.creatBtn")}}</el-button>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane :label="$t('selectProjectType.image')" name="second">
            <div class="item-box">
              <div class="item-info">
                <i class="fa fa-photo"></i>
                <h2>{{$t("selectProjectType.imageWhole")}}</h2>
                <p>{{$t("selectProjectType.imageWholeNote")}}</p>
              </div>
              <div class="item-btn">
                <el-button type="primary" @click="showTemplate($t('selectProjectType.imageWhole'),'/static/img/picRead.png')">{{$t("selectProjectType.taskImg")}}</el-button><br/>
                <el-button type="danger" @click="createFirst($t('selectProjectType.imageWhole'), 1001, 'image')" style="margin-top:10px;">{{$t("selectProjectType.creatBtn")}}</el-button>
                <!-- <el-button type="danger" @click="developing($t('selectProjectType.imageWhole'))" style="margin-top:10px;">{{$t("selectProjectType.creatBtn")}}</el-button> -->
              </div>
            </div>
            <div class="item-box">
              <div class="item-info">
                <i class="fa fa-object-ungroup"></i>
                <h2>{{$t("selectProjectType.imageRule")}}</h2>
                <p>{{$t("selectProjectType.imageRuleNote")}}</p>
              </div>
              <div class="item-btn">
                <el-button type="primary" @click="showTemplate($t('selectProjectType.imageRule'),'/static/img/rulePicTag.png')">{{$t("selectProjectType.taskImg")}}</el-button><br/>
                <el-button type="danger" @click="createFirst($t('selectProjectType.imageRule'),1002, 'image')" style="margin-top:10px;">{{$t("selectProjectType.creatBtn")}}</el-button>
                <!-- <el-button type="danger" @click="developing($t('selectProjectType.imageRule'))" style="margin-top:10px;">{{$t("selectProjectType.creatBtn")}}</el-button> -->
              </div>
            </div>
            <div class="item-box">
              <div class="item-info">
                <i class="fa fa-map"></i>
                <h2>{{$t("selectProjectType.imageIrregular")}}</h2>
                <p>{{$t("selectProjectType.imageIrregularNote")}}</p>
              </div>
              <div class="item-btn">
                <el-button type="primary" @click="showTemplate($t('selectProjectType.imageIrregular'),'/static/img/IrregularPicTag.png')">{{$t("selectProjectType.taskImg")}}</el-button><br/>
                <el-button type="danger" @click="createFirst($t('selectProjectType.imageIrregular'),1003, 'image')" style="margin-top:10px;">{{$t("selectProjectType.creatBtn")}}</el-button>
                <!-- <el-button type="danger" @click="developing($t('selectProjectType.imageIrregular'))" style="margin-top:10px;">{{$t("selectProjectType.creatBtn")}}</el-button> -->
              </div>
            </div>
            <div class="item-box">
              <div class="item-info">
                <i class="fa fa-object-group"></i>
                <h2>{{$t("selectProjectType.imageSimpleRect")}}</h2>
                <p>{{$t("selectProjectType.imageSimpleRectNote")}}</p>
              </div>
              <div class="item-btn">
                <el-button type="primary" @click="showTemplate($t('selectProjectType.imageSimpleRect'),'/static/img/imageSimpleRect.png')">{{$t("selectProjectType.taskImg")}}</el-button><br/>
                <el-button type="danger" @click="createFirst($t('selectProjectType.imageSimpleRect'),1005, 'image')" style="margin-top:10px;">{{$t("selectProjectType.creatBtn")}}</el-button>
                <!-- <el-button type="danger" @click="developing($t('selectProjectType.imageIrregular'))" style="margin-top:10px;">{{$t("selectProjectType.creatBtn")}}</el-button> -->
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane :label="$t('selectProjectType.text')" name="third">
            <div class="item-box">
              <div class="item-info">
                <i class="fa fa-pencil-square-o"></i>
                <h2>{{$t("selectProjectType.textTranslate")}}</h2>
                <p>{{$t("selectProjectType.textTranslateNote")}}</p>
              </div>
              <div class="item-btn">
                <el-button type="primary" @click="showTemplate($t('selectProjectType.textTranslate'),'/static/img/textWrite.png')">{{$t("selectProjectType.taskImg")}}</el-button><br/>
                <el-button type="danger" @click="createFirst($t('selectProjectType.textTranslate'), 2001, 'text', pageCfg.TextTrans)" style="margin-top:10px;">{{$t("selectProjectType.creatBtn")}}</el-button>
                <!-- <el-button type="danger" @click="developing($t('selectProjectType.textTranslate'))" style="margin-top:10px;">{{$t("selectProjectType.creatBtn")}}</el-button> -->
              </div>
            </div>
            <div class="item-box">
              <div class="item-info">
                <i class="fa fa-comments-o"></i>
                <h2>{{$t("selectProjectType.textCouplet")}}</h2>
                <p>{{$t("selectProjectType.textCoupletNote")}}</p>
              </div>
              <div class="item-btn">
                <el-button type="primary" @click="showTemplate($t('selectProjectType.textCouplet'),'/static/img/textTalk.png')">{{$t("selectProjectType.taskImg")}}</el-button><br/>
                <el-button type="danger" @click="createFirst($t('selectProjectType.textCouplet'), 2001, 'text', pageCfg.TextDialog)" style="margin-top:10px;">{{$t("selectProjectType.creatBtn")}}</el-button>
                <!-- <el-button type="danger" @click="developing($t('selectProjectType.textCouplet'))" style="margin-top:10px;">{{$t("selectProjectType.creatBtn")}}</el-button> -->
              </div>
            </div>
            <div class="item-box">
              <div class="item-info">
                <i class="fa fa-hashtag"></i>
                <h2>{{$t("selectProjectType.textTags")}}</h2>
                <p>{{$t("selectProjectType.textTagsNote")}}</p>
              </div>
              <div class="item-btn">
                <el-button type="primary" @click="showTemplate($t('selectProjectType.textTags'), '/static/img/textTag.png')">{{$t("selectProjectType.taskImg")}}</el-button><br/>
                <el-button type="danger" @click="createFirst($t('selectProjectType.textTags'), 2001, 'text', pageCfg.TextSplite)" style="margin-top:10px;">{{$t("selectProjectType.creatBtn")}}</el-button>
                <!-- <el-button type="danger" @click="developing($t('selectProjectType.textTags'))" style="margin-top:10px;">{{$t("selectProjectType.creatBtn")}}</el-button> -->
              </div>
            </div>
            <div class="item-box">
              <div class="item-info">
                <i class="fa fa-bookmark"></i>
                <h2>{{$t("selectProjectType.textAnalysis")}}</h2>
                <p>{{$t("selectProjectType.textAnalysisNote")}}</p>
              </div>
              <div class="item-btn">
                <el-button type="primary" @click="showTemplate($t('selectProjectType.textAnalysis'),'/static/img/textAnalysis.png')">{{$t("selectProjectType.taskImg")}}</el-button><br/>
                <el-button type="danger" @click="createFirst($t('selectProjectType.textAnalysis'), 2002, 'text')" style="margin-top:10px;">{{$t("selectProjectType.creatBtn")}}</el-button>
                <!-- <el-button type="danger" @click="developing($t('selectProjectType.textAnalysis'))" style="margin-top:10px;">{{$t("selectProjectType.creatBtn")}}</el-button> -->
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane :label="$t('selectProjectType.video')" name="fourth">
            <div class="item-box">
              <div class="item-info">
                <i class="fa fa-arrows-alt"></i>
                <h2>视频抠图</h2>
                <p>视频抠图</p>
              </div>
              <div class="item-btn">
                <el-button type="primary" @click="showTemplate('视频抠图','/static/img/voideMatting.png')">{{$t("selectProjectType.taskImg")}}</el-button><br/>
                <!-- <el-button type="danger" @click="createFirst('视频抠图', 2002, 'text')" style="margin-top:10px;">{{$t("selectProjectType.creatBtn")}}</el-button> -->
                <el-button type="danger" @click="developing('视频抠图')" style="margin-top:10px;">{{$t("selectProjectType.creatBtn")}}</el-button>
              </div>
            </div>
            <div class="item-box">
              <div class="item-info">
                <i class="fa fa-crosshairs"></i>
                <h2>视频目标跟踪</h2>
                <p>视频目标跟踪</p>
              </div>
              <div class="item-btn">
                <el-button type="primary" @click="showTemplate('视频目标跟踪','/static/img/voideMatting.png')">{{$t("selectProjectType.taskImg")}}</el-button><br/>
                <!-- <el-button type="danger" @click="createFirst('视频目标跟踪', 2002, 'text')" style="margin-top:10px;">{{$t("selectProjectType.creatBtn")}}</el-button> -->
                <el-button type="danger" @click="developing('视频目标跟踪')" style="margin-top:10px;">{{$t("selectProjectType.creatBtn")}}</el-button>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="采集任务" name="Fifth">
            <div class="item-box">
              <div class="item-info">
                <i class="fa fa-upload"></i>
                <h2>采集任务</h2>
                <p>可采集图片、音频、视频等类型数据</p>
              </div>
              <div class="item-btn">
                <el-button type="primary" @click="showTemplate('采集任务','/static/img/collect.jpg')">{{$t("selectProjectType.taskImg")}}</el-button><br/>
                <el-button type="danger" @click="createFirst('采集任务', 5004, 'collect')" style="margin-top:10px;">{{$t("selectProjectType.creatBtn")}}</el-button>
                <!-- <el-button type="danger" @click="developing('采集任务')" style="margin-top:10px;">{{$t("selectProjectType.creatBtn")}}</el-button> -->
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="组任务" name="Sixth">
            <div class="item-box">
              <div class="item-info">
                <i class="fa fa-upload"></i>
                <h2>组图任务</h2>
                <p>同时对一组图任务进行打标签</p>
              </div>
              <div class="item-btn">
                <el-button type="primary" @click="showTemplate('组图','/static/img/collect.jpg')">{{$t("selectProjectType.taskImg")}}</el-button><br/>
                <el-button type="danger" @click="createFirst('组图任务', 6001, 'group')" style="margin-top:10px;">{{$t("selectProjectType.creatBtn")}}</el-button>
                <!-- <el-button type="danger" @click="developing('采集任务')" style="margin-top:10px;">{{$t("selectProjectType.creatBtn")}}</el-button> -->
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
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
      dialogFormVisible: false,
      speakeStatus: false, // 控制定制界面
      // project_types: [],
      activeName: 'first',
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
      axios.post('/api/create-task',
        {
          taskname: vm.form.name,
          sopType: sopType,
          pageCfg: thePageCfg,
          agree: vm.form.agree
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
.container {
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
}
.item-box {
  margin-top: 20px;
  margin-right: 0.5%;
  margin-left: 0.5%;
  margin-bottom: 15px;
  position: relative;
  min-height: 225px;
  min-width: 290px;
  width: 32%;
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
