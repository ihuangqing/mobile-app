<!-- 我的 → 工具 -->
<template>
	<view class="sws-bg-ebebeb">
		<u-cell-group :border="false" title="NFC工具" v-show="toolList.length">
			<u-cell-item hover-class="none" :title="item.menuName" v-for="(item, index) in toolList" :key="index"
				@click="goToApp(item.path)">
				<u-icon slot="icon" class="u-m-r-20" :name="item.icon" custom-prefix="sws-icon" size="36"></u-icon>
			</u-cell-item>
		</u-cell-group>
		<u-top-tips ref="uTips"></u-top-tips>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'

	export default {
		data() {
			return {
				toolList: []
			}
		},
		computed: mapState(['userInfo', 'sysInfo']),
		onLoad() {
			this.getAuthority()
		},
		methods: {
			getAuthority() {
				const params = {
					account: this.userInfo.account,
					module: 3
				}
				this.$u.api.getAuthority(params).then(res => {
					if (res.msgCode === '000000' && res.data) {
						let newArr = []
						const deviceApps = this.sysInfo.appMenuList.filter(item => item.menuName == '工具应用')
						const userApps = res.data.filter(item => item.menuName == '工具应用')
						if (deviceApps.length && userApps.length) {
							deviceApps[0].subMenus.forEach(temp => {
								userApps[0].subMenus.forEach(item => {
									if (temp.menuName == item.menuName) {
										newArr.push(temp)
									}
								})
							})
						}

						this.toolList = [
							...newArr
						]
					} else {
						this.$refs.uTips.show({
							title: `工具列表获取失败，原因：${ res.message }`,
							type: 'error',
							duration: '2300'
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			goToApp(path) { //跳转至工具应用
				uni.navigateTo({
					url: path
				})
			}
		}
	}
</script>

<style>
</style>
