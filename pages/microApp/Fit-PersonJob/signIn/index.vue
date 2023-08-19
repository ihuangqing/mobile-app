<!-- 人岗匹配 → 上班签到 → 签到人员列表 -->
<template>
	<view class="u-rela">
		<view class="user-list">
			<uni-swipe-action>
				<uni-swipe-action-item :right-options="options" v-for="(user, index) in list" :key="index"
					@click="deal($event, index)">
					<view class="u-rela u-flex">
						<u-card class="sws-w100 user-card" margin="10rpx 20rpx" border-radius="0"
							:title="`${user.userName}(${user.account})`"
							:head-style="{background: '#2979ff', padding: '20rpx 30rpx', color: '#ffffff', height: '80rpx'}"
							title-color="#fff" sub-title-color="#fff" :body-style="{overflow: 'hidden', padding: '0'}"
							:foot-style="{padding: '10rpx 0'}"
							:show-foot="Boolean(user.wearList && user.wearList.length && Number(user.isSignIn))">
							<u-cell-group slot="body" :border="false">
								<u-cell-item class="u-p-t-0 u-p-b-0" :value-style="{color: '#303133'}" title="岗位"
									:value="user.posts.map(post => post.postName).join('、')" hover-class="none"
									:arrow="false"></u-cell-item>
								<u-cell-item class="u-p-t-0 u-p-b-0" :value-style="{color: '#303133'}"
									v-show="user.devices.length" title="设备"
									:value="user.devices.map(device => device.deviceCode).join('、')" hover-class="none"
									:arrow="false"></u-cell-item>
								<u-cell-item class="u-p-t-0 u-p-b-0"
									:value-style="{color: '#303133','padding-left': '30rpx', 'overflow-wrap': 'break-word'}"
									v-show="!+user.isSignIn" :border-bottom="false" title="未签到原因" hover-class="none"
									arrow-direction="right" :value="user.reasonName ? user.reasonName : '请选择未签到原因'"
									@click="showUnSignReason(user)"></u-cell-item>
							</u-cell-group>
							<u-cell-item slot="foot" class="u-p-t-0 u-p-b-0"
								:value-style="{color: '#303133','padding': '0 20rpx'}" title="穿戴" :arrow="false"
								:border-bottom="false" hover-class="none">
								<text v-for="(wear, x) in user.wearList" :key="x"
									:class="user.ngWears && user.ngWears.includes(wear) ? 'u-type-error': ''">{{ `${wear}${x === user.wearList.length -1 ? '' : '、'}` }}</text>
								<u-switch slot="right-icon" v-model="user.checked" inactive-color="#fa3534"
									active-color="#19be6b" :showText="true" size="46" inactive-value="0"
									active-value="1" @change="switchChange($event, user)"></u-switch>
							</u-cell-item>
						</u-card>
						<view :class="+user.isSignIn ? 'check-btn check-in-btn' : 'check-btn'"
							@click="userSignIn(user)">
							<view class="check-btn-item">{{ +user.isSignIn ? '签到' : '请假' }}</view>
						</view>
					</view>
				</uni-swipe-action-item>
			</uni-swipe-action>
		</view>
		<!-- #ifdef H5 -->
		<view class="btn-group sws-w100 u-flex u-row-between u-p-t-28 u-p-b-28">
			<u-button size="medium" type="primary" @click="NFCRead">NFC识别</u-button>
			<u-button class="sign-in" size="medium" type="primary" @click="signIn">签到</u-button>
		</view>
		<!-- #endif -->
		<!-- #ifdef APP-PLUS -->
		<view class="btn-group sws-w100 u-p-28">
			<u-button class="sign-in sws-w100" type="primary" @click="signIn">签到</u-button>
		</view>
		<!-- #endif -->
		<u-modal v-model="showDayNight" title="请选择白/夜班" show-cancel-button :confirm-text="dayNight ? '白班签到' : '夜班签到'"
			@confirm="confirmSignIn">
			<view class="u-p-40 u-flex sws-flex-d-column">
				<view class="u-flex-1 u-flex u-row-between u-p-l-40 u-p-r-40 u-p-b-30 sws-w100">
					<view :class="dayNight ? 'u-type-primary sws-font-bold': ''">白班</view>
					<view :class="!dayNight ? 'u-type-primary sws-font-bold': ''">夜班</view>
				</view>
				<view class="day-night" :class="!dayNight ? 'active' : ''" @click="dayNight = !dayNight">
					<view class="day-night-switch u-flex u-row-center">
						<u-icon v-if="dayNight" name="baiban" custom-prefix="sws-icon" size="74" color="#feac11">
						</u-icon>
						<u-icon v-else name="yeban" custom-prefix="sws-icon" size="64" color="gray"></u-icon>
					</view>
				</view>
			</view>
		</u-modal>
		<u-select v-model="showSelect" :list="reasonList" @confirm="confirmReason"></u-select>
		<u-modal v-model="showInputRemark" @confirm="confirmRemark">
			<view class="u-p-30">
				<u-input type="textarea" placeholder="请输入理由" v-model="inputRemark" height="120"
					placeholder-style="fontSize: 32rpx" :custom-style="{'font-size': '36rpx'}" />
			</view>
		</u-modal>
		<u-modal v-model="showModal" :content="content" @confirm="confirm"></u-modal>
		<u-top-tips ref="uTips"></u-top-tips>
	</view>
