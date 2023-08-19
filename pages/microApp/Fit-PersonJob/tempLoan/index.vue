<!-- 临时借调 -->
<template>
	<view class="sws-wh100 u-flex sws-flex-d-column">
		<view class="sws-w100">
			<u-tabs :list="tabList" :is-scroll="false" :current="current" @change="change"></u-tabs>
		</view>
		<view class="u-flex-1 sws-overflow-scroll-y sws-bg-ebebeb sws-w100">
			<view v-if="!current" class="u-p-20">
				<u-card margin="0 0 20rpx 0" :border="false"
					:head-style="{background: '#2979ff',padding: '20rpx 30rpx'}" :body-style="{padding: 0}"
					:foot-style="{padding: '16rpx 30rpx'}" :show-foot="true" :full="true" v-for="(user, index) in list"
					:key="index">
					<view slot="head">
						<view class="card-head u-font-32 u-flex">
							<view>{{ user.userName }}</view>
							<view class="u-font-24">({{ user.account }})</view>
						</view>
					</view>
					<u-cell-group slot="body" :border="false">
						<u-cell-item class="u-p-t-10 u-p-b-10" hover-class="none" :arrow="false" title="签到岗位"
							:value-style="{color: '#303133', paddingLeft: '20rpx'}"
							:border-bottom="+user.isTransfer ? true : false"
							:value="`${ user.line } → ${ user.mesArea } → ${ user.post }`">
						</u-cell-item>
						<u-cell-item v-show="+user.isTransfer" class="u-p-t-10 u-p-b-10" hover-class="none"
							:arrow="false" :border-bottom="false" title="借调岗位" :value-style="{color: '#303133'}"
							:value="user.postName">
						</u-cell-item>
					</u-cell-group>
					<view slot="foot" class="u-text-right">
						<u-button v-show="!+user.isTransfer" class="btn-style u-m-l-30 sws-line-h-repair" size="medium" type="warning"
							@click="toLoanOut(index)">调出
						</u-button>
					</view>
				</u-card>
			</view>
			<view v-else class="post-item u-flex u-p-20 u-m-t-20" v-for="(user, loanIndex) in loanInList"
				:key="loanIndex">
				<view class="u-flex u-flex-1 u-p-l-20" @click="selectLoanInUser(user)">
					<view class="u-flex-1">
						<view class="sws-font-bold u-m-b-10">
							<text>{{ user.userName }}</text>
							<text class="u-font-24">({{ user.account }})</text>
						</view>
						<view class="u-font-24">{{`${ user.nowLine } → ${ user.nowMesArea } → ${ user.nowPost }`}}
						</view>
					</view>
				</view>
				<view class="u-flex">
					<u-checkbox @change="selectLoan" :name="loanIndex" v-model="user.checked"></u-checkbox>
				</view>
			</view>
		</view>
		<no-data v-show="showNoData"></no-data>
		<view v-show="current" class="check-btn-group sws-w100 u-flex u-row-between">
			<view>
				<u-checkbox @change="checkboxChange" v-model="checkAll">{{ checkAll ? '取消全部' : '全部' }}</u-checkbox>
			</view>
			<u-button class="check-confirm sws-line-h-repair" type="primary" @click="toLoanIn">调入</u-button>
		</view>
		<u-popup v-model="showPopup" mode="bottom" length="60%">
			<view class="popup-head u-flex u-p-l-10 u-p-r-10">
				<view class="u-p-l-20 u-p-r-20">
					<u-icon name="close" size="36" color="#fff" @click="showPopup = false">
					</u-icon>
				</view>
				<view class="u-flex-1 u-text-center sws-font-fff">请选择调出岗位</view>
				<view class="u-p-l-20 u-p-r-20">
					<u-icon name="plus" custom-prefix="sws-icon" size="42" color="#fff" @click="toAddLoanPost"></u-icon>
				</view>
			</view>
			<scroll-view scroll-y="true" class="scroll-wrap">
				<uni-swipe-action>
					<uni-swipe-action-item :right-options="options" v-for="(post, index) in tempPostList" :key="index"
						@click="delItem(index)">
						<view class="post-item u-flex u-p-20">
							<view class="u-flex u-flex-1 u-p-l-20" @click="currPost = post.id">
								<view class="u-flex-1">
									<view class="sws-font-bold u-m-b-16">
										<text>{{ post.foremanName }}</text>
										<text class="u-font-24">({{ post.foremanAcct }})</text>
									</view>
									<view class="u-font-24">{{`${ post.line } → ${ post.mesArea }  → ${ post.post }`}}
									</view>
								</view>
							</view>
							<view class="u-flex">
								<u-radio-group v-model="currPost">
									<u-radio shape="circle" :name="post.id"></u-radio>
								</u-radio-group>
							</view>
						</view>
					</uni-swipe-action-item>
				</uni-swipe-action>
			</scroll-view>
			<view class="sws-w100 u-flex u-row-between u-p-t-20 u-p-b-20 u-p-l-28 u-p-r-28 u-border-top">
				<u-button class="btn-indent sws-line-h-repair" type="default" size="medium" @click="showPopup = false">
					取消</u-button>
				<u-button class="sws-line-h-repair" type="primary" size="medium" @click="commitLoanOut">确认调出</u-button>
			</view>
		</u-popup>
		<u-modal v-model="showModal" :content="modalContent" show-cancel-button @confirm="modalConfirm"></u-modal>
		<u-modal v-model="showResModal" :content="resContent" @confirm="resModalConfirm"></u-modal>
		<u-top-tips ref="uTips"></u-top-tips>
	</view>
