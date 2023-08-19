<!-- 审批进度 -->
<template>
	<view class="sws-wh100">
		<view class="u-flex sws-w100 date-bar" v-show="showDate">
			<view class="u-flex-1 u-flex u-row-center" @click="preQuery">
				<u-icon name="arrow-leftward" size="28" color="#2979ff" label="前一天" label-pos="bottom"
					label-color="#2979ff"></u-icon>
			</view>
			<view class="u-flex-1 u-flex u-row-center sws-flex-d-column u-border-left u-border-right"
				@click="showCalendar = true">
				<view class="u-type-primary u-font-24">选择日期</view>
				<view class="u-type-primary u-font-32">{{ sendTime }}</view>
			</view>
			<view class="u-flex-1 u-flex u-row-center" @click="nextQuery">
				<u-icon name="arrow-rightward" size="28" :color="isToday ? '#c0c4cc': '#2979ff'" label="后一天"
					label-pos="bottom" :label-color="isToday ? '#c0c4cc': '#2979ff'"></u-icon>
			</view>
		</view>
		<view v-show="!showNoData" class="scroll-wrap sws-bg-ebebeb" :class="showDate ? 'wrap-hasDate': ''">
			<view class="u-p-l-20 u-p-r-20">
				<u-card margin="0 0 20rpx 0" :border="false" :head-style="formatStatus(item).style"
					:body-style="{padding: 0}" :foot-style="{padding: '16rpx 30rpx'}" :show-foot="true" :full="true"
					v-for="(item, index) in list" :key="index">
					<view slot="head">
						<view class="sws-font-fff u-font-32 u-flex u-row-between">
							<view>{{ item.moduleType | moduleTypeFilter}}({{ item.docNo}})</view>
							<view class="u-font-24 sws-font-fff">
								<u-icon :name="formatStatus(item).icon" size="28" margin-left="10"
									:label="formatStatus(item).value" label-pos="left" label-color="#fff">
								</u-icon>
							</view>
						</view>
					</view>
					<u-cell-group slot="body" :border="false">
						<u-cell-item class="u-p-t-10 u-p-b-10" hover-class="none" :arrow="false" title="工时类型"
							:value="item.worktimeType | workTimeTypeFilter">
						</u-cell-item>
						<u-cell-item class="u-p-t-10 u-p-b-10" hover-class="none" :arrow="false" title="审批人"
							:value="item.approverName">
						</u-cell-item>
						<u-cell-item v-if="item.status == 3" class="u-p-t-10 u-p-b-10" hover-class="none" :arrow="false"
							:border-bottom="false" title="驳回理由" :value="item.auditDescription"
							:value-style="{'padding-left': '20rpx'}">
						</u-cell-item>
						<u-cell-item v-else class="u-p-t-10 u-p-b-10" hover-class="none" :arrow="false"
							:border-bottom="false" title="工作描述" :value="item.description"
							:value-style="{'padding-left': '20rpx'}">
						</u-cell-item>
					</u-cell-group>
					<view slot="foot" class="u-text-right">
						<u-button class="btn-style-new u-m-l-30" size="medium" type="success" @click="goToDetail(item)">
							详情
						</u-button>
						<u-button v-if="item.status == 1" class="btn-style-new u-m-l-30" size="medium" type="info"
							@click="toUrge(item.docNo)">
							催办
						</u-button>
						<u-button v-if="item.status == 3" class="btn-style u-m-l-30" size="medium" type="warning"
							@click="toApply(item)">
							重新申请
						</u-button>
					</view>
				</u-card>
				<u-loadmore :status="loadMore" bgColor="#ebebeb"></u-loadmore>
			</view>
		</view>
		<no-data class="sws-wh100" v-show="showNoData"></no-data>
		<u-calendar v-model="showCalendar" mode="date" @change="calendarConfirm"></u-calendar>
		<u-modal v-model="showModal" :content="modalContent"></u-modal>
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
				sendTime: '',
				list: [],
				isToday: true, //默认显示当前，用于处理后一天的显示效果
				showNoData: false,
				showCalendar: false,
				loadMore: 'loadmore',
				showDate: true, //是否显示顶部日期
				modalContent: '',
				showModal: false,
			}
		},
		computed: {
			formatStatus(item) {
				return item => {
					if (+item.status === 2) {
						return {
							style: {
								background: '#2979ff',
								padding: '20rpx 30rpx'
							},
							value: '通过',
							icon: 'checkmark-circle'
						}
					} else if (+item.status === 3) {
						return {
							style: {
								background: '#ff9900',
								padding: '20rpx 30rpx'
							},
							value: '驳回',
							icon: 'error-circle'
						}
					} else {
						return {
							style: {
								background: '#909399',
								padding: '20rpx 30rpx'
							},
							value: '未审批',
							icon: 'info-circle'
						}
					}
				}
			}
		},
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
			this.sendTime = this.$u.timeFormat()
			this.getHourCollectionList()
		},
		methods: {
			toApply(data) {
				const _self = this
				uni.navigateTo({
					url: '/pages/microApp/HoursCollection/applyHour/index',
					success: function(res) {
						res.eventChannel.emit('acceptDataFromOpenerPage', {
							...data,
							fromRecord: true
						})
					},
					events: {
						acceptDataFromOpenedPage: (res) => {
							_self.list.forEach(item => {
								if (item.docNo == res.docNo) {
									item.status = 1
								}
							})
						}
					}
				})
			},
			toUrge(docNo) {
				const params = {
					docNo
				}

				this.$u.api.postUrgeApprove(params).then(res => {
					if (res.msgCode === '000000') {
						this.modalContent = '催办成功'
						this.showModal = true
					} else {
						this.$refs.uTips.show({
							title: `催办失败，原因：${ res.message }`,
							type: 'error',
							duration: 2300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			getHourCollectionList() {
				let params = {
					query: {
						page: this.page,
						limit: this.limit
					},
					body: {
						applyDate: this.sendTime,
						isAudit: 1,
						status: 3
					}
				}

				this.$u.api.getHourCollectionList(params).then(res => {
					if (res.msgCode === '000000') {
						const temp = res.data.data
						this.list = [...this.list, ...temp]
						this.page++

						if (!res.data.data.length || res.data.data.length < this.limit) this.loadMore = "nomore"

						if (!this.list.length) {
							this.showNoData = true
						} else {
							this.showNoData = false
						}
					} else {
						this.$refs.uTips.show({
							title: `审批进度列表获取失败，原因：${ res.message }`,
							type: 'error',
							duration: 2300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
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
			getData() {
				this.showNoData = false
				this.page = 1
				this.list = []
				this.getHourCollectionList()
			},
			preQuery() {
				this.sendTime = this.$u.timeFormat(this.common.dateCalculator(this, 1, this.sendTime))
				this.checkIsToday()
				this.getData()
			},
			nextQuery() {
				if (this.isToday) return
				this.sendTime = this.$u.timeFormat(this.common.dateCalculator(this, '-1', this.sendTime))
				this.checkIsToday()
				this.getData()
			},
			calendarConfirm(res) {
				this.sendTime = res.result
				this.checkIsToday()
				this.getData()
			},
			checkIsToday() {
				if (this.sendTime == this.$u.timeFormat()) {
					this.isToday = true
				} else {
					this.isToday = false
				}
			}
		},
		onBackPress() {
			if (this.showCalendar) {
				this.showCalendar = false
				return true
			}
		},
		onPullDownRefresh() {
			setTimeout(() => {
				uni.stopPullDownRefresh()
				this.page = 1
				this.list = []
				this.loadMore = 'loadmore'
				this.getHourCollectionList()
			}, 1000)
		},
		onReachBottom() {
			if (this.loadMore != 'nomore') { //如果状态无无数据，则不再请求
				this.loadMore = "loading"
				this.getHourCollectionList()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.left-line {
		height: 24rpx;
		border-left: 6rpx solid;
		border-image: -webkit-linear-gradient(#28e787, #4aff29)1 10 1;
		border-image: linear-gradient(#28e787, #4aff29)1 10 1;
		margin-right: 8rpx;
	}

	.date-bar {
		position: fixed;
		background-color: #ffffff;
		height: 100rpx;
		z-index: 3;
	}

	.scroll-wrap {
		min-height: 100%;
		padding: 20rpx 0;
	}

	.wrap-hasDate {
		padding-top: 120rpx;
	}

	.btn-style {
		width: 180rpx;
		height: 60rpx;
		line-height: normal;
		padding: 0 16rpx;
	}

	.btn-style-new {
		width: 120rpx;
		height: 60rpx;
		line-height: normal;
		text-indent: 20rpx;
		letter-spacing: 20rpx;
	}
</style>
