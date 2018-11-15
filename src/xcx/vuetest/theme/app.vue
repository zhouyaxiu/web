<template>
  <div class="main">
    <header :style="{ 'background-color': primaryColor }">
      <ul class="header-operations">
        <li @click="themeDialogVisible = true">{{ langConfig.header.switch[lang] }}</li>
        <li class="header-download" :class="{ 'is-available': canDownload }">
          {{ langConfig.header.download[lang] }}
        </li>
        <li>{{ langConfig.header.helps[lang] }}</li>
        <li>
          <span :class="{ 'is-active': lang === '/zh-CN' }" class="header-lang" @click="switchLang('/zh-CN')">
            中文
          </span>
          <span>/</span>
          <span :class="{ 'is-active': lang === '/en-US' }" class="header-lang" @click="switchLang('/en-US')">
            En
          </span>
        </li>
      </ul>
    </header>
    <el-dialog :visible.sync="themeDialogVisible" title="243" size="tiny">
      <el-form :model="colors" :rules="rules" ref="form" label-position="top" label-width="70px">
        <el-form-item label="243" prop="primary">
          <el-input type="color" v-model="colors.primary" class="color-input"></el-input>
        </el-form-item>
        <el-form-item class="color-buttons">
          <el-button type="primary" @click="submitForm">323</el-button>
          <el-button @click="resetForm">325</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import langConfig from "./lang";
import generateColors from "./color";
import objectAssign from "object-assign";
export default {
  name: "app",
  data() {
    return {
      colors: {
        primary: "#20a0ff"
      },
      primaryColor: "#20a0ff",
      langConfig,
      themeDialogVisible: false
    };
  },
  computed: {
    lang() {
      console.log(this.$route, "this.$route.path");
      return this.$route.path;
    }
  },
  watch: {
    "$route.path": {
      immediate: true,
      handler(val) {
        console.log(val, "valval");
        if (val === "/zh-CN") {
          Vue.config.lang = "zh-cn";
        } else {
          Vue.config.lang = "en";
        }
      }
    }
  },
  methods: {
    switchLang(lang) {
      this.$router.push(lang);
    },
    submitForm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.themeDialogVisible = false;
          this.primaryColor = this.colors.primary;
          this.colors = objectAssign(
            {},
            this.colors,
            generateColors(this.colors.primary)
          );

          // this.canDownload = true;
          // this.writeNewStyle();
        } else {
          return false;
        }
      });
    },
    resetForm() {
      this.$refs.form.resetFields();
    }
  }
};
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
.login-socialBun a {
  color: #8590a6;
}
.login-socialBun i {
  font-size: 18px;
}
</style>
