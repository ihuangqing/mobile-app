<!-- 不符合项改善效果确认 -->
<template>
	<view class="sws-wh100 sws-overflow-hidden">
		<view class="head-bg"></view>
		<view class="box-wrap">
			<view class="info-box">
				<view class="info-box-title">
					<u-cell-item :arrow="false" hover-class="none" :border-bottom="false"
						:title-style="{fontSize: '26rpx', color: 'rgba(255,255,255,.8)'}" title="产品编码"
						:value-style="{color: '#ffffff', fontSize: '32rpx'}" value="3210123125444">
					</u-cell-item>
				</view>
				<u-row gutter="0">
					<u-col span="6">
						<u-cell-item :arrow="false" hover-class="none" :border-bottom="false"
							:title-style="{fontSize: '26rpx', color: '#909399'}" title="生产线别"
							:value-style="{color: '#606266'}" value="HZ-M04"></u-cell-item>
						<u-cell-item :arrow="false" hover-class="none" :border-bottom="false"
							:title-style="{fontSize: '26rpx', color: '#909399'}" title="产品型号"
							:value-style="{color: '#606266'}" value="106Ah 模组A"></u-cell-item>
						<u-cell-item :arrow="false" hover-class="none" :border-bottom="false"
							:title-style="{fontSize: '26rpx', color: '#909399'}" title="产品类别"
							:value-style="{color: '#606266'}" value="BMS">
						</u-cell-item>
					</u-col>
					<u-col span="6">
						<u-cell-item :arrow="false" hover-class="none" :border-bottom="false"
							:title-style="{fontSize: '26rpx', color: '#909399'}" title="发现工位"
							:value-style="{color: '#606266'}" value="">
						</u-cell-item>
						<u-cell-item :arrow="false" hover-class="none" :border-bottom="false"
							:title-style="{fontSize: '26rpx', color: '#909399'}" title="不良数"
							:value-style="{color: '#606266'}" value="3">
						</u-cell-item>
						<u-cell-item :arrow="false" hover-class="none" :border-bottom="false"
							:title-style="{fontSize: '26rpx', color: '#909399'}" title="问题类型"
							:value-style="{color: '#606266'}" value="法">
						</u-cell-item>
					</u-col>
				</u-row>
			</view>
			<view class="box-line">
				<view class="u-flex">
					<view class="u-flex-1 u-p-l-10">
						<u-icon name="lianjie" custom-prefix="sws-icon" size="100" color="#3c9cff"></u-icon>
					</view>
					<view class="u-flex-1 u-p-r-10 u-text-right">
						<u-icon name="lianjie" custom-prefix="sws-icon" size="100" color="#3c9cff"></u-icon>
					</view>
				</view>
			</view>
			<view class="box-extra">
				<view class="box-extra-header"></view>
				<view class="box-extra-content">
					<view class="u-flex-1 u-p-l-20 u-p-r-20 u-p-t-10 u-p-b-10">
						<view>
							<u-icon name="dot" custom-prefix="sws-icon" color="#ffffff" size="36"></u-icon>
							<text class="u-font-28 sws-font-fff">问题描述</text>
						</view>
						<view class="u-font-24 u-p-l-20 dark-white">问题描述内容</view>
						<view class="u-m-t-10">
							<u-icon name="dot" custom-prefix="sws-icon" color="#ffffff" size="36"></u-icon>
							<text class="u-font-28 sws-font-fff">问题原因</text>
						</view>
						<view class="u-font-24 u-p-l-20 dark-white">问题原因内容</view>
					</view>
					<view class="u-flex sws-flex-d-column u-col-top u-row-center">
						<u-image :width="160" :height="160" border-radius="16" v-if="imageList && imageList.length"
							:src="imageList[0]">
							<view slot="error" class="u-flex sws-flex-d-column">
								<u-icon name="info-circle" size="44"></u-icon>
								<view class="u-font-24 u-m-t-10">加载失败</view>
							</view>
						</u-image>
						<u-icon v-else name="zhanweitu" custom-prefix="sws-icon" size="160"
							color="rgba(255, 255, 255, .8)">
						</u-icon>
					</view>
				</view>
			</view>
		</view>
		<view class="content-wrap u-flex sws-flex-d-column sws-overflow-scroll-y">
			<view class="sws-w100 u-flex-1 u-p-l-60 u-p-r-36 u-p-t-20">
				<u-time-line>
					<u-time-line-item nodeTop="2">
						<template v-slot:node>
							<u-icon name="radio" custom-prefix="sws-icon" color="#19be6b" size="34"></u-icon>
						</template>
						<template v-slot:content>
							<view class="time-wrap">
								<view class="u-flex-1 time-content">
									<view class="u-content-color u-font-28">原因分析</view>
									<view class="u-tips-color u-flex-1">原因分析</view>
									<view class="u-flex u-row-between u-m-t-8 u-p-r-20">
										<view>
											<u-icon name="renxiang" custom-prefix="sws-icon" size="28" color="#909399">
											</u-icon>
											<text class="u-m-l-10 u-tips-color u-font-24">郭久盛</text>
										</view>
										<view>
											<u-icon name="shijian" custom-prefix="sws-icon" size="28" color="#909399">
											</u-icon>
											<text class="u-m-l-10 u-tips-color u-font-24">2021-11-30 14:20:10</text>
										</view>
									</view>
								</view>
								<view class="u-flex sws-flex-d-column u-col-top u-row-center">
									<u-image :width="160" :height="160" border-radius="16"
										v-if="imageList && imageList.length" :src="imageList[0]">
										<view slot="error" class="u-flex sws-flex-d-column">
											<u-icon name="info-circle" size="44"></u-icon>
											<view class="u-font-24 u-m-t-10">加载失败</view>
										</view>
									</u-image>
									<u-icon v-else name="zhanweitu" custom-prefix="sws-icon" size="160" color="#ebebeb">
									</u-icon>
								</view>
							</view>
						</template>
					</u-time-line-item>
					<u-time-line-item>
						<template v-slot:node>
							<u-icon name="radio" custom-prefix="sws-icon" color="#19be6b" size="34"></u-icon>
						</template>
						<template v-slot:node>
							<u-icon name="radio" custom-prefix="sws-icon" color="#19be6b" size="34"></u-icon>
						</template>
						<template v-slot:content>
							<view class="time-wrap">
								<view class="u-flex-1 time-content">
									<view class="u-content-color u-font-28">改善措施</view>
									<view class="u-tips-color u-flex-1">改善措施改善措施改善措施改善措施</view>
									<view class="u-flex u-row-between u-m-t-8 u-p-r-20">
										<view>
											<u-icon name="renxiang" custom-prefix="sws-icon" size="28" color="#909399">
											</u-icon>
											<text class="u-m-l-10 u-tips-color u-font-24">郭久盛</text>
										</view>
										<view>
											<u-icon name="shijian" custom-prefix="sws-icon" size="28" color="#909399">
											</u-icon>
											<text class="u-m-l-10 u-tips-color u-font-24">2021-11-30 14:20:10</text>
										</view>
									</view>
								</view>
								<view class="u-flex sws-flex-d-column u-col-top u-row-center">
									<u-image :width="160" :height="160" border-radius="16"
										v-if="imageList && imageList.length" :src="imageList[0]">
										<view slot="error" class="u-flex sws-flex-d-column">
											<u-icon name="info-circle" size="44"></u-icon>
											<view class="u-font-24 u-m-t-10">加载失败</view>
										</view>
									</u-image>
									<u-icon v-else name="zhanweitu" custom-prefix="sws-icon" size="160" color="#ebebeb">
									</u-icon>
								</view>
							</view>
						</template>
					</u-time-line-item>
					<u-time-line-item>
						<template v-slot:node>
							<u-icon name="radio" custom-prefix="sws-icon" color="#19be6b" size="34"></u-icon>
						</template>
						<template v-slot:node>
							<u-icon name="radio" custom-prefix="sws-icon" color="#19be6b" size="34"></u-icon>
						</template>
						<template v-slot:content>
							<view class="time-wrap">
								<view class="u-flex-1 time-content">
									<view class="u-content-color u-font-28">预防措施</view>
									<view class="u-tips-color u-flex-1">预防措施预防措施预防措施预防措施</view>
									<view class="u-flex u-row-between u-m-t-8 u-p-r-20">
										<view>
											<u-icon name="renxiang" custom-prefix="sws-icon" size="28" color="#909399">
											</u-icon>
											<text class="u-m-l-10 u-tips-color u-font-24">郭久盛</text>
										</view>
										<view>
											<u-icon name="shijian" custom-prefix="sws-icon" size="28" color="#909399">
											</u-icon>
											<text class="u-m-l-10 u-tips-color u-font-24">2021-11-30 14:20:10</text>
										</view>
									</view>
								</view>
								<view class="u-flex sws-flex-d-column u-col-top u-row-center">
									<u-image :width="160" :height="160" border-radius="16"
										v-if="imageList && imageList.length" :src="imageList[0]">
										<view slot="error" class="u-flex sws-flex-d-column">
											<u-icon name="info-circle" size="44"></u-icon>
											<view class="u-font-24 u-m-t-10">加载失败</view>
										</view>
									</u-image>
									<u-icon v-else name="zhanweitu" custom-prefix="sws-icon" size="160" color="#ebebeb">
									</u-icon>
								</view>
							</view>
						</template>
					</u-time-line-item>
				</u-time-line>
			</view>
		</view>
		<view class="sws-w100 u-p-t-20 u-p-r-28 u-p-b-20 u-p-l-28">
			<u-button type="primary" class="sws-w100" @click="showPopup = true">效果确认</u-button>
		</view>
		<u-popup v-model="showPopup" mode="bottom" height="666" border-radius="40">
			<view class="sws-wh100 u-flex sws-flex-d-column">
				<view class="popup-header u-text-center u-font-32">改善效果确认</view>
				<view class="sws-w100 u-flex-1 u-flex u-col-top u-p-20">
					<view class="u-flex-1 u-flex sws-flex-d-column u-row-center sws-h100">
						<view class="u-text-center">
							<u-icon name="gaishantisheng" custom-prefix="sws-icon" size="120" color="#3c9cff"></u-icon>
						</view>
						<view class="u-font-32 u-text-center u-content-color">改善措施是否有效？</view>
						<u-radio-group v-model="value" class="sws-w100 radio-group u-m-t-20" size="30" width="50%"
							active-color="#3c9cff">
							<u-radio name="有效" label-size="30">是</u-radio>
							<u-radio name="无效" label-size="30">否</u-radio>
						</u-radio-group>
						<view class="sws-w100 u-p-20">
							<u-input type="textarea" placeholder="请输入原因" :border="true"></u-input>
						</view>
					</view>
					<u-line direction="col" length="90%" class="line-splice" color="#3c9cff"></u-line>
					<view class="u-flex-1 u-flex sws-flex-d-column u-row-center sws-h100">
						<view class="u-text-center">
							<u-icon name="yufang1" custom-prefix="sws-icon" size="120" color="#3c9cff"></u-icon>
						</view>
						<view class="u-font-32 u-text-center u-content-color">预防措施是否有效？</view>
						<u-radio-group v-model="value2" class="sws-w100 radio-group u-m-t-20" size="30" width="50%"
							active-color="#3c9cff">
							<u-radio name="有效" label-size="30">是</u-radio>
							<u-radio name="无效" label-size="30">否</u-radio>
						</u-radio-group>
						<view class="sws-w100 u-p-20">
							<u-input type="textarea" placeholder="请输入原因" :border="true"></u-input>
						</view>
					</view>
				</view>
				<view class="sws-w100 u-p-20 u-flex">
					<u-button type="default" size="medium" class="btn-style">关闭</u-button>
					<u-button type="primary" size="medium" class="btn-style">确认</u-button>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				imageList: [],
				value: '有效',
				value2: '有效',
				showPopup: false
			}
		}
	}
