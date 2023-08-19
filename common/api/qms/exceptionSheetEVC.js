// 品质异常单EVC
export default vm => {
	return {
		getDataCodeForExceptionEVC: (params = {}) => vm.$u.get('/clms/quality/work/book', null, {
			appName: 'clms'
		}), //品质异常单获取优先级和严重性等级
		getUsersForExceptionEVC: (params = {}) => vm.$u.get(`/clms/quality/${ params }/users`, null, {
			appName: 'clms'
		}), //获取该组织的责任人
		GetAbnormalCheckBoxValues: (params = {}) => vm.$u.get('/clms/quality/evc/abnormalCheckBoxValues', null, {
			appName: 'clms'
		}), //获取下拉选择（综合）
		getAbnormalLables: (params = {}) => vm.$u.get('/clms/quality/evc/lables', null, {
			appName: 'clms'
		}), //查询所有标签
		postExceptionEVC: (params = {}) => vm.$u.post(`/clms/quality/evc/abnormal`, params, {
			appName: 'clms'
		}), //创建品质异常单EVC
		getStageInfoEVC: () => vm.$u.post('/clms/quality/stage/confirm', null, {
			appName: 'clms'
		}), //获取模板中各个阶段的是否需要审核员信息
		getGroupUsersFromClms: (params = {}) => vm.$u.post(`/clms/que/group/list${ vm.$u.queryParams(params.query) }`, params.body, {
			appName: 'clms'
		}), //获取群组人员列表
	}
}
