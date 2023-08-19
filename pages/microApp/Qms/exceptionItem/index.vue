<!-- 发起QC巡检不符合项 -->
<template>
	<view class="sws-wh100 u-flex sws-flex-d-column sws-overflow-hidden">
		<view class="sws-w100 u-flex-1 u-p-l-20 u-p-r-20 u-p-b-30 sws-overflow-scroll-y">
			<u-form class="sws-w100" :model="model" label-width="150" label-align="center">
				<u-form-item required label="产品编码" :border-bottom="false">
					<u-input :border="true" placeholder="请输入或扫描产品编码" v-model="model.code" type="text"></u-input>
					<u-icon slot="right" name="scan" size="56" color="#2979ff" @click="scanCode('code')"></u-icon>
				</u-form-item>
				<u-form-item label="产品型号" :border-bottom="false">
					<u-input :border="true" disabled placeholder="" v-model="model.model" type="text"></u-input>
				</u-form-item>
				<u-form-item label="生产线别" :border-bottom="false">
					<u-input :border="true" disabled placeholder="" v-model="model.line" type="text">
					</u-input>
				</u-form-item>
				<u-form-item label="产品类别" :border-bottom="false">
					<u-input :border="true" disabled placeholder="请选择产品类别" v-model="model.type" type="select"
						@click="toShowType">
					</u-input>
				</u-form-item>
				<u-form-item required label="发现工位" :border-bottom="false">
					<u-input :border="true" disabled placeholder="请选择发现工位" v-model="model.station" type="select">
					</u-input>
				</u-form-item>
				<u-form-item required label="发现日期" :border-bottom="false">
					<u-input :border="true" disabled placeholder="请选择发现日期" v-model="model.time" type="select"
						@click="showDatePicker = true">
					</u-input>
				</u-form-item>
				<u-form-item required label="不良数" :border-bottom="false">
					<u-input :border="true" placeholder="请输入不良数" v-model="model.times" type="number">
					</u-input>
				</u-form-item>
				<u-form-item required label="问题类别" :border-bottom="false">
					<u-input :border="true" disabled placeholder="请选择问题类别" v-model="model.exceptionType" type="select"
						@click="toShowExceptionType">
					</u-input>
				</u-form-item>
				<u-form-item label="问题描述" :border-bottom="false">
					<u-input :border="true" placeholder="请输入问题描述" v-model="model.exceptionType"
						type="textarea">
					</u-input>
				</u-form-item>
				<u-form-item label="问题原因" :border-bottom="false">
					<u-input :border="true" placeholder="请输入问题原因" v-model="model.exceptionType"
						type="textarea">
					</u-input>
				</u-form-item>
				<u-form-item required label="上传图片" :border-bottom="false">
					<u-upload ref="uUpload" width="210" height="210" :auto-upload="false">
					</u-upload>
				</u-form-item>
			</u-form>
		</view>
		<view class="sws-w100 u-p-28 btn-style">
			<u-button type="primary" @click="submit">确认</u-button>
		</view>
		<u-picker v-model="showDatePicker" :params="timeParams" mode="time" title="发现日期" @confirm="timeConfirm">
		</u-picker>
		<u-select v-model="showSelect" :title="selectTitle" :list="selectList" @confirm="selectConfirm"></u-select>
		<u-modal v-model="showModal" :content="modalContent" @confirm="modalConfirm"></u-modal>
		<u-top-tips ref="uTips"></u-top-tips>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				model: {
					code: '',
					line: '',
					groupName: '',
					deviceSN: '',
					station: ''
				},
				modalContent: '',
				showModal: false,
				selectTitle: '',
				selectList: [],
				showSelect: false,
				timeParams: {
					year: true,
					month: true,
					day: true,
					hour: true,
					minute: true,
					second: false
				},
				showDatePicker: false
			}
		},
		methods: {
			async scanCode(type) {
				let code = await this.common.scanCode(this)
				switch (type) {
					case 'code':
						this.model.code = code
						break
					case 'group':
						this.model.groupName = code
						break
					case 'sn':
						this.model.deviceSN = code
						break
				}
			},
			toShowType() {
				this.selectTitle = '请选择产品类别'
				this.selectList = [{
					label: 'Cell',
					value: 'Cell'
				}, {
					label: 'BMS',
					value: 'BMS'
				}, {
					label: 'Module',
					value: 'Module'
				}, {
					label: 'PACK',
					value: 'PACK'
				}]
				this.showSelect = true
			},
			toShowExceptionType() {
				this.selectTitle = '请选择问题类别'
				this.selectList = [{
					label: '人',
					value: '人'
				}, {
					label: '机',
					value: '机'
				}, {
					label: '料',
					value: '料'
				}, {
					label: '法',
					value: '法'
				}, {
					label: '环',
					value: '环'
				}]
				this.showSelect = true
			},
			selectConfirm(arr) {
				const temp = arr[0]
				if (this.selectTitle.includes('产品类别')) {
					this.model.type = temp.value
				} else if (this.selectTitle.includes('问题类别')) {
					this.model.exceptionType = temp.value
				}
			},
			timeConfirm(date) {
				this.model.time =
					`${ date.year }-${ date.month }-${ date.day } ${ date.hour }:${ date.minute }:${ date.second }`
			}
		},
	}
</script>

<style lang="scss" scoped>
	.btn-style {
		letter-spacing: 28rpx;
		text-indent: 28rpx;
	}
</style>
