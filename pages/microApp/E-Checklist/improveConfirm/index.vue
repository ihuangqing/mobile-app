<!-- E-Checklist → 点检历史 -->
<template>
	<view class="page-wrap u-flex">
		<view class="material-search sws-w100 u-p-20 u-flex">
			<view class="filter-input u-flex">
				<u-input v-model="filterVal" type="select" input-align="center" disabled height="64"
					@click="switchFilter" />
				<u-line color="#606266" direction="col" length="40" class="u-m-l-20" />
			</view>
			<u-search class="search-input" placeholder="请输入设备编码或名称" shape="square" v-model="keyword" search-icon=""
				@search="fuzzyQuery" @custom="fuzzyQuery">
			</u-search>
		</view>
		<view class="sws-w100 check-list u-flex-1">
			<view class="list-item u-p-l-20 u-m-b-20" v-for="(item, index) in dataList" :key="index">
				<!-- class="" -->
				<view class="u-flex u-border-bottom u-row-between u-p-t-10 u-p-r-40 u-p-b-10 "
					:class="[{classbackground1:item.taskStatus == 1},{classbackground2:item.taskStatus == 0},{classbackground3:item.taskStatus == 2},{classbackground4:item.taskStatus == 3}]">
					<view class="u-type-primary">
						<!-- <u-icon name="calendar" size="32"></u-icon> -->
						<text class="sws-font-bold">{{ item.creationDate.substring(5,7) }}月</text>
						<!-- <text class="u-type-error u-font-24" v-show="item.state == 4">(已过期)</text> -->
					</view>
					<view>
						<text class="u-type-info u-font-24" v-if="item.taskStatus == 1">待确认</text>
						<text v-else-if="item.taskStatus == 0">待改善</text>
						<text v-else-if="item.taskStatus == 2">已完成</text>
						<text v-else-if="item.taskStatus == 3">已驳回</text>
					</view>
				</view>
				<view class="u-p-20">
					<view class="u-flex u-p-b-20 u-p-r-20">
						<view class="u-flex-10">
							<view class="u-m-b-10">
								{{ `${item.spotCheckDeviceVo.deviceName}(${item.spotCheckDeviceVo.deviceCode})` }}
							</view>
							<view>{{ item.areaName }}</view>
							<view>点检NG项：{{ item.itemName }}</view>
							<view>点检NG原因：{{ item.exception }}</view>
						</view>
						<u-button v-if="item.taskStatus == 1" class="u-flex-2 " type="warning" size="mini"
							@click="improvement(item)">改善确认</u-button>
						<u-button v-else-if="item.taskStatus == 0" class="u-flex-2 btn-text" type="info" size="mini"
							@click="hint(item)">催办 </u-button>
						<u-button v-else-if="item.taskStatus == 2" class="u-flex-2 btn-text" type="success" size="mini"
							@click="particulars(item)">详情</u-button>
						<!-- 	<u-button v-else-if="item.taskStatus == 2" class="u-flex-2 btn-text" type="success" size="mini"
							@click="particulars(item)">催办</u-button> -->
					</view>
					<view class="u-flex u-type-info u-font-24 u-row-between u-p-r-20">
						<text>点检人：{{ item.spotCheckDeviceVo.checkerList.map(user => user.userName).join('、') }}</text>
						<text>点检时间：{{ item.creationDate }}</text>
					</view>
				</view>
			</view>
		</view>
		<no-data v-show="showNoData"></no-data>
		<u-top-tips ref="uTips"></u-top-tips>
	</view>
</template>

