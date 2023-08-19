/* 消防点检 */
export default vm => {
	return {
		getAllUnchecklist: (params = {}) => vm.$u.post('/sws/spotCheckDevice/getCheckList' + vm.$u.queryParams(
			params)), //获取点检列表 点检状态(1-待点检,2-待确认)
		putCheckResult: (params = {}) => vm.$u.put('/sws/spotCheckDevice/record', JSON.stringify(params)), //上传点检结果
		putRejectCommit: (params = {}) => vm.$u.put('/sws/spotCheckDevice/audit/' + vm.$u.queryParams(
			params)), //点检确认 -- isAgree 0驳回 1确认
		getCheckHistory: (params = {}) => vm.$u.post('/sws/spotCheckDevice/his/list', params), //历史点检
		getDeviceInfoByNFCId: (params = {}) => vm.$u.post(`/sws//spotCheckDetail/${ params }`), //通过nfc标签id获取设备信息
	}
}
