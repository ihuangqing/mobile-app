<template>
	<view class="u-wrap">
		<view class="u-menu-wrap">
			<scroll-view scroll-y scroll-with-animation class="u-tab-view menu-scroll-view" :scroll-into-view="itemId">
				<view v-for="(item, index) in tabbar" :key="index" class="u-tab-item"
					:class="[current == index ? 'u-tab-item-active' : '']" @tap.stop="swichMenu(index)">
					<text class="u-line-1">{{item.menuName}}</text>
				</view>
			</scroll-view>
			<scroll-view :scroll-top="scrollRightTop" scroll-y scroll-with-animation class="right-box" @scroll="rightScroll">
				<view class="page-view">
					<view class="class-item" :id="'item' + index" v-for="(item, index) in tabbar" :key="index">
						<view class="item-title u-border-bottom u-p-b-12">
							<text>{{item.menuName}}</text>
						</view>
						<view class="item-container u-p-b-4">
							<view class="thumb-box" v-for="(item1, index1) in item.subMenus" :key="index1" @click="goToApp(item1)">
								<u-icon class="thumb-box-icon" :name="item1.icon" :color="item1.color" custom-prefix="sws-icon"
									size="66">
								</u-icon>
								<view class="item-menu-name">{{item1.menuName}}</view>
							</view>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
		<u-modal v-model="show" :content="content" :show-cancel-button="showCancelBtn" cancel-text="取消" confirm-text="登录"
			@cancel="cancel" @confirm="goLogin">
		</u-modal>
		<u-modal v-model="showModal" content="菜单权限获取失败,请重试!" :show-cancel-button="true" @cancel="showModal = false"
			@confirm="getAuthority()">
		</u-modal>
		<nfc-read :appPath="appPath" :show="showNFCLogin" @close-popup="closePopup"></nfc-read>
		<u-popup v-model="showSecondMenu" mode="center" length="100%" :mask="false" :mask-close-able="true">
			<view class="sws-wh100 u-flex sws-flex-d-column u-row-center">
				<view class="sws-w100 u-p-40 u-flex u-row-center">
					<view class="menu-card sws-wh100 u-flex sws-flex-d-column" @click="secondToApp(1)">
						<view class="u-flex-1 sws-w100 u-text-center">
							<view class="card-header-text" :style="`color: ${ currMenu.color }`">正</view>
							<u-icon :name="currMenu.icon" custom-prefix="sws-icon" size="160" :color="currMenu.color">
							</u-icon>
						</view>
						<view class="card-footer-text" :style="`background: ${ currMenu.color }`">
							正极{{ currMenu.menuName }}</view>
					</view>
					<view class="u-m-l-40 menu-card sws-wh100 u-flex sws-flex-d-column" @click="secondToApp(2)">
						<view class="u-flex-1 sws-w100 u-text-center">
							<view class="card-header-text">负</view>
							<u-icon :name="currMenu.icon" custom-prefix="sws-icon" size="160" color="#4d0f85">
							</u-icon>
						</view>
						<view class="card-footer-text">负极{{ currMenu.menuName }}</view>
					</view>
				</view>
			</view>
		</u-popup>
		<u-popup v-model="showPmesLogin" mode="center" length="100%" width="80%" height="496rpx" :mask="false"
			:mask-close-able="true" duration="50" border-radius="16" class="popup-pmes-login">
			<view class="sws-wh100 u-flex sws-flex-d-column popup-wrap">
				<u-image class="bg-image" width="200rpx" height="200rpx" :src="`../../static/swd/mesLogin.svg`">
				</u-image>
				<view class="login-top sws-w100 u-flex">
					<text>MES管理系统</text>
				</view>
				<view class="sws-w100 u-flex-1 u-flex sws-flex-d-column">
					<u-cell-group class="login-cell u-flex-1 sws-w100" :border="false">
						<u-cell-item required hover-class="none" :arrow="false" :border-bottom="false" bg-color="#ebeef5">
							<u-icon slot="icon" class="u-m-r-10" name="account1" custom-prefix="sws-icon" size="40"
								color="#82848a"></u-icon>
							<u-input height="60" :custom-style="{'font-size': '18px'}" placeholder-style="font-size: 28rpx"
								placeholder="请输入账号" v-model="lineWareModel.userNo" />
							<u-icon slot="right-icon" name="arrow-down" size="34" color="#c0c4cc" v-show="pmesHistoryUserList.length"
								@click="showHistoryUsers">
							</u-icon>
						</u-cell-item>
						<u-cell-item required hover-class="none" :arrow="false" :border-bottom="false" bg-color="#ebeef5">
							<u-icon slot="icon" class="u-m-r-10" name="Password" custom-prefix="sws-icon" size="40"
								color="#82848a"></u-icon>
							<u-input height="60" :custom-style="{'font-size': '18px'}" placeholder-style="font-size: 28rpx"
								placeholder="请输入密码" type="password" v-model="lineWareModel.pwd" />
						</u-cell-item>
					</u-cell-group>
					<view class="sws-w100 u-flex u-p-30 sws-line-h-repair">
						<u-button :hair-line="false" class="btn-style u-m-r-30" @click="showPmesLogin = false">取消</u-button>
						<u-button :hair-line="false" class="btn-style u-flex-1" @click="toLoginPmes">登录</u-button>
					</view>
				</view>
			</view>
		</u-popup>
		<u-select v-model="showSelect" :list="selectList" :title="selectTitle" @confirm="selectConfirm"></u-select>
		<u-top-tips ref="uTips"></u-top-tips>
	</view>
