<template>
	<view class="sws-wh100">
		<view class="date-tab u-flex u-row-between u-p-l-30 u-p-r-40">
			<view class="date-box" v-show="currMonth" @click="showPicker = true">
				<u-icon name="calendar" size="32" color="#2979ff" :label="$u.timeFormat(new Date(currMonth), 'yyyy-mm')"
					label-color="#2979ff"></u-icon>
			</view>
			<view class="u-flex" v-show="currWeek">
				<view class="u-p-20" @click="toPrevWeek">
					<u-icon name="arrow-left" size="36" :color="currWeek == 1 ? '#909399' : '#2979ff'"></u-icon>
				</view>
				<view class="u-font-30 u-type-primary">第{{ '一二三四五六七'.charAt(currWeek - 1) }}周</view>
				<view class="u-p-20" @click="toNextWeek">
					<u-icon name="arrow-right" size="36" :color="currWeek == currMax ? '#909399' : '#2979ff'"></u-icon>
				</view>
			</view>
		</view>
		<view class="schedule-wrap u-p-l-10 u-p-r-10">
			<u-row gutter="0" class="date-wrap u-m-b-10">
				<u-col span="1.8">
					<view></view>
				</u-col>
				<u-col span="10.2">
					<u-grid :col="7" align="center" hover-class="none" :border="false" class="repair-h">
						<u-grid-item
							:custom-style="{padding: '16rpx 10rpx 12rpx 10rpx', color: thIndex > 4 ? '#b45552' : '#2651bc'}"
							:bg-color="thIndex > 4 ? '#fde2e2':'#e2eaff'" v-for="(th, thIndex) in manpowerCheckPos"
							:key="thIndex">
							<view class="u-font-24">{{ ['一', '二', '三', '四', '五', '六', '日'][thIndex] }}</view>
							<view class="u-font-26 sws-font-bold u-m-t-4">{{ th.schedulingDate.substring(8, 10) }}
							</view>
						</u-grid-item>
					</u-grid>
				</u-col>
			</u-row>
			<view class="sws-w100 card-wrap">
				<u-row gutter="0" v-for="(user, userIndex) in list" :key="userIndex">
					<u-col span="1.8" class="sws-w100 u-border-bottom u-flex">
						<view class="u-text-center u-flex-1">{{ user.userName }}</view>
					</u-col>
					<u-col span="10.2">
						<u-grid :col="7" align="center" hover-class="none" class="repair-h">
							<u-grid-item :custom-style="{padding: '24rpx 8rpx 16rpx 8rpx'}" class="day-card"
								v-for="(card, cardIndex) in user.info" :key="cardIndex">
								<u-empty :show="card.shiftName ? false : true" text="无数据" mode="favor" :icon-size="32"
									font-size="24"></u-empty>
								<u-icon :name="computedShift(card.shiftCode).shiftName" custom-prefix="sws-icon"
									:size="36" :color="computedShift(card.shiftCode).shiftColor"></u-icon>
								<view class="day-card-text u-m-t-10 u-content-color">{{ card.shiftName }}</view>
								<view class="is-signIn" v-show="+card.isSignIn">
									<u-icon name="dot" custom-prefix="sws-icon" :size="40" color="#19be6b"></u-icon>
								</view>
							</u-grid-item>
						</u-grid>
					</u-col>
				</u-row>
			</view>
		</view>
		<u-picker v-model="showPicker" mode="time" :params="params" @confirm="pickerConfirm"></u-picker>
		<u-top-tips ref="uTips" :z-index="999999"></u-top-tips>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'

	export default {
		data() {
			return {
				today: new Date(),
				currMonth: '',
				currWeek: '',
				currMax: 6, //当前月最大的周
				showPicker: false,
				showPopup: false,
				params: {
					year: true,
					month: true,
					day: false,
					hour: false,
					minute: false,
					second: false
				},
				currInfo: {},
				manpowerCheckPos: [],
				list: [],
			}
		},
		computed: {
			...mapState(['userInfo']),
			computedShift(shift) {
				return shift => {
					if (shift) {
						switch (shift) {
							case 'A':
								return {
									shiftName: 'baiban',
										shiftColor: '#feac11'
								}
								break;
							case 'B':
								return {
									shiftName: 'yeban',
										shiftColor: '#774aa6'
								}
								break;
							case 'O':
								return {
									shiftName: 'xiujia',
										shiftColor: '#19be6b'
								}
								break;
						}
					} else {
						return {
							shiftName: '',
							shiftColor: ''
						}
					}
				}
			}
		},
		onLoad() {
			this.getScheduleData({
				account: this.userInfo.account
			})
		},
		methods: {
			getScheduleData(params = {
				account: this.userInfo.account,
				month: this.currMonth,
				weekNum: this.currWeek
			}) {
				this.$u.api.getScheduleInfoForShow(params).then(res => {
					if (res.msgCode === '000000' && res.data) {
						this.today = res.data.today
						if (!this.currMonth) {
							this.currMonth = res.data.today.substring(0, 7)
							this.currWeek = this.getMonthWeek(res.data.today)
						}

						this.manpowerCheckPos = res.data.manpowerCheckPos

						const userList = res.data.officialInfoVos.map(user => {
							const info = res.data.manpowerCheckPos.map(item => {
								let res = {
									account: user.account,
									userName: user.userName,
									shiftCode: ''
								}
								for (let i = 0; i < user.officialList.length; i++) {
									const tempOffList = user.officialList[i]
									if (tempOffList.schedulingDate === item.schedulingDate) {
										res = {
											...tempOffList
										}
									}
								}
								return res
							})
							return {
								account: user.account,
								userName: user.userName,
								info
							}
						})
						this.list = userList
					} else {
						this.$refs.uTips.show({
							title: `排班数据获取失败，原因：${ res.message }`,
							type: 'error',
							duration: 2300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			toPrevWeek() {
				if (this.currWeek == 1) return
				this.currWeek--
				this.getScheduleData()
			},
			toNextWeek() {
				if (this.currWeek == this.currMax) return
				this.currWeek++
				this.getScheduleData()
			},
			pickerConfirm({
				year,
				month
			}) {
				const ym = year + '-' + month
				if (this.currMonth === ym) return
				this.currMonth = ym
				this.currMax = this.getWeeks(ym)
				this.currWeek = 1
				this.getScheduleData()
			},
			getMonthWeek(date = new Date()) {
				const curDate = new Date(date)
				const a = curDate.getDay()
				const b = a ? a : 7
				const c = curDate.getDate()
				return Math.ceil((c + 7 - b) / 7)
			},
			getWeeks(date = new Date()) {
				const year = new Date(date).getFullYear()
				const month = new Date(date).getMonth()
				var d = new Date()
				d.setFullYear(year, month, 1)
				var w1 = d.getDay()
				if (w1 == 0) w1 = 7
				d.setFullYear(year, month + 1, 0)
				var w2 = d.getDay()
				if (w2 == 0) w2 = 7
				var dd = d.getDate()
				let week_count = Math.ceil((dd + w1 - 1 + 7 - w2) / 7)
				return week_count
			}
		},
		onBackPress() {
			if (this.showPicker) {
				this.showPicker = false
				return true
			}
		}
	}
</script>

<style lang="scss" scoped>
	.popup-wrap {
		position: absolute;
		bottom: 30rpx;
		left: 30rpx;
		width: calc(100% - 60rpx);
		height: 800rpx;
		background: #fff;
		border-radius: 24rpx;
		overflow: hidden;
	}

	::v-deep.u-drawer .u-drawer-content {
		background-color: transparent !important;
	}

	.date-tab {
		height: 80rpx;

		.date-box {
			box-shadow: 0 0 4rpx 2rpx #ebebeb;
			padding: 0 20rpx 0 12rpx;
			line-height: 60rpx;
			height: 56rpx;
			border-radius: 8rpx;
		}
	}

	.schedule-wrap {
		width: 100%;
		height: calc(100% - 100rpx);
		overflow: hidden;

		.date-wrap {
			height: 100rpx;
		}

		.repair-h {
			align-items: normal !important;
		}

		.card-wrap {
			height: calc(100% - 110rpx);
			overflow: scroll;

			.day-card {
				position: relative;

				&-text {
					width: 100%;
					font-size: 24rpx;
					text-align: center;
				}

				.is-signIn {
					position: absolute;
					top: -4rpx;
					right: 0;
					width: 40rpx;
					height: 40rpx;
				}
			}

			.day-card.tips::before {
				content: '';
				position: absolute;
				top: 0;
				width: 100%;
				height: 8rpx;
				background-color: #2979ff;
				border-bottom-left-radius: 8rpx;
				border-bottom-right-radius: 8rpx;
			}

			.day-card.warning::before {
				content: '';
				position: absolute;
				top: 0;
				width: 100%;
				height: 8rpx;
				background-color: #ff9900;
				border-bottom-left-radius: 8rpx;
				border-bottom-right-radius: 8rpx;
			}

			.day-card.error::before {
				content: '';
				position: absolute;
				top: 0;
				width: 100%;
				height: 8rpx;
				background-color: #fa3534;
				border-bottom-left-radius: 8rpx;
				border-bottom-right-radius: 8rpx;
			}
		}
	}

	.user-info {
		padding: 30rpx 30rpx 70rpx 60rpx;
		background: linear-gradient(to right, #2979ff, #65c7f7, #9cecfb);

		&-date {
			background-color: #2979ff;
			border-radius: 12rpx;
		}
	}

	.btn-style {
		margin-right: 20rpx;
		letter-spacing: 28rpx;
		text-indent: 20rpx;
	}

	.post-card {
		position: relative;
		padding: 30rpx 30rpx 20rpx 30rpx;
		border: 2rpx solid #e8e8e8;
		border-radius: 16rpx;

		&-edit {
			position: absolute;
			background-color: #fff;
			top: -20rpx;
			right: 50rpx;
			padding: 0 20rpx;
		}
	}

	::v-deep .card-wrap .u-row {
		align-items: normal !important;
	}

	.info-layout {
		height: 190rpx;
		background: #f0f4fe;
		border-radius: 16rpx;
		padding-top: 4rpx;
		align-items: center;
		justify-content: center;
		flex-direction: column;
	}

	.check-tips {
		position: absolute;
		left: 30rpx;
		bottom: 20rpx;
		width: 100%;
		padding-left: 10rpx;
		border-top-left-radius: 80rpx;
		border-bottom-left-radius: 80rpx;
		background-color: #ecf5ff;
	}

	::v-deep .info-layout .u-radio {
		display: flex !important;
		flex-direction: column-reverse !important;
	}

	::v-deep .info-layout .u-radio__label {
		width: 100% !important;
		margin: 0 !important;
		text-align: center !important;
	}

	::v-deep .day-card .u-empty {
		flex-direction: row !important;
	}
</style>
