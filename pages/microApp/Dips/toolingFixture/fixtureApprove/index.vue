<!-- DIPS → 工治具管理 → 发放确认 -->
<template>
	<view class="sws-wh100">
		<view v-show="!showNoData" class="scroll-wrap sws-w100 u-p-20 sws-bg-ebebeb">
			<u-card margin="0 0 20rpx 0" :head-style="{background: '#2979ff',padding: '20rpx 30rpx'}"
				:body-style="{padding: 0}" :foot-style="{padding: '16rpx 30rpx'}" :border="false" :show-foot="true"
				:full="true" v-for="(fixture, index) in list" :key="index">
				<view slot="head">
					<view class="card-head u-font-32 u-flex">
						<view>{{ fixture.fixtureName }}</view>
						<view class="u-font-24">({{ fixture.fixtureCode }})</view>
					</view>
				</view>
				<u-cell-group slot="body" :border="false">
					<u-cell-item class="u-p-t-10 u-p-b-10" hover-class="none" :arrow="false" title="领用人"
						:value="fixture.recipientsName">
					</u-cell-item>
					<u-cell-item class="u-p-t-10 u-p-b-10" hover-class="none" :arrow="false" title="库存数量"
						:value="fixture.qty">
					</u-cell-item>
					<u-cell-item class="u-p-t-10 u-p-b-10" hover-class="none" :arrow="false" title="领用时间"
						:value="fixture.recipientsDate">
					</u-cell-item>
					<u-cell-item class="u-p-t-10 u-p-b-10" hover-class="none" :arrow="false" :border-bottom="false"
						title="用途" :value="fixture.usage">
					</u-cell-item>
				</u-cell-group>
				<view slot="foot" class="u-text-right">
					<u-button class="btn-style" size="medium" type="error" @click="approveReject(fixture.id, index)">驳回
					</u-button>
					<u-button class="btn-style u-m-l-30" size="medium" type="success"
						@click="approveConfirm(fixture.id, index)">发放
					</u-button>
				</view>
			</u-card>
		</view>
		<u-modal v-model="showModal" :content="modalContent"></u-modal>
		<no-data v-show="showNoData"></no-data>
		<u-top-tips ref="uTips"></u-top-tips>
	</view>
</template>

<script>
	import noData from '../../../../components/noData/index'

	export default {
		components: {
			noData
		},
		data() {
			return {
				list: [],
				showNoData: false,
				modalContent: '',
				showModal: false
			}
		},
		onLoad() {
			this.getFixtureApproveList()
		},
		methods: {
			approveReject(fixtureId, index) {
				this.curIndex = index //记录序号，用于成功之后删除该条记录
				this.$u.api.postFixtureReject(fixtureId).then(res => {
					if (res.msgCode === '000000') {
						this.modalContent = '驳回成功'
						this.showModal = true
						this.list.splice(this.curIndex, 1) //删除这条记录
					} else {
						this.$refs.uTips.show({
							title: `驳回失败，原因：${ res.message }`,
							type: 'error',
							duration: 2300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			approveConfirm(fixtureId, index) {
				this.curIndex = index //记录序号，用于成功之后删除该条记录
				this.$u.api.postFixtureApprove(fixtureId).then(res => {
					if (res.msgCode === '000000') {
						this.modalContent = '发放成功'
						this.showModal = true
						this.list.splice(this.curIndex, 1) //删除这条记录
					} else {
						this.$refs.uTips.show({
							title: `发放失败，原因：${ res.message }`,
							type: 'error',
							duration: 2300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			getFixtureApproveList() {
				this.$u.api.getFixtureApproveList().then(res => {
					if (res.msgCode === '000000') {
						this.list = res.data
						if (!this.list.length) this.showNoData = true
					} else {
						this.$refs.uTips.show({
							title: `工治具发放列表获取失败，原因：${ res.message }`,
							type: 'error',
							duration: 2300
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
	.page-wrap {
		background-color: #ebebeb;
	}
	
	.scroll-wrap {
		min-height: 100%;
	}

	.card-head {
		color: #ffffff;
	}

	.btn-style {
		height: 60rpx;
		line-height: 60rpx;
		padding: 0 16rpx;
		text-indent: 20rpx;
		letter-spacing: 20rpx;
	}
</style>
