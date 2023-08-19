<template>
	<view class="sws-wh100 u-flex sws-flex-d-column sws-bg-ebebeb">
		<view class="u-flex-1 sws-wh100 detail-wrap">
			<view class="sws-wh100 sws-overflow-scroll-y detail-wrap-scroll">
				<!-- 如果是上架 接续 需要展示设备信息 -->
				<view class="form-card" v-if="cellInfo.doType == 0 || cellInfo.doType == 2">
					<view class="sws-font-bold u-font-32 u-p-l-10 u-flex">
						<view class="u-flex-1">
							<u-icon name="lianjie" custom-prefix="sws-icon" color="#17393b"></u-icon>
							<text>设备信息</text>
						</view>
						<view v-show="type">
							<view class="u-flex sws-flex-d-column u-col-bottom" @click="toShowMoreForm">
								<u-icon name="more" custom-prefix="sws-icon" color="#2979ff" size="30" label-color="#2979ff"
									label="更多信息" label-size="26"></u-icon>
							</view>
						</view>
					</view>
					<u-form :model="form" ref="uForm" :error-type="['topTips']">
						<view>
							<u-form-item required :border-bottom="false" label="实验室">
								<u-input v-model="form.positionName" disabled placeholder="请选择实验室" @click="toSelectLab" />
								<u-icon slot="right" name="arrow-down" size="28" @click="toSelectLab"></u-icon>
							</u-form-item>
							<u-form-item v-show="type" required :border-bottom="false" label="设备名称">
								<u-input v-model="form.deviceName" disabled placeholder="请选择设备" @click="toSelectDevice" />
								<u-icon slot="right" name="arrow-down" size="28" @click="toSelectDevice"></u-icon>
							</u-form-item>
						</view>
					</u-form>
				</view>
				<view :class="computedFormCardClass()">
					<view class="sws-font-bold u-font-32 u-p-l-10 u-flex">
						<view class="u-flex-1">
							<u-icon name="lianjie" custom-prefix="sws-icon" color="#304156"></u-icon>
							<text>样品条码</text>
						</view>
						<view class="u-flex sws-flex-d-column u-col-bottom" @click="toShowTips">
							<u-icon name="teshutezheng" custom-prefix="sws-icon" color="#2979ff" size="30" label-color="#2979ff"
								label="测试方法" label-size="26" margin-left="0"></u-icon>
							<u-line color="#2979ff" length="95%" />
							<u-line color="#2979ff" length="95%" class="u-m-t-2" />
						</view>
					</view>
					<view>
						<view class="u-m-t-20" v-for="(item, index) in itemList" :key="index">
							<view class="item-card">
								<view class="u-flex">
									<u-checkbox @change="checkboxChange($event, item)" v-model="item.checked" name="" size="44"
										class="u-flex-1">
										<view>
											<view>
												<view class="u-font-24">样品条码</view>
												<view class="u-font-26 sws-font-bold u-m-t-2 u-main-color">{{ item.coding }}</view>
											</view>
										</view>
									</u-checkbox>
									<view class="item-btn">
										<u-button type="primary" class="item-btn-style"
											@click="toSubmitSingle(item)">{{ cellInfo.doTypeName }}</u-button>
									</view>
								</view>
								<view class="u-flex">
									<view class="u-p-r-20 u-font-28">{{ type ? '通道编码': '设备编码' }}</view>
									<!-- 如果是下架 暂停 编码不可以编辑 -->
									<view v-if="cellInfo.doType ==  1 || cellInfo.doType == 3" class="u-flex-1">{{ item.devicePassCode }}
									</view>
									<view v-else class="u-flex-1">
										<u-form-item v-if="type" :border-bottom="true" class="u-flex-1">
											<u-input v-model="item.passCode" disabled placeholder="请选择通道编码" height="50"
												placeholder-style="font-size: 24rpx;color: #c8c9cc;" @click="toShowCodeList(index)" />
											<u-icon slot="right" name="arrow-down" size="28" @click="toShowCodeList(index)"></u-icon>
										</u-form-item>
										<u-form-item v-else :border-bottom="true" class="u-flex-1">
											<u-input v-model="item.deviceName" disabled placeholder="请选择设备编码" height="50"
												placeholder-style="font-size: 24rpx;color: #c8c9cc;" @click="toSelectDevice(index)" />
											<u-icon slot="right" name="arrow-down" size="28" @click="toSelectDevice(index)"></u-icon>
										</u-form-item>
									</view>
									<view class="u-text-center show-more-btn" @click="toShowMore(item)">
										<u-icon :name="item.showMore ? 'arrow-up' : 'arrow-down'" color="#c0c4cc" label="更多"
											label-color="#c0c4cc" label-size="24rpx" label-pos="left"></u-icon>
									</view>
								</view>
								<view v-show="item.showMore" class="u-p-t-10 u-font-24" @click="toCloseMore(item)">
									<view class="u-m-t-8">
										<text class="u-tips-color">样品型号：</text>
										<text>{{ item.btBatteryTimes }}</text>
									</view>
									<view class="u-m-t-8">
										<text class="u-tips-color">设备要求：</text>
										<text>{{ item.deviceRange }}</text>
									</view>
									<view v-if="type" class="u-m-t-8">
										<text class="u-tips-color">测试项目：</text>
										<text
											v-if="cellInfo.doType">{{ item.arrangePlanRelationPo && item.arrangePlanRelationPo.testItemName }}</text>
										<text v-else>{{ item.testItemName }}</text>
									</view>
									<view class="u-flex u-m-t-8">
										<view class="u-flex-1" v-if="item.sampleRequestPersonPoList">
											<text class="u-tips-color">负责人：</text>
											<text>{{ item.sampleRequestPersonPoList && item.sampleRequestPersonPoList.map(user => user.userName).join('、') }}</text>
										</view>
										<view class="u-flex-1" v-if="type">
											<text class="u-tips-color">圈数/天数：</text>
											<text
												v-if="cellInfo.doType">{{ item.arrangePlanRelationPo && item.arrangePlanRelationPo.testStage }}</text>
											<text v-else>{{ item.testStage }}</text>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="u-flex btn-group">
			<view class="btn-group-all">
				<u-checkbox @change="selectAllChange" v-model="selectAll" name="" size="36">
					<view>
						<text>{{ selectAll ? '取消全选':'全选' }}</text>
						<text class="u-type-primary u-font-24"
							v-show="computedItemListLength()">（选中{{computedItemListLength()}}条)</text>
					</view>
				</u-checkbox>
			</view>
			<u-button type="primary" class="u-flex-1 btn-group-submit" @click="toSubmit">确认</u-button>
		</view>
		<u-popup v-model="showMoreForm" mode="center" width="85%" border-radius="16">
			<view class="device-popup">
				<view class="device-popup-header">{{pd.deviceName}}—设备信息</view>
				<view class="device-popup-content">
					<view>
						<text class="u-tips-color u-m-r-8">设备名称：</text>
						<text>{{pd.deviceName}}</text>
					</view>
					<view class="u-m-t-12">
						<text class="u-tips-color u-m-r-8">设备编码：</text>
						<text>{{pd.deviceCode}}</text>
					</view>
					<view class="u-m-t-12">
						<text class="u-tips-color u-m-r-8">充电电压：</text>
						<text>{{ pd.chargingVoltageLowerLimit }}</text>
						<text class="u-m-l-20 u-m-r-20">~</text>
						<text>{{ pd.chargingVoltageUpperLimit }}</text>
						<text class="u-font-24 u-type-info-disabled u-m-l-8">(V)</text>
					</view>
					<view class="u-m-t-12">
						<text class="u-tips-color u-m-r-8">放电电压：</text>
						<text>{{ pd.dischargeVoltageLowerLimit }}</text>
						<text class="u-m-l-20 u-m-r-20">~</text>
						<text>{{ pd.dischargeVoltageUpperLimit }}</text>
						<text class="u-font-24 u-type-info-disabled u-m-l-8">(V)</text>
					</view>
					<view class="u-m-t-12">
						<text class="u-tips-color u-m-r-8">电流范围：</text>
						<text>{{ pd.currentRangeLowerLimit }}</text>
						<text class="u-m-l-20 u-m-r-20">~</text>
						<text>{{ pd.currentRangeUpperLimit }}</text>
						<text class="u-font-24 u-type-info-disabled u-m-l-8">(A)</text>
					</view>
					<view class="u-m-t-12">
						<text class="u-tips-color u-m-r-8">温度范围：</text>
						<text>{{ pd.temperatureLowerLimit }}</text>
						<text class="u-m-l-20 u-m-r-20">~</text>
						<text>{{ pd.temperatureUpperLimit }}</text>
						<text class="u-font-24 u-type-info-disabled u-m-l-8">(℃)</text>
					</view>
					<view class="u-m-t-12">
						<text class="u-tips-color u-m-r-8">电流精度：</text>
						<text>{{pd.currentPrecision}}</text>
						<text class="u-font-24 u-type-info-disabled u-m-l-8">±(0.05%FS+0.05%RD)</text>
					</view>
					<view class="u-m-t-12">
						<text class="u-tips-color u-m-r-8">电压精度：</text>
						<text>{{pd.voltagePrecision}}</text>
						<text class="u-font-24 u-type-info-disabled u-m-l-8">±(0.05%FS+0.05%RD)</text>
					</view>
					<view class="u-m-t-12">
						<text class="u-tips-color u-m-r-8">恒压电流：</text>
						<text>{{pd.constantVoltageCurrent}}</text>
						<text class="u-font-24 u-type-info-disabled u-m-l-8">(mA)</text>
					</view>
				</view>
				<view class="device-popup-btn" @click="showMoreForm = false">关闭</view>
			</view>
		</u-popup>
		<u-select v-model="showSelect" :list="selectList" :title="selectTitle" @confirm="confirmSelect"></u-select>
		<u-modal v-model="showModal" :content="modalContent" :show-cancel-button="showCancelBtn"
			@confirm="modalConfirm"></u-modal>
		<u-modal v-model="showTips">
			<view class="tips-wrap">
				<text>{{ rawHtml }}</text>
			</view>
		</u-modal>
		<u-top-tips ref="uTips"></u-top-tips>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				type: 0, // OA单号 0(M开头 → 材料) 1 (C开头 → 电芯)
				cellInfo: {}, //前一个页面带来的基础信息
				form: {
					positionName: '',
					deviceName: '',
				},
				pd: {}, //更多设备信息
				showMoreForm: false,
				itemList: [],
				// doType: 0,
				// doTypeName: '上架',
				selectAll: false,
				showSelect: false,
				selectTitle: '',
				selectList: [],
				showModal: false,
				modalContent: '',
				showCancelBtn: false,
				singleFunc: ['postOnTheCabinet', 'postUnTheCabinet', 'postSampleContinue', 'postSampleStop'], // 0上架 1下架 2接续 3暂停
				batchFunc: ['postOnTheCabinetList', 'postUnTheCabinetList', 'postSampleContinueBatch',
					'postSampleStopBatch'
				], // 0上架 1下架 2接续 3暂停
				UnTheCabinetFunc: ['getItemListOfOnTheCabinet', 'getItemListOfUnTheCabinet', 'getItemListOfContinue',
					'getItemListOfStop'
				],
				passCodeList: [],
				deviceList: [],
				showTips: false,
				rawHtml: ''
			}
		},
		computed: {
			computedFormCardClass() {
				return () => {
					if (this.cellInfo.doType) {
						return 'form-card only-card'
					} else {
						return this.type ? 'form-card' : 'form-card single-form'
					}
				}
			},
			computedItemListLength() {
				return () => {
					return this.itemList.filter(item => item.checked).length
				}
			}
		},
		onLoad() {
			const _self = this
			this.eventChannel = this.getOpenerEventChannel()
			this.eventChannel.on('acceptDataFromOpenerPage', ({
				data
			}) => {

				_self.cellInfo = { //cellInfo.doType 0上架 1下架 2接续 3暂停
					...data
				}

				uni.setNavigationBarTitle({
					title: data.doTypeName
				})

				if (data.fdApplyNo.startsWith('M')) { // OA单号 0(M开头 → 材料) 1 (C开头 → 电芯)
					_self.type = 0
				} else {
					_self.type = 1
				}

				_self.initData()
			})
		},
		methods: {
			toPostSingleData() { // 0上架 1下架 2接续 3暂停
				this.$u.api[this.singleFunc[this.cellInfo.doType]](this.currItem).then(res => {
					if (res.msgCode === '000000') {
						this.modalContent = `${ this.cellInfo.doTypeName }成功!`
						this.showModal = true
					} else {
						this.$refs.uTips.show({
							title: `${ this.cellInfo.doTypeName }失败，原因：${ res.message }`,
							type: 'error',
							duration: 2300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			toPostData() {
				const params = this.itemList.filter(item => item.checked)

				this.$u.api[this.batchFunc[this.cellInfo.doType]](params).then(res => {
					if (res.msgCode === '000000') {
						this.modalContent = `${ this.cellInfo.doTypeName }成功!`
						this.showModal = true
					} else {
						this.$refs.uTips.show({
							title: `${ this.cellInfo.doTypeName }失败，原因：${ res.message }`,
							type: 'error',
							duration: 2300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			modalConfirm() {
				if (this.modalContent.includes('选中的样品')) { //批量提交
					this.toPostData()
				} else if (this.modalContent.includes('此样品（样品条码')) { //单条确认
					this.toPostSingleData()
				} else if (this.modalContent.includes('成功')) {
					this.eventChannel.emit('acceptDataFromOpenedPage', {
						...this.currItem
					})
					uni.navigateBack()
				}
			},
			confirmSelect(arr) {
				const {
					label,
					value,
					extra
				} = {
					...arr[0]
				}
				if (extra === 'lab') {
					this.form.positionName = label
					this.form.laboratoryId = value
				} else if (extra === 'device') {
					if (this.type) {
						this.form.deviceName = label
						this.form.deviceId = value
						this.pd = {
							...this.deviceList.filter(item => item.id === value)[0]
						}

						//切换设备，清空条码已选择的通道数据
						this.itemList.forEach(item => {
							item.passCode = ''
						})
						//测试设备需要获取通道信息 
						//this.pd.deviceTypeId 5 辅助仪器 4 环境设备 3 测试设备 2 辅助设备 1 生产设备
						this.getDeviceInfoForTdms()
					} else {
						this.itemList[this.currItemIndex].deviceName = label
						this.itemList[this.currItemIndex].deviceId = value
						this.itemList[this.currItemIndex].deviceCode = this.deviceList.filter(item => item.id === value)[0]
							.deviceCode
					}
				} else if (extra === 'passCode') {
					this.itemList[this.currPassCodeIndex].passCode = label
				}
			},
			initData() {
				if (this.cellInfo.doType === 0 || this.cellInfo.doType === 2) {
					this.getLabListForTdms() //查询测试实验室列表
				}
				this.getItemList()
			},
			getItemList() {
				this.$u.api[this.UnTheCabinetFunc[this.cellInfo.doType]](this.cellInfo.oaItemId).then(res => {
					if (res.msgCode === '000000' && res.data) {
						this.itemList = res.data.map(item => {
							let arrangePlanRelationPo = {
								...item.arrangePlanRelationPo
							}
							if (this.cellInfo.doType === 1) {
								arrangePlanRelationPo.arrangePlanId = 0
							}

							let resData = {
								...item,
								passCode: item.devicePassCode,
								arrangePlanRelationPo,
								processPlanExecutePo: {
									...arrangePlanRelationPo,
									"fdApplyNo": this.cellInfo.fdApplyNo,
									"coding": item.coding,
									"btProjectNumber": this.cellInfo.btProjectNumber
								}, //测试计划
								itemId: this.cellInfo.itemId,
								checked: false, //选择框
								showMore: false //是否显示更多信息
							}

							if (this.cellInfo.doType === 1) {
								resData.isHandle = this.cellInfo.beforeHandle
							}

							return resData
						})
					} else {
						this.$refs.uTips.show({
							title: `${ this.cellInfo.doTypeName }数据获取失败，原因：${ res.message }`,
							type: 'error',
							duration: 2300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			getLabListForTdms() {
				this.$u.api.getLabListForTdms(this.cellInfo.itemId).then(async res => {
					if (res.msgCode === '000000' && res.data) {
						this.labList = res.data
						if (res.data.length) {
							this.form.positionName = res.data[0].positionName
							this.form.laboratoryId = res.data[0].id
							this.deviceList = await this.getDeviceListForTdms()
							if (this.cellInfo.doType === 2 && this.itemList.length) { //如果是接续，且条码列表查询完成了，复现设备和通道数据
								const device = this.deviceList.filter(item => {
									return item.id == this.itemList[0].deviceId
								})[0]
								this.form.deviceName = `${device.deviceName}(${device.deviceCode})`
								this.form.deviceId = device.id;
								this.pd = {
									...device
								}
								this.getDeviceInfoForTdms()
							}
						}
					} else {
						this.$refs.uTips.show({
							title: `测试实验室数据获取失败，原因：${ res.message }`,
							type: 'error',
							duration: 2300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			getDeviceListForTdms() {
				return new Promise(resolve => {
					const params = {
						itemId: this.cellInfo.itemId,
						laboratoryId: this.form.laboratoryId
					}
					this.$u.api.getDeviceListForTdms(params).then(res => {
						if (res.msgCode === '000000' && res.data) {
							resolve(res.data)
						} else {
							this.$refs.uTips.show({
								title: `设备数据获取失败，原因：${ res.message }`,
								type: 'error',
								duration: 2300
							})
							resolve([])
						}
					}).catch(err => {
						resolve([])
						this.common.sysErrToast(this, err)
					})
				})
			},
			getDeviceInfoForTdms() {
				return new Promise(resolve => {
					this.$u.api.getDeviceInfoForTdms(this.form.deviceId).then(res => {
						if (res.msgCode === '000000' && res.data) {
							this.passCodeList = res.data
							resolve(res.data)
						} else {
							this.$refs.uTips.show({
								title: `通道数据获取失败，原因：${ res.message }`,
								type: 'error',
								duration: 2300
							})
							resolve([])
						}
					}).catch(err => {
						resolve([])
						this.common.sysErrToast(this, err)
					})
				})
			},
			toSelectLab() {
				this.selectTitle = '请选择实验室'
				this.selectList = this.labList.map(item => {
					return {
						label: item.positionName,
						value: 44,
						extra: 'lab'
					}
				})
				this.showSelect = true
			},
			async toSelectDevice(index) {
				if (!this.form.laboratoryId) {
					this.$refs.uTips.show({
						title: '请选择测试实验室',
						type: 'warning',
						duration: 2300
					})
					return
				}

				if (!this.deviceList.length) {
					this.deviceList = await this.getDeviceListForTdms()
				}

				if (!this.type) this.currItemIndex = index // 如果是M开头（材料） 则记录当前条码的下标
				this.selectTitle = '请选择设备'
				this.selectList = this.deviceList.map(item => {
					return {
						label: `${ item.deviceName }(${ item.deviceCode })`,
						value: item.id,
						extra: 'device'
					}
				})
				this.showSelect = true
			},
			toShowCodeList(index) {
				if (!this.form.deviceId) {
					this.$refs.uTips.show({
						title: '请选择设备',
						type: 'warning',
						duration: 2300
					})
					return
				}
				this.currPassCodeIndex = index
				this.selectTitle = '请选择通道编码'
				this.selectList = this.passCodeList.map(item => {
					return {
						label: item.passCode,
						value: item.id,
						extra: 'passCode'
					}
				})
				this.showSelect = true
			},
			toSubmitSingle(item) {
				if (!this.cellInfo.doType && this.type && !this.form.deviceId) {
					this.$refs.uTips.show({
						title: '请选择设备',
						type: 'warning',
						duration: 2300
					})
					return
				}

				if (!this.type && !item.deviceId) {
					this.$refs.uTips.show({
						title: '请选择设备编码',
						type: 'warning',
						duration: 2300
					})
					return
				}

				if (this.type && this.pd.deviceTypeId === 3) { //如果是Cell 设备类型是 测试设备  则需要校验通道编号
					if (!item.passCode) {
						this.$refs.uTips.show({
							title: '请选择通道编码',
							type: 'warning',
							duration: 2300
						})
						return
					}
				}

				this.currItem = item
				this.showCancelBtn = true
				this.modalContent = `是否确认${ this.cellInfo.doTypeName }此样品（样品条码：${ item.coding }）？`
				this.showModal = true
			},
			toSubmit() {
				const checkedArr = this.itemList.filter(item => item.checked) //获取选中的样品条码

				if (!this.cellInfo.doType && this.type && !this.form.deviceId) {
					this.$refs.uTips.show({
						title: '请选择设备',
						type: 'warning',
						duration: 2300
					})
					return
				}

				if (!checkedArr.length) {
					this.$refs.uTips.show({
						title: '请选择样品条码',
						type: 'warning',
						duration: 2300
					})
					return
				}

				if (this.type && this.pd.deviceTypeId === 3) { //如果是Cell 设备类型是 测试设备  则需要校验通道编号
					if (checkedArr.filter(item => !item.passCode).length) {
						this.$refs.uTips.show({
							title: '请选择通道编码',
							type: 'warning',
							duration: 2300
						})
						return
					}
				}

				this.showCancelBtn = true
				this.modalContent = `是否确认${ this.cellInfo.doTypeName }选中的样品？`
				this.showModal = true
			},
			toShowMoreForm() {
				if (this.form.deviceName) {
					this.showMoreForm = true
				}
			},
			toShowTips() {
				if (this.cellInfo.btTestMethod) {
					this.rawHtml = this.cellInfo.btTestMethod
				} else {
					this.rawHtml = '暂无测试方法'
				}
				this.showTips = true
			},
			toShowMore(item) {
				if (item.showMore) {
					item.showMore = false
					return
				}

				this.itemList.forEach(item => item.showMore = false)
				this.$nextTick(() => {
					item.showMore = true
				})
			},
			toCloseMore(item) {
				item.showMore = false
			},
			checkboxChange({
				value
			}, item) {
				item.checked = value
				this.selectAll = this.itemList.every(item => item.checked)
			},
			selectAllChange({
				value
			}) {
				this.selectAll = value
				this.itemList.forEach(item => item.checked = value)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.device-popup {
		overflow: hidden;

		&-header {
			background-color: #2979ff;
			font-size: 28rpx;
			color: #fff;
			text-align: center;
			padding: 20rpx 10rpx;
		}

		&-content {
			font-size: 30rpx;
			padding: 20rpx 40rpx;
		}

		&-btn {
			background-color: #2979ff;
			font-size: 28rpx;
			color: #fff;
			letter-spacing: 20rpx;
			text-indent: 20rpx;
			text-align: center;
			font-size: 30rpx;
			height: 80rpx;
			line-height: 80rpx;
		}
	}

	.detail-wrap {
		padding: 20rpx 20rpx 0 20rpx;
		overflow: hidden;

		&-scroll {
			border-radius: 16rpx;
		}
	}

	.form-card {
		width: 100%;
		background-color: #fff;
		border-radius: 16rpx;
		padding: 20rpx 20rpx 0 20rpx;
		margin-bottom: 20rpx;
		overflow: hidden;
	}

	.form-card:last-child {
		padding-bottom: 20rpx;
		margin-bottom: 0;
		min-height: calc(100% - 240rpx);
	}

	.form-card.only-card {
		min-height: 100%;
	}

	.form-card.single-form {
		min-height: calc(100% - 152rpx);
	}

	.item-card {
		box-shadow: 0 0 4rpx 2rpx #ebebeb;
		border-radius: 16rpx;
		overflow: hidden;
		min-height: 170rpx;
		padding: 20rpx;

		.item-btn {
			display: flex;
			flex-direction: column;

			&-style {
				height: 60rpx;
				width: 120rpx;
				letter-spacing: 5px;
				text-indent: 5px;
			}
		}
	}

	.show-more-btn {
		width: 120rpx;
		height: 50rpx;
		line-height: 50rpx;
		margin-left: 10rpx;
	}

	::v-deep .detail-wrap .u-checkbox {
		line-height: initial !important;
	}

	::v-deep .detail-wrap .u-checkbox .u-checkbox__icon-wrap {
		margin: 0 20rpx 0 10rpx !important;
	}

	::v-deep .detail-wrap .u-checkbox .u-checkbox__label {
		margin-left: 0 !important;
		flex: 1 !important;
	}


	::v-deep .detail-wrap .form-card .u-form-item {
		padding: 10rpx !important;
	}

	::v-deep .detail-wrap .form-card:first-child .u-form-item {
		padding: 10rpx 10rpx 10rpx 30rpx !important;
	}

	.btn-group {
		width: 100%;
		padding: 20rpx;

		&-all {
			width: 400rpx;
			height: 80rpx;
			line-height: 78rpx;
			border-radius: 10rpx;
			background-color: #fff;
			margin-right: 20rpx;
			padding-left: 40rpx;
		}

		&-submit {
			letter-spacing: 20rpx;
			text-indent: 20rpx;
		}
	}

	.tips-wrap {
		padding: 30rpx;
		max-height: 800rpx;
		min-height: 500rpx;
		overflow-y: scroll;
	}
</style>