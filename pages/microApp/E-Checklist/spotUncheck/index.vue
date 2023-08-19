<!-- 点检 → 待点检 -->
<template>
	<view class="sws-wh100 u-flex sws-flex-d-column">
		<view class="sws-w100 u-border-bottom">
			<u-tabs :list="list" :is-scroll="false" count="count" :offset="[5, 36]" duration="0.3" :current="current"
				@change="change"></u-tabs>
		</view>
		<view class="sws-w100 check-list u-flex-1">
			<view class="list-item u-p-l-20 u-m-b-20" v-for="(item, index) in checkList" :key="index">
				<view class="u-flex u-border-bottom u-row-between u-p-t-10 u-p-r-40 u-p-b-10">
					<view class="u-type-primary">
						<u-icon name="calendar" size="32"></u-icon>
						<text class="sws-font-bold">{{ item.cycle }}</text>
						<text class="u-type-error u-font-24" v-show="item.state == 4">(已过期)</text>
					</view>
					<view>
						<text class="u-type-info u-font-24">确认人：</text>
						<text>{{ item.checkInchargeList.map(user => user.userName).join('、') }}</text>
					</view>
				</view>
				<view class="u-p-20">
					<view class="u-flex u-p-b-20 u-p-r-20">
						<view class="u-flex-10">
							<view class="u-m-b-10">{{ `${item.deviceName}(${item.deviceCode})` }}</view>
							<view>{{ item.areaName }}</view>
						</view>
						<u-button v-if="item.state == 1" class="u-flex-2 btn-text" type="primary" size="mini"
							@click="NFCRead(item)">点检</u-button>
						<u-button v-else class="u-flex-2 btn-text" type="warning" size="mini" @click="NFCRead(item)">
							补检</u-button>
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
				list: [{
					name: '全部'
				}, {
					name: '待点检'
				}, {
					name: '已过期',
					count: 0
				}],
				current: 0,
				checkList: [],
				showNoData: false,
				readData: {}
			}
		},
		computed: mapState(['userInfo']),
		watch: {
			readData(newVal) {
				console.log(newVal,'newVal')
				if (Object.keys(newVal).length > 0) {
					console.log('newVal:', newVal)
					// 匹配列表,如果匹配则跳转至对应的列表页,不匹配则提示
					this.$u.api.getDeviceInfoByNFCId(newVal.id).then(res => {
						console.log('hw:', res)
						if (res.msgCode === '000000') {
							if(res.data && Object.keys(res.data).length) {
								const arr = this.checkList.filter(item => item.deviceCode === res.data.code)
								if (arr.length > 0) {
									this.goToCheck(arr[0])
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
		onLoad() {
			// #ifdef APP-PLUS
			nfc.listenNFCStatus()
			this.NFCRead()
			// #endif
			this.getAllUnchecklist(this.userInfo.account) //获取所有未点检列表
		
		},
		methods: {
			NFCRead(item) {
				// #ifdef APP-PLUS
				nfc.readData(this.$data)
				// #endif
				
				// #ifdef H5
				this.goToCheck(item)
				// #endif
			},
			getAllUnchecklist() {
				let params = {
					account: this.userInfo.account,
					checkState: 1
				}
				this.$u.api.getAllUnchecklist(params).then(res => {
					if (res.msgCode === '000000') {
						this.dataList = res.data
						this.renderList()
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
			renderList(state) {
				this.list[2].count = this.dataList.filter(item => item.state == 4).length //获取过期未点检的数量
				this.checkList = this.dataList.filter(item => {
					return !state || item.state == state
				})
			},
			change(index) {
				this.current = index;
				switch (index) {
					case 0:
						this.renderList()
						break
					case 1:
						this.renderList(1)
						break
					case 2:
						this.renderList(4)
						break
				}
			},
			goToCheck(data) {
				let _self = this
				uni.navigateTo({
					url: '/pages/microApp/E-Checklist/spotCheck/index',
					events: {
						acceptDataFromOpenedPage: function(res) { // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
							_self.dataList.map((item, index) => {
								if (item.id === res.data) {
									_self.dataList.splice(index, 1)
								}
							})
					
							_self.change(_self.current)
					
						},
								
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

	.btn-text {
		letter-spacing: 20rpx;
		text-indent: 20rpx;
		line-height: normal;
	}
</style>
