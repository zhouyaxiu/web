<template>
<div class="archives">
  <h2>个人档案</h2>
  <div class="user-form-list" v-bind:class="{ active: status.sexStatus }">
    <div class="user-list-label">性别</div>
    <div class="user-list-content" v-if = "status.sexStatus === 0">{{getGender}}</div>
    <div class="user-list-edit" v-if = "status.sexStatus === 0" @click="modifyState('sexStatus', 'sexForm')">编辑</div>
    <div class="user-list-content" v-if = "status.sexStatus === 1">
      <el-form :model="sexForm" ref="sexForm" :rules="rules">
        <el-form-item prop="gender">
          <el-select v-model="sexForm.gender" placeholder="您的性别" size="small">
            <el-option label="男" value="1"></el-option>
            <el-option label="女" value="2"></el-option>
          </el-select>
        </el-form-item>
        <div class="user-list-btn">
          <el-form-item>
            <el-button type="primary" @click="submitForm('sexStatus', 'sexForm')" size="small">确定</el-button>
            <el-button size="small" @click="resetForm ('sexStatus', 'sexForm')">取消</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
  <div class="user-form-list" v-bind:class="{ active: status.birthStatus }">
    <div class="user-list-label">出生日期</div>
    <div class="user-list-content" v-if = "status.birthStatus === 0">{{getBirthday}}</div>
    <div class="user-list-edit" v-if = "status.birthStatus === 0" @click="modifyState('birthStatus', 'birthForm')">编辑</div>
    <div class="user-list-content" v-if = "status.birthStatus === 1">
      <el-form :model="birthForm" ref="birthForm" :rules="rules">
        <el-form-item prop="birthday">
          <el-date-picker
            v-model="birthForm.birthday"
            type="date"
            placeholder="您的出生日期"
            size="small"
            value-format="timestamp">
          </el-date-picker>
        </el-form-item>
        <div class="user-list-btn">
          <el-form-item>
            <el-button type="primary" @click="submitForm('birthStatus', 'birthForm')" size="small">确定</el-button>
            <el-button size="small" @click="resetForm ('birthStatus', 'birthForm')">取消</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
  <div class="user-form-list" v-bind:class="{ active: status.areaStatus }">
    <div class="user-list-label">所在地</div>
    <div class="user-list-content" v-if = "status.areaStatus === 0">
      {{profile.location.country === '' ? '您的所在地' : profile.location.country +'/'+profile.location.province}}
    </div>
    <div class="user-list-edit" v-if = "status.areaStatus === 0" @click="modifyState('areaStatus', 'areaForm')">编辑</div>
    <div class="user-list-content" v-if = "status.areaStatus === 1">
      <el-form :model="areaForm" ref="areaForm" :rules="rules">
        <el-form-item prop="location">
          <el-cascader :options="locationList" v-model="areaForm.location" placeholder="您的所在地"></el-cascader>
        </el-form-item>
        <div class="user-list-btn">
          <el-form-item>
            <el-button type="primary" @click="submitForm('areaStatus', 'areaForm')" size="small">确定</el-button>
            <el-button size="small" @click="resetForm ('areaStatus', 'areaForm')">取消</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
  <div class="user-form-list" v-bind:class="{ active: status.nationStatus }">
    <div class="user-list-label">国籍</div>
    <div class="user-list-content" v-if = "status.nationStatus === 0">
      {{profile.nationality === '' ? '您的国籍' : profile.nationality}}
    </div>
    <div class="user-list-edit" v-if = "status.nationStatus === 0" @click="modifyState('nationStatus', 'nationForm')">编辑</div>
    <div class="user-list-content" v-if = "status.nationStatus === 1">
      <el-form :model="nationForm" ref="nationForm" :rules="rules">
        <el-form-item prop="nationality">
          <el-select v-model="nationForm.nationality" placeholder="您的国籍" size="small">
            <el-option v-for="item in nationalityList" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <div class="user-list-btn">
          <el-form-item>
            <el-button type="primary" @click="submitForm('nationStatus', 'nationForm')" size="small">确定</el-button>
            <el-button size="small" @click="resetForm ('nationStatus', 'nationForm')">取消</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
  <div class="user-form-list" v-bind:class="{ active: status.raceStatus }">
    <div class="user-list-label">种族</div>
    <div class="user-list-content" v-if = "status.raceStatus === 0">
      {{profile.ethnicity === '' ? '您的种族' : profile.ethnicity}}
    </div>
    <div class="user-list-edit" v-if = "status.raceStatus === 0" @click="modifyState('raceStatus', 'raceForm')">编辑</div>
    <div class="user-list-content" v-if = "status.raceStatus === 1">
      <el-form :model="raceForm" ref="raceForm" :rules="rules">
        <el-form-item prop="ethnicity">
          <el-select v-model="raceForm.ethnicity" placeholder="您的种族" size="small">
            <el-option label="白种人" value="白种人"></el-option>
            <el-option label="黑种人" value="黑种人"></el-option>
            <el-option label="黄种人" value="黄种人"></el-option>
          </el-select>
        </el-form-item>
        <div class="user-list-btn">
          <el-form-item>
            <el-button type="primary" @click="submitForm('raceStatus', 'raceForm')" size="small">确定</el-button>
            <el-button size="small" @click="resetForm ('raceStatus', 'raceForm')">取消</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
  <div class="user-form-list" v-bind:class="{ active: status.marrStatus }">
    <div class="user-list-label">婚姻状态</div>
    <div class="user-list-content" v-if = "status.marrStatus === 0">{{getMarital}}</div>
    <div class="user-list-edit" v-if = "status.marrStatus === 0" @click="modifyState('marrStatus', 'marrForm')">编辑</div>
    <div class="user-list-content" v-if = "status.marrStatus === 1">
      <el-form :model="marrForm" ref="marrForm" :rules="rules">
        <el-form-item prop="marital">
          <el-select v-model="marrForm.marital" placeholder="您的婚姻状态" size="small">
            <el-option label="未婚" value="1"></el-option>
            <el-option label="已婚" value="2"></el-option>
          </el-select>
        </el-form-item>
        <div class="user-list-btn">
          <el-form-item>
            <el-button type="primary" @click="submitForm('marrStatus', 'marrForm')" size="small">确定</el-button>
            <el-button size="small" @click="resetForm ('marrStatus', 'marrForm')">取消</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
  <div class="user-form-list" v-bind:class="{ active: status.langStatus }">
    <div class="user-list-label">母语</div>
    <div class="user-list-content" v-if = "status.langStatus === 0">
      {{profile.motherLanguage === '' ? '您的母语' : profile.motherLanguage}}
    </div>
    <div class="user-list-edit" v-if = "status.langStatus === 0" @click="modifyState('langStatus', 'langForm')">编辑</div>
    <div class="user-list-content" v-if = "status.langStatus === 1">
      <el-form :model="langForm" ref="langForm" :rules="rules">
        <el-form-item prop="motherLanguage">
          <el-select v-model="langForm.motherLanguage" placeholder="您的母语" size="small">
            <el-option
              v-for="(language,index) in languages"
              :key="index"
              :label="language"
              :value="language">
            </el-option>
          </el-select>
        </el-form-item>
        <div class="user-list-btn">
          <el-form-item>
            <el-button type="primary" @click="submitForm('langStatus', 'langForm')" size="small">确定</el-button>
            <el-button size="small" @click="resetForm ('langStatus', 'langForm')">取消</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
  <div class="user-form-list" v-bind:class="{ active: status.educateStatus }">
    <div class="user-list-label">学历</div>
    <div class="user-list-content" v-if = "status.educateStatus === 0">
      {{profile.education === '' ? '您的学历' : profile.education}}
    </div>
    <div class="user-list-edit" v-if = "status.educateStatus === 0" @click="modifyState('educateStatus')">编辑</div>
    <div class="user-list-content" v-if = "status.educateStatus === 1">
      <el-form :model="educateForm" ref="educateForm" :rules="rules">
        <el-form-item prop="education">
          <el-select v-model="educateForm.education" placeholder="您的学历" size="small">
            <el-option label="初中" value="初中"></el-option>
            <el-option label="高中" value="高中"></el-option>
            <el-option label="大专" value="大专"></el-option>
            <el-option label="本科" value="本科"></el-option>
            <el-option label="研究生" value="研究生"></el-option>
            <el-option label="博士" value="博士"></el-option>
          </el-select>
        </el-form-item>
        <div class="user-list-btn">
          <el-form-item>
            <el-button type="primary" @click="submitForm('educateStatus', 'educateForm')" size="small">确定</el-button>
            <el-button size="small" @click="resetForm ('educateStatus', 'educateForm')">取消</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
  <div class="user-form-list" v-bind:class="{ active: status.industryStatus }">
    <div class="user-list-label">行业</div>
    <div class="user-list-content" v-if = "status.industryStatus === 0">
      {{profile.industry === '' ? '您的行业' : profile.industry}}
    </div>
    <div class="user-list-edit" v-if = "status.industryStatus === 0" @click="modifyState('industryStatus')">编辑</div>
    <div class="user-list-content" v-if = "status.industryStatus === 1">
      <el-form :model="industryForm" ref="industryForm" :rules="rules">
        <el-form-item prop="industry">
          <el-select v-model="industryForm.industry" placeholder="您的行业" size="small">
            <el-option label="互联网" value="互联网"></el-option>
            <el-option label="金融" value="金融"></el-option>
            <el-option label="教育" value="教育"></el-option>
            <el-option label="服务" value="服务"></el-option>
          </el-select>
        </el-form-item>
        <div class="user-list-btn">
          <el-form-item>
            <el-button type="primary" @click="submitForm('industryStatus', 'industryForm')" size="small">确定</el-button>
            <el-button size="small" @click="resetForm ('industryStatus', 'industryForm')">取消</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
  <div class="user-form-list" v-bind:class="{ active: status.incomeStatus }">
    <div class="user-list-label">收入</div>
    <div class="user-list-content" v-if = "status.incomeStatus === 0">
      {{profile.income === '' ? '您的收入' : profile.income}}
    </div>
    <div class="user-list-edit" v-if = "status.incomeStatus === 0" @click="modifyState('incomeStatus')">编辑</div>
    <div class="user-list-content" v-if = "status.incomeStatus === 1">
      <el-form :model="incomeForm" ref="incomeForm" :rules="rules">
        <el-form-item prop="income">
          <el-select v-model="incomeForm.income" placeholder="您的收入" size="small">
            <el-option label="1000以下" value="1000以下"></el-option>
            <el-option label="1000~3000" value="1000~3000"></el-option>
            <el-option label="3000~5000" value="3000~5000"></el-option>
            <el-option label="5000以上" value="5000以上"></el-option>
          </el-select>
        </el-form-item>
        <div class="user-list-btn">
          <el-form-item>
            <el-button type="primary" @click="submitForm('incomeStatus', 'incomeForm')" size="small">确定</el-button>
            <el-button size="small" @click="resetForm ('incomeStatus', 'incomeForm')">取消</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
  <h2 class="mt-20">技能展示</h2>
  <div class="user-form-list" v-bind:class="{ active: status.skillLangStatus }">
    <div class="user-list-label">擅长的语言</div>
    <div class="user-list-content" v-if = "status.skillLangStatus === 0">{{profile.language}}</div>
    <div class="user-list-edit" v-if = "status.skillLangStatus === 0" @click="modifyState('skillLangStatus')">编辑</div>
    <div class="user-list-content" v-if = "status.skillLangStatus === 1">
      <el-form :model="skillLangForm" ref="skillLangForm" :rules="rules">
        <el-form-item prop="language">
          <el-select class="skill-lang-select" v-model="skillLangForm.language" multiple filterable allow-create default-first-option placeholder="您擅长的语言" size="small">
            <el-option v-for="(language,index) in languages" :key="index" :label="language" :value="language">
            </el-option>
          </el-select>
        </el-form-item>
        <div class="user-list-btn">
          <el-form-item>
            <el-button type="primary" @click="submitForm('skillLangStatus', 'skillLangForm')" size="small">确定</el-button>
            <el-button size="small" @click="resetForm ('skillLangStatus', 'skillLangForm')">取消</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
