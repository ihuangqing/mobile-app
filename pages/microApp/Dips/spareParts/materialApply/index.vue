<!-- DIPS → 备品备件 → 物料申请 -->
<template>
	<view class="sws-wh100 u-flex sws-flex-d-column">
		<view class="sws-w100 sws-overflow-scroll-y u-flex-1 u-p-l-20 u-p-r-20 u-p-b-30">
			<u-form ref="uForm" :model="model" label-width="150" label-align="center">
				<u-form-item required label="物料编码" :border-bottom="false" prop="itemCode">
					<u-input :border="true" placeholder="请输入/扫描物料编码" v-model="model.itemCode" type="text"
						:focus="setFocus">
					</u-input>
					<u-icon slot="right" name="scan" size="56" color="#2979ff" @click="scanCode"></u-icon>
				</u-form-item>
				<u-form-item required label="库位" :border-bottom="false">
					<u-input :border="true" placeholder="请选择库位" v-model="model.positionName" type="select"
						@click="toShowPosition">
					</u-input>
				</u-form-item>
				<u-form-item v-show="model.itemCode" label="库存数量" :border-bottom="false">
					<u-input :border="true" disabled placeholder="" :value="model.sumStockQty" type="number">
					</u-input>
				</u-form-item>
				<u-form-item required label="线体" :border-bottom="false">
					<u-input :border="true" placeholder="请选择线体" v-model="model.lineName" type="select"
						@click="toShowLine">
					</u-input>
				</u-form-item>
				<u-form-item required label="设备类型" :border-bottom="false">
					<u-input :border="true" placeholder="请选择设备类型" v-model="model.deviceCategory" type="select"
						@click="toShowDeviceType">
					</u-input>
				</u-form-item>
				<u-form-item required label="用途类型" :border-bottom="false">
					<u-input :border="true" placeholder="请选择用途类型" v-model="model.purposeType" type="select"
						@click="toShowUsage">
					</u-input>
				</u-form-item>
				<u-form-item label="设备编码" :border-bottom="false">
					<u-input :border="true" placeholder="请选择设备编码" v-model="model.deviceName" type="select"
						@click="toShowDeviceCode">
					</u-input>
				</u-form-item>
				<u-form-item label="部件编码" :border-bottom="false">
					<u-input :border="true" placeholder="请选择部件编码" v-model="model.unitCode" type="select"
						@click="toShowUnitCode">
					</u-input>
				</u-form-item>
				<u-form-item label="备件位置码" :border-bottom="false">
					<u-input :border="true" placeholder="请选择备件位置码" v-model="model.materialLocationCode" type="select"
						@click="toShowLocationCode">
					</u-input>
					<u-icon slot="right" name="scan" size="56" color="#2979ff" @click="scanCode('mlc')"></u-icon>
				</u-form-item>
				<u-form-item required label="需求数量" :border-bottom="false">
					<u-input :border="true" :disabled="isEdit" placeholder="请输入需求数量" v-model="model.applyNum"
						type="number">
					</u-input>
				</u-form-item>
				<u-form-item label="备注" :border-bottom="false">
					<u-input height="88" type="textarea" :border="true" placeholder="请输入备注" v-model="model.purpose" />
				</u-form-item>
				<u-form-item label="申请人" :border-bottom="false">
					<u-input :border="true" disabled placeholder="" :value="userInfo.userName+'('+userInfo.account+')'"
						type="text">
					</u-input>
				</u-form-item>
				<u-form-item label="厂区" :border-bottom="false">
					<u-input :border="true" disabled placeholder="" :value="factoryName" type="text">
					</u-input>
				</u-form-item>
			</u-form>
		</view>
		<view class="btn-group sws-w100 u-flex u-row-between u-p-t-28 u-p-b-28">
			<u-button type="default" class="sws-line-h-repair" size="medium" @click="reset">重置</u-button>
			<u-button type="primary" class="sws-line-h-repair" size="medium" @click="commit">确认</u-button>
		</view>
		<u-select v-model="showSelect" :list="selectList" @confirm="confirmLine"></u-select>
		<u-modal v-model="showModal" :content="modalContent" @confirm="modalConfirm"></u-modal>
		<u-top-tips ref="uTips"></u-top-tips>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'

	export default {
		data() {
			return {
				model: {
					itemCode: '',
					applyNum: '',
					positionId: '',
					positionName: '',
					lineName: '',
					lineId: '',
					purpose: '',
					sumStockQty: '', //库存总数    库存总数 = 入库总数 - 锁定数量
					deviceCategory: '',
					deviceCategoryId: '',
					purposeType: '',
					deviceCode: '',
					deviceName: '',
					unitCode: '',
					materialLocationCode: ''
				},
				setFocus: false,
				isEdit: false, //需求数量是否可编辑
				positionList: [],
				rules: {
					itemCode: [{
						asyncValidator: async (rule, value, callback) => {
							if (value) { //空值判断放在确认方法中处理
								let materialInfo = await this.baseData.getMaterialInfo(this, value)
								if (Object.keys(materialInfo).length) {
									this.model.matId = materialInfo.id
									this.model.sumStockQty = materialInfo.sumStockQty
									if (materialInfo.materialStocks) { // 获取库位信息
										this.positionList = materialInfo.materialStocks.map(({
											positionName: label,
											positionId: value,
											qty: qty
										}) => {
											return {
												label,
												value,
												qty,
												extra: 'position'
											}
										})
									}
									this.controlMode = materialInfo.controlMode
									//如果管控方式是个体，则申领数量只能为1
									if (materialInfo.controlMode && materialInfo.controlMode === 'entity') {
										this.model.applyNum = 1
										this.isEdit = true
									}
									callback()
								} else {
									this.$refs.uTips.show({
										title: '此物料编码不存在，请重新输入/扫描',
										type: 'warning',
										duration: 2300
									})
								}
							}
						},
						trigger: 'blur',
					}]
				},
				lineList: [],
				deviceCategoryList: [],
				purposeTypeList: [{
						'label': '应急维修',
						'value': '应急维修',
						'extra': 'purposeType'
					},
					{
						'label': '改善',
						'value': '改善',
						'extra': 'purposeType'
					},
					{
						'label': 'TPM保养',
						'value': 'TPM保养',
						'extra': 'purposeType'
					},
					{
						'label': '其他',
						'value': '其他',
						'extra': 'purposeType'
					}
				],
				deviceCodeList: [],
				unitCodeList: [],
				locationCodeList: [],
				modalContent: '',
				showModal: false,
				showSelect: false,
				selectList: [],
			}
		},
		computed: mapState(['factoryName', 'userInfo']),
		onLoad(options) {
			if (Object.keys(options).length) {
				this.model.itemCode = options.itemCode
				this.setFocus = true
			}
		},
		onReady() {
			this.$refs.uForm.setRules(this.rules)
		},
		methods: {
			getDataByLocationCode() {
				const params = {
					positionCode: this.model.materialLocationCode
				}
				this.$u.api.getDataByLocationCode(params).then(res => {
					if (res.msgCode === '000000') {
						const data = res.data
						try {
							if(!this.model.itemCode){
								this.model.itemCode = data.matCode
							}
							if (data.matCode == this.model.itemCode) {
								this.model.lineId = data.lineId
								this.model.lineName = data.lineName
								this.model.deviceCategory = data.deviceCategory
								this.model.deviceCategoryId = data.deviceCategoryId
								this.model.unitCode = data.unitCode
								this.model.deviceName = data.deviceName
								this.model.deviceCode = data.deviceCode
								this.isEdit = true
								this.model.applyNum = 1
							} else {
								this.$refs.uTips.show({
									title: `当前位置无法申领${this.model.itemCode}备件`,
									type: 'warning',
									duration: 2300
								})
								this.model.materialLocationCode = ''
							}
						} catch (e) {
							this.model.materialLocationCode = ''
							this.$refs.uTips.show({
								title: `未查到关联信息`,
								type: 'warning',
								duration: 2300
							})
						}
					} else {
						this.model.materialLocationCode = ''
						this.$refs.uTips.show({
							title: `查询失败，原因：${ res.message }`,
							type: 'error',
							duration: 3300
						})
					}
				}).catch(err => {
					this.model.materialLocationCode = ''
					this.common.sysErrToast(this, err)
				})
			},
			confirmLine(arr) {
				const {
					label,
					value,
					extra
				} = arr[0]
				let model = this.model
				switch (extra) {
					case 'position':
						model.positionName = label
						model.positionId = value
						model.sumStockQty = this.positionList.filter((item) => item.value == value)[0].qty
						break;
					case 'line':
						model.lineId = value
						model.lineName = label
						// 修改拉线重置设备类型、设备编码、部件编码、位置码
						model.deviceCategory = ''
						model.deviceCategoryId = ''
						this.deviceCategoryList = []
						model.deviceName = ''
						model.deviceCode = ''
						this.deviceCodeList = []
						this.unitCodeList = []
						model.unitCode = ''
						this.locationCodeList = []
						model.materialLocationCode = ''
						break;
					case 'deviceCategory':
						model.deviceCategory = label
						model.deviceCategoryId = value
						// 修改设备类型重置设备编码、部件编码、位置码
						model.deviceName = ''
						model.deviceCode = ''
						this.deviceCodeList = []
						this.unitCodeList = []
						model.unitCode = ''
						this.locationCodeList = []
						model.materialLocationCode = ''
						break;
					case 'purposeType':
						model.purposeType = value
						break;
					case 'deviceCode':
						if (value === 'clear') {
							model.deviceName = ''
							model.deviceCode = ''
						} else {
							model.deviceName = label
							model.deviceCode = value
						}
						// 修改设备编码重置部件编码、位置码
						this.unitCodeList = []
						model.unitCode = ''
						this.locationCodeList = []
						model.materialLocationCode = ''
						break;
					case 'unitCode':
						if (value === 'clear') {
							model.unitCode = ''
						} else {
							model.unitCode = value
						}
						// 修改部件编码重置位置码
						this.locationCodeList = []
						model.materialLocationCode = ''
						break;
					case 'materialLocationCode':
						if (value === 'clear') {
							model.materialLocationCode = ''
							// 如果设备备件位置码删除或者未填，则申领数量允许编辑( 此处应该排除管控方式为个体的)
							if (this.controlMode !== 'entity') this.isEdit = false
						} else {
							//如果填写了设备备件位置码，则申领数量初始化为1且不允许编辑
							model.materialLocationCode = value
							this.model.applyNum = 1
							this.isEdit = true
						}
						break;
				}
			},
			async toShowPosition() {
				if (!this.positionList.length) {
					let materialInfo = await this.baseData.getMaterialInfo(this, this.model.itemCode)
					if (materialInfo.materialStocks) { // 获取库位信息
						this.positionList = materialInfo.materialStocks.map(({
							positionName: label,
							positionId: value,
							qty: qty
						}) => {
							return {
								label,
								value,
								qty,
								extra: 'position'
							}
						})
					}
				}
				this.selectList = this.positionList
				this.showSelect = true
			},
			toShowLine() {
				if (!this.lineList.length) {
					const params = {
						state: 1
					}
					this.$u.api.getLinesForApply(params).then(res => {
						if (res.msgCode === '000000') {
							this.lineList = res.data.map(({
								lineName: label,
								id: value
							}) => {
								return {
									label,
									value,
									extra: 'line'
								}
							})
							this.selectList = this.lineList
							this.showSelect = true
						} else {
							this.$refs.uTips.show({
								title: `线体获取失败，原因：${ res.message }`,
								type: 'error',
								duration: 2300
							})
						}
					}).catch(err => {
						this.common.sysErrToast(this, err)
					})
				} else {
					this.selectList = this.lineList
					this.showSelect = true
				}
			},
			toShowDeviceType() {
				if (!this.model.lineId) {
					this.$refs.uTips.show({
						title: '请选择线体',
						type: 'warning',
						duration: 2300
					})
					return
				}
				if (!this.deviceCategoryList.length) {
					const params = {
						state: '1'
					}
					this.$u.api.getDeviceTypeList(params).then(res => {
						if (res.msgCode === '000000' && res.data) {
							this.deviceCategoryList = res.data.map(({
								deviceCategory: label,
								id: value
							}) => {
								return {
									label,
									value,
									extra: 'deviceCategory'
								}
							})
							this.selectList = this.deviceCategoryList
							this.showSelect = true
						} else {
							this.$refs.uTips.show({
								title: `设备类型获取失败，原因：${ res.message }`,
								type: 'error',
								duration: 2300
							})
						}
					}).catch(err => {
						this.common.sysErrToast(this, err)
					})
				} else {
					this.selectList = this.deviceCategoryList
					this.showSelect = true
				}
			},
			toShowUsage() {
				this.selectList = this.purposeTypeList
				this.showSelect = true
			},
			toShowDeviceCode() {
				let checkArr = [{
					tips: '请选择线体',
					value: this.model.lineId
				}, {
					tips: '请选择设备类型',
					value: this.model.deviceCategoryId
				}]
				if (this.common.checkNotNull(this, checkArr)) {
					if (!this.deviceCodeList.length) {
						const params = {
							lineId: this.model.lineId,
							categoryId: this.model.deviceCategoryId
						}
						this.$u.api.getDeviceCodeList(params).then(res => {
							if (res.msgCode === '000000' && res.data) {
								this.deviceCodeList = res.data.map(({
									deviceName: label,
									deviceCode: value
								}) => {
									return {
										label: label + '(' + value + ')',
										value,
										extra: 'deviceCode'
									}
								})
								this.deviceCodeList = [{
									label: '清除数据',
									value: 'clear',
									extra: 'deviceCode'
								}, ...this.deviceCodeList]
								this.selectList = this.deviceCodeList
								this.showSelect = true
							} else {
								this.$refs.uTips.show({
									title: `设备编码获取失败，原因：${ res.message }`,
									type: 'error',
									duration: 2300
								})
							}
						}).catch(err => {
							this.common.sysErrToast(this, err)
						})
					} else {
						this.selectList = this.deviceCodeList
						this.showSelect = true
					}
				}
			},
			toShowUnitCode() {
				if (this.model.deviceCode) {
					if (!this.unitCodeList.length) {
						const params = {
							deviceCode: this.model.deviceCode,
							matId: this.model.matId
						}
						this.$u.api.getUnitCodeList(params).then(res => {
							if (res.msgCode === '000000') {
								this.unitCodeList = res.data.map(({
									unitCode: value
								}) => {
									return {
										label: value,
										value,
										extra: 'unitCode'
									}
								})
								this.unitCodeList = [{
									label: '清除数据',
									value: 'clear',
									extra: 'unitCode'
								}, ...this.unitCodeList]
								this.selectList = this.unitCodeList
								this.showSelect = true
							} else {
								this.$refs.uTips.show({
									title: `部件码获取失败，原因：${ res.message }`,
									type: 'error',
									duration: 2300
								})
							}
						}).catch(err => {
							this.common.sysErrToast(this, err)
						})
					} else {
						this.selectList = this.unitCodeList
						this.showSelect = true
					}
				} else {
					this.$refs.uTips.show({
						title: '请选择设备编码',
						type: 'warning',
						duration: 2300
					})
				}
			},
			toShowLocationCode() {
				if (this.model.unitCode) {
					if (!this.locationCodeList.length) {
						const params = {
							unitCode: this.model.unitCode,
							matId: this.model.matId
						}
						this.$u.api.getLocationCodeList(params).then(res => {
							if (res.msgCode === '000000') {
								this.locationCodeList = res.data.map(({
									matPositionCode: value
								}) => {
									return {
										label: value,
										value,
										extra: 'materialLocationCode'
									}
								})
								this.locationCodeList = [{
									label: '清除数据',
									value: 'clear',
									extra: 'materialLocationCode'
								}, ...this.locationCodeList]
								this.selectList = this.locationCodeList
								this.showSelect = true
							} else {
								this.$refs.uTips.show({
									title: `备件位置码获取失败，原因：${ res.message }`,
									type: 'error',
									duration: 2300
								})
							}
						}).catch(err => {
							this.common.sysErrToast(this, err)
						})
					} else {
						this.selectList = this.locationCodeList
						this.showSelect = true
					}
				} else {
					this.$refs.uTips.show({
						title: '请选择部件编码',
						type: 'warning',
						duration: 2300
					})
				}
			},
			async scanCode(flag) {
				const code = await this.common.scanCode()
				if (flag && flag === 'mlc') {
					this.model.materialLocationCode = code
					this.getDataByLocationCode()
				} else {
					this.model.itemCode = code
					this.setFocus = true
				}
			},
			commit() {
				const model = this.model
				let checkArr = [{
					tips: '请输入物料编码',
					value: model.itemCode
				}, {
					tips: '请选择库位',
					value: this.model.positionId
				}, {
					tips: '请选择线体',
					value: this.model.lineId
				}, {
					tips: '请选择设备类型',
					value: this.model.deviceCategoryId
				}, {
					tips: '请选择用途类型',
					value: this.model.purposeType
				}, {
					tips: '请输入需求数量',
					value: model.applyNum
				}]
				if (this.common.checkNotNull(this, checkArr)) {
					if (model.applyNum > model.sumStockQty) {
						this.$refs.uTips.show({
							title: '需求数量不能大于库存总数',
							type: 'warning',
							duration: 2300
						})
						return
					}
					const params = [{
						...this.model,
						qty:this.model.sumStockQty
					}]

					this.$u.api.postMaterialApply(params).then(res => {
						if (res.msgCode === '000000') {
							this.modalContent = '物料申请成功'
							this.showModal = true
						} else {
							this.$refs.uTips.show({
								title: `物料申请失败，原因：${res.message}`,
								type: 'error',
								duration: 2300
							})
						}
					}).catch(err => {
						this.common.sysErrToast(this, err)
					})
				}
			},
			modalConfirm() {
				this.reset()
				uni.navigateBack()
			},
			reset() {
				this.model = {
					itemCode: '',
					applyNum: '',
					positionId: '',
					positionName: '',
					lineName: '',
					lineId: '',
					purpose: '',
					sumStockQty: '',
					deviceCategory: '',
					deviceCategoryId: '',
					purposeType: '',
					deviceCode: '',
					deviceName: '',
					unitCode: '',
					materialLocationCode: ''
				}
				this.positionList = []
				this.lineList = []
				this.deviceCategoryList = []
				this.deviceCodeList = []
				this.unitCodeList = []
				this.locationCodeList = []
			}
		},
		onBackPress() {
			if (this.showSelect) {
				this.showSelect = false
				return true
			}
		}
	}
</script>

<style lang="scss" scoped>
	.btn-group {
		text-indent: 20rpx;
		letter-spacing: 20rpx;
	}
</style>
