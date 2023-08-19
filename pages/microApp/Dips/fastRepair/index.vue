<!-- DIPS → 快速报修 -->
<template>
	<view class="sws-wh100 u-flex sws-flex-d-column sws-overflow-hidden">
		<view class="sws-w100 u-flex-1 u-p-l-20 u-p-r-20 u-p-b-30 sws-overflow-scroll-y">
			<u-form class="sws-w100" :model="model" label-width="150"
				label-align="center">
				<u-form-item required label="设备编码" :border-bottom="false">
					<u-input :border="true" placeholder="请输入或扫描设备编码" v-model="model.deviceCode" type="text"
						@blur="getDeviceInfo"></u-input>
					<view slot="right" class="u-flex">
						<u-icon name="scan" size="56" color="#2979ff" class="u-m-r-20" @click="scanCode"></u-icon>
						<u-icon name="chaxun" custom-prefix="sws-icon" size="52" color="#2979ff" @click="toQueryDeviceCode"></u-icon>
					</view>
				</u-form-item>
				<u-form-item label="设备类型" :border-bottom="false">
					<u-input :border="true" disabled placeholder="" v-model="model.deviceCategory" type="text">
					</u-input>
				</u-form-item>
				<u-form-item label="所属线体" :border-bottom="false">
					<u-input :border="true" disabled placeholder="" v-model="model.lineName" type="text"></u-input>
				</u-form-item>
				<u-form-item label="报修人" :border-bottom="false">
					<u-input :border="true" disabled placeholder="" v-model="model.repairName" type="text"></u-input>
				</u-form-item>
				<u-form-item label="报修电话" :border-bottom="false">
					<u-input :border="true" disabled placeholder="" v-model="model.telephone" type="text"></u-input>
				</u-form-item>
				<u-form-item required label="问题说明" :border-bottom="false">
					<u-input height="88" type="textarea" :border="true" placeholder="请输入问题说明"
						v-model="model.question" />
				</u-form-item>
				<u-form-item label="上传图片" :border-bottom="false" label-position="top" label-align="left">
					<u-upload ref="uUpload" width="210" height="210" :auto-upload="false">
					</u-upload>
				</u-form-item>
			</u-form>
		</view>
		<view class="sws-w100 u-p-28">
			<u-button type="primary" @click="submit">确认报修</u-button>
		</view>
		<u-modal v-model="showModal" :content="modalContent" @confirm="modalConfirm"></u-modal>
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
					deviceCategory: '',
					deviceCode: '',
					lineName: '',
					repairName: '',
					telephone: '',
					question: '',
					photo: ''
				},
				fileList: [],
				showModal: false,
				modalContent: ''
			}
		},
		computed: mapState(['Authorization', 'factoryId']),
		onLoad() {
			this.getBaseUserInfo()
		},
		methods: {
			submit() {
				let checkArr = [{
					tips: '请输入或扫描设备编码',
					value: this.model.deviceCode
				}, {
					tips: '请输入正确的设备编码',
					value: this.model.deviceCategory
				}, {
					tips: '请输入问题说明',
					value: this.model.question
				}]
				if (this.common.checkNotNull(this, checkArr)) {
					this.postRepairData() //先数据上传，成功之后图片上传
				}
			},
			postRepairData() {
				let model = this.model
				const params = {
					"lineId": model.lineId,
					"deviceId": model.deviceId,
					"deviceCategoryId": model.deviceCategoryId,
					"telephone": model.telephone,
					"question": model.question
				}
				this.$u.api.postAddRepairForDips(params).then(res => {
					if (res.msgCode === '000000') {
						if (this.$refs.uUpload.lists.length) {  //如果有图片则上传图片
							this.uploadImg(res.data.id) //图片上传
						} else {
							this.modalContent = '报修成功'
							this.showModal = true
						}
					} else {
						this.$refs.uTips.show({
							title: `快速报修信息上传失败，原因：${res.message}`,
							type: 'error',
							duration: '2300'
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			async uploadImg(recordId) {
				const params = {
					query: this.$u.queryParams({
						module: 'cfr',
						recordId: recordId
					})
				}
				// #ifdef APP-PLUS
				let urls = this.$refs.uUpload.lists.map(item => item.url)
				params.urls = urls
				console.log('params:', params)
				let res = await this.$u.api.uploadMultiFiles(params) //递归调用多文件上传
				if (res.msgCode === '000000') {
					this.modalContent = '报修成功'
					this.showModal = true
				} else {
					this.$refs.uTips.show({
						title: `快速报修图片上传失败，原因：${ res.message }`,
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
						this.modalContent = '报修成功'
						this.showModal = true
					} else {
						this.$refs.uTips.show({
							title: `快速报修图片上传失败，原因：${ res.message }`,
							type: 'error',
							duration: '2300'
						})
					}
				})
				// #endif
			},
			getDeviceInfo() {
				if (!this.$u.trim(this.model.deviceCode)) {
					return
				}
				const params = {
					deviceCode: this.model.deviceCode
				}
				this.$u.api.getDeviceInfoForDips(params).then(res => {
					if (res.msgCode === '000000') {
						const data = res.data
						this.model.deviceId = data.id
						this.model.deviceCategory = data.deviceCategory
						this.model.deviceCategoryId = data.deviceCategoryId
						this.model.lineId = data.lineId
						this.model.lineName = data.lineName
					} else {
						this.$refs.uTips.show({
							title: `设备信息获取失败，原因：${ res.message }`,
							type: 'error',
							duration: '2300'
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			async scanCode() {
				// #ifdef APP-PLUS
				this.model.deviceCode = await this.common.scanCode()
				this.getDeviceInfo()
				// #endif
			},
			async getBaseUserInfo() { //获取登录人员基础信息
				let userBaseInfo = await this.baseData.getBaseUserInfo(this)
				if (Object.keys(userBaseInfo).length) {
					this.model.repairName = userBaseInfo.userName
					this.model.telephone = userBaseInfo.telephone
				} else {
					this.$refs.uTips.show({
						title: '报修人信息获取失败',
						type: 'error',
						duration: 2300
					})
					setTimeout(() => {
						uni.navigateBack()
					}, 3000)
				}
			},
			modalConfirm() {
				uni.navigateBack()
			},
			toQueryDeviceCode() {
				const _self = this
				uni.navigateTo({
					url: '/pages/microApp/Dips/fastRepair/queryDevice/index',
					events: {
						acceptDataFromOpenedPage(res) {
							_self.model.lineName = res.lineName
							_self.model.deviceCategory = res.deviceCategory
							_self.model.deviceCode = res.deviceCode
						}
					}
				})
			}
		}
	}
</script>

<style scoped lang="scss">

</style>
