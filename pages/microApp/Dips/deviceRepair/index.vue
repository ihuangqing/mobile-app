<!-- DIPS → 设备维修 -->
<template>
	<view>
		<view class="wrap">
			<view class="u-tabs-box">
				<u-tabs-swiper activeColor="#2979ff" ref="tabs" :list="tabList" :current="current" @change="change"
					:is-scroll="false" swiperWidth="720"></u-tabs-swiper>
			</view>
			<swiper class="swiper-box" :current="swiperCurrent" @transition="transition"
				@animationfinish="animationfinish">
				<swiper-item class="swiper-item" v-for="(swpier, sIndex) in list" :key="sIndex">
					<scroll-view scroll-y style="height: 100%;width: 100%;" @scrolltolower="reachBottom">
						<view class="page-box" v-show="!showNoData[current]">
							<view class="order u-m-b-20" v-for="(item, index) in swpier" :key="index">
								<view class="item">
									<view class="left u-flex sws-flex-d-column u-col-top u-row-center"
										@click="previewImage(item)">
										<u-image class="u-image" width="200" height="200" border-radius="16"
											v-if="item.files && item.files.length" :src="item.files[0]"
											@error="item.imgErr = true">
											<view slot="error" class="u-flex sws-flex-d-column">
												<u-icon name="info-circle" size="44"></u-icon>
												<view class="u-font-24 u-m-t-10">加载失败</view>
											</view>
										</u-image>
										<u-icon v-else name="zhanweitu" custom-prefix="sws-icon" size="200"
											color="#ebebeb"></u-icon>
									</view>
									<view class="content u-flex-1 u-flex sws-flex-d-column u-col-top u-row-center">
										<view v-show="item.lineName" class="sws-w100 u-flex">
											<view class="u-type-info">拉线：</view>
											<view class="u-flex-1 u-text-right">{{ item.lineName }}</view>
										</view>
										<view v-show="item.areaName" class="sws-w100 u-flex">
											<view class="u-type-info">位置：</view>
											<view class="u-flex-1 u-text-right">{{ item.areaName }}</view>
										</view>
										<view v-show="item.areaName" class="sws-w100 u-flex">
											<view class="u-type-info">设备类型：</view>
											<view class="u-flex-1 u-text-right">{{ item.deviceCategory }}</view>
										</view>
										<view v-show="item.areaName" class="sws-w100 u-flex">
											<view class="u-type-info">设备编号：</view>
											<view class="u-flex-1 u-text-right">{{ item.deviceCode }}</view>
										</view>
									</view>
								</view>
								<view class="u-flex u-type-info u-col-top u-font-24 u-m-t-16">
									<view>问题说明： </view>
									<view class="u-flex-1">{{ item.question ? item.question : '-' }}</view>
								</view>
								<view class="total u-flex u-row-between u-type-info">
									<text>报修人：{{ item.applicantName ? item.applicantName : '-' }}</text>
									<text>联系电话：{{ item.telephone ? item.telephone : '-' }}</text>
								</view>
								<view class="bottom u-border-top">
									<view class="more" v-show="item.state">
										<view class="u-text-right u-type-primary sws-font-bold">
											{{ handleState(item.state) }}
										</view>
									</view>
									<view class="u-flex">
										<view class="ymRed btn" v-show="item.state === 'ASSIGN'"
											@click="rejectRepair(item.id)">拒单</view>
										<view class="logistics btn"
											v-show="item.state === 'DRAFT' || item.state === 'REJECT'"
											@click="dispatchRepair(item)">派单</view>
										<view class="exchange btn" v-show="item.state === 'ASSIGN'"
											@click="acceptRepair(item.id)">接单</view>
										<view class="evaluate btn"
											v-show="item.state === 'ACCEPT' || item.state === 'DRAFT'"
											@click="goToDetail(item, index)">开始维修</view>
										<view class="rpRecord btn" @click="goToRecord(item)">维修记录</view>
									</view>
								</view>
							</view>
							<u-loadmore :status="tabList[sIndex].loadStatus" bgColor="#ebebeb"></u-loadmore>
						</view>
						<no-data v-show="showNoData[current]"></no-data>
					</scroll-view>
				</swiper-item>
			</swiper>
		</view>
		<u-modal v-model="showRejectModal" title="请输入拒单原因" :show-cancel-button="true" @confirm="rejectConfirm">
			<view slot="default" class="u-p-20">
				<u-input type="textarea" height="120" :auto-height="true" placeholder="请输入拒单原因" v-model="rejectReason">
				</u-input>
			</view>
		</u-modal>
		<u-select v-model="showDispatchModal" :list="dispatchUserList" title="请选择维修人员" @confirm="selectConfirm">
		</u-select>
		<u-modal v-model="showModal" title="提示" :content="modalContent" @confirm="modalConfirm"></u-modal>
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
				limit: 10,
				list: [
					[], //待办
					[], //DRAFT -- 未接单
					[], //ACCEPT -- 维修中
					[] //CLOSED -- 已完工
				],
				tabList: [{
					name: '待办',
					loadStatus: 'loadmore'
				}, {
					name: '未接单',
					loadStatus: 'loadmore'
				}, {
					name: '维修中',
					loadStatus: 'loadmore'
				}, {
					name: '已完工',
					loadStatus: 'loadmore'
				}],
				current: 0,
				swiperCurrent: 0,
				dx: 0,
				showNoData: [false, false, false, false],
				rejectReason: '', //拒单原因
				showRejectModal: false,
				modalContent: '',
				showModal: false,
				dispatchUserList: [], //维修人员列表
				showDispatchModal: false
			}
		},
		computed: {
			...mapState(['userInfo']),
			handleState(state = '') {
				return state => {
					if (state === 'DRAFT') {
						return '待分配'
					} else if (state === 'REJECT') {
						return '已拒单'
					} else if (state === 'ASSIGN') {
						return '已分配待确认'
					} else if (state === 'ACCEPT') {
						return '维修中'
					} else if (state === 'COMPLETED') {
						return '维修完成'
					} else if (state === 'CLOSED') {
						return '已完成'
					}
				}
			}
		},
		onLoad() {
			this.list = [
				[],
				[],
				[],
				[]
			]
			this.getRepairListForDips(1)
		},
		methods: {
			acceptRepair(id) { //接单
				this.$u.api.postAcceptRepair(id).then(res => {
					if (res.msgCode === '000000') {
						this.modalContent = '接单成功'
						this.showModal = true
					} else {
						this.$refs.uTips.show({
							title: `接单失败，原因：${ res.message }`,
							type: 'error',
							duration: 2300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			goToDetail(data, index) { //进入详情
				const _self = this
				uni.navigateTo({
					url: '/pages/microApp/Dips/deviceRepair/repairDetail/index',
					success: res => {
						res.eventChannel.emit('acceptDataFromOpenerPage', {
							data
						})
					},
					events: {
						repairCompleted: ({
							status
						}) => { //接收到二级页面传来的消息：三级页面完成操作了
							if (status) { //status true表示维修完成  false 表示暂存
								_self.list[_self.current].splice(index, 1)
							}
						}
					}
				})
			},
			goToRecord(item) { //跳转至维修历史
				const params = {
					deviceCode: item.deviceCode,
					deviceCategory: item.deviceCategory
				}
				uni.navigateTo({
					url: `/pages/microApp/Dips/deviceRepair/repairRecords/index${ this.$u.queryParams(params) }`,
				})
			},
			selectConfirm(arr) { //维修人员确认
				const user = arr[0]
				const params = {
					id: this.dispatchId,
					repairer: user.value,
					repairerName: user.label
				}

				this.$u.api.postDispatchRepair(params).then(res => {
					if (res.msgCode === '000000') {
						this.modalContent = '派单成功'
						this.showModal = true
					} else {
						this.$refs.uTips.show({
							title: `派单失败，原因：${ res.message }`,
							type: 'error',
							duration: 2300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			dispatchRepair(item) { //派单
				this.dispatchId = item.id
				this.$u.api.getDispatchUserList(item.deviceCode).then(res => {
					if (res.msgCode === '000000') {
						if (res.data && res.data.maintainers.length) {
							this.dispatchUserList = res.data.maintainers.map(user => {
								return {
									label: user.userName,
									value: user.account
								}
							})
							this.showDispatchModal = true
						} else {
							this.$refs.uTips.show({
								title: '暂无维修人员',
								type: 'error',
								duration: 2300
							})
						}
					} else {
						this.$refs.uTips.show({
							title: `维修人员获取失败，原因：${ res.message }`,
							type: 'error',
							duration: 2300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			modalConfirm() { //拒单、派单、接单成功，刷新当前tab页面列表
				this.list[this.current] = []
				this.getRepairListForDips()
			},
			rejectConfirm() {
				if (!this.rejectReason.trim()) {
					this.$refs.uTips.show({
						title: '请输入拒单原因',
						type: 'warning',
						duration: 2300
					})
					return
				}

				const params = {
					id: this.rejectId,
					repairer: this.userInfo.account,
					rejectReason: this.rejectReason
				}

				this.$u.api.postRejectRepair(params).then(res => {
					if (res.msgCode === '000000') {
						this.modalContent = '拒单成功'
						this.showModal = true
					} else {
						this.$refs.uTips.show({
							title: `拒单失败，原因：${ res.message }`,
							type: 'error',
							duration: 2300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			rejectRepair(id) {
				this.rejectId = id
				this.showRejectModal = true
			},
			getRepairListForDips(page = 0) {
				let nextPage = page
				let url = 'getRepairListForDips'
				if (!page) {
					nextPage = Math.ceil(this.list[this.current].length / this.limit) + 1
				}
				const params = {
					query: {
						page: nextPage,
						limit: this.limit
					},
					body: {}
				}
				switch (this.current) {
					case 0:
						url = 'getUnfinishedRepairList'
						break
					case 1:
						params.body.state = 'DRAFT'
						break
					case 2:
						params.body.state = 'ACCEPT'
						break
					case 3:
						params.body.state = 'CLOSED'
						break
				}

				this.$u.api[url](params).then(res => {
					if (res.msgCode === '000000') {
						if (res.data.data && res.data.data.length) {
							res.data.data.forEach(item => {
							
								//if(this.current==0){
								//	if((item.state!='COMPLETED')&&(item.state!='CLOSED')){
										this.list[this.current].push(item)
									//}
								//}
								
							})
						} else {
							this.tabList[this.current].loadStatus = 'nomore'
						}
						if (!this.list[this.current].length) this.showNoData[this.current] = true
					} else {
						this.$refs.uTips.show({
							title: `维修列表获取失败，原因：${ res.message }`,
							type: 'error',
							duration: 2300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			previewImage(item) {
				if (item.imgErr) return
				uni.previewImage({
					urls: item.files
				})
			},
			reachBottom() {
				if (this.tabList[this.current].loadStatus !== 'nomore') {
					this.tabList[this.current].loadStatus = 'loading'
					this.getRepairListForDips()
				}
			},
			// tab栏切换
			change(index) {
				this.swiperCurrent = index
				this.current = index
			},
			transition({
				detail: {
					dx
				}
			}) {
				this.$refs.tabs.setDx(dx)
			},
			animationfinish({
				detail: {
					current
				}
			}) {
				this.$refs.tabs.setFinishCurrent(current)
				this.swiperCurrent = current
				this.current = current
				if (!this.list[current].length) this.getRepairListForDips(1)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page-box {
		width: 100%;
		padding: 0 20rpx;
	}
	
	.order {
		width: 100%;
		background-color: #ffffff;
		margin: 20rpx auto;
		border-radius: 20rpx;
		box-sizing: border-box;
		padding: 20rpx;
		font-size: 28rpx;

		.top {
			display: flex;
			justify-content: space-between;

			.left {
				display: flex;
				align-items: center;
			}
		}

		.item {
			display: flex;
			margin-top: 10rpx;

			.left {
				margin-right: 20rpx;
			}

			.content {
				font-size: 28rpx;
				line-height: 50rpx;
			}

		}

		.total {
			margin-top: 10rpx;
			text-align: left;
			font-size: 24rpx;
		}

		.bottom {
			display: flex;
			margin-top: 20rpx;
			padding-top: 20rpx;
			justify-content: space-between;
			align-items: center;

			.btn {
				line-height: 52rpx;
				border-radius: 12rpx;
				border: 2rpx solid $u-border-color;
				font-size: 26rpx;
				text-align: center;
				color: $u-type-info-dark;
				padding: 0 20rpx;
				margin-left: 20rpx;
			}

			.evaluate {
				color: $u-type-primary;
				border-color: $u-type-primary;
			}

			.exchange {
				text-indent: 10rpx;
				letter-spacing: 10rpx;
				color: $u-type-success;
				border-color: $u-type-success;
			}

			.logistics {
				text-indent: 10rpx;
				letter-spacing: 10rpx;
				color: $u-type-warning;
				border-color: $u-type-warning;
			}

			.ymRed {
				text-indent: 10rpx;
				letter-spacing: 10rpx;
				color: $u-type-error;
				border-color: $u-type-error;
			}

			.rpRecord {
				color: $u-type-info;
				border-color: $u-type-info;
			}
		}
	}


	.wrap {
		display: flex;
		flex-direction: column;
		height: calc(100vh - var(--window-top));
		width: 100%;
	}

	.swiper-box {
		flex: 1;
		background-color: #ebebeb;
	}

	.swiper-item {
		height: 100%;
	}
</style>
