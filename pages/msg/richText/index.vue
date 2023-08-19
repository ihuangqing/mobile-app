<template>
	<view class="sws-wh100 u-p-20">
		<mp-html :content="content" />
	</view>
</template>

<script>
	export default {
		data() {
			return {
				content: ''
			}
		},
		onLoad() {
			const eventChannel = this.getOpenerEventChannel()
			eventChannel.on('acceptDataFromOpenerPage', ({
				data
			}) => {
				uni.setNavigationBarTitle({
					title: data.title
				})

				this.content = data.noticeBody
			})
		}
	}
</script>
