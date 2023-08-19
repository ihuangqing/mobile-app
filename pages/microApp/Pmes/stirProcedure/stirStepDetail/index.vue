<template>
	<view class="sws-wh100 sws-bg-ebebeb u-p-20 u-rela">
		<scroll-view scroll-y scroll-with-animation class="scroll-wrap" :scroll-into-view="scrollIntoView">
			<view class="scroll-wrap-header sws-font-fff">
				<view class="u-flex">
					<view class="u-flex-1">
						<view class="u-font-26">出货牌号</view>
						<view class="u-m-t-4">{{ shipInfo.shipmentNo }}</view>
					</view>
					<view class="u-p-r-10">
						<view class="u-font-26 u-text-center">设备编号</view>
						<view class="u-text-center u-m-t-4">{{ shipInfo.deviceNo }}</view>
					</view>
				</view>
				<view class="u-flex u-p-t-20">
					<view class="u-flex-1 align-baseline" @click="toShowStepList('当前步骤')">
						<u-icon name="dangqianbuzhou" custom-prefix="sws-icon" label="当前" margin-left="0"
							label-size="24" size="26" label-color="#fff"></u-icon>
						<text class="u-m-l-20 u-font-36">{{stepName ? stepName : '选择步骤'}}</text>
					</view>
					<u-line color="#fff" direction="col" length="30" />
					<view class="u-flex-1 u-row-right align-baseline" @click="toShowStepList('下一步')">
						<u-icon name="xiayibu" custom-prefix="sws-icon" label="下一步" margin-left="0" label-size="24"
							size="24" label-color="#fff"></u-icon>
						<text class="u-m-l-20 u-font-36">{{nextStepName ? nextStepName : '选择步骤'}}</text>
					</view>
				</view>
			</view>
			<u-form :model="form" ref="uForm" :error-type="['topTips']" class="sws-wh100">
				<view class="form-card">
					<view class="u-m-b-20 u-p-l-30">
						<view class="sws-font-bold u-font-32 ">参数录入</view>
					</view>
					<u-form-item label="公转转速" :border-bottom="false">
						<u-input placeholder="请输入公转转速" type="text" v-model="form.publicSpeed"></u-input>
					</u-form-item>
					<u-form-item label="自转转速" :border-bottom="false">
						<u-input placeholder="请输入自转转速" type="text" v-model="form.selfVelocity"></u-input>
					</u-form-item>
					<u-form-item label="搅拌时间" :border-bottom="false">
						<u-input placeholder="请输入搅拌时间" type="text" v-model="form.stirTime"></u-input>
					</u-form-item>
					<u-form-item label="温度" :border-bottom="false" label-align="center">
						<u-input placeholder="请输入温度" type="text" v-model="form.temperature"></u-input>
					</u-form-item>
					<u-form-item label="真空度" :border-bottom="false" label-align="center">
						<u-input placeholder="请输入真空度" type="text" v-model="form.vacuum"></u-input>
					</u-form-item>
					<u-form-item label="粘度" :border-bottom="false" label-align="center">
						<u-input placeholder="请输入粘度" type="text" v-model="form.viscosity"></u-input>
						<u-button slot="right" type="success" size="mini" @click="toUpdateViscosity">更新</u-button>
					</u-form-item>
					<u-form-item label="细度" :border-bottom="false" label-align="center">
						<u-input placeholder="请输入细度" type="text" v-model="form.fineness"></u-input>
					</u-form-item>
					<u-form-item label="过筛选" :border-bottom="false" label-align="center">
						<u-input placeholder="请输入过筛选" type="text" v-model="form.filter"></u-input>
					</u-form-item>
					<u-form-item label="操作员" :border-bottom="false" label-align="center">
						<u-input placeholder="请输入操作员工号" type="text" v-model="form.userCode"></u-input>
					</u-form-item>
					<u-form-item label="IPQC" :border-bottom="false" label-align="center">
						<u-input placeholder="请输入IPQC工号" type="text" v-model="form.monitor"></u-input>
					</u-form-item>
					<u-form-item label="除铁要求" :border-bottom="false">
						<u-switch slot="right" v-model="form.chutieCode" :showText="true" okText="有" ngText="无">
						</u-switch>
					</u-form-item>
					<view class="u-m-b-20 u-p-l-40">
						<view class="sws-font-bold u-font-32">物料信息</view>
					</view>
					<u-form-item label="物料编号" :border-bottom="false">
						<u-input placeholder="请扫描物料编号" type="text" v-model="currMatrialCode" class="u-m-r-30"
							@confirm="inputConfirm"></u-input>
						<u-icon name="scan" size="48" color="#2979ff" @click="toScanCode"></u-icon>
					</u-form-item>
					<u-form-item label="物料数量" :border-bottom="false">
						<u-input placeholder="" disabled :value="computedQty(form.qty)" type="text">
						</u-input>
					</u-form-item>
					<view class="u-p-r-30 u-p-b-20 u-p-l-30">
						<uni-swipe-action>
							<uni-swipe-action-item class="swipe-wrap" :style="`background-color: ${ mater.color };`"
								:right-options="options" :id="mater.id" v-for="(mater, index) in materialList"
								:key="index" @click="swipeDeal(index, mater.id)">
								<view class="mater-card u-flex sws-font-fff">
									<view class="u-flex-1 u-m-l-10">
										<view>
											<text class="u-font-24">物料编号：</text>
											<text class="u-font-30 u-m-l-8">{{ mater.materialCode }}</text>
										</view>
										<view class="u-m-t-8">
											<text class="u-font-24">物料批次：</text>
											<text class="u-font-30 u-m-l-8">{{ mater.materialBatch }}</text>
										</view>
									</view>
									<view class="num-card u-content-color">
										<view class="u-font-30 u-text-center">{{ mater.qty }}</view>
										<u-line length="100%" color="#00fff0" margin="4rpx 0"></u-line>
										<view class="u-font-24 u-text-center letter-text">数量</view>
									</view>
								</view>
							</uni-swipe-action-item>
						</uni-swipe-action>
					</view>
				</view>
			</u-form>
		</scroll-view>
		<view class="btn-style sws-w100 u-p-t-20">
			<u-button type="primary" @click="toPostShipCardDetail">提交</u-button>
		</view>
		<u-modal v-model="showNum" title="请输入物料数量" :show-cancel-button="true" @confirm="confirmQty" @cancel="cancelQty">
			<view class="num-modal u-flex u-row-center">
				<u-number-box v-model="form.qty" size="36" :input-width="200" :input-height="100"
					:positive-integer="false" :step="0.1" @focus="numberBoxFocus"></u-number-box>
			</view>
		</u-modal>
		<u-select v-model="showSelect" :title="selectTitle" :list="selectList" @confirm="selectConfirm"></u-select>
		<u-modal v-model="showModal" :content="modalContent"></u-modal>
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
				scrollIntoView: '',
				shipInfo: {}, //出货牌信息
				stepName: '',
				nextStepName: '',
				currMatrialCode: '',
				form: {
					qty: 0,
					chutieCode: false,
				},
				rules: {},
				materialList: [], //显示的物料，包含历史查询的物料
				uploadMaterialList: [], //上传的物料，
				options: [{
					text: '删除',
					style: {
						backgroundColor: '#dd524d'
					}
				}],
				showNum: false,
				modalContent: '',
				showModal: false,
				selectTitle: '',
				selectList: [],
				showSelect: false,
				colorList: ['#18c3c0', '#774aa6', '#f5af19', '#61a0a8', '#0092e5', '#cd93ff', '#9fff5b', '#ff75c3',
					'#ffa647', '#40e0d0'
				],
				currColorIndex: 0 //默认物料颜色初始化值
			}
		},
		computed: {
			...mapState(['mesSessionId', 'factoryId', 'factoryName']),
			computedQty(qty) {
				return (qty) => {
					return qty ? qty : ''
				}
			}
		},
		onReady() {
			this.$refs.uForm.setRules(this.rules)
		},
		onLoad() {
			const eventChannel = this.getOpenerEventChannel()
			eventChannel.on('acceptDataFromOpenerPage', data => {
				this.shipInfo = {
					...data
				}

				this.form.userCode = data.userCode
				this.toGetStepList()
			})
		},
		methods: {
			inputConfirm() {
				this.matrialSn = this.currMatrialCode
				this.currMatrialCode = this.matrialSn.split('#')[0]
				this.toCheckMatrialCode()
			},
			numberBoxFocus() {
				this.form.qty = ''
				console.log('this.form.qty: ', this.form.qty)
			},
			toCheckMatrialCode() {
				this.isScanning = false
				this.$u.api.checkMatrialCodeForPmes({
					sessionId: this.mesSessionId,
					materialSn: this.matrialSn,
					taskNo: this.shipInfo.taskNo,
					processName: this.shipInfo.processName,
					shipmentNo: this.shipInfo.shipmentNo,
					stepName: this.stepName,
					groupNo: this.shipInfo.groupNo,
					organizationId: this.factoryId,
					organization: this.factoryName
				}).then(res => {
					if (res.success) {
						this.curMater = res.data
						this.form.qty = 0
						this.showNum = true
					} else {
						this.currMatrialCode = ''
						this.$refs.uTips.show({
							title: `物料参数校验失败，原因：${ res.msg }`,
							type: 'error',
							duration: 3300
						})
					}
				}).catch(err => {
					this.currMatrialCode = ''
					this.common.sysErrToast(this, err)
				})
			},
			async toScanCode() {
				this.matrialSn = await this.common.scanCode()
				this.currMatrialCode = this.matrialSn.split('#')[0]
				this.toCheckMatrialCode()
			},
			cancelQty() {
				this.currMatrialCode = ''
				this.matrialSn = ''
				this.form.qty = 0
			},
			confirmQty() {
				if (this.form.qty) {
					const id = 'scroll_' + new Date().getTime()
					const repeatMater = this.materialList.find(item => item.materialCode == this.curMater.materialCode)

					let color = ''
					let tempMater = {}
					if (repeatMater) { //如果有物料号重复，则使用相同颜色
						color = repeatMater.color
					} else { //否则使用新颜色
						color = this.colorList[this.currColorIndex]
						this.currColorIndex = this.currColorIndex > 9 ? 0 : this.currColorIndex + 1 //颜色仓库默认给定10个值
					}
					tempMater = {
						...this.curMater,
						id,
						qty: this.form.qty,
						color
					}

					this.materialList.push(tempMater)
					this.uploadMaterialList.push(tempMater)

					this.$nextTick(() => {
						this.scrollIntoView = id
						this.form.qty = 0
						this.currMatrialCode = ''
					})
				} else {
					this.currMatrialCode = ''
					this.$refs.uTips.show({
						title: '物料数量不能为0！',
						type: 'warning',
						duration: 3300
					})
				}
			},
			swipeDeal(index, id) { //删除物料
				this.materialList.splice(index, 1)
				const uploadIndex = this.uploadMaterialList.findIndex(item => item.id == id)
				console.log('uploadIndex: ', uploadIndex)
				this.uploadMaterialList.splice(uploadIndex, 1)
			},
			toPostShipCardDetail() {
				if (this.stepName && this.nextStepName) {
					this.$u.api.postShipCardDetailForPmes({
						sessionId: this.mesSessionId,
						shipmentNo: this.shipInfo.shipmentNo,
						processName: this.shipInfo.processName,
						monitor: this.form.monitor,
						userCode: this.form.userCode,
						organizationId: this.factoryId,
						organization: this.factoryName,
						curStepName: this.stepName,
						nextStepName: this.nextStepName,
						stepParas: {
							...this.form,
							chutie: this.form.chutieCode ? '有' : '无'
						},
						materialList: this.uploadMaterialList,
					}).then(res => {
						if (res.success) {
							this.modalContent = '参数提交成功！'
							this.showModal = true

							this.currColorIndex = 0
							this.materialList = []
							this.uploadMaterialList = []
							this.stepName = ''
							this.nextStepName = ''
							this.form = { //重置数据，只保留操作员工号
								userCode: this.form.userCode
							}
						} else {
							this.$refs.uTips.show({
								title: `参数提交失败，原因：${ res.msg }`,
								type: 'error',
								duration: 3300
							})
						}
					}).catch(err => {
						this.common.sysErrToast(this, err)
					})
				} else {
					this.$refs.uTips.show({
						title: '请选择工步',
						type: 'warning',
						duration: 3300
					})
				}
			},
			toUpdateViscosity() {
				if (!this.stepName) {
					this.$refs.uTips.show({
						title: '请选择当前工步',
						type: 'warning',
						duration: 3300
					})
					return
				}

				if (!this.form.viscosity) {
					this.$refs.uTips.show({
						title: '请输入粘度',
						type: 'warning',
						duration: 3300
					})
					return
				}

				this.$u.api.updateViscosityForPmes({
					sessionId: this.mesSessionId,
					processName: this.shipInfo.processName,
					shipmentNo: this.shipInfo.shipmentNo,
					stepName: this.stepName,
					viscosity: this.form.viscosity
				}).then(res => {
					if (res.success) {
						this.modalContent = '粘度更新成功！'
						this.showModal = true
					} else {
						this.$refs.uTips.show({
							title: `粘度更新失败，原因：${ res.msg }`,
							type: 'error',
							duration: 3300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			toGetShipCardDetail() {
				this.$u.api.getShipCardDetailForPmes({
					sessionId: this.mesSessionId,
					processName: this.shipInfo.processName,
					shipmentNo: this.shipInfo.shipmentNo,
					stepName: this.stepName
				}).then(res => {
					if (res.success) {
						if (res.status === 200) { //如果获取到记录，则复显数据
							this.form = {
								...res.data.stepParas,
								monitor: res.data.monitor,
								userCode: res.data.userCode,
								chutieCode: res.data.stepParas.chutie === '有' ? true : false
							}

							let tempArr = []
							res.data.materialList.forEach(mater => {
								const repeatMater = tempArr.find(item => item.materialCode == mater
									.materialCode) //获取code重复的物料
								let color = ''
								if (repeatMater) { //如果有物料号重复，则使用相同颜色
									color = repeatMater.color
								} else { //否则使用新颜色
									color = this.colorList[this.currColorIndex]
									this.currColorIndex = this.currColorIndex > 9 ? 0 : this.currColorIndex +
										1 //颜色仓库默认给定10个值
								}
								tempArr.push({
									...mater,
									color
								})
							})

							this.materialList = [...tempArr]
							this.uploadMaterialList = []
						} else { //如果查不到数据，则清空表单记录
							this.form = {
								qty: 0,
								chutieCode: false,
								userCode: this.shipInfo.userCode
							}
						}
					} else {
						this.$refs.uTips.show({
							title: `参数记录获取失败，原因：${ res.msg }`,
							type: 'error',
							duration: 3300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			selectConfirm(arr) {
				const {
					label
				} = arr[0]
				if (this.selectTitle.includes('当前步骤')) { //选择当前步骤时，获取历史最新参数记录
					this.stepName = label
					this.toGetShipCardDetail()
				} else {
					this.nextStepName = label
				}
			},
			toShowStepList(title) {
				this.selectTitle = '请选择' + title
				this.selectList = this.stepList
				this.showSelect = true
			},
			toGetStepList() {
				this.$u.api.getStepListForPmes({
					sessionId: this.mesSessionId,
					taskNo: this.shipInfo.taskNo,
					groupNo: this.shipInfo.groupNo,
					processName: this.shipInfo.processName
				}).then(res => {
					if (res.success && res.status === 200) {
						this.stepList = res.data.map(item => {
							return {
								label: item,
								value: item
							}
						})
					} else {
						this.$refs.uTips.show({
							title: `工步获取失败，原因：${ res.msg }`,
							type: 'error',
							duration: 3300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
		}
	}
</script>

<style scoped lang="scss">
	.scroll-wrap {
		width: 100%;
		border-radius: 16rpx;
		overflow: hidden;
		background-color: #fff;
		height: calc(100% - 100rpx);

		&-header {
			padding: 30rpx 40rpx 20rpx;
			border-top-left-radius: 16rpx;
			border-top-right-radius: 16rpx;
			background: linear-gradient(to right, #0083fe, #00fff0);
		}
	}

	.form-card {
		background-color: #fff;
		border-bottom-left-radius: 16rpx;
		border-bottom-right-radius: 16rpx;
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

	.align-baseline {
		display: flex;
		align-items: baseline;
	}

	.num-modal {
		padding: 60rpx 0 30rpx;
	}

	.swipe-wrap {
		border-radius: 16rpx;
		margin-top: 20rpx;
		overflow: hidden;

		.mater-card {
			position: relative;
			padding: 20rpx 30rpx;
			overflow: hidden;

			.num-card {
				min-width: 90rpx;
				padding: 10rpx;
				background-color: #fff;
				border-radius: 12rpx;

				.letter-text {
					text-indent: 10rpx;
					letter-spacing: 10rpx;
				}
			}
		}
	}

	.mater-card.new-add::before {
		content: '新';
		position: absolute;
		top: 0;
		left: 0;
		width: 40rpx;
		height: 40rpx;
		border-top-left-radius: 16rpx;
		border-bottom-right-radius: 16rpx;
		background: #fff;
		font-size: 24rpx;
		line-height: 40rpx;
		text-align: center;
		color: #fa3534;
	}

	.swipe-wrap:first-child {
		margin-top: 0;
	}

	::v-deep .form-card .u-form-item {
		padding: 0 30rpx 20rpx 30rpx !important;
	}
</style>
