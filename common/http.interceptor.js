const install = (Vue, vm) => {
	// 此为自定义配置参数，具体参数见上方说明
	Vue.prototype.$u.http.setConfig({
		// baseUrl: vm.$store.state.baseUrl,
		loadingText: '数据加载中...',
		// dataType: 'json',
		showLoading: true,
		loadingTime: 800,
		loadingMask: true,
		originalData: true, //默认是false，如果设置为true，响应拦截器中返回值需要重新处理
		header: {
			'Content-Type': 'application/json',
			// 'lb-version': 'wangwei'
			// 'lb-version': 'zha.qj'
			// 'lb-version': 'lyf'
			// 'lb-version': 'lijin'
		}
	})

	// 请求拦截，配置Token等参数
	Vue.prototype.$u.http.interceptor.request = (config) => {

		let header = config.header
		let state = vm.$store.state //获取store 中state
		let getter = vm.$store.getters

		if (header && header.appName === 'tdms') {
			vm.appName = header.appName
		}

		config.url = state.baseUrl + config.url //动态修改baseUrl
		if (header && header.appName === 'wms') {
			config.url = config.url.replace(state.baseUrl, state.wmsUrl)
		}

		header.appVersion = getter.appVer

		if (config.url.includes('/auth-server/oauth/token')) { //通过请求地址url 判断是否为登录接口, 登录接口添加固定token
			Vue.prototype.$u.http.config.loadingText = '用户登录中...'
			header.Authorization = 'Basic ZGlwczpzd2QtZGlwcw=='
			//等微服务中添加了版本校验后，需要在此处header中加appVersion
		} else if (config.url.includes('authorizedfactorys')) {
			//等微服务中添加了版本校验后，需要在此处header中加appVersion
		} else if (config.url.includes('hardware/detail/app/queryHardwareDetail')) {
			delete header.appVersion
		} else if (config.url.includes('version/getVersionInfo')) {
			// 此接口用于获取服务器最新版本号和更新日志，不能传AppVersion
			header.appVersion = ''
		} else if (config.url.includes('/sws/slideShow/all') || config.url.includes(
				'/sws/fileStudy/sop/list') || config.url.includes('/sws/notice/all') || config.url.includes(
				'/sws/aio/detail')) { //通过请求地址url 判断是否为轮播图、sop文档、公告、一体机与设备信息接口
			header.appName = state.appName
			header.factoryId = state.factoryId ? state.factoryId : 27
		} else if (config.url.includes('/sysadmin-server/intf/appVersion/sws')) {
			//获取应用版本号接口，无需添加任何header信息
		} else if (config.url.includes('/MESPdaServices.svc')) { //pmes  .net后台服务 修复请求服务地址 header特殊处理 
			config.url = config.url.replace(state.baseUrl, state.pmesUrl)

			if (config.header.moduleType) {
				config.header = {
					moduleType: config.header.moduleType,
					'Content-Type': 'application/json'
				}
			} else {
				config.header = {
					'Content-Type': 'application/json'
				}
			}
		} else if (config.url.includes('/mesproject/')) { //pmes  java服务
			config.url = config.url.replace(state.baseUrl, state.pmesUrlOfJava)
		} else {
			Vue.prototype.$u.http.config.loadingText = '数据加载中...'
			let appName = config.header.appName

			config.header = { // 接口header中传了appName时候以接口传值为准，接口未传值时用state中的appName
				'Content-Type': 'application/json',
				appVersion: getter.appVer,
				Authorization: state.Authorization,
				language: state.language ? state.language : 'zh',
				factoryId: state.factoryId,
				appName: appName ? appName : state.appName
			}
		}

		console.info('http请求参数数据：', JSON.stringify(config))
		return config
	}

	vm.timer = null //兼容App

	// 响应拦截，判断状态码是否通过
	Vue.prototype.$u.http.interceptor.response = (res) => {
		console.log('http请求返回数据：', res)

		vm.timer = setTimeout(() => { //hack uview请求bug
			uni.hideLoading()
			clearTimeout(vm.timer)
		}, 3 * 60 * 1000)

		try {
			let data = res.data
			if (data.msgCode === '000401') { //权限校验失败
				vm.$u.toast('权限验证失败，请重新登录', 2300)
				setTimeout(() => {
					uni.reLaunch({
						url: '/pages/login/index'
					})
				}, 2000)
				return false
			} else if (data.msgCode === '010001') {
				let desc = data.message
				if (vm.appName === 'tdms') {
					if (desc == '') {
						desc = '你已被登出，请重新进入应用'
					} else if (desc == '无效client id') {
						desc = '你已在其他设备登录，故此设备被登出！'
					}
				}
				console.log('desc: ', desc)
				vm.$u.toast(desc, 3300)
				setTimeout(() => {
					uni.reLaunch({
						url: '/pages/login/index'
					})
				}, 3500)
				return false
			} else if (data.msgCode === '010003') { //有新版，可升级
				// #ifdef H5
				uni.showToast({
					title: '有新版本，可升级'
				})
				// #endif
				// #ifdef APP-PLUS
				let routes = getCurrentPages()
				let curRoute = routes[routes.length - 1].route //当前路由地址

				if (!curRoute.includes('common/versionInfo')) { //防止同时多个请求导致的多次触发					
					uni.navigateTo({
						url: '/pages/common/versionInfo/index'
					})
				}
				// #endif
				return false
			} else {
				return data
			}
		} catch (e) {
			return false
		}
	}
}

export default {
	install
}