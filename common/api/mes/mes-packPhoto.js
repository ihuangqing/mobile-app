// mes → 打包拍照
import axios from '../../axios.js'

export default vm => {
	return {
		postMesLogin: (params = {}) => vm.$u.post(
			'/mes-interface/mesEvb/userLogin', params, {
				appName: 'mes-interface'
			}), //mes登录
		getFindAllProjectRules: () => vm.$u.post('/mes-interface/mesEvb/findAllProjectRules', null, {
			appName: 'mes-interface'
		}), //获取项目列表
		postSaveProjectFiles: (params = {}) => vm.$u.post('/mes-interface/mesEvb/saveProjectFiles', params, {
			appName: 'mes-interface'
		}), //信息上装
		// 
		// 点检改善任务 - 分页查询
		// improveTaskList: (params = {}) => vm.$u.get('/sws/improveTask/list', params),
		// {
		// 	// appName: 'sws'
		// }), //信息上装
	}
}
