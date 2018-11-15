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
        <el-form-item :label="$t('pushimage.sample.name')" prop="name">
         <el-input v-model="addExampleForm.name"></el-input>
        </el-form-item>
        <el-form-item :label="$t('pushimage.sample.describe')" prop="describe">
         <el-input type="textarea" v-model="addExampleForm.describe"></el-input>
        </el-form-item>
        <el-form-item :label="$t('pushimage.sample.exampledata')" prop="selectExample">
         <el-select v-model="addExampleForm.selectExample" :placeholder="$t('pushimage.sample.selectexamdata')">
          <el-option v-for="(item,index) in sampleFileList" :key="index" :label="item.fileName" :value="item.raw">
          </el-option>
         </el-select>
         <el-button type="success" plain="" @click="uploadPageStatus=true">
          {{$t("pushimage.sample.uploadnewfile")}}
         </el-button>
        </el-form-item>
        <div class="uploadSubmit">
         <el-button type="primary" @click="AddSampleItem('addExampleForm')">
          {{$t("pushimage.sample.confirm")}}
         </el-button>
         <el-button plain="" @click="resetForm('addExampleForm')">
          {{$t("pushimage.sample.reset")}}
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
         <el-table-column prop="fileName" :label="$t('pushimage.sample.filename')">
         </el-table-column>
         <el-table-column prop="fileSize" :label="$t('pushimage.sample.filesize')">
         </el-table-column>
         <el-table-column :label="$t('pushimage.sample.operate')">
          <template slot-scope="scope">
           <el-button size="small" type="danger" plain="" @click.native.prevent="deleteSampleFile(scope.$index)">
            {{$t("pushimage.sample.remove")}}
           </el-button>
          </template>
         </el-table-column>
        </el-table>
        <div slot="tip" class="el-upload__tip">
         {{$t("pushimage.sample.lessupload")}}
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
           accept="image/*"
           style="display: inline-block;"
          >
            <el-button type="success">
              {{$t("pushimage.sample.clickupload")}}
            </el-button>
          </el-upload>
          <el-button type="primary" v-on:click="uploadPageStatus=false">
            {{$t("pushimage.sample.save")}}
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
          <h2>{{$t("pushimage.sample.trueexample")}}</h2>
         </el-col>
         <el-col :span="3">
          <el-button type="primary" v-on:click="addExampleStatus=true;addExampleForm.exampleType= 'trueExample';">
           {{$t("pushimage.sample.addexample")}}
          </el-button>
         </el-col>
        </el-row>
        <el-table :data="trueData" stripe="" style="width: 100%">
         <el-table-column prop="name" :label="$t('pushimage.sample.name')">
         </el-table-column>
         <el-table-column prop="describe" :label="$t('pushimage.sample.describe')">
         </el-table-column>
         <el-table-column :label="$t('pushimage.sample.operate')">
          <template slot-scope="scope">
           <el-button type="primary" plain="" @click.native.prevent="handleEdit(scope.$index, scope.row,true)">
            {{scope.row.addStatus}}
           </el-button>
           <el-button type="danger" plain="" @click.native.prevent="deleteSampleItem(scope.$index, trueData)">
            {{$t("pushimage.sample.delete")}}
           </el-button>
          </template>
         </el-table-column>
        </el-table>
       </div>
       <div class="contList">
        <el-row type="flex" justify="space-between" class="contListTit">
         <el-col :span="6">
          <h2>{{$t("pushimage.sample.errorexample")}}</h2>
         </el-col>
         <el-col :span="3">
          <el-button type="primary" v-on:click="addExampleStatus=true;addExampleForm.exampleType= 'falseExample';">
           {{$t("pushimage.sample.addexample")}}
          </el-button>
         </el-col>
        </el-row>
        <el-table :data="errorData" stripe="" style="width: 100%">
         <el-table-column prop="name" :label="$t('pushimage.sample.name')">
         </el-table-column>
         <el-table-column prop="describe" :label="$t('pushimage.sample.describe')">
         </el-table-column>
         <el-table-column :label="$t('pushimage.sample.operate')">
          <template slot-scope="scope">
           <el-button type="primary" plain="" @click.native.prevent="handleEdit(scope.$index, scope.row,false)">
            {{scope.row.addStatus}}
           </el-button>
           <el-button type="danger" plain="" @click.native.prevent="deleteSampleItem(scope.$index, errorData)">
            {{$t("pushimage.sample.delete")}}
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
     </footer>
     <transition name="el-fade-in">
      <div class="message2" v-show="messageStatus === 2">
        <div class="d-flex align-items-center justify-content-between p-3" style="height:56px">
          <div></div>
          <span class="d-flex align-items-center text-dark"><i class="fa fa-desktop fa-2x pr-2"></i>样例填写</span>
          <el-button round @click="close()" size="medium">关闭</el-button>
        </div>
        <Image007 v-if="templet==1" ref="Template"
          :SopType="SopType"
          @postTask="samplePostTask"
          :wholeRadios="wholeRadios"
          :wholeCheckBoxs="wholeCheckBoxs"
          :wholeInputs="wholeInputs"
          :itemRadios="itemRadios"
          :itemCheckBoxs="itemCheckBoxs"
          :itemInputs="itemInputs"
          :rectMinH="rectMinH"
          :rectMinW="rectMinW"
          :rectMinArea="rectMinArea"
          :request="request"
          :vQuesCheck="vQuesCheck"
          :vQuesDo="vQuesDo"
          :vQuesCheckContents="vQuesCheckContents"
        />
        <Image002 v-if="templet==2" ref="Template"
          :CommentVisible="true"
          :SopType="SopType"
          @postTask="samplePostTask"
          :wholeRadios="wholeRadios"
          :wholeCheckBoxs="wholeCheckBoxs"
          :wholeInputs="wholeInputs"
          :itemRadios="itemRadios"
          :rectMinH="rectMinH"
          :rectMinW="rectMinW"
          :rectMinArea="rectMinArea"
        />
      </div>
    </transition>
   </div>
  </template>

