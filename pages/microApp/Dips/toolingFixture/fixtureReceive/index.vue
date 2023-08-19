<!-- DIPS → 工治具管理 → 归还	 -->
<template>
	<view class="sws-wh100">
		<view class="tab-bar sws-w100">
			<u-tabs :list="tabList" :is-scroll="false" bar-width="120" :current="current" @change="changeTabs"></u-tabs>
		</view>
		<view v-if="!current" class="receive-cont u-p-t-80 u-flex sws-flex-d-column">
			<u-form ref="uForm" class="sws-w100 u-flex-1 u-p-l-20 u-p-r-20 u-p-b-30" :model="model" label-width="170"
				label-align="center">
				<u-form-item required label="工治具编码" :border-bottom="false" prop="fixtureCode">
					<u-input :border="true" placeholder="请输入/扫描工治具编码" v-model="model.fixtureCode" type="text"
						:focus="setFocus">
					</u-input>
					<u-icon slot="right" name="scan" size="56" color="#2979ff" @click="scanCode"></u-icon>
				</u-form-item>
				<u-form-item label="工治具名称" :border-bottom="false">
					<u-input :border="true" disabled placeholder="" v-model="model.fixtureName" type="text">
					</u-input>
				</u-form-item>
				<u-form-item label="领用人" :border-bottom="false">
					<u-input :border="true" disabled placeholder="" v-model="model.recipientsName" type="text">
					</u-input>
				</u-form-item>
				<u-form-item label="领用时间" :border-bottom="false">
					<u-input :border="true" disabled placeholder="" v-model="model.recipientsDate" type="text" />
				</u-form-item>
				<u-form-item label="归还数量" :border-bottom="false">
					<u-input :border="true" disabled placeholder="" v-model="applyNum" type="number">
					</u-input>
				</u-form-item>
				<u-form-item label="发放人" :border-bottom="false">
					<u-input :border="true" disabled placeholder="" v-model="model.issuerName" type="text">
					</u-input>
				</u-form-item>
				<u-form-item label="发出仓库" :border-bottom="false">
					<u-input :border="true" disabled placeholder="" v-model="model.positionNameOld" type="text">
					</u-input>
				</u-form-item>
				<u-form-item label="货架号" :border-bottom="false">
					<u-input :border="true" disabled placeholder="" v-model="model.positionName" type="text">
					</u-input>
				</u-form-item>
				<u-form-item label="累计使用次数" :border-bottom="false">
					<u-input :border="true" placeholder="" v-model="model.totalUsedTime" type="text">
					</u-input>
				</u-form-item>
				<u-form-item label="当次使用次数" :border-bottom="false">
					<u-input :border="true" placeholder="" v-model="model.currentUsedTime" type="text">
					</u-input>
				</u-form-item>
			</u-form>
			<view class="sws-w100 btn-group u-p-28">
				<u-button type="primary" @click="commit">确认</u-button>
			</view>
		</view>
		<view v-else class="sws-wh100 u-p-t-80">
			<view v-show="!showNoData" class="sws-wh100 u-p-20 sws-bg-ebebeb sws-overflow-scroll-y">
				<u-card :margin="index === (list.length - 1) ? '0': '0 0 20rpx 0'" :border="false"
					:head-style="{background: '#2979ff',padding: '20rpx 30rpx'}" :body-style="{padding: 0}"
					:foot-style="{padding: '16rpx 30rpx'}" :show-foot="true" :full="true"
					v-for="(fixture, index) in list" :key="index">
					<view slot="head" class="card-head u-font-32 u-flex u-row-between">
						<view class="u-flex">
							<view>{{ fixture.fixtureName }}</view>
							<view class="u-font-24">({{ fixture.fixtureCode }})</view>
						</view>
					</view>
					<u-cell-group slot="body" :border="false">
						<u-cell-item class="u-p-t-10 u-p-b-10" hover-class="none" :arrow="false" title="申请人"
							:value="fixture.issuerName">
						</u-cell-item>
						<u-cell-item class="u-p-t-10 u-p-b-10" hover-class="none" :arrow="false" title="数量"
							:value="fixture.qty">
						</u-cell-item>
						<u-cell-item class="u-p-t-10 u-p-b-10" hover-class="none" :arrow="false" :border-bottom="false"
							title="申请时间" :value="fixture.issuerDate">
						</u-cell-item>
					</u-cell-group>
					<view slot="foot" class="u-text-right">
						<u-button class="btn-style btn-group" size="medium" type="success"
							@click="goToFixtureIn(fixture.fixtureCode, index)">
							入库</u-button>
					</view>
				</u-card>
			</view>
			<no-data v-show="showNoData"></no-data>
		</view>
		<u-modal v-model="showModal" :content="modalContent"></u-modal>
		<u-top-tips ref="uTips"></u-top-tips>
	</view>
