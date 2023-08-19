<!-- DIPS → 设备维修 → 维修记录 -->
<template>
	<view class="sws-wh100">
		<view v-show="!showNoData">
			<u-collapse hover-class="none" :arrow="false">
				<view v-for="(item, index) in list" :key="index">
					<u-collapse-item>
						<view slot="title-all" class="sws-w100 u-flex u-p-l-20 u-p-r-20">
							<view class="u-flex sws-flex-d-column u-col-top u-row-center u-m-r-20"
								@click.stop="previewImage(item)">
								<u-image class="u-image" width="200" height="200" border-radius="16"
									v-if="item.files && item.files.length" :src="item.files[0]"
									@error="item.imgErr = true">
									<view slot="error" class="u-flex sws-flex-d-column">
										<u-icon name="info-circle" size="44"></u-icon>
										<view class="u-font-24 u-m-t-10">加载失败</view>
									</view>
								</u-image>
								<u-icon v-else name="zhanweitu" custom-prefix="sws-icon" size="200" color="#ebebeb">
								</u-icon>
							</view>
							<view class="u-flex-1 u-flex sws-flex-d-column u-col-top u-row-center u-font-28">
								<view class="sws-w100 u-flex lh-item">
									<view class="u-type-info">维修状态：</view>
									<view class="u-flex-1 u-text-right">{{ handleState(item.state) }}</view>
								</view>
								<view v-show="item.deviceCategory" class="sws-w100 u-flex lh-item">
									<view class="u-type-info">设备类型：</view>
									<view class="u-flex-1 u-text-right">{{ item.deviceCategory }}</view>
								</view>
								<view v-show="item.deviceCode" class="sws-w100 u-flex lh-item">
									<view class="u-type-info">设备编号：</view>
									<view class="u-flex-1 u-text-right">{{ item.deviceCode }}</view>
								</view>
								<view v-show="item.callDate" class="sws-w100 u-flex lh-item">
									<view class="u-type-info">报修时间：</view>
									<view class="u-flex-1 u-text-right">{{ item.callDate }}</view>
								</view>
								<view v-show="item.repairerName" class="sws-w100 u-flex lh-item">
									<view class="u-type-info">维修人：</view>
									<view class="u-flex-1 u-text-right">{{ item.repairerName }}</view>
								</view>
								<view v-show="item.finishDate" class="sws-w100 u-flex lh-item">
									<view class="u-type-info">完成时间：</view>
									<view class="u-flex-1 u-text-right">{{ item.finishDate }}</view>
								</view>
							</view>
						</view>
						<view class="u-p-l-20 u-p-r-20 u-p-b-20">
							<view class="u-flex u-col-top">
								<view>问题说明：</view>
								<view class="u-main-color u-flex-1">{{ item.question }}</view>
							</view>
							<view class="u-flex u-col-top">
								<view>问题原因：</view>
								<view class="u-main-color u-flex-1">{{ item.reason }}</view>
							</view>
							<view class="u-flex u-col-top">
								<view>过程说明：</view>
								<view class="u-main-color u-flex-1">{{ item.process }}</view>
							</view>
							<view v-show="item.rejectReason" class="u-flex u-col-top">
								<view>未完成原因：</view>
								<view class="u-main-color u-flex-1">{{ item.rejectReason }}</view>
							</view>
							<view class="u-flex u-col-top">
								<view>意见与建议：</view>
								<view class="u-main-color u-flex-1">{{ item.suggest }}</view>
							</view>
							<view class="u-flex u-col-top">
								<view class="text-index">
									评价：
								</view>
								<view class="u-flex-1">
									<view v-show="item.techEvaluation">
										<text class="u-main-color">维修技术：</text>
										<u-rate :count="5" v-model="item.techEvaluation" :disabled="true"
											active-color="#2979ff"></u-rate>
									</view>
									<view v-show="item.serviceEvaluation">
										<text class="u-main-color">服务态度：</text>
										<u-rate :count="5" v-model="item.serviceEvaluation" :disabled="true"
											active-color="#2979ff"></u-rate>
									</view>
									<view v-show="item.responEvaluation">
										<text class="u-main-color">响应速度：</text>
										<u-rate :count="5" v-model="item.responEvaluation" :disabled="true"
											active-color="#2979ff"></u-rate>
									</view>
								</view>
							</view>
						</view>
					</u-collapse-item>
					<u-gap height="20" bg-color="#ebebeb"></u-gap>
				</view>
			</u-collapse>
			<u-loadmore :status="loadStatus" bgColor="#FFFFFF"></u-loadmore>
		</view>
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
				page: 1,
				limit: 10,
				list: [],
				loadStatus: 'loadmore',
				showNoData: false
			}
		},
		computed: {
			handleState(state = '') {
				return state => {
					if (state === 'DRAFT') {
						return '待分配'
					} else if (state === 'REJECT') {
						return '已拒单'
					} else if (state === 'ASSIGN') {
						return '已分配待确认'
					} else if (state === 'ACCEPT') {
						return '维修中'
					} else if (state === 'COMPLETED') {
						return '维修完成'
					} else if (state === 'CLOSED') {
						return '已完成'
					}
				}
			}
		},
		onLoad(options) {
			this.deviceCode = options.deviceCode

			this.getRepairRecordsList()
		},
		methods: {
			getRepairRecordsList() { //调用获取维修列表接口，指定参数为deviceCode
				const params = {
					query: {
						page: this.page,
						limit: this.limit
					},
					body: {
						deviceCode: this.deviceCode
					}
				}

				this.$u.api.getRepairListForDips(params).then(res => {
					if (res.msgCode === '000000') {
						this.list = [...this.list, ...res.data.data]
						this.page++

						if (!res.data.data.length || res.data.data.length < this.limit) this.loadStatus = 'nomore'

						if (!this.list.length) this.showNoData = true
					} else {
						this.$refs.uTips.show({
							title: `历史维修记录获取失败，原因：${ res.message }`,
							type: 'error',
							duration: 2300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			previewImage(item) {
				if (item.imgErr) return
				uni.previewImage({
					urls: item.files
				})
			}
		},
		onReachBottom() {
			if (this.loadStatus != 'nomore') { //如果状态无无数据，则不再请求
				this.loadStatus = "loading"
				this.getRepairRecordsList()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.lh-item {
		line-height: 48rpx;
	}

	.text-index {
		text-indent: 56rpx;
	}
</style>
