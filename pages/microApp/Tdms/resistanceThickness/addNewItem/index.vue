<template>
	<view class="sws-wh100 u-flex sws-flex-d-column">
		<view class="sws-w100 sws-bg-ffffff u-p-l-30 u-p-r-30 u-p-b-20">
			<view class="base-info">
				<u-cell-group :border="false" class="cell-group">
					<u-cell-item hover-class="none" :title-style="{color: '#ffffff'}" :value-style="{color: '#ffffff'}"
						bg-color="#2979ff" :arrow="false" :border-bottom="false" title="申请单号" :value="form.fdApplyNo">
					</u-cell-item>
					<u-cell-item hover-class="none" :title-style="{color: '#ffffff'}" :value-style="{color: '#ffffff'}"
						bg-color="#2979ff" :arrow="false" :border-bottom="false" title="测试项目"
						:value="form.testItemName">
					</u-cell-item>
					<u-cell-item hover-class="none" :title-style="{color: '#ffffff'}" :value-style="{color: '#ffffff'}"
						bg-color="#2979ff" :arrow="false" :border-bottom="false" title="测试阶段" :value="form.stageNumber">
					</u-cell-item>
					<u-cell-item hover-class="none" :title-style="{color: '#ffffff', 'padding-right': '20rpx'}"
						:value-style="{color: '#ffffff'}" bg-color="#2979ff" :arrow="false" :border-bottom="false"
						title="样品编码" :value="form.coding"></u-cell-item>
				</u-cell-group>
				<view class="base-info-other u-flex u-row-between">
					<view>圈数：{{ form.testStage }}</view>
					<view class="u-flex-1 u-text-right">
						{{`${form.type === 'VOLTAGE_RESISTANCE' ? '下' : '上'}`}}架日期：{{ form.creationDate }}
					</view>
				</view>
			</view>
		</view>
		<u-form :model="form" ref="uForm" :error-type="['topTips']"
			class="u-flex-1 sws-w100 u-p-l-30 u-p-r-30 u-p-b-20 sws-overflow-hidden">
			<view v-if="form.type === 'VOLTAGE_RESISTANCE'" class="form-card">
				<u-form-item required :border-bottom="false" label="电压" prop="voltage">
					<u-input v-model="form.voltage" placeholder="请输入电压" />
				</u-form-item>
				<u-form-item required :border-bottom="false" label="电阻" prop="resistance">
					<u-input v-model="form.resistance" placeholder="请输入电阻" />
				</u-form-item>
				<u-form-item required :border-bottom="false" label="厚度1" prop="thicknessOne">
					<u-input v-model="form.thicknessOne" placeholder="请输入厚度1" />
				</u-form-item>
				<u-form-item required :border-bottom="false" label="膨胀力" prop="expansionForceDown">
					<u-input v-model="form.expansionForceDown" placeholder="请输入膨胀力" />
				</u-form-item>
				<u-form-item :border-bottom="false" label="厚度2">
					<u-input v-model="form.thicknessTwo" placeholder="请输入厚度2" />
				</u-form-item>
				<u-form-item :border-bottom="false" label="厚度3">
					<u-input v-model="form.thicknessThree" placeholder="请输入厚度3" />
				</u-form-item>
				<u-form-item :border-bottom="false" label="厚度4">
					<u-input v-model="form.thicknessFour" placeholder="请输入厚度4" />
				</u-form-item>
				<u-form-item :border-bottom="false" label="厚度A">
					<u-input v-model="form.thicknessA" placeholder="请输入厚度A" />
				</u-form-item>
				<u-form-item :border-bottom="false" label="厚度B">
					<u-input v-model="form.thicknessB" placeholder="请输入厚度B" />
				</u-form-item>
			</view>
			<view v-else class="form-card">
				<u-form-item :border-bottom="false" label-width="200" label="接触电阻负极">
					<u-input v-model="form.contactResistanceAthode" placeholder="请输入接触电阻负极" />
				</u-form-item>
				<u-form-item :border-bottom="false" label-width="200" label="接触电阻正极">
					<u-input v-model="form.contactResistancePositive" placeholder="请输入接触电阻正极" />
				</u-form-item>
				<u-form-item :border-bottom="false" label-width="200" label="接触电阻合计">
					<u-input :value="computedTotal()" placeholder="请输入接触电阻合计" />
				</u-form-item>
				<u-form-item :border-bottom="false" label-width="200" label="膨胀力">
					<u-input v-model="form.expansionForceUp" placeholder="请输入膨胀力" />
				</u-form-item>
			</view>
		</u-form>
		<view class="btn-style sws-w100">
			<u-button type="primary" @click="toSubmit">确认</u-button>
		</view>
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
				type: '',
				form: {
					fdApplyNo: '',
					testItemId: '',
					testItemName: '',
					stageNumber: '',
					coding: '',
					testStage: '',
					creationDate: '',
					"voltage": '', //电压
					"resistance": '', //内阻
					"thicknessOne": '', //厚度1
					"thicknessTwo": '', //厚度2
					"thicknessThree": '', //厚度3
					"thicknessFour": '', //厚度4
					"thicknessA": '', //厚度A
					"thicknessB": '', //厚度B
					"expansionForceDown": '', //膨胀力下架
					"shelvesTime": '', //下架时间
					"contactResistanceAthode": '', //（接触电阻负极）
					"contactResistancePositive": '', //（接触电阻正极）
					"contactResistanceTotal": '', //（接触电阻总和）
					"expansionForceUp": '' //（膨胀力上架）
				},
				rules: {
					voltage: [{
						validator: (rule, value, callback) => {
							return Boolean(value)
						},
						message: '请输入电压',
						trigger: ['change', 'blur'],
					}],
					resistance: [{
						validator: (rule, value, callback) => {
							return Boolean(value)
						},
						trigger: ['change', 'blur'],
						message: '请请输入电阻'
					}],
					thicknessOne: [{
						validator: (rule, value, callback) => {
							return Boolean(value)
						},
						trigger: ['change', 'blur'],
						message: '请输入厚度1'
					}],
					expansionForceDown: [{
						validator: (rule, value, callback) => {
							return Boolean(value)
						},
						trigger: ['change', 'blur'],
						message: '请输入膨胀力'
					}],
				},
				modalContent: '',
				showModal: false,
				isEdit: false, //是否为修改
			}
		},
		computed: {
			...mapState(['factoryName', 'factoryId', 'userInfo']),
			computedTotal() {
				return () => {
					const athode = +this.form.contactResistanceAthode
					const positive = +this.form.contactResistancePositive
					if (athode && positive) {
						this.form.contactResistanceTotal = (athode + positive).toFixed(4)
					} else {
						this.form.contactResistanceTotal = ''
					}
					return this.form.contactResistanceTotal
				}
			},
		},
		onLoad() {
			const self = this
			const eventChannel = this.getOpenerEventChannel()
			eventChannel.on('acceptDataFromOpenerPage', data => {
				console.log('data: ', data)
				uni.setNavigationBarTitle({
					title: `${data.isEdit ? '编辑' : '新增'}${data.title}`
				})
				self.isEdit = data.isEdit
				self.form = {
					...data
				}
			})
		},
		onReady() {
			this.$refs.uForm.setRules(this.rules)
		},
		methods: {
			modalConfirm() {
				const eventChannel = this.getOpenerEventChannel()
				if (this.modalContent.includes('新增记录')) {
					console.log('this.resData: ', this.resData)
					eventChannel.emit('acceptDataFromOpenedPage', {
						...this.resData
					})
				} else if (this.modalContent.includes('编辑')) {
					eventChannel.emit('acceptDataFromItemList', {
						...this.resData
					})
				}
				uni.navigateBack()
			},
			toSubmit() {
				if (this.form.type === 'CONTACT_RESISTANCE') {
					this.postData()
				} else {
					this.$refs.uForm.validate(valid => {
						if (valid) {
							this.postData()
						}
					})
				}
			},
			postData() {
				let params = {
					query: {
						recordType: this.form.type
					},
					body: {}
				}

				if (this.form.type === 'CONTACT_RESISTANCE') {
					params.body = [{
						"id": this.form.id,
						"fdApplyNo": this.form.fdApplyNo,
						"itemName": this.form.testItemName,
						"coding": this.form.coding,
						"stageNumber": this.form.stageNumber,
						"stepNumber": this.form.stepNumber,
						"testStage": this.form.testStage,
						"shelvesTime": this.form.shelvesTime,
						"contactResistanceAthode": this.form.contactResistanceAthode,
						"contactResistancePositive": this.form.contactResistancePositive,
						"contactResistanceTotal": this.form.contactResistanceTotal,
						"expansionForceUp": this.form.expansionForceUp,
						"recordTime": this.form.recordTime
					}]
				} else {
					params.body = [{
						"id": this.form.id,
						"undercarriageTime": this.form.creationDate,
						"fdApplyNo": this.form.fdApplyNo,
						"itemName": this.form.testItemName,
						"coding": this.form.coding,
						"stageNumber": this.form.stageNumber,
						"stepNumber": this.form.stepNumber,
						"testStage": this.form.testStage,
						"voltage": this.form.voltage,
						"resistance": this.form.resistance,
						"thicknessOne": this.form.thicknessOne,
						"thicknessTwo": this.form.thicknessTwo,
						"thicknessThree": this.form.thicknessThree,
						"thicknessFour": this.form.thicknessFour,
						"thicknessA": this.form.thicknessA,
						"thicknessB": this.form.thicknessB,
						"expansionForceDown": this.form.expansionForceDown,
					}]
				}

				let func = 'saveRecordDataForTDMS' //新增
				if (this.isEdit) { //如果是修改
					func = 'updateRecordDataForTDMS'
				}

				this.$u.api[func](params).then(res => {
					if (res.msgCode === '000000') {
						this.resData = res.data
						this.modalContent = this.isEdit ? '编辑成功！' : '新增记录成功！'
						this.showModal = true
					} else {
						this.$refs.uTips.show({
							title: `提交失败，原因：${ res.message }`,
							type: 'error',
							duration: 2300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.base-info {
		background-color: $u-type-primary;
		border-radius: 16rpx;
		overflow: hidden;
		padding-top: 20rpx;

		&-other {
			height: 56rpx;
			line-height: 56rpx;
			background-color: rgba(255, 255, 255, .8);
			color: rgba(0, 0, 0, .6);
			margin: 10rpx 0 20rpx 0;
			padding: 0 20rpx;
		}
	}

	.form-card {
		border-radius: 16rpx;
		border: 2rpx solid #ebebeb;
		height: 100%;
		overflow: scroll;
	}

	.btn-style {
		padding: 0 20rpx 20rpx 20rpx;
		letter-spacing: 20rpx;
		text-indent: 20rpx;
	}

	.line-section {
		box-shadow: 0 2rpx 10rpx #ebebeb;
		margin-top: 10rpx;
	}

	::v-deep .u-form {
		height: 100%;
		overflow: hidden;
	}

	::v-deep .form-card .u-form-item {
		padding: 0 30rpx 20rpx 40rpx !important;
	}

	::v-deep .base-info .u-cell-item-box {
		background-color: $u-type-primary;
	}

	::v-deep .cell-group .u-cell {
		padding: 0rpx 32rpx;
	}
</style>
