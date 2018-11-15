let T = {}
T.locale = null
T.locales = {}
// T.langCode=['zh', 'en']
// let index = 1
T.registerLocale = function (locales) {
    T.locales = locales;
}
T.setLocale = function (code) {
    T.locale = code
}
// T.setLocaleByIndex = function (index) {
//     lastLangIndex = index;
//     T.setLocale(T.langCode[index]);
//     setTabBarLang(index);
// }

// T.getLanguage = function () {
//     console.log(T.locales[T.locale])
//     return T.locales[T.locale];
// }
let navigationBarTitles = [
    "泛函科技",
    'Fanhan Tech'
]
T.setNavigationBarTitle = function() {
    wx.setNavigationBarTitle({
      title: navigationBarTitles[index]
    })
  }

T._ = function (line, data) {
    const locale = T.locale
    const locales = T.locales
    if (locale && locales[locale] && locales[locale][line]) {
        line = locales[locale][line]
    }
    return line
}

// export default T
module.exports = {
    T: T
}

