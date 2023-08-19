<!-- E-Checklist → 点检确认 -->
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
	import spotCheckResult from '../../spotCheckResult/index.vue'
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
		onLoad() {
			let _self = this
			// 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
			this.getOpenerEventChannel().on('acceptDataFromOpenerPage', function(res) {
				_self.id = res.data.id
				_self.list = res.data.deviceItemList.map(item => {
					if (item.state == '1') {
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
			})
		},
		methods: {
			commit() {
				let params = {
					id: this.id,
					isAgree: 1
				}
				this.$u.api.putRejectCommit(params).then(res => {
					if (res.msgCode === '000000') {
						this.content = '点检确认成功'
						this.show = true
					} else {
						this.$refs.uTips.show({
							title: `点检确认失败，原因${res.message}`,
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
					isAgree: 2,
					remark: this.rejectReason
				}
				this.$u.api.putRejectCommit(params).then(res => {
					if (res.msgCode === '000000') {
						this.content = '点检驳回成功'
						this.show = true
					} else {
						this.$refs.uTips.show({
							title: `驳回失败，原因${res.message}`,
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
		},
		onBackPress() {
			if (this.showModal) {
				this.showModal = false
				return true
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
