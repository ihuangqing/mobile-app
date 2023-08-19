<!-- 人岗匹配 → 离岗申请 -->
<template>
	<view class="page-wrap">
		<view class="input">
			<u-cell-group :border="false">
				<u-cell-item hover-class="none" :arrow="false" title="主管" :value="director">
					<u-icon slot="icon" class="u-m-r-20" name="zhuguan" custom-prefix="sws-icon" size="32"></u-icon>
				</u-cell-item>
				<u-cell-item hover-class="none" :arrow="false" title="班组长" :value="foreman">
					<u-icon slot="icon" class="u-m-r-20" name="banzuzhang" custom-prefix="sws-icon" size="32"></u-icon>
				</u-cell-item>
				<u-cell-item hover-class="none" title="申请人" :arrow="false" :value="applicant">
					<u-icon slot="icon" class="u-m-r-20" name="shenqingren" custom-prefix="sws-icon" size="32"></u-icon>
				</u-cell-item>
				<u-cell-item required hover-class="none" arrow-direction="down" title="申请事由" :value="reason"
					@click="show = true">
					<u-icon slot="icon" class="u-m-r-20" name="shenqingshiyou" custom-prefix="sws-icon" size="32">
					</u-icon>
				</u-cell-item>
			</u-cell-group>
		</view>
		<view class="check-confirm u-p-28">
			<u-button type="primary" @click="toApply">确认</u-button>
		</view>
		<u-select v-model="show" :list="list" title="请选择申请事由" @confirm="confirm"></u-select>
		<u-modal v-model="showModal" :content="content" @confirm="leaveSuc"></u-modal>
		<u-modal v-model="showLimit" content="当前离岗申请人数已超出限制,是否继续申请!" :show-cancel-button="true" cancel-text="否"
			confirm-text="是" @confirm="leaveApply"></u-modal>
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
				foreman: '', //班组长
				director: '', //主管
				applicant: '', //申请人
				show: false, // 选择框显示状态
				reason: '请选择申请事由', //申请理由
				list: [{
					label: '上厕所'
				}, {
					label: '喝水'
				}, {
					label: '个人私事'
				}], //申请理由列表
				showModal: false,
				content: '',
				showLimit: false
			}
		},
		computed: mapState(['factoryId', 'userInfo']), //获取在岗信息
		async onReady() {
			let dutyInfo = await this.baseData.getDutyInfo(this, this.userInfo.account)
			if (Number(dutyInfo.postState)) { // postState 1 在岗状态
				this.applicant = dutyInfo.userName
				this.foreman = dutyInfo.foremanName
				this.director = dutyInfo.directorName
			} else {
				this.content = '您当前不是在岗状态，不能进行离岗申请！'
				this.showModal = true
			}
		},
		methods: {
			confirm(res) {
				this.reason = res[0].label
			},
			leaveSuc() {
				uni.navigateBack()
			},
			toApply() { //开始申请，先校验是否超限
				if (this.reason === '请选择申请事由') {
					this.$refs.uTips.show({
						title: '请选择申请事由',
						type: 'warning',
						duration: '2300'
					})
					return
				}

				this.$u.api.toCheckLimit(this.userInfo.account).then(res => {
					if (res.msgCode === '000000') {
						if (res.data) { //true超限  false未超限
							this.showLimit = true
						} else {
							this.leaveApply()
						}
					} else {
						this.$refs.uTips.show({
							title: `离岗申请失败，原因：${ res.message }`,
							type: 'error',
							duration: '2300'
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			leaveApply() {
				let params = {
					"applyReason": this.reason,
					"factoryId": this.factoryId,
					"account": this.userInfo.account,
					"isOver": this.showLimit ? 1 : 0, // 1超限  0未超限
				}

				this.$u.api.leaveApply(params).then(res => {
					if (res.msgCode === '000000') {
						this.content = '离岗申请成功！'
						this.showModal = true
					} else {
						this.$refs.uTips.show({
							title: `离岗申请失败，原因：${ res.message }`,
							type: 'error',
							duration: '2300'
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			}
		},
		onBackPress() {
			if (this.show) {
				this.show = false
				return true
			} else if (this.showLimit) {
				this.showLimit = false
				return true
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page-wrap {
		position: relative;
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;

		.input {
			flex: 1;

			.input-form {
				border: 1px solid #efefef;
				margin: 0 20rpx;
				padding: 0 20rpx;
			}
		}

		.check-confirm {
			width: 100%;
			letter-spacing: 20rpx;
			text-indent: 20rpx;
		}
	}
</style>
