<!-- DIPS → 工治具管理 → 工治具领用申请 -->
<template>
	<view class="sws-wh100 u-flex sws-flex-d-column">
		<u-form ref="uForm" class="sws-w100 u-flex-1 u-p-l-20 u-p-r-20 u-p-b-30" :model="model" label-width="150"
			label-align="center">
			<u-form-item label="厂区" :border-bottom="false">
				<u-input :border="true" disabled placeholder="" v-model="factoryName" type="text">
				</u-input>
			</u-form-item>
			<u-form-item label="申请人" :border-bottom="false">
				<u-input :border="true" disabled placeholder="" v-model="userInfo.userName" type="text">
				</u-input>
			</u-form-item>
			<u-form-item label="申请人工号" :border-bottom="false">
				<u-input :border="true" disabled placeholder="" v-model="userInfo.account" type="text">
				</u-input>
			</u-form-item>
			<u-form-item required label="申领人" :border-bottom="false" prop="operatorName">
				<u-input disabled placeholder="请选择申领人" v-model="model.operatorName"
					@click="toShowUsers('operatorName')">
				</u-input>
				<u-icon slot="right" name="arrow-right" size="28" @click="toShowUsers('operatorName')"></u-icon>
			</u-form-item>
			<u-form-item required label="责任主管" :border-bottom="false" prop="personInchargeName">
				<u-input disabled placeholder="请选择责任主管" v-model="model.personInchargeName"
					@click="toShowUsers('personInchargeName')">
				</u-input>
				<u-icon slot="right" name="arrow-right" size="28" @click="toShowUsers('personInchargeName')"></u-icon>
			</u-form-item>
			<u-form-item required label="使用人" :border-bottom="false" prop="recipientsName">
				<u-input disabled placeholder="请选择使用人" v-model="model.recipientsName"
					@click="toShowUsers('recipientsName')">
				</u-input>
				<u-icon slot="right" name="arrow-right" size="28" @click="toShowUsers('recipientsName')"></u-icon>
			</u-form-item>
			<u-form-item required label="领用时间" :border-bottom="false" prop="recipientsDate">
				<u-input disabled placeholder="请选择领用时间" v-model="model.recipientsDate" @click="openDatePicker(1)">
				</u-input>
				<u-icon slot="right" name="arrow-down" size="28" @click="openDatePicker(1)"></u-icon>
			</u-form-item>
			<u-form-item required label="预计归还时间" :border-bottom="false" prop="expectedReturnDate">
				<u-input disabled placeholder="请选择预计归还时间" v-model="model.expectedReturnDate" @click="openDatePicker(2)">
				</u-input>
				<u-icon slot="right" name="arrow-down" size="28" @click="openDatePicker(2)"></u-icon>
			</u-form-item>
			<u-form-item required label="工治具编码" :border-bottom="false" prop="fixtureCode">
				<u-input :border="true" placeholder="请输入/扫描工治具编码" v-model="model.fixtureCode" type="text"
					:focus="setFocus">
				</u-input>
				<u-icon slot="right" name="scan" size="56" color="#2979ff" @click="scanCode"></u-icon>
			</u-form-item>
			<u-form-item required label="需求数量" :border-bottom="false">
				<u-input :border="true" disabled placeholder="请输入需求数量" v-model="model.applyNum" type="number">
				</u-input>
			</u-form-item>
			<u-form-item required label="用途/备注" :border-bottom="false">
				<u-input height="88" type="textarea" :border="true" placeholder="请输入用途/备注" v-model="model.usage" />
			</u-form-item>
			<u-form-item label="工治具名称" :border-bottom="false" style="color: #868686;">
				{{ fixtureName }}
			</u-form-item>
			<u-form-item label="货架号" :border-bottom="false" style="color: #868686;">
				{{ positionName }}
			</u-form-item>
		</u-form>
		<view class="btn-group sws-w100 u-flex u-row-between u-p-t-28 u-p-b-28">
			<u-button type="default" class="sws-line-h-repair" size="medium" @click="reset">重置</u-button>
			<u-button type="primary" class="sws-line-h-repair" size="medium" @click="commit">确认</u-button>
		</view>
		<u-modal v-model="showModal" :content="modalContent" @confirm="modalConfirm"></u-modal>
		<u-top-tips ref="uTips"></u-top-tips>
		<u-picker v-model="showDatePicker" mode="time" :default-time="defaultTime" :startYear="startYear" :params="timeParams"
			@confirm="timeConfirm"></u-picker>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'

	export default {
		data() {
			return {
				showDatePicker: false,
				fixtureName: '', //工治具名称
				positionName: '', //存放位置
				positionId: '', // 位置id
				//positionName:'',//货架号

				model: {
					fixtureCode: '',
					applyNum: 1,
					remark: '',
					operatorName: '',
					operator: '',
					personInchargeName: '',
					personIncharge: '',
					recipientsName: '',
					recipients: '',
					recipientsDate: ''
				},
				setFocus: false, //默认不获取焦点
				rules: {
					fixtureCode: [{
						asyncValidator: async (rule, value, callback) => {
							if (value) { //空值判断放在确认方法中处理
								let fixtureInfo = await this.baseData.getFixtureInfo(this, value)
								if (Object.keys(fixtureInfo).length) {
									this.model.fixtureId = fixtureInfo.id
									this.fixtureName = fixtureInfo.fixtureName
									this.positionName = fixtureInfo.positionName
									this.positionId = fixtureInfo.positionId
									callback()
								} else {
									this.$refs.uTips.show({
										title: '此工治具编码不存在，请重新输入/扫描',
										type: 'warning',
										duration: 2300
									})
								}
							}
						},
						trigger: 'blur',
					}]
				},
				modalContent: '',
				showModal: false,
				startYear: '',
				defaultTime: '',
				timeParams: {
					year: true,
					month: true,
					day: true,
					hour: true,
					minute: true,
					second: true,
					timestamp: true,
				},
			}
		},
		computed: mapState(['factoryName', 'userInfo']),
		onReady() {
			this.$refs.uForm.setRules(this.rules)
		},
		methods: {
			openDatePicker(type) {
				this.dateType = type
				this.startYear = this.$u.timeFormat(new Date(), 'yyyy') //当前日期 yy-mm-dd
				this.defaultTime = type === 2 ? this.model.expectedReturnDate : this.model.recipientsDate
				this.showDatePicker = true
			},
			timeConfirm(date) {
				let curDate = this.$u.timeFormat(new Date(), 'yyyy-mm-dd') //当前日期 yy-mm-dd
				let selectedDate = this.$u.timeFormat(date.timestamp, 'yyyy-mm-dd') //选择的日期 yy-mm-dd
				if (selectedDate < curDate) {
					this.$refs.uTips.show({
						title: this.dateType === 2 ?'预计归还时间必须大于当前时间!':'领用时间必须大于当前时间！',
						type: 'warning',
						duration: 2300
					})
					return
				}
				if (this.dateType === 2) {
					this.model.expectedReturnDate = this.$u.timeFormat(date.timestamp, 'yyyy-mm-dd hh:MM:ss')
					return
				}
				this.model.recipientsDate = this.$u.timeFormat(date.timestamp, 'yyyy-mm-dd hh:MM:ss')
			},
			async scanCode() {
				// #ifdef APP-PLUS
				this.model.fixtureCode = await this.common.scanCode()
				this.setFocus = true
				// #endif
			},
			async getBaseUserInfo() {
				let baseUserInfo = await this.baseData.getBaseUserInfo(this)
				if (Object.keys(baseUserInfo).length) {
					this.model.userName = baseUserInfo.userName
					this.model.telephone = baseUserInfo.telephone
					this.model.factoryName = this.factoryName
				} else {
					this.$refs.uTips.show({
						title: '申请人信息获取失败',
						type: 'error',
						duration: 2300
					})
					setTimeout(() => {
						uni.navigateBack()
					}, 3000)
				}
			},
			async toShowUsers(type) { //处理人
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
								const userList = await this.toGetApproveUserList(
									params)
								resolve(userList)
							})
						}
					}

					const checkerList = await this.common.goToSelected(params)
					if (type === 'personInchargeName') {
						this.model.personIncharge = checkerList[0].value
						this.model.personInchargeName = checkerList[0].name.split('（')[0]
					} else if (type === 'recipientsName') {
						this.model.recipients = checkerList[0].value
						this.model.recipientsName = checkerList[0].name.split('（')[0]
					} else {
						this.model.operator = checkerList[0].value
						this.model.operatorName = checkerList[0].name.split('（')[0]
					}
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
								title: `人员列表获取失败，原因：${ res.message }`,
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
			commit() {
				let checkArr = [{
					tips: '请选择申领人',
					value: this.model.operatorName
				}, {
					tips: '请选择使用人',
					value: this.model.recipientsName
				}, {
					tips: '请选择责任主管',
					value: this.model.personInchargeName
				}, {
					tips: '请选择领用时间',
					value: this.model.recipientsDate
				},{
					tips: '请选择预计归还时间',
					value: this.model.expectedReturnDate
				}, {
					tips: '请输入工治具编码',
					value: this.model.fixtureCode
				}, {
					tips: '请输入用途/备注',
					value: this.model.usage
				}]
				if (this.common.checkNotNull(this, checkArr)) {
					const params = {
						matFixtures: [{
							fixtureId: this.model.fixtureId,
							fixtureCode: this.model.fixtureCode
						}],
						positionId: this.positionId,
						usage: this.model.usage,
						operatorName: this.model.operatorName,
						operator: this.model.operator,
						recipientsName: this.model.recipientsName,
						recipients: this.model.recipients,
						personInchargeName: this.model.personInchargeName,
						personIncharge: this.model.personIncharge,
						recipientsDate: this.model.recipientsDate,
						expectedReturnDate:this.model.expectedReturnDate
					}
					this.$u.api.postFixtureApply(params).then(res => {
						if (res.msgCode === '000000') {
							this.modalContent = '工治具申请成功'
							this.showModal = true
						} else {
							this.$refs.uTips.show({
								title: `工治具申请失败，原因：${res.message}`,
								type: 'error',
								duration: 2300
							})
						}
					}).catch(err => {
						this.common.sysErrToast(this, err)
					})
				}
			},
			modalConfirm() {
				this.reset()
				uni.navigateBack()
			},
			reset() {
				this.model.fixtureCode = ''
				this.model.applyNum = 1
				this.model.usage = ''
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