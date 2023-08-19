<!-- 我的 → 技能提升记录 -->
<template>
	<view class="sws-wh100">
		<u-cell-group :border="false" v-show="!showNoData">
			<u-cell-item class="u-p-0" :border-bottom="false" hover-class="none" :arrow="false">
				<u-collapse hover-class="none" :item-style="itemStyle">
					<u-collapse-item class="u-p-20" v-for="(skill, index) in list" :key="index">
						<view slot="title" class="sws-w100 u-flex">
							<view class="u-m-r-20">
								<text>{{ common.serialNumFormatter(index) }}</text>
								<text>{{ skill.skillName }}</text>
							</view>
							<view class="u-flex-1 u-text-right u-p-r-30">
								<text class="u-font-24 u-type-info">当前职级：</text>
								<u-icon :name="gradeIcon(skill.grade)" custom-prefix="sws-icon"
									:color="gradeColor(skill.grade)" size="30"></u-icon>
							</view>
						</view>
						<view class="u-p-l-40">
							<u-time-line>
								<u-time-line-item nodeTop="2"
									v-for="(item, itemIndex) in formatSkill(skill.skillUpgrades)" :key="itemIndex">
									<template v-slot:node>
										<view :class="formatSkillClass(item)">
											<u-icon :name="gradeIcon(item.grade)" custom-prefix="sws-icon" color="#fff"
												:size="24">
											</u-icon>
										</view>
									</template>
									<template v-slot:content>
										<view>
											<view>
												<text v-show="item.reachTime" class="u-font-24 u-type-info">达成时间：</text>
												<text>{{ item.reachTime ? item.reachTime : item.status }}</text>
											</view>
											<view v-show="item.reachTime">
												<text class="u-font-24 u-type-info">距离下一等级达标时长：</text>
												<text>{{ item.nextTime }}</text>
												<text class="u-font-24 u-type-info">天</text>
											</view>
										</view>
									</template>
								</u-time-line-item>
							</u-time-line>
						</view>
					</u-collapse-item>
				</u-collapse>
			</u-cell-item>
		</u-cell-group>
		<no-data v-show="showNoData"></no-data>
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
				list: [],
				itemStyle: {
					'border-bottom': 'solid 1px #ededed'
				},
				showNoData: false
			}
		},
		computed: {
			...mapState(['userInfo']),
			formatSkill(skillGrades) { //格式化数据格式
				return skillGrades => {
					let status = '已达成'
					skillGrades.forEach((item, index) => {
						item.status = status
						if (Number(item.isCurrent)) {
							status = '未解锁'
						}
					}) //获取当前技能等级，用以判断之前的都是已完成，之后的都是未解锁
					return skillGrades
				}
			},
			formatSkillClass(skillGrade) {
				return skillGrade => {
					if (skillGrade.status == '已达成') {
						if (skillGrade.reachTime) {
							return 'u-node u-node-primary'
						} else {
							return 'u-node u-node-success'
						}
					} else {
						return 'u-node'
					}
				}
			},
			gradeIcon(grade) {
				return grade => {
					switch (grade) {
						case '实习':
							return 'shixi'
							break
						case 'I':
							return 'zimui'
							break
						case 'L':
							return 'zimul'
							break
						case 'U':
							return 'zimuu'
							break
						case 'O':
							return 'zimuo'
							break
					}
				}
			},
			gradeColor(grade) {
				return grade => {
					switch (grade) {
						case '实习':
							return '#82848a'
							break
						case 'I':
							return '#ff9900'
							break
						case 'L':
							return '#19be6b'
							break
						case 'U':
							return '#2979ff'
							break
						case 'O':
							return '#88147f'
							break
					}
				}
			}
		},
		onLoad() {
			this.getSkillEnhaRecords() //获取技能提升数据
		},
		methods: {
			getSkillEnhaRecords() {
				this.$u.api.getUserSkillUpgrade(this.userInfo.account).then(res => {
					if (res.msgCode === '000000') {
						this.list = res.data
						if (!this.list.length) this.showNoData = true
					} else {
						this.$refs.uTips.show({
							title: `技能提升记录获取失败，原因：${res.message}`,
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
	.u-node {
		width: 44rpx;
		height: 44rpx;
		border-radius: 100rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		background: $u-type-info;
	}

	.u-node-success {
		background: $u-type-success;
	}

	.u-node-primary {
		background: $u-type-primary;
	}
</style>
