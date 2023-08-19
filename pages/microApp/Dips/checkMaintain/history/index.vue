<!-- DIPS → 设备点检1、巡检2、保养3、维护4  → 历史 -->
<template>
	<view class="sws-wh100 u-flex sws-flex-d-column sws-overflow-hidden">
		<view class="sws-w100 u-p-20">
			<view class="u-flex">
				<u-icon class="u-m-r-20" name="scan" size="50" color="#2979ff" @click="scanCode"></u-icon>
				<u-search placeholder="请输入设备编码" shape="square" v-model="deviceCode" @custom="searchByCode"></u-search>
			</view>
			<view class="u-flex date-range sws-w100" v-show="showDateRange" @click="showCalendar = true">
				<u-icon name="calendar" size="32" color="#2979ff"></u-icon>
				<view class="u-m-l-10 u-m-r-10 u-type-info">请选择时间范围</view>
				<view class="u-flex-1 date-style u-type-info">{{ startDate ? startDate : '起始时间' }}</view>
				<view class="u-m-l-10 u-m-r-10">~</view>
				<view class="u-flex-1 date-style u-type-info">{{ endDate ? endDate : '截止时间' }}</view>
			</view>
		</view>
		<scroll-view scroll-y style="height: 100%;width: 100%;" @scrolltolower="loadMore">
			<u-collapse :head-style="{'padding': '30rpx'}" hover-class="none" arrow-color="#2979ff">
				<u-collapse-item class="u-border-bottom" v-for="(device, index) in list" :key="index">
					<view slot="title" class="sws-w100">
						<view class="u-flex u-p-r-30 u-row-between">
							<text class="u-main-color">{{ `${device.deviceName}(${device.deviceCode})` }}</text>
							<text class="u-main-color">{{device.deviceCategory }}</text>
							<text class="u-main-color">{{device.stateDesc }}</text>
						</view>
						<view class="sws-w100 u-font-26 u-m-t-16 u-p-r-30 u-tips-color">
							<view class="u-flex u-font-17" v-show="device.startDate">
								<text>{{ title }}时间范围：{{ device.startDate }} ~ {{device.deadDate}}</text>
							</view>
							<view class="u-flex u-m-t-14" v-show="device.recordDate">
								<text>实际{{ title }}时间：{{ device.recordDate }}</text>
							</view>
							<view class="sws-w100 u-flex u-row-between u-m-t-14" v-show="device.checkIncharge || device.checker">
								<text v-show="device.checker">实际登记人：{{ device.checker }}</text>
								<text v-show="device.checkIncharge">实际确认人：{{ device.checkIncharge }}</text>
							</view>
							<view class="sws-w100 u-flex u-row-between u-m-t-14">
								<text>{{ title }}人：{{ checkUsers(device) }}</text>
								<text>确认人：{{ confirmUsers(device) }}</text>
							</view>
						</view>
					</view>
					<u-cell-group :border="false">
						<view v-for="(item, index) in device.itemList" :key="index">
							<u-cell-item class="u-flex sws-w100 sws-overflow-hidden" hover-class="none" :arrow="false"
								:use-label-slot="true" :border-top="true" :border-bottom="false"
								:title-style="{flex: '1'}" :value-style="{flex: 'none'}">
								<view slot="icon" class="u-m-r-20 u-font-32">
									{{ common.serialNumFormatter(index) }}
								</view>
								<view slot="title" class="u-flex-1">
									<view class="u-main-color u-font-32">{{ item.itemName }}</view>
								</view>
								<u-switch slot="right-icon" v-model="item.state" inactive-color="#fa3534"
									active-color="#19be6b" :disabled="true" :showText="true" size="46"></u-switch>
							</u-cell-item>
							<view class="sws-w100 u-flex u-p-b-20 u-p-r-30 u-p-l-30" v-show="!item.state">
								<view class="ng-reason u-flex-1 u-line-1 u-p-l-10">
									<text class="u-type-info u-font-24">NG原因：</text>
									<text>{{ item.exception }}</text>
								</view>
							</view>
						</view>
					</u-cell-group>
				</u-collapse-item>
				<u-loadmore :status="loadStatus" bgColor="#ffffff" v-show="showLoadMore"></u-loadmore>
			</u-collapse>
		</scroll-view>
		<u-calendar v-model="showCalendar" mode="range" @change="selectCalendar"></u-calendar>
		<u-top-tips ref="uTips"></u-top-tips>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				page: 1,
				limit: 10,
				title: '',
				deviceCode: '',
				startDate: '',
				endDate: '',
				list: [],
				showDateRange: false,
				showCalendar: false,
				showLoadMore: false,
				loadStatus: 'loadmore'
			}
		},
		computed: {
			itemState(state){
				if(state){
					return Boolean(state)
				}
				return false
			},
			confirmUsers(item) {
				return item => {
					let users = []
					if (this.type === '1' || this.type === '2') {
						users = item.checkInchargeList
					} else if (this.type === '3' || this.type === '4') {
						users = item.maintainInchargeList
					}
					return users.map(user => user.userName).join('、')
				}
			},
			checkUsers(item) {
				return item => {
					let users = []
					if (this.type === '1' || this.type === '2') {
						users = item.checkerList
					} else if (this.type === '3' || this.type === '4') {
						users = item.maintainerList
					}
					return users.map(user => user.userName).join('、')
				}
			}
		},
		onLoad(options) {
			this.title = options.title
			this.typeUrl = options.typeUrl
			this.type = options.type
			uni.setNavigationBarTitle({
				title: options.title + '记录'
			})
		},
		methods: {
			loadMore() {
				if (this.loadStatus == 'nomore') {
					return
				}
				this.loadStatus = 'loading'
				this.getList('loading')
			},
			getList(type) {
				this.showDateRange = true
				const params = {
					query: `${this.typeUrl}/list${this.$u.queryParams({
						page: this.page,
						limit: this.limit
					})}`,
					body: {
						deviceCode: this.deviceCode
					}
				}
				if (type === 'dateRange') {
					params.body.recordDateFrom = this.startDate
					params.body.recordDateTo = this.endDate
				}

				this.$u.api.getListForDips(params).then(res => {
					if (res.msgCode === '000000') {
						const tempArr = res.data.data.map(device => {
							device.itemList.map(item => {
								item.state = item.state === '1' ? true:false
								return item
							})
							return device
						})
						this.showLoadMore = true
						if (!tempArr.length || tempArr.length < this.limit) {
							this.loadStatus = 'nomore'
						}
						if (type === 'loading') {
							this.list = [...this.list, ...tempArr]
							this.page++
						} else {
							this.list = tempArr
						}
					} else {
						this.$refs.uTips.show({
							title: `数据查询失败，原因：${res.message}`,
							type: 'error',
							duration: 2300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, this)
				})
			},
			searchByCode() {
				if (!this.$u.trim(this.deviceCode)) return
				this.list = []
				this.getList()
			},
			async scanCode() {
				// #ifdef APP-PLUS
				let code = await this.common.scanCode()
				this.deviceCode = code
				this.searchByCode()
				// #endif
			},
			selectCalendar(res) {
				this.startDate = res.startDate
				this.endDate = res.endDate
				this.list = []
				this.getList('dateRange')
			}
		}
	}
</script>

<style lang="scss" scoped>
	.date-range {
		height: 64rpx;
		padding-left: 18rpx;

		.date-style {
			text-align: center;
			background-color: #f2f2f2;
			padding: 8rpx 0;
			border-radius: 10rpx;
			font-size: 24rpx;
		}
	}
</style>
