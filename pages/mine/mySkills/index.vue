<!-- 我的 → 我的技能 -->
<template>
	<view class="page-wrap u-flex">
		<view class="record-list u-flex-1" v-show="!showNoData">
			<view class="order">
				<view class="item u-p-t-20 u-p-b-20 u-p-r-40" v-for="(skill, index) in list" :key="index">
					<view class="left u-flex u-row-center u-font-32">{{ common.serialNumFormatter(index) }}</view>
					<view class="content u-flex-1">
						<view class="title u-flex u-row-between">
							<view>{{ skill.skillName }}</view>
							<view>
								<text class="u-font-24 u-type-info">当前职级：</text>
								<u-icon :name="gradeIcon(skill.grade)" custom-prefix="sws-icon"
									:color="gradeColor(skill.grade)" size="30"></u-icon>
							</view>
						</view>
						<view class="type">
							<view>达标时间：{{ skill.reachTime }}</view>
						</view>
					</view>
				</view>
			</view>
		</view>
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
				showNoData: false
			}
		},
		computed: {
			...mapState(['userInfo']),
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
			this.getSkillList() //获取技能列表
		},
		methods: {
			getSkillList() {
				this.$u.api.getUserSkill(this.userInfo.account).then(res => {
					if (res.msgCode === '000000') {
						this.list = res.data
						if(!this.list.length) this.showNoData = true
					} else {
						this.$refs.uTips.show({
							title: `我的技能获取失败，原因：${res.message}`,
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
	.page-wrap {
		height: 100%;
		width: 100%;
		overflow: hidden;
		flex-direction: column;

		.record-list {
			width: 100%;
			overflow-y: scroll;

			.order {
				width: 100%;
				background-color: #ffffff;
				box-sizing: border-box;
				font-size: 28rpx;

				.item {
					display: flex;
					width: 100%;
					border-top: 1px solid #f5f5f5;

					.left {
						width: 80rpx;
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
				}
			}
		}

	}
</style>
