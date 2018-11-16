<template>
  <div id="main" class="main push-task">
    <Header/>
    <Layout :selStep="2" :active="2" :type="'wav'" :projectid="projectid" style="flex:1">
      <div class="taskTit">
        <h3>
          {{$t("pushWav.business.template")}}
          <el-tooltip placement="right" v-if="bsnStatus != 3">
            <span v-html="helpinfo.labelHelpInfo" slot="content"></span>
            <i class="el-icon-question forHelp"></i>
          </el-tooltip>
        </h3>
      </div>
      <div class="taskInfos">
        <div v-if="bsnStatus === 1">
          <p class="text-primary">{{$t('pushWav.business.labelDesign')}}</p>
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
          <div class="mt-2">
            <el-button type="text" v-on:click="showTemplate()" icon="el-icon-view">{{$t("pushWav.business.show1")}}</el-button>
          </div>
        </div>
        <div v-if="bsnStatus === 2">
          <p class="text-primary">{{$t('pushWav.business.labelTag')}}</p>
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
          <div class="mt-3">
            <el-button type="text" v-on:click="showTemplate()" icon="el-icon-view">{{$t("pushWav.business.show2")}}</el-button>
          </div>
        </div>
        <!-- [lmm]隐藏插入标签，暂时只标注标签 -->
        <div v-if="bsnStatus === 3">
          <el-button type="text" v-on:click="showTemplate()" icon="el-icon-view">{{$t("pushWav.business.show3")}}</el-button>
        </div>
      </div>
      <div class="d-flex justify-content-center mt-5">
        <el-button @click="goBack()">{{$t("pushTask.goback")}}</el-button>
        <el-button type="primary" @click="submitForm(false)" >{{$t("pushTask.submit")}}</el-button>
        <el-button type="primary" @click="submitForm(true)" >{{$t("pushTask.next")}}</el-button>
      </div>
    </Layout>
    <Footer/>
    <!-- 语音标注：1 语音转写：2 语音切割：3 默认为2-->
     <div class="message2 bg-white" v-show="messageStatus === 2" style="overflow: auto;">
        <div class="position-fixed bg-light w-100 d-flex align-items-center justify-content-between p-3" style="height:56px;z-index: 2">
          <div></div>
          <span class="d-flex align-items-center text-dark"><i class="fa fa-desktop fa-2x pr-2"></i>PC端预览</span>
          <el-button type="primary" round @click="close()" size="medium">关闭预览</el-button>
        </div>
        <div class="d-flex justify-content-center pb-5" style="padding-top: 80px">
          <Wav001
            ref = "Wav001"
            :tagMutexLabels = "tagMutexLabels"
            @postTask = "templetPostTask"
            :tagNormalLabels = "tagNormalLabels" />
        </div>
     </div>
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
import Layout from '../../components/layoutPage'
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
    Layout,
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
      // projectid = 'subybxN273z001'
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
      templet: 1
    }
  },
  methods: {
    close () {
      this.messageStatus = 1
      this.$refs.Wav001.clearAll()
      this.$refs.Wav001.waveformStop()
    },
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
    submitForm (forward) {
      console.log(this.tagMutexLabels)
      let vm = this
      let xsrftoken = $('meta[name=_xsrf]').attr('content')
      axios
        .post(
          '/api/push-project-business/wav',
          {
            taskid: vm.projectid,
            templet: vm.templet,
            wholeCfg: {
              tagMutexLabels: vm.tagMutexLabels,
              tagNormalLabels: vm.tagNormalLabels
            },
            itemcfg: {

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
                '/push-project-sample/wav/' + vm.projectid,
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
    },
    goBack () {
      util.Redirect('/push-project-profile/wav/' + this.projectid, 1000)
    }
  }
}
</script>

<style>
body {
  padding-top: 56px;
}
.push-task {
  background-color: #f0f2f5;
}
.message2 {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1999;
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
  width: 550px;
  min-height: 30px;
  line-height: 30px;
  vertical-align: middle;
}
.choice:hover {
  box-shadow: 0 0 3px #409EFF
}
.choice-have-content {
  display: inline-block;
  width: 270px;
}
.q-group-btn{
  margin-top: 10px;
  visibility:hidden;
  display: flex;
  justify-content: space-between;
}
</style>
