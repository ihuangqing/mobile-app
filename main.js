import Vue from 'vue'
import App from './App'
// import axios from 'axios'
import store from './store'

Vue.config.productionTip = false

App.mpType = 'app'

// 引入全局mixin
import mixin from './static/mixin.js'
Vue.use(mixin)

// 引入全局uView
import uView from 'uview-ui'
Vue.use(uView)

// 引入语言包
import zh from '@/common/locales/zh.js'
import en from '@/common/locales/en.js'

// 引入vue-i18n
import VueI18n from 'vue-i18n'
Vue.use(VueI18n)

// #ifdef H5
window.wx = {}
// #endif

// 构造i18n对象
const i18n = new VueI18n({
	locale: 'zh',
	messages: {
		'zh': zh,
		'en': en
	}
})

// 引入全局的store对象
Vue.prototype.$store = store

const app = new Vue({
	...App,
	store,
	i18n
})

// 引入全局公用数据获取方法
import baseData from '@/common/baseData.js'
Vue.prototype.baseData = baseData

// 引入全局公共方法
import common from '@/common/common.js'
Vue.prototype.common = common

// http拦截器，此为需要加入的内容，如果不是写在common目录，请自行修改引入路径
import httpInterceptor from '@/common/http.interceptor.js'
// 这里需要写在最后，是为了等Vue创建对象完成，引入"app"对象(也即页面的"this"实例)
Vue.use(httpInterceptor, app)

// http接口API集中管理引入部分
import httpApi from '@/common/http.api.js'
Vue.use(httpApi, app)


app.$mount()
