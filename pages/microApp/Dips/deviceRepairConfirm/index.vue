<!-- dips → 设备维修确认 -->
<template>
	<view class="sws-wh100">
		<view v-show="!showNoData" class="scroll-wrap sws-w100 u-p-20 sws-bg-ebebeb">
			<u-card margin="0 0 20rpx 0" :head-style="{background: '#2979ff',padding: '20rpx 30rpx'}"
				:body-style="{padding: 0}" :foot-style="{padding: '16rpx 30rpx'}" :border="false" :show-foot="true"
				:full="true" v-for="(device, index) in list" :key="index">
				<view slot="head">
					<view class="card-head u-font-32 u-flex">
						<view>{{ device.deviceCategory }}</view>
						<view class="u-font-24">({{ device.deviceCode }})</view>
					</view>
				</view>
				<u-cell-group slot="body" :border="false">
					<u-cell-item class="u-p-t-10 u-p-b-10" hover-class="none" :arrow="false" title="维修人"
						:value="device.repairerName">
					</u-cell-item>
					<u-cell-item class="u-p-t-10 u-p-b-10" hover-class="none" :arrow="false" title="完成时间"
						:value="device.finishDate">
					</u-cell-item>
					<u-cell-item v-show="repairTime(device)" class="u-p-t-10 u-p-b-10" hover-class="none" :arrow="false"
						:border-bottom="false" title="维修耗时" :value="repairTime(device)">
					</u-cell-item>
				</u-cell-group>
				<view slot="foot" class="u-text-right">
					<u-button class="btn-style" size="medium" type="error" @click="approveReject(device.id, index)">驳回
					</u-button>
					<u-button class="btn-style u-m-l-30" size="medium" type="success"
						@click="approveConfirm(device.id, index)">确认
					</u-button>
				</view>
			</u-card>
			<u-loadmore :status="loadStatus" bgColor="#ebebeb"></u-loadmore>
		</view>
		<u-modal v-model="showReject" title="请输入驳回理由" :show-cancel-button="true" @confirm="rejectConfirm">
			<view slot="default" class="u-p-20">
				<u-input type="textarea" height="120" :auto-height="true" placeholder="请输入驳回理由" v-model="rejectReason">
				</u-input>
			</view>
		</u-modal>
		<u-modal v-model="showConfirm" title="请对维修服务评价" :show-cancel-button="true" @confirm="confirmRepair">
			<view slot="default" class="u-p-20">
				<view class="u-m-t-10">
					<text class="u-main-color">维修技术：</text>
					<u-rate :count="5" v-model="techEvaluation" active-color="#2979ff"></u-rate>
				</view>
				<view class="u-m-t-10">
					<text class="u-main-color">服务态度：</text>
					<u-rate :count="5" v-model="serviceEvaluation" active-color="#2979ff"></u-rate>
				</view>
				<view class="u-m-t-10 u-m-b-20">
					<text class="u-main-color">响应速度：</text>
					<u-rate :count="5" v-model="responEvaluation" active-color="#2979ff"></u-rate>
				</view>
				<u-input type="textarea" height="120" :border="true" :auto-height="true" placeholder="请输入意见与建议"
					v-model="suggest">
				</u-input>
			</view>
		</u-modal>
		<u-modal v-model="showModal" :content="modalContent"></u-modal>
		<no-data v-show="showNoData"></no-data>
		<u-top-tips ref="uTips"></u-top-tips>
	</view>
</template>

