<!-- 工卡登录 -->
<template>
	<view class="page-wrap sws-wh100">
		<u-search placeholder="" style="opacity: 0.0001;" v-if="showNFCInput" :focus="isFocus" v-model="nfcData"
			:show-action="false">
		</u-search>
		<view class="nfc-tips sws-font-fff u-font-40 u-text-center">请将工卡/手环置于设备的NFC识别区域
		</view>
		<view class="back-login" @click="backToLogin">
			<u-icon name="arrow-leftward" size="44" color="#ffffff"></u-icon>
			<text class="u-m-l-10 u-font-40 sws-font-fff">账号登录</text>
		</view>
		<u-top-tips ref="uTips"></u-top-tips>
	</view>
</template>

<script>
	// #ifdef APP-PLUS
	import nfc from '../../../js_sdk/hexiii-nfc/hexiii-nfc.js'
	// #endif

	import {
		mapState,
		mapMutations
	} from 'vuex'

	export default {
		data() {
			return {
				isFocus: false,
				showNFCInput: true,
				nfcData: '', //特殊一体机，需要输入框识别读取的nfc数据
				account: '',
				readData: {},
			}
		},
		computed: mapState(['sysInfo']),
		watch: {
			nfcData: {
				handler: function(newVal) {
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
			this.sysInfo.hardwareAttrList.forEach(item => {
				if (item.attrCode === 'S003' && +item.status) { //一体机的NFC刷卡
					this.showNFCInput = true
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
		onShow() {
			this.isFocus = true
		},
		methods: {
			...mapMutations(['login', 'setHistoryUser']),
			stopHideKeyboard() {
				var interval = setInterval(function() {
					uni.hideKeyboard() //隐藏软键盘
				}, 10)
				setTimeout(() => {
					clearInterval(interval)
				}, 2000)
			},
			nfcDataChange() {
				console.log('nfcDataChange', this.nfcData)
				if (this.nfcData.length == 10) {
					const data = this.nfcData.toString()
					if (data.startsWith(0)) {
						this.toGetUserInfo(data.substring(1))
					} else {
						this.toGetUserInfo(data)
					}
				}
				uni.hideKeyboard()
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
							this.vipLogin()
						} else if (res.data.length > 1) {
							let _self = this
							uni.showActionSheet({
								itemList: res.data.map(user => user.userName),
								success: user => {
									_self.account = res.data[user.tapIndex].account
									_self.userName = res.data[user.tapIndex].userName
									_self.vipLogin()
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
			vipLogin() {
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
						
						const account = res.data.account
						const cookie =
							`Tdms-Account-${ account }=${ account }; Tdms-User-Token-${ account }=${res.data.access_token}`
						uni.setStorageSync('ugly-auth', cookie)

						this.setHistoryUser({
							label: `${res.data.user}(${this.account})`,
							value: this.account
						})

						this.baseData.getDutyInfo(this, this.account) //获取登录人员角色、在岗离岗信息
						this.baseData.getBaseUserInfo(this) //获取用户基础登录信息

						uni.reLaunch({ //登录成功，跳转至首页
							url: '/pages/home/index'
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
			backToLogin() {
				uni.navigateBack()
			}
		},
		onHide() {
			// #ifdef APP-PLUS
			nfc.stopListenNFC()
			// #endif
		}
	}
</script>

<style lang="scss" scoped>
	.page-wrap {
		position: relative;
		background: #2979ff url(../../../static/swd/nfc2.png) 60% 35% no-repeat;
		background-size: 85%;
	}

	.nfc-tips {
		position: absolute;
		width: 100%;
		padding: 0 20%;
		bottom: 350rpx;
	}

	.back-login {
		position: absolute;
		width: 100%;
		padding: 52rpx;
		bottom: 0;
		left: 0;
	}
</style>
