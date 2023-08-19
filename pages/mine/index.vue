<template>
	<view class="page-wrap">
		<view class="user-center u-flex" :class="(dutyInfo.lineName && +dutyInfo.isSignIn) ? '': 'unSign'">
			<view v-if="hasLogin" class="u-rela sws-h100 u-flex-1 u-p-t-20 u-p-l-40">
				<view class="u-flex u-m-t-16">
					<u-avatar :src="avatar" bg-color="#ffffff" :show-level="true" size="large" level-icon=""
						:level-bg-color="computedStatus(dutyInfo)" @click="toPreview">
					</u-avatar>
					<view class="u-flex-1 u-flex" @click="goToUserInfo">
						<view class="u-p-l-30 sws-font-fff u-flex-1">
							<view class="u-font-40 u-p-l-16">
								<text>{{ userInfo.userName }}</text>
								<text class="u-font-28">（{{ userInfo.account }}）</text>
							</view>
							<view class="u-m-t-4 factory-info">
								<text class="u-m-l-4 u-font-26">{{ $store.state.factoryName }}</text>
							</view>
						</view>
						<view class="u-p-l-20 u-p-r-40">
							<u-icon name="arrow-right" color="#ffffff" size="30"></u-icon>
						</view>
					</view>
				</view>
				<view v-show="dutyInfo.lineName && +dutyInfo.isSignIn" class="sign-info u-m-t-20 u-m-r-40 sws-font-fff"
					@click="toShowSignInfo">
					<u-row>
						<u-col span="4">
							<view class="u-text-center u-font-28 u-line-1">{{ dutyInfo.lineName }}</view>
							<view class="u-font-24 u-text-center u-m-t-12">
								<u-icon name="laxian" custom-prefix="sws-icon" size="24" color="#ffffff"></u-icon>
								<text class="u-m-l-8">拉线</text>
							</view>
						</u-col>
						<u-col span="4">
							<view class="u-text-center u-font-28 u-line-1">{{ dutyInfo.mesArea }}</view>
							<view class="u-font-24 u-text-center u-m-t-12">
								<u-icon name="gongduan" custom-prefix="sws-icon" size="24" color="#ffffff"></u-icon>
								<text class="u-m-l-8">工段</text>
							</view>
						</u-col>
						<u-col span="4">
							<view class="u-text-center u-font-28 u-line-1">
								{{ dutyInfo.posts && dutyInfo.posts.map(post => post.postName).join('、') }}
							</view>
							<view class="u-font-24 u-text-center u-m-t-12">
								<u-icon name="gongxu" custom-prefix="sws-icon" size="24" color="#ffffff"></u-icon>
								<text class="u-m-l-8">岗位</text>
							</view>
						</u-col>
					</u-row>
				</view>
			</view>
			<view v-else class="u-p-l-50 sws-font-fff u-flex-1">
				<navigator url="/pages/login/index" hover-class="none">
					<h1>个人中心</h1>
					<h3 class="u-p-l-10 u-m-t-10">登录</h3>
				</navigator>
			</view>
		</view>
		<u-popup v-model="showSignInfo" mode="center" width="80%" class="sign-popup" @close="toCloseSignInfo">
			<view class="u-type-primary-bg sws-font-fff u-p-20 u-text-center u-font-32">签到信息</view>
			<u-cell-group>
				<u-cell-item :arrow="false" hover-class="none"
					:value-style="{'padding-left': '30rpx', 'overflow-wrap': 'break-word'}" title="拉线"
					:value="dutyInfo.lineName">
					<u-icon slot="icon" class="u-m-r-20" name="laxian" custom-prefix="sws-icon" size="32"></u-icon>
				</u-cell-item>
				<u-cell-item :arrow="false" hover-class="none"
					:value-style="{'padding-left': '30rpx', 'overflow-wrap': 'break-word'}" title="工段"
					:value="dutyInfo.mesArea">
					<u-icon slot="icon" class="u-m-r-20" name="gongduan" custom-prefix="sws-icon" size="32">
					</u-icon>
				</u-cell-item>
				<u-cell-item :arrow="false" hover-class="none"
					:value-style="{'padding-left': '30rpx', 'overflow-wrap': 'break-word'}" arrow-direction="right"
					title="岗位" :value="dutyInfo.posts && dutyInfo.posts.map(post => post.postName).join('、')">
					<u-icon slot="icon" class="u-m-r-20" name="gongxu" custom-prefix="sws-icon" size="32"></u-icon>
				</u-cell-item>
			</u-cell-group>
		</u-popup>
		<view class="user-box u-flex u-row-around">
			<view class="user-box-item u-flex sws-flex-d-column" v-for="(item,index) in baseList" :key="index"
				@click="goToApp(item.path)">
				<view class="item-icon">
					<u-icon :name="item.icon" custom-prefix="sws-icon" size="62"></u-icon>
				</view>
				<view class="u-m-t-10">{{item.name}}</view>
			</view>
		</view>
		<scroll-view scroll-y="true" class="scroll-Y u-m-t-20"
			:class="(dutyInfo.lineName && +dutyInfo.isSignIn) ? '': 'unSign'">
			<view class="flex">
				<view>
					<u-cell-group :border="false">
						<u-cell-item hover-class="none" :title="item.name" v-for="(item, index) in extraList"
							:key="index" :value="specialVal(item.name).value"
							:value-style="{color: specialVal(item.name).color}" @click="goToApp(item.path)">
							<u-icon slot="icon" class="u-m-r-20" :name="item.icon" custom-prefix="sws-icon" size="36">
							</u-icon>
						</u-cell-item>
					</u-cell-group>
				</view>
				<u-gap v-show="hasLogin" height="16" bg-color="#ebebeb"></u-gap>
				<view v-show="hasLogin">
					<u-cell-group :border="false">
						<u-cell-item hover-class="none" title="工具" @click="goToTools">
							<u-icon slot="icon" class="u-m-r-20" name="tools" custom-prefix="sws-icon" size="36">
							</u-icon>
						</u-cell-item>
						<u-cell-item hover-class="none" title="设置" @click="goToSetting">
							<u-icon slot="icon" class="u-m-r-20" name="shezhi" custom-prefix="sws-icon" size="36">
							</u-icon>
						</u-cell-item>
					</u-cell-group>
				</view>
				<u-gap v-show="hasLogin" height="16" bg-color="#ebebeb"></u-gap>
				<view v-show="hasLogin">
					<u-cell-group :border="false">
						<u-cell-item hover-class="none" title="退出登录" :arrow="false" @click="loginOut">
							<u-icon slot="icon" class="u-m-r-20" name="dengchu" custom-prefix="sws-icon" size="36">
							</u-icon>
						</u-cell-item>
					</u-cell-group>
				</view>
			</view>
		</scroll-view>
		<u-select v-model="show" :list="list" @confirm="confirm"></u-select>
		<u-modal v-model="showModal" content="是否确定退出登录?" :show-cancel-button="true" @cancel="cancel"
			@confirm="modalConfirm"></u-modal>
		<u-modal v-model="showLogin" content="应用未登录，请先登录！" :show-cancel-button="true" cancel-text="取消" confirm-text="登录"
			@cancel="cancel" @confirm="goLogin"></u-modal>
		<u-top-tips ref="uTips"></u-top-tips>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'

	import appsDB from '@/static/appsDB.js'

	export default {
		data() {
			return {
				language: 'zh',
				factoryId: 14, //默认南京工厂
				show: false,
				avatar: '',
				list: [],
				showModal: false,
				baseList: appsDB.mineBase, //基础应用列表
				extraList: appsDB.mineExtra, //扩展应用列表
				showDuty: false, //显示在岗离岗状态
				dutySrc: '', //在岗离岗图片
				showLogin: false, //显示登录验证弹窗
				showSignInfo: false, //签到信息
				continueDays: 0, //连续工作时长
			}
		},
		computed: {
			...mapState(['hasLogin', 'userInfo', 'factoryName', 'dutyInfo']), //获取登录状态，用于判断退出账号按钮是否显示
			computedStatus(dutyInfo) {
				return dutyInfo => {
					if (Number(dutyInfo.postState)) {
						return '#19be6b'
					} else {
						if (Number(dutyInfo.isSignIn)) {
							return '#ff9900'
						} else {
							return '#fa3534'
						}
					}
				}
			},
			specialVal(name) {
				return name => {
					if (name && name.includes('工作时长') && this.continueDays) {
						switch (this.continueDays) {
							case 7:
								return {
									value: '已连续工作7天',
										color: '#ff9900'
								}
								break;
							case 14:
								return {
									value: '已连续工作14天',
										color: '#fa3534'
								}
								break;
						}
					} else {
						return {
							value: '',
							color: ''
						}
					}
				}
			}
		},
		watch: {
			'$store.state.userInfo': { //登录信息改变，刷新我的页面的初始化数据
				handler: function(newVal, oldVal) {
					this.avatar = this.userInfo.avatar
					this.getContinuousWork() //获取连续工作时长
				},
				deep: true
			}
		},
		onLoad() {
			if (this.hasLogin) {
				this.avatar = this.userInfo.avatar
				this.getContinuousWork() //获取连续工作时长
			}
		},
		onShow() {
			if (this.hasLogin) { //每次页面显示都刷新在岗状态
				this.baseData.getDutyInfo(this, this.userInfo.account)
			}
		},
		methods: {
			...mapMutations(['logout', 'updateHeader']),
			toPreview() { //预览头像
				uni.previewImage({
					urls: [this.avatar]
				})
			},
			getContinuousWork() {
				this.$u.api.getContinuousWork(this.userInfo.account).then(res => {
					if (res.msgCode === '000000' && res.data) {
						switch (res.data) { // 0未连续工作  1 连续工作7天 2 连续工作14天
							case '0':
								this.continueDays = 0
								break;
							case '1':
								this.continueDays = 7
								break;
							case '2':
								this.continueDays = 14
								break;
						}
					} else {
						console.log('连续工作时长获取失败！')
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			toCloseSignInfo() {
				uni.showTabBar()
			},
			toShowSignInfo() {
				this.showSignInfo = true
				uni.hideTabBar()
			},
			loginOut() { //退出账号
				this.showModal = true
				uni.hideTabBar()
			},
			modalConfirm() { //确定退出登录，并跳转至首页
				this.logout() //修改登出状态
				uni.reLaunch({
					url: '/pages/home/index'
				})
			},
			changeFactory() { //切换厂区
				this.show = true
			},
			confirm(res) { //选择厂区console.log(res)
				this.factoryName = res[0].label
				this.updateHeader({
					language: this.language,
					factoryId: res[0].value
				})
			},
			goToSetting() { //跳转至设置页面
				uni.navigateTo({
					url: '/pages/mine/setting/index'
				})
			},
			goToTools() { //跳转至工具页面
				uni.navigateTo({
					url: '/pages/mine/tools/index'
				})
			},
			goToUserInfo() { // 跳转至个人信息页面
				uni.navigateTo({
					url: '/pages/mine/userInfo/index'
				})
			},
			goToApp(path) {
				if (this.hasLogin) {
					let url = path
					if (url.includes('/pages/mine/workHours/index')) {
						url += this.$u.queryParams({
							days: this.continueDays
						})
					}
					uni.navigateTo({
						url: url
					})
				} else {
					uni.hideTabBar()
					this.showLogin = true
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
			}
		},
		onBackPress() {
			if (this.showModal) {
				this.showModal = false
				setTimeout(() => {
					uni.showTabBar()
				}, 400)
				return true
			} else if (this.showLogin) {
				this.showLogin = false
				setTimeout(() => {
					uni.showTabBar()
				}, 400)
				return true
			} else if (this.showSignInfo) {
				this.showSignInfo = false
				return true
			}
		}
	}
</script>

<style lang="scss" scoped>
	.user-center {
		background-color: #2979ff;
		height: 430rpx;
		padding-top: 20rpx;
		padding-bottom: 80rpx;

		.factory-info {
			padding: 0 16rpx;
			border-radius: 6rpx;
			height: 54rpx;
			line-height: 52rpx;
		}

		.sign-info {
			background-color: rgba(255, 255, 255, .2);
			padding: 20rpx;
			border-radius: 20rpx;
		}
	}

	.user-center.unSign {
		height: 300rpx;
	}

	.page-wrap {
		width: 100%;
		height: 100%;

		.user-box {
			margin-top: -80rpx;
			padding: 0 30rpx;

			&-item {
				padding: 26rpx 36rpx;
				border-radius: 12rpx;
				box-shadow: 2rpx 6rpx 10rpx #ebebeb;
				background-color: #ffffff;
			}

			.item-icon {
				color: #ffffff;
				border-radius: 100%;
				padding: 10rpx;
			}

			&-item:nth-child(1)>.item-icon {
				background-color: #13a88a;
			}

			&-item:nth-child(2)>.item-icon {
				background-color: #9660ff;
			}

			&-item:nth-child(3)>.item-icon {
				background-color: #eaa035;
			}
		}

		.user-info {
			position: absolute;
			right: 0;
			bottom: 30rpx;
			height: 60rpx;
			line-height: 60rpx;
			padding-left: 30rpx;
			padding-right: 20rpx;
			border-top-left-radius: 30rpx;
			border-bottom-left-radius: 30rpx;
			color: #ffffff;
			background-color: rgba(255, 255, 255, .2);
		}
	}

	.scroll-Y {
		height: calc(100% - 571rpx);
		box-shadow: 0 -8rpx 10rpx #ebebeb;
	}

	.scroll-Y.unSign {
		height: calc(100% - 481rpx);
	}

	::v-deep .sign-popup .u-mode-center-box {
		border-radius: 16rpx;
		overflow: hidden;
		background-color: $u-type-primary;
	}
</style>
