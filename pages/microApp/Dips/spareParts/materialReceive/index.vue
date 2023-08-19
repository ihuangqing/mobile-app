<!-- DIPS → 备品备件 → 物料入库接收 -->
<template>
	<view class="sws-wh100 u-flex sws-flex-d-column">
		<u-form ref="uForm" class="sws-w100 u-flex-1 u-p-l-20 u-p-r-20 u-p-b-30" :model="model" label-width="150"
			label-align="center">
			<u-form-item required label="物料编码" :border-bottom="false" prop="itemCode">
				<u-input :border="true" placeholder="请输入/扫描物料编码" v-model="model.itemCode" type="text" :focus="setFocus">
				</u-input>
				<u-icon slot="right" name="scan" size="56" color="#2979ff" @click="scanCode('itemCode')"></u-icon>
			</u-form-item>
			<u-form-item required v-show="showMatSeqCode" label="序列码" :border-bottom="false" prop="matSeqCode">
				<u-input :border="true" placeholder="请输入/扫描序列码" v-model="model.matSeqCode" type="text">
				</u-input>
				<u-icon slot="right" name="scan" size="56" color="#2979ff" @click="scanCode('matSeqCode')"></u-icon>
			</u-form-item>
			<u-form-item label="物料名称" :border-bottom="false">
				<u-input :border="true" disabled placeholder="" v-model="model.itemName" type="text">
				</u-input>
			</u-form-item>
			<u-form-item required label="入库数量" :border-bottom="false">
				<u-input :border="true" :disabled="showMatSeqCode" placeholder="请输入入库数量" v-model="model.qty"
					type="number">
				</u-input>
			</u-form-item>
			<u-form-item required label="单价" :border-bottom="false">
				<u-input type="number" :border="true" placeholder="请输入单价" v-model="model.unitPrice" />
			</u-form-item>
			<u-form-item required label="存放位置" :border-bottom="false">
				<u-input type="select" :border="true" placeholder="请选择存放位置" v-model="model.shelf"
					@click="showSelect = true" />
			</u-form-item>
			<u-form-item label="入库人" :border-bottom="false">
				<u-input :border="true" disabled placeholder="" v-model="userName" type="text">
				</u-input>
			</u-form-item>
			<u-form-item label="入库时间" :border-bottom="false">
				<u-input :border="true" disabled placeholder="" v-model="model.warehousingDate" type="select"
					@click="showCalendar = true">
				</u-input>
			</u-form-item>
		</u-form>
		<view class="btn-group sws-w100 u-flex u-row-between u-p-t-28 u-p-b-28">
			<u-button type="default" size="medium" @click="reset">重置</u-button>
			<u-button type="primary" size="medium" @click="commit">确认</u-button>
		</view>
		<u-calendar v-model="showCalendar" @change="changeCalendar"></u-calendar>
		<u-modal v-model="showModal" :content="modalContent" @confirm="modalConfirm"></u-modal>
		<u-select v-model="showSelect" mode="mutil-column-auto" :list="selectList" @confirm="selectConfirm"></u-select>
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
					itemName: '',
					matSeqCode: '', //序列码
					qty: '',
					unitPrice: '',
					warehousingDate: '',
					shelf: '',
					storePolicy: '',
					controlMode: ''
				},
				showMatSeqCode: false,
				setFocus: false,
				userName: '',
				rules: { //表单验证
					itemCode: [{
						asyncValidator: async (rule, value, callback) => {
							if (value) { //空值判断放在确认方法中处理
								let materialInfo = await this.baseData.getMaterialInfo(this, value)
								if (Object.keys(materialInfo).length) {
									this.model.itemName = materialInfo.itemName
									this.model.matId = materialInfo.id
									this.model.storePolicy = materialInfo.storePolicy
									this.model.controlMode = materialInfo.controlMode
									if (materialInfo.controlMode == 'entity' && (materialInfo.storePolicy ==
											'FIFO' || materialInfo.storePolicy == 'LIFO')) {
										this.showMatSeqCode = true
										this.model.qty = 1 //默认数量为1
									} else {
										this.showMatSeqCode = false
									}
									callback()
								} else {
									this.model.itemName = ''
									this.model.matId = ''
									this.$refs.uTips.show({
										title: '此物料编码不存在，请重新输入',
										type: 'warning',
										duration: 2300
									})
								}
							}
						},
						trigger: 'blur',
					}]
				},
				modalContent: '',
				showModal: false,
				showSelect: false,
				selectList: [],
				showCalendar: false
			}
		},
		computed: mapState(['userInfo']),
		onLoad() {
			this.userName = this.userInfo.userName
			this.model.warehousingDate = this.$u.timeFormat()
			this.initLocationInfo()
		},
		onReady() {
			this.$refs.uForm.setRules(this.rules)
		},
		methods: {
			changeCalendar(res) {
				this.model.warehousingDate = res.result
			},
			selectConfirm(arr) {
				let res = `${arr[0].label}`
				if (arr[1] && arr[1].label) {
					res += ` → ${arr[1].label}`
					if (arr[2] && arr[2].label) {
						res += ` → ${arr[2].label}`
						this.model.shelfId = arr[2].value
					} else {
						this.model.shelfId = arr[1].value
					}
				} else {
					this.model.shelfId = arr[0].value
				}
				this.model.shelf = res
			},
			async initLocationInfo() {
				this.selectList = await this.baseData.getLocationInfo(this)
			},
			commit() {
				const model = this.model
				let checkArr = [{
					tips: '请输入/扫描正确的物料编码',
					value: model.matId
				}, {
					tips: '请输入/扫描物料编码',
					value: model.itemCode
				}, {
					tips: '请输入大于0的入库数量',
					value: +model.qty
				}, {
					tips: '请输入单价',
					value: model.unitPrice
				}, {
					tips: '请选择存放位置',
					value: model.shelfId
				}]

				if (this.showMatSeqCode) {
					const item = {
						tips: '请输入/扫描序列码',
						value: model.matSeqCode
					}
					checkArr.splice(2, 0, item)
				}

				if (this.common.checkNotNull(this, checkArr)) {
					const params = {
						matId: model.matId,
						itemCode: model.itemCode,
						matSeqCode: model.matSeqCode,
						unitPrice: model.unitPrice,
						qty: model.qty,
						shelfId: model.shelfId,
						warehousingDate: model.warehousingDate
					}
					this.$u.api.postMaterialReceive(params).then(res => {
						if (res.msgCode === '000000') {
							this.modalContent = '物料入库成功'
							this.showModal = true
						} else {
							this.$refs.uTips.show({
								title: `物料入库失败，原因：${res.message}`,
								type: 'error',
								duration: 2300
							})
						}
					}).catch(err => {
						this.common.sysErrToast(this, err)
					})
				}
			},
			async scanCode(flag) {
				// #ifdef APP-PLUS
				const code = await this.common.scanCode()
				this.model[flag] = code
				this.setFocus = true
				// #endif
			},
			modalConfirm() {
				this.reset()
			},
			reset() {
				this.model = {
					itemCode: '',
					itemName: '',
					matSeqCode: '', //序列码
					qty: '',
					unitPrice: '',
					warehousingDate: '',
					shelf: '',
					storePolicy: '',
					controlMode: ''
				}
				this.showMatSeqCode = false
				this.setFocus = false
			}
		},
		onBackPress() {
			if (this.showCalendar) {
				this.showCalendar = false
				return true
			} else if (this.showSelect) {
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
