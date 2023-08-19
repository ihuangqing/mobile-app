<template>
	<view class="sws-wh100 sws-bg-ebebeb u-flex sws-flex-d-column u-p-20">
		<view class="u-flex-1 pm-content sws-w100">
			<u-form :model="form" ref="uForm" label-width="180">
				<u-form-item left-icon="order" label="送货单号">
					<u-input v-model="form.name" input-align="right" placeholder="请输入或扫描送货单号" />
					<u-icon slot="right" class="u-p-l-16" name="saoma" custom-prefix="sws-icon" size="56"
						color="#2979ff"></u-icon>
				</u-form-item>
				<u-form-item left-icon="car" label="车牌号" :border-bottom="false">
					<u-input v-model="form.intro" input-align="right" disabled placeholder="请输入车牌号" />
					<!-- <u-icon slot="right" class="u-p-l-16" name="chepaishibie" custom-prefix="sws-icon" size="56"
						color="#2979ff"></u-icon> -->
				</u-form-item>
				<view class="u-border-bottom">
					<car-number-input @numberInputResult="numberInputResult" :defaultStr="form.defaultNum"></car-number-input>
				</view>
				<u-form-item left-icon="account" label="送货人">
					<u-input v-model="form.sex" input-align="right" placeholder="" disabled />
				</u-form-item>
				<u-form-item left-icon="phone" label="联系电话">
					<u-input v-model="form.sex" input-align="right" placeholder="" disabled />
				</u-form-item>
			</u-form>
		</view>
		<view class="sws-w100 u-m-t-20">
			<u-button type="primary" class="btn-style">确认</u-button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				form: {
					defaultNum: '苏A'
				},
			}
		},
		onLoad() {
			const eventChannel = this.getOpenerEventChannel()
			eventChannel.on('acceptDataFromOpenerPage', ({
				data
			}) => {
				console.log('data: ', data)
				uni.setNavigationBarTitle({
					title: data.name
				})
			})
		},
		methods: {
			numberInputResult(e) {
				console.log('结果--' + e)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.pm-content {
		background-color: #fff;
		box-shadow: 0 0 4rpx 2rpx #ebebeb;
		border-radius: 12rpx;
		padding: 20rpx 30rpx;
	}

	.btn-style {
		text-indent: 20rpx;
		letter-spacing: 20rpx;
	}
</style>