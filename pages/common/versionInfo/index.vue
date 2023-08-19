<template>
	<view class="ver-wrap">
		<view @click.stop="onClick" class="content u-flex sws-flex-d-column">
			<view class="title u-flex u-row-right">
				<view class="sws-font-fff">
					<view>新版本</view>
					<view class="ver-num u-m-t-10 u-font-28" v-show="ver">
						<text>v</text>
						<text>{{ ver }}</text>
					</view>
				</view>
			</view>
			<view class="sws-w100 upgrade-info u-flex-1 u-flex">
				<view class="scroll-Y sws-flex-d-column">
					<view class="u-p-8" v-show="item !== ''" v-for="(item, index) in content" :key="index">
						{{ common.serialNumFormatter(index) }} {{ item }}
					</view>
				</view>
			</view>
			<view class="sws-w100 u-p-28">
				<u-button v-if="showBtn" class="btn-style" type="primary" @click="upgrade">{{ btnText }}</u-button>
				<u-line-progress v-else active-color="#2979ff" :percent="percent" height="60" :striped="true"
					:striped-active="true"></u-line-progress>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				ver: '',
				content: ['功能优化'],
				percent: 0,
				btnText: '立即升级',
				showBtn: true,
				filename: '' //升级文件名
			}
		},
		onLoad() {
			this.getUpgradeInfo() //获取升级版本号和日志
		},
		methods: {
			getUpgradeInfo() {
				this.$u.api.getUpgradeInfo().then(res => {
					if (res.msgCode === '000000') {
						this.ver = res.data.currentVersion
						this.content = res.data.infos.split('\n')
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			upgrade() {
				if (this.btnText.includes('安装新版本')) {
					this.installApp(this.filename)
					return
				}
				this.showBtn = false
				const _self = this
				let apkUrl = 'http://dipsftp.sunwoda.com/android/sws-app-android.apk'
				if (_self.$store.state.baseUrl.includes('msplatform.sunwoda-evb.com')) {
					apkUrl = 'http://dipsftp.sunwoda.com/evbAndroid/sws-app-android.apk'
				}
				var dtask = plus.downloader.createDownload(apkUrl, {}, (d, status) => {
					uni.showToast({
						title: '下载完成',
						mask: false,
						duration: 1000
					})
					// 下载完成
					_self.showBtn = true
					if (status == 200) { //下载成功
						_self.btnText = '安装新版本'
						_self.filename = d.filename
						_self.installApp(d.filename)
					} else { //下载失败
						_self.btnText = '下载失败，请重试'
						uni.showToast({
							title: '更新失败-02',
							mask: false,
							duration: 1500
						})
					}
				})
				try {
					dtask.start() // 开启下载的任务
					_self.percent = 0
					dtask.addEventListener('statechanged', function(task, status) {
						switch (task.state) {
							case 3:
								_self.percent = parseInt((parseFloat(task.downloadedSize) / parseFloat(task
										.totalSize)) *
									100)
								break
						}
					})
				} catch (err) {
					uni.showToast({
						title: '更新失败-03',
						mask: false,
						duration: 1500
					})
				}
			},
			installApp() {
				plus.runtime.install(plus.io.convertLocalFileSystemURL(this.filename), {}, function(success) {
					uni.showToast({
						title: '安装成功',
						mask: false,
						duration: 1500
					})
				}, function(error) {
					uni.showToast({
						title: '安装失败-01',
						mask: false,
						duration: 1500
					})
				})
			}
		},
		onBackPress() {
			return true
		}
	}
</script>

<style lang="scss" scoped>
	page {
		background: transparent;
	}

	.ver-wrap {
		position: fixed;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		justify-content: center;
		align-items: center;
		background-color: rgba(0, 0, 0, 0.4);
	}

	.content {
		width: 70%;
		max-height: 800rpx;
		border-radius: 16rpx;
		background-color: #ffffff;
		overflow: hidden;
	}

	.title {
		width: 100%;
		height: 260rpx;
		background: #2979ff url(../../../static/swd/appupgrade.png) left center no-repeat;
		background-size: 70%;
		font-size: 44rpx;
		padding-right: 30rpx;
	}

	.ver-num {
		padding: 10rpx 20rpx;
		height: 60rpx;
		text-align: center;
		border-radius: 30rpx;
		background-color: rgba(255, 255, 255, .2);
	}

	.upgrade-info {
		padding: 0 28rpx;
		margin-top: 28rpx;
	}

	.btn-style {
		text-indent: 6rpx;
		letter-spacing: 6rpx;
	}

	.scroll-Y {
		display: flex;
		max-height: 376rpx;
		overflow-y: scroll;
	}
</style>
