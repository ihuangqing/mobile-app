<template>
	<view class="sws-wh100 u-flex sws-flex-d-column sws-bg-ebebeb">
		<view class="pm-header sws-w100">
			<view class="pm-header-up u-flex u-p-20">
				<u-search placeholder="请输入关键字" shape="square" v-model="keyword" :show-action="false"
					@change="$u.throttle(toFilter, 500)" @search="toFilter"></u-search>
			</view>
			<view class="pm-header-bottom-border"></view>
		</view>
		<view class="pm-content sws-w100 u-flex-1 sws-bg-ebebeb">
			<scoring-list ref="scoreItem" class="sws-wh100" :data-list="scoreTypeData" :height-obj="heightObj"
				:component-type="type"></scoring-list>
		</view>
		<view class="pm-footer u-p-20 sws-w100">
			<u-button type="primary" class="sws-letter-spacing sws-line-h-repair" @click="toConfirm">确认</u-button>
		</view>
		<u-top-tips ref="uTips" z-index="999"></u-top-tips>
	</view>
</template>

<script>
	import scoringList from '../components/scoringList'

	export default {
		components: {
			scoringList
		},
		data() {
			return {
				type: 'staff',
				keyword: '',
				heightObj: {},
				scoreTypeData: []
			}
		},
		watch: {
			keyword: function(newVal, oldVal) {
				if (oldVal && !newVal) {
					this.scoreTypeData = [...this.scoreTypeList]
				}
			}
		},
		onLoad() {
			this.scoreTypeList = uni.getStorageSync('scoringCriteria')
			this.scoreTypeData = [...this.scoreTypeList]
			this.eventChannel = this.getOpenerEventChannel()
			this.eventChannel.on('acceptDataFromOpenerPage', async data => {
				this.type = data.type
				this.heightObj = {
					...data.heightObj,
				}
			})
		},
		methods: {
			toConfirm() {
				let selectedScoreItems = []
				this.$refs.scoreItem.scoreData.forEach(item => {
					selectedScoreItems = [...selectedScoreItems, ...item.scoreList.filter(score => score.checked)]
				})

				if (!selectedScoreItems.length) {
					this.$refs.uTips.show({
						title: '请选择评分标准！',
						type: 'warning',
						duration: 3300
					})
					return
				}
				
				this.eventChannel.emit('acceptDataFromOpenedPage', {
					selectedScoreItems
				})
				uni.navigateBack()
			},
			toFilter() {
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
			}
		}
	}
</script>

<style lang="scss" scoped>
	.pm-header {
		position: fixed;
		background-color: #fff;
		z-index: 999;

		&-bottom-border {
			background-color: #ebebeb;
			height: 20rpx;
			width: 100%;
		}
	}

	.pm-content {
		padding: 124rpx 20rpx 120rpx 20rpx;
	}

	.pm-footer {
		position: fixed;
		background-color: #ebebeb;
		bottom: 0;
		left: 0;
		z-index: 999;
	}
</style>