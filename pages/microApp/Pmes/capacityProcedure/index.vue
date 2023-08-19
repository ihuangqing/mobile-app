<!-- 分容 化成 -->
<template>
	<view class="sws-wh100 sws-bg-ebebeb">
		<u-tabs :list="tabList" :is-scroll="false" :current="current" @change="change"></u-tabs>
		<view v-if="current" class="form-warp u-flex sws-flex-d-column">
			<u-form ref="uForm" :error-type="['topTips']" class="sws-w100 u-flex-1">
				<view class="form-card">
					<u-form-item required label="原托盘编号" :disabled="true" :border-bottom="false" label-width="220">
						<u-input placeholder="请输入或扫描原托盘编号" v-model="oldTranSn" type="text"
							@confirm="inputConfirm('oldTranSn', oldTranSn)"></u-input>
						<u-icon slot="right" name="saoma" custom-prefix="sws-icon" size="42" color="#2979ff"
							@click="toScanCode('oldTranSn')"></u-icon>
					</u-form-item>
					<u-form-item required label="变更托盘编号" :disabled="true" :border-bottom="false" label-width="220">
						<u-input placeholder="请输入或扫描变更托盘编号" v-model="newTranSn" type="text"
							@confirm="inputConfirm('newTranSn', newTranSn)"></u-input>
						<u-icon slot="right" name="saoma" custom-prefix="sws-icon" size="42" color="#2979ff"
							@click="toScanCode('newTranSn')"></u-icon>
					</u-form-item>
				</view>
			</u-form>
			<view class="btn-style sws-w100 u-p-t-20 u-flex">
				<u-button type="success" class="u-flex-1 u-m-r-20" @click="toDelTranSn">解绑</u-button>
				<u-button type="primary" class="u-flex-1" @click="toUpTranSn">重置</u-button>
			</view>
		</view>
		<view v-else class="form-warp">
			<scroll-view scroll-y scroll-with-animation class="scroll-wrap" :scroll-into-view="scrollIntoView">
				<view class="form-card">
					<view class="u-m-b-20 u-p-l-40">
						<view class="sws-font-bold u-font-32 ">托盘扫描</view>
					</view>
					<u-form-item required label="托盘编号" :border-bottom="false" label-width="150">
						<u-input placeholder="请输入或扫描托盘编号" v-model="tranSn" type="text"
							@confirm="inputConfirm('tranSn', tranSn)"></u-input>
						<u-icon slot="right" name="saoma" custom-prefix="sws-icon" size="42" color="#2979ff"
							@click="toScanCode('tranSn')"></u-icon>
					</u-form-item>
				</view>
				<view class="form-card u-m-b-0">
					<view class="u-m-b-20 u-p-l-40">
						<view class="sws-font-bold u-font-32 ">条码信息</view>
					</view>
					<u-form-item v-for="(item, index) in productSns" :id="item.scrollId" :key="index"
						:label="item.channel" :border-bottom="false" label-width="100">
						<u-input placeholder="请输入或扫描条码信息" v-model="item.barcode" type="text" :focus="item.focus"
							:adjust-position="false" @confirm="inputConfirm('itemCode', item.barcode, index)"
							@focus="getFocus(item)" @blur="item.focus = false"></u-input>
						<u-icon slot="right" name="saoma" custom-prefix="sws-icon" size="42" color="#2979ff"
							@click="toScanCode('itemCode', index)"></u-icon>
					</u-form-item>
					<view :style="{width: '100%', height: keyboardH}"></view>
				</view>
			</scroll-view>
			<view class="btn-style sws-w100 u-p-t-20">
				<u-button type="primary" @click="toSubmit">提交</u-button>
			</view>
		</view>
		<u-modal v-model="showModal" :content="modalContent" :show-cancel-button="showCancel" @confirm="modalConfirm">
		</u-modal>
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
				scrollIntoView: '',
				tabList: [{
					name: '条码'
				}, {
					name: '托盘'
				}],
				current: 0,
				oldTranSn: '',
				newTranSn: '',
				tranSn: '',
				productSns: [],
				rules: {},
				modalContent: '',
				showModal: false,
				showCancel: false,
				keyboardH: '337px'
			}
		},
		computed: mapState(['userInfo']),
		watch: {
			productSns: {
				handler: function(newVal) {
					console.log('newVal: ', newVal)
					if (newVal.length) {
						const flag = newVal.every(item => item.focus == false)
						if (flag) {
							// this.keyboardH = '0px'
						} else {
							this.keyboardH = '337px'
							const item = newVal.filter(item => item.focus)[0]
							this.$nextTick(() => {
								this.scrollIntoView = item.scrollId
							}, 1000)
						}
					}
				},
				deep: true
			}
		},
		onLoad({
			type
		}) {
			if (type == 1) {
				this.title = '分容'
				this.header = {
					moduleType: 'FR'
				}
			} else {
				this.title = '化成'
				this.header = {
					moduleType: 'HC'
				}
			}

			uni.setNavigationBarTitle({
				title: this.title
			})
		},
		methods: {
			getFocus(item) {
				console.log('item: ', item)
				item.focus = true
				this.$nextTick(() => {
					this.scrollIntoView = item.scrollId
				}, 1000)
			},
			inputConfirm(flag, code, index) {
				this[flag] = code
				if (flag == 'tranSn') {
					this.getTranInfo()
				} else if (flag == 'itemCode') {
					this.currIndex = index
					this.productSns[index].barcode = code
					this.toCheckSn(code)
				}
			},
			toSubmit() {
				this.$u.api.submitSnFRHCForPmes({
					header: this.header,
					body: this.productSns
				}).then(res => {
					if (res.success) {
						this.productSns = []
						this.tranSn = ''
						this.modalContent = '提交成功'
						this.showCancel = false
						this.showModal = true
					} else {
						this.$refs.uTips.show({
							title: `条码提交失败，原因：${ res.msg }`,
							type: 'error',
							duration: 2300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			toCheckSn(code) {
				if (!code) return
				this.$u.api.checkSnFRHCForPmes({
					header: this.header,
					body: {
						parames: this.tranSn,
						userName: this.userInfo.account,
						barcode: code
					}
				}).then(res => {
					if (res.success) {
						if (this.currIndex < this.productSns.length - 1) {
							this.productSns[this.currIndex + 1].focus = true
							this.productSns[this.currIndex].focus = false
							this.$nextTick(() => {
								this.scrollIntoView = this.productSns[this.currIndex + 1].id
							}, 1500)
						}
					} else {
						this.productSns[this.currIndex].barcode = ''
						this.productSns[this.currIndex].focus = true
						this.$refs.uTips.show({
							title: `条码校验失败，原因：${ res.msg }`,
							type: 'error',
							duration: 2300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			getTranInfo() {
				if (!this.tranSn) {
					this.$refs.uTips.show({
						title: '请输入或扫描托盘编号',
						type: 'warning',
						duration: 2300
					})
					return
				}

				this.$u.api.getTraySnAllForPmes({
					header: this.header,
					body: {
						parames: this.tranSn
					}
				}).then(res => {
					if (res.success) {
						const tempArr = res.data.map(item => {
							return {
								userName: this.userInfo.account, //用户
								parames: this.tranSn, //托盘
								barcode: item.barcode, //条码
								channel: String(item.channel),
								focus: false,
								scrollId: 'scroll_' + new Date().getTime()
							}
						})

						this.productSns = [...tempArr]
					} else {
						this.$refs.uTips.show({
							title: `托盘信息获取失败，原因：${ res.msg }`,
							type: 'error',
							duration: 2300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			async toScanCode(item, index) {
				const code = await this.common.scanCode()
				this[item] = code
				if (item == 'tranSn') {
					this.getTranInfo()
				} else if (item == 'itemCode') {
					this.productSns[index].barcode = code
					this.toCheckSn(code)
				}
			},
			modalConfirm() {
				if (this.modalContent.includes('此动作会解除托盘下条码的绑定关系')) {
					this.delTranSn()
				}
			},
			toUpTranSn() {
				if (!this.oldTranSn) {
					this.$refs.uTips.show({
						title: '请输入或扫描原托盘编号',
						type: 'warning',
						duration: 2300
					})
					return
				}
				if (!this.newTranSn) {
					this.$refs.uTips.show({
						title: '请输入或扫描变更托盘编号',
						type: 'warning',
						duration: 2300
					})
					return
				}

				this.$u.api.upTranSnFRHCForPmes({
					header: this.header,
					body: {
						parames: this.oldTranSn,
						newParame: this.newTranSn,
					}
				}).then(res => {
					if (res.success) {
						this.oldTranSn = ''
						this.newTranSn = ''
						this.modalContent = '重置成功!'
						this.showCancel = false
						this.showModal = true
					} else {
						this.$refs.uTips.show({
							title: `托盘重置失败，原因：${ res.msg }`,
							type: 'error',
							duration: 2300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			delTranSn() {
				if (!this.oldTranSn) {
					this.$refs.uTips.show({
						title: '请输入或扫描原托盘编号',
						type: 'warning',
						duration: 2300
					})
					return
				}

				this.$u.api.delTranSnFRHCForPmes({
					header: this.header,
					body: {
						parames: this.oldTranSn
					}
				}).then(res => {
					if (res.success) {
						this.oldTranSn = ''
						this.modalContent = '解绑成功!'
						this.showCancel = false
						this.showModal = true
					} else {
						this.$refs.uTips.show({
							title: `托盘解绑失败，原因：${ res.msg }`,
							type: 'error',
							duration: 2300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			toDelTranSn() {
				this.modalContent = '此动作会解除托盘下条码的绑定关系，是否继续？'
				this.showCancel = true
				this.showModal = true
			},
			change(index) {
				this.current = index
			}
		}
	}
</script>

<style scoped lang="scss">
	.scroll-wrap {
		width: 100%;
		border-radius: 16rpx;
		overflow: hidden;
		background-color: #fff;
		height: 100%;
	}

	.form-warp {
		width: 100%;
		height: calc(100% - 180rpx);
		padding: 20rpx;
		overflow: scroll;
	}

	.form-card {
		background-color: #fff;
		border-radius: 16rpx;
		padding: 20rpx 30rpx;
		margin-bottom: 20rpx;
		overflow: hidden;
	}

	.btn-style {
		position: absolute;
		left: 0;
		bottom: 0;
		padding: 20rpx;
		letter-spacing: 20rpx;
		text-indent: 20rpx;
	}
</style>
