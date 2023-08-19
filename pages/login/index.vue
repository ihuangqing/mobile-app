<template>
	<view class="wrap">
		<uni-nav-bar :fixed="true" class="nav-info sws-w100 u-flex" @clickLeft="goBack">
			<view slot="left" class="u-p-l-15">
				<u-icon name="arrow-left" color="#ffffff" size="46"></u-icon>
			</view>
			<view class="u-flex-1 sws-font-fff u-text-center">{{ serverName }}</view>
			<view slot="right" @click="switchLang">
				<text class="lang u-font-32 sws-font-fff">{{ lang }}</text>
			</view>
		</uni-nav-bar>
		<view class="logo u-flex u-row-center">
			<view class="logo-img"></view>
		</view>
		<view class="content">
			<view class="title" @click="backDoor('vipLogin')">{{ $t('login.loginTitle') }}</view>
			<u-cell-group class="u-m-t-20" :border="false">
				<u-cell-item hover-class="none" title-width="40" icon="account-fill" icon-size="44" :arrow="false">
					<u-input :custom-style="fontSize" placeholder-style="font-size: 32rpx" :placeholder="$t('login.userName')"
						v-model="userName" />
					<u-icon slot="right-icon" name="arrow-down" size="34" color="#c0c4cc" v-show="historyUserList.length"
						@click="showHistoryUsers">
					</u-icon>
				</u-cell-item>
				<u-cell-item v-if="!isVipLogin" hover-class="none" title-width="40" icon="lock-opened-fill" icon-size="44"
					:arrow="false">
					<u-input :custom-style="fontSize" placeholder-style="font-size: 32rpx" :placeholder="$t('login.pwd')"
						type="password" v-model="pwd" />
				</u-cell-item>
			</u-cell-group>
		</view>
		<view class="alternative u-flex">
			<u-button v-if="isVipLogin" type="warning" class="u-flex-8 sws-line-h-repair" @click="vipLogin">VIP登录
			</u-button>
			<u-button v-else type="primary"
				:class="lang == 'EN' ? 'sws-line-h-repair login u-flex-8' : 'sws-line-h-repair u-flex-8'" :ripple="true"
				@click="validateLogin">
				{{$t('login.navTitle')}}
			</u-button>
			<u-button v-if="showCardLogin" type="success" class="u-flex-4 u-m-l-40" @click="toCardLogin">
				{{$t('login.nfcTitle')}}
				<u-icon name="arrow-rightward" class="u-m-l-6 u-font-32" color="#ffffff"></u-icon>
			</u-button>
		</view>
		<u-select v-model="show" :list="list" :title="title" :cancel-text="$t('common.cancel')"
			:confirm-text="$t('common.confirm')" @confirm="selectUser"></u-select>
		<u-modal v-model="showModal" :content="modalContent" @confirm="modalConfirm"></u-modal>
		<u-top-tips class="app-tips" ref="uTips"></u-top-tips>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'
	export default {
		data() {
			return {
				userName: '',
				pwd: '',
				title: '',
				list: [],
				show: false, //历史账号选择列表
				fontSize: {
					'font-size': '16px'
				},
				lang: 'EN',
				times: 0,
				timer: 0,
				active: true, //系统切换标识 true: 智慧现场  false: 设备感知
				modalContent: '',
				showModal: false,
				isVipLogin: false, //是否vip登录
				showCardLogin: false,
				disPage: ''
			}
		},
		computed: {
			trimUserNo() { // 去除所有空格
				return this.$u.trim(String(this.userName), 'all');
			},
			trimPwd() { // 去除所有空格
				return this.$u.trim(String(this.pwd), 'all');
			},
			serverName() {
				if (this.baseUrl.includes('10.201.88.40')) {
					return '测试环境'
				} else if (this.baseUrl.includes('10.201.88.43')) {
					return '开发环境'
				} else {
					return '' //正式环境
				}
			},
			...mapState(['userInfo', 'historyUserList', 'baseUrl', 'sysInfo'])
		},
		watch: {
			disPage(newVal) { //如果是有目标页面跳转的，则不支持NFC刷卡登录（后续完善功能）
				if (newVal) {
					this.showCardLogin = false
				}
			}
		},
		onLoad(options) {
			// #ifdef H5
			this.isVipLogin = true
			// #endif

			if (options.page) {
				this.disPage = options.page //获取目标页面
			} else {
				this.sysInfo.hardwareAttrList.forEach(item => {
					if ((item.attrCode === 'S002' || item.attrCode === 'S003') && +item
						.status) { //如果有NFC功能，且在启用状态，则显示刷卡登录
						this.showCardLogin = true
					}
				})
			}
			this.eventChannel = this.getOpenerEventChannel()
		},
		onReady() {
			this.getHistoryUser() //获取历史登录账号列表
		},
		methods: {
			...mapMutations(['login', 'setHistoryUser', 'getHistoryUser']),
			modalConfirm() {
				const params = {
					account: this.userName,
					oldPassword: this.pwd
				}
				uni.navigateTo({
					url: `/pages/mine/setting/editPwd/index${ this.$u.queryParams(params) }`
				})
			},
			showHistoryUsers() {
				this.title = this.$t('login.uSelectUser')
				this.list = this.historyUserList
				this.show = true
			},
			selectUser(arr) { // 选择历史登录账号
				let obj = arr[0]

				// #ifdef APP-PLUS
				this.userName = obj.value
				// #endif

				// #ifdef H5
				this.userName = obj.value
				this.pwd = this.historyUserList.filter(user => user.value == this.userName)[0].pwd
				// #endif					
			},
			validateLogin() { // 登录验证
				if (this.trimUserNo && this.trimPwd) {
					this.loginIn()
				} else {
					this.$refs.uTips.show({
						title: this.trimUserNo ? (this.trimPwd ? '' : '密码不能为空') : '账号不能为空',
						type: 'warning',
						duration: '2300'
					})
				}
			},
			loginIn() { // 登录
				this.$u.api.loginIn({
					grant_type: 'password',
					username: this.userName,
					password: encodeURIComponent(this.pwd)
				}).then(async res => {
					if (res.msgCode === '000000') {
						this.login({
							userName: res.data.user,
							account: this.userName,
							...res.data
						}) // 保存登录信息（taoken等）和登录状态

						const account = res.data.account
						const cookie =
							`Tdms-Account-${ account }=${ account }; Tdms-User-Token-${ account }=${res.data.access_token}`
						uni.setStorageSync('ugly-auth', cookie)

						// #ifdef APP-PLUS
						this.setHistoryUser({
							label: `${res.data.user}(${this.userName})`,
							value: this.userName
						}) //保存历史登录用户
						// #endif

						// #ifdef H5
						this.setHistoryUser({
							label: `${res.data.user}(${this.userName})`,
							value: this.userName,
							pwd: this.pwd
						}) //保存历史登录用户  H5端方便调试，记住pwd
						//#endif

						this.baseData.getDutyInfo(this, this.userName) //获取登录人员角色、在岗离岗信息
						this.baseData.getBaseUserInfo(this) //获取用户基础登录信息

						//登录成功默认平台首页, 如果有目标页，则跳转到目标页面
						if (this.disPage) {
							uni.navigateBack({
								complete: () => {
									this.eventChannel.emit('acceptDataFromOpenedPage')
								}
							})
						} else {
							uni.reLaunch({ //登录成功，跳转至首页
								url: '/pages/home/index'
							})
						}

					} else if (res.msgCode === '000002') {
						this.modalContent = '首次登录，请修改密码！'
						this.showModal = true
					} else if (res.msgCode === '000003') {
						this.modalContent = '密码超期，请修改密码！'
						this.showModal = true
					} else {
						this.$refs.uTips.show({
							title: `登录失败，原因：${res.message}`,
							type: 'error',
							duration: '2300'
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			switchLang() {
				if (this.lang == 'EN') {
					this.lang = "中文"
					this.$i18n.locale = 'en'
				} else {
					this.lang = 'EN'
					this.$i18n.locale = 'zh'
				}
			},
			goBack() {
				uni.navigateBack()
			},
			toCardLogin() {
				uni.navigateTo({
					url: '/pages/login/cardLogin/index'
				})
			},
			backDoor() {
				this.times++
				if (!this.timer) {
					this.timer = setTimeout(() => {
						this.times = 0
						clearTimeout(this.timer)
						this.timer = 0
					}, 1000)
				}
				if (this.times > 4) {
					this.isVipLogin = true
				}
			},
			vipLogin() {
				if (!this.userName) return
				const account = this.userName
				this.$u.api.loginIn({
					grant_type: 'vip',
					username: account
				}).then(async res => {
					if (res.msgCode === '000000') {
						this.login({
							userName: res.data.user,
							account,
							...res.data
						})

						const account = res.data.account
						const cookie =
							`Tdms-Account-${ account }=${ account }; Tdms-User-Token-${ account }=${res.data.access_token}`
						uni.setStorageSync('ugly-auth', cookie)

						// #ifdef H5
						this.setHistoryUser({
							label: `${res.data.user}(${this.userName})`,
							value: this.userName,
							pwd: ''
						}) //保存历史登录用户
						//#endif

						this.baseData.getDutyInfo(this, account) //获取登录人员角色、在岗离岗信息
						this.baseData.getBaseUserInfo(this) //获取用户基础登录信息

						//登录成功默认平台首页, 如果有目标页，则跳转到目标页面
						if (this.disPage) {
							this.eventChannel.emit('acceptDataFromOpenedPage')
							uni.navigateBack()
						} else {
							uni.reLaunch({ //登录成功，跳转至首页
								url: '/pages/home/index'
							})
						}

					} else {
						this.$refs.uTips.show({
							title: `Vip登录失败，原因：${ res.message }`,
							type: 'error',
							duration: '2300'
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			}
		},
		onUnload() {
			clearTimeout(this.timer)
		},
		onBackPress() {
			if (this.show) {
				this.show = false
				return true
			}
		}
	};
</script>

<style lang="scss" scoped>
	.wrap {
		font-size: 28rpx;
		height: 100%;
		width: 100%;
		background: linear-gradient(180deg, #2979ff 640rpx, #ffffff 0);

		.nav-info {
			height: 103.125rpx !important;

			::v-deep .uni-navbar__header {
				height: 103.125rpx;
				background-color: #2979ff !important;
				color: #ffffff !important;
			}

			::v-deep .uni-navbar--border {
				border-bottom: none !important;
			}
		}

		.app-tips {
			top: 103.125rpx !important;
		}

		.logo {
			width: 100%;
			height: 340rpx;
			padding: 0 30rpx 30rpx 30rpx;

			.logo-img {
				width: 400rpx;
				height: 140rpx;
				background: url(../../static/swd/logo.png) center no-repeat;
				background-color: rgba(255, 255, 255, .1);
				background-size: 80% 70%;
				margin: 0 auto;
				border-radius: 12rpx;
			}
		}

		.content {
			overflow: hidden;
			width: 90%;
			margin: 0 auto;
			background-color: #ffffff;
			box-shadow: 2rpx 8rpx 12rpx #ebebeb;
			border-radius: 12rpx;

			.title {
				text-align: left;
				font-size: 48rpx;
				padding: 40rpx 40rpx 20rpx 40rpx;
			}
		}

		.alternative {
			width: 90%;
			margin: 50rpx auto;

			.login {
				letter-spacing: 20rpx;
				text-indent: 20rpx;
			}
		}
	}

	.sys-change {
		color: rgba(0, 0, 0, .6);
		padding: 0 10rpx;

		&-item {
			width: 300rpx;
			height: 60rpx;
			border-radius: 8rpx;
			background-color: #ebebeb;
			color: rgba(0, 0, 0, .3);

			&-left {
				width: 60rpx;

				.col-line {
					height: 44rpx;
					border-left: 4rpx solid #ffffff;
					border-radius: 22rpx;
				}
			}
		}

		&-item.active {
			background-color: $u-type-success !important;
		}

		&-item.active .sys-name {
			color: #ffffff;
		}
	}

	::v-deep .input-placeholder {
		line-height: initial !important;
	}

	::v-deep .uni-input-input {
		font-size: 33.75rpx;
	}
</style>