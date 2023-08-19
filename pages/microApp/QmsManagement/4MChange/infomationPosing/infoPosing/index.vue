<!-- 信息提报 -->
<template>
	<view class="sws-wh100 sws-bg-ebebeb u-p-20 ">
		<view class="sws-w100 u-p-b-20 sws-overflow-scroll-y ">
			<u-form :model="model" :error-type="['topTips']" ref="infoPosingForm" class="sws-w100">
				<view class="form-card">
					<!-- 组织 是否加上-待定 -->
					<u-form-item label="组织" :border-bottom="false">
						<u-input disabled v-model="factName">
						</u-input>
						<!-- <u-icon slot="right" name="arrow-down" size="28" @click="toShowFactory"></u-icon> -->
					</u-form-item>

					<u-form-item label="4M编码" :border-bottom="false" prop="code">
						<u-input placeholder="系统生成" v-model="model.code" type="text" disabled>
						</u-input>
					</u-form-item>
					<u-form-item required label="产品类型" :border-bottom="false" prop="productType">
						<u-input @click="toShowQuestionType" placeholder="请选择产品类型" v-model="model.productTypeDesc"
							type="text" disabled>
						</u-input>
						<u-icon v-if='formKey==1' slot="right" name="arrow-down" :disabled='formKey!==1' size="28"
							@click="toShowQuestionType"></u-icon>
					</u-form-item>
					<u-form-item required label="项目代码" :border-bottom="false" prop="projectCode">
						<u-input @click="toShowProjectList('project')" disabled placeholder="请选择项目"
							v-model="model.projectCode" type="text">
						</u-input>
						<u-icon v-if='formKey==1' slot="right" name="arrow-down" size="28"
							@click="toShowProjectList('project')"></u-icon>
					</u-form-item>
					<u-form-item required label="变化点类别" :border-bottom="false" prop="changePointTypeDesc">
						<u-input @click="toShowChangePointType" disabled placeholder="请选择变化点类别"
							v-model="model.changePointTypeDesc" disabled>
						</u-input>
						<u-icon v-if='formKey==1' slot="right" name="arrow-down" size="28"
							@click="toShowChangePointType"></u-icon>
					</u-form-item>
					<u-form-item required label="变化点" :border-bottom="false" prop="changePointDesc">
						<u-input @click="toShowChangePoint" disabled placeholder="请选择变化点"
							v-model="model.changePointDesc" disabled>
						</u-input>
						<u-icon v-if='formKey==1' slot="right" name="arrow-down" size="28" @click="toShowChangePoint">
						</u-icon>
					</u-form-item>
					<u-form-item required label="变化点日期" :border-bottom="false" prop="changeDate">
						<u-input disabled placeholder="请选择变化点日期" v-model="model.changeDate" @click="openChangeDate">
						</u-input>
						<u-icon v-if='formKey==1' slot="right" name="calendar" size="28" @click="showDatePicker = true">
						</u-icon>
					</u-form-item>
					<u-form-item required label="班次" :border-bottom="false" prop="shift">
						<u-input placeholder="班次" v-model="model.shift" type="text" disabled>
						</u-input>
					</u-form-item>

					<u-form-item required class="u-relative" label="线别(单选)" :border-bottom="false" prop="lineName"
						label-position="top">
						<view class="sws-w100 problem-userList">
							<u-tag v-for="(each, index) in model.lineNameList" :key="index" :text="each.desc"
								size="mini" mode="plain" type="info" class="u-m-r-8" :closeable="formKey===1"
								@close="delLineName(index)" />
							<!-- <u-input placeholder="请选择线别或扫描条码" v-model="model.lineName" type="text" disabled></u-input> -->
						</view>
						<view class="u-abso u-flex problem-btnGroups">
							<u-button v-if='formKey==1' type="success" size="mini" @click="toShowLineType">添加线别
							</u-button>
							<u-icon v-if='formKey==1' name="scan" size="56" color="#2979ff" @click="scanCode"></u-icon>
						</view>
					</u-form-item>
					<u-form-item class="u-relative" required label="工序" :border-bottom="false" prop="groupInfoList"
						label-position="top">
						<view class="sws-w100 problem-userList">
							<u-tag v-for="(each, index) in model.groupInfoList" :key="index" :text="each.groupName"
								size="mini" mode="plain" type="info" class="u-m-r-8" :closeable="formKey===1"
								@close="delGroup(index)" />
						</view>
						<view class="u-abso u-flex problem-btnGroups">
							<u-button v-if='formKey==1' type="success" size="mini" @click="toShowGroup">添加工序
							</u-button>
						</view>
					</u-form-item>

					<u-form-item class="u-relative" label="设备" :border-bottom="false" prop="deviceInfoList"
						label-position="top">
						<view class="sws-w100 problem-userList">
							<u-tag v-for="(each, index) in model.deviceInfoList" :key="index" :text="each.deviceName"
								size="mini" mode="plain" type="info" class="u-m-r-8" :closeable="formKey===1"
								@close="delDevice(index)" />
						</view>
						<view class="u-abso u-flex problem-btnGroups">
							<u-button v-if='formKey==1' type="success" size="mini" @click="toShowDevice">添加设备
							</u-button>
						</view>
					</u-form-item>
					<u-form-item class="u-relative" required label="群组抄送" :border-bottom="false" prop="ccInfoList"
						label-position="top">
						<view class="sws-w100 problem-userList">
							<u-tag v-for="(user, index) in model.ccInfoList" :key="index" :text="user.userName"
								size="mini" mode="plain" type="info" class="u-m-r-8" :closeable="formKey===1"
								@close="delUser(index)" />
						</view>
						<view class="u-abso u-flex problem-btnGroups">
							<u-button v-if='formKey==1' type="success" size="mini" @click="toShowGroupUsers">群组添加
							</u-button>
							<u-button v-if='formKey==1' type="primary" size="mini" class="u-m-l-8"
								@click="toShowGuideUsers('cCList')">
								人员添加
							</u-button>
						</view>
					</u-form-item>
					<u-form-item required label="变化点详细内容" :border-bottom="false" label-position="top"
						prop="changeDetail">
						<u-input placeholder="xxx产品由于xx变化,人员xxx操作需..." v-model="model.changeDetail" :border="true"
							type="textarea" maxlength="700" :disabled="formKey!==1">
						</u-input>
					</u-form-item>
					<u-form-item required class="u-relative" label="作业指导人" :border-bottom="false" prop="taskInstruction"
						label-position="top">
						<view class="sws-w100 problem-userList">
							<u-tag v-for="(each, index) in model.taskInstructionArr" :key="index" :text="each.name"
								size="mini" mode="plain" type="info" class="u-m-r-8" :closeable="formKey===1"
								@close="delmenber(index)" />
						</view>
						<view class="u-abso u-flex problem-btnGroups">
							<view class="u-abso u-flex problem-btnGroups">
								<u-button v-if='formKey==1' type="success" size="mini" @click="toShowMenberList">群组添加
								</u-button>
								<u-button v-if='formKey==1' type="primary" size="mini" class="u-m-l-8"
									@click="toShowGuideUsers('guide')">
									人员添加
								</u-button>

							</view>

							<!-- <u-icon v-if='formKey==1' name="scan" size="56" color="#2979ff" @click="scanCode"></u-icon> -->
						</view>
					</u-form-item>

					<!-- ********************************** -->
					<view class=" sws-w100 u-p-t-20 u-flex sws-bg-ebebeb" v-if='formKey==1'>
						<!-- <u-button type="success" class="u-flex-1 u-m-r-20" @click="cacheConfirm('manual')">保存</u-button> -->
						<u-button type="primary" class="u-flex-1 u-m-l-20" :loading='uButtonLoading'
							@click="submit('submit')">
							提交
						</u-button>
					</view>
				</view>

			</u-form>
		</view>
		<u-select v-model="selectShow" mode="mutil-column" :list="mutilList" @confirm="mutilSelectConfirm"></u-select>
		<u-picker v-model="showDatePicker" :params="timeParams" mode="time" title="发现日期" @confirm="timeConfirm">
		</u-picker>
		<u-select v-model="showSelect" :title="selectTitle" :list="selectList" @confirm="selectConfirm"></u-select>
		<u-modal v-model="showModal" :content="modalContent" @confirm="modalConfirm"></u-modal>
		<u-modal v-model="showCacheModal" content="数据未保存,是否需要保存？" :show-cancel-button="true" confirm-text="保存"
			cancel-text="直接返回" @confirm="cacheConfirm" @cancel="modalConfirm"></u-modal>
		<u-top-tips ref="uTips"></u-top-tips>


	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'

	export default {
		components: {

		},


		data() {
			return {

				productTypeList: [],
				factName: '',
				// factoryCode: null,
				selectShow: false,
				mutilList: [], //联级list				
				processState: false,
				formKey: 1,
				model: {
					userRoleType: '', //就业指导人--人员角色类型
					taskInstructionArr: [],
					lineNameList: [],
					deviceId: null,
					deviceName: '',
					code: '',
					productType: '',
					productTypeDesc: '',
					projectCode: '',
					changePointType: '',
					changePointTypeDesc: '', //对应的中文
					changePoint: '',
					changePointDesc: '',
					changeDetail: '', //变化点详细
					groupId: null,
					shift: '',
					lineCode: '',
					lineName: '',
					group: '', //工序
					groupCode: '',
					groupInfoList: [], //工序集合
					deviceInfoList: [
						// {
						// deviceCode:'',
						// deviceName:'',
						// fourChangeId
						// },
					],
					ccInfoList: [], //群组抄送人集合
					groupCcInfoList: [],
					act: {
						businessRoute: 'editChangePointInfo',
						exeProcess: 'Y',
						batchForm: {
							batchData: []
						}
					},
					taskInstruction: ''

				},
				// ***************************************
				changePointType: '',
				changePointTypeList: [], //变化点类型
				changePointList: [], //变化点list
				infoPosingRules: {
					productType: [{
						required: true,
						message: '请选择产品类型',
						trigger: 'blur'
					}],
					projectCode: [{
						required: true,
						message: '请选择项目',
						trigger: 'blur'
					}],
					changePointTypeDesc: [{
						required: true,
						message: '请选择变化点类别',
						trigger: 'blur'
					}],
					changePointDesc: [{
						required: true,
						message: '请选择变化点',
						trigger: 'blur'
					}],

					changeDate: [{
						required: true,
						message: '请选择变化点日期',
						trigger: 'blur'
					}],

					shift: [{
						required: true,
						message: '请选择班次',
						trigger: 'blur'
					}],
					lineName: [{
						required: true,
						message: '请选择线别或扫描条码带出线别',
						trigger: 'blur'
					}],
					group: [{
						required: true,
						message: '请选择工序',
						trigger: 'blur'
					}],
					changeDetail: [{
						required: true,
						message: '请输入变化点详细内容',
						trigger: 'blur'
					}],

					group: [{
						required: true,
						message: '请选择工序',
						trigger: 'blur'
					}],
					taskInstruction: [{
						required: true,
						message: '请选择作业指导人',
						trigger: ['blur', 'change']
					}],
					ccInfoList: [{
						validator: (rule, value, callback) => {
							if (!value.length) {
								rule.message = '请选择群组'
								callback(new Error('请选择群组'))
							} else {
								callback()
							}
						},
						message: '请选择群组',
						trigger: 'blur'
					}],

				},
				modalContent: '',
				showModal: false,
				selectTitle: '',
				selectList: [],
				showSelect: false,
				timeParams: {
					year: true,
					month: true,
					day: true,
					hour: true,
					minute: true,
					second: false
				},
				showDatePicker: false,
				showCacheModal: false,
				isJudged: false, //是否判断过 需不需要 缓存
				uButtonLoading: false,
			}
		},
		// created() { //获取组织
		// 	
		// 	if (this.formKey === 1) {
		// 		this.factoryName = this.factoryName
		// 		this.factoryCode = this.factoryId
		// 	}

		// },
		computed: {
			...mapState(['factoryId', 'factoryName', 'userInfo']),
			isHaveTo: function() {
				let flag = ''
				if (this.model.num == '') {
					flag = true

				} else {
					flag = false
				}
				return flag

			},
		},

		async onLoad() {
			// this.getChangePointOptions()

		},
		created() {
			if (this.formKey === 1) {
				this.factName = this.factoryName
				this.factoryCode = this.factoryId
			}
			this.getProductType()
			this.getChangePointOptions()
			const _self = this
			uni.getStorage({ //获取缓存数据
				key: `info_posing_${ this.userInfo.account }`,
				success: function(res) {
					_self.model = {
						..._self.model,
						...res.data.formData
					}
				}
			})

		},
		onReady() {
			const _self = this
			let currentTime = _self.getTime()

		},
		methods: {
			// getFactoryName(id) { //获取组织名字
			// 	let result = ''
			// 	this.$u.api.getFactoryName(id).then(res => {
			// 		console.log('组织信息11', res)
			// 		if (res.masgCode === '000000') {
			// 			// if (res.data && res.data.factoryName) {
			// 			// 	// this.factoryName = res.data.factoryName || ''
			// 			// 	result = res.data.factoryName

			// 			// }
			// 		}

			// 	})
			// 	// return result
			// 	// consoel.log('55555', result)

			// },
			async toShowMenberList(type) { // 作业指导人--群组选择
				let _this = this
				if (_this.formKey !== 1) return
				const list = await _this.toGetMenberList()
				console.log('list222', list)
				if (list.length) {
					const params = {
						title: '请选择群组',
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
								const userList = await _this.toGetMenberList(params)
								resolve(userList)
							})
						}
					}
					const checkerList = await _this.common.goToSelected(params)
					this.model.taskInstructionArr = checkerList
					// console.log('this.model.taskInstructionArr', this.model.taskInstructionArr)
					this.model.act.batchForm.batchData = []
					this.model.act.batchForm.batchData.push({
						userTaskAssigneeName: checkerList[0].name.split('（')[0],
						userTaskAssignee: checkerList[0].value,
						userTaskDefKey: 'sid-4m-manage-2-1'
					}, )

				}
			},
			toGetMenberList() { //获取作业指导人--群组

				const params = {
					query: {
						page: 1,
						limit: 100
					},
					body: {
						account: '',
						col1: this.model.userRoleType,
						groupId: this.model.groupId,
						userName: '',
					}
				}
				// // 当变化点类型【料】时，作业指导人选择为抄送群组里面的【PQE工程师】角色人员

				//***************************************************
				if (this.model.groupId && this.model.userRoleType) {
					return new Promise((resolve, reject) => {
						this.$u.api.getMembersListApi(params).then(res => {
							if (res.msgCode === '000000' && res.data) {
								if (res.data.data && res.data.data.length == 0) {
									this.$refs.uTips.show({
										title: '暂无群组数据',
										type: 'warning',
										duration: 2300
									})
								}
								if (res.data.data && res.data.data.length) {
									const list = res.data.data.map(({
										userName,
										account,
										// deptName
									}) => {
										return {
											name: userName + '（' + account + '）',
											value: account,
											// desc: deptName,
											checked: false
										}
									})
									resolve(list)
								}
							} else {
								resolve([])
								this.$refs.uTips.show({
									title: `责任人获取失败，原因：${ res.message }`,
									type: 'warning',
									duration: 2300
								})
							}
						}).catch(err => {
							resolve([])
							this.common.sysErrToast(this, err)
						})
					})
				} else {
					if (!this.model.groupId) {
						this.$refs.uTips.show({
							title: '请先选择需要抄送的群组',
							type: 'error',
							duration: '2300'
						})
					} else if (!this.model.changePointType) {
						this.$refs.uTips.show({
							title: '请先选择变化点类型',
							type: 'error',
							duration: '2300'
						})

					}
				}
			},

			mutilSelectConfirm() { //联级确认

			},
			delLineName(index) { //删除线别
				const lineNameList = this.model.lineNameList
				lineNameList.splice(index, 1)
				this.model.lineNameList = lineNameList
				this.model.lineName = ''
				this.model.lineCode = ''

			},
			delmenber(index) { //删除线别
				const menberList = this.model.lineNameList
				menberList.splice(index, 1)
				this.model.taskInstructionArr = menberList
				this.model.taskInstruction = ''
				this.model.act.batchForm.batchData = []
				// this.model.lineCode = ''

			},
			delGroup(index) {
				const groupList = this.model.groupInfoList
				groupList.splice(index, 1)
				this.model.groupInfoList = groupList
			},
			delDevice(index) {
				const deviceList = this.model.deviceInfoList
				deviceList.splice(index, 1)
				this.model.deviceInfoList = deviceList
			},
			open() {
				let that = this
				that.$nextTick(() => {
					// that.checkboxShow = true
					that.$refs.selectGroup.checkboxShow = true

				})

			},
			setFormRules() {
				const _self = this
				_self.$nextTick(() => {
					_self.$refs.infoPosingForm.setRules(_self.infoPosingRules)
				})

			},
			async renderData(result) {
				// 
				if (!result.id) return
				if (result.taskInfo && result.taskInfo.length > 0) {
					this.formKey = result.taskInfo[0].formKey
				}
				if (this.formKey === 1) {

					this.factName = this.factoryName
					// this.factName = this.factoryId
				} else {
					if (result.factoryId) {
						let data = await this.$u.api.getFactoryName(result.factoryId)
						console.log('6666', data)
						if (data.data.factoryName) {
							this.factName = data.data.factoryName
						}
					}
				}


				if (result.state && result.state === 2) { //state === 2 表示流程已完结
					this.formKey = 6
				}
				if (result.groupInfoList && result.groupInfoList.length > 0 && !result.group) { // 工序
					this.$set(result, 'group', result.groupInfoList[0].groupName)
				}
				if (result.lineName && result.lineCode && !result.lineNameList) { // 线别
					this.$set(result, 'lineNameList', [{
						desc: result.lineName
					}])
				}
				if (result.userTaskConfigList && result.userTaskConfigList.length > 0) { //指导人
					let taskInstruction = result.userTaskConfigList.filter(item => {
						return item.userTaskDefKey === "sid-4m-manage-2-1"
					})
					if (taskInstruction.length > 0) {
						if (!result.taskInstruction) {
							this.$set(result, 'taskInstruction', taskInstruction[0].userTaskAssigneeName)
						}

						this.$set(result, 'taskInstructionArr', [])
						result.taskInstructionArr = taskInstruction.map(item => {
							return {
								name: taskInstruction[0].userTaskAssigneeName
							}
						})





					}
				}
				this.model = result

			},
			openChangeDate() {
				if (this.formKey !== 1) return
				this.showDatePicker = true
			},
			toShowChangePointType() {
				if (this.formKey !== 1) return
				this.selectLitle = '请选择变化点类型'
				this.selectList = this.changePointTypeList
				this.showSelect = true

			},
			toShowChangePoint() {
				if (this.formKey !== 1) return
				this.selectLitle = '请选择变化点'
				this.selectList = this.changePointList
				this.showSelect = true

			},
			selectConfirm(arr) { //选择--确认
				let _this = this
				const temp = arr[0]
				if (temp.extra === 'productType') { //产品类型
					_this.model.productType = temp.value
					_this.model.productTypeDesc = temp.label
				}

				if (temp.extra === 'changePoint') { //变化点					
					_this.model.changePoint = temp.value
					_this.model.changePointDesc = temp.label


				}

				if (temp.extra.includes('changePointType')) { //变化点类型
					let oldChangePointType = _this.model.changePointType || ''
					if (temp.value !== oldChangePointType) { //变化点类型改变--清空变化点
						_this.model.changePoint = ''
						_this.model.changePointDesc = ''
					}
					_this.model.changePointTypeDesc = temp.label
					_this.model.changePointType = temp.value
					this.changePointTypeChange(temp) //根据变化点类别查询变化点
					this.setGuideUser(temp)
				}
			},
			setGuideUser(arrData) { //变化点为 法、人、设备时候 指导人默认为发起人

				let logInfo = this.userInfo
				if (this.formKey === 1) { //发起阶段
					if (arrData.value && (arrData.value === 'man' || arrData.value === 'method' || arrData.value ===
							'machine')) {
						this.model.taskInstruction = logInfo.userName
						this.model.taskInstructionArr = [{
							name: logInfo.userName
						}]
						console.log('this.model.taskInstructionArr', this.model.taskInstructionArr)
						this.model.act.batchForm.batchData = []
						this.model.act.batchForm.batchData.push({
							userTaskAssigneeName: logInfo.userName,
							userTaskAssignee: logInfo.account,
							userTaskDefKey: 'sid-4m-manage-2-1'
						}, {
							userTaskAssigneeName: logInfo.userName,
							userTaskAssignee: logInfo.account,
							userTaskDefKey: 'sid-4m-manage-2-2'
						})
					} else {
						this.model.userRoleType = 'PRODUCT_QUALITY_ENGINEER'
						this.model.taskInstruction = ''
						this.model.taskInstructionArr = []
						this.model.act.batchForm.batchData = []
					}
				}

			},
			getProductType() { // 获取产品类型			
				let params = {
					dictType: 'FAILURE_TYPE'
				}
				this.$u.api.getDataDict(params).then(res => {
					if (res.msgCode === '000000') {
						if (res.data && res.data.length) {
							this.productTypeList = res.data.map(item => {
								return {
									label: item.name,
									value: item.code,
									extra: 'productType'
								}
							})
						}

					}
				})

			},
			// 获取4M变化点类型和变化点
			getChangePointOptions() {

				const query = {
					code: 'changePointType'
				}
				this.$u.api.getCascaderTreeList(query).then(res => {
					if (res.msgCode === '000000' && res.data && res.data.length > 0) {

						this.$u.api.getCascaderByParentId(res.data[0].id).then(result => {
							if (result.msgCode === '000000') {
								this.changePointTypeList = result.data.map(item => {
									return {
										value: item.code,
										label: item.name,
										extra: `changePointType-${item.id}`
									}
								})
							}
						})
					}
				})
			},
			// 4M变化点类型对应的变化点值
			changePointTypeChange(temp) {
				let id = temp.extra.split('-')[1]
				this.$u.api.getCascaderByParentId(id).then(result => {
					if (result.msgCode === '000000') {
						this.changePointList = result.data.map(each => {
							return {
								label: each.name,
								value: each.code,
								extra: 'changePoint'
							}
						})

					}
				})

			},


			async toShowGuideUsers(flag) { //选择作业指导人

				let _this = this
				if (_this.formKey !== 1) return
				const params = {
					query: {
						page: 1,
						limit: 100
					},
					body: {}
				}
				const list = await this.toGetguideList(params)

				if (list.length) {
					const params = {
						title: '请选择人员',
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
								const userList = await _this.toGetguideList(params)
								resolve(userList)
							})
						}
					}

					const checkerList = await _this.common.goToSelected(params)
					if (flag == 'guide') {
						_this.model.guideAccount = checkerList[0].value
						_this.model.taskInstruction = checkerList[0].name.split('（')[0]
						this.model.taskInstructionArr = checkerList
						_this.model.act.batchForm.batchData.push({
							userTaskAssigneeName: checkerList[0].name.split('（')[0],
							userTaskAssignee: checkerList[0].value,
							userTaskDefKey: 'sid-4m-manage-2-1'
						}, )
					} else { //人员添加
						const oldList = !_this.model.ccInfoList.length ? [] : _this.model.ccInfoList
						const newList = checkerList.map(each => {
							return {
								userName: each.name.split('（')[0],
								account: each.value
							}
						})
						_this.model.ccInfoList = oldList.concat(newList)
						_this.model.ccInfoList = _this.duplicateRemoval(_this.model.ccInfoList)

					}

				} else {
					this.$refs.uTips.show({
						title: '暂未查到人员数据',
						type: 'warning',
						duration: 2300
					})
				}

			},
			// 对象数组去重
			duplicateRemoval(array) {
				const newArray = []
				for (const item of array) {
					// 使用JSON.stringfy()方法将数组和数组元素转换为JSON字符串之后再使用includes()方法进行判断
					if (JSON.stringify(newArray).includes(JSON.stringify(item))) {
						continue
					} else {
						// 不存在的添加到数组中
						newArray.push(item)
					}
				}
				return newArray
			},
			toGetguideList(params) { //获取指导人列表
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

			},
			delUser(index) {
				const userList = this.model.ccInfoList
				userList.splice(index, 1)
				this.model.ccInfoList = userList
			},
			clearCache() { //清除缓存
				const key = `info_posing_${ this.userInfo.account }`
				if (uni.getStorageSync(key)) {
					uni.removeStorage({
						key
					})
				}
			},
			cacheConfirm(flag) { //缓存数据
				try {
					const cacheData = {
						formData: {
							...this.model
						},
						// images: this.$refs.uUpload.lists
					}
					uni.setStorageSync(`info_posing_${ this.userInfo.account }`, cacheData)
					if (flag && flag == 'manual') { //手动保存
						this.$u.toast('保存成功！')
					} else {
						uni.navigateTo({
							url: '/pages/microApp/QmsManagement/4MChange/index',
						})
					}
					this.$u.toast('保存成功！')
				} catch (err) {
					this.$refs.uTips.show({
						title: `数据缓存失败，原因：${ err }`,
						type: 'error',
						duration: 2300
					})
				}
			},
			getTime() { //获取当前时间
				var date = new Date(),
					year = date.getFullYear(),
					month = date.getMonth() + 1,
					day = date.getDate(),
					hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours(),
					minute = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes(),
					second = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
				month >= 1 && month <= 9 ? (month = "0" + month) : "";
				day >= 0 && day <= 9 ? (day = "0" + day) : "";
				var timer = year + '-' + month + '-' + day + ' ' + hour + ':' + minute;
				return timer;
			},
			toShowQuestionType() { //打开产品类型				
				if (this.formKey !== 1) return
				this.selectLitle = '请选择产品类型'
				this.selectList = this.productTypeList || []
				this.showSelect = true
			},
			async toShowProjectList(flag) { //打开项目
				if (this.formKey !== 1) return
				const _self = this
				uni.navigateTo({
					url: '/pages/microApp/QmsManagement/4MChange/components/selectProject/index',
					events: {
						// 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据  参数名字随便起，前后页面对应上即可
						acceptDataFromPrjectPage(res) {
							const temp = res.data[0]
							// console.log('项目选择', temp)
							// _self.model.projectName = temp.name
							_self.model.projectCode = temp.value

						},
					}
					// success: function(res) {// 通过eventChannel向被打开页面传送数据
					// 	res.eventChannel.emit('acceptDataFromPrjectPage', res)
					// 	// 
					// }
				})
			},
			modalConfirm() {
				// uni.navigateBack()
				uni.navigateTo({
					url: '/pages/microApp/QmsManagement/4MChange/index',
				})
			},
			async submit(type) {
				let that = this
				// that.model.
				const flag = await that.setFormRules()
				that.$refs.infoPosingForm.validate(valid => {
					if (valid) {
						that.model.act.exeProcess = 'Y'
						let params = that.model
						that.fourMInfoAdd(params, 'submit')
					} else {

					}

				})
			},
			fourMInfoAdd(params, type) {
				let tipType = (type === 'submit' ? '提交' : '保存')
				this.$u.api.fourMInfoAddApi(params).then(res => {
					if (res.msgCode === '000000') {
						this.modalContent = '提交成功'
						this.showModal = true
						this.isJudged = true
						this.clearCache()
					} else {
						this.$refs.uTips.show({
							title: `信息提交失败，原因：${ res.message }`,
							type: 'error',
							duration: 2300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
					// this.clearCache()
					// this.model = {}
				})
			},
			async toShowDevice() { //选择设备--多选
				let that = this
				const params = {
					query: {
						page: 1,
						limit: 1000
					},
					body: {
						groupCode: '',
						groupName: ''

					}
				}
				const list = await that.toGetDeviceList(that, params)
				const tempList = list
				if (list.length) {
					const queryParams = {
						title: '请选择设备',
						list,
						hasSearch: true,
						isRadio: true,
						filterFunc: keyword => {
							return new Promise(async resolve => {
								const params = {
									query: {
										page: 1,
										limit: 1000
									},
									body: {
										deviceName: keyword
									}
								}
								const deviceList = await that.toGetDeviceList(that, params)
								resolve(deviceList)
							})
						}
					}
					const deviceInfoList = await that.goToSelectedDevice(queryParams)
				} else {
					that.$refs.uTips.show({
						title: '暂未查到设备数据',
						type: 'warning',
						duration: 2300
					})
				}

			},
			async toShowLineType() { //选择线别--单选
				const _self = this
				uni.navigateTo({
					url: '/pages/microApp/QmsManagement/4MChange/components/selectLineName/index',
					events: {
						// 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据  参数名字随便起，前后页面对应上即可
						acceptDataFromPrjectPage(res) {
							const temp = res.data[0]
							console.log('选择的线别：', temp)
							_self.model.lineCode = temp.value.lineCode || ''
							_self.model.lineName = temp.desc || ''
							_self.model.lineNameList = res.data
						},
					}
					// success: function(res) {// 通过eventChannel向被打开页面传送数据
					// 	res.eventChannel.emit('acceptDataFromPrjectPage', res)
					// 	// 
					// }
				})

			},
			goToSelectedLineName() { //选择线别

			},

			async toShowGroup() { //选择工序--多选
				const params = {
					query: {
						page: 1,
						limit: 1000
					},
					body: {
						groupCode: '',
						groupName: ''

					}
				}
				const list = await this.toGetProcessList(this, params)
				const tempList = list
				if (list.length) {
					const queryParams = {
						title: '请选择工序',
						list,
						hasSearch: true,
						isRadio: true,
						filterFunc: keyword => {
							return new Promise(async resolve => {
								const params = {
									query: {
										page: 1,
										limit: 1000
									},
									body: {
										groupName: keyword
									}
								}
								const processList = await this.toGetProcessList(this, params)
								resolve(processList)
							})
						}
					}
					const groupList = await this.goToSelectedProcess(queryParams)
				} else {
					this.$refs.uTips.show({
						title: '暂未查到工序数据',
						type: 'warning',
						duration: 2300
					})
				}

			},

			toGetDeviceList(vm, params) { //获取设备	
				return new Promise((resolve, reject) => {
					this.$u.api.getDeviceApi(params).then(res => {
						if (res.msgCode === '000000' && res.data && res.data.data.length) {
							console.log('设备res', res)
							let list = res.data.data.map(item => {
								return {
									name: item.deviceName,
									value: item.deviceCode,
									checked: false,
									extra: item
								}
							})
							console.log('设备list', list)
							list = this.duplicateRemoval(list)
							resolve(list)
						} else {
							resolve([])
							this.$refs.uTips.show({
								title: `设备列表获取失败，原因：${ res.message }`,
								type: 'error',
								duration: 2300
							})
						}
					}).catch(err => {
						resolve([])
						this.common.sysErrToast(this, err)
					})
				})

			},

			toGetProcessList(data, params) { //获取工序
				let that = this
				return new Promise((resolve, reject) => {
					that.$u.api.getProcessApi(params).then(res => {
						if (res.msgCode === '000000' && res.data && res.data.data.length) {
							let list = res.data.data.map(item => {
								return {
									name: item.groupName,
									value: item.groupCode,
									// desc: item.deptName,
									// desc: item.groupLeaderUserNames,
									checked: false,
									extra: item
								}
							})
							list = that.duplicateRemoval(list)
							resolve(list)
						} else {
							resolve([])
							that.$refs.uTips.show({
								title: `工序列表获取失败，原因：${ res.message }`,
								type: 'error',
								duration: 2300
							})
						}
					}).catch(err => {
						resolve([])
						that.common.sysErrToast(that, err)
					})
				})

			},
			goToSelectedDevice(transferParams, list, type, hasSearch = false, isRadio = false) {
				let _self = this
				let params = {
					title: transferParams.title,
					items: transferParams.list,
					filterFunc: transferParams.filterFunc,
					hasSearch,
					isRadio
				}
				uni.navigateTo({
					url: '/pages/common/multipleSelect/index',
					events: {
						acceptDataFromSendPage(res) {
							const temp = res.data
							let oldList = _self.model.deviceInfoList
							let newList = temp.map(item => {
								return {
									deviceName: item.name,
									deviceCode: item.value
								}
							})
							_self.model.deviceInfoList = oldList.concat(newList)
							_self.model.deviceInfoList = _self.duplicateRemoval(_self.model.deviceInfoList)
						}
					},
					success: function(res) {
						res.eventChannel.emit('acceptDataFromOpend', params)
					}
				})

			},
			goToSelectedProcess(transferParams, list, type, hasSearch = false, isRadio = false) {
				// title 选择列表页面标题  list 选择列表项 type赋值对象的属性名, hasSeach是否需要本地搜索
				let _self = this
				let params = {
					title: transferParams.title,
					items: transferParams.list,
					filterFunc: transferParams.filterFunc,
					hasSearch,
					isRadio
				}
				uni.navigateTo({
					// url: '/pages/common/selectItems/index',
					url: '/pages/common/multipleSelect/index',
					events: {
						acceptDataFromSendPage(res) {
							const temp = res.data
							let oldList = _self.model.groupInfoList
							let newList = temp.map(item => {
								return {
									groupName: item.name,
									groupCode: item.value
								}
							})
							_self.model.groupInfoList = oldList.concat(newList)
						}
					},
					success: function(res) {
						res.eventChannel.emit('acceptDataFromOpend', params)
					}
				})

			},
			getLineName(query) { //通过扫描产品条码，获取MES对应线别、工序、设备
				const params = {
					factoryId: this.factoryId,
					serialNumber: query
				}
				this.$u.api.selectSerialNumberApi(params).then(res => {
					// console.log('信息', res)
					this.model.groupInfoList = []
					if (res.msgCode === '000000') {
						if (res.data) {
							this.model.lineName = res.data.areaName || '' //线别
							this.model.lineCode = res.data.areaSn || '' //线别id
							this.model.lineNameList = []
							this.model.lineNameList.push({ //线别
								desc: res.data.areaName || '',
								code: res.data.areaSn || ''
							})


							this.model.group = res.data.groupName || ''
							this.model.groupCode = res.data.groupCode || ''

							this.model.groupInfoList.push({ //工序  
								// fourChangeId:null  //4M基础信息表ID
								groupCode: res.data.groupCode || '',
								groupName: res.data.groupName || ''
							})
							this.model.groupInfoList = this.model.groupInfoList.filter(each => {
								return each.groupName && each.groupCode
							})
							this.model.deviceInfoList.push({ //设备  
								// fourChangeId:null  //4M基础信息表ID
								deviceCode: res.data.deviceId || '',
								deviceName: res.data.deviceName || ''
							})
							this.model.deviceInfoList = this.model.deviceInfoList.filter(ele => {
								return ele.deviceName && ele.deviceCode
							})
						} else {
							this.$refs.uTips.show({
								title: '暂未查到数据',
								type: 'error',
								duration: 2300
							})

						}
					} else {
						this.$refs.uTips.show({
							title: `数据查询失败，原因：${res.message}`,
							type: 'error',
							duration: 2300
						})
					}

				}).catch(err => {
					this.common.sysErrToast(this, err)
				}).finally(() => {
					setTimeout(() => {
						this.uButtonLoading = false
					}, 1200)


				})

			},
			async toShowGroupUsers() { //打开群组选择
				const params = {
					query: {
						page: 1,
						limit: 100
					},
					body: {
						groupCode: '',
						groupName: ''

					}
				}

				const list = await this.toGetApproveGroupUserList(this, params)
				const tempList = list
				if (list.length) {
					const params = {
						title: '请选择抄送群组',
						list,
						hasSearch: true,
						isRadio: true,
					}
					const groupList = await this.goToSelected(params)
				} else {
					this.$refs.uTips.show({
						title: '暂未查到群组人员数据',
						type: 'warning',
						duration: 2300
					})
				}
			},
			toGetApproveGroupUserList(aa, params) { //获取群组列表
				return new Promise((resolve, reject) => {
					this.$u.api.getUsersListApi(params).then(res => {
						if (res.msgCode === '000000' && res.data && res.data.data.length) {
							const list = res.data.data.map(item => {
								return {
									name: item.groupName,
									value: item.id,
									// desc: item.groupLeaderUserNames,
									checked: false,
									extra: item
								}
							})
							resolve(list)
						} else {
							resolve([])
							this.$refs.uTips.show({
								title: `群组人员列表获取失败，原因：${ res.message }`,
								type: 'error',
								duration: 2300
							})
						}
					}).catch(err => {
						resolve([])
						this.common.sysErrToast(this, err)
					})
				})
			},
			async scanCode(type) { //扫描线别
				const scanValue = await this.common.scanCode(this)
				this.getLineName(scanValue)
			},
			goToSelected(transferParams, list, type, hasSearch = false, isRadio = true) {
				// title 选择列表页面标题  list 选择列表项 type赋值对象的属性名, hasSeach是否需要本地搜索
				let _self = this
				let params = {
					title: transferParams.title,
					items: transferParams.list,
					hasSearch,
					isRadio
				}
				uni.navigateTo({
					// url: '/pages/common/selectItems/index',
					url: '/pages/common/multipleSelect/index',
					events: {
						acceptDataFromSendPage(res) {
							const temp = res.data[0]
							_self.model.groupId = temp.value
							if (temp.extra && temp.extra.groupMembersList && temp.extra.groupMembersList
								.length >
								0) {
								_self.model.ccInfoList = temp.extra.groupMembersList.map(each => {
									return {
										userName: each.userName,
										account: each.account
									}
								})
								_self.model.ccInfoList = _self.duplicateRemoval(_self.model.ccInfoList)

							}
						}
					},
					success: function(res) {
						res.eventChannel.emit('acceptDataFromOpend', params)
					}
				})

			},

			timeConfirm(date) { //日期--确定
				this.model.changeDate =
					`${ date.year }-${ date.month }-${ date.day } ${ date.hour }:${ date.minute }`
				if (Number(date.hour) >= 8 && Number(date.hour) <= 19) { //白班：08：00：00~19：59：59，夜班：20：00：00~次日07：59：59
					this.model.shift = '白班'

				} else {
					this.model.shift = '夜班'
				}
			}
		},
		onBackPress() {
			if (this.showSelect) {
				this.showSelect = false
				return true
			}

			if (this.showDatePicker) {
				this.showDatePicker = false
				return true
			}

			if (!this.isJudged) { //是否判断过 需要缓存
				this.isJudged = true
				this.showCacheModal = true
				return true
			}

		},

	}
</script>

<style lang="scss" scoped>
	.scroll-wrap {
		width: 100%;
		border-radius: 16rpx;
		overflow: scroll;
		height: calc(100% - 100rpx) !important;
	}

	// /deep/.u-collapse-body {
	// 	overflow: scroll;
	// 	height: calc(100% - 100rpx)
	// }

	.form-card {
		background-color: #fff;
		border-radius: 16rpx;
		padding-top: 20rpx;
		// margin-bottom: 10rpx;
		overflow: scroll;
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

	.problem-userList {
		border-radius: 8rpx;
		border: 2rpx solid #dcdfe6;
		min-height: 124rpx;
		padding: 8rpx 20rpx;
	}

	.problem-btnGroups {
		top: 0;
		right: 0;
		height: 70rpx;

	}

	::v-deep .form-card .u-form-item {
		padding: 0 30rpx 20rpx 40rpx !important;
	}
</style>