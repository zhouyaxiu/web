<template>
  <div id="main" class="main push-task">
    <Header/>
    <Layout :selStep="2" :active="2" :type="'text'" :projectId="projectId" style="flex:1">
      <div class="taskTit">
        <h3>{{$t("pushtext.business.wholemap")}}</h3>
      </div>
      <div class="taskInfos">
        <Ques001 :queArr="wholeRadios" :buttonName="$t('pushimage.business.singlechoice')"></Ques001>
        <Ques001 :queArr="wholeCheckBoxs" :buttonName="$t('pushimage.business.multiplechoice')"></Ques001>
        <div v-if="wholeInputs.length > 0">
          <p>{{$t("pushtext.business.fillblank")}}</p>
          <div class="q-content" v-for="(items, index) in wholeInputs" :key="items + index">
            <span>Q{{index + 1}}</span><div class="choice-box"><div contenteditable="true" class="choice" @blur="titleChange(index, $event.target.innerText, wholeInputs, 'input')">{{items}}</div></div>
            <el-input :placeholder="$t('pushtext.business.entercontent')"></el-input>
            <div class="q-group-btn">
              <el-button icon="el-icon-delete" size="small" @click="delQuestion(wholeInputs, index)"></el-button>
            </div>
          </div>
        </div>
        <el-button type="primary" plain icon="el-icon-plus" @click="addQuestion(wholeInputs, 'input')">{{$t("pushtext.business.fillblank")}}</el-button>
      </div>
      <div class="taskTit mt-5" v-if="SopType !== 2001">
        <h3>{{$t("pushtext.business.labelproblem")}}</h3>
      </div>
      <div class="taskInfos" v-if="SopType !== 2001">
        <Ques001 :queArr="itemRadios" :buttonName="$t('pushimage.business.singlechoice')"></Ques001>
        <Ques001 :queArr="itemCheckBoxs" :buttonName="$t('pushimage.business.multiplechoice')"></Ques001>
        <div v-if="itemInputs.length > 0">
          <p>{{$t("pushtext.business.fillblank")}}</p>
          <div class="q-content" v-for="(items, index) in itemInputs" :key="items + index">
            <span>Q{{index + 1}}</span><div class="choice-box"><div contenteditable="true" class="choice" @blur="titleChange(index, $event.target.innerText, itemInputs, 'input')">{{items}}</div></div>
            <el-input :placeholder="$t('pushtext.business.entercontent')"></el-input>
            <div class="q-group-btn">
              <el-button icon="el-icon-delete" size="small" @click="delQuestion(itemInputs, index)"></el-button>
            </div>
          </div>
        </div>
        <el-button type="primary" plain icon="el-icon-plus" @click="addQuestion(itemInputs, 'input')">{{$t("pushtext.business.fillblank")}}</el-button>
      </div>
      <el-button class="mt-3" type="text" v-on:click="showTemplate()" icon="el-icon-view">{{$t("pushtext.business.preview")}}</el-button>
      <div class="d-flex justify-content-center">
        <!-- <el-button>取消</el-button> -->
        <el-button @click="goBack()">{{$t("pushTask.goback")}}</el-button>
        <el-button type="primary" @click="submitForm(false)" >{{$t("pushTask.submit")}}</el-button>
        <el-button type="primary" @click="submitForm(true)" >{{$t("pushTask.next")}}</el-button>
      </div>
    </Layout>
    <Footer/>
    <transition name="el-fade-in">
      <div class="message2" v-show="messageStatus === 2">
        <i class="el-icon-error" v-on:click="close()"></i>
        <Text001 v-if="templet==1" ref="Template"
          :SopType="SopType"
          @postTask="postTask"
          :wholeRadios="wholeRadios"
          :wholeCheckBoxs="wholeCheckBoxs"
          :wholeInputs="wholeInputs"
          :itemRadios="itemRadios"
          :itemCheckBoxs="itemCheckBoxs"
          :itemInputs="itemInputs"
        />
        <Text002 v-if="templet==2" ref="Template"
          :SopType="SopType"
          @postTask="postTask"
          :wholeRadios="wholeRadios"
          :wholeCheckBoxs="wholeCheckBoxs"
          :wholeInputs="wholeInputs"
          :itemRadios="itemRadios"
          :itemCheckBoxs="itemCheckBoxs"
          :itemInputs="itemInputs"
        />
      </div>
    </transition>
    <div class="speake-box">
      <div class="speake">{{$t("pushtext.business.unsatisfy")}}<br/>{{$t("pushtext.business.service")}}</div>
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
import Sendmail from 'components/private/sendmail'
import Layout from '../../components/layoutPage'
import Ques001 from '../../components/question001'
import $ from 'jquery'
import axios from 'axios'
import * as util from 'assets/js/util.js'
import Text001 from 'template/text/Text001'
import Text002 from 'template/text/Text002'
import {language} from 'lang'

