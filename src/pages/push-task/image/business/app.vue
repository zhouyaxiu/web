<template>
  <div id="main" class="main push-task">
    <Header/>
    <Layout :selStep="2" :active="2" :type="'image'" :projectId="projectId">
      <el-form :model="paramForm" :rules="rules" ref="paramForm" label-position="top" class="demo-paramForm">
        <!-- 整图问题 -->
        <div class="taskTit">
          <h3>{{$t("pushimage.business.wholemap")}}</h3>
        </div>
        <div class="taskInfos">
          <div>
            <el-form-item label="标注要求" prop="request">
              <el-input v-model="request"></el-input>
            </el-form-item>
          </div>
          <Ques001 :queArr="wholeRadios" :buttonName="$t('pushimage.business.singlechoice')"></Ques001>
          <Ques001 :queArr="wholeCheckBoxs" :buttonName="$t('pushimage.business.multiplechoice')"></Ques001>
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
        <div class="taskTit" v-if="SopType !== 1001">
          <h3>{{$t("pushimage.business.labelproblem")}}</h3>
        </div>
        <div class="taskInfos" v-if="SopType == 1002 || SopType == 1003">
          <Ques001 :queArr="itemRadios" :buttonName="$t('pushimage.business.singlechoice')"></Ques001>
          <Ques001 :queArr="itemCheckBoxs" :buttonName="$t('pushimage.business.multiplechoice')"></Ques001>
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
        <div class="taskInfos" v-else-if="SopType == 1005">
          <div v-if="itemRadios.length > 0">
            <p>标签描述</p>
            <div class="choice-box"><div contenteditable="true" class="choice" @blur="titleChange(0, $event.target.innerText, itemRadios)">{{itemRadios[0].title}}</div></div>
            <div v-for="(item, num) in itemRadios[0].labels" :key="item + num" class="g-tag-describe">
              <!-- <span class="el-radio__inner"></span> -->
              <el-color-picker v-model="item.content" size="small"></el-color-picker>
              <div class="choice-box">
                <div contenteditable="true" class="choice" @blur="choiceChange(0, num, $event.target.innerText, itemRadios, 'name')">{{item.name}}</div>
              </div>
              <el-button type="primary" icon="el-icon-delete" size="mini" @click="delColorItem(itemRadios, 0, num)"></el-button>
            </div>
            <!-- <div class="q-group-btn"> -->
            <!-- </div> -->
          </div>
          <el-button icon="el-icon-plus" size="small" @click="addColorItem(itemRadios, 0)"></el-button>
        </div>
        <el-button type="text" v-on:click="showTemplate()" icon="el-icon-view">{{$t("pushimage.business.preview")}}</el-button>
        <!-- 工具属性 -->
        <div class="taskTit mt-3">
          <h3>工具属性(选填)</h3>
        </div>
        <div class="taskInfos">
            <p>框选设置</p>
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item :label="$t('pushimage.business.rectMinW')" prop="rectMinW">
                  <el-input type="text" v-model.number="paramForm.rectMinW" style="max-width: 220px" size="medium"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('pushimage.business.rectMinH')" prop="rectMinH">
                  <el-input type="text" v-model.number="paramForm.rectMinH" style="max-width: 220px" size="medium"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('pushimage.business.rectMinArea')" prop="rectMinArea">
                  <el-input type="text" v-model.number="paramForm.rectMinArea" style="max-width: 220px" size="medium"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <div class="alert alert-light mb-4" role="alert" style="font-size: 14px; border:1px dashed #ccc">
              {{$t("pushimage.business.rectNote1")}}。<br>{{$t("pushimage.business.rectNote2")}}
            </div>
          <section>
            <p>点集设置</p>
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="最少点数" prop="pointsetmin">
                  <el-input type="text" v-model.number="paramForm.pointsetmin" style="max-width: 220px" size="medium"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="最多点数" prop="pointsetmax">
                  <el-input type="text" v-model.number="paramForm.pointsetmax" style="max-width: 220px" size="medium"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="辅助线" >
              <el-radio-group v-model="paramForm.point">
                <el-radio :label=1 border>需要</el-radio>
                <el-radio :label=0 border>不需要</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-row  v-for="(point, index) in paramForm.pointset" :gutter="20" :key="index" v-show="paramForm.point === 1">
              <el-col :span="7">
                <el-form-item class="mb-1" label="起始点" :prop="'pointset.' + index + '.s'"
                :rules="[{ type: 'number', message: '必须为数字值'}]">
                  <el-input type="text" v-model.number="point.s" size="small">
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item class="mb-1" label="结束点" :prop="'pointset.' + index + '.d'"
                :rules="[{ type: 'number', message: '必须为数字值'}]">
                  <el-input type="text" v-model.number="point.d" size="small">
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item class="mb-1" label="连线类型" :prop="'pointset.' + index + '.type'">
                  <el-select v-model="point.type" placeholder="连线类型" size="small">
                    <el-option label="仅两点" :value="0"></el-option>
                    <el-option label="连续点" :value="1"></el-option>
                    <el-option label="封闭区域" :value="2"></el-option>
                  </el-select>
                  <el-button class="ml-2" size="small" @click.prevent="removePonitSet(index)">删除</el-button>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item>
              <el-button @click="addPointSet" v-show="paramForm.point === 1">新增辅助线</el-button>
            </el-form-item>
          </section>
        </div>
        <el-form-item class="d-flex justify-content-center">
          <el-button @click="goBack()">{{$t("pushTask.goback")}}</el-button>
          <el-button type="primary" @click="submitForm('paramForm',false)">{{$t("pushTask.submit")}}</el-button>
          <el-button type="primary" @click="submitForm('paramForm',true)">{{$t("pushTask.next")}}</el-button>
        </el-form-item>
      </el-form>
    </Layout>
    <Footer/>
    <transition name="el-fade-in">
      <div class="message2" v-show="messageStatus === 2">
        <div class="d-flex align-items-center justify-content-between p-3" style="height:56px">
          <div></div>
          <span class="d-flex align-items-center text-dark"><i class="fa fa-desktop fa-2x pr-2"></i>PC端预览</span>
          <el-button round @click="close()" size="medium">关闭预览</el-button>
        </div>
        <Image007 v-if="templet==1" ref="Template"
          :SopType="SopType"
          @postTask="templetPostTask"
          :wholeRadios="wholeRadios"
          :wholeCheckBoxs="wholeCheckBoxs"
          :wholeInputs="wholeInputs"
          :itemRadios="itemRadios"
          :itemCheckBoxs="itemCheckBoxs"
          :itemInputs="itemInputs"
          :rectMinH="paramForm.rectMinH"
          :rectMinW="paramForm.rectMinW"
          :rectMinArea="paramForm.rectMinArea"
          :pointSetRest="pointSetRest"
          :request="request"
          :vQuesCheck="vQuesCheck"
          :vQuesDo="vQuesDo"
          :vQuesCheckContents="vQuesCheckContents"
          :PostButtonVisible="false"
        />
        <Image002 v-if="templet==2" ref="Template"
          :SopType="SopType"
          @postTask="templetPostTask"
          :wholeRadios="wholeRadios"
          :wholeCheckBoxs="wholeCheckBoxs"
          :wholeInputs="wholeInputs"
          :itemRadios="itemRadios"
          :rectMinH="paramForm.rectMinH"
          :rectMinW="paramForm.rectMinW"
          :rectMinArea="paramForm.rectMinArea"
        />
      </div>
    </transition>
    <div class="speake-box">
      <div class="speake">{{$t("pushimage.business.unsatisfy")}}<br/>{{$t("pushimage.business.service")}}</div>
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
import Ques001 from '../../components/question001'
// import helpinfo from './help-info'
import Sendmail from 'components/private/sendmail'
import $ from 'jquery'
import axios from 'axios'
import * as util from 'assets/js/util.js'
import Image007 from 'template/image/Image007'
import Image002 from 'template/image/Image002'
import {language} from 'lang'

