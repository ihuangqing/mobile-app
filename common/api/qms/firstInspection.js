export default vm => {
	return {
		getOrderList: (params = {}) => vm.$u.post(
			`/mes-interface/mesIpqc/orderList${ vm.$u.queryParams(params.query) }`, params.body, {
				appName: 'mes-interface'
			}), //获取首巡检列表
		getGroupParam: (params = {}) => vm.$u.post(
			`/mes-interface/mesIpqc/groupParam${ vm.$u.queryParams(params.query) }`, null, {
				appName: 'mes-interface'
			}), //定量：根据工艺ID、工序和测试项获取系统管控上下限
		getdeviceParam: (params = {}) => vm.$u.post(
			`/mes-interface/mesIpqc/deviceParam${ vm.$u.queryParams(params.query) }`, null, {
				appName: 'mes-interface'
			}), //定量：根据条码Sn、工序和测试项获取系统过程测试值
		getupdateIpacOrder: (params = {}) => vm.$u.post(
			`/mes-interface/mesIpqc/updateIpacOrder${ vm.$u.queryParams(params.query) }`, params.body, {
				appName: 'mes-interface'
			}), //定量：根据条码Sn、工序和测试项获取系统过程测试值	
		postUpdateIpqcOrderLine: (params = {}) => vm.$u.post('/mes-interface/mesIpqc/updateIpqcOrderLine', params
			.body, {
				appName: 'mes-interface'
			}), //单个检验项目结果提交
		postBarCodeForAutoCheck: (params = {}) => vm.$u.post(
			`/mes-interface/mesIpqc/ipqcOrderAutoCheck${ vm.$u.queryParams(params) }`), //首巡检参数检验类型上传条码
		getLineAndCheckTypeApi: (params = {}) => vm.$u.get(
			`/mes-interface/mesIpqc/lineAndCheckType${ vm.$u.queryParams(params) }`), //首巡检--获取mes的拉线以及单据类型数据
	}
}