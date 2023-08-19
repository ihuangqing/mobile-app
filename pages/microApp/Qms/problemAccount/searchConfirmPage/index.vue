<template>
	<view class="problemAccount sws-wh100 u-flex sws-flex-d-column sws-overflow-hidden">
		<view class="search-uForm sws-w100 u-flex-1 u-p-l-20 u-p-r-20 u-p-b-30 sws-overflow-scroll-y">
			<u-form class="sws-w100" ref="uForm" :error-type="['topTips']" :model="model" label-width="240"
				label-align="center">
				<u-form-item required label="开始时间" prop="startDateIn">
					<u-input disabled placeholder="请选择开始时间" v-model="model.startDateIn" @click="selectstartDateIn ">
					</u-input>
					<u-icon slot="right" name="arrow-down" size="28" @click="selectstartDateIn"></u-icon>
				</u-form-item>
				<u-form-item required label="截止时间" prop="startDateOut">
					<u-input disabled placeholder="请选择截止时间" v-model="model.startDateOut" @click="selectstartDateOut ">
					</u-input>
					<u-icon slot="right" name="arrow-down" size="28" @click="selectstartDateOut"></u-icon>
				</u-form-item>
				<u-form-item label="问题分类" :border-bottom="true" prop="categoryName">
					<u-input placeholder="请选择问题分类" v-model="model.categoryName" @click="toShowQuestionType">
					</u-input>
					<u-icon slot="right" name="arrow-down" size="28" @click="toShowQuestionType"></u-icon>
				</u-form-item>

				<u-form-item label="问题阶段" :required='!!model.nodeState' prop="state">
					<u-input disabled placeholder="请选择问题阶段" v-model="model.state" @click="toShowStageNameList">
					</u-input>
					<u-icon slot="right" name="arrow-down" size="28" @click="toShowStageNameList"></u-icon>
				</u-form-item>

				<u-form-item label="节点状态" :required='!!model.state' prop="nodeState">
					<u-input disabled placeholder="请选择节点状态" v-model="model.nodeState" @click="toShowStageStateList">
					</u-input>
					<u-icon slot="right" name="arrow-down" size="28" @click="toShowStageStateList"></u-icon>
				</u-form-item>

				<u-form-item label="提报人" :border-bottom="true" prop="handlerAccount">
					<u-input disabled placeholder="请选择提报人" v-model="model.handlerAccount"
						@click="toShowUsersList('handler')">
					</u-input>
					<u-icon slot="right" name="arrow-right" size="28" @click="toShowUsersList('handler')"></u-icon>
				</u-form-item>
				<view>
					<!-- 动态字段 -->
					<u-form-item :required='item.required' v-for='(item,index) in model.fieldList' :key="index"
						:label="item.fieldName" prop="item.prop">
						<u-input :disabled='item.fieldType=="LIST"||item.fieldType=="DATE"'
							:placeholder="(item.fieldType=='LIST'||item.fieldType=='DATE')?`请选择${item.fieldName}`:`请输入${item.fieldName}`"
							v-model="item.label">
						</u-input>
						<u-icon v-show='item.fieldType=="LIST"||item.fieldType=="DATE"' slot="right" name="arrow-down"
							size="28" @click="toShowList(item)"></u-icon>
					</u-form-item>
				</view>
			</u-form>
		</view>
		<view class="sws-w100 u-p-28 btn-style">
			<u-button type="primary" @click="reset">重置</u-button>
			<u-button type="primary" @click="submit">确认</u-button>
		</view>
		<u-picker v-model="showDatePicker" :params="timeParams" mode="time" title="请选择日期" @confirm="timeConfirm">
		</u-picker>
		<u-select v-model="showSelect" :title="selectTitle" :list="selectList" @confirm="selectConfirm"></u-select>
		<u-modal v-model="showModal" :content="modalContent" @confirm="modalConfirm"></u-modal>
		<u-top-tips ref="uTips"></u-top-tips>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				problemLabelsList: [], //问题标签
				limit: 10,
				page: 1,
				show: false,
				flag: '',
				// categoryName:'',
				// nodeState:'',//节点状态
				// stageStateCode:'',
				nodeStateList: [{
						name: '待处理',
						code: 1
					},
					{
						name: '处理中',
						code: 2
					},
					{
						name: '已完结',
						code: 3
					},
					{
						name: '已转发',
						code: 4
					},
					{
						name: '已挂起',
						code: 5
					},
					{
						name: '已回退',
						code: 6
					}
				],

				model: {
					state: '', //问题阶段
					// stageNameCode:'',
					startName: '', //发起人账号
					// handlerAccount:'',//发起人
					handlerAccount: '', //处理人账号
					categoryName: '', //问题分类Name
					categoryCode: '', //问题分类对应code
					startDateIn: '', //开始时间
					startDateOut: '', //截止时间
					nodeState: '', //节点状态
					stageStateCode: '',

					fieldList: [],
				},
				questionTypeList: [], //问题分类arr
				stageNameList: [], //问题阶段List					
				modalContent: '',
				showModal: false,
				selectTitle: '',
				selectList: [],
				showSelect: false,
				timeParams: {
					year: true,
					month: true,
					day: true,

				},
				showDatePicker: false,
				rules: {
					startDateIn: [{
						required: true,
						message: '请选择开始时间',
						trigger: 'blur'
					}],
					startDateOut: [{
						required: true,
						message: '请选择截止时间',
						trigger: 'blur'
					}]


					// state: [{
					// 	required: true,
					// 	message: '请选择问题阶段',
					// 	trigger: 'blur'
					// }],

					// nodeState: [{
					// 	required: true,
					// 	message: '请选择节点状态',
					// 	trigger: 'blur'
					// }],
				}
			}
		},
		onReady() {
			this.$refs.uForm.setRules(this.rules)
			this.getfieldList()

		},
		created() {

		},
		async onLoad() {
			// this.model.factoryName = this.factoryName
			await this.getCategorysByRole()
		},
		methods: {

			async toShowUsersList(flag, index) { //处理人/提报人/发起人			
				const params = {
					query: {
						page: 1,
						limit: 100
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

					if (flag == 'handler') {
						this.model.startName = checkerList[0].value
						this.model.handlerAccount = checkerList[0].name.split('（')[0]
					}
					// else {
					// 	if (checkerList[0].value === this.model.handlerAccount) {
					// 		this.$refs.uTips.show({
					// 			title: '审核人员不能与处理人员相同！',
					// 			type: 'warning',
					// 			duration: 2300
					// 		})
					// 		return
					// 	}
					// 	this.model.auditorList[index].auditorAccount = checkerList[0].value
					// 	this.model.auditorList[index].auditorName = checkerList[0].name.split('（')[0]
					// }

				} else {
					this.$refs.uTips.show({
						title: '暂未查到人员数据',
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
			},

			postProblemBookField(value) {
				let params = {
					categoryCode: value,
					// isListFieldApp:'Y'	
					isSearchCond: 'Y'
				}

				this.$u.api.postProblemBookFieldApi(params).then(res => {
					if (res.msgCode == '000000') {
						let data = res.data
						this.model.fieldList = data.map(item => {
							if (item.tableKey == 'qi') {
								this.$set(item, 'selectFieldName', item.fieldName)
								item.fieldName = item.placeholderName
							}
							return {
								label: '',
								fieldName: item.fieldName,
								fieldValue: '',
								fieldType: item.fieldType,
								tableKey: item.tableKey,
								optionsDomains: item.optionsDomains,
								workbookTypeCode: item.workbookTypeCode || '',
								selectFieldName: item.selectFieldName || ''
							}
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			getProblemStage(categoryCode) { //根据问题分类id获取分类阶段
				this.model.state = ''
				this.$u.api.getProblemStageApi(categoryCode).then(res => {
					if (res.msgCode == '000000') {
						this.stageNameList = res.data.map(item => {
							return {
								label: item.stageName,
								value: item.id,
								extra: 'stageNameType'
							}
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			getCategorysByRole() { //根据条件查询分类管理
				let params = {
					categoryName: ''
				}
				this.$u.api.getProblemTypeByRoleApi(params).then(res => {
					if (res.msgCode === '000000' && res.data) {
						if (res.data.length) {
							this.questionTypeList = res.data
						}
					} else {
						this.$refs.uTips.show({
							title: `问题分类信息获取失败，原因：${ res.message }`,
							type: 'error',
							duration: 2300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})

			},

			toShowQuestionType() { //打开问题分类
				this.selectLitle = '请选择问题分类'
				this.selectList = this.questionTypeList.map(item => {
					return {
						label: item.categoryName,
						value: item.categoryCode,
						// value:item.id,
						extra: 'questionType'
					}
				})
				this.showSelect = true
			},
			toShowStageNameList() { //打开问题阶段
				this.selectLitle = '请选择问题阶段'
				this.selectList = this.stageNameList
				this.showSelect = true


			},
			toShowStageStateList() { //打开节点状态
				this.selectLitle = '请选择节点状态'
				this.selectList = this.nodeStateList.map(item => {
					return {
						label: item.name,
						value: item.code,
						extra: 'stageState',
					}
				})

				this.showSelect = true
			},
			getDataDictionary(typeCode) { //获取数据字典

				this.$u.api.getDataDictionaryApi(typeCode).then(res => {
					if (res.msgCode === '000000') {
						let workbookCodeList = res.data
						if (workbookCodeList) {
							this.selectList = workbookCodeList.map(item => {
								return {
									label: item.workbookContent,
									value: item.workbookCode,
									extra: 'dataDictionary'
								}
							})
							let labelName = (typeCode == 'serious') ? '请选择严重性' : '请选择优先级'
							this.selectTitle = labelName
							this.showSelect = true
						}
					}

				}).catch(err => {
					this.common.sysErrToast(this, err)
				})

			},
			getLablesByCond() { //查询固定字段--问题标签
				this.$u.api.getLablesByCondApi({}).then(res => {
					if (res.msgCode == '000000' && res.data) {
						if (res.data.length) {
							this.selectList = res.data.map(item => {
								return {
									label: item.lableName,
									value: item.lableCode,
									extra: 'problemLabes'
								}
							})
							this.selectTitle = '请选择问题标签'
							this.showSelect = true
						}
					}

				})

			},
			getfieldList() {},
			selectstartDateIn() { //开始日期
				this.flag = 'dateIn'
				this.showDatePicker = true
			},
			selectstartDateOut() { //截止日期
				this.flag = 'dateOut'
				this.showDatePicker = true
			},
			submit() { //提交						
				this.$refs.uForm.validate(valid => {
					if (valid) {
						let flag = ''
						if (this.model.state && !this.model.nodeState) {
							this.$refs.uTips.show({
								title: '请填写节点状态',
								type: 'warning',
								duration: 2300
							})
							return
						}
						if (this.model.nodeState && !this.model.state) {
							this.$refs.uTips.show({
								title: '请填写阶段名称',
								type: 'warning',
								duration: 2300
							})
							return
						}
						if (this.model.fieldList && this.model.fieldList.length) {
							this.model.fieldList = this.model.fieldList.filter(item => {
								if (item.tableKey !== 'qi') {
									item.fieldValue = item.label
								} else {
									item.fieldName = item.selectFieldName
									if (item.fieldType == 'TEXT') {
										item.fieldValue = item.label
									}
								}
								return item.label
							})
						}
						const params = {
							query: {
								limit: this.limit,
								page: this.page
							},
							body: {
								...this.model,
								nodeState: this.model.stageStateCode,
								isListFieldApp: 'Y'
							}

						}
						const eventChannel = this.getOpenerEventChannel()
						eventChannel.emit('acceptDataFromQueryPage', params)
						uni.navigateBack()
					}
				})
			},
			reset() { //重置
				this.$refs.uForm.resetFields()
				this.model.fieldList = []
			},
			toShowList(value) {
				if (value.fieldType == 'LIST') {
					if (value.tableKey !== 'qi') { //动态字段
						let object = this.model.fieldList.find(item => {
							return item.fieldName == value.fieldName
						})
						this.selectList = object.optionsDomains.map(each => {
							return {
								label: each.fieldValue
							}
						})
						this.selectTitle = `请选择${object.fieldName}`
						this.showSelect = true
					} else { //固定字段
						if (value.workbookTypeCode) {
							this.getDataDictionary(value.workbookTypeCode) //查字典值
						} else { //问题标签				
							this.getLablesByCond()
						}

					}

				} else if (value.fieldType == 'DATE') {
					this.flag = 'date'
					let object = this.model.fieldList.find(item => {
						return item.fieldName == value.fieldName
					})
					this.selectTitle = `请选择${object.fieldName}`
					this.showDatePicker = true
				}
			},
			selectConfirm(arr) { //选择--确认

				const temp = arr[0]
				const model = this.model
				if (temp.extra === 'questionType') {
					model.categoryName = temp.label
					model.categoryCode = temp.value
					this.postProblemBookField(model.categoryCode)
					this.getProblemStage(model.categoryCode)
				} else if (temp.extra === 'stageNameType') {
					model.state = temp.label
					// model.stageNameCode = temp.value

				} else if (temp.extra === 'stageState') {
					this.model.nodeState = temp.label
					this.model.stageStateCode = temp.value
				} else {
					let selectIndex = ''
					const title = this.selectTitle
					let obj = this.model.fieldList.find((item, index) => {
						let result = ''
						if (title.includes(item.fieldName)) {
							result = item
							selectIndex = index
						}
						return result
					})
					if (temp.extra === 'dataDictionary' || temp.extra === 'problemLabes') {
						this.model.fieldList[selectIndex].label = temp.label
						this.model.fieldList[selectIndex].fieldValue = temp.value

					} else {
						this.model.fieldList[selectIndex].label = temp.label
						this.model.fieldList[selectIndex].fieldValue = temp.label
					}

				}
			},
			timeConfirm(date) { //时间选择--确定
				if (this.flag == 'dateIn') {
					this.model.startDateIn =
						`${ date.year }-${ date.month }-${ date.day }`
				} else if (this.flag == 'dateOut') {
					this.model.startDateOut =
						`${ date.year }-${ date.month }-${ date.day } `
				} else {
					let selectIndex = ''
					const title = this.selectTitle
					let obj = this.model.fieldList.find((item, index) => {
						let result = ''
						if (title.includes(item.fieldName)) {
							result = item
							selectIndex = index
						}
						return result
					})
					this.model.fieldList[selectIndex].label = `${ date.year }-${ date.month }-${ date.day } `
					this.model.fieldList[selectIndex].fieldValue = `${ date.year }-${ date.month }-${ date.day } `
				}
			}
		},

	}
</script>

<style lang="scss" scoped>
	.problemAccount {
		padding: 0rpx 20rpx;

		.btn-style {
			display: flex;
			justify-content: space-between;
			letter-spacing: 28rpx;
			text-indent: 28rpx;
		}
	}
</style>
