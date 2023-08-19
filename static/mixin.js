export default {
	install(Vue) {
		Vue.mixin({
			// 全局监听导航栏自定义按钮事件
			// onNavigationBarButtonTap: function(obj) {
			// 	uni.navigateBack()
			// },
			// 全局监听tabBar事件
			// onTabItemTap: function(obj) {
			// 	switch (obj.index) {
			// 		case 2:
			// 			// uni.showToast({
			// 			// 	title: '模块开发中，敬请期待！',
			// 			// 	position: 'center',
			// 			// 	duration: 1000
			// 			// });
			// 			break;
			// 	}
			// }
		})
	}
}
