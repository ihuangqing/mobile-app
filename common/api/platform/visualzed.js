/* 可视化 */
export default vm => {
	return {
		getFactoryList: (params = {}) => vm.$u.get('/sws/visualzed/org/list'),
		getVisualzedInfo: (params = {}) => vm.$u.get(`/sws/visualzed/info/${ params }`), //获取各个工段人员占比
		getVisualzedAttendances: (params = {}) => vm.$u.get(
			`/sws/visualzed/info/attendance${ vm.$u.queryParams(params) }`), //获取各个拉线的岗位出勤率
		queryBoardViewBarGraph: (params = {}) => vm.$u.post('/dips/dc/queryBoardViewBarGraph', params, {
			appName: 'dips'
		}), //dips 获取巡检、保养 完成项
		queryBoardViewLineGraph: (params = {}) => vm.$u.post('/dips/cfr/queryBoardViewLineGraph', params, {
			appName: 'dips'
		}), //dips 获取故障Top10 
	}
}
