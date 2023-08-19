<!-- 点检 → 待点检 -->
<template>
	<view class="sws-wh100 u-flex sws-flex-d-column">
		<view class="sws-w100 check-list u-flex-1">
			<view class="list-item u-p-l-20 u-m-b-20" v-for="(item, index) in dataList" :key="index">
				<view class="u-flex u-border-bottom u-row-between u-p-t-10 u-p-r-40 u-p-b-10">
					<view class="u-type-primary">
						<u-icon name="calendar" size="32"></u-icon>
						<text class="sws-font-bold">{{ item.cycle }}</text>
					</view>
					<view>
						<text class="u-type-info u-font-24">OK：</text>
						<text class="u-type-success u-font-32 u-m-r-20">{{ item.deviceItemList.filter(item => item.state == '1').length }}</text>
						<text class="u-type-info u-font-24">NG：</text>
						<text class="u-type-error u-font-32">{{ item.deviceItemList.filter(item => item.state !== '1').length }}</text>
					</view>
				</view>
				<view class="u-p-20">
					<view class="u-flex u-p-b-20 u-p-r-20">
						<view class="u-flex-10">
							<view class="u-m-b-10">{{ `${item.deviceName}(${item.deviceCode})` }}</view>
							<view>{{ item.areaName }}</view>
						</view>
						<u-button class="u-flex-2 sws-line-h-repair" type="primary" size="mini" @click="goToCheckConfirm(item)">点检确认
						</u-button>
					</view>
					<view class="u-flex u-type-info u-font-24 u-row-between u-p-r-20">
						<text>点检人：{{ item.checkerList.map(user => user.userName).join('、') }}</text>
						<text>截止时间：{{ item.deadDate }}</text>
					</view>
				</view>
			</view>
		</view>
		<no-data v-show="showNoData"></no-data>
		<u-top-tips ref="uTips"></u-top-tips>
	</view>
</template>

<script>
	import noData from '../../../components/noData/index.vue'

	import {
		mapState
	} from 'vuex'

	export default {
		components: {
			noData
		},
		data() {
			return {
				dataList: [],
				showNoData: false
			}
		},
		computed: mapState(['userInfo']),
		onLoad() {
			this.getAllUnchecklist(this.userInfo.account) //获取所有未点检列表
		},
		methods: {
			getAllUnchecklist() {
				let params = {
					account: this.userInfo.account,
					checkState: 2
				}
				this.$u.api.getAllUnchecklist(params).then(res => {
					if (res.msgCode === '000000') {
						this.dataList = res.data
						if (!this.dataList.length) {
							this.showNoData = true
						}
					} else {
						this.$refs.uTips.show({
							title: `待点检列表获取失败，原因：${res.message}`,
							type: 'error',
							duration: 2300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			goToCheckConfirm(data) {
				let _self = this
				uni.navigateTo({
					url: '/pages/microApp/E-Checklist/spotCheckConfirm/confirmDetail/index',
					events: {
						acceptDataFromOpenedPage: function(res) { // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
							_self.dataList.map((item, index) => {
								if (item.id === res.data) {
									_self.dataList.splice(index, 1)
								}
							})
						}
					},
					success: function(res) {
						res.eventChannel.emit('acceptDataFromOpenerPage', { // 通过eventChannel向被打开页面传送数据
							data
						})
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.check-list {
		background-color: #ededed;
		position: relative;
		overflow: scroll;

		.list-item {
			background-color: #ffffff;
		}
	}
</style>
