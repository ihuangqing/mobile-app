<template>
	<view>
		<!-- 最新文档 -->
		<view class="card-bg">
			<view class="item-title">
				<text class="sws-font-bold u-font-30">最新文档</text>
				<view class="more">
					<navigator
						:url="hasLogin ? '/pages/microApp/E-SOP/sop/index?type=1': '/pages/microApp/E-SOP/sop/index'"
						hover-class="none">
						<u-icon name="arrow-right" color="#909399" label="更多" label-pos="left" label-color="#909399"
							size="26"></u-icon>
					</navigator>
				</view>
			</view>
			<u-empty v-show="!fileList.length" text="暂无文档数据" icon-size="60" font-size="24" icon-color="#c8c9cc"
				color="#c8c9cc" mode="list"></u-empty>
			<view class="u-flex" v-show="fileList.length">
				<view class="u-flex-1 doc-item" v-for="(item, index) in fileList" :key="index"
					@click="goToDetail(index, item)">
					<view class="u-font-24 u-text-left u-content-color">{{item.publishTime}}</view>
					<view class="u-flex-1 u-flex u-col-bottom">
						<view class="u-flex-1 u-m-r-20">
							<view class="u-font-24 u-text-left u-main-color sws-w100 u-line-2 sws-font-bold">
								{{item.title}}
							</view>
							<view class="u-font-24 u-text-left u-tips-color u-m-t-6 sws-font-bold">
								{{item.publishUsername}}
							</view>
						</view>
						<u-icon class="doc-icon sws-icon-wendangguanli"></u-icon>
					</view>
				</view>
			</view>
		</view>
		<!-- 视频播放 -->
		<view class="card-bg" v-show="videoList.length">
			<view class="item-title">
				<text class="sws-font-bold u-font-30">视频播放</text>
				<view class="more">
					<navigator url="" hover-class="none">
						<u-icon name="arrow-right" color="#909399" label="更多" label-pos="left" label-color="#909399"
							size="26"></u-icon>
					</navigator>
				</view>
			</view>
			<view class="u-flex">
				<view class="u-flex-1 video-item" v-for="(item, index) in videoList" :key="index">
					<view class="video-player u-relative">
						<!-- <u-image width="100%" src="../../../static/play.png" mode="widthFix"></u-image> -->
						<j-video :url="item" height="100%" width="100%"
							poster="https://www.sunwoda.com/upload/portal/20200721/8f933bd067fcbcd8e64c304179ad7f74.jpg">
						</j-video>
						<!-- <video class="sws-wh100" id="myVideo" :loop="true" :src="item" :autoplay="false" :controls="true" :direction="-90" object-fit="fill"></video> -->
					</view>
					<view class="u-font-28 sws-font-bold u-m-t-10">视频标题</view>
					<view class="u-font-24 u-tips-color">
						<text>视频发布人</text>
						<text class="u-m-l-10">发布时间</text>
					</view>
				</view>
			</view>
		</view>
		<!-- 公告通知 -->
		<view class="card-bg">
			<view class="item-title">
				<text class="sws-font-bold u-font-30">公告通知</text>
				<view class="more">
					<navigator url="/pages/msg/index" hover-class="none">
						<u-icon name="arrow-right" color="#909399" label="更多" label-pos="left" label-color="#909399"
							size="26"></u-icon>
					</navigator>
				</view>
			</view>
			<u-empty v-show="!notiseList.length" text="暂无公告通知" icon-size="60" font-size="24" icon-color="#c8c9cc"
				color="#c8c9cc" mode="message"></u-empty>
			<view class="order" v-show="notiseList.length">
				<view class="item u-flex sws-w100 u-p-20" v-for="(item, index) in notiseList" :key="index"
					@click="goToRichText(item)">
					<view>
						<u-icon class="u-p-r-20" :name="item.showUser === '0' ? 'gonggao2' : 'tongzhi' "
							custom-prefix="sws-icon" size="80" :color="item.showUser === '0' ? '#F5CD20' : '#D061FF' ">
						</u-icon>
					</view>
					<view class="content u-flex-1">
						<view class="title u-flex">
							<text class="u-flex-3 sws-font-bold">{{ item.title }}</text>
							<text class="u-flex-1 u-text-right"
								:style="item.importance == 4 ? {color: '#fa3534'} : (item.importance == 3 ? {color: '#ff9900'} : (item.importance == 2 ? {color: '#D061FF'} : {color: '#000000'}))">{{ formatImportance(item.importance) }}</text>
						</view>
						<view class="type u-font-26">
							<text class="u-m-r-16">{{ item.createName }}</text>
							<text>{{ item.publishTime }}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'

	import NoData from '@/pages/components/noData/index'

	export default {
		components: {
			NoData
		},
		props: ['fileList', 'notiseList', 'videoList'],
		data() {
			return {}
		},
		computed: {
			...mapState(['hasLogin']),
			formatImportance(val) {
				return val => {
					switch (Number(val)) {
						case 1:
							return '普通'
							break
						case 2:
							return '一般'
							break
						case 3:
							return '重要'
							break
						case 4:
							return '非常重要'
							break
					}
				}
			}
		},
		methods: {
			goToRichText(item) { //跳转至富文本展示页面（公告详情页面）
				uni.navigateTo({
					url: `/pages/msg/richText/index`,
					success: res => {
						res.eventChannel.emit('acceptDataFromOpenerPage', {
							data: item
						})
					}
				})
			},
			goToDetail(index, item) { //跳转到文档学习页面
				let params = item
				if (this.hasLogin) {
					params.type = 1
				}
				uni.navigateTo({
					url: `/pages/microApp/E-SOP/sop/esopDetail/index${this.$u.queryParams(params)}`
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.card-bg {
		margin-top: 20rpx;
		padding: 20rpx;
		border-radius: 10rpx;
		background-color: #ffffff;
		overflow: hidden;
	}

	.class-item {
		margin-bottom: 30rpx;
		background-color: #fff;
		padding: 16rpx;
		border-radius: 8rpx;
	}

	.class-item:last-child {
		min-height: 100vh;
	}

	.item-title {
		font-size: 26rpx;
		color: $u-main-color;
		margin-bottom: 20rpx;

		.more {
			float: right;
		}
	}

	.order {
		width: 100%;
		background-color: #ffffff;
		box-sizing: border-box;
		font-size: 28rpx;

		.item {

			.content {
				.title {
					font-size: 28rpx;
					line-height: 50rpx;
				}

				.type {
					margin: 10rpx 0;
					color: $u-tips-color;
				}
			}
		}

		.item:first-child {
			border-top: none
		}
	}

	.all-in-one {
		display: flex;
		border-radius: 12rpx;
		overflow: hidden;

		.user-info {
			background: $u-type-primary;
			color: #ffffff;

			.user-name {
				font-weight: bold;
			}
		}

		.post-device {
			display: flex;

			.post-device-label {
				border-bottom: 4rpx solid #19be6b;
			}

			.post-device-cont {
				word-break: break-all;
			}
		}
	}

	.doc-item {
		height: 190rpx;
		padding: 20rpx;
		border-radius: 10rpx;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		justify-content: space-between;

		.doc-icon {
			width: 70rpx;
			height: 70rpx;
		}
	}

	.doc-item::before {
		content: '';
		width: 0;
	}

	.doc-item::after {
		content: '';
		width: 0;
	}

	.doc-item:first-child {
		margin-right: 20rpx;
		background-color: #fff4e7;
	}

	.doc-item:last-child {
		background-color: #e4efff;
	}

	.video-item:first-child {
		margin-right: 20rpx;
	}

	.video-player {
		height: 190rpx;
		border-radius: 16rpx;
		overflow: hidden;
	}
</style>