</template>

<script>
	import noData from '../../../components/noData/index.vue'
	import {
		mapState
	} from 'vuex'

	export default {
		components: {
			noData
		},
		data() {
			return {
				current: 0,
				tabList: [{
					name: '调出'
				}, {
					name: '调入'
				}],
				options: [{
					text: '删除',
					style: {
						backgroundColor: '#dd524d'
					}
				}],
				currPost: '',
				tempPostList: [],
				list: [], //调出人员列表
				loanInList: [], //调入人员列表
				showPopup: false,
				showNoData: false,
				modalContent: '',
				showModal: false,
				resContent: '',
				showResModal: false,
				checkAll: false
			}
		},
		computed: mapState(['userInfo']),
		onLoad() {
			this.toGetLoanOutList()
		},
		methods: {
			delItem(index) {
				this.curDelIndex = index
				this.modalContent = '是否确认删除这条调出岗位配置？'
				this.showModal = true
			},
			selectLoanInUser(user) {
				user.checked = !user.checked
				this.checkAllUser()
			},
			checkAllUser() {
				this.checkAll = this.loanInList.every(user => user.checked)
			},
			selectLoan(check) {
				this.$nextTick(() => {
					this.checkAllUser()
				})
			},
			checkboxChange(check) {
				this.loanInList.forEach(user => {
					user.checked = check.value
				})
			},
			toAddLoanPost() {
				if (this.showPopup) this.showPopup = false
				const _self = this
				uni.navigateTo({
					url: '/pages/microApp/Fit-PersonJob/tempLoan/addLoanPost/index',
					events: {
						acceptDataFromOpenedPage: () => {
							_self.list.splice(_self.curIndex, 1)
							if (!_self.list.length) this.showNoData = true
						},
					},
					success: function(res) {
						res.eventChannel.emit('acceptDataFromOpenerPage', {
							data: _self.list[_self.curIndex]
						})
					}
				})
			},
			toLoanIn(user, index) {
				let list = this.loanInList.filter(item => item.checked)
				if (list.length) {
					this.modalContent = `是否确认将组员 ${ list.map(user => user.userName).join('、') } 调入原岗位 ?`
					this.showModal = true
				} else {
					this.$refs.uTips.show({
						title: '请选择调入组员',
						type: 'warning',
						duration: 2300
					})
				}
			},
			modalConfirm() {
				if (this.modalContent.includes('调入')) {
					this.confirmLoadIn()
				} else {
					this.confimrDel()
				}
			},
			confirmLoadIn() {
				let params = {
					callIds: this.loanInList.filter(item => item.checked).map(item => item.callId).join(',')
				}
				this.$u.api.postLoanIn(params).then(res => {
					if (res.msgCode === '000000') {
						this.resContent = '调入成功！'
						this.showResModal = true
					} else {
						this.$refs.uTips.show({
							title: `调入失败，原因：${ res.message }`,
							type: 'error',
							duration: 2300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			confimrDel() {
				const id = this.tempPostList[this.curDelIndex].id
				this.$u.api.delLoanHistoryItem(id).then(({msgCode, message, data})=> {
					if (msgCode === '000000') {
						this.resContent = '删除成功'
						this.showResModal = true
					} else {
						this.$refs.uTips.show({
							title: `删除失败，原因：${ message }`,
							type: 'error',
							duration: 2300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			toLoanOut(index) {
				this.curIndex = index
				this.toGetTempPostList() //获取常用临时调岗列表
			},
			toGetTempPostList() {
				this.$u.api.getLoanHistoryList(this.userInfo.account).then(res => {
					if (res.msgCode === '000000') {
						if (res.data && res.data.length) {
							this.tempPostList = res.data
							this.showPopup = true
						} else {
							this.toAddLoanPost()
						}
					} else {
						this.toAddLoanPost()
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			commitLoanOut() {
				this.showPopup = false
				let group = this.tempPostList.filter(item => item.id == this.currPost)
				if (group && group.length) {
					let params = group[0]
					params.account = this.list[this.curIndex].account
					this.$u.api.postLoanOut(params).then(res => {
						if (res.msgCode === '000000') {
							this.resContent = '调出成功!'
							this.showResModal = true
						} else {
							this.$refs.uTips.show({
								title: `调出失败，原因：${ res.message }`,
								type: 'error',
								duration: 2300
							})
						}
					}).catch(err => {
						this.common.sysErrToast(this, err)
					})
				} else {
					this.$refs.uTips.show({
						title: '请选择调出岗位',
						type: 'warning',
						duration: 2300
					})
				}
			},
			resModalConfirm() {
				if (this.resContent.includes('调出')) {
					this.list.splice(this.curIndex, 1)
					if (!this.list.length) this.showNoData = true
				} else if (this.resContent.includes('调入')) {
					this.checkAll = false
					this.loanInList = this.loanInList.filter(item => !item.checked)
					if (!this.loanInList.length) this.showNoData = true
				} else { //删除
					this.tempPostList.splice(this.curDelIndex, 1)
				}
			},
			toGetLoanOutList() {
				this.$u.api.getLoanOutList(this.userInfo.account).then(res => {
					if (res.msgCode === '000000') {
						if (res.data && res.data.length) {
							this.list = res.data
						} else {
							this.showNoData = true
						}
					} else {
						this.$refs.uTips.show({
							title: `人员列表获取失败，原因：${ res.message }`,
							type: 'error',
							duration: 2300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			toGetLoanInList() {
				this.$u.api.getLoanInList(this.userInfo.account).then(res => {
					if (res.msgCode === '000000') {
						if (res.data && res.data.length) {
							this.loanInList = res.data.map(user => {
								return {
									...user,
									checked: false
								}
							})
						} else {
							this.showNoData = true
						}
					} else {
						this.$refs.uTips.show({
							title: `人员列表获取失败，原因：${ res.message }`,
							type: 'error',
							duration: 2300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			change(index) {
				this.current = index
				this.showNoData = false
				switch (index) {
					case 0:
						this.toGetLoanOutList() //获取调出人员列表
						break;
					case 1:
						this.toGetLoanInList() //获取调入人员列表
						break;
				}
			}
		},
		onBackPress() {
			if (this.showPopup) {
				this.showPopup = false
				return true
			} else if (this.showModal) {
				this.showModal = false
				return true
			}
		}
	}
</script>

<style lang="scss" scoped>
	.card-head {
		color: #ffffff;
	}

	.btn-style {
		width: 120rpx;
		height: 60rpx;
		line-height: 60rpx;
		padding: 0 16rpx;
		text-indent: 20rpx;
		letter-spacing: 20rpx;
	}

	.scroll-wrap {
		height: calc(100% - 190rpx);
		background-color: #ebebeb;
	}

	.popup-head {
		background-color: $u-type-primary;
		height: 80rpx;
	}

	.post-item {
		background-color: #ffffff;
	}

	.btn-indent {
		letter-spacing: 20rpx;
		text-indent: 20rpx;
	}

	.check-btn-group {
		background-color: #ffffff;
		z-index: 3;
		padding: 28rpx 40rpx;

		.check-confirm {
			width: 240rpx;
			margin: 0;
			letter-spacing: 20rpx;
			text-indent: 20rpx;
		}
	}

	::v-deep .uni-scroll-view-content {
		display: flex;
		flex-direction: column;
	}

	::v-deep .uni-swipe {
		margin-bottom: 20rpx;
	}
</style>
