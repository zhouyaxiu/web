<template>
  <div class="d-flex flex-column" style="overflow: auto">
    <div class="mt-5 pb-4 mr-auto ml-auto" style="max-width: 1180px;width:100%" v-if="show">
      <el-steps class="push-task-steps" :active="active" simple finish-status="success">
        <el-step
          v-if="index"
          v-for="(step, index) in steps"
          :key="index"
          :title="step.name"
          :class="selStep === index ? 'push-task-step' : ''" @click.native="toPage(index)">
        </el-step>
      </el-steps>
    </div>
    <div class="w-100 mt-4 mr-auto mb-5 ml-auto bg-white" style="max-width:1000px;min-width: 430px;padding-top:80px;padding-bottom:100px">
      <div class="bg-white">
        <div class="taskInfo ml-auto mr-auto" style="max-width: 710px">
          <slot></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import $ from 'jquery'
import {language} from 'lang'
import * as util from 'assets/js/util.js'

export default {
  name: 'app',
  components: {
  },
  props: {
    selStep: Number,
    active: Number,
    type: String,
    show: {
      type: Boolean,
      default: true
    },
    projectId: String
  },
  data () {
    return {
      common: [{
        name: language('pushTask.creat'),
        url: 'created'
      }, {
        name: '项目简历',
        url: 'profile'
      }, {
        name: '任务设计',
        url: 'business'
      }, {
        name: language('pushTask.sample'),
        url: 'sample'
      }, {
        name: '价格与质量管控',
        url: 'sample'
      }],
      collect: [{
        name: language('pushTask.creat'),
        url: 'created'
      }, {
        name: '项目简历',
        url: 'profile'
      }, {
        name: '任务设计',
        url: 'business'
      }, {
        name: '价格与质量管控',
        url: 'sample'
      }]
    }
  },
  computed: {
    steps () {
      let steps = []
      switch (this.type) {
        case 'image':
          steps = this.common
          break
        case 'text':
          steps = this.common
          break
        case 'wav':
          steps = this.common
          break
        case 'collect':
          steps = this.collect
          break
        case 'group':
          steps = this.collect
          break
      }
      return steps
    }
  },
  methods: {
    toPage (index) {
      console.log(index)
      if (index > this.active) {
        return
      }
      console.log(this.steps[index].url)
      util.Redirect(`/push-project-${this.steps[index].url}/${this.type}/` + this.projectId, 1000)
    }
  }
}
</script>

<style>
.el-steps.push-task-steps.el-steps--simple{
  background: #f0f2f5;
}
/* 修改饿了么时间轴的样式 */
.push-task-steps .el-step__title {
  cursor: pointer;
}
.push-task-steps .el-step__head.is-success {
   color:#007bff;
   border-color:#007bff;
}
.push-task-steps .el-step__title.is-success {
   color:#007bff;
}
.push-task-steps  .el-step__title.is-process {
  color: #c0c4cc;
  font-weight: 500;
}
.push-task-steps  .el-step__head.is-process {
  color:#c0c4cc;
  border-color:#c0c4cc;
}
.push-task-steps .push-task-step .el-step__head {
  color:#333;
  border-color:#333;
}
.push-task-steps .push-task-step .el-step__title{
  color:#333;
  font-weight: 700;
}
/* .taskInfo {
  padding-left: 50px;
  padding-right: 50px;
} */
.taskInfo .taskTit {
  border-bottom: 1px dashed #ccc;
  margin-bottom: 2rem;
}
.taskInfo h3 {
  border-left: 5px solid #5788cd;
  font-size: 1.25rem;
  text-indent: 0.5rem;
  line-height: 1.1rem;
  margin-bottom: 1rem;
  /* margin-top: 1rem; */
}
</style>
