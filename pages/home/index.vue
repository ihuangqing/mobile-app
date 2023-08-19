<!-- 已登录状态首页 -->
<template>
	<view class="page-wrap sws-wh100 u-p-b-118 sws-bg-ebebeb u-flex sws-flex-d-column">
		<!-- 自定义导航栏 -->
		<u-navbar :is-back="false" title="" :height="navbarH" :border-bottom="false" z-index="900">
			<view class="slot-wrap u-flex sws-flex-d-column">
				<view class="sws-w100 u-flex u-p-l-20 u-p-r-20">
					<view class="u-flex-1 u-m-r-20">
						<view class="u-flex">
							<view v-if="showScan" class="filter-input u-flex" @click="scanCode">
								<u-icon name="saoma" custom-prefix="sws-icon" size="44" color="#2979ff"></u-icon>
								<u-line color="#2979ff4d" direction="col" length="40" class="u-m-l-20"
									:hair-line="false" />
							</view>
							<u-search :class="showScan ? 'search-input' : ''" class="u-flex-1" v-model="keyword"
								placeholder="输入应用名可快速定位到此应用" placeholder-color="#aaaaaa" shape="square"
								bg-color="#ffffff"
								:action-style="{background: '#ffffff', color: '#303133', height: '64rpx', 'line-height': '64rpx','border-top-right-radius': '10rpx', 'border-bottom-right-radius': '10rpx', 'margin-left': '-2rpx', 'width': '104rpx', 'font-weight': 'bold'}"
								@change="$u.throttle(change, 1000)" @search="custom" @custom="custom" @clear="clear">
							</u-search>
						</view>
					</view>
					<view class="u-flex">
						<view class="right-item" @click="goToDeal">
							<u-icon :name="hasLogin ? 'xitongtongzhi1': 'account'" custom-prefix="sws-icon" size="50">
							</u-icon>
							<u-badge v-show="hasLogin && hasNoReadMsg" :is-dot="true" :offset="[-6, 18]"></u-badge>
						</view>
					</view>
				</view>
			</view>
		</u-navbar>
		<view v-if="quickEntryList.length" class="tab-bg" v-show="!isSearch">
			<view class="tab-bg-list sws-wh100 sws-bg-ffffff u-flex">
				<view class="tab-item u-flex-1 u-flex sws-flex-d-column u-row-center"
					v-for="(app, index) in quickEntryList[0].subMenus" :key="index" @click="toApp(app)">
					<view class="item-icon">
						<u-icon :name="app.icon" custom-prefix="sws-icon" size="62"></u-icon>
					</view>
					<view class="u-m-t-16 item-font">{{ app.menuName }}</view>
				</view>
			</view>
		</view>
		<!-- 正文内容 -->
		<view id="home_content" class="sws-w100 u-flex-1 u-p-l-20 u-p-r-20 u-p-b-20 sws-overflow-scroll-y"
			v-show="!isSearch">
			<!-- 轮播图 -->
			<u-swiper class="u-m-t-20" v-show="swiperList.length" :list="swiperList" border-radius="10" :title="true"
				height="300" img-mode="aspectFill" mode="dot" bg-color="#ebebeb" @click="openSwiper"></u-swiper>
			<login-out :fileList="fileList" :notiseList="notiseList" :videoList="videoList"></login-out>
		</view>
		<!-- 搜索框 → 搜索内容展示 -->
		<view class="search-content u-flex sws-flex-d-column sws-w100" v-show="isSearch">
			<u-cell-group class="u-flex-1" :border="false">
				<u-cell-item :title="item.menuName" v-for="(item, index) in searchList" :key="index" :arrow="true"
					@click="goToApp(item)">
					<u-icon slot="icon" class="u-m-r-20" :name="item.icon" custom-prefix="sws-icon" size="40">
					</u-icon>
				</u-cell-item>
			</u-cell-group>
			<view class="sws-w100 u-m-t-20 u-p-b-20">
				<u-button class="close-search sws-line-h-repair" type="primary" shape="circle"
					@click="isSearch = false">关闭搜索</u-button>
			</view>
		</view>
		<!-- 用户切换 -->
		<u-popup v-model="showUsers" mode="right" width="60%" @close="closePopup">
			<view class="sws-h100 popup-wrap">
				<view class="user-head u-flex u-p-20 u-row-between" @click="showUsers = false">
					<u-icon name="arrow-left" size="44" color="#ffffff" />
					<navigator url="../login/index" hover-class="none">
						<u-icon name="account" custom-prefix="sws-icon" size="46" color="#ffffff"></u-icon>
					</navigator>
				</view>
				<view class="current-user" v-show="userInfo.account">
					<view class="u-flex u-row-center">
						<u-avatar src="../../static/swd/user.png" bg-color="#ffffff"></u-avatar>
					</view>
					<view class="u-text-center sws-font-fff u-m-t-10 u-m-b-8 u-font-32">{{ userInfo.userName }}
					</view>
					<view class="u-text-center sws-font-fff u-font-24">{{ userInfo.account }}</view>
				</view>
				<scroll-view scroll-y="true" class="scroll-wrap"
					:style="userInfo.account ? 'height: calc(100% - 400rpx);' : 'height: calc(100% - 198rpx);'">
					<view>
						<view v-for="(user, index) in userList" :key="index" class="u-flex u-m-b-20 user-info"
							@click="currentUser = user.account">
							<view class="user-image">
								<u-avatar src="../../static/swd/user.png" mode="square"></u-avatar>
							</view>
							<view class="u-flex u-flex-1 u-p-l-20">
								<view class="u-flex-1">
									<view class="sws-font-bold">{{ user.username }}</view>
									<view class="u-font-24">{{ user.account }}</view>
								</view>
								<view>
									<u-radio-group v-model="currentUser">
										<u-radio shape="circle" :name="user.account"></u-radio>
									</u-radio-group>
								</view>
							</view>
						</view>
					</view>
				</scroll-view>
				<view class="btn-group u-flex sws-w100 u-border-top">
					<u-button class="u-flex-1 u-m-r-20 u-font-28" @click="showUsers = false">返回</u-button>
					<u-button class="u-flex-1 u-font-28" type="primary" @click="switchUserConfirm">确认</u-button>
				</view>
			</view>
		</u-popup>
		<!-- 模态框 -->
		<u-modal v-model="showModal" :content="content" :show-cancel-button="showCancelBtn" cancel-text="取消"
			confirm-text="登录" @cancel="cancel" @confirm="goLogin">
		</u-modal>
		<u-modal v-model="showRecord" :content="modalCont"></u-modal>
		<u-top-tips ref="uTips"></u-top-tips>
	</view>
