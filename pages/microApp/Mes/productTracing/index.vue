<template>
	<view class="productTracing sws-wh100">
		<view class="material-search sws-w100 u-p-20 u-flex">
			<u-search class="search-input" placeholder="请输入/扫描产品条码" shape="square" v-model="searchKeyWord"
				search-icon="" @search="queryProduct" @custom="queryProduct">
			</u-search>
			<view class="abs-scan" @click="scanCode('modelCode')">
				<u-icon name="saoma" custom-prefix="sws-icon" size="45" color="#2979ff"></u-icon>
			</view>
		</view>
		<view class="scroll-wrap ">
			<view v-show="showManufactoryOrder">
				<!--制令单信息  -->
				<view class="list-item">
					<view class="list-item-header u-flex">
						<view>制令单信息</view>
					</view>
					<view class="u-p-l-30 u-p-t-10 u-p-r-30 u-p-b-16">
						<view class="u-flex u-font-26 u-content-color u-m-t-8">
							<view class="u-flex-1">料号：{{ prod.itemCode||''}}
							</view>
							<view class="u-flex-1">状态：{{ prod.errorFlag||'' }}</view>
						</view>
						<view class="u-flex u-font-26 u-content-color u-m-t-8">
							<view class="u-flex-1">线体：{{ prod.areaName||'' }}</view>
							<view class="u-flex-1">当前工序：{{ prod.groupName||''}}</view>
						</view>
					</view>
				</view>
				<!-- 过站信息 -->
				<view class="list-item" v-for="(item, index) in tableList" :key="index">
					<view class="list-item-header pass-staion-head">
						<view>过站信息</view>
						<!-- <viewss>序号：{{ item.id+1 }}</view> -->
					</view>
					<view class="u-p-l-30 u-p-t-10 u-p-r-30 u-p-b-16">
						<!-- <view class="u-flex-1">序号：{{ item.id+1 }}</view> -->
						<view class=" pass-staion-content u-font-26 u-content-color u-m-t-8">
							<view class="u-flex-2">当前工序：{{ item.groupName||''}}
							</view>
							<view class="u-flex-1">过站状态：{{ item.errorFlag }}</view>
						</view>
						<view class="u-flex u-font-26 u-content-color u-m-t-8">
							<view class="u-flex-2">过站时间：{{ item.outStationTime }}</view>
							<view class="u-flex-1">处理人：{{ item.empName }}</view>
						</view>
					</view>
				</view>
				<u-loadmore :status="loadStatus" bgColor="#ffffff"></u-loadmore>
			</view>
			<no-data v-show="showNoData"></no-data>
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
		onLoad() {
			this.showNoData = true
		},
		methods: {
			queryProduct() { //搜索
				if (!this.searchKeyWord) {
					this.$refs.uTips.show({
						title: '请输入产品条码',
						type: 'warning',
						duration: 2300
					})
					return
				}
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
			getProductList() {
				const params = {
					productSn: this.searchKeyWord
				}
				this.$u.api.findSnDetailApi(params).then(res => {
					this.showManufactoryOrder = false
					this.tableList = []
					if (res.msgCode === '000000' && res.data) {
						if (res.data.mesSnDetailList.length) {
							this.showNoData = false
							const temp = res.data.mesSnDetailList
							this.tableList = temp
						}
						if (res.data.mesSnTracking) {
							this.showManufactoryOrder = true
							this.prod = res.data.mesSnTracking
						}
						if (!res.data.mesSnTracking && !res.data.mesSnDetailList.length) {
							this.showNoData = true
							this.$refs.uTips.show({
								title: '暂无查到数据',
								type: 'warning',
								duration: 2300
							})
						}

					} else {
						this.$refs.uTips.show({
							title: `查询失败，原因：${ res.message }`,
							type: 'error',
							duration: 2300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},

		}
	};
</script>

<style lang='scss' scoped>
	.productTracing {
		.material-search {
			position: fixed;
			z-index: 3;
			background-color: #ffffff;
		}

		::v-deep .search-input .u-content {
			padding-right: 60rpx;
		}

		.abs-scan {
			position: absolute;
			right: 122rpx;
			margin-top: 3rpx;
		}

		.scroll-wrap {
			width: 100%;
			height: 100%;
			padding: 80rpx 24rpx 0 24rpx;

			.list-item-header {
				color: #ffffff;
			}

			.pass-staion-head {
				display: flex;
				justify-content: space-between;
			}

			.pass-staion-content {
				display: flex;
				justify-content: space-between;
			}

			.list-item {
				border: 2rpx solid #e8e8e8;
				box-shadow: 0 0 4rpx #e8e8e8;
				border-radius: 16rpx;
				overflow: hidden;
				margin-top: 30rpx;

				&-header {
					padding: 8rpx 20rpx;
					// background: linear-gradient(to left, #2979ff, #65c7f7, #9cecfb);
					background: linear-gradient(to right, #0083fe, #00fff0);
				}
			}

			::deep.u-image__image {
				margin-top: 400rpx;
			}

		}

	}
</style>
