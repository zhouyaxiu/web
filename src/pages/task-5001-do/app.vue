<template>
  <div class="selecttype">
    <Header/>
    <div class="message load-icon-box" v-show="progStatus === true">
      <div class="progressPage">
        <el-progress :text-inside="true" :stroke-width="18" :percentage="progress" :status="proStatus"></el-progress>
      </div>
    </div>
    <div class="container content">
      <el-form :model="paramForm" :rules="rules" ref="paramForm" label-width="160px" class="demo-ruleForm">
        <el-form-item :label="$t('collectWav.equip')" prop="equip">
          <el-radio-group v-model="paramForm.equip">
            <el-radio label="Android"></el-radio>
            <el-radio label="IOS"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('collectWav.name1')" prop="name">
          <el-input v-model="paramForm.name" :placeholder="$t('collectWav.name2')"></el-input>
        </el-form-item>
        <el-form-item :label="$t('collectWav.address1')" prop="address">
          <el-input type="textarea" v-model="paramForm.address" :placeholder="$t('collectWav.address2')"></el-input>
        </el-form-item>
        <el-form-item :label="$t('collectWav.language1')" prop="language">
          <el-select v-model="paramForm.language" clearable filterable :placeholder="$t('collectWav.language2')">
            <el-option
              v-for="(language,index) in selectData.languages"
              :key="index"
              :label="language"
              :value="language">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('collectWav.upload1')" prop="upload">
          <div id="box2">
            <span class="btn btn-secondary btn-sm fileinput-button">
              <span>选择文件</span>
              <input type="file" id="select2" @change="addFile">
            </span>
          </div>
          <div v-for="(file,index) in newFiles" :key="index" style="width: 70%">
            <div class="d-flex fill-list">
              <span>{{file.file.name}}</span>
              <div>
                <span>{{file.file.size}}</span>
                <span class="fill-list-span">{{file.status}}</span>
                <el-button @click="upload(index)" type="primary" size="small" v-if="file.status !== '文件上传成功'">点击上传</el-button>
                <el-button @click="remove(index)" type="danger" size="small">删除</el-button>
              </div>
            </div>
            <el-progress :percentage="file.progress" v-if="file.progress > 0"></el-progress>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('paramForm')">{{$t("collectWav.submit")}}</el-button>
          <!-- <el-button @click="resetForm('paramForm')">{{$t("collectWav.reset")}}</el-button> -->
        </el-form-item>
      </el-form>
    </div>
    <div class="theBottom">
      <Footer/>
    </div>
  </div>
</template>

<script>
import Header from 'components/header'
import Footer from 'components/footer'
import $ from 'jquery'
import axios from 'axios'
import {language} from 'lang'
import * as qiniu from 'qiniu-js'

var http = axios.create({
  headers: {'X-Xsrftoken': $('meta[name=_xsrf]').attr('content')}
})

