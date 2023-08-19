<!-- 作业指导2 -->
<template>
	<view class="sws-wh100 sws-bg-ffffff" v-if="ifSecondWorkGuideFlag">
		<!-- 		propData==={{propData}} -->
		<!-- 第二次作业指导 -->
		<view class="sws-w100  u-p-l-20 u-p-r-20 u-p-b-30 sws-overflow-scroll-y ">
			<view class="u-m-b-20  u-p-t-20">
				<view class="sws-font-bold u-font-32 " style='color:#000'>第二次作业指导</view>
			</view>
			<u-form class="sws-w100" :model="model" :error-type="['topTips']" ref="secondWorkGuideForm"
				label-width="150" label-align="center">
				<u-form-item label="断点条码" :border-bottom="false" v-show='propData.formKey==2.2'>
					<!-- <u-input :border="true" placeholder="请输入或扫描产品编码" v-model="model.code" type="text"></u-input> -->
					<u-search bg-color='#fff' border-color='#dcdfe6' height="70" placeholder="请输入或扫描断点条码"
						v-model="model.code" shape="square" search-icon="" @search="queryode(model.code)"
						:show-action='false'>
					</u-search>
					<u-icon slot="right" name="scan" size="56" color="#2979ff" @click="scanCode('code')"></u-icon>
				</u-form-item>

				<u-form-item :label="propData.formKey==2.2?'':'断点条码'" :border-bottom="false" prop='taskBarcodeList'>
					<view v-if="model.taskBarcodeList.length" class="sws-w100 problem-userList">
						<u-tag v-for="(item, index) in model.taskBarcodeList" :key="index" :text="item.barcode"
							size="mini" mode="plain" type="info" class="u-m-r-8" :closeable="propData.formKey==2.2"
							@close="delUser(index)" />
					</view>
				</u-form-item>
				<u-form-item required label="作业观察" :border-bottom="false" prop='taskResult'>
					<u-input v-if='propData.formKey==2.2' :border="true" disabled placeholder="请选择作业观察"
						v-model="model.taskResult" type="select" @click="toShowHomeworkObservation">
					</u-input>
					<u-input v-else :border="true" disabled placeholder="请选择作业观察" v-model="model.taskResultValue"
						type="select">
					</u-input>
				</u-form-item>
				<!-- <u-form-item required label="品质确认人" :border-bottom="false" prop='qualityConfirmUser'>
					<u-input :border="true" placeholder="请选择品质确认人" disabled v-model="model.qualityConfirmUser"
						@click="toShowUsers('handler')">
					</u-input>
				</u-form-item> -->
				<!-- *************************************************** -->
				<u-form-item required class="u-relative" style='justify-content: left;' label="品质确认人"
					:border-bottom="false" prop="qualityConfirmUser" label-position="top">
					<view class="sws-w100 problem-userList">
						<u-tag v-for="(each, index) in model.qualityConfirmUserArr" :key="index" :text="each.name"
							size="mini" mode="plain" type="info" class="u-m-r-8"
							:closeable="propData.formKey===2.2&&propData.manageTabCurrent === 0"
							@close="delQualityConfirmUser(index)" />
					</view>

					<view class="u-abso u-flex problem-btnGroups">
						<u-button v-if='propData.formKey==2.2&&groupCcId' type="success" size="mini"
							@click="qualityConfirmUserAddByGroup">群组添加
						</u-button>
						<u-button v-if='propData.formKey==2.2&&propData.manageTabCurrent === 0' type="primary"
							size="mini" class="u-m-l-8" @click="toShowUsers('handler')">
							人员添加
						</u-button>
					</view>

				</u-form-item>
				<!-- ********************************************************* -->
				<u-form-item required label="改善措施" class="form-item" :border-bottom="false" prop='improvementMeasure'>
					<u-input type="textarea" placeholder-style="color: #c0c4cc" height="90" :auto-height="true"
						:border="true" placeholder="改善措施" v-model="model.improvementMeasure"
						:disabled='propData.formKey!=2.2'>
					</u-input>
				</u-form-item>
				<u-form-item required label="附件上传" :border-bottom="false">
					<u-upload v-show="propData.formKey===2.2&&propData.manageTabCurrent === 0" ref="uUpload" width="210"
						height="210" :auto-upload="false">
					</u-upload>
					<view v-show="showImage" style='width:100%;' class='imgListClass'>
						<u-image v-if="imgList.length" v-for='(item,index) in imgList' :key='item.src' width="210rpx"
							height="210rpx" :src="item.src" class='u-p-20' @load="showImage = true"
							@click='imgPreview(item,index)'></u-image>
						<!-- <u-icon v-else name="zhanweitu" custom-prefix="sws-icon" size="200" color="#ebebeb"></u-icon> -->
					</view>


				</u-form-item>
			</u-form>
			<!-- <view class="sws-w100 u-p-28 btn-style" v-if="propData.formKey==2.2">
				<u-button type="primary" @click="submit">提交</u-button>
			</view> -->
			<view class="sws-w100 u-p-28  u-flex" v-if="propData.formKey==2.2&&propData.manageTabCurrent === 0">
				<!-- <u-button type="success" class="u-flex-1 u-m-r-20" @click="cacheConfirm('manual')">保存</u-button> -->
				<u-button type="primary" class="u-flex-1 u-m-r-20" @click="submit">提交</u-button>
			</view>
		</view>

		<u-picker v-model="showDatePicker" :params="timeParams" mode="time" title="发现日期" @confirm="timeConfirm">
		</u-picker>
		<u-select v-model="showSelect" :title="selectTitle" :list="selectList" @confirm="selectConfirm"></u-select>
		<u-modal v-model="showModal" :content="modalContent" @confirm="modalConfirm"></u-modal>
		<u-top-tips ref="uTips"></u-top-tips>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	import submitDialog from '../components/submitDialog/index.vue'
	export default {
		props: {
			propData: {
				type: Object,
				default: () => {}
			}
		},
		computed: {
			...mapState(['factoryId', 'factoryName', 'userInfo']),
		},
		data() {
			return {
				groupCcId: '', //用于判断上个节点是否选择了群组抄送
				ifSecondWorkGuideFlag: false,
				imgList: [],
				src: '',
				showImage: false,
				model: {
					qualityConfirmUserArr: [],
					fourChangeId: null,
					taskResult: '', //作业观察
					taskResultValue: '',
					instructionNum: 2, //指导次数
					qualityConfirmUser: '', //品质确认人
					taskBarcodeList: [ //条码集合
						// {barcode:'',taskInstructionId:null}
					],
					act: {
						batchForm: {
							batchData: [],
							taskId: this.propData.taskId
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
				workGuideRules: {
					taskBarcodeList: [{
						validator: (rule, value, callback) => {
							if (!value.length) {
								rule.message = '请输入或扫描断点条码'
								callback(new Error('请输入或扫断点描条码'))
							} else {
								callback()
							}
						},
						message: '请输入或扫描断点条码',
						trigger: 'blur'
					}],
					taskResult: [{
						required: true,
						message: '请选择作业观察',
						trigger: 'blur'
					}],
					qualityConfirmUser: [{
						required: true,
						message: '请选择品质确认人',
						trigger: 'blur'
					}],
					improvementMeasure: [{
						required: true,
						message: '请填写改善措施',
						trigger: 'blur'
					}],

				}
			}
		},
		mounted() {
			const _self = this
			uni.getStorage({ //获取缓存数据
				key: `second_work_guide_${ this.propData.businessKey }`,
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
			async qualityConfirmUserAddByGroup(type) { // 品质确认人--群组选择
				// 
				let _this = this
				if (_this.propData.formKey !== 2.2) return
				const list = await _this.toGetMenberList()
				console.log('品质确认人--群组选择List', list)
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
					this.model.qualityConfirmUserArr = checkerList
					this.model.qualityConfirmUser = checkerList[0].name.split('（')[0]
					this.model.act.batchForm.batchData = []
					this.model.act.batchForm.batchData.push({
						userTaskAssigneeName: checkerList[0].name.split('（')[0],
						userTaskAssignee: checkerList[0].value,
						userTaskDefKey: 'sid-4m-manage-3',
						userTaskName: '产品品质确认',
						businessKey: this.propData.businessKey || ''
					})
				}
			},
			toGetMenberList() { //获取品质确认人--群组
				let userRoleType = ''
				if (this.propData.changePointType === 'man') { //变化点类型为人---稽查员角色
					userRoleType = 'INSPECTOR'
				} else if (this.propData.changePointType === 'machine') { //变化点类型为设备---工艺工程师角色
					userRoleType = 'PROCESS_ENGINEER'
				} else { ////变化点类型为设备---PQE工程师角色
					userRoleType = 'PRODUCT_QUALITY_ENGINEER'
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

			// ****************************品质确认人---群组选择--end****************************************
			delQualityConfirmUser(index) { //删除品质确认人
				const qualityConfirmUserList = this.model.qualityConfirmUserArr
				qualityConfirmUserList.splice(index, 1)
				this.model.qualityConfirmUserArr = qualityConfirmUserList
				this.model.qualityConfirmUser = ''
				this.model.act.batchForm.batchData = []
			},
			setFormRules() {
				const _self = this
				_self.$nextTick(() => {
					_self.$refs.secondWorkGuideForm.setRules(_self.workGuideRules)
				})
			},
			renderData(result) {

				let that = this
				let secondGuideUserArr = []
				if (!result.id) return
				if (result.businessKey) { //查询作业指导上传的附件
					that.getWorkGuideImage(result.businessKey)
				}
				this.groupCcId = result.groupId || null
				let taskInstructionData = []
				if (result.taskInfo && result.taskInfo.length > 0) {
					let temp = result.taskInfo[0]
					if (temp.formKey && Number(temp.formKey) === 2.2) { //作业指导2节点
						if (result.userTaskConfigList && result.userTaskConfigList.length) { //找到作业指导2处理人
							secondGuideUserArr = result.userTaskConfigList.filter(each => {
								return each.userTaskDefKey === 'sid-4m-manage-2-2'
							})
							if (secondGuideUserArr.length) { //  作业指导2处理人赋值
								this.model.qualityConfirmUserArr = secondGuideUserArr.map(ele => {
									this.model.qualityConfirmUser = ele.userTaskAssigneeName
									return {
										name: ele.userTaskAssigneeName
									}
								})
							}
						}
						that.ifSecondWorkGuideFlag = true
						return
					}
					if (temp.formKey && Number(temp.formKey) > 2.2) { //大于作业指导2节点才查询信息
						if (result.taskInstructionList && result.taskInstructionList.length > 0) { //过滤出第二次作业指导内容
							that.ifSecondWorkGuideFlag = result.taskInstructionList.length > 1
							taskInstructionData = result.taskInstructionList.filter(item => {
								return item.instructionNum === 2
							})
							if (taskInstructionData.length > 0) {
								that.ifSecondWorkGuideFlag = true
								let data = (taskInstructionData[0].taskResult) === 'NG' ? '不合格' : '合格'
								that.$set(taskInstructionData[0], 'taskResultValue', data)
								that.model = taskInstructionData[0]
							} else {
								that.ifSecondWorkGuideFlag = false
							}
						}
						// 品质确认人回显
						if (result.userTaskConfigList && result.userTaskConfigList.length > 0 && taskInstructionData
							.length) {
							let userTaskInfoList = result.userTaskConfigList.filter(item => {
								return item.userTaskDefKey === 'sid-4m-manage-3'
							})
							if (userTaskInfoList.length > 0) { //品质确认人
								this.model.qualityConfirmUser = userTaskInfoList[0].userTaskAssigneeName || ''
								this.model.qualityConfirmUserAccount = userTaskInfoList[0].userTaskAssignee || ''
								// if (!this.model.qualityConfirmUserArr) {
								this.$set(this.model, 'qualityConfirmUserArr', [])
								this.model.qualityConfirmUserArr = [{
									name: userTaskInfoList[0].userTaskAssigneeName || ''
								}]
								// console.log('this.model.qualityConfirmUserArr', this.model.qualityConfirmUserArr)
								// }
							}
						}

					}

				}



			},

			queryode(code) {
				// 
				this.model.taskBarcodeList.push({
					barcode: code,
					taskInstructionId: null
				})
				this.model.taskBarcodeList = this.duplicateRemoval(this.model.taskBarcodeList)
				console.log(this.model.taskBarcodeList)

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
			cacheConfirm(flag) { //缓存数据
				try {
					const cacheData = {
						formData: {
							...this.model
						},
						// images: this.$refs.uUpload.lists
					}
					uni.setStorageSync(`second_work_guide_${ this.propData.businessKey }`, cacheData)
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
				const key = `second_work_guide_${ this.propData.businessKey }`
				if (uni.getStorageSync(key)) {
					uni.removeStorage({
						key
					})
				}
			},
			getWorkGuideImage(matId) { //获取附件内容
				const params = {
					module: 'secondTaskGuide',
					recordId: matId,
					fileType: 'otherFile'
				}
				this.$u.api.getWorkGuideImage(params).then(res => {
					if (res.msgCode === '000000') {
						if (res.data.length) {
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
			modalConfirm() {
				uni.navigateTo({
					url: '/pages/microApp/QmsManagement/4MChange/index',
				})
			},
			async submit() { //提交打开弹窗this.model
				let that = this
				const flag = await that.setFormRules()
				that.$refs.secondWorkGuideForm.validate((valid) => {
					if (valid) {
						this.model.taskResult = this.model.taskResultValue
						this.model.fourChangeId = this.propData.id
						if (!this.$refs.uUpload.lists.length) {
							this.$refs.uTips.show({
								title: '附件是必填项！',
								type: 'warning',
								duration: 2300
							})
							return
						}
						this.$u.api.workGuideApi(this.model).then(res => {
							if (res.msgCode === '000000') {
								if (this.$refs.uUpload.lists.length) {
									this.uploadImg(this.propData.businessKey || '')
								} else {
									this.modalContent = '作业指导提交成功'
									this.showModal = true
									this.isJudged = true
									// this.clearCache()
								}
							} else {
								this.$refs.uTips.show({
									title: `提交失败，原因：${res.message}`,
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
					} else {

					}
				})

			},
			async uploadImg(recordId) { //附件上传
				const params = {
					query: this.$u.queryParams({
						module: 'secondTaskGuide',
						recordId: recordId,
						fileType: 'otherFile'
					}),
					appName: 'qms'
				}

				// #ifdef APP-PLUS

				let urls = this.$refs.uUpload.lists.map(item => item.url)
				params.urls = urls
				let res = await this.$u.api.uploadMultiFiles(params) //递归调用多文件上传
				if (res.msgCode === '000000') {
					this.modalContent = '作业指导提交成功'
					this.showModal = true
				} else {
					this.$refs.uTips.show({
						title: `作业指导提交成功,图片上传失败，原因：${ res.message }`,
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
						this.modalContent = '作业指导提交成功'
						this.showModal = true
					} else {
						this.$refs.uTips.show({
							title: `作业指导提交成功,图片上传失败，原因：${ res.message }`,
							type: 'error',
							duration: '2300'
						})
					}
				})
				// #endif
			},

			toShowHomeworkObservation() { //选择作业观察
				if (this.propData.formKey && this.propData.formKey === 2.2 && this.propData.manageTabCurrent === 0) {
					this.selectTitle = '请选择作业观察'
					this.selectList = [{
						label: '合格',
						value: 'OK'
					}, {
						label: '不合格',
						value: 'NG'
					}]
					this.showSelect = true
				}


			},
			selectConfirm(arr) { //选择--确认	
				const temp = arr[0]
				this.model.taskResult = temp.label
				this.model.taskResultValue = temp.value
			},
			delUser(index) { //删除断点条码标签
				this.model.taskBarcodeList.splice(index, 1)
				// const userList = this.model.problemCcList.split(',')
				// userList.splice(index, 1)
				// this.model.problemCcList = userList.join(',')
			},
			async scanCode(type) {
				let code = await this.common.scanCode(this)
				this.model.taskBarcodeList.push({
					barcode: code,
					taskInstructionId: null
				})
				this.model.taskBarcodeList = this.duplicateRemoval(this.model.taskBarcodeList)
				switch (type) {
					case 'code':
						// this.model.code = code
						break
					case 'group':
						this.model.groupName = code
						break
					case 'sn':
						this.model.deviceSN = code
						break
				}
			},
			async toShowUsers(flag, index) { //处理人
				if (this.propData.formKey !== 2.2) return
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
						// 
						this.model.qualityConfirmUserAccount = checkerList[0].value
						this.model.qualityConfirmUser = checkerList[0].name.split('（')[0]
						this.model.qualityConfirmUserArr = checkerList
						console.log('qualityConfirmUserArr', this.model.qualityConfirmUserArr)
						this.model.act.batchForm.batchData = []
						this.model.act.batchForm.batchData.push({
							userTaskAssigneeName: this.model.qualityConfirmUser,
							userTaskAssignee: this.model.qualityConfirmUserAccount,
							userTaskDefKey: 'sid-4m-manage-3',
							userTaskName: '产品品质确认',
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