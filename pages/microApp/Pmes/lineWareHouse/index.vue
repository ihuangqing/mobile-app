<template>
	<view class="sws-wh100 u-p-20 u-rela">
		<view class="tab-bar u-flex u-row-center">
			<view class="tab-bar-item" :class="currentIndex == tabIndex ? 'active' : ''" v-for="(item, tabIndex) in tabList"
				:key="tabIndex" @click="tabClick(tabIndex)">
				<view class="tab-bar-item-content u-flex sws-flex-d-column">
					<view class="tab-bar-item-content-text">{{ item }}</view>
				</view>
			</view>
		</view>
		<scroll-view scroll-y scroll-with-animation class="scroll-wrap input-wrap">
			<u-form :model="form" ref="uForm" :error-type="['topTips']" class="sws-h100">
				<view class="form-card">
					<view class="u-m-b-20 u-p-l-40 u-p-r-30 u-flex u-row-between u-col-center">
						<view class="sws-font-bold u-font-32 ">{{ typeName }}信息</view>
					</view>
					<u-form-item required :border-bottom="false" label="出货牌号" prop="sn">
						<u-input v-model="form.sn" placeholder="请输入/扫描出货牌号" @blur="toGetSnInfo" @confirm="toGetSnInfo" />
						<u-icon slot="right" name="saoma" custom-prefix="sws-icon" size="48" color="#2979ff"
							@click="toScanCode('sn')"></u-icon>
					</u-form-item>
					<u-form-item v-if="typeCode === 2 && form.outNum !== ''" required :border-bottom="false" label="出货数量">
						<u-input v-model="form.outNum" disabled placeholder="" />
					</u-form-item>
					<u-form-item v-if="typeCode === 1 && form.storeNum !== ''" required :border-bottom="false" label="在库数量">
						<u-input v-model="form.storeNum" disabled placeholder="" />
					</u-form-item>
					<u-form-item required :border-bottom="false" label="货架号" prop="whNumber">
						<u-input v-model="form.whNumber" :disabled="typeCode === 1" placeholder="请输入/扫描货架号" />
						<u-icon v-if="typeCode === 2" slot="right" name="saoma" custom-prefix="sws-icon" size="48" color="#2979ff"
							@click="toScanCode('whNumber')"></u-icon>
					</u-form-item>
					<u-form-item required :border-bottom="false" :label="`${typeName}数量`" prop="snNum">
						<u-input v-model="form.snNum" :placeholder="`请输入${typeName}数量`" />
					</u-form-item>
				</view>
			</u-form>
		</scroll-view>
		<view class="btn-style sws-w100 u-p-t-20 u-flex">
			<u-button type="default" class="u-p-l-30 u-p-r-30 u-m-r-20" @click="resetInfo">重置</u-button>
			<u-button :type="currentIndex ? 'primary' : 'success'" class="u-flex-1" @click="toSubmit">确认</u-button>
		</view>
		<u-modal v-model="showModal" :content="modalContent" @confirm="resetInfo"></u-modal>
		<u-top-tips ref="uTips"></u-top-tips>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'

	export default {
		data() {
			return {
				typeCode: 2,
				typeName: '入库',
				currentIndex: 0,
				tabList: ['入库', '出库'],
				form: {
					sn: '',
					whNumber: '',
					snNum: '',
					outNum: '', //出货数量
					storeNum: '', //在库数量
				},
				rules: {
					sn: [{
						required: true,
						trigger: ['change', 'blur'],
						message: '请输入/扫描出货牌号'
					}],
					whNumber: [{
						required: true,
						trigger: ['change', 'blur'],
						message: '请输入/扫描货架号'
					}],
					snNum: [{
						asyncValidator: (rule, val, callback) => {
							if (val) {
								if (this.typeCode === 1) {
									if (+val > this.form.storeNum) {
										callback(new Error(`${this.typeName}数量不能大于在库数量`))
									} else {
										callback()
									}
								} else {
									if (+val > this.form.outNum) {
										console.log('this.typeName: ', this.typeName);
										callback(new Error(`${this.typeName}数量不能大于出货数量`))
									} else {
										callback()
									}
								}
							} else {
								callback(new Error(`请输入${this.typeName}数量`))
							}
						},
						trigger: 'blur',
					}],
				},
				modalContent: '',
				showModal: false
			}
		},
		onLoad() {
			const storage = uni.getStorageSync('pems_login_info')

			this.header = {
				token: storage.token.tokenValue,
				terminal: 'PDA'
			}
		},
		onReady() {
			this.$refs.uForm.setRules(this.rules)
		},
		methods: {
			tabClick(index) {
				if (this.currentIndex !== index) {
					this.resetInfo()
					this.currentIndex = index
					if (index == 1) {
						this.typeCode = 1 //2 入库 1 出库
						this.typeName = '出库'
					} else {
						this.typeCode = 2
						this.typeName = '入库'
					}
				}
			},
			toSubmit() {
				this.$refs.uForm.validate(valid => {
					if (valid) {
						const params = {
							query: {
								whNumber: this.form.whNumber,
								creationType: this.typeCode,
								inWHType: '2', // 固定为出货牌
								sn: this.form.sn,
								snNum: this.form.snNum
							},
							header: this.header
						}

						this.$u.api.updateLineWHMasterForPmes(params).then(res => {
							if (res.code === 0) {
								this.modalContent = res.msg
								this.showModal = true
							} else {
								this.$refs.uTips.show({
									title: `${ this.typeName }失败，原因：${ res.msg }`,
									type: 'error',
									duration: 3300
								})
							}
						}).catch(err => {
							this.common.sysErrToast(this, err)
						})
					}
				})
			},
			getLineWHMasterForPmes(params) {
				return new Promise((resolve, reject) => {
					this.$u.api.getLineWHMasterForPmes(params).then(res => {
						if (res.data != null && res.data.length > 0) {
							resolve(res.data)
						} else {
							resolve([])
						}
					}).catch(err => {
						resolve({})
						this.common.sysErrToast(this, err)
					})
				})
			},
			getShipmentDetailForPmes(params) {
				return new Promise((resolve, reject) => {
					this.$u.api.getShipmentDetailForPmes(params).then(res => {
						if (res.data != null) {
							resolve(res.data)
						} else {
							resolve({})
						}
					}).catch(err => {
						resolve({})
						this.common.sysErrToast(this, err)
					})
				})
			},
			async toGetSnInfo() {
				const params = {
					query: {
						inWHType: '2',
						sn: this.form.sn,
						page: 0,
						limit: 0
					},
					header: this.header
				}
				let res = await this.getLineWHMasterForPmes(params) //优先查在库信息
				if (res.length) {
					const temp = res[0]
					this.form.whNumber = temp.whNumber
					if (this.typeCode === 2) {
						const num = temp.originalNum - temp.snNum //计算出货数量
						this.form.outNum = num
						this.form.snNum = num
					} else {
						this.form.storeNum = temp.snNum //在库数量
						this.form.snNum = temp.snNum
					}
				} else {
					if (this.typeCode === 2) {
						res = await this.getShipmentDetailForPmes(params) //不存在在库信息时，查询出货牌信息表
						if (Object.keys(res).length) {
							this.form.outNum = res.originalNum
							this.form.snNum = res.originalNum
						} else {
							this.$refs.uTips.show({
								title: '未查到出货牌出货数量',
								type: 'warning',
								duration: 3300
							})
						}
					} else {
						this.$refs.uTips.show({
							title: '未查到在库数据',
							type: 'warning',
							duration: 3300
						})
					}
				}
			},
			async toScanCode(key) {
				const code = await this.common.scanCode()
				this.form[key] = code
				if (key === 'sn') { //扫出货牌号
					this.toGetSnInfo()
				}
			},
			resetInfo() {
				this.form = {
					sn: '',
					whNumber: '',
					snNum: '',
					outNum: '',
					storeNum: ''
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.scroll-wrap {
		width: 100%;
		border-radius: 16rpx;
		overflow: hidden;
		height: calc(100% - 100rpx - 260rpx);
	}

	.form-card {
		height: 100%;
		background-color: #fff;
		border-radius: 16rpx;
		padding-top: 20rpx;
		margin-bottom: 20rpx;
		overflow: hidden;
	}

	.form-card:last-child {
		margin-bottom: 0;
	}

	.btn-style {
		position: absolute;
		left: 0;
		bottom: 0;
		padding: 20rpx;
		letter-spacing: 20rpx;
		text-indent: 20rpx;
	}

	.line-section {
		box-shadow: 0 2rpx 10rpx #ebebeb;
		margin-top: 10rpx;
	}

	::v-deep .form-card .u-form-item {
		padding: 0 30rpx 20rpx 40rpx !important;
	}

	::v-deep .scroll-wrap .u-form {
		height: 100% !important;
	}

	.tab-bar {
		width: 100%;
		padding: 60rpx 60rpx 0 60rpx;

		&-item {
			width: 160rpx;
			height: 200rpx;

			&-content {
				position: relative;
				width: 160rpx;
				height: 160rpx;
				border-radius: 50%;
				justify-content: center;
				z-index: 2;
				transition: all 300ms;

				&-text {
					width: 142rpx;
					height: 142rpx;
					line-height: 142rpx;
					letter-spacing: 16rpx;
					text-indent: 16rpx;
					text-align: center;
					border-radius: 50%;
					background-color: #ffffff;
					box-shadow: 0 0 6rpx 2rpx rgba(0, 0, 0, 0.2);
				}
			}
		}

		&-item:nth-child(1).active .tab-bar-item-content {
			font-size: 32rpx;
			color: $u-type-success;
			background-color: $u-type-success;
			box-shadow: none;
		}

		&-item:nth-child(2).active .tab-bar-item-content {
			font-size: 32rpx;
			color: $u-type-primary;
			background-color: $u-type-primary;
			box-shadow: none;
		}

		&-item:after {
			position: relative;
			content: '';
			margin-left: calc(50% - 30rpx);
			top: -20rpx;
			width: 0;
			height: 0;
			border: 30rpx solid transparent;
			border-top-color: $u-type-primary;
			transition: all 250ms;
			z-index: 0;
		}

		&-item:nth-child(1):after {
			border-top-color: $u-type-success;
		}

		&-item.active:after {
			top: 18rpx;
		}

		&-item:nth-child(2) {
			margin: 0 40rpx;
		}
	}

	.input-wrap {
		border-radius: 16rpx;
		border: 2rpx solid #ebebeb;
		box-shadow: 0 0 2rpx rgba(0, 0, 0, .2);
		overflow: hidden;
	}
</style>