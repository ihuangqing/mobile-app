<!-- 人岗匹配 → 返岗确认（签到） -->
<template>
	<view class="page-wrap">
		<u-cell-group class="u-flex-1" :border="false">
			<u-cell-item hover-class="none" :arrow="false" title="返岗人" :value="userName">
				<u-icon slot="icon" class="u-m-r-20" name="fangang" custom-prefix="sws-icon" size="34"></u-icon>
			</u-cell-item>
			<u-cell-item hover-class="none" :arrow="false" title="申请时间" :value="leaveApplyTime">
				<u-icon slot="icon" class="u-m-r-18" name="shijian" custom-prefix="sws-icon" size="36"></u-icon>
			</u-cell-item>
			<u-cell-item hover-class="none" :arrow="false" title="离岗时长" :value="leaveTime"
				:value-style=" {'color': leaveMinutes > 15 ? '#fa3534' : '#909399'} ">
				<u-icon slot="icon" class="u-m-r-20" name="gongzuoshichang" custom-prefix="sws-icon" size="32"></u-icon>
			</u-cell-item>
			<u-cell-item hover-class="none" :arrow="false" title="申请事由" :value="reason">
				<u-icon slot="icon" class="u-m-r-20" name="shenqingshiyou" custom-prefix="sws-icon" size="32"></u-icon>
			</u-cell-item>
		</u-cell-group>
		<view class="check-confirm u-p-28">
			<u-button type="primary" @click="backPost">签到</u-button>
		</view>
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
				userName: '',
				leaveApplyTime: '',
				reason: '',
				leaveTime: '',
				leaveMinutes: '',
				applyId: '',
				show: false,
				content: ''
			}
		},
		computed: mapState(['userInfo']),
		onReady() {
			const {
				user: userName,
				account
			} = this.userInfo
			this.userName = `${ userName }(${ account })`
			this.getBackPostInfo() //获取返岗信息 
		},
		methods: {
			confirm() {
				uni.navigateBack()
			},
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
							const hour = Math.floor(this.leaveMinutes / 60)
							const minutes = this.leaveMinutes % 60
							this.leaveTime = hour ? `${ hour }小时${ minutes }分钟` : `${ minutes }分钟`
						} else { //查不到返岗信息，点击确认后返回
							this.content = '查不到您的返岗信息！'
							this.show = true
						}
					} else {
						this.$refs.uTips.show({
							title: `返岗信息获取失败，原因：${res.message}`,
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
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page-wrap {
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 100%;

		.check-confirm {
			width: 100%;
			letter-spacing: 20rpx;
			text-indent: 20rpx;
		}
	}
</style>
