<!-- Mes → pack拍照 -->
<template>
	<view class="sws-wh100 u-flex sws-flex-d-column">
		<view class="sws-w100 u-flex u-col-bottom" @click="toGetProjectList">
			<view class="project-bar u-p-l-30 u-p-r-60 u-font-30">
				<u-icon name="xialaxuanze" custom-prefix="sws-icon" size="34" color="#ffffff"></u-icon>
				<text class="u-m-l-12">{{ projectName ? projectName : '请选择项目' }}</text>
			</view>
			<view class="rhombus"></view>
			<view class="rhombus"></view>
			<view class="rhombus"></view>
		</view>
		<view class="sws-w100 u-flex-1 sws-overflow-scroll-y">
			<u-form class="sws-w100 u-flex-1 u-p-t-30 u-p-l-20 u-p-r-20 u-p-b-30" label-width="150" label-align="left">
				<u-form-item required label="PACK码" :border-bottom="false">
					<u-input :border="true" placeholder="请输入或扫描PACK码" v-model="packCode" type="text"
						@input="$u.debounce(checkPack, 3000)"></u-input>
					<u-icon slot="right" name="scan" size="56" color="#2979ff" @click="scanCode"></u-icon>
				</u-form-item>
				<u-form-item v-show="pictrueQty" required :label="pictrueQty ? `请选择 ${ pictrueQty } 张照片`: '请选择照片'"
					:border-bottom="false" label-position="top">
					<u-upload ref="uUpload" width="210" height="210" :auto-upload="false" :max-count="pictrueQty"
						:size-type="['compressed']" upload-text="FA MSD 整包">
					</u-upload>
				</u-form-item>
			</u-form>
		</view>
		<view class="sws-w100 btn-style u-p-28 u-flex u-row-between">
			<u-button type="default" class="sws-line-h-repair" size="medium" @click="reset">重置</u-button>
			<u-button type="primary" class="sws-line-h-repair" size="medium" @click="submit">确认</u-button>
		</view>
		<u-modal v-model="showModal" content="产品过站成功!" @confirm="modalConfirm"></u-modal>
		<u-select v-model="showSelect" mode="single-column" :list="selectList" @confirm="selectConfirm"></u-select>
		<u-top-tips ref="uTips"></u-top-tips>
		<mes-login v-show="!+mesSessionId"></mes-login>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	import mesLogin from '../../../components/mesLogin/index.vue'

	export default {
		components: {
			mesLogin
		},
		data() {
			return {
				projectName: '',
				pictrueQty: 0,
				packCode: '',
				projectCode: '',
				selectList: [],
				showSelect: false,
				showModal: false
			}
		},
		computed: mapState(['userInfo', 'mesSessionId']),
		methods: {
			toGetProjectList() {
				if (this.selectList.length) {
					this.showSelect = true
					return
				}

				this.getProjectList() //获取项目列表
			},
			postSaveProjectFiles() {
				const params = {
					mSn: this.packCode,
					mSnFilePath: this.path,
					projectCode: this.projectCode,
					mesSessionId: this.mesSessionId
				}
				this.$u.api.postSaveProjectFiles(params).then(res => {
					if (res.msgCode === '000000') {
						this.showModal = true
					} else {
						this.$refs.uTips.show({
							title: `信息上传失败，原因：${ res.message }`,
							type: 'error',
							duration: 3300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			async uploadImg() {
				this.path = this.packCode + new Date() .getTime()
				const params = {
					query: this.$u.queryParams({
						module: 'mesProGroupInfo',
						recordId: this.path,
						fileType: 'file'
					}),
					appName: 'mes-interface'
				}
				// #ifdef APP-PLUS
				let urls = this.$refs.uUpload.lists.map(item => item.url)
				params.urls = urls
				console.log('params:', params)
				let res = await this.$u.api.uploadMultiFiles(params) //递归调用多文件上传
				if (res.msgCode === '000000') {
					this.$refs.uTips.show({
						title: `图片上传成功！`,
						type: 'success',
						duration: '2300'
					})
					this.postSaveProjectFiles()
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
						this.$refs.uTips.show({
							title: `图片上传成功！`,
							type: 'success',
							duration: '2300'
						})
						this.postSaveProjectFiles()
					} else {
						this.$refs.uTips.show({
							title: `图片上传失败，原因：${ res.message }`,
							type: 'error',
							duration: '2300'
						})
					}
				})
				// #endif
			},
			
			getProjectList() {
				this.$u.api.getFindAllProjectRules().then(res => {
					if (res.msgCode === '000000' && res.data) {
						this.selectList = res.data.map(item => {
							return {
								label: item.projectName,
								value: item.imageNumber,
								extra: item.projectCode
							}
						})
						this.showSelect = true
					} else {
						this.$refs.uTips.show({
							title: `项目获取失败，原因：${ res.message }`,
							type: 'error',
							duration: 2300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			submit() {
				const arr = [{
					tips: '请选择项目',
					value: this.projectName.trim()
				}, {
					tips: '请输入或扫描PACK码',
					value: this.packCode
				}, {
					tips: `请选择${ this.pictrueQty }张FA、MSD、整包照片`,
					value: !Math.abs(this.$refs.uUpload.lists.length - this.pictrueQty)
				}]
				if (this.common.checkNotNull(this, arr)) {
					uni.showLoading({
						title: '照片上传中...'
					})
					this.uploadImg()
				}
			},
			reset() {
				this.projectName = ''
				this.pictrueQty = 0
				this.packCode = ''
				this.$refs.uUpload.clear()
			},
			modalConfirm() { //上传成功之后，清空条码和照片
				this.packCode = ''
				this.$refs.uUpload.clear()
			},
			selectConfirm(arr) {
				// 切换项目之后,清空条码和照片
				this.packCode = ''
				this.$refs.uUpload.clear()
				const temp = arr[0]
				this.projectName = temp.label
				this.pictrueQty = temp.value
				this.projectCode = temp.extra
			},
			checkPack() {
				if (!this.projectCode) {
					this.$refs.uTips.show({
						title: '请选择项目',
						type: 'warning',
						duration: 2300
					})
					this.packCode = ''
					return
				}
				if (this.packCode.substr(5, 2) != this.projectCode) {
					this.$refs.uTips.show({
						title: 'PACK码规则不匹配',
						type: 'warning',
						duration: 2300
					})
					this.packCode = ''
					return
				}
			},
			async scanCode() {
				if (!this.projectCode) {
					this.$refs.uTips.show({
						title: '请选择项目',
						type: 'warning',
						duration: 2300
					})
					return
				}
				// 扫码之前清空当前条码和照片
				this.packCode = ''
				this.$refs.uUpload.clear()
				// #ifdef APP-PLUS
				let code = await this.common.scanCode()
				this.packCode = code
				this.checkPack()
				// #endif
			}
		},
		onBackPress() {
			if (this.showSelect) {
				this.showSelect = false
				return true
			}
		}
	}
</script>

<style lang="scss" scoped>
	.project-bar {
		height: 80rpx;
		line-height: 80rpx;
		width: 70%;
		background: linear-gradient(-135deg, transparent 60rpx, #2979ff 0); //矩形切角
		color: #ffffff;
	}

	.rhombus {
		//矩形倾斜
		width: 20rpx;
		height: 80rpx;
		transform: skew(45deg, 0deg);
		background: #2979ff;
		margin-right: 38rpx;
	}

	.btn-style {
		letter-spacing: 20rpx;
		text-indent: 20rpx;
	}

	::v-deep .u-add-btn .u-iconfont {
		font-size: 60rpx !important;
		color: $u-type-primary;
	}

	::v-deep .u-add-tips {
		color: $u-type-primary;
	}
</style>
