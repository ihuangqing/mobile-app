<template>
	<view class="sws-wh100 u-p-20">
		<!-- 人员占比 -->
		<view v-show="showEchart1" @click="echarts.onClick" :prop="bar_option" :change:prop="echarts.updateBarEcharts"
			id="bar_echarts" class="bar-echarts"></view>
		<!-- 岗位签到人数排名前10 -->
		<view class="bar2-echarts-wrap u-m-t-20">
			<view v-if="tabList.length" class="u-p-l-40 u-p-r-40 u-flex u-row-center">
				<u-tabs :list="tabList" class="sws-w100" :is-scroll="true" gutter="20" :current="tabCurrent"
					bar-width="80" @change="changeTab"></u-tabs>
			</view>
			<view v-show="showEchart2" @click="echarts.onClick" :prop="bar2_option"
				:change:prop="echarts.updateBar2Echarts" id="bar2_echarts" class="bar2-echarts"></view>
		</view>
		<u-top-tips ref="uTips"></u-top-tips>
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
				tabCurrent: 0,
				tabList: [],
				showSelect: false,
				bar_option: {},
				bar2_option: {},
				barColorsArr: ['#363be3', '#61a0a8', '#c23531', '#d48265', '#2979ff', '#2f4554', '#19be6b', '#2f4554',
					'#ca8622', '#749f83'
				],
				showEchart1: true,
				showEchart2: true
			}
		},
		computed: mapState(['factoryId', 'factoryName']),
		watch: {
			lineData: {
				handler(newVal, oldVal) {
					if (newVal && newVal.length) {
						//初始化拉线数据
						this.initLineData()
					}
				},
				deep: true
			}
		},
		mounted() {
			this.bar_option = {
				title: {
					text: '工段人员占比',
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
					name: '人数',
					minInterval: 1
				}],
				series: []
			}
			this.bar2_option = {
				title: {
					text: '出勤岗位TOP10',
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
					name: '人数',
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

			//获取各个工段人员占比
			this.getVisualzedInfo()
			this.initLineData()
		},
		methods: {
			get_bar_option_series_template(data, index) {
				return {
					name: data.mesArea,
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
			renderEchart1(staffRatio) {
				let bar_dataSource = []
				let tempLegend = ['mesArea'] //取第一个循环获取legend名称，放在dataset.source中第一个元素
				let series_template = []
				staffRatio[0].staffList.forEach((item, index) => {
					tempLegend.push(item.mesArea)
					series_template.push(this.get_bar_option_series_template(item, index))
				})
				this.bar_option.series = series_template
				bar_dataSource.push(tempLegend)

				staffRatio.forEach(item => { //循环工段获取对应的值放在dataset.source中
					let tempMesArea = []
					tempMesArea.push(item.lineCode)
					item.staffList.forEach(staff => {
						tempMesArea.push(staff.num)
					})
					bar_dataSource.push(tempMesArea)
				})

				this.bar_option.dataset.source = []
				this.bar_option.dataset.source = bar_dataSource
			},
			renderEchart2(attendanceVos) {
				this.bar2_option.yAxis.data = []
				this.bar2_option.series[0].data = []
				attendanceVos.reverse().forEach((item, index) => {
					let YName = item.postName
					this.bar2_option.yAxis.data.push(YName)
					this.bar2_option.series[0].data.push(this.set_bar2_option_data(item.num,
						index))
				})
			},
			getVisualzedInfo() { //获取图表数据
				this.$u.api.getVisualzedInfo(this.factoryId).then(res => {
					if (res.msgCode === '000000') {
						//处理工段人员占比数据
						if (res.data.staffRatio && res.data.staffRatio.length) {
							this.showEchart1 = true
							this.$nextTick(() => {
								this.renderEchart1(res.data.staffRatio)
							})
						} else {
							this.showEchart1 = false
						}
					} else {
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
			getVisualzedAttendances(params) {
				this.$u.api.getVisualzedAttendances(params).then(res => {
					if (res.msgCode === '000000') {
						//处理岗位出勤top10数据
						if (res.data.length) {
							this.showEchart2 = true
							this.$nextTick(() => {
								this.renderEchart2(res.data)
							})
						} else {
							this.showEchart2 = false
						}
					} else {
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
			changeTab(index) {
				this.tabCurrent = index
				const params = {
					lineId: this.tabList[index].lineId,
					factoryId: this.factoryId
				}
				this.bar2_option.title.text = this.tabList[index].name + '出勤岗位TOP10'
				this.getVisualzedAttendances(params) //获取各个拉线岗位出勤率
			},
			initLineData() {
				this.tabList = [] //配合v-if初始化u-tabs,否则下标位置计算不准确
				this.tabCurrent = 0 //默认下标归0
				this.$nextTick(() => { //延时处理，否则上面操作不能及时生效
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
					this.bar2_option.title.text = this.tabList[0].name + '出勤岗位TOP10'

					const params = {
						lineId: this.tabList[0].lineId,
						factoryId: this.factoryId
					}

					this.getVisualzedAttendances(params) //获取各个拉线岗位出勤率
				}, 300)
			},
			onViewClick(options) {}
		},
		onBackPress() {
			if (this.showSelect) {
				this.showSelect = false
				return true
			}
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

			}
		}
	}
</script>

<style lang="scss" scoped>
	.bar-echarts {
		width: 100%;
		height: 400rpx;
		background-color: #fff;
		border-radius: 16rpx;
		box-shadow: 0 0 6rpx 2rpx #ebebeb;
		min-height: 400rpx;
	}

	.bar2-echarts-wrap {
		width: 100%;
		height: calc(100% - 420rpx);
		background-color: #fff;
		border-radius: 16rpx;
		box-shadow: 0 0 6rpx 2rpx #ebebeb;
	}

	.bar2-echarts {
		width: 100%;
		height: 460rpx;
		min-height: 380rpx;
	}
</style>
