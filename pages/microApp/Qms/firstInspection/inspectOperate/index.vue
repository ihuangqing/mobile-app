<!-- IPQC首件检验单 -->
<template>
	<view class="sws-wh100 sws-bg-ebebeb u-flex sws-flex-d-column">
		<view class="sws-w100 sws-bg-ffffff u-p-l-30 u-p-r-30 u-p-b-30">
			<view class="base-info">
				<u-cell-group :border="false" class="cell-group">
					<u-cell-item hover-class="none" :title-style="{color: '#ffffff'}" :value-style="{color: '#ffffff'}"
						bg-color="#2979ff" :arrow="false" :border-bottom="false" title="产品编号"
						:value="baseInfo.itemCode">
					</u-cell-item>
					<u-cell-item hover-class="none" :title-style="{color: '#ffffff'}" :value-style="{color: '#ffffff'}"
						bg-color="#2979ff" :arrow="false" :border-bottom="false" title="产品类别"
						:value="baseInfo.productionCategory">
					</u-cell-item>
					<u-cell-item hover-class="none" :title-style="{color: '#ffffff'}" :value-style="{color: '#ffffff'}"
						bg-color="#2979ff" :arrow="false" :border-bottom="false" title="产品型号"
						:value="baseInfo.itemName">
					</u-cell-item>
					<u-cell-item hover-class="none" :title-style="{color: '#ffffff', 'padding-right': '20rpx'}"
						:value-style="{color: '#ffffff'}" bg-color="#2979ff" :arrow="false" :border-bottom="false"
						title="生产线别" :value="baseInfo.areaSn"></u-cell-item>
					<u-cell-item hover-class="none" :title-style="{color: '#ffffff', 'padding-right': '20rpx'}"
						:value-style="{color: '#ffffff'}" bg-color="#2979ff" :arrow="false" :border-bottom="false"
						title="生产工序" :value="baseInfo.groupName"></u-cell-item>
					<u-cell-item hover-class="none" :title-style="{color: '#ffffff', 'padding-right': '20rpx'}"
						:value-style="{color: '#ffffff'}" bg-color="#2979ff" :arrow="false" :border-bottom="false"
						title="设备编码" :value="baseInfo.deviceSn"></u-cell-item>
				</u-cell-group>
				<view class="base-info-other u-flex u-row-between">
					<view v-if="baseInfo.shift">班次：{{ baseInfo.shift == 'M' ? '白班' : '夜班' }}</view>
					<view class="u-flex-1 u-text-right">检验员：{{ userInfo.userName }}</view>
				</view>
			</view>
		</view>
		<view class="sws-w100 u-flex-1 sws-overflow-scroll-y">
			<view class="sws-w100 u-p-l-20 u-p-t-20 u-p-r-20">
				<u-card margin="0 0 20rpx 0" :border="false" :head-style="{padding: '16rpx 30rpx'}" border-radius="16"
					box-shadow="2rpx 4rpx 2rpx 0rpx rgba(0,0,0,.1)" :body-style="{padding: 0}"
					:foot-style="{padding: '16rpx 30rpx'}"
					:show-foot="(item.isFree == 'Y' && !item.remark) ? false : true" :full="true"
					v-for="(item, index) in baseInfo.linesList" :key="index">
					<view slot="head">
						<view class="u-font-32 u-flex u-row-between">
							<view class="u-flex-1 u-flex">
								<view class="item-line"></view>
								<view class="u-font-28">{{ item.checkLocation !== 'null' ? `${item.checkItem} - ${item.checkLocation}` : `${item.checkItem}`
 }}</view>
							</view>
							<view class="item-check-res u-font-24" :class="formatCheck(item).style">
								<u-icon :name="formatCheck(item).icon" size="28" margin-left="10"
									:label="formatCheck(item).value" label-pos="left"
									:label-color="formatCheck(item).style"></u-icon>
							</view>
						</view>
					</view>
					<view v-show="!item.lineCheckResult && item.isFree !== 'Y'" slot="foot"
						class="u-flex u-row-between">
						<view class="u-font-24">
							<view>
								<text>生产工序：</text>
								<text>{{ item.groupNameLine }}</text>
							</view>
							<view class="u-m-t-10">
								<text>检验工具：</text>
								<text>{{ item.checkTools }}</text>
							</view>
							<view class="u-m-t-10">
								<text>检验标准：</text>
								<text>{{ item.checkStandard }}</text>
							</view>
						</view>
						<view class="u-flex sws-flex-d-column">
							<u-button class="btn-style u-m-l-30 sws-line-h-repair" size="medium" type="warning"
								@click="toCheck(item)">检验</u-button>
							<u-button class="btn-style u-m-l-30 sws-line-h-repair u-m-t-15" size="medium" type="success"
								@click="toExemption(item)">免检</u-button>
						</view>
					</view>
					<view v-show="item.lineCheckResult" slot="foot" class="u-font-24 sws-w100">
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
		<view class="sws-w100 u-flex u-row-between sws-bg-ffffff u-p-20 u-border-top">
			<view class="u-flex-1">
				<text class="u-font-24">检验结果：</text>
				<text v-show="baseInfo.checkResult"
					:class="baseInfo.checkResult == 'OK'? 'u-type-success': 'u-type-error'">{{ baseInfo.checkResult == 'OK' ? '合格' : '不合格' }}</text>
			</view>
			<view>
				<u-button class="confirm-style sws-line-h-repair" size="medium" type="error" @click="toConfirmBreak">
					故障提交</u-button>
			</view>
			<view class="u-m-l-30">
				<u-button class="confirm-style confirm-style-other sws-line-h-repair" size="medium" type="primary"
					@click="toConfirm">提交
				</u-button>
			</view>
		</view>
		<u-popup v-model="showCheckPopup" mode="left" width="65%">
			<view class="popup-head u-p-l-30 u-p-r-10 sws-font-fff u-flex">
				<view class="u-flex-1 u-flex sws-flex-d-column u-row-center u-col-top">
					<view>
						<u-icon name="shebei" custom-prefix="sws-icon" size="36"></u-icon>
						<text class="u-m-l-12">{{ checkPopup.checkItem }}</text>
					</view>
					<view class="u-m-t-10">
						<u-icon name="gongxu" custom-prefix="sws-icon" size="36"></u-icon>
						<text class="u-m-l-12">{{ checkPopup.checkLocation }}</text>
					</view>
					<view class="u-m-t-10">
						<u-icon name="teshutezheng" custom-prefix="sws-icon" size="36"></u-icon>
						<text class="u-m-l-12">{{ checkPopup.specialFeatures }}</text>
					</view>
				</view>
				<view class="sws-h100 u-p-20" @click="toShowToolsStandard(checkPopup)">
					<u-icon name="info-circle" color="#ffffff" size="44"></u-icon>
				</view>
			</view>
			<scroll-view scroll-y="true" class="scroll-wrap">
				<view class="u-p-t-20">
					<view class="u-p-20 u-type-info u-flex">
						<view>检验数据</view>
						<view class="u-flex-1 u-text-right u-type-primary" v-show="checkPopup.copyList.length < 3"
							@click="toCopy">
							<text>复检</text>
							<u-icon size="32" name="fuzhi" custom-prefix="sws-icon" class="u-m-l-10"></u-icon>
						</view>
					</view>
					<view v-if="checkPopup.checkTag == 'B'" class="input-group">
						<u-cell-group :border="false" :title-style="{fontWeight: 'bold', color: '#303133'}"
							v-for="(check, checkIndex) in checkPopup.copyList" :key="checkIndex">
							<view class="u-p-l-40 u-p-r-40">
								<u-divider v-show="checkPopup.copyList.length > 1 && checkIndex > 0 " color="#2979ff"
									border-color="#2979ff" margin-top="20" margin-bottom="20"
									@click="toDelCopy(checkIndex)">
									<text>第 {{ checkIndex }} 次复检</text>
									<u-icon name="close-circle" size="32" class="u-m-l-10"></u-icon>
								</u-divider>
							</view>
							<u-cell-item :title="`样本${ index + 1 }`" :arrow="false" :title-style="{fontSize: '28rpx'}"
								:value-style="{padding: '0 20rpx'}" hover-class="none" :border-bottom="false"
								v-for="(item, index) in check" :key="index">
								<u-icon slot="icon" size="32" name="edit-pen" class="u-m-r-10"></u-icon>
								<u-input v-model="item.testValue"
									:disabled="checkPopup.checkDataSourceCode == 'A' ? false : true"
									:type="checkPopup.checkDataSourceCode == 'B' ? 'text' : 'number'" border
									:custom-style="validateCustomStyle(item)" :placeholder="formatPh"
									@input="$u.debounce(inputChange(checkPopup, item), 3000, false)" />
								<u-button v-if="checkPopup.checkDataSourceCode == 'B'" slot="right-icon" type="success"
									size="mini" @click="getValFromMes(item)">MES</u-button>
								<u-icon v-if="checkPopup.checkDataSourceCode == 'C'" slot="right-icon" name="saoma"
									custom-prefix="sws-icon" size="48" color="#2979ff"
									@click="toScanMoreInfo(1, checkPopup, item)"></u-icon>
							</u-cell-item>
						</u-cell-group>
					</view>
					<view v-else class="switch-group">
						<u-cell-group :border="false" :title-style="{fontWeight: 'bold', color: '#303133'}"
							v-for="(check, checkIndex) in checkPopup.copyList" :key="checkIndex">
							<view class="u-p-l-40 u-p-r-40">
								<u-divider v-show="checkPopup.copyList.length > 1 && checkIndex > 0 " color="#2979ff"
									border-color="#2979ff" margin-top="20" margin-bottom="20"
									@click="toDelCopy(checkIndex)">
									<text>第 {{ checkIndex }} 次复检</text>
									<u-icon name="close-circle" size="32" class="u-m-l-10"></u-icon>
								</u-divider>
							</view>
							<u-cell-item :title="`样本${ index + 1 }`" :arrow="false" :title-style="{fontSize: '28rpx'}"
								hover-class="none" :border-bottom="false" v-for="(item, index) in check" :key="index">
								<u-icon slot="icon" size="48" name="kaiguan" custom-prefix="sws-icon" class="u-m-r-10">
								</u-icon>
								<u-switch slot="right-icon" v-model="item.checked" :showText="true"
									@change="toChangeSwitch(item)"></u-switch>
							</u-cell-item>
						</u-cell-group>
					</view>
				</view>
				<view>
					<view class="u-p-20 u-flex u-row-between">
						<text class="u-type-info">信息扫码</text>
						<u-icon name="saoma" custom-prefix="sws-icon" size="48" color="#2979ff"
							class="u-flex-1 u-flex u-row-right" @click="toScanMoreInfo(0, checkPopup)"></u-icon>
					</view>
					<view class="u-flex u-p-l-20 u-p-r-20">
						<u-input type="textarea" placeholder="请扫码/输入信息" v-model="checkPopup.errorSn" border
							height="80"></u-input>
					</view>
				</view>
				<view>
					<view class="u-p-20 u-type-info">图片附件</view>
					<view class="u-flex u-p-l-20 u-p-b-20">
						<u-upload ref="uUpload" :customDel="true" :auto-upload="false" @on-customRemove="customRemove">
						</u-upload>
					</view>
				</view>
			</scroll-view>
			<view class="u-flex sws-w100 u-p-t-20 u-p-b-20 u-border-top u-row-around">
				<u-button type="default" class="popup-btn-style" @click="showCheckPopup = false">关闭</u-button>
				<u-button type="primary" class="popup-btn-style" @click="toConfirmLine">确认</u-button>
			</view>
		</u-popup>
		<u-modal v-model="showToolsStandard">
			<view class="u-p-28">
				<view class="u-flex">
					<view>工具：</view>
					<view class="u-flex-1">{{ toolsStandard.checkTools }}</view>
				</view>
				<view class="u-flex u-m-t-20">
					<view>标准：</view>
					<view class="u-flex-1">{{ toolsStandard.checkStandard }}</view>
				</view>
			</view>
		</u-modal>
		<u-modal v-model="showDelModal" content="您确定要删除此项吗？" :show-cancel-button="true" @confirm="delModalConfirm">
		</u-modal>
		<u-modal v-model="showModal" :content="modalContent" :show-cancel-button="showModalCancel"
			@confirm="modalConfirm">
		</u-modal>
		<u-modal v-model="showExceptionDesc" :title="errTitle" @confirm="toExceptionConfirmCheck">
			<u-input class="u-p-20" type="textarea" :placeholder="errPh" v-model="errRes"></u-input>
		</u-modal>
		<u-top-tips ref="uTips" :style="{'z-index': '10095!important'}"></u-top-tips>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'

	export default {
		data() {
			return {
				baseInfo: {},
				list: [],
				checkPopup: {
					copyList: [], //检验list，复检事push一次
				},
				copyNum: 1, //复检次数，默认1，复检第一次加1 即为2
				fileList: [],
				showCheckPopup: false,
				toolsStandard: {},
				showToolsStandard: false,
				showDelModal: false, //删除图片的modal
				errTitle: '',
				errPh: '',
				errRes: '', //异常描述
				showExceptionDesc: false,
				modalContent: '',
				showModal: false,
				showModalCancel: true
			}
		},
		computed: {
			...mapState(['userInfo']),
			formatPh() {
				let tempArr = []
				if (typeof this.checkPopup.lowerLimit == 'number') {
					tempArr.push(`≥${ this.checkPopup.lowerLimit }`)
				}

				if (typeof this.checkPopup.upperLimit == 'number') {
					tempArr.push(`≤${ this.checkPopup.upperLimit }`)
				}
				return tempArr.join(',')
			},
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
		onLoad(options) {
			const _self = this
			const eventChannel = this.getOpenerEventChannel()
			eventChannel.on('acceptDataFromOpenerPage', ({
				data
			}) => {
				_self.baseInfo = data
				console.log('_self.baseInfo: ', _self.baseInfo)
				_self.toCheckFinalRes() //校验最终结果（防止数据只有一条，且已经检验过的情况，实际不存在）
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
			},
			toChangeSwitch(item) {
				if (item.checked) {
					item.testValue = 'OK'
					item.testResult = 'OK'
				} else {
					item.testValue = 'NG'
					item.testResult = 'NG'
				}
			},
			modalConfirm() {
				if (this.modalContent.includes('是否确认故障提交')) {
					this.errTitle = '故障描述'
					this.errPh = '请输入故障描述'
					this.showExceptionDesc = true
				} else if (this.modalContent.includes('是否确认提交？')) {
					this.toSubmit(true)
				} else if (this.modalContent.includes('是否确认提交此项检验？')) {
					this.toConfirmCheck()
				} else if (this.modalContent.includes('提交成功')) {
					const eventChannel = this.getOpenerEventChannel()
					eventChannel.emit('acceptDataFromOpenedPage')
					uni.navigateBack()
				} else if (this.modalContent.includes('是否确认免检')) {
					this.errTitle = '免检备注'
					this.errPh = '请输入免检备注'
					this.showExceptionDesc = true
				}
			},
			toSubmit(flag) { //flag  true 正常提交  false 故障提交
				if (!this.baseInfo.checkResult) return

				const params = {
					body: this.baseInfo
				}

				console.log('params: ', params)
				this.$u.api.getupdateIpacOrder(params).then(res => {
					if (res.msgCode === '000000') {
						if (flag) {
							this.modalContent = '提交成功'
						} else {
							this.modalContent = '故障提交成功'
						}
						this.showModalCancel = false
						setTimeout(() => {
							this.showModal = true
						}, 800);
					} else {
						this.$refs.uTips.show({
							title: `提交失败，原因：${ res.data }`,
							type: 'error',
							duration: 2300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			toConfirmBreak() {
				this.modalContent = '是否确认故障提交？'
				this.showModalCancel = true
				this.showModal = true
			},
			toConfirm() {
				if (!this.baseInfo.checkResult) {
					this.$refs.uTips.show({
						title: '请完成所有的检验项目',
						type: 'warning',
						duration: 2300
					})
					return
				}
				this.modalContent = '是否确认提交？'
				this.showModalCancel = true
				this.showModal = true
			},
			inputChange(check, item) {
				let resArr = []
				if (typeof check.lowerLimit == 'number') {
					if (item.testValue >= check.lowerLimit) {
						resArr.push('OK')
					} else {
						resArr.push('NG')
					}
				}

				if (typeof check.upperLimit == 'number') {
					if (item.testValue <= check.upperLimit) {
						resArr.push('OK')
					} else {
						resArr.push('NG')
					}
				}

				resArr.every(item => item == 'OK') ? item.testResult = 'OK' : item.testResult = 'NG'
			},
			getValByQRCode(productSn, check, item) {
				let params = {
					query: {
						groupName: this.curItem.groupNameLine,
						productSn,
						testItem: this.curItem.testItem ? this.curItem.testItem : ''
					}
				}

				this.$u.api.getdeviceParam(params).then(res => {
					if (res.msgCode === "000000" && res.data.testValue) {
						item.testValue = res.data.testValue
						this.inputChange(check, item)
					} else {
						this.$refs.uTips.show({
							title: `系统过程参数样本值获取失败，原因：${ res.message }`,
							type: 'error',
							duration: 2300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			getValFromMes(item) {
				let params = {
					query: {
						groupName: this.curItem.groupNameLine,
						technicsId: +this.baseInfo.technicsId,
						testItem: this.curItem.testItem ? this.curItem.testItem : ''
					}
				}

				this.$u.api.getGroupParam(params).then(res => {
					if (res.msgCode === '000000' && res.data) {
						let tempArr = [] //临时数组，用于存储上下限判断结果值
						let resArr = [] //临时数组，用于存储上下限判断结果

						// 下限
						if (typeof res.data.gpLimit == 'number') {
							tempArr.push(`≥${ res.data.gpLimit }`)
							item.gpLimit = res.data.gpLimit
						}
						this.curItem.lowerLimit == res.data.gpLimit ? resArr.push('OK') : resArr.push('NG')
						// 上限
						if (typeof res.data.gpUpper == 'number') {
							tempArr.push(`≤${ res.data.gpUpper }`)
							item.gpUpper = res.data.guUpper
						}
						this.curItem.upperLimit == res.data.gpUpper ? resArr.push('OK') : resArr.push('NG')

						item.testResult = resArr.every(item => item == 'OK') ? 'OK' : 'NG'
						item.testValue = tempArr.join(',') //拼接上下限结果值

						console.log('系统管控参数类型单个样本检验结果： ', item)
					} else {
						this.$refs.uTips.show({
							title: `系统管控参数获取失败，原因：${ res.message }`,
							type: 'error',
							duration: 2300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			customRemove(index) {
				this.curDelIndex = index
				this.showDelModal = true
			},
			delModalConfirm() {
				this.$refs.uUpload.remove(this.curDelIndex)
			},
			toDelCopy(index) { //删除复检
				this.checkPopup.copyList.splice(index, 1)
			},
			toCopy() { //复检
				const temp = this.copyItem()
				this.checkPopup.copyList.push(temp)
			},
			toCheck(item) {
				this.curItem = item //保存当前检验项目为临时项目
				this.checkPopup = { //弹窗数据对象
					...item, //复制查询的检验行信息
					errorSn: '', //信息扫码结果
					copyList: [], //用于存储样本数组，如果复检则新增，里面其实是this.curItem.lineResultsList的复制对象
					lineFileList: [], //图片数据
				}

				const temp = this.copyItem()
				this.checkPopup.copyList.push(temp)
				this.showCheckPopup = true
			},
			toExemption(item) {
				this.curItem = item //保存当前检验项目为临时项目
				this.modalContent = '是否确认免检？'
				this.showModalCancel = true
				this.showModal = true
			},
			copyItem() { //根据检验次数复制样本
				const temp = [] //创建临时数组，用于存储检验样本
				this.curItem.lineResultsList.forEach(item => {
					if (this.curItem.checkTag == 'B') { //定量类型
						temp.push({
							testValue: '', //先定义，防止接口不返回此字段
							testResult: '',
							...item
						})
					} else { //定性类型只需要确认true or false
						temp.push({
							testValue: '', //先定义，防止接口不返回此字段
							testResult: '',
							...item,
							checked: false,
							testValue: 'NG'
						})
					}
				})
				return temp
			},
			toShowToolsStandard(item) {
				this.toolsStandard = item
				this.showToolsStandard = true
			},
			validateCustomStyle(item) { //paramValue值合法性校验
				if (item.testResult == 'NG') {
					return {
						color: 'red'
					}
				} else {
					return {
						color: '#303133'
					}
				}
			},
			toExceptionConfirmCheck() {
				if (this.errTitle === '异常描述') { //异常描述
					this.curItem.errorResult = this.errRes
					this.confirmCheck()
				} else if (this.errTitle === '免检备注') {
					this.curItem.isFree = 'Y'
					this.curItem.remark = this.errRes
					this.toConfirmLineCheck('Y')
				} else { //故障描述
					this.baseInfo.breakRemark = this.errRes
					this.baseInfo.checkResult = 'NG'
					this.toSubmit()
				}
			},
			toConfirmLine() {
				this.modalContent = '是否确认提交此项检验？'
				this.showModalCancel = true
				this.showModal = true
			},
			toConfirmCheck() {
				const copyList = this.checkPopup.copyList
				const testArr = copyList[copyList.length - 1] //最后一次复检（没有复检则就是初始样本）
				if (this.curItem.checkTag == 'A') { //定性类型结果校验
					if (testArr.every(item => item.checked)) { //每个样本的值都是true 检验结果OK
						this.curItem.lineCheckResult = 'OK'
						this.confirmCheck()
					} else {
						this.curItem.lineCheckResult = 'NG'
						this.errTitle = '异常描述'
						this.errPh = '请输入异常描述'
						this.showExceptionDesc = true
					}
				} else if (this.curItem.checkTag == 'B') { //定量类型结果校验
					if (testArr.every(item => item.testValue)) { //判断是否有未检验的样本
						if (testArr.every(item => item.testResult == 'OK')) {
							this.curItem.lineCheckResult = 'OK'
							this.confirmCheck()
						} else {
							this.curItem.lineCheckResult = 'NG'
							this.errTitle = '异常描述'
							this.errPh = '请输入异常描述'
							this.showExceptionDesc = true
						}
					} else {
						this.$refs.uTips.show({
							title: '未检验完成所有样本',
							type: 'warning',
							duration: 2300
						})
					}
				}
			},
			confirmCheck() {
				if (this.$refs.uUpload.lists.length) { //如果有图片上传图片
					this.uploadImg(this.curItem.lineId)
				} else {
					this.toConfirmLineCheck() //单个检测项目结果提交
				}
			},
			toCheckFinalRes() {
				if (this.baseInfo.linesList && this.baseInfo.linesList.every(item => item
						.lineCheckResult || item.isFree === 'Y')) { //先判断是不是所有都检测了
					if (this.baseInfo.linesList.every(item => item.lineCheckResult == 'OK' || item.isFree === 'Y')) {
						this.baseInfo.checkResult = 'OK'
					} else {
						this.baseInfo.checkResult = 'NG'
					}
				}
			},
			toConfirmLineCheck(isFree = 'N') { //单个检测项目结果提交 isFress  Y 免检  N 正常检验
				if (isFree !== 'Y') {
					// 先更新curItem中的lineResultsList,取checkPopup中的copyList中的最后一个数组对象
					this.curItem.lineResultsList = [...this.checkPopup.copyList[this.checkPopup.copyList.length - 1]]

					console.log('this.curItem: ', this.curItem)

					//更新基础数据对象baseInfo
					this.baseInfo.linesList.forEach(item => {
						if (item.lineId == this.curItem.lineId) {
							item = this.curItem
						}
					})
				}

				const params = {
					body: this.curItem
				}

				this.$u.api.postUpdateIpqcOrderLine(params).then(res => {
					if (res.msgCode === '000000' && res.data) {
						if (res.data.lineFileList && res.data.lineFileList.length) { //如果有图片，则回显图片
							this.curItem.lineFileList = res.data.lineFileList
						}
						// 上传成功关闭侧弹窗
						this.showCheckPopup = false
						this.toCheckFinalRes()
					} else {
						this.curItem.lineCheckResult = '' //重置检验结果
						this.$refs.uTips.show({
							title: `检验结果确认失败，原因：${ res.message }`,
							type: 'error',
							duration: 2300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			async uploadImg(lineId) {
				uni.showLoading({
					title: '图片上传中...'
				})
				const params = {
					query: this.$u.queryParams({
						module: 'mesipqc',
						recordId: this.baseInfo.orderNumber + lineId, //加单据号，解决不同组织lineId重复问题
						fileType: 'file',
					}),
					appName: 'mes-interface'
				}
				// #ifdef APP-PLUS
				let urls = this.$refs.uUpload.lists.map(item => item.url)
				params.urls = urls
				let res = await this.$u.api.uploadMultiFiles(params) //递归调用多文件上传
				uni.hideLoading()
				if (res.msgCode === '000000') {
					this.$refs.uTips.show({
						title: `图片上传成功`,
						type: 'success',
						duration: '2000'
					})
				} else {
					this.$refs.uTips.show({
						title: `图片上传失败，原因：${ res.message }`,
						type: 'error',
						duration: '2300'
					})
				}
				this.toConfirmLineCheck() //图片上传无论成功失败，都是要提交单个检测项目结果
				// #endif

				// #ifdef H5
				var fd = new FormData()
				this.$refs.uUpload.lists.forEach(item => fd.append('file', item.file))
				params.body = fd
				this.$u.api.uploadMultiFilesForH5(params).then(res => {
					if (res.msgCode === '000000') {
						this.$refs.uTips.show({
							title: `图片上传成功`,
							type: 'success',
							duration: '2000'
						})
					} else {
						this.$refs.uTips.show({
							title: `图片上传失败，原因：${ res.message }`,
							type: 'error',
							duration: '2300'
						})
					}
					this.toConfirmLineCheck() //图片上传无论成功失败，都是要提交单个检测项目结果
				})
				// #endif
			},
			async toScanMoreInfo(flag, checkPopup, item) {
				let code = await this.common.scanCode(this)
				if (flag) { //样本扫码
					this.getValByQRCode(code, checkPopup, item)
				} else { //异常扫码
					if (!checkPopup.errArr) { //定义异常条码数组
						checkPopup.errArr = []
					}

					checkPopup.errArr.push(code)
					checkPopup.errorSn = checkPopup.errArr.join(',')
				}
			}
		},
		onBackPress() {
			if (this.showExceptionDesc) { //异常描述 弹窗不能被物理返回
				return true
			}

			if (this.showModal) {
				this.showModal = false
				return true
			}

			if (this.showDelModal) { //取消删除图片
				this.showDelModal = false
				return true
			}

			if (this.showCheckPopup) { //弹窗关闭 代替返回操作
				this.showCheckPopup = false
				return true
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
		font-size: 28rpx;
		width: 180rpx;
	}

	.confirm-style-other {
		text-indent: 28rpx;
		letter-spacing: 28rpx;
	}

	.popup-head {
		background-color: $u-type-primary;
		height: 220rpx;
	}

	.scroll-wrap {
		height: calc(100% - 330rpx);
	}

	.popup-btn-style {
		letter-spacing: 28rpx;
		text-indent: 28rpx;
		height: 70rpx;
		line-height: 70rpx;
		width: 200rpx;
	}

	.mes-btn {
		border: 2rpx solid $u-type-primary;
	}

	.item-line {
		height: 26rpx;
		margin-right: 12rpx;
		border-left: 6rpx solid #774aa6;
		border-radius: 26rpx;
	}

	.item-check-res {
		width: 160rpx;
		text-align: right;
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
