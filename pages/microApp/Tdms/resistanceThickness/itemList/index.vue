<template>
	<view class="sws-wh100 sws-overflow-scroll-y u-p-20 sws-bg-ebebeb">
		<uni-swipe-action v-show="!showNoData" ref="swipeAction">
			<uni-swipe-action-item :right-options="options" v-for="(item, index) in list" :key="index"
				@click="deal($event, item, index)">
				<view class="card-wrap u-flex">
					<view class="card-left u-flex sws-flex-d-column">
						<view class="sws-w100 u-p-t-4 u-font-24">测试阶段：</view>
						<view class="sws-w100 u-p-t-6 u-text-right sws-font-bold">阶段{{ item.stageNumber }}</view>
						<view class="sws-w100 u-p-t-6 u-font-24">圈数：</view>
						<view class="sws-w100 u-p-t-4 u-text-right sws-font-bold">{{ item.testStage }}</view>
					</view>
					<view class="card-right u-flex-1 u-flex sws-flex-d-column">
						<view v-if="type== 'VOLTAGE_RESISTANCE'" class="sws-w100 card-right-info u-flex-1">
							<view class="info-item">
								<view class="u-tips-color u-font-24">电压：</view>
								<view class="u-main-color">{{ item.voltage }}
								</view>
							</view>
							<view class="info-item">
								<view class="u-tips-color u-font-24">电阻：</view>
								<view class="u-main-color">{{ item.resistance }}
								</view>
							</view>
							<view class="info-item">
								<view class="u-tips-color u-font-24">厚度1：</view>
								<view class="u-main-color">{{ item.thicknessOne }}</view>
							</view>
							<view class="info-item">
								<view class="u-tips-color u-font-24">膨胀力：</view>
								<view class="u-main-color">{{ item.expansionForceDown }}</view>
							</view>
							<view v-if="item.thicknessTwo" class="info-item">
								<view class="u-tips-color u-font-24">厚度2：</view>
								<view class="u-main-color">{{ item.thicknessTwo }}</view>
							</view>
							<view v-if="item.thicknessThree" class="info-item">
								<view class="u-tips-color u-font-24">厚度3：</view>
								<view class="u-main-color">{{ item.thicknessThree }}</view>
							</view>
							<view v-if="item.thicknessFour" class="info-item">
								<view class="u-tips-color u-font-24">厚度4：</view>
								<view class="u-main-color">{{ item.thicknessFour }}</view>
							</view>
							<view v-if="item.thicknessA" class="info-item">
								<view class="u-tips-color u-font-24">厚度A：</view>
								<view class="u-main-color">{{ item.thicknessA }}</view>
							</view>
							<view v-if="item.thicknessB" class="info-item">
								<view class="u-tips-color u-font-24">厚度B：</view>
								<view class="u-main-color">{{ item.thicknessB }}</view>
							</view>
						</view>
						<view v-else class="sws-w100 card-right-info u-flex-1">
							<view class="info-item">
								<view class="u-tips-color u-font-24">负极：</view>
								<view class="u-main-color">{{ item.contactResistanceAthode }}</view>
							</view>
							<view class="info-item">
								<view class="u-tips-color u-font-24">正极：</view>
								<view class="u-main-color">{{ item.contactResistancePositive }}</view>
							</view>
							<view class="info-item">
								<view class="u-tips-color u-font-24">合计：</view>
								<view class="u-main-color">{{ item.contactResistanceTotal }}</view>
							</view>
							<view class="info-item">
								<view class="u-tips-color u-font-24">膨胀力：</view>
								<view class="u-main-color">{{ item.expansionForceUp }}</view>
							</view>
						</view>
						<view class="card-right-bottom sws-w100 u-text-right">
							<text>录入时间:</text>
							<text class="u-m-l-8">{{item.recordTime}}</text>
						</view>
					</view>
				</view>
			</uni-swipe-action-item>
		</uni-swipe-action>
		<u-modal v-model="showModal" :content="modalContent" @confirm="modalConfirm">
		</u-modal>
		<no-data v-show="showNoData"></no-data>
		<u-top-tips ref="uTips"></u-top-tips>
	</view>
</template>

<script>
	import noData from '../../../../components/noData/index.vue'

	export default {
		components: {
			noData
		},
		data() {
			return {
				list: [],
				options: [{
					text: '删除',
					style: {
						backgroundColor: '#dd524d'
					}
				}, {
					text: '编辑',
					style: {
						backgroundColor: '#2979ff'
					}
				}],
				modalContent: '',
				showModal: false,
				showNoData: false
			}
		},
		onLoad() {
			const self = this
			const eventChannel = this.getOpenerEventChannel()
			eventChannel.on('acceptDataFromDetailList', data => {
				uni.setNavigationBarTitle({
					title: data.title + '明细列表'
				})
				self.type = data.type
				self.title = data.title
				self.list = [...data.list]
			})
		},
		methods: {
			modalConfirm() {
				this.showNoData = true
			},
			delItem() {
				const params = {
					id: this.currItem.id,
					query: {
						recordType: this.type
					}
				}
				this.$u.api.deleteRecordDataForTDMS(params).then(res => {
					if (res.msgCode === '000000') {
						this.modalContent = '删除成功！'
						this.showModal = true
						this.list.splice(this.currIndex, 1)
					} else {
						this.$refs.uTips.show({
							title: `删除失败，原因：${ res.message }`,
							type: 'error',
							duration: 2300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			toEdit() {
				const self = this
				uni.navigateTo({
					url: '/pages/microApp/Tdms/resistanceThickness/addNewItem/index',
					events: {
						acceptDataFromItemList: function(data) {
							self.list.splice(this.currIndex, 1, data)
						}
					},
					success: res => {
						res.eventChannel.emit('acceptDataFromOpenerPage', {
							type: self.type,
							title: self.title,
							isEdit: true,
							...self.currItem
						})
					}
				})
			},
			deal(event, item, index) { //滑动操作
				this.currItem = item
				this.currIndex = index
				if (event.index) { //编辑
					this.toEdit()
				} else { //删除
					this.delItem()
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	.card-wrap {
		box-shadow: 0 0 2rpx 2rpx #ebebeb;
		border: 2rpx solid #ebebeb;
		align-items: initial;
	}

	.card-left {
		background-color: #2979ff;
		color: #ffffff;
		padding: 10rpx 20rpx;
		justify-content: center;
	}

	.card-right {
		padding: 8rpx 16rpx;

		&-info {
			display: flex;
			flex-wrap: wrap;
		}

		&-bottom {
			padding: 6rpx 20rpx;
			font-size: 24rpx;
			background-color: #ecf5ff;
			border-radius: 6rpx;
		}
	}

	.info-item {
		width: 50%;
		padding: 4rpx 18rpx 4rpx 4px;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	::v-deep .uni-swipe {
		background-color: #fff;
		border-radius: 12rpx;
		overflow: hidden;
		margin-bottom: 10rpx;
	}
</style>
