<!-- 备品备件 → 帮助文件 -->
<template>
	<view class="sws-wh100">
		<view class="header-top">
			<view class="header-wrap">
				<view class="u-flex fake-nav">
					<u-icon name="back" custom-prefix="sws-icon" size="48" color="#ffffff" class="u-p-l-20 u-p-r-20"
						@click="toBack"></u-icon>
					<view class="u-flex-1 sws-font-fff u-font-32 u-main-color sws-font-bold u-text-center u-p-r-80">
						文档
					</view>
				</view>
				<view class="u-flex u-p-l-20 u-p-r-20 u-p-t-16 u-p-b-16">
					<u-search placeholder="请输入文档名称" shape="square" :action-style="{'color': '#ffffff'}"
						bg-color="#ffffff" border-color="#ffffff" v-model="keyword" @search="searchFile"
						@custom="searchFile">
					</u-search>
				</view>
			</view>
		</view>
		<view class="scroll-wrap">
			<view v-show="!showNoData">
				<view class="list-item" v-for="(course, index) in list" :key="index">
					<view class="list-item-header u-flex">
						<u-icon name="wodekecheng" custom-prefix="sws-icon" size="36" color="#ffffff"></u-icon>
						<view class="u-m-l-16 sws-font-fff u-font-28">{{ `${ course.fileName }(${ course.version })` }}
						</view>
					</view>
					<view class="file-item u-flex" v-for="(file, fileIndex) in course.attachs" :key="fileIndex"
						:class="fileIndex === course.attachs.length - 1 ? '' : 'u-border-bottom'">
						<u-icon class="sws-icon sws-icon-other"
							:class="`sws-icon-${ file.fileName.substring(file.fileName.lastIndexOf('.') + 1) }`">
						</u-icon>
						<view class="u-flex-1 u-p-l-20 u-p-r-20">
							<view>{{ file.fileName }}</view>
						</view>
						<u-button type="success" size="mini" class="sws-line-h-repair btn-style" @click="toRead(file)">
							查看
						</u-button>
					</view>
				</view>
				<u-loadmore :status="loadStatus" bgColor="#ffffff"></u-loadmore>
			</view>
			<no-data v-show="showNoData"></no-data>
		</view>
		<u-top-tips ref="uTips"></u-top-tips>
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
				page: 1,
				limit: 10,
				list: [],
				loadStatus: 'loadmore',
				showNoData: false,
			}
		},
		onLoad() {
			this.toGetDocList()
		},
		methods: {
			toRead(file) { //打开文件
				// #ifdef H5
				console.log('成功打开了文件:', file)
				// #endif

				// #ifdef APP-PLUS
				if (uni.getSystemInfoSync().platform == "android") {
					if (!plus.runtime.isApplicationExist({
							pname: 'cn.wps.moffice_eng'
						})) { //先检查是否安装wps
						this.modalContent = 'WPS Office未安装,请下载安装之后,重新打开学习文件'
						this.confirmText = '下载并安装'
						this.showModal = true
						return
					}
				}
				this.$u.api.getDocFileUrl(file.fileId).then(res => {
					if (res.msgCode === '000000' && res.data) {
						this.downLoadFiles(res.data)
					} else {
						this.$refs.uTips.show({
							title: `文件地址获取失败，原因：${ res.message }`,
							type: 'error',
							duration: '2300'
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
				//#endif
			},
			downLoadFiles(url) {
				const _self = this
				uni.showLoading({
					title: `文件下载中...`
				})
				// 开始下载文件
				uni.downloadFile({
					url,
					success: res => {
						console.log('文件下载返回：', res)
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
			searchFile() {
				if (this.keyword.trim()) {
					this.list = []
					this.page = 1
					this.toGetDocList()
				} else {
					this.$refs.uTips.show({
						title: '请输入文档名称',
						type: 'warning',
						duration: '2300'
					})
				}
			},
			toGetDocList() {
				// this.loadStatus = 'loading'
				let params = {
					query: {
						page: this.page,
						limit: this.limit
					},
					body: {
						fileName: this.keyword
					}
				}
				uni.stopPullDownRefresh() //关闭下拉刷新
				this.$u.api.getDocList(params).then(res => {
					if (res.msgCode === '000000' && res.data.data) {
						this.dataList = [...this.list, ...res.data.data]
						this.list = this.dataList
						this.page++

						if (!res.data.data.length || res.data.data.length < this.limit) this.loadStatus = "nomore"

						if (!this.list.length) {
							this.showNoData = true
						} else {
							this.showNoData = false
						}

					} else {
						this.$refs.uTips.show({
							title: `文档获取失败，原因：${ res.message }`,
							type: 'error',
							duration: '2300'
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			toBack() {
				uni.navigateBack()
			}
		},
		onReachBottom() {
			if (this.loadStatus != 'nomore') { //如果状态无无数据，则不再请求
				this.loadStatus = "loading"
				this.toGetDocList()
			}
		},
		onPullDownRefresh() {
			this.keyword = ''
			this.page = 1
			this.keyword = ''
			this.list = []
			this.loadStatus = 'loadmore'
			this.toGetDocList()
		}
	}
</script>

<style lang="scss" scoped>
	.header-top {
		position: fixed;
		width: 100%;
		height: 200rpx;
		z-index: 3;

		.header-wrap {
			width: 100%;
			height: 100%;
			background: linear-gradient(to left, #2979ff, #65c7f7, #9cecfb);

			.fake-nav {
				height: 102rpx;
				width: 100%;
			}
		}
	}

	.scroll-wrap {
		width: 100%;
		height: 100%;
		padding: 200rpx 30rpx 0 30rpx;

		.list-item {
			border: 2rpx solid #e8e8e8;
			box-shadow: 0 0 4rpx #e8e8e8;
			border-radius: 16rpx;
			overflow: hidden;
			margin-top: 30rpx;

			&-header {
				padding: 16rpx 20rpx;
				background: linear-gradient(to right, #0083fe, #00fff0);
			}
		}

		.file-item {
			box-shadow: 0 0 4rpx #e8e8e8;
			padding: 20rpx;
			overflow: hidden;

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
</style>
