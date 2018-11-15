<template>
<div style="max-width: 1000px;">
    <el-card class="box-card" v-if="wholeQues.length>0">
        <div style="margin:0 auto; max-width:710px">
          <!-- 整图问题 -->
          <div v-for="(item, qIndex) in wholeQues" :key="qIndex" style="margin-bottom:15px">
            <p>{{qIndex+1}}. {{item.title}}</p>
            <div v-for="(label, lIndex) in item.labels" :key="lIndex">
              <!-- 单选 -->
              <el-radio v-if="item.type === 1"
              v-model="wholeRes[qIndex].choices[0]"
              :label="lIndex" >{{label.name}}</el-radio>
              <!-- 多选 -->
              <el-checkbox v-if="item.type === 2"
                v-model="wholeRes[qIndex].choices"
                :label="lIndex">{{label.name}}</el-checkbox>
            </div>
            <!-- 下拉框 -->
            <el-select v-model="wholeRes[qIndex].choices[0]" placeholder="请选择" v-if="item.type === 5">
              <el-option
                v-for="(label, lIndex) in item.labels"
                :key="lIndex"
                :label="label.name"
                :value="lIndex">
              </el-option>
            </el-select>
            <!-- 滑块 -->
            <el-slider
              style="max-width:350px"
              v-if="item.type === 4"
              v-model="wholeRes[qIndex].choices[0]"
              show-input>
            </el-slider>
            <!-- 填空 -->
            <el-input v-model="wholeRes[qIndex].text" placeholder="请输入内容" v-if="item.type === 3" style="max-width:350px"></el-input>
          </div>
        </div>
    </el-card>
    <el-row :gutter="20" class="photos">
      <div class="photos-con">
        <el-col class="box" :span="8" v-for="(img,index) in imgUrl" :key="index">
          <el-card :body-style="{ padding: '0px' }">
            <img :src="img.raw" class="image" @click="showTemplate(img.raw)">
            <div class="item-btn">
              <el-button type="text" @click="showTemplate(img.raw)">预览</el-button><br/>
            </div>
          </el-card>
          <!-- 标注项 -->
          <div class="item-ques">
            <div v-for="(item, qIndex) in itemQues" :key="qIndex" style="margin-bottom:15px">
              <p>{{qIndex+1}}. {{item.title}}</p>
              <div v-for="(label, lIndex) in item.labels" :key="lIndex">
                <!-- 单选 -->
                <el-radio v-if="item.type === 1"
                v-model="itemRes[index].res[qIndex].choices[0]"
                :label="lIndex" >{{label.name}}</el-radio>
                <!-- 多选 -->
                <el-checkbox v-if="item.type === 2"
                  v-model="itemRes[index].res[qIndex].choices"
                  :label="lIndex">{{label.name}}</el-checkbox>
              </div>
              <!-- 下拉框 -->
              <el-select v-model="itemRes[index].res[qIndex].choices[0]" placeholder="请选择" v-if="item.type === 5">
                <el-option
                  v-for="(label, lIndex) in item.labels"
                  :key="lIndex"
                  :label="label.name"
                  :value="lIndex">
                </el-option>
              </el-select>
              <!-- 滑块 -->
              <el-slider
                v-if="item.type === 4"
                v-model="itemRes[index].res[qIndex].choices[0]"
                show-input>
              </el-slider>
              <!-- 填空 -->
              <el-input v-model="itemRes[index].res[qIndex].text" placeholder="请输入内容" v-if="item.type === 3"></el-input>
            </div>
          </div>
        </el-col>
      </div>
    </el-row>
    <div v-show="CommentVisible">
      <div>备注:</div>
      <div id="editor"></div>
    </div>
    <slot></slot>
    <div class="d-flex justify-content-end fh-magin-bottom" v-if="PostButtonVisible === true">
      <el-button type="success" @click="postTask">提交</el-button>
    </div>
</div>
</template>

<script>
import Header from 'components/header'
import Footer from 'components/footer'
import Quill from 'quill'
// import {language} from 'lang'

