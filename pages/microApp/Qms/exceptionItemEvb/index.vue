<!-- 发起QC巡检不符合项 -->
<template>
	<view class="sws-wh100 sws-bg-ebebeb u-p-20 u-rela">
		<scroll-view scroll-y scroll-with-animation class="scroll-wrap">
			<u-form class="sws-w100" :model="model" ref="uForm" :error-type="['topTips']" label-width="150"
				label-align="left">
				<view class="form-card">
					<u-form-item required label="问题分类" :border-bottom="false" prop="categoryName">
						<u-input placeholder="请选择问题分类" v-model="model.categoryName" @click="toShowQuestionType">
						</u-input>
						<u-icon slot="right" name="arrow-down" size="28" @click="toShowQuestionType"></u-icon>
					</u-form-item>
					<u-form-item required label="产品类别" prop="productType" :border-bottom="false">
						<u-input disabled placeholder="请选择产品类别" v-model="model.productType" @click="toShowType">
						</u-input>
						<u-icon slot="right" name="arrow-down" size="28" @click="toShowType"></u-icon>
					</u-form-item>
					<u-form-item required label="产品型号" prop="productModel" :border-bottom="false">
						<u-input @blur="getMesAbnormalQualityBySn" placeholder="请输入或扫描产品编码" v-model="model.productModel"
							type="text"></u-input>
						<u-icon slot="right" name="scan" size="56" color="#2979ff" @click="scanCode('code')"></u-icon>
					</u-form-item>
					<u-form-item required label="产品编码" prop="productCode" :border-bottom="false">
						<u-input disabled placeholder="请输入产品编码" v-model="model.productCode" type="text"></u-input>
					</u-form-item>
					<u-form-item required label="生产线别" prop="lineName" :border-bottom="false">
						<u-input disabled placeholder="请输入生产线别" v-model="model.lineName" type="text">
						</u-input>
					</u-form-item>
					<u-form-item required label="发现工位" prop="mesArea" :border-bottom="false">
						<u-input @click="toShowStation" disabled placeholder="请选择发现工位" v-model="model.mesArea">
						</u-input>
						<u-icon slot="right" name="arrow-down" size="28" @click="toShowStation"></u-icon>
					</u-form-item>
					<u-form-item required label="发现日期" prop="occurDate" :border-bottom="false">
						<u-input disabled placeholder="请选择发现日期" v-model="model.occurDate"
							@click="showDatePicker = true">
						</u-input>
						<u-icon slot="right" name="calendar" size="28" @click="showDatePicker = true"></u-icon>
					</u-form-item>
					<u-form-item label="不良数" :border-bottom="false">
						<u-input placeholder="请输入不良数" v-model="model.abnormalNum" @input="input" type="number">
						</u-input>
					</u-form-item>
					<u-form-item required label="处理人员" :border-bottom="false" prop="handlerName">
						<u-input disabled placeholder="请选择处理人员" v-model="model.handlerName"
							@click="toShowUsers('handler')">
						</u-input>
						<u-icon slot="right" name="arrow-right" size="28" @click="toShowUsers('handler')"></u-icon>
					</u-form-item>
					<u-form-item class="u-relative" required label="抄送人员" :border-bottom="false" prop="problemCcList"
						label-position="top">
						<view v-if="model.problemCcList.length" class="sws-w100 problem-userList">
							<u-tag v-for="(user, index) in model.problemCcList.split(',')" :key="index"
								:text="user.split(':')[1]" size="mini" mode="plain" type="info" class="u-m-r-8"
								:closeable="true" @close="delUser(index)" />
						</view>
						<u-input v-else disabled placeholder="请选择抄送人员" :border="true" v-model="model.problemCcList"
							type="textarea">
						</u-input>
						<view class="u-abso u-flex problem-btnGroups">
							<u-button type="primary" size="mini" class="u-m-r-8" @click="toShowUsers('problemCcList')">
								人员添加
							</u-button>
							<u-button type="success" size="mini" @click="toShowGroupUsers">群组添加</u-button>
						</view>
					</u-form-item>
					<u-form-item required prop="abnormalDescribe" label="问题描述" :border-bottom="false"
						label-position="top">
						<u-input :border="true" placeholder="请输入问题描述" v-model="model.abnormalDescribe" type="textarea">
						</u-input>
					</u-form-item>
					<u-form-item label="上传图片" :border-bottom="false" label-position="top">
						<u-upload ref="uUpload" width="210" height="210" :auto-upload="false">
						</u-upload>
					</u-form-item>
				</view>
				<view class="form-card" v-for="(item, index) in model.auditorList" :key="index">
					<view class="u-m-b-20 u-p-l-40">
						<view class="sws-font-bold u-font-32 ">
							问题模板·阶段{{ ['一', '二', '三', '四', '五', '六', '七', '八', '九'][item.sort] }}</view>
					</view>
					<u-form-item required label="阶段名称" :border-bottom="false">
						<u-input v-model="item.stageName" type="text"></u-input>
					</u-form-item>
					<u-form-item required label="审核人员" :border-bottom="false" prop="auditorList">
						<u-input disabled placeholder="请选择审核人员" v-model="item.auditorName"
							@click="toShowUsers('auditor', index)">
						</u-input>
						<u-icon slot="right" name="arrow-right" size="28" @click="toShowUsers('auditor', index)">
						</u-icon>
					</u-form-item>
				</view>
			</u-form>
		</scroll-view>
		<view class="btn-style sws-w100 u-p-t-20 u-flex">
			<u-button type="success" class="u-m-r-30" @click="cacheConfirm('manual')">保存</u-button>
			<u-button type="primary" class="u-flex-1" :loading='uButtonLoading' @click="submit">提交</u-button>
		</view>
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
		data() {
			return {
				model: {
					productType: '', //产品类别
					productCode: '', //产品编码
					productModel: '', //产品型号
					mesArea: '', //发现工序
					mesAreaCode: '',
					lineName: '', //产品线别
					lineCode: '',
					occurDate: '', //发现时间
					abnormalDescribe: '', //问题描述
					categoryName: '', //问题分类
					categoryCode: '',
					abnormalNum: '', //不良数
					orderNumber: '', //品质异常单号
					handlerName: '', //处理人员
					handlerAccount: '',
					auditorList: [], //审核人员
					problemCcList: '', //抄送人员
				},
				mesAreaList: [], //工位数据 
				questionTypeList: [], //问题分类数据
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
				rules: {
					categoryName: [{
						required: true,
						message: '请选择问题分类',
						trigger: 'blur'
					}],
					productType: [{
						required: true,
						message: '请选择产品类别',
						trigger: 'blur'
					}],
					productCode: [{
						required: true,
						message: '请输入或扫描产品编码',
						trigger: 'blur'
					}],
					productModel: [{
						required: true,
						message: '请输入或扫描产品型号',
						trigger: 'blur'
					}],
					mesArea: [{
						required: true,
						message: '请选择发现工序',
						trigger: 'blur'
					}],
					lineName: [{
						required: true,
						message: '请输入产品线别',
						trigger: 'blur'
					}],
					occurDate: [{
						required: true,
						message: '请选择发现时间',
						trigger: 'blur'
					}],
					abnormalDescribe: [{
						required: true,
						message: '请输入问题描述',
						trigger: 'blur'
					}],
					handlerName: [{
						required: true,
						message: '请选择处理人员',
						trigger: 'blur'
					}],
					problemCcList: [{
						required: true,
						message: '请选择抄送人员',
						trigger: 'blur'
					}],
				},
				showCacheModal: false,
				isJudged: false, //是否判断过 需不需要 缓存
				uButtonLoading:false,
			}
		},
		computed: mapState(['userInfo']),
		async onLoad() {
			// this.model.factoryName = this.factoryName
			await this.getCategorysByCond()
		},
		onReady() {
			this.$refs.uForm.setRules(this.rules)
			let currentTime = this.getTime()
			this.model.occurDate = currentTime

			const _self = this
			uni.getStorage({
				key: `exception_item_${ this.userInfo.account }`,
				success: function(res) {
					_self.model = {
						..._self.model,
						...res.data.formData
					}
					_self.$refs.uUpload.lists = [...res.data.images]
				}
			})
		},
		methods: {
			delUser(index) {
				const userList = this.model.problemCcList.split(',')
				userList.splice(index, 1)
				this.model.problemCcList = userList.join(',')
			},
			clearCache() {
				const key = `exception_item_${ this.userInfo.account }`
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
						images: this.$refs.uUpload.lists
					}

					uni.setStorageSync(`exception_item_${ this.userInfo.account }`, cacheData)
					if (flag && flag == 'manual') { //手动保存
						this.$u.toast('保存成功！')
					} else {
						uni.navigateBack()
					}
				} catch (err) {
					this.$refs.uTips.show({
						title: `数据缓存失败，原因：${ err }`,
						type: 'error',
						duration: 2300
					})
				}
			},
			input(e) { //只能输入整数
				let rule = /^[1-9][0-9]*$/;
				if (rule.test(e)) {
					this.model.abnormalNum = e;
				} else {
					this.model.abnormalNum = e.replace(".", "");
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
			async scanCode(type) {
				let code = await this.common.scanCode(this)
				switch (type) {
					case 'code':
						this.model.productCode = code
						this.getMesAbnormalQualityBySn(code)
						break
					case 'group':
						this.model.groupName = code
						break
						// case 'sn':
						// 	this.model.deviceSN = code
						// 	break
				}
			},
			getMesAbnormalQualityBySn(code) { //根据编码获取工艺名称、产品型号和线体
				const params = {
					productSn: this.model.productCode
				}
				this.$u.api.getMesAbnormalQualityBySnApi(params).then(res => {
					if (res.msgCode === '000000') {
						if (res.data) {
							this.model.lineName = res.data.areaSn
							this.model.lineCode = res.data.areaSn
							this.model.productCode = res.data.modelCode
							this.model.productModel = res.data.modelName
							if (res.data.groups) {
								this.mesAreaList = res.data.groups
							}
						} else {
							this.$refs.uTips.show({
								title: '暂未查到数据',
								type: 'warning',
								duration: 2300
							})
						}
					}

				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},

			getCategorysByCond() { //根据条件查询分类管理
				let category = {
					categoryName: '巡检不符合项'					
				}
				this.$u.api.getCategorysByCondApi(category).then(res => {
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
			modalConfirm() {
				uni.navigateBack()
			},

			submit() { //确认
			this.uButtonLoading=true
			this.$refs.uForm.validate(valid => {
				if (valid) {
					const params = {
						...this.model,
						typeId: this.model.categoryCode
					}
					this.$u.api.postEvbInspectApi(params).then(res => {
						if (res.msgCode === '000000') {
							this.uButtonLoading=false
							if (this.$refs.uUpload.lists.length) {
								this.uploadImg(res.data)
							} else {
								this.modalContent = 'EVB巡检不符合项问题单生成成功'
								this.showModal = true
								this.isJudged = true
								this.clearCache()
							}
						} else {
							this.$refs.uTips.show({
								title: `EVB巡检不符合项问题单生成失败，原因：${ res.message }`,
								type: 'error',
								duration: 2300
							})
						}
					}).catch(err => {
						this.common.sysErrToast(this, err)
					}).finally(()=>{
						setTimeout(() => {
											this.uButtonLoading=false
										},1200)

						
					})
				}
			})
				
			},		
			async uploadImg(recordId) {
				const params = {
					query: this.$u.queryParams({
						module: 'problemNode',
						recordId: recordId
					}),
					appName: 'clms'
				}

				// #ifdef APP-PLUS
				let urls = this.$refs.uUpload.lists.map(item => item.url)
				params.urls = urls
				console.log('params:', params)
				let res = await this.$u.api.uploadMultiFiles(params) //递归调用多文件上传
				if (res.msgCode === '000000') {
					this.modalContent = '巡检不符合项单生成成功'
					this.showModal = true
					this.isJudged = true
					this.clearCache()
				} else {
					this.$refs.uTips.show({
						title: `巡检不符合项单生成成功，图片上传失败，原因：${ res.message }`,
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
						this.modalContent = '巡检不符合项单生成成功'
						this.showModal = true
					} else {
						this.$refs.uTips.show({
							title: `巡检不符合项单生成成功，图片上传失败，原因：${ res.message }`,
							type: 'error',
							duration: '2300'
						})
					}
				})
				// #endif
			},

			toShowQuestionType() { //打开问题分类
				this.selectLitle = '请选择问题分类'
				this.selectList = this.questionTypeList.map(item => {
					return {
						label: item.categoryName,
						value: item.id,
						extra: 'questionType'
					}
				})
				this.showSelect = true

			},
			toShowStation() { //选择工位
				this.selectTitle = '请选择工位'
				if (this.mesAreaList.length) {
					this.selectList = this.mesAreaList.map(item => {
						return {
							label: item.groupName,
							value: item.groupName,
							extra: 'group'
						}
					})
					this.showSelect = true

				} else {
					this.$refs.uTips.show({
						title: '暂未查到数据',
						type: 'warning',
						duration: 2300
					})
				}
			},
			toShowType() {
				this.selectTitle = '请选择产品类别'
				this.selectList = [{
					label: 'Cell',
					value: 'Cell'
				}, {
					label: 'BMS',
					value: 'BMS'
				}, {
					label: 'Module',
					value: 'Module'
				}, {
					label: 'PACK',
					value: 'PACK'
				}]
				this.showSelect = true
			},
			toShowExceptionType() {
				this.selectTitle = '请选择问题类别'
				this.selectList = [{
					label: '人',
					value: '人'
				}, {
					label: '机',
					value: '机'
				}, {
					label: '料',
					value: '料'
				}, {
					label: '法',
					value: '法'
				}, {
					label: '环',
					value: '环'
				}]
				this.showSelect = true
			},

			async toShowGroupUsers() {
				const params = {
					query: {
						page: 1,
						limit: 100
					},
					body: {}
				}

				const list = await this.toGetApproveGroupUserList(params)
				if (list.length) {
					const params = {
						title: '请选择抄送群组',
						list,
						hasSearch: true,
						isRadio: true,
					}

					const groupList = await this.common.goToSelected(params)
					const checkerList = groupList[0].extra.groupUserRelationPoList
					const newList = checkerList.map(item => `${ item.userAccount }:${ item.userName }`)
					const oldList = !this.model.problemCcList.length ? [] : this.model.problemCcList.split(',')
					this.model.problemCcList = [...oldList, ...newList].join(',')
				} else {
					this.$refs.uTips.show({
						title: '暂未查到群组人员数据',
						type: 'warning',
						duration: 2300
					})
				}
			},
			toGetApproveGroupUserList(params) {
				return new Promise((resolve, reject) => {
					this.$u.api.getGroupUsersFromClms(params).then(res => {
						if (res.msgCode === '000000' && res.data && res.data.data.length) {
							const list = res.data.data.map(item => {
								return {
									name: item.groupName,
									value: item.id,
									desc: item.groupLeaderUserNames,
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

			async toShowUsers(flag, index) { //处理人
				if (flag === 'auditor' && this.model.handlerAccount === '') {
					this.$refs.uTips.show({
						title: '请先选择处理人员',
						type: 'warning',
						duration: 2300
					})
					return
				}

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
						this.model.handlerAccount = checkerList[0].value
						this.model.handlerName = checkerList[0].name.split('（')[0]
					} else if (flag === 'problemCcList') {
						const newList = checkerList.map(item => `${ item.value }:${ item.name.split('（')[0] }`)
						const oldList = !this.model.problemCcList.length ? [] : this.model.problemCcList.split(',')
						this.model.problemCcList = [...oldList, ...newList].join(',')
					} else {
						if (checkerList[0].value === this.model.handlerAccount) {
							this.$refs.uTips.show({
								title: '审核人员不能与处理人员相同！',
								type: 'warning',
								duration: 2300
							})
							return
						}
						this.model.auditorList[index].auditorAccount = checkerList[0].value
						this.model.auditorList[index].auditorName = checkerList[0].name.split('（')[0]
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

			goToSelected(title, list, type, hasSearch = false, isRadio = false) {
				// title 选择列表页面标题  list 选择列表项 type赋值对象的属性名, hasSeach是否需要本地搜索
				let _self = this
				let params = {
					title: title,
					items: list,
					hasSearch,
					isRadio
				}
				uni.navigateTo({
					url: '/pages/common/selectItems/index',
					events: {
						acceptDataFromOpenedPage(res) {
							const temp = res.data[0]
							if (type === 'handler') {
								_self.model.handlerName = temp.value.split('-')[0]
								_self.model.handlerAccount = temp.value.split('-')[1]
							}
						}
					},
					success: function(res) {
						res.eventChannel.emit('acceptDataFromOpenerPage', params)
					}
				})
			},
			getStageInfoEVB(value) { //查询问题模板
				console.log('categoryCode--value', value)
				this.$u.api.getStageInfoApi(value).then(res => {
					if (res.msgCode === '000000' && res.data) {
						if (res.data.length) {
							this.model.auditorList = res.data.map(item => {
								return {
									...item,
									auditorAccount: '',
									auditorName: '',
									stageId: item.id
								}
							})
						} else {
							this.model.auditorList = [] //res.data异常返回''
						}
					} else {
						this.$refs.uTips.show({
							title: `阶段审核信息获取失败，原因：${ res.message }`,
							type: 'error',
							duration: 2300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},

			selectConfirm(arr) { //下拉选择--确定
				const {
					label,
					value,
					extra
				} = arr[0]
				const model = this.model
				if (this.selectTitle.includes('产品类别')) {
					model.productType = value
				} else if (this.selectTitle.includes('问题类别')) {
					model.exceptionType = value
				} else if (this.selectTitle.includes('工位')) {
					model.mesArea = value
					model.mesAreaCode = value
				}
				if (extra === 'questionType') {
					model.categoryName = label
					model.categoryCode = value
					this.getStageInfoEVB(model.categoryCode)
				}
			},
			timeConfirm(date) {
				this.model.occurDate =
					`${ date.year }-${ date.month }-${ date.day } ${ date.hour }:${ date.minute }`
			}
		},
		onBackPress() {
			if (!this.isJudged) { //是否判断过 需要缓存
				this.isJudged = true
				this.showCacheModal = true
				return true
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

	.btn-style {
		letter-spacing: 28rpx;
		text-indent: 28rpx;
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
