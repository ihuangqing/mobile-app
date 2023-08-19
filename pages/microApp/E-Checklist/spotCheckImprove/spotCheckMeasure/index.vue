<template>
	<view class="sws-wh100 u-flex sws-flex-d-column">
		<view class="sws-w100 sws-overflow-scroll-y u-flex-1 u-p-l-20 u-p-r-20 u-p-b-30" style="padding: 20rpx">
			<u-form ref="uForm" :model="model" label-width="auto" label-align="center">
				<u-form-item required label="改善措施" :border-bottom="false">
					<u-input height="280" type="textarea" :border="true" placeholder="请输入改善措施,最多500字"
						v-model="model.purpose" />
				</u-form-item>
				<u-form-item required label="改善证据" :border-bottom="false">
					<!-- <u-form-item class="u-p-0" label="上传图片" :border-bottom="false" label-position="top"
						label-align="left"> -->
					<u-upload ref="uUpload" width="150" height="160" :auto-upload="false"></u-upload>
					<!-- </u-form-item> -->
				</u-form-item>

			</u-form>
		</view>
		<view class="btn-group sws-w100 u-flex u-row-between u-p-t-28 u-p-b-28">
			<u-button type="default" class="sws-line-h-repair" size="medium" @click="reset">取消</u-button>
			<u-button type="primary" class="sws-line-h-repair" size="medium" @click="commit">提交</u-button>
		</view>


		<u-top-tips ref="uTips"></u-top-tips>
	<!-- 	<u-modal v-model="show" title="提示" :content="content" @confirm="confirm"></u-modal> -->
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
					itemCode: '',
					applyNum: '',
					purpose: '',
				},
				idData: '',
				showModal: false,
				content: "",
				show: false,
				fileList: [],
				modalContent: ''
			}
		},
		computed: mapState(['Authorization', 'factoryId']),
		onLoad: function() {
			let _self = this
			// 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
			this.getOpenerEventChannel().on('ddd', function(res) {

				let pdata = res.data

				_self.getlistData(pdata)
			})
		},
		methods: {

			commit() {

				if (this.$refs.uUpload.lists.length) {
					let params = {
						id: this.idData.id,
						improveDesc: this.model.purpose
					}

					// console.log(this.idData, '123456')

					console.log(this.$refs.uUpload, '$refs.uUpload')
					this.$u.api.setsaveImproveMsg(params).then(res => {

						if (res.msgCode === '000000' && res.data) {
							if (this.$refs.uUpload.lists.length) {
								this.uploadImg()
							}
							this.content = '点检确认成功'
							this.show = true
							this.confirm()
						} else {
							this.$refs.uTips.show({
								title: `改善测试上传失败，原因：${ res.message }`,
								type: 'error',
								duration: 2300
							})
						}
					}).catch(err => {
						this.common.sysErrToast(this, err)
					})
				} else {
					this.$refs.uTips.show({
						title: `请上传改善图片`,
						type: 'error',
						duration: 2300
					})
				}




			},


			getlistData(pdata) {
				this.idData = pdata
			},


			async uploadImg(recordId) {
				const params = {
					query: this.$u.queryParams({
						module: 'improve',
						recordId: this.idData.id,
						fileType: 'image',
					}),
					appName: 'sws',
				}
				// #ifdef APP-PLUS
				let urls = this.$refs.uUpload.lists.map(item => item.url)
				params.urls = urls

				let res = await this.$u.api.uploadMultiFiles(params) //递归调用多文件上传
				if (res.msgCode === '000000') {
					this.modalContent = '图片成功'
					this.showModal = true
				} else {
					this.$refs.uTips.show({
						title: `图片上传失败，原因：${ data.message }`,
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
						this.modalContent = '图片上传成功'
						this.showModal = true
					} else {
						this.$refs.uTips.show({
							title: `图片上传失败，原因：${ data.message }`,
							type: 'error',
							duration: '2300'
						})
					}
				})
				// #endif
			},

			confirm() {
				let _this = this
				// console.log(_this,'111111111')
				const id = _this.idData.id
				const eventChannel = this.getOpenerEventChannel()
				eventChannel.emit('acceptDataFromOpenedPage', {
					data: id,
				})
				uni.navigateBack()
				
			


			},

			reset() {
				var _this = this
				this.model = {
					purpose: '',
					applyNum: '',
					positionId: '',
					positionName: '',

				}
				uni.navigateBack()
			

			}



		}
	}
</script>

<style scoped lang="scss">

</style>
