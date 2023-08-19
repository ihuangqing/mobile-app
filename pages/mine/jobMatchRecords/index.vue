<!-- 我的 → 岗位匹配记录 -->
<template>
	<view class="sws-wh100 u-flex sws-flex-d-column sws-overflow-hidden sws-bg-ebebeb">
		<view class="job-header sws-w100">
			<view :prop="gauge_option" :change:prop="echarts.updateGaugeEcharts" id="gauge_echarts"
				class="gauge-echarts"></view>
			<view class="progress-wrap u-flex sws-flex-d-column u-row-center">
				<view class="sws-w100 u-flex">
					<view class="u-flex-1 progress-bg u-flex u-row-right">
						<view class="progress-active"
							:style="{width: `${ Math.round(this.okNum/this.totalNum * 10000)/100 }%`}"></view>
					</view>
					<view class="u-flex-1 progress-bg">
						<view class="progress-active"
							:style="{width: `${ Math.round(this.ngNum/this.totalNum * 10000)/100 }%`}"></view>
					</view>
				</view>
				<view class="sws-w100 u-type-primary u-flex u-m-t-10">
					<view class="u-flex-1 u-font-28 u-text-left">
						<text>OK {{ okNum }}</text>
						<text class="u-font-24">次</text>
					</view>
					<view class="u-flex-1 u-font-28 u-text-right">
						<text>NG {{ ngNum }}</text>
						<text class="u-font-24">次</text>
					</view>
				</view>
			</view>
		</view>
		<view class="sws-w100">
			<u-tabs :list="list" :is-scroll="false" :current="current" @change="change"></u-tabs>
		</view>
		<view class="record-list sws-w100 u-flex-1">
			<view class="order" v-show="!showNoData">
				<view class="item" v-for="(item, index) in recordList" :key="index">
					<view class="left u-font-32 u-p-r-20">{{ common.serialNumFormatter(index) }}</view>
					<view class="content u-flex-1">
						<view class="title u-flex u-row-between">
							<view>{{ item.posts.map(post => post.postName).join('、') }}</view>
							<view>
								<text class="u-font-24 u-type-info">上岗时间：</text>
								<text>{{ item.workDate }}</text>
							</view>
						</view>
						<view class="type sws-w100 u-flex u-row-between">
							<view>班组长：{{ item.foremanName }}</view>
							<view>工段：{{ item.mesArea }}</view>
						</view>
					</view>
					<view class="u-flex u-font-38 u-p-l-40 u-p-r-20">
						<u-icon :name="Number(item.isMatch) ? 'OK' : 'NG'" custom-prefix="sws-icon"
							:color="Number(item.isMatch) ? '#00b578' : '#ff6110'" size="42"></u-icon>
					</view>
				</view>
			</view>
			<no-data v-show="showNoData"></no-data>
		</view>
		<u-top-tips ref="uTips"></u-top-tips>
	</view>
</template>

