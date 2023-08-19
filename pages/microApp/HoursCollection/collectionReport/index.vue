<template>
	<view class="sws-wh100 u-rela sws-bg-ebebeb">
		<view class="u-abso cr-filter">
			<view class="u-flex cr-filter-up">
				<view class="u-flex-7 u-text-center" @click="showDate = true">
					<u-icon name="arrow-down" margin-right="10" label-pos="left" :label="date"></u-icon>
				</view>
				<view class="u-flex-5 u-text-center" @click="showTypePicker = true">
					<u-icon name="arrow-down" margin-right="10" label-pos="left" :label="typeTitle"></u-icon>
				</view>
			</view>
			<view class="cr-filter-down">
				<u-search placeholder="请输入影响人员工号" v-model="keyword" shape="square" @search="toQuery"
					@custom="toQuery"></u-search>
			</view>
		</view>
		<view class="sws-w100 cr-content sws-bg-ebebeb">
			<view class="sws-wh100">
				<view class="cr-content-item" v-for="(item, index) in list" :key="index">
					<view :class="item.active ? 'item-header item-active' : 'item-header'" @click="toggleItem(item)">
						<view class="sws-font-bold">
							<u-icon name="calendar" size="28" class="u-m-r-6"></u-icon>
							<text>{{ item.actionDate }}</text>
						</view>
						<view class="u-p-l-30 u-p-r-15 u-flex-1 u-text-right">
							<u-icon :name="item.active ? 'arrow-up' : 'arrow-down'" size="28"></u-icon>
						</view>
					</view>
					<view class="item-body" v-show="item.active">
						<view class="body-item" v-for="(childItem, childIndex) in item.list" :key="childIndex">
							<view class="u-flex u-row-between">
								<view class="body-item-title">
									<!-- <text class="u-font-28">工时类型：</text> -->
									<text class="u-font-28">{{ computedWorkTimeType(childItem.worktimeType) }}</text>
								</view>
								<view class="u-p-r-20">
									<u-button type="warning" v-show="childItem.edit" size="mini"
										@click="toDetail(index, childItem.id, 'edit')">变更</u-button>
									<u-button type="primary" v-show="!childItem.edit" size="mini"
										@click="toDetail(index, childItem.id)">查看</u-button>
								</view>
							</view>
							<view class="u-m-t-8">
								<text class="u-font-24">发生点位：</text>
								<text class="u-font-26">{{ computedLineInfo(childItem.lineInfoList) }}</text>
							</view>
							<view class="u-m-t-8">
								<text class="u-font-24">采集日期：</text>
								<text class="u-font-26">{{ childItem.lastUpdateDate }}</text>
							</view>
							<view class="u-flex u-m-t-8">
								<view class="u-flex-1">
									<text class="u-font-24">影响人数：</text>
									<text class="u-font-26">{{ childItem.effectPersonNum }}人</text>
								</view>
								<view class="u-flex-1">
									<text class="u-font-24">影响工时：</text>
									<text class="u-font-26">{{ childItem.totalMinute }}分钟</text>
								</view>
							</view>
						</view>
					</view>
				</view>
				<u-loadmore :status="loadStatus" bgColor="#ebebeb"></u-loadmore>
			</view>
		</view>
		<no-data v-show="showNoData" class="u-abso no-data"></no-data>
		<u-popup v-model="showDate" mode="bottom">
			<view class="date-popup">
				<view class="date-popup-header u-border-bottom">
					<u-tabs :list="dateTypeList" :is-scroll="false" bar-width="60" :current="currDate"
						@change="dateTypeChange"></u-tabs>
				</view>
				<view v-show="!currDate" class="date-popup-content">
					<picker-view :indicator-style="indicatorStyle" :value="value" @change="bindChange" class="picker-view">
						<picker-view-column>
							<view class="item" v-for="(item,index) in years" :key="index">{{item}}年</view>
						</picker-view-column>
						<picker-view-column>
							<view class="item" v-for="(item,index) in months" :key="index">{{item}}月</view>
						</picker-view-column>
					</picker-view>
				</view>
				<view v-show="currDate" class="date-popup-content u-p-30 u-m-b-20">
					<view class="u-m-t-20">
						<view>日期范围</view>
						<view class="u-m-t-30">
							<u-tag :text="item.name" :mode="item.checked ? 'dark' : 'plain'" :type="item.checked ? 'primary' : 'info'"
								class="u-m-r-20" v-for="(item, index) of nearDateList" :key="index"
								@click="dateTagClick(item, index)" />
						</view>
					</view>
					<view class="u-m-t-40">
						<view>自定义</view>
						<view class="u-m-t-30 u-flex" @click="showCalendar = true">
							<u-field v-model="dateRange" icon="calendar" placeholder="请选择日期范围" label="起止日期" label-width="160"
								type="text" disabled class="sws-w100 u-p-l-0" input-align="center"
								@click="showCalendar = true"></u-field>
						</view>
					</view>
				</view>
				<view class="btn-group u-flex">
					<u-button type="info" class="btn-group-item" hover-class="none" @click="showDate = false">取消</u-button>
					<u-button type="primary" class="u-flex-1 u-m-l-20 btn-group-item" hover-class="none"
						@click="dateConfirm">确认</u-button>
				</view>
			</view>
		</u-popup>
		<u-calendar v-model="showCalendar" mode="range" @change="calendarChange"></u-calendar>
		<u-select v-model="showTypePicker" :list="typeList" mode="mutil-column-auto" @confirm="typeConfirm"></u-select>
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
			const date = new Date()
			const years = []
			const year = date.getFullYear()
			const months = []
			const month = date.getMonth() + 1
			const days = []
			const day = date.getDate()
			for (let i = 1990; i <= date.getFullYear(); i++) {
				years.push(i)
			}
			for (let i = 1; i <= 12; i++) {
				months.push(i)
			}
			return {
				page: 1,
				limit: 30,
				title: 'picker-view',
				years,
				year,
				months,
				month,
				value: [9999, month - 1, day - 1],
				visible: true,
				indicatorStyle: `height: 50px;`,
				nearDateList: [{
					name: '上个月',
					checked: false
				}, {
					name: '近三月',
					checked: false
				}, {
					name: '近半年',
					checked: false
				}],
				date: '2023-07',
				dateTypeList: [{
					name: '月份选择'
				}, {
					name: '自定义'
				}],
				currDate: 0,
				showDate: false,
				dateRange: '',
				showCalendar: false,
				typeId: '',
				typeTitle: '工时类型',
				showTypePicker: false,
				keyword: '',
				typeList: [{
						label: '全部',
						value: 999,
						children: [{
							label: '全部',
							value: 999
						}]
					}, {
						label: '生产异常工时',
						value: 1,
						children: [{
							label: '首件',
							value: 1
						}, {
							label: '5S',
							value: 2
						}, {
							label: '设备异常停机维修',
							value: 3
						}, {
							label: 'PM保养',
							value: 4
						}]
					}, {
						label: '外部异常工时',
						value: 2,
						children: [{
							label: '试验单影响',
							value: 5
						}, {
							label: '品质异常冻结(内部)',
							value: 6
						}, {
							label: '品质异常冻结(供应商)',
							value: 7
						}, {
							label: '设备故障停机（内部）',
							value: 8
						}, {
							label: '设备故障停机（供应商）',
							value: 9
						}]
					}, {
						label: '被动培训工时',
						value: 3,
						children: [{
							label: '无生产计划',
							value: 10
						}, {
							label: '切线',
							value: 11
						}, {
							label: '待料(内部)',
							value: 12
						}, {
							label: '待料(外部)',
							value: 13
						}]
					}, {
						label: '辅助人员工时',
						value: 4,
						children: [{
							label: '辅助人员工时',
							value: 14
						}]
					},
					{
						label: '转嫁工时',
						value: 5,
						children: [{
							label: '转嫁工时',
							value: 15
						}]
					}
				],
				loadStatus: 'loadmore',
				showNoData: false,
				list: [],
				isSearch: false, //是否是使用搜索按钮
			}
		},
		computed: {
			...mapState(['factoryId', 'userInfo']),
			computedLineInfo(list) {
				return list => {
					const info = list[0]
					return `${ info.lineCode } - ${ info.sectionName }`
				}
			},
			computedWorkTimeType(type) {
				return type => {
					let typeObj = {}
					for (let item of this.typeList) {
						const temp = item.children.filter(child => child.value == type)
						if (temp.length) {
							typeObj = temp[0]
						}
					}
					return typeObj.label
				}
			}
		},
		onLoad() {
			this.initDate()
		},
		methods: {
			isNeedApprove(worktimeType) {
				return [5, 6, 7, 8, 9, 13, 15].includes(+worktimeType)
			},
			toApply(data) {
				const _self = this
				uni.navigateTo({
					url: '/pages/microApp/HoursCollection/applyHour/index',
					success: function(res) {
						res.eventChannel.emit('acceptDataFromOpenerPage', {
							...data,
							fromRecord: true,
							readOnly: _self.readOnly
						})
					},
					events: {
						acceptDataFromOpenedPage: (res) => {
							_self.list[_self.currIndex].list.forEach(item => {
								if (item.id == res.id) {
									item.edit = false
								}
							})
						}
					}
				})
			},
			toDetail(index, id, flag) {
				this.currIndex = index
				this.readOnly = flag == 'edit' ? false : true
				this.$u.api.getCollectionInfoById(id).then(res => {
					if (res.msgCode === '000000') {
						this.toApply(res.data)
					} else {
						this.$refs.uTips.show({
							title: `工时采集信息获取失败，原因：${ res.message }`,
							type: 'error',
							duration: 2300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			toQuery() {
				this.isSearch = true
				this.page = 1
				this.dataList = []
				this.list = []
				this.loadStatus = 'loadmore'
				this.getDataList()
			},
			getDataList() {
				let params = {
					query: {
						page: this.page,
						limit: this.limit
					},
					body: {
						"effectAccount": this.keyword, //（影响人员账号）
						"endDate": this.endDate, //（结束时间）
						"startDate": this.startDate, //（开始时间） 
						"foremanAcct": this.keyword ? this.keyword : this.userInfo.account, //（班组长账号）
						factoryId: this.factoryId,
						"month": this.currDate ? '' : this.date.replace('-', ''), //（月份（ yyyyMM））
						"queryType": this.currDate ? 1 : 2, //（查询方式（ 1 - 按日查询， 2 - 按月查询）） 
						"worktimeType": this.typeId //（工时类型(1 - this， 2 - 5 S......)
					}
				}

				if (this.isSearch) {
					params.body.foremanAcct = this.keyword ? this.keyword : ''
				}

				uni.stopPullDownRefresh() //关闭下拉刷新
				this.$u.api.postCollectionReportList(params).then(res => {
					if (res.msgCode === '000000') {
						let tempArr = []
						let resArr = []
						res.data.data.reduce((prev, curr) => {
							const tempTime = new Date(curr.lastUpdateDate).getTime() + 12 * 60 * 60 * 1000
							let tempCurr = {
								...curr
							}

							if (this.isNeedApprove(curr.worktimeType)) {
								tempCurr.edit = this.userInfo.account == curr.creatorAccount && curr.status == 3
							} else {
								tempCurr.edit = tempTime > this.currTime && this.userInfo.account == curr.creatorAccount
							}

							let temp = {
								actionDate: tempCurr.actionDate,
								active: false,
								list: [tempCurr]
							}
							const index = tempArr.indexOf(tempCurr.actionDate)
							if (index != -1) {
								resArr[index].list.push(tempCurr)
							} else {
								tempArr.push(tempCurr.actionDate)
								resArr.push(temp)
							}
						}, resArr)

						this.dataList = [...this.list, ...resArr]
						this.list = this.dataList
						this.page++

						if (!res.data.data.length || res.data.data.length < this.limit) this.loadStatus =
							"nomore"
						if (!this.list.length) {
							this.showNoData = true
						} else {
							this.showNoData = false
						}
					} else {
						this.$refs.uTips.show({
							title: `工时采集报表获取失败，原因：${ res.message }`,
							type: 'error',
							duration: 2300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			dateConfirm() {
				if (this.currDate) {
					this.date = this.startDate + ' ~ ' + this.endDate
				} else {
					const tempDate = this.year + '-' + (this.month < 10 ? ('0' + this.month) : this.month)
					if (this.date !== tempDate) {
						this.date = tempDate
					}
				}

				this.refreshData()
				this.showDate = false
			},
			bindChange: function(e) {
				const val = e.detail.value
				this.year = this.years[val[0]]
				this.month = this.months[val[1]]
			},
			dateTypeChange(index) {
				this.currDate = index
			},
			dateTagClick(item, index) {
				if (item.checked) {
					item.checked = false
					this.startDate = ''
					this.endDate = ''
				} else {
					this.nearDateList.forEach(item => item.checked = false)
					this.$nextTick(() => item.checked = true)
					const date = this.$u.timeFormat(this.currTime, 'yyyy-mm-dd')
					if (index === 1) { //近三月
						const tempTime = this.common.dateCalculator(this, 90, this.currTime)
						this.startDate = this.$u.timeFormat(tempTime, 'yyyy-mm-dd')
						this.endDate = date
					} else if (index === 2) { //近半年
						const tempTime = this.common.dateCalculator(this, 180, this.currTime)
						this.startDate = this.$u.timeFormat(tempTime, 'yyyy-mm-dd')
						this.endDate = date
					} else { //上个月
						const tempMonth = new Date(this.currTime).getMonth()
						const prevMonth = tempMonth ? (tempMonth < 10 ? '0' + tempMonth : tempMonth) : 12
						if (tempMonth) {
							const year = new Date(this.currTime).getFullYear()
							this.startDate = year + '-' + prevMonth + '-01'
							this.endDate = year + '-' + prevMonth + '-' + new Date(year, prevMonth, 0).getDate()
						} else {
							const year = new Date(this.currTime).getFullYear() - 1
							this.startDate = year + '-' + prevMonth + '-01'
							this.endDate = year + '-' + prevMonth + '-' + new Date(year, prevMonth, 0).getDate()
						}
					}
				}
			},
			typeConfirm([parent, child]) {
				this.typeTitle = child.label
				this.typeId = child.value
				if (parent.value === 999) { //选择全部
					this.typeId = ''
				}
				this.refreshData()
			},
			calendarChange({
				startDate,
				endDate
			}) {
				this.startDate = startDate
				this.endDate = endDate
				this.dateRange = startDate + ' ~ ' + endDate
				this.nearDateList.forEach(item => item.checked = false)
			},
			toggleItem(item) {
				item.active = !item.active
			},
			initDate() {
				this.$u.api.getTimestamp().then(res => {
					if (res.msgCode === '000000') {
						this.currTime = new Date().getTime()
						if (res.msgCode === '000000' && res.data) {
							this.currTime = res.data
						}

						this.date = this.$u.timeFormat(this.currTime, 'yyyy-mm')
						this.getDataList()
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
			},
			refreshData() {
				this.isSearch = false
				this.page = 1
				this.dataList = []
				this.list = []
				this.loadStatus = 'loadmore'
				this.getDataList()
			}
		},
		onReachBottom() {
			if (this.loadStatus != 'nomore') { //如果状态无无数据，则不再请求
				this.loadStatus = "loading"
				this.getDataList()
			}
		},
		onPullDownRefresh() {
			this.startDate = ''
			this.endDate = ''
			this.currDate = 0
			this.date = this.$u.timeFormat(this.currTime, 'yyyy-mm')
			this.typeId = ''
			this.keyword = ''
			this.refreshData()
		}
	}
</script>

<style lang="scss" scoped>
	.cr-filter {
		position: fixed;
		// top: 0;
		left: 0;
		width: 100%;
		height: 160rpx;
		background-color: #fff;
		z-index: 3;

		&-up {
			height: 76rpx;
		}

		&-down {
			padding: 0 20rpx 20rpx 20rpx;
		}
	}

	.cr-content {
		padding: 180rpx 20rpx 20rpx 20rpx;
		z-index: 1;
		min-height: 100%;

		&-item {
			border-radius: 16rpx;
			background-color: #fff;
			box-shadow: 0 0 2rpx 1rpx #fff;
			margin-bottom: 20rpx;
			overflow: hidden;

			.item-header {
				padding: 20rpx;
				display: flex;
			}

			.item-header.item-active {
				background-color: #2979ff;
				color: #fff;
			}

			.item-body {
				padding: 20rpx;

				.body-item {
					background-color: #ecf5ff;
					box-shadow: 0 0 2rpx 1prx #ecf5ff;
					border-radius: 6rpx;
					margin-bottom: 12rpx;
					padding: 16rpx 20rpx;

					&-title {
						font-weight: bold;
						padding: 4rpx 8rpx;
						border-bottom: 4rpx solid #2979ff;
						border-bottom-left-radius: 4rpx;
						border-bottom-right-radius: 4rpx;
					}
				}

				.body-item:last-child {
					margin-bottom: 0;
				}
			}
		}

	}

	.cr-content-item:last-child {
		margin-bottom: 0;
	}

	.date-popup {
		height: 596rpx;

		&-header {
			width: 60%;
		}

		&-content {
			height: 376rpx;
		}

		.picker-view {
			height: 376rpx;
			margin-top: 20rpx;
		}

		.item {
			line-height: 100rpx;
			text-align: center;
		}

		.btn-group {
			padding: 20rpx;

			&-item {
				letter-spacing: 20rpx;
				text-indent: 20rpx;
			}
		}
	}

	.no-data {
		top: 0;
	}
</style>