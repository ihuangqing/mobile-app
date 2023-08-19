<!-- dips → nfc标签数据读写 -->
<template>
	<view class="page-wrap sws-wh100">
		<view class="material-search sws-w100 u-p-20 u-flex">
			<view class="filter-input u-flex">
				<u-input v-model="filterVal" type="select" input-align="center" disabled height="64"
					@click="switchFilter" />
				<u-line color="#606266" direction="col" length="40" class="u-m-l-20" />
			</view>
			<u-search class="search-input" placeholder="请输入设备编码或名称" shape="square" v-model="keyword" search-icon=""
				@search="fuzzyQuery" @custom="fuzzyQuery">
			</u-search>
		</view>
		<view v-show="!showNoData" class="scroll-wrap sws-bg-ebebeb">
			<view class="u-p-20">
				<u-card margin="0 0 20rpx 0" :border="false"
					:head-style="{background: '#2979ff',padding: '20rpx 30rpx'}" :body-style="{padding: 0}"
					:foot-style="{padding: '16rpx 30rpx'}" :show-foot="true" :full="true"
					v-for="(device, index) in list" :key="index">
					<view slot="head">
						<view class="card-head u-font-32 u-flex">
							<view>{{ device.deviceName }}</view>
							<view class="u-font-24">({{ device.deviceCode }})</view>
						</view>
					</view>
					<u-cell-group slot="body" :border="false">
						<u-cell-item class="u-p-t-10 u-p-b-10" hover-class="none" :arrow="false" title="设备类别"
							:value="device.deviceCategory">
						</u-cell-item>
						<u-cell-item class="u-p-t-10 u-p-b-10" hover-class="none" :arrow="false" :border-bottom="false"
							title="设备位置" :value="device.areaName">
						</u-cell-item>
					</u-cell-group>
					<view slot="foot" class="u-text-right">
						<u-button v-show="device.nfcCode" class="btn-style sws-line-h-repair" size="medium" type="warning"
							@click="toDelTag(device, index)">解绑标签
						</u-button>
						<u-button v-show="!device.nfcCode" class="btn-style sws-line-h-repair u-m-l-30" size="medium" type="success"
							@click="goWriteData(device, index)">
							绑定标签
						</u-button>
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
				filterVal: '全部',
				nfcFilter: '',
				keyword: '',
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
			this.getDeviceList()
		},
		methods: {
			switchFilter() {
				const _self = this
				const list = ['全部', '未绑定', '已绑定']
				uni.showActionSheet({
					itemList: list,
					success: res => {
						_self.filterVal = list[res.tapIndex]
						switch (res.tapIndex) {
							case 0:
								_self.nfcFilter = ''
								break
							case 1:
								_self.nfcFilter = 'Y'
								break
							case 2:
								_self.nfcFilter = 'N'
								break
						}
					},
					fail: function(res) {
						console.log(res.errMsg)
					}
				})
			},
			toDelTag(device) {
				this.modalContent = `是否解除设备${ device.deviceName }(${ device.deviceCode })绑定的标签？`
				this.delDevice = device
				this.showCancel = true
				this.showModal = true
			},
			modalConfirm() {
				if (this.modalContent.includes('是否解除')) {
					this.delTag(this.delDevice)
				}
			},
			delTag(device) { //解绑设备和标签
				const params = {
					deviceCode: device.deviceCode
				}
				this.$u.api.postUnbindDeviceNFCForDips(params).then(res => {
					if (res.msgCode === '000000') {
						device.nfcCode = ''
						this.modalContent = `设备：${ device.deviceName } 解绑成功!`
						this.showCancel = false
						this.showModal = true
					} else {
						this.$refs.uTips.show({
							title: `标签解除绑定失败，原因：${ res.message }`,
							type: 'error',
							duration: 2300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			goWriteData(item, index) {
				this.curIndex = index
				const _self = this
				const params = {
					type: 'dips',
					deviceName: item.deviceName,
					deviceCode: item.deviceCode,
					categoryName: item.deviceCategory
				}
				uni.navigateTo({
					url: `/pages/mine/tools/writeDataByNFC/index${this.$u.queryParams(params)}`,
					events: {
						acceptDataFromOpenedPage: function(res) { // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
							console.log('res:', res)
							_self.list[_self.curIndex].nfcCode = res.nfcCode
						}
					}
				})
			},
			getDeviceList(deviceCode, flag = false) { //flag true用于通过设备编号精确查询 默认分页查列表
				const params = {
					query: {
						page: flag ? 1 : this.page,
						limit: this.limit
					},
					body: {
						nfcFilter: this.nfcFilter
					}
				}
				if (flag) {
					params.body.deviceCode = deviceCode
					this.dataList = []
					this.list = []
				}

				uni.stopPullDownRefresh() //关闭下拉刷新
				this.$u.api.getDeviceListForDips(params).then(res => {
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
							title: `设备列表获取失败，原因：${ res.message }`,
							type: 'error',
							duration: 2300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			fuzzyQuery() {
				this.loadStatus = 'loadmore'
				this.getDeviceList(this.keyword, true)
			},
			async scanCode() {
				// #ifdef APP-PLUS
				let code = await this.common.scanCode()
				this.getDeviceList(code, true)
				// #endif
			}
		},
		onReachBottom() {
			if (this.loadStatus != 'nomore') { //如果状态无无数据，则不再请求
				this.loadStatus = "loading"
				this.getDeviceList()
			}
		},
		onNavigationBarButtonTap() {
			this.scanCode()
		},
		onPullDownRefresh() {
			this.page = 1
			this.list = []
			this.loadStatus = 'loadmore'
			this.getDeviceList()
		}
	}
</script>

<style lang="scss" scoped>
	.material-search {
		position: fixed;
		z-index: 3;
		background-color: #ffffff;
	}

	.scroll-wrap {
		min-height: 100%;
		padding-top: 104rpx; //64(u-search默认高度) + 20 + 20（搜索框上下内边距）
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

	.filter-input {
		position: absolute;
		width: 180rpx;
		padding-left: 20rpx;
	}

	::v-deep .search-input .u-content {
		padding-left: 200rpx;
	}
</style>
