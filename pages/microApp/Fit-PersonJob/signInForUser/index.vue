<!-- 个人签到 -->
<template>
	<view class="sws-wh100 sws-overflow-hidden">
		<view class="head-bg">
			<view class="user-info sws-font-fff u-flex">
				<u-avatar :src="userInfo.avatar" bg-color="#ffffff" :show-level="false" size="large">
				</u-avatar>
				<view class="u-m-l-20 u-flex-1">
					<view class="user-info-name">{{ userInfo.userName }}</view>
					<view class="u-m-t-8 u-font-32">{{ userInfo.account }}</view>
				</view>
				<view class="shift-box" v-show="showShift">
					<view class="u-font-36 u-text-center u-p-t-12 u-p-b-12">
						<text
							:class="dayNight ? 'shift-box-baiban' : 'shift-box-yeban'">{{ dayNight ? '白班' : '夜班' }}</text>
					</view>
					<view class="u-flex u-row-center u-col-center">
						<u-switch v-model="dayNight" :showText="false" active-color="#feac11" inactive-color="#4d0f85">
							<u-icon slot="icon" :name="dayNight ? 'baiban' : 'yeban'" custom-prefix="sws-icon" size="42"
								:color="dayNight ? '#feac11' : '#4d0f85'"></u-icon>
						</u-switch>
					</view>
				</view>
			</view>
		</view>
		<view class="box-wrap u-flex sws-flex-d-column">
			<view class="info-box sws-w100">
				<view class="info-box-title u-text-right sws-font-fff u-font-28">
					<text>已连续签到</text>
					<text class="sws-font-bold u-font-32 u-m-l-8 u-m-r-8">{{ signedDay }}</text>
					<text>天</text>
				</view>
				<view class="u-p-l-30 u-p-r-20 u-m-t-30 ">
					<u-grid :col="7" :border="false" class="sign-grid" hover-class="none">
						<u-grid-item class="u-p-r-10" v-for="(item, index) in list" :key="index">
							<view class="sign-card sws-wh100 u-flex sws-flex-d-column"
								:class="item.signState ? 'active' : ''">
								<view class="u-flex-1 u-flex">
									<view class="sign-card-bubble">
										<u-icon v-if="item.signState" name="qiandao1" custom-prefix="sws-icon" size="50"
											color="#2979ff"></u-icon>
										<text v-else>{{ item.date.substr(8) }}</text>
									</view>
								</view>
								<view class="u-font-26 u-p-b-8 u-text-center"
									:class="item.signState ? 'sws-font-fff' : 'u-content-color'">{{ item.week }}
								</view>
							</view>
						</u-grid-item>
					</u-grid>
				</view>
			</view>
			<view class="box-line sws-w100">
				<view class="u-flex">
					<view class="u-flex-1 u-p-l-10">
						<u-icon name="lianjie" custom-prefix="sws-icon" size="100" color="#3c9cff"></u-icon>
					</view>
					<view class="u-flex-1 u-p-r-10 u-text-right">
						<u-icon name="lianjie" custom-prefix="sws-icon" size="100" color="#3c9cff"></u-icon>
					</view>
				</view>
			</view>
			<view class="box-extra sws-w100 u-flex-1 u-flex sws-flex-d-column">
				<view class="box-extra-header"></view>
				<view class="box-extra-content u-flex-1 sws-overflow-scroll-y">
					<view class="u-flex u-p-t-20 u-p-r-20 u-p-l-20" @click="toEditSignInfo">
						<view class="u-font-26 sws-font-bold">我的排班</view>
						<u-icon class="u-flex-1" name="bianji" custom-prefix="sws-icon" size="32" color="#2979ff"
							label-pos="left" label="编辑" label-color="#2979ff"></u-icon>
					</view>
					<view class="sign-content">
						<u-row>
							<u-col span="6">
								<u-cell-item hover-class="none" :title-style="{'font-size': '26rpx'}" :arrow="false"
									title="主管" :value="shiftInfo.directorName">
									<u-icon slot="icon" class="u-m-r-8" name="zhuguan" custom-prefix="sws-icon"
										size="28"></u-icon>
								</u-cell-item>
								<u-cell-item hover-class="none" :title-style="{'font-size': '26rpx'}"
									:value-style="{'padding-left': '30rpx', 'overflow-wrap': 'break-word'}"
									:arrow="false" title="拉线" :value="shiftInfo.lineName">
									<u-icon slot="icon" class="u-m-r-8" name="laxian" custom-prefix="sws-icon"
										size="28"></u-icon>
								</u-cell-item>
								<u-cell-item hover-class="none" :title-style="{'font-size': '26rpx'}"
									:value-style="{'padding-left': '30rpx', 'overflow-wrap': 'break-word'}"
									:arrow="false" title="岗位" :value="shiftInfo.postName">
									<u-icon slot="icon" class="u-m-r-8" name="gongxu" custom-prefix="sws-icon"
										size="28"></u-icon>
								</u-cell-item>
							</u-col>
							<u-col span="6">
								<u-cell-item hover-class="none" :title-style="{'font-size': '26rpx'}"
									:value-style="{'padding-left': '30rpx', 'overflow-wrap': 'break-word'}"
									:arrow="false" title="组长" :value="shiftInfo.foremanName">
									<u-icon slot="icon" class="u-m-r-8" name="banzuzhang" custom-prefix="sws-icon"
										size="28"></u-icon>
								</u-cell-item>
								<u-cell-item hover-class="none" :title-style="{'font-size': '26rpx'}" :arrow="false"
									title="工段" :value="shiftInfo.mesArea">
									<u-icon slot="icon" class="u-m-r-8" name="gongduan" custom-prefix="sws-icon"
										size="28"></u-icon>
								</u-cell-item>
							</u-col>
						</u-row>
					</view>
					<view class="u-p-t-20 u-p-r-8 u-p-l-20" v-show="devices.length">
						<view class="u-font-26 sws-font-bold">签到设备</view>
						<view class="sign-device">
							<view class="sign-device-item" :class="item.checked ? 'active' : ''"
								v-for="(item, index) in devices" :key="index" @click="toSelectDevice(item)">
								{{ item.deviceName }}
							</view>
						</view>
					</view>
				</view>
				<view class="sws-w100 u-p-20">
					<u-button type="primary" :ripple="true" @click="toPostUserSign">
						{{ dayNight ? '（白班）立即签到' : '（夜班）立即签到' }}
					</u-button>
				</view>
			</view>
		</view>
		<u-modal v-model="showModal" :content="content" :show-cancel-button="showCancelBtn" @confirm="modalConfirm">
		</u-modal>
		<u-top-tips ref="uTips"></u-top-tips>
		<nfc-read :appPath="appPath" :show="showNFCLogin" @close-popup="closePopup"></nfc-read>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'

	import nfcRead from '@/pages/components/nfcRead/index.vue'

	export default {
		components: {
			nfcRead
		},
		data() {
			return {
				timer: null, //计时，签退成功后，1分钟无响应，自动退出应用
				appPath: '_self',
				showNFCLogin: false,
				dayNight: true, //白夜班
				signedDay: 0, //连续签到天数
				list: [], //本周签到信息
				shiftInfo: {}, //排班信息
				devices: [], //设备列表
				showModal: false,
				showCancelBtn: false,
				content: '',
				isBack: false, //是否从详情页返回
				num: 0, //计时基数
				maxTime: 3 * 60, //监听时长，单位
				showShift: true
			}
		},
		computed: {
			...mapState(['userInfo'])
		},
		watch: {
			shiftInfo: {
				handler: function(newVal, oldVal) {
					if (Object.keys(oldVal).length && newVal.postId != oldVal.postId) { //如果岗位改变，则重新查询设备列表
						this.getDevices()
					}
				},
				deep: true
			}
		},
		onLoad() {
			this.isBack = false
		},
		onShow() {
			if (this.isBack) return
			this.getSignInfo()
		},
		onUnload() {
			clearInterval(this.timer)
		},
		onHide() {
			clearInterval(this.timer)
		},
		onBackPress() {
			clearInterval(this.timer)
		},
		methods: {
			closePopup(isLogin) { //是否登录成功， true登录成功
				this.showNFCLogin = false //关闭弹窗
				this.getSignInfo()
			},
			toSelectDevice(device) {
				device.checked = !device.checked
			},
			toPostUserSign() {
				if (this.signState) {
					this.content = '今天已签到，是否确认再次签到？'
					this.showCancelBtn = true
					this.showModal = true
					return
				}
				this.postUserSign()
			},
			postUserSign() {
				const params = {
					...this.shiftInfo,
					shift: this.dayNight ? '1' : '2',
					shiftCode: this.dayNight ? '1' : '2',
					deviceCodes: this.devices.filter(item => item.checked).map(device => {
						return device.deviceName
					})
				}

				this.$u.api.postUserSign(params).then(res => {
					if (res.msgCode === '000000' && res.data) {
						this.$refs.uTips.show({
							title: '签到成功',
							type: 'success',
							duration: '3000'
						})

						setTimeout(() => {
							this.isBack = false
							this.showNFCLogin = true
							this.num = 0 //初始化基数
							//监听连续NFC刷卡弹窗，如果弹窗在，则开始计时
							this.timer = setInterval(() => {
								this.num++
								if (this.num > this.maxTime) {
									clearInterval(this.timer)
									uni.navigateBack()
								}
							}, 1000)
						}, 300)
					} else {
						this.$refs.uTips.show({
							title: `签到失败，原因：${ res.message }`,
							type: 'warning',
							duration: 2300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			getSignInfo() {
				this.$u.api.getSignInfo(this.userInfo.account).then(res => {
					if (res.msgCode === '000000' && res.data) {
						const temp = res.data
						if (Object.keys(temp.shiftInfo).length) { //判断是否有排班信息
							this.showShift = true
							if (temp.signState) { //当日签到情况
								this.$refs.uTips.show({
									title: '今天已签到！',
									type: 'success',
									duration: 2300
								})
							}

							this.dayNight = temp.shiftInfo.shiftCode === '1' ? true : false
							this.shiftInfo = {
								...temp.shiftInfo,
								shift: temp.shiftInfo.shiftCode,
								userName: this.userInfo.userName, //人员名称
								account: this.userInfo.account, //人员工号
							}
							if (temp.devices) {
								this.devices = temp.devices.map(item => {
									if (temp.signState) { //如果已经签到了，需要判断一下
										return {
											deviceName: item,
											checked: temp.shiftInfo.devices.includes(item)
										}
									} else {
										return {
											deviceName: item,
											checked: false
										}
									}
								})
							}
							this.list = temp.signInWeeks
							this.signedDay = temp.signedDay
							this.signState = temp.signState
						} else {
							this.showShift = false
							this.content = '未查询到您的排班信息，请联系班组长签到并排班！'
							this.showCancelBtn = false
							this.showModal = true
						}
					} else {
						this.content = '排班信息获取失败，请刷卡重试！'
						this.showCancelBtn = false
						this.showModal = true
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			modalConfirm() {
				if (this.content.includes('今天已签到，是否确认再次签到')) {
					this.postUserSign()
				} else if (this.content.includes('未查询到您的排班信息，请联系班组长签到并排班！')) {
					this.isBack = false
					this.showNFCLogin = true
					this.num = 0 //初始化基数
					//监听连续NFC刷卡弹窗，如果弹窗在，则开始计时
					this.timer = setInterval(() => {
						this.num++
						if (this.num > this.maxTime) {
							clearInterval(this.timer)
							uni.navigateBack()
						}
					}, 1000)
				} else {
					uni.navigateBack()
				}
			},
			toEditSignInfo() {
				const data = {
					from: 'userSign',
					user: {
						lines: [{
							lineName: this.shiftInfo.lineName,
							lineCode: this.shiftInfo.lineCode,
							lineId: this.shiftInfo.lineId
						}], // 选中的拉线列表
						posts: [{
							postName: this.shiftInfo.postName,
							postId: this.shiftInfo.postId
						}], //选中的岗位列表
						...this.shiftInfo
					}
				}
				const _self = this
				_self.isBack = true

				uni.navigateTo({
					url: '/pages/microApp/Fit-PersonJob/signIn/dutyInfo/index',
					success(res) {
						res.eventChannel.emit('acceptDataFromOpenerPage', {
							data
						})
					},
					events: {
						acceptDataFromOpenedPage({
							user
						}) {
							_self.shiftInfo = {
								...user,
								lineName: user.lines[0].lineName,
								lineId: user.lines[0].lineId,
								postName: user.posts[0].postName,
								postId: user.posts[0].postId
							}
						}
					}
				})
			},
			getDevices() {
				this.$u.api.getDevicesByPostId(this.shiftInfo.postId).then(res => {
					if (res.msgCode === '000000') {
						this.devices = res.data.map(device => {
							return {
								deviceName: device.deviceCode,
								checked: false
							}
						})
					} else {
						this.$refs.uTips.show({
							title: `设备获取失败，原因：${res.message}`,
							type: 'error',
							duration: '2300'
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.head-bg {
		background-color: $u-type-primary;
		height: 400rpx;
		width: 100%;
		background: radial-gradient(circle at 50% -500rpx, #2979ff 950rpx, #ffffff 0);

		.user-info {
			height: 160rpx;
			padding-left: 60rpx;

			&-name {
				font-size: 44rpx;
			}
		}
	}

	.box-wrap {
		position: absolute;
		top: 170rpx;
		left: 0;
		width: 100%;
		height: calc(100% - 190rpx);
		padding: 0 40rpx;
		z-index: 3;
	}

	.info-box {
		height: 280rpx;
		box-shadow: 0 0 2rpx rgba(0, 0, 0, .2);
		background-color: #ffffff;
		border-radius: 20rpx;
		padding-top: 20rpx;

		&-title {
			padding: 8rpx 40rpx;
			background-color: #3c9cff;
		}
	}

	.box-line {
		margin: -42rpx 0 -44rpx 0;
	}

	.box-extra {
		box-shadow: 0 0 2rpx rgba(0, 0, 0, .2);
		background-color: #ffffff;
		border-radius: 20rpx;
		overflow: hidden;

		&-header {
			height: 50rpx;
			width: 100%;
			border-bottom: 2rpx solid #3c9cff;
		}

		&-content {
			width: 100%;
		}
	}

	.sign-card {
		border-radius: 8rpx;
		height: 120rpx;
		background-color: #f7f7f8;
		box-shadow: 0 0 2rpx rgba(0, 0, 0, .2);

		&-bubble {
			border-radius: 100%;
			width: 50rpx;
			height: 50rpx;
			line-height: 50rpx;
			text-align: center;
			color: #ffffff;
			background-color: #3c9cff;
		}
	}

	.sign-card.active {
		background-color: #3c9cff;
	}

	.sign-card.active .sign-card-bubble {
		color: #3c9cff;
		background-color: #fff;
	}

	.sign-device {
		display: flex;
		justify-content: left;
		align-items: center;
		flex-wrap: wrap;
		margin-top: 20rpx;

		&-item {
			padding: 0 12rpx;
			height: 68rpx;
			line-height: 68rpx;
			background-color: #f2f2f2;
			border: 2rpx solid #f2f2f2;
			color: #000000;
			font-size: 24rpx;
			text-align: center;
			border-radius: 8rpx;
			margin-top: 10rpx;
			margin-right: 10rpx;
		}
	}

	.sign-device-item.active {
		position: relative;
		border: 2rpx solid #2979ff;
		color: #2979ff;
		font-weight: bold;
		overflow: hidden;
	}

	.shift-box {
		width: 120rpx;
		height: 140rpx;
		background-color: #fff;
		border-radius: 20rpx;
		overflow: hidden;
		margin-right: 40rpx;

		&-baiban {
			color: #feac11;
		}

		&-yeban {
			color: #4d0f85;
		}
	}

	::v-deep.sign-grid .u-grid-item-box {
		padding: 0 !important;
	}

	::v-deep.info-box .u-cell {
		padding: 6rpx 20rpx;
	}

	::v-deep.info-box-title .u-cell {
		padding: 0 20rpx;
		background-color: #3c9cff !important;
	}

	::v-deep.sign-content .u-row {
		align-items: flex-start !important;
	}

	::v-deep.sign-content .u-cell {
		padding: 16rpx 10rpx;
	}
</style>
