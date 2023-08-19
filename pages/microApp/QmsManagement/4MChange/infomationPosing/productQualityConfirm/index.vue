<!-- 品质确认 -->
<template>
	<view class="sws-wh100 sws-bg-ffffff">
		<!-- {{model}}
		propData==={{propData}} -->
		<view class="sws-w100  u-p-l-20 u-p-r-20 u-p-b-30 sws-overflow-scroll-y ">
			<u-form class="sws-w100" :model="model" label-width="150" label-align="center">
				<u-form-item required label="首件确认" :border-bottom="false">
					<u-input :border="true" placeholder="请选择首件确认" disabled v-model="model.firstConfirm">
					</u-input>
				</u-form-item>
				<u-form-item required label="品质确认" :border-bottom="false">
					<u-input :border="true" placeholder="请选择品质确认" disabled v-model="model.qualityConfirm">
					</u-input>
				</u-form-item>

				<u-form-item required label="始业点检" :border-bottom="false">
					<u-input :border="true" placeholder="请选择始业点检" disabled v-model="model.taskCheck">
					</u-input>
				</u-form-item>
				<!-- 料法时 出现是否标识 标识为是 出现产品标识人  为否  出现4M批准人-->
				<u-form-item required label="是否标识" :border-bottom="false"
					v-if="propData.changePointType==='method'||propData.changePointType==='materialToAB'||propData.changePointType==='materialToC'">
					<u-input :border="true" placeholder="请选择是否标识" disabled v-model="model.isTag">
					</u-input>
				</u-form-item>
				<u-form-item required label="标识内容" :border-bottom="false"
					v-if="propData.formKey>=3 && propData.curNodeId==='sid-4m-manage-3'&&model.isTag==='是'">
					<u-input :border="true" placeholder="标识内容" disabled v-model="model.tagContent" type='textarea'>
					</u-input>
				</u-form-item>

				<!-- 标识为是 出现产品标识人 -->
				<u-form-item required label="产品标识人" :border-bottom="false"
					v-if="model.isTag==='是'&&propData.curNodeId==='sid-4m-manage-3'">
					<u-input :border="true" placeholder="产品标识人" disabled v-model="model.productFlagUser"
						type='textarea'>
					</u-input>
				</u-form-item>

				<!-- 1.标识为否 或 2.变化点为‘人’   出现4M批准人   -->
				<u-form-item required label="4M批准人" :border-bottom="false"
					v-if="propData.formKey>=3 && propData.curNodeId==='sid-4m-manage-3' && ((model.isTag==='否')||propData.changePointType==='man' )">
					<u-input :border="true" placeholder="请选择4M批准人" disabled v-model="model.approveUser"
						@click="toShowUsers('handler')">
					</u-input>
				</u-form-item>

				<!-- 变化点为设备 出现标识判定人-->
				<u-form-item required label="标识判定人" :border-bottom="false" v-if="propData.changePointType==='machine'">
					<u-input :border="true" placeholder="标识判定人" disabled v-model="model.flagDecideUser">
					</u-input>
				</u-form-item>

				<u-form-item v-show="showImage" label="附件上传" :border-bottom="false">
					<u-upload disabled v-show="!showImage" ref="uUpload" width="210" height="210" :auto-upload="false">
					</u-upload>
					<!-- <u-image v-show="showImage" width="100%" height="400rpx" :src="src"
						@load="showImage = true"></u-image> -->

					<u-image v-show="showImage" v-for='item in imgList' width="100%" height="300rpx" :src="item.src"
						class='u-p-20' @load="showImage = true"></u-image>
				</u-form-item>
				</u-form-item>
				</u-form-item>
			</u-form>

		</view>
		<u-select v-model="showSelect" :title="selectTitle" :list="selectList" @confirm="selectConfirm"></u-select>
		<u-modal v-model="showModal" :content="modalContent" @confirm="modalConfirm"></u-modal>
		<u-top-tips ref="uTips"></u-top-tips>
		<submitDialog ref='submitDialogRef' @submitForm='submitForm'></submitDialog>
	</view>
