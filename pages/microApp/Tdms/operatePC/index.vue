<!-- 上下机 -->
<template>
	<view class="sws-wh100 u-flex sws-flex-d-column">
		<view class="tab-bar u-flex u-row-center">
			<view class="tab-bar-item" :class="currentIndex == tabIndex ? 'active' : ''"
				v-for="(item, tabIndex) in tabList" :key="tabIndex" @click="tabClick(tabIndex)">
				<view class="tab-bar-item-content u-flex sws-flex-d-column">
					<view class="tab-bar-item-content-text">{{ item }}</view>
				</view>
			</view>
		</view>
		<view class="sws-w100 u-flex-1 u-p-40 sws-overflow-hidden">
			<view class="input-wrap">
				<view class="sws-overflow-scroll-y sws-wh100">
					<u-cell-group :border="false">
						<u-cell-item hover-class="none" :arrow="false" title="操作人" :value-style="{flex: 0}"
							class="u-p-r-20">
							<view slot="right-icon" class="u-flex u-flex-1">
								<u-input disabled type="text" placeholder="" inputAlign="right"
									v-model="userInfo.userName">
								</u-input>
							</view>
						</u-cell-item>
						<u-cell-item required hover-class="none" :arrow="false" title="样品编码" :value-style="{flex: 0}"
							class="u-p-r-20">
							<view slot="right-icon" class="u-flex-1">
								<view class="u-flex">
									<u-input type="text" placeholder="请输入/扫描样品编码" inputAlign="right" class="u-p-l-20"
										v-model="model.code" @blur="toCheckCode">
									</u-input>
									<u-icon class="u-m-l-10" name="saoma" custom-prefix="sws-icon" size="44"
										color="#2979ff" @click="toScanProduct">
									</u-icon>
								</view>
								<view class="u-flex u-row-right u-flex-wrap">
									<u-tag v-for="(tag, tagIndex) in codeList" :key="tagIndex" :text="tag"
										class="u-m-r-20 u-m-t-10" :type="currentIndex ? 'primary' : 'success'"
										:closeable="true" @close="toDelTag(tagIndex)" />
								</view>
							</view>
						</u-cell-item>
						<u-cell-item v-if="Object.keys(firstCode).length" hover-class="none" :arrow="false"
							title="申请单类型" :value-style="selectTextColor(firstCode.aplcCategory)"
							:value="firstCode.aplcCategory">
						</u-cell-item>
						<u-cell-item v-if="testItemList.length" required hover-class="none" arrow-direction="down"
							title="测试项目" :value-style="selectTextColor(model.itemName)"
							:value="model.itemName ? model.itemName : '请选择测试项目'" @click="toShowTestItemList">
						</u-cell-item>
						<u-cell-item required hover-class="none" :arrow="false" title="设备编码" :value-style="{flex: 0}"
							class="u-p-r-20">
							<view slot="right-icon" class="u-flex u-flex-1">
								<u-input type="text" placeholder="请输入/扫描设备编码" inputAlign="right"
									v-model="model.deviceCode" @blur="toCheckDeviceCode">
								</u-input>
								<u-icon class="u-m-l-10" name="saoma" custom-prefix="sws-icon" size="44" color="#2979ff"
									@click="toScanDevice">
								</u-icon>
							</view>
						</u-cell-item>
						<u-cell-item v-if="firstCode.aplcCategory == 'CELL' && passList.length" required
							hover-class="none" arrow-direction="down" title="通道编码"
							:value-style="selectTextColor(model.devicePassCode)"
							:value="model.devicePassCode ? model.devicePassCode : '请选择通道编码'" @click="toShowPassList">
						</u-cell-item>
					</u-cell-group>
				</view>
			</view>
		</view>
		<view class="sws-w100 u-p-b-40 u-p-l-40 u-p-r-40">
			<u-button :type="btnSwitch().type" class="btn-style" @click="confirmOperate">{{ btnSwitch().name }}
			</u-button>
		</view>
		<u-modal v-model="showModal" :content="modalContent" :show-cancel-button="showCancelBtn"
			@confirm="modalConfirm">
		</u-modal>
		<u-select v-model="showSelect" :list="selectList" :title="selectTitle" @confirm="selectConfirm"></u-select>
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
					code: '', //当前输入的条码
					fdApplyNo: '', //OA单号
					itemName: '', //测试项目
					deviceCode: '', //设备编码
					devicePassCode: '', //通道编码
				},
				codeList: [], //样品条码,可以多个
				curCode: '', //当前扫码条码
				firstCode: {}, //
				testItemList: [], //第一个条码的测试项列表
				passList: [], //通道列表
				downInfo: [], //数据录入模板数据
				currentIndex: 0, //默认上机
				tabList: ['上机', '下机'],
				selectTitle: '',
				selectList: [],
				showSelect: false,
				modalContent: '',
				showCancelBtn: false,
				showModal: false
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
								name: '上机'
							}
							break;
						case 1:
							res = {
								type: 'primary',
								name: '下机'
							}
							break;
					}
					return res
				}
			}
		},
		// onLoad() {
		// 	this.toSaveData()
		// },
		methods: {
			toReset() { //清空数据
				this.model = {
					code: '', //当前输入的条码
					fdApplyNo: '', //OA单号
					itemName: '', //测试项目
					deviceCode: '', //设备编码
					devicePassCode: '', //通道编码
				}
				this.codeList = [] //样品条码,可以多个
				this.curCode = '' //当前扫码条码
				this.firstCode = {} //
				this.testItemList = []
			},
			toSaveData() {
				// this.templateCodeList = ['LY20220402001-1', 'LY20220402001-2']
				// this.downInfo = [{
				// 	"id": 138,
				// 	"createdBy": "admin",
				// 	"creationDate": "2022-04-01 15:58:39",
				// 	"lastUpdatedBy": "admin",
				// 	"lastUpdateDate": "2022-04-01 15:58:39",
				// 	"testItemId": 229,
				// 	"version": 1,
				// 	"qtyControl": "N",
				// 	"itemTypeName": "电化学分析",
				// 	"itemName": "膜片电阻",
				// 	"itemNameEn": "Film resistance",
				// 	"templateFieldsList": [{
				// 		"id": 539,
				// 		"createdBy": "admin",
				// 		"creationDate": "2022-04-01 15:58:39",
				// 		"lastUpdatedBy": "admin",
				// 		"lastUpdateDate": "2022-04-01 15:58:39",
				// 		"templateId": 138,
				// 		"seq": 1,
				// 		"fieldName": "温度",
				// 		"fieldNameEn": "test",
				// 		"fieldType": "NUMBER",
				// 		"mappedField": "reservedField1"
				// 	}, {
				// 		"id": 541,
				// 		"createdBy": "admin",
				// 		"creationDate": "2022-04-01 15:58:39",
				// 		"lastUpdatedBy": "admin",
				// 		"lastUpdateDate": "2022-04-01 15:58:39",
				// 		"templateId": 138,
				// 		"seq": 1,
				// 		"fieldName": "下班",
				// 		"fieldNameEn": "test",
				// 		"fieldType": "STRING",
				// 		"mappedField": "reservedField3"
				// 	}, {
				// 		"id": 540,
				// 		"createdBy": "admin",
				// 		"creationDate": "2022-04-01 15:58:39",
				// 		"lastUpdatedBy": "admin",
				// 		"lastUpdateDate": "2022-04-01 15:58:39",
				// 		"templateId": 138,
				// 		"seq": 1,
				// 		"fieldName": "TEST009",
				// 		"fieldNameEn": "test",
				// 		"fieldType": "STRING",
				// 		"mappedField": "reservedField2"
				// 	}]
				// }]

				uni.navigateTo({
					url: '/pages/microApp/Tdms/saveData/index?from=operate',
					success: res => {
						res.eventChannel.emit('acceptDataFromOpenerPage', {
							codeList: this.templateCodeList,
							dataInfo: this.downInfo[0]
						})
					}
				})
			},
			modalConfirm() {
				if (this.modalContent.includes('删除第一个样品编码会清空所有数据')) {
					this.codeList.splice(this.curDelIndex, 1)
				} else if (this.modalContent.includes('下机成功') && this.firstCode.aplcCategory === 'MAT' && this.downInfo
					.length) {
					//下机成功，如果oa类型为MAT的则需要开始数据录入
					this.modalContent = '是否进行数据录入？'
					this.showCancelBtn = true
					this.showModal = true
					return
				} else if (this.modalContent.includes('是否进行数据录入')) {
					this.templateCodeList = [...this.codeList] //复制一份样品编码，防止被reset掉
					this.toSaveData()
				}
				this.toReset()
			},
			toDelTag(index) {
				if (!index) {
					if (this.codeList.length > 1) { //如果是第一个且样品编码总数大于1时，则需要二次确认
						this.modalContent = '删除第一个样品编码会清空所有数据，是否确认？'
						this.curDelIndex = index
						this.showCancelBtn = true
						this.showModal = true
						return
					} else {
						this.toReset()
					}
				}
				this.codeList.splice(index, 1)
			},
			toCheckCode() {
				if (this.firstCode.aplcCategory === 'CELL') return
				if (!this.model.code) return
				this.curCode = this.model.code
				this.toQueryByCode('product')
			},
			toCheckDeviceCode() {
				if (!this.model.deviceCode) return
				this.curCode = this.model.deviceCode
				this.toQueryByCode('device')
			},
			confirmOperate() {
				let params = {
					samples: this.codeList.join(','), //样品条码
					aplcCategory: this.firstCode.aplcCategory, //oa单类型
					deviceCode: this.model.deviceCode, //设备编码
					itemId: this.model.itemId, //测试项目id
					itemName: this.model.itemName, //测试项目名称
					oaItemId: this.model.oaItemId, //测试主键
				}
				//校验上机
				const checkArr = [{
					tips: '请输入/扫描样品编码',
					value: this.codeList.length
				}, {
					tips: '请选择测试项目',
					value: this.model.itemName
				}, {
					tips: '请输入/扫描设备编码',
					value: this.model.deviceCode
				}]

				if (this.firstCode.aplcCategory === 'CELL') { //如果是CELL类型，则需要上传通道CODE
					params.devicePassCode = this.model.devicePassCode
					checkArr.push({
						tips: '请选择通道编码',
						value: this.model.devicePassCode
					})
				}

				if (!this.common.checkNotNull(this, checkArr)) return

				const methodName = this.currentIndex ? 'postSampleDownMachine' : 'postSampleOnMachine'

				this.$u.api[methodName](params).then(res => {
					const str = this.currentIndex ? '下机' : '上机'
					if (res.msgCode === '000000') {
						this.modalContent = `${ str }成功！`
						this.showCancelBtn = false
						this.showModal = true

						if (this.currentIndex && this.firstCode.aplcCategory ===
							'MAT') { //如果 MAT 类型下机成功，临时存储数据录入数据
							if (!res.data || !res.data.length) {
								this.$refs.uTips.show({
									title: '无数据录入模板！',
									type: 'warning',
									duration: 2300
								})
								this.downInfo = []
							} else {
								this.downInfo = res.data
							}
						}
					} else {
						this.$refs.uTips.show({
							title: `${ str }失败，原因：${ res.message }`,
							type: 'error',
							duration: 2300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, common)
				})
			},
			toShowTestItemList() {
				this.selectTitle = '请选择测试项目'
				this.selectList = this.testItemList.map(({
					oaItemId,
					itemName,
					itemId
				}) => {
					return {
						label: itemName,
						value: itemId,
						extra: 'product'
					}
				})
				this.showSelect = true
			},
			toShowPassList() {
				this.selectTitle = '请选择通道编码'
				this.selectList = this.passList.map(({
					passCode
				}) => {
					return {
						label: passCode,
						value: passCode,
						extra: 'device'
					}
				})
				this.showSelect = true
			},
			getFindDevicePassCodeList() {
				const params = {
					deviceCode: this.model.deviceCode
				}
				this.$u.api.getFindDevicePassCodeList(params).then(res => {
					if (res.msgCode === '000000' && res.data) {
						this.passList = res.data
					} else {
						this.$refs.uTips.show({
							title: `获取通道失败，原因：${ res.message }`,
							type: 'error',
							duration: 2300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			checkSampleBarcode() { //校验样品条码
				const params = {
					coding: this.curCode
				}
				this.$u.api.getCheckSampleBarcode(params).then(res => {
					if (res.msgCode === '000000' && res.data) {
						if (!res.data.testItemList.length) { //若测试项数据为空，则不作任何操作
							this.$refs.uTips.show({
								title: '测试项数据为空！',
								type: 'warning',
								duration: 2300
							})
							return
						}
						this.testItemList = res.data.testItemList
						if (res.data.aplcCategory == 'MAT') { //如果是mat,需判断oa单号是否一致
							if (!this.firstCode.fdApplyNo) {
								this.firstCode = res.data
								this.codeList.push(this.curCode) //如果条码验证通过，则加入条码展示
							} else {
								if (res.data.fdApplyNo == this.firstCode.fdApplyNo) {
									this.codeList.push(this.curCode)
								} else {
									this.$refs.uTips.show({
										title: 'OA单号不一致！',
										type: 'warning',
										duration: 2300
									})
								}
							}
						} else if (res.data.aplcCategory === 'CELL') { //如果是cell，只能扫一个条码
							if (!this.firstCode.fdApplyNo) {
								this.firstCode = res.data
								this.codeList.push(this.curCode)
								this.model.itemName = this.testItemList[0].itemName
								this.model.itemId = this.testItemList[0].itemId
								this.model.oaItemId = this.testItemList[0].oaItemId
							}
						}
					} else {
						this.$refs.uTips.show({
							title: `获取测试项失败，原因：${ res.message }`,
							type: 'error',
							duration: 2300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			tabClick(index) {
				this.currentIndex = index
				this.toReset()
			},
			selectConfirm(arr) {
				const temp = arr[0]
				if (temp.extra == 'product') {
					this.model.itemName = temp.label
					this.model.itemId = temp.value
					this.model.oaItemId = this.testItemList.filter(({
						itemId
					}) => itemId == temp.value)[0].oaItemId
				} else {
					this.model.devicePassCode = temp.value
				}
			},
			/* 
				如果oa单类型为CELL，则不允许再扫其它条码，且页面展示设备编码和通道管理
				如果oa单类型为MAT，则再扫条码需要校验OA单id是否一致，不一致提示用户且不展示。页面之展示设备编码
			 */
			toScanProduct() { //产品条码扫描
				if (this.firstCode.aplcCategory === 'CELL') return
				this.scanCode('product')
			},
			toScanDevice() {
				if (!this.codeList.length) {
					this.$refs.uTips.show({
						title: '请输入/扫描样品编码',
						type: 'warning',
						duration: 2300
					})
					return
				}
				this.scanCode('device')
			},
			async scanCode(type) {
				// #ifdef APP-PLUS
				this.curCode = await this.common.scanCode()
				// #endif

				// #ifdef H5
				this.curCode = 'LYF20220331001-2'
				// #endif

				this.toQueryByCode(type)
			},
			toQueryByCode(type) { //根据code来执行查询操作
				if (type === 'device') { //如果是设备扫码，则直接赋值
					this.model.deviceCode = this.curCode
					// this.model.deviceCode = 'LYF0000088'
					if (this.firstCode.aplcCategory === 'CELL') { //如果CELL类型则需要查询通道
						this.getFindDevicePassCodeList() //获取通道列表
					}
				} else if (type === 'product') { //如果是产品则需要判断产品条码是否已存在
					if (this.codeList.includes(this.curCode)) {
						this.$refs.uTips.show({
							title: '样品条码已存在',
							type: 'warning',
							duration: 2300
						})
					} else {
						this.checkSampleBarcode() //校验样品条码
					}
				}
			}
		},
		onBackPress() {
			if (this.showSelect) {
				this.showSelect = false
				return true
			}
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
	}

	.btn-style {
		letter-spacing: 20rpx;
		text-indent: 20rpx;
	}

	::v-deep .u-cell_right {
		flex: 1;
	}
</style>
