  <template>
   <div id="main">
    <Header/>
     <div class="time-axis">
      <el-steps align-center :active="4" >
        <el-step :title="$t('pushTask.creat')" ></el-step>
        <el-step :title="$t('pushTask.business')" ></el-step>
        <el-step :title="$t('pushTask.baseinfo')" ></el-step>
        <el-step :title="$t('pushTask.qcprice')" ></el-step>
        <el-step :title="$t('pushTask.sample')" ></el-step>
        <el-step :title="$t('pushTask.tutorial')" ></el-step>
      </el-steps>
     </div>
     <div class="message" v-show="addExampleStatus === true">
      <div class="uploadPage selExmPage">
       <i class="el-icon-error" v-on:click="addExampleStatus=false"></i>
       <el-form :model="addExampleForm" :rules="rules" ref="addExampleForm" label-width="80px">
        <el-form-item :label="$t('pushWav.sample.name')" prop="name">
         <el-input v-model="addExampleForm.name"></el-input>
        </el-form-item>
        <el-form-item :label="$t('pushWav.sample.describe')" prop="describe">
         <el-input type="textarea" v-model="addExampleForm.describe"></el-input>
        </el-form-item>
        <el-form-item :label="$t('pushWav.sample.selectExample')" prop="selectExample">
         <el-select v-model="addExampleForm.selectExample" :placeholder="$t('pushWav.sample.selectExampleNote')">
          <el-option v-for="(item,index) in sampleFileList" :key="index" :label="item.fileName" :value="item.raw">
          </el-option>
         </el-select>
         <el-button type="success" plain="" @click="uploadPageStatus=true">
           {{$t("pushWav.sample.choiceVoice")}}
         </el-button>
        </el-form-item>
        <!-- <el-form-item label="样例类型" prop="exampleType">
					<el-select v-model="addExampleForm.exampleType" placeholder="请选择样例类型">
					<el-option label="正确样例" value="trueExample"></el-option>
					<el-option label="错误样例" value="falseExample"></el-option>
					</el-select>
				</el-form-item> -->
        <div class="uploadSubmit">
         <el-button type="primary" @click="AddSampleItem('addExampleForm')">
          {{$t("pushWav.sample.true")}}
         </el-button>
         <el-button plain="" @click="resetForm('addExampleForm')">
          {{$t("pushWav.sample.cancel")}}
         </el-button>
        </div>
       </el-form>
      </div>
     </div>
     <div class="message" v-show="uploadPageStatus === true">
      <div class="uploadPage">
       <i class="el-icon-error" v-on:click="uploadPageStatus=false"></i>
       <el-form :model="uploadForm">
        <el-table :data="sampleFileList" height="280" style="width: 100%">
         <el-table-column prop="fileName" :label="$t('pushWav.sample.fileName')">
         </el-table-column>
         <el-table-column prop="fileSize" :label="$t('pushWav.sample.fileSize')">
         </el-table-column>
         <el-table-column :label="$t('pushWav.sample.scope')">
          <template slot-scope="scope">
           <el-button size="small" type="danger" plain="" @click.native.prevent="deleteSampleFile(scope.$index)">
            {{$t("pushWav.sample.delete")}}
           </el-button>
          </template>
         </el-table-column>
        </el-table>
        <div slot="tip" class="el-upload__tip">
         {{$t("pushWav.sample.uploadVoiceNote")}}
        </div>
        <div class="uploadSubmit" id="upload">
          <el-upload ref="ElUpload" class="upload-demo" action="https://upload.qiniup.com/"
           :before-upload="handleBeforeUpload"
           :on-preview="handlePreview"
           :on-remove="handleRemove"
           :on-change="handleChange"
           :on-progress="handleProgress"
           :on-success="handleSuccess"
           :on-error="handleError"
           :before-remove="beforeRemove"
           :show-file-list="false"
           :file-list="fileList"
           :data="uploadParam"
           accept="audio/*"
           style="display: inline-block;"
          >
            <el-button type="success">
              {{$t("pushWav.sample.uploadVoice")}}
            </el-button>
          </el-upload>
          <el-button type="primary" v-on:click="uploadPageStatus=false">
            {{$t("pushTask.submit")}}
          </el-button>
        </div>
       </el-form>
      </div>
     </div>
     <div class="message load-icon-box" v-show="progStatus === true">
      <!-- <div class="progressPage">
       <i class="el-icon-loading"></i>
      </div> -->
      <div class="progressPage">
        <el-progress :text-inside="true" :stroke-width="18" :percentage="progress" :status="proStatus"></el-progress>
      </div>
     </div>
     <div class="container content">
      <el-form :model="listForm">
       <div class="contList">
        <el-row type="flex" justify="space-between" class="contListTit">
         <el-col :span="6">
          <h2>{{$t("pushWav.sample.trueExample")}}</h2>
         </el-col>
         <el-col :span="3">
          <el-button type="primary" v-on:click="addExampleStatus=true;addExampleForm.exampleType= 'trueExample';">
           {{$t("pushWav.sample.addExample")}}
          </el-button>
         </el-col>
        </el-row>
        <el-table :data="trueData" stripe="" style="width: 100%">
         <el-table-column prop="name" :label="$t('pushWav.sample.name')">
         </el-table-column>
         <el-table-column prop="describe" :label="$t('pushWav.sample.describe')">
         </el-table-column>
         <el-table-column :label="$t('pushWav.sample.scope')">
          <template slot-scope="scope">
           <el-button type="primary" plain="" @click.native.prevent="handleEdit(scope.$index, scope.row,true)">
            {{scope.row.addStatus}}
           </el-button>
           <el-button type="danger" plain="" @click.native.prevent="deleteSampleItem(scope.$index, trueData)">
            {{$t("pushWav.sample.delete")}}
           </el-button>
          </template>
         </el-table-column>
        </el-table>
       </div>
       <div class="contList">
        <el-row type="flex" justify="space-between" class="contListTit">
         <el-col :span="6">
          <h2>{{$t("pushWav.sample.falseExample")}}</h2>
         </el-col>
         <el-col :span="3">
          <el-button type="primary" v-on:click="addExampleStatus=true;addExampleForm.exampleType= 'falseExample';">
           {{$t("pushWav.sample.addExample")}}
          </el-button>
         </el-col>
        </el-row>
        <el-table :data="errorData" stripe="" style="width: 100%">
         <el-table-column prop="name" :label="$t('pushWav.sample.name')">
         </el-table-column>
         <el-table-column prop="describe" :label="$t('pushWav.sample.describe')">
         </el-table-column>
         <el-table-column :label="$t('pushWav.sample.scope')">
          <template slot-scope="scope">
           <el-button type="primary" plain="" @click.native.prevent="handleEdit(scope.$index, scope.row,false)">
            {{scope.row.addStatus}}
           </el-button>
           <el-button type="danger" plain="" @click.native.prevent="deleteSampleItem(scope.$index, errorData)">
            {{$t("pushWav.sample.delete")}}
           </el-button>
          </template>
         </el-table-column>
        </el-table>
       </div>
       <div class="listSubmit">
        <el-button type="info" @click="goBack()">
          {{$t("pushTask.goback")}}
        </el-button>
        <el-button type="success" @click="forward()">
          {{$t("pushTask.next")}}
        </el-button>
       </div>
      </el-form>
     </div>
     <footer>
      <Wav001 ref="Wav001" :messageStatus="messageStatus" :tagMutexLabels="tagMutexLabels" @postTask="samplePostTask" :tagNormalLabels="tagNormalLabels"/>
     </footer>
   </div>
  </template>

