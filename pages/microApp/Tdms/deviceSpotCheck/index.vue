<template>
	<view class="sws-wh100 u-flex sws-flex-d-column">
		<view class="sws-w100 u-flex u-p-l-30">
			<u-search placeholder="请输入/扫码设备编码" v-model="deviceCode" show-action shape="square" margin="10rpx 0"
				@search="toSearch" @custom="toSearch">
			</u-search>
			<u-icon name="saoma" custom-prefix="sws-icon" size="48" color="#2979ff" class="u-p-l-20 u-p-r-30"
				@click="toScanCode"></u-icon>
		</view>
		<view class="sws-w100 check-list u-flex-1">
			<view class="list-item u-p-l-20 u-m-b-20" v-for="(item, index) in list" :key="index">
				<view class="u-flex u-border-bottom u-row-between u-p-t-10 u-p-r-40 u-p-b-10">
					<view class="u-type-primary">
						<u-icon name="shebeidianjian" custom-prefix="sws-icon" size="32"></u-icon>
						<text class="u-m-l-6">{{ item.deviceName }}</text>
					</view>
					<!-- <view>
						<text class="u-type-info u-font-24">确认人：</text>
						<text>{{ item.checkName }}</text>
					</view> -->
				</view>
				<view class="u-p-20">
					<view class="u-flex u-p-b-20 u-p-r-20">
						<view class="u-flex-10">
							<view class="u-m-b-8">设备编码：{{ item.deviceCode }}</view>
							<view class="u-m-b-8">设备类型：{{ item.deviceModel }}</view>
							<view>应用区域：{{ item.areaName }}</view>
						</view>
						<u-button class="u-flex-2 btn-text" type="primary" size="mini"
							@click="toCheck(item, index)">点检</u-button>
					</view>
					<view class="check-info u-flex u-type-info u-font-24 u-row-between u-m-r-20">
						<text>点检人：{{ item.checkName }}</text>
						<text>截止时间：{{ item.checkDate }}</text>
					</view>
				</view>
			</view>
			<u-loadmore :status="loadStatus"></u-loadmore>
		</view>
		<no-data v-show="showNoData"></no-data>
		<u-top-tips ref="uTips"></u-top-tips>
	</view>
</template>

<script>
	import noData from '../../../components/noData/index.vue'

	import {
		mapState
	} from 'vuex'

	export default {
		components: {
			noData
		},
		data() {
			return {
				page: 1,
				limit: 5,
				deviceCode: '',
				dataList: [],
				list: [],
				showNoData: false,
				loadStatus: 'loadmore',
			}
		},
		computed: mapState(['userInfo']),
		onLoad() {
			this.queryBody = {
				checkBy: this.userInfo.account
			}
			this.getSpotListForTdms() //获取所有未点检列表
		},
		methods: {
			getSpotListForTdms(flag = false) {
				if (flag) {
					this.queryBody = {
						checkBy: this.userInfo.account,
						deviceCode: this.deviceCode
					}
					this.dataList = []
					this.list = []
				}
				const params = {
					query: {
						page: flag ? 1 : this.page,
						limit: this.limit
					},
					body: this.queryBody
				}
				uni.stopPullDownRefresh() //关闭下拉刷新
				this.$u.api.getSpotListForTdms(params).then(res => {
					if (res.msgCode === '000000' && res.data) {
						const temp = res.data.data

						this.dataList = [...this.list, ...temp]
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
							title: `待点检列表获取失败，原因：${res.message}`,
							type: 'error',
							duration: 2300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			toSearch() {
				this.getSpotListForTdms(true)
			},
			async toScanCode() {
				this.deviceCode = await this.common.scanCode(this)
				this.getSpotListForTdms(true)
			},
			toCheck(item, index) {
				this.currIndex = index
				this.$u.api.getSpotDetailForTdms({
					inputId: item.id
				}).then(res => {
					if (res.msgCode === '000000' && res.data) {
						if(res.data.length) {
							this.goToCheck({
								...item,
								inputRecordPoList: res.data
							})
						} else {
							this.$refs.uTips.show({
								title: `暂无待点检项`,
								type: 'warning',
								duration: 2300
							})
						}
					} else {
						this.$refs.uTips.show({
							title: `待点检详情获取失败，原因：${res.message}`,
							type: 'error',
							duration: 2300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			goToCheck(data) {
				let _self = this
				uni.navigateTo({
					url: '/pages/microApp/Tdms/deviceSpotCheck/spotCheck/index',
					events: {
						acceptDataFromOpenedPage: function(res) {
							_self.list.splice(_self.currIndex, 1)
						},
					},
					success: function(res) {
						res.eventChannel.emit('acceptDataFromOpenerPage', { // 通过eventChannel向被打开页面传送数据
							data
						})
					}
				})
			},
			refreshPage() {
				this.page = 1
				this.dataList = []
				this.list = []
				this.deviceCode = ''
				this.queryBody = {
					checkBy: this.userInfo.account
				}
				this.loadStatus = 'loadmore'
				this.getSpotListForTdms()
			}
		},
		onReachBottom() {
			if (this.loadStatus != 'nomore') { //如果状态无无数据，则不再请求
				this.loadStatus = "loading"
				this.getSpotListForTdms()
			}
		},
		onPullDownRefresh() {
			this.refreshPage()
		}
	}
</script>

<style lang="scss" scoped>
	.check-list {
		background-color: #ededed;
		position: relative;
		overflow: scroll;

		.list-item {
			background-color: #ffffff;
		}
	}

	.btn-text {
		letter-spacing: 20rpx;
		text-indent: 20rpx;
		line-height: normal;
	}

	.check-info {
		background: #a3d8f1;
		color: #ffff;
		padding: 2px 10px;
		border-radius: 3px;
		justify-content: space-between;
	}
</style>