<!-- DIPS → 工治具管理 → 工治具履历 -->
<template>
	<view class="sws-wh100">
		<view class="tab-bar sws-w100">
			<u-tabs :list="tabList" :is-scroll="false" bar-width="120" :current="current" @change="changeTabs"></u-tabs>
		</view>
		<view v-if="!current" class="sws-wh100 u-p-t-80 sws-bg-ebebeb">
			<view v-show="!showNoData" class="scroll-wrap u-p-20 sws-bg-ebebeb">
				<u-card margin="0 0 20rpx 0" :border="false"
					:head-style="{background: '#2979ff',padding: '20rpx 30rpx'}" :body-style="{padding: 0}"
					:foot-style="{padding: '16rpx 30rpx'}" :show-foot="true" :full="true"
					v-for="(fixture, index) in unSignList" :key="index">
					<view slot="head" class="card-head u-font-32 u-flex u-row-between">
						<view class="u-flex">
							<view>{{ fixture.fixtureName }}</view>
							<view class="u-font-24">({{ fixture.fixtureCode }})</view>
						</view>
					</view>
					<u-cell-group slot="body" :border="false">
						<u-cell-item class="u-p-t-10 u-p-b-10" hover-class="none" :arrow="false" title="责任人"
							:value="fixture.recipientsName">
						</u-cell-item>
						<u-cell-item class="u-p-t-10 u-p-b-10" hover-class="none" :arrow="false" title="剩余使用次数" :value="fixture.remainTimes">
						</u-cell-item>
						<u-cell-item class="u-p-t-10 u-p-b-10" hover-class="none" :arrow="false" title="领用时间"
							:value="$u.timeFormat(fixture.issuerDate)">
						</u-cell-item>
						<u-cell-item class="u-p-t-10 u-p-b-10" hover-class="none" :arrow="false" :border-bottom="false"
							title="预计归还时间" :value="$u.timeFormat(fixture.expectedReturnDate)">
						</u-cell-item>
					</u-cell-group>
					<view slot="foot" class="u-flex u-row-right">
						<u-button v-show="!+fixture.opeIsReg" class="btn-style" size="medium" type="warning"
							@click="goToOPECheckIn(fixture, index)">
							生产操作员登记</u-button>
						<u-button v-show="!+fixture.teIsReg" class="btn-style u-m-l-20" size="medium" type="success"
							@click="goToTECheckIn(fixture, index)">
							设备技术员登记</u-button>
					</view>
				</u-card>
			</view>
			<no-data v-show="showNoData"></no-data>
		</view>
		<view v-else class="sws-wh100 u-p-t-80 sws-bg-ebebeb">
			<view v-show="!showNoData" class="scroll-wrap sws-bg-ebebeb">
				<view class="u-p-20">
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
							<u-cell-item class="u-p-t-10 u-p-b-10" hover-class="none" :arrow="false" title="剩余时长"
								:value="countHours(fixture.effectiveDate) + '小时'">
							</u-cell-item>
							<u-cell-item class="u-p-t-10 u-p-b-10" hover-class="none" :arrow="false" title="剩余次数"
								:value="fixture.remainTimes">
							</u-cell-item>
							<u-cell-item class="u-p-t-10 u-p-b-10" hover-class="none" :arrow="false" title="操作员"
								:value="fixture.recipientsName">
							</u-cell-item>
							<u-cell-item class="u-p-t-10 u-p-b-10" hover-class="none" :arrow="false"
								:border-bottom="false" title="责任主管" :value="fixture.personInchargeName">
							</u-cell-item>
						</u-cell-group>
					</u-card>
					<u-loadmore :status="loadStatus" bgColor="#ebebeb"></u-loadmore>
				</view>
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
				page: 1,
				limit: 10,
				current: 0,
				tabList: [{
					name: '当日未登记'
				}, {
					name: '工治具履历'
				}],
				unSignList: [], //当天未登记履历列表
				list: [], //履历列表
				loadStatus: 'loadmore',
				showNoData: false,
				modalContent: '',
				showModal: false
			}
		},
		computed: {
			countHours(date) {
				return date => {
					if (date) {
						let now = new Date()
						let time = new Date(date)
						if (now > time) return 0
						return Math.floor((time - now) / 1000 / 60 / 60)
					} else {
						return 0
					}
				}
			}
		},
		onLoad() {
			this.getUnSignResumeList()
		},
		methods: {
			async scanCode() {
				let code = await this.common.scanCode()
				this.unSignList.forEach((item, index) => {
					if (item.fixtureCode === code) {
						this.goToCheckIn(item, index)
					}
				})
			},
			goToOPECheckIn(fixture, index) {
				const _self = this
				uni.navigateTo({
					url: '/pages/microApp/Dips/toolingFixture/fixtureResume/resumeOpeCheckIn/index',
					events: {
						acceptDataFromOpenedPage(data) {
							_self.unSignList.splice(index, 1)
						}
					},
					success(res) {
						res.eventChannel.emit('acceptDataFromOpenerPage', {
							fixture
						})
					}
				})
			},
			goToTECheckIn(fixture, index) {
				const _self = this
				uni.navigateTo({
					url: '/pages/microApp/Dips/toolingFixture/fixtureResume/resumeTeCheckIn/index',
					events: {
						acceptDataFromOpenedPage(data) {
							_self.unSignList.splice(index, 1)
						}
					},
					success(res) {
						res.eventChannel.emit('acceptDataFromOpenerPage', {
							fixture
						})
					}
				})
			},
			changeTabs(index) {
				this.current = index
				this.showNoData = false
				if (index) {
					if (!this.list.length) {
						this.getFixtureResumeList()
					}
				} else {
					if (!this.unSignList.length) {
						this.getUnSignResumeList()
					}
				}
			},
			getUnSignResumeList() {
				this.$u.api.getUnSignResumeList().then(res => {
					if (res.msgCode === '000000') {
						this.unSignList = res.data
						if (!this.unSignList.length) this.showNoData = true
					} else {
						this.$refs.uTips.show({
							title: `未登记列表获取失败，原因：${ res.message }`,
							type: 'error',
							duration: 2300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			getFixtureResumeList() {
				const params = {
					query: {
						page: this.page,
						limit: this.limit
					},
					body: {
						fixtureCode: ''
					}
				}
				this.$u.api.getFixtureResumeList(params).then(res => {
					if (res.msgCode === '000000') {
						this.list = [...this.list, ...res.data.data]
						this.page++

						if (!res.data.data.length || res.data.data.length < this.limit) this.loadStatus = 'nomore'
						if (!this.list.length) this.showNoData = true
					} else {
						this.$refs.uTips.show({
							title: `出库工治具履历获取失败，原因：${ res.message }`,
							type: 'error',
							duration: 2300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			}
		},
		onReachBottom() {
			if (this.current && this.loadStatus != 'nomore') {
				this.getFixtureResumeList()
			}
		},
		onNavigationBarButtonTap() {
			this.scanCode()
		}
	}
</script>

<style lang="scss" scoped>
	.tab-bar {
		position: fixed;
		z-index: 3;
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
		margin: 0;
	}
</style>