export default {
  name: 'app',
  components: {
    Header,
    Footer,
    Layout,
    Ques001,
    Text001,
    Text002,
    Sendmail
  },
  data () {
    return {
      projectid: '',
      templet: 1,
      messageStatus: 2,
      speakeStatus: false,
      wholeRadios: [], // 整图单选题
      wholeCheckBoxs: [], // 整图多选题
      wholeInputs: [], // 整图填空题
      itemRadios: [], // 标注项单选题
      itemCheckBoxs: [], // 标注项多选题
      itemInputs: [], // 标注项填空题
      SopType: 2002
    }
  },
  mounted: function () {
    let vm = this
    let projectid = document.location.pathname.split('/')[3]
    // projectid = 'subW4i4KNWE001'
    console.log('projectid:', projectid)
    if (projectid !== '') {
      vm.projectid = projectid
    }
    this.$nextTick(function () {
      // 获取基本信息（可能是新建任务后，自动跳转过来，也可能是从控制台跳转过来）
      vm.messageStatus = 1
      let xsrftoken = $('meta[name=_xsrf]').attr('content')
      axios.post('/api/get-business-info/text',
        {
          taskid: vm.projectid
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
              case 2001:
                vm.templet = 1
                break
              case 2002:
                vm.templet = 2
                break
              default:
                console.log('SopType err')
                vm.error('SopType err')
            }
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
            if (rsp.pageCfg.templet) {
              vm.templet = rsp.pageCfg.templet
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
    })
  },
  methods: {
    postTask (param) {
      console.log(JSON.stringify(param.result))
    },
    error (msg) {
      let vm = this
      vm.$notify.error({
        title: '失败',
        message: msg,
        duration: 2000
      })
    },
    stringToDate (fDate) {
      var fullDate = fDate.split('-')
      return new Date(fullDate[0], fullDate[1] - 1, fullDate[2], 0, 0, 0)
    },
    showTemplate () {
      this.messageStatus = 2
      this.$nextTick(function () {
        this.$refs.Template.load('泛函科技隶属于苏州泛函信息科技有限公司，核心团队是一群年轻活力的青年， 包括技术先进的研发团队和经验丰富的项目经理团队，这些来自语音、图片、视频等不同领域的优秀人才，致力于推动人工智能的未来发展。')
      })
    },
    submitForm (forward) {
      let vm = this
      let wholeMutex = vm.wholeRadios
      let wholeNormal = vm.wholeCheckBoxs
      let itemMutex = vm.itemRadios
      let itemNormal = vm.itemCheckBoxs

      let xsrftoken = $('meta[name=_xsrf]').attr('content')
      axios
        .post(
          '/api/push-project-business/text',
          {
            taskid: vm.projectid,
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
            }
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
                '/push-project-sample/text/' + vm.projectid,
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
    },
    close () {
      this.$refs.Template.clearAll()
      this.messageStatus = 1
    },
    hidePanel () {
      this.speakeStatus = false
    },
    addQuestion (arr, name) {
      let thisId = arr.length.toString()
      if (name === 'input') {
        arr.push(language('pushtext.business.js.text'))
      } else {
        arr.push({id: thisId, title: language('pushtext.business.js.title'), labels: [{name: language('pushtext.business.js.label'), content: language('pushtext.business.js.labelContent')}, {name: language('pushtext.business.js.label'), content: language('pushtext.business.js.labelContent')}]})
      }
      // console.log(thisId)
      // console.log(arr)
    },
    addChoice (arr, index, name) {
      arr[index].labels.push({name: language('pushtext.business.js.label'), content: language('pushtext.business.js.labelContent')})
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
    goBack () {
      util.Redirect('/push-project-profile/text/' + this.projectid, 1000)
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
  overflow: auto;
  border-radius: 0.5rem 0 0 0.5rem;
  box-shadow: 0 2px 52px 0 rgba(0, 0, 0, 0.5);
  border: 1px solid #ebeef5;
  display: flex;
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
.q-group-btn{
  margin-top: 10px;
  visibility:hidden;
  display: flex;
  justify-content: space-between;
}
</style>
