// 审批记录

import axios from '../../axios.js'

//获取流程图
export default function getHistoryProcessImage(vm, procInstId) {
	const envUrl = vm.$store.state.baseUrl
	return envUrl + `/qms/instance/history/image?procInstId=${procInstId}&t=` + Math.random()
}