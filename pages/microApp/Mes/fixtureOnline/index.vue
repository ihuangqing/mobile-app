<!-- MES → 辅料治具上线 -->
<template>
	<view class="page-wrap sws-wh100">
		<view class="material-search sws-w100 u-p-20">
			<u-search class="search-input" placeholder="请输入/扫描设备编号" shape="square" v-model="keyword" search-icon=""
				@search="fuzzyQuery" @custom="fuzzyQuery">
			</u-search>
			<view class="abs-scan" @click="scanCode('modelCode')">
				<u-icon name="saoma" custom-prefix="sws-icon" size="45" color="#2979ff"></u-icon>
			</view>
			<view v-show="dataList.length>0" class=" sws-w100 u-p-t-20 u-p-b-20 u-flex">
				<view style='height:64rpx;line-height: 64rpx;' class="sws-font-bold u-font-30 u-flex-1 ">制令单：</view>
				<view class="u-font-24">{{MoNumber}}</view>
			</view>
		</view>

		<view v-show="!showNoData" class="scroll-wrap sws-bg-ebebeb">
			<view class="u-p-20">
				<u-card margin="0 0 20rpx 0" :border="false" style='border: 1px solid #dcdfe6;'
					:head-style="{background:item.state===1?'#f2f20554':(item.state===2?'#bddebd':'#fff'),padding: '20rpx 30rpx'}"
					:body-style="{padding: 0}"
					:foot-style="{background:item.state===1?'#f2f20554':(item.state===2?'#bddebd':'#fff'),padding: '16rpx 30rpx'}"
					:show-foot="true" :full="true" v-for="(item, index) in fixtrueDataList" :key="index">
					<view slot="head" class="card-head u-font-32 u-flex u-row-between">
						<view class="u-flex">
							<view>类别</view>
						</view>
						<view>{{item.Type==='gw'?'钢网':(item.Type==='bgd'?'后刮刀':(item.Type==='fgd'?'前刮刀':'锡膏'))}}</view>
					</view>
					<u-cell-group slot="body" :border="false"
						:class="(item.state===1?'warn':(item.state===2?'onLine':''))">
						<u-cell-item class="u-p-t-10 u-p-b-10" hover-class="none" :arrow="false" title="型号"
							:value="item.Model">
						</u-cell-item>
						<u-cell-item class="u-p-t-10 u-p-b-10" hover-class="none" :arrow="false" title="SN"
							:value="item.SN">
						</u-cell-item>
					</u-cell-group>
					<view slot="foot" class="u-text-right">
						<u-button class="btn-style u-m-l-30" size="medium" type="success"
							@click="goScanToAutoCheck(item,index)">
							扫码上线
						</u-button>
					</view>
				</u-card>
				<u-loadmore :status="loadStatus" bgColor="#ebebeb"></u-loadmore>
			</view>
		</view>
		<no-data v-show="showNoData"></no-data>
		<u-top-tips ref="uTips"></u-top-tips>
		<u-modal z-index='9999' :show-cancel-button='true' :title='scanCodeModalTitle' v-model="showscanCodeModal"
			@confirm="scanModeModalConfirm()">
			<view class='slot-scancode-content'>
				<u-search :show-action='showAction' shape='square' class="search-input" placeholder="请输入/扫描治具/辅料"
					v-model="modelCodeValue" search-icon="">
				</u-search>
				<u-icon class='scan-check-icon' @click="clickScanCodeIcon('scanCheck')" name="saoma"
					custom-prefix="sws-icon" size="45" color="#2979ff">
				</u-icon>
			</view>
		</u-modal>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	import {
		warn
	} from "vue"

	import noData from '../../../components/noData/index.vue'

	export default {
		components: {
			noData
		},
		data() {
			return {
				dataList: [],
				searchCheckFlag: false,
				MoNumber: '',
				showscanCodeModal: false, //扫码上线弹框
				scanCodeModalTitle: '',
				modelCodeValue: '', //点击扫码检验 输入框v-model绑定值
				showAction: false,
				value: 'SZ-8754',
				keyword: '',
				page: 1,
				limit: 10,
				list: [],
				loadStatus: 'loadmore',
				showNoData: false,
				fixtrueDataList: []

			}
		},
		computed: {
			...mapState(['factoryId']),
		},
		created() {
			// 查询辅料治具列表
			// this.getFixtureList()
		},
		methods: {
			// 扫码
			scanCode() {
				this.common.scanCode(this).then(res => {
					this.keyword = res
					// this.showManufactoryOrder = false
					this.fixtrueDataList = []
					this.getFixtureList()
				})


			},
			// 扫码检验
			goScanToAutoCheck(data, index) {
				this.searchCheckFlag = true
				this.modelCodeValue = ''
				this.curScanItem = data
				this.curScanIndex = index
				this.scanCodeModalTitle = '扫码上线'
				// this.modelCodeValue=data.SN
				this.showscanCodeModal = true
			},
			//点击扫码图标---扫码检验弹框
			async clickScanCodeIcon() {
				this.searchCheckFlag = true
				const barcode = await this.common.scanCode()
				this.modelCodeValue = barcode
				this.scanModeModalConfirm()
				this.postBarCodeForAutoCheck(barcode)
			},
			// 扫码检验确定
			scanModeModalConfirm() {
				let code = this.modelCodeValue
				if (!code) {
					this.$refs.uTips.show({
						title: '请输入治具/辅料',
						type: 'error',
						duration: 2300
					})
					this.showscanCodeModal = false
					return
				}
				this.postBarCodeForAutoCheck(code)
			},
			postBarCodeForAutoCheck(code) {
				this.showscanCodeModal = false
				// *******************************************************
				// 1.类别为锡膏时  通过扫描SN校验SN对应的型号是否等于批次号（即sn）对应的料号
				// 2.类别为其他时（除开锡膏外的，即刮刀，钢网等），校验寿命是否超出（已使用次数 >= 理论寿命为超出，提示“寿命不足，请更换治具！），校验型号是否匹配							
				this.curScanItem.SN = code
				let curScanItemData = this.curScanItem
				let curScanIndex = this.curScanIndex
				this.checkOnline(curScanItemData, curScanIndex, this.temp)
			},

			fuzzyQuery() {
				this.getFixtureList()

			},
			getFixtureList() { //根据设备编号查询辅料治具

				const params = {
					"DeviceSN": this.keyword //设备编号

				}
				// *****************************************************************************
				uni.request({
					// https://hzevbmesapi.sunwoda-evb.com/MESInterface.asmx?op=AuxiliaryFixtureOnline
					url: 'https://hzevbmesapi.sunwoda-evb.com/MESInterface.asmx/GetAuxiliaryFixtureInfo', // 正式环境
					// url: 'http://10.201.88.135:8062/MESInterface.asmx/GetAuxiliaryFixtureInfo', //测试环境
					method: 'POST',
					data: {
						jsonData: JSON.stringify(params)
					},
					header: {
						'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
					},
					success: (res) => {

						try {
							let data = JSON.parse(this.xmlParse(res.data))
							// console.log('data1111',data)
							if (data.Result) {
								if (data.Data && data.Data.length > 0) {
									this.temp = data.Data[0].List
									this.dataList = data.Data[0].List
									let result = this.setBgColor(this.temp)
									this.fixtrueDataList = result
									this.MoNumber = data.Data[0].MoNumber
								}


							} else {
								this.$refs.uTips.show({
									title: `获取失败，原因：${ data.Msg }`,
									type: 'error',
									duration: 2300
								})
							}

						} catch (err) {
							this.$refs.uTips.show({
								title: `获取失败，原因：${ err }`,
								type: 'error',
								duration: 2300
							})
						}
					},
					fail: (err) => {
						this.common.sysErrToast(this, err)
					}
				})



			},

			// 辅料上线
			// *****************************************************
			getAuxiliaryFixtureOnline() {

				let curScanItemData = this.curScanItem
				let curScanIndex = this.curScanIndex
				const params = {
					DeviceSN: this.keyword, //设备编号
					// AuxiliaryFixtureSN: curScanItemData.SN,//辅料/治具编号(SN)
					AuxiliaryFixtureSN: this.modelCodeValue,
					Type: curScanItemData.Type, //型号
					Model: curScanItemData.Model

				}
				uni.request({
					// url: 'http://10.201.88.135:8062/MESInterface.asmx/AuxiliaryFixtureOnline', //测试环境
					url: 'https://hzevbmesapi.sunwoda-evb.com/MESInterface.asmx/AuxiliaryFixtureOnline', //		正式环境			
					method: 'POST',
					data: {
						jsonData: JSON.stringify(params)
					},
					header: {
						'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
					},
					success: (res) => {
						try {
							let data = JSON.parse(this.xmlParse(res.data))
							if (data.Result) {
								this.$refs.uTips.show({
									title: `${data.Msg}`,
									type: 'success',
									duration: 2300
								})
								this.getFixtureList()
							} else {
								this.$refs.uTips.show({
									title: `上线失败，原因：${ data.Msg }`,
									type: 'error',
									duration: 2300
								})
							}
						} catch (err) {
							this.$refs.uTips.show({
								title: `上线失败，原因：${ err }`,
								type: 'error',
								duration: 2300
							})
						}
					},
					fail: (err) => {
						this.common.sysErrToast(this, err)
					}
				})
				this.showscanCodeModal = false
			},

			// **************************************************************************
			xmlParse(xmlString) {
				let xmlDoc
				try {
					// #ifdef APP-PLUS
					const {
						DOMParser
					} = require('xmldom')
					// #endif
					let parser = new DOMParser()
					xmlDoc = parser.parseFromString(xmlString, "text/xml")
				} catch (err) {
					this.$refs.uTips.show({
						title: '返回数据异常',
						type: 'error',
						duration: 2300
					})
				}

				// #ifdef APP-PLUS
				return xmlDoc.documentElement.firstChild
				// #endif
				// #ifdef H5
				return xmlDoc.documentElement.innerHTML
				// #endif

			},
			// ********************************************************************************
			setBgColor(temp) { //初始化设置背景色
				var result
				if (temp.length > 0) {
					temp.forEach((item, index) => {
						if (!item.state) {
							this.$set(item, 'state', null)
							if (!item.SN) { //代表未上线
								item.state = 3 //3---白色
								result = temp

							} else { //已上线
								this.searchCheckFlag = false
								result = this.checkOnline(item, index, temp)

							}

						}
					})

				}
				// result=temp
				return result


			},
			checkOnline(item, index, dataList) { //校验辅料治具
				let result
				let params = {
					DeviceSN: this.keyword, //设备编号
					// AuxiliaryFixtureSN: curScanItemData.SN,//辅料/治具编号(SN)
					AuxiliaryFixtureSN: item.SN,
					Type: item.Type, //型号
					Model: item.Model
				}

				uni.request({
					url: 'https://hzevbmesapi.sunwoda-evb.com/MESInterface.asmx/CheckAuxiliaryFixture', //		正式环境		
					// url: 'http://10.201.88.135:8062/MESInterface.asmx/CheckAuxiliaryFixture',//测试环境
					method: 'POST',
					data: {
						jsonData: JSON.stringify(params)
					},
					header: {
						'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
					},
					success: (res) => {
						try {
							let state = null
							let data = JSON.parse(this.xmlParse(res.data))
							// console.log('上线校验11111',data)
							if (data.Result) {

								if (this.searchCheckFlag) {
									this.$refs.uTips.show({
										title: `${ data.Msg }`,
										type: 'success',
										duration: 2300
									})
									this.showscanCodeModal = false

								}
								if (data.Data && data.Data.length === 0) { //锡膏
									dataList[index].state = 2
								}
								if (data.Data && data.Data.length > 0) { //辅料
									let temp = data.Data[0]
									// WarningTimes  --预警次数（如：2000）  TheoryTimes--理论次数（如：10000）  UsedTimes--已使用次数	（0）	
									// 预警比例：预警次数/理论次数 2000/10000=20%  当使用次数达到2000次就达到预警值了									
									// 计算是否高于预警值  
									if (temp && temp.WarningTimes && temp.TheoryTimes && Number(temp
											.UsedTimes) >= 0) {
										// 已使用次数” >= “总数*预警比例“时  state:1--大于预警（黄色）  2--小于预警（绿色）				
										// let warningRate=Number(temp.UsedTimes)/Number(temp.TheoryTimes)
										state = Number(temp.UsedTimes) >= Number(temp.WarningTimes) ? 1 : 2
										// 2.已使用次数 >= 理论寿命时，不允许上线此治具
										if (Number(temp.UsedTimes) > Number(temp.TheoryTimes)) {
											this.$refs.uTips.show({
												title: '寿命不足，请更换治具',
												type: 'error',
												duration: 2300
											})
											// state
											return
										}
									}
									if (dataList.length > 0) {
										dataList[index].state = state
									}

								}

								if (this.searchCheckFlag) { //点击扫码检验的才调上线接口
									// 校验成功  调上线接口
									this.getAuxiliaryFixtureOnline()

								}
								// this.showscanCodeModal = false

							} else {
								this.$refs.uTips.show({
									title: `校验失败，原因：${ data.Msg }`,
									type: 'error',
									duration: 2300
								})
								this.showscanCodeModal = false
							}
							this.showscanCodeModal = false
						} catch (err) {
							this.$refs.uTips.show({
								title: `校验失败，原因：${ err }`,
								type: 'error',
								duration: 2300
							})
						}
					},
					fail: (err) => {
						this.common.sysErrToast(this, err)
					}
				})

				return dataList
			}

		}
	}