</div>
</template>

<script>
import axios from 'axios'
import locations from './locations'
import nationalitys from './nationalitys'
import languages from './language'
import {language} from 'lang'

let http = axios.create()
export default {
  name: 'archives',
  data () {
    return {
      locationList: locations,
      nationalityList: nationalitys,
      languages: languages,
      // 显示
      profile: {
        username: '-',
        gender: '',
        birthday: '',
        location: {
          country: '',
          province: ''
        },
        nationality: '',
        ethnicity: '',
        marital: '',
        motherLanguage: '',
        education: '',
        industry: '',
        income: '',
        language: '您擅长的语言'
      },
      // 开关状态
      status: {
        sexStatus: 0,
        birthStatus: 0,
        areaStatus: 0,
        nationStatus: 0,
        raceStatus: 0,
        marrStatus: 0,
        langStatus: 0,
        educateStatus: 0,
        industryStatus: 0,
        incomeStatus: 0,
        skillLangStatus: 0
      },
      sexForm: {
        gender: ''
      },
      birthForm: {
        birthday: ''
      },
      areaForm: {
        location: []
      },
      nationForm: {
        nationality: ''
      },
      raceForm: {
        ethnicity: ''
      },
      marrForm: {
        marital: ''
      },
      langForm: {
        motherLanguage: ''
      },
      educateForm: {
        education: ''
      },
      industryForm: {
        industry: ''
      },
      incomeForm: {
        income: ''
      },
      skillLangForm: {
        language: []
      },
      rules: {
        gender: [{type: 'string', required: true, message: '不能为空'}],
        nationality: [{type: 'string', required: true, message: '不能为空'}],
        ethnicity: [{type: 'string', required: true, message: '不能为空'}],
        marital: [{type: 'string', required: true, message: '不能为空'}],
        motherLanguage: [{type: 'string', required: true, message: '不能为空'}],
        education: [{type: 'string', required: true, message: '不能为空'}],
        industry: [{type: 'string', required: true, message: '不能为空'}],
        income: [{type: 'string', required: true, message: '不能为空'}],
        language: [{type: 'array', required: true, message: '不能为空'}],
        birthday: [{type: 'number', required: true, message: '不能为空'}],
        location: [{type: 'array',
          required: true,
          len: 2,
          fields: {
            0: {type: 'string', required: true, message: '1不能为空'},
            1: {type: 'string', required: true, message: '2不能为空'}
          }
        }]
      }
    }
  },
  computed: {
    getGender () {
      // console.log(this.profile)
      if (this.profile.gender && this.profile.gender === 1) {
        return language('user.profile.js.man')
      } else if (this.profile.gender && this.profile.gender === 2) {
        return language('user.profile.js.woman')
      } else {
        return '您的性别'
      }
    },
    getMarital () {
      if (this.profile.marital === 1) {
        return language('user.profile.js.marital1')
      } else if (this.profile.marital === 2) {
        return language('user.profile.js.marital2')
      } else {
        return '您的婚姻状态'
      }
    },
    getBirthday () {
      if (this.profile.birthday === '') {
        return '您的出生日期'
      } else {
        let res = new Date(this.profile.birthday * 1000)
        return res.getFullYear() + '-' + (res.getMonth() + 1) + '-' + res.getDate()
      }
    }
  },
  mounted: function () {
    const vm = this
    this.$nextTick(function () {
      // Code that will run only after the
      // entire view has been rendered
      vm.getProfile()
    })
  },
  methods: {
    modifyState (statusName, formName) {
      let statusArr = this.status
      for (let key in statusArr) {
        statusArr[key] = 0
      }
      statusArr[statusName] = 1
    },
    resetForm (statusName, formName, theStatus = 0) {
      let statusArr = this.status
      let name = Object.keys(this[formName])[0]
      this[formName][name] = ''
      statusArr[statusName] = theStatus
    },
    getProfile () {
      const vm = this
      http.get('/api/user/profile')
        .then(function (response) {
          let rsp = response.data
          let data = rsp.data
          console.log(rsp)
          vm.profile = {
            username: data.username,
            gender: data.gender,
            birthday: data.birthday,
            nationality: data.nationality,
            ethnicity: data.ethnicity,
            marital: data.marital,
            motherLanguage: data.motherLanguage,
            education: data.education,
            industry: data.industry,
            income: data.income,
            language: data.language
          }
          vm.profile.location = {
            country: data.country,
            province: data.province
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    submitRes () {
      let res = {}
      return res
    },
    submitForm (statusName, formName) {
      const vm = this
      this.$refs[formName].validate((valid) => {
        // 表单验证
        if (!valid) {
          return false
        }
        let url = '/api/user/profile/update'
        let jsonVal, jsonInfo
        let name = Object.keys(vm[formName])[0]
        let oldVal = vm[formName][name] // 表单中的值
        console.log(name, oldVal)
        if (name === 'location') {
          jsonInfo = {
            country: oldVal[0],
            province: oldVal[1]
          }
        } else {
          let jsonStr = `{ "${name}": "" }`
          jsonInfo = JSON.parse(jsonStr)
          if (name === 'birthday') {
            jsonVal = oldVal / 1000
          } else if (name === 'gender' || name === 'marital') {
            jsonVal = Number(oldVal)
          } else if (name === 'language') {
            jsonVal = oldVal.join(',')
          } else {
            jsonVal = oldVal
          }
          jsonInfo[name] = jsonVal
        }
        console.log('result', jsonInfo)
        oldVal = ''
        http.post(url, jsonInfo)
          .then(function (response) {
            let rsp = response.data
            if (rsp.code === 0) {
              vm.$notify.success({
                title: '成功',
                message: rsp.message,
                duration: 2000
              })
              if (name === 'location') {
                vm.profile.location = {
                  country: jsonInfo.country,
                  province: jsonInfo.province
                }
                console.log(vm.profile)
              } else {
                vm.profile[name] = jsonVal
              }
              vm.status[statusName] = 0
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
    }
  }
}
</script>

<style scoped>
.mt-20 {margin-top: 20px;}
.user-form h2 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
  margin-left: 12px;
}
.user-form-list {
  border-bottom: 1px solid #eee;
  display: flex;
  padding: 12px;
  box-sizing: border-box;
}
/* 单行 */
.user-list-label {
  width: 200px;
}
.user-list-content {
  flex: 1;
  color: #797979;
}
.user-list-edit {
  color: #409EFF;
  cursor: pointer;
  padding-left: 20px;
}
@media only screen and (max-width: 768px) {
  .user-list-label {
    width: auto;
    flex: 1;
  }
  .user-list-content {
    flex: 2;
  }
}
.user-list-btn {
  margin-top: 12px;
}
.active {
  background-color: #eee;
}
.skill-lang-select {
  width: 100%;
}
</style>
