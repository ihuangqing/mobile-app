<template>
	<view class="sws-wh100">
		<view class="header-wrap">
			<view class="header-top sws-w100">
				<view class="header-content">
					<view class="sws-w100 u-flex u-row-center">
						<view class="user-image u-text-center">
							<u-icon name="touxiang" custom-prefix="sws-icon" size="96" color="#2979ff"></u-icon>
						</view>
					</view>
				</view>
				<view class="header-info u-flex">
					<view class="sws-h100 u-flex-1 u-flex sws-flex-d-column u-row-right">
						<u-icon name="jineng" custom-prefix="sws-icon" size="56" color="#2979ff"></u-icon>
						<view class="u-m-t-8">
							<text class="u-content-color u-font-36 sws-font-bold">{{ skillNum }}</text>
							<text class="u-tips-color u-font-24 u-m-l-4">个</text>
						</view>
						<view class="u-tips-color u-m-t-8">技能总数</view>
					</view>
					<view class="sws-h100 u-flex-1 u-flex sws-flex-d-column u-row-right">
						<u-icon name="zongkecheng" custom-prefix="sws-icon" size="56" color="#2979ff"></u-icon>
						<view class="u-m-t-8">
							<text class="u-content-color u-font-36 sws-font-bold">{{ studyFileNum }}</text>
							<text class="u-tips-color u-font-24 u-m-l-4">课</text>
						</view>
						<view class="u-tips-color u-m-t-8">课程总数</view>
					</view>
					<view class="sws-h100 u-flex-1 u-flex sws-flex-d-column u-row-right">
						<u-icon name="zongshichang" custom-prefix="sws-icon" size="56" color="#2979ff"></u-icon>
						<view class="u-m-t-8">
							<text class="u-content-color u-font-36 sws-font-bold">{{ studyTimeTotal }}</text>
							<text class="u-tips-color u-font-24 u-m-l-4">分钟</text>
						</view>
						<view class="u-tips-color u-m-t-8">学习总时长</view>
					</view>
				</view>
			</view>
			<u-gap height="20" bg-color="#ebebeb"></u-gap>
		</view>
		<view class="scroll-wrap sws-w100">
			<view class="u-p-l-30 u-p-r-30 u-p-b-30" v-show="!showNoData">
				<view class="course-item" v-for="(course, index) in list" :key="index">
					<view class="course-item-skill u-line-1"
						:class="course.publishType == 2 ? 'u-type-warning-bg' : 'u-type-primary-bg' "
						@click="toShowSkill(course)">{{ course.skillNames }}</view>
					<view class="u-flex">
						<view class="u-flex-1">
							<view class="course-item-info">{{`${ course.title }(${ course.version })`}}</view>
							<view v-if="!+course.isHistory" class="course-item-info u-font-24 u-tips-color">{{`${course.studyLimitTime}分钟 |
								${ course.numberOfDone }人已学习 | ${ course.studyTime } `}}
							</view>
						</view>
						<u-icon name="bg-book" custom-prefix="sws-icon" class="u-p-r-30" size="84"
							color="rgba(200, 201, 204, .4)"></u-icon>
					</view>
					<view class="course-item-info u-text-right u-type-success" @click="toDetail(course)">
						<view v-if="!+course.isHistory">
							<u-icon v-if="+course.state" name="chakanbaogao" custom-prefix="sws-icon" size="28"
								color="#19be6b" label="查看学习报告" label-pos="left" label-color="#19be6b"></u-icon>
							<text v-else class="u-type-warning">课程已下架</text>
						</view>
						<text v-else class="u-type-info">历史版本</text>
					</view>
				</view>
				<u-loadmore :status="loadStatus" bgColor="#ffffff"></u-loadmore>
			</view>
			<no-data v-show="showNoData"></no-data>
		</view>
		<u-modal v-model="showSkill" :content="skillName"></u-modal>
		<u-top-tips ref="uTips"></u-top-tips>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	
	import noData from '../../components/noData/index.vue'

	export default {
		components: {
			noData
		},
		data() {
			return {
				page: 1,
				limit: 6,
				skillNum: 0,
				studyFileNum: 0,
				studyTimeTotal: 0,
				list: [],
				loadStatus: 'loadmore',
				skillName: '',
				showSkill: false,
				showNoData: false
			}
		},
		computed: mapState(['userInfo']),
		onLoad() {
			this.getLearnRecordInfo()
			this.getLearnRecordList()
		},
		methods: {
			getLearnRecordInfo() {
				const params = {
					account: this.userInfo.account
				}
				this.$u.api.getLearnRecordInfo(params).then(res => {
					if (res.msgCode === '000000' && res.data) {
						const temp = res.data
						this.skillNum = temp.skillNum
						this.studyFileNum = temp.studyFileNum
						this.studyTimeTotal = temp.studyTimeTotal
					} else {
						this.$refs.uTips.show({
							title: `我的学习记录获取失败，原因：${ res.message }`,
							type: 'error',
							duration: 2300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			getLearnRecordList() {
				const params = {
					page: this.page,
					limit: this.limit,
					account: this.userInfo.account
				}
				this.$u.api.getLearnRecordList(params).then(res => {
					if (res.msgCode === '000000' && res.data) {
						const temp = res.data.data.map(item => {
							if (item.publishType == 2) {
								return {
									...item,
									skillNames: '通用'
								}
							} else {
								return item
							}
						})
						this.dataList = [...this.list, ...temp]
						this.list = this.dataList
						this.page++

						if (!res.data.data.length || res.data.data.length < this.limit) this.loadStatus = "nomore"

						if (!this.list.length) {
							this.showNoData = true
						} else {
							this.showNoData = false
						}
					} else {
						this.$refs.uTips.show({
							title: `我的学习记录获取失败，原因：${ res.message }`,
							type: 'error',
							duration: 2300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			toDetail(course) {
				if (+course.state && !+course.isHistory) { //未下架的可以查看
					uni.navigateTo({
						url: `/pages/mine/myLearnRecords/recordDetail/index${ this.$u.queryParams(course) }`
					})
				}
			},
			toShowSkill(course) {
				if (course.publishType != 2) {
					this.skillName = course.skillNames
					this.showSkill = true
				}
			}
		},
		onReachBottom() {
			if (this.loadStatus != 'nomore') { //如果状态无无数据，则不再请求
				this.loadStatus = "loading"
				this.getLearnRecordList()
			}
		},
	}
</script>

<style lang="scss" scoped>
	.header-wrap {
		width: 100%;
		position: fixed;
		z-index: 1;

		.header-top {
			position: relative;
			height: 360rpx;
			background: linear-gradient(180deg, #2979ff, #2979ff 120rpx, #ffffff 0);
			overflow: hidden;

			.header-content {
				width: calc(100% * 1.424);
				height: calc(100% * 0.85555);
				background-color: #ffffff;
				border-radius: 100%;
				margin-top: calc(100% * 0.104);
				margin-left: calc((-100% * 1.424 + 100%) / 2);

				.user-image {
					width: 100rpx;
					height: 100rpx;
					line-height: 100rpx;
					margin-top: -50rpx;
					border-radius: 100%;
					background-color: #ffffff;
					overflow: hidden;
				}
			}

			.header-info {
				position: absolute;
				bottom: 0;
				width: 100%;
				height: 100%;
				padding-bottom: 40rpx;
			}
		}

		@media screen and (min-width: 520px) {
			.header-top {
				background: linear-gradient(180deg, #2979ff, #2979ff 180rpx, #ffffff 0);
			}
		}
	}

	.scroll-wrap {
		width: 100%;
		height: 100%;
		padding-top: 380rpx;

		.course-item {
			border: 2rpx solid #e8e8e8;
			border-radius: 16rpx;
			box-shadow: 0 0 4rpx #e8e8e8;
			margin-top: 30rpx;
			padding-bottom: 16rpx;

			&-skill {
				width: 180rpx;
				height: 38rpx;
				line-height: 38rpx;
				text-align: center;
				font-size: 24rpx;
				padding: 0 20rpx;
				margin-bottom: 8rpx;
				color: #ffffff;
				border-top-left-radius: 16rpx;
				border-bottom-right-radius: 16rpx;
			}

			&-info {
				padding: 8rpx 20rpx 0 30rpx;
			}
		}
	}
</style>
