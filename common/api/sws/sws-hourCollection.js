export default vm => {
	return {
		getProjectList: (params) => vm.$u.post(`/sws/baseProject/findList${ vm.$u.queryParams(params.query) }`,
			params.body), //获取项目列表（电池组织有用）
		getCollectUserList: (params) => vm.$u.post('/sws/attendance/queryWorkTimeEffectStaff', params), //查询工时采集人员
		postHourCollection: (params) => vm.$u.post('/sws/worktime/add', params), //工时采集提交
		getHourCollectionList: (params) => vm.$u.post(
			`/sws/worktime/findNotAuditList${ vm.$u.queryParams(params.query) }`, params.body), //分页查询待工时申请列表
		postHourCollectionApprove: (params) => vm.$u.put('/sws/worktime/audit', params), //工时采集审批
		postUrgeApprove: (params) => vm.$u.post(
			`/sws/worktime/adviceApprovePerson${ vm.$u.queryParams(params) }`), //工时采集工单催办
		postHourCollectionUpdate: (params) => vm.$u.put('/sws/worktime/update', params), //工时采集审批 → 重新发起
		postCollectionReportList: (params = {}) => vm.$u.post(
			`/sws/worktime/queryPostWorkReport${ vm.$u.queryParams(params.query) }`, params.body), // 工时采集报表列表查询
		getCollectionInfoById: (params = {}) => vm.$u.get(`/sws/worktime/viewPostWorktime/${ params }`), //根据id查询采集明细 
	}
}