export default vm => {
	const server = '/MESPdaServices.svc/PmesPdaApi'
	return {
		postMesLoginForPmes: (params = {}) => vm.$u.post(server + '/Login', params), //Pmes用户登录
		getDeviceListForPmes: (params = {}) => vm.$u.post(server + '/DeviceLoad', params), //根据登录的sessionId获取设备列表
		getShipCardInfoForPmes: (params = {}) => vm.$u.post(server + '/GetShipCartInfoByDeviceNo',
			params), //根据设备编号获取出货牌信息
		getShipCardNoForPmes: (params = {}) => vm.$u.post(server + '/GetShipCarts', params), //获取出货牌号
		checkGroupForPmes: (params = {}) => vm.$u.post(server + '/GroupKeyPress', params), //组别合法性校验
		postShipCardForPmes: (params = {}) => vm.$u.post(server + '/ShipCartSubmit', params), //提交出货牌信息
		getShipCardListForPmes: (params = {}) => vm.$u.post(server + '/GetTaskProcessAllShipCar',
			params), //获取当前工序同一制令单的的所有出货牌信息
		closeShipCardForPmes: (params = {}) => vm.$u.post(server + '/ShipCartClose', params), //关结出货牌
		updateShipCardForPmes: (params = {}) => vm.$u.post(server + '/UpdateAgitationSlod', params), //更新出货牌
		getStepListForPmes: (params = {}) => vm.$u.post(server + '/GetStepList', params), //获取工步列表
		getShipCardDetailForPmes: (params = {}) => vm.$u.post(server + '/StirStepNameSelecte',
			params), //获取搅拌工步的测试记录
		updateViscosityForPmes: (params = {}) => vm.$u.post(server + '/UpdateStepViscosity', params), //更新粘度值
		checkMatrialCodeForPmes: (params = {}) => vm.$u.post(server + '/GetItemInfo', params), // 物料参数校验
		postShipCardDetailForPmes: (params = {}) => vm.$u.post(server + '/AgitationDetailSubmit',
			params), //提交出货牌参数数据
		getShipCardForPmes: (params = {}) => vm.$u.post(server + '/GetShipCartInfo',
			params), //根据出货牌号获取出货牌相关信息(通用接口)
		postShipCartSubmitCommonForPmes: (params = {}) => vm.$u.post(server + '/ShipCartSubmitCommon',
			params), //涂布 → 分条 6个模块的提交
		checkPermissionForPmes: (params = {}) => vm.$u.post(server + '/CheckUserRole', params), //权限校验
		updateShipCardMumForPmes: (params = {}) => vm.$u.post(server + '/AddShipCartInputQty', params), //更新出货牌数量
		checkSnFRHCForPmes: (params = {}) => vm.$u.post(server + '/CheckSn', params.body, params.header), //条码校验
		delTranSnFRHCForPmes: (params = {}) => vm.$u.post(server + '/DelTranSn', params.body, params.header), //托盘解绑
		getTraySnAllForPmes: (params = {}) => vm.$u.post(server + '/GetTraySnAll', params.body, params
			.header), //获取托盘条码信息
		submitSnFRHCForPmes: (params = {}) => vm.$u.post(server + '/Submit', params.body, params.header), //提交条码
		upTranSnFRHCForPmes: (params = {}) => vm.$u.post(server + '/UpTranSn', params.body, params
			.header), //更新（重置）托盘
		loginToPmesOfJava: (params = {}) => vm.$u.post('/mesproject/v1/api/login/user.action', params), //pmes java服务的登录
		getLineWHMasterForPmes: (params = {}) => vm.$u.get('/mesproject/visualization/getLineWHMaster.action' + vm.$u
			.queryParams(params.query), null, params.header), //根据出货牌号Sn 获取在库信息
		getShipmentDetailForPmes: (params = {}) => vm.$u.get('/mesproject/visualization/getShipmentDetail.action' + vm.$u
			.queryParams(params.query), null, params.header), //出货牌不存在在库信息时，查询出货牌信息表
		updateLineWHMasterForPmes: (params = {}) => vm.$u.get('/mesproject/visualization/updateLineWHMaster.action' + vm
			.$u.queryParams(params.query), null, params.header), //线边仓 出入库
	}
}