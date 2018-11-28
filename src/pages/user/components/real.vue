<template>
<div class="real">
  <div class="user-form-title">
    <h2>{{$t("user.real_from.realname")}}</h2>
    <el-switch
      v-model="realNameMode"
      :active-text="$t('user.real_from.idcard')"
      :inactive-text="$t('user.real_from.passport')">
    </el-switch>
  </div>
  <div style="padding-top: 12px;" v-if="realNameMode">
    <el-form :model="form" :rules="rules" ref="form" label-position="top" style="margin-top：20px;">
      <el-form-item :label="$t('user.real_from.truename')" prop="realName">
        <el-input v-model="form.realName" style="max-width:220px"></el-input>
      </el-form-item>
      <el-form-item :label="$t('user.real_from.idcrdnum')" prop="idCardNum">
        <el-input v-model="form.idCardNum" style="max-width:220px"></el-input>
      </el-form-item>
      <div class="row">
        <div class="col-md-4">
          <el-form-item :label="$t('user.real_from.idcardfront')" prop="idCardFront">
            <el-upload class="avatar-uploader" action="/api/upload/user/idcard?type=front" :show-file-list="false" :on-success="handleIdCardFrontSuccess" :before-upload="beforeUpload">
              <img v-if="form.idCardFront" :src="form.idCardFront" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
        </div>
        <div class="col-md-4">
          <el-form-item :label="$t('user.real_from.idcardback')" prop="idCardBack">
            <el-upload class="avatar-uploader" action="/api/upload/user/idcard?type=back" :show-file-list="false" :on-success="handleIdCardBackSuccess" :before-upload="beforeUpload">
              <img v-if="form.idCardBack" :src="form.idCardBack" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
        </div>
        <div class="col-md-4">
          <el-form-item :label="$t('user.real_from.idcardhold')" prop="idCardHold">
            <el-upload class="avatar-uploader" action="/api/upload/user/idcard?type=hold" :show-file-list="false" :on-success="handleIdCardHoldSuccess" :before-upload="beforeUpload">
              <img v-if="form.idCardHold" :src="form.idCardHold" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
        </div>
      </div>
      <div class="center" style="text-align: center;">
        <el-button type="primary"  @click="updateReal('form')">{{$t("user.real_from.submit")}}</el-button>
      </div>
    </el-form>
  </div>
  <div style="padding-top: 12px;" v-if="!realNameMode">
    <el-form :model="formPassport" :rules="rules" ref="formPassport" label-position="top" style="margin-top：20px;">
      <el-form-item :label="$t('user.real_from.truename')" prop="realName">
        <el-input v-model="formPassport.realName" style="max-width:220px"></el-input>
      </el-form-item>
      <el-form-item :label="$t('user.real_from.passportNum')" prop="PassportNum">
        <el-input v-model="formPassport.PassportNum" style="max-width:220px"></el-input>
      </el-form-item>
      <div class="row">
        <div class="col-md-4">
          <el-form-item :label="$t('user.real_from.passportImg')" prop="PassportFront">
            <el-upload class="avatar-uploader" action="/api/user/idcard?type=front" :show-file-list="false" :on-success="handlePassportFrontSuccess" :before-upload="beforeUpload">
              <img v-if="formPassport.PassportFront" :src="formPassport.PassportFront" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
        </div>
      </div>
      <div class="center" style="text-align: center;">
        <el-button type="primary"  @click="updateReal('formPassport')">{{$t("user.real_from.submit")}}</el-button>
      </div>
    </el-form>
  </div>
</div>
</template>

<script>
import axios from 'axios'
import {language} from 'lang'

