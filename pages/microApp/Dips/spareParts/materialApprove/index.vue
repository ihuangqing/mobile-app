<!-- DIPS → 备品备件 → 物料审批 -->
<template>
	<view class="sws-wh100">
		<view v-show="!showNoData" class="scroll-wrap sws-w100 u-p-20 sws-bg-ebebeb">
			<u-card margin="0 0 20rpx 0" :head-style="{background: '#2979ff',padding: '20rpx 30rpx'}"
				:body-style="{padding: 0}" :foot-style="{padding: '16rpx 30rpx'}" :border="false" :show-foot="true"
				:full="true" v-for="(material, index) in list" :key="index">
				<view slot="head">
					<view class="card-head u-font-32 u-flex">
						<view>{{ material.itemName }}</view>
						<view class="u-font-24">({{ material.itemCode }})</view>
					</view>
				</view>
				<u-cell-group slot="body" :border="false">
					<u-cell-item class="u-p-t-10 u-p-b-10" hover-class="none" :arrow="false" title="申请人"
						:value="material.applicantName">
					</u-cell-item>
					<u-cell-item class="u-p-t-10 u-p-b-10" hover-class="none" :arrow="false" title="申请数量"
						:value="material.applyNum + (material.unit ? material.unit : '')">
					</u-cell-item>
					<u-cell-item class="u-p-t-10 u-p-b-10" hover-class="none" :arrow="false" :border-bottom="false"
						title="申请时间" :value="material.applicantDate">
					</u-cell-item>
				</u-cell-group>
				<view slot="foot" class="u-text-right">
					<u-button class="btn-style" size="medium" type="error" @click="approveReject(material.id, index)">驳回
					</u-button>
					<u-button class="btn-style u-m-l-30" size="medium" type="success"
						@click="toApproveConfirm(material.id, index)">通过
					</u-button>
				</view>
			</u-card>
			<u-loadmore :status="loadStatus" bgColor="#ebebeb"></u-loadmore>
		</view>
		<u-modal v-model="showReject" title="请输入驳回理由" :show-cancel-button="true" @confirm="rejectConfirm">
			<view slot="default" class="u-p-20">
				<u-input type="textarea" height="120" :auto-height="true" placeholder="请输入驳回理由" v-model="rejectReason">
				</u-input>
			</view>
		</u-modal>
		<u-modal v-model="showModal" :content="modalContent" :show-cancel-button="showCancel" @confirm="modalConfirm">
		</u-modal>
		<no-data v-show="showNoData"></no-data>
		<u-top-tips ref="uTips"></u-top-tips>
	</view>
</template>

<script>
	import noData from '../../../../components/noData/index'

	export default {
		components: {
			noData
		},
		data() {
			return {
				page: 1,
				limit: 10,
				list: [],
				curId: '',
				rejectReason: '',
				showReject: false,
				showNoData: false,
				loadStatus: 'loadmore',
				modalContent: '',
				showCancel: false,
				showModal: false
			}
		},
		onLoad() {
			this.getMaterialApproveInfo()
		},
		methods: {
			modalConfirm() {
				if(this.modalContent.includes('是否确认审批通过')) {
					this.approveConfirm()
				}
			},
			toApproveConfirm(materialId, index) {
				this.curIndex = index //记录序号，用于成功之后删除该条记录
				this.curMaterialId = materialId
				this.modalContent = '是否确认审批通过？'
				this.showCancel = true
				this.showModal = true
			},
			approveConfirm() {
				this.$u.api.putApprove(this.curMaterialId).then(res => {
					if (res.msgCode === '000000') {
						this.modalContent = '审批通过'
						this.showCancel = false
						this.showModal = true
						this.list.splice(this.curIndex, 1) //删除这条记录
						if (!this.list.length) this.showNoData = true
					} else {
						this.$refs.uTips.show({
							title: `审批失败，原因：${ res.message }`,
							type: 'error',
							duration: 2300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			approveReject(materialId, index) {
				this.rejectReason = ''
				this.curId = materialId
				this.curIndex = index
				this.showReject = true
			},
			rejectConfirm() {
				if (this.rejectReason.trim()) {
					const params = {
						id: this.curId,
						additional: this.rejectReason
					}
					this.$u.api.putApproveReject(params).then(res => {
						if (res.msgCode === '000000') {
							this.modalContent = '驳回成功'
							this.showModal = true
							this.list.splice(this.curIndex, 1) //删除这条记录
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
				} else {
					this.$refs.uTips.show({
						title: '请输入驳回理由',
						type: 'warning',
						duration: 2300
					})
				}
			},
			getMaterialApproveInfo() {
				const data = {
					page: this.page,
					limit: this.limit
				}
				const params = {
					query: this.$u.queryParams(data),
					body: {
						state: '待审核'
					}
				}
				this.$u.api.getMaterialApproveInfo(params).then(res => {
					if (res.msgCode === '000000') {
						this.list = [...this.list, ...res.data.data]
						this.page++

						if (!res.data.data.length || res.data.data.length < this.limit) this.loadStatus = "nomore"
						if (!this.list.length) {
							this.showNoData = true
						} else {
							this.showNoData = false
						}
					} else {
						this.$refs.uTips.show({
							title: `物料审核列表获取失败，原因：${ res.message }`,
							type: 'error',
							duration: 2300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			}
		},
		onBackPress() {
			if (this.showReject) {
				this.showReject = false
				return true
			}
		},
		onPullDownRefresh() {
			this.loadStatus = 'loadmore'
			this.page = 1
			this.list = []
			this.getMaterialApproveInfo()
			uni.stopPullDownRefresh()
		},
		onReachBottom() {
			if (this.loadStatus != 'nomore') { //如果状态无无数据，则不再请求
				this.loadStatus = "loading"
				this.getMaterialApproveInfo()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page-wrap {
		background-color: #ebebeb;
	}

	.scroll-wrap {
		min-height: 100%;
	}

	.card-head {
		color: #ffffff;
	}

	.btn-style {
		height: 60rpx;
		line-height: normal;
		padding: 0 16rpx;
		text-indent: 20rpx;
		letter-spacing: 20rpx;
	}
</style>
