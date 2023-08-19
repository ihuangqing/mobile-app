/* E-SOP数据接口 */
export default vm => {
	return {
		getSopFileList: (params = {}) => vm.$u.post('/sws/fileStudy/sop/list', params), //未登录--获取sop课程文件
		getUserFileList: (params = {}) => vm.$u.post('/sws/fileStudy/study/list',
		params), //获取登录人员学习文件列表 参数type区分  1表示查询待学习文件，2表示查询已学习文件
		getFileInfo: (params = {}) => vm.$u.get('/sws/fileInfo/attach/' + params), //获取SOP学习文件
		getSkillMatrix: (params = {}) => vm.$u.post(`/sws/skillMatrix/list${ vm.$u.queryParams(params.query) }`,
			params.body), //获取技能矩阵
		getLearnRecordList: (params = {}) => vm.$u.get(
			`/sws/fileStudy/own/record/list${ vm.$u.queryParams(params) }`), //获取我的学习记录
		getLearnRecordInfo: (params = {}) => vm.$u.get(
		`/sws/fileStudy/stat/info${ vm.$u.queryParams(params) }`), //获取我的学习统计信息
		getFilterInfo: (params = {}) => vm.$u.get(
		`/sws/fileStudy/filter/info${ vm.$u.queryParams(params) }`), //获取过滤条件
	}
}
