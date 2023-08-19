import axios from '../../axios.js'

export default vm => {
	return {
		// 点检改善任务 - 分页查询
		improveTaskList: (params = {}) => vm.$u.post('/sws/improveTask/list', params, {
			// appName: 'sws'
		}),
		// 点检改善确认
		improveTaskjudge: (params = {}) => vm.$u.post('/sws/improveTask/judge', params),
		// 提交点检改善措施
		setsaveImproveMsg: (params = {}) => vm.$u.post('/sws/saveImproveMsg', params),
		// 测试
		improveTaskTest: (params = {}) => vm.$u.get('/sws/improveTask/test', params, {
			// appName: 'test'
		}),
		// 点检改善任务详情
		improveDetailListdddd: (params = {}) => vm.$u.get(`/sws//improveTask/detail?id=${params.id}`)





		//点检确认 -- isAgree 0驳回 1确认
		// )
	}
}
