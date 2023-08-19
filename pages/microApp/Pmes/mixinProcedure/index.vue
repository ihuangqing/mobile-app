<!-- 单双面涂布、辊压、模切、裁片、分条 多个相似模块复合页面 -->
<template>
	<view class="sws-wh100 sws-bg-ebebeb u-p-20 u-rela">
		<scroll-view scroll-y scroll-with-animation class="scroll-wrap" :scroll-into-view="scrollIntoView">
			<u-form :model="form" ref="uForm" :error-type="['topTips']" class="sws-wh100">
				<view class="form-card">
					<view class="u-m-b-20 u-p-l-40">
						<view class="sws-font-bold u-font-32 ">出货牌信息</view>
					</view>
					<u-form-item required label="设备编号" :border-bottom="false" prop="deviceNo">
						<u-input disabled placeholder="请选择设备编号" v-model="form.deviceNo" type="text"
							@click="toShowDeviceList"></u-input>
						<u-icon name="arrow-down" size="28" @click="toShowDeviceList"></u-icon>
					</u-form-item>
					<u-form-item required label="制令单号" :border-bottom="false" prop="taskNo">
						<u-input :disabled="hasShipmentNo" placeholder="请输入制令单号" v-model="form.taskNo" type="text">
						</u-input>
					</u-form-item>
					<u-form-item label="跨Package投入" :border-bottom="false" label-width="240">
						<u-switch slot="right" v-model="form.isOtherPackage" :showText="true" okText="是" ngText="否"
							@change="packageCheck">
						</u-switch>
					</u-form-item>
					<u-form-item v-show="isPackage" required :label="title.includes('双面') ? '单面出货牌号' : '上节点出货牌号'"
						:border-bottom="false" label-width="240" prop="lastShipmentNo">
						<u-input placeholder="请输入或扫描出货牌号" v-model="form.lastShipmentNo" type="text"
							@confirm="inputConfirm('', form.lastShipmentNo)"></u-input>
						<u-icon name="saoma" custom-prefix="sws-icon" size="48" color="#2979ff" @click="toScanCode">
						</u-icon>
					</u-form-item>
					<u-form-item v-show="isPackage" required label="数量" :border-bottom="false" label-align="center">
						<u-input disabled placeholder="" v-model="form.outQty">
						</u-input>
					</u-form-item>
					<u-form-item v-show="isPackage" required label="剩余" :border-bottom="false" label-align="center">
						<u-input disabled placeholder="" v-model="form.leaveQty">
						</u-input>
					</u-form-item>
					<u-form-item required label="组别" :border-bottom="false" label-align="center" prop="groupNo">
						<u-input :disabled="hasShipmentNo" placeholder="" v-model="form.groupNo"></u-input>
					</u-form-item>
					<u-form-item v-show="hasShipmentNo" required label="出货牌号" :border-bottom="false">
						<u-input disabled placeholder="" v-model="form.shipmentNo">
						</u-input>
					</u-form-item>
					<u-form-item required label="工程师" :border-bottom="false" label-align="center" prop="engineer">
						<u-input placeholder="" type="text" v-model="form.engineer">
						</u-input>
					</u-form-item>
					<u-form-item v-if="title.includes('双面涂布')" required label="浆料批号" :border-bottom="false">
						<u-input :disabled="hasShipmentNo" placeholder="请输入需求数量" type="number" v-model="form.sizeNum">
						</u-input>
					</u-form-item>
					<!-- <u-form-item v-if="['辊压', '模切', '裁片'].filter(item => this.title.includes(item)).length" required
						label="卷料批号" :border-bottom="false" prop="rollNum">
						<u-input placeholder="请输入卷料批号" type="number" v-model="form.rollNum">
						</u-input>
					</u-form-item> -->
					<u-form-item v-if="title.includes('分条')" required label="分条数" :border-bottom="false"
						label-align="center" prop="splitCount">
						<u-input placeholder="请输入分条数" type="number" v-model="form.splitCount">
						</u-input>
					</u-form-item>
					<u-form-item required label="投入数量" :border-bottom="false" prop="inputQty">
						<u-input :disabled="hasShipmentNo" placeholder="请输入投入数量" type="number" v-model="form.inputQty">
						</u-input>
					</u-form-item>
					<u-form-item required label="IPQC" :border-bottom="false" label-align="center" prop="monitor">
						<u-input placeholder="请输入IPQC工号" type="text" v-model="form.monitor"></u-input>
					</u-form-item>
					<u-form-item required label="操作员" :border-bottom="false" label-align="center" prop="userCode">
						<u-input placeholder="请输入操作员工号" type="text" v-model="form.userCode">
						</u-input>
					</u-form-item>
					<!-- <u-form-item v-if="['模切', '分条'].filter(item => this.title.includes(item)).length" required
						label="X&amp;Y" :border-bottom="false" label-align="center">
						<u-switch slot="right" v-model="form.xy" :showText="true" okText="Y" ngText="X">
						</u-switch>
					</u-form-item> -->
					<view v-if="title.includes('单面涂布')" class="u-m-b-20 u-p-l-40">
						<view class="sws-font-bold u-font-32">物料信息</view>
					</view>
					<u-form-item v-if="title.includes('单面涂布')" label="物料编号" :border-bottom="false">
						<u-input placeholder="请扫描物料编号" type="text" v-model="currMatrialCode" class="u-m-r-30"
							@confirm="inputConfirm('material', currMatrialCode)">
						</u-input>
						<u-icon name="saoma" custom-prefix="sws-icon" size="48" color="#2979ff"
							@click="toScanCode('material')">
						</u-icon>
					</u-form-item>
					<u-form-item v-if="title.includes('单面涂布')" label="物料数量" :border-bottom="false">
						<u-input placeholder="" disabled :value="computedQty(qty)" type="text">
						</u-input>
					</u-form-item>
					<view v-if="title.includes('单面涂布')" class="u-p-r-30 u-p-b-20 u-p-l-30">
						<uni-swipe-action>
							<uni-swipe-action-item class="swipe-wrap" :style="`background-color: ${ mater.color };`"
								:right-options="options" :id="mater.id" v-for="(mater, index) in materialList"
								:key="index" @click="swipeDeal(index)">
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
		<view class="btn-style sws-w100 u-p-t-20 u-flex">
			<u-button type="success" class="btn-style-mini" @click="toShowUpdate">更新</u-button>
			<u-button type="warning" class="btn-style-mini" @click="toShowClose">关结</u-button>
			<u-button type="primary" class="u-flex-1 next-step" @click="toSubmitShipCard">提交</u-button>
		</view>
		<u-modal v-model="showClose" title="关结出货牌" :show-cancel-button="true" confirm-text="关结" @confirm="confirmClose">
			<view class="u-row-center u-p-30">
				<u-form-item required label="出货牌号" label-width="140" :border-bottom="false" prop="shipmentNo">
					<u-input placeholder="请输入或扫描出货牌号" v-model="closeShipmentNo"
						@confirm="inputConfirm('close', closeShipmentNo)">
					</u-input>
					<u-icon name="saoma" custom-prefix="sws-icon" size="48" color="#2979ff"
						@click="toScanCode('close')"></u-icon>
				</u-form-item>
				<u-form-item required label="出货数量" :border-bottom="false" label-width="160">
					<u-input placeholder="请输入出货数量" type="number" v-model="closeQty">
					</u-input>
				</u-form-item>
			</view>
		</u-modal>
		<u-modal v-model="showNum" title="请输入物料数量" :show-cancel-button="true" @confirm="confirmQty" @cancel="cancelQty">
			<view class="num-modal u-flex u-row-center">
				<u-number-box v-model="qty" size="36" :input-width="200" :input-height="100" :positive-integer="false"
					:step="0.1" @focus="numberBoxFocus"></u-number-box>
			</view>
		</u-modal>
		<u-modal v-model="showCheck" title="权限校验" :show-cancel-button="true" @cancel="form.isOtherPackage = false"
			@confirm="checkConfirm">
			<view class="u-flex sws-flex-d-column u-col-center">
				<u-form-item class="sws-w100 u-p-r-40" label="工号" label-width="140" :border-bottom="false"
					label-align="center">
					<u-input placeholder="请输入校验人员工号" v-model="checkUser">
					</u-input>
				</u-form-item>
				<u-form-item class="sws-w100 u-p-r-40" label="密码" :border-bottom="false" label-width="140"
					label-align="center">
					<u-input placeholder="请输入密码" type="password" v-model="checkPwd">
					</u-input>
				</u-form-item>
			</view>
		</u-modal>
		<u-modal v-model="showUpdate" ref="updateModal" title="更新出货牌" :async-close="true" :show-cancel-button="true"
			confirm-text="更新" @confirm="confirmUpdate">
			<view class="u-flex sws-flex-d-column u-col-center">
				<u-form :model="updateForm" ref="updateForm" :error-type="['topTips']" class="u-p-30 sws-wh100">
					<u-form-item required label="上一节点出货牌号"
						:label-style="{'word-break': 'normal', 'white-space': 'break-spaces', 'line-height': '28rpx'}"
						label-width="140" :border-bottom="false" prop="lastShipmentNo">
						<u-input placeholder="请输入或扫描出货牌号" v-model="updateForm.lastShipmentNo"
							@confirm="inputConfirm('updateLast', updateForm.lastShipmentNo)">
						</u-input>
						<u-icon name="saoma" custom-prefix="sws-icon" size="48" color="#2979ff"
							@click="toScanCode('updateLast')"></u-icon>
					</u-form-item>
					<u-form-item label="剩余" :border-bottom="false" label-width="140" label-align="center">
						<u-input disabled placeholder="" type="number" v-model="updateForm.leaveQty">
						</u-input>
					</u-form-item>
					<u-form-item required label="出货牌号" label-width="140" :border-bottom="false" prop="shipmentNo">
						<u-input placeholder="请输入或扫描出货牌号" v-model="updateForm.shipmentNo"
							@confirm="inputConfirm('update', updateForm.shipmentNo)">
						</u-input>
						<u-icon name="saoma" custom-prefix="sws-icon" size="48" color="#2979ff"
							@click="toScanCode('update')"></u-icon>
					</u-form-item>
					<u-form-item required label="添加数量" :border-bottom="false" label-width="140" label-align="center"
						prop="inputQty">
						<u-input placeholder="请输入添加数量" type="number" v-model="updateForm.inputQty">
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
				scrollIntoView: '',
				title: '',
				showCheck: false,
				checkUser: '',
				checkPwd: '',
				qty: 0, //物料数量
				currMatrialCode: '',
				isPackage: true, //是否跨package
				form: {
					taskNo: '',
					engineer: '',
					modelName: '',
					lastShipmentNo: '',
					outQty: '',
					leaveQty: '',
					inputQty: '',
					groupNo: '',
					xy: false,
					isOtherPackage: false
				},
				rules: {
					taskNo: [{
						required: true,
						message: '请输入制令单号',
						trigger: ['blur']
					}],
					lastShipmentNo: [{
						validator: async (rule, value, callback) => {
							if (!this.isPackage) {
								callback()
							} else {
								if (value) {
									callback()
								} else {
									rule.message = '请输入或扫描出货牌号'
									callback(new Error('请输入或扫描出货牌号'))
								}
							}
						},
						message: '请输入或扫描出货牌号',
						trigger: ['blur']
					}],
					groupNo: [{
						validator: async (rule, value, callback) => {
							if (!this.isPackage) {
								callback()
							} else {
								if (value) {
									const {
										packageId,
										modelName,
										engineer
									} = await this.toCheckGroup()
									this.form.packageId = packageId
									this.form.modelName = modelName
									this.form.engineer = engineer
									callback()
								} else {
									rule.message = '请输入组别'
									callback(new Error('请输入组别'))
								}
							}
						},
						message: '请输入组别',
						trigger: ['blur']
					}],
					inputQty: [{
						required: true,
						validator: (rule, value, callback) => {
							if (value) {
								callback()
							} else {
								rule.message = '请输入投入数量'
								callback(new Error('请输入投入数量'))
							}
						},
						message: '请输入投入数量',
						trigger: ['blur']
					}],
					monitor: [{
						required: true,
						message: '请输入IPQC工号',
						trigger: ['blur']
					}],
					userCode: [{
						required: true,
						message: '请输入操作人员工号',
						trigger: ['blur']
					}],
				},
				updateForm: {
					shipmentNo: '',
					lastShipmentNo: '',
					inputQty: '',
					leaveQty: '',
				}, //更新表单
				updateRules: {
					lastShipmentNo: [{
						validator: async (rule, value, callback) => {
							if (value) {
								const data = await this.toGetShipCard(value)
								if (data.status == 1) {
									this.updateForm.monitor = data.monitor
									this.updateForm.leaveQty = data.leaveQty
									callback()
								} else {
									rule.message = '上一节点出货牌号未关结！'
									callback(new Error('上一节点出货牌号未关结！'))
								}
							} else {
								rule.message = '请输入或扫描上一节点出货牌号'
								callback(new Error('请输入或扫描上一节点出货牌号'))
							}
						},
						message: '请输入或扫描上一节点出货牌号',
						trigger: ['blur']
					}],
					shipmentNo: [{
						validator: async (rule, value, callback) => {
							if (value) {
								const data = await this.toGetShipCard(value)
								if (data.status === '0') {
									this.updateForm.monitor = data.monitor
									callback()
								} else {
									rule.message = '出货牌号已关结！'
									callback(new Error('出货牌号已关结！'))
								}
							} else {
								rule.message = '请输入或扫描出货牌号'
								callback(new Error('请输入或扫描出货牌号'))
							}
						},
						message: '请输入或扫描出货牌号',
						trigger: ['blur']
					}],
					inputQty: [{
						required: true,
						message: '请输入添加数量',
						trigger: ['blur']
					}],
				},
				materialList: [],
				options: [{
					text: '删除',
					style: {
						backgroundColor: '#dd524d'
					}
				}],
				closeShipmentNo: '', //关结出货牌号
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
				showNum: false,
				colorList: ['#18c3c0', '#774aa6', '#f5af19', '#61a0a8', '#0092e5', '#cd93ff', '#9fff5b', '#ff75c3',
					'#ffa647', '#40e0d0'
				],
				currColorIndex: 0 //默认物料颜色初始化值
			}
		},
		computed: {
			...mapState(['mesSessionId', 'mesLoginInfo', 'factoryId', 'factoryName']),
			computedQty(qty) {
				return (qty) => {
					return qty ? qty : ''
				}
			}
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
			toShowClose() {
				this.closeShipmentNo = this.form.shipmentNo
				this.showClose = true
			},
			numberBoxFocus() {
				this.qty = ''
				console.log('this.qty: ', this.qty)
			},
			swipeDeal(index) { //删除物料
				this.materialList.splice(index, 1)
			},
			toCheckMatrialCode() {
				const params = {
					sessionId: this.mesSessionId,
					materialSn: this.matrialSn,
					taskNo: this.form.taskNo,
					processName: this.title,
					shipmentNo: this.form.shipmentNo,
					// stepName: this.stepName,
					groupNo: this.form.groupNo,
					organizationId: this.factoryId,
					organization: this.factoryName
				}

				console.log('params: ', params)

				this.$u.api.checkMatrialCodeForPmes(params).then(res => {
					if (res.success) {
						this.curMater = res.data
						this.qty = 0
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
			cancelQty() {
				this.currMatrialCode = ''
				this.matrialSn = ''
				this.qty = 0
			},
			confirmQty() {
				if (this.qty) {
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
						qty: this.qty,
						color
					}

					this.materialList.push(tempMater)

					this.$nextTick(() => {
						this.scrollIntoView = id
						this.qty = 0
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
			inputConfirm(flag, code) {
				this.toDealCode(flag, code)
			},
			async toScanCode(flag) {
				const code = await this.common.scanCode()
				this.toDealCode(flag, code)
			},
			async toDealCode(flag, code) {
				if (flag == 'update') {
					const data = await this.toGetShipCard(code)
					if (data.status == '0') {
						this.updateForm.shipmentNo = code
						this.updateForm.monitor = data.monitor
					} else {
						this.$refs.uTips.show({
							title: '出货牌已关结！',
							type: 'warning',
							duration: 3300
						})
					}
				} else if (flag == 'updateLast') {
					const data = await this.toGetShipCard(code)
					if (data.status == '1') {
						this.updateForm.lastShipmentNo = code
						this.updateForm.leaveQty = data.leaveQty
					} else {
						this.$refs.uTips.show({
							title: '出货牌未关结！',
							type: 'warning',
							duration: 3300
						})
					}
				} else if (flag == 'material') {
					this.currMatrialCode = code.split('#')[0]
					this.matrialSn = code
					this.toCheckMatrialCode()
				} else if (flag == 'close') {
					this.closeShipmentNo = code
				} else {
					const data = await this.toGetShipCard(code)
					if (data.status == '1') {
						this.form.lastShipmentNo = code
						this.form.outQty = data.outQty
						this.form.leaveQty = data.leaveQty
						this.form.groupNo = data.groupNo
						this.form.engineer = data.engineer
						// this.form.inputQty = data.inputQty
						// this.form.userCode = data.userCode
					} else {
						this.$refs.uTips.show({
							title: '出货牌未关结！',
							type: 'warning',
							duration: 3300
						})
					}
				}
			},
			checkConfirm() {
				this.$u.api.checkPermissionForPmes({
					userCode: this.checkUser,
					password: this.checkPwd,
					roleCode: '跨工单投入'
				}).then(res => {
					if (res.success) {
						this.modalContent = '权限校验成功'
						this.showModal = true
						this.isPackage = false
					} else {
						this.form.isOtherPackage = false
						this.$refs.uTips.show({
							title: `权限校验失败，原因：${ res.msg }`,
							type: 'error',
							duration: 3300
						})
					}
				}).catch(err => {
					this.form.isOtherPackage = false
					this.common.sysErrToast(this, err)
				})
			},
			packageCheck(value) {
				if (value) {
					this.showCheck = true
				} else {
					this.isPackage = true
				}
			},
			toGetShipCard(shipmentNo) {
				return new Promise(resolve => {
					this.$u.api.getShipCardForPmes({
						shipmentNo
					}).then(res => {
						if (res.success) {
							resolve(res.data)
						} else {
							this.$refs.uTips.show({
								title: `${this.title.includes('双面') ? '单面出货牌':'出货牌'}信息获取失败，原因：${ res.msg }`,
								type: 'error',
								duration: 3300
							})
						}
					}).catch(err => {
						this.common.sysErrToast(this, err)
					})
				})
			},
			modalConfirm() {

			},
			confirmUpdate() {
				this.$refs.updateModal.clearLoading()
				this.$refs.updateForm.validate(valid => {
					if (valid) {
						this.$u.api.updateShipCardMumForPmes({
							sessionId: this.mesSessionId,
							shipmentNo: this.updateForm.shipmentNo,
							lastShipmentNo: this.updateForm.lastShipmentNo,
							userCode: this.mesLoginInfo.userNo,
							monitor: this.updateForm.monitor,
							inputQty: this.updateForm.inputQty
						}).then(res => {
							if (res.success) {
								this.showUpdate = false
								this.modalContent = `出货牌(${this.updateForm.shipmentNo})更新成功！`
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
				if (this.closeQty == '') {
					this.$refs.uTips.show({
						title: '请输入出货数量',
						type: 'warning',
						duration: 3300
					})
					return
				}

				const params = {
					sessionId: this.mesSessionId,
					outQty: this.closeQty,
					shipmentNo: this.closeShipmentNo,
					processName: this.title
				}

				this.$u.api.closeShipCardForPmes(params).then(res => {
					if (res.success) {
						this.form = {} //出货牌关结成功，清空当前出货牌信息
						this.closeQty = ''
						this.currColorIndex = 0
						this.materialList = []

						this.showClose = false
						this.modalContent = `出货牌(${this.closeShipmentNo})关结成功！`
						this.closeShipmentNo = ''
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
				this.showUpdate = true
				this.updateForm.shipmentNo = this.form.shipmentNo

				setTimeout(() => {
					this.$refs.updateForm.setRules(this.updateRules)
				}, 800)
			},
			toSubmitShipCard() {
				this.$refs.uForm.validate(valid => {
					if (valid) {
						console.log('this.form: ', this.form)
						let params = {
							...this.form,
							inputQty: +this.form.inputQty,
							sessionId: this.mesSessionId,
							taskNo: this.form.taskNo,
							processName: this.title,
							lastShipmentNo: this.form.lastShipmentNo,
							testParas: [],
						}

						const xy = {
							stepName: this.title,
							itemName: 'X&Y',
							itemValue: 'Y'
						}

						const sizeNum = {
							stepName: this.title,
							itemName: '浆料批号',
							itemValue: this.form.sizeNum
						}

						const rollNum = {
							stepName: this.title,
							itemName: '卷料批号',
							itemValue: ''
						}

						if (['模切', '分条'].filter(item => this.title.includes(item)).length) {
							params.testParas.push(xy)
						}

						if (['双面涂布'].filter(item => this.title.includes(item)).length) {
							params.testParas.push(sizeNum)
						}

						if (['辊压', '模切', '裁片'].filter(item => this.title.includes(item)).length) {
							params.testParas.push(rollNum)
						}

						if (this.title.includes('单面涂布')) {
							params.materialList = this.materialList
						}

						console.log('params: ', params)
						this.$u.api.postShipCartSubmitCommonForPmes(params).then(res => {
							if (res.success) {
								this.hasShipmentNo = true
								this.modalContent = res.msg
								this.showModal = true
								this.currColorIndex = 0
								this.materialList = []
								this.$refs.uForm.resetFields()
								this.form = {}
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
		padding: 0 30rpx 20rpx 40rpx !important;
	}
</style>
