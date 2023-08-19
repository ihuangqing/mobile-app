<template>
	<view class="sws-wh100 sws-bg-ebebeb u-p-20 u-rela">
		<scroll-view scroll-y scroll-with-animation :class="form.readOnly ? 'scroll-wrap read-only' : 'scroll-wrap'">
			<u-form :model="form" ref="uForm" :error-type="['topTips']">
				<view class="form-card">
					<view class="u-m-b-20 u-p-l-40 u-p-r-30 u-flex u-row-between u-col-center">
						<view class="sws-font-bold u-font-32 ">基础信息</view>
						<u-icon v-if="moduleType === 4" name="plus-circle" color="#2979ff" size="28" label="增加拉线"
							label-color="#2979ff" @click="toAddLineSection">
						</u-icon>
					</view>
					<u-form-item required :border-bottom="false" label="组织类型">
						<u-radio-group v-model="farmType" @change="changeFarmType">
							<u-radio v-for="(item, index) in factoryList" :key="index" :name="item.code">
								{{ item.name }}
							</u-radio>
						</u-radio-group>
					</u-form-item>
					<u-form-item v-if="farmType === 1 " required :border-bottom="false" label="项目名称" prop="projectName">
						<u-input v-model="form.projectName" disabled placeholder="请输入项目名称" @click="toShowProject" />
						<u-icon slot="right" name="arrow-down" size="28" @click="toShowProject"></u-icon>
					</u-form-item>
					<uni-swipe-action ref="swipeAction">
						<uni-swipe-action-item :disabled="form.lineInfoList.length === 1" :right-options="options"
							v-for="(item, index) in form.lineInfoList" :key="index" @click="deal(index)">
							<view :class="moduleType === 4 ? 'line-section': ''">
								<u-form-item required :border-bottom="false" label="拉线" label-align="center" prop="lineInfoList">
									<u-input :value="item.lineName" type="text" disabled placeholder="请选择拉线"
										@click="toShowLines(index)" />
									<u-icon slot="right" name="arrow-down" size="28" @click="toShowLines(index)">
									</u-icon>
								</u-form-item>
								<u-form-item required :border-bottom="false" label="工段" label-align="center" prop="lineInfoList">
									<u-input v-model="item.sectionName" disabled placeholder="请选择工段" @click="toShowSection(index)" />
									<u-icon slot="right" name="arrow-down" size="28" @click="toShowSection(index)">
									</u-icon>
								</u-form-item>
							</view>
						</uni-swipe-action-item>
					</uni-swipe-action>
					<u-form-item required :border-bottom="false" label="采集日期" prop="actionDate">
						<u-input :value="computedDate(form)" disabled placeholder="请选择采集日期" @click="toShowDate" />
						<u-icon slot="right" name="calendar" size="28" @click="toShowDate"></u-icon>
					</u-form-item>
				</view>
				<view class="form-card">
					<view class="sws-font-bold u-font-32 u-m-b-20 u-p-l-40">工时信息</view>
					<u-form-item required :border-bottom="false" label="工时类型" prop="hourType">
						<u-input :value="form.hourType" disabled placeholder="请选择工时类型" @click="toHourType" />
						<u-icon v-if="showMoreType" slot="right" name="arrow-down" size="28" @click="toHourType">
						</u-icon>
					</u-form-item>
					<u-form-item v-if="moduleType === 5" required :border-bottom="false" label="班次" prop="shiftType">
						<u-radio-group v-model="form.shiftType">
							<u-radio v-for="(item, index) in shiftList" :key="index" :name="item.type" :disabled="item.disabled">
								{{ item.name }}
							</u-radio>
						</u-radio-group>
					</u-form-item>
					<u-form-item required :border-bottom="false" label="影响人员">
						<u-input :value="form.staffList.map(user => user.userName).join('、')" disabled placeholder="请选择影响人员"
							@click="toShowStaff" />
						<u-icon slot="right" name="arrow-right" size="28" @click="toShowStaff"></u-icon>
					</u-form-item>
					<u-form-item required :border-bottom="false" label="影响人数" prop="staffList">
						<u-input :value="form.staffList.length ? form.staffList.length : ''" disabled placeholder="" />
					</u-form-item>
					<u-form-item v-if="moduleType !== 5" required :border-bottom="false" label="开始时间" prop="workStartTime">
						<u-input v-model="form.workStartTime" disabled placeholder="" @click="toShowTime('start')" />
						<u-icon slot="right" name="shijian" custom-prefix="sws-icon" size="28"
							@click="toShowTime('start')"></u-icon>
					</u-form-item>
					<u-form-item v-if="moduleType !== 5" required :border-bottom="false" label="结束时间" prop="workEndTime">
						<u-input v-model="form.workEndTime" disabled placeholder="" @click="toShowTime('end')" />
						<u-icon slot="right" name="shijian" custom-prefix="sws-icon" size="28" @click="toShowTime('end')"></u-icon>
					</u-form-item>
					<u-form-item required :border-bottom="false" label="单位工时" prop="timeUnitMinute">
						<u-input v-model="form.timeUnitMinute" :disabled="moduleType !== 5" type="number"
							:placeholder="moduleType !== 5 ? '': '请输入单位工时(分钟)' " />
					</u-form-item>
					<u-form-item required :border-bottom="false" label="合计工时">
						<u-input :value="computedTotalHour(form.staffList, form.timeUnitMinute)" disabled placeholder="" />
					</u-form-item>
					<u-form-item required :border-bottom="false" label="工作描述" label-position="top" prop="description">
						<u-input v-model="form.description" type="textarea" :border="true" maxlength="100" placeholder="请输入工作内容" />
					</u-form-item>
				</view>
				<view class="form-card">
					<view class="sws-font-bold u-font-32 u-m-b-20 u-p-l-40">责任内容</view>
					<u-form-item :required="isNeedApprove" :border-bottom="false" label="责任部门"
						:prop="isNeedApprove ? 'responsibleDepart' : ''">
						<u-input v-model="form.responsibleDepart" placeholder="请输入责任部门" />
					</u-form-item>
					<u-form-item v-if="isNeedApprove" required :border-bottom="false" label="责任人" prop="approverAccount">
						<u-input :value="computedApprove(form.approverName, form.approverAccount)" disabled placeholder="请选择责任人"
							@click="toShowChecker" />
						<u-icon slot="right" name="arrow-right" size="28" @click="toShowChecker"></u-icon>
					</u-form-item>
				</view>
			</u-form>
		</scroll-view>
		<view class="btn-style sws-w100 u-p-t-20" v-show="!form.readOnly">
			<u-button type="primary" @click="toSubmit">确认</u-button>
		</view>
		<u-calendar v-model="showDate" :mode="mode" :max-date="maxDate" @change="confirmDate"></u-calendar>
		<u-select v-model="showSelect" :list="selectList" :title="selectTitle" @confirm="confirmSelect"></u-select>
		<u-modal v-model="showModal" :content="modalContent" @confirm="modalConfirm"></u-modal>
		<u-modal v-model="showModalConfirm" content="" :show-cancel-button="true" @confirm="postSubmitData">
			<view class="modal-wrap">
				<u-form :model="form">
					<u-form-item :border-bottom="false" label="工时类型:">
						<u-input :value="form.hourType" disabled placeholder="" />
					</u-form-item>
					<u-form-item :border-bottom="false" label="影响人数:">
						<u-input :value="form.staffList.length ? form.staffList.length : ''" disabled placeholder="" />
					</u-form-item>
					<u-form-item :border-bottom="false" label="单位工时:">
						<u-input :value="form.timeUnitMinute" type="number" disabled placeholder="" />
					</u-form-item>
					<u-form-item :border-bottom="false" label="合计工时:">
						<u-input :value="computedTotalHour()" disabled placeholder="" />
					</u-form-item>
				</u-form>
			</view>
		</u-modal>
		<u-picker v-model="showTimePicker" mode="time" :default-time="defaultTime" :params="timeParams"
			@confirm="timeConfirm"></u-picker>
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
				timeParams: {
					year: true,
					month: true,
					day: true,
					hour: true,
					minute: true,
					second: false,
					timestamp: true,
				},
				defaultTime: '',
				showTimePicker: false,
				currHour: {}, //当前工时类型
				moduleType: 0, //模块类型（1-生产异常工时，2-外部异常工时，3-被动培训，4-辅助人员工时，5-转嫁工时)
				form: {
					projectName: '',
					projectId: '',
					hourType: '', //工时类型 (1~15) name
					worktimeType: 0, //工时类型 (1~15) code
					actionDate: '', //采集日期（采集日期开始）
					workStartTime: '', //开始时间
					workEndTime: '', //结束时间
					actionEndDate: '', //采集日期结束
					timeUnitMinute: '', //单位工时
					totalMinute: '', //合计工时
					description: '', //工作描述
					responsibleDepart: '', //责任部门
					approverAccount: '', //审批责任人工号
					approverName: '', //审批责任人姓名
					lineInfoList: [{
						lineName: '',
						sectionName: ''
					}], //拉线信息集合
					staffList: [], //影响员工信息集合
					shiftType: null, //班次
				},
				shiftList: [{
					name: '白班',
					type: 0
				}, {
					name: '夜班',
					type: 1
				}],
				rules: {
					projectName: [{
						required: true,
						trigger: ['change', 'blur'],
						message: '请选择项目名称'
					}],
					lineInfoList: [{
						validator: (rule, list, callback) => {
							const lineValid = list.every(item => {
								return item.lineId
							})

							const sectionValid = list.every(item => {
								return item.sectionId
							})

							if (!lineValid) {
								rule.message = '请选择拉线'
								callback(new Error('请选择拉线'))
							} else if (!sectionValid) {
								rule.message = '请选择工段'
								callback(new Error('请选择工段'))
							} else {
								callback()
							}
						},
						message: '请选择拉线',
						trigger: 'blur',
					}],
					actionDate: [{
						validator: (rule, actionDate, callback) => {
							if (this.moduleType === 5) {
								if (actionDate && this.form.actionEndDate) {
									callback()
								} else {
									callback(new Error('请选择采集日期'))
								}
							} else {
								if (actionDate) {
									callback()
								} else {
									callback(new Error('请选择采集日期'))
								}
							}
						},
						message: '请选择采集日期',
						trigger: 'blur'
					}],
					hourType: [{
						required: true,
						message: '请选择工时类型',
						trigger: 'blur'
					}],
					shiftType: [{
						validator: (rule, val, callback) => {
							if (val === null) {
								callback(new Error('请选择班次'))
							} else {
								callback()
							}
						},
						message: '请选择班次',
						trigger: 'blur',
					}],
					staffList: [{
						validator: (rule, list, callback) => {
							if (!list.length) {
								callback(new Error('请选择影响人员'))
							} else {
								callback()
							}
						},
						message: '请选择影响人员',
						trigger: 'blur',
					}],
					timeUnitMinute: [{
						validator: (rule, value, callback) => {
							if (value == '') {
								rule.message = '请输入单位工时'
								callback(new Error('请输入单位工时'))
							} else if (value > 0) {
								callback()
							} else {
								rule.message = '单位工时必须大于0'
								callback(new Error('单位工时必须大于0'))
							}
						},
						trigger: ['change', 'blur']
					}],
					description: [{
						required: true,
						message: '请输入工作内容',
						trigger: 'blur'
					}],
					responsibleDepart: [{
						required: true,
						message: '请输入责任部门',
						trigger: 'blur'
					}],
					approverAccount: [{
						required: true,
						message: '请选择责任人',
						trigger: 'blur'
					}],
				},
				farmType: 0, //组织类型（0-电芯组织，1-电池组织）
				factoryList: [{
						name: '电池组织',
						code: 1
					},
					{
						name: '电芯组织',
						code: 0
					}
				],
				curLineSectionIndex: 0, //当前操作的拉线工段组合下标
				isNeedApprove: false, //是否需要审批
				showMoreLine: false, //拉线是否可多选， 辅助人员工时类型，可以选择多拉线
				showMoreType: true, //辅助人员工时、转嫁人员工时只有一个类型，无需选择，直接默认
				hourArray: [{
						name: '生产异常工时',
						id: 1,
						typeList: [{
							label: '首件',
							value: 1,
							extra: 'hourType'
						}, {
							label: '5S',
							value: 2,
							extra: 'hourType'
						}, {
							label: '设备异常停机维修',
							value: 3,
							extra: 'hourType'
						}, {
							label: 'PM保养',
							value: 4,
							extra: 'hourType'
						}]
					},
					{
						name: '外部异常工时',
						id: 2,
						typeList: [{
							label: '试验单影响',
							value: 5,
							extra: 'hourType'
						}, {
							label: '品质异常冻结(内部)',
							value: 6,
							extra: 'hourType'
						}, {
							label: '品质异常冻结(供应商)',
							value: 7,
							extra: 'hourType'
						}, {
							label: '设备故障停机（内部）',
							value: 8,
							extra: 'hourType'
						}, {
							label: '设备故障停机（供应商）',
							value: 9,
							extra: 'hourType'
						}]
					},
					{
						name: '被动培训工时',
						id: 3,
						typeList: [{
							label: '无生产计划',
							value: 10,
							extra: 'hourType'
						}, {
							label: '切线',
							value: 11,
							extra: 'hourType'
						}, {
							label: '待料(内部)',
							value: 12,
							extra: 'hourType'
						}, {
							label: '待料(外部)',
							value: 13,
							extra: 'hourType'
						}]
					},
					{
						name: '辅助人员工时',
						id: 4,
					},
					{
						name: '转嫁工时',
						id: 5,
					}
				],
				projectList: [], //项目名称列表
				lineList: [], //拉线选择列表
				groupList: [], //工段选择列表
				mode: 'date', //选择日期模式
				maxDate: '', //可选最大日期
				showDate: false,
				selectTitle: '',
				selectList: [],
				showSelect: false,
				options: [{
					text: '删除',
					style: {
						backgroundColor: '#dd524d'
					}
				}],
				modalContent: '',
				showModal: false,
				showModalConfirm: false // 二次确认
			}
		},
		computed: {
			...mapState(['factoryName', 'factoryId', 'userInfo']),
			computedDate(form) {
				return form => {
					if (form.actionDate) {
						return this.moduleType !== 5 ? form.actionDate :
							`${ form.actionDate } ~ ${ form.actionEndDate }`
					} else {
						return ''
					}
				}
			},
			computedTotalHour() {
				return () => {
					if (this.form.staffList && this.form.staffList.length && this.form.timeUnitMinute) {
						if (this.moduleType === 5) {
							this.form.totalMinute = Math.round(this.form.timeUnitMinute * this.form.staffList.length * 100) / 100
							return this.form.totalMinute
						} else {
							this.form.totalMinute = Math.round(this.form.timeUnitMinute * this.form.staffList.length)
							return this.form.totalMinute
						}
					}
					return ''
				}

			},
			computedApprove(approverName, approverAccount) {
				return (approverName, approverAccount) => {
					if (approverName && approverAccount) {
						return approverName + '（' + approverAccount + '）'
					} else {
						return ''
					}
				}
			}
		},
		onLoad() {
			const eventChannel = this.getOpenerEventChannel()
			eventChannel.on('acceptDataFromOpenerPage', item => {
				let title = '工时采集'
				if (item.fromRecord) { //重新发起
					this.currHour = this.hourArray.filter(({
						id
					}) => id == item.moduleType)[0]

					title = this.currHour.name

					this.form = {
						...item
					}

					if (this.currHour.id != 4 && this.currHour.id != 5) {
						const hourType = this.currHour.typeList.filter(temp => temp.value == item.worktimeType)[0]
							.label
						this.form.hourType = hourType
					}

					this.farmType = +item.farmType
				} else { //分类页
					title = item.menuName
					this.currHour = this.hourArray.filter(({
						name
					}) => name == item.menuName)[0]

					if (this.factoryName && this.factoryName.includes('电池')) {
						this.farmType = 1
					}
				}

				uni.setNavigationBarTitle({
					title
				})

				this.moduleType = this.currHour.id

				if (this.moduleType == 2) { //外部异常工时
					this.isNeedApprove = true //需要审批
				} else if (this.moduleType == 4) { //辅助人员工时
					// 拉线可以多选
					this.form.hourType = title
					this.form.worktimeType = 14
					this.showMoreLine = true
					this.showMoreType = false
				} else if (this.moduleType == 5) { //转嫁人员工时
					this.form.hourType = title
					this.form.worktimeType = 15
					this.showMoreType = false
					this.isNeedApprove = true //需要审批
				} else if (this.moduleType == 3) {
					if (item.worktimeType && item.worktimeType == 13) {
						this.isNeedApprove = true
					}
				}
			})
		},
		onReady() {
			this.$refs.uForm.setRules(this.rules)
		},
		methods: {
			validateDate(start, end) {
				return new Date(start).getTime() < new Date(end).getTime()
			},
			timeConfirm(date) {
				console.log('date: ', date)
				if (this.timeType === 'start') {
					const time = this.form.actionDate + ' ' + date.hour + ':' + date.minute
					if (this.validateDate(time, this.form.workEndTime)) {
						this.form.workStartTime = time
					} else {
						this.$refs.uTips.show({
							title: '开始时间不能晚于结束时间',
							type: 'warning',
							duration: '3300'
						})
					}
				} else {
					const time = this.$u.timeFormat(date.timestamp, 'yyyy-mm-dd hh:MM')
					if (this.validateDate(this.form.workStartTime, time)) {
						this.form.workEndTime = time
					} else {
						this.$refs.uTips.show({
							title: '结束时间不能早于开始时间',
							type: 'warning',
							duration: '3300'
						})
					}
				}

				this.form.timeUnitMinute = (new Date(this.form.workEndTime).getTime() - new Date(this.form.workStartTime)
					.getTime()) / 60 / 1000
			},
			toShowTime(flag) {
				if (this.form.actionDate) {
					this.timeType = flag
					if (flag === 'start') { //开始时间
						this.timeParams = {
							year: false,
							month: false,
							day: false,
							hour: true,
							minute: true,
							second: false,
							timestamp: true,
						}
						this.defaultTime = this.form.workStartTime
					} else { //结束时间
						this.timeParams = {
							year: true,
							month: true,
							day: true,
							hour: true,
							minute: true,
							second: false,
							timestamp: true,
						}
						this.defaultTime = this.form.workEndTime
					}
					this.showTimePicker = true
				} else {
					this.$refs.uTips.show({
						title: '请选择采集日期',
						type: 'warning',
						duration: 3300
					})
				}
			},
			changeFarmType(farmType) {
				if (!farmType) {
					this.form.projectName = ''
					this.form.projectId = ''
				}
			},
			modalConfirm() {
				if (this.form.fromRecord) { // 从记录过来直接返回
					const eventChannel = this.getOpenerEventChannel()
					eventChannel.emit('acceptDataFromOpenedPage', {
						docNo: this.form.docNo,
						id: this.form.id
					})
					uni.navigateBack()
				} else { // 清空工时信息
					this.form.hourType = ''
					this.form.shiftType = null
					this.form.staffList = []
					this.form.timeUnitMinute = ''
					this.form.description = ''
					this.form.responsibleDepart = ''
					this.form.approverName = ''
					this.form.approverAccount = ''
				}
			},
			toSubmit() {
				this.$refs.uForm.validate(valid => {
					if (valid) {
						this.showModalConfirm = true
					}
				})
			},
			postSubmitData() {
				const params = {
					...this.form,
					farmType: this.farmType,
					moduleType: this.moduleType,
					creatorAccount: this.userInfo.account
				}

				let func = 'postHourCollection'
				if (this.form.fromRecord) { //是否来自审批进度
					func = 'postHourCollectionUpdate'
				}

				this.$u.api[func](params).then(res => {
					if (res.msgCode === '000000') {
						this.modalContent = this.isNeedApprove ? '提交成功，待审批！' : '工时采集成功！'
						this.showModal = true
					} else {
						this.$refs.uTips.show({
							title: `工时采集提交失败，原因：${ res.message }`,
							type: 'error',
							duration: 2300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			toShowStaff() {
				const params = {
					factoryId: this.factoryId,
					foremanAcct: this.userInfo.account
				}

				if (this.moduleType === 5) { //若是转嫁工时，则不需要限制采集日期（因为采集日期可以为未来时间）
					params.isTransfer = 1
				} else {
					const lineArr = this.form.lineInfoList.filter(line => line.lineId)
					//生产异常工时、外部异常工时、被动培训工时三种类型的影响人员需要拉线限制
					this.isCtrlStaffs = [1, 2, 3].includes(this.moduleType)
					if (this.isCtrlStaffs && !lineArr.length) {
						this.$refs.uTips.show({
							title: '请选择拉线',
							type: 'warning',
							duration: 2300
						})
						return
					}

					if (!this.form.actionDate) {
						this.$refs.uTips.show({
							title: '请选择采集日期',
							type: 'warning',
							duration: 2300
						})
						return
					}

					params.isTransfer = 0
					params.workDate = this.form.actionDate
					if (this.isCtrlStaffs) {
						params.lineId = lineArr[0].lineId
					}
				}

				this.$u.api.getCollectUserList(params).then(async res => {
					if (res.msgCode === '000000' && res.data) {
						if (res.data.length) {
							let list = res.data.map(item => {
								let userObj = {
									name: `${ item.userName }(${ item.account })`,
									value: JSON.stringify(item),
									checked: false
								}

								if (this.isCtrlStaffs) {
									userObj.desc = `${ item.lineName } → ${ item.postName } `
								}

								return userObj
							})

							const params = {
								title: '请选择影响人',
								list,
								hasSearch: true,
								isRadio: false
							}

							const staffList = await this.common.goToSelected(params)
							this.form.staffList = staffList.map(item => {
								return JSON.parse(item.value)
							})
						} else {
							this.$refs.uTips.show({
								title: '影响人员数据为空！',
								type: 'warning',
								duration: '2300'
							})
						}
					} else {
						this.$refs.uTips.show({
							title: `影响人员数据获取失败，原因：${ res.message }`,
							type: 'error',
							duration: '2300'
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			deal(index) { //滑动删除
				if (this.form.lineInfoList.length === 1) {
					this.$refs.swipeAction['close-all']()
					return
				}
				setTimeout(() => { //等待动画结束之后做删除操作
					this.form.lineInfoList.splice(index, 1)
				}, 500)
			},
			toAddLineSection() {
				this.form.lineInfoList.push({
					lineName: '',
					sectionName: ''
				})
			},
			toShowProject() { //获取项目列表
				const params = {
					query: { //实际项目数据不会很多，此处直接查100条
						page: 1,
						limit: 100
					},
					body: {
						factoryId: this.factoryId
					}
				}

				this.$u.api.getProjectList(params).then(res => {
					if (res.msgCode === '000000' && res.data) {
						if (res.data.data.length) {
							this.projectList = res.data.data.map(({
								projectName,
								id
							}) => {
								return {
									label: projectName,
									value: id,
									extra: 'project'
								}
							})

							this.selectTitle = '请选择项目名称'
							this.selectList = this.projectList
							this.showSelect = true
						} else {
							this.$refs.uTips.show({
								title: '暂无项目数据，请联系管理员！',
								type: 'warning',
								duration: '2300'
							})
						}
					} else {
						this.$refs.uTips.show({
							title: `项目列表数据获取失败，原因：${ res.message }`,
							type: 'error',
							duration: '2300'
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			confirmDate(date) {
				if (this.moduleType === 5) {
					this.form.actionDate = date.startDate
					this.form.actionEndDate = date.endDate
				} else {
					this.form.actionDate = date.result
					this.form.workStartTime = date.result + ' 00:00'
					this.form.workEndTime = date.result + ' 23:59'
					this.form.timeUnitMinute = 1439
				}
			},
			toShowDate() {
				if (this.moduleType === 5) { //转嫁工时
					this.mode = 'range'
					this.maxDate = '2050-12-30'
				} else {
					this.maxDate = this.$u.timeFormat(new Date(), 'yyyy-mm-dd')
					this.mode = 'date'
				}
				this.showDate = true
			},
			confirmSelect(arr) {
				const {
					label,
					value,
					extra
				} = arr[0]

				const tempLineSection = this.form.lineInfoList[this.curLineSectionIndex]
				if (extra === 'line') { //拉线
					tempLineSection.lineName = label
					tempLineSection.lineId = value.id
					tempLineSection.lineCode = value.lineCode
					// 变更拉线,重置工段数据
					tempLineSection.sectionName = ''
					tempLineSection.sectionId = ''
					tempLineSection.sectionCode = ''
				} else if (extra === 'section') { //工段
					if (this.form.lineInfoList.filter(item => item.sectionId === value.id).length) {
						this.$refs.uTips.show({
							title: '此拉线、工段已存在！ ',
							type: 'warning',
							duration: '2300'
						})
						return
					}
					tempLineSection.sectionName = label
					tempLineSection.sectionId = value.id
					tempLineSection.sectionCode = value.sectionCode
				} else if (extra === 'hourType') { //工时类型
					this.form.hourType = label
					this.form.worktimeType = value
					if ((this.moduleType === 3 && value === 13) || this.moduleType === 2) { //被动培训+待料(外部) 或者 外部异常工时  需要审批
						this.isNeedApprove = true
					} else {
						this.isNeedApprove = false
					}
				} else if (extra === 'project') {
					this.form.projectName = label
					this.form.projectId = value
				}
			},
			toHourType() {
				if (this.moduleType === 4 || this.moduleType === 5) { //辅助人员工时、转嫁工时模块只有一种工时类型，直接赋值
					return
				}
				this.selectTitle = this.currHour.name
				this.selectList = this.currHour.typeList
				this.showSelect = true
			},
			async toShowLines(index) { //获取拉线数据,展示拉线列表
				this.curLineSectionIndex = index //记录当前操作的下标
				this.selectTitle = '请选择拉线'
				if (!this.lineList.length) {
					let lines = await this.baseData.getLines(this) //通过通用数据请求方法获取
					if (lines.length > 0) {
						this.lineList = lines.map(item => {
							return {
								label: item.lineName,
								value: item,
								extra: 'line'
							}
						})
					} else {
						this.$refs.uTips.show({
							title: '拉线列表获取失败！',
							type: 'error',
							duration: '2300'
						})

						return
					}
				}

				this.selectTitle = '请选择拉线'
				this.selectList = this.lineList
				this.showSelect = true
			},
			toShowSection(index) {
				this.curLineSectionIndex = index
				const temp = this.form.lineInfoList[index]
				if (!temp.lineId) {
					this.$refs.uTips.show({
						title: '请选择拉线',
						type: 'warning',
						duration: 2300
					})
					return
				}

				const params = {
					lineId: temp.lineId
				}

				this.$u.api.getCondList(params).then(res => {
					if (res.msgCode === '000000' && res.data) {
						if (res.data.length) {
							this.sectionList = res.data.map(item => {
								return {
									label: item.sectionName,
									value: item,
									extra: 'section'
								}
							})

							this.selectTitle = '请选择工段'
							this.selectList = this.sectionList
							this.showSelect = true
						} else {
							this.$refs.uTips.show({
								title: '暂无工段数据，请联系管理员！',
								type: 'warning',
								duration: 2300
							})
						}
					} else {
						this.$refs.uTips.show({
							title: `工段数据查询失败，原因:${ res.message }`,
							type: 'error',
							duration: 2300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			async toShowChecker() { //责任人
				const params = {
					query: {
						page: 1,
						limit: 20
					},
					body: {}
				}
				const list = await this.toGetApproveUserList(params)

				if (list.length) {
					const params = {
						title: '请选择责任人',
						list,
						hasSearch: true,
						isRadio: true,
						filterFunc: keyword => {
							return new Promise(async resolve => {
								const params = {
									query: {
										page: 1,
										limit: 100
									},
									body: {
										userName: keyword
									}
								}
								const userList = await this.toGetApproveUserList(params)
								resolve(userList)
							})
						}
					}

					const checkerList = await this.common.goToSelected(params)
					console.log('checkerList: ', checkerList)
					this.form.approverAccount = checkerList[0].value
					this.form.approverName = checkerList[0].name.split('（')[0]

				} else {
					this.$refs.uTips.show({
						title: '暂未查到责任人数据',
						type: 'warning',
						duration: 2300
					})
				}
			},
			toGetApproveUserList(params) {
				return new Promise((resolve, reject) => {
					this.$u.api.getUserListFromSysadmin(params).then(res => {
						if (res.msgCode === '000000' && res.data && res.data.data.length) {
							const list = res.data.data.map(({
								userName,
								account,
								deptName
							}) => {
								return {
									name: userName + '（' + account + '）',
									value: account,
									desc: deptName,
									checked: false
								}
							})
							resolve(list)
						} else {
							resolve([])
							this.$refs.uTips.show({
								title: `责任人获取失败，原因：${ res.message }`,
								type: 'error',
								duration: 2300
							})
						}
					}).catch(err => {
						resolve([])
						this.common.sysErrToast(this, err)
					})
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
		height: calc(100% - 100rpx);
	}

	.scroll-wrap.read-only {
		height: 100%;
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
	}

	.line-section {
		box-shadow: 0 2rpx 10rpx #ebebeb;
		margin-top: 10rpx;
	}

	::v-deep .form-card .u-form-item {
		padding: 0 30rpx 20rpx 40rpx !important;
	}

	.modal-wrap {
		padding: 0 40rpx 20rpx 40rpx;
	}

	::v-deep .modal-wrap .u-form-item {
		padding: 20rpx 0 0 0;
	}
</style>