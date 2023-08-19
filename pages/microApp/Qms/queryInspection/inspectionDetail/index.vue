<template>
	<view class="sws-wh100 sws-bg-ebebeb u-flex sws-flex-d-column">
		<view class="sws-w100 sws-bg-ffffff u-p-l-30 u-p-r-30 u-p-b-30">
			<view class="base-info">
				<u-cell-group :border="false" class="cell-group">
					<u-cell-item hover-class="none" :title-style="{color: '#ffffff'}" :value-style="{color: '#ffffff'}"
						bg-color="#2979ff" :arrow="false" :border-bottom="false" title="产品编号" :value="model.itemCode">
					</u-cell-item>
					<u-cell-item hover-class="none" :title-style="{color: '#ffffff'}" :value-style="{color: '#ffffff'}"
						bg-color="#2979ff" :arrow="false" :border-bottom="false" title="产品类别"
						:value="model.productionCategory">
					</u-cell-item>
					<u-cell-item hover-class="none" :title-style="{color: '#ffffff'}" :value-style="{color: '#ffffff'}"
						bg-color="#2979ff" :arrow="false" :border-bottom="false" title="产品型号" :value="model.itemName">
					</u-cell-item>
					<u-cell-item hover-class="none" :title-style="{color: '#ffffff', 'padding-right': '20rpx'}"
						:value-style="{color: '#ffffff'}" bg-color="#2979ff" :arrow="false" :border-bottom="false"
						title="生产线别" :value="model.areaSn"></u-cell-item>
					<u-cell-item hover-class="none" :title-style="{color: '#ffffff', 'padding-right': '20rpx'}"
						:value-style="{color: '#ffffff'}" bg-color="#2979ff" :arrow="false" :border-bottom="false"
						title="生产工序" :value="model.groupName"></u-cell-item>
					<u-cell-item hover-class="none" :title-style="{color: '#ffffff', 'padding-right': '20rpx'}"
						:value-style="{color: '#ffffff'}" bg-color="#2979ff" :arrow="false" :border-bottom="false"
						title="设备编码" :value="model.deviceSn"></u-cell-item>
				</u-cell-group>
				<view class="base-info-other u-flex u-row-between">
					<view>班次：{{ model.shift === 'M' ? '白班':'夜班' }}</view>
					<view>检验员：{{ model.checkPersonName }}</view>
				</view>
			</view>
		</view>
		<view class="sws-w100 u-flex-1 sws-overflow-scroll-y">
			<view class="sws-w100 u-p-l-20 u-p-t-20 u-p-r-20">
				<u-card margin="0 0 20rpx 0" :border="false" :head-style="{padding: '16rpx 30rpx'}" border-radius="16"
					box-shadow="2rpx 4rpx 2rpx 0rpx rgba(0,0,0,.1)" :body-style="{padding: 0}"
					:foot-style="{padding: '16rpx 30rpx'}"
					:show-foot="(item.isFree == 'Y' && !item.remark) ? false : true" :full="true"
					v-for="(item, index) in model.linesList" :key="index">
					<view slot="head">
						<view class="card-head u-font-32 u-flex u-row-between">
							<view class="u-flex">
								<view class="item-line"></view>
								<view class="u-font-28">{{ item.checkLocation !== 'null' ? `${item.checkItem} - ${item.checkLocation}` : `${item.checkItem}`
 }}
								</view>
							</view>
							<view class="u-font-24" :class="formatCheck(item).style">
								<u-icon :name="formatCheck(item).icon" size="28" margin-left="10"
									:label="formatCheck(item).value" label-pos="left"
									:label-color="formatCheck(item).style"></u-icon>
							</view>
						</view>
					</view>
					<view v-show="item.isFree !== 'Y'" slot="foot" class="u-font-24 sws-w100">
						<view v-show="item.checkTag == 'B'" class="u-flex">
							<view>标准上下限：</view>
							<view class="u-flex-1 u-text-right">
								<text v-show="item.lowerLimit">下限{{ item.lowerLimit }}</text>
								<text class="u-m-l-20" v-show="item.upperLimit">上限{{ item.upperLimit }}</text>
							</view>
						</view>
						<view class="u-flex u-m-t-10">
							<view>检验样本值：</view>
							<view class="u-flex-1 u-text-right">
								<text class="u-m-l-16"
									v-for="(testVal, testValIndex) in item.lineResultsList.map(({testValue}) => testValue)"
									:key="testValIndex">{{ testVal }}</text>
							</view>
						</view>
						<view v-if="item.errorResult" class="u-flex u-m-t-10">
							<view>备注：</view>
							<view class="u-flex-1 u-text-right">
								<text class="u-m-l-16">{{ item.errorResult }}</text>
							</view>
						</view>
						<view v-if="item.lineFileList" class="img-list u-m-t-10">
							<u-image v-for="(img, imgIndex) in item.lineFileList" :key="imgIndex" width="160rpx"
								height="160rpx" :src="img.fileFtpUrl" border-radius="16"
								:class="imgIndex ? 'u-m-l-10' : ''" @click="toPreview(item.lineFileList, imgIndex)">
								<u-loading slot="loading"></u-loading>
							</u-image>
						</view>
					</view>
					<view v-show="item.isFree == 'Y'" slot="foot" class="u-font-24 sws-w100">
						<view class="u-flex">
							<view>备注：</view>
							<view class="u-flex-1 u-text-right">
								<text class="u-m-l-20">{{ item.remark }}</text>
							</view>
						</view>
					</view>
				</u-card>
			</view>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				model: {
					itemCode: '',
					itemName: '',
					productionCategory: '',
					areaSn: '',
					shift: '',
					checkPerson: '',
					linesList: []
				}
			}
		},
		computed: {
			formatCheck(item) {
				return item => {
					let res = {
						style: 'u-type-info',
						value: '未检测',
						icon: 'minus-circle'
					}
					if (item.isFree == 'Y') {
						res = {
							style: 'u-type-success',
							value: '免检',
							icon: 'checkmark-circle'
						}
					} else {
						switch (item.lineCheckResult) {
							case 'OK':
								res = {
									style: 'u-type-success',
									value: '合格',
									icon: 'checkmark-circle'
								}
								break
							case 'NG':
								res = {
									style: 'u-type-error',
									value: '不合格',
									icon: 'error-circle'
								}
								break
						}
					}

					return res
				}
			}
		},
		onLoad() {
			const _self = this
			const eventChannel = this.getOpenerEventChannel()
			eventChannel.on('acceptDetailFromListPage', data => {
				_self.model = {
					...data
				}
			})
		},
		methods: {
			toPreview(list, current) {
				uni.previewImage({
					current,
					urls: list.map(({
						fileFtpUrl
					}) => fileFtpUrl)
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.base-info {
		background-color: $u-type-primary;
		border-radius: 16rpx;
		overflow: hidden;
		padding-top: 20rpx;

		&-other {
			height: 56rpx;
			line-height: 56rpx;
			background-color: rgba(255, 255, 255, .8);
			color: rgba(0, 0, 0, .6);
			margin: 10rpx 0 20rpx 0;
			padding: 0 20rpx;
		}
	}

	.btn-style {
		width: 120rpx;
		height: 50rpx;
		line-height: 50rpx;
		padding: 0 20rpx;
		text-indent: 16rpx;
		letter-spacing: 16rpx;
	}

	.confirm-style {
		font-size: 32rpx;
		width: 180rpx;
		text-indent: 28rpx;
		letter-spacing: 28rpx;
	}

	.popup-head {
		background-color: $u-type-primary;
		height: 180rpx;
	}

	.scroll-wrap {
		height: calc(100% - 200rpx);
	}

	.item-line {
		height: 26rpx;
		margin-right: 12rpx;
		border-left: 6rpx solid #774aa6;
		border-radius: 26rpx;
	}

	.img-list {
		display: -webkit-box;
		overflow-x: scroll;
		-webkit-box-pack: end;
	}

	::v-deep .switch-group .u-cell {
		padding: 16rpx 20rpx;
	}

	::v-deep .input-group .u-cell {
		padding: 10rpx 20rpx;
	}

	::v-deep .base-info .u-cell-item-box {
		background-color: $u-type-primary;
	}

	::v-deep .cell-group .u-cell {
		padding: 0rpx 32rpx;
	}
</style>
