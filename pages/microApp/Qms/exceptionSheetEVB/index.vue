<!-- EVB品质异常单发起 -->
<template>
	<view class="sws-wh100 sws-bg-ebebeb u-p-20 u-rela">
		<scroll-view scroll-y scroll-with-animation class="scroll-wrap">
			<u-form :model="model" :error-type="['topTips']" ref="uForm" class="sws-w100">
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
					<u-form-item required label="产品类别" :border-bottom="false" prop="productType">
						<u-input placeholder="请选择产品类别" v-model="model.productType" type="text"
							@click="toShowprodTypeList">
						</u-input>
						<u-icon slot="right" name="arrow-down" size="28" @click="toShowprodTypeList"></u-icon>
					</u-form-item>
					<u-form-item required label="产品型号" :border-bottom="false" prop="productModel">
						<u-input placeholder="请输入或扫描产品型号" v-model="model.productModel" type="text"
							@blur="getModelTechnicsArea"></u-input>
						<u-icon slot="right" name="scan" size="56" color="#2979ff" @click="scanCode"></u-icon>
					</u-form-item>
					<u-form-item required label="产品编码" :border-bottom="false" prop="productCode">
						<u-input disabled placeholder="请输入产品编码" v-model="model.productCode"></u-input>
					</u-form-item>

					<u-form-item required label="生产线别" :border-bottom="false" prop="lineName">
						<u-input disabled placeholder="请输入生产线别" v-model="model.lineName">
						</u-input>
					</u-form-item>
					<u-form-item required label="发现工位" :border-bottom="false" prop="mesArea">
						<u-input disabled placeholder="请选择发现工位" v-model="model.mesArea" @click="toShowGroup">
						</u-input>
						<u-icon slot="right" name="arrow-down" size="28" @click="toShowGroup"></u-icon>
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
					<u-form-item required label="发现时间" :border-bottom="false" prop="occurDate">
						<u-input disabled placeholder="请选择发现时间" v-model="model.occurDate"
							@click="showDatePicker = true">
						</u-input>
						<u-icon slot="right" name="calendar" size="28" @click="showDatePicker = true"></u-icon>
					</u-form-item>
					<u-form-item label="检验数" :border-bottom="false" label-align="center" prop="num">
						<u-input @input="input" placeholder="请输入检验数" v-model="model.num" type="number">
						</u-input>
					</u-form-item>
					<u-form-item :required='!isHaveTo' label="不良数" :border-bottom="false" label-align="center"
						prop="abnormalNum">
						<u-input :disabled='isHaveTo' placeholder="请输入不良数" v-model="model.abnormalNum"
							@blur='abnormalNumBlur' @input="abnormalInput">
						</u-input>

					</u-form-item>
					<u-form-item label="不良率" :border-bottom="false" label-align="center" prop="abnormalRate">
						<u-input disabled placeholder="请输入不良率" v-model="model.abnormalRate">
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
					productType: '',
					productCode: '', //产品编码
					lineName: '', //产品线别
					lineCode: '',
					productModel: '',
					mesArea: '', //工位
					mesAreaCode: '', //工位对应的code
					occurDate: '', //时间
					num: '', //检验数
					abnormalNum: '', //不良数
					abnormalRate: '', //不良率
					categoryName: '', //问题分类
					categoryCode: '',
					productModel: '',
					handlerName: '', //处理人员
					handlerAccount: '',
					problemCcList: '', //抄送人员
					// problemTitle: '',
					abnormalDescribe: '',
					factoryName: '',
					auditorList: [], //审核人员
					handlerName: '',
				},

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
						message: '请选择产品型号',
						trigger: 'blur'
					}],

					lineName: [{
						required: true,
						message: '请选择产品线别',
						trigger: 'blur'
					}],

					mesArea: [{
						required: true,
						message: '请选择发现工序',
						trigger: 'blur'
					}],
					occurDate: [{
						required: true,
						message: '请选择发现时间',
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
					abnormalDescribe: [{
						required: true,
						message: '请输入问题描述',
						trigger: 'blur'
					}],
					abnormalNum: [{
						// required: true,
						message: '请输入不良数',
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
				prodTypeList: [], //产品类别
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
				showCacheModal: false,
				isJudged: false, //是否判断过 需不需要 缓存
				uButtonLoading: false,
			}
		},
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
			this.model.factoryName = this.factoryName
			await this.getCategorysByCond()
		},
		onReady() {
			this.$refs.uForm.setRules(this.rules)
			let currentTime = this.getTime()
			this.model.occurDate = currentTime

			const _self = this
			uni.getStorage({
				key: `exception_evb_${ this.userInfo.account }`,
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
				const key = `exception_evb_${ this.userInfo.account }`
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

					uni.setStorageSync(`exception_evb_${ this.userInfo.account }`, cacheData)
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
					this.model.num = e;
				} else {
					this.model.num = e.replace(".", "");
				}
			},
			abnormalInput(e) {
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
			abnormalNumBlur(val) { //计算不良率

				if (val) {
					let numVal = this.model.num
					let result = ((val / numVal)).toFixed(2)
					this.model.abnormalRate = result * 100 + '%'
				}
				if (val == '' && !this.isHaveTo) {
					this.$refs.uTips.show({
						title: '请输入不良数',
						type: 'warning',
						duration: 2300
					})

				}

			},
			toShowQuestionType() { //打开问题分类
				this.selectLitle = '请选择问题分类'
				this.questionTypeList = this.questionTypeList.filter(item => {
					return (!item.categoryName.includes('EVC'))
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
			toShowprodTypeList() { //打开产品类别
				this.selectLitle = '请选择产品类别'
				this.selectList = this.prodTypeList.map(item => {
					return {
						label: item.fieldValue,
						value: item.id,
						extra: 'productType'
					}
				})
				this.showSelect = true

			},
			getStageInfoEVB(value) { //查村问题模板
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
			getEvbAbnormalCheckBoxValues() {
				console.log('this.categoryCode', this.model.categoryCode)
				this.$u.api.GetEvbAbnormalCheckBoxValuesApi(this.model.categoryCode).then(res => {
					if (res.msgCode === '000000' && res.data) {
						res.data.templateFieldList.forEach(({
							fieldName,
							optionsDomains
						}) => {
							//接口形式固定，此处只能根据中文判断
							if (fieldName === '产品类别') {
								this.prodTypeList = optionsDomains
								console.log('this.prodTypeList666', this.prodTypeList)
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
				this.uButtonLoading = true
				this.$refs.uForm.validate(valid => {
					if (valid) {
						const params = {
							...this.model,
							typeId: this.model.categoryCode
						}
						this.$u.api.postEvbAbnormalFormApi(params).then(res => {
							if (res.msgCode === '000000') {
								this.uButtonLoading = false
								if (this.$refs.uUpload.lists.length) {
									this.uploadImg(res.data)
								} else {
									this.modalContent = 'EVB异常品质单生成成功'
									this.showModal = true
									this.isJudged = true
									this.clearCache()
								}
							} else {
								this.$refs.uTips.show({
									title: `EVB异常品质单生成失败，原因：${ res.message }`,
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
					this.modalContent = 'EVB异常品质单生成成功'
					this.showModal = true
					this.isJudged = true
					this.clearCache()
				} else {
					this.$refs.uTips.show({
						title: `EVB异常品质单生成成功，图片上传失败，原因：${ res.message }`,
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
						this.modalContent = 'EVB异常品质单生成成功'
						this.showModal = true
					} else {
						this.$refs.uTips.show({
							title: `EVB异常品质单生成成功，图片上传失败，原因：${ res.message }`,
							type: 'error',
							duration: '2300'
						})
					}
				})
				// #endif
			},
			toShowGroup() { //打开发现工位
				this.selectLitle = '请选择工位'
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
			getModelTechnicsArea() {
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
				if (extra === 'productType') {
					model.productType = label
				} else if (extra === 'group') {
					model.mesArea = label
					model.mesAreaCode = value
				} else if (extra === 'questionType') {
					model.categoryName = label
					model.categoryCode = value
					this.getEvbAbnormalCheckBoxValues(model.categoryCode)
					this.getStageInfoEVB(model.categoryCode)
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