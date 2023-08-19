<!-- 接触电阻 &&  厚度测试 -->
<template>
	<view class="page-wrap sws-wh100">
		<view :class="msOverflow">
			<u-search class="search-input" placeholder="请输入申请单号" shape="square" v-model="fdApplyNo" @search="fuzzyQuery"
				@custom="fuzzyQuery">
			</u-search>
			<u-dropdown class="u-m-t-10" @open="dropdownOpen" @close="drowdownClose">
				<u-dropdown-item v-model="recordUserAccount" title="录入人员" :options="options1" @change="options1Change">
				</u-dropdown-item>
				<u-dropdown-item v-model="testLocation" title="测试地点" :options="options2" @change="options2Change">
				</u-dropdown-item>
				<u-dropdown-item v-model="processState" title="录入状态" :options="options3" @change="options3Change">
				</u-dropdown-item>
			</u-dropdown>
		</view>
		<view v-show="!showNoData" class="scroll-wrap sws-bg-ebebeb">
			<view class="u-p-20">
				<u-card margin="0 0 20rpx 0" :border="false"
					:head-style="{background: '#2979ff',padding: '20rpx 30rpx'}" :body-style="{padding: 0}"
					:foot-style="{padding: '16rpx 30rpx'}" :show-foot="true" :full="true" v-for="(item, index) in list"
					:key="index">
					<view slot="head">
						<view class="card-head u-font-32 u-flex">
							<view class="u-flex-1">{{ item.fdApplyNo }}</view>
							<view class="u-font-24">{{ computedProcessState(item.processState) }}</view>
						</view>
					</view>
					<u-cell-group slot="body" :border="false">
						<u-cell-item class="u-p-t-10 u-p-b-10" hover-class="none" :arrow="false" title="录入人员"
							:value="item.recordUserName">
						</u-cell-item>
						<u-cell-item class="u-p-t-10 u-p-b-10" hover-class="none" :arrow="false" title="测试地点"
							:value="item.testLocation">
						</u-cell-item>
						<u-cell-item class="u-p-t-10 u-p-b-10" hover-class="none" :arrow="false" :border-bottom="false"
							title="录入时间" :value="item.recordTime">
						</u-cell-item>
					</u-cell-group>
					<view slot="foot" class="u-text-right">
						<!-- <u-button class="btn-style sws-line-h-repair u-m-l-30" size="medium" type="warning"
							@click="toQueryDetail(item)">
							编辑
						</u-button> -->
						<u-button class="btn-style sws-line-h-repair u-m-l-30" size="medium" type="primary"
							@click="toQueryDetail(item)">
							查看
						</u-button>
					</view>
				</u-card>
				<u-loadmore :status="loadStatus" bgColor="#ebebeb"></u-loadmore>
			</view>
		</view>
		<u-modal :title="`新增${title}`" :show-cancel-button='true' v-model="showScanModal" @confirm="scanModalConfirm()">
			<view class='u-flex u-p-t-60 u-p-l-40 u-p-b-60 u-p-r-40'>
				<u-search shape='square' class="u-m-r-40" :show-action="false" placeholder="请输入/扫描样品条码"
					v-model="coding">
				</u-search>
				<u-icon class='scan-check-icon' @click="scanCode" name="saoma" custom-prefix="sws-icon" size="45"
					color="#2979ff">
				</u-icon>
			</view>
		</u-modal>
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
				msOverflow: 'material-search sws-w100 sws-overflow-hidden',
				"fdApplyNo": "",
				"recordType": "VOLTAGE_RESISTANCE",
				"recordUserAccount": "",
				"recordUserName": "",
				"testLocation": "",
				"processState": "",
				options1: [],
				options2: [{
						label: '南京一期',
						value: '南京一期',
					},
					{
						label: '南京二期',
						value: '南京二期',
					},
				],
				options3: [{
						label: '部分录入',
						value: 1,
					},
					{
						label: '全部录入',
						value: 2,
					},
				],
				page: 1,
				limit: 5,
				list: [],
				loadStatus: 'loadmore',
				showNoData: false,
				showModal: false,
				showCancel: false,
				modalContent: '',
				coding: '',
				showScanModal: false,
			}
		},
		computed: {
			...mapState(['factoryId']),
			computedProcessState(state) {
				return state => {
					let res = ''
					switch (state) {
						case 0:
							res = '未录入'
							break;
						case 1:
							res = '部分录入'
							break;
						case 2:
							res = '全部录入'
							break;
					}
					return res
				}
			}
		},
		watch: {
			list: function(newVal) {
				if (newVal.length) {
					this.showNoData = false
				} else {
					this.showNoData = true
				}
			}
		},
		onLoad({
			type
		}) {
			this.type = type
			this.title = '接触电阻'
			if (type === 'VOLTAGE_RESISTANCE') {
				this.title = '厚度测试'
			}
			this.queryBody = {}
			this.getOAList()
			this.findRecordUser()
			uni.setNavigationBarTitle({
				title: this.title
			})
		},
		methods: {
			options1Change(val) {
				const user = this.options1.filter(user => user.value == val)[0]
				this.recordUserName = user.label
				this.recordUserAccount = user.value
				this.getOAList(true)
			},
			options2Change(val) {
				this.testLocation = val
				this.getOAList(true)
			},
			options3Change(val) {
				this.processState = val
				this.getOAList(true)
			},
			dropdownOpen() {
				this.msOverflow = 'material-search sws-w100'
			},
			drowdownClose() {
				this.msOverflow = 'material-search sws-w100 sws-overflow-hidden'
			},
			goToDetailList(list) {
				const self = this
				uni.navigateTo({
					url: '/pages/microApp/Tdms/resistanceThickness/itemList/index',
					success: res => {
						res.eventChannel.emit('acceptDataFromDetailList', {
							type: self.type,
							title: self.title,
							list: [...list]
						})
					}
				})
			},
			toQueryDetail(item) {
				this.currItem = item
				const params = {
					id: this.currItem.id,
					query: {
						recordType: this.type
					}
				}
				this.$u.api.findRecordDetailList(params).then(res => {
					if (res.msgCode === '000000') {
						if (res.data.length) {
							this.goToDetailList(res.data)
						} else {
							this.$refs.uTips.show({
								title: '暂无明细记录',
								type: 'warning',
								duration: 2300
							})
						}
					} else {
						this.$refs.uTips.show({
							title: `记录详情查询失败，原因：${ res.message }`,
							type: 'error',
							duration: 2300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			getOAList(flag = false) { // flag 是否精确查询
				if (flag) {
					this.queryBody = {
						"fdApplyNo": this.fdApplyNo,
						"recordUserAccount": this.recordUserAccount,
						"recordUserName": this.recordUserName,
						"testLocation": this.testLocation,
						"processState": this.processState,
					}
					this.dataList = []
					this.list = []
				}

				const params = {
					query: {
						page: flag ? 1 : this.page,
						limit: this.limit,
						recordType: this.type
					},
					body: this.queryBody
				}

				uni.stopPullDownRefresh() //关闭下拉刷新
				this.$u.api.queryDataListForTDMS(params).then(res => {
					if (res.msgCode === '000000') {
						const temp = res.data.data.map(item => {
							if (!item.nfcCode) item.nfcCode = ''
							return item
						})

						this.dataList = [...this.list, ...temp]
						this.list = this.dataList
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
							title: `记录列表获取失败，原因：${ res.message }`,
							type: 'error',
							duration: 2300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			modalConfirm() {
				if (this.modalContent.includes('是否确认删除申请单')) {
					this.delItem()
				} else if (this.modalContent.includes('删除成功')) {
					this.list.splice(this.currIndex, 1)
				}
			},
			findRecordUser() {
				const params = {
					recordType: this.type
				}
				this.$u.api.findRecordUser(params).then(res => {
					if (res.msgCode === '000000') {
						this.options1 = res.data.map(user => {
							return {
								label: `${user.userName}(${user.account})`,
								value: user.account
							}
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			fuzzyQuery() {
				if (this.fdApplyNo) {
					this.loadStatus = 'loadmore'
					this.getOAList(true)
				}
			},
			async scanCode() {
				// #ifdef APP-PLUS
				this.coding = await this.common.scanCode()
				this.findProcessPlanExecute()
				// #endif

				// #ifdef H5
				this.coding = 'D2212010004'
				this.findProcessPlanExecute()
				// #endif
			},
			scanModalConfirm() {
				if (this.coding) {
					this.findProcessPlanExecute()
				}
			},
			findProcessPlanExecute() {
				this.showScanModal = false
				const params = {
					coding: this.coding,
					recordType: this.type
				}
				this.$u.api.findProcessPlanExecute(params).then(res => {
					if (res.msgCode === '000000') {
						this.toAddPage(res.data)
					} else {
						this.$refs.uTips.show({
							title: `新增申请失败，原因：${ res.message }`,
							type: 'error',
							duration: 2300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			toAddPage(data) {
				const self = this
				uni.navigateTo({
					url: '/pages/microApp/Tdms/resistanceThickness/addNewItem/index',
					events: {
						acceptDataFromOpenedPage: function(data) {
							self.refreshPage()
						}
					},
					success: res => {
						res.eventChannel.emit('acceptDataFromOpenerPage', {
							type: self.type,
							title: self.title,
							isEdit: false,
							...data
						})
					}
				})
			},
			refreshPage() {
				this.page = 1
				this.dataList = []
				this.list = []
				this.fdApplyNo = ''
				this.recordUserAccount = ''
				this.recordUserName = ''
				this.testLocation = ''
				this.processState = ''
				this.queryBody = {}
				this.loadStatus = 'loadmore'
				this.getOAList()
			}
		},
		onBackPress() {
			if (this.showModal) {
				this.showModal = false
				return true
			}
		},
		onReachBottom() {
			if (this.loadStatus != 'nomore') { //如果状态无无数据，则不再请求
				this.loadStatus = "loading"
				this.getOAList()
			}
		},
		onNavigationBarButtonTap({
			index
		}) {
			if (index) {
				this.scanCode()
			} else {
				this.coding = ''
				this.showScanModal = true
			}
		},
		onPullDownRefresh() {
			this.refreshPage()
		}
	}
</script>

<style lang="scss" scoped>
	.material-search {
		position: fixed;
		z-index: 3;
		background-color: #ffffff;
		padding: 10rpx 20rpx 0 20rpx;
	}

	.ms-overflow {
		overflow: hidden;
	}

	.scroll-wrap {
		min-height: 100%;
		padding-top: 164rpx; //64(u-search默认高度) + 20 + 10（搜索框上下内边距）+ 40 dropmenu高度 + 20padding-top
	}

	.card-head {
		color: #ffffff;
	}

	.btn-style {
		width: 120rpx;
		height: 60rpx;
		line-height: normal;
		text-indent: 20rpx;
		letter-spacing: 20rpx;
	}

	.filter-input {
		position: absolute;
		width: 180rpx;
		padding-left: 20rpx;
	}
</style>
