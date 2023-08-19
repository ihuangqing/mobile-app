<!-- DIPS → 备品备件 -->
<template>
	<view class="sws-wh100">
		<material-manage ref="childComp"></material-manage>
		<u-popup v-model="showPopup" mode="bottom" length="70%" border-radius="20" :mask="false">
			<view class="sws-wh100 view-wrap u-rela">
				<view class="sws-wh100 u-flex u-row-center">
					<view class="u-flex-1 menu-wrap">
						<view class="menu-item u-flex sws-flex-d-column u-m-t-40" v-for="(menu, index) in list"
							:key="index" @click="toChildApp(menu.url)">
							<view class="icon-bg">
								<u-icon :name="menu.icon" custom-prefix="sws-icon" :size="58" color="#fff"></u-icon>
							</view>
							<view class="u-font-32 u-m-t-20 u-text-center sws-font-fff">{{ menu.name }}</view>
						</view>
					</view>
				</view>
				<view class="close-btn" @click="showPopup = false">
					<u-icon name="close" custom-prefix="sws-icon" size="60" color="#fff"></u-icon>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import materialManage from './materialManage/index.vue'

	export default {
		components: {
			materialManage
		},
		data() {
			return {
				list: [{
					name: '申领',
					icon: 'wuliaoshenqing',
					url: '/pages/microApp/Dips/spareParts/materialApply/index'
				}, {
					name: '入库',
					icon: 'jieshou',
					url: '/pages/microApp/Dips/spareParts/materialReceive/index'
				}, {
					name: '审批',
					icon: 'shenpi',
					url: '/pages/microApp/Dips/spareParts/materialApprove/index'
				}, {
					name: '发放',
					icon: 'beipinfafang',
					url: '/pages/microApp/Dips/spareParts/materialProvide/index'
				}, {
					name: '上机',
					icon: 'shanggui',
					url: '/pages/microApp/Dips/spareParts/materialUp/index'
				}, {
					name: '下机',
					icon: 'xiagui',
					url: '/pages/microApp/Dips/spareParts/materialDown/index'
				}],
				showPopup: false
			}
		},
		methods: {
			toChildApp(url) {
				this.showPopup = false
				uni.navigateTo({
					url
				})
			},
			async scanCode() {
				// #ifdef APP-PLUS
				this.$refs.childComp.keyword = await this.common.scanCode()
				this.$refs.childComp.fuzzyQuery()
				// #endif
			}
		},
		onBackPress() {
			if (this.showPopup) {
				this.showPopup = false
				return true
			}
		},
		onPullDownRefresh() {
			this.$refs.childComp.loadStatus = "loading"
			this.$refs.childComp.keyword = ''
			this.$refs.childComp.page = 1
			this.$refs.childComp.limit = 10
			this.$refs.childComp.list = []
			this.$refs.childComp.getMaterialList()
			uni.stopPullDownRefresh()
		},
		onReachBottom() {
			if (this.$refs.childComp.loadStatus != 'nomore') { //如果状态无无数据，则不再请求
				this.$refs.childComp.loadStatus = "loading"
				this.$refs.childComp.getMaterialList()
			}
		},
		onNavigationBarButtonTap(btns) {
			if (btns.index) { //扫码
				this.curItem = [] //置空当前点击列表项，表明此时点击的是header中的扫码
				this.scanCode()
			} else { //更多操作
				this.showPopup = !this.showPopup
			}
		}
	}
</script>

<style lang="scss" scoped>
	.view-wrap {
		padding-bottom: 140rpx;
	}

	.menu-wrap {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-around;

		.menu-item {
			width: 30%;
			height: 180rpx;

			.icon-bg {
				width: 120rpx;
				height: 120rpx;
				text-align: center;
				line-height: 120rpx;
				border-radius: 60rpx;
				background-color: #2979ff;
			}

			&:nth-child(2) .icon-bg {
				background-color: #d4237a;
			}

			&:nth-child(3) .icon-bg {
				background-color: #00b578;
			}

			&:nth-child(4) .icon-bg {
				background-color: #ff6110;
			}

			&:nth-child(5) .icon-bg {
				background-color: #ffaa19;
			}

			&:nth-child(6) .icon-bg {
				background-color: #1296db;
			}
		}
	}

	.close-btn {
		position: absolute;
		bottom: 40rpx;
		left: calc(50% - 50rpx);
		width: 100rpx;
		height: 100rpx;
		text-align: center;
		line-height: 100rpx;
		border-radius: 50rpx;
		background-color: #cccc;
	}

	::v-deep .u-drawer .u-drawer-bottom {
		backdrop-filter: blur(4rpx);
		background-color: rgba(0, 0, 0, .4) !important;
	}
</style>
