import Vue from 'vue'
import VueI18n from 'vue-i18n'
import Cookies from 'js-cookie'
import enLocale from './en'
import zhLocale from './zh'
import DatePicker from 'element-ui/lib/date-picker'
import ColorPicker from 'element-ui/lib/color-picker'
import Select from 'element-ui/lib/select'
import Cascader from 'element-ui/lib/cascader'
import Pagination from 'element-ui/lib/pagination'
// import Messagebox from 'element-ui/lib/message-box'
import Upload from 'element-ui/lib/upload'
import Table from 'element-ui/lib/table'
import ElementLocale from 'element-ui/lib/locale'

Vue.use(VueI18n)
Vue.use(DatePicker)
Vue.use(ColorPicker)
Vue.use(Select)
Vue.use(Cascader)
Vue.use(Pagination)
// Vue.use(Messagebox)
Vue.use(Upload)
Vue.use(Table)

const messages = {
  en: {
    ...enLocale
  },
  zh: {
    ...zhLocale
  }
}

const navigatorLanguage = (navigator.language || navigator.userLanguage).substr(0, 2)
const cookieLanguage = Cookies.get('lang')

export const lang = cookieLanguage || navigatorLanguage || 'en'

const i18n = new VueI18n({
  locale: lang, // set locale
  messages // set locale messages
})

ElementLocale.i18n((key, value) => i18n.t(key, value))

export function language (key) {
  var keys = (lang + '.' + key).split('.')
  var tmp = messages
  for (const e of keys) {
    if (!tmp[e]) {
      return key
    }
    tmp = tmp[e]
  }
  return tmp
}

// 根据语言改变窗口的title
if (lang === 'en') {
  document.title = 'Fanhan Tech Data Service Platform'
} else {
  document.title = '泛函数据平台'
}

export default i18n
