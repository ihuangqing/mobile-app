const install = (Vue, vm) => {
	vm.$u.api = {}
	const requireComponent = require.context('./api', true, /\.js$/)
	requireComponent.keys().forEach(fileName => { //遍历common/api目录里，读取所有接口并赋值到vm.$u.api中
		const componentConfig = requireComponent(fileName)
		Object.assign(vm.$u.api, componentConfig.default(vm))
	})
}

export default {
	install
}
