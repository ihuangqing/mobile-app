/* 首页接口 */
export default vm => {
	return {
		updateFileRecord: (params = {}) => vm.$u.post('/sws/fileStudy/study/record' + vm.$u.queryParams(
			params)), //上传文件学习记录
		getSwiperPic: (params = {}) => vm.$u.post('/sws/slideShow/all', params), //获取轮播图数据
		getNoticeList: (params = {}) => vm.$u.post('/sws/notice/all' + vm.$u.queryParams(params)), //获取公告列表
		getAllInOneList: (params = {}) => vm.$u.post('/sws/aio/detail/' + vm.$u.queryParams(
			params)), //获取一体机关联设备人员信息 参数为ip地址
		getUsersForSwitch: (params = {}) => vm.$u.post('/sws/aio/staff/'), //根据一体机ip获取对应的签到人员
	}
}
