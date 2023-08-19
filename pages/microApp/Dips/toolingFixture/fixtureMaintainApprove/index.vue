<!-- dips → 工治具 → 保养确认 -->
<template>
	<view class="sws-wh100">
		<view v-show="!showNoData" class="scroll-wrap sws-bg-ebebeb">
			<view class="u-p-20">
				<u-card margin="0 0 20rpx 0" :border="false"
					:head-style="{background: '#2979ff',padding: '20rpx 30rpx'}" :body-style="{padding: 0}"
					:foot-style="{padding: '16rpx 30rpx'}" :show-foot="true" :full="true"
					v-for="(fixture, index) in list" :key="index">
					<view slot="head" class="card-head u-font-32 u-flex u-row-between">
						<view class="u-flex">
							<view>{{ fixture.fixtureName }}</view>
							<view class="u-font-24">({{ fixture.fixtureCode }})</view>
						</view>
					</view>
					<u-cell-group slot="body" :border="false">
						<u-cell-item class="u-p-t-10 u-p-b-10" hover-class="none" :arrow="false" title="保养人"
							:value="fixture.maintainer">
						</u-cell-item>
						<u-cell-item class="u-p-t-10 u-p-b-10" hover-class="none" :arrow="false" title="保养时间"
							:border-bottom="false" :value="fixture.startDate">
						</u-cell-item>
					</u-cell-group>
					<view slot="foot" class="u-text-right">
						<u-button class="btn-style" size="medium" type="success" @click="goToApprove(fixture, index)">
							保养确认
						</u-button>
					</view>
				</u-card>
				<u-loadmore :status="loadStatus" bgColor="#ebebeb"></u-loadmore>
			</view>
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
		onLoad() {
			this.getApproveList()
		},
		methods: {
			goToApprove(fixture, index) {
				const _self = this
				const params = {
					id: fixture.id
				}
				uni.navigateTo({
					url: `/pages/microApp/Dips/toolingFixture/fixtureMaintainApprove/approveConfirm/index${ this.$u.queryParams(params) }`,
					events: {
						acceptDataFromOpenedPage() {
							_self.list.splice(index, 1)
						}
					}
				})
			},
			getApproveList() {
				const params = {
					query: {
						page: this.page,
						limit: this.limit
					},
					body: {
						fixtureCode: ''
					}
				}

				this.$u.api.getFixtureMaintainApproveList(params).then(res => {
					if (res.msgCode === '000000') {
						this.dataList = [...this.list, ...res.data.data]
						this.list = this.dataList
						this.page++

						if (!res.data.data.length || res.data.data.length < this.limit) this.loadStatus = 'nomore'
						if (!this.list.length) this.showNoData = true
					} else {
						this.$refs.uTips.show({
							title: `工治具保养确认列表获取失败，原因：${ res.message }`,
							type: 'error',
							duration: 2300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			}
		},
		onReachBottom() {
			if (this.loadStatus != 'nomore') { //如果状态无无数据，则不再请求
				this.loadStatus = "loading"
				this.getApproveList()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.scroll-wrap {
		min-height: 100%;
	}

	.card-head {
		color: #ffffff;
	}

	.btn-style {
		width: 180rpx;
		height: 60rpx;
		line-height: 60rpx;
		padding: 0 16rpx;
	}
</style>
