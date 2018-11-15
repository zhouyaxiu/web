<template>
<div class="main">
  <Header/>
  <div class="container mb-5">
    <!-- <div class="userinfo clearfix">
      <p class="text-muted float-right">今日完成：--</p>
    </div> -->
    <div class="question-title">
      <p class="font-italic">{{$t("task3Do.title")}}{{question.raw}}</p>
    </div>
    <div class="workbench">
      <Wave ref="audio"/>
    </div>
    <div class="d-flex justify-content-end">
      <el-button type="success" @click="reviseTask">{{$t("taskPublic.submitTask")}}</el-button>
    </div>
    <!-- Create the editor container -->
    <div class="mt-1" v-show="reviewCommentVisible">
      <div id="editor"></div>
    </div>
  </div>
  <Footer/>
</div>
</template>

<script>
import Header from 'components/header'
import Footer from 'components/footer'
import Wave from './wave'
import axios from 'axios'
import Quill from 'quill'
import $ from 'jquery'
import {language} from 'lang'

var projectId = document.location.pathname.split('/')[2]
var http = axios.create({
  headers: {'X-Xsrftoken': $('meta[name=_xsrf]').attr('content')}
})

export default {
  name: 'app',
  components: {
    Header,
    Footer,
    Wave
  },
  data () {
    return {
      audio: '',
      projectid: '',
      question: {},
      quill: '',
      reviewCommentVisible: false,
      reason: ''
    }
  },
  mounted: function () {
    this.$nextTick(function () {
      // Code that will run only after the
      // entire view has been rendered
      var vm = this
      vm.audio = this.$refs['audio']
      // 初始化编辑器
      vm.quill = new Quill('#editor', {
        placeholder: '请输入...',
        modules: {
          toolbar: ['bold', 'italic', 'underline', 'strike']
        },
        theme: 'snow'
      })
      vm.getTask()
      // for test
      // var rsp = {
      //   'code': 0,
      //   'message': 'test',
      //   'questions': [
      //     {
      //       'id': 'india001',
      //       'title': 'test',
      //       'type': '',
      //       'uuid': 'APc2Riwn5HXwHkXHHqGKk92IRM1OSpn4',
      //       'raw': 'https://s301.fanhantech.com/india001/333_00000000.wav',
      //       'prev': "[{\"id\":\"0\",\"begin\":\"0.000\",\"end\":\"10.970\",\"text\":\"A This is the broadcast from the daily grind, to get all the news deliver straight to you, visit our Facebook page and download our app. now hears todays audio newspaper\"},{\"id\":\"1\",\"begin\":\"10.970\",\"end\":\"11.770\",\"text\":\"<无效><无效>\"},{\"id\":\"2\",\"begin\":\"11.770\",\"end\":\"17.598\",\"text\":\"A Hello and welcome to the daily grind everybody, today is Thursday the fourth of August and i am Ankit Parsad.\"},{\"id\":\"3\",\"begin\":\"17.598\",\"end\":\"18.569\",\"text\":\"<无效><无效>\"},{\"id\":\"4\",\"begin\":\"18.569\",\"end\":\"20.801\",\"text\":\"A Welcome to a new day in India, truly.\"},{\"id\":\"5\",\"begin\":\"20.801\",\"end\":\"21.219\",\"text\":\"<无效><无效>\"},{\"id\":\"6\",\"begin\":\"21.219\",\"end\":\"30.319\",\"text\":\"A governments come and go, elections happen by the dozen, Chief Ministers become Prime Ministers, governments become the oppositions, entire session of parliaments are washed out\"},{\"id\":\"7\",\"begin\":\"30.319\",\"end\":\"40.619\",\"text\":\"A you name it, its all part and parcel of politics and legislator in India and it can a time be enormously frustrating, because a change in a big country can be slow and argumentative process.\"},{\"id\":\"8\",\"begin\":\"40.619\",\"end\":\"41.216\",\"text\":\"<无效><无效>\"},{\"id\":\"9\",\"begin\":\"41.216\",\"end\":\"47.997\",\"text\":\"A However, once every none then these would be rulers, our representatives but something that truly takes the country forward.\"},{\"id\":\"10\",\"begin\":\"47.997\",\"end\":\"48.768\",\"text\":\"<无效><无效>\"},{\"id\":\"11\",\"begin\":\"48.768\",\"end\":\"59.549\",\"text\":\"A Some would say its been twenty-five years since such a thing last happened when in nineteen ninety-one India's economy was liberalized and went in to overdrive corrective stuff after the license raaj and hindu rate of growth,\"},{\"id\":\"12\",\"begin\":\"59.549\",\"end\":\"60.278\",\"text\":\"<无效><无效>\"},{\"id\":\"13\",\"begin\":\"60.278\",\"end\":\"64.110\",\"text\":\"A Yesterday as per all account some thing has happened that is just as big,\"},{\"id\":\"14\",\"begin\":\"64.110\",\"end\":\"64.578\",\"text\":\"<无效><无效>\"},{\"id\":\"15\",\"begin\":\"64.578\",\"end\":\"71.681\",\"text\":\"A even though its heavily linked to the economy, strangely the comparison aren't with nineteen ninety-one instead therewith nineteen forty-seven.\"},{\"id\":\"16\",\"begin\":\"71.681\",\"end\":\"72.330\",\"text\":\"<无效><无效>\"},{\"id\":\"17\",\"begin\":\"72.330\",\"end\":\"78.670\",\"text\":\"A The passage of the G S T constitutional amendment bill by the rajya sabha brings a nearly decade long saga to an end.\"},{\"id\":\"18\",\"begin\":\"78.670\",\"end\":\"79.177\",\"text\":\"<无效><无效>\"},{\"id\":\"19\",\"begin\":\"79.177\",\"end\":\"92.527\",\"text\":\"A  just about everybody agrees given that the bill was passed anonymously by the house. This despite the same people being at log ahead at some point or the other, party's at the center with each other, center verses states, states verses states, every possible combination,\"},{\"id\":\"20\",\"begin\":\"92.527\",\"end\":\"103.776\",\"text\":\"A Everyone agrees, even the A I D M K which walked out leaving its vote uncounted in principle an agreement however that the G S T is tremendously important and progressive and historic.\"},{\"id\":\"21\",\"begin\":\"103.776\",\"end\":\"104.576\",\"text\":\"<无效><无效>\"},{\"id\":\"22\",\"begin\":\"104.576\",\"end\":\"113.619\",\"text\":\"A India became one nation in ninteen forty-seven and post that with the integrations of some of the states and now it is on the part to become an one nation economically as well.\"},{\"id\":\"23\",\"begin\":\"113.619\",\"end\":\"114.340\",\"text\":\"<无效><无效>\"},{\"id\":\"24\",\"begin\":\"114.340\",\"end\":\"122.344\",\"text\":\"A Currently inter-states trade is almost inter-trading between countries, its because of all the various taxes and duties and other such that exist, \"},{\"id\":\"25\",\"begin\":\"122.344\",\"end\":\"122.763\",\"text\":\"<无效><无效>\"},{\"id\":\"26\",\"begin\":\"122.763\",\"end\":\"129.107\",\"text\":\"A VAT, excise, octroi, sales tax, luxuries tax, entertainment tax, swachh bharat cess etcetera.\"},{\"id\":\"27\",\"begin\":\"129.107\",\"end\":\"143.596\",\"text\":\"A All of it is not only anonymously complicated with exemptions and such, but it is also inefficient and time consuming logistically and drastically hikes up the overall tax incident, which eventually fall as a burden on the purchaser of goods and services, the consumer.\"},{\"id\":\"28\",\"begin\":\"143.596\",\"end\":\"144.047\",\"text\":\"<无效><无效>\"},{\"id\":\"29\",\"begin\":\"144.047\",\"end\":\"149.589\",\"text\":\"A It leads to cascading taxes, double counting and to tax avoidance and it needed an overhaul.\"},{\"id\":\"30\",\"begin\":\"149.589\",\"end\":\"150.175\",\"text\":\"<无效><无效>\"},{\"id\":\"31\",\"begin\":\"150.175\",\"end\":\"166.910\",\"text\":\"A The goods and services tax will promise to subsume all of these, absorb them into one G S T, which will be apply differently depending on the goods and services and question but buy in large should be lower as whole than the current tax regime but with neither the center nor the states losing out in revenue.\"},{\"id\":\"32\",\"begin\":\"166.910\",\"end\":\"167.418\",\"text\":\"<无效><无效>\"},{\"id\":\"33\",\"begin\":\"167.418\",\"end\":\"179.833\",\"text\":\"A Its sounds like magic and to be short to implement this enormous structure and to get it up in running is going to take some arithmetic and design visionary of the highest order and that is the headache that now falls on those who will seek to accomplish this task,\"},{\"id\":\"34\",\"begin\":\"179.833\",\"end\":\"191.143\",\"text\":\"A But one other form of visionary has lead to the situation arising, where the G S T has wheels of its own, especially once the G S T council is instituted and that domain of magic is called consensus building.\"}]",
      //       'answerType': 'text',
      //       'comment': 'test֪'
      //     }
      //   ]
      // }
      // vm.question = rsp.questions[0]
      // vm.audio.waveLoad(vm.question.raw)
      // vm.audio.regionLoad(vm.convertData(vm.question.prev))
    })
  },
  methods: {
    getTask () {
      var vm = this
      var url = '/api/projects/' + projectId + '/task/review' + window.location.search
      http.get(url)
        .then(function (response) {
          var rsp = response.data
          if (rsp.code === 0) {
            vm.question = rsp.questions[0]
            vm.audio.waveLoad(vm.question.raw)
            vm.audio.regionLoad(vm.convertData(vm.question.prev))
            vm.quill.setText(vm.question.comment)
          } else {
            vm.notify('error', rsp.message, 2000)
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    convertData (prev) {
      prev = JSON.parse(prev)
      if (prev.length === 0) {
        return []
      } else {
        if (prev[0].begin) {
          return this.oldConvert(prev)
        } else {
          return this.newConvet(prev)
        }
      }
    },
    oldConvert (prev) {
      var prevNew = []
      for (var i = 0, len = prev.length; i < len; i++) {
        var tmp = {}
        tmp.start = Number(prev[i].begin)
        tmp.end = Number(prev[i].end)
        tmp.data = {}
        if (prev[i].text === '<无效><无效>') {
          tmp.data.valid = false
          tmp.data.role = 'N'
          tmp.attributes = {}
          tmp.attributes.label = tmp.data.role
        } else {
          tmp.data.valid = true
          tmp.data.role = prev[i].text.slice(0, 1)
          tmp.data.note = prev[i].text.slice(2)
          tmp.attributes = {}
          tmp.attributes.label = tmp.data.role
        }
        prevNew.push(tmp)
      }
      return prevNew
    },
    newConvet (prev) {
      var prevNew = []
      for (var i = 0, len = prev.length; i < len; i++) {
        var tmp = {}
        tmp.start = Number(prev[i].start)
        tmp.end = Number(prev[i].end)
        tmp.data = {}
        tmp.data.valid = prev[i].valid
        tmp.data.role = prev[i].role
        tmp.data.note = prev[i].note
        tmp.attributes = {}
        tmp.attributes.label = tmp.data.role
        prevNew.push(tmp)
      }
      return prevNew
    },
    checkData () {
      var msg = language('task3Do.appNotify1')
      var regions = this.audio.wavesurfer.regions.list
      var regionsLength = regions.length
      // 至少有一段
      if (regionsLength < 1) {
        this.notify('error', msg + language('task3Do.appNotify2'), 2000)
        return false
      }
      // 保证起始位置在0.000
      if (regions[0].start.toFixed(3) !== '0.000') {
        this.notify('error', msg + language('task3Do.appNotify3'), 2000)
        return false
      }
      // 保证末尾位置在最后
      if (regions[regionsLength - 1].end.toFixed(3) !== this.audio.wavesurfer.getDuration().toFixed(3)) {
        this.notify('error', msg + language('task3Do.appNotify4'), 2000)
        return false
      }
      // 保证每段首尾相接
      for (var i = 0; i < regionsLength - 1; i++) {
        var end = regions[i].end.toFixed(3)
        var start = regions[i + 1].start.toFixed(3)
        if (end !== start) {
          this.notify('error', msg + ',' + (i + 1) + language('task3Do.add') + (i + 2) + language('task3Do.appNotify5'), 2000)
          return false
        }
      }
      // 保证每段内容完整
      for (i = 0; i < regionsLength; i++) {
        if ((regions[i].data.valid === true) && (regions[i].data.role === '' || regions[i].data.note === '')) {
          regions[i].color = 'rgba(201, 61, 24, 0.15)'
          regions[i].updateRender()
          this.notify('error', msg + '，' + (i + 1) + language('task3Do.appNotify6'), 2000)
          return false
        }
      }
      return true
    },
    reviseTask () {
      var vm = this
      var url = '/api/projects/' + projectId + '/task/revise' + window.location.search
      var result = []
      if (!this.checkData()) {
        return
      }
      vm.audio.wavesurfer.regions.list.forEach((region, index) => {
        var tmp = {}
        tmp.id = index.toString()
        tmp.start = region.start.toFixed(3)
        tmp.end = region.end.toFixed(3)
        tmp.valid = region.data.valid
        tmp.role = region.data.role
        tmp.note = region.data.note
        result.push(tmp)
      })
      http.post(url, {
        id: vm.question.id,
        uuid: vm.question.uuid,
        result: JSON.stringify(result)
      })
        .then(function (response) {
          var rsp = response.data
          // console.log(rsp)
          if (rsp.code === 0) {
            vm.$notify.success({
              title: language('taskPublic.success'),
              message: rsp.message,
              duration: 2000
            })
            // 通过refresh页面获取下一个任务
            setTimeout(() => {
              // window.location.href="/projects/"+projectId+"/task/revises"
              // window.close()
            }, 2000)
          } else {
            vm.$notify.error({
              title: language('taskPublic.error'),
              message: rsp.message,
              duration: 2000
            })
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    notify (type, message, duration) {
      if (type === 'success') {
        this.$notify.success({
          title: language('taskPublic.success'),
          message: message,
          duration: duration
        })
      } else if (type === 'warning') {
        this.$notify.warning({
          title: language('taskPublic.warning'),
          message: message,
          duration: duration
        })
      } else if (type === 'error') {
        this.$notify.error({
          title: language('taskPublic.error'),
          message: message,
          duration: duration
        })
      }
    }
  }
}
</script>

<style>
.btn-sm {
  font-size: 0.75rem;
}
/* region{
  border-style: dashed;
  border-width: 1.2px;
  border-color: #000000;
  box-sizing: border-box;
}
handle {
  background: grey;
  opacity: 0.3;
} */
/* .reginRow{
  margin: 1.3rem 0;
}
.el-radio-button__inner {
  margin-left: 15px;
  border: 1px solid #d8dce6;
}

.active{
  background-color: red;
}
.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
} */
.mx-auto{
  margin-top: 1rem;
  margin-bottom: 1rem;
}
.annotation{
  margin-bottom: 2rem;
  margin-top:.3rem;
}

</style>
