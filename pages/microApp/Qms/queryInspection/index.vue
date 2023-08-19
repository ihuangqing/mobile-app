<!-- 单据查询 -->
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
			<view class="sws-bg-ffffff u-m-b-20" v-for="(item, index) in list" :key="index" @click="toDetail(item)">
				<view class="u-flex u-border-bottom u-row-between u-p-l-20 u-p-t-16 u-p-r-20 u-p-b-16">
					<view class="u-flex">
						<view class="left-line"></view>
						<text>{{ item.orderNumber }}</text>
					</view>
					<view v-show="item.orderStatus == '2'" class="u-font-24">
						<u-icon name="minus-circle" size="28" margin-left="10" label="过期未检验" label-pos="left"
							label-color="u-type-info"></u-icon>
					</view>
					<view v-show="item.orderStatus == '1' || item.orderStatus == '3'" class="u-font-24"
						:class="formatCheck(item).style">
						<u-icon :name="formatCheck(item).icon" size="28" margin-left="10"
							:label="formatCheck(item).value" label-pos="left" :label-color="formatCheck(item).style">
						</u-icon>
					</view>
				</view>
				<view class="u-p-20">
					<view class="u-flex u-p-l-20 u-p-b-10 u-type-info u-font-24">
						<view class="u-flex-1 u-p-b-10">
							<view class="u-flex">
								<view class="item-left">产品型号：</view>
								<view class="u-flex-1 u-text-right">{{ item.itemName }}</view>
							</view>
							<view class="u-flex u-m-t-10">
								<view class="item-left">工艺名称：</view>
								<view class="u-flex-1 u-text-right">{{ item.technicsName }}</view>
							</view>
							<view class="u-flex u-m-t-10">
								<view class="item-left">工序名称：</view>
								<view class="u-flex-1 u-text-right">{{ item.groupName }}</view>
							</view>
							<view class="u-flex u-m-t-10">
								<view class="item-left">设备编码：</view>
								<view class="u-flex-1 u-text-right">{{ item.deviceSn }}</view>
							</view>
						</view>
						<view class="u-flex u-row-center u-p-l-20 u-p-r-20 sws-flex-d-column">
							<text class="u-type-primary">详情</text>
							<u-icon name="arrow-rightward" color="#2979ff"></u-icon>
						</view>
					</view>
					<view class="info-more u-flex u-type-info u-font-24 u-row-between">
						<text>检验类型：{{ checkTypes(item.checkTypes) }}</text>
						<text v-show="item.sendTime">检验时间：{{ item.sendTime ? item.sendTime : '' }}</text>
					</view>
				</view>
			</view>
			<u-loadmore :status="loadMore" />
		</view>
		<no-data class="sws-wh100" v-show="showNoData"></no-data>
		<u-calendar v-model="showCalendar" mode="date" @change="calendarConfirm"></u-calendar>
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
				showDate: true //是否显示顶部日期
			}
		},
		computed: {
			...mapState(['factoryId', 'userInfo']),
			checkTypes(type) {
				return type => { // A:首检检验,B：巡检检验，C:过程检验，D:执行力检验，E:异物检验
					switch (type) {
						case 'A':
							return '首检检验'
							break;
						case 'B':
							return '巡检检验'
							break;
						case 'C':
							return '过程检验'
							break;
						case 'D':
							return '执行力检验'
							break;
						case 'E':
							return '异物检验'
							break;
						case 'F':
							return '参数检验'
							break;
						case 'G':
							return '稽查检验'
							break;
					}
				}
			},
			formatCheck(item) {
				return item => {
					if (item.isFree && item.isFree == 'Y') {
						return {
							style: 'u-type-success',
							value: item.orderStatus == '3' ? '免检(补检)' : '免检',
							icon: 'checkmark-circle'
						}
					}
					if (item.checkResult) {
						switch (item.checkResult) {
							case 'OK':
								return {
									style: 'u-type-success',
										value: item.orderStatus == '3' ? '合格(补检)' : '合格',
										icon: 'checkmark-circle'
								}
								break
							case 'NG':
								return {
									style: 'u-type-error',
										value: item.orderStatus == '3' ? '不合格(补检)' : '不合格',
										icon: 'error-circle'
								}
								break
						}
					} else {
						return () => {
							return {
								style: '',
								value: '',
								icon: ''
							}
						}
					}
				}
			}
		},
		onLoad() {
			this.sendTime = this.$u.timeFormat()
			this.getInspectionList()
		},
		methods: {
			getInspectionList() {
				let params = {
					query: {
						page: this.page,
						limit: this.limit
					},
					body: {
						sendTime: this.sendTime,
						checkPerson: this.userInfo.account,
						isNeedLine: 'N'
					}
				}
				if (this.bodyParams) {
					params.body = {
						...this.bodyParams,
						isNeedLine: 'N'
					}
				}

				this.$u.api.getOrderList(params).then(res => {
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
							title: `检验单获取失败，原因：${ res.message }`,
							type: 'error',
							duration: 2300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			toDetail(detail) {
				if (detail.orderStatus == 1 || detail.orderStatus == 3) { //已检状态可以查看详情
					const params = {
						query: {
							page: 1,
							limit: 10,
						},
						body: {
							orderNumber: detail.orderNumber,
							isNeedLine: 'Y'
						}
					}
					this.$u.api.getOrderList(params).then(res => {
						if (res.msgCode === '000000' && res.data) {
							const _self = this
							const data = res.data.data[0]
							uni.navigateTo({
								url: '/pages/microApp/Qms/queryInspection/inspectionDetail/index',
								success: res => {
									res.eventChannel.emit('acceptDetailFromListPage', {
										...data
									})
								}
							})
						} else {
							this.$refs.uTips.show({
								title: `单据${ orderNumber }详情获取失败，原因：${ res.message }`,
								type: 'error',
								duration: 2300
							})
						}
					}).catch(err => {
						this.common.sysErrToast(this, err)
					})
				}
			},
			getData() {
				this.showNoData = false
				this.page = 1
				this.list = []
				this.getInspectionList()
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
		onNavigationBarButtonTap() {
			const _self = this
			uni.navigateTo({
				url: '/pages/microApp/Qms/queryInspection/queryPage/index',
				events: {
					acceptDataFromQueryPage: params => {
						_self.showDate = false
						_self.page = 1
						_self.list = []
						_self.bodyParams = params
						_self.getInspectionList()
					}
				}
			})
		},
		onPullDownRefresh() {
			setTimeout(() => {
				uni.stopPullDownRefresh()
				this.page = 1
				this.list = []
				this.loadMore = 'loadmore'
				this.getInspectionList()
			}, 1000)
		},
		onReachBottom() {
			if (this.loadMore != 'nomore') { //如果状态无无数据，则不再请求
				this.loadMore = "loading"
				this.getInspectionList()
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

	.info-more {
		padding: 8rpx 20rpx;
		background-color: #ecf5ff;
	}

	.item-left {
		width: 120rpx;
		text-align: right;
	}
</style>
