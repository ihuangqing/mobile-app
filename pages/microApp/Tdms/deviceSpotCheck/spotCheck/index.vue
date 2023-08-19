<!-- E-Checklist → 点检 -->
<template>
	<view class="u-rela sws-wh100 u-flex sws-flex-d-column sws-overflow-hidden">
		<u-cell-group :border="false">
			<u-cell-item hover-class="none" :arrow="false" title="设备名称:" :value="`${deviceName}(${deviceCode})`">
			</u-cell-item>
			<u-cell-item hover-class="none" :arrow="false" title="应用区域:" :value="areaName"></u-cell-item>
		</u-cell-group>
		<u-cell-group :border="false" class="check-list u-rela sws-wh100 u-flex-1">
			<view v-for="(item, index) in list" :key="index">
				<u-cell-item class="u-flex sws-w100 sws-overflow-hidden" hover-class="none" :arrow="false"
					:use-label-slot="true" :border-top="true" :border-bottom="false" :title-style="{flex: '1'}"
					:value-style="{flex: 'none'}">
					<view slot="icon" class="u-m-r-20 u-font-32">
						{{ common.serialNumFormatter(index) }}
					</view>
					<view slot="title" class="u-flex-1">
						<view class="u-main-color u-font-32">{{ item.spotCheckPosition }}</view>
					</view>
					<u-switch v-if="!+item.deviceCheckType" slot="right-icon" v-model="item.checked" inactive-color="#fa3534"
						active-color="#19be6b" :showText="true" size="46" inactive-value="0" active-value="1"
						@change="switchChange($event, index)"></u-switch>
				</u-cell-item>
				<view class="sws-w100 u-p-b-20 u-p-r-30 u-p-l-30">
					<view class="tools-standard u-flex-1 u-line-1 u-p-10 u-p-l-20 u-p-r-20"
						@click="showDetail('点检内容', item.spotCheckContent)">
						<text class="u-type-info">点检内容：</text>
						<text>{{ item.spotCheckContent }}</text>
					</view>
					<view class="tools-standard u-p-l-20 u-p-r-20">
						<u-line color="#ffffff" border-style="dashed" :hair-line="false"></u-line>
					</view>
					<view class="tools-standard u-flex-1 u-line-1 u-p-10 u-p-l-20 u-p-r-20"
						@click="showDetail('操作依据', item.operationAccording)">
						<text class="u-type-info">操作依据：</text>
						<text>{{ item.operationAccording }}</text>
					</view>
				</view>
				<view class="u-p-l-30 u-p-r-30 u-p-b-20 u-flex" v-show="+item.deviceCheckType">
					<u-col span="3">
						<view class="u-flex-1 u-text-center">下限：{{ item.downLimit }}</view>
					</u-col>
					<u-col span="6">
						<u-input class="u-flex-1 u-text-center u-m-l-10 u-m-r-10" type="text" input-align="center" height="60"
							:border="true" placeholder="请输入检测值(必填)" v-model="item.resultValue">
						</u-input>
					</u-col>
					<u-col span="3">
						<view class="u-flex-1 u-text-center">上限：{{ item.upperLimit }}</view>
					</u-col>
				</view>
			</view>
		</u-cell-group>
		<view class="check-confirm u-p-28">
			<u-button type="primary" @click="commit">确认</u-button>
		</view>
		<u-modal v-model="showModal" :title="modalTitle" :content="modalContent" @confirm="confirm"></u-modal>
		<u-top-tips ref="uTips"></u-top-tips>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				deviceName: '',
				deviceCode: '',
				areaName: '',
				list: [],
				showModal: false,
				modalTitle: '',
				modalContent: '',
				setTimer: ''
			}
		},
		onLoad: function() {
			let _self = this
			this.getOpenerEventChannel().on('acceptDataFromOpenerPage', function(res) {
				_self.params = res.data
				_self.deviceName = _self.params.deviceName
				_self.deviceCode = _self.params.deviceCode
				_self.areaName = _self.params.areaName
				_self.list = _self.params.inputRecordPoList.map(item => {
					return {
						checked: (!+item.deviceCheckType && item.resultValue == 'OK') ? true : false,
						...item
					}
				})
			})
		},
		methods: {
			commit() {
				for (let i in this.list) {
					if (Number(this.list[i].deviceCheckType)) {
						if (!this.list[i].resultValue.trim()) {
							this.$refs.uTips.show({
								title: '请输入检测值',
								type: 'warning',
								duration: 2300
							})
							return
						}
					}
				}

				let params = {
					...this.params,
					inputRecordPoList: this.list
				}
				this.$u.api.postSpotDataForTdms(params).then(res => {
					if (res.msgCode === '000000') {
						this.modalTitle = '提示'
						this.modalContent = '点检结果上传成功'
						this.showModal = true
					} else {
						this.$refs.uTips.show({
							title: `点检结果上传失败，原因：${ res.message }`,
							type: 'error',
							duration: 2300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			confirm() {
				if (this.modalContent.includes('点检结果')) {
					const eventChannel = this.getOpenerEventChannel()
					eventChannel.emit('acceptDataFromOpenedPage')
					uni.navigateBack()
				}
			},
			showDetail(title, content) {
				this.modalTitle = title
				this.modalContent = content
				this.showModal = true
			},
			switchChange(value, curIndex) {
				this.list.forEach((item, itemIndex) => {
					if (itemIndex == curIndex) {
						item.resultValue = +value ? 'OK' : 'NG'
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.check-list {
		overflow-y: scroll;
	}

	.tools-standard {
		background-color: #ecf5ff;
	}

	.check-confirm {
		width: 100%;
		letter-spacing: 20rpx;
		text-indent: 20rpx;
	}
</style>