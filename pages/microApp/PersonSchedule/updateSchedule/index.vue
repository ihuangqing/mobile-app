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
							:key="thIndex" @click="toShowPersonCheck(th)">
							<view class="u-font-24">{{ ['一', '二', '三', '四', '五', '六', '日'][thIndex] }}</view>
							<view class="u-font-26 sws-font-bold u-m-t-4">{{ th.schedulingDate.substring(8, 10) }}
							</view>
							<view v-if="th.result" class="person-check">
								<text
									:class="th.result == 'OK' ? 'u-type-success': 'u-type-error'">{{ th.result }}</text>
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
							<u-grid-item :custom-style="{padding: '16rpx 8rpx'}" class="day-card"
								:class="computedStatus(card)" v-for="(card, cardIndex) in user.info" :key="cardIndex"
								@click="toEdit(card)">
								<u-empty :show="card.shiftName ? false : true" text="无数据" mode="favor" :icon-size="32"
									font-size="24"></u-empty>
								<u-icon :name="computedShift(card.shiftCode).shiftName" custom-prefix="sws-icon"
									:size="36" :color="computedShift(card.shiftCode).shiftColor"></u-icon>
								<view class="day-card-text u-line-1">{{ card.lineCode }}</view>
								<view class="day-card-text u-line-1">{{ card.postName }}</view>
							</u-grid-item>
						</u-grid>
					</u-col>
				</u-row>
			</view>
		</view>
		<u-popup v-model="showPopup" mode="bottom" duration="0" length="840rpx">
			<view class="sws-wh100 u-rela">
				<view class="sws-w100 popup-wrap u-flex sws-flex-d-column">
					<view class="sws-w100 user-info u-m-b-20 u-rela">
						<view class="u-flex">
							<view class="u-flex-1 sws-font-fff">
								<view class="u-font-40 sws-font-fff sws-font-bold u-p-b-10">排班信息</view>
								<view class="u-font-32 u-m-b-8">{{ currInfo.userName }}</view>
								<view class="u-font-26">{{ currInfo.account }}</view>
							</view>
							<view class="user-info-date u-flex sws-flex-d-column sws-font-fff">
								<view class="u-p-t-16 u-p-b-16 u-font-30">
									星期{{ "日一二三四五六".charAt(new Date(currInfo.schedulingDate).getDay()) }}</view>
								<u-line length="85%" color="#ffffff" :hair-line="false"></u-line>
								<view class="u-font-24 u-p-t-8 u-p-b-8 u-p-l-20 u-p-r-20 sws-line-h-repair">
									{{ currInfo.schedulingDate && currInfo.schedulingDate.substring(0, 10) }}
								</view>
							</view>
						</view>
						<view v-if="currInfo.doType" class="check-tips">
							<u-icon name="dot" custom-prefix="sws-icon" size="32" margin-left="0"
								:label="currInfo.describe" label-size="24"
								:color="currInfo.doType == 1 ? '#2979ff' : (currInfo.doType == 2) ? '#ff9900': '#fa3534'"
								:label-color="currInfo.doType == 1 ? '#2979ff' : (currInfo.doType == 2) ? '#ff9900': '#fa3534'">
							</u-icon>
						</view>
					</view>
					<view class="sws-w100 u-flex-1 u-p-t-30 u-p-r-30 u-p-l-30">
						<view class="post-card u-flex">
							<view class="post-card-edit" @click="toChangeLinePost">
								<u-icon name="bianji" custom-prefix="sws-icon" size="32" color="#2979ff"
									label-pos="right" label="编辑" label-color="#2979ff"></u-icon>
							</view>
							<view class="u-flex-1 u-text-center">
								<u-icon name="laxian" custom-prefix="sws-icon" color="#606266" size="24" label="拉线"
									label-color="#606266" label-size="24"></u-icon>
								<view class="u-main-color u-m-t-12 u-font-28">{{ currInfo.lineCode }}</view>
							</view>
							<view class="u-flex-1 u-text-center">
								<u-icon name="gongduan" custom-prefix="sws-icon" color="#606266" size="24" label="工段"
									label-color="#606266" label-size="24"></u-icon>
								<view class="u-main-color u-m-t-12 u-font-28">{{ currInfo.mesArea }}</view>
							</view>
							<view class="u-flex-1 u-text-center">
								<u-icon name="gongxu" custom-prefix="sws-icon" color="#606266" size="24" label="岗位"
									label-color="#606266" label-size="24"></u-icon>
								<view class="u-main-color u-m-t-12 u-font-28">{{ currInfo.postName }}</view>
							</view>
						</view>
						<u-radio-group class="sws-w100 u-m-t-30" icon-size="28" v-model="currInfo.shiftCode"
							@change="radioChange">
							<u-row class="sws-w100">
								<u-col span="4">
									<view class="info-layout">
										<u-radio shape="circle" name="A" active-color="#feac11">
											<u-icon name="baiban" custom-prefix="sws-icon" class="u-m-b-16" size="56"
												margin-top="-16" label="白班" label-pos="bottom"
												:color="currInfo.shiftCode === 'A' ? '#feac11' : ''"
												:label-color="currInfo.shiftCode === 'A' ? '#feac11' : ''"></u-icon>
										</u-radio>
									</view>
								</u-col>
								<u-col span="4">
									<view class="info-layout">
										<u-radio shape="circle" name="B" active-color="#774aa6">
											<u-icon name="yeban" custom-prefix="sws-icon" class="u-m-b-16" size="56"
												margin-top="-16" label="夜班" label-pos="bottom"
												:color="currInfo.shiftCode === 'B' ? '#774aa6' : ''"
												:label-color="currInfo.shiftCode === 'B' ? '#774aa6' : ''"></u-icon>
										</u-radio>
									</view>
								</u-col>
								<u-col span="4">
									<view class="info-layout">
										<u-radio shape="circle" name="O" active-color="#19be6b">
											<u-icon name="xiujia" custom-prefix="sws-icon" class="u-m-b-16" size="56"
												margin-top="-16" label="休息" label-pos="bottom"
												:color="currInfo.shiftCode === 'O' ? '#19be6b' : ''"
												:label-color="currInfo.shiftCode === 'O' ? '#19be6b' : ''"></u-icon>
										</u-radio>
									</view>
								</u-col>
							</u-row>
						</u-radio-group>
					</view>
					<view class="sws-w100 u-p-30 u-flex">
						<u-button class="btn-style" @click="showPopup = false">关闭</u-button>
						<u-button type="primary" class="u-flex-1" @click="toUpdateSchedule">确认变更</u-button>
					</view>
				</view>
			</view>
		</u-popup>
		<u-select v-model="showSelect" mode="mutil-column-auto" title="请选择拉线|工段|岗位" :list="selectList"
			@confirm="selectConfirm"></u-select>
		<u-picker v-model="showPicker" mode="time" :params="params" @confirm="pickerConfirm"></u-picker>
		<u-modal v-model="showPersonCheck" title="需求人力校验结果">
			<view class="u-p-40">
				<view class="u-text-center">
					<u-icon :name="checkInfo.result" custom-prefix="sws-icon" size="50"
						:color="checkInfo.result == 'OK' ? '#19be6b': '#fa3534'"></u-icon>
				</view>
				<view class="u-text-center u-font-26 u-m-t-20">{{ checkInfo.desc1 }}</view>
				<view class="u-text-center u-font-26 u-m-t-8">{{ checkInfo.desc2 }}</view>
			</view>
		</u-modal>
		<u-modal v-model="showModal" :content="modalContent"></u-modal>
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
				selectList: [],
				showSelect: false,
				modalContent: '',
				showModal: false,
				checkInfo: {},
				showPersonCheck: false,
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
			},
			computedStatus(info) {
				return info => {
					const status = info.doType
					const date = info.schedulingDate
					let className = ''
					switch (status) {
						case 1:
							className = 'tips'
							break;
						case 2:
							className = 'warning'
							break;
						case 3:
							className = 'error'
							break;
					}

					if (new Date(date).getTime() <= new Date(this.today).getTime()) {
						className = className + ' filter-gray'
					}
					return className
				}
			}
		},
		onLoad() {
			this.getScheduleData({
				account: this.userInfo.account
			})
		},
		methods: {
			radioChange(shiftCode) {
				switch (shiftCode) {
					case 'A':
						this.currInfo.shiftName = '白班'
						break
					case 'B':
						this.currInfo.shiftName = '夜班'
						break
					case 'O':
						this.currInfo.shiftName = '休息'
						break
				}
			},
			toUpdateView(res) {
				this.manpowerCheckPos = this.manpowerCheckPos.map(item => {
					return item.schedulingDate == res.manpowerCheckVo.schedulingDate ? res.manpowerCheckVo : item
				})

				let tempList = []
				this.list.forEach(item => {
					if (res.account === item.account) {
						const tempInfo = item.info.map(temp => {
							let result = temp
							if (temp.shiftCode) {
								result = res.officials.filter(tempItem => tempItem.schedulingDate == temp
									.schedulingDate)[0]
							}
							return result
						})

						tempList.push({
							account: item.account,
							userName: item.userName,
							info: tempInfo
						})
					} else {
						tempList.push(item)
					}
				})

				this.list = tempList
			},
			toShowPersonCheck(info) {
				this.checkInfo = {
					result: info.result,
					desc1: `班组允许排班人力为${ info.allowNumber }人`,
					desc2: `班组已排人力为${ info.actualNumber }人`
				}
				this.showPersonCheck = true
			},
			toUpdateSchedule() {
				const params = {
					...this.currInfo,
					month: this.currMonth,
					weekNum: this.currWeek //第几周
				}
				this.$u.api.postUpdateSchedule(params).then(res => {
					if (res.msgCode === '000000' && res.data) {
						this.showPopup = false
						this.toUpdateView(res.data)
						this.modalContent = '变更排班成功'
						this.showModal = true
					} else {
						this.$refs.uTips.show({
							title: `变更排班失败，原因：${ res.message }`,
							type: 'error',
							duration: 2300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			selectConfirm(arr) {
				this.currInfo.lineCode = arr[0].label
				this.currInfo.mesArea = arr[1].label
				this.currInfo.postName = arr[2].label
				this.currInfo.postId = +arr[2].value
			},
			toChangeLinePost() {
				this.$u.api.getLinePostsList().then(res => {
					if (res.msgCode === '000000' && res.data) {
						this.selectList = res.data
						this.showSelect = true
					} else {
						this.$refs.uTips.show({
							title: `拉线工段岗位数据获取失败，原因：${ res.message }`,
							type: 'error',
							duration: 2300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			getScheduleData(params = {
				account: this.userInfo.account,
				month: this.currMonth,
				weekNum: this.currWeek
			}) {
				this.$u.api.getScheduledata(params).then(res => {
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
			toEdit(info) {
				if (!info.shiftCode) return
				if (new Date(info.schedulingDate).getTime() <= new Date(this.today).getTime()) return
				this.currInfo = {
					describe: '',
					...info
				} //缓存当前日期的排班信息
				this.showPopup = true
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
			if (this.showPopup) {
				this.showPopup = false
				return true
			} else if (this.showPersonCheck) {
				this.showPersonCheck = false
				return true
			} else if (this.showPicker) {
				this.showPicker = false
				return true
			} else if (this.showModal) {
				this.showModal = false
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
			height: 150rpx;

			.person-check {
				background-color: #fff;
				width: 100%;
				height: 32rpx;
				line-height: 32rpx;
				bottom: 2rpx;
				text-align: center;
				font-size: 24rpx;
				margin-top: 12rpx;
				border-radius: 16rpx;
			}
		}

		.repair-h {
			align-items: normal !important;
		}

		.card-wrap {
			height: calc(100% - 160rpx);
			overflow: scroll;

			.day-card {

				&-text {
					width: 100%;
					font-size: 24rpx;
					text-align: center;
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

	.filter-gray {
		filter: brightness(0.95);
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
