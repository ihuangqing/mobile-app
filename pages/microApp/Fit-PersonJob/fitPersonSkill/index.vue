<!-- 人岗匹配 -->
<template>
	<view class="page-wrap u-flex">
		<view class="content-item u-rela sws-w100" v-for="(item, index) in list" :key="index">
			<view class="sws-w100">
				<view class="title-tag u-text-center">
					<text class="u-font-32">{{ item.userName }}</text>
					<text class="u-font-28">({{ item.account }})</text>
				</view>
			</view>
			<view class="compare-content">
				<view class="user-skill">
					<view class="u-p-16 u-p-l-20 sws-font-bold">个人技能</view>
					<view class="u-p-l-30 u-p-b-40 u-p-r-60">
						<view class="u-flex item-line-h" v-for="(skill, skillIndex) in item.skills" :key="skillIndex">
							<u-icon name="dot" custom-prefix="sws-icon" size="42"></u-icon>
							<text class="u-m-r-10">{{ skill.skillName }}</text>
							<u-icon :name="gradeIcon(skill.grade)" custom-prefix="sws-icon"
								:color="gradeColor(skill.grade)" size="30"></u-icon>
						</view>
					</view>
				</view>
				<view class="user-post u-flex sws-flex-d-column">
					<view class="sws-w100 u-p-16 u-p-r-20 sws-font-bold u-text-right">签到岗位</view>
					<view class="sws-w100 u-flex-1 u-flex u-p-l-80 u-p-b-40 u-p-r-40 u-row-center sws-flex-d-column">
						<view class="item-line-h" v-for="(post, postIndex) in item.posts" :key="postIndex">
							<text>{{ post.postName }}</text>
						</view>
					</view>
				</view>
			</view>
			<view class="compare-res u-abso u-flex u-row-center">
				<u-icon :name="Number(item.isMatch) ? 'OK' : 'NG' " custom-prefix="sws-icon"
					:color="Number(item.isMatch) ? '#00b578' : '#ff6110' " size="40">
				</u-icon>
			</view>
		</view>
		<no-data v-show="showNoData"></no-data>
		<u-top-tips ref="uTips"></u-top-tips>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'

	import noData from '../../../components/noData/index'

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
		onReady() {
			this.getUserList(this.userInfo.account) //2011120060
		},
		methods: {
			getUserList(params) { //获取组内所有人员在岗离岗信息
				this.$u.api.getStaffSkill(params).then(res => {
					if (res.msgCode === '000000') {
						this.list = res.data
						if (!res.data || !this.list.length) {
							this.showNoData = true
						}
					} else {
						this.$refs.uTips.show({
							title: `人岗匹配信息获取失败，原因：${res.message}`,
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
	.content-item {
		margin-top: 20rpx;
	}

	.content-item:first-child {
		margin-top: 0;
	}

	.title-tag {
		position: relative;
		width: 50%;
		height: 60rpx;
		line-height: 60rpx;
		background-color: $u-type-primary;
		color: #fff;
		border-bottom-left-radius: 12rpx;
		border-bottom-right-radius: 12rpx;
		margin: 0 auto;
	}

	.title-tag::before {
		content: '';
		width: 20rpx;
		height: 30rpx;
		background: linear-gradient(-245deg, transparent 18rpx, #0e3c8b 0);
		left: -20rpx;
		position: absolute;
	}

	.title-tag::after {
		content: '';
		width: 20rpx;
		height: 30rpx;
		background: linear-gradient(-115deg, transparent 18rpx, #0e3c8b 0);
		right: -20rpx;
		position: absolute;
	}

	.compare-content {
		margin-top: -30rpx;
		width: 100%;
		display: flex;
	}

	.user-skill {
		width: 50%;
		background-color: #d8eaf9;
		color: $u-type-primary;
	}

	.user-post {
		width: 50%;
		background-color: #fff4f1;
		color: #dd5c01;
	}

	.compare-res {
		left: calc(50% - 50rpx);
		top: calc(50% - 30rpx);
		width: 100rpx;
		height: 100rpx;
		border-radius: 100%;
		background-color: #ffffff;
		box-shadow: 0px 0px 5px #a69c9c;
	}

	.item-line-h {
		line-height: 56rpx;
	}

	.page-wrap {
		width: 100%;
		height: 100%;
		flex-direction: column;
	}
</style>
