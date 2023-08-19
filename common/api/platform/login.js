/* 登录接口 */
export default vm => {
	return {
		loginIn: (params = {}) => vm.$u.post('/auth-server/oauth/token' + vm.$u.queryParams(params)), //登录
		getUserInfo: (params = {}) => vm.$u.post('/sysadmin-server/users/current'), //获取人员基础信息
		getUserInfoByAccount: (params = {}) => vm.$u.post('/sysadmin-server/users/account/' +
			params), //根据人员工号获取人员基础信息，含性别无部门
		getFactorys: (params = {}, header = {}) => vm.$u.post('/sysadmin-server/intf/users/' + params +
			'/authorizedfactorys', null, header), //获取人员所属组织
		getAllFactorys: (params = {}) => vm.$u.post(`/sysadmin-server/users/getFactories/${ params }`), //不区分系统，获取账号关联的所有组织
		getOnDutyInfo: (params = {}) => vm.$u.post('/sws/common/staff/' + params), //获取普通员工在岗信息，其中memberId是早会签到之后才会有
		firstLoginEditPwd: (params = {}) => vm.$u.put(
			`/sysadmin-server/intf/users/${ params.account }/firstpsw${ vm.$u.queryParams(params) }`), //首次登录修改密码
	}
}
