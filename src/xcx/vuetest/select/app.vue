<template>
<div class="main">
  <Header location="login"/>
  <div class="container" style="margin-top:100px;">
    <!-- Content here -->
    <!-- filterable -->
    <el-select
      v-model="value10"
      multiple
      allow-create
      filterable
      popper-append-to-body
      default-first-option
      placeholder="请选择文章标签" @change="changeTag" @remove-tag="removeTag">
      <!-- :class="showStr[11-index] === '1' ? '' : 'd-none'" -->
      <el-option
        v-for="(item,index) in options5"
        :key="item.value"
        :label="item.label"
        :value="item.value"
        v-if="showStr[11-index] !== '1' ? '' : 'd-none'">
      </el-option>
    </el-select>
    <el-switch
      style="display: block"
      v-model="value4"
      active-color="#13ce66"
      inactive-color="#ff4949"
      active-text="按月付费"
      inactive-text="按年付费">
    </el-switch>
    <div v-if="value4===true">按月付费</div>  
    <div v-else>按年付费</div> 
  </div>
  <Footer/>
</div>
</template>

<script>
import Header from 'components/header'
import Footer from 'components/footer'
import axios from 'axios'
import $ from 'jquery'
import md5 from 'js-md5'
import * as util from 'assets/js/util.js'
import {language} from 'lang'
var url = '/api/login'
var http = axios.create({
  headers: {'X-Xsrftoken': $('meta[name=_xsrf]').attr('content')}
})
export default {
  name: 'app',
  components: {
    Header,
    Footer
  },
  data () {
    return {
      show:126,
      options5: [{
        value: 1 << 0,
        label: '拒绝'
      }, {
        value: 1 << 1,
        label: 'CSS'
      }, {
        value: 1 << 2,
        label: 'JavaScript'
      }, {
        value: 1 << 3,
        label: 'HTML'
      }, {
        value: 1 << 4,
        label: 'HTML'
      }, {
        value: 1 << 5,
        label: 'HTML'
      }, {
        value: 1 << 6,
        label: 'HTML'
      }],
      value10: [],
      value4: true
    }
  },
  computed:{
    showStr(){
      const BINARY=this.show.toString(2)
      let num=12-BINARY.length
      let result=''
      if(num===0){
        result=BINARY
      }else{
        let zero=''
        for(let i=0;i<num;i++){
          zero=zero+'0'
        }
        result=zero+BINARY
      }
      console.log(result)
      return result
    }
  },
  methods: {
    changeTag:function(e){
      console.log(e)
    },
    removeTag:function(){
      alert('确定要移除吗')
    }
  }
}
</script>

<style>
.login-social {
  margin-top: 16px;
  line-height: 25px;
  color: #8590a6;
  font-size: 14px;
  text-align: center;
}
.login-social p {
  cursor: pointer;
}
.login-socialBun {
  margin-left: 2px;
  transition: opacity 0.3s ease;
}
.login-socialBun a{
  color: #8590a6;
}
.login-socialBun i {
  font-size: 18px;
}
</style>
