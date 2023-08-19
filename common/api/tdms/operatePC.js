/* tdms */
import axios from '../../axios.js'

export default vm => {
	const state = vm.$store.state
	return {
		incomprehensibleInterFace: (params = {}) => vm.$u.get('/tdms/webservice/login/oauthLimsToken', null, {
			appName: 'tdms',
		}), //tdms设计不合理的单端登录接口  离~~~~~~谱
		// incomprehensibleInterFace: () => axios({
		// 	url: '/tdms/webservice/login/oauthLimsToken',
		// 	method: 'GET',
		// 	headers: {
		// 		'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
		// 		Authorization: state.Authorization,
		// 		appName: "tdms",
		// 		factoryId: state.factoryId ? state.factoryId : 27,
		// 		language: 'zh',
		// 		cookie: uni.getStorageSync('ugly-auth')
		// 	}
		// }), 
		getCheckSampleBarcode: (params = {}) => vm.$u.post(
			`/tdms/app/checkSampleBarcode${ vm.$u.queryParams(params) }`,
			null, {
				appName: 'tdms'
			}), //样品条码校验
		getFindDevicePassCodeList: (params = {}) => vm.$u.post(
			`/tdms/app/findDevicePassCodeList${ vm.$u.queryParams(params) }`, null, {
				appName: 'tdms'
			}), //获取设备通道
		getFindTestItemTemplate: (params = {}) => vm.$u.post(
			`/tdms/app/findTestItemTemplate${ vm.$u.queryParams(params) }`, null, {
				appName: 'tdms'
			}), //获取测试项目模板
		postSampleDownMachine: (params = {}) => vm.$u.post('/tdms/app/sampleDownMachine', params, {
			appName: 'tdms'
		}), //下机
		postSampleOnMachine: (params = {}) => vm.$u.post('/tdms/app/sampleOnMachine', params, {
			appName: 'tdms'
		}), //上机
		getProductTypeList: (params = {}) => vm.$u.post(`/tdms/app/materialSpec${ vm.$u.queryParams(params) }`,
			null, {
				appName: 'tdms'
			}), //根据测试项目查询样品类型
		postSaveData: (params = {}) => vm.$u.post(`/tdms/app/uploadTestData${ vm.$u.queryParams(params.query) }`,
			params.body, {
				appName: 'tdms'
			}), //数据保存
		getTestItemList: (params = {}) => vm.$u.post('/tdms/app/testitem/list', null, {
			appName: 'tdms'
		}), //根据factoryid获取测试项目列表
		getTemplate: (params = {}) => vm.$u.post(`/tdms/app/findTestItemTemplate${ vm.$u.queryParams(params) }`,
			null, {
				appName: 'tdms'
			}), //根据测试项目id获取对应的数据录入模板
		deleteRecordDataForTDMS: (params) => vm.$u.delete(
			`/tdms/app/testRecord/deleteRecordData/${ params.id }${vm.$u.queryParams(params.query)}`, null, {
				appName: 'tdms'
			}), //删除明细数据
		findProcessPlanExecute: (params = {}) => vm.$u.get(
			`/tdms/app/testRecord/findProcessPlanExecute${ vm.$u.queryParams(params) }`, null, {
				appName: 'tdms'
			}), //根据条码查询计划数据
		findRecordDetailList: (params = {}) => vm.$u.get(
			`/tdms/app/testRecord/findRecordDetailList/${ params.id }${vm.$u.queryParams(params.query)}`,
			null, {
				appName: 'tdms'
			}
		), //根据记录ID查询明细数据
		queryDataListForTDMS: (params = {}) => vm.$u.post(
			`/tdms/app/testRecord/pageList${vm.$u.queryParams(params.query)}`, params.body, {
				appName: 'tdms'
			}), //分页查询 记录列表
		saveRecordDataForTDMS: (params = {}) => vm.$u.post(
			`/tdms/app/testRecord/saveRecordData${vm.$u.queryParams(params.query)}`, params.body, {
				appName: 'tdms'
			}), // 保存明细数据
		updateRecordDataForTDMS: (params = {}) => vm.$u.put(
			`/tdms/app/testRecord/updateRecordData${vm.$u.queryParams(params.query)}`, params.body, {
				appName: 'tdms'
			}), //修改明细数据
		findRecordUser: (params = {}) => vm.$u.get(
			`/tdms/app/testRecord/findRecordUser${vm.$u.queryParams(params)}`, null, {
				appName: 'tdms'
			}), //获取记录人员
		getSelectListDataForTemperatureHumidityInput: () => vm.$u.post(
			'/tdms/app/temperatureHumidityInput/selectListData', null, {
				appName: 'tdms'
			}), //获取温湿度录入下拉数据
		postTemperatureHumidityInputData: (params = {}) => vm.$u.post(
			'/tdms/app/temperatureHumidityInput/saveTemperatureHumidityInputData', params, {
				appName: 'tdms'
			}), //保存温湿度数据
		getDataListForTemperatureHumidityInput: (params = {}) => vm.$u.post(
			`/tdms/app/temperatureHumidityInput/list${vm.$u.queryParams(params.query)}`, params.body, {
				appName: 'tdms'
			}), //分页查询温湿度录入数据
		delTemperatureHumidityRecord: (params = '') => vm.$u.delete(`/tdms/app/temperatureHumidityInput/delete/${params}`,
			null, {
				appName: 'tdms'
			}), //删除温湿度记录
		getAreaListForTemperatureHumidityInput: () => vm.$u.post('/tdms/areas/cond', {
			"state": "1"
		}, {
			appName: 'tdms'
		}),
		getLabListForTemperatureHumidityInput: (params) => vm.$u.post('/tdms/lab/all', params, {
			appName: 'tdms'
		}),
		getSpotListForTdms: (params = {}) => vm.$u.post(
			`/tdms/deviceSpotcheckInput/findList${ vm.$u.queryParams(params.query) }`, params.body, {
				appName: 'tdms'
			}), //设备点检
		getSpotDetailForTdms: (params = {}) => vm.$u.post('/tdms/deviceSpotCheckInputRecord/findByCondition', params, {
			appName: 'tdms'
		}), //获取点检详情
		postSpotDataForTdms: (params = {}) => vm.$u.post('/tdms/deviceSpotcheckInput/addDeviceSpotcheckInput', params, {
			appName: 'tdms'
		}), //提交点检结果
		getCellUpDownListForTdms: (params = {}) => vm.$u.post(
			`/tdms/samplesOnTheCabinet/findByCondition${ vm.$u.queryParams(params.query) }`, params.body, {
				appName: 'tdms'
			}), //获取电芯上下架列表
		getLabListForTdms: (params = {}) => vm.$u.get(`/tdms/lab/ItemID/${ params }`, null, {
			appName: 'tdms'
		}), //根据测试项目编号，查询实验室
		getDeviceListForTdms: (params = {}) => vm.$u.post('/tdms/devices/cond', params, {
			appName: 'tdms'
		}), //根据实验室查询设备列表
		getDeviceInfoForTdms: (params = {}) => vm.$u.get(`/tdms/devicePass/${ params }/useful`, null, {
			appName: 'tdms'
		}), //查询设备信息
		getItemListOfOnTheCabinet: (params = {}) => vm.$u.get(
			`/tdms/sampleRequest/oaItem/${ params }/onTheCabinet/onTheCabinetCount`, null, {
				appName: 'tdms'
			}), //查询上架   条码列表
		getItemListOfUnTheCabinet: (params = {}) => vm.$u.get(
			`/tdms/sampleRequest/oaItem/${ params }/disembark/unTheCabinetCount`, null, {
				appName: 'tdms'
			}), //查询下架   条码列表
		getItemListOfContinue: (params = {}) => vm.$u.get(
			`/tdms/sampleRequest/oaItem/${ params }/continue/onTheCabinetCount`, null, {
				appName: 'tdms'
			}), //查询接续   条码列表
		getItemListOfStop: (params = {}) => vm.$u.get(
			`/tdms/sampleRequest/oaItem/${ params }/stop/unTheCabinetCount`, null, {
				appName: 'tdms'
			}), //查询暂停   条码列表
		postOnTheCabinet: (params = {}) => vm.$u.post('/tdms/sampleRequest/onTheCabinet', params, {
			appName: 'tdms'
		}), //上架
		postOnTheCabinetList: (params = {}) => vm.$u.post('/tdms/sampleRequest/onTheCabinetList', params, {
			appName: 'tdms'
		}), //上架（批量）
		postUnTheCabinet: (params = {}) => vm.$u.post('/tdms/sampleRequest/unTheCabinet', params, {
			appName: 'tdms'
		}), //下架
		postUnTheCabinetList: (params = {}) => vm.$u.post('/tdms/sampleRequest/unTheCabinetList', params, {
			appName: 'tdms'
		}), //下架（批量）
		postSampleStop: (params = {}) => vm.$u.post('/tdms/sampleRequest/sampleStop', params, {
			appName: 'tdms'
		}), //暂停
		postSampleStopBatch: (params = {}) => vm.$u.post('/tdms/sampleRequest/sampleStopBatch', params, {
			appName: 'tdms'
		}), //暂停（批量）
		postSampleContinue: (params = {}) => vm.$u.post('/tdms/sampleRequest/sampleContinue', params, {
			appName: 'tdms'
		}), //接续
		postSampleContinueBatch: (params = {}) => vm.$u.post('/tdms/sampleRequest/sampleContinueBatch', params, {
			appName: 'tdms'
		}), //接续（批量）
	}
}