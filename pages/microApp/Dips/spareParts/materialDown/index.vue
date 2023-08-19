<!-- DIPS → 备品备件 → 下机 -->
<template>
	<view class="sws-wh100">
		<view class="material-search sws-w100 u-p-20">
			<u-search placeholder="请输入物料编码或位置码" shape="square" v-model="keyword" @search="fuzzyQuery"
				@custom="fuzzyQuery">
			</u-search>
		</view>
		<view v-show="!showNoData" class="scroll-wrap sws-w100 sws-bg-ebebeb">
			<view class="u-p-20">
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
						<u-cell-item class="u-p-t-10 u-p-b-10" hover-class="none" :arrow="false" title="部件编码"
							:value="material.unitCode">
						</u-cell-item>
						<u-cell-item class="u-p-t-10 u-p-b-10" hover-class="none" :arrow="false" title="位置码"
							:value="material.materialLocationCode">
						</u-cell-item>
						<u-cell-item v-show="material.materialSequenceCode" class="u-p-t-10 u-p-b-10" hover-class="none"
							:arrow="false" :border-bottom="false" title="序列码" :value="material.materialSequenceCode">
						</u-cell-item>
					</u-cell-group>
					<view slot="foot" class="u-text-right">
						<u-button :class="material.updownFlag === 2? 'btn-style': 'btn-style btn-style-new'"
							size="medium" :type="material.updownFlag === 2 ? 'warning': 'success'"
							@click="toDownConfirm(material, index)">
							{{ material.updownFlag === 2 ? '撤销下机': '下机'}}
						</u-button>
					</view>
				</u-card>
				<u-loadmore :status="loadStatus" bgColor="#ebebeb"></u-loadmore>
			</view>
		</view>
		<u-modal v-model="showRemark" title="请输入备注" :show-cancel-button="true" @confirm="remarkConfirm">
			<view slot="default" class="u-p-20">
				<u-input type="textarea" height="120" :auto-height="true" placeholder="请输入备注" v-model="remark">
				</u-input>
			</view>
		</u-modal>
		<u-modal v-model="showModal" :content="modalContent">
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
				keyword: '',
				page: 1,
				limit: 10,
				remark: '',
				list: [],
				loadStatus: 'loadmore',
				modalContent: '',
				showModal: false,
				showNoData: false,
				showRemark: false,
			}
		},
		onLoad() {
			this.getMaterialDownList()
		},
		methods: {
			remarkConfirm() {
				if (this.curMaterial.updownFlag === 1) {
					this.downConfirm()
				} else if (this.curMaterial.updownFlag === 2) {
					this.cancelDownConfirm()
				}
			},
			toDownConfirm(material, index) {
				this.curIndex = index
				this.curMaterial = material
				this.showRemark = true
			},
			downConfirm() { //下机
				const params = {
					...this.curMaterial,
					remark: this.remark
				}
				this.$u.api.postMaterialDown(params).then(res => {
					if (res.msgCode === '000000') {
						// 下机成功,修改状态
						this.curMaterial.updownFlag = 2
						this.modalContent = '下机成功！'
						this.showModal = true
					} else {
						this.$refs.uTips.show({
							title: `下机失败，原因：${ res.message }`,
							type: 'error',
							duration: 2300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			cancelDownConfirm() { //撤销下机
				const params = {
					...this.curMaterial,
					remark: this.remark
				}
				this.$u.api.postMaterialCancelDown(params).then(res => {
					if (res.msgCode === '000000') {
						// 下机成功,修改状态
						this.curMaterial.updownFlag = 1
						this.modalContent = '撤销下机成功！'
						this.showModal = true
					} else {
						this.$refs.uTips.show({
							title: `撤销下机失败，原因：${ res.message }`,
							type: 'error',
							duration: 2300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			getMaterialDownList(mixCode) {
				let params = {
					query: {
						page: this.page,
						limit: this.limit
					}
				}

				if (mixCode) {
					params.body = {
						mixCode
					}
				}

				this.$u.api.getMaterialDownList(params).then(res => {
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
							title: `备件上机列表获取失败，原因：${ res.message }`,
							type: 'error',
							duration: 2300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			fuzzyQuery() {
				this.page = 1
				this.list = []
				this.loadStatus = 'loadmore'
				this.getMaterialDownList(this.keyword)
			},
			async scanCode() {
				// #ifdef APP-PLUS
				this.keyword = await this.common.scanCode()
				this.fuzzyQuery(this.keyword)
				// #endif
			}
		},
		onBackPress() {
			if (this.showRemark) {
				this.showRemark = false
				return true
			}
		},
		onPullDownRefresh() {
			this.loadStatus = 'loadmore'
			this.page = 1
			this.list = []
			this.getMaterialDownList()
			uni.stopPullDownRefresh()
		},
		onReachBottom() {
			if (this.loadStatus != 'nomore') { //如果状态无无数据，则不再请求
				this.loadStatus = "loading"
				this.getMaterialDownList()
			}
		},
		onNavigationBarButtonTap() {
			this.scanCode()
		}
	}
</script>

<style lang="scss" scoped>
	.material-search {
		position: fixed;
		z-index: 3;
		background-color: #ffffff;
	}

	.page-wrap {
		background-color: #ebebeb;
	}

	.scroll-wrap {
		min-height: 100%;
		padding-top: 104rpx !important;
	}


	.card-head {
		color: #ffffff;
	}

	.btn-style {
		height: 60rpx;
		line-height: normal;
		padding: 0 28rpx;
	}

	.btn-style-new {
		text-indent: 20rpx;
		letter-spacing: 20rpx;
	}
</style>
