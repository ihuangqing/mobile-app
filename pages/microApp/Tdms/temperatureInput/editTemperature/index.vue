<template>
	<view class="sws-wh100 sws-bg-ebebeb u-p-20 u-rela">
		<u-form :model="form" class="scroll-wrap sws-wh100" ref="uForm" :error-type="['topTips']">
			<view class="form-card">
				<u-form-item required :border-bottom="false" label="区域" prop="areaName">
					<u-input :value="form.areaName" placeholder="请选择区域" @click="toSelectArea" />
					<u-icon slot="right" name="arrow-down" size="28" @click="toSelectArea">
					</u-icon>
				</u-form-item>
				<u-form-item required :border-bottom="false" label="实验室" prop="positionName">
					<u-input :value="form.positionName" placeholder="请选择实验室" @click="toSelectLab" />
					<u-icon slot="right" name="arrow-down" size="28" @click="toSelectLab">
					</u-icon>
				</u-form-item>
				<u-form-item required :border-bottom="false" label="温度" prop="temperature">
					<u-input v-model="form.temperature" placeholder="请输入温度" />
					<text slot="right">℃</text>
				</u-form-item>
				<u-form-item required :border-bottom="false" label="湿度" prop="humidity">
					<u-input v-model="form.humidity" placeholder="请输入湿度" />
					<text slot="right">%RH</text>
				</u-form-item>
			</view>
		</u-form>
		<view class="btn-style sws-w100 u-p-t-20">
			<u-button type="primary" @click="toSubmit">确认</u-button>
		</view>
		<u-select v-model="showSelect" :list="selectList" :title="selectTitle" @confirm="confirmSelect"></u-select>
		<u-modal v-model="showModal" :content="modalContent" @confirm="modalConfirm"></u-modal>
		<u-top-tips ref="uTips"></u-top-tips>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				form: {
					areaId: '',
					areaName: '',
					positionId: '',
					positionName: '',
					temperature: '',
					humidity: ''
				},
				rules: {
					areaName: [{
						required: true,
						message: '请选择区域',
						trigger: ['change', 'blur'],
					}],
					positionName: [{
						required: true,
						message: '请选择实验室',
						trigger: ['change', 'blur'],
					}],
					temperature: [{
						required: true,
						message: '请输入温度',
						trigger: ['change', 'blur'],
					}],
					humidity: [{
						required: true,
						message: '请输入湿度',
						trigger: ['change', 'blur'],
					}],
				},
				areaList: [],
				labList: [],
				showSelect: false,
				selectList: [],
				selectTitle: '',
				showModal: false,
				modalContent: ''
			}
		},
		onLoad() {
			const eventChannel = this.getOpenerEventChannel()
			eventChannel.on('acceptDataFromOpenerPage', data => {
				uni.setNavigationBarTitle({
					title: data.flag == 'add' ? '新增' : '编辑'
				})
			})
		},
		onReady() {
			this.$refs.uForm.setRules(this.rules);
		},
		methods: {
			toSelectArea() {
				this.selectList = []
				this.$u.api.getAreaListForTemperatureHumidityInput().then(res => {
					if (res.msgCode === '000000') {
						this.selectList = res.data.map(({
							id,
							areaName
						}) => {
							return {
								label: areaName,
								value: id,
								extra: 'area'
							}
						})
						this.selectTitle = '请选择区域'
						this.showSelect = true
					} else {
						this.$refs.uTips.show({
							title: `区域获取失败，原因：${ res.message }`,
							type: 'error',
							duration: 2300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			toSelectLab() {
				if (!this.form.areaId) {
					this.$refs.uTips.show({
						title: '请选择区域',
						type: 'warning',
						duration: 2300
					})
					return
				}
				this.$u.api.getLabListForTemperatureHumidityInput({
					areaId: this.form.areaId
				}).then(res => {
					if (res.msgCode === '000000') {
						this.selectList = res.data.map(({
							id,
							positionName
						}) => {
							return {
								label: positionName,
								value: id,
								extra: 'lab'
							}
						})
						this.selectTitle = '请选择实验室'
						this.showSelect = true
					} else {
						this.$refs.uTips.show({
							title: `实验室获取失败，原因：${ res.message }`,
							type: 'error',
							duration: 2300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			confirmSelect(arr) {
				const temp = arr[0]
				if (temp.extra === 'area') {
					this.form.areaId = temp.value
					this.form.areaName = temp.label
				} else if (temp.extra === 'lab') {
					this.form.positionId = temp.value
					this.form.positionName = temp.label
				}
			},
			modalConfirm() {
				const eventChannel = this.getOpenerEventChannel()
				eventChannel.emit('acceptDataFromOpenedPage')
				uni.navigateBack()
			},
			toSubmit() {
				this.$refs.uForm.validate(valid => {
					if (valid) {
						const params = {
							areaId: this.form.areaId,
							positionId: this.form.positionId,
							temperature: this.form.temperature,
							humidity: this.form.humidity
						}

						this.$u.api.postTemperatureHumidityInputData(params).then(res => {
							if (res.msgCode === '000000') {
								this.modalContent = "新增成功"
								this.showModal = true
							} else {
								this.$refs.uTips.show({
									title: `新增失败，原因：${ res.message }`,
									type: 'error',
									duration: 2300
								})
							}
						}).catch(err => {
							this.common.sysErrToast(this, err)
						})
					}
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.scroll-wrap {
		width: 100%;
		border-radius: 16rpx;
		overflow: hidden;
		height: calc(100% - 100rpx);
	}

	.form-card {
		height: 100%;
		background-color: #fff;
		border-radius: 16rpx;
		padding-top: 20rpx;
		margin-bottom: 20rpx;
		overflow: hidden;
	}

	.form-card:last-child {
		margin-bottom: 0;
	}

	.btn-style {
		position: absolute;
		left: 0;
		bottom: 0;
		padding: 20rpx;
		letter-spacing: 20rpx;
		text-indent: 20rpx;
	}

	.line-section {
		box-shadow: 0 2rpx 10rpx #ebebeb;
		margin-top: 10rpx;
	}

	::v-deep .u-form {
		height: 100%;
	}

	::v-deep .form-card .u-form-item {
		padding: 0 30rpx 20rpx 40rpx !important;
	}
</style>