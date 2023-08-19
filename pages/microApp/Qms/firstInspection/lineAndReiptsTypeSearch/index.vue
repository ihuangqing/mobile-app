<!-- 首巡检--按单据类型和线体 查询 -->
<template>
	<view class="sws-wh100 u-flex sws-flex-d-column">
		<view class="sws-w100 u-flex-1">
			<u-cell-group :border="false" class="u-flex-1">
				<u-cell-item hover-class="none" title="线体" arrow-direction="right"
					:value-style="areaName ? {color: '#303133', 'font-size': '28rpx'} : {'font-size': '26rpx'}"
					:value="areaName ? areaName : '请选择所属线体'" @click="switchLineType">
					<!-- <u-icon slot="icon" class="u-m-r-20" name="laxian" custom-prefix="sws-icon" size="32"></u-icon> -->
				</u-cell-item>

				<u-cell-item hover-class="none" title="单据类型" arrow-direction="right"
					:value-style="filterReiptsType ? {color: '#303133', 'font-size': '28rpx'} : {'font-size': '26rpx'}"
					:value="filterReiptsType ? filterReiptsType : '请选择单据类型'" @click="switchReiptsType">
					<!-- <u-icon slot="icon" class="u-m-r-20" name="laxian" custom-prefix="sws-icon" size="32"></u-icon> -->
				</u-cell-item>

				<!-- 				<u-cell-item hover-class="none" title="检验类型" arrow-direction="right"
					:value-style="checkedType ? {color: '#303133', 'font-size': '28rpx'} : {'font-size': '26rpx'}"
					:value="checkedType ? checkedType : '请选择检验类型'" @click="showcheckedTypes">
				</u-cell-item> -->



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
				ifChecked: '是否检验',
				checkedType: '',
				tempSelectList: [],
				filterVal: '',
				areaSn: '', //选择的线体相对应的areaSn
				areaName: '', //线体
				checkTypeCode: '', //选择的单据类别所对应的checkTypeCode
				filterReiptsType: '', //单据类别
				selectTitle: '',
				selectList: [],
				showSelect: false
			}
		},
		created() {
			this.getLineAndCheckType()
		},
		methods: {
			confirm() { //确定
				const params = {
					checkTypes: this.checkTypeCode, //单据类型
					areaSn: this.areaSn, //线体类别
				}
				const eventChannel = this.getOpenerEventChannel()
				eventChannel.emit('acceptDataFromQueryPage', params)
				uni.navigateBack()
			},
			//切换线体类型
			switchLineType() {
				const _self = this
				_self.selectTitle = '请选择线体类型'
				let currentLineTypeList = []
				if (_self.tempSelectList.line.length > 0) {
					currentLineTypeList = _self.tempSelectList.line.map(({
						areaName,
						areaSn,
					}) => {
						return {
							label: areaName,
							value: areaSn,
							extra: 'areaName'
						}
					})

				} else {
					this.$refs.uTips.show({
						title: '线体列表获取失败！',
						type: 'error',
						duration: '2300'
					})
					return
				}
				_self.selectList = currentLineTypeList
				_self.showSelect = true

			},
			// 切换单据类别
			switchReiptsType() {
				const _self = this
				_self.selectTitle = '请选择单据类型'
				let currentReiptsTypeList = []
				if (_self.tempSelectList.checkTypes.length > 0) {
					currentReiptsTypeList = _self.tempSelectList.checkTypes.map(({
						checkType,
						checkTypeCode,
					}) => {
						return {
							label: checkType,
							value: checkTypeCode,
							extra: 'checkType'
						}
					})

				} else {
					this.$refs.uTips.show({
						title: '单据类型列表获取失败！',
						type: 'error',
						duration: '2300'
					})
					return
				}
				_self.selectList = currentReiptsTypeList
				_self.showSelect = true

			},
			// 线体类型/单据类型--确定
			confirmSelect(value) {
				let temp = value[0]
				if (temp.extra === 'areaName') {
					this.areaSn = value[0].value
					this.areaName = value[0].label

				} else {
					this.checkTypeCode = value[0].value
					this.filterReiptsType = value[0].label
				}

			},
			//获取mes的拉线以及单据类型数据
			getLineAndCheckType() {
				this.$u.api.getLineAndCheckTypeApi().then(res => {
					if (res.msgCode === '000000') {
						if (res.data) {
							this.tempSelectList = res.data

						}
					} else {
						this.$refs.uTips.show({
							title: `数据获取失败，原因：${ res.message }`,
							type: 'error',
							duration: 2300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)

				})
			},

		}
	}
</script>

<style scoped lang="scss">
	.btn-style {
		text-indent: 20rpx;
		letter-spacing: 20rpx;
	}
</style>
