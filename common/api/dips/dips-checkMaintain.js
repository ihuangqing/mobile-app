/* disp → 设备点检、保养、维护、巡检 */
export default vm => {
	return {
		getListForDips: (params = {}) => vm.$u.post(`/dips/${params.query}`, params.body, {
			appName: 'dips'
		}), //获取列表信息
		putNoProduceForDips: (params = {}) => vm.$u.put(`/dips/${params.query}`), //无生产
		putFaultForDips: (params = {}) => vm.$u.put(`/dips/${params.query}`), //故障
		putCommitForDips: (params = {}) => vm.$u.put(`/dips/${params.query}`, params.body, {
			appName: 'dips'
		}), //登记确认
		getDeviceListForDips: (params = {}) => vm.$u.post(`/dips/devices/info/list${ vm.$u.queryParams(params.query) }`,
			params.body, {
				appName: 'dips'
			}), //获取设备档案
		postDeviceNFCForDips: (params = {}) => vm.$u.post(
			`/dips/devices/bind/${ params.deviceCode }/${ params.nfcCode }`, null, {
				appName: 'dips'
			}), //绑定设备和nfc标签
		getDeviceInfoByNFCForDips: (params = {}) => vm.$u.post(`/dips/devices/nfc/${ params.nfcCode }`, null, {
			appName: 'dips'
		}), //根据NFCid获取设备信息
		postUnbindDeviceNFCForDips: (params = {}) => vm.$u.post(`/dips/devices/unbind/${ params.deviceCode }`,
		null, {
			appName: 'dips'
		}), //解绑设备与标签关系
		postUpdateStateForDips: (params = {}) => vm.$u.post(`/dips/device/state/${ params }`, null, {
			appName: 'dips'
		}), //修改设备保养状态为 保养中
	}
}
