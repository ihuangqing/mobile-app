<!-- 设备信息（编号）查询 -->
<template>
	<view class="sws-wh100 u-flex sws-flex-d-column">
		<view class="sws-w100 u-flex-1">
			<u-cell-group :border="false" class="u-flex-1">
				<u-cell-item hover-class="none" title="所属线体" arrow-direction="down"
					:value-style="lineName ? {color: '#303133', 'font-size': '28rpx'} : {'font-size': '26rpx'}"
					:value="lineName ? lineName : '请选择所属线体'" @click="showLines">
					<u-icon slot="icon" class="u-m-r-20" name="laxian" custom-prefix="sws-icon" size="32"></u-icon>
				</u-cell-item>
				<u-cell-item hover-class="none" arrow-direction="right" title="设备类型"
					:value-style="deviceCategory ? {color: '#303133', 'font-size': '28rpx'} : {'font-size': '26rpx'}"
					:value="deviceCategory ? deviceCategory : '请选择设备类型'" @click="getDevCates">
					<u-icon slot="icon" class="u-m-r-20" name="shebei" custom-prefix="sws-icon" size="32"></u-icon>
				</u-cell-item>
				<u-cell-item hover-class="none" arrow-direction="right" title="设备编码"
					:value-style="deviceCode ? {color: '#303133', 'font-size': '28rpx'} : {'font-size': '26rpx'}"
					:value="deviceCode ? deviceCode : '请选择设备编码'" @click="getDevCode">
					<u-icon slot="icon" class="u-m-r-20" name="shebeibianma" custom-prefix="sws-icon" size="32">
					</u-icon>
				</u-cell-item>
			</u-cell-group>
		</view>
		<view class="sws-w100 u-p-28">
			<u-button type="primary" class="sws-line-h-repair btn-style" @click="confirm">确认</u-button>
		</view>
		<u-select v-model="showSelect" :list="selectList" :title="selectTitle" @confirm="confirmSelect"></u-select>
		<u-top-tips ref="uTips"></u-top-tips>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				lineName: '',
				lineId: '',
				lineList: [],
				deviceCategory: '',
				categoryId: '',
				deviceCode: '',
				selectTitle: '',
				selectList: [],
				showSelect: false
			}
		},
		methods: {
			confirm() {
				if (!this.deviceCode) return
				
				const eventChannel = this.getOpenerEventChannel()
				eventChannel.emit('acceptDataFromOpenedPage', {
					lineName: this.lineName,
					deviceCategory: this.deviceCategory,
					deviceCode: this.deviceCode
				})
				uni.navigateBack()
			},
			confirmSelect(arr) {
				const temp = arr[0]
				this.lineName = temp.label
				this.lineId = temp.value
			},
			async showLines() { //获取拉线数据,展示拉线列表
				this.selectTitle = '请选择所属线体'
				if (!this.lineList.length) {
					let lines = await this.baseData.getLines(this) //通过通用数据请求方法获取
					if (lines.length > 0) {
						this.lineList = lines.map(item => {
							return {
								label: item.lineName,
								value: item.id,
								extra: 'line'
							}
						})
					} else {
						this.$refs.uTips.show({
							title: '拉线列表获取失败！',
							type: 'error',
							duration: '2300'
						})
						return
					}
				}
				this.selectList = this.lineList
				this.showSelect = true
			},
			getDevCates() {
				this.$u.api.getDevCatesInfoForDips().then(res => {
					if (res.msgCode === '000000' && res.data) {
						this.devcatesList = res.data.map(item => {
							return {
								name: item.deviceCategory,
								value: item.id,
								checked: false
							}
						})
						if (this.devcatesList.length) {
							this.goToSelected('请选择设备类型', this.devcatesList, 'devcates')
						} else {
							this.$refs.uTips.show({
								title: '暂未查询到设备类型！',
								type: 'warning',
								duration: '2300'
							})
						}
					} else {
						this.$refs.uTips.show({
							title: `设备类型获取失败，原因：${ res.message }`,
							type: 'error',
							duration: 2300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			getDevCode() {
				if (!this.lineId) {
					this.$refs.uTips.show({
						title: '请选择所属线体',
						type: 'warning',
						duration: 2300
					})
					return
				}

				if (!this.categoryId) {
					this.$refs.uTips.show({
						title: '请选择设备类型',
						type: 'warning',
						duration: 2300
					})
					return
				}

				const params = {
					lineId: this.lineId,
					categoryId: this.categoryId
				}
				this.$u.api.getDeviceCodeForDips(params).then(res => {
					if (res.msgCode === '000000' && res.data) {
						this.devCodeList = res.data.map(item => {
							return {
								name: item.deviceCode,
								value: item.deviceCode,
								desc: item.deviceName,
								checked: false
							}
						})
						if (this.devCodeList.length) {
							this.goToSelected('请选择设备编码', this.devCodeList, 'devCode')
						} else {
							this.$refs.uTips.show({
								title: '暂未查询到设备编码！',
								type: 'warning',
								duration: '2300'
							})
						}
					} else {
						this.$refs.uTips.show({
							title: `设备编码获取失败，原因：${ res.message }`,
							type: 'error',
							duration: 2300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			goToSelected(title, list, type) { // title 选择列表页面标题  list 选择列表项 type赋值对象的属性名
				let _self = this
				let params = {
					title: title,
					items: list,
					hasSearch: true,
					isRadio: true
				}
				uni.navigateTo({
					url: '/pages/common/selectItems/index',
					events: {
						acceptDataFromOpenedPage(res) {
							res.data.map(item => {
								switch (type) {
									case 'devcates':
										_self.deviceCategory = item.name
										_self.categoryId = item.value
										break
									case 'devCode':
										_self.deviceCode = item.value
										break
								}
							})
						}
					},
					success: function(res) {
						res.eventChannel.emit('acceptDataFromOpenerPage', params)
					}
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.btn-style {
		text-indent: 20rpx;
		letter-spacing: 20rpx;
	}
</style>
