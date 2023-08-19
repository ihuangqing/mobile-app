<template>
	<view class="sws-wh100">
		<view v-show="!showNoData" class="scroll-wrap sws-bg-ebebeb">
			<view class="u-p-20">
				<u-card margin="0 0 20rpx 0" :border="false"
					:head-style="{background: '#2979ff',padding: '20rpx 30rpx'}" :body-style="{padding: 0}"
					:foot-style="{padding: '16rpx 30rpx'}" :show-foot="true" :full="true" v-for="(item, index) in list"
					:key="index">
					<view slot="head">
						<view class="card-head u-font-32 u-flex u-row-between">
							<view>{{ item.moduleType | moduleTypeFilter}}</view>
							<view class="u-font-28">{{ item.docNo}}</view>
						</view>
					</view>
					<u-cell-group slot="body" :border="false">
						<u-cell-item class="u-p-t-10 u-p-b-10" hover-class="none" :arrow="false" title="工时类型"
							:value="item.worktimeType | workTimeTypeFilter">
						</u-cell-item>
						<u-cell-item class="u-p-t-10 u-p-b-10" hover-class="none" :arrow="false" title="申请人"
							:value="item.creatorName">
						</u-cell-item>
						<u-cell-item class="u-p-t-10 u-p-b-10" hover-class="none" :arrow="false" :border-bottom="false"
							title="工作描述" :value="item.description" :value-style="{'padding-left': '20rpx'}">
						</u-cell-item>
					</u-cell-group>
					<view slot="foot" class="u-text-right">
						<u-button class="btn-style-new u-m-l-30" size="medium" type="success" @click="goToDetail(item)">
							详情
						</u-button>
						<u-button class="btn-style-new u-m-l-30" size="medium" type="primary"
							@click="toApprove(item.docNo, index)">
							通过
						</u-button>
						<u-button class="btn-style-new u-m-l-30" size="medium" type="error"
							@click="toReject(item.docNo, index)">
							驳回
						</u-button>
					</view>
				</u-card>
				<u-loadmore :status="loadStatus" bgColor="#ebebeb"></u-loadmore>
			</view>
		</view>
		<u-modal v-model="showReject" title="请输入驳回理由" :show-cancel-button="true" @confirm="rejectConfirm">
			<view slot="default" class="u-p-20">
				<u-input type="textarea" height="120" :auto-height="true" placeholder="请输入驳回理由"
					v-model="auditDescription">
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
	import {
		mapState
	} from 'vuex'

	import noData from '../../../components/noData/index.vue'

	export default {
		components: {
			noData
		},
		data() {
			return {
				page: 1,
				limit: 10,
				list: [],
				status: '', //数据状态（0-正常（无需审核），1-待审核，2-审核通过，3-审核不通过）
				auditDescription: '', //驳回理由
				loadStatus: 'loadmore',
				showNoData: false,
				showReject: false,
				modalContent: '',
				showModal: false,
				showCancel: false,
			}
		},
		computed: mapState(['factoryId']),
		filters: {
			moduleTypeFilter: type => {
				switch (+type) {
					case 1:
						return '生产异常工时'
						break
					case 2:
						return '外部异常工时'
						break
					case 3:
						return '被动培训工时'
						break
					case 4:
						return '辅助人员工时'
						break
					case 5:
						return '转嫁工时'
						break
				}
			},
			workTimeTypeFilter: type => {
				switch (+type) {
					case 1:
						return '首件'
						break
					case 2:
						return '5S'
						break
					case 3:
						return '设备异常停机维修'
						break
					case 4:
						return 'PM保养'
						break
					case 5:
						return '试验单影响'
						break
					case 6:
						return '品质异常冻结(内部)'
						break
					case 7:
						return '品质异常冻结(供应商)'
						break
					case 8:
						return '设备故障停机（内部）'
						break
					case 9:
						return '设备故障停机（供应商）'
						break
					case 10:
						return '无生产计划'
						break
					case 11:
						return '切线'
						break
					case 12:
						return '待料(内部)'
						break
					case 13:
						return '待料(外部)'
						break
					case 14:
						return '辅助人员工时'
						break
					case 15:
						return '转嫁工时'
						break
				}
			},
		},
		onLoad() {
			this.getApproveHourList()
		},
		methods: {
			toSubmit() {
				if (this.status === 3 && !this.auditDescription) {
					this.$refs.uTips.show({
						title: '请输入驳回理由',
						type: 'warning',
						duration: 2300
					})
					return
				}
				const params = {
					docNo: this.currDocNo,
					status: this.status,
					auditDescription: this.auditDescription
				}
				this.$u.api.postHourCollectionApprove(params).then(res => {
					if (res.msgCode === '000000') {
						this.modalContent = this.status === 2 ? '审批通过' : '驳回成功'
						this.showCancel = false
						this.showModal = true
						
						console.log('this.currIndex: ', this.currIndex)
						
						this.list.splice(this.currIndex, 1)
						if (this.list.length) {
							this.showNoData = false
						} else {
							this.showNoData = true
						}	

						if (this.status === 3) {
							this.auditDescription = '' //驳回成功，置空驳回理由
						}
					} else {
						this.$refs.uTips.show({
							title: `工时采集审批失败，原因：${ res.message }`,
							type: 'error',
							duration: 2300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			modalConfirm() {
				if (this.modalContent.includes('确认审批通过')) {
					this.status = 2
					this.toSubmit()
				}
			},
			toApprove(docNo, index) {
				this.currDocNo = docNo
				this.currIndex = index
				this.modalContent = '确认审批通过？'
				this.showCancel = true
				this.showModal = true
			},
			rejectConfirm() {
				this.status = 3
				this.toSubmit()
			},
			toReject(docNo, index) {
				this.currDocNo = docNo
				this.currIndex = index
				this.showReject = true
			},
			goToDetail(data) {
				uni.navigateTo({
					url: '/pages/microApp/HoursCollection/approveHour/hourDetail/index',
					success: function(res) {
						res.eventChannel.emit('acceptDataFromOpenerPage', {
							...data
						})
					}
				})
			},
			getApproveHourList() {
				const params = {
					query: {
						page: this.page,
						limit: this.limit
					},
					body: {
						isAudit: 1,
						statusList: [1],
					}
				}

				this.$u.api.getHourCollectionList(params).then(res => {
					if (res.msgCode === '000000') {
						this.dataList = [...this.list, ...res.data.data]
						this.list = this.dataList
						this.page++

						if (!res.data.data.length || res.data.data.length < this.limit) this.loadStatus = "nomore"
						if (this.list.length) {
							this.showNoData = false
						} else {
							this.showNoData = true
						}
					} else {
						this.$refs.uTips.show({
							title: `工时采集申请列表获取失败，原因：${ res.message }`,
							type: 'error',
							duration: 2300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			}
		},
		onPullDownRefresh() {
			this.loadStatus = "loading"
			this.page = 1
			this.limit = 10
			this.list = []
			this.getApproveHourList()
			uni.stopPullDownRefresh()
		},
		onReachBottom() {
			if (this.loadStatus != 'nomore') { //如果状态无无数据，则不再请求
				this.loadStatus = "loading"
				this.getApproveHourList()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.scroll-wrap {
		min-height: 100%;
	}

	.card-head {
		color: #ffffff;
	}

	.btn-style-new {
		width: 120rpx;
		height: 60rpx;
		line-height: normal;
		text-indent: 20rpx;
		letter-spacing: 20rpx;
	}
</style>
