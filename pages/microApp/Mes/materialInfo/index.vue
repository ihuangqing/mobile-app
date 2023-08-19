<!-- E-Checklist → 点检历史 -->
<template>
	<view class="page-wrap  sws-w100 ">
		<view class="plan-search  sws-w100 u-flex">
			<u-search placeholder="请输入产品条码" :animation="true" shape="square" v-model="queryParams.productSn "
				@custom="querygetProcessMaterials">
			</u-search>
			<view class="u-flex u-row-center u-m-l-20 u-p-r-20" @click="goSearchMore">
				<u-icon name="more-dot-fill" color="#303133" size="30"></u-icon>
			</view>
		</view>
		<view class="scroll-wrap ">
			<view v-show="!showNoData">
				<view class="list-item" v-for="(item, index) in dataList" :key="index">
					<view class="list-item-header u-flex">
						<view class="u-flex-1">主条码（{{ item.pkProductSn}})</view>
					</view>
					<view class="u-p-l-30 u-p-t-10 u-p-r-30 u-p-b-16">
						<view class="material-content-list">
							<view class="material-content-list-item ">主料号:</view>
							<view>{{ item.pkKeypSn }}</view>
						</view>
						<view class="material-content-list">
							<view class="material-content-list-item ">物料名称:</view>
							<view>{{ item.pkGroupName }}</view>
						</view>

						<view class="material-content-list">
							<view class="material-content-list-item ">工序名称:</view>
							<view>{{ item.itemName }}</view>
						</view>
						<view class="material-content-list">
							<view class="material-content-list-item ">物料条码:</view>
							<view>{{ item.modelCode }}</view>
						</view>
						<view class="material-content-list">
							<view class="material-content-list-item ">物料上料时间:</view>
							<view>{{ item.pkLoadtime }}</view>
						</view>
					</view>
				</view>
				<!-- <u-loadmore :status="loadStatus" bgColor="#ffffff"></u-loadmore> -->
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
				productSn: '',
				loadStatus: 'loadmore',
				dataList: [],
				showNoData: false,
				queryParams: {
					productSn: '',
					isBinding: 'N',
					isModule: 'N'
				}
			}
		},
		computed: {},
		onLoad() {
			this.showNoData = true
		},
		methods: {
			querygetProcessMaterials() { //工序物料信息查询
				if (!this.queryParams.productSn) {
					this.$refs.uTips.show({
						title: '请输入产品条码',
						type: 'warning',
						duration: 2300
					})
					return
				}
				let params = this.queryParams
				this.getProcessMaterials(params)
			},
			getProcessMaterials(params) { //获取工序物料查询方法
				this.dataList = []
				// // todo
				this.$u.api.findItemBySnAndGroupApi(params).then(res => {
					if (res.msgCode === '000000') {
						if (res.data) {
							this.showNoData = false
							this.dataList = res.data
						}
						if (!res.data.length) {
							this.showNoData = true
							this.$refs.uTips.show({
								title: '暂无数据',
								type: 'warning',
								duration: 2300
							})
						}

					} else {
						this.$refs.uTips.show({
							title: `工序物料获取失败，原因：${res.message}`,
							type: 'error',
							duration: 2300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			goSearchMore() { //跳转至更多查询页面
				let _self = this
				uni.navigateTo({
					url: `/pages/microApp/Mes/materialInfo/materialInfoSearch/index`,
					events: {
						acceptDataFromOpenedPage: function(res) { // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
							this.queryParams = res.params
							_self.getProcessMaterials(this.queryParams)
						}
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page-wrap {
		width: 100%;
		height: 100%;
		// overflow: hidden;
		flex-direction: column;

		.plan-search {
			width: 100%;
			padding: 20rpx 20rpx 0rpx 20rpx;
			position: fixed;
			z-index: 3;
			background-color: #ffffff;
		}

		.scroll-wrap {
			width: 100%;
			height: 100%;
			padding: 80rpx 20rpx 0rpx 20rpx;
			// overflow: hidden;

			.list-item-header {
				color: #ffffff;
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

		}

		.material-content-list {
			padding: 10rpx 0rpx;
			display: flex;
			justify-content: flex-start;
			gap: 20rpx;
		}

		.material-content-list-item {
			width: 180rpx;
		}
	}
</style>
