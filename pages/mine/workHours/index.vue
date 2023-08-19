<!-- 我的 → 工作时长 -->
<template>
	<view class="page-wrap sws-wh100 u-flex sws-flex-d-column">
		<view class="work-header u-flex sws-font-fff u-rela">
			<view v-if="days" class="work-warning">
				<u-icon name="jinggao" custom-prefix="sws-icon" size="28" :color="days == 7 ? '#ff9900' : '#fa3534'"
					:label="`连续工作${ days }天`" :label-color="days == 7 ? '#ff9900' : '#fa3534'" label-size="24"></u-icon>
			</view>
			<view class="u-flex-1">
				<view class="u-text-center">
					<text class="big-font u-m-r-8">{{ +totalDays ? totalDays : '-' }}</text>
					<text>天</text>
				</view>
				<view class="u-text-center">总时长</view>
			</view>
			<u-line length="58" color="#ffffff" direction="col" :hair-line="false"></u-line>
			<view class="u-flex-1">
				<view class="u-text-center">
					<text class="big-font u-m-r-8">{{ list.length ? list.length : '-' }}</text>
					<text>个</text>
				</view>
				<view class="u-text-center">岗位</view>
			</view>
		</view>
		<view v-show="!showNoData" class="work-scroll u-flex-1 sws-overflow-scroll-y">
			<view class="work-scroll-item" v-for="(item, index) in list" :key="index">
				<view class="u-flex u-p-l-40 u-p-t-40 u-p-r-40">
					<view class="item-left u-flex sws-flex-d-column sws-font-fff">
						<view class="u-flex-1 u-flex u-p-l-20 u-p-t-12 u-p-r-20 u-p-b-12">
							<view>
								<text class="xl-font u-m-r-4">{{ item.days }}</text>
								<text class="u-font-24">天</text>
							</view>
						</view>
						<u-line length="100%" color="#ffffff" :hair-line="false"></u-line>
						<view class="u-font-24 u-p-t-8 u-p-b-8 u-p-l-20 u-p-r-20 sws-line-h-repair">工作时长</view>
					</view>
					<view class="u-flex-1 u-flex sws-flex-d-column u-col-bottom">
						<view class="u-font-36 u-main-color">{{ item.postName }}</view>
						<view class="u-content-color u-m-t-10">{{ item.lineName }}</view>
						<view class="u-content-color u-m-t-8">{{ item.mesArea }}</view>
					</view>
				</view>
				<view class="u-flex u-p-16">
					<view class="u-flex-1">
						<view class="u-type-primary u-font-32 u-text-center">{{ item.startDate }}</view>
						<view class="u-type-info u-text-center u-m-t-4">上岗日期</view>
					</view>
					<u-divider border-color="#2979ff" height="100" half-width="60" class="divider-line">
						<view class="divider-icon">
							<u-icon name="rocket" custom-prefix="sws-icon" size="46" color="#2979ff"></u-icon>
						</view>
					</u-divider>
					<view class="u-flex-1">
						<view class="u-type-primary u-font-32 u-text-center">{{ item.endDate }}</view>
						<view class="u-type-info u-text-center u-m-t-4">截止日期</view>
					</view>
				</view>
			</view>
		</view>
		<no-data v-show="showNoData"></no-data>
		<u-top-tips ref="uTips"></u-top-tips>
	</view>
</template>

<script>
	import noData from '../../components/noData/index.vue'

	import {
		mapState
	} from 'vuex'

	export default {
		components: {
			noData
		},
		data() {
			return {
				totalDays: 0, //总时长
				days: 0, //连续工作天数
				showNoData: false,
				list: []
			}
		},
		computed: mapState(['userInfo']),
		onLoad(options) {
			this.days = +options.days
			this.getMyWorkDays()
		},
		methods: {
			getMyWorkDays() {
				this.$u.api.getMyWorkDays(this.userInfo.account).then(res => {
					if (res.msgCode === '000000' && res.data) {
						this.totalDays = res.data.totalDays
						this.list = res.data.staffPosts
						if (!this.list.length) {
							this.showNoData = true
						}
					} else {
						this.$refs.uTips.show({
							title: `工作时长获取失败，原因：${ res.message }`,
							type: 'error',
							duration: '2300'
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
		background-color: #f6f6f8;

		.work-header {
			width: 100%;
			height: 282rpx;
			background: linear-gradient(#2979ff, #6DAFF7);
			padding-top: 40rpx;
			padding-bottom: 102rpx;
		}

		.work-scroll {
			width: 100%;
			margin-top: -72rpx;
			padding: 0 40rpx;
			z-index: 3;

			&-item {
				width: 100%;
				background-color: #ffffff;
				border-radius: 16rpx;
				box-shadow: 0 0 4rpx #ebebed;
				margin-bottom: 30rpx;

				.item-left {
					background-color: $u-type-primary;
					border-radius: 16rpx;
				}

				.divider-line {
					width: auto !important;
					margin: 0 20rpx;

					.divider-icon {
						border: 4rpx solid #2979ff;
						border-radius: 50%;
						padding: 4rpx;
					}
				}
			}
		}
	}

	.big-font {
		font-size: 64rpx;
	}

	.xl-font {
		font-size: 56rpx;
	}

	.work-warning {
		position: absolute;
		top: 0;
		right: 0;
		height: 44rpx;
		line-height: 44rpx;
		padding: 0 30rpx;
		background-color: rgba(255, 255, 255, .3);
		border-top-left-radius: 22rpx;
		border-bottom-left-radius: 22rpx;
	}

	::v-deep .divider-line .u-divider-line {
		border-bottom-width: 8rpx !important;
	}
</style>
