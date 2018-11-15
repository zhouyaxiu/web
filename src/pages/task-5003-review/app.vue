<template>
<div class="main">
  <Header/>
  <div class="card">
    <div class="card-header">
      <div class="d-flex">
        <div class="d-inline-block" style="font-size:1.2rem;">camera</div>
      </div>
    </div>
    <div class="card-body">
      <el-card class="box-card">
         <div class="d-table">
        <div class="d-table-row">
          <div class="d-table-cell label-cell">年龄：</div>
          <div class="d-table-cell data-cell">{{camera.age}}</div>
        </div>
        <div class="d-table-row">
          <div class="d-table-cell label-cell">性别：</div>
          <div class="d-table-cell data-cell">{{camera.gender}}</div>
        </div>
        <div class="d-table-row">
          <div class="d-table-cell label-cell">摄像头：</div>
          <div class="d-table-cell data-cell">{{camera.cameratype}}</div>
        </div>
        <div class="d-table-row">
          <div class="d-table-cell label-cell">手机类型：</div>
          <div class="d-table-cell data-cell">{{camera.model}}</div>
        </div>
        <div class="d-table-row">
          <div class="d-table-cell label-cell">组号：</div>
          <div class="d-table-cell data-cell">{{camera.teamid}}</div>
        </div>
      </div>
      </el-card>
      <el-row :gutter="20" class="photos">
        <div class="photos-con">
          <el-col :span="6" v-for="(item,index) in camera.photos" :key="index">
            <el-card :body-style="{ padding: '0px' }">
              <img :src="item.imgsrc" class="image" @click="showTemplate(item.info,item.imgsrc)">
              <div style="padding: 10px;text-align: center;font-size: 13px;">
                <span>{{ item.info}}</span>
              </div>
              <div class="item-btn">
                <el-button type="text" @click="showTemplate(item.info,item.imgsrc)">预览</el-button><br/>
              </div>
            </el-card>
            <el-radio-group v-model="radioContents[index]">
              <el-radio :label=0>合格</el-radio>
              <el-radio :label=1>不合格</el-radio>
            </el-radio-group>
          </el-col>
        </div>
      </el-row>
    </div>
    <div v-show="reviewCommentVisible">
      <div id="editor"></div>
    </div>
    <div class="d-flex justify-content-end fh-magin-bottom">
      <el-button type="success" @click="allRefuse">全部设为不合格</el-button>
      <el-button type="danger" @click="rejectTask">拒绝</el-button>
      <el-button type="success" @click="acceptTask">通过</el-button>
    </div>
  </div>
  <Footer/>
</div>
</template>

<script>
import Header from 'components/header'
import Footer from 'components/footer'
import axios from 'axios'
import Quill from 'quill'
// import {language} from 'lang'

