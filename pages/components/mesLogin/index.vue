<!-- mes系统二次登录 -->
<template>
	<view class="sws-wh100 u-abso">
		<u-popup v-model="show" mode="center" width="80%" height="700rpx" :mask-close-able="false" duration="50"
			border-radius="16">
			<view class="sws-wh100 u-flex sws-flex-d-column popup-wrap">
				<u-image class="bg-image" width="200rpx" height="200rpx" :src="`../../../../static/swd/mesLogin.svg`">
				</u-image>
				<view class="login-top sws-w100 u-flex">
					<text>生产过程管理系统</text>
				</view>
				<view class="sws-w100 u-flex-1 u-flex sws-flex-d-column">
					<u-cell-group class="login-cell u-flex-1 sws-w100" :border="false">
						<u-cell-item required hover-class="none" :arrow="false" :border-bottom="false"
							bg-color="#ebeef5">
							<u-icon slot="icon" class="u-m-r-10" name="account1" custom-prefix="sws-icon" size="40"
								color="#82848a"></u-icon>
							<u-input height="60" :custom-style="{'font-size': '18px'}"
								placeholder-style="font-size: 28rpx" placeholder="请输入账号" v-model="userNo" />
							<u-icon slot="right-icon" name="arrow-down" size="34" color="#c0c4cc"
								v-show="mesHistoryUserList.length" @click="showHistoryUsers">
							</u-icon>
						</u-cell-item>
						<u-cell-item required hover-class="none" :arrow="false" :border-bottom="false"
							bg-color="#ebeef5">
							<u-icon slot="icon" class="u-m-r-10" name="Password" custom-prefix="sws-icon" size="40"
								color="#82848a"></u-icon>
							<u-input height="60" :custom-style="{'font-size': '18px'}"
								placeholder-style="font-size: 28rpx" placeholder="请输入密码" type="password"
								v-model="passWord" />
						</u-cell-item>
						<u-cell-item required hover-class="none" :arrow="false" :border-bottom="false"
							bg-color="#ebeef5">
							<u-icon slot="icon" class="u-m-r-10" name="shebei" custom-prefix="sws-icon" size="40"
								color="#82848a"></u-icon>
							<u-input height="60" :custom-style="{'font-size': '18px'}"
								placeholder-style="font-size: 28rpx" placeholder="请输入设备SN" v-model="deviceSn" />
						</u-cell-item>
						<u-cell-item required hover-class="none" :arrow="false" :border-bottom="false"
							bg-color="#ebeef5">
							<u-icon slot="icon" class="u-m-r-10" name="shenqingshiyou" custom-prefix="sws-icon"
								size="40" color="#82848a"></u-icon>
							<u-input height="60" :custom-style="{'font-size': '18px'}"
								placeholder-style="font-size: 28rpx" placeholder="请输入制令单号" v-model="moNo" />
						</u-cell-item>
					</u-cell-group>
					<view class="sws-w100 u-flex u-p-30 sws-line-h-repair">
						<u-button :hair-line="false" class="btn-style u-m-r-30" @click="toBack">取消</u-button>
						<u-button :hair-line="false" class="btn-style u-flex-1" @click="toLogin">登录</u-button>
					</view>
				</view>
			</view>
		</u-popup>
		<u-select v-model="showSelect" :list="list" title="选择登录工号" @confirm="selectConfirm"></u-select>
		<u-top-tips ref="uTips" class="login-tips"></u-top-tips>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'

	export default {
		props: {
			loginType: {
				default: 'mes'
			}
		},
		data() {
			return {
				show: true,
				userNo: '',
				passWord: '',
				deviceSn: '',
				moNo: '',
				list: [],
				showSelect: false
			}
		},
		computed: {
			...mapState(['mesHistoryUserList'])
		},
		created() {
			this.getMesHistoryUser() //获取历史登录账号列表
		},
		methods: {
			...mapMutations(['updateMesSessionId', 'updateMesLoginInfo', 'setMesHistoryUser', 'getMesHistoryUser']),
			selectConfirm(arr) {
				this.userNo = arr[0].label
				const user = this.mesHistoryUserList.find(item => item.userNo === this.userNo)
				this.deviceSn = user && user.deviceSn
				this.moNo = user && user.moNo
			},
			showHistoryUsers() {
				this.list = this.mesHistoryUserList.map(item => {
					return {
						label: item.userNo,
						value: item.userNo
					}
				})
				this.showSelect = true
			},
			toLogin() {
				const checkArr = [{
					tips: '请输入账号',
					value: this.userNo
				}, {
					tips: '请输入密码',
					value: this.passWord
				}, {
					tips: '请输入设备SN',
					value: this.deviceSn
				}, {
					tips: '请输入制令单号',
					value: this.moNo
				}]
				if (this.common.checkNotNull(this, checkArr)) {
					if (this.loginType == 'pmes') { //pmes登录
						this.postMesLoginForPmes()
					} else { //mes登录
						this.postMesLogin()
					}
				}
			},
			postMesLoginForPmes() {
				this.$u.api.postMesLoginForPmes({
					'useCode': this.userNo,
					'password': this.passWord,
					'taskNo': this.moNo,
					'deviceNo': this.deviceSn
				}).then(res => {
					if (res.success) {
						this.updateMesSessionId(res.data)
						// #ifdef APP-PLUS
						const record = {
							userNo: this.userNo,
							deviceSn: this.deviceSn,
							moNo: this.moNo
						}
						// #endif

						// #ifdef H5
						const record = {
							userNo: this.userNo,
							password: this.passWord,
							deviceSn: this.deviceSn,
							moNo: this.moNo
						}
						// #endif
						this.updateMesLoginInfo(record)
						this.setMesHistoryUser(record)
					} else {
						this.$refs.uTips.show({
							title: `PMES系统登录失败，原因：${ res.msg }`,
							type: 'error',
							duration: 2300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			postMesLogin() {
				this.$u.api.postMesLogin({
					userNo: this.userNo,
					passWord: this.passWord,
					deviceSn: this.deviceSn,
					moNo: this.moNo
				}).then(res => {
					if (res.msgCode === '000000' && res.data) {
						this.updateMesSessionId(res.data.mesSessionId)
						const record = {
							userNo: this.userNo,
							deviceSn: this.deviceSn,
							moNo: this.moNo
						}
						this.updateMesLoginInfo(record)
						this.setMesHistoryUser(record)
					} else {
						this.$refs.uTips.show({
							title: `生产过程管理系统登录失败，原因：${ res.message }`,
							type: 'error',
							duration: 2300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			toBack() {
				uni.navigateBack()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.popup-wrap {
		background-color: $u-type-primary;
		position: relative;
	}

	.login-top {
		height: 120rpx;
		align-items: center;
		justify-content: center;
		font-weight: bold;
		color: #fff;
		font-size: 36rpx;
		z-index: 3;
	}

	.btn-style {
		height: 80rpx;
		text-indent: 20rpx;
		letter-spacing: 20rpx;
		border-radius: 40rpx;
		font-size: 28rpx;
	}

	.bg-image {
		position: absolute;
		opacity: .4 !important;
		top: 10rpx;
		left: 30rpx;
	}

	.login-cell {
		padding: 0 30rpx;
	}

	.login-tips {
		z-index: 10975 !important;
	}

	::v-deep .login-cell .u-cell-item-box {
		width: 100%;
		background-color: transparent;

		.u-cell {
			border-radius: 60rpx;
			overflow: hidden;
			margin-top: 20rpx;
			padding: 10rpx 30rpx;
		}
	}
</style>