<script>
import Header from 'components/header'
import Footer from 'components/footer'
import Image007 from 'template/image/Image007'
import Image002 from 'template/image/Image002'
import $ from 'jquery'
import axios from 'axios'
import * as util from 'assets/js/util.js'
import {language} from 'lang'

export default {
  name: 'app',
  components: {
    Header,
    Footer,
    Image007,
    Image002
  },
  data () {
    return {
      request: '',
      vQuesDo: [], // 标注项填空题
      vQuesCheck: [], // 标注项填空题
      vQuesCheckContents: [],
      projectid: '',
      question: {
        uuid: '',
        index: 0,
        flag: true,
        raw: ''
      },
      progress: 0,
      SopType: 1001,
      messageStatus: 1,
      progStatus: false,
      pass: false,
      uploadPageStatus: false,
      addExampleStatus: false,
      uploadForm: {},
      wholeRadios: [], // 整图单选题
      wholeCheckBoxs: [], // 整图多选题
      wholeInputs: [], // 整图填空题
      itemRadios: [], // 标注项单选题
      itemCheckBoxs: [], // 标注项多选题
      itemInputs: [], // 标注项填空题
      rectMinW: 5,
      rectMinH: 5,
      rectMinArea: 20,
      templet: 1,
      addExampleForm: {
        name: '',
        describe: '',
        selectExample: '',
        exampleType: ''
      },
      listForm: {},
      rules: {
        name: [
          { required: true, message: language('pushimage.sample.js.rules.name1'), trigger: 'blur' },
          { min: 1, max: 10, message: language('pushimage.sample.js.rules.name2'), trigger: 'blur' }
        ],
        selectExample: [
          { required: true, message: language('pushimage.sample.js.rules.selectExample'), trigger: 'change' }
        ]
      },
      trueData: [

      ],
      errorData: [],
      uploadParam: {
        token: ''
      },
      deleteConfirm: false,
      sampleFileList: [

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
      // get current page project id
      let projectid = document.location.pathname.split('/')[3]
      // let projectid = 'subvIDZSsdY001'
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
              var fSize = (rsp.filelist[index].fileSize / (1024 * 1024)).toFixed(2)
              var fileinfo = {
                fileName: rsp.filelist[index].fileName,
                fileSize: fSize + 'MB',
                raw: rsp.filelist[index].raw
              }
              vm.sampleFileList.push(fileinfo)
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
                addStatus: language('pushimage.sample.js.addStatus.type1'),
                raw: item.raw,
                uuid: item.uuid,
                commit: item.commit,
                result: ''
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
                addStatus: language('pushimage.sample.js.addStatus.type1'),
                raw: item.raw,
                uuid: item.uuid,
                commit: item.commit,
                result: ''
              }
              if (result !== '') {
                exampleData.result = JSON.parse(item.result)
              }
              vm.errorData.push(exampleData)
            }

            if (rsp.SopType) {
              vm.SopType = rsp.SopType
            }

            if (rsp.pageCfg) {
              if (rsp.pageCfg.templet) {
                vm.templet = rsp.pageCfg.templet
              }
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
              if (rsp.pageCfg.Restrictions) {
                let Restrictions = rsp.pageCfg.Restrictions
                if (Restrictions.ImgRest) {
                  vm.rectMinW = Restrictions.ImgRest.rectMinW
                  vm.rectMinH = Restrictions.ImgRest.rectMinH
                  vm.rectMinArea = Restrictions.ImgRest.rectMinArea
                }
              }
            }
          } else {
            console.log('code not 0??')
            vm.$notify.error({
              title: language('pushimage.sample.js.error.type1'),
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
    // 后端标签转成前端选择题
    // transferLabels (labelLists) {
    //   let format = []
    //   for (let x in labelLists) {
    //     let labelList = {
    //       title: labelLists[x].title,
    //       choice: []
    //     }
    //     let labels = labelLists[x].labels
    //     for (let i in labels) {
    //       labelList.choice.push(labels[i].name)
    //     }
    //     format.push(labelList)
    //   }
    //   return format
    // },
    close () {
      this.messageStatus = 1
      this.$refs.Template.Clear()
    },
    deleteSampleFile (index) {
      let vm = this
      let file = vm.sampleFileList[index]

      // 异步确认。。。
      this.$confirm(language('pushimage.sample.js.deleteSampleFile'), language('pushimage.sample.js.error.type2'), {
        confirmButtonText: language('pushimage.sample.js.success.type2'),
        cancelButtonText: language('pushimage.sample.js.error.type3'),
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
                  title: language('pushimage.sample.js.success.type1'),
                  message: language('pushimage.sample.js.success.type3'),
                  duration: 2000
                })
                vm.sampleFileList.splice(index, 1)
              } else {
                vm.$notify.error({
                  title: language('pushimage.sample.js.error.type1'),
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
    goBack () {
      util.Redirect('/push-project-qcprice/image/' + this.projectid, 1000)
    },
    forward () {
      util.Redirect('/push-project-tutorial/image/' + this.projectid, 1000)
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
        this.$message.error(language('pushimage.sample.js.error.type4'))
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
              title: language('pushimage.sample.js.error.type1'),
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
        title: language('pushimage.sample.js.error.type1'),
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
              title: language('pushimage.sample.js.success.type1'),
              message: language('pushimage.sample.js.success.type4'),
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
              title: language('pushimage.sample.js.error.type1'),
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
          title: language('pushimage.sample.js.error.type1'),
          message: language('pushimage.sample.js.error.type5'),
          duration: 2000
        })
        return false
      }

      if (file.size > 50 * 1024 * 1024) {
        vm.$notify.error({
          title: language('pushimage.sample.js.error.type1'),
          message: language('pushimage.sample.js.error.type6'),
          duration: 2000
        })
        return false
      }

      let ret = false
      // 同步请求，	获取上传的token
      $.ajax({
        url: '/api/get-upload-token/image',
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
              title: language('pushimage.sample.js.error.type1'),
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
      this.$confirm(language('pushimage.sample.js.deleteSampleItem'), language('pushimage.sample.js.error.type2'), {
        confirmButtonText: language('pushimage.sample.js.success.type2'),
        cancelButtonText: language('pushimage.sample.js.error.type3'),
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
                  title: language('pushimage.sample.js.success.type1'),
                  message: language('pushimage.sample.js.success.type3'),
                  duration: 2000
                })
                rows.splice(index, 1)
              } else {
                vm.$notify.error({
                  title: language('pushimage.sample.js.error.type1'),
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
          addStatus: language('pushimage.sample.js.addStatus.type2'),
          raw: exampleVoice,
          uuid: '',
          result: ''
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
                title: language('pushimage.sample.js.success.type1'),
                message: language('pushimage.sample.js.success.type5'),
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
                title: language('pushimage.sample.js.error.type1'),
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
      let vm = this
      console.log('handleEdit', index, row, flag)
      this.messageStatus = 2
      this.$nextTick(function () {
        row.addStatus = language('pushimage.sample.js.addStatus.type1')
        vm.question.uuid = row.uuid
        vm.question.index = index
        vm.question.flag = flag // 正确样例or错误样例
        vm.question.raw = row.raw
        // 在这里读详情
        let notes = row.result
        let src = row.raw
        let commit = row.commit
        console.log('imageload', src, notes, commit)
        this.$refs.Template.imageload(src, notes, commit)
      })
    },
    samplePostTask (params) {
      console.log(params)
      let vm = this
      let url = '/api/set-task-sample-item/image'
      let xsrftoken = $('meta[name=_xsrf]').attr('content')
      // post 请求中的url 需要从当前页面的url获取
      axios
        .post(
          url,
          {
            taskid: vm.projectid,
            uuid: vm.question.uuid,
            raw: vm.question.raw,
            commit: params.commit,
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
              title: language('pushimage.sample.js.success.type1'),
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
              title: language('pushimage.sample.js.error.type1'),
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
  /* width: 100%; */
  /* height: 100%; */
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

.message2 {
  background: #fff;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1999;
  overflow: hidden;
}
.message2 .mb-5 {
  padding-top: 2rem;
}
.message2 > i {
  position: absolute;
  cursor: pointer;
  font-size: 24px;
  right: 0.8rem;
  top: 0.8rem;
  color: #d1d4dc;
  /* z-index: 1050; */
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
</style>
