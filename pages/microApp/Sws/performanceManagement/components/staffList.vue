<template>
	<view class="sws-wh100 sws-overflow-scroll-y">
		<view class="staff-card sws-bg-ffffff" v-for="(staff, index) in dataList" :key="index">
			<view class="staff-card-header u-flex">
				<view>
					<text class="u-font-28">{{ staff.userName }}</text>
					<text class="u-font-24">（{{ staff.account }}）</text>
				</view>
				<view class="u-type-success u-flex-1 u-line-1 u-m-l-30 u-flex u-row-right" @click="toShowScoreInfo(staff)">
					<view>
						<text class="u-font-30 sws-font-bold u-m-r-4">{{ staff.scoreValue }}</text>
						<text class="u-font-24">分</text>
					</view>
					<view v-show="type !== 'record'" class="u-line-1">
						<u-tag v-for="(score, scoreIndex) in staff.recordList" :key="scoreIndex"
							:text="`${+score.scoreRule ? '+': '-'}${score.scoreValue}`" mode="light" class="u-m-l-8"
							:closeable="false" size="mini"
							:type="score.scoreValue == 100 ? 'info': (+score.scoreRule ? 'success': 'error')" />
					</view>
				</view>
			</view>
			<u-line color="#2979ff"></u-line>
			<view class="staff-card-content u-flex u-col-bottom">
				<view class="u-flex-1">
					<view class="u-font-28 u-tips-color">
						<u-icon name="wodeshenqing" custom-prefix="sws-icon" size="28"></u-icon>
						<text class="u-m-l-6">签到信息：</text>
					</view>
					<view class="u-font-28 u-main-color u-m-t-8">{{staff.lineName}}-{{staff.mesArea}}-{{staff.postName}}</view>
				</view>
				<view class="u-text-right">
					<u-button v-if="type === 'record'" type="primary" class="score-btn" @click="toRecordPage(staff)">查看</u-button>
					<u-button v-else type="warning" class="score-btn" @click="toPScorePage(staff)">评分</u-button>
				</view>
			</view>
		</view>
		<u-modal v-model="showModal" title="当日评分记录">
			<view class="u-p-30">
				<view class="popup-score">
					<text>绩效评分：</text>
					<text>{{currUser.scoreValue}}分</text>
				</view>
				<view class="u-m-t-16" v-for="(score, index) in currUser.recordList" :key="index">
					<text>{{score.scoreCode}}.{{score.scoreDesc}}</text>
					<u-tag :text="`${+score.scoreRule ? '+': '-'}${score.scoreValue}`" mode="light" class="u-m-l-8"
						:closeable="false" size="mini"
						:type="score.scoreValue == 100 ? 'info': (+score.scoreRule ? 'success': 'error')" />
				</view>
			</view>
		</u-modal>
	</view>
</template>

<script>
	export default {
		props: ['dataList', 'heightObj', 'type', 'defaultCalendar'],
		data() {
			return {
				currUser: {},
				showModal: false
			}
		},
		methods: {
			toShowScoreInfo(user) {
				if (user.recordList.length > 0) {
					this.currUser = user
					this.showModal = true
				}
			},
			toRecordPage(data) {
				const _self = this
				uni.navigateTo({
					url: '/pages/microApp/Sws/performanceRecord/userRecord/index',
					success: function(res) {
						res.eventChannel.emit('acceptDataFromOpenerPage', {
							...data,
							calendar: _self.defaultCalendar
						})
					}
				})
			},
			toPScorePage(data) {
				const _self = this
				uni.navigateTo({
					url: '/pages/microApp/Sws/performanceManagement/performanceScore/index',
					events: {
						acceptDataFromOpenedPage: function(data) {
							// 刷新数据
							_self.$emit('refreshPage')
						},
					},
					success: function(res) {
						res.eventChannel.emit('acceptDataFromOpenerPage', {
							data: {
								...data,
								type: 'staff',
								heightObj: {
									..._self.heightObj
								}
							}
						})
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.staff-card {
		border-radius: 12rpx;
		margin-top: 20rpx;
		padding: 0 20rpx;

		&-header {
			padding: 20rpx 10rpx 15rpx 10rpx;
		}

		&-content {
			padding: 20rpx 20rpx 26rpx 20rpx;
		}

		.score-btn {
			width: 130rpx;
			height: 64rpx;
			line-height: 64rpx;
			letter-spacing: 10rpx;
			text-indent: 10rpx;
		}
	}

	.staff-card:first-child {
		margin-top: 0;
	}

	.popup-score {
		background: #71d5a1;
		color: #fff;
		padding: 12rpx 20rpx;
		border-radius: 12rpx;
	}
</style>