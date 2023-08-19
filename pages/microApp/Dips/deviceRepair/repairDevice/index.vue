<!-- dips → 设备维修 → 维修 -->
<template>
	<view class="sws-wh100 u-flex sws-flex-d-column">
		<view class="sws-w100 u-flex-1 sws-overflow-scroll-y">
			<view class="sws-w100 u-p-l-30 u-p-r-30 u-p-b-30">
				<view class="repair-info sws-overflow-hidden">
					<view class="u-m-t-20 u-flex u-row-right">
						<view class="repair-time u-flex u-p-l-28 u-p-r-28">
							<u-icon name="clock" size="40" class="u-m-r-10"></u-icon>
							<view v-show="usedTime">{{ usedTime }}</view>
						</view>
					</view>
					<u-cell-group :border="false" class="cell-group">
						<u-cell-item hover-class="none" :title-style="{color: '#ffffff'}"
							:value-style="{color: '#ffffff'}" bg-color="#2979ff" :arrow="false" :border-bottom="false"
							title="设备类型" :value="detail.deviceCategory">
						</u-cell-item>
						<u-cell-item hover-class="none" :title-style="{color: '#ffffff'}"
							:value-style="{color: '#ffffff'}" bg-color="#2979ff" :arrow="false" :border-bottom="false"
							title="设备编号" :value="detail.deviceCode">
						</u-cell-item>
						<u-cell-item hover-class="none" :title-style="{color: '#ffffff', 'padding-right': '20rpx'}"
							:value-style="{color: '#ffffff'}" bg-color="#2979ff" :arrow="false" :border-bottom="false"
							title="问题说明" :value="detail.question"></u-cell-item>
					</u-cell-group>
					<view class="repair-other-info u-flex u-row-between">
						<view>报修人：{{ detail.applicantName ? detail.applicantName : '-' }}</view>
						<view>联系电话：{{ detail.telephone ? detail.telephone : '-' }}</view>
					</view>
				</view>
			</view>
			<u-gap height="20" bg-color="#ebebeb"></u-gap>
			<view class="u-flex u-border-bottom u-border-top u-p-t-20 u-p-r-30 u-p-b-20 u-p-l-30">
				<view class="u-font-32">故障类型</view>
				<u-input v-model="detail.breakdownTypeName" type="select" input-align="right" :border="false"
					:disabled="true" placeholder="请选择故障类型" @click="getFaultInfo('fault_type')" />
			</view>
			<view class="u-flex u-border-bottom u-border-top u-p-t-20 u-p-r-30 u-p-b-20 u-p-l-30">
				<view class="u-font-32">故障原因</view>
				<u-input v-model="detail.breakdownReasonName" type="select" input-align="right" :border="false"
					:disabled="true" placeholder="请选择故障原因" @click="getFaultInfo('fault_reason')" />
			</view>
			<view class="u-border-bottom u-border-top u-p-t-20 u-p-r-30 u-p-b-20 u-p-l-30">
				<view class="u-font-32">原因说明</view>
				<u-input v-model="detail.reason" type="textarea" :border="false" placeholder="请输入问题原因" />
			</view>
			<view class="u-border-bottom u-p-t-20 u-p-r-30 u-p-b-20 u-p-l-30">
				<view class="u-font-32">过程说明</view>
				<u-input v-model="detail.process" type="textarea" :border="false" placeholder="请输入维修过程" />
			</view>
			<view class="u-flex u-row-between u-border-bottom u-p-t-20 u-p-r-30 u-p-b-20 u-p-l-30">
				<view class="u-font-32">备品</view>
				<view class="add-spare" @click="showPopup = true">
					<u-icon name="plus" size="24" class="u-m-r-10"></u-icon>
					<text>添加备品</text>
				</view>
			</view>
			<view v-show="spareList.length" class="u-p-20">
				<uni-swipe-action>
					<uni-swipe-action-item class="swipe-wrap u-m-b-20" :class="spare.delItem ? 'delItem' : ''"
						:right-options="options" v-for="(spare, index) in spareList" :key="index"
						@click="deal($event, spare)">
						<view class="spare-card u-flex u-col-top">
							<u-icon name="beijian" custom-prefix="sws-icon" color="#ffffff" size="52"></u-icon>
							<view class="u-flex-1 u-p-l-20">
								<view class="card-cont">{{ `${spare.itemName} (${spare.applyNum}${spare.unit})` }}
								</view>
								<view class="card-cont">{{ spare.itemCode }}</view>
								<view class="card-cont card-cont-other">剩余库存：{{ spare.qty }}{{ spare.unit }}</view>
							</view>
						</view>
					</uni-swipe-action-item>
				</uni-swipe-action>
			</view>
		</view>
		<view class="sws-w100 u-flex u-row-between u-p-t-28 u-p-b-28">
			<u-button class="btn-group" type="warning" size="medium" @click="tempSave">暂存</u-button>
			<u-button type="primary" size="medium" @click="commitRepair">维修完成</u-button>
		</view>
		<u-popup v-model="showPopup" mode="top">
			<view class="sws-w100">
				<u-search class="u-p-20" shape="square" placeholder="请输入备品编码/备品名称" v-model="spareCode"
					@custom="searchSpare" @search="searchSpare"></u-search>
				<u-card :border="false" margin="0"
					:head-style="{background: '#2979ff', padding: '20rpx 30rpx', 'min-height': '82rpx'}"
					:body-style="{padding: 0}" :show-foot="false" :full="true" border-radius="0">
					<view slot="head">
						<view class="card-head u-font-32">
							<view>
								<text>{{ spareModel.itemName }}</text>
								<text v-show="spareModel.itemCode">({{ spareModel.itemCode }})</text>
							</view>
						</view>
					</view>
					<u-cell-group slot="body" :border="false" class="spare-cell">
						<u-cell-item hover-class="none" :arrow="false" title="库存数量">
							<view slot="right-icon">
								<text>{{ dynamicQty(spareModel.qty) }}</text>
								<text>{{ spareModel.unit }}</text>
							</view>
						</u-cell-item>
						<u-cell-item hover-class="none" :arrow="false" title="最近库存">
							<view slot="right-icon">
								<text>{{ spareModel.positionName }}</text>
							</view>
						</u-cell-item>
						<u-cell-item hover-class="none" :arrow="false" title="需求数量" :border-bottom="false">
							<u-number-box v-show="+spareModel.qty" slot="right-icon" v-model="applyNum"
								@change="valChange" :max="+spareModel.qty"></u-number-box>
						</u-cell-item>
					</u-cell-group>
				</u-card>
				<view v-show="Object.keys(spareModel).length"
					class="btn-group sws-w100 u-flex u-row-between u-p-t-28 u-p-b-28">
					<u-button type="default" size="medium" @click="cancelPopup">取消</u-button>
					<u-button type="primary" size="medium" @click="commitPopup">确定</u-button>
				</view>
			</view>
		</u-popup>
		<u-select v-model="showSelect" :list="selectList" :title="selectTitle" @confirm="selectConfirm"></u-select>
		<u-modal v-model="showModal" :content="modalContent" @confirm="modalConfirm"></u-modal>
		<u-top-tips ref="uTips"></u-top-tips>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				detail: {},
				usedTime: 0,
				applyNum: 0,
				showPopup: false,
				modalContent: '',
				showModal: false,
				spareCode: '', //备品编码
				spareModel: {}, //查询的备品信息model
				spareModelList: [], //备品查询列表
				spareList: [], //添加的备品列表
				options: [{
					text: '删除',
					style: {
						backgroundColor: '#dd524d'
					}
				}],
				selectTitle: '',
				selectList: [],
				showSelect: false
			}
		},
		computed: {
			dynamicQty(qty) {
				return qty => {
					if (qty) {
						return qty - this.applyNum
					}
				}
			}
		},
		onLoad() {
			const _self = this
			const eventChannel = this.getOpenerEventChannel()
			eventChannel.on('acceptDataFromOpenerPage', ({
				params
			}) => {
				_self.detail = {
					...params
				}

				this.dynamicTime(params.applicantDate) //动态计时

				this.spareList = params.materials.reverse().map(item => {
					return {
						...item,
						delItem: false
					}
				})
			})
		},
		methods: {
			selectConfirm(arr) {
				const temp = arr[0]
				if (temp.extra === 'fault_type') {
					this.detail.breakdownTypeCode = temp.value
					this.detail.breakdownTypeName = temp.label
				} else {
					this.detail.breakdownReasonCode = temp.value
					this.detail.breakdownReasonName = temp.label
				}
			},
			getFaultInfo(type) {
				if (type === 'fault_reason' && !this.detail.breakdownTypeCode) {
					this.$refs.uTips.show({
						title: '请选择故障类型',
						type: 'warning',
						duration: 2300
					})
					return
				}
				const params = type === 'fault_type' ? type : this.detail.breakdownTypeCode

				this.$u.api.getFaultInfo(params).then(res => {
					if (res.msgCode === '000000' && res.data) {
						const list = res.data.map(({
							workbookCode,
							workbookContent
						}) => {
							return {
								label: workbookContent,
								value: workbookCode,
								extra: type
							}
						})
						this.selectTitle = type === 'fault_type' ? '请选择故障类型' : '请选择故障原因'
						this.selectList = list
						this.showSelect = true
					} else {
						this.$refs.uTips.show({
							title: `获取故障${ type === 'fault_type' ? '类型' : '原因' }失败，原因：${ res.message }`,
							type: 'error',
							duration: 2300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			deal(e, spare) {
				if (e.content.text === '删除') {
					spare.delItem = true
					spare.isReg = '0'
					e.content.text = '取消'
				} else {
					spare.delItem = false
					spare.isReg = '1'
					e.content.text = '删除'
				}
			},
			backToFirst(status = true) {
				uni.navigateBack({
					delta: 2
				})
				const eventChannel = this.getOpenerEventChannel()
				eventChannel.emit('toTellFirstPage', {
					status
				})
			},
			modalConfirm() {
				if (this.modalContent.includes('暂存成功')) {
					this.backToFirst(false) //暂存不删除item
				} else {
					this.backToFirst()
				}
			},
			tempSave() { //暂存
				const params = {
					id: this.detail.id,
					cfrId: this.detail.cfrId,
					question: this.detail.question ? this.detail.question : '',
					reason: this.detail.reason ? this.detail.reason : '',
					process: this.detail.process ? this.detail.process : '',
					breakdownTypeCode: this.detail.breakdownTypeCode ? this.detail.breakdownTypeCode : '',
					breakdownTypeName: this.detail.breakdownTypeName ? this.detail.breakdownTypeName : '',
					breakdownReasonCode: this.detail.breakdownReasonCode ? this.detail.breakdownReasonCode : '',
					breakdownReasonName: this.detail.breakdownReasonName ? this.detail.breakdownReasonName : '',
					materials: this.spareList
				}

				this.$u.api.postTempSaveRepair(params).then(res => {
					if (res.msgCode === '000000') {
						this.modalContent = '暂存成功'
						this.showModal = true
					} else {
						this.$refs.uTips.show({
							title: `暂存失败，原因：${ res.message }`,
							type: 'error',
							duration: 2300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			commitRepair() { //维修完成
				if (!this.detail.breakdownTypeCode) {
					this.$refs.uTips.show({
						title: '请选择故障类型',
						type: 'warning',
						duration: 2300
					})
					return
				}

				if (!this.detail.breakdownReasonCode) {
					this.$refs.uTips.show({
						title: '请选择故障原因',
						type: 'warning',
						duration: 2300
					})
					return
				}

				const params = {
					id: this.detail.id,
					cfrId: this.detail.cfrId,
					question: this.detail.question ? this.detail.question : '',
					reason: this.detail.reason ? this.detail.reason : '',
					process: this.detail.process ? this.detail.process : '',
					breakdownTypeCode: this.detail.breakdownTypeCode,
					breakdownTypeName: this.detail.breakdownTypeName,
					breakdownReasonCode: this.detail.breakdownReasonCode,
					breakdownReasonName: this.detail.breakdownReasonName,
					materials: this.spareList
				}

				this.$u.api.postCommitRepair(params).then(res => {
					if (res.msgCode === '000000') {
						this.modalContent = '维修完成'
						this.showModal = true
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
			dynamicTime(applicantDate) {
				var count = (new Date().getTime() - new Date(applicantDate).getTime()) / 1000
				this.timer = setInterval(() => {
					count++
					let day = parseInt(count / 60 / 60 / 24)
					let hour = parseInt((count % (24 * 3600)) / 3600)
					let minute = parseInt(count / 60) % 60
					let second = parseInt(count % 60)
					this.usedTime = (hour < 10 ? '0' + hour : hour) + ':' + (minute < 10 ? '0' + minute : minute) +
						':' + (second < 10 ? '0' + second : second)
					if (day !== 0) {
						this.usedTime = day + '天 ' + this.usedTime
					}
				}, 1000)
			},
			searchSpare() { //查询备品
				if (!this.spareCode.trim()) {
					this.$refs.uTips.show({
						title: '请输入备品编码',
						type: 'warning',
						duration: 2300
					})
					return
				}

				const params = {
					itemCode: this.spareCode.trim()
				}

				this.$u.api.getSpareInfoNew(params).then(res => {
					if (res.msgCode === '000000') {
						if (res.data.length) {
							this.spareModelList = res.data
							const list = res.data.map(item => {
								return {
									name: `${ item.itemName }(${ item.itemCode })`,
									value: item.itemCode,
									desc: `库存数量：${ item.qty }${ item.unit }`,
									checked: false
								}
							})
							this.goToSelected('请选择备件', list)
						} else {
							this.cancelPopup()
							setTimeout(() => {
								this.$refs.uTips.show({
									title: `未查询到编码为${this.spareCode}的备品`,
									type: 'warning',
									duration: 2300
								})
							}, 300)
						}
					} else {
						this.cancelPopup()
						setTimeout(() => {
							this.$refs.uTips.show({
								title: `备品信息获取失败，原因：${ res.message }`,
								type: 'warning',
								duration: 2300
							})
						}, 300)
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			goToSelected(title, list) { // title 选择列表页面标题  list 选择列表项 type赋值对象的属性名
				let _self = this
				let params = {
					title: title,
					items: list,
					hasSearch: true,
					isRadio: true
				}
				uni.navigateTo({
					url: '/pages/common/selectItems/index',
					events: {
						acceptDataFromOpenedPage(res) {
							_self.spareModel = _self.spareModelList.filter(({
								itemCode
							}) => itemCode == res.data[0].value)[0]
						}
					},
					success: function(res) {
						res.eventChannel.emit('acceptDataFromOpenerPage', params)
					}
				})
			},
			valChange(res) { //步进器
				this.applyNum = res.value
			},
			commitPopup() {
				if (!Object.keys(this.spareModel).length || !this.applyNum) {
					return
				}

				const spareModel = {
					...this.spareModel,
					qty: this.spareModel.qty - this.applyNum,
					applyNum: this.applyNum,
					delItem: false,
					isReg: '1',
					materialsId: this.spareModel.matId,
					purpose: '应急维修'
				}

				//遍历已添加的备品列表返回所有itemCode，并根据添加的itemCode判断是否添加过，如果添加过则覆盖原数据，如果没添加直接push
				const index = this.spareList.map(item => item.itemCode).indexOf(this.spareModel.itemCode)
				if (index != -1) {
					this.spareList.splice(index, 1, spareModel)
				} else {
					this.spareList.push(spareModel)
				}
				this.cancelPopup()
			},
			cancelPopup() {
				this.spareCode = ''
				this.applyNum = 0
				this.spareModel = {}
				this.showPopup = false
			}
		},
		onUnload() {
			clearTimeout(this.timer)
		}
	}
</script>

<style lang="scss" scoped>
	::v-deep .cell-group .u-cell {
		padding: 0rpx 32rpx;
	}

	::v-deep .repair-info .u-cell-item-box {
		background-color: $u-type-primary;
	}

	::v-deep .spare-cell .u-cell {
		padding: 12rpx 32rpx;
	}

	.repair-time {
		height: 56rpx;
		line-height: 56rpx;
		text-align: center;
		color: #ffffff;
		border-top-left-radius: 28rpx;
		border-bottom-left-radius: 28rpx;
		background-color: #e97a79;
	}

	.repair-info {
		background-color: $u-type-primary;
		border-radius: 16rpx;
	}

	.repair-other-info {
		height: 56rpx;
		line-height: 56rpx;
		background-color: rgba(255, 255, 255, .8);
		margin: 20rpx 0;
		padding: 0 20rpx;
	}

	.btn-group {
		text-indent: 20rpx;
		letter-spacing: 20rpx;
	}

	.add-spare {
		border: 2rpx dashed #909399;
		padding: 10rpx 20rpx;
	}

	.spare-card {
		padding: 20rpx 0 20rpx 30rpx;
	}

	.swipe-wrap {
		border-radius: 16rpx;
	}

	.swipe-wrap:nth-child(4n+1) {
		background-color: #18c3c0;
	}

	.swipe-wrap:nth-child(4n+2) {
		background-color: #774aa6;
	}

	.swipe-wrap:nth-child(4n+3) {
		background-color: #0092e5;
	}

	.swipe-wrap:nth-child(4n+4) {
		background-color: #df453c;
	}

	.card-cont {
		color: #ffffff;
		line-height: 40rpx;
	}

	.card-cont-other {
		opacity: .7;
	}

	.card-head {
		color: #ffffff;
	}

	.delItem {
		filter: grayscale(1)
	}
</style>
