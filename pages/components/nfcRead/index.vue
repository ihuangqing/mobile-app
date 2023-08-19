<template>
	<u-popup v-model="showPopup" mode="bottom" duration="0" length="640rpx" :mask="false" :mask-close-able="true"
		@close="toClosePopup">
		<view class="sws-wh100 u-rela">
			<view class="card-wrap u-flex sws-flex-d-column">
				<u-input style="opacity: 0.001;position: absolute;" v-if="showNFCInput" v-model="nfcData"
					:focus="isFocus" type="text" placeholder="">
				</u-input>
				<view class="u-flex-1 sws-w100 u-text-right u-p-t-28 u-p-r-48">
					<u-icon name="arrow-rightward" size="32" color="#fff" label="账号登录" label-pos="left"
						label-color="#fff" @click="toLogin"></u-icon>
				</view>
				<view class="sws-font-fff u-font-36 u-text-center">
					请将工卡置于设备NFC识别区域
				</view>
			</view>
		</view>
		<u-top-tips ref="uTips"></u-top-tips>
	</u-popup>
</template>

<script>
	// #ifdef APP-PLUS
	import nfc from '@/js_sdk/hexiii-nfc/hexiii-nfc.js'
	// #endif

	import {
		mapState,
		mapMutations
	} from 'vuex'

	export default {
		props: {
			show: {
				type: Boolean,
				default: false
			},
			appPath: {
				type: String,
				default: '/pages/home/index'
			}
		},
		data() {
			return {
				showNFCInput: true,
				isFocus: false,
				nfcData: '', //特殊一体机，需要输入框识别读取的nfc数据
				showPopup: false,
				userName: '',
				account: '',
				readData: {},
				hideTips: true
			}
		},
		computed: mapState(['sysInfo']),
		watch: {
			show: function(val) {
				this.showPopup = val
				this.sysInfo.hardwareAttrList.forEach(item => {
					if (item.attrCode === 'S003' && +item.status) { //一体机的NFC刷卡
						this.showNFCInput = true
						this.nfcData = ''
						this.isFocus = true
						this.stopHideKeyboard()
					} else if (item.attrCode === 'S002' && +item.status) { //普通的NFC刷卡
						this.showNFCInput = false
						// #ifdef APP-PLUS
						nfc.listenNFCStatus()
						nfc.readData(this.$data)
						// #endif
					}
				})
			},
			nfcData: {
				handler: function(newVal, oldVal) {
					if (this.nfcData.length == 10) {
						const data = this.nfcData.toString()
						if (data.startsWith(0)) {
							this.toGetUserInfo(data.substring(1))
						} else {
							this.toGetUserInfo(data)
						}
					}
				}
			},
			readData(newVal) {
				if (Object.keys(newVal).length > 0) {
					if (newVal.id) {
						this.toGetUserInfo(newVal.id)
					}
				} else {
					this.$refs.uTips.show({
						title: '工卡识别失败！',
						type: 'warning',
						duration: 2300
					})
				}

				// #ifdef APP-PLUS
				setTimeout(() => { //防止连续触发
					nfc.readData(this.$data)
				}, 2000)
				// #endif
			}
		},
		onLoad() {
			this.showPopop = this.show
		},
		onHide() {
			// #ifdef APP-PLUS
			nfc.stopListenNFC()
			// #endif
		},
		methods: {
			...mapMutations(['login', 'setHistoryUser', 'updateHeader']),
			stopHideKeyboard() {
				var interval = setInterval(function() {
					uni.hideKeyboard() //隐藏软键盘
				}, 1)
				setTimeout(() => {
					clearInterval(interval)
				}, 2000)
			},
			toGetUserInfo(cardFixId) {
				const params = {
					cardFixId //3209766308一卡对多人测试账号
				}
				this.$u.api.getUserInfoFromC6(params).then(res => {
					if (res.msgCode === '000000') {
						if (res.data.length === 1) {
							this.account = res.data[0].account
							this.userName = res.data[0].userName
							this.nfcLogin()
						} else if (res.data.length > 1) {
							let _self = this
							uni.showActionSheet({
								itemList: res.data.map(user => user.userName),
								success: user => {
									_self.account = res.data[user.tapIndex].account
									_self.userName = res.data[user.tapIndex].userName
									_self.nfcLogin()
								}
							})
						} else {
							this.$refs.uTips.show({
								title: '您的数据未同步，请联系管理员！',
								type: 'warning',
								duration: 2300
							})
						}
					} else {
						this.$refs.uTips.show({
							title: `工卡识别失败，原因：${ res.message }`,
							type: 'error',
							duration: 2300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			nfcLogin() {
				this.$u.api.loginIn({
					grant_type: 'vip',
					username: this.account
				}).then(async res => {
					if (res.msgCode === '000000') {
						this.login({
							userName: res.data.user,
							account: this.account,
							...res.data
						})

						this.setHistoryUser({
							label: `${res.data.user}(${this.account})`,
							value: this.account
						})

						this.baseData.getDutyInfo(this, this.account) //获取登录人员角色、在岗离岗信息
						this.baseData.getBaseUserInfo(this) //获取用户基础登录信息

						this.toClosePopup(true) //关闭刷卡弹窗

						//如果路径名为_self，则不跳转页面
						if (this.appPath === '_self') return

						let routes = getCurrentPages(); // 获取当前打开过的页面路由数组
						let curRoute = routes[routes.length - 1].route
						if (this.appPath.includes(curRoute)) { //防止连续刷卡重复跳转
							return
						}
						uni.navigateTo({
							url: this.appPath
						})
					} else {
						this.$refs.uTips.show({
							title: `切换登录失败，原因：${ res.message }`,
							type: 'error',
							duration: '2300'
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			toLogin() {
				const _self = this
				const data = {
					page: this.appPath
				}
				uni.navigateTo({
					url: `/pages/login/index${ this.$u.queryParams(data) }`,
					events: {
						acceptDataFromOpenedPage() {
							_self.$emit('close-popup', true) //关闭刷卡弹窗
							setTimeout(() => {
								uni.navigateTo({
									url: data.page
								})
							}, 500)
						}
					}
				})
			},
			toClosePopup(flag = false) {
				this.$emit('close-popup', flag)
				// #ifdef APP-PLUS
				nfc.stopListenNFC()
				// #endif
			}
		}
	}
</script>

<style lang="scss" scoped>
	.card-wrap {
		position: absolute;
		bottom: 30rpx;
		left: 30rpx;
		width: calc(100% - 60rpx);
		height: 600rpx;
		background: #2979ff url('@/static/swd/nfc2.png') 50% 40% no-repeat;
		background-size: 60%;
		border-radius: 48rpx;
		padding-bottom: 40rpx;
	}

	::v-deep.u-drawer .u-drawer-content {
		background-color: transparent !important;
	}
</style>
