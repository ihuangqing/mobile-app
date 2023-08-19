<!-- 4M批准 -->
<template>
	<view class="sws-wh100 sws-bg-ffffff">
		<view class="sws-w100  u-p-l-20 u-p-r-20 u-p-b-30 sws-overflow-scroll-y ">
			<u-form class="sws-w100" :model="model" label-width="150" label-align="center">
				<u-form-item required label="是否解除" :border-bottom="false">
					<u-input :border="true" placeholder="是否解除" v-model="model.isRelease" disabled>
					</u-input>
				</u-form-item>
				<u-form-item required label="解除时间" :border-bottom="false" prop="releaseDate">
					<u-input :border="true" disabled placeholder="解除时间" v-model="model.releaseDate">
					</u-input>
					<!-- <u-icon v-if='formKey==1' slot="right" name="calendar" size="28" @click="showDatePicker = true">
					</u-icon> -->
				</u-form-item>
				<u-form-item required label="附件上传" :border-bottom="false" v-if='imgList.length'>
					<u-upload :disabled='imgList.length' v-show="!showImage" ref="uUpload" width="210" height="210"
						:auto-upload="false">
					</u-upload>
					<u-image v-show="showImage" v-for='item in imgList' :key='item.src' width="100%" height="300rpx"
						:src="item.src" class='u-p-20' @load="showImage = true"></u-image>
				</u-form-item>
			</u-form>
		</view>
		<u-picker :params="timeParams" mode="time" title="发现日期" @confirm="timeConfirm">
		</u-picker>
	</view>
</template>

<script>
	export default {
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

				timeParams: {
					year: true,
					month: true,
					day: true,
					hour: true,
					minute: true,
					second: false
				},
				model: {
					isRelease: '是',
					releaseDate: '',
				},
				modalContent: '',
				showModal: false,
				selectTitle: '',
				selectList: [],
				showSelect: false,
				showDatePicker: false
			}
		},
		onReady() {
			let currentTime = this.getTime()
			this.model.releaseDate = currentTime
		},
		methods: {
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
			renderData(result) {
				if (!result.id) return
				let currentTime = this.getTime()
				this.model.releaseDate = currentTime
				// approveInfo
				if (result.businessKey) {
					this.fourMApprovalImg(result.businessKey)
				}
			},
			fourMApprovalImg(matId) {
				const params = {
					module: 'approveInfo',
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


			cancel() {}, //取消
			submit() { //提交
				// this.$refs.submitDialogRef.showscanCodeModal = true
			},
			toShowIsComplete(type) {}, //选择是否完成
			selectConfirm(arr) {}, //选择--确认	
			toShowUsers(flag, index) {}, //处理人			


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