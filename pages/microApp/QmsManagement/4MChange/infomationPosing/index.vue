<!-- 4M管理主页面 -->
<template>
	<view class='infomationPosing'>
		<u-tabs ref="tabs" :list="tabList" :current="tabCurrent" :item-width="240" :bar-width="50" :height="80"
			@change="changeTab"></u-tabs>
		<view v-show="tabCurrent===0">
			<u-collapse :item-style="itemStyle" :head-style='collapseHeadStyle' :body-style="bodyStyle">
				<u-collapse-item title="4M变化点--提报信息" class='uCcollapseItem' v-if='formKey>=1||(pageFrom="createdNew")'
					:open="formKey===1" @change="itemChange('infoPosing')">
					<scroll-view class="scroll-wrap scroll-y scroll-with-animation">
						<infoPosing ref='infoPosingRef' :propData='propData'></infoPosing>
					</scroll-view>
				</u-collapse-item>
				<u-collapse-item title="4M变化点--作业指导" class='uCcollapseItem' v-if='formKey>=2.1'
					:open="formKey==2.1||formKey==2.2" @change="itemChange('workGuide')">
					<scroll-view class="scroll-wrap scroll-y scroll-with-animation">
						<workGuide ref='workGuideRef' :propData='propData'></workGuide>
					</scroll-view>
				</u-collapse-item>
				<u-collapse-item title="4M变化点--产品品质确认" class='uCcollapseItem' v-if='formKey>=3' :open="formKey==3"
					@change="itemChange('productQualityConfirm')">
					<productQualityConfirm ref='productQualityConfirmRef' :propData='propData' :fourMInfo='fourMInfo'>
					</productQualityConfirm>
				</u-collapse-item>
				<u-collapse-item title="4M变化点--标识判定" class='uCcollapseItem' :open="formKey==4"
					v-if="formKey>=4 && propData.changePointType==='machine'" @change="itemChange('identifyJudge')">
					<identifyJudge ref='identifyJudgeRef' :propData='propData' :fourMInfo='fourMInfo'></identifyJudge>
				</u-collapse-item>
				<!-- 类型为料法  &&  标识判定为是 展示-->
				<u-collapse-item title="4M变化点--产品标识" class='uCcollapseItem' :open="formKey==5"
					v-if="formKey>=5 && isTag" @change="itemChange('productIdentification')">
					<scroll-view class="scroll-wrap scroll-y scroll-with-animation">
						<productIdentification ref='productIdentificationRef' :propData='propData'
							:fourMInfo='fourMInfo'>
						</productIdentification>
					</scroll-view>
				</u-collapse-item>
				<u-collapse-item title="4M变化点--4M批准" class='uCcollapseItem' v-if='formKey>=6' :open="formKey==6"
					@change="itemChange('fourMApproval')">
					<fourMApproval ref='fourMApprovalRef' :propData='propData' :fourMInfo='fourMInfo'></fourMApproval>
				</u-collapse-item>
			</u-collapse>
		</view>
		<!-- 流转记录 -->
		<historyProcess v-if="tabCurrent===1" :tableList='historyList'></historyProcess>
		<!-- 流程图 -->
		<scroll-view scroll-x="true">
			<img v-if="tabCurrent===2" :src="historyUrl" alt="">
		</scroll-view>
		<u-modal v-model="showCacheModal" :content="modelContent" :show-cancel-button="true" confirm-text="保存"
			cancel-text="直接返回" @confirm="cacheConfirm" @cancel="modalConfirm"></u-modal>
		<u-top-tips ref="uTips"></u-top-tips>
	</view>
</template>

