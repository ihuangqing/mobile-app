<!-- 锁定、解锁、报废 -->
<template>
	<view class="sws-wh100 u-flex sws-flex-d-column">
		<view class="tab-bar u-flex u-row-center">
			<view class="tab-bar-item" :class="currentIndex == tabIndex ? 'active' : ''" v-for="(item, tabIndex) in tabList"
				:key="tabIndex" @click="tabClick(tabIndex)">
				<view class="tab-bar-item-content u-flex sws-flex-d-column">
					<view class="tab-bar-item-content-text">{{ item }}</view>
				</view>
			</view>
		</view>
		<view class="sws-w100 u-flex-1 u-p-40 sws-overflow-scroll-y">
			<view class="input-wrap">
				<u-cell-group :border="false" class="input-wrap-cellGroup">
					<u-cell-item hover-class="none" :arrow="false" title="上盖码" :value-style="{flex: 0}" class="u-p-r-20">
						<view slot="right-icon" class="u-flex u-flex-1">
							<u-input type="text" placeholder="请输入/扫描上盖码" inputAlign="right" v-model="model.coverSn">
							</u-input>
							<u-icon class="u-m-l-10" name="saoma" custom-prefix="sws-icon" size="44" color="#2979ff"
								@click="scanCode('cover')">
							</u-icon>
						</view>
					</u-cell-item>
					<u-cell-item required hover-class="none" :arrow="false" title="产品条码" :value-style="{flex: 0}"
						class="u-p-r-20">
						<view slot="right-icon" class="u-flex u-flex-1">
							<u-input type="text" placeholder="请输入/扫描产品条码" inputAlign="right" v-model="model.productSn">
							</u-input>
							<u-icon class="u-m-l-10" name="saoma" custom-prefix="sws-icon" size="44" color="#2979ff"
								@click="scanCode">
							</u-icon>
						</view>
					</u-cell-item>
					<u-cell-item v-show="currentIndex != 1" required hover-class="none" :arrow="false"
						:title="currentIndex == 2 ? '是否二次报废' : '是否二次解锁'" :value-style="{flex: 0}" class="u-p-r-20">
						<view slot="right-icon" class="u-flex u-flex-1 u-row-right">
							<u-switch v-model="model.checked" :showText="true" okText="是" ngText="否"
								@change="switchChange"></u-switch>
						</view>
					</u-cell-item>
					<u-cell-item v-show="currentIndex == 1" required hover-class="none" arrow-direction="down" title="锁定类型"
						:value-style="selectTextColor(model.type)" :value="model.type ? model.type : '请选择锁定类型'" @click="toShowType">
					</u-cell-item>
					<u-cell-item v-show="currentIndex == 1" :required="groupRequired" hover-class="none" arrow-direction="right"
						title="发现工序" :value-style="selectTextColor(model.groupName)"
						:value="model.groupName ? model.groupName : '请选择发现工序'" @click="toShowGroup">
					</u-cell-item>
					<u-cell-item required hover-class="none" arrow-direction="right" title="不良代码"
						:value-style="selectTextColor(model.badCode)" :value="model.badCode ? model.badCode : '请选择不良代码'"
						@click="toShowBd">
					</u-cell-item>
					<u-cell-item v-show="model.badCode" hover-class="none" :arrow="false" title="不良描述"
						:value-style="selectTextColor(model.badDetail)" :value="model.badDetail">
					</u-cell-item>
					<u-cell-item hover-class="none" :arrow="false" title="备注" :value-style="{flex: 0}">
						<view slot="right-icon" class="u-flex u-flex-1">
							<u-input type="textarea" placeholder="请输入备注" inputAlign="right" class="u-p-r-20" v-model="model.remark">
							</u-input>
						</view>
					</u-cell-item>
				</u-cell-group>
			</view>
		</view>
		<view class="sws-w100 u-p-b-40 u-p-l-40 u-p-r-40">
			<u-button :type="btnSwitch().type" class="btn-style" @click="confirmOperate">{{ btnSwitch().name }}
			</u-button>
		</view>
		<u-modal v-model="showModal" :content="modalCont" @confirm="modalConfirm"></u-modal>
		<u-select v-model="showSelect" :list="selectList" @confirm="selectConfirm"></u-select>
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
				model: {
					coverSn: '', //上盖码
					productSn: '',
					type: '',
					groupName: '',
					groupCode: '',
					badCode: '',
					bdId: '',
					badDetail: '',
					remark: '',
					checked: false,
					lockStatus: 6 //默认传6  解锁 报废 第一次操作对象都是已锁定状态
				},
				currentIndex: 1, //默认锁定
				tabList: ['解锁', '锁定', '报废'],
				selectList: [],
				showSelect: false,
				modalCont: '',
				showModal: false,
				groupRequired: false, //发现工序是否必填，如果锁定类型为 来料不良 则非必填
			}
		},
		computed: {
			...mapState(['userInfo']),
			selectTextColor(val) {
				return val => {
					return val ? {
						'color': '#303133',
						'font-size': '28rpx',
						'word-break': 'break-all'
					} : {
						'color': '#c0c4cc',
						'font-size': '28rpx'
					}
				}
			},
			btnSwitch() {
				return () => {
					let res = {}
					switch (this.currentIndex) {
						case 0:
							res = {
								type: 'success',
								name: '解锁'
							}
							break;
						case 1:
							res = {
								type: 'primary',
								name: '锁定'
							}
							break;
						case 2:
							res = {
								type: 'error',
								name: '报废'
							}
							break;
					}
					return res
				}
			}
		},
		methods: {
			getProductSnForMesLock() {
				this.$u.api.getProductSnForMesLock({
					productSn: this.model.coverSn
				}).then(res => {
					if (res.msgCode === '000000') {
						if (res.data) {
							this.model.productSn = res.data
						} else {
							this.$refs.uTips.show({
								title: '未查询到相关的产品条码信息！',
								type: 'warning',
								duration: 2300
							})
						}
					} else {
						this.$refs.uTips.show({
							title: `产品条码查询失败，原因：${ res.message }`,
							type: 'error',
							duration: 2300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			switchChange(value) {
				if (this.currentIndex == 2 && value) { //报废
					this.model.lockStatus = 5
				} else if (this.currentIndex == 0 && value) {
					this.model.lockStatus = 8
				} else {
					this.model.lockStatus = 6
				}

				// 切换二次,清楚不良代码选择
				this.model.badCode = ''
				this.model.bdId = ''
				this.model.badDetail = ''
			},
			modalConfirm() {
				this.model = {
					productSn: '',
					type: '',
					groupName: '',
					groupCode: '',
					badCode: '',
					bdId: '',
					badDetail: '',
					remark: '',
					checked: false,
					lockStatus: 6
				}
			},
			confirmUnlock() {
				let checkArr = [{
					tips: '请输入/扫描产品条码',
					value: this.model.productSn
				}, {
					tips: '请选择不良代码',
					value: this.model.badCode
				}]

				if (this.common.checkNotNull(this, checkArr)) {
					const params = {
						empNo: this.userInfo.account,
						bdId: this.model.bdId,
						productSn: this.model.productSn,
						remark: this.model.remark,
						times: this.model.lockStatus == '8' ? '2' : '1' //待解锁状态(8)，属于二次解锁，否则为一次解锁
					}

					this.$u.api.postUnlockForMes(params).then(res => {
						if (res.msgCode === '000000') {
							this.modalCont = `产品${ this.model.productSn }解锁成功`
							this.showModal = true
						} else {
							this.$refs.uTips.show({
								title: `解锁失败，原因：${ res.message }`,
								type: 'error',
								duration: 2300
							})
						}
					}).catch(err => {
						this.common.sysErrToast(this, err)
					})
				}
			},
			confirmLock() {
				let checkArr = [{
					tips: '请输入/扫描产品条码',
					value: this.model.productSn
				}, {
					tips: '请选择锁定类型',
					value: this.model.type
				}, {
					tips: '请选择不良代码',
					value: this.model.badCode
				}]

				if (this.groupRequired) {
					const obj = {
						tips: '请选择发现工序',
						value: this.model.groupCode
					}
					checkArr.splice(2, 0, obj)
				}

				if (this.common.checkNotNull(this, checkArr)) {
					const params = {
						empNo: this.userInfo.account,
						bdId: this.model.bdId,
						badCode: this.model.badCode,
						groupCode: this.model.groupCode,
						productSn: this.model.productSn,
						type: this.model.type,
						remark: this.model.remark
					}

					this.$u.api.postLockForMes(params).then(res => {
						if (res.msgCode === '000000') {
							this.modalCont = `产品${ this.model.productSn }锁定成功`
							this.showModal = true
						} else {
							this.$refs.uTips.show({
								title: `锁定失败，原因：${ res.message }`,
								type: 'error',
								duration: 2300
							})
						}
					}).catch(err => {
						this.common.sysErrToast(this, err)
					})
				}
			},
			confirmScrap() {
				let checkArr = [{
					tips: '请输入/扫描产品条码',
					value: this.model.productSn
				}, {
					tips: '请选择不良代码',
					value: this.model.badCode
				}]

				if (this.common.checkNotNull(this, checkArr)) {
					const params = {
						empNo: this.userInfo.account,
						bdId: this.model.bdId,
						productSn: this.model.productSn,
						remark: this.model.remark,
						times: this.model.lockStatus == '5' ? '2' : '1' //待报废状态(5)，属于二次报废，否则为一次报废
					}

					this.$u.api.postScrapForMes(params).then(res => {
						if (res.msgCode === '000000') {
							this.modalCont = `产品${ this.model.productSn }报废成功`
							this.showModal = true
						} else {
							this.$refs.uTips.show({
								title: `报废失败，原因：${ res.message }`,
								type: 'error',
								duration: 2300
							})
						}
					}).catch(err => {
						this.common.sysErrToast(this, err)
					})
				}
			},
			confirmOperate() {
				switch (this.currentIndex) {
					case 0:
						this.confirmUnlock()
						break;
					case 1:
						this.confirmLock()
						break;
					case 2:
						this.confirmScrap()
						break;
				}
			},
			toShowBd() {
				if (!this.model.productSn) {
					this.$refs.uTips.show({
						title: '请输入/扫描产品条码',
						type: 'warning',
						duration: 2300
					})
					return
				}

				if (this.currentIndex === 1 && !this.model.type) {
					this.$refs.uTips.show({
						title: '请选择锁定类型',
						type: 'warning',
						duration: 2300
					})
					return
				}

				if (this.currentIndex === 1 && !this.model.groupCode && this.groupRequired) {
					this.$refs.uTips.show({
						title: '请选择发现工序',
						type: 'warning',
						duration: 2300
					})
					return
				}

				let params = {
					lockStatus: this.model.lockStatus,
					productSn: this.model.productSn,
				}

				let funcName = 'getBadCodeForOther'
				if (this.currentIndex === 1) {
					params = {
						foundGroupCode: this.model.groupCode,
						productSn: this.model.productSn,
						status: 1,
						type: this.model.type
					}

					funcName = 'getBadcodeForLock'
				}

				this.$u.api[funcName](params).then(res => {
					if (res.msgCode === '000000') {
						if (res.data && Array.isArray(res.data)) {
							const bdList = res.data.map(({
								badCode,
								bdId,
								badDetail
							}) => {
								return {
									name: badCode,
									value: bdId,
									desc: badDetail,
									checked: false
								}
							})

							if (bdList.length) {
								this.goToSelected('请选择不良代码', bdList, 'badCode', true, false)
							} else {
								this.$refs.uTips.show({
									title: '暂无不良代码数据',
									type: 'warning',
									duration: 2300
								})
							}

						} else {
							this.$refs.uTips.show({
								title: '暂无不良代码数据',
								type: 'warning',
								duration: 2300
							})
						}
					} else {
						this.$refs.uTips.show({
							title: `不良代码获取失败，原因：${ res.message }`,
							type: 'error',
							duration: 2300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			toShowGroup() {
				if (!this.model.productSn) {
					this.$refs.uTips.show({
						title: '请输入/扫描产品条码',
						type: 'warning',
						duration: 2300
					})
					return
				}

				if (!this.model.type) {
					this.$refs.uTips.show({
						title: '请选择锁定类型',
						type: 'warning',
						duration: 2300
					})
					return
				}
				const params = {
					type: this.model.type,
					productSn: this.model.productSn
				}
				this.$u.api.getGroupListForMesLock(params).then(res => {
					if (res.msgCode === '000000') {
						if (res.data && res.data.length) {
							const groupList = res.data.map(({
								groupName,
								groupCode
							}) => {
								return {
									name: groupName,
									value: groupCode,
									checked: false
								}
							})

							if (groupList.length) {
								this.goToSelected('请选择发现工序', groupList, 'group', false, true)
							} else {
								this.$refs.uTips.show({
									title: '暂无发现工序数据',
									type: 'warning',
									duration: 2300
								})
							}

						} else {
							this.$refs.uTips.show({
								title: '暂无发现工序数据',
								type: 'warning',
								duration: 2300
							})
						}
					} else {
						this.$refs.uTips.show({
							title: `发现工序获取失败，原因：${ res.message }`,
							type: 'error',
							duration: 2300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			selectConfirm(arr) {
				const temp = arr[0]
				if (temp.value == '产品锁定') {
					this.groupRequired = true
				} else {
					this.groupRequired = false
				}
				this.model.type = temp.value
			},
			toShowType() {
				this.selectList = [{
					label: '产品锁定',
					value: '产品锁定'
				}, {
					label: '来料不良',
					value: '来料不良'
				}]
				this.showSelect = true
			},
			tabClick(index) {
				this.currentIndex = index
				if (this.currentIndex == 2 && this.model.lockStatus == 5) { //报废
					this.$nextTick(() => {
						this.model.checked = true
					}, 100)
				} else if (this.currentIndex == 0 && this.model.lockStatus == 8) {
					this.$nextTick(() => {
						this.model.checked = true
					}, 100)
				} else {
					this.$nextTick(() => {
						this.model.checked = false
					}, 100)
				}
			},
			goToSelected(title, list, type, hasSearch = false, isRadio = false) {
				let _self = this
				let params = {
					title: title,
					items: list,
					hasSearch,
					isRadio
				}
				uni.navigateTo({
					url: '/pages/common/selectItems/index',
					events: {
						acceptDataFromOpenedPage(res) {
							if (type === 'group') {
								const temp = res.data[0]
								_self.model.groupName = temp.name
								_self.model.groupCode = temp.value
							} else {
								_self.model.badCode = res.data.map(({
									name
								}) => name).join(',')
								_self.model.bdId = res.data.map(({
									value
								}) => value).join(',')
								_self.model.badDetail = res.data.map(({
									desc
								}) => desc).join(',')
							}
						}
					},
					success: function(res) {
						res.eventChannel.emit('acceptDataFromOpenerPage', params)
					}
				})
			},
			async scanCode(flag) {
				const code = await this.common.scanCode()
				if (flag === 'cover') {
					this.model.coverSn = code
					this.getProductSnForMesLock()
				} else {
					this.model.productSn = code
				}
			}
		},
		onBackPress() {
			if (this.showSelect) {
				this.showSelect = false
				return true
			}
		},
		onNavigationBarButtonTap() {
			const _self = this
			uni.navigateTo({
				url: '/pages/microApp/Mes/lockUnlock/queryPage/index',
				events: {
					//获取查询页面返回的产品编码和操作类型 type 0 解锁 1锁定 2报废
					eventFromQueryPage: ({
						packSn,
						type,
						lockStatus
					}) => {
						_self.currentIndex = type
						_self.model.productSn = packSn
						_self.model.lockStatus = lockStatus
						if ((lockStatus == 8 && type == 0) || (lockStatus == 5 && type == 2)) {
							_self.model.checked = true
						} else {
							_self.model.checked = false
						}
					}
				}
			})
		}
	}
</script>

<style lang="scss" scoped>
	.tab-bar {
		width: 100%;
		padding: 80rpx 60rpx 0 60rpx;

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

		&-item:nth-child(3).active .tab-bar-item-content {
			font-size: 32rpx;
			color: $u-type-error;
			background-color: $u-type-error;
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

		&-item:nth-child(3):after {
			border-top-color: $u-type-error;
		}

		&-item.active:after {
			top: 18rpx;
		}

		&-item:nth-child(2) {
			margin: 0 40rpx;
		}
	}

	.input-wrap {
		height: 100%;
		border-radius: 16rpx;
		border: 2rpx solid #ebebeb;
		box-shadow: 0 0 2rpx rgba(0, 0, 0, .2);
		overflow: hidden;
		
		&-cellGroup {
			width: 100%;
			height: 100%;
			overflow: scroll;
		}
	}

	.btn-style {
		letter-spacing: 20rpx;
		text-indent: 20rpx;
	}

	::v-deep .u-cell_right {
		flex: 1;
	}
</style>