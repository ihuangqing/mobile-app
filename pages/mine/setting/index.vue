<!-- 我的 → 设置 -->
<template>
	<view class="page-wrap">
		<u-cell-group :border="false">
			<view v-for="(item, index) in settingList" :key="index">
				<u-cell-item hover-class="none" :title="item.menuName"
					:value="item.menuName == '版本信息' ? ('v' + appVer) : ''" @click="goToApp(item.path)">
					<u-icon slot="icon" class="u-m-r-20" :name="item.icon" custom-prefix="sws-icon" size="36"></u-icon>
				</u-cell-item>
				<u-gap height="20" bg-color="#ebebeb" v-show="!item.menuName.includes('版本信息')"></u-gap>
			</view>
			<u-cell-item hover-class="none" title="清除缓存" :arrow="false"
				:value-style="{color: '#2979ff', 'padding-right': '10rpx', 'font-size': '28rpx'}" :value="storageCache"
				@click="toClearCache">
				<u-icon slot="icon" class="u-m-r-20" name="quanbuyidu" custom-prefix="sws-icon" size="36"></u-icon>
			</u-cell-item>
			<u-gap height="20" bg-color="#ebebeb"></u-gap>
			<u-cell-item hover-class="none" title="缓存文件最小值" label="点击可修改缓存文件最小值" :arrow="false"
				:value-style="{color: '#2979ff', 'padding-right': '10rpx', 'font-size': '32rpx'}"
				:label-style="{'font-size': '24rpx'}" :value="formatCacheFileSize" @click="toShowSlider">
				<u-icon slot="icon" class="u-m-r-20" name="huancun" custom-prefix="sws-icon" size="36"></u-icon>
			</u-cell-item>
		</u-cell-group>
		<u-popup v-model="showSlider" mode="bottom" height="250rpx" :mask="false">
			<view slot="default" class="sws-wh100 u-p-l-40 u-p-r-40 u-p-b-40 u-flex sws-flex-d-column u-row-center">
				<view class="u-m-b-30">缓存文件最小值：{{ sliderVal }}M</view>
				<u-slider class="sws-w100" v-model="sliderVal" min="0" max="100" step="5" block-width="40"
					block-color="#2979ff" @end="sliderEnd"></u-slider>
			</view>
		</u-popup>
		<u-modal v-model="showModal" :show-cancel-button="true" @confirm="modalConfirm">
			<view class="sws-w100 u-p-40">
				<view class="u-font-32 u-text-center">是否清除缓存数据？</view>
				<view class="u-font-24 u-m-t-16 u-type-info">*缓存数据：用户登录信息、历史登录用户信息、登录人常用模块、品质异常单(EVB)、品质异常单(EVC)、巡检不符合项
				</view>
			</view>
		</u-modal>
		<u-top-tips ref="uTips"></u-top-tips>
	</view>
</template>

<script>
	import {
		mapState,
		mapGetters,
		mapMutations
	} from 'vuex'

	export default {
		data() {
			return {
				storageCache: '', //缓存大小
				settingList: [],
				sliderVal: 30,
				showSlider: false,
				showModal: false,
				cacheItems: ['userInfo', 'nearestApps',
					'historyUser'
				] //可清除的缓存key  userInfo登录用户的缓存信息   nearestApps关联登录人的常用apps  historyUser历史登录人员列表  exception_evc品质异常单EVC  exception_evb品质异常单EVB  exception_item 巡检不符合项
			}
		},
		computed: {
			...mapState(['cacheFileSize', 'sysInfo', 'userInfo']),
			...mapGetters(['appVer']),
			formatCacheFileSize() {
				return this.cacheFileSize / 1024 + 'M'
			}
		},
		onLoad() {
			this.getAuthority()
			this.getLocalStorageUse()
		},
		methods: {
			...mapMutations(['changeBaseUrl', 'setCacheFileSize', 'clearNearestApps', 'clearHistoryUser']),
			modalConfirm() {
				this.clearCache()
			},
			clearCache() {
				this.cacheItems = [...this.cacheItems, `exception_evc_${ this.userInfo.account }`,
					`exception_evb_${ this.userInfo.account }`, `exception_item_${ this.userInfo.account }`
				]
				this.cacheItems.forEach(key => {
					if (uni.getStorageSync(key)) {
						uni.removeStorage({
							key
						})
					}
				})
				this.storageCache = ''
				this.clearNearestApps()
				this.clearHistoryUser()
			},
			toClearCache() {
				if (this.storageCache) {
					this.showModal = true
				} else {
					this.$refs.uTips.show({
						title: '暂无可清除的缓存',
						type: 'warning',
						duration: '2300'
					})
				}
			},
			getLocalStorageUse() {
				let cache = 0
				this.cacheItems.forEach(key => {
					const temp = uni.getStorageSync(key).toString()
					if (temp) {
						cache += temp.length
					}
				})
				if (cache) {
					this.storageCache = (cache / 1024).toFixed(2) + 'KB'
				}
			},
			getAuthority() {
				const params = {
					account: this.userInfo.account,
					module: 3
				}
				this.$u.api.getAuthority(params).then(res => {
					if (res.msgCode === '000000' && res.data) {
						let newArr = []
						const deviceApps = this.sysInfo.appMenuList.filter(item => item.menuName == '设置应用')
						const userApps = res.data.filter(item => item.menuName == '设置应用')
						if (deviceApps.length && userApps.length) {
							deviceApps[0].subMenus.forEach(temp => {
								userApps[0].subMenus.forEach(item => {
									if (temp.menuName == item.menuName) {
										newArr.push(temp)
									}
								})
							})
						}

						this.settingList = [
							...newArr
						]
					} else {
						this.$refs.uTips.show({
							title: `设备列表获取失败，原因：${ res.message }`,
							type: 'error',
							duration: '2300'
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			sliderEnd() {
				this.setCacheFileSize(this.sliderVal * 1024)
			},
			toShowSlider() {
				this.sliderVal = this.cacheFileSize / 1024
				this.showSlider = true
			},
			toChangeServer() {
				uni.showActionSheet({
					itemList: ['测试环境', '开发环境', '生产环境'],
					success: (res) => {
						this.changeBaseUrl(res.tapIndex)
						uni.reLaunch({
							url: '/pages/login/index'
						})
					}
				})
			},
			goToApp(url) { //跳转至修改密码页面
				if (url.includes('changeServer')) {
					this.toChangeServer()
				} else if (url.includes('upgradeApp')) {
					this.upgradeApp()
				} else {
					uni.navigateTo({
						url: url
					})
				}
			},
			upgradeApp() {
				// #ifdef APP-PLUS
				plus.runtime.getProperty(plus.runtime.appid, (wgtInfo) => {

					this.common.upgradeApp(this, wgtInfo.version)
				})
				// #endif
			}
		},
		onBackPress() {
			if (this.showSlider) {
				this.showSlider = false
				return true
			}
		}
	}
</script>

<style lang="scss" scoped>
	.slider-popup {
		padding: 100rpx 40rpx;
	}
</style>
