// 产品追溯
export default vm => {
	return {
		findSnDetailApi: (params = {}) => vm.$u.post(
			`/mes-interface/fitting/findSnDetail${ vm.$u.queryParams(params) }`, params.body, {
				appName: 'mes-interface'
			}), //根据产品编码获取产品信息
		findItemBySnAndGroupApi: (params = {}) => vm.$u.post(
			`/mes-interface/fitting/findItemBySnAndGroup${ vm.$u.queryParams(params) }`, params.body, {
				appName: 'mes-interface'
			}), //根据产品编码获取工序物料信息
		findSnTestItemApi: (params = {}) => vm.$u.post(
			`/mes-interface/fitting/findSnTestItem${ vm.$u.queryParams(params) }`, params.body, {
				appName: 'mes-interface'
			}), //根据产品编码查询NG数据
	}
}
