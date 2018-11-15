<template>
  <el-dialog title="申诉" :visible.sync="dialogTableVisible">
    <div class="container">
      <p>请填写您的申诉理由: <el-tooltip placement="right" class="tag-help">
          <div v-html="helpinfo.reason" slot="content"></div>
          <i class="el-icon-question forHelp"></i>
        </el-tooltip>
      </p>
      <el-form ref="form" :model="ruleForm" :rules="rules"  label-width="100px" class="demo-ruleForm">
        <el-form-item label="申诉理由" prop="reason">
          <el-input type="textarea" :autosize="{minRows:4,maxRows:8}" v-model="ruleForm.reason"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="report('ruleForm')">确定</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'app',
  props: {
    helpinfo: Array
  },
  data () {
    return {
      dialogTableVisible: false,
      ruleForm: {
        reason: ''
      },
      rules: {
        reason: [
          { required: true, message: '请输入申诉理由', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    report () {
      let vm = this
      vm.$refs.form.validate((valid) => {
        // 表单验证
        if (valid) {
          vm.$emit('report', vm.ruleForm.reason)
        }
      })
    },
    show () {
      this.dialogTableVisible = true
    },
    close () {
      this.dialogTableVisible = false
    }
  }
}
</script>

<style scoped>
</style>
