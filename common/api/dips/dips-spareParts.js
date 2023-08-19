/* dips → 备品备件 */
export default vm => {
	return {
		getMaterialInfo: (params = {}) => vm.$u.post(`/dips/matMaterials/code/${ params }`, null, {
			appName: 'dips'
		}), //通过物料编号获取物料信息
		getMaterialList: (params = {}) => vm.$u.post(
			`/dips/matMaterialsStock/listDetails${ vm.$u.queryParams(params.query) }`, params.body), //通过物料列表
		postMaterialApply: (params = {}) => vm.$u.post('/dips/matMaterialsApply/add', params), //物料申请
		getLocationInfo: (params = {}) => vm.$u.post('/dips/matPosition/root'), //获取库位信息
		getLocationChildInfo: (params = {}) => vm.$u.post(`/dips/matPosition/${ params }/nodes`), //获取库位信息子节点信息
		postMaterialReceive: (params = {}) => vm.$u.post('/dips/matStockIn/addQty', params, {
			appName: 'dips'
		}), //物料申请
		getMaterialApproveInfo: (params = {}) => vm.$u.post(`/dips/matMaterialsApply/myTask${ params.query }`,
			params.body), //获取物料审核列表
		getMaterialProvideInfo: (params = {}) => vm.$u.post(
			`/dips/matMaterialsApply/provide/list${ params.query }`,
			params.body), //获取物料发放列表
		putApproveReject: (params = {}) => vm.$u.put(`/dips/matMaterialsApply/${ params.id }/reject`,
			params), //物料驳回
		putApprove: (params = {}) => vm.$u.put(`/dips/matMaterialsApply/${ params }/accept`), //物料审核
		putProvide: (params = {}) => vm.$u.put(`/dips//matMaterialsApply/pass`, params), //物料发放
		postProvideLifoAndFifo: (params = {}) => vm.$u.post(`/dips/matMaterialsApply/grant/${ params.id }`, params
			.body), //FIFO  LIFO 物料发放
		getMaterialImage: (params = {}) => vm.$u.post(
			`/attachment-server/attachment/record?module=spareParts&fileType=image&recordId=${ params }`
		), //获取物料详情的图片
		getMaterialInList: (params = {}) => vm.$u.post(`/dips/matStockIn/list${ vm.$u.queryParams(params.query) }`,
			params.body), //获取物料入库记录
		getMaterialOutList: (params = {}) => vm.$u.post(
			`/dips/matStockOut/list${ vm.$u.queryParams(params.query) }`,
			params.body), //获取物料出库记录
		getLinesForApply: (params = {}) => vm.$u.post('/dips/lines/cond', params), //物料申请 → 获取线体
		getDocList: (params = {}) => vm.$u.post(`/dips/file/app/list${ vm.$u.queryParams(params.query) }`, params
			.body, {
				appName: 'dips'
			}), //获取帮助文档列表
		getDocFileUrl: (params = {}) => vm.$u.post(`/attachment-server/attachment/${ params }/url`,
			null), //获取文件下载路径
		getDeviceTypeList: (params = {}) => vm.$u.post('/dips/devcates/cond', params, {
			appName: 'dips'
		}), //获取设备类型
		getDeviceCodeList: (params = {}) => vm.$u.get(
			`/dips/devices/list/${ params.lineId }/${ params.categoryId }`,
			null, {
				appName: 'dips'
			}), //获取设备编码
		getUnitCodeList: (params = {}) => vm.$u.get(`/dips/device/bom/unit/list${ vm.$u.queryParams(params) }`,
			null, {
				appName: 'dips'
			}), // 获取备件码列表
		getLocationCodeList: (params = {}) => vm.$u.get(
			`/dips/device/bom/position/list${ vm.$u.queryParams(params) }`, null, {
				appName: 'dips'
			}), // 获取位置码列表
		postMaterialSequence: (params = {}) => vm.$u.post('/dips/matMaterialsApply/sequence', params), // 提交备件序列码
		getRecommendDetails: (params = {}) => vm.$u.get(
			`/dips/matMaterialsApply/grant/detail${ vm.$u.queryParams(params) }`,
			null), // 获取推荐批次
		postProvideCheck: (params = {}) => vm.$u.post('/dips/matMaterialsApply/user/check', params, {
			appName: 'dips'
		}), //发放授权验证
		getMaterialUpList: (params = {}) => vm.$u.post(`/dips/matupdown/upList${ vm.$u.queryParams(params.query) }`,
			params.body), //获取上机记录
		getMaterialDownList: (params = {}) => vm.$u.post(
			`/dips/matupdown/downList${ vm.$u.queryParams(params.query) }`,
			params.body), //获取上机记录
		getMaterialLifeInfo: (params = {}) => vm.$u.get(
			`/dips/matupdown/${ params.matId }/${ params.locationCode }/life`), //获取物料寿命
		postMaterialUp: (params = {}) => vm.$u.post('/dips/matupdown/up', params), //上机
		postMaterialDown: (params = {}) => vm.$u.post('/dips/matupdown/down', params), //下机
		postMaterialCancelDown: (params = {}) => vm.$u.post('/dips/matupdown/cancelDown', params), //撤销下机
		getDataByLocationCode: (params = {}) => vm.$u.get(
			`/dips/device/bom/position/code${vm.$u.queryParams(params)}`), //根据位置码获取物料信息
	}
}
