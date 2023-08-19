<!-- 标识判定 -->
<template>
	<view class="sws-wh100 sws-bg-ffffff">
		<view class="sws-w100  u-p-l-20 u-p-r-20 u-p-b-30 sws-overflow-scroll-y ">
			<u-form class="sws-w100" :model="model" label-width="150" label-align="center">
				<u-form-item required label="是否标识" :border-bottom="false">
					<u-input :border="true" placeholder="请选择是否标识" v-model="model.isTag" disabled>
					</u-input>
				</u-form-item>
				<u-form-item label="标识内容" :border-bottom="false">
					<u-input :border="true" placeholder="请输入" v-model="model.tagContent" disabled type="textarea">
					</u-input>
				</u-form-item>
				<u-form-item required label="附件上传" :border-bottom="false">
					<u-upload ref="uUpload" width="210" height="210" :auto-upload="false">
					</u-upload>
				</u-form-item>
			</u-form>
			<!-- <view class="btn-style sws-w100 u-p-t-20 u-flex">
				<u-button type="success" class="u-flex-1 u-m-r-20" @click="cancel('manual')">取消</u-button>
				<u-button type="primary" class="u-flex-1 u-m-l-20" @click="submit">提交</u-button>
			</view>
 -->
		</view>

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
				model: {
					isTag: '',
					fourChangeId: this.propData.id || null,
					tagDesc: '', //标识描述
					isComplete: '是', //是否完成
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
				showDatePicker: false
			}
		},
		methods: {
			renderData(result) {
				console.log('标识判定', result)
				if (!result.id) return
				if (result.qualityConfirmPo) {
					this.model.isTag = result.qualityConfirmPo.isTag ? (result.qualityConfirmPo.isTag == 'Y' ? '是' : '否') :
						''
					this.model.tagContent = result.qualityConfirmPo.tagContent
				}
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