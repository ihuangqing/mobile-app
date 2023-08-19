import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const server = {
	test: 'http://10.201.88.40:8010', //测试环境
	// test: 'http://172.27.244.243:8010', //测试环境(动力)
	// test: 'https://msplatform-test.sunwoda.com', //测试环境 域名地址
	dev: 'http://10.201.88.43:8010', //开发环境
	prod: 'https://msplatform.sunwoda-evb.com:443', //正式环境
	pmes_test: 'http://172.30.7.252:10001', //pmes测试环境服务地址 .net服务
	pmes_prod: 'http://pmesapi.sunwoda-evb.com', //pmes正式环境服务地址 .net服务
	pmes_testOfJava: 'http://10.210.86.234:8091', //pmes测试环境服务地址  java服务
	// pmes_testOfJava: 'http://172.27.226.42:8081',//pmes测试环境服务地址  房志坪本地java服务  
	pmes_prodOfJava: 'https://pmeswebapi.sunwoda-evb.com', //pmes正式环境服务地址  java服务
	wms_test: 'http://gateway-dev.sunwoda-evb.com/api', //wms测试环境
	wms_prod: '', //wms正式环境
}

const store = new Vuex.Store({
	state: {
		// baseUrl: server.test, //微服务服务地址
		// baseUrl: server.dev,
		baseUrl: server.prod,
		// pmesUrl: server.pmes_test, //pmes服务地址
		pmesUrl: server.pmes_prod, //pmes服务地址
		// pmesUrlOfJava: server.pmes_testOfJava,
		pmesUrlOfJava: server.pmes_prodOfJava,
		wmsUrl: server.wms_test,
		appName: 'sws', //系统标识 sws dips
		language: 'zh',
		version: '', //应用版本号
		sysInfo: {}, //硬件系统信息
		userInfo: {}, //用户登录信息
		hasLogin: false, //登录状态
		dutyInfo: {}, //人员在岗信息
		historyUserList: [], //历史登录人员列表
		nearestApps: {}, // 以username为key，value为常用应用列表 {'admin': []}
		menuApps: [], //登录之后拥有权限的功能模块，用于快速检索
		getLines: false, //获取拉线数据接口状态，默认未获取
		getDirector: false, //获取主管数据接口的状态，默认未获取
		hasNoReadMsg: false, //是否有未读消息,
		pushMsgInfo: {
			userNo: '', //mes登录工号
			deviceSn: '', //mes登录设备
			moNo: '' //mes登录制令单号
		}, //消息推送信息  cid 
		cacheFileSize: 30720,
		mesSessionId: 0, //mes系统二次登录保存会话id
		mesLoginInfo: {}, //mes登录信息
		factoryId: '',
		factoryName: '',
		mesHistoryUserList: [], //mes系统登录 历史登录人员列表
	},
	getters: {
		appVer(state) {
			// #ifdef APP-PLUS
			if (!state.version) {
				state.version = uni.getSystemInfoSync().appWgtVersion
			}
			return state.version
			// #endif
			// #ifdef H5
			return '9.9.9'
			// #endif
		}
	},
	mutations: {
		login(state, provider) {
			state.hasLogin = true
			state.Authorization = `Bearer ${provider.access_token}`
			state.userInfo = provider
			state.mesSessionId = 0 //智慧现场每次重新登录，重置mes二次登录状态
			state.pushMsgInfo = { //智慧现场每次重新登录，重置mes二次登录信息
				userNo: '', //mes登录工号
				deviceSn: '', //mes登录设备
				moNo: '' //mes登录制令单号
			}
			uni.setStorage({
				key: 'userInfo',
				data: state.userInfo
			})
		},
		logout(state) { //登出状态修改
			state.language = ''
			state.hasLogin = false
			state.getLines = false
			state.getDirector = false
			state.userInfo = {}
			state.dutyInfo = {}
			uni.removeStorage({
				key: 'userInfo'
			});
		},
		updateUserInfo(state, provider) { //更新用户信息
			state.userInfo = {
				...state.userInfo,
				...provider
			}
		},
		updateMesSessionId(state, provider) {
			state.mesSessionId = provider
		},
		updateMesLoginInfo(state, provider) {
			state.mesLoginInfo = provider
		},
		updateHeader(state, provider) {
			state.language = provider.language
			state.factoryId = provider.factoryId
			state.factoryName = provider.factoryName
		},
		saveSysInfo(state, provider) { // 保存硬件系统信息到state 和 storage 中
			state.sysInfo = provider
		},
		saveDutyInfo(state, provider) { //保存登录人员在岗信息
			state.dutyInfo = provider
		},
		setHistoryUser(state, provider) { //保存历史登录人员信息
			let isExist = state.historyUserList.find((item) => {
				return item.value === provider.value
			})
			if (!isExist) { //如果历史未登录过，则存储
				state.historyUserList.push(provider)
				uni.setStorage({
					key: 'historyUser',
					data: state.historyUserList
				})
			}
		},
		getHistoryUser(state) { //获取历史登录人员信息
			uni.getStorage({
				key: 'historyUser',
				success: (res) => {
					state.historyUserList = res.data
				}
			})
		},
		clearHistoryUser(state) {
			state.historyUserList = []
		},
		setMesHistoryUser(state, provider) { //保存历史登录人员信息
			const index = state.mesHistoryUserList.findIndex((item) => item.userNo === provider.userNo)
			if (index !== -1) { //如果历史登录过，则更新指令单和设备编号
				state.mesHistoryUserList.splice(index, 1, provider)
			} else { //如果历史未登录过，则存储
				state.mesHistoryUserList.push(provider)
			}
			uni.setStorage({
				key: 'mesHistoryUser',
				data: state.mesHistoryUserList
			})
		},
		getMesHistoryUser(state) { //获取历史登录人员信息
			uni.getStorage({
				key: 'mesHistoryUser',
				success: (res) => {
					state.mesHistoryUserList = res.data
				}
			})
		},
		clearMesHistoryUser(state) {
			state.mesHistoryUserList = []
		},
		/* 
			保存常用应用逻辑
			根据登录人保存，保存格式
			nearestApps = {
				'key': value,  key为登录人工号，value为常用列表数组 {count: 使用次数, ...应用信息}
				'admin': [],
				'2104260226': []
			}
		*/
		setNearestApps(state, provider) {
			if (!state.nearestApps[state.userInfo.account]) {
				state.nearestApps[state.userInfo.account] = []
			} //当前登录人员常用应用列表
			let isExist = state.nearestApps[state.userInfo.account].find((item,
				index) => { //判断新增应用是否在常用应用列表，如果存在则使用次数+1
				if (!item.menuName) { //处理历史数据问题字段不对应问题
					item.menuName = item.name
				}
				if (item.menuName === provider.menuName) {
					item.count++
					return true
				} else {
					return false
				}
			})
			if (!isExist) { //如果不存在则基使用次数1并直接push
				if (state.nearestApps[state.userInfo.account].length === 9) { //最多存储9个，超过9个则删除最后一个
					state.nearestApps[state.userInfo.account].pop()
				}
				state.nearestApps[state.userInfo.account].push({
					count: 1,
					...provider
				})
			}

			// 因为先更新state了，所以存储可以用异步
			uni.setStorage({
				key: 'nearestApps',
				data: state.nearestApps
			})
		},
		getNearestApps(state) { //获取常用应用 如果获取太慢，可以改成同步模式
			const res = uni.getStorageSync('nearestApps')
			let key = state.userInfo.account
			if (key && res[key]) {
				state.nearestApps[key] = res[key].sort((a, b) => {
					return b.count - a.count //按照使用次数逆序
				})
			}
		},
		clearNearestApps(state) {
			state.nearestApps[state.userInfo.account] = []
		},
		updateGetLines(state) { //更新获取拉线接口的状态
			state.getLines = true
		},
		updateGetDirector(state) { //更新获取主管接口的状态
			state.getDirector = true
		},
		changeBaseUrl(state, provider) {
			switch (provider) {
				case 0:
					state.baseUrl = server.test
					break;
				case 1:
					state.baseUrl = server.dev
					break;
				case 2:
					state.baseUrl = server.prod
					break;
			}
		},
		updateAppName(state, provider) {
			state.appName = provider
		},
		updateAppVer(state, provider) {
			state.version = provider.version
			provider.cb()
		},
		updateMsgStatus(state, provider) {
			state.hasNoReadMsg = provider
		},
		setPushMsgInfo(state, provider) {
			state.pushMsgInfo = provider
		},
		setCacheFileSize(state, provider) { //设置缓存文件大小
			state.cacheFileSize = provider
			uni.setStorage({
				key: 'cacheFileSize',
				data: state.cacheFileSize
			})
		},
		getCacheFileSize(state) {
			const value = uni.getStorageSync('cacheFileSize')
			state.cacheFileSize = value
		},
		updateMenuApps(state, provider) {
			state.menuApps = provider
		}
	}
})

export default store
