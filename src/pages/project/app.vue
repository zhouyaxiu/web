<template>
<div class="main">
  <Header ref="header"/>
  <div class="container">
    <!-- Content here -->
    <div class="project-info" v-if="role!=='no'">
      <div class="card project">
        <div class="card-header">
          <div class="title-row d-flex">
            <span class="d-inline-block" style="font-size:2.0rem">{{project.name}}</span>
            <span class="d-inline-block align-self-center ml-auto" style="font-size:1.1rem;color:#65C279">{{project.statusStr}}</span>
          </div>
          <div class="no-row mt-1">
            <span class="badge badge-secondary">No.{{project.id}}</span>
          </div>
          <div class="desc-row mt-3">
            <span class="d-inline-block pr-3" style="border-right:1px solid #D9D9D9">
              <span class="text-muted mr-2">{{$t("project.price")}}</span>
              {{project.price}}
            </span>
            <span class="d-inline-block px-3" style="border-right:1px solid #D9D9D9">
              <span class="text-muted mr-2">{{$t("project.typeStr")}}</span>
              {{project.typeStr}}
            </span>
            <span class="d-inline-block pl-3">
              <span class="text-muted mr-2">{{$t("project.duration")}}</span>
              {{project.duration}}{{$t("project.day")}}
            </span>
            <!-- <span class="d-inline-block pl-3">
              <span class="text-muted mr-2">任务角色</span>
              管理员
            </span> -->
          </div>
          <div class="start-row d-flex" v-if="role !== 'common'">
            <a class="btn btn-secondary ml-auto" :href="'/table/'+project.id" role="button">报表</a>
            <a class="btn btn-secondary ml-2" :href="'/workbench#/limitMgr/'+project.id" role="button">权限管理</a>
            <!-- <a class="btn btn-secondary ml-2" :href="'/projects/'+project.id+'/task/reviews'" role="button">{{$t("project.examine")}}</a> -->
            <a class="btn btn-primary ml-2" :href="'/projects/'+project.id+'/task/reviews'" role="button">{{$t("project.mytask")}}</a>
            <a class="btn btn-primary ml-2" :href="'/projects/'+project.id+'/task'" role="button">{{$t("project.makemoney")}}</a>
          </div>
          <div class="start-row d-flex" v-else>
            <a class="btn btn-secondary ml-auto" :href="'/projects/'+project.id+'/task/reviews/'" role="button">{{$t("project.mytask")}}</a>
            <a class="btn btn-primary ml-2" :href="'/projects/'+project.id+'/task'" role="button">{{$t("project.makemoney")}}</a>
          </div>
        </div>
        <div class="card-body">
          <div class="project-content">
            <div class="content">
              <h3>项目简介</h3>
              <div>{{project.abstract}}</div>
            </div>
            <div class="content">
              <h3>项目背景描述</h3>
              <div v-html="description"></div>
            </div>
            <div v-if="ruleSrc !== ''" class="content">
              <h3>标注规则</h3>
              <!-- <p>...</p> -->
              <pdf v-for="i in numPages" :key="i" :src="ruleSrc" :page="i"></pdf>
            </div>
            <div v-if="checkValid" class="content">
              <h3>有效性判断准则</h3>
              {{criterion}}
            </div>
            <div class="content">
              <h3>合格标准</h3>
              {{qualified}}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="project-no" v-else-if="role==='no'">
      <div class="card text-center">
        <div class="card-body">
          <p class="card-text" style="font-size:1.5rem;color:#F56C6C">{{$t("project.projectNo")}}</p>
          <a class="btn btn-primary" href="/projects" role="button">{{$t("project.return")}}</a>
        </div>
      </div>
    </div>
    <div v-else></div>
  </div>
  <Footer/>
</div>
</template>

<script>
import Header from 'components/header'
import Footer from 'components/footer'
import axios from 'axios'
import $ from 'jquery'
import pdf from 'vue-pdf'

var projectId = document.location.pathname.split('/')[2]
// projectId = '167SDSZX001'
var url = '/api/projects/' + projectId
var http = axios.create({
  headers: {'X-Xsrftoken': $('meta[name=_xsrf]').attr('content')}
})

export default {
  name: 'app',
  components: {
    Header,
    Footer,
    pdf
  },
  data () {
    return {
      project: {},
      show: '',
      role: '',
      ruleSrc: '',
      description: '',
      startTime: '',
      endTime: '',
      qualified: '',
      checkValid: false,
      numPages: undefined,
      criterion: ''
    }
  },
  mounted: function () {
    this.$nextTick(function () {
      // Code that will run only after the
      // entire view has been rendered
      let vm = this
      // get current page role flag
      vm.role = $('meta[name=_role]').attr('content')
      if (vm.role === '') {
        vm.role = 'common'
      }
      // get project information
      if (vm.role !== 'no') {
        vm.getProject()
      }
    })
  },
  methods: {
    getProject () {
      let vm = this
      http.get(url)
        .then(function (response) {
          let rsp = response.data
          // console.log(rsp)
          // TODO 异常处理
          vm.project = rsp.project
          if (vm.project) {
            vm.project = rsp.project
            if (vm.project) {
              vm.description = vm.project.description
              if (vm.project.taskProfile) {
                if (vm.project.taskProfile.ruleSrc) {
                  // vm.ruleSrc = vm.project.taskProfile.ruleSrc
                  vm.ruleSrc = pdf.createLoadingTask(vm.project.taskProfile.ruleSrc)
                  vm.ruleSrc.then(pdf => {
                    vm.numPages = pdf.numPages
                  })
                }
                if (vm.project.taskProfile.desc && vm.project.taskProfile.desc !== '') {
                  vm.description = vm.project.taskProfile.desc
                }
                vm.checkValid = vm.project.taskProfile.checkValid
                vm.criterion = vm.project.taskProfile.criterion
                vm.qualified = vm.project.taskProfile.qualified
              }
            }
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
/* 项目介绍 */
.project-content .content h3 {
  padding-top: 1rem;
  margin-bottom: 1rem
}
.project-content .content p {
  margin-bottom: 1rem
}
</style>
