/* 人岗匹配 */
export default vm => {
	return {
		getUserSignInfo: (params = {}) => vm.$u.post('/sws/personPost/getStaff/' + params), //获取人员签到信息
		signIn: (params = {}) => vm.$u.post('/sws/personPost/signInPost', params), //早会签到
		signOut: (params = {}) => vm.$u.post('/sws/personPost/signOutPost', params), //下班签退
		getSignOutUsers: (account, params = {}) => vm.$u.post(
			`/sws/personPost/getStaffList/${ account }${ vm.$u.queryParams(params) }`), //获取下班签退人员列表，参数是班组长工号
		leaveApply: (params = {}) => vm.$u.post('/sws/personPost/applyLeavePost', params), //离岗申请
		getApplyList: (params = {}) => vm.$u.post('/sws/personPost/applyList' + vm.$u.queryParams(
			params)), //离岗申请列表
		applyConfirm: (params = {}) => vm.$u.post('/sws/personPost/confirmLeavePost', params), //离岗申请确认
		replacePost: (params = {}) => vm.$u.post('/sws/personPost/replacePost/' + params), //顶岗签到
		backPost: (params = {}) => vm.$u.post('/sws/personPost/confirmReturnPost' + vm.$u.queryParams(
			params)), // 返岗签到
		getReplaceMan: (params = {}) => vm.$u.post('/sws/personPost/getReplacePost/' + params), //获取顶岗人列表
		getApplyInfo: (params = {}) => vm.$u.post('/sws/personPost/findApplyInfo' + vm.$u.queryParams(
			params)), //获取人员申请信息 申请类型(1-查询是否有顶岗签到,2-查询是否可以返岗签到)
		getStaff: (params = {}) => vm.$u.post('/sws/common/staffs/' + params), //获取组内人员在岗状态信息
		getStaffSkill: (params = {}) => vm.$u.post('/sws/personPost/postMatch/' +
			params), //人岗匹配  获取组内人员技能等级 参数为foremanName班组长工号
		getWearInfo: (params = {}) => vm.$u.post('/sws/common/wears' + vm.$u.queryParams(params)), //人岗匹配 根据岗位获取穿戴信息
		getUserWearInfo: (params = {}) => vm.$u.post('/sws//common/wears/list'), //人岗匹配 获取签到人员穿戴匹配信息
		getUsersByForeman: (params = {}) => vm.$u.post(`/sws/personPost/getMembers/${ params }`), //通过组长工号获取小组所有组员信息
		delUsersFromGroup: (params = {}) => vm.$u.post('/sws/postGroup/removeMember', params), //从小组删除组员
		toCheckLimit: (params = {}) => vm.$u.post(`/sws/personPost/checkIsOverLimit/${ params }`), //检查当前离岗申请是否超出限制
		getLoanOutList: (params = {}) => vm.$u.post(`/sws/staffCall/callOutList/${ params }`), //可调出人员列表查询
		getLoanInList: (params = {}) => vm.$u.post(`/sws/staffCall/callInList/${ params }`), //可调入人员列表查询
		getLoanForeManList: (params = {}) => vm.$u.post(`/sws/staffCall/callOutGroups/${ params }`), //获取临时借调的班组长列表
		getLoanHistoryList: (params = {}) => vm.$u.post(`/sws/staffCall/callOutHisList/${ params }`), //获取历史调出选择列表
		postLoanOut: (params = {}) => vm.$u.post('/sws/staffCall/callOutStaff', params), //调出
		postLoanIn: (params = {}) => vm.$u.post(`/sws/staffCall/callInStaff${ vm.$u.queryParams(params) }`), //调入
		delLoanHistoryItem: (params = {}) => vm.$u.delete(`/sws/staffCall/${ params }`), //删除历史调出记录
		getUndoDelList: (params = {}) => vm.$u.post(`/sws/personPost/delList/${ params }`), //获取撤销删除人员列表
		postUndoDel: (params = {}) => vm.$u.post(
			`/sws//personPost/revokeDel/${ vm.$u.queryParams(params) }`), //撤销删除
		getSignInfo: (params = {}) => vm.$u.post(
			`/sws/personPost/getSignInfo/${ params }`), //个人签到模块，获取个人签到的信息（模拟排班+本周签到信息）
		postUserSign: (params = {}) => vm.$u.post('/sws/personPost/signInPostOne', params), //个人签到提交
		getScheduledata: (params = {}) => vm.$u.post('/sws/scheduling/official/app/list', params), //获取正式排班信息
		getLinePostsList: () => vm.$u.get('/sws/scheduling/rule/app/posts'), //获取当前组织下的拉线 → 工段 → 岗位 三级联数据查询
		postUpdateSchedule: (params = {}) => vm.$u.post('/sws/scheduling/official/app/edit', params), //变更排班
		getScheduleInfoForShow: (params = {}) => vm.$u.post('/sws/scheduling/official/app/show', params), //排班查询 
	}
}
