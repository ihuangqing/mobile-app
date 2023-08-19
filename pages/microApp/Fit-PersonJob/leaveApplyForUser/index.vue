<template>
	<view class="sws-wh100 u-flex sws-flex-d-column">
		<view class="sws-w100 u-flex-1 u-p-t-28 u-p-r-28 u-p-l-28">
			<view class="apply-content sws-h100">
				<view class="user-info">
					<view class="u-flex">
						<view class="u-text-center">
							<u-avatar :src="userInfo.avatar" bg-color="#ffffff" :show-level="false" size="180">
							</u-avatar>
						</view>
						<view class="u-flex-1 u-p-l-40 sws-font-fff">
							<view class="u-font-36">{{ userInfo.userName }}</view>
							<view class="u-font-32 u-m-t-4">{{ userInfo.account }}</view>
							<view class="u-font-32 u-m-t-4">{{ model.deptName }}</view>
						</view>
					</view>
				</view>
				<view class="sws-w100">
					<u-cell-group title="申请信息" :border="false">
						<u-cell-item hover-class="none" :arrow="false" title="主管" :value="model.directorName">
							<u-icon slot="icon" class="u-m-r-20" name="zhuguan" custom-prefix="sws-icon" size="32">
							</u-icon>
						</u-cell-item>
						<u-cell-item hover-class="none" :arrow="false" title="班组长" :value="model.foremanName">
							<u-icon slot="icon" class="u-m-r-20" name="banzuzhang" custom-prefix="sws-icon" size="32">
							</u-icon>
						</u-cell-item>
						<u-cell-item required hover-class="none" :arrow="false" :border-bottom="false"
							arrow-direction="down" title="申请事由" :value="model.reason">
							<u-icon slot="icon" class="u-m-r-20" name="shenqingshiyou" custom-prefix="sws-icon"
								size="32">
							</u-icon>
						</u-cell-item>
						<u-radio-group class="sws-w100" icon-size="30" v-model="model.reason">
							<u-row class="sws-w100 u-p-l-8 u-p-r-8">
								<u-col span="4">
									<view class="info-layout">
										<u-radio shape="circle" name="上厕所">
											<u-icon name="weishengjian" custom-prefix="sws-icon" class="u-m-b-16"
												size="56" margin-top="-16" label="上厕所" label-pos="bottom"
												:color="model.reason === '上厕所' ? '#2979ff' : ''"
												:label-color="model.reason === '上厕所' ? '#2979ff' : ''"></u-icon>
										</u-radio>
									</view>
								</u-col>
								<u-col span="4">
									<view class="info-layout">
										<u-radio shape="circle" name="喝水">
											<u-icon name="heshui" custom-prefix="sws-icon" class="u-m-b-16" size="56"
												margin-top="-16" label="喝水" label-pos="bottom"
												:color="model.reason === '喝水' ? '#2979ff' : ''"
												:label-color="model.reason === '喝水' ? '#2979ff' : ''"></u-icon>
										</u-radio>
									</view>
								</u-col>
								<u-col span="4">
									<view class="info-layout">
										<u-radio shape="circle" name="个人私事">
											<u-icon name="chouyan" custom-prefix="sws-icon" class="u-m-b-16" size="56"
												margin-top="-16" label="个人私事" label-pos="bottom"
												:color="model.reason === '个人私事' ? '#2979ff' : ''"
												:label-color="model.reason === '个人私事' ? '#2979ff' : ''"></u-icon>
										</u-radio>
									</view>
								</u-col>
							</u-row>
						</u-radio-group>
					</u-cell-group>
				</view>
			</view>
		</view>
		<view class="check-confirm u-p-28">
			<u-button type="primary" class="sws-w100 sws-line-h-repair" @click="toApply">确认</u-button>
		</view>
		<u-modal v-model="showLimit" content="当前离岗申请人数已超出限制,是否继续申请!" :show-cancel-button="true" cancel-text="否"
			confirm-text="是" @confirm="leaveApply"></u-modal>
		<u-modal v-model="show" :content="content" @confirm="modalConfirm"></u-modal>
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
					reason: ''
				},
				content: '',
				show: false,
				showLimit: false
			}
		},
		computed: mapState(['userInfo', 'factoryId']),
		async onReady() {
			let dutyInfo = await this.baseData.getDutyInfo(this, this.userInfo.account)
			if (+dutyInfo.postState) { // postState 1 在岗状态
				this.model = {
					...this.model,
					...dutyInfo
				}
			} else {
				this.content = '您当前不是在岗状态，不能进行离岗申请！'
				this.show = true
			}
		},
		methods: {
			modalConfirm() {
				uni.navigateBack()
			},
			toApply() { //开始申请，先校验是否超限
				if (this.model.reason === '') {
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
					"applyReason": this.model.reason,
					"factoryId": this.factoryId,
					"account": this.userInfo.account,
					"isOver": this.showLimit ? 1 : 0, // 1超限  0未超限
				}

				this.$u.api.leaveApply(params).then(res => {
					if (res.msgCode === '000000') {
						this.content = '离岗申请成功！'
						this.show = true
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
		}
	}
</script>

<style lang="scss" scoped>
	.apply-content {
		border-radius: 20rpx;
		border: 2rpx solid #ebebeb;
		box-shadow: 0 0 2rpx rgba(0, 0, 0, .2);
		overflow: hidden;
	}

	.user-info {
		width: 100%;
		height: 260rpx;
		padding: 40rpx;
		background: linear-gradient(to right, #2979ff, #12d8fa);
	}

	.info-layout {
		height: 190rpx;
		background: #e5e9f2;
		border-radius: 16rpx;
		padding-top: 4rpx;
		align-items: center;
		justify-content: center;
		flex-direction: column;
	}

	.check-confirm {
		width: 100%;
		letter-spacing: 20rpx;
		text-indent: 20rpx;
	}

	::v-deep .info-layout .u-radio {
		display: flex !important;
		flex-direction: column-reverse !important;
	}

	::v-deep .info-layout .u-radio__label {
		width: 100% !important;
		margin: 0 !important;
		text-align: center !important;
	}
</style>