var projectId = document.location.pathname.split('/')[2]
// projectId = 't20imga001'
var http = axios.create()
export default {
  name: 'app',
  data () {
    return {
      camera: {
        age: 20,
        // teamid: 11,
        gender: '女',
        cameratype: '前置',
        model: '魅族E',
        teamid: -1,
        photos: [
          // {info:'大笑',imgsrc:'http://img1.imgtn.bdimg.com/it/u=2499223344,2606584469&fm=200&gp=0.jpg'},
          // {info:'微笑',imgsrc:'http://img1.imgtn.bdimg.com/it/u=2499223344,2606584469&fm=200&gp=0.jpg'},
          //  {info:'张嘴',imgsrc:'http://img1.imgtn.bdimg.com/it/u=2499223344,2606584469&fm=200&gp=0.jpg'},
          // {info:'张嘴',imgsrc:'http://img1.imgtn.bdimg.com/it/u=2499223344,2606584469&fm=200&gp=0.jpg'},
          // {info:'张嘴',imgsrc:'http://img1.imgtn.bdimg.com/it/u=2499223344,2606584469&fm=200&gp=0.jpg'},
          // {info:'张嘴',imgsrc:'http://img1.imgtn.bdimg.com/it/u=2499223344,2606584469&fm=200&gp=0.jpg'},
        ]
      },
      reviewCommentVisible: true,
      reason: '',
      quill: {},
      imageNames: [
        '大笑',
        '微笑',
        '张嘴',
        '伤心（撇嘴+眼睛朝下看）',
        '恐惧（咬牙+皱眉）',
        '惊讶（张嘴+瞪眼）',
        '厌恶（皱眉+斜眼）',
        '生气（皱眉+抿嘴）',
        '皱眉',
        '瞪眼',
        '鼓气',
        '嘟嘴',
        '白眼',
        '坏笑',
        '下唇包住上唇',
        '撇嘴挤眼',
        '嘟嘴+皱眉',
        '鼓气+皱眉',
        '斜眼',
        '手机在左上30°',
        '手机在右上30°',
        '手机在正左（五官必须看清楚）',
        '手机在正右（五官必须看清楚）',
        '手机在下方',
        '自然'
      ],
      radioContents: []
    }
  },
  components: {
    Header,
    Footer
  },
  mounted: function () {
    var vm = this
    this.$nextTick(function () {
      // 初始化编辑器
      vm.quill = new Quill('#editor', {
        placeholder: '请输入...',
        modules: {
          toolbar: ['bold', 'italic', 'underline', 'strike']
        },
        theme: 'snow'
      })
      vm.getTask()
    })
  },
  methods: {
    showTemplate (task, url) {
      this.$alert("<div><img src='" + url + "' alt=\"task-img\" style=\"width: 100%\"></div>", '' + task, {
        dangerouslyUseHTMLString: true,
        confirmButtonText: '关闭',
        customClass: 'tool'
      })
    },
    getTask () {
      var vm = this
      var url = '/api/projects/' + projectId + '/task/review' + window.location.search
      // var url = '/api/projects/' + projectId + '/task/review' + '?taskid=wbvFBAmv001&uuid=teYd4pHi2DS0GFncrnApS7rLd4PiSY6j&status=1001999'

      http.get(url)
        .then(function (response) {
          var rsp = response.data
          if (rsp.code === 0) {
            let question = rsp.questions[0]
            let res = JSON.parse(question.raw)
            vm.camera.age = res.wholeInputContents[0]
            vm.camera.gender = res.wholeInputContents[1]
            vm.camera.model = res.wholeInputContents[2]
            vm.camera.cameratype = res.wholeInputContents[3]
            vm.camera.teamid = res.wholeInputContents[4] ? res.wholeInputContents[4] : -1
            for (let i in res.fileList) {
              let photo = {
                info: vm.imageNames[i],
                imgsrc: 'https://s301.fanhantech.com/' + res.fileList[i]
              }
              vm.camera.photos.push(photo)
              vm.radioContents.push(0)
            }
            console.log(question.comment)
            try {
              let commentRes = JSON.parse(question.comment)
              if (commentRes && typeof commentRes === 'object') {
                vm.quill.setText(commentRes.comment)
                vm.radioContents = commentRes.radioContents
              }
            } catch (e) {
              vm.quill.setText(question.comment)
            }
            // console.log(rsp)
            // console.log(res)
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
    },
    allRefuse () {
      let vm = this
      for (let i = 0; i < vm.radioContents.length; i++) {
        vm.radioContents[i] = 1
      }
      vm.$forceUpdate()
    },
    acceptTask () {
      var vm = this
      var url = '/api/projects/' + projectId + '/task/review' + window.location.search
      // var url = '/api/projects/' + projectId + '/task/review' + '?taskid=wbvFBAmv001&uuid=teYd4pHi2DS0GFncrnApS7rLd4PiSY6j&status=1001999'
      let commentRes = {
        comment: '通过',
        radioContents: vm.radioContents
      }
      http.post(url, {
        accept: true,
        comment: JSON.stringify(commentRes)
      })
        .then(function (response) {
          let rsp = response.data
          // console.log(rsp)
          if (rsp.code === 0) {
            vm.$notify.success({
              title: '成功',
              message: rsp.message,
              duration: 2000
            })
            // 通过refresh页面获取下一个任务
            setTimeout(() => {
              // window.location.href="/projects/"+projectId+"/task/reviews"
              // window.close()
            }, 2000)
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
    },
    rejectTask () {
      var vm = this
      if (vm.reviewCommentVisible === false) {
        vm.reviewCommentVisible = true
        return
      }
      vm.reason = vm.quill.getText()
      // console.log(vm.reason)
      // console.log(vm.reason.length)
      if (!vm.reason || vm.reason.trim() === '') {
        vm.$notify.error({
          title: '失败',
          message: '请填写拒绝理由',
          duration: 2000
        })
        return
      }
      let commentRes = {
        comment: vm.reason,
        radioContents: vm.radioContents
      }
      var url = '/api/projects/' + projectId + '/task/review' + window.location.search
      // var url = '/api/projects/' + projectId + '/task/review' + '?taskid=wbvFBAmv001&uuid=teYd4pHi2DS0GFncrnApS7rLd4PiSY6j&status=1001999'
      http.post(url, {
        accept: false,
        comment: JSON.stringify(commentRes)
      })
        .then(function (response) {
          let rsp = response.data
          // console.log(rsp)
          if (rsp.code === 0) {
            vm.$notify.success({
              title: '成功',
              message: rsp.message,
              duration: 2000
            })
            // 通过refresh页面获取下一个任务
            setTimeout(() => {
              // window.location.href="/projects/"+projectId+"/task/reviews"
              // window.close()
            }, 2000)
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
    }
  }
}
</script>

<style scoped>
  .d-table {
    margin: 0 auto;
    color: #48576A;
  }
  .d-table-row {
    line-height: 45px;
    text-align: right;
  }
  .label-cell {
    width: 90px;
  }
  .data-cell {
    line-height: 30px;
    text-align: left;
    padding-left: 16px;
  }
  .photos{
    margin-top: 20px;
  }
  .photos img{
    width: 100%;
    height: auto;
    vertical-align: bottom
  }
  .photos-con{
    display: -webkit-flex;
    display: flex;
    -webkit-flex-wrap: wrap;
    flex-wrap: wrap;
  }
  .el-col-6{
    margin-bottom: 10px;
    display: -webkit-flex;
    display: flex;
    -webkit-flex-wrap: wrap;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center
  }
  .card{
    width: 75%;
    margin: 0 auto 50px;
    display: inline-block;
  }
  .card-body{
    background: #f8f8f8;
  }
  .item-btn{
    display: none;
  }
  .photos .el-col-6{
    background: #fff;
    box-shadow: 0 0 0 2px #f0f0f0;
    margin-bottom: 20px;
    border-radius: 10px;
    position: relative;
    padding:10px 0 60px;
  }
  .photos .el-col-6 .el-radio-group{
    position: absolute;
    bottom: 10px;
  }
  .el-col-6 .el-card{
    position: relative;
  }
  .el-col-6 .el-card .el-card__body:hover .item-btn{
    background: rgba(0,0,0,.6);
    content: '预览';
    position: absolute;
    display: block;
    top: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    z-index: 1000;
    left: 0;
    display: flex;
    align-items: center;
    color: #fff;
    justify-content: center;
    overflow: hidden;
  }
  .el-col-6:hover .item-btn button{
    color:#fff;
  }
</style>
