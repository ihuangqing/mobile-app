/* dips → 工治具 */
export default vm => {
	return {
		getFixtureList: (params = {}) => vm.$u.post(
			`/dips/matfixture/list${ vm.$u.queryParams(params.query) }`, params.body), //获取工治具列表
		getFixtureImage: (params = {}) => vm.$u.post(
			`/attachment-server/attachment/record?module=tooling&fileType=image&recordId=${ params }`
		), //获取工治具详情的图片
		getFixtureInList: (params = {}) => vm.$u.post(
			`/dips/matfixtureApply/in/list${ vm.$u.queryParams(params.query) }`,
			params.body), //获取工治具入库记录
		getFixtureOutList: (params = {}) => vm.$u.post(
			`/dips/matfixtureApply/out/list${ vm.$u.queryParams(params.query) }`,
			params.body), //获取工治具出库记录
		getCheckInfo: (params = {}) => vm.$u.post(`/dips/matfixInvt/${ params }/invtList`), //根据库位id获取盘点信息
		putTempCheckInfo: (params = {}) => vm.$u.put(`/dips/matfixInvt/${ params.id }/edit`, params.body), //盘点 → 暂存
		putCommitCheckInfo: (params = {}) => vm.$u.put(`/dips/matfixInvt/${ params.id }/submit`, params
			.body), //盘点 → 保存
		getFixtureInfo: (params = {}) => vm.$u.post(`/dips/matfixture/code/${ params }`), //获取工治具信息
		getUnReceiveFixtureInfo: (params = {}) => vm.$u.post(
			`/dips/matfixtureApply/fixture/${ params }/getUnwithdraw`), //根据工治具编码获取待退仓申领记录
		postFixtureApply: (params = {}) => vm.$u.post('/dips/matfixtureApply/add', params), //提交工治具领用申请
		getFixtureApproveList: (params = {}) => vm.$u.post('/dips/matfixtureApply/myhandout'), //获取发放申请列表
		postFixtureApprove: (params = {}) => vm.$u.post(`/dips/matfixtureApply/${ params }/handout`), //发放工治具确认
		postFixtureReject: (params = {}) => vm.$u.post(`/dips/matfixtureApply/${ params }/reject`), //发放工治具驳回
		postFixtureReceice: (params = {}) => vm.$u.post('/dips/matfixtureApply/withdraw', params), //确认归还
		postFixtureBack: (params = {}) => vm.$u.post(
			`/dips/matfixtureApply/${params.query.id}/back`, params.body), //工治具归还，先从车间申请退仓
		getReceiveRecordList: (params = {}) => vm.$u.post(
			`/dips/matfixtureApply/list${ vm.$u.queryParams(params.query) }`, params.body), //获取归还记录
		getUnReceiveList: (params = {}) => vm.$u.post('/dips/matfixtureApply/mywithdraw'), //归还 → 获取未入库的工治具列表
		getFixtureMaintainInfo: (params = {}) => vm.$u.post(`/dips/matfixPm/code/${ params }`), //根据扫码获取工治具保养信息
		getMaintainCheckList: (params = {}) => vm.$u.post(`/dips/matfixPm/${ params }`), //获取工治具保养明细项列表
		putMaintainCheck: (params = {}) => vm.$u.put('/dips/matfixPm', params), //上传保养信息
		getFixtureMaintainApproveList: (params = {}) => vm.$u.post(
			`/dips/matfixPm/toBeConfirm${ vm.$u.queryParams(params.query) }`, params.body), //获取工治具保养待确认列表
		getApproveConfirmDetails: (params = {}) => vm.$u.post(`/dips/matfixPm/${ params }`), //获取工治具保养确认明细
		putFixtureApproveReject: (params = {}) => vm.$u.put('/dips/matfixPm/reject', params), //工治具保养确认 → 驳回
		putFixtureApproveConfirm: (params = {}) => vm.$u.put('/dips/matfixPm/confirm', params), //工治具保养确认 → 确认
		getUnSignResumeList: (params = {}) => vm.$u.post('/dips/matfixtureUse/list4checkin'), //获取当天未登记工治具履历列表
		getFixtureResumeList: (params = {}) => vm.$u.post(
			`/dips/matfixtureUse/list?page${ vm.$u.queryParams(params.query) }`, params.body), //获取出库工治具履历列表
		getOperatorByFixtureId: params => vm.$u.post(`/dips/matfixture/${ params }/pr`), //根据工治具id获取生产操作员
		getTechByFixtureId: params => vm.$u.post(`/dips/matfixture/${ params }/pc`), //根据工治具id获取设备技术员
		postFixtureResumeOpeCheckIn: (params = {}) => vm.$u.post('/dips/matfixtureUse/opeadd', params), //生产操作员 → 工治具登记
		postFixtureResumeTeCheckIn: (params = {}) => vm.$u.post('/dips/matfixtureUse/teadd', params), //设备技术员 → 工治具登记
	}
}
