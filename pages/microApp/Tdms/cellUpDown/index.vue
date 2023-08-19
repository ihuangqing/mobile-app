<template>
	<view class="sws-wh100">
		<u-tabs :list="tabList" :is-scroll="false" :current="tabCurrent" bar-width="80" @change="tabChange"></u-tabs>
		<view class="tab-content sws-bg-ebebeb">
			<up-down :dataList="dataList" :cellType="tabCurrent" @refreshData="getDataList"></up-down>
		</view>
		<u-top-tips ref="uTips"></u-top-tips>
	</view>
</template>

<script>
	import upDown from '@/pages/microApp/Tdms/cellUpDown/components/index'

	export default {
		components: {
			upDown
		},
		data() {
			return {
				tabList: [{
					name: '电芯上架'
				}, {
					name: '电芯下架'
				}],
				tabCurrent: 0,
				dataList: []
			}
		},
		onLoad() {
			this.getDataList()
		},
		methods: {
			getDataList() { //tabCurrent  0 上架   1 下架
				const params = {
					query: {
						page: 1,
						limit: 100
					},
					body: {
						onTheCabinetFlag: this.tabCurrent ? 'N' : 'Y'
					}
				}

				this.$u.api.getCellUpDownListForTdms(params).then(res => {
					if (res.msgCode === '000000' && res.data.data) {
						this.dataList = res.data.data
					} else {
						this.$refs.uTips.show({
							title: `${this.tabList[this.tabCurrent].name}数据获取失败，原因：${ res.message }`,
							type: 'error',
							duration: '2300'
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			tabChange(index) {
				if (this.tabCurrent != index) {
					this.tabCurrent = index
					const title = this.tabList[index].name
					uni.setNavigationBarTitle({
						title
					})
					this.dataList = []
					this.getDataList(index)
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	.tab-content {
		width: 100%;
		height: calc(100% - 80rpx);
		overflow: hidden;
		padding: 20rpx;
	}
</style>