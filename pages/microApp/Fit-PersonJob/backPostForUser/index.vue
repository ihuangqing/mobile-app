<template>
	<view class="sws-wh100 u-flex sws-flex-d-column">
		<view class="sws-w100 u-flex-1 u-p-t-28 u-p-r-28 u-p-l-28">
			<view class="apply-content sws-h100">
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
				</view>
				<view class="sws-w100">
					<u-cell-group title="返岗信息" :border="false">
						<u-cell-item hover-class="none" :arrow="false" title="申请时间" :value="leaveApplyTime">
							<u-icon slot="icon" class="u-m-r-20" name="shijian" custom-prefix="sws-icon" size="36">
							</u-icon>
						</u-cell-item>
						<u-cell-item hover-class="none" :arrow="false" title="离岗时长" :value="leaveTime"
							:value-style=" {'color': leaveMinutes > 15 ? '#fa3534' : '#909399'} ">
							<u-icon slot="icon" class="u-m-r-20" name="gongzuoshichang" custom-prefix="sws-icon"
								size="32"></u-icon>
						</u-cell-item>
						<u-cell-item hover-class="none" :arrow="false" title="申请事由" :value="reason">
							<u-icon slot="icon" class="u-m-r-20" name="shenqingshiyou" custom-prefix="sws-icon"
								size="32">
							</u-icon>
						</u-cell-item>
					</u-cell-group>
				</view>
			</view>
		</view>
		<view class="check-confirm u-p-28">
			<u-button type="primary" class="sws-w100 sws-line-h-repair" @click="backPost">签到</u-button>
		</view>
		<u-modal v-model="show" :content="content" @confirm="modalConfirm"></u-modal>
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
				leaveApplyTime: '',
				leaveTime: '',
				reason: '',
				leaveMinutes: 0,
				content: '',
				show: false
			}
		},
		computed: mapState(['userInfo']),
		onLoad() {
			this.getBackPostInfo()
		},
		methods: {
			getBackPostInfo() {
				let params = {
					applyType: '2',
					account: this.userInfo.account
				}
				this.$u.api.getApplyInfo(params).then(res => {
					if (res.msgCode === '000000' && res.data) {
						const temp = res.data
						if (Object.keys(temp).length > 0) {
							this.applyId = temp.id
							this.leaveApplyTime = temp.leaveApplyTime
							this.reason = temp.reason
							this.leaveMinutes = temp.leaveMinutes ? temp.leaveMinutes : 1 //把0处理为1分钟
							if (temp.leaveMinutes) {
								const hour = Math.floor(this.leaveMinutes / 60)
								const minutes = this.leaveMinutes % 60
								this.leaveTime = hour ? `${ hour }小时${ minutes }分钟` : `${ minutes }分钟`
							} else {
								this.leaveTime = '<1分钟'
							}
						} else { //查不到返岗信息，点击确认后返回
							this.content = '查不到您的返岗信息！'
							this.show = true
						}
					} else {
						this.$refs.uTips.show({
							title: `返岗信息获取失败，原因：${ res.message }`,
							type: 'error',
							duration: '2300'
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			backPost() {
				const params = {
					applyIds: this.applyId
				}
				this.$u.api.backPost(params).then(res => {
					if (res.msgCode === '000000') {
						this.content = '返岗签到成功!'
						this.show = true
					} else {
						this.$refs.uTips.show({
							title: `返岗签到失败，原因：${res.message}`,
							type: 'error',
							duration: '2300'
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			modalConfirm() {
				uni.navigateBack()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.apply-content {
		border-radius: 20rpx;
		border: 2rpx solid #ebebeb;
		box-shadow: 0 0 2rpx rgba(0, 0, 0, .2);
		overflow: hidden;
	}

	.user-info {
		width: 100%;
		height: 260rpx;
		padding: 40rpx;
		background: linear-gradient(to right, #2979ff, #12d8fa);
	}

	.check-confirm {
		width: 100%;
		letter-spacing: 20rpx;
		text-indent: 20rpx;
	}
</style>
