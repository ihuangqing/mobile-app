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
						<u-icon :name="tabIndex ? 'shenqingshiyou':'renyuanzhuangtai'" custom-prefix="sws-icon"
							size="24" :label="tab.name" :color="formatTabStyle(tab, tabIndex)" label-size="24"
							:label-color="formatTabStyle(tab, tabIndex)"></u-icon>
					</view>
				</view>
			</view>
		</view>
		<view class="scroll-wrap">
			<view class="u-p-l-40 u-p-r-40" v-show="!current">
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
			<view class="u-p-l-40 u-p-r-40" v-show="current">
				<view class="file-item u-flex" v-for="(file, fileIndex) in fileList" :key="fileIndex">
					<u-icon class="sws-icon sws-icon-other" :class="`sws-icon-${ file.fileExt }`"></u-icon>
					<view class="u-flex-1 u-p-l-20 u-p-r-20">{{ file.fileName }}</view>
					<u-button type="primary" size="mini" class="btn-style" @click="toOpenFile(file)">查看</u-button>
				</view>
			</view>
		</view>
		<u-modal v-model="showModal" :content="modalContent" :confirm-text="confirmText" @confirm="modalConfirm">
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
					name: '学习记录',
					checked: true
				}, {
					name: '文件列表',
					checked: false
				}],
				current: 0,
				fileInfo: {},
				userList: [],
				fileList: [],
				modalContent: '',
				confirmText: '',
				showModal: false
			}
		},
		computed: {
			...mapState(['userInfo', 'cacheFileSize']),
			formatTabStyle(tab, tabIndex) {
				return (tab, tabIndex) => {
					if (tab.checked) {
						return tabIndex ? '#6881e2' : '#01AC8E'
					} else {
						return '#ffffff'
					}
				}
			}
		},
		onLoad(options) {
			this.getCacheFileSize() //获取最新的文件缓存大小限制值
			this.baseInfo = {
				...options
			}

			this.getFileInfo(options.fileinfoId + '/2')
		},
		methods: {
			...mapMutations(['getCacheFileSize']),
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
			toOpenFile(file) {
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

				this.openFile(file)
			},
			modalConfirm() { //下载安装wps
				const text = this.modalContent
				if (text.includes('WPS Office未安装')) {
					console.log('Office: ')
					this.toInstallWPS()
				} else {

				}
			},
			toInstallWPS() {
				this.common.createDownload('http://dipsftp.sunwoda.com/android/wpsOffice/wpsOffice.apk', () => {})
			},
			getFileInfo(params) { //获取学习文件
				this.$u.api.getFileInfo(params).then(res => {
					if (res.msgCode === '000000') {
						this.fileInfo = res.data
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
		z-index: 1;

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
				height: 56rpx;
				line-height: 56rpx;
				padding: 0 30rpx;
				border-top-left-radius: 16rpx;
				border-top-right-radius: 16rpx;
				background-color: #01AC8E;
				color: #ffffff;
				font-size: 24rpx;
				border: 2rpx solid #ffffff;
			}

			.tab-item:nth-child(even) {
				background-color: #6881e2;
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

		.file-item {
			border: 2rpx solid #e8e8e8;
			border-radius: 16rpx;
			box-shadow: 0 0 4rpx #e8e8e8;
			margin-top: 30rpx;
			padding: 20rpx;

			.sws-icon {
				width: 60rpx;
				height: 60rpx;
			}

			.btn-style {
				text-indent: 10rpx;
				letter-spacing: 10rpx;
				line-height: normal;
			}
		}
	}
</style>
