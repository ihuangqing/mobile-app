<template>
	<view class="sws-wh100">
		<view class="tab-bar sws-w100">
			<u-tabs :list="tabList" :is-scroll="false" :current="current" @change="changeTabs"></u-tabs>
		</view>
		<view v-show="!showNoData" class="scroll-wrap u-p-t-80 sws-bg-ebebeb">
			<view class="u-p-20">
				<u-card margin="0 0 20rpx 0" :border="false"
					:head-style="{background: '#2979ff',padding: '20rpx 30rpx'}" :body-style="{padding: 0}"
					:foot-style="{padding: '16rpx 30rpx'}" :show-foot="false" :full="true"
					v-for="(fixture, index) in list" :key="index">
					<view slot="head">
						<view class="card-head u-font-32 u-flex">
							<view>{{ fixture.fixtureName }}</view>
							<view class="u-font-24">({{ fixture.fixtureCode }})</view>
						</view>
					</view>
					<u-cell-group v-if="!current" slot="body" :border="false">
						<u-cell-item class="u-p-t-10 u-p-b-10" hover-class="none" :arrow="false" title="入库人"
							:value="fixture.withdrawingPersonName">
						</u-cell-item>
						<u-cell-item class="u-p-t-10 u-p-b-10" hover-class="none" :arrow="false" title="入库位置"
							:value="fixture.positionName">
						</u-cell-item>
						<u-cell-item class="u-p-t-10 u-p-b-10" hover-class="none" :arrow="false" :border-bottom="false"
							title="入库时间" :value="fixture.withdrawingDate">
						</u-cell-item>
					</u-cell-group>
					<u-cell-group v-else slot="body" :border="false">
						<u-cell-item class="u-p-t-10 u-p-b-10" hover-class="none" :arrow="false" title="领用人"
							:value="fixture.recipientsName">
						</u-cell-item>
						<u-cell-item v-show="fixture.usage" class="u-p-t-10 u-p-b-10" hover-class="none" :arrow="false"
							title="用途" :value="fixture.usage">
						</u-cell-item>
						<u-cell-item class="u-p-t-10 u-p-b-10" hover-class="none" :arrow="false" title="发放人"
							:value="fixture.issuerName">
						</u-cell-item>
						<u-cell-item class="u-p-t-10 u-p-b-10" hover-class="none" :arrow="false" :border-bottom="false"
							title="发放时间" :value="fixture.issuerDate">
						</u-cell-item>
					</u-cell-group>
				</u-card>
				<u-loadmore :status="loadStatus" bgColor="#ebebeb"></u-loadmore>
			</view>
		</view>
		<no-data v-show="showNoData"></no-data>
		<u-top-tips ref="uTips"></u-top-tips>
	</view>
</template>

<script>
	import noData from '../../../../../components/noData/index.vue'

	export default {
		components: {
			noData
		},
		data() {
			return {
				current: 0,
				tabList: [{
					name: '入库记录'
				}, {
					name: '出库记录'
				}],
				inPage: 0,
				outPage: 0,
				limit: 10,
				list: [],
				inList: [],
				outList: [],
				loadStatus: 'loadmore',
				showNoData: false,
			}
		},
		onLoad(options) {
			this.fixtureCode = options.fixtureCode
			this.getFixtureInList()
		},
		methods: {
			getFixtureInList() {
				const params = {
					query: {
						page: this.inPage,
						limit: this.limit
					},
					body: {
						fixtureCode: this.fixtureCode
					}
				}
				this.$u.api.getFixtureInList(params).then(res => {
					if (res.msgCode === '000000') {
						this.inList = [...this.inList, ...res.data.data]
						this.list = this.inList
						this.inPage++

						if (!res.data.data.length || res.data.data.length < this.limit) this.loadStatus = "nomore"
						if (!this.list.length) this.showNoData = true
					} else {
						this.$refs.uTips.show({
							title: `工治具入库记录获取失败，原因：${ res.message }`,
							type: 'error',
							duration: 2300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			getFixtureOutList() {
				const params = {
					query: {
						page: this.outPage,
						limit: this.limit
					},
					body: {
						fixtureCode: this.fixtureCode
					}
				}
				this.$u.api.getFixtureOutList(params).then(res => {
					if (res.msgCode === '000000') {
						if (res.data.data.length) {
							this.outList = [...this.outList, ...res.data.data]
							this.list = this.outList
							this.outPage++
						} else {
							this.loadStatus = "nomore"
						}
						if (!this.list.length) this.showNoData = true
					} else {
						this.$refs.uTips.show({
							title: `工治具入库记录获取失败，原因：${ res.message }`,
							type: 'error',
							duration: 2300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			changeTabs(index) { //切换tab时检查对应的list表中是否有数据，如果没有数据则请求接口，否则直接展示
				this.current = index
				this.showNoData = false //重置状态
				this.list = [] ///重置状态，防止reachBottom多次触发
				this.loadStatus = 'loadmore' //重置状态，防止干扰其他list加载更多
				if (!index) {
					if (this.inList.length) {
						this.list = this.inList
					} else {
						this.getFixtureInList()
					}
				} else {
					if (this.outList.length) {
						this.list = this.outList
					} else {
						this.getFixtureOutList()
					}
				}
			}
		},
		onReachBottom() {
			if (this.loadStatus != 'nomore') { //如果状态无无数据，则不再请求
				this.loadStatus = "loading"
				if (this.current) {
					this.getFixtureOutList()
				} else {
					this.getFixtureInList()
				}
			}
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
</style>
