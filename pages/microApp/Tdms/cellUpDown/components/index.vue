<template>
	<view class="sws-wh100 sws-bg-ebebeb sws-overflow-scroll-y">
		<view class="cell-card" v-for="(item, index) in dataList" :key="index">
			<view class="cell-header u-flex u-row-between">
				<view class="u-flex">
					<view :class="cellType ? 'oa-icon oa-more': 'oa-icon'">OA单号</view>
					<view class="u-font-30">{{ item.fdApplyNo }}</view>
				</view>
				<view :class="computedUrgent(item.fdUrgent).className">{{ computedUrgent(item.fdUrgent).urgent }}</view>
			</view>
			<view class="cell-body">
				<view class="cell-body-content u-flex">
					<view class="cell-body-content-left">
						<view class="u-line-1" @click="toShowItemName(item.itemName)">
							<text class="u-font-24 u-tips-color">测试项目：</text>
							<text class="u-font-26 u-m-t-2">{{ item.itemName }}</text>
						</view>
						<view>
							<text class="u-font-24 u-tips-color">项目编号：</text>
							<text class="u-font-26 u-m-t-2">{{ item.btProjectNumber }}</text>
						</view>
					</view>
					<view>
						<view>
							<text class="u-font-24 u-tips-color">测试类别：</text>
							<text class="u-font-26 u-m-t-2">{{ item.itemTypeName }}</text>
						</view>
						<view>
							<text class="u-font-24 u-tips-color">预计周期：</text>
							<text class="u-font-26 u-m-t-2">{{ item.expectedCycle }}天</text>
						</view>
					</view>
				</view>
				<view class="cell-body-table sws-bg-ebebeb u-flex">
					<view class="u-flex-1 u-text-center">
						<view class="u-font-24 u-tips-color">{{ cellType ? '未下架' :'未上架' }}</view>
						<view class="u-font-32 u-m-t-6">{{ cellType ? item.onTheCabinetCount : item.unOnTheCabinetCount }}</view>
					</view>
					<u-line color="#c0c4cc" length="80rpx" direction="col" margin="10rpx" :hair-line="false"></u-line>
					<view class="u-flex-1 u-text-center">
						<view class="u-font-24 u-tips-color">{{ cellType ? '已下架' :'已上架' }}</view>
						<view class="u-font-32 u-m-t-6">{{ cellType ? item.alreadyTakeDownCount : item.onTheCabinetCount }}</view>
					</view>
					<u-line color="#c0c4cc" length="80rpx" direction="col" margin="10rpx" :hair-line="false"></u-line>
					<view class="u-flex-1 u-text-center">
						<view class="u-font-24 u-tips-color">{{ cellType ? '已暂停' :'待接续' }}</view>
						<view class="u-font-32 u-m-t-6">{{ item.stopCount }}</view>
					</view>
				</view>
			</view>
			<view class="cell-footer u-flex u-row-right">
				<view class="u-flex-1 u-line-1" @click="toShowprojectLeaders(item.projectLeaders)">
					<text class="u-font-24 u-tips-color">负责人：</text>
					<text
						class="u-font-28">{{ item.projectLeaders ? item.projectLeaders.map(user => user.userName).join('、') : '' }}</text>
				</view>
				<u-button
					v-show="cellType ? !(item.onTheCabinetCount === 0 && item.stopCount === 0 && item.connectionCount === 0) : item.unOnTheCabinetCount !== 0"
					type="primary" size="mini" :class="cellType ? 'cell-footer-btn btn-more' : 'cell-footer-btn'"
					@click="toUD(item)">{{ cellType ? '下架' :'上架' }}</u-button>
				<u-button
					v-show="(item.fdApplyNo.startsWith('C')) && (cellType ? item.alreadyTakeDownCount != 0 : item.stopCount !== 0)"
					type="success" size="mini" :class="cellType ? 'cell-footer-btn btn2-more' : 'cell-footer-btn'"
					@click="toCP(item)">{{ cellType  ? '暂停' :'接续' }}</u-button>
				<!-- 只有电芯才有暂停和接续 -->
			</view>
		</view>
		<u-modal v-model="showModal" :content="modalContent"></u-modal>
	</view>
</template>

<script>
	export default {
		props: ['cellType', 'dataList'],
		data() {
			return {
				showModal: false,
				modalContent: ''
			}
		},
		computed: {
			computedUrgent(urgent) {
				return urgent => {
					if (urgent.includes('正常')) {
						return {
							className: 'u-type-success u-m-r-10',
							urgent: '正常'
						}
					} else if (urgent.includes('紧急')) {
						return {
							className: 'u-type-error u-m-r-10',
							urgent
						}
					} else {
						return {
							className: 'u-type-warning u-m-r-10',
							urgent
						}
					}
				}
			}
		},
		methods: {
			toDetailPage(data) {
				const _self = this
				uni.navigateTo({
					url: '/pages/microApp/Tdms/cellUpDown/upDownDetail/index',
					events: {
						acceptDataFromOpenedPage: function(data) {
							_self.$emit('refreshData')
						}
					},
					success: function(res) {
						res.eventChannel.emit('acceptDataFromOpenerPage', {
							data
						})
					}
				})
			},
			toUD(item) { // up 0  down 1  上下架
				this.toDetailPage({
					...item,
					doType: this.cellType,
					doTypeName: this.cellType ? '下架' : '上架'
				})
			},
			toCP(item) { // continue pause 接续2 暂停3
				this.toDetailPage({
					...item,
					doType: this.cellType ? 3 : 2,
					doTypeName: this.cellType ? '暂停' : '接续'
				})
			},
			toShowItemName(itemName) {
				this.modalContent = `测试项目：${ itemName }`
				this.showModal = true
			},
			toShowprojectLeaders(projectLeaders) {
				if (projectLeaders && projectLeaders.length > 1) {
					this.modalContent = `负责人：${ projectLeaders.map(user => user.userName).join('、') }`
					this.showModal = true
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.cell-card {
		width: 100%;
		margin-top: 20rpx;
		background-color: #fff;
		border-radius: 6rpx;
		padding: 0 20rpx;

		.cell-header {
			font-weight: bold;
			padding: 16rpx 0 8rpx 0;
			border-bottom: solid 2rpx #2979ff;

			.oa-icon {
				background-color: #a4abd6;
				color: #fff;
				font-weight: normal;
				font-size: 24rpx;
				padding: 6rpx 10rpx;
				border-radius: 6rpx;
				margin-right: 8rpx;
			}

			.oa-more {
				background-color: #4e3661;
			}
		}

		.cell-body {
			&-content {
				padding: 16rpx 10rpx;

				&-left {
					width: 65%;
					margin-right: 20rpx;
				}
			}

			&-table {
				border-radius: 12rpx;
				margin: 0 30rpx;
			}
		}

		.cell-footer {
			padding: 20rpx 10rpx;

			&-btn {
				width: 140rpx;
				height: 60rpx;
				letter-spacing: 16rpx;
				text-indent: 16rpx;
				margin-left: 20rpx;
				font-size: 26rpx;
			}

			.btn-more {
				background-color: #065279;
				border-color: #065279;
			}

			.btn2-more {
				background-color: #81d8d0;
				border-color: #81d8d0;
			}
		}
	}

	.cell-card:first-child {
		margin-top: 0;
	}
</style>