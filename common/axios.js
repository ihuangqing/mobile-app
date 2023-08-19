import axios from 'axios'

const service = axios.create({
	// 原先
	baseURL: 'http://10.201.88.40:8010',
	// baseURL: 'http://172.30.203.169:11088',
	// baseUrl: "http://10.201.88.55:8889/prod-api",

	timeout: 300000,
	// headers: {
	// 	'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
	// 	Authorization: store.state.Authorization,
	// 	appName: "dips",
	// 	factoryId: store.state.factoryId ? store.state.factoryId : 27,
	// 	language: 'zh'
	// }
})

// 提交
service.interceptors.request.use(
	config => {
		return config
	},
	error => {
		console.log(error)
		return Promise.reject(error)
	}
)

// 请求
service.interceptors.response.use(
	response => {
		const res = response.data
		// console.log(res)
		// 如果返回的状态码为200，说明接口请求成功，可以正常拿到数
		if (response.status === 200) {

			return Promise.resolve(res)
		} else {
			return Promise.reject(res)
		}
	},
	error => {
		console.log('err' + error) // for debug
		return Promise.reject(error)
	}
)

axios.defaults.adapter = function(config) { //自己定义个适配器，用来适配uniapp的语法
	return new Promise((resolve, reject) => {
		console.log(config)
		var settle = require('axios/lib/core/settle')
		var buildURL = require('axios/lib/helpers/buildURL')
		uni.request({
			method: config.method.toUpperCase(),
			url: config.baseURL + buildURL(config.url, config.params, config.paramsSerializer),
			header: config.headers,
			data: config.data,
			dataType: config.dataType,
			responseType: config.responseType,
			sslVerify: config.sslVerify,
			complete: function complete(response) {
				console.log("执行完成：", response)
				response = {
					data: response.data,
					status: response.statusCode,
					errMsg: response.errMsg,
					header: response.header,
					config: config
				}

				settle(resolve, reject, response);
			}
		})
	})
}
export default service
