<template>
	<view class="sws-wh100">
		<view :class="msOverflow">
			<!-- <view class="sws-w100 u-flex u-row-right">
				<view>审核时间：</view>
				<view class="test-date" @click="showDate =true">
					<u-icon name="calendar" color="#2979ff" class="u-m-r-12" size="32"></u-icon>
					<text class="u-font-32">{{ operateTime }}</text>
				</view>
				<view class="u-flex-1 u-flex u-m-l-20">
					<view>审核结果：</view>
					<u-subsection class="u-flex-1" height="54" :active-color="['#2949ff', '#19be6b', '#fa3534'][checkCurrent]"
						:list="checkResultList" :current="checkCurrent" @change="toChangeCheck"></u-subsection>
				</view>
			</view> -->
			<u-dropdown class="u-m-t-10" @open="dropdownOpen" @close="drowdownClose">
				<u-dropdown-item v-model="areaName" title="区域" :options="options1" @change="options1Change">
				</u-dropdown-item>
				<u-dropdown-item v-model="positionName" title="实验室" :options="options2" @change="options2Change">
				</u-dropdown-item>
				<u-dropdown-item v-model="operator" title="审核人" :options="options3" @change="options3Change">
				</u-dropdown-item>
				<u-dropdown-item v-model="resultStr" title="审核结果" :options="options4" @change="options4Change">
				</u-dropdown-item>
			</u-dropdown>
		</view>
		<view v-show="!showNoData" class="scroll-wrap sws-bg-ebebeb">
			<view class="u-p-20">
				<u-card margin="0 0 20rpx 0" :border="false" :head-style="{background: '#2979ff',padding: '16rpx 26rpx'}"
					:body-style="{padding: 0, 'border-bottom': 'none'}" :foot-style="{padding: '0 20rpx'}" :show-foot="true"
					:full="true" :foot-border-top="false" v-for="(item, index) in list" :key="index">
					<view slot="head">
						<view class="card-head u-font-28 u-flex">
							<view class="u-flex-1">
								<text class="u-font-28">{{ item.areaName }}</text>
								<text class="u-m-l-8 u-m-r-8">-</text>
								<text class="u-font-24">{{ item.positionName }}</text>
							</view>
							<view :class="item.result ? 'u-type-error' : 'u-type-success'">{{ item.resultStr }}</view>
						</view>
					</view>
					<view slot="body" class="u-flex u-p-t-10 u-p-r-10 u-p-l-10 sws-w100">
						<view class="u-flex-1">
							<u-row gutter="16" class="u-p-t-10 u-p-b-10">
								<u-col span="3">
									<view class="u-text-center u-font-24 u-type-info">下限</view>
									<view class="u-m-t-10 u-text-center u-main-color">{{ item.temperatureFloor }}</view>
								</u-col>
								<u-col span="6">
									<view class="u-text-center u-font-24 u-type-info">温度(℃)</view>
									<view
										:class="(item.result == 1 || item.result == 3) ? 'u-m-t-10 u-text-center u-type-error': 'u-m-t-10 u-text-center u-main-color'">
										{{ item.temperature }}
									</view>
								</u-col>
								<u-col span="3">
									<view class="u-text-center u-font-24 u-type-info">上限</view>
									<view class="u-m-t-10 u-text-center u-main-color">{{ item.temperatureCeiling }}</view>
								</u-col>
							</u-row>
						</view>
						<u-line color="#2979ff" length="70rpx" direction="col" margin="10rpx" :hair-line="false"></u-line>
						<view class="u-flex-1">
							<u-row gutter="16" class="u-p-t-10 u-p-b-10">
								<u-col span="3">
									<view class="u-text-center u-font-24 u-type-info">下限</view>
									<view class="u-m-t-10 u-text-center u-main-color">{{ item.humidityFloor }}</view>
								</u-col>
								<u-col span="6">
									<view class="u-text-center u-font-24 u-type-info">湿度(%RH)</view>
									<view
										:class="(item.result == 2 || item.result == 3) ? 'u-m-t-10 u-text-center u-type-error': 'u-m-t-10 u-text-center u-main-color'">
										{{ item.humidity }}
									</view>
								</u-col>
								<u-col span="3">
									<view class="u-text-center u-font-24 u-type-info">上限</view>
									<view class="u-m-t-10 u-text-center u-main-color">{{ item.humidityCeiling }}</view>
								</u-col>
							</u-row>
						</view>
					</view>
					<view slot="foot">
						<view class="u-flex u-font-24 check-info">
							<view>
								<text>审核人：</text>
								<text>{{ item.operator }}</text>
							</view>
							<view>
								<text>审核时间：</text>
								<text>{{ item.operateTime }}</text>
							</view>
						</view>
						<view class="u-text-right u-p-t-16 u-p-b-16">
							<u-button class="btn-style sws-line-h-repair u-m-l-30" size="medium" type="error"
								@click="toDel(item, index)">
								删除
							</u-button>
							<!-- <u-button class="btn-style sws-line-h-repair u-m-l-30" size="medium" type="success" @click="toEdit(item)">
								编辑
							</u-button> -->
						</view>
					</view>
				</u-card>
				<u-loadmore :status="loadStatus"></u-loadmore>
			</view>
		</view>
		<u-modal v-model="showModal" :content="modalContent" :show-cancel-button="showCancel" @confirm="modalConfirm">
		</u-modal>
		<u-calendar v-model="showDate" mode="date" @change="dateConfirm"></u-calendar>
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
				msOverflow: 'lab-search sws-w100 sws-overflow-hidden',
				checkCurrent: 0,
				checkResultList: [{
						name: '全部'
					},
					{
						name: '正常'
					},
					{
						name: '异常'
					}
				],
				operateTime: '',
				result: '',
				areaName: '',
				positionName: '',
				operator: '',
				resultStr: '',
				options1: [],
				options2: [],
				options3: [],
				options4: [{
					label: '正常',
					value: 0
				}, {
					label: '温度超限规格范围',
					value: 1
				}, {
					label: '湿度超限规格范围',
					value: 2
				}, {
					label: '温湿度超限规格范围',
					value: 3
				}],
				page: 1,
				limit: 5,
				list: [],
				loadStatus: 'loadmore',
				showModal: false,
				showCancel: false,
				modalContent: '',
				showNoData: false,
				showDate: false,
			}
		},
		onLoad() {
			this.operateTime = this.$u.timeFormat(new Date())
			this.queryBody = {}
			this.getSelectListDataForTemperatureHumidityInput() //获取下拉数据
			this.getDataListForTemperatureHumidityInput() //获取列表查询数据
		},
		methods: {
			getDataListForTemperatureHumidityInput(flag = false) {
				if (flag) {
					this.queryBody = {
						operateTime: this.operateTime,
						result: this.result,
						areaName: this.areaName,
						positionName: this.positionName,
						operator: this.operator,
					}
					this.dataList = []
					this.list = []
				}
				const params = {
					query: {
						page: flag ? 1 : this.page,
						limit: this.limit
					},
					body: this.queryBody
				}
				uni.stopPullDownRefresh() //关闭下拉刷新
				this.$u.api.getDataListForTemperatureHumidityInput(params).then(res => {
					const temp = res.data.data.map(item => {
						if (!item.nfcCode) item.nfcCode = ''
						return item
					})

					this.dataList = [...this.list, ...temp]
					this.list = this.dataList
					this.page++

					if (!res.data.data.length || res.data.data.length < this.limit) this.loadStatus = "nomore"

					if (!this.list.length) {
						this.showNoData = true
					} else {
						this.showNoData = false
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			getSelectListDataForTemperatureHumidityInput() {
				this.$u.api.getSelectListDataForTemperatureHumidityInput().then(res => {
					if (res.msgCode === '000000' && res.data) {
						this.options1 = res.data.areaData.map(item => {
							return {
								label: item,
								value: item
							}
						})
						this.options2 = res.data.positionData.map(item => {
							return {
								label: item,
								value: item
							}
						})
						this.options3 = res.data.operator.map(item => {
							return {
								label: item,
								value: item
							}
						})
					} else {
						this.$refs.uTips.show({
							title: `筛选过滤数据获取失败，原因：${ res.message }`,
							type: 'error',
							duration: 2300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			dateConfirm({
				result
			}) {
				this.operateTime = result
				this.getDataListForTemperatureHumidityInput(true)
			},
			options1Change(val) {
				this.areaName = val
				this.getDataListForTemperatureHumidityInput(true)
			},
			options2Change(val) {
				this.positionName = val
				this.getDataListForTemperatureHumidityInput(true)
			},
			options3Change(val) {
				this.operator = val
				this.getDataListForTemperatureHumidityInput(true)
			},
			options4Change(val) {
				this.result = val
				this.getDataListForTemperatureHumidityInput(true)
			},
			toChangeCheck(index) {
				this.checkCurrent = index
			},
			dropdownOpen() {
				this.msOverflow = 'lab-search sws-w100'
			},
			drowdownClose() {
				this.msOverflow = 'lab-search sws-w100 sws-overflow-hidden'
			},
			modalConfirm() {
				if (this.modalContent.includes('是否确认删除')) {
					this.delTempRecord()
				}
			},
			toDel(item, index) {
				this.currItem = item
				this.currIndex = index
				this.modalContent = `是否确认删除${item.areaName}-${item.positionName}温湿度记录？`
				this.showCancel = true
				this.showModal = true
			},
			delTempRecord() {
				this.$u.api.delTemperatureHumidityRecord(this.currItem.id).then(res => {
					if (res.msgCode === '000000') {
						this.list.splice(this.currIndex, 1)
						this.modalContent = '删除成功！'
						this.showModal = true
					} else {
						this.$refs.uTips.show({
							title: `删除失败，原因：${ res.message }`,
							type: 'error',
							duration: 2300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			toEdit(item) {
				this.dataForEdit = {
					...item,
					flag: 'edit'
				}
				this.toEditPage()
			},
			toEditPage() {
				const self = this
				uni.navigateTo({
					url: '/pages/microApp/Tdms/temperatureInput/editTemperature/index',
					events: {
						acceptDataFromOpenedPage: function(data) {
							self.refreshPage()
						}
					},
					success: function(res) {
						res.eventChannel.emit('acceptDataFromOpenerPage', {
							...self.dataForEdit
						})
					}
				})
			},
			refreshPage() {
				this.page = 1
				this.dataList = []
				this.list = []
				this.operateTime = this.$u.timeFormat(new Date())
				this.result = ''
				this.areaName = ''
				this.positionName = ''
				this.operator = ''
				this.queryBody = {}
				this.loadStatus = 'loadmore'
				this.getDataListForTemperatureHumidityInput()
			}
		},
		onNavigationBarButtonTap() {
			this.dataForEdit = {
				flag: 'add'
			}
			this.toEditPage()
		},
		onReachBottom() {
			if (this.loadStatus != 'nomore') { //如果状态无无数据，则不再请求
				this.loadStatus = "loading"
				this.getDataListForTemperatureHumidityInput()
			}
		},
		onPullDownRefresh() {
			this.refreshPage()
		}
	}
</script>

<style lang="scss" scoped>
	.test-date {
		box-shadow: 0 0 2rpx 2rpx #ebebeb;
		padding: 6rpx 42rpx;
		margin-right: 16rpx;
		color: #2979ff;
		border-radius: 8rpx;
	}

	.lab-search {
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
		padding-top: 100rpx;
	}

	.card-head {
		color: #ffffff;
	}

	.check-info {
		background: #a3d8f1;
		color: #ffff;
		padding: 2px 10px;
		border-radius: 3px;
		justify-content: space-between;
	}

	.btn-style {
		width: 120rpx;
		height: 60rpx;
		line-height: normal;
		text-indent: 20rpx;
		letter-spacing: 20rpx;
	}
</style>