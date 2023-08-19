<!-- 锁定、解锁、报废 -->
<template>
	<view class="page-wrap sws-wh100">
		<view class="material-search sws-w100 u-p-20 u-flex">
			<u-search class="search-input" placeholder="请输入/扫描产品条码/上盖码" shape="square" v-model="keyword" search-icon=""
				@search="queryProduct" @custom="queryProduct">
			</u-search>
			<view class="abs-scan" @click="scanCode">
				<u-icon name="saoma" custom-prefix="sws-icon" size="45" color="#2979ff"></u-icon>
			</view>
		</view>
		<view v-show="!showNoData" class="scroll-wrap u-flex sws-flex-d-column">
			<view class="sws-w100 u-flex-1">
				<u-cell-group :border="true">
					<u-cell-item hover-class="none" :arrow="false" title="产品条码" :value="packSn">
					</u-cell-item>
					<u-cell-item hover-class="none" :arrow="false" title="产品类型" :value="prod.productType">
					</u-cell-item>

					<u-cell-item hover-class="none" arrow-direction="right" title="不良代码"
						:value-style="selectTextColor(prod.badCode)" :value="prod.badCode ? prod.badCode : ''"
						@click="toShowBd">
					</u-cell-item>

					<u-cell-item hover-class="none" arrow-direction="right" title="发现工序"
						:value-style="selectTextColor(prod.groupName)" :value="prod.groupName ? prod.groupName : ''"
						@click="toShowGropName">
					</u-cell-item>
					</u-cell-item>
					<u-cell-item hover-class="none" :arrow="false" title="产品状态"
						:value-style="{color: baseData.getProdStatus(prod.lockStatus).color}"
						:value="baseData.getProdStatus(prod.lockStatus).status">
					</u-cell-item>
					<u-cell-item hover-class="none" :arrow="false" title="不良描述" :value="prod.badDetail">
					</u-cell-item>
					<u-cell-item hover-class="none" :arrow="false" title="不良等级" :value="prod.badGrade">
					</u-cell-item>
					<u-cell-item hover-class="none" :arrow="false" title="判定方式" :value="prod.judgeMethod">
					</u-cell-item>


					<u-cell-item hover-class="none" :arrow="false" title="备注" :value="prod.remark">
					</u-cell-item>
					<u-cell-item hover-class="none" :arrow="false" title="处理人" :value="prod.userName">
					</u-cell-item>


					<u-cell-item hover-class="none" :arrow="false" :border-bottom="false" title="处理时间"
						:value="prod.createTime ? $u.timeFormat(prod.createTime, 'yyyy-mm-dd hh:MM:ss') : ''">
					</u-cell-item>
				</u-cell-group>
			</view>
			<view class="u-flex u-p-28 u-row-between sws-bg-ffffff sws-w100">
				<u-button :disabled="!(prod.lockStatus === '6' || prod.lockStatus === '8')" class="btn-style"
					type="success" @click="toOperate(packSn, 0, prod.lockStatus)">解锁</u-button>
				<u-button :disabled="prod.lockStatus !== '0'" class="btn-style u-m-l-30" type="primary"
					@click="toOperate(packSn, 1, prod.lockStatus)">锁定</u-button>
				<u-button :disabled="!(prod.lockStatus === '6' || prod.lockStatus === '5')" class=" btn-style u-m-l-30"
					type="error" @click="toOperate(prod.packSn, 2, prod.lockStatus)">报废
				</u-button>
			</view>
		</view>
		<no-data v-show="showNoData"></no-data>
		<u-top-tips ref="uTips"></u-top-tips>
		<u-select v-model="showSelect" :list="selectList" :title="selectTitle" @confirm="selectConfirm"></u-select>
	</view>
</template>

