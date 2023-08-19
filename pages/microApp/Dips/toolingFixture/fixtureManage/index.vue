<!-- DIPS → 工治具管理 -->
<template>
	<view class="page-wrap sws-wh100">
		<view class="material-search sws-w100 u-p-20">
			<u-search placeholder="请输入工治具名称或编码" shape="square" v-model="keyword" @search="fuzzyQuery"
				@custom="fuzzyQuery"></u-search>
		</view>
		<view v-show="!showNoData" class="scroll-wrap sws-bg-ebebeb">
			<view class="u-p-20">
				<u-card margin="0 0 20rpx 0" :border="false"
					:head-style="{background: '#2979ff',padding: '20rpx 30rpx'}" :body-style="{padding: 0}"
					:foot-style="{padding: '16rpx 30rpx'}" :show-foot="true" :full="true"
					v-for="(fixture, index) in list" :key="index">
					<view slot="head" class="card-head u-font-32 u-flex u-row-between">
						<view class="u-flex">
							<view>{{ fixture.fixtureName }}</view>
							<view class="u-font-24">({{ fixture.fixtureCode }})</view>
						</view>
						<view>{{ +fixture.storeState ? '在库' : '出库' }}</view>
					</view>
					<u-cell-group slot="body" :border="false">
						<u-cell-item class="u-p-t-10 u-p-b-10" hover-class="none" :arrow="false" title="剩余时长"
							:value="countHours(fixture.effectiveDate) + '小时'">
						</u-cell-item>
						<u-cell-item class="u-p-t-10 u-p-b-10" hover-class="none" :arrow="false" title="剩余次数"
							:value="fixture.theoreticalTimes - fixture.usedTimes + '次'">
						</u-cell-item>
						<u-cell-item class="u-p-t-10 u-p-b-10" hover-class="none" :arrow="false" :border-bottom="false"
							title="存放位置" :value="fixture.positionName">
						</u-cell-item>
					</u-cell-group>
					<view slot="foot" class="u-text-right">
						<u-button class="btn-style" size="medium" type="warning" @click="goToDetail(fixture)">工治具明细
						</u-button>
						<u-button class="btn-style u-m-l-30" size="medium" type="success" @click="goToRecord(fixture)">
							出入库记录
						</u-button>
					</view>
				</u-card>
				<u-loadmore :status="loadStatus" bgColor="#ebebeb"></u-loadmore>
			</view>
		</view>
		<no-data v-show="showNoData"></no-data>
		<u-top-tips ref="uTips"></u-top-tips>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'

	import noData from '../../../../components/noData/index.vue'

	export default {
		components: {
			noData
		},
		data() {
			return {
				keyword: '',
				page: 1,
				limit: 10,
				list: [],
				loadStatus: 'loadmore',
				showNoData: false
			}
		},
		computed: {
			...mapState(['factoryId']),
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
		created() {
			this.getFixtureList()
		},
		methods: {
			goToDetail(fixture) {
				uni.navigateTo({
					url: '/pages/microApp/Dips/toolingFixture/fixtureManage/fixtureDetail/index',
					success: function(res) {
						res.eventChannel.emit('acceptDataFromOpenerPage', {
							fixture
						})
					}
				})
			},
			goToRecord(fixture) {
				const params = {
					fixtureCode: fixture.fixtureCode
				}
				uni.navigateTo({
					url: `/pages/microApp/Dips/toolingFixture/fixtureManage/fixtureInOutRecord/index${ this.$u.queryParams(params) }`
				})
			},
			getFixtureList() {
				const params = {
					query: {
						page: this.page,
						limit: this.limit
					},
					body: {
						fixtureCode: '',
						fixtureName: '',
						fixtureType: '',
						applicant: ''
					}
				}

				this.$u.api.getFixtureList(params).then(res => {
					if (res.msgCode === '000000') {
						this.dataList = [...this.list, ...res.data.data]
						this.list = this.dataList
						this.page++

						if (!res.data.data.length || res.data.data.length < this.limit) this.loadStatus = 'nomore'
						if (!this.list.length) this.showNoData = true
					} else {
						this.$refs.uTips.show({
							title: `工治具列表获取失败，原因：${ res.message }`,
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
				this.list = this.dataList.filter(fixture => {
					return fixture.fixtureName.includes(this.keyword.trim()) || fixture.fixtureCode.includes(this
						.keyword.trim())
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.material-search {
		position: fixed;
		z-index: 3;
		background-color: #ffffff;
	}

	.scroll-wrap {
		min-height: 100%;
		padding-top: 104rpx; //64(u-search默认高度) + 20 + 20（搜索框上下内边距）
	}

	.card-head {
		color: #ffffff;
	}

	.btn-style {
		width: 180rpx;
		height: 60rpx;
		line-height: normal;
		padding: 0 16rpx;
	}
</style>
