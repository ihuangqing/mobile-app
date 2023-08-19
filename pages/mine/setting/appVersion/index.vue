<!-- 关于 -->
<template>
	<view class="sws-wh100 u-flex sws-flex-d-column">
		<view class="sws-w100 u-flex u-flex-3 sws-flex-d-column u-row-center">
			<h1 class="u-text-center u-type-primary">智慧现场</h1>
			<h4 class="font-italic u-text-center u-p-l-60 u-type-info">移动应用</h4>
			<h4 class="u-text-center u-m-t-30">v{{ version }}</h4>
		</view>
		<view class="sws-w100 u-flex-9">
			<u-card title="升级内容" :border="false" :full="true">
				<view slot="body" class="u-update-content u-font-26">
					<view v-show="item !== ''" v-for="(item, index) in content" :key="index">{{ common.serialNumFormatter(index) }}
						{{ item }}</view>
				</view>
			</u-card>
		</view>
		<u-top-tips ref="uTips"></u-top-tips>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				name: '',
				version: '',
				content: [],
			}
		},
		onReady() {
			this.getUpgradeInfo()
		},
		methods: {
			getUpgradeInfo() {
				this.$u.api.getUpgradeInfo().then(res => {
					if (res.msgCode === '000000') {
						this.version = res.data.currentVersion
						this.content = res.data.infos.split('\n')
					} else {
						this.$refs.uTips.show({
							title: `版本信息获取失败，原因：${ res.message }`,
							type: 'error',
							duration: '2300'
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.font-italic {
		font-style: italic;
	}

	.u-update-content {
		color: $u-content-color;
		line-height: 2;
	}
</style>
