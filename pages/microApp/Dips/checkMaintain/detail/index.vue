<!-- DIPS → 设备点检1、巡检2、保养3、维护4 登记 -->
<template>
	<view class="u-rela sws-wh100 u-flex sws-flex-d-column sws-overflow-hidden">
		<u-cell-group :border="false">
			<u-cell-item hover-class="none" :arrow="false" title="设备名称:" :value="`${deviceName}(${deviceCode})`">
			</u-cell-item>
			<u-cell-item v-show="areaName" hover-class="none" :arrow="false" title="位置:" :value="areaName">
			</u-cell-item>
		</u-cell-group>
		<u-cell-group :border="false" class="check-list u-rela sws-wh100 u-flex-1">
			<view v-for="(item, index) in list" :key="index">
				<u-cell-item class="u-flex sws-w100 sws-overflow-hidden" hover-class="none" :arrow="false"
					:use-label-slot="true" :border-top="true" :border-bottom="false" :title-style="{flex: '1'}"
					:value-style="{flex: 'none'}">
					<view slot="icon" class="u-m-r-20 u-font-32">
						{{ common.serialNumFormatter(index) }}
					</view>
					<view slot="title" class="u-flex-1">
						<view class="u-main-color u-font-32">{{ item.itemName }}</view>
					</view>
					<u-switch slot="right-icon" v-model="item.checked" inactive-color="#fa3534" active-color="#19be6b"
						:showText="true" size="46" inactive-value="0" active-value="1"
						@change="switchChange($event, index)"></u-switch>
				</u-cell-item>
				<view class="sws-w100 u-p-b-20 u-p-r-30 u-p-l-30">
					<view class="sws-w100 u-flex">
						<view class="tools-standard u-flex-1 u-line-1 u-p-10" @click="showDetail('工具', item.tools)">
							<text class="u-type-info">工具：</text>
							<text>{{ item.tools }}</text>
						</view>
						<view class="tools-standard u-flex-1 u-line-1 u-p-10"
							@click="showDetail( title + '标准', item.standard)">
							<text class="u-type-info">标准：</text>
							<text>{{ item.standard }}</text>
						</view>
					</view>
					<u-line border-style="dashed" v-show="type === '3' || type === '4'"></u-line>
					<view class="sws-w100 u-flex" v-show="type === '3' || type === '4'">
						<view class="tools-standard u-flex-1 u-line-1 u-p-10"
							@click="showDetail('对应图号', item.drawingNumber)">
							<text class="u-type-info">图号：</text>
							<text>{{ item.drawingNumber }}</text>
						</view>
						<view class="tools-standard u-flex-1 u-line-1 u-p-10"
							@click="showDetail('备品备件', formatSpareParts(item.matList))">
							<text class="u-type-info">备件：</text>
							<text>{{ formatSpareParts(item.matList) }}</text>
						</view>
					</view>
				</view>
				<!-- <view class="u-p-l-30 u-p-r-30 u-p-b-20" v-show="item.typeVal && item.typeVal == 'numtype'"> -->
				<view class="u-p-l-30 u-p-r-30 u-p-b-20">
					<u-form-item required :label="formatLabel(pa)" label-width="250" class="form-item"
						:border-bottom="false" v-for="(pa, paIndex) in item.paramList" :key="paIndex">
						<u-input v-if="pa.paramType !== 'rangeType'" type="number" placeholder-style="color: #c0c4cc"
							:custom-style="validateCustomStyle(pa)" class="standard-input" height="60" :border="true"
							:placeholder="`请输入${ pa.paramName }值`" v-model="pa.paramValue">
						</u-input>
						<view v-else class="u-flex">
							<u-input type="number" placeholder-style="color: #c0c4cc"
								:custom-style="validateCustomStyleForRangeType(pa, 'low')" class="u-m-r-20 standard-input"
								height="60" :border="true" placeholder="请输入下限值" v-model="pa.paramLowValue">
							</u-input>
							<u-input type="number" placeholder-style="color: #c0c4cc"
								:custom-style="validateCustomStyleForRangeType(pa, 'up')" class="standard-input" height="60"
								:border="true" placeholder="请输入上限值" v-model="pa.paramUpValue">
							</u-input>

						</view>
					</u-form-item>
					<u-form-item required v-show="!item.checked" label="NG原因" label-width="120" class="form-item"
						:border-bottom="false">
						<u-input type="textarea" placeholder-style="color: #c0c4cc" height="90" :auto-height="true"
							:border="true" placeholder="请输入NG原因" v-model="item.exception">
						</u-input>
					</u-form-item>
					<u-form-item v-if="(type === '3' || type === '4') && item.matList.length" v-show="!item.checked"
						label="备件" label-width="120" class="form-item" :border-bottom="false">
						<u-input type="select" disabled placeholder-style="color: #c0c4cc" class="standard-input"
							height="60" :auto-height="true" :border="true" placeholder="请选择备件" v-model="item.matName"
							@click="showSelectClick(item.matList, index)">
						</u-input>
					</u-form-item>
					<u-form-item label="备注" label-width="120" class="form-item" :border-bottom="false">
						<u-input type="textarea" placeholder-style="color: #c0c4cc" height="90" :auto-height="true"
							:border="true" placeholder="备注" v-model="item.remark">
						</u-input>
					</u-form-item>
				</view>
			</view>
			<view class="img-upload" v-show="type == 3">
				<u-form>
					<u-form-item class="u-p-0" label="上传图片" :border-bottom="false" label-position="top"
						label-align="left">
						<u-upload ref="uUpload" width="210" height="210" :auto-upload="false"></u-upload>
					</u-form-item>
				</u-form>
			</view>
		</u-cell-group>
		<view class="sws-w100 u-flex u-p-28">
			<u-button type="warning" class="u-flex-1 btn-first" @click="noProduce">无生产</u-button>
			<u-button type="error" class="u-flex-1 check-confirm u-m-l-20 u-m-r-20" @click="fault">故障</u-button>
			<u-button type="primary" class="u-flex-1 check-confirm" @click="commit">确认</u-button>
		</view>
		<u-select v-model="showSelect" :list="selectList" @confirm="selectConfrim"></u-select>
		<u-modal v-model="showModal" :title="modalTitle" :content="modalContent" @confirm="confirm"></u-modal>
		<u-top-tips ref="uTips"></u-top-tips>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: '',
				deviceName: '',
				deviceCode: '',
				areaName: '',
				list: [],
				showModal: false,
				modalTitle: '',
				modalContent: '',
				setTimer: '',
				showSelect: false,
				selectList: []
			}
		},
		computed: {
			formatSpareParts(list) { //格式化备件名称
				return list => {
					if (this.type === '3' || this.type === '4') { //只有维护和保养有备件展示
						let arr = list.map(item => item.matName)
						return [...new Set(arr)].join('、')
					} else {
						return ''
					}
				}
			},
			formatLabel(pa) {
				return pa => {
					let res = pa.paramName
					if (pa.limitLow || pa.limitUp) {
						res += `(${ pa.limitLow ? pa.limitLow : '' }, ${ pa.limitUp ? pa.limitUp : '' })`
					}
					return res
				}
			}
		},
		onLoad: function() {
			let _self = this
			// 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
			this.getOpenerEventChannel().on('acceptDataFromOpenerPage', function(res) {
				let temp = res.data
				uni.setNavigationBarTitle({
					title: temp.title + '登记'
				})
				_self.id = temp.id
				_self.deviceId = temp.deviceId
				_self.type = temp.type
				_self.typeUrl = temp.typeUrl
				_self.deviceName = temp.deviceName
				_self.deviceCode = temp.deviceCode
				_self.areaName = temp.areaName
				_self.list = temp.itemList.map(item => {
					return {
						...item,
						checked: true,
						state: '1',
						exception: ''
					}
				})
			})
		},
		methods: {
			validateCustomStyle(pa) { //paramValue值合法性校验
				if ((pa.limitLow && pa.paramValue < pa.limitLow) || (pa.limitUp && pa.paramValue > pa.limitUp)) {
					return {
						color: 'red'
					}
				} else {
					return {
						color: '#303133'
					}
				}
			},
			validateCustomStyleForRangeType(pa, type) {
				if (type === 'low' && +pa.paramLowValue !== pa.limitLow) {
					return {
						color: 'red'
					}
				} else if (type === 'up' && +pa.paramUpValue !== pa.limitUp) {
					return {
						color: 'red'
					}
				} else {
					return {
						color: '#303133'
					}
				}
			},
			async uploadImg(recordId) {
				const params = {
					query: this.$u.queryParams({
						module: 'pmMaintain',
						recordId: recordId,
						fileType: 'image'
					})
				}
				// #ifdef APP-PLUS
				let urls = this.$refs.uUpload.lists.map(item => item.url)
				params.urls = urls
				console.log('params:', params)
				let res = await this.$u.api.uploadMultiFiles(params) //递归调用多文件上传
				if (res.msgCode === '000000') {
					this.modalTitle = '提示'
					this.modalContent = '图片上传成功'
					this.showModal = true
				} else {
					this.$refs.uTips.show({
						title: `图片上传失败，原因：${ data.message }`,
						type: 'error',
						duration: '2300'
					})
				}
				// #endif

				// #ifdef H5
				var fd = new FormData()
				this.$refs.uUpload.lists.forEach(item => fd.append('file', item.file))
				params.body = fd

				this.$u.api.uploadMultiFilesForH5(params).then(res => {
					if (res.msgCode === '000000') {
						this.modalTitle = '提示'
						this.modalContent = '图片上传成功'
						this.showModal = true
					} else {
						this.$refs.uTips.show({
							title: `图片上传失败，原因：${ data.message }`,
							type: 'error',
							duration: '2300'
						})
					}
				})
				// #endif
			},
			noProduce() {
				const params = {
					query: `${this.typeUrl}/${this.id}/noplant`
				}
				this.$u.api.putNoProduceForDips(params).then(res => {
					if (res.msgCode === '000000') {
						this.modalTitle = '提示'
						this.modalContent = '处理成功'
						this.showModal = true
					} else {
						this.$refs.uTips.show({
							title: `上传失败，原因：${res.message}`,
							type: 'error',
							duration: 2300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, this)
				})
			},
			fault() {
				const params = {
					query: `${this.typeUrl}/${this.id}/fault`
				}
				this.$u.api.putFaultForDips(params).then(res => {
					if (res.msgCode === '000000') {
						this.modalTitle = '提示'
						this.modalContent = '处理成功'
						this.showModal = true
					} else {
						this.$refs.uTips.show({
							title: `上传失败，原因：${res.message}`,
							type: 'error',
							duration: 2300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, this)
				})
			},
			commit() {
				let itemList = []
				for (let i in this.list) {
					let temp = this.list[i]
					if (!Number(temp.state) && !temp.exception) {
						this.$refs.uTips.show({
							title: '结果为NG的点检项目请填写NG原因',
							type: 'warning',
							duration: 2300
						})
						return
					}

					if (temp.paramList && temp.paramList.length) {
						for (let i = 0; i < temp.paramList.length; i++) {
							let pa = temp.paramList[i]
							if (pa.paramType === 'rangeType') { //rangeType类型特殊处理
								if(!pa.paramLowValue) {
									this.$refs.uTips.show({
										title: `请输入${ pa.paramName }的下限值`,
										type: 'warning',
										duration: 2300
									})
									return
								} else if (!pa.paramUpValue) {
									this.$refs.uTips.show({
										title: `请输入${ pa.paramName }的上限值`,
										type: 'warning',
										duration: 2300
									})
									return
								}
							} else {
								if (!pa.paramValue) {
									this.$refs.uTips.show({
										title: `请输入${ pa.paramName }值`,
										type: 'warning',
										duration: 2300
									})
									return
								}
							}
						}
					}

					if (!Number(temp.state)) {
						itemList.push({
							id: temp.id,
							state: temp.state, // 0 - NG; 1 - OK
							exception: temp.exception,
							remark: temp.remark,
							paramList: temp.paramList ? temp.paramList : []
						})
					} else {
						itemList.push({
							id: temp.id,
							state: temp.state,
							remark: temp.remark,
							paramList: temp.paramList ? temp.paramList : []
						})
					}
				}

				const params = {
					query: `${this.typeUrl}`,
					body: {
						id: this.id, // 点检记录id
						deviceId: this.deviceId, // 设备id
						itemList: itemList
					}
				}
				console.log('请求参数：', params)

				this.$u.api.putCommitForDips(params).then(res => {
					if (res.msgCode === '000000') {
						this.modalTitle = '提示'
						this.modalContent = '处理成功'
						this.showModal = true
					} else {
						this.$refs.uTips.show({
							title: `点检结果上传失败，原因：${res.message}`,
							type: 'error',
							duration: 2300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			confirm() {
				if (this.modalContent.includes('处理成功')) {
					const id = this.id
					const eventChannel = this.getOpenerEventChannel()
					eventChannel.emit('acceptDataFromOpenedPage', {
						data: id
					})
					uni.navigateBack()
				}
			},
			showSelectClick(matList, index) {
				this.selectList = matList.map(item => {
					return {
						label: item.matName,
						value: item.matId
					}
				})
				this.curItem = this.list[index]
				this.showSelect = true
			},
			selectConfrim(res) {
				this.curItem.matName = res[0].label
				this.curItem.matId = res[0].value
				console.log(this.curItem)
			},
			showDetail(title, content) {
				if (content) {
					this.modalTitle = title
					this.modalContent = content
					this.showModal = true
				}
			},
			switchChange(value, curIndex) {
				this.list.forEach((item, itemIndex) => {
					if (itemIndex === curIndex) {
						item.state = value
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.check-list {
		overflow-y: scroll;
	}

	.tools-standard {
		background-color: #ecf5ff;
	}

	.mt-style {
		border: 2rpx solid #dcdfe6;
		border-radius: 8rpx;
		padding: 0 20rpx;
	}

	.check-confirm {
		letter-spacing: 20rpx;
		text-indent: 20rpx;
	}

	.btn-first {
		background: #909399;
		letter-spacing: 10rpx;
		text-indent: 10rpx;
	}

	.img-upload {
		padding: 0 22rpx;
	}

	:v-deep .uni-scroll-view-content {
		background-color: #2979FF;
	}

	.form-item {
		border: none;
		padding-top: 0;
		padding-bottom: 10rpx;
	}

	.standard-input {
		height: 60rpx;
		box-sizing: content-box;
	}
</style>
