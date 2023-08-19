<!-- DIPS → 备品备件 → 上机 -->
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
						<u-button class="btn-style u-m-l-30" size="medium" type="success"
							@click="toUpConfirm(material, index)">上机
						</u-button>
					</view>
				</u-card>
				<u-loadmore :status="loadStatus" bgColor="#ebebeb"></u-loadmore>
			</view>
		</view>
		<u-modal v-model="showSequenceEdit" title="上机" :show-cancel-button="true" @confirm="sequenceConfirm">
			<view slot="default" class="u-p-20">
				<u-form ref="uForm" :model="model" label-width="150" label-align="center">
					<u-form-item label="设计寿命" :border-bottom="false">
						<u-input :border="true" disabled placeholder="请输入设计寿命" v-model="model.designLife" type="text">
						</u-input>
					</u-form-item>
					<u-form-item label="累计寿命" :border-bottom="false">
						<u-input :border="true" disabled placeholder="请输入累计寿命" v-model="model.culumateUseLife"
							type="text">
						</u-input>
					</u-form-item>
					<u-form-item label="剩余寿命" :border-bottom="false">
						<u-input :border="true" placeholder="请输入剩余寿命" v-model="model.remainUseLife" type="text">
						</u-input>
					</u-form-item>
				</u-form>
			</view>
		</u-modal>
		<u-modal v-model="showRemark" title="上机确认" :show-cancel-button="true" @confirm="remarkConfirm">
			<view slot="default" class="u-p-20">
				<view class="u-flex u-border-bottom" v-show="showSequenceCode">
					<u-input type="text" height="120" placeholder="请输入/扫描备件序列码" v-model="materialSequenceCode">
					</u-input>
					<u-icon name="scan" size="56" color="#2979ff" @click="scanCode"></u-icon>
				</view>
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
				model: {
					designLife: '', //设计寿命
					culumateUseLife: '', //累计寿命
					remainUseLife: '' //剩余寿命
				},
				showSequenceCode: false, //状态为已下机时，显示备件序列码
				materialSequenceCode: '',
				list: [],
				remainUseLife: '', //剩余寿命
				remark: '', // 备注
				loadStatus: 'loadmore',
				modalContent: '',
				showModal: false,
				showNoData: false,
				showSequenceEdit: false, //剩余寿命编辑
				showRemark: false,
			}
		},
		onLoad() {
			this.getMaterialUpList()
		},
		methods: {
			sequenceConfirm() {
				this.remainUseLife = this.model.remainUseLife
				this.upConfirm()
			},
			getMaterialLifeInfo() {
				const params = {
					matId: this.curMaterial.materialsId,
					locationCode: this.curMaterial.materialLocationCode
				}
				this.$u.api.getMaterialLifeInfo(params).then(res => {
					if (res.msgCode === '000000' && res.data) {
						const temp = res.data
						this.model = {
							designLife: temp.designLife,
							culumateUseLife: temp.culumateUseLife,
							remainUseLife: temp.remainUseLife,
						}
						/* 显示序列码的设计寿命(从备件台账带出设计寿命、不可编辑)、累计使用(从设备BOM带出累计使用、不可编辑)、剩余寿命(从设备BOM带出累计使用、可编辑) ，保存时获取页面显示的剩余寿命，判断如果修改过剩余寿命则累计使用变为0，设计寿命=新的剩余寿命 */
						if (this.curMaterial.materialSequenceCode) { //如果有序列码，则可编辑剩余寿命
							this.showSequenceEdit = true
						} else { // 没有序列码则累计使用为0，设计寿命从从备件台账带出，剩余寿命=设计寿命
							this.remainUseLife = temp.designLife
							this.upConfirm()
						}
					} else {
						this.$refs.uTips.show({
							title: `设计寿命获取失败，原因：${ res.message }`,
							type: 'error',
							duration: 2300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			remarkConfirm() {
				if (this.curMaterial.updownFlag === 2 && this.curMaterial.materialSequenceCode) {
					if (!this.materialSequenceCode) {
						this.$refs.uTips.show({
							title: '请输入/扫描备件序列码',
							type: 'warning',
							duration: 2300
						})
						return
					}
				}
				this.getMaterialLifeInfo() //获取剩余寿命
			},
			toUpConfirm(material, index) {
				this.curMaterial = material
				this.curIndex = index
				this.materialSequenceCode = '' //清空备件序列码
				this.showSequenceCode = false
				// 本来有序列码且状态为2的时候,需要展示序列码的修改框
				if (this.curMaterial.updownFlag === 2 && this.curMaterial.materialSequenceCode) {
					this.showSequenceCode = true
				}
				this.remark = ''
				this.showRemark = true
			},
			upConfirm() { //上机
				let params = {
					...this.curMaterial,
					remainUseLife: this.remainUseLife, //剩余寿命
					remark: this.remark
				}

				if (this.curMaterial.updownFlag === 2) {
					params.materialSequenceCode = this.materialSequenceCode
				}

				this.$u.api.postMaterialUp(params).then(res => {
					if (res.msgCode === '000000') {
						this.list.splice(this.curIndex, 1) //删除当前项
						this.modalContent = '上机成功！'
						this.showModal = true
					} else {
						this.$refs.uTips.show({
							title: `上机失败，原因：${ res.data }`,
							type: 'error',
							duration: 2300
						})
					}
				}).then(err => {
					this.common.sysErrToast(this, err)
				})
			},
			getMaterialUpList(mixCode) {
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

				this.$u.api.getMaterialUpList(params).then(res => {
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
				this.loadStatus = 'loadmore'
				this.page = 1
				this.list = []
				this.getMaterialUpList(this.keyword)
			},
			async scanCode(flag) {
				// #ifdef APP-PLUS
				const code = await this.common.scanCode()
				if (flag == 'keyword') {
					this.keyword = code
					this.fuzzyQuery(this.keyword)
				} else {
					this.materialSequenceCode = code
				}
				// #endif
			}
		},
		onBackPress() {
			if (this.showRemark) {
				this.showRemark = false
				return true
			} else if (this.showSequenceEdit) {
				this.showSequenceEdit = false
				return true
			}
		},
		onPullDownRefresh() {
			this.loadStatus = 'loadmore'
			this.page = 1
			this.list = []
			this.keyword = ''
			this.getMaterialUpList()
			uni.stopPullDownRefresh()
		},
		onReachBottom() {
			if (this.loadStatus != 'nomore') { //如果状态无无数据，则不再请求
				this.loadStatus = "loading"
				this.getMaterialUpList()
			}
		},
		onNavigationBarButtonTap() {
			this.scanCode('keyword')
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
		padding: 0 16rpx;
		text-indent: 20rpx;
		letter-spacing: 20rpx;
	}
</style>