</template>

<script>
	// #ifdef APP-PLUS
	import nfc from '../../../../js_sdk/hexiii-nfc/hexiii-nfc.js'
	// #endif

	import {
		mapState
	} from 'vuex'
	export default {
		data() {
			return {
				dayNight: true,
				nfcTips: '请将工卡靠近PDA背面识别区域',
				refreshList: true,
				cellTitleStyle: {
					fontSize: '24rpx',
					padding: '10rpx 20rpx',
					background: '#00B578',
					color: '#fff'
				},
				list: [], //所有滑动项都需要添加show属性，否则无法主动触发关闭
				options: [{
					text: '编辑',
					style: {
						backgroundColor: '#2979ff'
					}
				}, {
					text: '删除',
					style: {
						backgroundColor: '#dd524d'
					}
				}],
				content: '',
				showModal: false,
				readData: {},
				showSelect: false,
				showDayNight: false,
				reasonList: [],
				showInputRemark: false,
				inputRemark: ''
			}
		},
		computed: mapState(['userInfo', 'sysInfo']),
		watch: {
			readData(newVal) {
				if (Object.keys(newVal).length > 0) {
					const params = {
						cardFixId: newVal.id //3209766308一卡对多人测试账号
					}
					this.$u.api.getUserInfoFromC6(params).then(res => {
						if (res.msgCode === '000000') {
							if (res.data.length === 1) {
								this.addUser({
									account: res.data[0].account,
									userName: res.data[0].userName
								})
							} else if (res.data.length > 1) {
								let _self = this
								uni.showActionSheet({
									itemList: res.data.map(user => user.userName),
									success: user => {
										this.addUser(res.data[user.tapIndex])
									}
								})
							} else {
								this.$refs.uTips.show({
									title: '您的数据未同步，请联系管理员！',
									type: 'warning',
									duration: 2300
								})
							}
						} else {
							this.$refs.uTips.show({
								title: `人员信息获取失败，原因：${ res.message }`,
								type: 'error',
								duration: 2300
							})
						}
					}).catch(err => {
						this.common.sysErrToast(this, err)
					})
				} else {
					this.$refs.uTips.show({
						title: '未读到数据',
						type: 'warning',
						duration: 2300
					})
				}
				setTimeout(() => { //防止连续触发
					this.NFCRead(this.$data)
				}, 2000)
			}
		},
		onLoad: function() {
			// #ifdef APP-PLUS
			nfc.listenNFCStatus()
			// #endif

			this.NFCRead(this.$data)

			this.getUsersByForeman() //获取组员签到信息
		},
		methods: {
			getUsersByForeman() {
				uni.stopPullDownRefresh()
				this.$u.api.getUsersByForeman(this.userInfo.account).then(async res => {
					if (res.msgCode === '000000') {
						this.dayNight = res.data.shift == 2 ? false : true
						for (let i = 0; i < res.data.staffList.length; i++) {
							let user = res.data.staffList[i]
							this.list.push({
								...user,
								checked: true,
								wearList: user.wears,
								show: false,
								isSignIn: '0', //是否签到 将所有人员重置为未签到
								reason: '', //未签到理由
								reasonName: '',
								state: 1,
								okWears: [],
								ngWears: []
							})
						}
					} else {
						this.$refs.uTips.show({
							title: `组员签到信息获取失败，原因：${ res.message }`,
							type: 'error',
							duration: 2300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			confirmRemark() {
				if (this.status === 'del') {
					const params = {
						account: this.list[this.curDelIndex].account,
						foremanAcct: this.userInfo.account,
						reason: this.curReason.value,
						remark: this.inputRemark
					}
					this.toDelUser(params)
				} else {
					this.curUser.reason = this.curReason.value
					this.curUser.reasonName = this.curReason.label
					this.curUser.remark = this.inputRemark
				}
			},
			showUnSignReason(user) { //展示请假理由
				this.reasonList = [{ //请假理由列表
					label: '休假',
					value: 'XJ'
				}, {
					label: '旷工',
					value: 'KG'
				}, {
					label: '其他',
					value: 'QT'
				}]
				this.status = 'unSign' //记录当前是未签到理由
				this.curUser = user //记录当前操作人员
				this.showSelect = true
			},
			confirmReason(arr) { //确定理由选择
				const temp = arr[0]
				if (temp.value === 'QT') { //选择其他，输入理由
					this.curReason = temp
					this.inputRemark = ''
					this.showInputRemark = true
				} else {
					if (this.status === 'del') { //删除
						const params = {
							account: this.list[this.curDelIndex].account,
							foremanAcct: this.userInfo.account,
							reason: temp.value
						}
						this.toDelUser(params)
					} else { //请假
						this.curUser.reason = temp.value
						this.curUser.reasonName = temp.label
					}
				}
			},
			userSignIn(user) {
				if (+user.isSignIn) {
					user.isSignIn = '0'
					user.reason = ''
					user.reasonName = ''
				} else {
					user.isSignIn = '1'
				}
			},
			getWearInfo(postIds) {
				const params = {
					postIds
				}
				return new Promise((resolve, reject) => {
					this.$u.api.getWearInfo(params).then(res => {
						if (res.msgCode === '000000') {
							resolve(res.data)
						} else {
							resolve([])
						}
					}).catch(err => {
						resolve([])
					})
				})
			},
			switchChange(val, user) {
				if (Number(val)) { // Ok
					user.state = 1
					user.okWears = user.wearList
					user.ngWears = []
				} else { // NG
					const params = {
						userName: user.userName,
						account: user.account,
						posts: JSON.stringify(user.posts),
						wearList: JSON.stringify(user.wearList)
					}
					uni.navigateTo({
						url: `/pages/microApp/Fit-PersonJob/wearCheck/index${this.$u.queryParams(params)}`,
						events: {
							acceptDataFromOpenedPage(res) {
								console.log('穿戴信息：', res)
								if (res.state) { //判断是否为ok（sjb全选穿戴了）修改switch状态
									user.checked = true
								}
								user.state = res.state
								user.okWears = res.okWears
								user.ngWears = res.ngWears
							}
						}
					})
				}
			},
			signIn() { //签到
				let ngUsers = this.list.filter(user => { //获取签到信息不全的人员列表，无（主管、拉线、工段、岗位等信息）
					return user.directorAcct == '' || !user.lines.length || !user.mesArea || !user.posts.length
				})
				if (ngUsers.length > 0) {
					let names = ngUsers.map(user => {
						return user.userName
					}).join('、')
					this.content = `${names}的签到信息不完成，无法签到！`
					this.showModal = true
					return
				}

				let unsignInUsers = this.list.filter(user => {
					return !+user.isSignIn && !user.reason
				})
				if (unsignInUsers.length > 0) {
					let names = unsignInUsers.map(user => {
						return user.userName
					}).join('、')
					this.content = `${names}未签到，请选择未签到原因！`
					this.showModal = true
					return
				}

				if (!this.list.length) {
					this.$refs.uTips.show({
						title: '无签到人员！',
						type: 'warning',
						duration: '2300'
					})
					return
				}

				this.toShowDayNight()
			},
			toShowDayNight() {
				// 获取时间戳用于计算白夜班,获取失败直接显示弹框
				this.$u.api.getTimestamp().then(res => {
					if (res.msgCode && res.data) {
						const hour = new Date(res.data).getHours()
						if (hour >= 6 && hour < 18) {
							this.dayNight = true
						} else {
							this.dayNight = false
						}
					}
					this.showDayNight = true
				}).catch(err => {
					console.log('时间戳获取失败')
					this.showDayNight = true
				})
			},
			confirmSignIn() {
				let params = {
					foremanAcct: this.userInfo.account,
					foremanName: this.userInfo.userName,
					shift: this.dayNight ? 1 : 2,
					staffList: this.list
				}

				this.$u.api.signIn(params).then(res => {
					if (res.msgCode === '000000') {
						this.content = '签到成功'
						this.showModal = true
					} else {
						this.$refs.uTips.show({
							title: `签到失败，原因:${res.message}`,
							type: 'warning',
							duration: '2300'
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			NFCRead() { //NFC读取
				// #ifdef APP-PLUS
				nfc.readData(this.$data)
				// #endif

				// #ifdef H5
				let _self = this
				let testUserList = [{
					userName: 'test1',
					account: 'test1'
				}, {
					userName: '超级管理员',
					account: 'admin'
				}, {
					userName: '何伟',
					account: '2104260226'
				}, {
					userName: '查全骏',
					account: '2102020019'
				}, {
					userName: '王伟',
					account: '2105200007'
				}, {
					userName: '张纪鹏',
					account: '2004130184'
				}, {
					userName: '解涛',
					account: '2106010168'
				}, {
					userName: '赵珺',
					account: '2005060027'
				}, {
					userName: '金娥',
					account: '2103080345'
				}, {
					userName: '测试账号',
					account: '3209766308'
				}]
				uni.showActionSheet({
					itemList: testUserList.map(user => user.userName),
					success: res => {
						this.addUser(testUserList[res.tapIndex])
					}
				})
				// #endif
			},
			addUser(user) {
				let templateUser = {
					checked: true,
					show: false,
					isSignIn: '1', //是否签到 对于刷卡签到的人员默认签到
					reason: '', //未签到理由
					reasonName: '',
					foremanAcct: this.userInfo.account,
					foremanName: this.userInfo.userName,
					directorName: '',
					directorAcct: '',
					mesArea: '',
					lines: [],
					posts: [],
					devices: [],
					wearList: [],
					state: 1,
					okWears: [],
					ngWears: []
				}
				if (!this.list.some(item => item.account === user.account)) { //校验是否重复签到
					let newUser = {
						...user,
						...templateUser
					}
					this.list.push(newUser)
					this.$nextTick(() => {
						uni.pageScrollTo({
							scrollTop: this.sysInfo.screenHeight,
							duration: 300
						})
					})
					setTimeout(() => {
						this.toEditUserInfo(newUser) //刷卡人员不再查询签到信息，全部需要重新维护
					}, 1000)
				} else {
					this.$refs.uTips.show({
						title: '请勿重复签到!',
						type: 'warning',
						duration: '2300'
					})
				}
			},
			async refreshUserInfo(user) { //刷新页面上签到人员的签到信息
				let wearList = await this.getWearInfo(user.posts.map(item => item.postId).join(','))
				this.list.forEach(item => {
					if (item.account == user.account) {
						item.directorName = user.directorName
						item.directorAcct = user.directorAcct
						item.lines = user.lines
						item.mesArea = user.mesArea
						item.posts = user.posts
						item.devices = user.devices
						item.wearList = wearList
						item.okWears = wearList
					}
				})
			},
			toEditUserInfo(user) { //跳转至签到信息维护页面
				let _self = this
				let data = { //user 是编辑的人员对象，list是所有已签到的人员列表，用于模板
					user: user,
					list: this.list
				}
				uni.navigateTo({
					url: '/pages/microApp/Fit-PersonJob/signIn/dutyInfo/index',
					success: function(res) {
						res.eventChannel.emit('acceptDataFromOpenerPage', {
							data
						})
					},
					events: {
						acceptDataFromOpenedPage(res) {
							console.log('签到信息：', res)
							_self.refreshUserInfo(res.user)
						}
					}
				})
			},
			deal(event, index) { //type是按钮类型 options中按钮的下标
				if (!event.index) { //编辑
					this.toEditUserInfo(this.list[index])
				} else { //删除
					setTimeout(() => {
						this.reasonList = [{ //删除理由列表包含（调岗、离职）
							label: '离职',
							value: 'LZ'
						}, {
							label: '调岗',
							value: 'TG'
						}, {
							label: '休假',
							value: 'XJ'
						}, {
							label: '其他',
							value: 'QT'
						}]
						this.status = 'del'
						this.curDelIndex = index
						this.showSelect = true
					}, 350) //删除操作发生在动画结束之后
				}
			},
			toDelUser(params) {
				this.$u.api.delUsersFromGroup(params).then(res => {
					if (res.msgCode === '000000') {
						this.content = '删除成功'
						this.showModal = true
					} else {
						this.$refs.uTips.show({
							title: `删除失败，原因：${ res.message }`,
							type: 'error',
							duration: 2300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			confirm() {
				if (this.content.includes('签到成功')) { //签到成功，清空签到列表
					this.list = []
					uni.navigateBack()
				} else if (this.content.includes('删除成功')) {
					this.list.splice(this.curDelIndex, 1)
					this.curDelIndex = null
				}
			}
		},
		onNavigationBarButtonTap() {
			let _self = this
			uni.navigateTo({
				url: '/pages/microApp/Fit-PersonJob/signIn/undoDel/index',
				events: {
					acceptDataFromOpenedPage: function() {
						//撤回页面返回需要刷新列表
						_self.list = []
						_self.getUsersByForeman()
					}
				}
			})
		},
		onPullDownRefresh() {
			this.list = []
			this.getUsersByForeman()
		},
		onBackPress() {
			if (this.showDayNight) {
				this.showDayNight = false
				return true
			} else if (this.showSelect) {
				this.showSelect = false
				return true
			} else if (this.showInputRemark) {
				return true
			}
		}
	}
</script>

<style lang="scss" scoped>
	.day-night {
		width: 484rpx;
		height: 124rpx;
		border-radius: 16rpx;
		border: 2rpx solid rgba(0, 0, 0, 0.1);
		background-color: #feac11;

		&-switch {
			width: 120rpx;
			height: 120rpx;
			border-radius: 16rpx;
			background-color: #ffffff;
			box-shadow: 0 6rpx 2rpx 0 rgba(0, 0, 0, .05), 0 4rpx 4rpx 0 rgba(0, 0, 0, .1), 0 6rpx 6rpx 0 rgba(0, 0, 0, .05);
			transition: transform 0.3s cubic-bezier(0.3, 1.05, 0.4, 1.05);
			transform: translateX(0rpx);
		}
	}

	.day-night.active {
		background-color: gray;
	}

	.day-night.active .day-night-switch {
		transform: translateX(362rpx);
	}

	.user-list {
		padding-bottom: 110rpx;
	}

	.check-btn {
		position: absolute;
		right: 50rpx;
		top: 16rpx;
		width: 168rpx;
		height: 68rpx;
		text-align: center;
		border-radius: 8rpx;
		background-color: $u-type-warning;
		border: 2rpx solid rgba(0, 0, 0, 0.1);
		z-index: 2;
		display: inline-flex;
		align-items: center;

		&-item {
			margin: 0 2rpx;
			width: 80rpx;
			height: 60rpx;
			line-height: 60rpx;
			border-radius: 8rpx;
			background-color: #ffffff;
			color: $u-type-warning;
			font-size: 24rpx;
			transition: transform 0.3s cubic-bezier(0.3, 1.05, 0.4, 1.05);
			box-shadow: 0 6rpx 2rpx 0 rgba(0, 0, 0, .05), 0 4rpx 4rpx 0 rgba(0, 0, 0, .1), 0 6rpx 6rpx 0 rgba(0, 0, 0, .05);
			transform: translateX(0rpx);
		}
	}

	.check-in-btn {
		background-color: $u-type-success;
	}

	.check-btn.check-in-btn .check-btn-item {
		transform: translateX(80rpx);
		color: $u-type-success;
	}


	.user-card {
		border-top-left-radius: 16rpx !important;
		border-top-right-radius: 16rpx !important;
	}

	.btn-group {
		background-color: #ffffff;
		position: fixed;
		bottom: 0;
		left: 0;
		z-index: 3;

		.sign-in {
			letter-spacing: 20rpx;
			text-indent: 20rpx;
		}
	}
</style>
