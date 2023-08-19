<template>
	<view class="sws-wh100 u-flex sws-flex-d-column pm-wrap">
		<view class="pm-header sws-w100">
			<view class="pm-header-up u-flex u-p-20">
				<u-search :placeholder="subCurrent ? '请输入关键字': '请输入姓名/工号'" search-icon-color="#2979ff" shape="square" v-model="keyword" :show-action="false"
					@change="$u.throttle(toFilter, 500)" @search="toFilter"></u-search>
				<view class="pm-header-subsection u-m-l-30">
					<u-subsection :list="subList" :current="subCurrent" mode="subsection" active-color="#2979ff" height="64"
						@change="subsectionChange"></u-subsection>
				</view>
			</view>
			<view class="pm-header-bottom-border"></view>
		</view>
		<view class="pm-content sws-w100 u-flex-1 sws-bg-ebebeb">
			<staff-components class="sws-wh100" v-if="!subCurrent" :data-list="staffData" :height-obj="heightObj"
				@refreshPage="getStaffScoreInfo"></staff-components>
			<scoring-components class="sws-wh100" v-else :data-list="scoreTypeData" :staff-list="staffData"
				:scroll-top="scrollTop" :component-type="'score'" :height-obj="heightObj"
				@refreshPage="getStaffScoreInfo"></scoring-components>
		</view>
		<u-top-tips ref="uTips" z-index="999"></u-top-tips>
	</view>
</template>

<script>
	import staffComponents from './components/staffList'
	import scoringComponents from './components/scoringList'

	export default {
		components: {
			staffComponents,
			scoringComponents
		},
		data() {
			return {
				scrollTop: 0,
				keyword: '',
				subList: [{
						name: '员工'
					},
					{
						name: '评分项'
					}
				],
				subCurrent: 0,
				staffData: [],
				scoreTypeData: [],
				heightObj: {}
			}
		},
		watch: {
			keyword: function(newVal, oldVal) {
				if (oldVal && !newVal) {
					this.staffData = [...this.staffList]
					this.scoreTypeData = [...this.scoreTypeList]
				}
			}
		},
		onLoad() {
			this.getStaffScoreInfo()
		},
		async onReady() {
			const headerH = await this.common.getElRect(this, '.pm-header')
			const headerUpH = await this.common.getElRect(this, '.pm-header-up')
			const wrapH = await this.common.getElRect(this, '.pm-wrap')
			this.heightObj = {
				headerH: headerH.height,
				headerUpH: headerUpH.height,
				wrapH: wrapH.height
			}
		},
		methods: {
			getStaffScoreInfo() {
				this.$u.api.getStaffScoreInfo().then(res => {
					if (res.msgCode === '000000' && res.data) {
						this.staffList = res.data.staffList
						this.scoreTypeList = res.data.scoreTypeList

						this.staffData = [...this.staffList]
						this.scoreTypeData = [...this.scoreTypeList]

						uni.setStorage({
							key: 'scoringCriteria',
							data: [...this.scoreTypeList]
						})
					} else {
						this.$refs.uTips.show({
							title: `初始化数据失败，原因：${res.message}`,
							type: 'error',
							duration: 3300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			subsectionChange(index) {
				this.subCurrent = index

				this.$nextTick(() => {
					uni.pageScrollTo({
						duration: 0,
						scrollTop: 0,
					})
				})
			},
			toFilter() {
				if (this.subCurrent) { //过滤评分标准
					const tempArr = this.scoreTypeList.filter(item => {
						return item.scoreList.filter(({
							scoreDesc
						}) => {
							return scoreDesc.includes(this.keyword)
						}).length
					})

					this.scoreTypeData = tempArr.map(item => {
						const scoreList = item.scoreList.filter(({
							scoreDesc
						}) => {
							return scoreDesc.includes(this.keyword)
						})
						return {
							...item,
							scoreList
						}
					})
					console.log('this.scoreTypeData: ', this.scoreTypeData)
				} else { //过滤员工
					this.staffData = this.staffList.filter(({
						userName,
						account
					}) => {
						return [userName, account].includes(this.keyword)
					})
				}
			}
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop
		}
	}
</script>

<style lang="scss" scoped>
	.pm-wrap::after {
		content: '';
		position: fixed;
		bottom: 0;
		width: 100%;
		height: 20rpx;
		background-color: #ebebeb;
		z-index: 999;
	}

	.pm-header {
		position: fixed;
		background-color: #fff;
		z-index: 999;

		&-subsection {
			width: 280rpx;
		}

		&-bottom-border {
			background-color: #ebebeb;
			height: 20rpx;
			width: 100%;
		}
	}

	.pm-content {
		padding: 124rpx 20rpx 20rpx 20rpx;
	}
	
	::v-deep .u-content {
		background-color: #fff !important;
		border: 2rpx solid #e8e8e8;
	}
	
	::v-deep .uni-input-form {
		background-color: #fff !important;
	}
	
	::v-deep .uni-input-placeholder {
		z-index: 1;
	}
</style>