<script>
	import noData from '../../../components/noData/index.vue'

	export default {
		components: {
			noData
		},
		data() {
			return {
				filterVal: '全部',
				keyword: '',
				dataList: [],
				showNoData: false,
				TaskStatus: ""
			}
		},
		computed: {},
		onLoad() {
			console.log('测试onLoad')
			this.getAllUnchecklist()
		},
		onShow() {
			console.log('测试show')
			this.getAllUnchecklist()
		},

		methods: {


			fuzzyQuery() {

				this.getAllUnchecklist()
			},


			getAllUnchecklist() {
				let params = {
					// account: this.userInfo.account,
					queryType: 2,
					deviceCode: this.keyword,
					// checkerId: 2109080104,
					taskStatus: this.TaskStatus
				}
				this.$u.api.improveTaskList(params).then(res => {
					if (res.msgCode === '000000') {
						this.dataList = res.data.data
						// console.log(this.dataList,'this.dataList')
						// this.renderList()
						if (!this.dataList) {
							this.showNoData = true
						}
					} else {
						this.$refs.uTips.show({
							title: `点检NG改善列表获取失败，原因：${res.message}`,
							type: 'error',
							duration: 2300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},



			// 催办
			hint() {
				uni.showToast({
					title: '模块开发中，敬请期待！',
					position: 'center',
					duration: 1000
				});
			},
			// 详情
			particulars(data) {
				// let _self = this
				// console.log(data)
				uni.navigateTo({
					url: `/pages/microApp/E-Checklist/improveConfirm/spotCheckParticulars/index`,
					success: function(res) {
						res.eventChannel.emit('ddd', { // 通过eventChannel向被打开页面传送数据
							data
						})
					}
				})

			},

			improvement(data) { //跳转至点检明细页面
				// let _self = this
				console.log(data)
				uni.navigateTo({
					url: `/pages/microApp/E-Checklist/improveConfirm/spotCheckAffirm/index`,
					success: function(res) {
						res.eventChannel.emit('spotCheckDataList', { // 通过eventChannel向被打开页面传送数据
							data
						})
					}
				})
			},


			switchFilter() {
				const _self = this
				const list = ['全部', '待改善', '待确认', '已完成', '已驳回']
				uni.showActionSheet({
					itemList: list,
					success: res => {
						console.log(res, 'resres')
						_self.filterVal = list[res.tapIndex]
						switch (res.tapIndex) {
							case 0:
								// 全部
								this.TaskStatus = ''
								break
							case 1:
								// 待改善
								this.TaskStatus = 0
								break
							case 2:
								// 待确认
								this.TaskStatus = 1
								break
							case 3:
								// 已完成
								this.TaskStatus = 2
								break
							case 4:
								// 已驳回
								this.TaskStatus = 3
								break
						}
						this.getAllUnchecklist()
					},
					fail: function(res) {
						console.log(res.errMsg)
					}
				})
			},

			searchByCode() {
				let params = {
					deviceCode: this.keyword
				}
				// this.getCheckHistory(params)
			},




			// goSearchMore() { //跳转至更多查询页面
			// 	let _self = this
			// 	uni.navigateTo({
			// 		url: `/pages/microApp/E-Checklist/spotCheckHistory/filter/index`,
			// 		events: {
			// 			acceptDataFromOpenedPage: function(res) { // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
			// 				_self.getCheckHistory(res.params)
			// 			}
			// 		}
			// 	})
			// }
		}
	}
</script>

<style lang="scss" scoped>
	.page-wrap {
		width: 100%;
		height: 100%;
		overflow: hidden;
		flex-direction: column;


		.plan-search {
			width: 100%;
		}

		.plan-filter {
			position: relative;
			width: 100%;

			.dropdown {
				width: 100%;
			}

			.filter-more {
				position: absolute;
				right: 0;
				width: 25%;
				height: 100%;
				text-align: center;
				background-color: #fff;
				z-index: 300;
			}
		}

		.plan-list {
			background-color: #ededed;
			overflow-y: scroll;

			.list-item {
				background-color: #ffffff;
			}
		}

		.check-list {
			background-color: #ededed;
			position: relative;
			overflow: scroll;
			margin-top: 110rpx;

			.list-item {
				background-color: #ffffff;
			}
		}

		.btn-text {
			letter-spacing: 20rpx;
			text-indent: 20rpx;
			line-height: normal;
		}

		.classbackground1 {
			background-color: #ff9900;
		}

		.classbackground2 {
			background-color: #90939a;
		}

		.classbackground3 {
			background-color: #18be6a;
		}

		.classbackground4 {
			background-color: red;
		}

	}

	.material-search {
		position: fixed;
		z-index: 3;
		background-color: #ffffff;
	}

	.scroll-wrap {
		min-height: 100%;
		padding-top: 104rpx; //64(u-search默认高度) + 20 + 20（搜索框上下内边距）
	}

	.card-head {
		color: #ffffff;
	}

	.btn-style {
		width: 180rpx;
		height: 60rpx;
		line-height: normal;
		padding: 0 16rpx;
	}

	.filter-input {
		position: absolute;
		width: 180rpx;
		padding-left: 20rpx;
	}

	::v-deep .search-input .u-content {
		padding-left: 200rpx;
	}
</style>
