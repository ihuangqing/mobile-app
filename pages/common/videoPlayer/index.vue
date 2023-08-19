<template>
	<view class="page-wrap sws-wh100 u-flex">
		<view class="sws-wh100 u-flex">
			<video v-show="showVideo" class="sws-w100" id="myVideo" style="background-color: #ffffff" :loop="loop"
				:src="src" :autoplay="autoplay" controls :style="videoStyle" codec="software" @ended="ended"
				@error="videoErrorCallback"></video>
		</view>
		<u-modal v-model="showModal" content="暂无学习视频" @confirm="modalConfirm"></u-modal>
		<u-top-tips ref="uTips"></u-top-tips>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				curIndex: 0, //当前播放的视频下标
				autoplay: false, //一开始不自动播放
				loop: false,
				src: '',
				list: [],
				showModal: false,
				showVideo: false,
				videoStyle: {
					height: 0,
					with: 0
				}
			}
		},
		onReady: function(res) {
			// #ifndef MP-ALIPAY
			this.videoContext = uni.createVideoContext('myVideo')

			this.wHeight = uni.getSystemInfoSync().windowHeight; //获取手机屏幕高度
			this.wWidth = uni.getSystemInfoSync().windowWidth; //获取手机屏幕宽度

			this.videoStyle.height = this.wHeight + 'px';
			this.videoStyle.width = this.wWidth + 'px';
			// #endif
			this.getFileStudyVideoList()
		},
		methods: {
			getFileStudyVideoList() {
				this.$u.api.getFileStudyVideoList().then(res => {
					if (res.msgCode === '000000') {
						if (res.data.length) {
							this.showVideo = true
							this.list = res.data
							setTimeout(() => {
								this.src = this.list[0]
								this.autoplay = true
								this.curIndex++
							}, 800)
							if (this.list.length === 1) this.loop = true
						} else {
							this.showModal = true
						}
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
			ended() {
				if (this.curIndex > this.list.length - 1) {
					this.curIndex = 0
				}
				console.log('this.currindex:', this.curIndex)
				this.src = this.list[this.curIndex]
				this.autoplay = true
				this.curIndex++
			},
			videoErrorCallback: function(e) {
				if (this.src) {
					uni.showToast({
						title: '播放异常',
						icon: 'none',
						position: 'bottom',
						duration: 2000
					})
				}
			},
			modalConfirm() {
				uni.navigateBack()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page-wrap {
		padding-bottom: 102rpx;
		background-color: #000000;
	}

	.video-style {
		z-index: 999;
	}
</style>
