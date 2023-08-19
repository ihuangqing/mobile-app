// 品质异常单EVB
export default vm => {
	return {

		
		// postProblemBookApi: (params = {}) => vm.$u.post(`/clms/problemBook/list`, params, {
		// 	appName: 'clms'
		// }), //根据条件查询问题台账

		
		
		postProblemBookFieldApi: (params = {}) => vm.$u.post(`/clms/problemBook/field/list`, params, {
			appName: 'clms'
		}), //获取问题模板动态配置字段	
		
		postProblemBookApi: (params = {}) => vm.$u.post(
			`/clms/problemBook/list${ vm.$u.queryParams(params.query) }`, params.body, {
				appName: 'clms'
			}), //
			
			getProblemStageApi: (params = {}) => vm.$u.get(
				`/clms/categorys/stage/${params}`,
				null, {
					appName: 'clms'
				}), //根据问题分类id获取问题阶段
			
			
			getProblemTypeByRoleApi: (params = {}) => vm.$u.get(
				`/clms/categorys/role/item`,
				params, {
					appName: 'clms'
				}), //获取用户角色拥有的分类权限
			
		
			
			getDataDictionaryApi: (params = {}) => vm.$u.post(`/sysadmin-server/wb/list/${params}`, null, {
				// appName: 'sysadmin'
				appName: 'clms'
			}), //查数据字典
			
		getLablesByCondApi: (params = {}) => vm.$u.post('/clms/lables/cond', params, {
			appName: 'clms'
		}), //查询问题标签
			

		
		
		

	}
}
