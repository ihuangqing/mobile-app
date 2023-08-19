<template>
	<view class="sws-wh100 u-p-20">
		<view class="tab-group u-flex u-row-right">
			<view class="tab-group-item u-m-l-20" :class="tab.checked ? 'active': ''"
				v-for="(tab, index) in dateTabList" :key="index" @click="toChangeDate(tab, index)">{{ tab.name }}</view>
		</view>
		<view class="chart-card">
			<view v-show="showEchart1" @click="echarts.onClick" :prop="bar_option"
				:change:prop="echarts.updateBarEcharts" id="bar_echarts" class="chart-bar"></view>
		</view>
		<view class="chart-card" v-show="computedStatus(isCore, showEchart2)">
			<view v-if="isCore" class="u-p-l-40 u-p-r-40 u-flex u-row-center">
				<u-tabs :list="tabList" class="sws-w100" :is-scroll="true" gutter="20" :current="tabCurrent"
					bar-width="80" @change="changeTab"></u-tabs>
			</view>
			<view v-show="showEchart2" @click="echarts.onClick" :prop="bar2_option"
				:change:prop="echarts.updateBar2Echarts" id="bar2_echarts" class="chart-bar"></view>
		</view>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	export default {
		props: ['lineData'],
		data() {
			return {
				curIndex: 0, //默认查询日期为今日
				dateTabList: [{
					name: '今日统计',
					checked: true
				}, {
					name: '本周统计',
					checked: false
				}],
				tabCurrent: 0,
				tabList: [],
				showSelect: false,
				bar_option: {},
				bar2_option: {},
				barColorsArr: ['#363be3', '#61a0a8', '#c23531', '#d48265', '#2979ff', '#2f4554', '#19be6b', '#2f4554',
					'#ca8622', '#749f83'
				],
				showEchart1: true,
				showEchart2: true,
				isCore: true
			}
		},
		computed: {
			...mapState(['factoryId', 'factoryName']),
			computedStatus(isCore, showChart) {
				return (isCore, showChart) => {
					if (isCore) {
						return true
					} else {
						return showChart
					}
				}
			}
		},
		watch: {
			lineData: {
				handler(newVal, oldVal) {
					if (newVal && newVal.length) {
						//初始化拉线数据
						this.initLineData()
					}
				},
				deep: true
			},
			'$store.state.factoryId': {
				handler: function(newVal, oldVal) {
					if (newVal != oldVal) {
						this.isCore = this.factoryName.includes('电芯') ? true : false
						this.$nextTick(() => {
							this.getDataList()
						})
					}
				}
			}
		},
		mounted() {
			this.bar_option = {
				title: {
					text: '巡检、保养计划项与完成项统计',
					top: '10',
					x: 'center',
					y: 'top',
					textAlign: 'left'
				},
				legend: {
					top: '40'
				},
				dataset: {
					source: []
				},
				tooltip: {
					trigger: 'axis',
					axisPointer: {
						type: 'shadow'
					}
				},
				dataZoom: [{
					show: true,
					type: 'inside',
					startValue: 0,
					endValue: 4
				}],
				grid: [{
					bottom: 0
				}, {
					top: 100,
					left: 40,
					right: 20,
					bottom: 50
				}, {
					bottom: '10%'
				}],
				xAxis: [{
					type: 'category',
					gridIndex: 1,
					axisLabel: {
						color: "rgba(95,112,132,1)",
						fontSize: '14',
						interval: 0,
						formatter: function(params) {
							var newParamsName = "" // 最终拼接成的字符串
							var paramsNameNumber = params.length // 实际标签的个数
							var provideNumber = 5; // 每行能显示的字的个数
							var rowNumber = Math.ceil(paramsNameNumber / provideNumber) // 换行的话，需要显示几行，向上取整
							// 判断标签的个数是否大于规定的个数， 如果大于，则进行换行处理 如果不大于，即等于或小于，就返回原标签
							// 条件等同于rowNumber>1
							if (paramsNameNumber > provideNumber) {
								/** 循环每一行,p表示行 */
								for (var p = 0; p < rowNumber; p++) {
									var tempStr = "" // 表示每一次截取的字符串
									var start = p * provideNumber // 开始截取的位置
									var end = start + provideNumber // 结束截取的位置
									// 此处特殊处理最后一行的索引值
									if (p == rowNumber - 1) {
										// 最后一次不换行
										tempStr = params.substring(start, paramsNameNumber)
									} else {
										// 每一次拼接字符串并换行
										tempStr = params.substring(start, end) + "\n"
									}
									newParamsName += tempStr // 最终拼成的字符串
								}

							} else {
								// 将旧标签的值赋给新标签
								newParamsName = params;
							}
							//将最终的字符串返回
							return newParamsName
						}
					}
				}],
				yAxis: [{
					gridIndex: 1,
					name: '',
					minInterval: 1
				}],
				series: []
			}
			this.bar2_option = {
				title: {
					text: '故障数量TOP10',
					top: '10',
					x: 'center',
					y: 'top',
					textAlign: 'left'
				},
				grid: {
					top: '40',
					left: '150',
					right: '60',
					bottom: '40',
				},
				xAxis: {
					type: 'value',
					name: '',
					minInterval: 1
				},
				yAxis: {
					type: 'category',
					data: [],
					axisLabel: {
						align: 'right',
						width: 140,
						overflow: 'break'
					}
				},
				series: [{
					type: 'bar',
					barMaxWidth: '20',
					data: []
				}]
			}
			this.isCore = this.factoryName.includes('电芯') ? true : false
			this.initLineData()
			this.getDataList()
		},
		methods: {
			changeTab(index) {
				this.tabCurrent = index
				this.bar2_option.title.text = this.tabList[index].name + '故障件数TOP10'
				this.queryBoardViewLineGraph(index) //获取各个拉线岗位出勤率
			},
			initLineData() {
				this.tabList = [] //配合v-if初始化u-tabs,否则下标位置计算不准确
				this.tabCurrent = 0 //默认下标归0
				this.$nextTick(() => { //延时处理，否则上面操作不能及时生效
					if (this.isCore) { //如果是电芯组织，则需要获取处理拉线列表
						this.tabList = this.lineData.map(({
							lineCode,
							id
						}) => {
							return {
								name: lineCode,
								lineId: id
							}
						})

						this.tabList.sort((a, b) => a.lineId - b.lineId)
						this.bar2_option.title.text = this.tabList[0].name + '故障件数TOP10'
					} else {
						this.bar2_option.title.text = '故障件数TOP10'
					}

					this.queryBoardViewLineGraph() //获取各个拉线岗位出勤率
				}, 300)
			},
			queryBoardViewLineGraph(lineIndex = 0) {
				let params = {
					factoryId: this.factoryId,
					dataType: this.curIndex ? 2 : 1, // 1 今日统计 2 本周统计,
					type: this.isCore ? 1 : 2, // 1电芯  2 电池
				}

				if (this.isCore) { //如果是电芯则需要传入拉线Id
					params.lineId = this.tabList[lineIndex].lineId
				}

				this.$u.api.queryBoardViewLineGraph(params).then(res => {
					if (res.msgCode === '000000') {
						if (res.data.length) {
							this.showEchart2 = true
							this.$nextTick(() => {
								this.renderEchart2(res.data)
							})
						} else {
							this.showEchart2 = false
						}
					} else {
						this.showEchart2 = false
						this.$refs.uTips.show({
							title: `图表数据获取失败，原因：${ res.message }`,
							type: 'error',
							duration: 2300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			renderEchart2(attendanceVos) {
				this.bar2_option.yAxis.data = []
				this.bar2_option.series[0].data = []
				attendanceVos.reverse().forEach((item, index) => {
					let YName = item.name
					this.bar2_option.yAxis.data.push(YName)
					this.bar2_option.series[0].data.push(this.set_bar2_option_data(item.num,
						index))
				})
			},
			set_bar2_option_data(val, index) {
				return {
					value: val,
					itemStyle: {
						color: this.barColorsArr[index]
					},
					label: {
						show: true,
						position: 'right',
						textStyle: {
							color: '#000'
						}
					}
				}
			},
			toChangeDate(tab, index) {
				if (this.curIndex !== index) {
					this.dateTabList.forEach(item => item.checked = false)
					this.curIndex = index
					tab.checked = true
					this.getDataList() //获取巡检、保养数据
					this.tabCurrent = 0 //默认下标归0
					this.queryBoardViewLineGraph() //获取top10
				}
			},
			getDataList() {
				const params = {
					factoryId: this.factoryId,
					dataType: this.curIndex ? 2 : 1, //1今日统计 2 本周统计
				}
				this.$u.api.queryBoardViewBarGraph(params).then(res => {
					if (res.msgCode === '000000' && res.data) {
						if (res.data.length) {
							this.showEchart1 = true
							this.$nextTick(() => {
								this.renderEchart1(res.data)
							})
						} else {
							this.showEchart1 = false
						}
					} else {
						this.showEchart1 = false
						this.$refs.uTips.show({
							title: `图表数据获取失败，原因：${ res.message }`,
							type: 'error',
							duration: 2300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			renderEchart1(data) {
				let bar_dataSource = []
				let tempLegend = ['busType'] //取第一个循环获取legend名称，放在dataset.source中第一个元素
				let series_template = []
				let maxLen = 0
				data.reduce((pre, curr) => { //计算yList的长度，取最大长度来计算图例
					const currLen = curr.yList.length
					if (currLen > maxLen) {
						maxLen = currLen
						pre = curr
					}
					return pre
				}, []).yList.forEach((item, index) => {
					//（1-巡检计划项，2-巡检完成项，3-保养计划项，4-保养完成项）
					let tempItem = {
						...item
					}
					switch (item.busType) {
						case '1':
							tempItem.busTypeName = '巡检计划项'
							break
						case '2':
							tempItem.busTypeName = '巡检完成项'
							break
						case '3':
							tempItem.busTypeName = '保养计划项'
							break
						case '4':
							tempItem.busTypeName = '保养完成项'
							break
					}
					tempLegend.push(tempItem.busTypeName)
					series_template.push(this.get_bar_option_series_template(tempItem, index))
				})
				series_template.splice(2, 0, {
					name: '',
					type: 'bar',
					barMaxWidth: 40,
					data: []
				})
				this.bar_option.series = series_template
				bar_dataSource.push(tempLegend)
				console.log('bar_dataSource: ', bar_dataSource)

				data.forEach(item => { //循环工段获取对应的值放在dataset.source中
					let tempMesArea = []
					tempMesArea.push(item.xName)
					item.yList.forEach(staff => {
						tempMesArea[staff.busType] = staff.num
					})
					bar_dataSource.push(tempMesArea)
				})

				this.bar_option.dataset.source = []
				this.bar_option.dataset.source = bar_dataSource
				console.log('bar_dataSource: ', bar_dataSource)
			},
			get_bar_option_series_template(data, index) {
				return {
					name: data.busTypeName,
					type: 'bar',
					barGap: 0,
					barMaxWidth: 40,
					label: {
						show: true,
						rotate: 0,
						distance: 15,
						position: 'top',
						align: 'center',
						verticalAlign: 'top',
						formatter: function(res) {
							let data = res.data[index + 1]
							return data ? data : ''
						},
						textStyle: {
							color: '#000'
						}
					},
					emphasis: {
						focus: 'none'
					},
					xAxisIndex: 0,
					yAxisIndex: 0
				}
			},
		}
	}
</script>

<script module="echarts" lang="renderjs">
	import * as echarts from 'static/echarts.min.js'
	export default {
		methods: {
			updateBarEcharts(newValue, oldValue, ownerInstance, instance) {
				if (Object.keys(newValue).length) {
					this.$nextTick(() => {
						const myChart = echarts.init(document.getElementById('bar_echarts'))
						myChart.setOption(newValue)
					})
				}
			},
			updateBar2Echarts(newValue, oldValue, ownerInstance, instance) {
				if (Object.keys(newValue).length) {
					this.$nextTick(() => {
						const myChart = echarts.init(document.getElementById('bar2_echarts'))
						myChart.setOption(newValue)
					})
				}
			},
			onClick(event, ownerInstance) {
				console.log('newValue: ', event)
				// 调用 service 层的方法
				ownerInstance.callMethod('onViewClick', {
					test: 'test'
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.tab-group {
		.title-style {
			-webkit-box-reflect: below -20% -webkit-linear-gradient(transparent, transparent 40%, rgba(255, 255, 255, .3));
			margin-top: -20rpx;
		}

		&-item {
			font-size: 24rpx;
			color: #2979ff;
			padding: 12rpx 30rpx;
			border-radius: 8rpx;
			background-color: #fff;
			box-shadow: 0 0 6rpx 2rpx #ebebeb;
		}

		&-item.active {
			background-color: #2979ff;
			color: #fff;
		}
	}

	.chart-card {
		width: 100%;
		margin-top: 20rpx;
		background-color: #fff;
		border-radius: 16rpx;
		box-shadow: 0 0 6rpx 2rpx #ebebeb;
		min-height: 380rpx;

		.chart-bar {
			width: 100%;
			height: 380rpx;
		}
	}

	::v-deep .u-tabs .u-scroll-box {
		text-align: center;
	}
</style>