export default {
  name: 'real',
  data () {
    return {
      realNameMode: true,
      form: {
        realName: '',
        idCardNum: '',
        idCardFront: '',
        idCardBack: '',
        idCardHold: ''
      },
      formPassport: {
        realName: '',
        PassportNum: '',
        PassportFront: ''
      },
      rules: {
        realName: [{ required: true, message: language('user.real_from.js.rules.realName'), trigger: 'blur' }],
        idCardNum: [
          { required: true, message: language('user.real_from.js.rules.idCardNum1'), trigger: 'blur' },
          { min: 15, max: 18, message: language('user.real_from.js.rules.idCardNum2'), trigger: 'blur' }
        ],
        idCardFront: [{ required: true, message: language('user.real_from.js.rules.idCardFront'), trigger: 'change' }],
        idCardBack: [{ required: true, message: language('user.real_from.js.rules.idCardBack'), trigger: 'change' }],
        idCardHold: [{ required: true, message: language('user.real_from.js.rules.idCardHold'), trigger: 'change' }],
        PassportNum: [
          { required: true, message: language('user.real_from.js.rules.passportNum'), trigger: 'blur' }
        ],
        PassportFront: [{ required: true, message: language('user.real_from.js.rules.passportFront'), trigger: 'change' }]
      },
      dialogImageUrl: '',
      dialogVisible: false
    }
  },
  mounted: function () {
    this.$nextTick(function () {
      // Code that will run only after the
      // entire view has been rendered
    })
  },
  methods: {
    handlePassportFrontSuccess (res, file) {
      let vm = this
      vm.formPassport.PassportFront = res.path
    },
    handleIdCardFrontSuccess (res, file) {
      let vm = this
      vm.form.idCardFront = res.path
    },
    handleIdCardBackSuccess (res, file) {
      let vm = this
      vm.form.idCardBack = res.path
    },
    handleIdCardHoldSuccess (res, file) {
      let vm = this
      vm.form.idCardHold = res.path
    },
    beforeUpload (file) {
      let vm = this
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG) {
        vm.$notify.error({
          title: language('user.real_from.js.error.type1'),
          message: language('user.real_from.js.error.type2'),
          duration: 2000
        })
      }
      if (!isLt2M) {
        vm.$notify.error({
          title: language('user.real_from.js.error.type1'),
          message: language('user.real_from.js.error.type3'),
          duration: 2000
        })
      }
      return isJPG && isLt2M
    },
    toReal: function () {
      this.$router.push({ path: '/real' })
    },
    updateReal (form) {
      let vm = this
      let idType = ''
      let idForm
      this.$refs[form].validate((valid) => {
        if (!valid) {
          return false
        }
        if (vm.realNameMode) {
          idType = 'idcard'
          idForm = {
            realName: vm.form.realName,
            realType: 'idcard',
            idCardNum: vm.form.idCardNum,
            idCardFront: vm.form.idCardFront,
            idCardBack: vm.form.idCardBack,
            idCardHold: vm.form.idCardHold
          }
        } else {
          idType = 'passport'
          idForm = {
            realName: vm.formPassport.realName,
            realType: 'passport',
            PassportNum: vm.formPassport.PassportNum,
            PassportFront: vm.formPassport.PassportFront
          }
        }
        let url = '/api/user/real?type=' + idType
        console.log(`url:${url}`)
        console.log(idForm)
        axios.post(url, idForm)
          .then(function (response) {
            let rsp = response.data
            if (rsp.code === 0) {
              vm.$notify.success({
                title: language('user.real_from.js.success'),
                message: rsp.message,
                duration: 2000
              })
              setTimeout(() => {
                vm.toReal()
              }, 1000)
            } else {
              vm.$notify.error({
                title: language('user.real_from.js.error.type1'),
                message: rsp.message,
                duration: 2000
              })
            }
          })
          .catch(function (error) {
            console.log(error)
          })
      })
    }
  }
}
</script>

<style>
.real .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
</style>

<style scoped>
.user-form h2 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
  margin-left: 12px;
}
.user-form-title {
  display: flex;
  justify-content: space-between;
}
/* 上传图片 */
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 245px;
  height: 174px;
  line-height: 174px;
  text-align: center;
}
.avatar {
  width: 245px;
  height: 174px;
  display: block;
}
</style>