</template>

<script>
	import submitDialog from '../components/submitDialog/index.vue'
	export default {
		components: {
			submitDialog
		},
		props: {
			propData: {
				type: Object,
				default: () => {}
			},
			fourMInfo: {
				type: Object,
				default: () => {}
			},
		},
		data() {
			return {
				imgList: [],
				src: '',
				showImage: false,
				model: {
					productFlagUser: '', //产品标识人
					flagDecideUser: '', //标识判定人
					firstConfirm: '', //首件确认
					qualityConfirm: '', //品质确认,					
					taskCheck: '', //始业点检
					isTag: '', //是否标识
					tagContent: '', //标识内容
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
				showDatePicker: false
			}
		},
		methods: {
			renderData(result) {
				if (result.businessKey) {
					this.getqualityConfirmImage(result.businessKey)
				}
				if (result.qualityConfirmPo) {
					this.model.firstConfirm = result.qualityConfirmPo.firstConfirm == 'OK' ? '合格' : '不合格'
					this.model.qualityConfirm = result.qualityConfirmPo.qualityConfirm == 'OK' ? '合格' : '不合格'
					this.model.taskCheck = result.qualityConfirmPo.taskCheck == 'OK' ? '合格' : '不合格'
					this.model.isTag = result.qualityConfirmPo.isTag ? (result.qualityConfirmPo.isTag == 'Y' ? '是' :
						'否') : ''
					this.model.tagContent = result.qualityConfirmPo.tagContent
				}
				if (result.userTaskConfigList && result.userTaskConfigList.length > 0) {
					result.userTaskConfigList.forEach(item => {
						if (item.userTaskDefKey === 'sid-4m-manage-4') { //标识判定人
							this.model.flagDecideUser = item.userTaskAssigneeName || ''

						}
						if (item.userTaskDefKey === 'sid-4m-manage-6') { //4M批准人
							this.model.approveUser = item.userTaskAssigneeName || ''

						}
						if (item.userTaskDefKey === 'sid-4m-manage-5') { //产品标识人
							this.model.productFlagUser = item.userTaskAssigneeName || ''

						}
					})

				}
			},
			getqualityConfirmImage(matId) {
				const params = {
					fileType: 'otherFile',
					module: 'qualityConfirm',
					recordId: matId

				}
				this.$u.api.getqualityConfirmImage(params).then(res => {
					if (res.msgCode === '000000') {
						if (res.data.length) {
							// this.src = res.data[0]
							// 	.url //'http://10.201.88.55:8899/file-api//dips/spareParts/642/image/hMDpufjYc.jpg'

							this.imgList = res.data.map(item => {
								return {
									src: item.url,
									showImage: true
								}
							})
						}
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			submitForm() { //表单提交

			},
			cancel() {}, //取消
			submit() {
				this.$refs.submitDialogRef.showscanCodeModal = true
			}, //提交
			toShowHomeworkObservation() { //选择是否完成
				this.selectTitle = '请选择是否完成'
				this.selectList = [{
					label: '是',
					value: '是'
				}, {
					label: '否',
					value: '否'
				}]
				this.showSelect = true

			},
			selectConfirm(arr) { //选择--确认	
				const temp = arr[0]
				this.model.homeworkObservation = temp.value
			},



			async toShowUsers(flag, index) { //处理人			
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
								const userList = await this.toGetApproveUserList(
									params)
								resolve(userList)
							})
						}
					}

					const checkerList = await this.common.goToSelected(params)

					if (flag == 'handler') {
						this.model.handlerAccount = checkerList[0].value
						this.model.handlerName = checkerList[0].name.split('（')[0]
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
		},

	}
</script>

<style lang="scss" scoped>
	.problem-userList {
		border-radius: 8rpx;
		border: 2rpx solid #dcdfe6;
		min-height: 124rpx;
		padding: 8rpx 20rpx;
	}

	.btn-style {
		letter-spacing: 28rpx;
		text-indent: 28rpx;
	}
</style>