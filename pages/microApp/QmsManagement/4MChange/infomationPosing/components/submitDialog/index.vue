<template>
	<view class='submitDialog'>
		<u-modal z-index='9999' :show-cancel-button='true' :title='scanCodeModalTitle' v-model="showscanCodeModal"
			@confirm="scanModeModalConfirm()">
			<view class='handleForm'>
				<u-form>
					<u-form-item required label="操作" :border-bottom="false">
						<u-radio-group v-model="handleForm.operate" @change="radioGroupChange">
							<u-radio @change="radioChange" v-for="(item, index) in list" :key="index" :name="item.name"
								:disabled="item.disabled">
								{{item.name}}
							</u-radio>
						</u-radio-group>
					</u-form-item>
					<u-form-item required label="处理意见" :border-bottom="false">
						<u-input :border="true" placeholder="请输入" v-model="handleForm.message" type="textarea">
						</u-input>
					</u-form-item>
				</u-form>

			</view>
		</u-modal>
	</view>

</template>

<script>
	export default {
		data() {
			return {
				handleForm: {
					operate: '',
					message: '',
					result: '',
					taskId: '',
				},
				scanCodeModalTitle: '提交',
				showscanCodeModal: false,
				list: [{
						name: '通过',
						disabled: false
					},
					{
						name: '驳回',
						disabled: false
					},
					// {
					// 	name: '转办',
					// 	disabled: false
					// }
				],
				// u-radio-group的v-model绑定的值如果设置为某个radio的name，就会被默认选中
				value: 'orange',
			};
		},
		methods: {
			// 选中某个单选框时，由radio时触发
			radioChange(e) {
				console.log(e);
				if (e === '通过') {
					this.handleForm.message = '同意'
				} else {
					this.handleForm.message = ''
				}
			},
			// 选中任一radio时，由radio-group触发
			radioGroupChange(e) {
				console.log('操作', this.handleForm.operate);
				if (e === '通过') {
					this.handleForm.message = '同意'
					this.handleForm.result = 'Y'
				} else {
					this.handleForm.message = ''
					this.handleForm.result = 'N'
				}
			},
			scanModeModalConfirm() { //弹窗确认
				// todo 调提交的接口
				this.$emit('submitForm', this.handleForm)

			}
		}
	};
</script>

<style lang="scss" scoped>
	.submitDialog {
		.handleForm {
			padding: 30rpx
		}

	}
</style>