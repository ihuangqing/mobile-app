<!-- E-Checklist → 点检历史详情 -->
<template>
	<view class="sws-wh100">
		<u-collapse :head-style="{'padding': '30rpx'}" hover-class="none" arrow-color="#2979ff">
			<u-collapse-item class="u-border-bottom" v-for="(item, index) in itemList" :key="index">
				<view slot="title" class="sws-w100">
					<view>
						<u-icon name="calendar" size="32" color="#2979ff"></u-icon>
						<text class="u-m-l-10 u-type-primary">{{ item.confirmDate }}</text>
						<text class="u-m-l-10 u-type-error u-font-24" v-show="item.state == '过期已点检'">({{ item.state }})</text>
					</view>
					<view class="sws-w100 u-font-26 u-m-t-16 u-p-l-42 u-p-r-30 u-tips-color u-flex u-row-between">
						<text>点检人：{{ item.checkerList.map(user => user.userName).join('、') }}</text>
						<text>确认人：{{ item.checkInchargeList.map(user => user.userName).join('、') }}</text>
					</view>
				</view>
				<spot-check-result :list="item.list"></spot-check-result>
			</u-collapse-item>
		</u-collapse>
	</view>
</template>

<script>
	import spotCheckResult from '../../spotCheckResult/index.vue'
	
	export default {
		components: {
			spotCheckResult
		},
		data() {
			return {
				itemList: [],
			}
		},
		onLoad() {
			let _self = this
			// 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
			this.getOpenerEventChannel().on('acceptDataFromOpenerPage', function(res) {
				_self.id = res.data.id
				_self.itemList = res.data.spotCheckList.map(check => {
					check.list = check.deviceItemList.map(item => {
						if (item.state == '1') {
							return {
								checked: true,
								...item
							}
						} else {
							return {
								checked: false,
								...item
							}
						}
					})
					return check
				})
				
				console.log(_self.itemList)
			})
		}
	}
</script>

<style>
</style>
