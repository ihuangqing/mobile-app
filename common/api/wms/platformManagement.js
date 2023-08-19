export default vm => {
	return {
		postplatformStatusOfWms: (params = {}) => vm.$u.post('/sso/mod202305151/api/v1/ext/delivery-record/pda-add',
			params, {
				appName: 'wms'
			})
	}
}