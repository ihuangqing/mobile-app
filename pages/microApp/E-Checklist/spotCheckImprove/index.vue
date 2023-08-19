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
		<view class="sws-w100 check-list u-flex-1">
			<view class="list-item u-p-l-20 u-m-b-20" v-for="(item, index) in dataList" :key="index">
				<view class="u-flex u-border-bottom u-row-between u-p-t-10 u-p-r-40 u-p-b-10"
					v-if="item.taskStatus ==0||item.taskStatus ==3">
					<view class="u-type-primary">
						<text class="sws-font-bold">{{ item.creationDate.substring(5,7) }}月</text>
					</view>
					<view>
						<text class="u-type-info u-font-24">确认人：</text>
						<text>{{ item.spotCheckDeviceVo.checkInchargeList.map(user => user.userName).join('、') }}</text>
					</view>
				</view>
				<view class="u-p-20">
					<view class="u-flex u-p-b-20 u-p-r-20">
						<view class="u-flex-10">
							<view class="u-m-b-10">
								{{ `${item.spotCheckDeviceVo.deviceName}(${item.spotCheckDeviceVo.deviceCode})` }}
							</view>
							<view>{{ item.areaName }}</view>
							<view>点检NG项：{{ item.itemName }}</view>
							<view>点检NG原因：{{ item.exception }}</view>
						</view>
						<!--  -->
						<u-button v-if="item.taskStatus == 0 && item.listtype == 1" class="u-flex-2 btn-text"
							type="warning" size="mini" @click="improvement(item)">改善
						</u-button>
						<!--  -->
						<u-button v-else-if='item.taskStatus == 3 &&  item.listtype == 1' class="u-flex-2 " type="error"
							size="mini" @click="improvement(item)">
							再次改善</u-button>
						<u-button v-else-if='item.taskStatus == 2' class="u-flex-2 " type="primary" size="mini"
							@click="particulars(item)">
							已完成（详情）</u-button>
						<u-button v-else-if='item.taskStatus == 1' class="u-flex-2 " type="primary" size="mini"
							@click="particulars(item)">
							待确认</u-button>
						<!-- <u-button v-else class="u-flex-2 " type="success" size="mini" @click="particulars(item)">
							改善待确认</u-button> -->
					</view>
					<view class="u-flex u-type-info u-font-24 u-row-between u-p-r-20">
						<text>点检人：{{ item.spotCheckDeviceVo.checkerList.map(user => user.userName).join('、') }}</text>
						<text>点检时间：{{ item.creationDate }}</text>
					</view>
				</view>
			</view>
		</view>
		<no-data v- <no-data v-show="showNoData"></no-data>
		<u-top-tips ref="uTips"></u-top-tips>
	</view>
</template>