</template>

<script>
	import loginOut from '@/pages/home/loginOut/index'

	import {
		mapState,
		mapMutations
	} from 'vuex'

	export default {
		components: {
			loginOut
		},
		data() {
			return {
				keyword: '', // 搜索内容
				showModal: false,
				content: '应用未登录，请先登录！',
				showCancelBtn: true,
				swiperList: [], //轮播图列表
				isSearch: false, //是否模糊搜索
				searchList: [], //搜索结果
				fileList: [], //文档列表下载
				notiseList: [], //公告列表
				videoList: [], //视频列表
				scrollTop: 0,
				tabClick: false, //双击状态
				modalCont: '',
				showRecord: false,
				userList: [], //切换人员列表
				currentUser: '', //当前选中的人
				showUsers: false,
				popupHeight: 'height: calc(100% - 198rpx);',
				showScan: false,
				quickEntryList: [], //首页快捷入口应用列表
			}
		},
		computed: {
			...mapState(['hasLogin', 'userInfo', 'sysInfo', 'hasNoReadMsg', 'menuApps']),
			navbarH() { //动态计算自定义导航栏高度
				let screenWidth = this.sysInfo.screenWidth
				let pixelRatio = this.sysInfo.pixelRatio
				let h = screenWidth / 375 * 50
				return h > 50 ? h : 50
			}
		},
		watch: {
			keyword: function(newVal, oldVal) { //侦听keyword字段，用于解决input中backspace无法触发change事件
				if (!newVal) {
					this.isSearch = false
				}
			},
			isSearch(newVal) {
				newVal ? uni.hideTabBar() : uni.showTabBar()
			},
			'$store.state.sysInfo': { //设备信息变更，刷新首页权限配置
				handler: function(newVal) {
					this.init()
				},
				deep: true
			},
			'$stroe.state.userInfo': { //登录信息变更，刷新首页查询接口数据
				handler: function() {
					this.refreshHomePage()
				},
				deep: true
			}
		},
		onShow() { //显示主页时保证tabBar正常显示
			uni.showTabBar()
		},
		onLoad() {
			if (this.sysInfo.hardwareAttrList) {
				this.init()
			}

			this.refreshHomePage()
		},
		onReady() {
			uni.showTabBar()
		},
		methods: {
			...mapMutations(['login']),
			init() {
				this.sysInfo.hardwareAttrList.forEach(item => {
					if (item.attrCode === 'S001' && +item.status) {
						this.showScan = true
					}
				})
				// 获取首页快捷入口的应用列表
				this.getQuickEntryList()
			},
			getQuickEntryList() {
				this.quickEntryList = this.sysInfo.appMenuList.filter(item => item.page == 1)
			},
			closePopup() {
				this.showUsers = false
				uni.showTabBar()
			},
			switchUserConfirm() { //切换用户
				this.showUsers = false
				const account = this.currentUser
				this.$u.api.loginIn({
					grant_type: 'vip',
					username: account
				}).then(async res => {
					if (res.msgCode === '000000') {
						this.login({
							userName: res.data.user,
							account: account,
							...res.data
						})
						
						const account = res.data.account
						const cookie =
							`Tdms-Account-${ account }=${ account }; Tdms-User-Token-${ account }=${res.data.access_token}`
						uni.setStorageSync('ugly-auth', cookie)

						this.baseData.getDutyInfo(this, account) //获取登录人员角色、在岗离岗信息
						this.baseData.getBaseUserInfo(this) //获取用户基础登录信息

						uni.reLaunch({ //登录成功，跳转至首页
							url: '/pages/home/index'
						})

					} else {
						this.$refs.uTips.show({
							title: `切换登录失败，原因：${ res.message }`,
							type: 'error',
							duration: '2300'
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			openSwiper(index) {
				let skipUrl = this.swiperList[index].skipUrl
				if (skipUrl) {
					// #ifdef APP-PLUS
					plus.runtime.openWeb(skipUrl) //使用内置webview打开页面
					// #endif

					// #ifdef H5
					window.location.href = skipUrl
					// #endif
				}
			},
			refreshHomePage() { //刷新首页
				this.getSwiperList() //获取轮播图
				this.getNoticeList() //获取公告信息
				// this.getVideoList() //获取视频信息
				if (this.hasLogin) { //已登录状态
					this.getFileList() //登录之后获取登录人员的待学习课程
				} else { //未登录状态
					this.getSopFileList() //获取文档信息
				}
				uni.pageScrollTo({ //返回到页面顶部
					scrollTop: 0,
					duration: 100
				})
			},
			getVideoList() {
				this.$u.api.getFileStudyVideoList().then(res => {
					if (res.msgCode === '000000') {
						this.videoList = res.data
						// this.videoList = [
						// 	'https://www.sunwoda.com/upload/admin/20211126/4929851ae696765f7e08e08f535655fb.mp4',
						// 	'https://www.sunwoda.com/upload/admin/20211126/4929851ae696765f7e08e08f535655fb.mp4'
						// ]
					} else {
						this.$refs.uTips.show({
							title: `视频获取失败，原因：${ res.message }`,
							type: 'error',
							duration: '2300'
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			getFileList() {
				let params = {
					page: 1,
					limit: 2, //每页条数
					common: 1 //查包含通用的
				}
				this.$u.api.getUserFileList(params).then(res => {
					if (res.msgCode === '000000') {
						this.fileList = res.data.data
					} else {
						this.$refs.uTips.show({
							title: `课程列表获取失败，原因：${res.message}`,
							type: 'error',
							duration: '2300'
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			async getSopFileList() { //获取文档列表
				let params = {
					page: 1,
					limit: 2, //首页最多展示6条
				}
				this.$u.api.getSopFileList(params).then(res => {
					if (res.msgCode === '000000') {
						this.fileList = res.data.data
					} else {
						this.$refs.uTips.show({
							title: `课程列表获取失败，原因：${res.message}`,
							type: 'error',
							duration: '2300'
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			getNoticeList() { //获取公告消息，如果登录了，传入工号，否则传空
				let params = {}
				if (this.hasLogin) {
					params.account = this.userInfo.account
				}
				this.$u.api.getNoticeList(params).then(res => {
					if (res.msgCode === '000000') {
						this.notiseList = res.data.slice(0, 5) //首页公告列表最多展示5条信息
					} else {
						this.$refs.uTips.show({
							title: `公告消息获取失败，原因：${res.message}`,
							type: 'error',
							duration: '2300'
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			getSwiperList() { //获取轮播图
				this.$u.api.getSwiperPic().then(res => {
					if (res.msgCode === '000000') {
						this.swiperList = res.data.filter(image => image.isUsed == '1').map(item => {
							return {
								image: item.url ? item.url : '../../static/swd/logo.png',
								...item
							}
						})
					} else {
						this.$refs.uTips.show({
							title: `轮播图下载失败，原因：${res.message}`,
							type: 'error',
							duration: '2300'
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			cancel() { // 关掉模态框显示tabBar
				uni.showTabBar()
			},
			goLogin() { // 跳转至登录页面
				uni.navigateTo({
					url: '/pages/login/index'
				})
			},
			validateLogin() { // 校验登录状态，未登录跳转至登录页面, 登录用户才能进行扫码、搜索等操作
				if (!this.hasLogin) {
					uni.hideTabBar()
					this.content = '应用未登录，请先登录！'
					this.showCancelBtn = true
					this.showModal = true
					return false
				} else {
					return true
				}
			},
			async switchUser() {
				this.$u.api.getUsersForSwitch().then(res => {
					if (res.msgCode === '000000') {
						if (res.data.users && res.data.users.length) {
							this.currentUser = this.userInfo.account //默认选中项为当前登录人
							this.userList = res.data.users.filter(user => !+user.isForeman)
							uni.hideTabBar()
							this.showUsers = true
						} else {
							this.$refs.uTips.show({
								title: '暂无可切换登录的用户',
								type: 'warning',
								duration: '2300'
							})
						}
					} else {
						this.$refs.uTips.show({
							title: `人员列表获取失败，原因：${ res.message }`,
							type: 'error',
							duration: '2300'
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			async scanCode() { //扫描二维码
				this.modalCont = await this.common.scanCode(this)
				this.showRecord = true
				// 联软插件扫码拍照插件调用方法
				// var EMMCameraUtil = uni.requireNativePlugin("EMMCameraUtil")
				// console.log('start---------------触发拍照')
				// EMMCameraUtil.getPhoto({
				// 	"maxNum": 9,
				// 	"type": 1,
				// 	"positionName": "测试水印"
				// }, (data) => {
				// 	console.log('end---------------使用照片')
				// 	console.log('拍照————返回数据：', data.data[0].path)
				// 	// this.testPic = `data:image/jpg;base64,${ data.data[0].base64 }`
				// 	this.testPic = 'file://' + data.data[0].path
				// 	// console.log('arrayBuffer', uni.base64ToArrayBuffer(data.data[0].base64))
				// 	const buffer = uni.base64ToArrayBuffer(data.data[0].base64)
				// 	console.log('arrayBuffer', new Uint8Array(buffer))
				// 	plus.io.resolveLocalFileSystemURL(this.testPic, directoryEntry => {
				// 		console.log('name:', directoryEntry.name)
				// 		console.log(JSON.stringify(directoryEntry))
				// 	})
				// 	plus.io.getImageInfo({
				// 		src: 'file://' + data.data[0].path,
				// 		success: info => {
				// 			console.log('info:', info)
				// 		}
				// 	})
				// })

				// 自定义支付宝扫码插件试用方法
				// let scanModule = uni.requireNativePlugin("ScanModule")
				// scanModule.toScan()
				// var globalEvent = uni.requireNativePlugin('globalEvent');
				// globalEvent.addEventListener('swdScan', function(e) {
				// 	console.log('myEvent' + JSON.stringify(e));
				// })
			},
			change() {
				if (this.validateLogin() && this.keyword) {
					this.getSearchRes() // 获取模糊查询结果
				} else {
					this.isSearch = false
				}
			},
			custom() {
				this.validateLogin() && this.getSearchRes()
			},
			clear() {
				uni.showTabBar()
				this.isSearch = false
			}, //清除输入项
			getSearchRes() { // 搜索内容
				// 使用频次不高且接口限制遗留两个bug
				// bug 1: 没有点击分类页，就没有获取分类页面的应用
				// bug 2：没有增加工具页、设置页
				this.searchList = []
				this.menuApps.forEach(item => {
					item.subMenus.forEach(app => {
						if (this.keyword && app.menuName.includes(this.keyword)) {
							this.searchList.push(app)
						}
					})
				})

				if (this.searchList.length) this.isSearch = true
			},
			goToApp(item) { //跳转到搜索应用
				uni.navigateTo({
					url: item.path
				})
				this.isSearch = false
				this.keyword = ''
			},
			toApp(app) {
				if (app.path.includes('qiehuanyonghu')) { //特殊处理用户切换
					this.switchUser()
					return
				}
				if (this.hasLogin) {
					uni.navigateTo({
						url: app.path
					})
				} else {
					uni.hideTabBar()
					this.content = '应用未登录，请先登录！'
					this.showCancelBtn = true
					this.showModal = true
				}
			},
			goToDeal() { // 如果未登录，跳转至登录页面，如果已登录跳转至消息推送页面
				if (this.hasLogin) {
					uni.navigateTo({
						url: '/pages/msg/index'
					})
				} else {
					this.goLogin()
				}
			}
		},
		onTabItemTap(obj) {
			if (this.showUsers) this.showUsers = false
			switch (obj.index) {
				case 0:
					if (this.tabClick) {
						this.refreshHomePage()
					}
					this.tabClick = true
					setTimeout(() => {
						this.tabClick = false
					}, 300)
					break
			}
		},
		onBackPress() {
			if (this.showModal) {
				this.showModal = false
				setTimeout(() => {
					uni.showTabBar()
				}, 400)
				return true
			} else if (this.showUsers) {
				this.showUsers = false
				return true
			} else if (this.isSearch) {
				this.isSearch = false
				return true
			}
		}
	}
</script>
<style lang="scss" scoped>
	.popup-wrap {

		.user-head {
			background-color: $u-type-primary;
			height: 104rpx;
		}

		.current-user {
			background-color: $u-type-primary;
			height: 202rpx;
			margin-top: -2rpx;
		}

		.scroll-wrap {
			background-color: #ebebeb;

			.user-info {
				background-color: #ffffff;
				align-items: initial;

				.user-image {
					background-color: #00cfa9;
				}
			}
		}

		.btn-group {
			height: 110rpx;
			padding: 0 20rpx;
		}
	}

	.page-wrap {

		.slot-wrap {
			width: 100%;
			height: 100%;
			background-color: #2979ff;
			justify-content: space-between;
		}

		.tab-bg {
			width: 100%;
			height: 220rpx;
			padding: 0 20rpx;
			background: radial-gradient(circle at 50% -170%, #2979ff 88%, #ebebeb 0);

			&-list {
				border-radius: 10rpx;

				.tab-item {

					.item-icon {
						width: 96rpx;
						height: 96rpx;
						line-height: 96rpx;
						text-align: center;
						overflow: hidden;
						color: #ffffff;
						border-radius: 42rpx;
						background: linear-gradient(45deg, #447ee8, #65d1fd);
					}

					.item-font {
						font-size: 28rpx;
						font-weight: bold;
						color: #303133;
					}
				}

				.tab-item:nth-child(2) .item-icon {
					background: linear-gradient(45deg, #1ebb94, #38edca);
				}

				.tab-item:nth-child(3) .item-icon {
					background: linear-gradient(45deg, #fdab2b, #fadc48);
				}

				.tab-item:nth-child(4) .item-icon {
					background: linear-gradient(45deg, #fa6534, #fda967);
				}
			}
		}

		.slot-wrap:before {
			content: '';
			width: 0;
		}

		.slot-wrap:after {
			content: '';
			width: 0;
		}

		.right-item {
			position: relative;
			color: #ffffff;
			display: flex;
		}

	}

	::v-deep .u-navbar-inner .u-slot-content {
		height: 100%;
	}

	::v-deep .popup-wrap .u-size-default {
		height: 70rpx;
		line-height: 70rpx;
	}

	::v-deep .slot-wrap .u-content {
		border-top-right-radius: 0 !important;
		border-bottom-right-radius: 0 !important;
	}

	::v-deep .slot-wrap .u-content::after {
		content: '';
		width: 2rpx;
		height: 40rpx;
		border-left: 2rpx solid rgba(41, 121, 255, .3);
		margin-right: -18rpx;
	}

	.main-wrapper {
		position: relative;
		background-color: #fff;
	}

	.watermarkCans {
		width: 280rpx;
		height: 280rpx;
		position: absolute;
		z-index: -1;
	}

	.search-content {
		min-height: 400rpx;

		.close-search {
			width: 240rpx;
			height: 70rpx;
		}
	}

	.filter-input {
		position: absolute;
		width: 80rpx;
		padding-left: 20rpx;
	}

	::v-deep .search-input .u-content {
		padding-left: 100rpx;
	}
</style>