<script>
	import infoPosing from './infoPosing/index.vue'
	import workGuide from './workGuide/index.vue'
	import identifyJudge from './identifyJudge/index.vue'
	import fourMApproval from './fourMApproval/index.vue'
	import productQualityConfirm from './productQualityConfirm/index.vue'
	import productIdentification from './productIdentification/index.vue'
	import historyProcess from './components/historyProcess/index.vue'
	import getHistoryProcessImage from '@/common/api/qmsManagement/historyRecord.js'
	export default {
		components: {
			infoPosing,
			workGuide,
			productIdentification,
			productQualityConfirm,
			identifyJudge,
			fourMApproval,
			historyProcess
		},
		data() {
			return {
				factoryName: '',
				isShowFlag: false,
				isTag: false,
				historyUrl: '',
				pageFrom: '',
				modelContent: '',
				showCacheModal: false,
				historyList: [],
				infoPosingShow: false,
				propData: {
					formKey: null,
					taskId: null,
					businessKey: '',
					id: null,
					changePointType: "",
					curNodeId: null,
					manageTabCurrent: null,


				},
				fourMInfo: {},
				formKey: null,
				itemStyle: {
					marginTop: '10px',
					// background: '#98c4d7',
					margin: '10px',
					borderRadius: '5px',
					overflow: 'scroll',
					height: 'calc(100% - 100rpx)',
					paddingLeft: '5px'
				},
				headStyle: {
					background: '#98c4d7',
				},
				bodyStyle: {
					// overflow: 'scroll',
					// height: 'calc(100% - 100rpx)'
				},
				collapseHeadStyle: {
					paddingLeft: '5px',
					background: '#98c4d7',
				},
				tabList: [{
					name: '基础信息',

				}, {
					name: '流转记录',

				}, {
					name: '流程图',

				}],
				tabCurrent: 0,

			}
		},
		onLoad() {
			const eventChannel = this.getOpenerEventChannel();
			eventChannel.on('acceptDataFromManagePage', (data) => {
				console.log('data接收', data)
				// console.log('propData', data)
				this.propData.manageTabCurrent = Number(data.tabCurrent)
				// console.log('data.tabCurrent=', data.tabCurrent)
				console.log('this.propData.manageTabCurrent=', this.propData.manageTabCurrent)
				this.taskName = data.taskName || ''
				if (this.taskName) {
					this.pageFrom = 'createdNew'

				}
				if (data.formKey) {
					if (data.taskName && data.taskName === '信息提报') {
						this.formKey = Number(data.formKey)
					}
					this.propData.formKey = Number(data.formKey)
					this.propData.taskId = data.taskId
					console.log('data接收this.formKey', this.formKey)
				}
				if (data.businessKey) {
					this.getFourMDetail(data.businessKey)
					this.propData.businessKey = data.businessKey
				}
			})
		},
		computed: {

		},
		created() {
			// getCurrentPages() 函数用于获取当前页面栈的实例，以数组形式按栈的顺序给出，第一个元素为首页，最后一个元素为当前页面。
			let pages = getCurrentPages();
			console.log('当前页面的路由：', pages)

		},
		methods: {
			cacheConfirm() {
				// let infoPosingData = this.$refs.infoPosingRef //提报
				// let workGuideData = this.$refs.workGuideRef.isJudged //作业指导1
				// let secondWorkGuideData = this.$refs.workGuideRef.$refs.secondWorkGuideRef//作业指导2				
				// let productIdentificationData = this.$refs.productIdentificationRef//产品标识
				let data = this.taskName
				switch (this.taskName) {
					case '信息提报':
						this.$refs.infoPosingRef.cacheConfirm()
						break
					case '作业指导1':
						this.$refs.workGuideRef.cacheConfirm()
						break

					case '作业指导2':
						this.$refs.workGuideRef.$refs.secondWorkGuideRef.cacheConfirm()
						break
					case '产品标识':
						this.$refs.productIdentificationRef.cacheConfirm()
						break


				}
			},
			modalConfirm() {
				uni.navigateTo({
					url: '/pages/microApp/QmsManagement/4MChange/index',
				})
			},
			changeTab(index) {
				this.tabCurrent = index
			},
			itemChange(data) {},
			getHistoryInfo(processInstanceId) {
				let that = this
				that.$u.api.getHistoryList(processInstanceId).then(res => {
					this.historyList = res.data
				})
			},
			getFourMDetail(params) { //根据bussinessKey查询详情

				let that = this
				that.$u.api.getFourMChangeDetailApi(params).then(res => {
					console.log('4M详情', res)
					if (res.msgCode === '000000' && res.data) {
						let result = res.data || {}
						that.fourMInfo = res.data || {}
						if (res.data.id) {
							that.propData.id = res.data.id
						}

						if (res.data.changePointType) {
							that.propData.changePointType = res.data.changePointType || ''
						}
						if (res.data.taskInfo && res.data.taskInfo.length > 0) {
							that.propData.curNodeId = res.data.taskInfo[0].taskDefKey
						}
						if (res.data.processInstanceId) {
							// 获取流程图地址
							that.historyUrl = getHistoryProcessImage(that, res.data.processInstanceId) || ''
							// 获取审批列表信息
							that.getHistoryInfo(res.data.processInstanceId)
						}
						let formKey = that.formKey
						if (!formKey && res.data.taskInfo && res.data.taskInfo.length) {
							that.formKey = Number(res.data.taskInfo[0].formKey)
							this.propData.formKey = Number(res.data.taskInfo[0].formKey)
						}
						if (!formKey && res.data.state && res.data.state === 2) { //已完成
							that.formKey = 6
						}
						// if (result.qualityConfirmPo && result.qualityConfirmPo.isTag) {
						// 	this.isTag = !!result.qualityConfirmPo.isTag === 'Y'

						// }

						that.$nextTick(async () => {
							if (that.formKey >= 1) {
								let factoryResult = ''

								that.$refs.infoPosingRef.renderData(result) //信息提报	
							}
							if (that.formKey >= 2.1) {
								that.$refs.workGuideRef.renderData(result) //就业指导1	
							}
							if (that.formKey >= 2.2) { //就业指导2
								that.$refs.workGuideRef.$refs.secondWorkGuideRef.renderData(
									result)

							}
							if (that.formKey >= 3) {

								that.$refs.productQualityConfirmRef.renderData(result) //产品品质确认
							}

							if (that.formKey >= 4 && res.data.changePointType && res.data
								.changePointType === 'machine') {

								that.$refs.identifyJudgeRef.renderData(result) //标识判定
							}
							if (that.formKey >= 5 && res.data.changePointType !== 'man') { //产品标识
								// 变化点类型为料 法 机 标识判定为是 展示产品标识
								if (result.qualityConfirmPo && result.qualityConfirmPo.isTag) {
									this.isTag = result.qualityConfirmPo.isTag === 'N' ? false : true
									if (this.isTag) {
										this.$nextTick(() => {
											that.$refs.productIdentificationRef.renderData(
												result) //产品标识
										})

									}

								}

							}

							if (that.formKey >= 6) {
								that.$refs.fourMApprovalRef.renderData(result) //4M批准	
							}

						})



					}
				})

			},
			onBackPress() { //todo缓存	
				if (this.propData.manageTabCurrent) { //已办点进去的不需要提示
					if (this.propData.manageTabCurrent === 1) return
				}
				if (this.taskName === '信息提报') {
					this.modelContent = '是否保存草稿，下次提报带出'
				}
				if (this.taskName === '作业指导1' || this.taskName === '作业指导2' || this.taskName ===
					'产品标识') { //是否判断过 需要缓存
					this.modelContent = '数据未保存，是否需要保存（附件不缓存）'
				}
				this.showCacheModal = true
				return true
			},
		}
	}
</script>

<style lang='scss' scoped>
	.infomationPosing {
		/deep/.u-collapse-body {
			overflow: scroll;
			height: calc(100% - 100rpx)
		}

		.scroll-wrap {
			width: 100%;
			border-radius: 16rpx;
			overflow: scroll;
			height: calc(100% - 100rpx) !important;
		}

		.uCcollapseItem {
			/* background: #98c4d7; */
			/* margin: 20rpx; */
			/* padding:0 10 10 0rpx */

		}
	}
</style>