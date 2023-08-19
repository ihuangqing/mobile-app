<template>
	<view class="sws-wh100 sws-bg-ebebeb">
		<view class="score-wrap">
			<view class="card-wrap sws-wh100 u-flex sws-flex-d-column">
				<view v-if="type === 'score'" class="card-wrap-header sws-w100">
					<view class="u-flex u-flex-wrap">
						<view v-for="(user, userIndex) in pmData.userList" :key="userIndex" class="card-user u-flex sws-bg-ffffff">
							<view class="card-user-left u-flex">
								<text class="u-font-32">{{ user.scoreValue }}</text>
								<text class="u-font-24 u-m-l-4">分</text>
							</view>
							<view class="card-user-center u-flex sws-flex-d-column u-col-top">
								<view class="u-font-28 u-main-color">{{user.userName}}</view>
								<view class="u-font-24 u-tips-color">{{user.account}}</view>
							</view>
							<view v-if="pmData.userList.length > 1" class="card-user-right u-flex u-row-center u-p-r-10"
								@click="toDelUser(user, userIndex)">
								<u-icon name="close" size="24" color="#909399"></u-icon>
							</view>
						</view>
					</view>
				</view>
				<view v-else class="card-wrap-header sws-w100">
					<view class="u-flex card-wrap-header-up">
						<view class="u-flex-1 u-flex sws-flex-d-column u-row-left u-col-top sws-font-fff">
							<view class="u-font-30 sws-font-bold">
								<text class="u-font-30">{{pmData.userName}}</text>
								<text class="u-font-24">（{{pmData.account}}）</text>
								<text class="u-font-24" v-if="pmData.isCross">（{{pmData.workDate.substring(0,7)}}）</text>
							</view>
							<view class="u-font-26 u-m-t-6">
								<u-icon name="wodeshenqing" custom-prefix="sws-icon" size="26" class="u-m-r-8"></u-icon>
								<text>{{pmData.lineName}}-{{pmData.mesArea}}-{{pmData.postName}}</text>
							</view>
						</view>
						<view class="u-rela card-score">
							<u-icon name="pingfen" custom-prefix="sws-icon" size="110" color="#fff" class="card-score-icon"></u-icon>
							<view class="u-abso sws-wh100 card-score-text u-flex u-p-r-10">
								<view class="u-flex-1 u-text-center sws-font-fff  card-score-text-more">
									<view>{{ pmData.scoreValue }}</view>
									<view class="u-m-l-2 u-font-24">分</view>
								</view>
							</view>
						</view>
					</view>
					<view class="card-wrap-header-down">
						<u-cell-item class="u-p-0" hover-class="none" title="评分标准(可多选)" value="" :border-bottom="false"
							@click="toSelectScoreItems">
							<u-icon slot="icon" name="pingfenbz" custom-prefix="sws-icon" size="30" color="#606266"
								class="u-p-r-4"></u-icon>
							<u-input placeholder="请选择评分标准" :value="pmData.scoreList.map(item => item.scoreCode).join('、')"
								input-align="right" disabled @click="toSelectScoreItems"></u-input>
						</u-cell-item>
					</view>
				</view>

				<view class="card-wrap-content sws-w100 u-flex-1 sws-overflow-scroll-y">
					<view :class="(type == 'staff' && pmData.scoreList.length > 1) ? 'score-content': 'score-content type-staff'"
						v-for="(score, index) in pmData.scoreList" :key="index">
						<view class="score-content-del u-flex" v-show="type == 'staff' && pmData.scoreList.length > 1">
							<view class="del-btn" @click="toDelScoreItem(score, index)">
								<u-icon name="shanchu" custom-prefix="sws-icon" size="28" color="#2979ff"></u-icon>
								<text class="u-type-primary u-font-26 u-m-l-4">删除标准</text>
							</view>
						</view>
						<view class="score-content-wrap">
							<view class="u-p-20 score-title-wrap">
								<view class="score-title">
									<u-icon name="pingfenbz" custom-prefix="sws-icon" size="28" color="#fff"></u-icon>
									<text class="u-m-l-4">评分标准</text>
								</view>
								<view class="u-m-t-20 u-m-l-10">{{score.scoreCode}}.{{score.scoreDesc}}</view>
							</view>
							<u-form class="u-m-t-4">
								<u-form-item class="content-form-item content-form-item-score" required
									:label="`评分分值（${ +score.scoreRule ? '加分': '减分' }）`" label-width="280">
									<u-number-box v-if="+score.isEdit" v-model="score.scoreValue" :min="1" :max="100"></u-number-box>
									<u-input v-else
										:custom-style="{padding: 0, 'fontSize': '32rpx', color: +score.scoreRule ? '#19be6b': '#fa3534'}"
										height="50" v-model="score.scoreValue" input-align="right" />
									<text slot="right"
										:class="+score.scoreRule ? 'u-font-24 u-type-success' : 'u-font-24 u-type-error'">分</text>
								</u-form-item>
								<u-form-item class="content-form-item" :required="Boolean(+score.isReason)" label="原因说明"
									label-position="top">
									<u-input type="textarea" :custom-style="{padding: 0}" height="80" v-model="score.content"
										placeholder="请输入原因说明" />
								</u-form-item>
								<u-form-item class="content-form-item" label="上传图片" :border-bottom="false" label-position="left">
									<u-image v-show="pmData.imgUrl.length" class="u-m-10" width="140" height="140" :src="img"
										v-for="(img, imgIndex) in pmData.imgUrl" :key="imgIndex"
										@click="toPreview(pmData.imgUrl, imgIndex)"></u-image>
									<u-upload v-show="!pmData.imgUrl.length" width="150" height="150" max-count="3" :auto-upload="false"
										@on-list-change="onListChange($event, score)">
									</u-upload>
								</u-form-item>
							</u-form>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="u-p-20 sws-w100 u-flex">
			<u-button v-if="type === 'update'" class="sws-letter-spacing sws-line-h-repair btn-cancel" hover-class="none"
				@click="toCancel">作废</u-button>
			<u-button type="primary" class="u-flex-1 sws-letter-spacing sws-line-h-repair" @click="toSubmit">确认</u-button>
		</view>
		<u-modal v-model="showModal" :content="modalContent" :show-cancel-button="showCancelBtn"
			@confirm="modalConfirm"></u-modal>
		<u-top-tips ref="uTips" z-index="999"></u-top-tips>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				type: '', //页面标识，用于区分是从那个组件过来的数据，staff 员工 score 评分项 update 变更
				pmData: {
					userList: [],
					scoreList: [], //选择的评分项
				},
				modalContent: '',
				showCancelBtn: false,
				showModal: false,
			}
		},
		onLoad() {
			this.eventChannel = this.getOpenerEventChannel()
			this.eventChannel.on('acceptDataFromOpenerPage', ({
				data
			}) => {
				this.type = data.type
				if (this.type === 'score') { //如果是按评分项
					this.pmData.userList = [...data.userList]
					this.pmData.imgUrl = []
					this.pmData.scoreList = [{
						...data.scoreItem,
						content: ''
					}]
				} else if (this.type === 'staff') { //如果是按员工
					this.pmData = {
						...data,
						imgUrl: [],
						scoreList: [],
					}
					// this.toSelectScoreItems() //自动跳转
				} else { //变更
					this.pmData = {
						...data
					}
					if (!this.pmData.imgUrl) {
						this.pmData.imgUrl = []
					}
				}
			})
		},
		methods: {
			toPreview(list, index) {
				uni.previewImage({
					current: index,
					urls: list
				})
			},
			cancelScore() {
				this.$u.api.updateStaffScoreInfo({
					id: this.pmData.id,
					state: 1
				}).then(res => {
					if (res.msgCode === '000000') {
						setTimeout(() => {
							this.modalContent = '作废成功！'
							this.showCancelBtn = false
							this.showModal = true
						}, 1000)
					} else {
						this.$refs.uTips.show({
							title: `作废失败，原因：${ res.message }`,
							type: 'error',
							duration: 3300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			toCancel() {
				this.modalContent = '是否确认作废当前评分？'
				this.showCancelBtn = true
				this.showModal = true
			},
			onListChange(fileList, score) {
				score.imageFileList = fileList
			},
			toSubmit() {
				const tempArr = this.pmData.scoreList.filter(item => Boolean(+item.isReason) && !item.content)
				if (tempArr.length > 0) {
					this.$refs.uTips.show({
						title: `请填写评分标准（${tempArr.map(score => score.scoreCode).join('、')})的原因说明！`,
						type: 'warning',
						duration: 3800
					})
					return
				}

				uni.showLoading({
					title: '数据请求中...'
				})
				this.submitImage()
			},
			imageUpload(params) {
				return new Promise(resolve => {
					this.$u.api.uploadFileOfInOutNetworkForH5(params).then(res => {
						if (res.msgCode === '000000') {
							resolve(res)
						} else {
							resolve([])
						}
					}).catch(err => {
						resolve([])
						this.common.sysErrToast(this, err)
					})
				})
			},
			async submitImage() { //图片上传
				const tempArr = this.pmData.scoreList
				for (let i = 0; i < tempArr.length; i++) {
					const score = tempArr[i]
					score.imgUrl = []
					if (score.imageFileList && score.imageFileList.length) {
						for (let j = 0; j < score.imageFileList.length; j++) {
							const item = score.imageFileList[j]
							// #ifdef H5
							let fdParams = new FormData()
							fdParams.append('file', item.file)
							const h5_res = await this.imageUpload(fdParams)
							score.imgUrl.push(h5_res.data)
							// #endif
							// #ifdef APP-PLUS
							let params = {}
							params.urls = [item.url]
							const res = await this.$u.api.uploadFileOfInOutNetwork(params)
							score.imgUrl.push(res.data)
							// #endif
						}
					}
				}

				uni.hideLoading()
				this.submitData()
			},
			submitData() { //数据上传
				let scoreRecordList = []
				if (this.type === 'score') { //评分项类型（多员工单评分项）
					scoreRecordList = this.pmData.userList.map(user => {
						const score = this.pmData.scoreList[0]
						return {
							...user,
							content: score.content, //评分内容
							scoreId: score.scoreId,
							imgUrl: score.imgUrl,
							scoreRule: score.scoreRule, //评分规则
							scoreValue: score.scoreValue, //评分分值
							scoreCode: score.scoreCode, //评分编码
							scoreDesc: score.scoreDesc, //评分描述
						}
					})
				} else { //单员工多评分项
					scoreRecordList = this.pmData.scoreList.map(score => {
						return {
							...this.pmData,
							state: this.type === 'update' ? 3 : score.state,
							content: score.content, //评分内容
							scoreId: score.scoreId,
							imgUrl: score.imgUrl,
							scoreRule: score.scoreRule, //评分规则
							scoreValue: score.scoreValue, //评分分值
							scoreCode: score.scoreCode, //评分编码
							scoreDesc: score.scoreDesc, //评分描述
						}
					})
				}

				const func = this.type === 'update' ? 'updateStaffScoreInfo' : 'postStaffScoreInfo'
				const params = this.type === 'update' ? {
					...scoreRecordList[0]
				} : {
					scoreRecordList
				}
				this.$u.api[func](params).then(res => {
					const text = this.type === 'update' ? '变更' : '评分'
					if (res.msgCode === '000000') {
						this.modalContent = `${text}成功！`
						this.showCancelBtn = false
						this.showModal = true
					} else {
						this.$refs.uTips.show({
							title: `${text}失败，原因：${ res.message }`,
							type: 'error',
							duration: 3800
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			modalConfirm() {
				if (this.modalContent.includes('是否确认删除评分标准')) {
					this.pmData.scoreList.splice(this.currDelIndex, 1)
				} else if (this.modalContent.includes('是否确认放弃为员工')) {
					this.pmData.userList.splice(this.currDelIndex, 1)
				} else if (this.modalContent.includes('是否确认作废当前评分')) {
					this.cancelScore()
				} else {
					this.eventChannel.emit('acceptDataFromOpenedPage')
					uni.navigateBack()
				}
			},
			toDelUser({
				userName
			}, index) {
				this.currDelIndex = index
				this.modalContent = `是否确认放弃为员工(${userName})评分？`
				this.showCancelBtn = true
				this.showModal = true
			},
			toDelScoreItem({
				scoreCode,
				scoreDesc
			}, index) {
				this.currDelIndex = index
				this.modalContent = `是否确认删除评分标准：${scoreCode}.${scoreDesc}？`
				this.showCancelBtn = true
				this.showModal = true
			},
			toSelectScoreItems() {
				const _self = this
				uni.navigateTo({
					url: '/pages/microApp/Sws/performanceManagement/performanceItems/index',
					events: {
						acceptDataFromOpenedPage: function({
							selectedScoreItems
						}) {
							_self.pmData.scoreList = selectedScoreItems.map(item => {
								return {
									...item,
									content: '', //新增原因说明
								}
							})

							_self.pmData.imgUrl = [] //变更清空图片
						}
					},
					success: function(res) {
						res.eventChannel.emit('acceptDataFromOpenerPage', {
							..._self.pmData,
							type: _self.type
						})
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.score-wrap {
		width: 100%;
		height: calc(100% - 120rpx);
		padding: 20rpx 20rpx 0 20rpx;
	}

	.card-wrap {
		box-shadow: 0 0 2rpx 2rpx #ebebeb;
		border-radius: 16rpx;
		background-color: #fff;
		overflow: hidden;

		&-header {
			background-color: rgba(41, 121, 255, .7);
			padding: 30rpx 30rpx 20rpx 30rpx;

			&-up {
				height: 90rpx;
				padding-left: 16rpx;
			}

			&-down {
				background-color: #ecf5ff;
				border-radius: 12rpx;
				padding: 4rpx 16rpx;
				margin-top: 20rpx;
			}

			.card-score {

				&-icon {
					opacity: .25;
				}

				&-text {
					top: -2rpx;
					left: 4rpx;
					font-size: 52rpx;

					&-more {
						display: flex;
						justify-content: center;
						align-items: flex-end;
						line-height: .5;
					}
				}
			}

			.card-user {
				width: calc(50% - 8rpx);
				margin-bottom: 10rpx;
				border-radius: 12rpx;
				overflow: hidden;
				align-items: normal;

				&-left {
					background-color: #a0cfff;
					color: #fff;
					padding: 0 16rpx;
				}

				&-center {
					flex: 1;
					padding: 10rpx;
				}

				&-right {
					width: 60rpx;
				}
			}

			.card-user:nth-child(odd) {
				margin-right: 16rpx;
			}
		}

		&-content {
			padding: 30rpx;

			.score-content {
				position: relative;
				margin-top: 50rpx;
				border: 2rpx solid #ecf5ff;
				border-radius: 12rpx;

				&-del {
					position: absolute;
					right: 40rpx;
					top: -36rpx;
					z-index: 10;
					height: 72rpx;
					padding: 0 20rpx;
					background-color: #fff;
				}

				&-wrap {
					border-radius: 12rpx;
					overflow: hidden;

					.score-title-wrap {
						box-shadow: 0 4rpx 6rpx 0rpx #ecf5ff;

						.score-title {
							background-color: #a0cfff;
							color: #fff;
							width: 180rpx;
							height: 52rpx;
							line-height: 54rpx;
							text-align: center;
							border-radius: 8rpx;
						}
					}

					.content-form-item {
						padding: 8rpx 32rpx;
					}
				}
			}

			.score-content:first-child {
				margin-top: 20rpx;
			}

			.score-content.type-staff {
				margin-top: 0;
			}
		}
	}

	.del-btn {
		padding: 6rpx 10rpx;
		border-radius: 8rpx;
		border: 2rpx solid #a0cfff;
		opacity: .8;
	}

	.btn-cancel {
		margin-right: 20rpx;
		background-color: #a1afc9;
		border-color: #a1afc9;
		color: #fff;
	}

	::v-deep .content-form-item-score .u-form-item--right__content__slot {
		justify-content: end;
	}
</style>