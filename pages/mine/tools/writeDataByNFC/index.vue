<!-- 我的 → 工具 → NFC读写数据 -->
<template>
	<view class="page-wrap sws-wh100 u-flex sws-flex-d-column sws-overflow-hidden">
		<view class="write-read u-rela sws-w100 u-flex-1">
			<u-cell-group title="数据写入" :border="false" :title-style="{color: '#2979ff', 'font-weight': 'bold'}">
				<u-cell-item title="设备类别" hover-class="none" :arrow="false" :value-style="{color: '#303133'}"
					:value="options.categoryName"></u-cell-item>
				<u-cell-item title="设备名称" hover-class="none" :arrow="false" :value-style="{color: '#303133'}"
					:value="options.deviceName"></u-cell-item>
				<u-cell-item title="设备编码" hover-class="none" :arrow="false" :value-style="{color: '#303133'}"
					:value="options.deviceCode"></u-cell-item>
			</u-cell-group>
			<u-cell-group title="数据读取" :border="false" :title-style="{color: '#19be6b', 'font-weight': 'bold'}">
				<u-cell-item title="芯片ID" hover-class="none" :arrow="false" :value-style="{color: '#303133'}"
					:value="readData.id"></u-cell-item>
				<u-cell-item title="设备名称" hover-class="none" :arrow="false" :value-style="{color: '#303133'}"
					:value="readData.name"></u-cell-item>
				<u-cell-item title="设备编码" hover-class="none" :arrow="false" :value-style="{color: '#303133'}"
					:value="readData.code"></u-cell-item>
			</u-cell-group>
		</view>
		<view class="btn-group sws-w100 u-p-t-28 u-p-b-28 u-flex u-row-between">
			<u-button size="medium" type="primary" class="sws-line-h-repair" @click="toWrite">写入数据</u-button>
			<u-button size="medium" type="success" class="sws-line-h-repair" @click="toRead">读取数据</u-button>
		</view>
		<u-modal v-model="showModal" :show-cancel-button="true" @confirm="confirm">
			<view class="u-p-20">
				<view>芯片写入数据：</view>
				<view class="u-font-28 u-p-30 u-border-bottom u-flex u-row-between">
					<text>设备名称</text>
					<text>{{ options.deviceName }}</text>
				</view>
				<view class="u-font-28 u-p-30 u-border-bottom u-flex u-row-between">
					<text>设备编码</text>
					<text>{{ options.deviceCode }}</text>
				</view>
				<view class="u-m-t-20 u-font-24 u-text-right">
					<u-icon name="error-circle-fill" size="24" color="#fa3534"></u-icon>
					<text class="u-type-info">此操作将抹除芯片中的数据且不可逆!</text>
				</view>
			</view>
		</u-modal>
		<u-modal v-model="show" :content="content" @confirm="successConfirm"></u-modal>
		<u-modal v-model="showLeave" content="信息写入未完成,是否离开？" :show-cancel-button="true" @confirm="leaveConfirm">
		</u-modal>
		<u-top-tips ref="uTips"></u-top-tips>
	</view>
</template>

<script>
	// #ifdef APP-PLUS
	import nfc from '../../../../js_sdk/hexiii-nfc/hexiii-nfc.js'
	// #endif

	export default {
		data() {
			return {
				showModal: false,
				writeData: {
					status: 0, //0是写入失败，1是写入成功
					text: '' //写入的字符串
				},
				readData: {
					id: '',
					name: '',
					code: ''
				},
				show: false,
				content: '',
				showLeave: false,
				isWriting: false //是否正在写数据的过程中
			}
		},
		watch: {
			writeData: function(newVal) {
				console.log('newVal:', newVal)
				if (newVal.status) {
					this.curNfcId = newVal.id
					if (this.options.type && this.options.type == 'dips') {
						this.postDeviceInfoForNFCForDips(newVal)
					} else {
						this.postDeviceInfoForNFC(newVal)
					}
				} else {
					this.$refs.uTips.show({
						title: 'NFC芯片数据写入失败，请重试!',
						type: 'error',
						duration: 2300
					})
				}
			}
		},
		onLoad: function(options) {
			// #ifdef APP-PLUS
			nfc.listenNFCStatus()
			// #endif
			this.options = options
			const data = {
				name: options.deviceName,
				code: options.deviceCode
			}
			this.writeData.text = JSON.stringify(data)
		},
		methods: {
			postDeviceInfoForNFCForDips(data) { //dips设备绑定
				const params = {
					deviceCode: this.options.deviceCode,
					nfcCode: data.id
				}
				this.$u.api.postDeviceNFCForDips(params).then(res => {
					if (res.msgCode === '000000') {
						this.content = '设备信息NFC写入完成'
						this.show = true
						this.isWriting = false
					} else {
						this.$refs.uTips.show({
							title: `设备芯片信息上传失败，原因：${res.message}`,
							type: 'error',
							duration: 2300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			postDeviceInfoForNFC(data) { //消防设备绑定
				const params = {
					nfcId: data.id,
					id: this.options.id
				}
				this.$u.api.postDeviceInfoForNFC(params).then(res => {
					if (res.msgCode === '000000') {
						this.content = '设备信息NFC写入完成'
						this.show = true
						this.isWriting = false
					} else {
						this.$refs.uTips.show({
							title: `设备芯片信息上传失败，原因：${res.message}`,
							type: 'error',
							duration: 2300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			successConfirm() {
				const eventChannel = this.getOpenerEventChannel()
				eventChannel.emit('acceptDataFromOpenedPage', {
					data: this.options.id,
					nfcCode: this.curNfcId
				})
			},
			toWrite() {
				this.showModal = true
			},
			confirm() {
				// #ifdef APP-PLUS
				nfc.writeData(this.$data)
				// #endif
				this.isWriting = true
			},
			toRead() {
				// #ifdef APP-PLUS
				nfc.readData(this.$data)
				// #endif
			},
			leaveConfirm() {
				this.isWriting = false
				uni.navigateBack()
			}
		},
		onBackPress() {
			if (this.isWriting) {
				this.showLeave = true
				return true
			} else if (this.showModal) {
				this.showModal = false
				return true
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page-wrap {
		background-color: #ededed;
	}

	.write-read {
		overflow-y: scroll;
		padding-bottom: 126rpx;
	}

	.btn-group {
		position: fixed;
		bottom: 0;
		left: 0;
		z-index: 3;
	}
</style>
