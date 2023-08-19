<template>
	<view class="sws-wh100">
		<view class="hearder-top">
			<view class="header-wrap u-flex sws-flex-d-column">
				<view class="sws-w100 u-flex u-p-l-40 u-p-r-20 u-m-t-10">
					<view>
						<u-icon name="baogao-book" custom-prefix="sws-icon" size="88" color="#ffffff"></u-icon>
					</view>
					<view class="u-flex-1 u-m-l-20 u-p-r-20">
						<view>
							<text class="u-font-32 sws-font-fff">{{ fileInfo.title }}({{ fileInfo.version }})</text>
						</view>
						<view>
							<text class="u-font-24 sws-font-fff">{{ fileInfo.docCode }}</text>
						</view>
					</view>
				</view>
				<view class="u-flex-1 sws-w100 u-flex u-p-l-40 u-p-r-20">
					<view class="u-flex-1 u-flex sws-font-fff u-font-28">
						<view>
							<view>发布人：</view>
							<view>发布时间：</view>
						</view>
						<view class="u-flex-1">
							<view>{{ fileInfo.publishUsername }}</view>
							<view>{{ fileInfo.publishTime }}</view>
						</view>
					</view>
					<view class="learn-num" v-show="+fileInfo.numberOfStudy">
						<view>
							<text class="u-font-36">{{ fileInfo.numberOfStudy }}</text>
							<text>人</text>
						</view>
						<view>应学习</view>
					</view>
					<view class="learn-num">
						<view>
							<text class="u-font-36">{{ fileInfo.numberOfDone }}</text>
							<text>人</text>
						</view>
						<view>已学习</view>
					</view>
				</view>
				<view class="tab-wrap">
					<view v-for="(tab, tabIndex) in tabList" :key="tabIndex"
						:class="tab.checked ? 'tab-item tab-active' : 'tab-item'" @click="toChangeTab(tab,tabIndex)">
						<u-icon :name="tabIndex ? 'renyuanzhuangtai':'shenqingshiyou'" custom-prefix="sws-icon"
							size="24" :label="tab.name" :color="formatTabStyle(tab, tabIndex)" label-size="24"
							:label-color="formatTabStyle(tab, tabIndex)"></u-icon>
					</view>
				</view>
			</view>
		</view>
		<view class="scroll-wrap">
			<view class="u-p-l-40 u-p-r-40" v-show="current">
				<view class="user-item" v-for="(user, userIndex) in userList" :key="userIndex">
					<view class="user-item-account u-flex">
						<u-icon name="touxiang" custom-prefix="sws-icon" size="38"
							:color="user.account == userInfo.account ? '#19be6b': '#909399'"></u-icon>
						<view class="u-m-l-12"
							:class="user.account == userInfo.account ? 'u-type-success sws-font-bold': 'u-main-color'">
							<text class="u-font-32">{{ user.userName }}</text>
							<text class="u-font-28">({{ user.account }})</text>
						</view>
					</view>
					<view class="user-item-time">
						<text class="u-font-28 u-m-t-8">学习时间：{{ user.creationDate }}</text>
					</view>
				</view>
			</view>
			<view class="file-list" v-show="!current">
				<view class="file-item u-flex" v-for="(file, fileIndex) in fileList" :key="fileIndex">
					<u-icon class="sws-icon sws-icon-other" :class="`sws-icon-${ file.fileExt }`"></u-icon>
					<view class="u-flex-1 u-p-l-20 u-p-r-20">
						<view>{{ file.fileName }}</view>
						<view v-show="file.learnStatus != 2" class="u-m-t-8">
							<u-icon name="jilu" custom-prefix="sws-icon" size="26" color="#606266"
								:label="`预计学习${ file.studyLimitTime }分钟`" label-color="#606266" label-size="26">
							</u-icon>
						</view>
						<view v-show="file.learnStatus == 2" class="u-m-t-8">
							<u-icon name="wenjianyixuexi" custom-prefix="sws-icon" size="26" color="#19be6b" label="已学习"
								label-color="#19be6b" label-size="26"></u-icon>
						</view>
					</view>
					<u-button type="primary" size="mini" class="sws-line-h-repair btn-style" @click="toLearn(file)">
						{{ file.learnStatus == 2 ? '查看' : '学习' }}
					</u-button>
					<view class="file-item-mask" v-show="file.learnStatus == 1">学习中...</view>
				</view>
			</view>
			<view class="count-btn-group" v-show="!current">
				<view class="sws-w100 u-flex count-btn-wrap">
					<view class="u-flex-1 count-item u-flex">
						<view class="u-m-r-8">
							<u-icon name="zongshichang" custom-prefix="sws-icon" color="#ffffff" size="52"></u-icon>
						</view>
						<view class="u-flex sws-flex-d-column u-col-top">
							<u-count-down class="u-flex-1" font-size="36" color="#FFFFFF" :show-border="true"
								border-color="#2979ff" bg-color="#2979ff" separator-size="32" separator-color="#FFFFFF"
								:timestamp="timestamp" @end="end"></u-count-down>
							<view class="count-item-tips">学习倒计时</view>
						</view>
					</view>
					<view class="btn-item" @click="toPostLearnRecord">确认学习</view>
				</view>
			</view>
		</view>
		<u-popup v-model="showUsers" mode="bottom" height="70%">
			<view class="sws-h100">
				<view class="popup-user-head u-flex u-p-20 u-row-center">请选择已学习组员</view>
				<scroll-view scroll-y="true" class="popup-scroll-wrap" style="height: calc(100% - 200rpx);">
					<view>
						<view v-for="(user, index) in teamUserList" :key="index"
							class="u-flex u-m-b-20 popup-user-info">
							<view class="popup-user-image">
								<u-avatar src="../../../../../static/swd/user.png" mode="square"></u-avatar>
							</view>
							<view class="u-flex u-flex-1 u-p-l-20" @click="user.checked = !user.checked">
								<view class="u-flex-1">
									<view class="sws-font-bold">{{ user.userName }}</view>
									<view class="u-font-24">{{ user.account }}</view>
								</view>
							</view>
							<view class="u-flex">
								<u-checkbox v-model="user.checked"></u-checkbox>
							</view>
						</view>
					</view>
				</scroll-view>
				<view class="popup-btn-group u-flex sws-w100 u-border-top">
					<u-button class="u-flex-1 u-m-r-20 u-font-28" @click="showUsers = false">取消</u-button>
					<u-button class="u-flex-1 u-font-28" type="primary" @click="sopConfirmLearn">确认</u-button>
				</view>
			</view>
		</u-popup>
		<u-modal v-model="showAccountModal" :show-title="false" :show-cancel-button="true" confirm-color="#ffffff"
			:confirm-style="{'background': '#2979ff'}" confirm-text="确认学习" @confirm="confirmLearn">
			<view class="u-p-30">
				<u-divider color="#2979ff" half-width="120" border-color="#2979ff">
					<u-icon :name="+fileInfo.type ? 'daixuexi' : 'sop'" custom-prefix="sws-icon" color="#2979ff"
						size="48" :label="+fileInfo.type ? '个人学习确认' : 'SOP学习确认'" label-size="28" label-color="#2979ff"
						label-pos="bottom"></u-icon>
				</u-divider>
				<u-input class="u-m-t-30" type="text" border :placeholder="modalPlaceholder" v-model="inputAccount"
					height="90" input-align="center" placeholder-style="fontSize: 32rpx"
					:custom-style="{'font-size': '36rpx'}" />
			</view>
		</u-modal>
		<u-modal v-model="showModal" :content="modalContent" :show-cancel-button="showCancelBtn"
			:confirm-text="confirmText" @confirm="modalConfirm">
		</u-modal>
		<u-top-tips ref="uTips"></u-top-tips>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'
	export default {
		data() {
			return {
				tabList: [{
					name: '文件列表',
					checked: true
				}],
				current: 0,
				fileInfo: {},
				userList: [],
				fileList: [],
				timestamp: 0, //倒计时时长
				modalContent: '',
				confirmText: '',
				showCancelBtn: false,
				showModal: false,
				modalPlaceholder: '',
				inputAccount: '',
				showAccountModal: false,
				teamUserList: [], //班组人员列表
				showUsers: false,
				isConfirmQuit: false, //是否确定退出
				isConfirmLearn: false, //是否确认学习
			}
		},
		computed: {
			...mapState(['userInfo', 'cacheFileSize']),
			formatTabStyle(tab, tabIndex) {
				return (tab, tabIndex) => {
					if (tab.checked) {
						return tabIndex ? '#01AC8E' : '#6881e2'
					} else {
						return '#ffffff'
					}
				}
			}
		},
		onLoad(options) {
			this.getCacheFileSize() //获取最新的文件缓存大小限制值
			this.fileInfo = {
				...options
			}

			if (!+options.type) { //type '' sop学习  1待学习
				this.tabList.push({
					name: '学习记录',
					checked: false
				})
				this.getFileInfo(options.fileinfoId + '/0')
			} else {
				this.getFileInfo(options.fileinfoId + '/1')
			}
		},
		methods: {
			...mapMutations(['getCacheFileSize']),
			updateFileRecord(params) { //提交学习记录
				this.$u.api.updateFileRecord(params).then(res => {
					if (res.msgCode === '000000') {
						this.isConfirmLearn = true
						this.numberOfDone = res.data //已学习人数
						this.modalContent = '确认学习成功'
						this.showCancelBtn = false
						this.confirmText = '确认'
						this.showModal = true
					} else {
						this.$refs.uTips.show({
							title: `学习记录上传失败，原因：${ res.message }`,
							type: 'error',
							duration: '2300'
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			toShowUsersForSop(account) {
				this.$u.api.getSignOutUsers(account).then(res => {
					if (res.msgCode === '000000') {
						if (res.data && res.data.length) {
							this.teamUserList = res.data.map(user => {
								return {
									...user,
									checked: false
								}
							})
							this.showUsers = true
						} else {
							this.$refs.uTips.show({
								title: '暂无签到的可学习人员',
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
			sopConfirmLearn() { //sop选择学习人员之后学习确认
				this.showUsers = false
				const users = this.teamUserList.filter(user => user.checked).map(user => user.account)
				if (users.length) {
					const params = {
						fileinfoId: this.fileInfo.fileinfoId,
						accounts: users.join(','),
						type: 0
					}
					this.updateFileRecord(params)
				} else {
					this.$refs.uTips.show({
						title: '请选择已学习的组员',
						type: 'warning',
						duration: '2300'
					})
				}
			},
			confirmLearn() { //学习确认   如果是个人学习则弹出工号输入框  如果是sop则显示小组人员列表
				if (this.inputAccount.trim()) {
					if (+this.fileInfo.type) {
						const params = {
							fileinfoId: this.fileInfo.fileinfoId,
							accounts: this.inputAccount,
							type: 1
						}
						this.updateFileRecord(params)
					} else {
						this.toShowUsersForSop(this.inputAccount)
					}
				} else {
					this.$refs.uTips.show({
						title: +this.fileInfo.type ? '请输入个人工号' : '请输入班组长工号',
						type: 'warning',
						duration: '2300'
					})
				}
			},
			toPostLearnRecord() {
				if (this.timestamp) { //如果有学习中文件，则禁止点击
					return
				}

				if (this.fileList.every(file => file.learnStatus == 2)) { //全部是已学习状态才能学习确认
					if (+this.fileInfo.type) { // 1待学习 0 SOP
						this.modalPlaceholder = '请输入个人工号'
					} else {
						this.modalPlaceholder = '请输入班组长工号'
					}
					this.showAccountModal = true
				} else {
					this.modalContent = '请学习完成全部的文件'
					this.showCancelBtn = false
					this.confirmText = '确认'
					this.showModal = true
				}
			},
			end() { // 倒计时结束
				this.currFile.learnStatus = 2 //倒计时结束，当前文件设置已读
				this.timestamp = 0 //倒计时结束，时间归0
			},
			toLearn(file) {
				// #ifdef APP-PLUS
				if (!plus.runtime.isApplicationExist({
						pname: 'cn.wps.moffice_eng'
					})) { //先检查是否安装wps
					this.modalContent = 'WPS Office未安装,请下载安装之后,重新打开学习文件'
					this.confirmText = '下载并安装'
					this.showModal = true
					return
				}
				// #endif
				
				
				if (this.timestamp) { //倒计时未结束，不能查看或者学习其他文件
					this.$refs.uTips.show({
						title: '文件学习中',
						type: 'warning',
						duration: '2300'
					})
					return
				}

				if (file.learnStatus == 2) { //如果已学习则直接打开查看，不用计时
					this.openFile(file)
				} else {
					this.currFile = file
					this.modalContent = `预计需要${ file.studyLimitTime }分钟，是否开始学习？`
					this.showCancelBtn = true
					this.confirmText = '开始学习'
					this.showModal = true
				}
			},
			async openFile(file) { //打开文件
				// #ifdef H5
				console.log('成功打开了文件:', file)
				// #endif

				// #ifdef APP-PLUS
				console.log(' this.cacheFile.Size: ', this.cacheFileSize)

				let size = (file.fileSize / 1024).toFixed(0)
				if (Number(size) > this.cacheFileSize) { // 30M * 1024 = 30720KB 大于30M的文件先检索有没有下载，没有下载就下载
					const fileList = await this.common.getFilesFromDirectory(
						'documents/sopFiles') //获取documents/sopFiles目录所有的文件

					const fileArr = fileList.filter(({
						name,
						filePath
					}) => { //过滤文件，获取缓存的文件
						return name === file.newFileName
					})
					if (fileArr.length) { //如果有缓存直接打开缓存文件
						uni.openDocument({
							filePath: fileArr[0].filePath
						})
					} else { //如果没缓存则下载并缓存文件
						this.needDownload = true
						this.downLoadFiles(file, size)
					}
				} else {
					this.needDownload = false
					this.downLoadFiles(file, size)
				}
				// #endif
			},
			downLoadFiles(file, size) {
				const _self = this
				uni.showLoading({
					title: `文件下载中，大小${ size }KB`
				})
				// 开始下载文件
				uni.downloadFile({
					url: file.url,
					success: res => {
						console.log('文件下载返回：', res)
						if (_self.needDownload) { //缓存文件
							_self.common.copyFileTo(res.tempFilePath, 'documents/sopFiles') //保存文件到本地
						}
						uni.openDocument({
							filePath: res.tempFilePath
						})
					},
					fail: err => {
						_self.$refs.uTips.show({
							title: '文件下载失败',
							type: 'error',
							duration: '2300'
						})
					},
					complete: () => {
						uni.hideLoading()
					}
				})
			},
			modalConfirm() { //下载安装wps
				const text = this.modalContent
				if (text.includes('WPS Office未安装')) {
					this.toInstallWPS()
				} else if (text.includes('开始学习')) {
					this.timestamp = this.currFile.studyLimitTime * 60 //设置倒计时时间
					this.currFile.learnStatus = 1 // 0未学习，1学习中 ，2已学习
					this.openFile(this.currFile)
				} else if (text.includes('确认退出')) {
					this.isConfirmQuit = true
					setTimeout(() => {
						uni.navigateBack()
					}, 300)
				} else if (text.includes('确认学习成功')) {
					const eventChannel = this.getOpenerEventChannel()
					eventChannel.emit('acceptDataFromChildPage', {
						numberOfDone: this.numberOfDone
					})
					uni.navigateBack()
				}
			},
			toInstallWPS() {
				this.common.createDownload('http://dipsftp.sunwoda.com/android/wpsOffice/wpsOffice.apk', () => {})
			},
			getFileInfo(params) { //获取学习文件
				this.$u.api.getFileInfo(params).then(res => {
					if (res.msgCode === '000000') {
						this.fileList = res.data.attachs
						this.userList = res.data.userPoList
					} else {
						this.$refs.uTips.show({
							title: `学习报告获取失败，原因：${ res.message }`,
							type: 'error',
							duration: '2300'
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			toChangeTab(tab, tabIndex) {
				this.current = tabIndex
				if (!tab.checked) {
					this.tabList.forEach(item => item.checked = false)
					tab.checked = true
				}
			}
		},
		onBackPress() {
			if (this.timestamp && !this.isConfirmQuit) { //倒计时未结束，并且未确认退出时，给出提醒，如果确定退出则直接退出
				this.modalContent = '您尚未学习结束，是否确认退出？'
				this.showCancelBtn = true
				this.confirmText = '确认退出'
				this.showModal = true
				return true
			}

			if (this.fileList.every(file => file.learnStatus == 2) && !this.isConfirmLearn) { //如果全部学习完成，并且未确认学习则必须学习确认才能返回（金娥提）
				this.toPostLearnRecord()
				return true
			}
			
			if (this.showModal && this.modalContent.includes('是否开始学习')) {
				this.showModal = false
				return true
			}
		}
	}
</script>

<style lang="scss" scoped>
	.hearder-top {
		position: fixed;
		width: 100%;
		height: 344rpx;
		overflow: hidden;
		background-color: #ffffff;
		z-index: 2;

		.header-wrap {
			height: 344rpx;
			width: 100%;
			background-color: $u-type-primary;

			.learn-num {
				width: 120rpx;
				height: 100rpx;
				border-radius: 24rpx;
				background-color: #6881e2;
				color: #ffffff;
				font-size: 24rpx;
				margin-right: 20rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				flex-direction: column;
			}

			.learn-num:nth-child(odd) {
				background-color: #20d9e6;
			}

		}

		.tab-bar {
			width: 100%;
			height: 88rpx;
			display: flex;
			margin-top: -44rpx;
			justify-content: center;

			&-wrap {
				width: 70%;
				height: 88rpx;
				background-color: #ffffff;
				border-radius: 8rpx;
			}
		}

		.tab-wrap {
			width: 100%;
			height: 56rpx;
			display: flex;
			padding-left: 40rpx;

			.tab-item {
				display: flex;
				justify-content: center;
				height: 56rpx;
				padding: 0 30rpx;
				border-top-left-radius: 16rpx;
				border-top-right-radius: 16rpx;
				background-color: #6881e2;
				color: #ffffff;
				font-size: 24rpx;
				border: 2rpx solid #ffffff;
			}

			.tab-item:nth-child(even) {
				background-color: #01AC8E;
				margin-left: 10rpx;
			}

			.tab-active {
				background-color: #ffffff !important;
			}
		}
	}

	.scroll-wrap {
		width: 100%;
		height: 100%;
		padding-top: 344rpx;

		.file-list {
			padding: 0 40rpx 160rpx 40rpx;

			.file-item {
				position: relative;
				border: 2rpx solid #e8e8e8;
				border-radius: 16rpx;
				box-shadow: 0 0 4rpx #e8e8e8;
				margin-top: 30rpx;
				padding: 20rpx;
				overflow: hidden;

				&-mask {
					position: absolute;
					top: 0;
					left: 0;
					width: 100%;
					height: 100%;
					display: flex;
					justify-content: center;
					align-items: center;
					color: $u-type-success;
					font-size: 32rpx;
					background-color: rgba(0, 0, 0, .5);
					z-index: 3;
				}

				.sws-icon {
					width: 60rpx;
					height: 60rpx;
				}

				.btn-style {
					text-indent: 10rpx;
					letter-spacing: 10rpx;
				}
			}
		}

		.user-item {
			border: 2rpx solid #e8e8e8;
			box-shadow: 0 0 4rpx #e8e8e8;
			margin-top: 30rpx;
			overflow: hidden;

			&-account {
				height: 76rpx;
				padding: 0 20rpx;
			}

			&-time {
				height: 52rpx;
				line-height: 52rpx;
				padding: 0 20rpx;
				color: #ffffff;
				background: linear-gradient(to right, #0083fe, #00fff0);
			}
		}

		.count-btn-group {
			position: fixed;
			left: 0;
			bottom: 0;
			width: 100%;
			height: 150rpx;
			padding: 30rpx 40rpx;
			z-index: 1;
			color: #ffffff;
			background-color: #ffffff;

			.count-btn-wrap {
				box-shadow: 0 0 4rpx 2rpx #e8e8e8;
				border-radius: 46rpx;

				.count-item {
					width: 100%;
					height: 90rpx;
					padding-left: 30rpx;
					background: linear-gradient(-70deg, #20d9e6 40rpx, #2979ff 0);
					border-top-left-radius: 46rpx;
					border-bottom-left-radius: 46rpx;

					&-tips {
						font-size: 24rpx;
						color: rgba(255, 255, 255, .6);
						margin-left: 6rpx;
						height: 36rpx;
					}
				}

				.btn-item {
					width: 180rpx;
					height: 90rpx;
					line-height: 90rpx;
					padding-right: 40rpx;
					font-weight: bold;
					text-align: center;
					background: #20d9e6;
					border-top-right-radius: 46rpx;
					border-bottom-right-radius: 46rpx;
				}
			}

		}
	}

	.popup-user-head {
		height: 80rpx;
		line-height: 80rpx;
		background-color: $u-type-primary;
		color: #ffffff;
	}

	.popup-scroll-wrap {
		background-color: #ebebeb;

		.popup-user-info {
			background-color: #ffffff;
			align-items: initial;

			.popup-user-image {
				background-color: #00cfa9;
			}
		}
	}

	.popup-btn-group {
		padding: 20rpx;
		letter-spacing: 28rpx;
		text-indent: 28rpx;
	}
</style>