<script>
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
				modalContent: '',
				showModal: false,
				showNoData: false,
				showReject: false,
				loadStatus: 'loadmore',
				rejectReason: '',
				showConfirm: false,
				techEvaluation: 0,
				serviceEvaluation: 0,
				responEvaluation: 0,
				suggest: ''
			}
		},
		computed: {
			...mapState(['userInfo']),
			repairTime(device) {
				return device => {
					if (device.callDate && device.finishDate) {
						let time = (new Date(device.finishDate) - new Date(device.callDate)) / 1000 
						return this.dynamicTime(time)
					} else {
						return ''
					}
				}
			}
		},
		onLoad() {
			this.getCompletedList()
		},
		methods: {
			dynamicTime(count) {
				let usedTime = 0
				let day = parseInt(count / 60 / 60 / 24)
				let hour = parseInt((count % (24 * 3600)) / 3600)
				let minute = parseInt(count / 60) % 60
				let second = parseInt(count % 60)
				usedTime = hour ? ((hour < 10 ? '0' + hour : hour) + '小时') : '' + (minute < 10 ? '0' + minute : minute) +
					'分' + (second < 10 ? '0' + second : second) + '秒'
				if (day !== 0) {
					usedTime = day + '天 ' + usedTime
				}
				return usedTime
			},
			confirmRepair() {
				const arr = [{
					tips: '请为维修人员的维修技术打分',
					value: this.techEvaluation
				}, {
					tips: '请为维修人员的服务态度打分',
					value: this.serviceEvaluation
				}, {
					tips: '请为维修人员的响应速度打分',
					value: this.responEvaluation
				}, {
					tips: '请输入意见与建议',
					value: this.suggest
				}]
				if (!this.common.checkNotNull(this, arr)) {
					return
				}

				const params = {
					id: this.curId,
					techEvaluation: this.techEvaluation,
					serviceEvaluation: this.serviceEvaluation,
					responEvaluation: this.responEvaluation,
					suggest: this.suggest
				}

				this.$u.api.postConfirmRepair(params).then(res => {
					if (res.msgCode === '000000') {
						this.modalContent = '维修确认成功'
						this.showModal = true
						this.list.splice(this.curIndex, 1) //删除这条记录
					} else {
						this.$refs.uTips.show({
							title: `维修确认失败，原因：${ res.message }`,
							type: 'error',
							duration: 2300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			approveConfirm(deviceId, index) {
				this.curIndex = index //记录序号，用于成功之后删除该条记录
				this.curId = deviceId
				this.suggest = ''
				this.showConfirm = true
			},
			rejectConfirm() {
				if (this.rejectReason.trim()) {
					const params = {
						id: this.curId,
						rejectReason: this.rejectReason
					}
					this.$u.api.postRebutRepair(params).then(res => {
						if (res.msgCode === '000000') {
							this.modalContent = '驳回成功'
							this.showModal = true
							this.list.splice(this.curIndex, 1) //删除这条记录
						} else {
							this.$refs.uTips.show({
								title: `驳回失败，原因：${ res.message }`,
								type: 'error',
								duration: 2300
							})
						}
					}).catch(err => {
						this.common.sysErrToast(this, err)
					})
				} else {
					this.$refs.uTips.show({
						title: '请输入驳回理由',
						type: 'warning',
						duration: 2300
					})
				}
			},
			approveReject(deviceId, index) {
				this.rejectReason = ''
				this.curId = deviceId
				this.curIndex = index
				this.showReject = true
			},
			getCompletedList() {
				const params = {
					query: {
						page: this.page,
						limit: this.limit
					},
					body: {}
				}

				this.$u.api.getForCloseListForDips(params).then(res => {
					if (res.msgCode === '000000') {
						this.list = [...this.list, ...res.data.data]
						this.page++

						if (!res.data.data.length || res.data.data.length < this.limit) this.loadStatus = 'nomore'
						if (!this.list.length) this.showNoData = true
					} else {
						this.$refs.uTips.show({
							title: `维修确认列表获取失败，原因：${ res.message }`,
							type: 'error',
							duration: 2300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			}
		},
		onReachBottom() {
			if (this.loadStatus != 'nomore') { //如果状态无无数据，则不再请求
				this.loadStatus = "loading"
				this.getCompletedList()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page-wrap {
		background-color: #ebebeb;
	}

	.scroll-wrap {
		min-height: 100%;
	}

	.card-head {
		color: #ffffff;
	}

	.btn-style {
		height: 60rpx;
		line-height: 60rpx;
		padding: 0 16rpx;
		text-indent: 20rpx;
		letter-spacing: 20rpx;
	}
</style>
