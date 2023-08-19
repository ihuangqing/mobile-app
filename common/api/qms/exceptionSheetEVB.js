// 品质异常单EVB
export default vm => {
	return {

		GetEvbAbnormalCheckBoxValuesApi: (params = {}) => vm.$u.get(
			`/clms/quality/abnormalCheckBoxValues/${ params }`,
			null, {
				appName: 'clms'
			}), //获取下拉选择（综合）
		getEvbAbnormalLablesApi: (params = {}) => vm.$u.get('/clms/quality/evb/lables', null, {
			appName: 'clms'
		}), //查询所有标签
		postExceptionEVBApi: (params = {}) => vm.$u.post(`/clms/quality/evb/abnormal`, params, {
			appName: 'clms'
		}), //创建品质异常单EVB/EVC
		getStageInfoApi: (params = {}) => vm.$u.post(`/clms/quality/stage/confirm/${params}`, null, {
			appName: 'clms'
		}), // 查询需审核人确认的阶段信息

		getCategorysByCondApi: (params = {}) => vm.$u.post('/clms/categorys/cond', params, {
			appName: 'clms'
		}), //根据条件查询分类管理
		postEvbAbnormalFormApi: (params = {}) => vm.$u.post(
			'/clms/quality/evb/abnormal', params, {
				appName: 'clms'
			}), //新增电池制程品质异常单-EVB
		postEvbInspectApi: (params = {}) => vm.$u.post(
			'/clms/quality/evb/inspect', params, {
				appName: 'clms'
			}), //新增电池巡检不符合项-EVB（APP端）

	}
}
