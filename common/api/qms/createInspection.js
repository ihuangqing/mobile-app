// 中断管理
export default vm => {
	return {
		getTechnicsAndAreaSnList: (params = {}) => vm.$u.post(
			`/mes-interface/mesIpqc/technicsAndAreaSnList${ vm.$u.queryParams(params) }`, null, {
				appName: 'mes-interface'
			}), //根据料号获取工艺和线体


		getBreakOffQmStandardBySnApi: (params = {}) => vm.$u.post(
			`/mes-interface/mesIpqc/getBreakOffQmStandardBySn${ vm.$u.queryParams(params) }`,
			null, {
				appName: 'mes-interface'
			}), //根据编码获取工艺名称、产品型号和线体


		getTechnicsAndGroupList: (params = {}) => vm.$u.post(
			`/mes-interface/mesIpqc/technicsAndGroupList${ vm.$u.queryParams(params) }`, null, {
				appName: 'mes-interface'
			}), //根据工艺Id查询工序列表
		postRecreateOrder: (params = {}) => vm.$u.post(
			`/mes-interface/mesIpqc/recreateOrder${ vm.$u.queryParams(params) }`,
			null, {
				appName: 'mes-interface'
			}), //中断管理确认
		getMesAbnormalQualityBySnApi: (params = {}) => vm.$u.post(
			`/mes-interface/mesIpqc/getMesAbnormalQualityBySn${ vm.$u.queryParams(params) }`,
			null, {
				appName: 'mes-interface'
			}), //根据编码获取工艺名称、产品型号和线体
	}
}
