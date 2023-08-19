<template>
	<view class="sws-wh100 sws-bg-ebebeb">
		<month-component v-if="refresh" class="sws-wh100 u-p-20" :default-calendar="calendar" :staff-account="staffAccount"></month-component>
	</view>
</template>

<script>
	import monthComponent from '../components/userMonthRecord.vue'
	export default {
		components: {
			monthComponent
		},
		data() {
			return {
				calendar: '',
				staffAccount: '',
				refresh: true
			}
		},
		onLoad() {
			const eventChannel = this.getOpenerEventChannel()
			eventChannel.on('acceptDataFromOpenerPage', ({
				calendar,
				account
			}) => {
				this.calendar = calendar
				this.staffAccount = account
				
				this.refresh = false
				this.$nextTick(() => {
					this.refresh = true
				})
			})
		}
	}
</script>

<style>
</style>