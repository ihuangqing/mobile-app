<!-- dips → 备品备件 → 物料详情	 -->
<template>
	<view class="sws-wh100">
		<u-cell-group :border="false">
			<u-cell-item class="u-p-t-16 u-p-b-16" title="单据号" :value="workTime.docNo" hover-class="none"
				:arrow="false"></u-cell-item>
			<u-cell-item class="u-p-t-16 u-p-b-16" title="工时模块" :value="workTime.moduleType | moduleTypeFilter"
				hover-class="none" :arrow="false"></u-cell-item>
			<u-cell-item v-show="workTime.projectName" class="u-p-t-16 u-p-b-16" title="项目名称"
				:value="workTime.projectName" hover-class="none" :arrow="false"></u-cell-item>
			<u-cell-item class="u-p-t-16 u-p-b-16" title="拉线"
				:value="workTime.lineInfoList.map(line => line.lineName).join('、')" hover-class="none" :arrow="false">
			</u-cell-item>
			<u-cell-item class="u-p-t-16 u-p-b-16" title="工段"
				:value="workTime.lineInfoList.map(line => line.sectionName).join('、')" hover-class="none"
				:arrow="false">
			</u-cell-item>
			<u-cell-item class="u-p-t-16 u-p-b-16" title="采集日期"
				:value="computedDate(workTime.actionDate, workTime.actionEndDate)" hover-class="none" :arrow="false">
			</u-cell-item>
			<u-cell-item class="u-p-t-16 u-p-b-16" title="工时类型" :value="workTime.worktimeType | workTimeTypeFilter"
				hover-class="none" :arrow="false"></u-cell-item>
			<u-cell-item class="u-p-t-16 u-p-b-16" title="影响人员"
				:value="workTime.staffList.map(user => user.userName).join('、')" hover-class="none" :arrow="false">
			</u-cell-item>
			<u-cell-item class="u-p-t-16 u-p-b-16" title="单位工时"
				:value="workTime.timeUnitMinute + (workTime.timeUnitMinute ? '分钟' : '')" hover-class="none" :arrow="false">
			</u-cell-item>
			<u-cell-item class="u-p-t-16 u-p-b-16" title="合计工时"
				:value="workTime.totalMinute + (workTime.totalMinute ? '分钟' : '')" hover-class="none" :arrow="false">
			</u-cell-item>
			<u-cell-item class="u-p-t-16 u-p-b-16" title="责任部门" :value="workTime.responsibleDepart" hover-class="none"
				:arrow="false">
			</u-cell-item>
			<u-cell-item class="u-p-t-16 u-p-b-16" title="申请人" :value="workTime.creatorName" hover-class="none"
				:arrow="false"></u-cell-item>
			<u-cell-item class="u-p-t-16 u-p-b-16" title="工作描述" :value="workTime.description" hover-class="none"
				:arrow="false" :border-bottom="false" :value-style="{'padding-left': '20rpx'}"></u-cell-item>
		</u-cell-group>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				workTime: {
					lineInfoList: [],
					staffList: [],
					timeUnitMinute: '',
					totalMinute: '',
				}
			}
		},
		onLoad() {
			const eventChannel = this.getOpenerEventChannel();
			eventChannel.on('acceptDataFromOpenerPage', data => {
				console.log(data)
				this.workTime = {
					...data
				}
			})
		},
		computed: {
			computedDate(actionDate, actionEndDate) {
				return (actionDate, actionEndDate) => {
					if (actionEndDate) {
						return actionDate + ' ~ ' + actionEndDate
					} else {
						return actionDate
					}
				}
			},
		},
		filters: {
			moduleTypeFilter: type => {
				switch (+type) {
					case 1:
						return '生产异常工时'
						break
					case 2:
						return '外部异常工时'
						break
					case 3:
						return '被动培训工时'
						break
					case 4:
						return '辅助人员工时'
						break
					case 5:
						return '转嫁工时'
						break
				}
			},
			workTimeTypeFilter: type => {
				switch (+type) {
					case 1:
						return '首件'
						break
					case 2:
						return '5S'
						break
					case 3:
						return '设备异常停机维修'
						break
					case 4:
						return 'PM保养'
						break
					case 5:
						return '试验单影响'
						break
					case 6:
						return '品质异常冻结(内部)'
						break
					case 7:
						return '品质异常冻结(供应商)'
						break
					case 8:
						return '设备故障停机（内部）'
						break
					case 9:
						return '设备故障停机（供应商）'
						break
					case 10:
						return '无生产计划'
						break
					case 11:
						return '切线'
						break
					case 12:
						return '待料(内部)'
						break
					case 13:
						return '待料(外部)'
						break
					case 14:
						return '辅助人员工时'
						break
					case 15:
						return '转嫁工时'
						break
				}
			},
		},
	}
</script>

<style>
</style>
