<!-- E-Checklist → 点检历史查询 -->
<template>
	<view class="sws-wh100 u-flex sws-flex-d-column">
		<u-cell-group :border="false" class="u-flex-1">
			<u-cell-item hover-class="none" :arrow="false" title="设备名称">
				<u-icon slot="icon" class="u-m-r-20" name="shebei" custom-prefix="sws-icon" size="32"></u-icon>
				<u-input type="text" class="u-p-l-32" input-align="right" placeholder-style="fontSize:26rpx"
					placeholder="请输入设备名称" v-model="deviceName">
				</u-input>
			</u-cell-item>
			<u-cell-item hover-class="none" :arrow="false" title="设备编码">
				<u-icon slot="icon" class="u-m-r-20" name="shebeibianma" custom-prefix="sws-icon" size="32"></u-icon>
				<u-input type="text" class="u-p-l-32" input-align="right" placeholder-style="fontSize:26rpx"
					placeholder="请输入设备编码" v-model="deviceCode">
				</u-input>
			</u-cell-item>
			<u-cell-item hover-class="none" title="存放区域" arrow-direction="down"
				:value-style="areaName ? {color: '#303133', 'font-size': '28rpx'} : {'font-size': '26rpx'}"
				:value="areaName ? areaName : '请选择存放区域'" @click="getAreas">
				<u-icon slot="icon" class="u-m-r-20" name="cunfangquyu" custom-prefix="sws-icon" size="32"></u-icon>
			</u-cell-item>
			<u-cell-item hover-class="none" title="起始日期" arrow-direction="down"
				:value-style="startDate ? {color: '#303133', 'font-size': '28rpx'} : {'font-size': '26rpx'}"
				:value="startDate ? startDate : '请选择起始日期'" @click="openDatePicker(0)">
				<u-icon slot="icon" class="u-m-r-20" name="calendar" size="32"></u-icon>
			</u-cell-item>
			<u-cell-item hover-class="none" title="截止日期" arrow-direction="down"
				:value-style="deadDate ? {color: '#303133', 'font-size': '28rpx'} : {'font-size': '26rpx'}"
				:value="deadDate ? deadDate : '请选择截止日期'" @click="openDatePicker(1)">
				<u-icon slot="icon" class="u-m-r-20" name="calendar" size="32"></u-icon>
			</u-cell-item>
			<u-cell-item hover-class="none" :arrow="false" title="点检人员" arrow-direction="down">
				<u-icon slot="icon" class="u-m-r-20" name="dianjianrenyuan" custom-prefix="sws-icon" size="32"></u-icon>
				<u-input type="text" class="u-p-l-32" input-align="right" placeholder-style="fontSize:26rpx"
					placeholder="请输入点检人" v-model="checker">
				</u-input>
			</u-cell-item>
			<u-cell-item hover-class="none" :arrow="false" title="确认人员" arrow-direction="down">
				<u-icon slot="icon" class="u-m-r-20" name="ligangqueren" custom-prefix="sws-icon" size="32"></u-icon>
				<u-input type="text" class="u-p-l-32" input-align="right" placeholder-style="fontSize:26rpx"
					placeholder="请输入确认人" v-model="checkIncharge">
				</u-input>
			</u-cell-item>
		</u-cell-group>
		<view class="btn-group sws-w100 sws-w100 u-flex u-row-between u-p-t-28 u-p-b-28">
			<u-button type="default" size="medium" @click="reset">重置</u-button>
			<u-button type="primary" size="medium" @click="commit">确认</u-button>
		</view>
		<u-select v-model="showSelect" :list="areaList" title="请选择存放区域" @confirm="confirmSelect"></u-select>
		<u-picker v-model="showDatePicker" mode="time" :title="datePickerTitle" @confirm="confirmDate"></u-picker>
		<u-top-tips ref="uTips"></u-top-tips>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'

	export default {
		data() {
			return {
				deviceName: '',
				deviceCode: '',
				areaName: '',
				areaId: '',
				startDate: '',
				deadDate: '',
				checker: '',
				checkIncharge: '',
				dateType: '', //区分起始日期，截止日期
				areaList: [],
				showSelect: false,
				datePickerTitle: '',
				showDatePicker: false
			}
		},
		computed: mapState(['factoryId']),
		methods: {
			getAreas() { //获取区域列表
				const params = {
					factoryId: this.factoryId
				}
				this.$u.api.getAreas(params).then(res => {
					if (res.msgCode === '000000') {
						if (res.data.length > 0) {
							this.areaList = res.data.map(item => {
								return {
									label: item.areaName,
									value: item.id
								}
							})
							this.showSelect = true
						} else {
							this.$refs.uTips.show({
								title: '存放区域查询为空',
								type: 'warning',
								duration: 2300
							})
						}
					} else {
						this.$refs.uTips.show({
							title: `存放区域获取失败，原因：${res.message}`,
							type: 'error',
							duration: 2300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			confirmSelect(res) {
				this.areaName = res[0].label
				this.areaId = res[0].value
			},
			openDatePicker(type) {
				if (!type) {
					this.datePickerTitle = '请选择起始日期'
					this.curDate = 'startDate'
				} else {
					this.datePickerTitle = '请选择截止日期'
					this.curDate = 'deadDate'
				}
				this.dateType = type
				this.showDatePicker = true
			},
			confirmDate(date) {
				let curDate = this.$u.timeFormat(new Date()) //当前日期 yy-mm-dd
				let selectedDate = this.$u.timeFormat(date.timestamp) //选择的日期 yy-mm-dd

				if (selectedDate > curDate) {
					this.$refs.uTips.show({
						title: '请选择有效的日期范围！',
						type: 'warning',
						duration: 2300
					})
					return
				}

				this.dateType ? this.deadDate = selectedDate : this.startDate = selectedDate

				if (selectedDate > curDate || (this.startDate && this.deadDate && this.startDate > this.deadDate)) {
					this.$refs.uTips.show({
						title: '请选择有效的日期范围！',
						type: 'warning',
						duration: 2300
					})

					this.dateType ? this.deadDate = '' : this.startDate = ''
				}
			},
			reset() {
				this.deviceName = ''
				this.deviceCode = ''
				this.areaName = ''
				this.areaId = ''
				this.startDate = ''
				this.deadDate = ''
				this.checker = ''
				this.checkIncharge = ''
			},
			commit() {
				if (!this.deviceName && !this.deviceCode && !this.areaName && !this.startDate && !this.deadDate && !this
					.checker && !this.checkIncharge) {
					this.$refs.uTips.show({
						title: '请输入查询条件',
						type: 'warning',
						duration: 2300
					})
					return
				}

				const _self = this
				const eventChannel = this.getOpenerEventChannel()
				eventChannel.emit('acceptDataFromOpenedPage', {
					params: {
						deviceName: _self.deviceName,
						deviceCode: _self.deviceCode,
						areaId: _self.areaId,
						startDate: _self.startDate,
						deadDate: _self.deadDate,
						checker: _self.checker,
						checkIncharge: _self.checkIncharge
					}
				})
				uni.navigateBack()
			}
		},
		onBackPress() {
			if (this.showSelect) {
				this.showSelect = false
				return true
			} else if (this.showDatePicker) {
				this.showDatePicker = false
				return true
			}
		}
	}
</script>

<style lang="scss" scoped>
	.btn-group {
		text-indent: 20rpx;
		letter-spacing: 20rpx;
	}
</style>
