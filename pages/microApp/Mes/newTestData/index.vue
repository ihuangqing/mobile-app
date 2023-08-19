<template>
	<view class="newTestData sws-wh100">
		<view class="material-search sws-w100 u-p-20 u-flex">
			<u-search class="search-input" placeholder="请输入/扫描产品条码" shape="square" v-model="searchKeyword"
				search-icon="" @search="queryProduct" @custom="queryProduct">
			</u-search>
			<view class="abs-scan" @click="scanCode">
				<u-icon name="saoma" custom-prefix="sws-icon" size="45" color="#2979ff"></u-icon>
			</view>
		</view>
		<view class="scroll-wrap ">
			<view v-show="!showNoData" u-p-b-10>
				<view class="list-item" v-for="(item, index) in testDataList" :key="index">
					<view class="list-item-header u-flex">
						<view class="u-flex-1">{{ item.groupName }} ({{ item.productSn}})</view>
					</view>
					<view class="u-p-l-30 u-p-t-10 u-p-r-30 u-p-b-16">
						<view class="test-data-content-list">
							<view class="test-data-content-list-item ">测试项:</view>
							<view>{{ item.testItem }}</view>
						</view>
						<view class="test-data-content-list">
							<view class="test-data-content-list-item ">测试值:</view>
							<view>{{ item.testValue }}</view>
						</view>
						<view class="test-data-content-list">
							<view class="test-data-content-list-item ">测试上限:</view>
							<view>{{ item.starderUpper }}</view>
						</view>
						<view class="test-data-content-list">
							<view class="test-data-content-list-item ">测试下限:</view>
							<view>{{ item.starderLower }}</view>
						</view>
						<view class="test-data-content-list">
							<view class="test-data-content-list-item ">测试结果:</view>
							<view>{{ item.testResult }}</view>
						</view>
						<view class="test-data-content-list">
							<view class="test-data-content-list-item ">测试时间:</view>
							<view>{{ item.testTime }}</view>
						</view>
					</view>
				</view>
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
				searchKeyword: '',
				searchVal: '',
				showNoData: false,
				loadStatus: 'loadmore',
				testDataList: [],
			};
		},
		onLoad() {
			this.showNoData = true
		},
		methods: {
			queryProduct() { //搜索
				if (!this.searchKeyword) {
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
				this.testDataList = []
				this.common.scanCode(this).then(res => {
					this.searchKeyword = res
					this.getProductList(this.searchKeyword)
				})
			},
			getProductList() {
				this.testDataList = []
				const params = {
					productSn: this.searchKeyword
				}
				this.$u.api.findSnTestItemApi(params).then(res => {
					if (res.msgCode === '000000') {
						if (res.data.length) {
							this.showNoData = false
							const temp = res.data
							this.testDataList = [...temp]
						} else {
							this.$refs.uTips.show({
								title: '未查询到数据',
								type: 'warning',
								duration: 2300
							})
							this.showNoData = true
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
	.newTestData {
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
			padding: 80rpx 20rpx 0 20rpx;

			.list-item-header {
				color: #ffffff;
				/* diaplay: flex;
				justify-con */
				tent: space-between;
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

		.test-data-content-list {
			padding: 10rpx 0rpx;
			display: flex;
			/* justify-content: space-between; */
			justify-content: flex-start;
			gap: 20rpx;
		}

		.test-data-content-list-item {
			width: 180rpx;
		}

	}
</style>
