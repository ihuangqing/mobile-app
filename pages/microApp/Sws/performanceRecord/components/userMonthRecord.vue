<template>
	<view class="sws-wh100">
		<view class="month-info">
			<view class="u-flex">
				<view class="u-flex-1 u-p-l-20">
					<view>
						<text class="u-font-36">{{ staff.userName }}</text>
						<text>（{{ staff.account }}）</text>
					</view>
					<view class="u-font-28 u-m-t-10">
						<u-icon name="wodeshenqing" custom-prefix="sws-icon" size="28"></u-icon>
						<text class="u-m-l-6">{{ staff.lineName }}-{{ staff.mesArea }}-{{ staff.postName }}</text>
					</view>
				</view>
				<view class="score-value">
					<view class="sws-font-fff score-value-up">
						<text class="u-font-40">{{ staff.totalScore }}</text>
						<text class="u-font-24 u-m-l-4">分</text>
					</view>
					<view class="score-value-down">绩效得分</view>
				</view>
			</view>
			<view class="u-flex plus-reduce">
				<view class="plus-reduce-item u-flex-1">
					<text class="u-font-28 sws-text-h-repair">减分</text>
					<text class="plus-reduce-item-big-text sws-text-h-repair">{{ staff.minusScore }}</text>
					<text class="u-font-28 sws-text-h-repair">分</text>
				</view>
				<view class="plus-reduce-item u-flex-1 u-m-l-30">
					<text class="u-font-28 sws-text-h-repair">加分</text>
					<text class="plus-reduce-item-big-text sws-text-h-repair">{{ staff.addScore }}</text>
					<text class="u-font-28 sws-text-h-repair">分</text>
				</view>
			</view>
		</view>
		<uni-calendar class="uni-calendar--hook" date="" :selected="staff.selected" :showMonth="true" :showToday="false"
			:showSelected="false" @change="change" @monthSwitch="monthSwitch" />
		<u-modal v-model="showModal" :title="selectedDate.date + '评分记录'">
			<view class="u-p-30">
				<view class="popup-item u-m-t-16" v-for="(score, index) in selectedDate.data" :key="index">
					<text>{{score.scoreCode}}.{{score.scoreDesc}}</text>
					<u-tag :text="`${+score.scoreRule ? '+': '-'}${score.scoreValue}`" mode="light" class="u-m-l-8"
						:closeable="false" size="mini"
						:type="score.scoreValue == 100 ? 'info': (+score.scoreRule ? 'success': 'error')" />
					<u-tag :text="score.stateDesc" mode="dark" class="u-m-l-8" :closeable="false" size="mini"
						:type="handleState(score.state)" />
				</view>
			</view>
		</u-modal>
		<u-top-tips ref="uTips"></u-top-tips>
	</view>
</template>

<script>
	export default {
		props: ['defaultCalendar', 'staffAccount'],
		data() {
			return {
				calendar: '',
				staff: {},
				selectedDate: {},
				showModal: false
			}
		},
		watch: {
			calendar: {
				handler: function(newVal, oldVal) {
					if (newVal) {
						this.getStaffRecord()
					}
				},
				immediate: true
			}
		},
		mounted() {
			this.calendar = this.defaultCalendar
		},
		methods: {
			getStaffRecord() {
				this.$u.api.getStaffRecord({
					months: this.calendar,
					account: this.staffAccount
				}).then(res => {
					console.log('res: ', res)
					if (res.msgCode === '000000' && res.data) {
						const temp = res.data
						this.staff = {
							...temp
						}
						if (temp.dayList && temp.dayList.length) {
							this.staff.selected = temp.dayList.map(item => {
								return {
									date: item.workDate,
									info: item.stateDesc,
									infoType: this.handleState(item.state),
									data: item.recordList,
									badge: {
										type: item.score < 0 ? 'error' : 'success',
										text: item.score
									}
								}
							})
						} else {
							this.$refs.uTips.show({
								title: `${this.calendar}月无绩效评分记录！`,
								type: 'warning',
								duration: 3800
							})
						}

						this.$nextTick(() => {
							this.showCalendar = true
						})
					} else {
						this.$refs.uTips.show({
							title: `绩效信息获取失败，原因：${ res.message }`,
							type: 'error',
							duration: 3800
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			handleState(state) {
				//1-已作废,2-已确认,3-待确认,4-已驳回
				let infoType = ''
				switch (+state) {
					case 1:
						infoType = 'info'
						break;
					case 2:
						infoType = 'success'
						break;
					case 3:
						infoType = 'warning'
						break;
					case 4:
						infoType = 'error'
						break;
				}
				return infoType
			},
			monthSwitch({
				year,
				month
			}) {
				const correctM = month < 10 ? '0' + month : month
				this.calendar = year + '-' + correctM
			},
			change({
				fulldate
			}) {
				if (this.staff.selected) {
					const tempArr = this.staff.selected.filter(item => item.date === fulldate)
					if (tempArr.length) {
						this.selectedDate = tempArr[0]
						console.log('this.selectedDate: ', this.selectedDate)
						this.showModal = true
					}
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.month-info {
		background-color: #2979ff;
		border-top-left-radius: 12rpx;
		border-top-right-radius: 12rpx;
		color: #fff;
		padding: 30rpx 20rpx;

		.score-value {
			background-color: #fff;
			border-radius: 12rpx;
			text-align: center;
			overflow: hidden;
			margin: 0 10rpx;

			&-up {
				padding: 8rpx 20rpx;
				color: #20d9e6;
				font-weight: bold;
			}

			&-down {
				padding: 6rpx 20rpx;
				background-color: #20d9e6;
				font-size: 24rpx;
			}
		}

		.plus-reduce {
			margin-top: 30rpx;
			padding: 0 10rpx;

			&-item {
				position: relative;
				height: 80rpx;
				line-height: 48rpx;
				background-color: #fff;
				max-width: 360rpx;
				border-radius: 16rpx;
				padding: 16rpx 90rpx 16rpx 20rpx;
				text-align: center;
				background-color: #0fd1be;
				overflow: hidden;
				z-index: 1;

				&-big-text {
					font-size: 44rpx;
					margin: 0 6rpx;
				}
			}

			&-item:first-child {
				background-color: #ef7a82;
			}

			&-item::after {
				position: absolute;
				content: '加';
				width: 70rpx;
				height: 70rpx;
				line-height: 70rpx;
				border-radius: 70rpx;
				font-size: 48rpx;
				font-weight: bold;
				color: #fff;
				text-align: center;
				border: 4rpx solid #fff;
				transform: rotate3d(0, 0, 1, -45deg);
				right: -14rpx;
				bottom: -14rpx;
				opacity: 0.35;
				z-index: 0;
			}

			&-item:first-child::after {
				content: '减';
			}
		}
	}
</style>