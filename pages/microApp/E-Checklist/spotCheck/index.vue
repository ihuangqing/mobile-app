<!-- E-Checklist → 点检 -->
<template>
	<view class="u-rela sws-wh100 u-flex sws-flex-d-column sws-overflow-hidden">
		<u-cell-group :border="false">
			<u-cell-item hover-class="none" :arrow="false" title="设备名称:" :value="`${deviceName}(${deviceCode})`">
			</u-cell-item>
			<u-cell-item hover-class="none" :arrow="false" title="位置:" :value="areaName"></u-cell-item>
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
						<view class="u-main-color u-font-32">{{ item.itemName }}</view>
					</view>
					<u-switch slot="right-icon" v-model="item.checked" inactive-color="#fa3534" active-color="#19be6b"
						:loading="item.loading" :showText="true" size="46" inactive-value="0" active-value="1"
						@change="switchChange($event, index)"></u-switch>
				</u-cell-item>
				<view class="sws-w100 u-flex u-p-b-20 u-p-r-30 u-p-l-30">
					<view class="tools-standard u-flex-1 u-line-1 u-p-10" @click="showDetail('点检工具', item.tools)">
						<text class="u-type-info">工具：</text>
						<text>{{ item.tools }}</text>
					</view>
					<view class="tools-standard u-flex-1 u-line-1 u-p-10" @click="showDetail('点检标准', item.standard)">
						<text class="u-type-info">标准：</text>
						<text>{{ item.standard }}</text>
					</view>
				</view>
				<view class="u-p-l-30 u-p-r-30 u-p-b-20" v-show="+item.standardType">
					<u-input type="textarea" height="40" :auto-height="true" :border="true" placeholder="请输入检测值(必填)"
						v-model="item.resultVal">
					</u-input>
				</view>
				<view class="u-p-l-30 u-p-r-30 u-p-b-20" v-show="!item.checked">
					<u-input type="textarea" height="40" :auto-height="true" :border="true" placeholder="请输入NG原因"
						v-model="item.exception">
					</u-input>
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
			// 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
			this.getOpenerEventChannel().on('acceptDataFromOpenerPage', function(res) {
				let check = res.data
				_self.deviceName = check.deviceName
				_self.deviceCode = check.deviceCode
				_self.areaName = check.areaName
				_self.id = check.id
				_self.state = check.state
				_self.standardType = check.standardType
				_self.list = check.deviceItemList.map(item => {
					return {
						loading: false,
						checked: false,
						state: '0',
						exception: '',
						resultVal: '',
						...item
					}
				})
			})
		},
		methods: {
			commit() {
				for (let i in this.list) {
					if (!Number(this.list[i].state) && !this.list[i].exception.trim()) {
						this.$refs.uTips.show({
							title: '结果为NG的点检项目需要填写NG原因',
							type: 'warning',
							duration: 2300
						})
						return
					}

					if (Number(this.list[i].standardType)) {
						if (!this.list[i].resultVal.trim()) {
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
					id: this.id,
					state: this.state,
					deviceItemList: this.list
				}
				this.$u.api.putCheckResult(params).then(res => {
					if (res.msgCode === '000000') {
						this.modalTitle = '提示'
						this.modalContent = '点检结果上传成功'
						this.showModal = true
					} else {
						this.$refs.uTips.show({
							title: `点检结果上传失败，原因：${res.message}`,
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
					const id = this.id
					const eventChannel = this.getOpenerEventChannel()
					eventChannel.emit('acceptDataFromOpenedPage', {
						data: id
					})
					uni.navigateBack()
				}
			},
			showDetail(title, content) {
				this.modalTitle = title
				this.modalContent = content
				this.showModal = true
			},
			switchChange(value, curIndex) {
				console.log('当前item的值：', value)
				clearTimeout(this.setTimer) //清楚延时器
				this.list.forEach((item, itemIndex) => {
					if (itemIndex != curIndex) {
						item.loading = true
					} else {
						item.state = value
					}
				})
				// 添加5秒延时器,5秒之后恢复可点击状态
				this.setTimer = setTimeout(() => {
					this.list.forEach((item, itemIndex) => {
						if (itemIndex != curIndex) {
							item.loading = false
						}
					})
				}, 5000)
			}
		},
		onUnload() {
			clearTimeout(this.setTimer)
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
