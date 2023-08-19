<!-- 4M变化点管理 -->
<template>
	<view class="productTracing sws-wh100">
		<view class="sws-w100 material-search">
			<view class="sws-w100 u-p-20 u-flex">
				<u-search class="search-input" placeholder="请输入4M编号" shape="square" v-model="searchKeyWord"
					search-icon="" @search="queryProduct" @custom="queryProduct">
				</u-search>
			</view>
			<view class="u-p-l-40 u-p-r-40 u-flex u-row-center tab-wrap">
				<u-tabs ref="tabs" :list="tabList" :current="tabCurrent" :item-width="240" :bar-width="50" :height="80"
					@change="changeTab"></u-tabs>
				<u-button class="btn-style u-m-l-30" size="medium" type="primary" style='margin-bottom: 10rpx;'
					@click='goToInfoPosing'>信息提报</u-button>
			</view>
		</view>
		<view class="scroll-wrap sws-bg-ebebeb">
			<view class="u-p-20">
				<u-card margin="0 0 20rpx 0" :border="false" :head-style="{background: '#2979ff',padding: '0 30rpx'}"
					:body-style="{padding: 0}" :foot-style="{padding: '16rpx 30rpx'}" :show-foot="true" :full="true"
					v-for="(item, index) in tableList" :key="index" @click='goToDetail(item)'>
					<view slot="head">
						<view class="card-head u-font-28 u-flex u-row-between">
							<view>4M编码（{{item.businessNo}}）</view>
						</view>
					</view>
					<u-cell-group slot="body" :border="false">
						<u-cell-item class="u-p-t-10 u-p-b-10" hover-class="none" :arrow="false" title="流程发起人"
							:value="item.proposer||''">
						</u-cell-item>
						<u-cell-item v-if="tabCurrent===0" class="u-p-t-10 u-p-b-10" hover-class="none" :arrow="false"
							title="流程发起日期" :value="item.taskCreateTime||''">
						</u-cell-item>
						<u-cell-item v-if="tabCurrent===1" class="u-p-t-10 u-p-b-10" hover-class="none" :arrow="false"
							title="流程发起日期" :value="item.startTime||''">
						</u-cell-item>
						<u-cell-item class="u-p-t-10 u-p-b-10" hover-class="none" :arrow="false" title="流程节点"
							:value="item.taskName||''">
						</u-cell-item>
						<u-cell-item v-if="tabCurrent===1" class="u-p-t-10 u-p-b-10" hover-class="none" :arrow="false"
							title="流程状态" :value="item.status||'已完成'">
						</u-cell-item>
					</u-cell-group>
				</u-card>
				<u-loadmore :status="loadStatus" bgColor="#ebebeb"></u-loadmore>
			</view>
		</view>

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

				searchKeyWord: '',
				tabList: [{
					name: '我的待办',
					count: 0
				}, {
					name: '我的已办',
					count: 0
				}],
				page: 1,
				limit: 10,
				tabCurrent: 0,
				searchKeyWord: '',
				searchVal: '',
				showNoData: false,
				loadStatus: 'loadmore',
				showManufactoryOrder: false,
				prod: {
					// itemCode: '',
					// errorFlag: '',
					// areaName: '',
					// groupName: ''
				},
				tableList: [],




			};
		},
		created() {


		},
		onLoad() {
			this.showNoData = true
			this.getProductList()

		},
		onBackPress() { //todo缓存
			let pages = getCurrentPages();
			let path = pages.route
			let arr = []
			if (pages && pages.length > 0) {
				arr = pages.filter(item => {
					return item.route === 'pages/microApp/QmsManagement/4MChange/index'
				})

			}
			if (arr.length > 0) {
				uni.switchTab({
					url: '/pages/microApp/index',
				})
			}
			return true;
		},
		methods: {

			goToDetail(data) { //流程详情
				let tabCurrent = this.tabCurrent
				if (data.businessKey) {
					let params = data.businessKey
					let dataInfo = {
						...data,
						tabCurrent: tabCurrent

					}
					uni.navigateTo({
						url: '/pages/microApp/QmsManagement/4MChange/infomationPosing/index',
						// events: {
						// 	// 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据  参数名字随便起，前后页面对应上即可
						// 	acceptDataFromPrjectPage(res) {
						// 		
						// 		const temp = res.data[0]
						// 		// _self.model.projectName = temp.name
						// 		_self.model.projectCode = temp.name

						// 	},
						// }
						success: function(res) { // 通过eventChannel向被打开页面传送数据
							res.eventChannel.emit('acceptDataFromManagePage', dataInfo)

						}
					})

				}



			},
			goToInfoPosing() { //信息提报
				uni.navigateTo({
					url: `/pages/microApp/QmsManagement/4MChange/infomationPosing/index`,
					success: res => {
						res.eventChannel.emit('acceptDataFromManagePage', {
							formKey: 1,
							taskName: '信息提报'
						})
					}
				})

			},
			getMyFinishList() { //我的已办
				let params = {
					query: {
						page: this.page,
						limit: this.limit,
					},
					body: {
						businessNo: this.searchKeyWord,
						processKey: 'changeManageFlow'
					}
				}
				uni.stopPullDownRefresh() //关闭下拉刷新
				this.$u.api.getMyFinishListApi(params).then(res => {
					if (res.msgCode === '000000' && res.data) {
						if (res.data.data && res.data.data.length > 0) {
							res.data.data.forEach(item => {
								this.$set(item, 'taskName', '')
								if (item.currTaskList) {
									item.taskName = !item.currTaskList.length ? '已完成' : item.currTaskList[
										0].taskName
								}
							})
							const temp = res.data.data
							this.tabList[this.tabCurrent].count = res.data.count
							this.dataList = [...this.tableList, ...temp]
							this.tableList = this.dataList
							this.page++
							if (!res.data.data.length || res.data.data.length < this.limit) this.loadStatus =
								"nomore"
							if (!this.tableList.length) {
								this.showNoData = true
							} else {
								this.showNoData = false
							}
						}

					} else {
						this.$refs.uTips.show({
							title: `数据获取失败，原因：${ res.message }`,
							type: 'error',
							duration: 2300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})

			},
			getProductList() { //我的待办
				let params = {
					query: {
						page: this.page,
						limit: this.limit,
					},
					body: {
						businessNo: this.searchKeyWord,
						processKey: 'changeManageFlow'
					}
				}
				uni.stopPullDownRefresh() //关闭下拉刷新

				uni.stopPullDownRefresh() //关闭下拉刷新
				this.$u.api.getMyAwaitListApi(params).then(res => {
					if (res.msgCode === '000000' && res.data) {
						const temp = res.data.data

						this.dataList = [...this.tableList, ...temp]
						this.tableList = this.dataList.filter(each => {
							return each.taskName === '作业指导1' || each.taskName === '作业指导2' || each
								.taskName === '产品标识'

						})
						// console.log('66666', this.tableList)
						this.tabList[this.tabCurrent].count = this.tableList.length
						this.page++
						if (!res.data.data.length || res.data.data.length < this.limit) this.loadStatus =
							"nomore"
						if (!this.tableList.length) {
							this.showNoData = true
						} else {
							this.showNoData = false
						}
					} else {
						this.$refs.uTips.show({
							title: `数据获取失败，原因：${ res.message }`,
							type: 'error',
							duration: 2300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			changeTab(index) {
				this.tabCurrent = index
				this.page = 1
				this.tableList = []
				this.showNoData = false
				this.loadStatus = 'loadmore'
				if (index) { // 0是我的待办，1是我的已办

					this.getMyFinishList() //已办
				} else {
					this.getProductList() //待办

				}

			},
			queryProduct() { //搜索
				if (!this.searchKeyWord) {
					this.$refs.uTips.show({
						title: '请输入4M编码',
						type: 'warning',
						duration: 2300
					})
					return
				}
				this.page = 1
				this.tableList = []
				this.showNoData = false
				this.loadStatus = 'loadmore'
				this.getProductList()
			},
			scanCode(type) { //扫码
				this.common.scanCode(this).then(res => {
					this.searchKeyWord = res
					this.showManufactoryOrder = false
					this.tableList = []
					this.getProductList(this.searchKeyWord)
				})
			},


		},
		onReachBottom() {
			let that = this
			if (that.loadStatus != 'nomore') { //如果状态无数据，则不再请求
				that.loadStatus = "loading"
				that.getProductList()
			}
		},
		onPullDownRefresh() {
			let that = this
			that.page = 1
			that.exceptionItemList = []
			that.loadStatus = 'loadmore'
			that.getProductList()
		},
	};
</script>

<style lang='scss' scoped>
	.productTracing {
		.material-search {
			position: fixed;
			z-index: 3;
			background-color: #ffffff;
		}

		.tab-wrap {
			width: 100%;
			height: 90rpx;
		}

		.scroll-wrap {
			min-height: 100%;
			padding-top: 194rpx; //64(u-search默认高度) + 20 + 20（搜索框上下内边距） + tab默认80
		}

		.card-head {
			height: 72rpx;
			color: #ffffff;
		}


		.tab-wrap {
			width: 100%;
			height: 90rpx;
		}

		.scroll-wrap {
			min-height: 100%;
			padding-top: 194rpx; //64(u-search默认高度) + 20 + 20（搜索框上下内边距） + tab默认80
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

		.slot-scancode-content {
			font-size: 28rpx;
			padding: 70rpx 30rpx 70rpx 30rpx;
			position: relative;
			display: flex;
			justify-content: space-between;

			.scan-check-icon {
				position: absolute;
				right: 60rpx;
				top: 80rpx;
			}

			::v-deep .u-content {
				padding-left: 0rpx;
			}

			::v-deep.u-close-wrap {
				position: relative;
				left: 20rpx
			}

		}

		.count-down {
			background-color: #fff;
			padding: 6rpx 16rpx;
			border-radius: 6rpx;
			box-shadow: 0 0 2rpx 2rpx #ebebeb;
		}

	}
</style>