<script>
import Header from 'components/header'
import Footer from 'components/footer'
import $ from 'jquery'
import Wav001 from 'template/wav/Wav001'
import axios from 'axios'
import * as util from 'assets/js/util.js'
import {language} from 'lang'

export default {
  name: 'app',
  components: {
    Header,
    Footer,
    Wav001
  },
  data () {
    return {
      projectid: '',
      playlist: '',
      question: {
        uuid: '',
        index: 0,
        flag: true,
        raw: ''
      },
      exmTextStatus: 0,
      businessType: 2,
      messageStatus: 1,
      tagMutexLabels: [
        // {
        // 	title:'情感经历',
        // 	labels:[{ name: "高兴", content: "高兴" },{ name: "伤心", content: "伤心" }]
        // },{
        // 	title:'动物世界',
        // 	labels:[{ name: "老虎", content: "老虎" },{ name: "猴子", content: "猴子" }]
        // }
      ], // 标注标签中的互斥标签
      tagNormalLabels: [
        // { name: "老虎", content: "老虎" },{ name: "猴子", content: "猴子" }
      ], // 标注标签的非互斥标签
      progStatus: false,
      uploadPageStatus: false,
      addExampleStatus: false,
      uploadForm: {},
      addExampleForm: {
        name: '',
        describe: '',
        selectExample: '',
        exampleType: ''
      },
      listForm: {},
      rules: {
        name: [
          { required: true, message: language('pushWav.sample.js.rules.name1'), trigger: 'blur' },
          { min: 1, max: 10, message: language('pushWav.sample.js.rules.name2'), trigger: 'blur' }
        ],
        selectExample: [
          { required: true, message: language('pushWav.sample.js.rules.selectExample'), trigger: 'change' }
        ]
        // exampleType:  [
        // 	{ required: true, message: '请选择样例类型', trigger: 'change' }
        // ]
      },
      trueData: [
        // {
        //   name: "item.name",
        //   describe: "item.describe",
        //   addStatus: "修改答案",
        //   raw: "https://s301.fanhantech.com/wav1803/00001269_bIdnu3Y7yCcO.wav",
        //   uuid: 111
        // }
      ],
      errorData: [],
      uploadParam: {
        token: ''
      },
      deleteConfirm: false,
      sampleFileList: [
        // {
        //   fileName: "测试号1",
        //   fileSize: "0.5MB",
        //   raw: "https://s301.fanhantech.com/wav1803/00001269_bIdnu3Y7yCcO.wav"
        // },
        // {
        //   fileName: "测试号2",
        //   fileSize: "0.8MB",
        //   raw: "https://s301.fanhantech.com/wav1803/00000649_fmBXi2REVdu7.wav"
        // },
        // {
        //   fileName: "测试号3",
        //   fileSize: "0.39MB",
        //   raw: "https://s301.fanhantech.com/wav1803/00003038_pyH3KFYiJTO2.wav"
        // }
      ],
      exampleTextarea: '' // 样例详细描述
    }
  },
  computed: {
    proStatus () { // 上传状态
      if (this.progress === 100) {
        return 'success'
      } else if (this.progress < 50) {
        return 'exception'
      } else {
        return ''
      }
    }
  },
  mounted: function () {
    let vm = this
    this.$nextTick(function () {
      // Code that will run only after the
      // entire view has been rendered
      // get current page project id
      let projectid = document.location.pathname.split('/')[3]
      // let projectid = 'sub6cYs40Nt001'
      if (projectid !== '') {
        vm.projectid = projectid
      }
      // 多个信息一起获取:filelist\samplelist\tags
      // 获取filelist
      let xsrftoken = $('meta[name=_xsrf]').attr('content')
      axios
        .post(
          '/api/get-sample-info',
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
            for (var index in rsp.filelist) {
              var fSize = (rsp.filelist[index].fileSize /
                (1024 * 1024)
              ).toFixed(2)
              var fileinfo = {
                fileName: rsp.filelist[index].fileName,
                fileSize: fSize + 'MB',
                raw: rsp.filelist[index].raw
              }
              vm.sampleFileList.push(fileinfo)
            }
            console.groupEnd()

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

            for (let x in rsp.rightlist) {
              let item = rsp.rightlist[x]
              let result = ''
              if (item.result) {
                result = item.result
              }

              let exampleData = {
                name: item.name,
                describe: item.describe,
                addStatus: language('pushWav.sample.js.addStatus.type1'),
                raw: item.raw,
                uuid: item.uuid,
                commit: item.commit,
                result: []
              }
              if (result !== '') {
                exampleData.result = JSON.parse(item.result)
              }
              vm.trueData.push(exampleData)
            }

            for (let x in rsp.wronglist) {
              let item = rsp.wronglist[x]
              let result = ''
              if (item.result) {
                result = item.result
              }

              let exampleData = {
                name: item.name,
                describe: item.describe,
                addStatus: language('pushWav.sample.js.addStatus.type1'),
                raw: item.raw,
                uuid: item.uuid,
                commit: item.commit,
                result: []
              }
              if (result !== '') {
                exampleData.result = JSON.parse(item.result)
              }
              vm.errorData.push(exampleData)
            }

            let bsnStatus = 3
            if (rsp.SopType) {
              switch (rsp.SopType) {
                case 0:
                  // 切割
                  bsnStatus = 3
                  break
                case 1:
                  // 标记
                  bsnStatus = 1
                  break
                case 3:
                  // 翻译
                  bsnStatus = 2
                  break
                default:
                  console.log('unknow soptype')
              }
            } else {
              vm.bsnStatus = 3
            }
            vm.changeControllers(bsnStatus)
          } else {
            vm.$notify.error({
              title: language('pushWav.sample.js.error.type1'),
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
    changeControllers (value) {
      this.$refs.Wav001.changeBusinessMode(value)
      this.$refs.Wav001.changeCheckMode(true)
      // this.$refs.Wav001.voiceLoad("");
    },
    deleteSampleFile (index) {
      let vm = this
      let file = vm.sampleFileList[index]

      // 异步确认。。。
      this.$confirm(language('pushWav.sample.js.deleteSampleFile'), language('pushWav.sample.js.error.type2'), {
        confirmButtonText: language('pushWav.sample.js.success.type2'),
        cancelButtonText: language('pushWav.sample.js.error.type3'),
        type: 'warning'
      })
        .then(() => {
          let xsrftoken = $('meta[name=_xsrf]').attr('content')
          vm.$refs.ElUpload.clearFiles() // 自带的file列表清空

          axios
            .post(
              '/api/delete-sample-file',
              {
                filename: file.fileName,
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
                vm.$notify.success({
                  title: language('pushWav.sample.js.success.type1'),
                  message: language('pushWav.sample.js.success.type3'),
                  duration: 2000
                })
                vm.sampleFileList.splice(index, 1)
              } else {
                vm.$notify.error({
                  title: language('pushWav.sample.js.error.type1'),
                  message: rsp.message,
                  duration: 2000
                })
              }
            })
            .catch(function (error) {
              console.log(error)
            })
        })
        .catch(() => {
          console.log(language('pushWav.sample.js.error.type3'))
        })
    },
    goBack () {
      util.Redirect('/push-project-qcprice/wav/' + this.projectid, 1000)
    },
    forward () {
      // util.Redirect('/user/projects#/publish', 1000)
      util.Redirect('/push-project-tutorial/wav/' + this.projectid, 1000)
    },
    // upload methods start  ，
    handleProgress (e, file) {
      this.progStatus = true
      this.progress = Math.floor(e.percent)
    },
    handleChange (file) {
      this.progStatus = false
      if (file.status === 'ready') {
        console.log('ready')
        // 重置progress组件
        this.pass = null
        this.progress = 0
      } else if (file.status === 'fail') {
        this.$message.error(language('pushWav.sample.js.error.type4'))
      }
    },
    handleRemove (file, fileList) {},
    handleError (res) {
      // 上传失败
      let vm = this

      let xsrftoken = $('meta[name=_xsrf]').attr('content')
      axios
        .post(
          '/api/upload-result',
          {
            token: vm.uploadParam.token,
            key: '',
            hash: '',
            taskid: vm.projectid,
            code: 1001
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
          } else {
            vm.$notify.error({
              title: language('pushWav.sample.js.error.type1'),
              message: rsp.message,
              duration: 2000
            })
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      this.pass = false
      vm.$notify.success({
        title: language('pushWav.sample.js.error.type1'),
        message: res.error,
        duration: 2000
      })
    },
    handleSuccess (response, file, fileList) {
      // 上传成功，则先发送状态到服务器，服务器确认状态后，返回，再添加到filelist中
      let vm = this
      var fSize = (file.size / 1024 / 1024).toFixed(2)
      let rsp = response

      let xsrftoken = $('meta[name=_xsrf]').attr('content')
      axios
        .post(
          '/api/upload-result',
          {
            token: vm.uploadParam.token,
            key: rsp.key,
            hash: rsp.hash,
            taskid: vm.projectid,
            code: 0
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
              title: language('pushWav.sample.js.success.type1'),
              message: language('pushWav.sample.js.success.type4'),
              duration: 2000
            })
            var files = {
              fileName: file.name,
              fileSize: fSize + 'MB',
              raw: rsp.src
            }
            vm.sampleFileList.push(files)
            this.pass = true
          } else {
            vm.$notify.error({
              title: language('pushWav.sample.js.error.type1'),
              message: rsp.message,
              duration: 2000
            })
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    handleBeforeUpload (file) {
      // this.uploadParam.fileSize = file.size;
      // this.uploadParam.taskid = this.projectid

      let vm = this
      let xsrftoken = $('meta[name=_xsrf]').attr('content')

      if (vm.sampleFileList.length >= 10) {
        vm.$notify.error({
          title: language('pushWav.sample.js.error.type1'),
          message: language('pushWav.sample.js.error.type5'),
          duration: 2000
        })
        return false
      }

      if (file.size > 50 * 1024 * 1024) {
        vm.$notify.error({
          title: language('pushWav.sample.js.error.type1'),
          message: language('pushWav.sample.js.error.type6'),
          duration: 2000
        })
        return false
      }

      let ret = false
      // 同步请求，	获取上传的token
      $.ajax({
        url: '/api/get-upload-token/wav',
        type: 'POST', // GET
        async: false, // 或false,是否异步
        data: {
          filename: file.name,
          filesize: file.size,
          taskid: vm.projectid
        },
        timeout: 5000, // 超时时间
        dataType: 'json', // 返回的数据格式：
        beforeSend: function (xhr) {},
        success: function (data, textStatus, jqXHR) {
          let rsp = data
          if (rsp.code === 0) {
            vm.uploadParam.token = rsp.token
            ret = true
          } else {
            vm.$notify.error({
              title: language('pushWav.sample.js.error.type1'),
              message: rsp.message,
              duration: 2000
            })
            ret = false
          }
        },
        error: function (xhr, textStatus) {
          ret = false
        },
        complete: function () {},
        headers: {
          'X-Xsrftoken': xsrftoken
        }
      })
      return ret
    },
    handlePreview (file) {
      // console.log(file)
    },
    beforeRemove (file, fileList) {
      // return this.$confirm(`确定移除 ${ file.name }？`);
    },
    handleClick (tab, event) {
      // console.log(tab, event);
    },
    // upload methods end
    deleteSampleItem (index, rows) {
      let vm = this
      this.$confirm(language('pushWav.sample.js.deleteSampleItem'), language('pushWav.sample.js.error.type2'), {
        confirmButtonText: language('pushWav.sample.js.success.type2'),
        cancelButtonText: language('pushWav.sample.js.error.type3'),
        type: 'warning'
      })
        .then(() => {
          let xsrftoken = $('meta[name=_xsrf]').attr('content')
          vm.$refs.ElUpload.clearFiles() // 自带的file列表清空

          axios
            .post(
              '/api/del-task-sample-item',
              {
                taskid: vm.projectid,
                uuid: rows[index].uuid
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
                  title: language('pushWav.sample.js.success.type1'),
                  message: language('pushWav.sample.js.success.type3'),
                  duration: 2000
                })
                rows.splice(index, 1)
              } else {
                vm.$notify.error({
                  title: language('pushWav.sample.js.error.type1'),
                  message: rsp.message,
                  duration: 2000
                })
              }
            })
            .catch(function (error) {
              console.log(error)
            })
        })
        .catch(() => {
          console.log('取消')
        })
    },
    // 提交表单
    AddSampleItem (formName) {
      let vm = this
      this.$refs[formName].validate(valid => {
        if (!valid) {
          return false
        }
        console.group('AddSampleItem')
        let exampleName = this.addExampleForm.name
        let exampleDescribe = this.addExampleForm.describe
        let exampleVoice = this.addExampleForm.selectExample
        let exampleData = {
          name: exampleName,
          describe: exampleDescribe,
          addStatus: language('pushWav.sample.js.addStatus.type2'),
          raw: exampleVoice,
          uuid: '',
          result: []
        }

        // 添加样例
        let flag
        if (this.addExampleForm.exampleType === 'trueExample') {
          flag = true
        } else {
          flag = false
        }

        let xsrftoken = $('meta[name=_xsrf]').attr('content')
        axios
          .post(
            '/api/add-task-sample-item',
            {
              taskid: vm.projectid,
              name: exampleData.name,
              description: exampleData.describe,
              raw: exampleData.raw,
              flag: flag
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
                title: language('pushWav.sample.js.success.type1'),
                message: language('pushWav.sample.js.success.type5'),
                duration: 2000
              })

              exampleData.uuid = rsp.uuid
              if (flag) {
                vm.trueData.push(exampleData)
              } else {
                vm.errorData.push(exampleData)
              }
            } else {
              vm.$notify.error({
                title: language('pushWav.sample.js.error.type1'),
                message: rsp.message,
                duration: 2000
              })
            }
          })
          .catch(function (error) {
            console.log(error)
          })

        this.addExampleStatus = false
        this.addExampleForm.name = ''
        this.addExampleForm.describe = ''
        this.addExampleForm.selectExample = ''
        this.addExampleForm.exampleType = ''
        console.groupEnd()
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
      this.addExampleStatus = false
    },
    handleEdit (index, row, flag) {
      console.log('handleEdit', index, row, flag)
      this.messageStatus = 2
      row.addStatus = language('pushWav.sample.js.addStatus.type1')
      this.question.uuid = row.uuid
      this.question.index = index
      this.question.flag = flag // 正确样例or错误样例
      this.question.raw = row.raw

      // 在这里读详情
      let notes = row.result
      // let src = "https://s301.fanhantech.com/wav1803/00000649_fmBXi2REVdu7.wav";
      let src = row.raw
      let commit = row.commit

      this.$refs.Wav001.voiceLoad(src, notes, commit)
    },
    samplePostTask (params) {
      let vm = this
      let url = '/api/set-task-sample-item/wav'
      let xsrftoken = $('meta[name=_xsrf]').attr('content')
      // post 请求中的url 需要从当前页面的url获取
      axios
        .post(
          url,
          {
            taskid: vm.projectid,
            uuid: vm.question.uuid,
            commit: params.commit,
            raw: vm.question.raw,
            result: JSON.stringify(params.result)
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
              title: language('pushWav.sample.js.success.type1'),
              message: rsp.message,
              duration: 2000
            })
            console.log(vm.question)
            if (vm.question.flag) {
              vm.trueData[vm.question.index].result = params.result
              vm.trueData[vm.question.index].commit = params.commit
            } else {
              vm.errorData[vm.question.index].result = params.result
              vm.errorData[vm.question.index].commit = params.commit
            }
          } else {
            vm.$notify.error({
              title: language('pushWav.sample.js.error.type1'),
              message: rsp.message,
              duration: 2000
            })
          }
        })
        .catch(function (error) {
          console.log(error)
        })
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
  position: relative;
}
.content {
  background-color: #fff;
  padding: 2rem;
  margin-bottom: 1rem;
}
.contList {
  margin-bottom: 4rem;
}
.contListTit {
  padding-top: 2rem;
  padding-bottom: 1.5rem;
}
.contListTit h2 {
  /*text-align: center;*/
  color: #555;
  font-size: 1.6em;
  /*line-height: 2;*/
}
.navbar{
  flex-direction: row;
}
.message {
  background: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1050;
}
.load-icon-box {
  display: flex;
  justify-content: center;
  align-items: center;
}
.uploadPage {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -60%);
  width: 50%;
  height: 400px;
  background-color: #fff;
  border-radius: 1rem;
  padding: 1.5rem 3rem 0.5rem 3rem;
  position: relative;
}
.selExmPage {
  padding: 4.8rem 4.5rem 3rem 3rem;
}
.uploadPage > i {
  position: absolute;
  right: 8px;
  top: 8px;
  font-size: 1.5rem;
  color: #666;
}
.uploadPage i:hover {
  color: #333;
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
  -ms-filter: "alpha(opacity=0)";
}
.uploadSubmit {
  position: absolute;
  bottom: 1.5rem;
  right: 3rem;
}
#upload .btn-info {
  color: #fff;
  background-color: #409eff;
  border-color: #409eff;
  font-size: 0.8rem;
  padding: 9px 15px;
}
#upload .button-success {
  color: #fff;
  background-color: #67c23a;
  border-color: #67c23a;
}
.progressPage {
  /* position: relative; */
  /* font-size: 3rem; */
  /* width: 100%;
  height: 100%; */
  /* color: #fff; */
  width: 200px;
}
.progress {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.listSubmit {
  position: absolute;
  right: 2rem;
  bottom: 3rem;
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
</style>
