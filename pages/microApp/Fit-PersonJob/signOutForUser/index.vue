<template>
	<view class="sws-wh100 u-flex sws-flex-d-column">
		<view class="sws-w100 u-flex-1 u-p-28">
			<view class="u-p-l-8 u-p-r-8">
				<view class="user-info">
					<view class="u-flex">
						<view class="u-text-center">
							<u-avatar :src="userInfo.avatar" bg-color="#ffffff" :show-level="false" size="180">
							</u-avatar>
						</view>
						<view class="u-flex-1 u-p-l-40 sws-font-fff">
							<view class="u-font-36">{{ userInfo.userName }}</view>
							<view class="u-font-32 u-m-t-4">{{ userInfo.account }}</view>
							<view class="u-font-32 u-m-t-4">{{ userInfo.deptName }}</view>
						</view>
					</view>
					<view class="sign-time u-flex">
						<view class="u-p-l-12 u-flex-1">
							<text>签到时间：</text>
							<text>{{ model.startDate }}</text>
						</view>
						<view>
							<u-icon v-if="+model.isTransfer" name="dot" custom-prefix="sws-icon" size="38"
								margin-left="0" color="#ff9900" label-color="#ff9900" label="临时借调"></u-icon>
							<u-icon v-else class="u-m-r-8" name="dot" custom-prefix="sws-icon" size="38" margin-left="0"
								:color="+model.postState ? '#19be6b' : '#fa3534'"
								:label-color="+model.postState ? '#19be6b' : '#fa3534'"
								:label="+model.postState ? '在岗' : '离岗'">
							</u-icon>
						</view>
					</view>
				</view>
			</view>
			<u-row gutter="16" class="u-m-t-36">
				<u-col span="4">
					<view class="info-layout u-flex sws-flex-d-column">
						<view class="sws-w100 u-tips-color u-p-l-24">
							<u-icon class="u-m-r-8" name="zhuguan" custom-prefix="sws-icon" size="28" label="主管">
							</u-icon>
						</view>
						<view
							class="sws-w100 u-main-color u-p-r-16 u-flex-1 u-flex u-row-right u-col-bottom u-text-right">
							{{ model.directorName }}
						</view>
					</view>
				</u-col>
				<u-col span="4">
					<view class="info-layout u-flex sws-flex-d-column">
						<view class="sws-w100 u-tips-color u-p-l-24">
							<u-icon class="u-m-r-8" name="banzuzhang" custom-prefix="sws-icon" size="28" label="组长">
							</u-icon>
						</view>
						<view
							class="sws-w100 u-main-color u-p-r-16 u-flex-1 u-flex u-row-right u-col-bottom u-text-right">
							{{ model.foremanName }}
						</view>
					</view>
				</u-col>
				<u-col span="4">
					<view class="info-layout u-flex sws-flex-d-column">
						<view class="sws-w100 u-tips-color u-p-l-24">
							<u-icon class="u-m-r-8" :name="+model.shift ? 'baiban' : 'yeban' " custom-prefix="sws-icon"
								size="28" label="班次">
							</u-icon>
						</view>
						<view
							class="sws-w100 u-main-color u-p-r-16 u-flex-1 u-flex u-row-right u-col-bottom u-text-right">
							{{ +model.shift ? '白班' : '夜班' }}
						</view>
					</view>
				</u-col>
			</u-row>
			<u-row gutter="16" class="u-m-t-16">
				<u-col span="4">
					<view class="info-layout u-flex sws-flex-d-column">
						<view class="sws-w100 u-tips-color u-p-l-24">
							<u-icon class="u-m-r-8" name="laxian" custom-prefix="sws-icon" size="28" label="拉线">
							</u-icon>
						</view>
						<view
							class="sws-w100 u-main-color u-p-r-16 u-flex-1 u-flex u-row-right u-col-bottom u-text-right">
							{{ model.lineName }}
						</view>
					</view>
				</u-col>
				<u-col span="4">
					<view class="info-layout u-flex sws-flex-d-column">
						<view class="sws-w100 u-tips-color u-p-l-24">
							<u-icon class="u-m-r-8" name="gongduan" custom-prefix="sws-icon" size="28" label="工段">
							</u-icon>
						</view>
						<view
							class="sws-w100 u-main-color u-p-r-16 u-flex-1 u-flex u-row-right u-col-bottom u-text-right">
							{{ model.mesArea }}
						</view>
					</view>
				</u-col>
				<u-col span="4">
					<view class="info-layout u-flex sws-flex-d-column">
						<view class="sws-w100 u-tips-color u-p-l-24">
							<u-icon class="u-m-r-8" name="gongxu" custom-prefix="sws-icon" size="28" label="岗位">
							</u-icon>
						</view>
						<view
							class="sws-w100 u-main-color u-p-r-16 u-flex-1 u-flex u-row-right u-col-bottom u-text-right">
							{{ model.postName }}
						</view>
					</view>
				</u-col>
			</u-row>
			<u-row gutter="16" class="u-m-t-16" v-if="model.deviceCodes.length">
				<u-col span="12">
					<view class="info-layout u-flex sws-flex-d-column">
						<view class="sws-w100 u-tips-color u-p-l-24">
							<u-icon class="u-m-r-8" name="shebei" custom-prefix="sws-icon" size="28" label="签到设备">
							</u-icon>
						</view>
						<view
							class="sws-w100 u-main-color u-p-r-16 u-flex-1 u-flex u-row-right u-col-bottom u-text-right">
							{{ model.deviceCodes.join('、') }}
						</view>
					</view>
				</u-col>
			</u-row>
		</view>
		<view class="sws-w100 u-p-28 u-flex">
			<u-button type="warning" class="sws-w100 u-m-r-20" @click="toShowSelect">异常签退</u-button>
			<u-button type="primary" class="sws-w100" @click="toSignOut">正常签退</u-button>
		</view>
		<u-select v-model="showSelect" :list="reasonList" title="请选择异常签退理由" @confirm="confirmReason"></u-select>
		<u-modal v-model="showInputRemark" @confirm="confirmRemark">
			<view class="u-p-30">
				<u-input type="textarea" placeholder="请输入理由" v-model="inputRemark" height="120"
					placeholder-style="fontSize: 32rpx" :custom-style="{'font-size': '36rpx'}" />
			</view>
		</u-modal>
		<u-modal v-model="show" :content="content" @confirm="modalConfirm"></u-modal>
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
				model: {
					directorName: '',
					foremanName: '',
					shift: '',
					lineName: '',
					mesArea: '',
					post: '',
					postState: '',
					startDate: '',
					deptName: '',
					isTransfer: 0, //是否临时借调
					deviceCodes: []
				},
				showSelect: false,
				reasonList: [],
				inputRemark: '',
				showInputRemark: false,
				content: '',
				show: false,
				num: 0, //计时基数
				maxTime: 3 * 60 //监听时长，单位s
			}
		},
		computed: mapState(['userInfo']),
		onShow() {
			this.getSignOutUsers()
		},
		onUnload() {
			clearInterval(this.timer)
		},
		methods: {
			toSignOut() { //暂不做二次校验
				if (+this.model.isTransfer) {
					this.$refs.uTips.show({
						title: '临时借调中，请先申请调入！',
						type: 'warning',
						duration: '2300'
					})
					return
				}

				let params = {
					staffList: [this.model]
				}

				this.$u.api.signOut(params).then(res => {
					if (res.msgCode === '000000') {
						this.$refs.uTips.show({
							title: '签退成功',
							type: 'success',
							duration: '3000'
						})

						setTimeout(() => {
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
							title: `签退失败，原因：${res.message}`,
							type: 'error',
							duration: '2300'
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			toShowSelect(user) {
				this.reasonList = [{ //请假理由列表
					label: '休假',
					value: 'XJ'
				}, {
					label: '旷工',
					value: 'KG'
				}, {
					label: '其他',
					value: 'QT'
				}]
				this.showSelect = true
			},
			confirmReason(arr) {
				const temp = arr[0]
				this.model.reason = temp.value
				this.model.reasonName = temp.label
				if (temp.value === 'QT') { //选择其他，输入理由
					this.curReason = temp
					this.inputRemark = ''
					this.showInputRemark = true
					return
				}
				this.toSignOut()
			},
			confirmRemark() {
				this.model.reason = this.curReason.value
				this.model.reasonName = this.curReason.label
				this.model.remark = this.inputRemark
				this.toSignOut()
			},
			getSignOutUsers() { //获取人员列表
				this.timer = null
				const params = {
					flag: 1 //flag参数，为1表示仅作为组员查，不传或传0则表示按原来的查
				}
				this.$u.api.getSignOutUsers(this.userInfo.account, params).then(res => {
					if (res.msgCode === '000000') {
						const userArr = res.data.filter(({
							account
						}) => account === this.userInfo.account)
						if (!userArr.length) {
							this.content = '暂无签退信息！'
							this.show = true
							return
						}

						this.model = {
							...this.model,
							...userArr[0]
						}

						this.toAutoSignOut()
					} else {
						this.$refs.uTips.show({
							title: `签退人员获取失败，原因：${ res.message }`,
							type: 'error',
							duration: '2300'
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			toAutoSignOut() {
				this.$u.api.getTimestamp().then(res => {
					if (res.msgCode && res.data) {
						const hour = new Date(res.data).getHours()
						// 白班17点之后,夜班5点之后,可以自动正常签退
						if ((+this.model.shift && hour >= 10) || (!+this.model.shift && hour >= 5)) {
							this.toSignOut()
						} else { //自动异常签退
							this.toShowSelect()
						}
					}
				}).catch(err => {
					this.$refs.uTips.show({
						title: '自动签退失败，请手动签退！',
						type: 'error',
						duration: '2300'
					})
				})
			},
			modalConfirm() {
				uni.navigateBack()
			},
			closePopup(isLogin) { //是否登录成功， true登录成功
				this.showNFCLogin = false //关闭弹窗
				this.getSignOutUsers()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.user-info {
		width: 100%;
		height: 340rpx;
		border-radius: 16rpx;
		padding: 40rpx;
		background: linear-gradient(to right, #2979ff, #12d8fa);
	}

	.sign-time {
		height: 56rpx;
		margin-top: 20rpx;
		background: #fff;
		border-radius: 8rpx;
		padding: 8rpx;
		overflow: hidden;
	}

	.info-layout {
		height: 130rpx;
		background: #e5e9f2;
		border-radius: 8rpx;
		padding: 16rpx 0;
	}
</style>