export default {
  name: 'selecttype',
  components: {
    Footer: Footer,
    Header: Header
  },
  data () {
    return {
      selectData: {
        languages: [
          '汉语 / Manderin',
          '英语(美国) / English(US)',
          '英语(英国) / English(UK)',
          '英语(加拿大) / English(Canada)',
          '英语(澳大利亚) / English(Australia)',
          '英语(印度) / English(India)',
          '英语(新西兰) / English(New Zealand)',
          '英语(新加坡) / English(Singapore)',
          '法语(法国) / French(France)',
          '法语(北非) / French(North Africa)',
          '法语(加拿大) / French(Canada)',
          '德语 / German',
          '西班牙语(西班牙) / Spanish(Spain)',
          '葡萄牙语(葡萄牙) / Portuguese(Portugal)',
          '意大利语 / Italian',
          '阿拉伯语 / Arabic',
          '泰语 / Thai Language',
          '韩语 / Korean',
          '日语 / Japanese',
          '俄语 / Russian',
          '西班牙语(墨西哥) / Spanish(Mexico)',
          '法语(法国) / French(France)',
          '法语(北非) / French(North Africa)',
          '法语(加拿大) / French(Canada)',
          '冰岛语 / Icelandic',
          '丹麦语 / Danish',
          '瑞典语 / Swedish Language',
          '挪威语 / Norwegian Language',
          '芬兰语 / Finnish',
          '荷兰语 / Dutch',
          '加泰洛尼亚语 / Catalana',
          '捷克语 / Czech',
          '匈牙利语 / Hungarian',
          '波兰语 / Polishh',
          '希腊语 / Greek Language',
          '爱尔兰语 / Irish Language',
          '波斯语 / Farsi',
          '希伯来语 / Hebrew',
          '哈萨克语 / Kazak',
          '维语 / Uighur Language',
          '藏语 / Tibetan Language',
          '蒙语 / Mongolian',
          '马来语 / Malay Language',
          '印尼语 / Indonesian',
          '越南语 / Vietnamese Language',
          '柬埔寨语 / Cambodian',
          '缅甸语 / Burmese',
          '老挝语 / Lao Language',
          '乌克兰语 / Ukrainian',
          '印地语(印度) / Hindi',
          '巴基斯坦语 / Urdu',
          '尼泊尔 / Nepali',
          '斯里兰卡 / Sri Lankan',
          '泰米尔语(印度) / Tamil',
          '埃塞俄比亚语 / Ethiopian',
          '尼日利亚语 / Nigerian',
          '毛利语 / Maori',
          '葡萄牙语(巴西) / Portuguese(Brazil)',
          '粤语 / Cantonese',
          '斯瓦西里语(乌干达) / Kiswahili(Uganda)',
          '斯瓦西里语(坦桑尼亚) / Kiswahili(Tanzania)',
          '泰卢固语(印度) / Telugu(India)',
          '马拉泰语(印度)	/	Marathi(India)',
          '孟加拉语 / Bangali',
          '古吉拉特语(印度) / Gujarati(India)',
          '上海话 / Shanghai dialect'
        ]
      },
      progStatus: false,
      projectId: '',
      uploadParam: {
        token: ''
      },
      files: [],
      fileLimit: 5,
      subscription: null,
      // 提交的表单
      paramForm: {
        key: '',
        filesize: 0,
        filename: '',
        equip: '',
        name: '',
        address: '',
        language: []
      },
      rules: {
        equip: [
          {
            required: true,
            message: language('collectWav.js.rules.equip'),
            trigger: 'change'
          }
        ],
        name: [
          {
            required: true,
            message: language('collectWav.js.rules.name'),
            trigger: 'change'
          }
        ],
        address: [
          {
            required: true,
            message: language('collectWav.js.rules.address'),
            trigger: 'change'
          }
        ],
        language: [
          {
            required: true,
            message: language('collectWav.js.rules.language'),
            trigger: 'change'
          }
        ]
        // upload: [
        //   {
        //     required: true,
        //     message: '请上传音频文件',
        //     trigger: 'change'
        //   }
        // ]
      }
    }
  },
  computed: {
    newFiles () {
      let vm = this
      var list = []
      if (vm.files.length < 1) {
        return
      }
      for (let i = 0; i < vm.files.length; i++) {
        var b = vm.computeSize(vm.files[i].file.size)
        var c = ''
        if (vm.files[i].status === 1) {
          c = '文件上传成功'
        } else if (vm.files[i].status === 0) {
          c = '文件未上传'
        } else if (vm.files[i].status === 2) {
          c = '文件上传中'
        } else {
          c = '文件上传失败'
        }
        list[i] = {
          file: {
            name: vm.files[i].file.name,
            size: b
          },
          status: c,
          progress: parseFloat(vm.files[i].progress + '').toFixed(3)
        }
      }
      console.log(list.length)
      console.log(vm.files.length)
      return list
    },
    fileStatus () {
      let vm = this
      let status = false
      for (let i = 0; i < vm.files.length; i++) {
        if (vm.files[i].progress < 100) {
          status = true
          break
        }
      }
      return status
    }
  },
  mounted: function () {
    this.$nextTick(function () {
      let vm = this
      vm.projectId = document.location.pathname.split('/')[2]
      // vm.projectId = 'testb001'
      vm.getTask()
      // vm.initQiniu()
    })
  },
  methods: {
    // 文件格式计算
    computeSize (size) {
      let returnSize, calSize
      if (size > 1048576) {
        calSize = (size / 1024 / 1024).toFixed(2)
        returnSize = calSize + 'MB'
      } else if (size > 1024) {
        calSize = (size / 1024).toFixed(2)
        returnSize = calSize + 'KB'
      } else {
        returnSize = size + 'B'
      }
      return returnSize
    },
    addFile (e) {
      let vm = this
      let input = document.getElementById('select2')
      console.log(e.target.files)
      let file = e.target.files[0]
      let fileObj = {
        file: file,
        status: 0,
        progress: 0
      }
      if (vm.files.length >= vm.fileLimit) {
        // 提示文件最多上传限制
        vm.$message({
          message: `只能上传${vm.fileLimit}个文件`,
          type: 'warning'
        })
        console.log('file num max!!')
        return
      }
      for (let i = 0; i < vm.files.length; i++) {
        let fileName = vm.files[i].file.name
        if (fileName === file.name) {
          input.value = ''
          vm.$message({
            message: `文件已选择`,
            type: 'warning'
          })
          return false
        }
      }
      vm.files.push(fileObj)
      input.value = ''
    },
    warnOpen (content, fn, title = '提示', confirm = '确定', cancel = '取消') {
      this.$confirm(content, title, {
        confirmButtonText: confirm,
        cancelButtonText: cancel,
        type: 'warning'
      }).then(() => {
        fn()
      }).catch(() => {
        return false
      })
    },
    upload (index) {
      /* eslint-disable */
      let vm = this
      let file = vm.files[index].file
      let tokenKey = vm.getUploadToken(file)
      let token = tokenKey[0]
      let key = tokenKey[1]
      console.log(token)
      console.log(key)
      if (token == '' || key == '') {
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
        next(res){
          console.log('next', res)
          vm.files[index].progress = res.total.percent
          vm.files[index].status = 2
        },
        error(err){
          vm.files[index].progress = 0
          vm.files[index].status = -1
          console.log('error', err)
        }, 
        complete(res){
          vm.files[index].progress = 100
          vm.files[index].status = 1
          console.log('complete', res)
          vm.paramForm.key = key
          vm.paramForm.filesize = file.size
          vm.paramForm.filename = file.name
          vm.subscription = null
        }
      }
      vm.subscription = observable.subscribe(observer)
    },
    getTask () {
      let vm = this
      // get 请求中的url 需要从当前页面的url获取
      let url = '/api/projects/' + vm.projectId + '/task'
      http.get(url)
        .then(function (response) {
          let rsp = response.data
          // console.log(rsp)
          if (rsp.code === 0) {
            // 成功
            vm.question = rsp.questions[0]
          } else {
            // 失败
            vm.$notify.error({
              title: language('collectWav.js.error.type1'),
              message: rsp.message,
              duration: 2000
            })
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    submitForm (formName) {
      let vm = this
      this.$refs[formName].validate(valid => {
        if (!valid) {
          return false
        }
        let url = '/api/projects/' + vm.projectId + '/task'
        let xsrftoken = $('meta[name=_xsrf]').attr('content')
        // post 请求中的url 需要从当前页面的url获取
        // console.log(vm.question.uuid)
        if (vm.paramForm.filename === '') {
          vm.$notify.error({
            title: language('collectWav.js.error.type1'),
            message: language('collectWav.js.error.type2'),
            duration: 2000
          })
          return false
        } else if (vm.fileStatus) {
           vm.$notify.error({
            title: language('collectWav.js.error.type1'),
            message: '文件未上传完毕',
            duration: 2000
          })
          return false
        }
        axios
          .post(
            url,
            {
              id: vm.projectId,
              uuid: vm.question.uuid,
              result: JSON.stringify(vm.paramForm)
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
                title: language('collectWav.js.success.type1'),
                message: rsp.message,
                duration: 2000
              })
              setTimeout(() => {
                window.location.reload()
              }, 1000)
            } else {
              vm.$notify.error({
                title: language('collectWav.js.error.type1'),
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
    resetForm (paramForm) {
      // this.$refs[paramForm].resetFields()
    },
    handleCheckedChange (value) {
      let checkedCount = value.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.paramForm.radioArray.length
    },
    getUploadToken (file) {
      let vm = this
      let xsrftoken = $('meta[name=_xsrf]').attr('content')

      let token = ''
      let key = ''
      // 同步请求，	获取上传的token
      $.ajax({
        url: '/api/projects/' + vm.projectId + '/token',
        type: 'POST', // GET
        async: false, // 或false,是否异步
        data: {
          filename: file.name,
          taskid: vm.projectId
        },
        timeout: 2000, // 超时时间
        dataType: 'json', // 返回的数据格式：
        beforeSend: function (xhr) {},
        success: function (data, textStatus, jqXHR) {
          console.log('success')
          var rsp = data
          if (rsp.code === 0) {
            vm.uploadParam.token = rsp.token
            token = rsp.token
            key = rsp.key
          } else {
            vm.$notify.error({
              title: language('collectWav.js.error.type1'),
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
      return [token, key]
    },
    remove (index) {
      let vm = this
      if (vm.subscription != null) {
        vm.subscription.unsubscribe()
      }
      vm.warnOpen ('请确认是否删除', function () {
        vm.files.splice(index, 1)
        vm.paramForm.filesize = 0
        vm.paramForm.filename = ''
        vm.paramForm.key = ''
      })
    },
    handleError (res) {
      // 上传失败
    }
  }
}
</script>

<style>
body {
    background-color: #f0f2f5;
}
.el-checkbox-button:first-child .el-checkbox-button__inner{
  border-radius: 4px
}
.el-checkbox-button.is-checked:first-child .el-checkbox-button__inner{
    border:0;
    border-radius: 4px
}
.el-checkbox-button__inner{
  border: 1px solid #dcdfe6;
}
.el-checkbox-button.is-checked .el-checkbox-button__inner{
  border-radius: 4px;
}
.content{
    background-color: #fff;
    padding: 2rem;
    margin-bottom: 1rem;
}
@media (min-width: 768px){
.el-checkbox-group {
  display: flex;
}
  .el-checkbox-button, .el-checkbox-button__inner{
    flex: 1;
    width: 100%;
    margin-right: 10px;
}
    .el-upload-dragger,.el-upload{
      width:100%;
    }
}
@media (max-width:768px){
  .el-checkbox-group {
    display: block;
  }
  .el-checkbox-button.is-checked .el-checkbox-button__inner{
    border-radius: 4px;
    width:100%;
  }
  .el-checkbox-button{
     width:32%;
     margin: 0 0 10px;
  }
    .el-checkbox-button:nth-child(2),.el-checkbox-button:nth-child(5){
      margin:0 2%;
    }
    .el-checkbox-button__inner,.el-upload-dragger,.el-upload{
      width:100%;
    }
}
@media (max-width: 576px){
  .el-checkbox-group {
    display: block;
  }
  .el-upload-dragger,.el-upload{
    width:100%
  }
   .el-checkbox-button.is-checked .el-checkbox-button__inner{
      border-radius: 4px;
      width:100%;
      border: 0;
    }
    .el-checkbox-button{
      width:48%;
      margin:0 0 10px;
    }
     .el-checkbox-button:nth-child(2n+1){
      margin-right: 2%;
      margin-left: 0
    }
     .el-checkbox-button:nth-child(2n+2){
      margin-left: 2%;
      margin-right: 0
    }
    .el-checkbox-button__inner, .el-upload-dragger,.el-upload{
      width:100%;
    }
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
.fill-list {
  justify-content: space-between;
}
.fill-list-span {
  padding: 0 15px;
}
/* 上传按钮 */
.fileinput-button {
  position: relative;
  display: inline-block;
  overflow: hidden;
}

.fileinput-button input{
  position:absolute;
  right: 0px;
  top: 0px;
  opacity: 0;
  -ms-filter: 'alpha(opacity=0)';
  font-size: 200px;
}
.theBottom {
  position: fixed;
  width: 100%;
  bottom: 0;
}
</style>
