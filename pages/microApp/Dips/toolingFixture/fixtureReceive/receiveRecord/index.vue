<!-- DIPS → 工治具管理 → 归还 → 归还记录 -->
<template>
	<view class="sws-wh100">
		<view v-show="!showNoData" class="scroll-wrap u-p-20 sws-bg-ebebeb">
			<u-card margin="0 0 20rpx 0" :border="false" :head-style="{background: '#2979ff',padding: '20rpx 30rpx'}"
				:body-style="{padding: 0}" :foot-style="{padding: '16rpx 30rpx'}" :show-foot="false" :full="true"
				v-for="(fixture, index) in list" :key="index">
				<view slot="head" class="card-head u-font-32 u-flex u-row-between">
					<view class="u-flex">
						<view>{{ fixture.fixtureName }}</view>
						<view class="u-font-24">({{ fixture.fixtureCode }})</view>
					</view>
				</view>
				<u-cell-group slot="body" :border="false">
					<u-cell-item class="u-p-t-10 u-p-b-10" hover-class="none" :arrow="false" title="领用人"
						:value="fixture.recipientsName">
					</u-cell-item>
					<u-cell-item class="u-p-t-10 u-p-b-10" hover-class="none" :arrow="false" title="申请时间"
						:value="fixture.recipientsDate">
					</u-cell-item>
					<u-cell-item class="u-p-t-10 u-p-b-10" hover-class="none" :arrow="false" title="归还人"
						:value="fixture.withdrawingPersonName">
					</u-cell-item>
					<u-cell-item class="u-p-t-10 u-p-b-10" hover-class="none" :arrow="false" :border-bottom="false"
						title="归还时间" :value="fixture.withdrawingDate">
					</u-cell-item>
				</u-cell-group>
			</u-card>
			<u-loadmore :status="loadStatus" bgColor="#ebebeb"></u-loadmore>
		</view>
		<no-data v-show="showNoData"></no-data>
		<u-top-tips ref="uTips"></u-top-tips>
	</view>
</template>

<script>
	import noData from '../../../../../components/noData/index.vue'

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
			this.getReceiveRecordList()
		},
		methods: {
			getReceiveRecordList() {
				const params = {
					query: {
						page: this.page,
						limit: this.limit
					},
					body: {
						state: 'WITHDRAW'
					}
				}
				this.$u.api.getReceiveRecordList(params).then(res => {
					if (res.msgCode === '000000') {
						this.list = [...this.list, ...res.data.data]
						this.page++

						if (!res.data.data.length || res.data.data.length < this.limit) this.loadStatus = "nomore"
						if (!this.list.length) this.showNoData = true
					} else {
						this.$refs.uTips.show({
							title: `归还记录获取失败，原因：${ res.message }`,
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
			if (this.loadStatus != 'nomore') {
				this.loadStatus = "loading"
				this.getReceiveRecordList()
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
</style>