<script>
	// #ifdef APP-PLUS
	import nfc from '../../../../js_sdk/hexiii-nfc/hexiii-nfc.js'
	// #endif
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
				keyword: '',
				dataList: [],
				showNoData: false,
				readData: {},
				// listtype: 0,
				list: []
			}
		},
		watch: {
			readData(newVal) {
				console.log(newVal, 'newVal')
				if (Object.keys(newVal).length > 0) {
					console.log('newVal:', newVal)
					// 匹配列表,如果匹配则跳转至对应的列表页,不匹配则提示
					this.$u.api.getDeviceInfoByNFCId(newVal.id).then(res => {
						console.log('hw:', res)
						if (res.msgCode === '000000') {
							if (res.data && Object.keys(res.data).length) {
								// const arr = this.checkList.filter(item => item.spotCheckDeviceVo.deviceCode === res
								// 	.data.code)
								this.dataList.forEach((item, index) => {
									if (item.spotCheckDeviceVo.deviceCode == res.data.code) {
										// 添加展示标识
										item.listtype = 1
										this.list.push(item)
									}
								})
								if (this.dataList.length > 0) {
									// this.improvement(arr[0])
									// 当配置到对应的设备编号,展示对应的列表
									let s1 = new Set(this.list);
									this.dataList = [...s1]


								} else {
									this.$refs.uTips.show({
										title: `当前列表无此设备—${res.data.name}(${res.data.code})`,
										type: 'warning',
										duration: 2300
									})
								}
							} else {
								this.$refs.uTips.show({
									title: '未知标签，请联系管理员！',
									type: 'warning',
									duration: 2300
								})
							}
						} else {
							this.$refs.uTips.show({
								title: '设备信息获取失败，请重试！',
								type: 'warning',
								duration: 2300
							})
						}
					}).catch(err => {
						this.common.sysErrToast(this, err)
					})
				}
				setTimeout(() => {
					this.NFCRead() //重新开启数据读取
				}, 3000)
			}
		},

		computed: mapState(['userInfo']),
		onLoad() {
			// #ifdef APP-PLUS
			nfc.listenNFCStatus()
			this.NFCRead()
			// #endif
			let params = {
				// account: this.userInfo.account,
				queryType: 1,
				// checkerId: 2109080104,
			}
			this.getAllUnchecklist(params)

		},

		onShow() {
			console.log('测试show')
			// this.getAllUnchecklist()
			// this.renderList()
		},
		methods: {

			NFCRead(item) {
				// #ifdef APP-PLUS
				nfc.readData(this.$data)
				// #endif

				// #ifdef H5
				this.improvement(item)
				// #endif
			},









			// 获取点检列表
			getAllUnchecklist() {
				this.list = []
				this.dataList = []
				this.showNoData = false
				let params = {
					// account: this.userInfo.account,
					queryType: 1,
					// checkState: "1",
					// checkerId: 2109080104,
					deviceCode: this.keyword,
				}
				this.$u.api.improveTaskList(params).then(res => {
					if (res.msgCode === '000000') {
						this.dataList = res.data.data

						// console.log(this.dataList, 'this.dataList11111')


						// const arr = this.checkList.filter(item => item.spotCheckDeviceVo.deviceCode === res
						// 	.data.code)
						// const arr = this.dataList.filter(item => this.dataList[1].spotCheckDeviceVo.deviceCode ==
						// 	'MT01006')


						// this.dataList.forEach((item, index) => {
						// 	if (item.spotCheckDeviceVo.deviceCode == 'MT01006') {
						// 		console.log(item, 'item')
						// 		item.listtype = 1
						// 		this.list.push(item)
						// 	}

						// })



						// console.log(this.list, 'this.list')


						// if (this.dataList.length > 0) {
						// 	// this.improvement(arr[0])
						// 	// 当配置到对应的设备编号,展示对应的列表
						// 	// this.dataList = this.list

						// 	let s1 = new Set(this.list);
						// 	this.dataList = [...s1]

						// 	// console.log(this.dataList)

						// 	this.listtype = '1'
						// } else {
						// 	this.$refs.uTips.show({
						// 		title: `当前列表无此设备—${res.data.name}(${res.data.code})`,
						// 		type: 'warning',
						// 		duration: 2300
						// 	})
						// }






						// this.renderList()
						if (!this.dataList.length) {
							this.showNoData = true
						}
					} else {
						this.$refs.uTips.show({
							title: `点检NG改善列表获取失败，原因：${res.message}`,
							type: 'error',
							duration: 2300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},

			searchByCode() {
				// console.log('1111111111')
				this.getAllUnchecklist()
			},

			// 搜索
			getAlllist(params) {
				this.showNoData = false
				this.$u.api.improveTaskList(params).then(res => {
					if (res.msgCode === '000000') {

						this.dataList = res.data.data

						this.list = []

						// console.log(this.dataList, 'this.dataList 搜索')
						// this.renderList()
						if (!this.dataList.length) {
							this.showNoData = true
						}
						this.keyword = ''
					} else {
						this.$refs.uTips.show({
							title: `点检NG改善列表获取失败，原因：${res.message}`,
							type: 'error',
							duration: 2300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},

			particulars(data) {
				// let _self = this
				// console.log(data)
				uni.navigateTo({
					url: `/pages/microApp/E-Checklist/improveConfirm/spotCheckParticulars/index`,
					success: function(res) {
						res.eventChannel.emit('ddd', { // 通过eventChannel向被打开页面传送数据
							data
						})
					}
				})

			},

			// 获取需要改善的设备
			// renderList() {
			// 	console.log('获取需要改善的设备')
			// 	// taskStatus = 0 待改善  taskStatus = 3 已驳回 
			// 	this.dataList = this.dataList.filter(item => {
			// 		return item.taskStatus == 0 || item.taskStatus == 3
			// 	})
			// 	console.log('进来没有', this.dataList)
			// },

			//跳转至改善页面
			improvement(data) {

				let _selt = this
				this.list = []
				uni.navigateTo({
					url: `/pages/microApp/E-Checklist/spotCheckImprove/spotCheckMeasure/index`,
					events: {
						acceptDataFromOpenedPage: function(res) { // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
							// console.log(res, '111111111传递的速速resresresres')

							// _selt.getAllUnchecklist()
							// console.log(res, '1111111')
							// console.log(_selt.dataList, 'this.dataList')
							_selt.setlist(res)
						
						},
						
					
					},
					success: function(res) {
						res.eventChannel.emit('ddd', { // 通过eventChannel向被打开页面传送数据
							data
						})
						// console.log('测试是否进来2',res)
					}
				})
			},
			
			setlist(index){
				console.log(index,'index')
				
				var indexList = index
				
				let dataListty = []
				this.dataList.forEach((item, index) => {
					if (item.id != indexList.data) {
						// console.log(item, 'item')
						item.listtype = 1
						dataListty.push(item)
					}
				
				})
				this.dataList = dataListty
				console.log(this.dataList,'this.dataListthis.dataListthis.dataList123')
				
			},

			goSearchMore() { //跳转至更多查询页面
				let _self = this
				uni.navigateTo({
					url: `/pages/microApp/E-Checklist/spotCheckHistory/filter/index`,
					events: {
						acceptDataFromOpenedPage: function(res) { // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
							console.log(res.params, '传递的速速resresresres')
							res.params.queryType = 1
							res.params.checkInchargeId = res.params.checkIncharge
							delete res.params.checkIncharge
							_self.getAlllist(res.params)

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

		.check-list {
			background-color: #ededed;
			position: relative;
			overflow: scroll;

			.list-item {
				background-color: #ffffff;
			}
		}

		.btn-text {
			letter-spacing: 20rpx;
			text-indent: 20rpx;
			line-height: normal;
		}
	}
</style>