</script>

<style lang="scss" scoped>
	.warn {

		// .u-card{
		::v-deep.u-cell-item-box {
			background-color: #f2f20554;
		}

		// }

	}

	.onLine {
		::v-deep.u-cell-item-box {
			background-color: #bddebd;
		}

	}

	.unOnLine {}



	.material-search {
		position: fixed;
		z-index: 3;
		background-color: #ffffff;
		height: 180rpx
	}

	.abs-scan {
		position: absolute;
		right: 22%;
		bottom: 102rpx;
		// margin-top: 3rpx;
	}

	.scroll-wrap {
		min-height: 100%;
		padding-top: 184rpx; //64(u-search默认高度) + 20 + 20（搜索框上下内边距）
	}

	.card-head {
		// color: #ffffff;
		font-size: 28rpx;
		color: #606266;
	}

	.btn-style {
		width: 180rpx;
		height: 60rpx;
		line-height: normal;
		padding: 0 16rpx;
	}

	.slot-scancode-content {
		font-size: 28rpx;
		padding: 70rpx 30rpx 70rpx 30rpx;
		position: relative;
		display: flex;
		justify-content: space-between;

		.scan-check-icon {
			position: absolute;
			right: 60rpx;
			top: 80rpx;
		}

		::v-deep .u-content {
			padding-left: 0rpx;
		}

		::v-deep.u-close-wrap {
			position: relative;
			left: 20rpx
		}

	}
</style>
