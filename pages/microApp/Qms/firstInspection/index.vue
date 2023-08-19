<!-- IPQC首件检验单 -->
<template>
	<view class="page-wrap sws-wh100">
		<view class="sws-w100 material-search">
			<view class="sws-w100 u-p-20 u-flex">
				<view class="filter-input u-flex">
					<u-input v-model="filterVal" type="select" input-align="center" disabled height="64" @click="switchFilter" />
					<u-line color="#606266" direction="col" length="40" class="u-m-l-20" />
				</view>
				<u-search class="search-input" placeholder="请输入/扫描产品编号" shape="square" v-model="keyword" search-icon=""
					@search="queryProduct" @custom="queryProduct">
				</u-search>
				<view class="abs-scan" @click="scanCode('search')">
					<u-icon name="saoma" custom-prefix="sws-icon" size="45" color="#2979ff"></u-icon>
				</view>
			</view>
			<view class="u-p-l-40 u-p-r-40 u-flex u-row-center tab-wrap">
				<u-tabs ref="tabs" :list="tabList" :current="tabCurrent" :item-width="240" :bar-width="50" :height="80"
					@change="changeTab"></u-tabs>
			</view>
		</view>
		<view v-show="!showNoData" class="scroll-wrap sws-bg-ebebeb">
			<view class="u-p-20">
				<u-card margin="0 0 20rpx 0" :border="false" :head-style="{background: '#2979ff',padding: '0 30rpx'}"
					:body-style="{padding: 0}" :foot-style="{padding: '16rpx 30rpx'}" :show-foot="true" :full="true"
					v-for="(item, index) in list" :key="index">
					<view slot="head">
						<view class="card-head u-font-28 u-flex u-row-between">
							<view class="u-p-t-20 u-p-b-20">{{ formatCheckTypes(item.checkTypes) }}</view>
							<view v-if="item.timestamp" class="count-down">
								<u-count-down ref="uCountDown" :timestamp="item.timestamp" :show-seconds="false"
									separator-color="#2979ff" separator-size="24" color="#2979ff" separator="zh">
								</u-count-down>
							</view>
							<view>{{ item.orderNumber }}</view>
						</view>
					</view>
					<u-cell-group slot="body" :border="false">
						<u-cell-item class="u-p-t-10 u-p-b-10" hover-class="none" :arrow="false" title="设备名称"
							:value="item.deviceName">
						</u-cell-item>
						<u-cell-item class="u-p-t-10 u-p-b-10" hover-class="none" :arrow="false" title="设备编码"
							:value="item.deviceSn">
						</u-cell-item>
						<u-cell-item class="u-p-t-10 u-p-b-10" hover-class="none" :arrow="false" title="生成时间"
							:value="item.createTime">
						</u-cell-item>
						<u-cell-item class="u-p-t-10 u-p-b-10" hover-class="none" :arrow="false" title="产品类别"
							:value="item.productionCategory">
						</u-cell-item>
						<u-cell-item class="u-p-t-10 u-p-b-10" hover-class="none" :arrow="false" title="产品型号"
							:value="item.itemName">
						</u-cell-item>
						<u-cell-item class="u-p-t-10 u-p-b-10" hover-class="none" :arrow="false" :border-bottom="false" title="生产线别"
							:value="item.areaSn">
						</u-cell-item>
					</u-cell-group>
					<view slot="foot" class="u-text-right">
						<u-button v-if="item.checkTypes == 'F'" class="btn-style u-m-l-30" size="medium" type="primary"
							@click="goScanToAutoCheck(item, index)">
							扫码检验
						</u-button>
						<u-button v-else class="btn-style u-m-l-30" size="medium"
							:type="item.orderStatus == 2 ? 'warning' : 'success'" @click="goWriteData(item.orderNumber, index)">
							{{ item.orderStatus == 2 ? '过期补检' : '开始检验' }}
						</u-button>
					</view>
				</u-card>
				<u-loadmore :status="loadStatus" bgColor="#ebebeb"></u-loadmore>
			</view>
		</view>
		<u-modal v-model="showModal" :content="modalContent" @confirm="modalConfirm">
		</u-modal>
		<no-data v-show="showNoData"></no-data>
		<u-top-tips ref="uTips"></u-top-tips>
		<u-modal z-index='9999' :show-cancel-button='true' :title='scanCodeModalTitle' v-model="showscanCodeModal"
			@confirm="scanModeModalConfirm()">
			<view class='slot-scancode-content'>
				<u-search :show-action='showAction' shape='square' class="search-input" placeholder="请输入/扫描产品编号"
					v-model="modelCodeValue" search-icon="">
				</u-search>
				<u-icon class='scan-check-icon' @click="clickScanCodeIcon('scanCheck')" name="saoma" custom-prefix="sws-icon"
					size="45" color="#2979ff">
				</u-icon>
			</view>
		</u-modal>
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
				filterVal: '未检验',
				keyword: '',
				page: 1,
				limit: 10,
				tabCurrent: 0,
				tabList: [{
					name: '未检验',
					count: 0
				}, {
					name: '过检',
					count: 0
				}],
				orderStatus: 0, //单据状态，0是未检验，1已检，2未检，默认查询未检验
				list: [],
				loadStatus: 'loadmore',
				showNoData: false,
				showModal: false,
				modalContent: '',
				bodyParams: {},
				showscanCodeModal: false, //扫码检验弹框
				scanCodeModalTitle: '',
				modelCodeValue: '', //点击扫码检验 输入框v-model绑定值
				showAction: false,
			}
		},
		computed: {
			...mapState(['factoryId']),
			formatCheckTypes(type) {
				return type => { //A:首检检验,B：巡检检验，C:过程检验，D:执行力检验，E:异物检验 H:末检检验
					let res = '未知类型'
					switch (type) {
						case 'A':
							res = '首检检验'
							break;
						case 'B':
							res = '巡检检验'
							break;
						case 'C':
							res = '过程检验'
							break;
						case 'D':
							res = '执行力检验'
							break;
						case 'E':
							res = '异物检验'
							break;
						case 'F':
							res = '参数检验'
							break;
						case 'G':
							res = '稽查检验'
							break;
						case 'H':
							res = '末检检验'
							break;
					}
					return res
				}
			}
		},
		created() {
			this.getListData()
		},
		methods: {
			modalConfirm() {
				this.list.splice(this.curScanIndex, 1)
					--this.tabList[this.tabCurrent].count

				if (!this.list.length) {
					this.showNoData = true
				} else {
					this.showNoData = false
				}
			},
			switchFilter() {
				const _self = this
				const list = ['未检验', '过检']
				uni.showActionSheet({
					itemList: list,
					success: res => {
						_self.filterVal = list[res.tapIndex]
						switch (res.tapIndex) {
							case 0:
								_self.orderStatus = '0'
								_self.changeTab(0)
								break
							case 1:
								_self.orderStatus = '2'
								_self.changeTab(1)
								break
						}
					},
					fail: function(res) {
						console.log(res.errMsg)
					}
				})
			},
			changeTab(index) {
				this.tabCurrent = index
				if (index) { // 0是未检验，1是过检
					this.filterVal = '过检'
					this.orderStatus = 2
				} else {
					this.filterVal = '未检验'
					this.orderStatus = 0
				}
				this.page = 1
				this.list = []
				this.showNoData = false
				this.loadStatus = 'loadmore'
				this.getListData()
			},
			// 扫码检验
			goScanToAutoCheck(data, index) {
				this.modelCodeValue = ''
				this.curScanItem = data
				this.curScanIndex = index
				// this.showCheckPopup = true
				this.scanCodeModalTitle = '扫码检验'
				this.showscanCodeModal = true
			},
			//点击扫码图标---扫码检验弹框
			async clickScanCodeIcon() {
				const barcode = await this.common.scanCode()
				this.postBarCodeForAutoCheck(barcode)
			},
			// 扫码检验确定
			scanModeModalConfirm() {
				let code = this.modelCodeValue
				if (!code) {
					this.$refs.uTips.show({
						title: '请输入或扫描产品料号',
						type: 'error',
						duration: 2300
					})
					this.showscanCodeModal = false
					return
				}
				this.postBarCodeForAutoCheck(code)
			},
			postBarCodeForAutoCheck(productSn) {
				const params = {
					orderNo: this.curScanItem.orderNumber,
					technicsId: this.curScanItem.technicsId,
					productSn,
				}
				this.$u.api.postBarCodeForAutoCheck(params).then(res => {
					if (res.msgCode === '000000' && res.data) {
						this.modalContent = `参数检验结果${ res.data.checkResult }`
						this.showModal = true
					} else {
						this.$refs.uTips.show({
							title: `参数检验失败，原因：${ res.message }`,
							type: 'error',
							duration: 2300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				}).finally(() => {
					this.showscanCodeModal = false
				})
			},
			goWriteData(orderNumber, index) {
				const params = {
					query: {
						page: 1,
						limit: 10,
					},
					body: {
						orderNumber,
						isNeedLine: 'Y'
					}
				}
				this.$u.api.getOrderList(params).then(res => {
					if (res.msgCode === '000000' && res.data) {
						const _self = this
						const data = res.data.data[0]
						uni.navigateTo({
							url: '/pages/microApp/Qms/firstInspection/inspectOperate/index',
							events: {
								acceptDataFromOpenedPage: () => {
									_self.list.splice(index, 1)
										--_self.tabList[_self.tabCurrent].count
									if (!_self.list.length) this.showNoData = true
								}
							},
							success: function(res) {
								res.eventChannel.emit('acceptDataFromOpenerPage', {
									data
								})
							}
						})
					} else {
						this.$refs.uTips.show({
							title: `单据${ orderNumber }详情获取失败，原因：${ res.message }`,
							type: 'error',
							duration: 2300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			getListData() { //flag true用于通过设备编号精确查询 默认分页查列表
				let params = {
					query: {
						page: this.page,
						limit: this.limit,
					},
					body: {
						// checkTypes: "",
						checkTypes: this.bodyParams.checkTypes, //单据类型
						areaSn: this.bodyParams.areaSn, //线体类别
						orderStatus: this.orderStatus,
						itemCode: this.keyword,
						isNeedLine: 'N'
					}
				}
				console.log('params111111', params)

				uni.stopPullDownRefresh() //关闭下拉刷新
				this.$u.api.getOrderList(params).then(res => {
					if (res.msgCode === '000000' && res.data) {
						const temp = res.data.data
						const currTime = new Date().getTime()
						this.tabList[this.tabCurrent].count = res.data.count

						this.dataList = [...this.list, ...temp]
						this.list = this.dataList.map(item => {
							const endTime = new Date(item.endTime).getTime()
							let timestamp = 0
							if (endTime > currTime) {
								timestamp = (endTime - currTime) / 1000
							}

							return {
								timestamp,
								...item
							}
						})
						this.page++

						if (!res.data.data.length || res.data.data.length < this.limit) this.loadStatus =
							"nomore"
						if (!this.list.length) {
							this.showNoData = true
						} else {
							this.showNoData = false
						}
					} else {
						this.$refs.uTips.show({
							title: `首巡检单获取失败，原因：${ res.message }`,
							type: 'error',
							duration: 2300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			async scanCode(type) { //搜索框--扫码
				// #ifdef APP-PLUS
				const barcode = await this.common.scanCode()
				if (type && type == 'search') { //扫码用于搜索
					this.keyword = barcode
					this.queryProduct()
				}
				// #endif
			},
			queryProduct() {
				if (this.keyword.trim()) {
					this.page = 1
					this.list = []
					this.showNoData = false
					this.loadStatus = 'loadmore'
					this.getListData()
				} else {
					this.$refs.uTips.show({
						title: '请输入/扫描产品编号',
						type: 'warning',
						duration: 2300
					})
				}
			}
		},
		onReachBottom() {
			if (this.loadStatus != 'nomore') { //如果状态无无数据，则不再请求
				this.loadStatus = "loading"
				this.getListData()
			}
		},
		// onPullDownRefresh() {
		// 	this.page = 1
		// 	this.keyword = ''
		// 	this.list = []
		// 	this.loadStatus = 'loadmore'
		// 	this.getListData()
		// },
		onNavigationBarButtonTap(e) {
			const _self = this
			uni.navigateTo({
				url: '/pages/microApp/Qms/firstInspection/lineAndReiptsTypeSearch/index',
				events: {
					acceptDataFromQueryPage: params => {
						_self.showDate = false
						_self.page = 1
						_self.list = []
						_self.bodyParams = params
						_self.getListData()
					}
				}
			})

		}
	}
</script>

<style lang="scss" scoped>
	.material-search {
		position: fixed;
		z-index: 3;
		background-color: #ffffff;
	}

	.tab-wrap {
		width: 100%;
		height: 90rpx;
	}

	.scroll-wrap {
		min-height: 100%;
		padding-top: 194rpx; //64(u-search默认高度) + 20 + 20（搜索框上下内边距） + tab默认80
	}

	.card-head {
		color: #ffffff;
	}

	.btn-style {
		width: 180rpx;
		height: 60rpx;
		line-height: normal;
		padding: 0 16rpx;
	}

	.abs-scan {
		position: absolute;
		right: 122rpx;
		margin-top: 3rpx;
	}

	.filter-input {
		position: absolute;
		width: 180rpx;
		padding-left: 20rpx;
	}

	::v-deep .search-input .u-content {
		padding-left: 200rpx;
	}

	.slot-scancode-content {
		font-size: 28rpx;
		padding: 70rpx 30rpx 70rpx 30rpx;
		position: relative;
		display: flex;
		justify-content: space-between;

		.scan-check-icon {
			position: absolute;
			right: 60rpx;
			top: 80rpx;
		}

		::v-deep .u-content {
			padding-left: 0rpx;
		}

		::v-deep.u-close-wrap {
			position: relative;
			left: 20rpx
		}

	}

	.count-down {
		background-color: #fff;
		padding: 6rpx 16rpx;
		border-radius: 6rpx;
		box-shadow: 0 0 2rpx 2rpx #ebebeb;
	}
</style>