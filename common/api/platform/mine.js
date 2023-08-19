/* 我的 */
export default vm => {
	return {
		editPwd: (params = {}) => vm.$u.put('/sysadmin-server/users/password', JSON.stringify(params)), //修改密码
		getLearnRecords: (params = {}) => vm.$u.get('/sws/fileStudy/record/' + params), //获取我的学习记录
		getUserSkill: (params = {}) => vm.$u.post('/sws/common/skill/' + params), //获取个人技能
		getMyApplyList: (params = {}) => vm.$u.post('/sws/common/applyLeave/' + params), //获取我的离岗申请
		getUserSkillUpgrade: (params = {}) => vm.$u.post('/sws/common/skillUpgrade/' + params), //获取个人技能提升记录
		getMyWorkDays: (params = {}) => vm.$u.post('/sws/common/personWorkTime/' + params), //获取我的工作时长
		getMyPersonPostFit: (params = {}) => vm.$u.post('/sws/common/personFitHis/' + params), //获取我的岗位匹配记录
		getDeviceListForNFC: (params = {}) => vm.$u.post(
			`/sws/spotCheckDetail/list${ vm.$u.queryParams(params.query) }`, params.body), //获取可写NFC芯片的设备列表
		postDeviceInfoForNFC: (params = {}) => vm.$u.post('/sws/common/setDeviceTag' + vm.$u.queryParams(
		params)), //上传设备nfc芯片信息
		postUnbindTagForNFC: (params = {}) => vm.$u.post(`/sws/spotCheckDetail/deleteTag/${ params }`), //删除NFC标签绑定--消防类
	}
}