export default {
  name: 'app',
  props: {
    wholeQues: Array,
    itemQues: Array,
    PostButtonVisible: {
      type: Boolean,
      default: true
    },
    CommentVisible: {
      type: Boolean,
      default: false
    },
    CommentReadOnly: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      imgUrl: [],
      quill: {},
      wholeRes: [],
      itemRes: [],
      radioContents: []
    }
  },
  components: {
    Header,
    Footer
  },
  watch: {
    /*
    * 使用场景：发布任务
    * 根据传入wholeQues的个数进行循环对应wholeRes个数
    * 执行条件：wholeQues个数实时变化时
    */
    wholeQues: function () {
      this.wholeRes = []
      this.wholeQues.forEach((currentValue, index) => {
        this.wholeRes.push({
          type: currentValue.type,
          choices: [],
          text: ''
        })
      })
    },
    /*
    * 使用场景：发布任务
    * 根据传入itemQues的个数进行循环对应itemRes个数
    * 执行条件：itemQues个数实时变化时
    */
    itemQues: function () {
      this.itemRes = []
      this.imgUrl.forEach((currentValue, index) => {
        let item = {
          res: []
        }
        this.itemQues.forEach((currentValue, index) => {
          item.res.push({
            type: currentValue.type,
            choices: [],
            text: ''
          })
        })
        this.itemRes.push(item)
      })
    },
    imgUrl: function () {
      let vm = this
      if (!vm.itemRes) {
        vm.itemRes = []
      }
      vm.imgUrl.forEach((currentValue, index) => {
        if (vm.itemRes[index]) {
          return
        }
        let item = {
          res: []
        }
        this.itemQues.forEach((currentValue, index) => {
          item.res.push({
            type: currentValue.type,
            choices: [],
            text: ''
          })
        })
        this.itemRes.push(item)
      })
    }
  },
  mounted: function () {
    let vm = this
    // 初始化编辑器
    vm.quill = new Quill('#editor', {
      placeholder: '请输入...',
      modules: {
        toolbar: ['bold', 'italic', 'underline', 'strike']
      },
      theme: 'snow'
    })
    if (vm.CommentReadOnly === 'true') {
      vm.quill.enable(false)
    }
  },
  methods: {
    load (datas, result, comments) {
      console.log(result)
      let vm = this
      vm.imgUrl = datas
      if (result) {
        if (result.wholeRes) {
          vm.wholeRes = result.wholeRes
        }
        if (result.itemRes) {
          vm.itemRes = result.itemRes
        }
      }
      console.log(vm.itemRes)
      if (comments) {
        vm.quill.setText(comments)
      } else {
        vm.quill.setText('')
      }
      vm.$forceUpdate()
    },
    valid () {
      return true
    },
    // 预览图片
    showTemplate (url) {
      this.$alert(`<div><img src='${url}' alt='task-img' style='width: 100%'></div>`, '预览', {
        dangerouslyUseHTMLString: true,
        confirmButtonText: '关闭',
        customClass: 'tool'
      })
    },
    getComment: function () {
      return this.quill.getText()
    },
    getResult: function () {
      const vm = this
      let result = {
        wholeRes: vm.wholeRes,
        itemRes: vm.itemRes
      }
      return result
    },
    postTask (form) {
      const vm = this
      let params = {
        result: vm.getResult(),
        commit: vm.quill.getText()
      }
      this.$emit('postTask', params)
    }
  }
}
</script>

<style scoped>
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
  .box{
    margin-bottom: 10px;
    display: -webkit-flex;
    display: flex;
    -webkit-flex-wrap: wrap;
    flex-wrap: wrap;
    /* align-items: center;
    justify-content: center */
  }
  .item-btn{
    display: none;
  }
  .photos .box{
    background: #fff;
    box-shadow: 0 0 0 2px #f0f0f0;
    margin-bottom: 20px;
    border-radius: 10px;
    position: relative;
    padding:10px 0 60px;
  }
  .photos .box .el-radio-group{
    position: absolute;
    bottom: 10px;
  }
  .box .el-card{
    position: relative;
  }
  .box .el-card .el-card__body:hover .item-btn{
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
  .box:hover .item-btn button{
    color:#fff;
  }
  .item-ques {
    width:100%;
    box-sizing: border-box;
    padding: 5%;
  }

</style>
