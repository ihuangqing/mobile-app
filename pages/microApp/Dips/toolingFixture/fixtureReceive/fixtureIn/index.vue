<!-- DIPS → 工治具归还 → 待入库 → 入库 -->
<template>
	<view class="sws-wh100 u-flex sws-flex-d-column">
		<u-form ref="uForm" class="sws-w100 u-flex-1 u-p-l-20 u-p-r-20 u-p-b-30" :model="model" label-width="150"
			label-align="center">
			<u-form-item required label="工治具编码" :border-bottom="false" prop="fixtureCode">
				<u-input :border="true" disabled placeholder="" v-model="model.fixtureCode" type="text">
				</u-input>
			</u-form-item>
			<u-form-item label="工治具名称" :border-bottom="false">
				<u-input :border="true" disabled placeholder="" v-model="model.fixtureName" type="text">
				</u-input>
			</u-form-item>
			<u-form-item label="领用人" :border-bottom="false">
				<u-input :border="true" disabled placeholder="" v-model="model.recipientsName" type="text">
				</u-input>
			</u-form-item>
			<u-form-item label="领用时间" :border-bottom="false">
				<u-input :border="true" disabled placeholder="" v-model="model.recipientsDate" type="text" />
			</u-form-item>
			<u-form-item label="出库库位" :border-bottom="false">
				<u-input :border="true" disabled placeholder="" v-model="model.positionNameOld" type="text">
				</u-input>
			</u-form-item>
			<u-form-item required label="入库库位" :border-bottom="false">
				<u-input :border="true" disabled placeholder="请选择/扫码入库库位" v-model="model.positionName" type="select"
					@click="showSelect = true">
				</u-input>
				<u-icon slot="right" name="scan" size="56" color="#2979ff" @click="scanCode"></u-icon>
			</u-form-item>
		</u-form>
		<view class="btn-group sws-w100 u-flex u-row-between u-p-t-28 u-p-b-28">
			<u-button type="default" size="medium" @click="reset">重置</u-button>
			<u-button type="primary" size="medium" @click="commit">确认</u-button>
		</view>
		<u-select v-model="showSelect" mode="single-column" :list="selectList" @confirm="selectConfirm"></u-select>
		<u-modal v-model="showModal" :content="modalContent" @confirm="confirm"></u-modal>
		<u-top-tips ref="uTips"></u-top-tips>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				model: {},
				selectList: [],
				showSelect: false,
				modalContent: '',
				showModal: false
			}
		},
		onLoad(options) {
			this.model.fixtureCode = options.fixtureCode
			this.index = options.index //接收上级页面传过来的序号，用于回传删除list中对应的item
			this.getUnReceiveFixtureInfo() //根据工治具编码获取工治具入库信息
			this.initLocationSelect() //获取库位信息
		},
		methods: {
			selectConfirm(arr) {
				const temp = arr[0]
				this.model.positionName = temp.label
				this.model.positionId = temp.value
			},
			async initLocationSelect() {
				this.selectList = await this.baseData.getLocationInfo(this, false)
			},
			getUnReceiveFixtureInfo() {
				this.$u.api.getUnReceiveFixtureInfo(this.model.fixtureCode).then(res => {
					if (res.msgCode === '000000' && res.data) {
						const fixtureInfo = res.data
						this.model.id = fixtureInfo.id
						this.model.fixtureName = fixtureInfo.fixtureName
						this.model.recipientsName = fixtureInfo.recipientsName
						this.model.recipientsDate = fixtureInfo.recipientsDate
						this.model.positionNameOld = fixtureInfo.positionNameOld
					} else {
						this.$refs.uTips.show({
							title: '此工治具不存在',
							type: 'error',
							duration: 2300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			async scanCode() {
				// #ifdef APP-PLUS
				let code = await this.common.scanCode()
				let positionInfo = this.selectList.filter(item => {
					return item.positionId == code
				})
				this.model.positionName = positionInfo.positionName
				this.model.positionId = positionInfo.positionId
				// #endif
			},
			commit() { //归还确认
				const model = this.model
				let checkArr = [{
					tips: '请选择/扫码入库库位',
					value: model.positionId
				}]
				if (this.common.checkNotNull(this, checkArr)) {
					const params = {
						id: model.id,
						fixtureCode: model.fixtureCode,
						positionId: model.positionId
					}
					this.$u.api.postFixtureReceice(params).then(res => {
						if (res.msgCode === '000000') {
							this.modalContent = '入库成功'
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
			reset() {
				this.model.positionName = ''
			},
			confirm() {
				const eventChannel = this.getOpenerEventChannel()
				eventChannel.emit('acceptDataFromOpenedPage', {
					data: this.index
				})
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
