<!-- DIPS → 备品备件管理 -->
<template>
	<view class="page-wrap sws-wh100">
		<view class="material-search sws-w100 u-p-20">
			<u-search placeholder="请输入物料编码" shape="square" v-model="keyword" @search="fuzzyQuery" @custom="fuzzyQuery">
			</u-search>
		</view>
		<view v-show="!showNoData" class="scroll-wrap sws-bg-ebebeb">
			<view class="u-p-20">
				<u-card margin="0 0 20rpx 0" :border="false"
					:head-style="{background: '#2979ff',padding: '20rpx 30rpx'}" :body-style="{padding: 0}"
					:foot-style="{padding: '16rpx 30rpx'}" :show-foot="true" :full="true"
					v-for="(material, index) in list" :key="index">
					<view slot="head">
						<view class="card-head u-font-32 u-flex">
							<view>{{ material.itemName }}</view>
							<view class="u-font-24">({{ material.itemCode }})</view>
						</view>
					</view>
					<u-cell-group slot="body" :border="false">
						<u-cell-item class="u-p-t-10 u-p-b-10" hover-class="none" :arrow="false" title="规格"
							:value="material.standard">
						</u-cell-item>
						<u-cell-item class="u-p-t-10 u-p-b-10" hover-class="none" :arrow="false" title="库存"
							:value="`${material.qty}${ material.unit ? material.unit : ''}`">
						</u-cell-item>
						<u-cell-item v-show="material.positionName" class="u-p-t-10 u-p-b-10" hover-class="none"
							:arrow="false" :border-bottom="false" title="位置"
							:value="`${material.positionName} → ${ material.shelfName ? material.shelfName : ''}`">
						</u-cell-item>
					</u-cell-group>
					<view slot="foot" class="u-text-right">
						<u-button class="btn-style-new" size="medium" type="primary" @click="goToApply(material)">申领
						</u-button>
						<u-button class="btn-style u-m-l-30" size="medium" type="warning" @click="goToDetail(material)">
							物料明细
						</u-button>
						<u-button class="btn-style u-m-l-30" size="medium" type="success" @click="goToRecord(material)">
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
		computed: mapState(['factoryId']),
		created() {
			this.getMaterialList()
		},
		methods: {
			goToApply(material) {
				const params = {
					itemCode: material.itemCode
				}
				uni.navigateTo({
					url: `/pages/microApp/Dips/spareParts/materialApply/index${ this.$u.queryParams(params) }`
				})
			},
			goToDetail(material) {
				uni.navigateTo({
					url: `/pages/microApp/Dips/spareParts/materialManage/materialDetail/index${ this.$u.queryParams(material) }`
				})
			},
			goToRecord(material) {
				uni.navigateTo({
					url: `/pages/microApp/Dips/spareParts/materialManage/materialInOutRecord/index${ this.$u.queryParams(material) }`
				})
			},
			getMaterialList() {
				const params = {
					query: {
						page: this.page,
						limit: this.limit
					},
					body: {
						factoryId: this.factoryId,
						searchText: this.keyword
					}
				}

				this.$u.api.getMaterialList(params).then(res => {
					if (res.msgCode === '000000') {
						this.dataList = [...this.list, ...res.data.data]
						this.list = this.dataList
						this.page++

						if (!res.data.data.length || res.data.data.length < this.limit) this.loadStatus = "nomore"
						if (this.list.length) {
							this.showNoData = false
						} else {
							this.showNoData = true
						}
					} else {
						this.$refs.uTips.show({
							title: `物料台账获取失败，原因：${ res.message }`,
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
				this.getMaterialList()
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

	.btn-style-new {
		width: 120rpx;
		height: 60rpx;
		line-height: normal;
		text-indent: 20rpx;
		letter-spacing: 20rpx;
	}
</style>
