<template>
	<!-- 流程审批历史记录 -->
	<view style='padding:20rpx'>
		<scroll-view scroll-x="true">
			<view class="u-m-b-20 u-p-l-10 u-p-t-20 u-p-b-20">
				<view class="sws-font-bold u-font-32 " style='color:#000'>流程审批历史记录</view>
			</view>
			<u-table>
				<u-tr class="u-tr">
					<u-th class="u-th" width='200rpx'>任务名称</u-th>
					<u-th class="u-th" width='300rpx'>办理人</u-th>
					<u-th class="u-th" width='200rpx'>状态</u-th>
					<u-th class="u-th" width='300rpx'>审批意见</u-th>
					<u-th class="u-th" width='400rpx'>开始时间</u-th>
					<u-th class="u-th" width='400rpx'>结束时间</u-th>
				</u-tr>
				<u-tr class="u-tr" v-for='item in tableList'>
					<u-td class="u-td" width='200rpx'>{{item.taskName||''}}</u-td>
					<u-td class="u-td" width='300rpx'>{{item.userName||''}}</u-td>
					<u-td class="u-td" width='200rpx'>{{item.status||''}}</u-td>
					<u-td class="u-td" width='300rpx'>{{item.message||'无'}}</u-td>
					<u-td class="u-td" width='400rpx'>{{item.startTime||'无'}}</u-td>
					<u-td class="u-td" width='400rpx'>{{item.endTime||'无'}}</u-td>

				</u-tr>

			</u-table>
		</scroll-view>

	</view>
</template>

<script>
	export default {
		props: {
			tableList: {
				type: Array,
				default: () => {}
			}
		},
		data() {
			return {
				// tableList: []
			}
		},
		methods: {
			renderData() {

			}

		}

	}
</script>


<style lang="scss" scoped>
	.u-tr {
		width: 100%;
	}

	.u-th {
		width: 100rpx !important;
	}

	.u-td {
		width: 100rpx;
	}
</style>