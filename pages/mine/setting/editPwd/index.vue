<template>
	<view class="page-wrap">
		<u-form :model="form" ref="uForm">
			<u-form-item label-width="150" label="账号">
				<u-input v-model="form.account" type="text" disabled></u-input>
			</u-form-item>
			<u-form-item label="旧密码" label-width="150" prop="oldPassword">
				<u-input :password-icon="true" type="password" v-model="form.oldPassword" placeholder="请输入旧密码">
				</u-input>
			</u-form-item>
			<u-form-item label="新密码" label-width="150" prop="newPassword">
				<u-input :password-icon="true" type="password" v-model="form.newPassword" placeholder="请输入新密码">
				</u-input>
			</u-form-item>
			<u-form-item label="确认密码" label-width="150" prop="againPassword">
				<u-input :border="false" type="password" v-model="form.againPassword" placeholder="请输入确认密码"></u-input>
			</u-form-item>
		</u-form>
		<view class="check-confirm">
			<u-button type="primary" @click="submit">确认</u-button>
		</view>
		<u-top-tips ref="uTips"></u-top-tips>
		<u-modal v-model="show" :content="content" @confirm="confirm"></u-modal>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	export default {
		data() {
			return {
				form: {
					account: '',
					oldPassword: '',
					newPassword: '',
					againPassword: '',
					password: ''
				},
				rules: {
					newPassword: [{
						// 正则不能含有两边的引号
						pattern: /^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[^a-zA-Z0-9]).{8,20}$/,
						message: '字母（大写+小写）、数字、特殊字符（~!@#$%^&*.?|-_=+）组合，请输入8-20位',
						trigger: ['change', 'blur'],
					}],
					againPassword: [{
						validator: (rule, value, callback) => {
							return value === this.form.newPassword
						},
						message: '新密码和确认密码不一致',
						trigger: ['change', 'blur'],
					}]
				},
				editFuncName: 'editPwd',
				show: false,
				content: '密码修改成功,请重新登录'
			}
		},
		computed: mapState(['userInfo']),
		onLoad(options) {
			if (options && Object.keys(options).length) { //未登录状态的修改密码，首次登录的密码修改或者密码超期修改
				this.form.account = options.account
				this.form.oldPassword = options.oldPassword
				this.editFuncName = 'firstLoginEditPwd'
			} else {
				this.form.account = this.userInfo.account
				this.editFuncName = 'editPwd'
			}
		},
		onReady() {
			this.$refs.uForm.setRules(this.rules);
		},
		methods: {
			submit() {
				let old = encodeURIComponent(this.form.oldPassword)
				let pwd = encodeURIComponent(this.form.newPassword)
				let againPwd = encodeURIComponent(this.form.againPassword)
				if (!old || !pwd || !againPwd) {
					this.$refs.uTips.show({
						title: '请输入密码',
						type: 'warning',
						duration: '2000'
					})
				} else if (pwd !== againPwd) {
					this.$refs.uTips.show({
						title: '新密码和确认密码不一致!',
						type: 'warning',
						duration: '2500'
					})
				} else {
					if (/^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[^a-zA-Z0-9]).{8,20}$/.test(pwd) &&
						/^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[^a-zA-Z0-9]).{8,20}$/.test(againPwd)) { //校验密码合法性	
						this.editPwd()
					} else {
						this.$refs.uTips.show({
							title: '密码必须由数字、字母、特殊字符组合,请输入8-20位',
							type: 'warning',
							duration: '2000'
						})
					}
				}
			},
			editPwd() {
				this.form.password = this.form.newPassword //兼容两个修改密码的接口
				const params = {
					account: this.form.account,
					password: encodeURIComponent(this.form.newPassword),
					oldPassword: encodeURIComponent(this.form.oldPassword),
					newPassword: encodeURIComponent(this.form.newPassword),
					againPassword: encodeURIComponent(this.form.againPassword)
				}
				console.log('params: ', params)
				this.$u.api[this.editFuncName](params).then(res => {
					if (res.msgCode === '000000') {
						this.show = true
					} else {
						this.$refs.uTips.show({
							title: `密码修改失败,原因:${res.message}`,
							type: 'error',
							duration: 2300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			confirm() {
				uni.reLaunch({ //修改成功之后跳转至登录页面
					url: '/pages/login/index'
				})
			}
		}
	};
</script>

<style scoped lang="scss">
	.page-wrap {
		display: flex;
		flex-direction: column;
		height: 100%;
		padding: 30rpx;

		.u-form {
			flex: 1;
		}

		.check-confirm {
			width: 100%;
			letter-spacing: 20rpx;
			text-indent: 20rpx;
		}
	}
</style>
