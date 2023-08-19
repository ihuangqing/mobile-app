<!-- E-Checklist → 点检历史 -->
<template>
	<view class="page-wrap u-flex">
		<view class="plan-search u-p-20 u-flex">
			<u-search placeholder="请输入设备编码" :animation="true" shape="square" v-model="keyword" @custom="searchByCode">
			</u-search>
			<view class="u-flex u-row-center u-m-l-20 u-p-r-20" @click="goSearchMore">
				<u-icon name="more-dot-fill" color="#303133" size="30"></u-icon>
			</view>
		</view>
		<view class="plan-list sws-w100 u-flex-1">
			<u-cell-group :border="false">
				<view v-for="(item, index) in dataList" :key="index">
					<u-cell-item hover-class="none" :label="item.areaName" @click="goToDetail(item)">
						<view slot="title">
							<text class="u-type-primary">{{ item.deviceName }}</text>
							<text class="u-font-24">({{ item.deviceCode }})</text>
						</view>
					</u-cell-item>
					<u-gap height="20" bg-color="#ededed"></u-gap>
				</view>
			</u-cell-group>
		</view>
		<no-data v-show="showNoData"></no-data>
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
				keyword: '',
				dataList: [],
				showNoData: false
			}
		},
		computed: {},
		onLoad() {
			const startTime = this.common.dateCalculator(this, 30)
			const endTime = this.common.dateCalculator(this, -1)
			const params = {
				startDate: this.$u.timeFormat(new Date(startTime)),
				deadDate: this.$u.timeFormat(new Date(endTime))
			} //默认获取最近一个月数据
			this.getCheckHistory(params)
		},
		methods: {
			searchByCode() {
				let params = {
					deviceCode: this.keyword
				}
				this.getCheckHistory(params)
			},
			getCheckHistory(params) { //获取点检历史的查询方法
				this.dataList = []
				this.$u.api.getCheckHistory(params).then(res => {
					if (res.msgCode === '000000') {
						this.dataList = res.data
						if (!this.dataList.length) {
							this.showNoData = true
						}
					} else {
						this.$refs.uTips.show({
							title: `历史点检获取失败，原因：${res.message}`,
							type: 'error',
							duration: 2300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			goToDetail(data) { //跳转至点检明细页面
				let _self = this
				uni.navigateTo({
					url: `/pages/microApp/E-Checklist/spotCheckHistory/historyDetail/index`,
					success: function(res) {
						res.eventChannel.emit('acceptDataFromOpenerPage', { // 通过eventChannel向被打开页面传送数据
							data
						})
					}
				})
			},
			goSearchMore() { //跳转至更多查询页面
				let _self = this
				uni.navigateTo({
					url: `/pages/microApp/E-Checklist/spotCheckHistory/filter/index`,
					events: {
						acceptDataFromOpenedPage: function(res) { // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
							_self.getCheckHistory(res.params)
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
		overflow: hidden;
		flex-direction: column;


		.plan-search {
			width: 100%;
		}

		.plan-filter {
			position: relative;
			width: 100%;

			.dropdown {
				width: 100%;
			}

			.filter-more {
				position: absolute;
				right: 0;
				width: 25%;
				height: 100%;
				text-align: center;
				background-color: #fff;
				z-index: 300;
			}
		}

		.plan-list {
			background-color: #ededed;
			overflow-y: scroll;

			.list-item {
				background-color: #ffffff;
			}
		}
	}
</style>