</template>

<script>
	import noData from '../../../../components/noData/index.vue'

	export default {
		components: {
			noData
		},
		data() {
			return {
				current: 0,
				tabList: [{
					name: '工治具归还'
				}, {
					name: '工治具待入库'
				}],
				applyNum: 1,
				model: {
					fixtureCode: '',
				},
				setFocus: false,
				rules: { //表单验证
					fixtureCode: [{
						asyncValidator: async (rule, value, callback) => {
							if (value) { //空值判断放在确认方法中处理
								let fixtureInfo = await this.getUnReceiveFixtureInfo(value)
								if (Object.keys(fixtureInfo).length) {
									this.model = fixtureInfo
									callback()
								} else {
									this.$refs.uTips.show({
										title: '此工治具不存在或未申领，请重新输入/扫描',
										type: 'warning',
										duration: 2300
									})
								}
							}
						},
						trigger: 'blur',
					}]
				},
				modalContent: '',
				showModal: false,
				list: [],
				showNoData: false
			}
		},
		onReady() {
			this.$refs.uForm.setRules(this.rules)
		},
		methods: {
			goToFixtureIn(fixtureCode, index) { //跳转至入库页面
				const params = {
					fixtureCode,
					index
				}
				uni.navigateTo({
					url: `/pages/microApp/Dips/toolingFixture/fixtureReceive/fixtureIn/index${ this.$u.queryParams(params) }`,
					acceptDataFromOpenedPage: function(data) {
						this.list.splice(data.index, 1) //删除入库成功的工治具
					}
				})
			},
			getUnReceiveList() { //未入库列表
				this.$u.api.getUnReceiveList().then(res => {
					if (res.msgCode === '000000' && res.data) {
						this.list = res.data
						if (!this.list.length) this.showNoData = true
					} else {
						this.$refs.uTips.show({
							title: `工治具待入库列表获取失败，原因：${ res.message }`,
							type: 'error',
							duration: 2300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			goToReceiveRecord() {
				uni.navigateTo({
					url: '/pages/microApp/Dips/toolingFixture/fixtureReceive/receiveRecord/index'
				})
			},
			getUnReceiveFixtureInfo() { //未归还工治具信息
				return new Promise((resolve, reject) => {
					this.$u.api.getUnReceiveFixtureInfo(this.model.fixtureCode).then(res => {
						if (res.msgCode === '000000' && res.data) {
							resolve(res.data)
						} else {
							resolve({})
						}
					}).catch(err => {
						resolve({})
					})
				})
			},
			commit() { //归还确认
				const model = this.model
				let checkArr = [{
					tips: '请输入/扫码正确的工治具编码',
					value: model.id
				}, {
					tips: '请输入/扫码工治具编码',
					value: model.fixtureCode
				}]
				if (this.common.checkNotNull(this, checkArr)) {
					const params = {
						query:{
							id: model.id
						},
						body:{
							fixtureCode: model.fixtureCode,
							positionId: model.positionId,
							currentUsedTime:model.currentUsedTime,
							totalUsedTime:model.totalUsedTime
						}
					}
					this.$u.api.postFixtureBack(params).then(res => {
						if (res.msgCode === '000000') {
							this.modalContent = '归还成功'
							this.showModal = true
							this.model = {} //清空录入项
						} else {
							this.$refs.uTips.show({
								title: `工治具入库失败，原因：${res.message}`,
								type: 'error',
								duration: 2300
							})
						}
					}).catch(err => {
						this.common.sysErrToast(this, err)
					})
				}
			},
			changeTabs(index) {
				this.current = index
				if (index) { //切换到待入库列表
					this.getUnReceiveList()
				}
			},
			async scanCode() {
				// #ifdef APP-PLUS
				let code = await this.common.scanCode()
				this.model.fixtureCode = code
				this.setFocus = true
				// #endif
			}
		},
		onNavigationBarButtonTap() {
			this.goToReceiveRecord()
		}
	}
</script>

<style lang="scss" scoped>
	.tab-bar {
		position: fixed;
		z-index: 3;
	}

	.receive-cont {
		min-height: 100%;
	}

	.btn-group {
		text-indent: 20rpx;
		letter-spacing: 20rpx;
	}

	.btn-style {
		height: 60rpx;
		line-height: 60rpx;
		padding: 0 16rpx;
	}

	.card-head {
		color: #ffffff;
	}
</style>
