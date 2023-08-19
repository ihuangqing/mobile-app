/* dips → 设备维修 */
export default vm => {
	return {
		getDeviceInfoForDips: (params = {}) => vm.$u.post(
			`/dips/devices/code/${params.deviceCode}`), //根据设备编号获取设备信息
		getDevCatesInfoForDips: () => vm.$u.get('/dips/devcates'), //查询设备类型信息
		getDeviceCodeForDips: (params = {}) => vm.$u.get(
			`/dips/devices/list/${ params.lineId}/${ params.categoryId }`), //根据拉线和设备类型查询设备编码
		postAddRepairForDips: (params = {}) => vm.$u.post('/dips/cfr/add', params), //根据设备编号获取设备信息
		getRepairListForDips: (params = {}) => vm.$u.post(
			`/dips/cfr/myTasks${ vm.$u.queryParams(params.query) }`, params.body, {
				appName: 'dips'
			}), //获取维修列表
		getUnfinishedRepairList: (params = {}) => vm.$u.post(
			`/dips/cfr/unfinished${ vm.$u.queryParams(params.query) }`, params.body, {
				appName: 'dips'
			}), //获取未完成状态（待办）维修列表
		getForCloseListForDips: (params = {}) => vm.$u.post(
			`/dips/cfr/forclose${ vm.$u.queryParams(params.query) }`, params.body, {
				appName: 'dips'
			}), //获取当前登录人维修待确认列表
		postRejectRepair: (params = {}) => vm.$u.post('/dips/cfr/reject', params, {
			appName: 'dips'
		}), //拒单
		getDispatchUserList: (params = {}) => vm.$u.post(`/dips/devices/code/${ params }`), //获取派单人员列表
		postDispatchRepair: (params = {}) => vm.$u.post('/dips/cfr/assign', params, {
			appName: 'dips'
		}), //派单
		postAcceptRepair: (params = {}) => vm.$u.post(`/dips/cfr/accept/${ params }`, null, {
			appName: 'dips'
		}), //接单
		getRepairInfoByDRAFT: params => vm.$u.post(`/dips/cfr/selfaccept/${ params }`, null, {
			appName: 'dips'
		}), //待分配状态 → 获取维修信息
		getRepairInfoByACCEPT: params => vm.$u.post(`/dips/repair/cfr/${ params }`, null, {
			appName: 'dips'
		}), //维修中状态 → 获取维修信息
		getSpareInfoByCode: (params = {}) => vm.$u.post('/dips/matMaterialsStock/list', params, {
			appName: 'dips'
		}), //根据备品编码查询备品库存信息
		getSpareInfoNew: (params = {}) => vm.$u.post('/dips/matMaterialsStock/list/item', params, {
			appName: 'dips'
		}), //根据备品编码或名称查询备品库存信息
		postTempSaveRepair: (params = {}) => vm.$u.post('/dips/repair/temporary', params, {
			appName: 'dips'
		}), //维修暂存
		postCommitRepair: (params = {}) => vm.$u.post('/dips/repair/done', params, {
			appName: 'dips'
		}), //维修完成
		postRebutRepair: (params = {}) => vm.$u.post('/dips/cfr/rebut', params, {
			appName: 'dips'
		}), //驳回维修确认
		postConfirmRepair: (params = {}) => vm.$u.post('/dips/cfr/done', params, {
			appName: 'dips'
		}), //确认维修
		getFaultInfo: (params = {}) => vm.$u.get(`/dips/wb/${ params }/list`, null, {
			appName: 'dips'
		}), //获取维修确认时的故障类型和故障原因
	}
}
