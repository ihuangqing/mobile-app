<!-- 搅拌 和 打胶（新需求合并进来） -->
<template>
	<view class="sws-wh100 sws-bg-ebebeb u-p-20 u-rela">
		<scroll-view scroll-y scroll-with-animation class="scroll-wrap">
			<u-form :model="form" ref="uForm" :error-type="['topTips']" class="sws-wh100">
				<view class="form-card">
					<view class="u-m-b-20 u-p-l-40">
						<view class="sws-font-bold u-font-32 ">出货牌信息</view>
					</view>
					<u-form-item required label="设备编号" :border-bottom="false" prop="deviceNo">
						<u-input disabled placeholder="请选择设备编号" v-model="form.deviceNo" type="text"
							@click="toShowDeviceList"></u-input>
						<u-icon slot="right" name="arrow-down" size="28" @click="toShowDeviceList"></u-icon>
					</u-form-item>
					<u-form-item required label="制令单号" :border-bottom="false" prop="taskNo">
						<u-input :disabled="hasShipmentNo" placeholder="请输入制令单号" v-model="form.taskNo" type="text">
						</u-input>
					</u-form-item>
					<u-form-item required label="组别" :border-bottom="false" label-align="center" prop="groupNo">
						<u-input :disabled="hasShipmentNo" placeholder="" v-model="form.groupNo"></u-input>
					</u-form-item>
					<u-form-item required label="产品型号" :border-bottom="false">
						<u-input disabled placeholder="" v-model="form.modelName">
						</u-input>
					</u-form-item>
					<u-form-item v-if="title.includes('搅拌')" label="配方号" :border-bottom="false" label-align="center">
						<u-input :disabled="hasShipmentNo" placeholder="" v-model="form.formulaNo">
						</u-input>
					</u-form-item>
					<u-form-item v-else required label="胶液名称" :border-bottom="false" label-align="center">
						<u-input :disabled="hasShipmentNo" placeholder="" v-model="form.formulaNo">
						</u-input>
					</u-form-item>
					<u-form-item v-show="hasShipmentNo" required label="出货牌号" :border-bottom="false">
						<u-input disabled placeholder="" v-model="form.shipmentNo">
						</u-input>
					</u-form-item>
					<u-form-item required label="工程师" :border-bottom="false" label-align="center" prop="engineer">
						<u-input placeholder="" type="text" v-model="form.engineer">
						</u-input>
					</u-form-item>
					<u-form-item required label="需求数量" :border-bottom="false" prop="requirementQty">
						<u-input :disabled="hasShipmentNo" placeholder="请输入需求数量" type="number"
							v-model="form.requirementQty">
						</u-input>
					</u-form-item>
					<u-form-item required label="投入数量" :border-bottom="false" prop="inputQty">
						<u-input :disabled="hasShipmentNo" placeholder="请输入投入数量" type="number" v-model="form.inputQty">
						</u-input>
					</u-form-item>
					<u-form-item required label="搅拌重量" :border-bottom="false" prop="agitationWeight">
						<u-input :disabled="hasShipmentNo" placeholder="请输入搅拌重量" type="number"
							v-model="form.agitationWeight">
						</u-input>
					</u-form-item>
					<u-form-item required label="操作员" :border-bottom="false" label-align="center" prop="userCode">
						<u-input :disabled="hasShipmentNo" placeholder="请输入操作员工号" type="text" v-model="form.userCode">
						</u-input>
					</u-form-item>
				</view>
			</u-form>
		</scroll-view>
		<view class="btn-style sws-w100 u-p-t-20 u-flex">
			<u-button type="success" class="btn-style-mini" @click="toShowUpdate">更新</u-button>
			<u-button type="warning" class="btn-style-mini" @click="showClose = true">关结</u-button>
			<u-button type="primary" class="u-flex-1 next-step" @click="toAction">{{ computedActionBtn() }}</u-button>
		</view>
		<u-modal v-model="showClose" title="关结出货牌" :show-cancel-button="true" confirm-text="关结" @confirm="confirmClose">
			<view class="u-flex u-row-center u-p-30">
				<u-form-item label="出货数量" :border-bottom="false" label-width="160">
					<u-input placeholder="请输入出货数量" type="number" v-model="closeQty">
					</u-input>
				</u-form-item>
			</view>
		</u-modal>
		<u-modal v-model="showUpdate" ref="updateModal" title="更新出货牌" :async-close="true" :show-cancel-button="true"
			confirm-text="更新" @confirm="confirmUpdate">
			<view class="u-flex sws-flex-d-column u-col-center">
				<u-form :model="updateForm" ref="updateForm" :error-type="['topTips']" class="u-p-30 sws-wh100">
					<u-form-item label="出货牌号" label-width="140" :border-bottom="false">
						<u-input disabled placeholder="" v-model="updateForm.shipmentNo" @click="toShowShipCardList">
						</u-input>
						<u-icon slot="right" name="arrow-down" size="28" @click="toShowShipCardList"></u-icon>
					</u-form-item>
					<u-form-item required label="固含量" :border-bottom="false" label-width="140" label-align="center"
						prop="soldContent">
						<u-input placeholder="请输入固含量" type="text" v-model="updateForm.soldContent">
						</u-input>
					</u-form-item>
					<u-form-item required label="粘度" :border-bottom="false" label-width="140" label-align="center"
						prop="viscosity">
						<u-input placeholder="请输入粘度" type="text" v-model="updateForm.viscosity">
						</u-input>
					</u-form-item>
				</u-form>
			</view>
		</u-modal>
		<u-select v-model="showSelect" :title="selectTitle" :list="selectList" @confirm="selectConfirm"></u-select>
		<u-modal v-model="showModal" :content="modalContent" @confirm="modalConfirm"></u-modal>
		<mes-login v-show="!+mesSessionId" :loginType="'pmes'"></mes-login>
		<u-top-tips ref="uTips" z-index="10888"></u-top-tips>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'

	import mesLogin from '../../../components/mesLogin/index.vue'

	export default {
		components: {
			mesLogin
		},
		data() {
			return {
				title: '',
				form: {
					taskNo: '',
					formulaNo: '',
					shipmentNo: '',
					requirementQty: '',
					inputQty: '',
					agitationWeight: '',
					engineer: '',
					modelName: ''
				},
				rules: {
					taskNo: [{
						required: true,
						message: '请输入制令单号',
						trigger: ['blur']
					}],
					groupNo: [{
						validator: (rule, value, callback) => {
							if (value) {
								if (this.timer) {
									clearTimeout(this.timer)
								}
								this.timer = setTimeout(async () => {
									const {
										packageId,
										modelName,
										engineer
									} = await this.toCheckGroup()
									this.form.packageId = packageId
									this.form.modelName = modelName
									this.form.engineer = engineer
								}, 500)
								callback()
							} else {
								rule.message = '请输入组别'
								callback(new Error('请输入组别'))
							}
						},
						message: '请输入组别',
						trigger: ['blur', 'change']
					}],
					// formulaNo: [{
					// 	required: true,
					// 	message: `${this.title.includes('搅拌') ? '请输入配方号' : '请输入胶液名称'}`,
					// 	trigger: ['blur']
					// }],
					requirementQty: [{
						required: true,
						message: '请输入需求数量',
						trigger: ['blur']
					}],
					inputQty: [{
						required: true,
						message: '请输入投入数量',
						trigger: ['blur']
					}],
					agitationWeight: [{
						required: true,
						message: '请输入搅拌重量',
						trigger: ['blur']
					}],
					userCode: [{
						required: true,
						message: '请输入操作人员工号',
						trigger: ['blur']
					}],
				},
				updateForm: {}, //更新表单
				updateRules: {
					soldContent: [{
						required: true,
						message: '请输入固含量',
						trigger: ['blur']
					}],
					viscosity: [{
						required: true,
						message: '请输入粘度',
						trigger: ['blur']
					}],
				},
				closeQty: '', //关结出货数量
				deviceList: [], //设备列表
				selectTitle: '',
				selectList: [],
				showSelect: false,
				modalContent: '',
				showModal: false,
				showClose: false,
				showUpdate: false,
				hasShipmentNo: false, //有出货牌则 下一步，无出货牌则 提交出货牌
			}
		},
		computed: {
			...mapState(['mesSessionId', 'mesLoginInfo']),
			computedActionBtn() {
				return () => {
					return this.hasShipmentNo ? '下一步' : '提交'
				}
			},
		},
		watch: {
			mesSessionId(newVal, oldVal) {
				if (newVal) {
					const {
						deviceSn,
						moNo
					} = this.mesLoginInfo
					this.form.deviceNo = deviceSn
					this.form.taskNo = moNo
					this.getShipCardInfo()
				}
			}
		},
		onReady() {
			this.$refs.uForm.setRules(this.rules)
		},
		onLoad({
			type
		}) {
			this.getOpenerEventChannel().on('acceptDataFromOpenerPage', ({
				menuName
			}) => {
				this.title = type == 1 ? `正极${ menuName }` : `负极${ menuName }`
				uni.setNavigationBarTitle({
					title: this.title
				})
			})

			this.updateMesSessionId(0) //重置pmes登录状态，保证每次进入模块都需要重新登录
		},
		methods: {
			...mapMutations(['updateMesSessionId']),
			modalConfirm() {

			},
			confirmUpdate() {
				this.$refs.updateModal.clearLoading()
				this.$refs.updateForm.validate(valid => {
					if (valid) {
						this.$u.api.updateShipCardForPmes({
							sessionId: this.mesSessionId,
							processName: this.title,
							shipmentNo: this.updateForm.shipmentNo,
							soldContent: this.updateForm.soldContent,
							viscosity: this.updateForm.viscosity
						}).then(res => {
							if (res.success) {
								this.showUpdate = false
								this.modalContent = `出货牌(${this.updateForm.shipmentNo})更新固含量、粘度成功！`
								this.showModal = true
							} else {
								this.$refs.uTips.show({
									title: `出货牌更新失败，原因：${ res.msg }`,
									type: 'error',
									duration: 3300
								})
							}
						}).catch(err => {
							this.common.sysErrToast(this, err)
						})
					}
				})
			},
			confirmClose() {
				this.$u.api.closeShipCardForPmes({
					sessionId: this.mesSessionId,
					outQty: this.closeQty,
					shipmentNo: this.form.shipmentNo,
					processName: this.title
				}).then(res => {
					if (res.success) {
						this.closeQty = ''

						this.showClose = false
						this.modalContent = `出货牌(${this.form.shipmentNo})关结成功！`
						this.form = {} //出货牌关结成功，清空当前出货牌信息
						this.showModal = true
					} else {
						this.$refs.uTips.show({
							title: `出货牌关结失败，原因：${ res.msg }`,
							type: 'error',
							duration: 3300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			toShowShipCardList() {
				this.selectTitle = '请选择出货牌'
				this.selectList = this.shipCardList
				this.showSelect = true
			},
			toShowUpdate() {
				this.$u.api.getShipCardListForPmes({
					sessionId: this.mesSessionId,
					taskNo: this.mesLoginInfo.moNo,
					processName: this.title
				}).then(res => {
					if (res.success) {
						this.shipCardList = res.data.map(({
							shipmentNo
						}) => {
							return {
								label: shipmentNo,
								value: shipmentNo
							}
						})

						this.updateForm.shipmentNo = this.shipCardList[0].value //默认展示第一个出货牌，服务端做倒序
						this.showUpdate = true

						setTimeout(() => {
							this.$refs.updateForm.setRules(this.updateRules)
						}, 800)
					} else {
						this.$refs.uTips.show({
							title: `出货牌列表获取失败，原因：${ res.msg }`,
							type: 'error',
							duration: 3300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			toSubmitShipCard() {
				this.$refs.uForm.validate(valid => {
					if (valid) {
						console.log('this.form: ', this.form)
						this.$u.api.postShipCardForPmes({
							userCode: this.mesLoginInfo.userNo,
							...this.form,
							sessionId: this.mesSessionId,
							// taskNo: this.mesLoginInfo.moNo,
							processName: this.title
						}).then(res => {
							if (res.success) {
								this.hasShipmentNo = true
								this.form.shipmentNo = res.data.shipmentNo
							} else {
								this.$refs.uTips.show({
									title: `出货牌提交失败，原因：${ res.msg }`,
									type: 'error',
									duration: 3300
								})
							}
						}).catch(err => {
							this.common.sysErrToast(this, err)
						})
					}
				})
			},
			toCheckGroup() {
				return new Promise(resolve => {
					this.$u.api.checkGroupForPmes({
						sessionId: this.mesSessionId,
						taskNo: this.form.taskNo,
						processName: this.title,
						groupNo: this.form.groupNo
					}).then(res => {
						if (res.success && res.status === 200) {
							resolve(res.data)
						} else {
							this.form.packageId = ''
							this.form.modelName = ''
							this.form.engineer = ''
							this.$refs.uTips.show({
								title: '组别校验失败！',
								type: 'warning',
								duration: 3600
							})
						}
					}).catch(err => {
						this.common.sysErrToast(this, err)
					})
				})
			},
			getShipCardInfo() {
				this.$u.api.getShipCardInfoForPmes({
					sessionId: this.mesSessionId,
					deviceNo: this.form.deviceNo,
					processName: this.title
				}).then(res => {
					if (res.success) {
						if (res.status === 200) { //200表明当前设备有未关结的出货牌
							this.hasShipmentNo = true
							this.form = {
								...res.data[0]
							}
						} else { //非200 表明当前设备出货牌已关结，需要重新获取
							this.hasShipmentNo = false
							const {
								deviceNo
							} = this.form

							const {
								moNo,
								userNo
							} = this.mesLoginInfo
							//如果没有获取到制令单号，则使用登录制令单号，且可以编辑
							this.form = {
								deviceNo,
								taskNo: moNo,
								engineer: '',
								modelName: '',
								userCode: userNo
							}
						}
					} else {
						this.$refs.uTips.show({
							title: `出货牌信息获取失败，原因：${ res.msg }`,
							type: 'error',
							duration: 3600
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			selectConfirm(arr) {
				const {
					label,
					value
				} = arr[0]
				if (this.selectTitle.includes('设备编号')) {
					this.form.deviceNo = label
					this.getShipCardInfo()
				} else {
					this.updateForm.shipmentNo = label
				}
			},
			async toShowDeviceList() {
				if (!this.deviceList.length) {
					this.deviceList = await this.getDeviceList()
				}

				this.selectList = this.deviceList.map(item => {
					return {
						label: item.deviceNo,
						value: item.deviceId,
						extra: {
							...item
						}
					}
				})

				this.selectTitle = '请选择设备编号'
				this.showSelect = true
			},
			getDeviceList() {
				return new Promise((resolve, reject) => {
					this.$u.api.getDeviceListForPmes({
						sessionId: this.mesSessionId,
						processName: this.title,
					}).then(res => {
						if (res.success) {
							resolve(res.data)
						} else {
							resolve([])
						}
					}).catch(err => {
						this.common.sysErrToast(this, err)
					})
				})
			},
			toAction() { //如果没有设备 指令单 出货牌号记录，则先保存，否则进入参数录入
				if (this.hasShipmentNo) {
					this.goToStepDetailPage()
				} else {
					this.toSubmitShipCard()
				}
			},
			goToStepDetailPage() {
				const _self = this
				uni.navigateTo({
					url: '/pages/microApp/Pmes/stirProcedure/stirStepDetail/index',
					events: {
						acceptDataFromOpenedPage: function(data) {
							console.log(data)
						}
					},
					success: function(res) {
						res.eventChannel.emit('acceptDataFromOpenerPage', {
							..._self.form,
							processName: _self.title
						})
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.scroll-wrap {
		width: 100%;
		border-radius: 16rpx;
		overflow: hidden;
		background-color: #fff;
		height: calc(100% - 100rpx);
	}

	.form-card {
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

		&-mini {
			width: 180rpx;
			margin-right: 30rpx;
		}

		&-mini:first-child {
			margin-left: 0 !important;
		}

		&-big.next-step {
			letter-spacing: 10rpx;
			text-indent: 10rpx;
		}
	}

	::v-deep .form-card .u-form-item {
		padding: 0 30rpx 20rpx 40rpx !important;
	}
</style>
