<!-- dips → 设备维修 → 故障详情 -->
<template>
	<view class="sws-wh100 u-flex sws-flex-d-column">
		<u-swiper class="sws-w100" v-show="detail.files && !detail.imgErr" :list="swiperList" border-radius="0"
			mode="number" height="300" img-mode="scaleToFill" indicator-pos="bottomRight" @click="previewImage">
		</u-swiper>
		<view class="u-flex-1 sws-w100 sws-overflow-scroll-y sws-bg-ebebeb u-p-20">
			<u-card :border="false" margin="0" :head-style="{background: '#2979ff'}" :body-style="{padding: 0}"
				:show-foot="false" :full="true" border-radius="16">
				<view slot="head">
					<view class="card-head u-font-32 u-flex u-row-between">
						<view>{{ detail.deviceCategory }}</view>
						<view>
							<text>{{ detail.deviceCode }}</text>
						</view>
					</view>
				</view>
				<u-cell-group slot="body" :border="false">
					<u-cell-item hover-class="none" :arrow="false" title="拉线" :value="detail.lineName"></u-cell-item>
					<u-cell-item hover-class="none" :arrow="false" title="工序" :value="detail.areaName"></u-cell-item>
					<u-cell-item hover-class="none" :arrow="false" title="报修人" :value="detail.applicantName">
					</u-cell-item>
					<u-cell-item hover-class="none" :arrow="false" title="联系电话" :value="detail.telephone"></u-cell-item>
					<u-cell-item hover-class="none" :arrow="false" title="问题说明" :value="detail.question"
						:title-style="{'padding-right': '20rpx'}"></u-cell-item>
					<u-cell-item hover-class="none" :arrow="false" title="原因说明" :value="detail.reason"
						:title-style="{'padding-right': '20rpx'}"></u-cell-item>
					<u-cell-item hover-class="none" :arrow="false" :border-bottom="false" title="过程说明"
						:value="detail.process" :title-style="{'padding-right': '20rpx'}"></u-cell-item>
				</u-cell-group>
			</u-card>
		</view>
		<view class="sws-w100 u-p-28">
			<u-button type="primary" @click="toRepair">开始维修</u-button>
		</view>
		<u-top-tips ref="uTips"></u-top-tips>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				detail: {},
			}
		},
		computed: {
			swiperList() {
				if (this.detail.files) {
					return this.detail.files.map(image => {
						return {
							image
						}
					})
				}
			}
		},
		onLoad() {
			const eventChannel = this.getOpenerEventChannel()
			eventChannel.on('acceptDataFromOpenerPage', ({
				data
			}) => {
				this.detail = {
					...data
				}
			})
		},
		methods: {
			async toRepair() { //只有待分配和维修中状态可以维修
				const state = this.detail.state
				let params = {}
				if (state === 'DRAFT') { //待分配工单
					params = await this.getRepairInfoByDRAFT()
					if (params) this.detail.state = params.state //更新维修工单状态
				} else if (state === 'ACCEPT') { //维修中工单
					params = await this.getRepairInfoByACCEPT()
				}

				if (params && Object.keys(params).length) {
					uni.navigateTo({
						url: '/pages/microApp/Dips/deviceRepair/repairDevice/index',
						success: res => {
							res.eventChannel.emit('acceptDataFromOpenerPage', {
								params
							})
						},
						events: {
							toTellFirstPage: ({status}) => {
								const eventChannel = this.getOpenerEventChannel()
								eventChannel.emit('repairCompleted', {
									status
								})
							}
						}
					})
				}
			},
			getRepairInfoByDRAFT() {
				return this.$u.api.getRepairInfoByDRAFT(this.detail.id).then(res => {
					if (res.msgCode === '000000') {
						return res.data
					} else {
						this.$refs.uTips.show({
							title: `不能进行维修，原因：${ res.message }`,
							type: 'error',
							duration: 2300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			getRepairInfoByACCEPT() {
				return this.$u.api.getRepairInfoByACCEPT(this.detail.id).then(res => {
					if (res.msgCode === '000000') {
						return res.data
					} else {
						this.$refs.uTips.show({
							title: `不能进行维修，原因：${ res.message }`,
							type: 'error',
							duration: 2300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			previewImage(index) {
				if (!this.detail.files) return
				uni.previewImage({
					urls: this.detail.files,
					current: index
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.detail-content {
		background-color: #ffffff;
		border-radius: 16rpx;
	}

	.card-head {
		color: #FFFFFF;
	}

	::v-deep .u-cell {
		padding: 16rpx 32rpx;
	}
</style>
