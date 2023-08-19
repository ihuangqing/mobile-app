import axios from '../axios.js'
/* 公共数据接口 */
export default vm => {
	const state = vm.$store.state

	return {
		uploadMultiFiles: (params = {}) => {
			return new Promise((resolve, reject) => {
				uni.uploadFile({
					url: `${ vm.$store.state.baseUrl }/attachment-server/attachment/uploadAll${ params.query }`,
					method: 'POST',
					// files: files,
					filePath: params.urls[0],
					name: 'file',
					timeout: 5 * 60 * 1000,
					header: {
						"Content-Type": "multipart/form-data",
						Authorization: vm.$store.state.Authorization,
						appName: params.appName ? params.appName : "dips",
						factoryId: vm.$store.state.factoryId ? vm.$store.state.factoryId : 27,
						language: vm.$store.state.language ? vm.$store.state.language : 'zh',
					},
					success: (res) => {
						console.log('长度：', params.urls.length)
						resolve(res)
					},
					fail: (err) => {
						vm.common.sysErrToast(vm, err)
					}
				})
			}).then(res => {
				try {
					let data = JSON.parse(res.data)
					if (data.msgCode === '000000') { //上传成功
						params.urls.shift() //删除已上传的文件路径
						if (params.urls.length > 0) { //如果文件路径地址为空了，怎返回最后一个成功报文，否则递归调用继续上传
							return vm.$u.api.uploadMultiFiles(params) //重点：一定要返回次递归调用方法
						} else {
							return Promise.resolve(data)
						}
						return Promise.resolve(data)
					} else { //上传失败,返回失败报文和未上传文件路径列表
						return Promise.resolve(data)
					}
				} catch (err) {
					vm.common.sysErrToast(vm, err)
				}
			})
		},
		uploadMultiFilesForH5: (params = {}) => axios({
			url: `/attachment-server/attachment/uploadAll${ params.query }`,
			method: 'POST',
			data: params.body,
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
				Authorization: state.Authorization,
				appName: params.appName ? params.appName : "dips",
				factoryId: state.factoryId ? state.factoryId : 27,
				language: 'zh'
			}
		}), //多文件上传接口
		//文件上传，返回外网可访问图片链接地址
		uploadFileOfInOutNetwork: (params) => {
			console.log('~~~~~~params: ', params)
			return new Promise((resolve, reject) => {
				uni.uploadFile({
					url: `${ vm.$store.state.baseUrl }/sws/common/upload`,
					method: 'POST',
					filePath: params.urls[0],
					name: 'file',
					timeout: 5 * 60 * 1000,
					header: {
						"Content-Type": "multipart/form-data",
						Authorization: vm.$store.state.Authorization,
						appName: params.appName ? params.appName : "sws",
						factoryId: vm.$store.state.factoryId ? vm.$store.state.factoryId : 27,
					},
					success: (res) => {
						resolve(res)
					},
					fail: (err) => {
						vm.common.sysErrToast(vm, err)
					}
				})
			}).then(res => {
				try {
					let data = JSON.parse(res.data)
					if (data.msgCode === '000000') { //上传成功
						params.urls.shift() //删除已上传的文件路径
						if (params.urls.length > 0) { //如果文件路径地址为空了，怎返回最后一个成功报文，否则递归调用继续上传
							return vm.$u.api.uploadFileOfInOutNetwork(params) //重点：一定要返回次递归调用方法
						} else {
							return Promise.resolve(data)
						}
						return Promise.resolve(data)
					} else { //上传失败,返回失败报文和未上传文件路径列表
						return Promise.resolve(data)
					}
				} catch (err) {
					vm.common.sysErrToast(vm, err)
				}
			})
		},
		uploadFileOfInOutNetworkForH5: (params = {}) => axios({
			url: '/sws/common/upload',
			method: "POST",
			data: params,
			headers: {
				"Authorization": state.Authorization,
				"appName": params.appName ? params.appName : "sws",
				"factoryId": state.factoryId ? state.factoryId : 27,
			}
		}),
		getLines: (params = {}) => vm.$u.post('/dips/lines/cond', JSON.stringify(params)), //获取拉线
		getLinesNotToken: (params = {}) => vm.$u.post('/dips/lines', JSON.stringify(params)), //获取拉线（无需登录token）
		getGx: (params = {}) => vm.$u.post('/sws/groups/' + params), //获取工序
		getDirector: (params = {}) => vm.$u.post('/sws/common/directors'), //获取主管数据
		getDevices: (params = {}) => vm.$u.post('/sws/common/devices/' + params), //获取设备信息 参数是拉线id
		getDevicesByPostId: (params = {}) => vm.$u.post(
			`/sws/common/getDevicesByPostId/${ params }`), //获取设备信息 参数是岗位id
		getPosts: (params = {}) => vm.$u.post('/sws/common/posts' + vm.$u.queryParams(params)), //获取岗位信息，参数是工段
		getVersion: (params = {}) => vm.$u.get(
			'/sysadmin-server/intf/appVersion/sws'), //获取应用版本号，无需token appName factoryId等
		getAreas: (params = {}) => vm.$u.post('/dips/areas/cond', params), //根据条件查询区域列表
		getUserInfoFromC6: (params = {}) => vm.$u.post(
			`/sws/common/getWorkCardInfo/${params.cardFixId}`), //通过NFCid从C6系统获取人员信息
		getFileStudyVideoList: (params = {}) => vm.$u.post(
			`/sws/fileStudy/video${ vm.$u.queryParams({ip: '1'}) }`), //首页 → 浮窗 → 获取文件学习视频列表  实际不用传参，后续提醒王工优化此接口
		getUpgradeInfo: () => vm.$u.post('/sysadmin-server/version/getVersionInfo'), //用于检测到升级后获取最新的版本号和更新日志信息
		getAuthority: (params = {}) => vm.$u.post(
			`/sysadmin-server/appMenu/qryAppMenu${ vm.$u.queryParams(params) }`
		), //获取移动端权限 params包含 account 和module  1:首页,2:分类,3:可视化,4:我的
		getTimestamp: () => vm.$u.get('/sws/common/getTimestamp'), //获取时间戳
		getContinuousWork: (params = {}) => vm.$u.get(`/sws/common/getContinuousWork/${ params }`), //获取连续工作时长
		getDeviceInfo: (params) => vm.$u.post(
			`/sysadmin-server/hardware/detail/app/queryHardwareDetail`, params, {
				appName: 'sysadmin-server'
			}), //根据硬件设备的Mac地址获取硬件信息及应用权限
		getCondList: (params) => vm.$u.post('/sws/workShop/cond', params, {
			appName: 'sws'
		}), //根据条件获取工段数据
		getUserListFromSysadmin: (params) => vm.$u.post(
			`/sysadmin-server/users/list${ vm.$u.queryParams(params.query) }`,
			params.body, {
				appName: 'sysadmin-server'
			}), //分页查询人员列表
	}
}
