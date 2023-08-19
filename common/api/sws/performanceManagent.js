export default vm => {
	return {
		getStaffScoreInfo: (params = {}) => vm.$u.post('/sws/performanceScore/staffScore'), //获取人员列表和评分标准列表数据
		postStaffScoreInfo: (params = {}) => vm.$u.post('/sws/performanceScore/add', params), //提交评分结果
		getStaffChangeList: (params = {}) => vm.$u.post(`/sws/record/changeList${vm.$u.queryParams(params)}`), //查询变更记录
		updateStaffScoreInfo: (params = {}) => vm.$u.post('/sws/performanceScore/update', params), //变更确认
		getStaffRole: (params = {}) => vm.$u.post('/sws/record/isForeman/'), //获取当前登录人员角色
		getStaffRecordList: (params = {}) => vm.$u.post(`/sws/record/staffs/${params}`), //获取班组人员
		getStaffRecord: (params = {}) => vm.$u.post(`/sws/record/scoreList${vm.$u.queryParams(params)}`), //获取个人绩效记录
	}
}