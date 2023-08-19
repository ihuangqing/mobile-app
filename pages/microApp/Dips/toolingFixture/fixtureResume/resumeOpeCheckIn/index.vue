<!-- Dips → 工治具履历 → 生产操作员登记 -->
<template>
	<view class="sws-wh100 u-flex sws-flex-d-column">
		<u-form ref="uForm" class="sws-w100 u-flex-1 u-p-l-20 u-p-r-20 u-p-b-30" :model="model" label-width="180"
			label-align="center">
			<u-form-item label="工治具名称" :border-bottom="false">
				<u-input :border="true" disabled placeholder="" v-model="model.fixtureName" type="text">
				</u-input>
			</u-form-item>
			<u-form-item label="工治具编码" :border-bottom="false">
				<u-input :border="true" disabled placeholder="" v-model="model.fixtureCode" type="text">
				</u-input>
			</u-form-item>
			<u-form-item required label="工治具型号" :border-bottom="false">
				<u-input :border="true" placeholder="请输入工治具型号" v-model="model.productSn" type="text">
				</u-input>
			</u-form-item>
			<u-form-item required label="今天使用次数" :border-bottom="false">
				<u-input :border="true" placeholder="请输入今天使用次数" v-model="model.useTimes" type="number">
				</u-input>
			</u-form-item>
			<u-form-item required label="生产操作员" :border-bottom="false">
				<u-input :border="true" placeholder="请选择生产操作员" v-model="model.oper" type="select" @click="showOperator">
				</u-input>
			</u-form-item>
			<u-form-item label="备注" :border-bottom="false">
				<u-input :border="true" placeholder="备注" v-model="model.remark" type="textarea">
				</u-input>
			</u-form-item>
		</u-form>
		<view class="btn-group sws-w100 u-flex u-row-between u-p-t-28 u-p-b-28">
			<u-button type="default" size="medium" @click="reset">重置</u-button>
			<u-button type="primary" size="medium" @click="commit">确认</u-button>
		</view>
		<u-modal v-model="showModal" :content="modalContent" @confirm="modalConfirm"></u-modal>
		<u-select v-model="showSelect" :list="selectList" @confirm="selectConfirm"></u-select>
		<u-top-tips ref="uTips"></u-top-tips>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				model: {},
				modalContent: '',
				showModal: false,
				selectList: [],
				showSelect: false
			}
		},
		onLoad() {
			const eventChannel = this.getOpenerEventChannel()
			eventChannel.on('acceptDataFromOpenerPage', data => {
				const fix = data.fixture
				this.model = {
					...fix
				}
			})
		},
		methods: {
			modalConfirm() {
				const eventChannel = this.getOpenerEventChannel()
				eventChannel.emit('acceptDataFromOpenedPage')
				uni.navigateBack()
			},
			commit() {
				const model = this.model
				const arr = [{
					tips: '请输入工治具型号',
					value: model.productSn
				}, {
					tips: '请输入今日使用次数',
					value: model.useTimes
				}, {
					tips: '请选择生产操作员',
					value: model.oper
				}]
				if (this.common.checkNotNull(this, arr)) {
					const params = {
						fixtureId: model.fixtureId,
						fixtureCode: model.fixtureCode,
						fixtureName: model.fixtureName,
						useTimes: model.useTimes,
						productSn: model.productSn,
						repair: "",
						maintain: "",
						remark: model.remark,
						operator: model.operCode,
						operatorName: model.oper,
						technician: "",
						technicianName: "",
					}

					this.$u.api.postFixtureResumeOpeCheckIn(params).then(res => {
						if (res.msgCode === '000000') {
							this.modalContent = '登记成功'
							this.showModal = true
						} else {
							this.$refs.uTips.show({
								title: `登记失败，原因：${ res.message }`,
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
				this.model.productSn = ''
				this.model.useTimes = ''
				this.model.oper = ''
				this.model.operCode = ''
				this.model.remark = ''
			},
			selectConfirm(arr) {
				const temp = arr[0]
				this.model[temp.extra] = temp.label
				this.model[temp.extra + 'Code'] = temp.value
			},
			showOperator() {
				if (this.operatorList && this.operatorList.length) {
					this.selectList = this.operatorList
					this.showSelect = true
					return
				}
				this.$u.api.getOperatorByFixtureId(this.model.fixtureId).then(res => {
					if (res.msgCode === '000000') {
						if (res.data.length) {
							this.operatorList = res.data.map(user => {
								return {
									label: user.userName,
									value: user.account,
									extra: 'oper'
								}
							})
							this.selectList = this.operatorList
							this.showSelect = true
						} else {
							this.$refs.uTips.show({
								title: '暂无生产操作员数据',
								type: 'error',
								duration: 2300
							})
						}
					} else {
						this.$refs.uTips.show({
							title: `生产操作员获取失败，原因：${ res.message }`,
							type: 'error',
							duration: 2300
						})
					}
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
