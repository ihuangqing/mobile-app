<!-- NFC标签识别 -->
<template>
	<view class="sws-wh100 u-p-40">
		<view class="nfc-content u-flex u-row-center u-col-top u-font-28 sws-flex-d-column">
			<view v-if="!readData.id" class="sws-wh100 u-flex u-row-center u-light-color u-p-60">
				<text class="tips-style">点击按钮并将NFC标签靠近设备的NFC识别区域</text>
			</view>
			<view v-else class="sws-wh100">
				<view v-show="readData.id" class="sws-w100">
					<view class="u-type-success u-font-32 u-m-b-10">NFCID:</view>
					<view class="demo-layout bg-purple-light">{{ readData.id }}</view>
				</view>
				<view v-show="readData.name" class="u-m-t-20 sws-w100">
					<view class="u-type-success u-font-32 u-m-b-10">标签名称:</view>
					<view class="demo-layout bg-purple-light">{{ readData.name }}</view>
				</view>
				<view v-show="readData.code" class="u-m-t-20 sws-w100">
					<view class="u-type-success u-font-32 u-m-b-10">标签内容:</view>
					<view class="demo-layout bg-purple-light">{{ readData.code }}</view>
				</view>
			</view>
		</view>
		<view class="u-flex u-row-center btn-group">
			<view class="btn-style" @click="toRead">
				<u-icon name="nfc" custom-prefix="sws-icon" size="60" color="#ffffff"></u-icon>
			</view>
		</view>
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
				readData: {
					id: '',
					name: '',
					code: ''
				},
				hideTips: true
			}
		},
		watch: {
			readData(newVal) {
				if (!Object.keys(newVal).length) {
					this.$refs.uTips.show({
						title: '未读到数据',
						type: 'warning',
						duration: 2300
					})
				}
				setTimeout(() => { //防止连续触发
					this.toRead()
				}, 2000)
			}
		},
		onLoad() {
			// #ifdef APP-PLUS
			nfc.listenNFCStatus()

			this.toRead() //默认开启NFC识别
			// #endif
		},
		methods: {
			toRead() {
				// #ifdef APP-PLUS
				nfc.readData(this.$data)
				// #endif
			}
		},
	}
</script>

<style lang="scss" scoped>
	.nfc-content {
		min-height: calc(100% - 200rpx);
		padding: 30rpx;
		padding-bottom: 120rpx;
		border-radius: 30rpx;
		border: 2rpx solid #ebebeb;
		box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, .2);
	}

	.tips-style {
		font-style: italic;
	}

	.btn-group {
		margin-top: -60rpx;
	}

	.btn-style {
		width: 120rpx;
		height: 120rpx;
		line-height: 120rpx;
		border-radius: 100%;
		background-color: $u-type-primary;
		text-align: center;
	}

	.demo-layout {
		border-radius: 8rpx;
		padding: 10rpx;
	}

	.bg-purple-light {
		background: #e5e9f2;
	}
</style>