<script>
	import noData from '../../components/noData/index.vue'

	import {
		mapState
	} from 'vuex'

	export default {
		components: {
			noData
		},
		data() {
			return {
				gauge_option: {
					series: [{
						type: 'gauge',
						center: ['50%', '75%'],
						startAngle: 180,
						endAngle: 0,
						min: 0,
						max: 100,
						splitNumber: 5,
						radius: '110%',
						itemStyle: {
							color: '#ffffff'
						},
						progress: {
							show: true,
							width: 25
						},
						pointer: {
							show: false
						},
						axisLine: {
							lineStyle: {
								width: 25
							}
						},
						axisTick: {
							distance: -40,
							splitNumber: 5,
							lineStyle: {
								width: 2,
								color: '#fff'
							}
						},
						splitLine: {
							distance: -45,
							length: 14,
							lineStyle: {
								width: 3,
								color: '#fff'
							}
						},
						axisLabel: {
							distance: -10,
							color: '#fff',
							fontSize: 12
						},
						anchor: {
							show: false
						},
						title: {
							show: true,
							color: '#ffffff',
							fontSize: 12,
							offsetCenter: [0, '-10%']
						},
						detail: {
							valueAnimation: true,
							width: '70%',
							lineHeight: 30,
							borderRadius: 8,
							offsetCenter: [0, '-30%'],
							fontSize: 18,
							fontWeight: 'bolder',
							formatter: '{value}%',
							color: 'auto'
						},
						data: [{
							value: 0,
							name: '岗位匹配率'
						}]
					}]
				},
				okNum: 0,
				ngNum: 0,
				totalNum: 1,
				showNoData: false,
				list: [{
					name: '全部'
				}, {
					name: 'OK'
				}, {
					name: 'NG'
				}],
				current: 0,
				recordList: [], //展示的列表数据
			}
		},
		computed: mapState(['userInfo']),
		onLoad() {
			this.getRecordsList()
		},
		methods: {
			change(index) {
				this.current = index;
				switch (index) {
					case 0:
						this.renderList()
						break
					case 1:
						this.renderList('1')
						break
					case 2:
						this.renderList('0')
						break
				}
			},
			renderList(isMatch) { //过滤数据
				this.recordList = this.resData.filter(item => {
					return !isMatch || item.isMatch == isMatch
				})
				console.log('recordList: ', this.recordList)
			},
			renderCharts() { //渲染echars图表数据
				this.okNum = this.resData.filter(item => item.isMatch == 1).length
				this.ngNum = this.resData.filter(item => item.isMatch == 0).length
				this.gauge_option.series[0].data[0].value = Math.round(this.okNum / this.totalNum * 10000) / 100
			},
			getRecordsList() {
				this.$u.api.getMyPersonPostFit(this.userInfo.account).then(res => {
					if (res.msgCode === '000000' && res.data) {
						this.resData = res.data
						this.totalNum = res.data.length
						this.renderList()
						this.renderCharts()
						if (!this.resData.length) {
							this.showNoData = true
						}
					} else {
						this.$refs.uTips.show({
							title: `人岗匹配记录获取失败，原因：${res.message}`,
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
<script module="echarts" lang="renderjs">
	export default {
		mounted() {
			if (typeof window.echarts === 'function') {
				this.initEcharts()
			} else {
				// 动态引入较大类库避免影响页面展示
				const script = document.createElement('script')
				// view 层的页面运行在 www 根目录，其相对路径相对于 www 计算
				//#ifdef APP-PLUS
				script.src = './static/echarts.js'
				//#endif
				//#ifdef H5
				script.src = '../../../static/echarts.js'
				//#endif
				script.onload = this.initEcharts.bind(this)
				document.head.appendChild(script)

			}
		},
		methods: {
			initEcharts() {
				this.initGaugue_echarts()
			},
			refreshEcharts(data) {},
			initGaugue_echarts() {
				const myChart = echarts.init(document.getElementById('gauge_echarts'))
				myChart.setOption(this.gauge_option)
			},
			updateGaugeEcharts(newValue, oldValue, ownerInstance, instance) {
				if (echarts) {
					const myChart = echarts.init(document.getElementById('gauge_echarts'))
					myChart.setOption(newValue)
				} else {
					setTimeout(() => {
						const myChart = echarts.init(document.getElementById('bar_echarts'))
						myChart.setOption(newValue)
					}, 300)
				}
			},
			onClick(event, ownerInstance) {}
		}
	}
</script>

<style lang="scss" scoped>
	.job-header {
		height: 460rpx;
		background-color: #ebebeb;
		overflow: hidden;

		.gauge-echarts {
			background-color: $u-type-primary;
			width: 100%;
			height: 380rpx;
		}

		.progress-wrap {
			background-color: #ffffff;
			width: 90%;
			height: 120rpx;
			margin: -60rpx auto 0;
			padding: 0 40rpx;
			border-radius: 16rpx;

			.progress-bg {
				width: 100%;
				height: 30rpx;
				background-color: #ececec;
				overflow: hidden;
			}

			.progress-bg:nth-child(1) {
				border-top-left-radius: 30rpx;
				border-bottom-left-radius: 30rpx;

				.progress-active {
					height: 30rpx;
					background-color: $u-type-success;
				}
			}

			.progress-bg:nth-child(2) {
				border-top-right-radius: 30rpx;
				border-bottom-right-radius: 30rpx;

				.progress-active {
					height: 30rpx;
					background-color: $u-type-error;
				}
			}
		}
	}

	.record-list {
		overflow-y: scroll;

		.order {
			width: 100%;
			background-color: #ffffff;
			box-sizing: border-box;
			font-size: 28rpx;

			.item {
				display: flex;
				padding: 20rpx;
				border-top: 1px solid #f5f5f5;

				.left {
					display: flex;
					align-items: center;
				}

				.content {
					.title {
						font-size: 28rpx;
						line-height: 50rpx;
					}

					.type {
						margin: 10rpx 0;
						font-size: 24rpx;
						color: $u-tips-color;
					}

				}

				.col-ok {
					color: $u-type-success;
				}

				.col-ng {
					color: $u-type-error;
				}
			}
		}
	}
</style>
