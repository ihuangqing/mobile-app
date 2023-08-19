<template>
	<view class="sws-wh100 u-flex sws-flex-d-column sws-overflow-hidden">
		<view class="sws-w100 u-flex u-p-20" v-if="isForeman">
			<view class="u-flex-1 u-m-r-20 u-flex">
				<view class="filter-group-label">
					<u-icon name="calendar" label="月度" label-color="#fff" label-size="26"></u-icon>
				</view>
				<u-search search-icon="" shape="square" :show-action="false" input-align="center" :disabled="true"
					placeholder="" :value="calendar" @change="getStaffRecordList" @click="showCalendar = true"></u-search>
			</view>
			<view class="u-flex-1 u-flex filter-group" @click="sortCode = !sortCode">
				<view class="filter-group-label">
					<u-icon name="qiehuan" custom-prefix="sws-icon" label="排序" label-color="#fff" label-size="26"></u-icon>
				</view>
				<view class="filter-group-text u-flex-1 u-text-center">
					<text>{{ sortCode ? '从高到底': '从低到高' }}</text>
				</view>
			</view>
		</view>
		<view class="u-flex-1 sws-w100 sws-bg-ebebeb u-p-20">
			<!-- 组长查询的组员列表 -->
			<staff-component class="sws-wh100" v-if="isForeman" :data-list="staffList" :type="'record'"
				:default-calendar="calendar"></staff-component>
			<!-- 组员的月度绩效信息 -->
			<month-component class="sws-wh100" v-else :default-calendar="calendar"
				:staff-account="staffAccount"></month-component>
		</view>
		<u-picker mode="time" v-model="showCalendar" :params="params" @confirm="calendarConfirm"></u-picker>
		<u-top-tips ref="uTips"></u-top-tips>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	import staffComponent from '../performanceManagement/components/staffList.vue'
	import monthComponent from './components/userMonthRecord.vue'

	export default {
		components: {
			staffComponent,
			monthComponent
		},
		data() {
			return {
				params: {
					year: true,
					month: true,
					day: false,
					hour: false,
					minute: false,
					second: false
				},
				calendar: '',
				showCalendar: false,
				sortCode: true, //排序规则，true从高到底
				staffList: [],
				staffAccount: '', //查询员工的工号
				isForeman: true, //员工类型  true 组长  false员工
			}
		},
		computed: mapState(['userInfo']),
		watch: {
			sortCode: function(newval, oldVal) {
				this.staffList.reverse()
			}
		},
		onLoad() {
			this.initDate()
		},
		methods: {
			initDate() {
				this.$u.api.getTimestamp().then(res => {
					if (res.msgCode === '000000') {
						let time = new Date().getTime()
						if (res.msgCode === '000000' && res.data) {
							time = res.data
						}

						this.calendar = this.$u.timeFormat(time, 'yyyy-mm')
						this.getStaffRole()
					} else {
						this.$refs.uTips.show({
							title: `日期获取失败，原因：${ res.message }`,
							type: 'error',
							duration: 3800
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			//TODO 接口返回判断 角色类型
			// 如果是组长,显示员工列表,如果是其它(组员),直接显示个人绩效记录
			getStaffRecordList() {
				if (this.isForeman) {
					this.$u.api.getStaffRecordList(this.calendar).then(res => {
						if (res.msgCode === '000000') {
							this.staffList = res.data
						} else {
							this.$refs.uTips.show({
								title: `班组人员信息获取失败，原因：${ res.message }`,
								type: 'error',
								duration: 3800
							})
						}
					}).catch(err => {
						this.common.sysErrToast(this, err)
					})
				}
			},
			getStaffRole() {
				this.$u.api.getStaffRole().then(res => {
					if (res.msgCode === '000000') {
						const temp = res.data
						this.isForeman = temp.isForeman
						if (!temp.isForeman) {
							this.staffAccount = this.userInfo.account
						}
					} else {
						this.$refs.uTips.show({
							title: `数据初始化失败，原因：${ res.message }`,
							type: 'error',
							duration: 3800
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			calendarConfirm({
				year,
				month
			}) {
				this.calendar = year + '-' + month
			}
		}
	}
</script>

<style lang="scss" scoped>
	.filter-group {
		height: 64rpx;
		border-radius: 10rpx;
		overflow: hidden;
		font-size: 26rpx;

		&-label {
			height: 64rpx;
			line-height: 64rpx;
			background-color: #2979ff;
			color: #fff;
			padding: 0 30rpx;
			border-top-left-radius: 10rpx;
			border-bottom-left-radius: 10rpx;
		}

		&-text {
			height: 64rpx;
			line-height: 64rpx;
			padding: 0 20rpx;
			border: 2rpx solid #e8e8e8;
			border-top-right-radius: 10rpx;
			border-bottom-right-radius: 10rpx;
		}
	}

	::v-deep .u-content {
		border-top-left-radius: 0 !important;
		border-bottom-left-radius: 0 !important;
		background-color: #fff !important;
		border: 2rpx solid #e8e8e8;
	}

	::v-deep .uni-input-form {
		background-color: #fff !important;
	}
</style>