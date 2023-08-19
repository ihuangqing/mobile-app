// mes锁定解锁	
export default vm => {
	return {
		getProductInfoForMes: (params = {}) => vm.$u.post(
			`/mes-interface/app/lockProductListNewApp${ vm.$u.queryParams(params) }`, null, {
				appName: 'mes-interface'
			}), //根据产品编码获取产品信息
		getBadcodeForLock: (params = {}) => vm.$u.post(
			`/mes-interface/app/badRiskDetailLockListApp`, params, {
				appName: 'mes-interface'
			}), //根据产品编码获取不良代码（锁定）
		getBadCodeForOther: (params = {}) => vm.$u.post(
			`/mes-interface/app/selectSnToLockBadNewApp${ vm.$u.queryParams(params) }`, null, {
				appName: 'mes-interface'
			}), //根据产品编码获取不良代码（解锁&报废）
		getGroupListForMesLock: (params = {}) => vm.$u.post(
			`/mes-interface/app/getGroupSelectApp${ vm.$u.queryParams(params) }`, null, {
				appName: 'mes-interface'
			}), //根据产品编码获取发现工序（锁定）
		postLockForMes: (params = {}) => vm.$u.post(
			`/mes-interface/app/lockProductSubmitNewApp`, params, {
				appName: 'mes-interface'
			}), //产品锁定
		postUnlockForMes: (params = {}) => vm.$u.post(
			`/mes-interface/app/unlockProductSubmitNewApp`, params, {
				appName: 'mes-interface'
			}), //产品解锁
		postScrapForMes: (params = {}) => vm.$u.post(
			`/mes-interface/app/scrapProductSubmitNew`,
			params, {
				appName: 'mes-interface'
			}), //产品报废
		getProductSnForMesLock: (params = {}) => vm.$u.post(
			`/mes-interface/app/distinguishUpperCoverOrProductSn${ vm.$u.queryParams(params) }`, null, {
				appName: 'mes-interface'
			}), //通过上盖码查询产品条码
	}
}