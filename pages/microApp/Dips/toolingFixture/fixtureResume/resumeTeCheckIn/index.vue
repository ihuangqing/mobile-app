<!-- Dips → 工治具履历 → 设备技术员登记 -->
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
			<u-form-item label="维修保养" :border-bottom="false">
				<u-checkbox-group>
					<u-checkbox v-model="item.checked" v-for="(item, index) in checkboxList" :key="index"
						@change="checkboxChange" :name="item.key">
						{{ item.name }}
					</u-checkbox>
				</u-checkbox-group>
			</u-form-item>
			<u-form-item label="工治具状态" :border-bottom="false">
				<u-input :border="true" placeholder="请选择工治具状态" v-model="model.states" type="select" @click="showState">
				</u-input>
			</u-form-item>
			<u-form-item required label="设备技术员" :border-bottom="false">
				<u-input :border="true" placeholder="请选择设备技术员" v-model="model.tech" type="select" @click="showTech">
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
				checkboxList: [{
					name: '维修',
					key: 'repair',
					checked: false
				}, {
					name: '保养',
					key: 'maintain',
					checked: false
				}],
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
					...fix,
					maintain: '',
					repair: ''
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
					tips: '请选择设备技术员',
					value: model.tech
				}]
				if (this.common.checkNotNull(this, arr)) {
					const params = {
						fixtureId: model.fixtureId,
						fixtureCode: model.fixtureCode,
						fixtureName: model.fixtureName,
						repair: model.repair,
						maintain: model.maintain,
						state: model.statesCode,
						operator: "",
						operatorName: "",
						technician: model.techCode,
						technicianName: model.tech,
						remark: model.remark
					}

					this.$u.api.postFixtureResumeTeCheckIn(params).then(res => {
						if (res.msgCode ==='000000') {
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
				this.model.repair = ''
				this.model.maintain = ''
				this.model.states = ''
				this.model.statesCode = ''
				this.model.tech = ''
				this.model.techCode = ''
				this.model.remark = ''
				this.checkboxList.forEach(item => item.checked = false)
			},
			checkboxChange(arr) {
				this.model[arr.name] = '1'
			},
			selectConfirm(arr) {
				const temp = arr[0]
				this.model[temp.extra] = temp.label
				this.model[temp.extra + 'Code'] = temp.value
			},
			showTech() {
				if (this.techList && this.techList.length) {
					this.selectList = this.techList
					this.showSelect = true
					return
				}
				this.$u.api.getTechByFixtureId(this.model.fixtureId).then(res => {
					if (res.msgCode === '000000') {
						if (res.data.length) {
							this.techList = res.data.map(user => {
								return {
									label: user.userName,
									value: user.account,
									extra: 'tech'
								}
							})
							this.selectList = this.techList
							this.showSelect = true
						} else {
							this.$refs.uTips.show({
								title: '暂无设备技术员数据',
								type: 'error',
								duration: 2300
							})
						}
					} else {
						this.$refs.uTips.show({
							title: `设备技术员获取失败，原因：${ res.message }`,
							type: 'error',
							duration: 2300
						})
					}
				})
			},
			showState() {
				this.selectList = [{
					label: '正常',
					value: 'NORMAL',
					extra: 'states'
				}, {
					label: '维修',
					value: 'REPAIR',
					extra: 'states'
				}, {
					label: '报废',
					value: 'SCRAP',
					extra: 'states'
				}, {
					label: '闲置',
					value: 'IDLE',
					extra: 'states'
				}]
				this.showSelect = true
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
