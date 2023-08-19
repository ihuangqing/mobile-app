<!-- E-Checklist → 点检历史查询 -->
<template>
	<view class="sws-wh100 u-flex sws-flex-d-column">
		<u-cell-group :border="false" class="u-flex-1">
			<u-cell-item hover-class="none" :arrow="false" title="异常条码">
				<u-icon slot="icon" class="u-m-r-20" name="shebeibianma" custom-prefix="sws-icon" size="32"></u-icon>
				<u-input type="text" class="u-p-l-32 u-p-r-20 u-font-26" height="54" input-align="right"
					placeholder-style="fontSize: 26rpx; color:#c0c4cc;" placeholder="请输入/扫描异常条码"
					v-model="model.itemCode">
				</u-input>
				<u-icon slot="right-icon" class="resize-m-r" name="saoma" custom-prefix="sws-icon" size="44"
					color="#2979ff" @click="scanCode('itemCode')"></u-icon>
			</u-cell-item>
			<u-cell-item hover-class="none" title="产品类别" arrow-direction="down"
				:value-style="selectTextColor(model.productionCategory)"
				:value="model.productionCategory ? model.productionCategory : '请选择产品类别'"
				@click="toShowProductionCategory">
				<u-icon slot="icon" class="u-m-r-20" name="chanpinleibie" custom-prefix="sws-icon" size="32"></u-icon>
			</u-cell-item>
			<u-cell-item hover-class="none" title="检验类型" arrow-direction="down"
				:value-style="selectTextColor(model.checkTypes)"
				:value="checkTypesFormat(model.checkTypes) ? checkTypesFormat(model.checkTypes) : '请选择检验类型'"
				@click="toShowCheckTypes">
				<u-icon slot="icon" class="u-m-r-20" name="bianhao" custom-prefix="sws-icon" size="32"></u-icon>
			</u-cell-item>
			<u-cell-item hover-class="none" :arrow="false" title="设备编码">
				<u-icon slot="icon" class="u-m-r-20" name="shebei" custom-prefix="sws-icon" size="32"></u-icon>
				<u-input type="text" class="u-p-l-32 u-p-r-20 u-font-26" height="54" input-align="right"
					placeholder-style="fontSize: 26rpx; color:#c0c4cc;" placeholder="请输入/扫描设备编码"
					v-model="model.deviceSn">
				</u-input>
				<u-icon slot="right-icon" class="resize-m-r" name="saoma" custom-prefix="sws-icon" size="44"
					color="#2979ff" @click="scanCode('deviceSn')"></u-icon>
			</u-cell-item>
			<u-cell-item hover-class="none" title="班次" arrow-direction="down"
				:value-style="selectTextColor(model.shift)"
				:value="model.shift ? (model.shift === 'M' ? '白班': '夜班') : '请选择班次'" @click="toShowShift">
				<u-icon slot="icon" class="u-m-r-20" name="banci" custom-prefix="sws-icon" size="32"></u-icon>
			</u-cell-item>
			<u-cell-item hover-class="none" title="检验人员">
				<u-icon slot="icon" class="u-m-r-20" name="dianjianrenyuan" custom-prefix="sws-icon" size="32"></u-icon>
				<u-input type="text" class="u-p-l-32 u-p-r-20 u-font-26" height="54" input-align="right"
					placeholder-style="fontSize: 26rpx; color:#c0c4cc;" placeholder="请输入检验人员工号"
					v-model="model.checkPersonName" @click="toShowCheckPerson">
				</u-input>
			</u-cell-item>
			<u-cell-item hover-class="none" title="检验结果" arrow-direction="down"
				:value-style="selectTextColor(model.checkResult)"
				:value="model.checkResult ? (model.checkResult == 'OK' ? '合格' : '不合格') : '请选择检验结果'"
				@click="toShowCheckResult">
				<u-icon slot="icon" class="u-m-r-20" name="jianyanjieguo" custom-prefix="sws-icon" size="32"></u-icon>
			</u-cell-item>
			<u-cell-item hover-class="none" title="检验状态" arrow-direction="down"
				:value-style="selectTextColor(model.orderStatus)"
				:value="model.orderStatus ? (model.orderStatus == 1 ? '已检验':'过检已补检') : '请选择检验状态'"
				@click="toShowOrderStatus">
				<u-icon slot="icon" class="u-m-r-20" name="danjuchaxun" custom-prefix="sws-icon" size="32"></u-icon>
			</u-cell-item>
			<u-cell-item hover-class="none" title="起始日期" arrow-direction="down"
				:value-style="selectTextColor(model.startDate)" :value="model.startDate ? model.startDate : '请选择起始日期'"
				@click="openDatePicker(0)">
				<u-icon slot="icon" class="u-m-r-20" name="calendar" size="32"></u-icon>
			</u-cell-item>
			<u-cell-item hover-class="none" title="截止日期" arrow-direction="down"
				:value-style="selectTextColor(model.endDate)" :value="model.endDate ? model.endDate : '请选择截止日期'"
				@click="openDatePicker(1)">
				<u-icon slot="icon" class="u-m-r-20" name="calendar" size="32"></u-icon>
			</u-cell-item>
		</u-cell-group>
		<view class="btn-group sws-w100 sws-w100 u-flex u-row-between u-p-t-28 u-p-b-28">
			<u-button type="default" class="sws-line-h-repair" size="medium" @click="reset">重置</u-button>
			<u-button type="primary" class="sws-line-h-repair" size="medium" @click="commit">确认</u-button>
		</view>
		<u-select v-model="showSelect" :list="selectList" :title="selectTitle" @confirm="confirmSelect"></u-select>
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
				model: {
					itemCode: '', //产品编码
					productionCategory: '', //产品类别
					checkTypes: '', //检验类型
					deviceSn: '', //设备SN
					shift: '', //班次
					checkPersonName: '', //检验人员
					checkPerson: '', //检验人员
					checkResult: '', //检验结果
					orderStatus: '1', //检验状态
					startDate: '',
					endDate: '',
				},
				selectTitle: '',
				selectList: [], //选择列表
				showSelect: false,
				datePickerTitle: '',
				showDatePicker: false
			}
		},
		computed: {
			...mapState(['factoryId']),
			checkTypesFormat(type) {
				return type => { // A:首检检验,B：巡检检验，C:过程检验，D:执行力检验，E:异物检验
					switch (type) {
						case 'A':
							return '首检检验'
							break;
						case 'B':
							return '巡检检验'
							break;
						case 'C':
							return '过程检验'
							break;
						case 'D':
							return '执行力检验'
							break;
						case 'E':
							return '异物检验'
							break;
						case 'F':
							return '参数检验'
							break;
						case 'G':
							return '稽查检验'
							break;
					}
				}
			},
			selectTextColor(val) {
				return val => {
					return val ? {
						'color': '#303133',
						'font-size': '28rpx',
						'padding-right': '20rpx'
					} : {
						'color': '#c0c4cc',
						'font-size': '26rpx',
						'padding-right': '20rpx'
					}
				}
			}
		},
		methods: {
			toShowCheckPerson() {
				this.$u.api.getUsersForExceptionEVC(this.factoryId).then(res => {
					if (res.msgCode === '000000') {
						if (res.data && res.data.length) {
							const list = res.data.map(({
								userName,
								account
							}) => {
								return {
									name: `${ userName }(${ account })`,
									value: `${ userName }-${ account }`,
									checked: false
								}
							})
							this.goToSelected('请选择检验人员', list, 'checkPerson', true, true)
						} else {
							this.$refs.uTips.show({
								title: '暂未查到检验人员数据',
								type: 'warning',
								duration: 2300
							})
						}
					} else {
						this.$refs.uTips.show({
							title: `检验人员获取失败，原因：${ res.message }`,
							type: 'error',
							duration: 2300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			confirmSelect(arr) {
				const temp = arr[0]
				switch (temp.extra) {
					case 'Category':
						this.model.productionCategory = temp.value
						break;
					case 'checkTypes':
						this.model.checkTypes = temp.value
						break;
					case 'shift':
						this.model.shift = temp.value
						break;
					case 'checkResult':
						this.model.checkResult = temp.value
						break
					case 'orderStatus':
						this.model.orderStatus = temp.value
						break
				}
			},
			toShowOrderStatus() {
				this.selectTitle = '请选择检验状态'
				this.selectList = [{
					label: '已检验',
					value: '1',
					extra: 'orderStatus'
				}, {
					label: '过检已补检',
					value: '3',
					extra: 'orderStatus'
				}]
				this.showSelect = true
			},
			toShowCheckResult() {
				this.selectTitle = '请选择检验结果'
				this.selectList = [{
					label: '合格',
					value: 'OK',
					extra: 'checkResult'
				}, {
					label: '不合格',
					value: 'NG',
					extra: 'checkResult'
				}]
				this.showSelect = true
			},
			toShowShift() {
				this.selectTitle = '请选择白夜班'
				this.selectList = [{
					label: '白班',
					value: 'M',
					extra: 'shift'
				}, {
					label: '夜班',
					value: 'E',
					extra: 'shift'
				}]
				this.showSelect = true
			},
			toShowCheckTypes() {
				this.selectTitle = '请选择检验类型'
				this.selectList = [{
					label: '首检检验',
					value: 'A',
					extra: 'checkTypes'
				}, {
					label: '巡检检验',
					value: 'B',
					extra: 'checkTypes'
				}, {
					label: '过程检验',
					value: 'C',
					extra: 'checkTypes'
				}, {
					label: '执行力检验',
					value: 'D',
					extra: 'checkTypes'
				}, {
					label: '异物检验',
					value: 'E',
					extra: 'checkTypes'
				}, {
					label: '参数检验',
					value: 'F',
					extra: 'checkTypes'
				}, {
					label: '稽查检验',
					value: 'G',
					extra: 'checkTypes'
				}]
				this.showSelect = true
			},
			toShowProductionCategory() {
				this.selectTitle = '请选择产品类别'
				this.selectList = [{
					label: 'Cell',
					value: 'Cell',
					extra: 'Category'
				}, {
					label: 'BMS',
					value: 'BMS',
					extra: 'Category'
				}, {
					label: 'Module',
					value: 'Module',
					extra: 'Category'
				}, {
					label: 'Pack',
					value: 'Pack',
					extra: 'Category'
				}]
				this.showSelect = true
			},
			openDatePicker(type) {
				if (!type) {
					this.datePickerTitle = '请选择起始日期'
				} else {
					this.datePickerTitle = '请选择截止日期'
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

				this.dateType ? this.model.endDate = selectedDate : this.model.startDate = selectedDate

				if (selectedDate > curDate || (this.model.startDate && this.model.endDate && this.model.startDate > this
						.model.endDate)) {
					this.$refs.uTips.show({
						title: '请选择有效的日期范围！',
						type: 'warning',
						duration: 2300
					})

					this.dateType ? this.model.endDate = '' : this.model.startDate = ''
				}
			},
			goToSelected(title, list, type, hasSearch = false, isRadio = false) {
				// title 选择列表页面标题  list 选择列表项 type赋值对象的属性名, hasSeach是否需要本地搜索
				let _self = this
				let params = {
					title: title,
					items: list,
					hasSearch,
					isRadio
				}
				uni.navigateTo({
					url: '/pages/common/selectItems/index',
					events: {
						acceptDataFromOpenedPage(res) {
							const temp = res.data[0]
							if (type === 'checkPerson') {
								_self.model.checkPersonName = temp.value.split('-')[0]
								_self.model.checkPerson = temp.value.split('-')[1]
							}
						}
					},
					success: function(res) {
						res.eventChannel.emit('acceptDataFromOpenerPage', params)
					}
				})
			},
			reset() {
				this.model = {
					itemCode: '', //产品编码
					productionCategory: '', //产品类别
					checkTypes: '', //检验类型
					deviceSn: '', //设备SN
					shift: '', //班次
					checkPersonName: '', //检验人员
					checkPerson: '', //检验人员
					checkResult: '', //检验结果
					orderStatus: '1', //检验状态
					startDate: '',
					endDate: '',
				}
			},
			commit() {
				const params = {
					...this.model
				}
				const eventChannel = this.getOpenerEventChannel()
				eventChannel.emit('acceptDataFromQueryPage', params)
				uni.navigateBack()
			},
			async scanCode(type) {
				let code = await this.common.scanCode(this)
				switch (type) {
					case 'itemCode':
						this.model.itemCode = code
						break
					case 'deviceSn':
						this.model.deviceSn = code
						break
				}
			}
		},
		onBackPress() {
			if (this.showSelect) {
				this.showSelect = false
				return true
			}

			if (this.showDatePicker) {
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

	.resize-m-r {
		margin-right: -10rpx;
	}

	::v-deep .u-cell {
		padding: 20rpx 32rpx;
	}
</style>
