/* 消息推送 */
export default vm => {
	return {
		postCid: (params = {}) => vm.$u.post('/message-server/push/setPushDevice', params), //绑定cid 与用户信息
		postMsgState: (params = {}) => vm.$u.post(
			`/message-server/push/setState${ vm.$u.queryParams(params) }`), //设置消息状态 type 类型(1-设置已接收,2-设置已读)
		getPushMsgByAccount: (params = {}) => vm.$u.post(`/message-server/push/send/${ params }`), //根据工号查询推送消息列表
	}
}
