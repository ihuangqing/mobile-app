<!-- 人岗匹配 → 下班签退 -->
<template>
	<view class="sws-wh100 u-flex sws-flex-d-column sws-overflow-hidden">
		<view class="sws-w100 u-flex-1 sws-overflow-scroll-y">
			<view class="u-rela u-flex u-p-t-20 u-m-b-10" v-for="(user, index) in userList" :key="index">
				<u-card class="sws-w100 user-card" margin="10rpx 20rpx" border-radius="16"
					:title="`${user.userName}(${user.account})`"
					:head-style="{background: '#2979ff', padding: '20rpx 30rpx', color: '#ffffff'}" title-color="#fff"
					sub-title-color="#fff" :body-style="{overflow: 'hidden', padding: '0', border: '1px solid #ebebeb',
    'border-bottom-left-radius': '16rpx', 'border-bottom-right-radius': '16rpx'}" :show-foot="false">
					<u-cell-group slot="body" :border="false">
						<u-cell-item class="u-p-t-0 u-p-b-0" :value-style="{color: '#303133'}" title="签到时间"
							:value="user.startDate" hover-class="none" :arrow="false"
							:border-bottom="user.isSignIn === '0'">
						</u-cell-item>
						<u-cell-item class="u-p-t-0 u-p-b-0"
							:value-style="{color: '#303133','padding-left': '30rpx', 'overflow-wrap': 'break-word'}"
							v-show="user.isSignIn === '0'" :border-bottom="false" title="签退原因" hover-class="none"
							arrow-direction="right" :value="user.reasonName ? user.reasonName : '请选择签退原因'"
							@click="toShowSelect(user)"></u-cell-item>
					</u-cell-group>
				</u-card>
				<view class="check-group u-flex">
					<view :class="user.normalOut ? 'check-btn check-in-btn' : 'check-btn'" @click="normalSignOut(user)">
						<text>正常</text>
					</view>
					<view class="check-btn-gap"></view>
					<view :class="user.abnormalOut ? 'check-btn check-in-btn' : 'check-btn'"
						@click="abnormalSignOut(user)">
						<text>异常</text>
					</view>
				</view>
			</view>
		</view>
		<view class="check-btn-group sws-w100 u-flex u-row-between">
			<view>
				<u-checkbox @change="checkboxChange" v-model="checkAll">全部正常</u-checkbox>
			</view>
			<u-button class="check-confirm" type="primary" @click="signOut">签退</u-button>
		</view>
		<u-popup v-model="showPopup" mode="center" border-radius="14" width="500">
			<u-card class="sws-w100 user-card" margin="0" border-radius="0" title="签退帮助"
				:head-style="{background: '#2979ff', padding: '20rpx 30rpx', color: '#ffffff'}" title-color="#fff"
				sub-title-color="#fff" :body-style="{overflow: 'hidden', padding: '0'}"
				:foot-style="{padding: '10rpx 0'}" :show-foot="false" :border="false">
				<view slot="body" class="u-p-20">
					<view class="line-h">1. 未签到人员不能进行签退</view>
					<view class="line-h">2. 异常签退需要选择签退原因</view>
					<view class="line-h">3. 正常签退时间：<text class="u-type-error">白班17:00之后、</text><text
							class="u-type-error">夜班05:00</text></view>
					<view class="line-h">4. 临时请假请及时签退</view>
				</view>
			</u-card>
		</u-popup>
		<u-select v-model="showSelect" :list="reasonList" title="请选择异常签退理由" @confirm="confirmReason"></u-select>
		<u-modal v-model="showInputRemark" @confirm="confirmRemark">
			<view class="u-p-30">
				<u-input type="textarea" placeholder="请输入理由" v-model="inputRemark" height="120"
					placeholder-style="fontSize: 32rpx" :custom-style="{'font-size': '36rpx'}" />
			</view>
		</u-modal>
		<u-modal v-model="show" :content="content" @confirm="confirm"></u-modal>
		<u-top-tips ref="uTips"></u-top-tips>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	export default {
		data() {
			return {
				show: false,
				content: '签退成功',
				checkAll: false,
				userList: [], // 可以签退人员列表
				uploadList: [], //申请签退人员列表
				reasonList: [],
				showSelect: false,
				showPopup: false,
				inputRemark: '',
				showInputRemark: false
			}
		},
		computed: mapState(['userInfo', 'dutyInfo']),
		onReady() {
			this.getSignOutUsers()
		},
		methods: {
			checkboxChange(check) {
				this.userList.forEach(user => {
					if (check.value) {
						user.normalOut = true
						user.abnormalOut = false
						user.isSignIn = '1'
					} else {
						user.normalOut = false
						user.abnormalOut = false
						user.isSignIn = 0
					}
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
				this.curUser = user //记录当前操作人员
				this.showSelect = true
			},
			confirmReason(arr) {
				const temp = arr[0]
				this.curUser.reason = temp.value
				this.curUser.reasonName = temp.label
				if (temp.value === 'QT') { //选择其他，输入理由
					this.curReason = temp
					this.inputRemark = ''
					this.showInputRemark = true
				}
			},
			confirmRemark() {
				this.curUser.reason = this.curReason.value
				this.curUser.reasonName = this.curReason.label
				this.curUser.remark = this.inputRemark
			},
			signOut() { //签退
				this.uploadList = this.userList.filter(user => {
					return user.normalOut || user.abnormalOut
				})
				if (!this.uploadList.length) {
					this.$refs.uTips.show({
						title: '请选择签退人员',
						type: 'warning',
						duration: '2300'
					})
					return
				}

				let users = this.uploadList.filter(user => { //筛选出非正常签退且无签退原因的
					return !+user.isSignIn && !user.reason
				})
				if (users.length) {
					this.content = `${ users.map(user => user.userName).join('、') }异常签退，请选择签退原因`
					this.show = true
					return
				}

				let params = {
					staffList: this.uploadList
				}

				this.$u.api.signOut(params).then(res => {
					if (res.msgCode === '000000') {
						this.content = '签退成功'
						this.show = true
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
			getSignOutUsers() { //获取人员列表
				this.$u.api.getSignOutUsers(this.userInfo.account).then(res => {
					if (res.msgCode === '000000') {
						if (!res.data.length) {
							this.content = '暂无可签退人员信息！'
							this.show = true
							return
						}
						this.userList = res.data.map(item => {
							return {
								...item,
								reasonName: '',
								reason: '',
								normalOut: false,
								abnormalOut: false
							}
						})
					} else {
						this.$refs.uTips.show({
							title: `签退人员获取失败，原因：${res.message}`,
							type: 'error',
							duration: '2300'
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			confirm() {
				if (this.userList.length === this.uploadList.length) {
					if (this.content.includes('签退成功')) {
						uni.navigateBack()
					}
				} else {
					this.getSignOutUsers()
				}
			},
			normalSignOut(user) {
				if (!user.normalOut) {
					user.normalOut = true
					user.abnormalOut = false
					user.isSignIn = '1'
					if (this.userList.every(user => user.normalOut)) {
						this.checkAll = true
					}
				} else {
					user.normalOut = false
					user.isSignIn = 0
					this.checkAll = false
				}
			},
			abnormalSignOut(user) {
				this.checkAll = false
				if (!user.abnormalOut) {
					user.abnormalOut = true
					user.normalOut = false
					user.isSignIn = '0'
				} else {
					user.abnormalOut = false
					user.isSignIn = 0
				}
			}
		},
		onNavigationBarButtonTap() {
			this.showPopup = true
		},
		onBackPress() {
			if (this.showPopup) {
				this.showPopup = false
				return true
			} else if (this.showSelect) {
				this.showSelect = false
				return true
			} else if (this.showInputRemark) {
				return true
			}
		}
	}
</script>

<style lang="scss" scoped>
	.check-group {
		position: absolute;
		right: 50rpx;
		top: 0;
	}

	.check-btn {
		width: 140rpx;
		height: 78rpx;
		line-height: 78rpx;
		border-radius: 8rpx;
		z-index: 2;
	}

	.check-btn-gap {
		width: 5rpx;
		height: 78rpx;
		transform: skewX(-25deg);
		background-color: #ffffff;
		margin-left: 22rpx;
		margin-right: -28rpx;
	}

	.check-btn:first-child {
		background: linear-gradient(115deg, #ebebeb 120rpx, transparent 0);
		text-align: left;
		margin-right: -48rpx;
		padding-left: 24rpx;
		color: #909399;
	}

	.check-in-btn:first-child {
		background: linear-gradient(115deg, #19be6b 120rpx, transparent 0);
		color: #ffffff;
	}

	.check-btn:last-child {
		background: linear-gradient(-65deg, #ebebeb 120rpx, transparent 0);
		text-align: right;
		padding-right: 24rpx;
		color: #909399;
	}

	.check-in-btn:last-child {
		background: linear-gradient(-65deg, #ff9900 120rpx, transparent 0);
		color: #ffffff;
	}

	.user-card {
		border-top-left-radius: 16rpx !important;
		border-top-right-radius: 16rpx !important;
	}

	.btn-group {
		background-color: #ffffff;
		position: fixed;
		bottom: 0;
		left: 0;
		z-index: 3;

		.sign-in {
			letter-spacing: 20rpx;
			text-indent: 20rpx;
		}
	}

	.check-btn-group {
		background-color: #ffffff;
		z-index: 3;
		padding: 28rpx 40rpx
	}

	.check-confirm {
		width: 240rpx;
		margin: 0;
		letter-spacing: 20rpx;
		text-indent: 20rpx;
	}

	.line-h {
		line-height: 52rpx;
	}
</style>
