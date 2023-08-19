<template>
	<view class="sws-wh100 u-flex sws-flex-d-column sws-overflow-hidden">
		<view class="sws-w100 u-flex u-p-20">
			<view class="u-flex-1 u-m-r-20">
				<u-search search-icon="calendar" search-icon-color="#2979ff" shape="square" :show-action="false"
					:disabled="true" placeholder="" :value="calendar" @change="getStaffChangeList" @click="showCalendar = true"></u-search>
			</view>
			<view class="u-flex filter-group" @click="toFilter">
				<view class="filter-group-label">状态：</view>
				<view class="filter-group-text">
					<text class="u-p-l-16 u-p-r-10">{{ filterName }}</text>
					<u-icon name="arrow-down"></u-icon>
				</view>
			</view>
		</view>
		<view class="sws-w100 sws-bg-ebebeb u-flex-1 u-p-20 sws-overflow-scroll-y">
			<view class="staff-card sws-bg-ffffff" v-for="(item, index) in dataList" :key="index">
				<view class="staff-card-header u-flex">
					<view>
						<text class="u-font-28">{{ item.userName }}</text>
						<text class="u-font-24">（{{ item.account }}）</text>
					</view>
					<view class="u-flex-1 u-line-1 u-m-l-30 u-flex u-row-right">
						<u-icon name="calendar" :label="item.workDate"></u-icon>
					</view>
				</view>
				<view class="staff-card-content u-flex u-col-bottom">
					<view class="u-flex sws-w100">
						<view class="state-item">
							<view class="u-flex line-h-1">
								<view v-if="item.state == 3">
									<u-icon name="shijian" class="state-bar" custom-prefix="sws-icon" size="24" color="#fff" label="待确认"
										margin-left="4" label-size="24" label-color="#fff"></u-icon>
								</view>
								<view v-else>
									<u-icon class="state-bar state-bar-reject" name="chexiao" custom-prefix="sws-icon" size="24"
										color="#fff" label="已驳回" margin-left="4" label-size="24" label-color="#fff"></u-icon>

								</view>
								<view class="u-flex-1 u-text-right u-p-r-20">
									<u-tag :text="`${+item.scoreRule ? '+': '-'}${item.scoreList[0].scoreValue}`" mode="light"
										class="u-m-l-8" :closeable="false" size="mini"
										:type="item.scoreList[0].scoreValue == 100 ? 'info': (+item.scoreRule ? 'success': 'error')" />
								</view>
							</view>
							<view class="u-p-20 u-flex">
								<view class="u-flex-1">
									<view class="u-main-color">{{item.scoreCode}}.{{item.scoreDesc}}</view>
									<view class="u-m-t-8 u-font-26" v-if="item.content">
										<text class="u-tips-color">原因说明：</text>
										<text>{{item.content}}</text>
									</view>
								</view>
								<view class="u-text-right u-m-l-16" v-if="item.state == 4">
									<u-button type="primary" class="score-btn" @click="toPScorePage(item)">变更</u-button>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<u-calendar v-model="showCalendar" mode="range" @change="calendarConfirm"></u-calendar>
		<u-select v-model="showSelect" :title="selectTitle" :list="selectList" @confirm="selectConfirm"></u-select>
		<u-top-tips ref="uTips"></u-top-tips>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				calendar: '',
				startDate: '',
				endDate: '',
				filterName: '全部',
				filterValue: 0,
				showCalendar: false,
				selectTitle: '',
				selectList: [],
				showSelect: false,
				dataList: []
			}
		},
		onLoad() {
			this.initDate()
		},
		methods: {
			getStaffChangeList() {
				const params = {
					startDate: this.startDate,
					endDate: this.endDate
				}
				this.$u.api.getStaffChangeList(params).then(res => {
					if (res.msgCode === '000000' && res.data) {
						this.tempArr = res.data.map(item => {
							//判断该评分项发生的月份是不是在当前月
							const isCrossMonth = item.workDate.includes(this.currMonth)
							return {
								...item,
								scoreValue: item.totalValue,
								scoreList: [{
									scoreValue: item.scoreValue,
									scoreRule: item.scoreRule,
									scoreDesc: item.scoreDesc,
									scoreCode: item.scoreCode,
									content: item.content
								}],
								isCrossMonth
							}
						})
						this.dataList = [...this.tempArr]
					} else {
						this.$refs.uTips.show({
							title: `评分审核列表获取失败，原因：${ res.message }`,
							type: 'error',
							duration: 3800
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			toPScorePage(data) {
				const _self = this
				uni.navigateTo({
					url: '/pages/microApp/Sws/performanceManagement/performanceScore/index',
					events: {
						acceptDataFromOpenedPage: function(data) {
							// 刷新数据
							_self.getStaffChangeList()
						},
					},
					success: function(res) {
						res.eventChannel.emit('acceptDataFromOpenerPage', {
							data: {
								...data,
								type: 'update'
							}
						})
					}
				})
			},
			calendarConfirm({
				startDate,
				endDate
			}) {
				this.calendar = startDate + ' ~ ' + endDate
				this.startDate = startDate
				this.endDate = endDate
			},
			selectConfirm([{
				label,
				value
			}]) {
				this.filterName = label
				this.filterValue = value
				if (!value) {
					this.dataList = [...this.tempArr]
					return
				}
				this.dataList = [...this.tempArr.filter(item => {
					return item.state == value
				})]
			},
			toFilter() {
				this.selectTitle = '请选择状态'
				this.selectList = [{
					label: '全部',
					value: 0
				}, {
					label: '待确认',
					value: 3
				}, {
					label: '已驳回',
					value: 4
				}]

				this.showSelect = true
			},
			initDate() {
				this.$u.api.getTimestamp().then(res => {
					if (res.msgCode === '000000') {
						let time = new Date().getTime()
						console.log('time: ', time)
						if (res.msgCode === '000000' && res.data) {
							time = res.data
						}
						this.currMonth = this.$u.timeFormat(time, 'YYYY-MM')
						this.endDate = this.$u.timeFormat(time)
						this.startDate = this.endDate.substring(0, 8) + '01'
						this.calendar = this.startDate + ' ~ ' + this.endDate

						this.getStaffChangeList()
					} else {
						this.$refs.uTips.show({
							title: `日期获取失败，原因：${ res.message }`,
							type: 'error',
							duration: 3800
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
	.filter-group {
		height: 64rpx;
		border-radius: 10rpx;
		overflow: hidden;
		font-size: 26rpx;

		&-label {
			height: 64rpx;
			line-height: 64rpx;
			background-color: #2979ff;
			color: #fff;
			padding-left: 20rpx;
		}

		&-text {
			height: 64rpx;
			line-height: 64rpx;
			padding-right: 16rpx;
			border: 2rpx solid #ebebeb;
			border-top-right-radius: 10rpx;
			border-bottom-right-radius: 10rpx;
		}
	}

	.staff-card {
		border-radius: 12rpx;
		margin-top: 20rpx;
		padding: 0 20rpx;

		&-header {
			padding: 20rpx 10rpx 15rpx 10rpx;
		}

		&-content {
			padding-bottom: 20rpx;

			.state-item {
				// box-shadow: 0 0 2rpx 2rpx rgba(160, 207, 255, .6);
				box-shadow: 0 0 2rpx 4rpx #ecf5ff;
				overflow: hidden;
				border-radius: 6rpx;
				margin-bottom: 20rpx;
				width: 100%;

				.state-bar {
					background-color: #ff9900;
					border-bottom-right-radius: 6rpx;
					padding: 6rpx 16rpx 6rpx 12rpx;
				}

				.state-bar-reject {
					background-color: #fa3534;
				}
			}

			.state-item:last-child {
				margin-bottom: 0;
			}
		}

		.score-btn {
			width: 130rpx;
			height: 64rpx;
			line-height: 64rpx;
			letter-spacing: 10rpx;
			text-indent: 10rpx;
		}
	}

	.staff-card:first-child {
		margin-top: 0;
	}

	.line-h-1 {
		line-height: 1;
	}

	::v-deep .u-content {
		background-color: #fff !important;
		border: 2rpx solid #e8e8e8;
	}

	::v-deep .uni-input-form {
		background-color: #fff !important;
	}
</style>