<!-- 产品标识 -->
<template>
	<view class="sws-wh100 sws-bg-ffffff">
		<view class="sws-w100  u-p-l-20 u-p-r-20 u-p-b-30 sws-overflow-scroll-y ">
			<u-form class="sws-w100" :model="model" :error-type="['topTips']" ref="productIdentify" label-width="150"
				label-align="center">
				<u-form-item required label="是否完成" :border-bottom="false" prop='isComplete'>
					<u-input :border="true" placeholder="请选择是否完成" v-model="model.isCompleteDesc"
						:type="(propData.changePointType !== 'machine')?'text':'select'"
						@click="toShowIsComplete(propData.changePointType)"
						:disabled="propData.changePointType !== 'machine'">
					</u-input>

					<!-- <u-input :border="true" placeholder="请选择是否完成" v-model="model.isCompleteDesc" type='select'
						@click="toShowIsComplete(propData.changePointType)"
						:disabled="propData.changePointType !== 'machine'">
					</u-input> -->

				</u-form-item>
				<u-form-item label="标识描述" :border-bottom="false" prop='tagDesc'>
					<u-input :border="true" :disabled="propData.curNodeId!=='sid-4m-manage-5'" placeholder="请输入"
						v-model="model.tagDesc" type="textarea">
					</u-input>
				</u-form-item>
				<!-- <u-form-item required label="4M批准人" :border-bottom="false" prop='approveUser'
					v-if="propData.formKey>=5&&propData.curNodeId==='sid-4m-manage-5'">
					<u-input :border="true" placeholder="请选择4M批准人" disabled v-model="model.approveUser"
						@click="toShowUsers('handler')">
					</u-input>
					<u-button type='success' style='margin-left:10rpx'>群组添加</u-button>
				</u-form-item> -->
				<!-- ************************************** -->
				<u-form-item v-if="propData.formKey>=5&&propData.curNodeId==='sid-4m-manage-5'" required
					class="u-relative" style='justify-content: left;' label="4M批准人" :border-bottom="false"
					prop="approveUser" label-position="top">
					<view class="sws-w100 problem-userList">
						<u-tag v-for="(each, index) in model.approveUserArr" :key="index" :text="each.name" size="mini"
							mode="plain" type="info" class="u-m-r-8" :closeable="propData.formKey===5"
							@close="delApproveUser(index)" />
					</view>
					<view class="u-abso u-flex problem-btnGroups">
						<u-button v-if='propData.formKey==5&&groupCcId' type="success" size="mini"
							@click="addApproveUserByGroup">群组添加
						</u-button>
						<u-button v-if='propData.formKey==5&&propData.manageTabCurrent === 0' type="primary" size="mini"
							class="u-m-l-8" @click="toShowUsers('handler')">
							人员添加
						</u-button>
					</view>

				</u-form-item>

				<!-- *********************************************** -->

				<u-form-item label="附件上传" :border-bottom="false">
					<u-upload v-show="!showImage" ref="uUpload" width="210" height="210" :auto-upload="false">
					</u-upload>

					<!-- <u-image v-show="showImage" v-for='item in imgList' width="100%" height="300rpx" :src="item.src"
						class='u-p-20' @load="showImage = true"></u-image> -->

					<view v-show="showImage" style='width:100%;' class='imgListClass'>
						<u-image v-show="showImage" v-for='(item,index) in imgList' :key='item.src' width="210rpx"
							height="210rpx" :src="item.src" class='u-p-20' @load="showImage = true"
							@click='imgPreview(item,index)'></u-image>
					</view>
				</u-form-item>
			</u-form>
			<view class=" sws-w100 u-p-t-20 u-flex" v-if="propData.curNodeId=='sid-4m-manage-5'">
				<!-- <u-button type="success" class="u-flex-1 u-m-r-20" @click="cancel('manual')">取消</u-button> -->
				<u-button type="primary" class="u-flex-1 u-m-l-20" @click="submit">提交</u-button>
			</view>

		</view>

		<u-picker v-model="showDatePicker" :params="timeParams" mode="time" title="发现日期" @confirm="timeConfirm">
		</u-picker>
		<u-select v-model="showSelect" :title="selectTitle" :list="selectList" @confirm="selectConfirm"></u-select>
		<u-modal v-model="showModal" :content="modalContent" @confirm="modalConfirm"></u-modal>
		<u-top-tips ref="uTips"></u-top-tips>
		<!-- <submitDialog ref='submitDialogRef' @submitForm='submitForm'></submitDialog> -->
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	// import submitDialog from '../components/submitDialog/index.vue'
	export default {
		components: {
			// submitDialog
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
		computed: {
			...mapState(['factoryId', 'factoryName', 'userInfo']),
		},
		data() {
			return {
				groupCcId: null,
				imgList: [],
				src: '',
				showImage: false,
				model: {
					approveUserArr: [],
					fourChangeId: this.propData.id || null,
					tagDesc: '', //标识描述
					isComplete: 'Y', //是否完成
					isCompleteDesc: '是',

					approveUser: '', //4M批准人
					act: {
						batchForm: {
							batchData: []
						},
						exeProcess: 'Y',
						taskId: this.propData.taskId || '',
						message: '',
						result: ''
					}
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
				productIdentifyRules: {
					isComplete: [{
						required: true,
						message: '请选择是否完成',
						trigger: 'blur'
					}],
					// tagDesc: [{
					// 	required: true,
					// 	message: '请填写标识描述',
					// 	trigger: 'blur'
					// }],

					approveUser: [{
						required: true,
						message: '请选择4M批准人',
						trigger: 'blur'
					}],
				}
			}
		},
		mounted() {
			const _self = this
			uni.getStorage({ //获取缓存数据
				key: `product_dentify_${ this.propData.businessKey }`,
				success: function(res) {
					_self.model = {
						..._self.model,
						...res.data.formData
					}
					// _self.$refs.uUpload.lists = [...res.data.images]

				}
			})

		},
		methods: {
			imgPreview(item, index) { //图片预览
				const images = this.imgList.map(item => item.src || item.path);
				uni.previewImage({
					urls: images,
					current: item.src || '', //可以为当前显示图片的链接/索引值，不填或填写的值无效则为 urls 的第一张
					success: () => {
						this.$emit('on-preview', item.src, this.imgList, this.index);
					},
					fail: () => {
						uni.showToast({
							title: '预览图片失败',
							icon: 'none'
						});
					}
				});
			},
			// ***************************品质确认人--群组选择 start*****************************************
			async addApproveUserByGroup(type) { // 品质确认人--群组选择
				// 
				let _this = this
				if (_this.propData.formKey !== 5) return
				const list = await _this.toGetMenberList()
				console.log('4M批准人--群组选择List', list)
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
					this.model.approveUserArr = checkerList
					this.model.approveUser = checkerList[0].name.split('（')[0]
					this.model.act.batchForm.batchData = []
					this.model.act.batchForm.batchData.push({
						userTaskAssigneeName: checkerList[0].name.split('（')[0],
						userTaskAssignee: checkerList[0].value,
						userTaskDefKey: 'sid-4m-manage-6',
						userTaskName: '4M批准',
						businessKey: this.propData.businessKey || ''
					}, )
				}
			},
			toGetMenberList() { //获取4M批准人--群组
				let userRoleType = ''
				this.model.isComplete = this.model.isCompleteDesc ? (this.model.isCompleteDesc === "是" ? 'Y' : "N") : ''
				if (this.model.isComplete === 'Y') { //PQE主管
					userRoleType = 'PQE_SUPERVISOR'
				} else {
					userRoleType = ''
				}
				const params = {
					query: {
						page: 1,
						limit: 100
					},
					body: {
						account: '',
						col1: userRoleType,
						groupId: this.groupCcId,
						userName: '',
					}
				}
				if (this.groupCcId && userRoleType) {

					return new Promise((resolve, reject) => {
						this.$u.api.getMembersListApi(params).then(res => {
							if (res.msgCode === '000000' && res.data) {
								if (!res.data.data.length) {
									this.$refs.uTips.show({
										title: '群组数据为空',
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
									title: `群组获取失败，原因：${ res.message }`,
									type: 'warning',
									duration: 2300
								})
							}
						}).catch(err => {
							resolve([])
							this.common.sysErrToast(this, err)
						})
					})
				}
			},

			// ****************************4M批准人---群组选择--end****************************************
			delApproveUser(index) { //删除品质确认人
				const approveUserList = this.model.approveUserArr
				approveUserList.splice(index, 1)
				this.model.approveUserArr = approveUserList
				this.model.approveUser = ''
				this.model.act.batchForm.batchData = []
			},
			queryode(code) {
				this.model.taskBarcodeList.push({
					barcode: code,
					taskInstructionId: null
				})
				this.model.taskBarcodeList = this.duplicateRemoval(this.model.taskBarcodeList)
				console.log(this.model.taskBarcodeList)

			},
			setFormRules() {
				const _self = this
				_self.$nextTick(() => {
					_self.$refs.productIdentify.setRules(_self.productIdentifyRules)
				})
			},
			renderData(result) {

				if (!result.id) return
				if (result.businessKey) {
					this.productIdentification(result.businessKey)
				}
				this.groupCcId = result.groupId || null
				if (result.productMarkingPo) {
					this.model.isComplete = result.productMarkingPo.isComplete || ''
					// this.model.isComplete = result.productMarkingPo.isComplete == 'Y' ? '是' : '否'

					this.$set(this.model, 'isCompleteDesc', '')
					this.model.isCompleteDesc = result.productMarkingPo.isComplete == 'Y' ? '是' : '否'
					this.model.tagDesc = result.productMarkingPo.tagDesc || ''
				}
			},
			productIdentification(matId) {
				const params = {
					module: 'productFlag',
					recordId: matId,
					fileType: 'otherFile'
				}
				this.$u.api.getProductFlagImage(params).then(res => {
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
			async submit() {
				let that = this
				const flag = await that.setFormRules()
				that.$refs.productIdentify.validate((valid) => {
					if (valid) {
						// if (!that.$refs.uUpload.lists.length) { //校验附件
						// 	that.$refs.uTips.show({
						// 		title: '附件是必填项！',
						// 		type: 'error',
						// 		duration: 2300
						// 	})
						// 	return
						// }
						// this.$refs.submitDialogRef.showscanCodeModal = true
						this.submitForm()
					}
				})

			}, //提交
			async submitForm() { //表单提交
				let that = this
				// that.model.act.message = handleForm.message
				// that.model.act.result = handleForm.result
				let params = {
					...that.model,
					fourChangeId: that.propData.id,
					isComplete: that.model.isComplete
				}
				that.$u.api.productMarkingApi(params).then(res => {
					if (res.msgCode === '000000') {
						if (that.$refs.uUpload.lists.length) { //如果有图片则上传图片
							that.uploadImg(that.propData.businessKey || '') //图片上传
						} else {
							that.modalContent = '提交成功'
							that.showModal = true
							this.clearCache()
						}
					} else {
						this.$refs.uTips.show({
							title: `提交失败，原因：${res.message}`,
							type: 'error',
							duration: 2300
						})
					}
				}).catch(err => {
					that.common.sysErrToast(that, err)
				})

			},
			async uploadImg(recordId) { //图片上传
				const params = {
					query: this.$u.queryParams({
						module: 'productFlag',
						recordId: recordId,
						fileType: 'otherFile'
					}),
					appName: 'qms',
				}
				// #ifdef APP-PLUS
				let urls = this.$refs.uUpload.lists.map(item => item.url)
				params.urls = urls
				let res = await this.$u.api.uploadMultiFiles(params) //递归调用多文件上传
				if (res.msgCode === '000000') {
					this.modalContent = '提交成功'
					this.showModal = true
					this.clearCache()
				} else {
					this.$refs.uTips.show({
						title: `图片上传失败，原因：${ res.message }`,
						type: 'error',
						duration: '2300'
					})
				}
				// #endif

				// #ifdef H5
				var fd = new FormData()
				this.$refs.uUpload.lists.forEach(item => fd.append('file', item.file))
				params.body = fd

				this.$u.api.uploadMultiFilesForH5(params).then(res => {
					if (res.msgCode === '000000') {
						this.modalContent = '产品标识提交成功'
						this.showModal = true
					} else {
						this.$refs.uTips.show({
							title: `产品标识图片上传失败，原因：${ res.message }`,
							type: 'error',
							duration: '2300'
						})
					}
				})
				// #endif
			},
			modalConfirm() {
				uni.navigateTo({
					url: '/pages/microApp/QmsManagement/4MChange/index',
				})
			},
			cancel() {
				uni.navigateTo({
					url: '/pages/microApp/QmsManagement/4MChange/index',
				})
			}, //取消

			toShowIsComplete(type) { //选择是否完成
				if (type == 'machine' && propData.curNodeId === 'sid-4m-manage-5') {
					this.selectTitle = '请选择是否完成'
					this.selectList = [{
						label: '是',
						value: 'Y'
					}, {
						label: '否',
						value: 'N'
					}]
					this.showSelect = true
				}


			},
			selectConfirm(arr) { //选择--确认					
				const temp = arr[0]
				this.model.isComplete = temp.value
				this.model.isCompleteDesc = temp.label
				console.log('this.model', this.model)
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
					console.log('checkerList', checkerList)

					if (flag == 'handler') {
						this.model.handlerAccount = checkerList[0].value
						this.model.approveUser = checkerList[0].name.split('（')[0]
						this.model.approveUserArr = checkerList
						this.model.act.batchForm.batchData = []
						this.model.act.batchForm.batchData.push({
							userTaskAssigneeName: checkerList[0].name.split('（')[0],
							userTaskAssignee: checkerList[0].value,
							userTaskDefKey: 'sid-4m-manage-6',
							userTaskName: '4M批准',
							businessKey: this.propData.businessKey || ''
						})

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
			cacheConfirm(flag) { //缓存数据
				try {
					const cacheData = {
						formData: {
							...this.model
						},
						// images: this.$refs.uUpload.lists
					}
					// console.log('getStorage111', `info_posing_${ this.userInfo.account }`)
					uni.setStorageSync(`product_dentify_${ this.propData.businessKey }`, cacheData)
					if (flag && flag == 'manual') { //手动保存
						this.$u.toast('保存成功！')
					} else {
						uni.navigateTo({
							url: '/pages/microApp/QmsManagement/4MChange/index',
						})
					}
				} catch (err) {
					this.$refs.uTips.show({
						title: `数据缓存失败，原因：${ err }`,
						type: 'error',
						duration: 2300
					})
				}
			},
			clearCache() { //清除缓存
				const key = `product_dentify_${ this.propData.businessKey }`
				if (uni.getStorageSync(key)) {
					uni.removeStorage({
						key
					})
				}
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

	// .btn-style {
	// 	letter-spacing: 28rpx;
	// 	text-indent: 28rpx;
	// }

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

	::v-deep .u-form-item--left__content__label {
		justify-content: left !important;
	}

	.imgListClass {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		align-items: center
	}
</style>