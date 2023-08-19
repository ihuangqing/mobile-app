<template>
	<view class="sws-wh100 pm-warp u-rela">
		<view class="pm-warp-bg">
		</view>
		<view class="pm-warp-header">月台管理</view>
		<view class="sws-w100 pm-content u-flex sws-flex-d-column">
			<view class="pm-content-item" v-for="(item, index) in menuList" :key="index" @click="toPage(item)">
				<view class="pm-content-item-circle">
					<u-icon :name="item.icon" custom-prefix="sws-icon" size="72" color="#2979ff"></u-icon>
				</view>
				<view class="pm-content-item-rect">
					<view class="text-reflect">{{ item.name }}</view>
				</view>
			</view>
		</view>
		<view class="pm-warp-footer" @click="backToLogin">
			<u-icon name="arrow-leftward" size="44" color="#ffffff"></u-icon>
			<text class="u-m-l-10 u-font-40 sws-font-fff">返回</text>
		</view>
		<u-top-tips ref="uTips"></u-top-tips>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				menuList: [{
					icon: 'cheliangruyuan',
					name: '车辆入园'
				}, {
					icon: 'cheliangxiehuo',
					name: '月台卸货'
				}, {
					icon: 'xiehuowangong',
					name: '卸货完工'
				}]
			}
		},
		onLoad() {},
		methods: {
			toPage(item) {
				this.currMenu = item

				const _self = this
				uni.navigateTo({
					url: '/pages/microApp/Wms/platformManagement/pmDetail/index',
					success: function(res) {
						res.eventChannel.emit('acceptDataFromOpenerPage', {
							data: {
								..._self.currMenu
							}
						})
					}
				})
			},
			initData() {
				this.$u.api.getTokenForWms().then(res => {
					console.log('res: ', res)
					if (res.msgCode === '000000') {
						
					} else {
						this.$refs.uTips.show({
							title: `初始化失败，原因：${ res.message }`,
							type: 'error',
							duration: 3300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			backToLogin() {
				uni.navigateBack()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.pm-warp {
		background: #2979ff;

		&-bg {
			position: absolute;
			left: 0;
			top: 0;
			height: 100%;
			width: 100%;
			background: url('../../../../static/swd/yuetai.svg') 50% 100% no-repeat;
			background-size: 1300rpx;
			opacity: .6;
		}

		&-header {
			height: 120rpx;
			width: 100%;
			line-height: 120rpx;
			color: #fff;
			font-size: 44rpx;
			text-align: center;
		}

		.pm-content {
			height: calc(100% - 276rpx);
			justify-content: center;

			&-item {
				width: 100%;
				height: 160rpx;
				margin-bottom: 120rpx;
				display: flex;
				align-items: flex-end;
				justify-content: flex-end;

				&-circle {
					background-color: #fff;
					height: 160rpx;
					width: 160rpx;
					line-height: 160rpx;
					text-align: center;
					border-radius: 160rpx;
					margin-right: -80rpx;
					z-index: 2;
					box-shadow: 0 0 4rpx 2rpx rgba(255, 255, 255, 0.8);
				}

				&-rect {
					box-shadow: 0 0 4rpx 2rpx rgba(255, 255, 255, 0.8);
					display: flex;
					align-items: center;
					justify-content: center;
					width: 75%;
					height: 110rpx;
					z-index: 1;
					background-color: #fff;
					color: #2979ff;
					text-align: center;
					font-size: 36rpx;
					padding-left: 80rpx;
					padding-bottom: 26rpx;

					.text-reflect {
						-webkit-box-reflect: below -4rpx -webkit-linear-gradient(transparent, transparent 20%, rgba(255, 255, 255, 0.3));
						font-style: italic;
					}
				}


			}

			&-item:nth-child(2) .pm-content-item-rect {
				width: 65%;
			}

			&-item:last-child {
				margin-bottom: 0;

				.pm-content-item-rect {
					width: 55%;
				}
			}
		}

		&-footer {
			position: absolute;
			width: 100%;
			height: 156rpx;
			padding: 52rpx;
			bottom: 0;
			left: 0;
		}
	}
</style>