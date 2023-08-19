<!-- dips → 工治具保养确认 → 确认明细 -->
<template>
	<view class="u-rela sws-wh100 u-flex sws-flex-d-column">
		<view class="u-rela check-list sws-w100 u-flex-1">
			<spot-check-result :list="list"></spot-check-result>
		</view>
		<view class="btn-group sws-w100 u-flex u-row-between u-p-t-28 u-p-b-28">
			<u-button size="medium" type="error" @click="showModal = true">驳回</u-button>
			<u-button size="medium" type="primary" @click="commit">确认</u-button>
		</view>
		<u-modal v-model="showModal" title="请输入驳回理由" :show-cancel-button="true" @confirm="confirmReject">
			<view slot="default" class="u-p-20">
				<u-input type="textarea" height="120" :auto-height="true" placeholder="请输入驳回理由" v-model="rejectReason">
				</u-input>
			</view>
		</u-modal>
		<u-modal v-model="show" title="提示" :content="content" @confirm="confirm"></u-modal>
		<u-top-tips ref="uTips"></u-top-tips>
	</view>
</template>

<script>
	import spotCheckResult from '../../../../E-Checklist/spotCheckResult/index.vue'
	export default {
		components: {
			spotCheckResult
		},
		data() {
			return {
				rejectReason: '', //驳回理由
				list: [],
				showModal: false,
				show: false,
				content: ''
			}
		},
		onLoad(options) {
			this.getApproveConfirmDetails(options.id)
		},
		methods: {
			getApproveConfirmDetails(id) {
				this.$u.api.getApproveConfirmDetails(id).then(res => {
					if (res.msgCode === '000000') {
						this.id = res.data.id
						this.list = res.data.itemList.map(item => {
							if (item.state === '1') {
								return {
									checked: true,
									...item
								}
							} else {
								return {
									checked: false,
									...item
								}
							}
						})
					} else {
						this.$refs.uTips.show({
							title: `保养确认明细获取失败，原因：${ res.message }`,
							type: 'error',
							duration: 2300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			commit() {
				let params = {
					id: this.id,
					itemList: this.list.map(item => {
						if (item.state === '0') {
							return {
								id: item.id,
								state: item.state,
								exception: item.exception
							}
						} else {
							return {
								id: item.id,
								state: item.state,
							}
						}
					})
				}
				this.$u.api.putFixtureApproveConfirm(params).then(res => {
					if (res.msgCode === '000000') {
						this.content = '保养确认成功'
						this.show = true
					} else {
						this.$refs.uTips.show({
							title: `工治具保养确认失败，原因：${ res.message }`,
							type: 'error',
							duration: 2300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			confirmReject() {
				if (!this.$u.trim(this.rejectReason)) {
					this.$refs.uTips.show({
						title: '请输入驳回理由',
						type: 'warning',
						duration: 2300
					})
					return
				}
				let params = {
					id: this.id,
					itemList: this.list.map(item => {
						if (item.state === '0') {
							return {
								id: item.id,
								state: item.state,
								exception: item.exception
							}
						} else {
							return {
								id: item.id,
								state: item.state,
							}
						}
					})
				}

				this.$u.api.putFixtureApproveReject(params).then(res => {
					if (res.msgCode === '000000') {
						this.content = '保养确认驳回'
						this.show = true
					} else {
						this.$refs.uTips.show({
							title: `驳回失败，原因：${ res.message }`,
							type: 'error',
							duration: 2300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			confirm() {
				const id = this.id
				const eventChannel = this.getOpenerEventChannel()
				eventChannel.emit('acceptDataFromOpenedPage', {
					data: id
				})
				uni.navigateBack()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.check-list {
		overflow-y: scroll;
	}

	.ng-reason {
		background-color: #ecf5ff;
	}

	.btn-group {
		background-color: #ffffff;
		letter-spacing: 20rpx;
		text-indent: 20rpx;
	}
</style>
