<!-- 数据录入 -->
<template>
	<view class="sws-wh100 sws-bg-ebebeb u-flex sws-flex-d-column">
		<u-cell-group :border="false">
			<u-cell-item hover-class="none" title="测试项目" :value="itemName ? itemName : '请选择测试项目'" :arrow="isNeedQuery"
				@click="toSearchTestItem">
				<u-icon slot="icon" name="ceshixiangmu" custom-prefix="sws-icon" class="u-m-r-12" size="32"
					color="#606266"></u-icon>
			</u-cell-item>
			<u-cell-item hover-class="none" title="是否管控上下限" :arrow="false">
				<u-icon slot="icon" name="kaiguan" custom-prefix="sws-icon" class="u-m-r-12" size="32" color="#606266">
				</u-icon>
				<view slot="right-icon" class="u-flex u-flex-1 u-row-right">
					<u-switch v-model="isCtrl" :showText="true" okText="是" ngText="否">
					</u-switch>
				</view>
			</u-cell-item>
			<u-cell-item v-if="isCtrl" required hover-class="none" title="材料规格"
				:value="matSpecName ? matSpecName : '请选择材料规格'" arrow-direction="down" @click="toGetProductTypeList">
				<u-icon slot="icon" name="yangpingfenlei" custom-prefix="sws-icon" class="u-m-r-12" size="32"
					color="#606266"></u-icon>
			</u-cell-item>
		</u-cell-group>
		<view class="sws-w100 u-flex-1 sws-overflow-scroll-y u-p-l-20 u-p-r-20">
			<uni-swipe-action>
				<view class="sws-bg-ffffff u-m-t-30 data-card" v-for="(code, index) in dataList" :key="index">
					<uni-swipe-action-item :disabled="!isNeedQuery" :right-options="options"
						@click="toDel($event, index)">
						<view class="u-flex u-p-l-32 u-p-t-12 u-p-r-36 u-p-b-12 u-type-primary-bg">
							<view class="sws-font-fff">样品编码</view>
							<view class="sws-font-fff u-flex-1 u-text-right">{{ code.coding }}</view>
						</view>
						<u-cell-group :border="true">
							<u-cell-item hover-class="none" :title="item.fieldName" :arrow="false"
								:value-style="{flex: 0}" class="u-p-t-20 u-p-b-20"
								v-for="(item, itemIndex) in code.templateFieldsList" :key="itemIndex">
								<view slot="right-icon" class="u-flex-1">
									<u-input :type="item.fieldType === 'NUMBER' ? 'number' : 'text'"
										:placeholder="`请输入${ item.fieldName }`" inputAlign="right" class="u-p-l-20"
										height="56" v-model="item.fieldValue">
									</u-input>
								</view>
							</u-cell-item>
						</u-cell-group>
					</uni-swipe-action-item>
				</view>
			</uni-swipe-action>
		</view>
		<view class="sws-w100 u-p-28 sws-bg-ffffff">
			<u-button type="primary" class="btn-style" @click="toSaveData">数据上传</u-button>
		</view>
		<u-popup v-model="showPopup" mode="center" height="70%" width="80%" border-radius="24" :mask-close-able="false">
			<view class="sws-wh100 u-flex sws-flex-d-column">
				<view class="sws-w100 u-type-primary-bg u-font-32 sws-font-fff u-p-20 u-text-center sws-font-bold">提示
				</view>
				<view class="u-p-20 u-flex-1 sws-overflow-hidden">
					<scroll-view scroll-y="true" style="height: 100%">
						<u-cell-group :border="false" title="数据上传失败!"
							:title-style="{'text-align': 'center', 'font-weight': 'bold', 'padding-top': '10rpx'}">
							<u-cell-item v-for="(item, index) in popupList" :key="index"
								:title="`${ index + 1 }. 样品编码：${ item.coding }`" :label="`失败原因：${ item.message }`"
								:arrow="false" :borderBottom="false" class="u-p-8" hover-class="none">
							</u-cell-item>
						</u-cell-group>
					</scroll-view>
				</view>
				<view class="popup-footer u-border-top" @click="showPopup = false">确认</view>
			</view>
		</u-popup>
		<u-modal v-model="showModal" :content="modalContent" :show-cancel-button="showCancelBtn"
			@confirm="modalConfirm">
		</u-modal>
		<u-select v-model="showSelect" :list="selectList" :title="selectTitle" @confirm="selectConfirm"></u-select>
		<u-top-tips ref="uTips"></u-top-tips>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				itemName: '',
				itemId: '', //测试项目id
				matSpecId: '', //材料规格id
				matSpecName: '', //材料规格
				dataList: [], //数据录入列表结构
				isNeedQuery: true, //如果是数据补录，则需要查询测试项目，否则不可以操作
				isCtrl: false, //管控上下限
				options: [{
					text: '删除',
					style: {
						backgroundColor: '#dd524d'
					}
				}],
				selectTitle: '',
				selectList: [],
				showSelect: false,
				modalContent: '',
				showCancelBtn: false,
				showModal: false,
				popupList: [], //modal的slot
				showPopup: false
			}
		},
		onLoad(options) {
			if (Object.keys(options).length && options.from === 'operate') { //来自下机操作
				this.isNeedQuery = false //也用于控制是否支持左滑删除条目

				// #ifdef APP-PLUS
				// 从下机页面过来隐藏扫码功能
				var webView = this.$scope.$getAppWebview();
				webView.setTitleNViewButtonStyle(0, {
					width: 0
				})

				// #endif

				const eventChannel = this.getOpenerEventChannel()
				eventChannel.on('acceptDataFromOpenerPage', ({
					codeList,
					dataInfo
				}) => {
					this.itemName = dataInfo.itemName
					this.itemId = dataInfo.testItemId
					this.dataList = codeList.map(coding => {
						let data = {
							coding,
							itemName: dataInfo.itemName,
							itemNameEn: dataInfo.itemNameEn,
							templateFieldsList: []
						}

						data.templateFieldsList = dataInfo.templateFieldsList.map(item => {
							return {
								...item,
								fieldValue: ''
							}
						})

						return data
					})
					console.log('this.dataList: ', this.dataList)

				})
			} else { //从分类页面直接进入
				this.isNeedQuery = true
			}
		},
		methods: {
			toDel(event, index) {
				setTimeout(() => { //延迟（在关闭滑动动画之后）删除，防止报错
					this.dataList.splice(index, 1)
				}, 350)
			},
			modalConfirm() {
				if (this.modalContent.includes('是否确认数据上传')) {
					this.saveData()
				} else if (this.modalContent.includes('数据上传成功')) {
					uni.navigateBack()
				}
			},
			selectConfirm(arr) {
				const temp = arr[0]
				this.matSpecName = temp.label
				this.matSpecId = temp.value
			},
			toSaveData() {
				if (!this.itemId) {
					this.$refs.uTips.show({
						title: '请选择测试项目',
						type: 'warning',
						duration: 2300
					})
					return
				}

				if (this.isCtrl && !this.matSpecId) { //如果管控上下限，则需要选择材料规格
					this.$refs.uTips.show({
						title: '请选择材料规格',
						type: 'warning',
						duration: 2300
					})
					return
				}

				if (!this.dataList.length) {
					this.$refs.uTips.show({
						title: '暂无可上传的数据！',
						type: 'warning',
						duration: 2300
					})
					return
				}

				this.modalContent = '是否确认数据上传？'
				this.showCancelBtn = true
				this.showModal = true
			},
			saveData() {
				const params = {
					query: {
						itemId: this.itemId,
					},
					body: [
						...this.dataList
					]
				}
				if (this.isCtrl) {
					params.query.matSpecId = this.matSpecId
				}

				console.log('params: ', params)
				this.$u.api.postSaveData(params).then(res => {
					if (res.msgCode === '000000' && res.data) {
						const failList = res.data.failCodeList

						if (failList.length) { //失败样品编码列表为0，表示全部成功
							this.popupList = failList
							this.showPopup = true

							this.dataList = this.dataList.filter(({
								coding
							}) => { //错误列表failList中包含了codingde对象
								return failList.filter(item => coding == item.coding).length
							})
						} else {
							this.modalContent = '数据上传成功！'
							this.showCancelBtn = false
							this.showModal = true
						}
					} else {
						this.$refs.uTips.show({
							title: `数据上传失败，原因：${ res.message }`,
							type: 'error',
							duration: 2300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			toGetProductTypeList() {
				const params = {
					itemId: this.itemId
				}

				this.$u.api.getProductTypeList(params).then(res => {
					if (res.msgCode === '000000' && res.data) {
						this.selectTitle = '请选择材料规格'
						this.selectList = res.data.map(({
							id,
							matSpecName
						}) => {
							return {
								label: matSpecName,
								value: id
							}
						})
						this.showSelect = true
					} else {
						this.$refs.uTips.show({
							title: `材料规格获取失败，原因：${ res.message }`,
							type: 'error',
							duration: 2300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			toSearchTestItem() {
				if (!this.isNeedQuery) return
				this.$u.api.getTestItemList().then(res => {
					if (res.msgCode === '000000' && res.data) {
						const list = res.data.map(({
							id,
							itemName,
							positionName
						}) => {
							return {
								name: itemName,
								value: id,
								desc: `实验室：${ positionName }`
							}
						})
						this.goToSelected('请选择测试项目', list, 'testItem', true, true)
					} else {
						this.$refs.uTips.show({
							title: `测试项目获取失败，原因：${ res.message }`,
							type: 'error',
							duration: 2300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			getTemplate() {
				const params = {
					itemId: this.itemId
				}

				this.$u.api.getTemplate(params).then(res => {
					if (res.msgCode === '000000' && res.data) {
						this.templateObj = res.data[0]
					} else {
						this.$refs.uTips.show({
							title: `数据录入模板获取失败，原因：${ res.message }`,
							type: 'error',
							duration: 2300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			goToSelected(title, list, type, hasSearch = false, isRadio = false) {
				// title 选择列表页面标题  list 选择列表项 type赋值对象的属性名, hasSeach是否需要本地搜索
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
							const temp = res.data[0]
							_self.itemName = temp.name
							_self.itemId = temp.value
							_self.getTemplate()
						}
					},
					success: function(res) {
						res.eventChannel.emit('acceptDataFromOpenerPage', params)
					}
				})
			},
			toAddTemplateCard() {
				let data = {
					coding: this.scanCode,
					itemName: this.templateObj.itemName,
					itemNameEn: this.templateObj.itemNameEn,
					templateFieldsList: [],
					show: false //滑动项添加show属性，否则无法自动关闭
				}

				data.templateFieldsList = this.templateObj.templateFieldsList.map(item => {
					return {
						...item,
						fieldValue: ''
					}
				})
				this.dataList.push(data)
			}
		},
		async onNavigationBarButtonTap(arr) {
			if (!this.itemName) {
				this.$refs.uTips.show({
					title: '请选择测试项目',
					type: 'warning',
					duration: 2300
				})
				return
			}
			// #ifdef APP-PLUS
			this.scanCode = await this.common.scanCode()
			// #endif
			// #ifdef H5
			this.scanCode = 'LY20220402001-1'
			// #endif

			if (this.dataList.filter(({
					coding
				}) => {
					return this.scanCode == coding
				}).length) { //如果样品已存在，则提示
				this.$refs.uTips.show({
					title: `样品${ this.scanCode }已存在`,
					type: 'warning',
					duration: 2300
				})
				return
			}
			this.toAddTemplateCard() //添加数据录入模板
		}
	}
</script>

<style lang="scss" scoped>
	.data-card {
		border-radius: 12rpx;
		overflow: hidden;
	}

	.data-card:last-child {
		margin-bottom: 30rpx;
	}

	.popup-footer {
		width: 100%;
		height: 100rpx;
		line-height: 100rpx;
		font-size: 32rpx;
		color: #2979ff;
		font-weight: bold;
		text-align: center;
	}

	::v-deep .u-cell_right {
		flex: 1;
	}
</style>
