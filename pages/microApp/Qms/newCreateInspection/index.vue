<!-- 中断管理 -->
<template>
	<view class="sws-wh100 u-flex sws-flex-d-column sws-overflow-hidden">
		<view class="sws-w100 u-flex-1 u-p-l-20 u-p-r-20 u-p-b-30 sws-overflow-scroll-y">
			<u-form class="sws-w100" :model="model" label-width="150" label-align="center">
				<u-form-item required label="产品编码" :border-bottom="false">
					<u-input @confirm='productConfirm' :border="true" placeholder="请输入或扫描产品编码"
						v-model="model.productSn " type="text"></u-input>
					<u-icon slot="right" name="scan" size="56" color="#2979ff" @click="scanCode('modelCode')"></u-icon>
				</u-form-item>

				<u-form-item label="工艺名称" :border-bottom="false">
					<u-input :border="true" placeholder="请输入工艺名称" v-model="model.technicsName" type="text"></u-input>
				</u-form-item>
				<u-form-item label="产品型号" :border-bottom="false">
					<u-input :border="true" placeholder="请输入产品型号" v-model="model.itemName" type="text"></u-input>
				</u-form-item>

				<u-form-item label="线体" :border-bottom="false">
					<u-input :border="true" placeholder="请输入线体" v-model="model.areaName" type="text"></u-input>
				</u-form-item>

				<u-form-item label="单据类型" :border-bottom="false">
					<u-input :border="true" placeholder="请选择单据类型" v-model="model.checkTypeName" type="select"
						@click="toShowQmCheckTypes"></u-input>
				</u-form-item>

				<u-form-item label="频次周期" :border-bottom="false">
					<u-input :border="true" placeholder="请选择频次周期" v-model="model.cycles" type="select"
						@click="toShowcycles"></u-input>
				</u-form-item>
			</u-form>
		</view>
		<view class="sws-w100 u-p-28 btn-style">
			<u-button type="primary" @click="submit">确认</u-button>
		</view>
		<u-select v-model="showSelect" :list="selectList" :title="selectTitle" @confirm="selectConfirm"></u-select>
		<u-modal v-model="showModal" :content="modalContent" @confirm="modalConfirm"></u-modal>
		<u-top-tips ref="uTips"></u-top-tips>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				model: {
					technicsName: '',
					groupName: '',
					deviceSN: '',
					technicsName: '', //工艺名称
					productSn: '', //产品编码
					itemName: '', //产品型号
					areaName: '', //线体
					checkTypeName: '', //单据类型
					checkType: '', //单据类型编码
					cycles: '', //频次周期
				},
				modalContent: '',
				showModal: false,
				selectTitle: '',
				selectList: [],
				showSelect: false,
				tempSelectList: [] //作为中间变量 用于单据类型和频次周期的联动
			}
		},
		methods: {
			modalConfirm() {
				this.model = {
					modelCode: '',
					technicsId: '',
					technicsName: '',
					areasn: '',
					groupName: '',
					deviceSN: '',
					technicsName: '',

					productSn: '', //产品编码
					itemName: '', //产品型号
					areaName: '', //线体(拉线sn)
					areaSn: '', //拉线sn编码
					checkType: '', //单据
					checkTypeName: '',
					cycles: '', //频次周期
				}
			},
			submit() {
				if (!this.model.productSn) {
					this.$refs.uTips.show({
						title: '请输入或扫描产品编码',
						type: 'warning',
						duration: 2300
					})
					return
				}
				const params = {
					areaSn: this.model.areaSn, //拉线sn
					checkFrequency: this.model.cycles, //频次周期
					checkType: this.model.checkType, //单据检验类型
					technicsId: this.model.technicsId //工艺id
				}
				this.$u.api.postRecreateOrder(params).then(res => {
					if (res.msgCode === '000000') {
						this.modalContent = res.data
						this.showModal = true
					} else {
						this.$refs.uTips.show({
							title: `中断管理失败，原因：${ res.message }`,
							type: 'warning',
							duration: 2300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			selectConfirm(arr) {
				const temp = arr[0]
				if (temp.hasOwnProperty('extra')) { //单据类型
					this.model.checkTypeName = temp.label
					this.model.checkType = this.tempSelectList.filter(item => item.checkType == temp.value)[0].checkType
				} else {
					this.model.cycles = temp.value
					// this.model.groupCode = temp.value
				}
			},
			scanCode(type) { //扫码
				this.common.scanCode(this).then(res => {
					this.model.productSn = res
					this.productConfirm()
				})
			},

			//选择单据类型
			toShowQmCheckTypes() {
				//根据单据名称的标准内是否维护了对应的单据类型
				if (this.model.technicsName) {
					this.selectTitle = '请选择单据类型'
					this.selectList = this.tempSelectList.map(({
						checkTypeName,
						checkType,

					}) => {
						return {
							label: checkTypeName,
							value: checkType,
							extra: 'checkType'
						}
					})
					this.showSelect = true
					return

				}
				this.$refs.uTips.show({
					title: '请先完成产品编码',
					type: 'error',
					duration: 2300
				})


			},
			// 选择频次周期
			toShowcycles() {
				//根据单据名称和单据类型带出相对应的频次周期
				if (this.model.checkTypeName) {
					this.selectTitle = '请选择周期'
					let result = this.tempSelectList.filter(item => {
						return item.checkTypeName == this.model.checkTypeName
					})
					this.selectList = result[0].cycles.map(({
						lable,
						value,
					}) => {
						return {
							label: lable,
							value: value,

						}
					})
					this.showSelect = true
					return

				}
				this.$refs.uTips.show({
					title: '请先选择单据类型',
					type: 'error',
					duration: 2300
				})
			},
			//输入产品编码后 失去焦点 自动带出 工艺名称 产品型号 线体等内容
			productConfirm() {
				if (!this.model.productSn) {
					this.$refs.uTips.show({
						title: '请输入或扫描产品编码',
						type: 'error',
						duration: 2300
					})
					return
				}
				const params = {
					productSn: this.model.productSn
				}
				this.$u.api.getBreakOffQmStandardBySnApi(params).then(res => {
					if (res.msgCode === '000000') {
						if (res.data && Object.keys(res.data).length > 0) {
							this.model.technicsName = res.data.technicsName
							this.model.itemName = res.data.itemName
							this.model.areaName = res.data.areaName
							this.model.areaSn = res.data.areaSn
							this.model.technicsId = res.data.technicsId
							this.tempSelectList = res.data.breakOffQmCheckTypes
							return
						}
						// this.model = {}
						this.model.technicsName = ''
						this.model.itemName = ''
						this.model.areaName = ''
						this.model.checkTypeName = ''
						this.model.cycles = ''
						this.$refs.uTips.show({
							title: '暂未查到数据',
							type: 'warning',
							duration: 2300
						})

					} else {
						this.$refs.uTips.show({
							title: '请输入或扫描产品编码',
							type: 'error',
							duration: 2300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			}
		},

		watch: {
			//监听产品编码  清空编码 则工艺名称  产品型号 线体也清空 
			'model.productSn': {
				handler: function(newVal) {
					if (!newVal) {
						this.model.technicsName = ''
						this.model.itemName = ''
						this.model.areaName = ''
						this.model.checkTypeName = ''
						this.model.cycles = ''
					}
				},
				immediate: true,
				deep: true
			},
			//监听工艺名称 清空工艺名称 则单据类型 频次周期也清空
			'model.technicsName': {
				handler: function(newVal) {
					if (!newVal) {
						this.model.checkTypeName = ''
						this.model.cycles = ''
					}
				},
				immediate: true,
				deep: true
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
	.btn-style {
		letter-spacing: 28rpx;
		text-indent: 28rpx;
	}
</style>
