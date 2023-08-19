<!-- EVC品质异常单发起 -->
<template>
	<view class="sws-wh100 sws-bg-ebebeb u-p-20 u-rela">
		<scroll-view scroll-y scroll-with-animation class="scroll-wrap">
			<u-form :model="model" ref="uForm" :error-type="['topTips']" class="sws-w100">
				<view class="form-card">
					<view class="u-m-b-20 u-p-l-40">
						<view class="sws-font-bold u-font-32 ">问题新建</view>
					</view>
					<u-form-item required label="问题分类" :border-bottom="false" prop="categoryName">
						<u-input placeholder="请选择问题分类" v-model="model.categoryName" type="text"
							@click="toShowQuestionType">
						</u-input>
						<u-icon slot="right" name="arrow-down" size="28" @click="toShowQuestionType"></u-icon>
					</u-form-item>
					<u-form-item required label="异常单号" :border-bottom="false" prop="orderNumber">
						<u-input placeholder="请输入异常单号" v-model="model.orderNumber" type="text"></u-input>
					</u-form-item>
					<u-form-item required label="产品编码" :border-bottom="false" prop="productCode">
						<u-input placeholder="请输入或扫描产品编码" v-model="model.productCode" type="text"
							@blur="getModelTechnicsArea"></u-input>
						<u-icon slot="right" name="scan" size="56" color="#2979ff" @click="scanCode"></u-icon>
					</u-form-item>
					<u-form-item required label="产品型号" :border-bottom="false" prop="productModel">
						<u-input disabled placeholder="请选择产品型号" v-model="model.productModel"></u-input>
					</u-form-item>
					<u-form-item required label="生产工艺" :border-bottom="false" prop="craftName">
						<u-input disabled placeholder="请选择生产工艺" v-model="model.craftName" @click="toShowTechnicsList">
						</u-input>
					</u-form-item>
					<u-form-item v-show="model.technicsId" label="生产线别" :border-bottom="false">
						<u-input disabled placeholder="请输入生产线别" v-model="model.lineName">
						</u-input>
					</u-form-item>
					<u-form-item required label="发现工序" :border-bottom="false" prop="processName">
						<u-input disabled placeholder="请选择发现工序" v-model="model.processName" @click="toShowGroup">
						</u-input>
						<u-icon slot="right" name="arrow-down" size="28" @click="toShowGroup"></u-icon>
					</u-form-item>
					<u-form-item required label="车间" :border-bottom="false" label-align="center" prop="mesArea">
						<u-input disabled placeholder="请选择车间" v-model="model.mesArea" @click="toShowAreas">
						</u-input>
						<u-icon slot="right" name="arrow-down" size="28" @click="toShowAreas"></u-icon>
					</u-form-item>
					<u-form-item required label="信息来源" :border-bottom="false" prop="sourceInfo">
						<u-input disabled placeholder="请选择信息来源" v-model="model.sourceInfo" @click="toShowSourceInfo">
						</u-input>
						<u-icon slot="right" name="arrow-down" size="28" @click="toShowSourceInfo"></u-icon>
					</u-form-item>
					<u-form-item label="不良类型" :border-bottom="false">
						<u-input disabled placeholder="请选择不良类型" v-model="model.abnormalType"
							@click="toShowAbnormalTypeList">
						</u-input>
						<u-icon slot="right" name="arrow-down" size="28" @click="toShowAbnormalTypeList"></u-icon>
					</u-form-item>
					<u-form-item required label="发现时间" :border-bottom="false" prop="occurDate">
						<u-input disabled placeholder="请选择发现时间" v-model="model.occurDate"
							@click="showDatePicker = true">
						</u-input>
						<u-icon slot="right" name="calendar" size="28" @click="showDatePicker = true"></u-icon>
					</u-form-item>
					<u-form-item required label="严重性" :border-bottom="false" label-align="center"
						prop="seriousnessName">
						<u-input disabled placeholder="请选择严重性" v-model="model.seriousnessName" @click="toShowSerious">
						</u-input>
						<u-icon slot="right" name="arrow-down" size="28" @click="toShowSerious"></u-icon>
					</u-form-item>
					<u-form-item required label="优先级" :border-bottom="false" label-align="center" prop="priorityName">
						<u-input disabled placeholder="请选择优先级" v-model="model.priorityName" @click="toShowPriority">
						</u-input>
						<u-icon slot="right" name="arrow-down" size="28" @click="toShowPriority"></u-icon>
					</u-form-item>
					<u-form-item required label="处理人员" :border-bottom="false" prop="handlerName">
						<u-input disabled placeholder="请选择处理人员" v-model="model.handlerName"
							@click="toShowUsers('handler')">
						</u-input>
						<u-icon slot="right" name="arrow-right" class="u-m-r-30" size="28"
							@click="toShowUsers('handler')">
						</u-icon>
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
					<u-form-item required label="组织" :border-bottom="false" label-align="center">
						<u-input disabled placeholder="请选择组织" v-model="model.factoryName" @click="toShowFactory">
						</u-input>
						<u-icon slot="right" name="arrow-down" size="28" @click="toShowFactory"></u-icon>
					</u-form-item>
					<u-form-item required label="问题标题" :border-bottom="false" prop="problemTitle">
						<u-input placeholder="请输入问题标题" v-model="model.problemTitle" type="text" maxlength="50">
						</u-input>
					</u-form-item>
					<u-form-item required label="问题描述" :border-bottom="false" label-position="top"
						prop="abnormalDescribe">
						<u-input placeholder="请输入问题描述" v-model="model.abnormalDescribe" :border="true" type="textarea"
							maxlength="700">
						</u-input>
					</u-form-item>
					<u-form-item label="上传图片" :border-bottom="false" label-position="top" label-align="left">
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
			<u-button type="primary" class="u-flex-1" @click="submit">提交</u-button>
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
					categoryName: '', //问题分类
					categoryCode: '',
					orderNumber: '',
					productCode: '',
					productModel: '',
					craftName: '',
					lineName: '',
					mesArea: '',
					processName: '',
					processCode: '',
					seriousnessName: '',
					seriousness: '',
					priorityName: '',
					priority: '',
					handlerName: '',
					handlerAccount: '',
					problemCcList: '', //抄送人员
					occurDate: '',
					abnormalType: '',
					abnormalCode: '',
					problemTitle: '',
					abnormalDescribe: '',
					sourceInfo: '',
					factoryName: '',
					factoryCode: '',
					auditorList: []
				},
				processNameList: [], //工序列表
				rules: {
					orderNumber: [{
						validator: (rule, value, callback) => {
							const regExp = /^[a-zA-Z]\d{13}$/
							if (value) {
								if (regExp.test(value)) {
									callback()
								} else {
									rule.message = '异常单号为字母开头+13位数字'
									callback(new Error('异常单号为字母开头+13位数字'))
								}
							} else {
								rule.message = '请输入异常单号'
								callback(new Error('请输入异常单号'))
							}
						},
						message: '异常单号为字母开头+13位数字',
						trigger: ['change', 'blur']
					}],
					categoryName: [{
						required: true,
						message: '请选择问题分类',
						trigger: 'blur'
					}],
					productCode: [{
						required: true,
						message: '请输入或扫描产品编码',
						trigger: 'blur'
					}],
					productModel: [{
						required: true,
						message: '请选择产品型号',
						trigger: 'blur'
					}],
					craftName: [{
						required: true,
						message: '请选择生产工艺',
						trigger: 'blur'
					}],
					processName: [{
						required: true,
						message: '请选择发现工序',
						trigger: 'blur'
					}],
					mesArea: [{
						required: true,
						message: '请选择车间',
						trigger: 'blur'
					}],
					sourceInfo: [{
						required: true,
						message: '请选择信息来源',
						trigger: 'blur'
					}],
					occurDate: [{
						required: true,
						message: '请选择发现时间',
						trigger: 'blur'
					}],
					seriousnessName: [{
						required: true,
						message: '请选择严重性',
						trigger: 'blur'
					}],
					priorityName: [{
						required: true,
						message: '请选择优先级',
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
					problemTitle: [{
						required: true,
						message: '请选择问题标题',
						trigger: 'blur'
					}],
					abnormalDescribe: [{
						required: true,
						message: '请输入问题描述',
						trigger: 'blur'
					}],
					auditorList: [{
						validator: (rule, value, callback) => {
							const tempArr = value.filter(user => user.auditorAccount == '')
							if (tempArr.length) { //存在审核人账号为空的阶段
								rule.message = '请选择审核人员'
								callback(new Error('请选择审核人员'))
							} else {
								callback()
							}
						},
						message: '请选择审核人员',
						trigger: 'blur'
					}]
				},
				questionTypeList: [], //问题分类数据	
				productModelList: [], //产品类型
				lineList: [], //拉线数据
				areaList: [], //车间数据
				sourceInfo: [], //信息来源
				abnormalTypeList: [], //不良类型（取值标签）
				factoryList: [], // 组织
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
			}
		},
		computed: mapState(['factoryId', 'factoryName', 'userInfo']),
		onLoad() {
			this.model.factoryName = this.factoryName
			this.model.factoryCode = this.factoryId
			this.getCategorysByCond()
			// this.getAbnormalCheckBoxValues()
			// this.getStageInfo()
		},
		onReady() {
			this.$refs.uForm.setRules(this.rules)

			const _self = this
			uni.getStorage({
				key: `exception_evc_${ this.userInfo.account }`,
				success: function(res) {
					_self.model = {
						..._self.model,
						...res.data.formData
					}
					_self.$refs.uUpload.lists = [...res.data.images]
					console.log('EVC提取缓存', _self.$refs.uUpload.lists)
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
				const key = `exception_evc_${ this.userInfo.account }`
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
					console.log('EVC存入缓存cacheData', cacheData)
					uni.setStorageSync(`exception_evc_${ this.userInfo.account }`, cacheData)
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
			toShowQuestionType() { //打开问题分类
				this.selectTitle = '请选择问题分类'
				this.questionTypeList = this.questionTypeList.filter(item => {
					return (item.categoryName.includes('EVC'))
				})
				this.selectList = this.questionTypeList.map(item => {
					return {
						label: item.categoryName,
						value: item.id,
						extra: 'questionType'
					}
				})
				this.showSelect = true
			},
			getCategorysByCond() { //根据条件查询分类管理
				let category = {
					categoryName: '制程品质问题'
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
			getStageInfoEVC(value) {
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
			getAbnormalCheckBoxValues(val) {
				this.factoryList = []
				this.sourceInfo = []
				this.areaList = []
				this.model.factoryName = this.factoryName
				this.$u.api.GetEvbAbnormalCheckBoxValuesApi(this.model.categoryCode).then(res => {
					if (res.msgCode === '000000' && res.data) {
						res.data.templateFieldList.forEach(({
							fieldName,
							optionsDomains
						}) => {
							//接口形式固定，此处只能根据中文判断
							if (fieldName === '型号') {
								this.productModelList = optionsDomains
							} else if (fieldName === '工序名称') {} else if (fieldName === '拉线') {
								this.lineList = optionsDomains
							} else if (fieldName === '车间') {
								this.areaList = optionsDomains
							} else if (fieldName === '信息来源') {
								this.sourceInfo = optionsDomains
							} else if (fieldName === '组织') {
								this.factoryList = optionsDomains
							}
						})
					} else {
						this.$refs.uTips.show({
							title: `下拉选项获取失败，原因：${ res.message }`,
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
				this.$refs.uForm.validate(valid => {
					if (valid) {
						const params = {
							...this.model,
							lineCode: this.model.lineName,
							typeId: this.model.categoryCode
						}
						this.$u.api.postExceptionEVC(params).then(res => {
							if (res.msgCode === '000000') {
								if (this.$refs.uUpload.lists.length) {
									this.uploadImg(res.data)
								} else {
									this.modalContent = 'EVC异常品质单生成成功'
									this.showModal = true
									this.isJudged = true
									this.clearCache()
								}
							} else {
								this.$refs.uTips.show({
									title: `EVC异常品质单生成失败，原因：${ res.message }`,
									type: 'error',
									duration: 2300
								})
							}
						}).catch(err => {
							this.common.sysErrToast(this, err)
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
				console.log('缓存params:', params)
				let res = await this.$u.api.uploadMultiFiles(params) //递归调用多文件上传
				if (res.msgCode === '000000') {
					this.modalContent = 'EVC异常品质单生成成功'
					this.showModal = true
					this.isJudged = true
					this.clearCache()
				} else {
					this.$refs.uTips.show({
						title: `EVC异常品质单生成成功，图片上传失败，原因：${ res.message }`,
						type: 'error',
						duration: '2300'
					})
				}
				// #endif

				// #ifdef H5
				var fd = new FormData()
				this.$refs.uUpload.lists.forEach(item => fd.append('file', item.file))
				params.body = fd
				console.log('缓存11params:', params)
				this.$u.api.uploadMultiFilesForH5(params).then(res => {
					if (res.msgCode === '000000') {
						this.modalContent = 'EVC异常品质单生成成功'
						this.showModal = true
					} else {
						this.$refs.uTips.show({
							title: `EVC异常品质单生成成功，图片上传失败，原因：${ res.message }`,
							type: 'error',
							duration: '2300'
						})
					}
				})
				// #endif
			},
			toShowAreas() {
				if (this.areaList.length) {
					this.selectTitle = '请选择车间'
					this.selectList = this.areaList.map(item => {
						return {
							label: item.fieldValue,
							value: item.id,
							extra: 'area'
						}
					})
					this.showSelect = true

				} else {
					this.model.mesArea = ''
					this.$refs.uTips.show({
						title: '车间信息为空，请先配置问题模板',
						type: 'warning',
						duration: 2300
					})
				}

			},
			toShowSourceInfo() {
				if (this.sourceInfo.length) {
					this.selectTitle = '请选择信息来源'
					this.selectList = this.sourceInfo.map(item => {
						return {
							label: item.fieldValue,
							value: item.id,
							extra: 'sourceInfo'
						}
					})
					this.showSelect = true

				} else {
					this.model.sourceInfo = ''
					this.$refs.uTips.show({
						title: '信息来源为空，请先配置问题模板',
						type: 'warning',
						duration: 2300
					})
				}

			},
			async toShowAbnormalTypeList() {
				this.selectTitle = '请选择不良类型'
				if (!this.abnormalTypeList.length) {
					this.abnormalTypeList = await this.getAbnormalLables()
				}
				this.selectList = this.abnormalTypeList.map(item => {
					return {
						label: item.lableName,
						value: item.id,
						extra: 'abnormalType'
					}
				})
				this.showSelect = true
			},
			getAbnormalLables() {
				return new Promise((resolve, reject) => {
					this.$u.api.getAbnormalLables().then(res => {
						if (res.msgCode === '000000' && res.data) {
							resolve(res.data)
						} else {
							resolve([])
							this.$refs.uTips.show({
								title: `不良类型获取失败，原因：${ res.message }`,
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
			toShowGroup() { //工艺
				if (!this.model.technicsId) {
					this.$refs.uTips.show({
						title: '请选择工艺',
						type: 'warning',
						duration: 2300
					})
					return
				}
				if (this.processNameList.length) {
					this.selectTitle = '请选择发现工序'
					this.selectList = this.processNameList
					this.showSelect = true
				} else {
					this.$refs.uTips.show({
						title: '暂无工序数据！',
						type: 'warning',
						duration: 2300
					})
				}

			},
			toShowProductModel() {
				if (this.productModelList.length) {
					this.selectTitle = '请选择产品型号'
					this.selectList = this.productModelList.map(({
						id,
						fieldValue
					}) => {
						return {
							label: fieldValue,
							value: id,
							extra: 'productModel'
						}
					})

					this.showSelect = true
				} else {
					this.$refs.uTips.show({
						title: '暂无产品型号数据！',
						type: 'warning',
						duration: 2300
					})
				}
			},
			toShowTechnicsList() {
				if (!this.model.productCode) {
					this.$refs.uTips.show({
						title: '请输入或扫描产品编码',
						type: 'warning',
						duration: 2300
					})
					return
				}
				if (!this.technicsList) {
					return
				}
				if (this.technicsList.length) {
					this.selectTitle = '请选择工艺'
					this.selectList = this.technicsList.map(({
						technicsId,
						technicsName
					}) => {
						return {
							label: technicsName,
							value: technicsId,
							extra: 'technics'
						}
					})

					this.showSelect = true
				} else {
					this.$refs.uTips.show({
						title: '暂未查到工艺数据',
						type: 'warning',
						duration: 2300
					})
				}
			},
			getModelTechnicsArea() { //扫码
				if (!this.model.productCode) {
					this.$refs.uTips.show({
						title: '请输入或扫描产品编码',
						type: 'warning',
						duration: 2300
					})
					return
				}

				const params = {
					productSn: this.model.productCode
				}
				this.$u.api.getMesAbnormalQualityBySnApi(params).then(res => {
					if (res.msgCode === '000000') {
						if (res.data) {
							this.model.areaSn = res.data.areaSn
							this.model.productCode = res.data.modelCode
							this.model.productModel = res.data.modelName
							this.model.craftName = res.data.technicsName
							this.model.technicsId = res.data.technicsId
							this.model.lineName = res.data.areaSn
							if (res.data.groups && res.data.groups.length > 0) {
								this.processNameList = res.data.groups.map(item => {
									return {
										label: item.groupName,
										value: item.groupName,
										extra: 'group'
									}

								})
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
			async toShowGroupUsers() {
				const params = {
					query: {
						page: 1,
						limit: 100
					},
					body: {}
				}

				const list = await this.toGetApproveGroupUserList(this, params)
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
			toShowFactory() {
				this.selectTitle = '请选择组织'
				if (!this.factoryList.length) {
					this.$refs.uTips.show({
						title: '暂无组织信息',
						type: 'warning',
						duration: 2300
					})
				} else {
					this.selectList = this.factoryList.map(item => {
						return {
							label: item.fieldValue,
							value: item.id,
							extra: 'factory'
						}
					})
					this.showSelect = true
				}

			},
			getWorkbook() {
				return new Promise((resolve, reject) => {
					this.$u.api.getDataCodeForExceptionEVC().then(res => {
						if (res.msgCode === '000000') {
							resolve(res.data)
						} else {
							this.$refs.uTips.show({
								title: `严重性获取失败，原因：${ res.message }`,
								type: 'error',
								duration: 2300
							})
						}
					}).catch(err => {
						this.common.sysErrToast(this, err)
					})
				})
			},
			async toShowSerious() {
				let data = await this.getWorkbook()
				if (data.seriousOptions && data.seriousOptions.length) {
					this.selectTitle = '请选择严重性'
					this.selectList = data.seriousOptions.map(({
						workbookContent,
						workbookCode
					}) => {
						return {
							label: workbookContent,
							value: workbookCode,
							extra: 'serious'
						}
					})
					this.showSelect = true
				} else {
					this.$refs.uTips.show({
						title: '暂未查询到严重性数据',
						type: 'warning',
						duration: 2300
					})
				}
			},
			async toShowPriority() {
				let data = await this.getWorkbook()
				if (data.priorityOptions && data.priorityOptions.length) {
					this.selectTitle = '请选择严重性'
					this.selectList = data.priorityOptions.map(({
						workbookContent,
						workbookCode
					}) => {
						return {
							label: workbookContent,
							value: workbookCode,
							extra: 'priority'
						}
					})
					this.showSelect = true
				} else {
					this.$refs.uTips.show({
						title: '暂未查询到优先级数据',
						type: 'warning',
						duration: 2300
					})
				}
			},
			async scanCode(type) {
				this.model.productCode = await this.common.scanCode(this)
				this.getModelTechnicsArea()
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
			selectConfirm(arr) { //选择--确认
				const {
					label,
					value,
					extra
				} = arr[0]
				const model = this.model
				if (extra === 'serious') {
					model.seriousnessName = label
					model.seriousness = value
				} else if (extra === 'priority') {
					model.priorityName = label
					model.priority = value
				} else if (extra === 'technics') {
					model.craftName = label
					model.technicsId = value
					model.lineName = this.technicsList.filter(item => item.technicsId == value)[0].areasn
				} else if (extra === 'group') {
					model.processName = label
					model.processCode = value
				} else if (extra === 'area') {
					model.mesArea = label
				} else if (extra === 'line') {
					model.lineName = label
					model.lineId = value
				} else if (extra === 'productModel') {
					model.productModel = label
				} else if (extra === 'sourceInfo') {
					model.sourceInfo = label
				} else if (extra === 'factory') {
					model.factoryName = label
				} else if (extra === 'abnormalType') {
					model.abnormalType = label
					model.abnormalCode = value
				} else if (extra === 'questionType') {
					model.categoryName = label
					model.categoryCode = value
					this.getAbnormalCheckBoxValues(model.categoryCode)
					this.getStageInfoEVC(model.categoryCode)
				}
			},
			timeConfirm(date) {
				this.model.occurDate =
					`${ date.year }-${ date.month }-${ date.day } ${ date.hour }:${ date.minute }`
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