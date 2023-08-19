<!-- DIPS → 备品备件 → 发放 -->
<template>
	<view class="sws-wh100">
		<view v-show="!showNoData" class="scroll-wrap sws-w100 u-p-20 sws-bg-ebebeb">
			<u-card margin="0 0 20rpx 0" :head-style="{background: '#2979ff',padding: '20rpx 30rpx'}"
				:body-style="{padding: 0}" :foot-style="{padding: '16rpx 30rpx'}" :border="false" :show-foot="true"
				:full="true" v-for="(material, index) in list" :key="index">
				<view slot="head">
					<view class="card-head u-font-32 u-flex">
						<view>{{ material.itemName }}</view>
						<view class="u-font-24">({{ material.itemCode }})</view>
					</view>
				</view>
				<u-cell-group slot="body" :border="false">
					<u-cell-item class="u-p-t-10 u-p-b-10" hover-class="none" :arrow="false" title="申请人"
						:value="material.applicantName">
					</u-cell-item>
					<u-cell-item class="u-p-t-10 u-p-b-10" hover-class="none" :arrow="false" title="申请数量"
						:value="material.applyNum + (material.unit ? material.unit : '')">
					</u-cell-item>
					<u-cell-item class="u-p-t-10 u-p-b-10" hover-class="none" :arrow="false" :border-bottom="false"
						title="申请时间" :value="material.applicantDate">
					</u-cell-item>
				</u-cell-group>
				<view slot="foot" class="u-text-right">
					<u-button class="btn-style" size="medium" type="error" @click="approveReject(material.id, index)">驳回
					</u-button>
					<u-button class="btn-style u-m-l-30" size="medium" type="warning"
						@click="toProvideConfirm(material, index)">发放
					</u-button>
				</view>
			</u-card>
			<u-loadmore :status="loadStatus" bgColor="#ebebeb"></u-loadmore>
		</view>
		<u-modal v-model="showReject" title="请输入驳回理由" :show-cancel-button="true" @confirm="rejectConfirm">
			<view slot="default" class="u-p-20">
				<u-input type="textarea" height="120" :auto-height="true" placeholder="请输入驳回理由" v-model="rejectReason">
				</u-input>
			</view>
		</u-modal>
		<u-modal v-model="showSequence" title="备件序列码" :show-cancel-button="true" @confirm="sequenceConfirm">
			<view slot="default" class="u-flex u-p-20">
				<u-input type="text" height="120" placeholder="请输入/扫描备件序列码" v-model="materialSequenceCode">
				</u-input>
				<u-icon name="scan" size="56" color="#2979ff" @click="scanCode"></u-icon>
			</view>
		</u-modal>
		<u-modal v-model="showModal" :content="modalContent" :show-cancel-button="showCancel" @confirm="modalConfirm">
		</u-modal>
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
				page: 1,
				limit: 10,
				list: [],
				curId: '',
				materialSequenceCode: '', //备件序列码
				rejectReason: '',
				showReject: false,
				showNoData: false,
				loadStatus: 'loadmore',
				modalContent: '',
				showCancel: false,
				showModal: false,
				showSequence: false //备件序列码填写弹框
			}
		},
		onLoad() {
			this.getMaterialProvideInfo()
		},
		methods: {
			toCheckProvide() {
				// 如果库存管理原则是先进先出后者后进先出，则需要进去批次管理页面,否则直接发放
				if (this.curMaterial.storePolicy && (this.curMaterial.storePolicy === 'FIFO' || this.curMaterial
						.storePolicy === 'LIFO')) {
					const _self = this
					const params = {
						applyId: this.curMaterial.id,
						storePolicy: this.curMaterial.storePolicy,
						applyNum: this.curMaterial.applyNum
					}
					uni.navigateTo({
						url: `/pages/microApp/Dips/spareParts/materialProvide/fifoAndLifo/index${ this.$u.queryParams(params) }`,
						events: {
							acceptDataFromOpenedPage(res) {
								_self.list.splice(_self.curIndex, 1) //删除这条记录
								if (!_self.list.length) _self.showNoData = true
							}
						}
					})
				} else {
					this.provideConfirm()
				}
			},
			sequenceConfirm() {
				const params = {
					id: this.curMaterial.id,
					materialSequenceCode: this.materialSequenceCode
				}
				this.$u.api.postMaterialSequence(params).then(res => {
					if (res.msgCode === '000000') {
						this.toCheckProvide()
					} else {
						this.$refs.uTips.show({
							title: `备件序列码提交失败，原因：${ res.message }`,
							type: 'error',
							duration: 2300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			modalConfirm() {
				if (this.modalContent.includes('是否确认物料发放')) {
					// 如果管控方式是个体,编辑备件序列码
					if (this.curMaterial.controlMode && this.curMaterial.controlMode === 'entity') {
						this.materialSequenceCode = this.curMaterial.materialSequenceCode
						this.showSequence = true
					} else {
						this.toCheckProvide() //根据库存管理原则  处理发放操作
					}
				}
			},
			toProvideConfirm(material, index) {
				this.curIndex = index //记录序号，用于成功之后删除该条记录
				this.curMaterial = material
				this.modalContent = '是否确认物料发放？'
				this.showCancel = true
				this.showModal = true
			},
			provideConfirm() {
				const params = {
					id: this.curMaterial.id,
					deliver: this.curMaterial.applyNum
				}
				this.$u.api.putProvide(params).then(res => {
					if (res.msgCode === '000000') {
						this.modalContent = '发放成功'
						this.showCancel = false
						this.showModal = true
						this.list.splice(this.curIndex, 1) //删除这条记录
						if (!this.list.length) this.showNoData = true
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
			approveReject(materialId, index) {
				this.rejectReason = ''
				this.curId = materialId
				this.curIndex = index
				this.showReject = true
			},
			rejectConfirm() {
				if (this.rejectReason.trim()) {
					const params = {
						id: this.curId,
						additional: this.rejectReason
					}
					this.$u.api.putApproveReject(params).then(res => {
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
				} else {
					this.$refs.uTips.show({
						title: '请输入驳回理由',
						type: 'warning',
						duration: 2300
					})
				}
			},
			getMaterialProvideInfo() {
				const data = {
					page: this.page,
					limit: this.limit
				}
				const params = {
					query: this.$u.queryParams(data),
					body: {}
				}
				this.$u.api.getMaterialProvideInfo(params).then(res => {
					if (res.msgCode === '000000') {
						this.list = [...this.list, ...res.data.data]
						this.page++

						if (!res.data.data.length || res.data.data.length < this.limit) this.loadStatus = "nomore"
						if (!this.list.length) {
							this.showNoData = true
						} else {
							this.showNoData = false
						}
					} else {
						this.$refs.uTips.show({
							title: `物料发放列表获取失败，原因：${ res.message }`,
							type: 'error',
							duration: 2300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			async scanCode() {
				// #ifdef APP-PLUS
				this.materialSequenceCode = await this.common.scanCode()
				// #endif
			}
		},
		onBackPress() {
			if (this.showReject) {
				this.showReject = false
				return true
			} else if (this.showSequence) {
				this.showSequence = false
				return true
			}
		},
		onPullDownRefresh() {
			this.loadStatus = 'loadmore'
			this.page = 1
			this.list = []
			this.getMaterialProvideInfo()
			uni.stopPullDownRefresh()
		},
		onReachBottom() {
			if (this.loadStatus != 'nomore') { //如果状态无无数据，则不再请求
				this.loadStatus = "loading"
				this.getMaterialProvideInfo()
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
		line-height: normal;
		padding: 0 16rpx;
		text-indent: 20rpx;
		letter-spacing: 20rpx;
	}
</style>
