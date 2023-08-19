<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')

			// #ifdef H5
			this.init(this, {
				ethMac: 'b4:f1:8c:a2:1a:6d',
				wlanMac: 'b4:f1:8c:a2:1a:6d',
				ip: '0.0.0.0'
			})
			// #endif

			//#ifdef APP-PLUS
			plus.screen.lockOrientation("portrait-primary") //禁止横屏
			if (uni.getSystemInfoSync().platform == "android") {
				const {
					ethMac,
					wlanMac
				} = this.common.getMacAddr()
				const ip = this.common.getIp()

				this.init(this, {
					ethMac,
					wlanMac,
					ip
				})
			} else { //ios设备不做设备校验
				this.init(this, {
					ethMac: 'b4:f1:8c:a2:1a:6d',
					wlanMac: 'b4:f1:8c:a2:1a:6d',
					ip: '0.0.0.0'
				})
			}
			//#endif
		},
		onShow: function() {},
		onHide: function() {},
		onPageNotFound: function() {
			console.log('404 页面不存在！')
		},
		methods: {
			init: async (vm, params) => {
				const sysInfo = uni.getSystemInfoSync()
				const deviceInfo = await vm.common.getDeviceInfo(vm, params)
				if (Object.keys(deviceInfo).length) {
					vm.$store.commit('saveSysInfo', {
						...sysInfo,
						...deviceInfo,
						...params
					})

					const {
						hardwareDetail
					} = deviceInfo

					vm.$store.commit('updateHeader', {
						language: 'zh',
						factoryId: hardwareDetail.factoryId,
						factoryName: hardwareDetail.factoryName
					}) //保存语言类型和所属组织到请求头

					// #ifdef APP-PLUS
					plus.navigator.closeSplashscreen()
					// #endif
				}
			}
		}
	}
</script>

<style lang="scss">
	@import "./static/iconfont.css"; //引入自定义阿里图标库
	@import "./static/iconfont-colorful.css"; //引入自定义阿里彩色图标库
	@import "uview-ui/index.scss"; //引入uview样式库
	@import "./static/sws.scss"; //引入自定义样式库

	/*每个页面公共css */
	page {
		height: 100%;
		width: 100%;
		background: #FFFFFF;
	}

	/* 全局覆盖样式 → 因为恶心的一体机 */
	::v-deep .uni-picker-view-indicator {
		height: 79.6875rpx;
	}

	::v-deep .u-select__body__picker-view__item {
		height: 79.6875rpx;
	}

	::v-deep uni-page-head .uni-page-head {
		height: 103.83999999999999rpx;
		height: calc(103.83999999999999rpx + constant(safe-area-inset-top));
		height: calc(103.83999999999999rpx + env(safe-area-inset-top));
		padding: 16.52rpx 9.44rpx;
		padding-top: calc(16.52rpx + constant(safe-area-inset-top));
		padding-top: calc(16.52rpx + env(safe-area-inset-top));
	}

	::v-deep uni-page-head .uni-page-head__title {
		line-height: 71.18rpx;
	}

	::v-deep uni-page-head .uni-page-head~.uni-placeholder {
		height: calc(103.83999999999999rpx + env(safe-area-inset-top));
	}

	// ::v-deep uni-page-head .uni-btn-icon {
	// 	font-size: 63.28125rpx !important;
	// }

	::v-deep uni-page-head[uni-page-head-type=default]~uni-page-wrapper {
		height: calc(100% - 103.125rpx);
		height: calc(100% - 103.125rpx - constant(safe-area-inset-top));
		height: calc(100% - 103.125rpx - env(safe-area-inset-top));
	}

	::v-deep .u-select__header__btn {
		font-size: 37.5rpx;
	}
</style>