</template>
<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'

	import nfcRead from '../components/nfcRead/index.vue'

	export default {
		components: {
			nfcRead
		},
		data() {
			return {
				appPath: '', //NFC刷卡跳转模块的地址
				showNFCLogin: false, //是否显示NFC刷卡登录
				oldScrollTop: 0,
				current: 0, // 预设当前项的值 0常用
				itemId: '', // 栏目右边scroll-view用于滚动的id
				arr: [],
				scrollRightTop: 0, // 右边栏目scroll-view的滚动条高度
				timer: null, // 定时器
				show: false,
				tabbar: [],
				unNeedLoginApps: ['SOP学习', '视频播放', '搅拌', '打胶', '单面涂布', '双面涂布', '辊压', '模切', '裁片', '分条', '接触电阻',
					'厚度测试', '线边仓', '月台管理'
				], //不需要登录验证的应用列表
				nfcLoginApps: ['个人签到', '个人签退', '员工离岗', '个人返岗'], //需要NFC刷卡登录的应用
				hasSecondMenuApps: ['搅拌', '打胶', '单面涂布', '双面涂布', '辊压', '模切', '裁片', '分条'], // 拥有二级菜单的应用
				content: '应用未登录，请先登录！',
				showCancelBtn: true,
				showModal: false, //遮罩
				tabClick: false, //双击状态
				currMenu: {}, //当前点击的菜单
				showSecondMenu: false, //二级菜单，主要用于展示pmes中相同应用区分正负极
				lineWareModel: {
					userNo: '',
					pwd: ''
				},
				showPmesLogin: false, //线边仓 pmes登录，设计中集成了上下仓选择，所以随便吧，就写这里了
				selectTitle: '',
				showSelect: false,
				selectList: [],
				pmesHistoryUserList: []
			}
		},
		computed: {
			...mapState(['baseUrl', 'factoryId', 'hasLogin', 'userInfo', 'sysInfo', 'nearestApps']),
		},
		watch: {
			'tabbar': {
				handler: function(newVal) {
					this.$nextTick(() => {
						this.getMenuItemTop()
					})
				},
				deep: true
			},
			'$store.state.hasLogin': { //监听登录状态，如果已登录则，刷新分类页应用列表
				handler: function(newVal) {
					if (newVal) {
						this.getAuthority()
					}
				},
				immediate: true,
				deep: true
			},
			'$store.state.factoryId': { //切换组织之后，需要刷新分类页
				handler: function(newVal) {
					if (newVal && this.hasLogin) {
						this.getAuthority()
					}
				},
				deep: true
			},
			'$store.state.sysInfo': { //监听设备硬件属性，如果有变更，则刷新分类页列表
				handler: function(list) {
					if (list) {
						this.tabbar = [
							...this.sysInfo.appMenuList.filter(item => item.page == 2)
						]
					}
				},
				immediate: true,
				deep: true
			},
			'$store.state.userInfo': { //切换登录之后，需要刷新分类页
				handler: function(newVal) {
					if (this.hasLogin) {
						this.getAuthority()
					}
				},
				deep: true
			}
		},
		onShow() {
			if (this.hasLogin) { //如果登录了，则每次显示获取最新的常用列表
				this.refreshNearest()
			}
		},
		onLoad() {
			const storage = uni.getStorageSync('pmes_login_history')
			this.pmesHistoryUserList = [...storage]
		},
		methods: {
			...mapMutations(['setNearestApps', 'getNearestApps', 'updateMenuApps']),
			showHistoryUsers() {
				this.selectTitle = '请选择登录账号',
					this.selectList = this.pmesHistoryUserList.map(({
						userNo,
						userName
					}) => {
						return {
							label: `${userName}(${userNo})`,
							value: userNo
						}
					})
				this.showSelect = true
			},
			selectConfirm(arr) {
				this.lineWareModel.userNo = arr[0].value
			},
			toLoginPmes() {
				if (!this.lineWareModel.userNo) {
					this.$refs.uTips.show({
						title: '请输入账号',
						type: 'warning',
						duration: 3300
					})
					return
				}

				if (!this.lineWareModel.pwd) {
					this.$refs.uTips.show({
						title: '请输入密码',
						type: 'warning',
						duration: 3300
					})
					return
				}

				const params = {
					userName: this.lineWareModel.userNo,
					passWord: this.lineWareModel.pwd,
					// url: 'http://10.210.86.234:8088/#/login',
				}

				this.$u.api.loginToPmesOfJava(params).then(res => {
					if (res.code === 200) {
						const data = res.map
						if (data.user.status == 3) {
							uni.setStorageSync('pems_login_info', data.user)
							let tempArr = [{
								userNo: data.user.userName,
								userName: data.user.userRealName
							}, ...this.pmesHistoryUserList]
							let hash = {}
							const historyUserList = tempArr.reduce((preVal, curVal) => {
								hash[curVal.userNo] ? '' : (hash[curVal.userNo] = true && preVal.push(curVal))
								return preVal;
							}, [])
							this.pmesHistoryUserList = [...historyUserList]
							uni.setStorageSync('pmes_login_history', this.pmesHistoryUserList)
							this.showPmesLogin = false
							uni.navigateTo({
								url: this.currMenu.path + '?type=' + this.lineWareModel.typeCode,
							})
						} else {
							let msg = '登录异常！'
							switch (data.user.status) {
								case 2:
									msg = '密码过期,请在web端修改后再进行登录！'
									break;
								case 4:
									msg = '密码错误,登录失败！'
									break;
								case 5:
									msg = '离职人员及禁用状态人员账号不可登录系统！'
									break;
							}
							this.$refs.uTips.show({
								title: `登录失败，原因：${ msg }`,
								type: 'error',
								duration: 3300
							})
						}
					} else {
						this.$refs.uTips.show({
							title: `登录失败，原因：${ res.msg }`,
							type: 'error',
							duration: 3300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			refreshNearest() {
				this.getNearestApps() //获取常用应用列表
				let nearestApps = this.nearestApps[this.userInfo.account]
				if (this.tabbar.length && this.tabbar[0].menuName == '常用') {
					this.tabbar[0].subMenus = nearestApps ? nearestApps : []
				}
			},
			getApps() {
				if (!this.hasLogin) {
					// 未登录状态,获取设备支持的模块权限
					this.tabbar = [
						...this.sysInfo.appMenuList.filter(item => item.page == 2)
					]
				} else {
					this.getAuthority()
				}
			},
			getAuthority() {
				const params = {
					account: this.userInfo.account,
					module: 2
				}
				this.$u.api.getAuthority(params).then(res => {
					if (res.msgCode === '000000' && res.data) {
						let newArr = []
						res.data.forEach(temp => {
							this.sysInfo.appMenuList.forEach(item => {
								if (item.page == 2 && (temp.menuName == item.menuName)) { //用户权限和设备权限中的分类一级菜单对比，取匹配项
									const tempArr = {
										...temp
									}
									tempArr.subMenus = []
									item.subMenus.forEach(subItem => { //在submenus中匹配设备权限和用户权限，取交集
										temp.subMenus.forEach(subTemp => {
											if (subTemp.menuName == subItem
												.menuName) {
												tempArr.subMenus.push(subTemp)
											}
										})
									})
									newArr.push(tempArr)
								}
							})
						})

						this.tabbar = [{
								menuName: '常用',
								subMenus: []
							},
							...newArr
						]

						this.updateMenuApps(newArr)

						this.refreshNearest()
					} else {
						this.showModal = true
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			// 点击左边的栏目切换
			async swichMenu(index) {
				if (this.arr.length == 0) {
					await this.getMenuItemTop()
				}
				if (index == this.current) return //点击当前高亮项 不做处理
				this.scrollRightTop = this.oldScrollTop
				this.$nextTick(() => {
					this.scrollRightTop = this.arr[index]
					this.current = index
					this.leftMenuStatus(index)
				})
			},
			// 设置左边菜单的滚动状态
			async leftMenuStatus(index) {
				this.current = index
			},
			// 获取右边菜单每个item到顶部的距离
			getMenuItemTop() {
				new Promise(resolve => {
					this.arr = []
					let selectorQuery = uni.createSelectorQuery();
					selectorQuery.selectAll('.class-item').boundingClientRect((rects) => {
						// 如果节点尚未生成，rects值为[](因为用selectAll，所以返回的是数组)，循环调用执行
						if (!rects.length) {
							setTimeout(() => {
								this.getMenuItemTop()
							}, 10);
							return;
						}
						rects.forEach((rect) => {
							// 这里减去rects[0].top，第一个元素距离顶部有一个上内边距
							this.arr.push(Math.round(rect.top) - rects[0].top)
							resolve()
						})
					}).exec()
				})
			},
			// 右边菜单滚动
			async rightScroll(e) {
				this.oldScrollTop = Math.round(e.detail.scrollTop)
				if (this.arr.length == 0) {
					await this.getMenuItemTop()
				}
				if (this.timer) return

				setTimeout(() => { // 节流
					this.timer = null;
					// scrollHeight为右边菜单垂直中点位置
					let scrollHeight = Math.round(e.detail.scrollTop)
					for (let i = 0; i < this.arr.length; i++) {
						let height1 = this.arr[i]
						let height2 = this.arr[i + 1]
						// 如果不存在height2，意味着数据循环已经到了最后一个，设置左边菜单为最后一项即可
						if (!height2 || scrollHeight >= height1 && scrollHeight < height2) {
							this.leftMenuStatus(i)
							return
						}
					}
				}, 10)
			},
			secondToApp(flag) {
				this.showSecondMenu = false
				uni.navigateTo({
					url: this.currMenu.path + '?type=' + flag,
					success: res => {
						res.eventChannel.emit('acceptDataFromOpenerPage', {
							...this.currMenu
						})
					}
				})
			},
			incomprehensibleInterFace() {
				return new Promise((resolve, reject) => {
					this.$u.api.incomprehensibleInterFace().then(res => {
						if (res.msgCode === '000000' && res.data) {
							resolve(true)
						} else {
							this.$refs.uTips.show({
								title: 'tdms系统登录异常',
								type: 'error',
								duration: '2300'
							})
							resolve(false)
						}
					}).catch(err => {
						resolve(false)
						this.common.sysErrToast(this, err)
					})
				})
			},
			async goToApp(item) { //打开分类应用
				this.currMenu = item

				if (item.path.includes('lineWareHouse')) { //线边仓 → pmes登录，对应的是java开发的pmes服务，其它是.net服务
					this.lineWareModel = {
						userNo: '',
						pwd: ''
					}
					
					uni.removeStorage({
						key: 'pems_login_info'
					})
					
					this.showPmesLogin = true
					return
				}

				// #ifdef APP-PLUS
				if ((this.baseUrl.includes('10.201.88.40') && item.parentId == 15) || (this.baseUrl.includes(
						'msplatform.sunwoda-evb.com') && item.parentId == 8)) { // tdms 两个环境的判断
					const res = await this.incomprehensibleInterFace()
					if (!res) {
						return
					}
				}
				// #endif

				if (this.nfcLoginApps.includes(item.menuName)) { //优先判断是否需要NFC刷卡
					this.appPath = item.path

					let attrCodeArr = this.sysInfo.hardwareAttrList.filter(item => {
						return (item.attrCode === 'S003' || item.attrCode === 'S002') && +item.status
					})
					if (attrCodeArr.length) { //是否配置nfc硬件属性
						uni.hideTabBar()
						this.showNFCLogin = true
						this.setNearestApps(item) //保存到常用应用列表中(登录用户才可以保存)
						this.getMenuItemTop()
					} else {
						this.$u.toast('此设备不支持NFC功能或未配置NFC硬件属性！')
					}
					return
				}
				if (this.hasLogin) {
					if (this.hasSecondMenuApps.includes(item.menuName)) { //判断是否有二级菜单
						this.showSecondMenu = true
						return
					}
					this.setNearestApps(item) //保存到常用应用列表中(登录用户才可以保存)
					this.getMenuItemTop()
					if (item.path) {
						let params = {}
						if (item.menuName === '已学习') {
							params.type = 2
						} else if (item.menuName === '待学习') {
							params.type = 1
						}
						uni.navigateTo({
							url: item.path + this.$u.queryParams(params),
							success(res) {
								res.eventChannel.emit('acceptDataFromOpenerPage', item)
							}
						})
					} else {
						uni.navigateTo({
							url: '/pages/404/index'
						})
					}
				} else if (this.unNeedLoginApps.includes(item.menuName)) { //SOP不验证登录
					if (this.hasSecondMenuApps.includes(item.menuName)) { //判断是否有二级菜单
						this.showSecondMenu = true
						return
					}
					uni.navigateTo({
						url: item.path
					})
				} else {
					uni.hideTabBar()
					this.content = '应用未登录，请先登录！'
					this.showCancelBtn = true
					this.show = true
				}
			},
			cancel() { // 关掉模态框显示tabBar
				uni.showTabBar()
			},
			goLogin() { // 跳转至登录页面
				uni.showTabBar()
				uni.navigateTo({
					url: '/pages/login/index'
				})
			},
			closePopup(isLogin) { //是否登录成功， true登录成功
				this.showNFCLogin = false //关闭弹窗
				uni.showTabBar() //显示tabbar
				if (isLogin) { //如果登录成功需要刷新分类页面权限
					this.getAuthority() //获取应用权限
					this.getNearestApps() //获取常用apps
				}
			}
		},
		onTabItemTap(obj) {
			switch (obj.index) {
				case 1:
					if (this.tabClick) {
						this.getApps()
					}
					this.tabClick = true
					setTimeout(() => {
						this.tabClick = false
					}, 300)
					break
			}
		},
		onBackPress() {
			if (this.show) {
				this.show = false
				setTimeout(() => {
					uni.showTabBar()
				}, 400)
				return true
			} else if (this.showNFCLogin) {
				this.showNFCLogin = false
				setTimeout(() => {
					uni.showTabBar()
				}, 400)
				return true
			} else if (this.showSecondMenu) {
				this.showSecondMenu = false
				return true
			}
		}
	}
</script>

<style lang="scss" scoped>
	.u-wrap {
		height: calc(100vh - var(--window-bottom));
		display: flex;
		flex-direction: column;
	}

	.u-menu-wrap {
		flex: 1;
		display: flex;
		overflow: hidden;
	}

	.u-tab-view {
		width: 200rpx;
		height: 100%;
	}

	.u-tab-item {
		height: 110rpx;
		background: #FFFFFF;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 26rpx;
		color: #444;
		font-weight: 400;
		line-height: 1;
	}

	.u-tab-item-active {
		position: relative;
		color: #fff;
		font-size: 26rpx;
		font-weight: bold;
		background: $u-type-primary;
	}

	.u-tab-item-active::before {
		content: "";
		position: absolute;
		border-left: 3px solid $u-type-primary;
		height: 110rpx;
		left: 0;
		top: 0;
	}

	.u-tab-view {
		height: 100%;
	}

	.right-box {
		background-color: #ebebeb;
	}

	.page-view {
		padding: 0 16rpx 16rpx 16rpx
	}

	.class-item {
		margin-top: 16rpx;
		background-color: #fff;
		padding: 16rpx;
		border-radius: 8rpx;
	}

	.class-item:last-child {
		min-height: calc(100vh - 12px);
		padding-bottom: 0;
		margin-bottom: 0;
	}

	.item-title {
		font-size: 26rpx;
		color: $u-main-color;
		font-weight: bold;
	}

	.thumb-box-icon {
		padding: 12rpx 0;
	}

	.item-menu-name {
		font-weight: normal;
		font-size: 24rpx;
		color: $u-main-color;
	}

	.item-container {
		display: flex;
		flex-wrap: wrap;
	}

	.thumb-box {
		width: 33.333333%;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		margin-top: 20rpx;
	}

	.item-menu-image {
		width: 120rpx;
		height: 120rpx;
	}

	.menu-card {
		width: 240rpx;
		height: 320rpx;
		border-radius: 16rpx;
		background-color: #fff;
		overflow: hidden;
		box-shadow: 0 0 4rpx 2rpx #ebebeb;

		.card-footer-text {
			padding-top: 16rpx;
			padding-bottom: 16rpx;
			width: 100%;
			text-align: center;
			background-color: #00b578;
			color: #fff;
		}

		.card-header-text {
			font-size: 32rpx;
			padding: 16rpx 20rpx;
			color: #00b578;
			text-align: right;
		}
	}

	.menu-card:last-child .card-footer-text {
		background-color: #4d0f85;
	}

	.menu-card:last-child .card-header-text {
		color: #4d0f85;
	}

	::v-deep .u-drawer .u-mode-center-box {
		background-color: transparent !important;
	}


	.popup-pmes-login {
		.popup-wrap {
			background-color: $u-type-primary;
			position: relative;
		}

		.login-top {
			height: 120rpx;
			align-items: center;
			justify-content: center;
			font-weight: bold;
			color: #fff;
			font-size: 36rpx;
			z-index: 3;
		}

		.btn-style {
			height: 80rpx;
			text-indent: 20rpx;
			letter-spacing: 20rpx;
			border-radius: 40rpx;
			font-size: 28rpx;
		}

		.bg-image {
			position: absolute;
			opacity: .4 !important;
			top: 10rpx;
			left: 30rpx;
		}

		.login-cell {
			padding: 0 30rpx;
		}

		.login-tips {
			z-index: 10975 !important;
		}
	}

	::v-deep .popup-pmes-login .login-cell .u-cell-item-box {
		width: 100%;
		background-color: transparent;

		.u-cell {
			border-radius: 60rpx;
			overflow: hidden;
			margin-top: 20rpx;
			padding: 10rpx 30rpx;
		}
	}
</style>