// var tmpurl
// let str = window.location.search
// tmpurl = str.split('=')[1]

export default {
  name: 'app',
  components: {
    Header,
    Footer,
    Layout,
    Ques001,
    Image007,
    Image002,
    Sendmail
  },
  data () {
    /**
     * 自定义验证方法
     * @method checkMinSize 验证最小长宽
     */
    let checkMinSize = (rule, value, callback) => {
      if (value) {
        if (!Number.isInteger(value)) {
          callback(new Error('请输入数字值'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    return {
      request: '',
      vQuesDo: [],
      vQuesCheck: [],
      vQuesCheckContents: [],
      projectId: '',
      templet: 1,
      messageStatus: 1,
      speakeStatus: false,
      wholeRadios: [], // 整图单选题
      wholeCheckBoxs: [], // 整图多选题
      wholeInputs: [], // 整图填空题
      itemRadios: [], // 标注项单选题
      itemCheckBoxs: [], // 标注项多选题
      itemInputs: [], // 标注项填空题
      SopType: 1001,
      pointSetRest: {},
      // 表单验证
      paramForm: {
        rectMinW: 5,
        rectMinH: 5,
        rectMinArea: 20,
        point: '',
        pointset: [],
        pointsetmax: 0,
        pointsetmin: 0
      },
      rules: {
        rectMinW: [
          { validator: checkMinSize, trigger: 'change' }
        ],
        rectMinH: [
          { validator: checkMinSize, trigger: 'change' }
        ],
        rectMinArea: [
          { validator: checkMinSize, trigger: 'change' }
        ],
        pointsetmax: [
          { validator: checkMinSize, trigger: 'change' }
        ],
        pointsetmin: [
          { validator: checkMinSize, trigger: 'change' }
        ]
      }
    }
  },
  mounted: function () {
    let vm = this
    let projectId = document.location.pathname.split('/')[3]
    // projectId = 'subsdRGf1KQ001'
    if (projectId !== '') {
      vm.projectId = projectId
    }
    this.$nextTick(function () {
      // 获取基本信息（可能是新建任务后，自动跳转过来，也可能是从控制台跳转过来）
      let xsrftoken = $('meta[name=_xsrf]').attr('content')
      axios.post('/api/get-business-info/image',
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
              case 1001:
              case 1002:
              case 1003:
                vm.templet = 1
                break
              case 1005:
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
            } else {
              if (vm.templet === 2) {
                vm.addQuestion(vm.itemRadios)
              }
            }
            if (rsp.pageCfg.Restrictions) {
              let Restrictions = rsp.pageCfg.Restrictions
              if (Restrictions.ImgRest) {
                vm.paramForm.rectMinW = Restrictions.ImgRest.rectMinW
                vm.paramForm.rectMinH = Restrictions.ImgRest.rectMinH
                vm.paramForm.rectMinArea = Restrictions.ImgRest.rectMinArea
                if (Restrictions.ImgRest.pointSetRest) {
                  let _pointSetRest = Restrictions.ImgRest.pointSetRest
                  vm.paramForm.pointsetmax = _pointSetRest.max ? _pointSetRest.max : 0
                  vm.paramForm.pointsetmin = _pointSetRest.min ? _pointSetRest.min : 0
                  if (_pointSetRest.connLines) {
                    vm.paramForm.point = 1
                    vm.paramForm.pointset = _pointSetRest.connLines
                    for (let i = 0; i < vm.paramForm.pointset.length; i++) {
                      if (!vm.paramForm.pointset[i].type) {
                        vm.paramForm.pointset[i].type = 0
                      }
                    }
                  }
                }
              }
            }
            // if (rsp.pageCfg.templet) {
            //   vm.templet = rsp.pageCfg.templet
            // }
            // console.log(vm.templet)
            if (rsp.pageCfg.request) {
              vm.request = rsp.pageCfg.request
            }
            vm.vflag = rsp.pageCfg.vflag
            if (vm.vflag > 1) {
              vm.TagDisabled = true
              // console.log(vm.TagDisabled)
            }
            if (rsp.pageCfg.vQues) {
              let vQues = rsp.pageCfg.vQues
              vm.vQuesCheck = []
              vm.vQuesDo = []
              for (let i = 0; i < vQues.length; i++) {
                if (i < vm.vflag - 1) {
                  vm.vQuesCheck.push(vQues[i])
                  // console.log('Check', vm.vQuesCheck)
                } else {
                  vm.vQuesDo.push(vQues[i])
                  // console.log('Do', vm.vQuesDo)
                }
              }
            }
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
  methods: {
    // 增加辅助线
    addPointSet () {
      this.paramForm.pointset.push({
        s: 1,
        d: 1,
        type: 0
      })
    },
    // 删除辅助线
    removePonitSet (index) {
      this.paramForm.pointset.splice(index, 1)
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
    // stringToDate (fDate) {
    //   var fullDate = fDate.split('-')
    //   return new Date(fullDate[0], fullDate[1] - 1, fullDate[2], 0, 0, 0)
    // },
    showTemplate () {
      this.messageStatus = 2
      this.pointSetRest = this.submitJson().Restrictions.ImgRest.pointSetRest
      this.$nextTick(function () {
        this.$refs.Template.imageload('https://s302.fanhantech.com/samplefiledir/L7wPToxfGNRo7G56tHzcXXtYvDGAzhlt.jpg')
        // this.$refs.Template.imageload('../../../../static/test/' + tmpurl)
      })
    },
    /******************************
    *          提交操作           *
    ******************************/
    // 发送的数据结构
    submitJson () {
      let vm = this
      let submit = {
        taskid: vm.projectId,
        templet: vm.templet,
        // 整图问题
        wholeCfg: {
          tagMutexLabels: vm.wholeRadios,
          tagNormalLabels: vm.wholeCheckBoxs,
          TextInputs: vm.wholeInputs
        },
        // 标注项问题
        itemCfg: {
          tagMutexLabels: vm.itemRadios,
          tagNormalLabels: vm.itemCheckBoxs,
          TextInputs: vm.itemInputs
        },
        Restrictions: {
          SopType: vm.SopType,
          ImgRest: {
            // 框选设置
            rectMinW: vm.paramForm.rectMinW !== '' ? vm.paramForm.rectMinW : 5,
            rectMinH: vm.paramForm.rectMinH !== '' ? vm.paramForm.rectMinH : 5,
            rectMinArea: vm.paramForm.rectMinArea !== '' ? vm.paramForm.rectMinArea : 20,
            // 点集设置
            pointSetRest: {
              max: vm.paramForm.pointsetmax === '' ? 0 : vm.paramForm.pointsetmax,
              min: vm.paramForm.pointsetmin === '' ? 0 : vm.paramForm.pointsetmin
            }
          }
        },
        request: vm.request
      }
      if (vm.paramForm.point === 1) {
        submit.Restrictions.ImgRest.pointSetRest.connLines = vm.paramForm.pointset
      }
      return submit
    },
    // 提交请求
    submitForm (formName, forward) {
      let vm = this
      this.$refs[formName].validate(valid => {
        if (!valid) {
          return false
        }
        console.log(vm.submitJson())
        axios
          .post(
            '/api/push-project-business/image', vm.submitJson(),
            {
              headers: {
                'X-Xsrftoken': $('meta[name=_xsrf]').attr('content')
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
                  '/push-project-sample/image/' + vm.projectId,
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
    // 模板关闭预览
    close () {
      this.messageStatus = 1
      this.$refs.Template.Clear()
    },
    hidePanel () {
      this.speakeStatus = false
    },
    /******************************
    *          问题操作           *
    ******************************/
    addQuestion (arr, name) {
      let thisId = arr.length.toString()
      if (name === 'input') {
        arr.push(language('pushimage.business.js.text'))
      } else {
        arr.push({
          id: thisId,
          title: language('pushimage.business.js.title'),
          labels: [{
            name: language('pushimage.business.js.label'),
            content: language('pushimage.business.js.labelContent')
          }, {
            name: language('pushimage.business.js.label'),
            content: language('pushimage.business.js.labelContent')
          }]
        })
      }
    },
    addChoice (arr, index, name) {
      arr[index].labels.push({
        name: language('pushimage.business.js.label'),
        content: language('pushimage.business.js.labelContent')
      })
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
      arr[index].labels.push({
        name: language('pushimage.business.js.label'),
        content: '#ff0000'
      })
    },
    goBack () {
      util.Redirect('/push-project-profile/image/' + this.projectId, 1000)
    }
  }
}
</script>

<style>
.push-task {
  background-color: #f0f2f5;
}
.taskInfos .el-form-item__label {
  padding: 0
}
body {
  padding-top: 56px;
}
label {
  color: #606266;
  font-size: 14px;
}
.el-date-editor .el-range-separator {
  width: 8%;
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
</style>
