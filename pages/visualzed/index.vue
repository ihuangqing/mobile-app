<template>
	<view class="visualzed-wrap sws-wh100 u-flex sws-flex-d-column">
		<view class="sws-w100 sws-font-bold u-font-40 u-p-20" @click="showSelect = true">
			<u-icon name="grid" :label="currComp.name" size="36" color="#2979ff" label-color="#2979ff"
				class="title-style"></u-icon>
		</view>
		<component :is="currComp.code" :lineData="lineData" class="sws-w100 u-flex-1"></component>
		<u-select v-model="showSelect" :list="compList" @confirm="selectConfirm"></u-select>
		<u-top-tips ref="uTips"></u-top-tips>
	</view>
</template>

<script>
	import swsCharts from '@/pages/visualzed/Sws/index.vue'
	import dipsCharts from '@/pages/visualzed/Dips/index.vue'

	export default {
		components: {
			swsCharts,
			dipsCharts
		},
		data() {
			return {
				currComp: {
					code: '',
					name: ''
				},
				compList: [{
					label: '智慧现场',
					value: 'swsCharts'
				}, {
					label: '设备感知',
					value: 'dipsCharts'
				}],
				lineData: {}, //传递给子组件的值
				showSelect: false
			}
		},
		watch: {
			'$store.state.factoryId': {
				handler: function(newVal, oldVal) {
					if (newVal != oldVal) {
						this.getLinesNotToken()
					}
				}
			}
		},
		onLoad() {
			this.getLinesNotToken()
		},
		methods: {
			getLinesNotToken() {
				const params = {
					state: 1,
					factoryId: this.$store.state.factoryId
				}
				this.$u.api.getLinesNotToken(params).then(res => {
					if (res.msgCode === '000000' && res.data) {
						this.lineData = res.data
						this.getInfoFromStorage()
					} else {
						this.$refs.uTips.show({
							title: `拉线数据获取失败，原因：${ res.message }`,
							type: 'error',
							duration: 2300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			getInfoFromStorage() {
				const comp = uni.getStorageSync('visualzed_comp')
				if (comp) {
					this.currComp = {
						...comp
					}
				} else {
					this.currComp = {
						code: 'swsCharts',
						name: '智慧现场可视化看板'
					}
				}
			},
			selectConfirm(arr) {
				const temp = arr[0]
				this.currComp = {
					code: temp.value,
					name: temp.label + '可视化看板'
				}
				uni.setStorage({
					key: 'visualzed_comp',
					data: this.currComp,
					success: function() {
						console.log('success')
					}
				})
			}
		}
	}
</script>

<script module="echarts" lang="renderjs">

</script>

<style lang="scss" scoped>
	.visualzed-wrap {
		width: 100%;
		background-color: #fff;

		.title-style {
			-webkit-box-reflect: below 0 -webkit-linear-gradient(transparent, transparent 30%, rgba(255, 255, 255, .3));
		}
	}
</style>
