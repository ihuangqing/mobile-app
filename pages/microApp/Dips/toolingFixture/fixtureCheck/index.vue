<!-- DIPS → 工治具管理 → 盘点 -->
<template>
	<view class="sws-wh100 u-flex sws-flex-d-column">
		<view class="sws-w100 loc-bar u-flex u-row-between">
			<view class="loc-cont" @click="showSelect = true">
				<u-icon name="kuweiguanli" custom-prefix="sws-icon" :size="48" color="#ffffff"></u-icon>
				<text class="u-font-24">库位：</text>
				<text class="u-font-32">{{ positionName }}</text>
			</view>
			<view class="u-flex-1 u-p-l-30 u-p-r-30" v-show="totalNum">
				<text class="u-type-info u-font-24">总数：</text>
				<text class="u-type-success u-font-32 sws-font-bold">{{ totalNum }}</text>
			</view>
		</view>
		<view class="sws-w100 u-flex-1 sws-bg-ebebeb">
			<view v-show="!showNoData" class="u-p-20">
				<u-card margin="0 0 20rpx 0" :border="false"
					:head-style="{background: '#2979ff',padding: '20rpx 30rpx'}" :body-style="{padding: 0}"
					:foot-style="{padding: '16rpx 30rpx'}" :show-foot="false" :full="true"
					v-for="(fixture, index) in list" :key="index">
					<view slot="head" class="card-head u-font-32 u-flex u-row-between">
						<view class="u-flex">
							<view>{{ fixture.fixtureName }}</view>
							<view class="u-font-24">({{ fixture.fixtureCode }})</view>
						</view>
					</view>
					<u-cell-group slot="body" :border="false">
						<u-cell-item class="u-p-t-10 u-p-b-10" hover-class="none" :arrow="false" title="库存数量"
							:value="fixture.qty" :value-style="{color: '#303133'}">
						</u-cell-item>
						<u-cell-item class="u-p-t-10 u-p-b-10" hover-class="none" :arrow="false" title="实盘数量">
							<u-input slot="right-icon" height="50" input-align="right" placeholder="请输入实盘数量"
								placeholder-style="font-size:24rpx" v-model="fixture.actualQty" type="number" />
						</u-cell-item>
						<u-cell-item class="u-p-t-10 u-p-b-10" hover-class="none" :arrow="false" :border-bottom="false"
							title="差异" :value="diffNum(fixture)"
							:value-style="+diffNum(fixture) ? {color: '#fa3534'} :{color: '#303133'}">
						</u-cell-item>
					</u-cell-group>
				</u-card>
			</view>
			<no-data v-show="showNoData"></no-data>
		</view>
		<view v-show="list.length" class="btn-group sws-w100 u-flex u-row-between u-p-t-28 u-p-b-28">
			<u-button type="warning" class="sws-line-h-repair" size="medium" @click="tempSave">暂存</u-button>
			<u-button type="primary" class="sws-line-h-repair" size="medium" @click="commit">确认</u-button>
		</view>
		<u-modal v-model="showModal" :content="modalContent" @confirm="modalConfirm"></u-modal>
		<u-select v-model="showSelect" mode="single-column" :list="selectList" @confirm="selectConfirm"></u-select>
		<u-top-tips ref="uTips"></u-top-tips>
	</view>
</template>

<script>
	import noData from '../../../../components/noData/index.vue'

	import {
		mapState
	} from 'vuex'

	export default {
		components: {
			noData
		},
		data() {
			return {
				positionName: '请选择库位',
				positionId: '',
				totalNum: 0,
				list: [], //盘点信息中的盘点列表
				checkInfo: {}, //盘点信息
				selectList: [],
				showSelect: false,
				modalContent: '',
				showModal: false,
				showNoData: true
			}
		},
		computed: {
			diffNum(fixture) {
				return fixture => {
					if (fixture.actualQty) {
						fixture.difference = Math.abs(fixture.qty - fixture.actualQty)
					} else {
						fixture.difference = ''
					}
					return fixture.difference
				}
			}
		},
		onLoad() {
			this.initLocationSelect()
		},
		methods: {
			tempSave() {
				if (!this.checkInfo.id) {
					return
				}
				const params = {
					id: this.checkInfo.id,
					body: {
						ID: this.checkInfo.id,
						details: this.list.map(item => {
							return {
								fixtureId: item.fixtureId,
								fixtureCode: item.fixtureCode,
								actualQty: item.actualQty
							}
						})
					}
				}

				this.$u.api.putTempCheckInfo(params).then(res => {
					if (res.msgCode === '000000') {
						this.modalContent = '暂存成功'
						this.showModal = true
					} else {
						this.$refs.uTips.show({
							title: `盘点信息暂存失败，原因：${ res.message }`,
							type: 'error',
							duration: 2300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			commit() {
				if (!this.checkInfo.id) {
					return
				}
				const params = {
					id: this.checkInfo.id,
					body: {
						ID: this.checkInfo.id,
						details: this.list.map(item => {
							return {
								fixtureId: item.fixtureId,
								fixtureCode: item.fixtureCode,
								actualQty: item.actualQty
							}
						})
					}
				}

				this.$u.api.putCommitCheckInfo(params).then(res => {
					if (res.msgCode === '000000') {
						this.modalContent = '盘点成功'
						this.showModal = true
					} else {
						this.$refs.uTips.show({
							title: `盘点信息暂存失败，原因：${ res.message }`,
							type: 'error',
							duration: 2300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			async initLocationSelect() {
				this.selectList = await this.baseData.getLocationInfo(this, false)
			},
			modalConfirm() {
				uni.navigateBack()
			},
			selectConfirm(arr) {
				const temp = arr[0]
				this.positionName = temp.label
				this.positionId = temp.value
				this.getCheckInfo()
			},
			getCheckInfo() {
				this.showNoData = false
				this.$u.api.getCheckInfo(this.positionId).then(res => {
					if (res.msgCode === '000000') {
						if (res.data && res.data.details.length) {
							this.checkInfo = res.data
							this.totalNum = res.data.details.reduce((total, curr) => {
								return total + curr.qty
							}, 0)
							this.list = res.data.details
						} else {
							this.$refs.uTips.show({
								title: '暂无盘点数据',
								type: 'warning',
								duration: 2300
							})
							this.showNoData = true
						}
					} else {
						this.$refs.uTips.show({
							title: `盘点信息获取失败，原因：${ res.message }`,
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
				let code = await this.common.scanCode()
				const res = this.selectList.filter(loc => {
					return loc.value == code
				})
				if (res.length) {
					this.positionName = temp.label
					this.positionId = temp.value
					this.getCheckInfo()
				} else {
					this.$refs.uTips.show({
						title: '未找到对应的库位信息',
						type: 'warning',
						duration: 2300
					})
				}
				// #endif
			}
		},
		onBackPress() {
			if (this.showSelect) {
				this.showSelect = false
				return true
			}
		},
		onNavigationBarButtonTap() {
			this.scanCode()
		}
	}
</script>

<style lang="scss" scoped>
	.loc-bar {
		height: 80rpx;
	}

	.loc-cont {
		width: 70%;
		height: 100%;
		line-height: 80rpx;
		background-color: #19be6b;
		color: #ffffff;
		padding: 0 60rpx;
		border-top-left-radius: 80rpx;
		border-bottom-right-radius: 80rpx;
	}

	.card-head {
		color: #ffffff;
	}

	.btn-group {
		text-indent: 20rpx;
		letter-spacing: 20rpx;
	}
</style>
