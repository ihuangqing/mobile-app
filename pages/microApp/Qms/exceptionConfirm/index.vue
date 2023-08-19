<!-- QC巡检不符合项改善效果确认 -->
<template>
	<view class="page-wrap sws-wh100">
		<view v-show="!showNoData" class="scroll-wrap sws-bg-ebebeb">
			<view class="u-p-20">
				<u-card margin="0 0 20rpx 0" :border="false"
					:head-style="{background: '#2979ff',padding: '20rpx 30rpx'}" :body-style="{padding: 0}"
					:foot-style="{padding: '16rpx 30rpx'}" :show-foot="true" :full="true" v-for="(item, index) in list"
					:key="index">
					<view slot="head">
						<view class="sws-font-fff u-font-32 u-flex">
							<view>{{ item.productModel }}({{ item.productNo }})</view>
						</view>
					</view>
					<u-cell-group slot="body" :border="false">
						<u-cell-item class="u-p-t-10 u-p-b-10" hover-class="none" :arrow="false" title="生产线别"
							:value="item.line">
						</u-cell-item>
						<u-cell-item class="u-p-t-10 u-p-b-10" hover-class="none" :arrow="false" title="发现工位"
							:value="item.station">
						</u-cell-item>
						<u-cell-item class="u-p-t-10 u-p-b-10" hover-class="none" :arrow="false" :border-bottom="false"
							title="问题描述" :value="item.exception">
						</u-cell-item>
					</u-cell-group>
					<view slot="foot" class="u-text-right">
						<u-button class="btn-style" size="medium" type="success" @click="toConfirmPage">改善效果确认</u-button>
					</view>
				</u-card>
				<u-loadmore :status="loadStatus" bgColor="#ebebeb"></u-loadmore>
			</view>
		</view>
		<u-modal v-model="showModal" :content="modalContent" :show-cancel-button="showCancel" @confirm="modalConfirm">
		</u-modal>
		<no-data v-show="showNoData"></no-data>
		<u-top-tips ref="uTips"></u-top-tips>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'

	import noData from '../../../components/noData/index.vue'

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
				showNoData: false,
				showModal: false,
				showCancel: false,
				modalContent: ''
			}
		},
		computed: mapState(['factoryId']),
		created() {
			this.getConfirmList()
		},
		methods: {
			toConfirmPage(item, index) {
				const _self = this
				const params = {}
				uni.navigateTo({
					url: `/pages/microApp/Qms/exceptionConfirm/confirmPage/index${ this.$u.queryParams(params) }`,
					events: {
						acceptDataFromOpenedPage: function(res) { // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
							console.log('res:', res)
						}
					}
				})
			},
			getConfirmList(deviceCode, flag = false) { //flag true用于通过设备编号精确查询 默认分页查列表
				uni.stopPullDownRefresh() //关闭下拉刷新
				this.list = [{
					productNo: '3005660001391',
					productModel: '106Ah模组A',
					productType: 'Module',
					checkNo: '33122-C1.A1',
					line: 'HZ-M04',
					group: 'test',
					deviceSN: '33152302335679',
					classes: '白班',
					checkRes: 1, //检验结果
					checkStatus: 1, //检验状态
					timer: '2021-11-18 08:17:30',
					checker: '郭久盛',
					auditor: '审核人1',
					approve: '批准'
				}, {
					productNo: '3005660001391',
					productModel: '106Ah模组A',
					productType: 'Module',
					checkNo: '33122-C1.A1',
					line: 'HZ-M04',
					group: 'test',
					deviceSN: '33152302335679',
					classes: '白班',
					checkRes: 2, //检验结果
					checkStatus: 1, //检验状态
					timer: '2021-11-18 08:17:30',
					checker: '郭久盛',
					auditor: '审核人1',
					approve: '批准'
				}, {
					productNo: '3005660001391',
					productModel: '106Ah模组A',
					productType: 'Module',
					checkNo: '33122-C1.A1',
					line: 'HZ-M04',
					group: 'test',
					deviceSN: '33152302335679',
					classes: '白班',
					checkRes: 2, //检验结果
					checkStatus: 1, //检验状态
					timer: '2021-11-18 08:17:30',
					checker: '郭久盛',
					auditor: '审核人1',
					approve: '批准'
				}, {
					productNo: '3005660001391',
					productModel: '106Ah模组A',
					productType: 'Module',
					checkNo: '33122-C1.A1',
					line: 'HZ-M04',
					group: 'test',
					deviceSN: '33152302335679',
					classes: '白班',
					checkRes: 1, //检验结果
					checkStatus: 1, //检验状态
					timer: '2021-11-18 08:17:30',
					checker: '郭久盛',
					auditor: '审核人1',
					approve: '批准'
				}, {
					productNo: '3005660001391',
					productModel: '106Ah模组A',
					productType: 'Module',
					checkNo: '33122-C1.A1',
					line: 'HZ-M04',
					group: 'test',
					deviceSN: '33152302335679',
					classes: '白班',
					checkRes: 1, //检验结果
					checkStatus: 1, //检验状态
					timer: '2021-11-18 08:17:30',
					checker: '郭久盛',
					auditor: '审核人1',
					approve: '批准'
				}, {
					productNo: '3005660001391',
					productModel: '106Ah模组A',
					productType: 'Module',
					checkNo: '33122-C1.A1',
					line: 'HZ-M04',
					group: 'test',
					deviceSN: '33152302335679',
					classes: '白班',
					checkRes: 1, //检验结果
					checkStatus: 1, //检验状态
					timer: '2021-11-18 08:17:30',
					checker: '郭久盛',
					auditor: '审核人1',
					approve: '批准'
				}, {
					productNo: '3005660001391',
					productModel: '106Ah模组A',
					productType: 'Module',
					checkNo: '33122-C1.A1',
					line: 'HZ-M04',
					group: 'test',
					deviceSN: '33152302335679',
					classes: '白班',
					checkRes: 2, //检验结果
					checkStatus: 1, //检验状态
					timer: '2021-11-18 08:17:30',
					checker: '郭久盛',
					auditor: '审核人1',
					approve: '批准'
				}]
			},
			async scanCode() {
				// #ifdef APP-PLUS
				let code = await this.common.scanCode()
				this.getConfirmList(code, true)
				// #endif
			}
		},
		onReachBottom() {
			if (this.loadStatus != 'nomore') { //如果状态无无数据，则不再请求
				this.loadStatus = "loading"
				this.getConfirmList()
			}
		},
		onNavigationBarButtonTap() {
			this.scanCode()
		},
		onPullDownRefresh() {
			this.page = 1
			this.list = []
			this.loadStatus = 'loadmore'
			this.getConfirmList()
		}
	}
</script>

<style lang="scss" scoped>
	.scroll-wrap {
		min-height: 100%;
	}

	.btn-style {
		width: 220rpx;
		height: 60rpx;
		line-height: normal;
	}
</style>