<script>
	import noData from '../../../../components/noData/index.vue'

	export default {
		components: {
			noData
		},
		data() {
			return {
				keyword: '',
				packSn: '',
				prod: {},
				showNoData: false,
				selectList: [],
				bdCodeList: [], //不良代码下拉列表
				groupNameList: [], //工序下拉列表
				selectTitle: '',
				showSelect: false,
				productInfoList: [],
			}
		},
		computed: {
			selectTextColor(val) {
				return val => {
					return val ? {
						// 'color': '#303133',
						// 'color': '#909399',
						'color': '#606266',

						'font-size': '26rpx',

						'word-break': 'break-all'
					} : {
						'color': '#c0c4cc',
						'font-size': '28rpx'
					}
				}
			},

		},

		watch: {},
		methods: {
			toOperate(
				packSn,
				type,
				lockStatus
			) {
				const eventChannel = this.getOpenerEventChannel()
				eventChannel.emit('eventFromQueryPage', {
					packSn,
					type,
					lockStatus
				})
				uni.navigateBack()
			},
			// 获取新值
			getNewProd(val) {
				let result = ''
				this.$u.api.getProductInfoForMes({
					productSn: this.keyword
				}).then(res => {
					if (res.data.length) {
						result = res.data.find(item => {
							return item.badCode === this.prod.badCode && item.groupName === this.prod
								.groupName

						})
						this.prod = result
					}

				})
			},

			//查询产品状态--搜索
			queryProduct() {
				if (!this.keyword) {
					this.$refs.uTips.show({
						title: '请输入产品编码',
						type: 'warning',
						duration: 2300
					})
					return
				}
				this.getProductList()
			},
			getProductList() {
				this.prod = {}
				this.bdCodeList = []
				this.groupNameList = []
				const params = {
					productSn: this.keyword
				}
				this.$u.api.getProductInfoForMes(params).then(res => {
					if (res.msgCode === '000000') {
						if (res.data.length) {
							this.showNoData = false
							this.productInfoList = res.data
							const arr = []
							const selectGroupNameList = []
							res.data.forEach(item => {
								if (item.hasOwnProperty('badCode')) {
									arr.push({
										label: item.badCode,
										value: item.badCode
									})
									this.bdCodeList = arr
								}
								if (item.hasOwnProperty('groupName')) {
									selectGroupNameList.push({
										label: item.groupName,
										value: item.groupName
									})
									this.groupNameList = selectGroupNameList
								}
							})
							this.prod = {
								...res.data[0]
							}
							this.packSn = res.data[0].packSn
						} else {
							this.$refs.uTips.show({
								title: '未查询到数据',
								type: 'warning',
								duration: 2300
							})
							this.showNoData = true
						}
					} else {
						this.$refs.uTips.show({
							title: `查询失败，原因：${ res.message }`,
							type: 'error',
							duration: 2300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			scanCode() { //扫码
				this.common.scanCode(this).then(res => {
					this.keyword = res
					this.getProductList(this.keyword)
				})
			},
			// 选择不良代码
			toShowBd() {
				if (!this.keyword) {
					this.$refs.uTips.show({
						title: '请输入或扫描产品条码',
						type: 'warning',
						duration: 2300
					})
					return
				}
				if (!this.bdCodeList.length) {
					this.$refs.uTips.show({
						title: '暂无不良代码',
						type: 'warning',
						duration: 2300
					})
					return
				}
				this.selectTitle = '请选择不良代码'
				this.selectList = this.bdCodeList
				this.selectList = this.bdCodeList.map(({
					label,
					value
				}) => {
					return {
						label: label,
						value: value,
						extra: 'badCode'
					}
				})
				this.showSelect = true
			},

			// 选择工序名称
			toShowGropName() {
				if (!this.keyword) {
					this.$refs.uTips.show({
						title: '请输入或扫描产品条码',
						type: 'warning',
						duration: 2300
					})
					return
				}
				if (!this.groupNameList.length) {
					this.$refs.uTips.show({
						title: '暂无工序',
						type: 'warning',
						duration: 2300
					})
					return
				}
				this.selectTitle = '请选择工序'
				this.selectList = this.groupNameList
				this.selectList = this.groupNameList.map(({
					label,
					value
				}) => {
					return {
						label: label,
						value: value,
						extra: 'gropName'
					}
				})
				this.showSelect = true
			},
			selectConfirm(e) {
				let temp = e[0]
				if (temp.extra === 'badCode') {
					this.prod.badCode = temp.value
					this.getNewProd()
					return
				}
				this.prod.groupName = temp.label
				this.getNewProd()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.material-search {
		position: fixed;
		z-index: 3;
		background-color: #ffffff;
	}

	.scroll-wrap {
		min-height: 100%;
		padding-top: 104rpx; //64(u-search默认高度) + 20 + 20（搜索框上下内边距）
	}

	.card-head {
		color: #ffffff;
	}

	.btn-style {
		flex: 1;
		text-indent: 20rpx;
		letter-spacing: 20rpx;
		font-size: 28rpx;
	}

	.abs-scan {
		position: absolute;
		right: 122rpx;
		margin-top: 3rpx;
	}

	::v-deep .search-input .u-content {
		padding-right: 60rpx;
	}

	.bad-code-input-wrapper {
		height: 100rpx;
		overflow: hidden;
		overflow-y: scroll;
	}
</style>
