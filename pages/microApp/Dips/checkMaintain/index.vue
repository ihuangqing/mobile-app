<!-- DIPS → 设备点检1、巡检2、保养3、维护4 -->
<template>
	<view class="sws-wh100 check-list u-flex sws-flex-d-column">
		<scroll-view v-show="!showNoData" scroll-y style="height: 100%;width: 100%;" @scrolltolower="loadMore">
			<view class="sws-w100 u-flex-1">
				<view class="list-item u-p-l-20 u-m-b-20" v-for="(item, index) in list" :key="index">
					<view class="u-flex u-border-bottom u-row-between u-p-t-10 u-p-r-40 u-p-b-10">
						<view class="u-type-primary sws-font-bold">{{ item.deviceCategory }}</view>
						<view class="u-type-primary">
							<u-icon name="calendar" size="28"></u-icon>
							<text class="sws-font-bold">{{ item.cycleDesc }}</text>
						</view>
					</view>
					<view class="u-p-20">
						<view class="u-flex u-p-b-20 u-p-r-20">
							<view class="u-flex-10">
								<view class="u-m-b-10 u-font-32">{{ `${item.deviceName}(${item.deviceCode})` }}</view>
								<view class="u-font-24 u-m-t-10" v-show="item.areaName">
									<text>位置：</text>
									<text>{{ item.areaName }}</text>
								</view>
								<view v-show="formatTools(item.itemList)" class="u-font-24 u-m-t-10">
									<text>工具：</text>
									<text>{{ formatTools(item.itemList) }}</text>
								</view>
								<view v-show="(type === '3' || type === '4') && formatSpareParts(item.itemList)"
									class="u-font-24 u-m-t-10">
									<text>备品：</text>
									<text>{{ formatSpareParts(item.itemList) }}</text>
								</view>
							</view>
							<!-- #ifdef APP-PLUS -->
							<u-button class="u-flex-2 btn-text" type="primary" size="mini" @click="itemClick(item)">
								{{ title }}
							</u-button>
							<!-- #endif -->
							<!-- #ifdef H5 -->
							<u-button class="u-flex-2 btn-text" type="primary" size="mini" @click="goToDetail(item)">
								{{ title }}
							</u-button>
							<!-- #endif -->
						</view>
						<view class="u-flex u-type-info u-font-24 u-row-between u-p-r-20">
							<text>确认人：{{ confirmUsers(item) }}</text>
							<text>截止时间：{{ item.deadDate }}</text>
						</view>
					</view>
				</view>
				<u-loadmore :status="loadStatus" bgColor="#ededed"></u-loadmore>
			</view>
		</scroll-view>
		<u-action-sheet :list="menuList" v-model="showAction" border-radius="16" @click="menuClick"></u-action-sheet>
		<no-data v-show="showNoData"></no-data>
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
				page: 1,
				limit: 10,
				list: [],
				title: '点检',
				showNoData: false,
				loadStatus: 'loadmore',
				menuList: [{
					text: '我的点检'
				}, {
					text: '点检记录查询'
				}],
				readData: {},
				showAction: false,
				filterArr: [63, 64, 76, 77] //南京工厂正式环境的四个组织
			}
		},
		computed: {
			...mapState(['userInfo', 'factoryId']),
			formatTools(list) { //格式化工具
				return list => {
					let arr = []
					list.forEach(item => {
						if (item.tools && item.tools !== '/') { //排除工具为/的
							arr = [...arr, ...item.tools.split('、')] //解决工具为“目检”、“目检、耳听”此类重复
						}
					})
					return [...new Set(arr)].join('、')
				}
			},
			formatSpareParts(list) { //格式化备件名称
				return list => {
					if (this.type === '3' || this.type === '4') { //只有维护和保养有备件展示
						let arr = list.map(mat => {
							if (mat.matList.length) {
								return mat.matList.map(item => item.matName)
							} else {
								return ''
							}
						})
						return [...new Set(arr)].join('、')
					} else {
						return ''
					}
				}
			},
			confirmUsers(item) {
				return item => {
					let users = []
					if (this.type === '1' || this.type === '2') {
						users = item.checkInchargeList
					} else if (this.type === '3' || this.type === '4') {
						users = item.maintainInchargeList
					}
					return users.map(user => user.userName).join('、')
				}
			}
		},
		watch: {
			readData(newVal) {
				if (Object.keys(newVal).length > 0) {
					const params = {
						nfcCode: newVal.id
					}
					this.$u.api.getDeviceInfoByNFCForDips(params).then(async res => {
						if (res.msgCode === '000000') {
							const code = res.data.deviceCode
							let item = this.list.filter(item => {
								return item.deviceCode === code
							})
							if (item.length) {
								this.goToDetail(item[0])
							} else {
								item = await this.getDeviceInfoFromServer(code)
								if (item.length) {
									this.goToDetail(item[0])
								} else {
									this.$refs.uTips.show({
										title: `未找到设备编码${code}对应的设备`,
										type: 'warning',
										duration: 2300
									})
								}
							}
						} else {
							this.$refs.uTips.show({
								title: `设备信息获取失败，原因：${ res.message }`,
								type: 'error',
								duration: 2300
							})
						}
					}).catch(err => {
						this.common.sysErrToast(this, err)
					})
				} else {
					this.$refs.uTips.show({
						title: '未读到数据',
						type: 'warning',
						duration: 2300
					})
				}
				setTimeout(() => { //防止连续触发
					this.NFCRead(this.$data)
				}, 2000)
			}
		},
		onLoad(options) {
			this.type = options.type //点检1、巡检2、保养3、维护4
			switch (+this.type) {
				case 1:
					this.typeUrl = 'dc'
					this.title = '点检'
					break
				case 2:
					this.typeUrl = 'routerecord'
					this.title = '巡检'
					this.menuList = [{
						text: '我的巡检'
					}, {
						text: '巡检记录查询'
					}]
					break
				case 3:
					this.typeUrl = 'pm'
					this.title = '保养'
					this.menuList = [{
						text: '我的保养'
					}, {
						text: '保养记录查询'
					}]
					break
				case 4:
					this.typeUrl = 'am'
					this.title = '维护'
					this.menuList = [{
						text: '我的维护'
					}, {
						text: '维护记录查询'
					}]
					break
			}
			this.getList('refresh')
		},
		onReady() {
			uni.setNavigationBarTitle({
				title: '设备' + this.title
			})

			// #ifdef APP-PLUS
			// 南京厂区隐藏扫码按钮
			if (this.filterArr.includes(this.factoryId)) {
				var webView = this.$scope.$getAppWebview();
				webView.setTitleNViewButtonStyle(1, {
					width: 0
				})
			}

			nfc.listenNFCStatus() //启动NFC
			// #endif

			this.NFCRead(this.$data)
		},
		methods: {
			updateState(deviceId) {
				return new Promise(resolve => {
					this.$u.api.postUpdateStateForDips(deviceId).then(res => {
						if (res.msgCode === '000000') {
							resolve(true)
						} else {
							this.$refs.uTips.show({
								title: `保养状态更新失败，原因：${ res.message }`,
								type: 'error',
								duration: 2300
							})
							resolve(false)
						}
					}).catch(err => {
						this.common.sysErrToast(this, err)
						resolve(false)
					})
				})
			},
			NFCRead() { //NFC读取
				// #ifdef APP-PLUS
				nfc.readData(this.$data)
				// #endif
			},
			loadMore() {
				if (this.loadStatus == 'nomore') {
					return
				}
				this.loadStatus = 'loading'
				this.getList('loading')
			},
			refresh() {
				this.page = 1
				this.list = []
				this.loadStatus = 'loadmore'
				this.getList('refresh')
			},
			getList(type) {
				const params = {
					query: `${this.typeUrl}/current${this.$u.queryParams({
						page: this.page,
						limit: this.limit
					})}`,
					body: {
						state: 'WAITING'
					}
				}
				this.$u.api.getListForDips(params).then(res => {
					if (res.msgCode === '000000') {
						const tempArr = res.data.data
						if (!tempArr.length || tempArr.length < this.limit) {
							this.loadStatus = 'nomore'
						}
						if (type === 'refresh') {
							this.list = tempArr
						} else if (type === 'loading') {
							this.list = [...this.list, ...tempArr]
							this.page++
						}
						if (!this.list.length) {
							this.showNoData = true
						}
					} else {
						this.$refs.uTips.show({
							title: `数据查询失败，原因：${res.message}`,
							type: 'error',
							duration: 2300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, this)
				})
			},
			itemClick(item) {
				this.curItem = item
				if (this.filterArr.includes(this.factoryId)) {
					nfc.readData(this.$data)
				} else {
					const actionList = ['NFC识别', '扫码']
					uni.showActionSheet({
						itemList: actionList,
						success: res => {
							if (res.tapIndex) { //扫码
								this.scanCode()
							} else { //NFC
								nfc.readData(this.$data)
							}
						}
					})
				}
			},
			async goToDetail(data) {
				if (this.type == 3) { //如果是保养，则需调提交一次保养状态变更
					const flag = await this.updateState(data.deviceId)
					if (!flag) {
						return
					}
				}
				data.title = this.title
				data.type = this.type
				data.typeUrl = this.typeUrl
				let _self = this
				uni.navigateTo({
					url: '/pages/microApp/Dips/checkMaintain/detail/index',
					events: {
						acceptDataFromOpenedPage: function(res) { // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
							_self.list.map((item, index) => {
								if (item.id === res.data) {
									_self.list.splice(index, 1)
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
			},
			async getDeviceInfoFromServer(deviceCode) { //从服务端查询设备信息
				return new Promise(resolve => {
					const params = {
						query: `${this.typeUrl}/current${this.$u.queryParams({
							page: 1,
							limit: 100
						})}`,
						body: {
							deviceCode,
							state: 'WAITING'
						}
					}
					this.$u.api.getListForDips(params).then(res => {
						if (res.msgCode === '000000') {
							resolve(res.data.data)
						} else {
							resolve([])
						}
					}).catch(err => {
						this.common.sysErrToast(this, this)
						resolve([])
					})
				})
			},
			async scanCode() {
				let code = await this.common.scanCode()
				if (Object.keys(this.curItem).length) { //通过当前点击的列表项的值来判断是走核对当前项，还是在列表中找匹配的项
					if (this.curItem.deviceCode === code) {
						this.goToDetail(this.curItem)
					} else {
						this.$refs.uTips.show({
							title: '设备编码不一致',
							type: 'warning',
							duration: 2300
						})
					}
				} else {
					let item = this.list.filter(item => {
						return item.deviceCode === code
					})
					if (item.length) {
						this.goToDetail(item[0])
					} else {
						item = await this.getDeviceInfoFromServer(code)
						if (item.length) {
							this.goToDetail(item[0])
						} else {
							this.$refs.uTips.show({
								title: `未找到设备编码${code}对应的设备`,
								type: 'warning',
								duration: 2300
							})
						}
					}
				}
			},
			menuClick(index) {
				const params = {
					title: this.title,
					type: this.type,
					typeUrl: this.typeUrl
				}
				if (index) {
					uni.navigateTo({
						url: `/pages/microApp/Dips/checkMaintain/history/index${this.$u.queryParams(params)}`
					})
				} else {
					this.refresh()
				}
			}
		},
		onNavigationBarButtonTap(btns) {
			if (btns.index) { //扫码
				this.curItem = [] //置空当前点击列表项，表明此时点击的是header中的扫码
				this.scanCode()
			} else { //历史
				this.showAction = true
			}
		}
	}
</script>

<style lang="scss" scoped>
	.check-list {
		background-color: #ededed;

		.list-item {
			background-color: #ffffff;
		}
	}

	.btn-text {
		letter-spacing: 20rpx;
		text-indent: 20rpx;
	}
</style>