</script>

<style lang="scss" scoped>
	.head-bg {
		background-color: $u-type-primary;
		height: 200rpx;
		width: 100%;
		background: radial-gradient(circle at 50% -540rpx, #2979ff 800rpx, #ffffff 0);
	}

	.box-wrap {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		padding: 0 40rpx;
		z-index: 3;
	}

	.info-box {
		height: 300rpx;
		box-shadow: 0 0 2rpx rgba(0, 0, 0, .2);
		background-color: #ffffff;
		border-radius: 20rpx;
	}

	.box-line {
		margin: -42rpx 0 -44rpx 0;
	}

	.box-extra {
		height: 220rpx;
		box-shadow: 0 0 2rpx rgba(0, 0, 0, .2);
		background-color: #ffffff;
		border-radius: 20rpx;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		justify-content: space-between;

		&-header {
			height: 40rpx;
			width: 100%;
		}

		&-content {
			height: 180rpx;
			width: 100%;
			display: flex;
			background-color: #3c9cff;
		}
	}

	.content-wrap {
		padding-top: 340rpx;
		height: calc(100% - 310rpx);
		width: 100%;
	}

	.btn-style {
		letter-spacing: 20rpx;
		text-indent: 20rpx;
		line-height: normal;
	}

	.info-box-title {
		padding-top: 20rpx;
	}

	.cell-bar {
		height: 60rpx;
		width: 80%;
		padding: 0 30rpx;
		border: 2rpx solid #ebebeb;
		border-bottom-left-radius: 30rpx;
		border-bottom-right-radius: 30rpx;
	}

	.time-wrap {
		display: flex;
	}

	.time-content {
		display: flex;
		flex-direction: column;
	}

	.popup-header {
		width: 100%;
		height: 80rpx;
		line-height: 80rpx;
		color: #ffffff;
		background-color: $u-type-primary;
	}

	.line-splice {
		margin: 5% 20rpx !important;
	}

	.dark-white {
		color: rgba(255, 255, 255, .6)
	}

	::v-deep.radio-group .u-radio {
		justify-content: center;
	}

	::v-deep.info-box .u-cell {
		padding: 6rpx 20rpx;
	}

	::v-deep.info-box-title .u-cell {
		padding: 0 20rpx;
		background-color: #3c9cff !important;
	}
</style>
