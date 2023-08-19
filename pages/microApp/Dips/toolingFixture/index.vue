<!-- DIPS → 工治具管理 -->
<template>
	<view class="sws-wh100">
		<fixture-manage ref="childComp"></fixture-manage>
		<u-popup v-model="showPopup" mode="top">
			<u-grid :col="2" hover-class="none" @click="menuClick">
				<u-grid-item index="1">
					<u-icon name="pandian" custom-prefix="sws-icon" :size="52" color="#2979ff"></u-icon>
					<view class="u-font-30 u-m-t-10">盘点</view>
					<view class="u-font-24 u-type-info"></view>
				</u-grid-item>
				<u-grid-item index="2">
					<u-icon name="lingyong" custom-prefix="sws-icon" :size="52" color="#ffaa19"></u-icon>
					<view class="u-font-30 u-m-t-10">领用申请</view>
					<view class="u-font-24 u-type-info"></view>
				</u-grid-item>
				<u-grid-item index="3">
					<u-icon name="shebeibaoyang" custom-prefix="sws-icon" :size="54" color="#00b578"></u-icon>
					<view class="u-font-30 u-m-t-10">保养</view>
					<view class="u-font-24 u-type-info"></view>
				</u-grid-item>
				<u-grid-item index="4">
					<u-icon name="fafang" custom-prefix="sws-icon" :size="52" color="#d4237a"></u-icon>
					<view class="u-font-30 u-m-t-10">发放确认</view>
					<view class="u-font-24 u-type-info"></view>
				</u-grid-item>
				<u-grid-item index="5">
					<u-icon name="baoyangqueren" custom-prefix="sws-icon" :size="56" color="#2979ff"></u-icon>
					<view class="u-font-30 u-m-t-10">保养确认</view>
					<view class="u-font-24 u-type-info"></view>
				</u-grid-item>
				<u-grid-item index="6">
					<u-icon name="guihuan" custom-prefix="sws-icon" :size="52" color="#00b578"></u-icon>
					<view class="u-font-30 u-m-t-10">归还确认</view>
					<view class="u-font-24 u-type-info"></view>
				</u-grid-item>
				<u-grid-item index="7">
					<u-icon name="lvli" custom-prefix="sws-icon" :size="52" color="#ea986c"></u-icon>
					<view class="u-font-30 u-m-t-10">履历</view>
					<view class="u-font-24 u-type-info"></view>
				</u-grid-item>
			</u-grid>
		</u-popup>
		<u-top-tips ref="uTips"></u-top-tips>
	</view>
</template>

<script>
	import fixtureManage from './fixtureManage/index.vue'

	export default {
		components: {
			fixtureManage
		},
		data() {
			return {
				showPopup: false
			}
		},
		methods: {
			menuClick(index) {
				let url = ''
				switch (+index) {
					case 1:
						url = '/pages/microApp/Dips/toolingFixture/fixtureCheck/index'
						break
					case 2:
						url = '/pages/microApp/Dips/toolingFixture/fixtureApply/index'
						break
					case 3:
						// url = '/pages/microApp/Dips/toolingFixture/fixtureMaintainApply/index'
						// #ifdef APP-PLUS
						this.scanCode('maintain')
						// #endif

						// #ifdef H5
						this.getFixtureMaintainInfo('TP000000001')
						// #endif
						break
					case 4:
						url = '/pages/microApp/Dips/toolingFixture/fixtureApprove/index'
						break
					case 5:
						url = '/pages/microApp/Dips/toolingFixture/fixtureMaintainApprove/index'
						break
					case 6:
						url = '/pages/microApp/Dips/toolingFixture/fixtureReceive/index'
						break
					case 7:
						url = '/pages/microApp/Dips/toolingFixture/fixtureResume/index'
						break
				}
				this.showPopup = false
				if (url) {
					uni.navigateTo({
						url
					})
				}
			},
			getFixtureMaintainInfo(fixtureCode) {
				const _self = this
				this.$u.api.getFixtureMaintainInfo(fixtureCode).then(res => { //获取保养周期列表
					if (res.msgCode === '000000') {
						if (res.data.length) {
							uni.showActionSheet({
								itemList: res.data.map(item => item.cycle), //遍历周期列表，展示保养周期
								success: function(selectRes) {
									const params = {
										id: res.data[selectRes.tapIndex].id
									}
									_self.showPopup = false
									uni.navigateTo({
										url: `/pages/microApp/Dips/toolingFixture/fixtureMaintainApply/index${ _self.$u.queryParams(params) }`
									})
								},
								fail: function(err) {
									console.log(err.errMsg)
								}
							})
						} else {
							this.$refs.uTips.show({
								title: `无保养周期`,
								type: 'error',
								duration: 2300
							})
						}
					} else {
						this.$refs.uTips.show({
							title: `保养周期获取失败，原因：${ res.message }`,
							type: 'error',
							duration: 2300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			async scanCode(type) {
				// #ifdef APP-PLUS
				let code = await this.common.scanCode()
				if (type === 'maintain') { //扫码 → 保养
					this.getFixtureMaintainInfo(code)
				} else {
					this.$refs.childComp.keyword = code
					this.$refs.childComp.fuzzyQuery()
				}
				// #endif
			}
		},
		onBackPress() {
			if (this.showPopup) {
				this.showPopup = false
				return true
			}
		},
		onReachBottom() {
			if (this.$refs.childComp.loadStatus != 'nomore') { //如果状态无无数据，则不再请求
				this.$refs.childComp.loadStatus = "loading"
				this.$refs.childComp.getFixtureList()
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

<style>
</style>
