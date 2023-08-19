// 4M管理
export default vm => {
	return {
		//获取项目列表
		getCustomerProjectApi: (params = {}) => vm.$u.post(
			`/qms/customerProject/list${ vm.$u.queryParams(params.query) }`, params.body, {
				appName: 'qms'
			}),

		//获取群组人员列表
		getUsersListApi: (params = {}) => vm.$u.post(
			`/qms/base/group/list${ vm.$u.queryParams(params.query) }`,
			params.body, {
				appName: 'qms'
			}),


		//作业指导人---获取群组人员列表
		getMembersListApi: (params = {}) => vm.$u.post(
			`/qms/base/group/members/list${ vm.$u.queryParams(params.query) }`,
			params.body, {
				appName: 'qms'
			}),

		// 根据父级ID获取级联信息
		getCascaderByParentId: (params = {}) => vm.$u.post(`/qms/cascader/parent/${params}`, null, {
			appName: 'qms'
		}),

		// 展示级联关系信息树
		getCascaderTreeList: (params = {}) => vm.$u.post('/qms/cascader/tree', params, {
			appName: 'qms'
		}),

		// 根据父级ID获取级联信息
		getLineByParentId: (params = {}) => vm.$u.post(`/qms/line/parent/${params}`, null, {
			appName: 'qms'
		}),


		// 通过扫描产品条码，获取MES对应线别、工序、设备
		selectSerialNumberApi: (params) => vm.$u.post(
			`/mes-interface/mesChangePoint/selectSerialNumber${vm.$u.queryParams(params) }`, null, {
				appName: 'mes-interface'
			}),

		// 4M变化点提报新建
		fourMInfoAddApi: (params) => vm.$u.post(
			'/qms/change/info/add', params, {
				appName: 'qms'
			}),

		// 分页查询4M变化点基础信息
		getChangexBaseInfoApi: (params = {}) => vm.$u.post(
			`/qms/change/info/list${ vm.$u.queryParams(params.query) }`,
			params.body, {
				appName: 'qms'
			}),


		//我的待办
		getMyAwaitListApi: (params = {}) => vm.$u.post(
			`/qms/app/task/wait${ vm.$u.queryParams(params.query) }`,
			params.body, {
				appName: 'qms'
			}),

		//我的已办
		getMyFinishListApi: (params = {}) => vm.$u.post(
			`/qms/app/instance/finish${ vm.$u.queryParams(params.query) }`,
			params.body, {
				appName: 'qms'
			}),

		// 根据主键businessKey获取4M变化点信息
		getFourMChangeDetailApi: (params = {}) => vm.$u.post(`/qms/change/info/${params}`, null, {
			appName: 'qms'
		}),

		// 作业指导提交
		workGuideApi: (params) => vm.$u.post(
			'/qms/change/task/guide', params, {
				appName: 'qms'
			}),

		// 产品标识
		productMarkingApi: (params) => vm.$u.post(
			'/qms/change/product/marking', params, {
				appName: 'qms'
			}),

		// 获取工序
		getProcessApi: (params = {}) => vm.$u.post(
			`/qms/group/list${ vm.$u.queryParams(params.query) }`,
			params.body, {
				appName: 'qms'
			}),

		// 获取设备	
		getDeviceApi: (params = {}) => vm.$u.post(
			`/qms/device/list${ vm.$u.queryParams(params.query) }`,
			params.body, {
				appName: 'qms'
			}),

		getWorkGuideImage: (params) => vm.$u.post(
			`/attachment-server/attachment/record${vm.$u.queryParams(params) }`, null, {
				appName: 'qms'
			}),
		//获取品质确认图片	
		getqualityConfirmImage: (params) => vm.$u.post(
			`/attachment-server/attachment/record${vm.$u.queryParams(params) }`, null, {
				appName: 'qms'
			}),

		//获取产品标识图片
		getProductFlagImage: (params) => vm.$u.post(
			`/attachment-server/attachment/record${vm.$u.queryParams(params) }`, null, {
				appName: 'qms'
			}),

		// 查询流转记录
		getHistoryList: (params = {}) => vm.$u.get(`/qms/instance/history/list?procInstId=${params}`, null, {
			appName: 'qms'
		}),

		// 获取树形结构线体
		getLineTree: (params = {}) => vm.$u.post(`/qms/line/parent/${params}`, null, {
			appName: 'qms'
		}),



		// 查询所有产线信息
		getAllLines: (params = {}) => vm.$u.post('/qms/line/all', params, {
			appName: 'qms'
		}),

		// 数据字典查询  				
		getDataDict: (params = {}) => vm.$u.post('/qms/dataDict/cond', params, {
			appName: 'qms'
		}),


		// 根据主键ID获取厂区
		getFactoryName: (params = {}) => vm.$u.post(`/sysadmin-server/factorys/${params}`, null, {
			appName: 'sysadmin'
		}),



	}


}