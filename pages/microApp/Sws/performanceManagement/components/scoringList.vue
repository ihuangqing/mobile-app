<template>
	<view>
		<u-index-list :scrollTop="scrollTop" :initTop="initTop" :index-list="indexList" :sticky="false"
			:complexList="complexList">
			<view v-for="(item, index) in scoreData" :key="index">
				<u-index-anchor :use-slot="true" :index="item.typeCode" class="index-anchor">
					<view class="sws-font-bold">{{item.typeCode}}.{{item.typeName}}</view>
				</u-index-anchor>
				<view v-for="(score, scoreIndex) in item.scoreList" :key="scoreIndex" class="list-cell u-border-bottom"
					@click="toChecked(score)">
					<view class="u-flex" v-if="componentType !== 'score'" @click="toChecked(score)">
						<u-checkbox :shape="componentType === 'staff' ? 'square' : 'circle'" v-model="score.checked"
							size="38"></u-checkbox>
					</view>
					<view class="u-flex-1">
						<view class="u-flex">
							<view class="desc-content1">
								{{score.scoreCode}}.{{score.scoreDesc}}
							</view>
						</view>
						<view class="u-flex u-m-t-10">
							<u-tag :text="`${score.scoreValue}分/${score.generateRate}`"
								:type="score.scoreValue === 100 ? 'info': 'primary'" mode="plain" size="mini" />
							<u-tag :text="+score.scoreRule ? '加分' : '减分'" :type="+score.scoreRule ? 'success' : 'error'" mode="dark"
								size="mini" class="u-m-l-10" />
						</view>
					</view>
					<view class="u-flex u-m-l-20" v-if="componentType === 'score'">
						<u-button type="warning" class="score-btn" @click="toSelectUser(score)">评分</u-button>
					</view>
				</view>
			</view>
		</u-index-list>
		<u-popup mode="right" v-model="showPopup" :mask="false" length="55%" border-radius="32" duration="100"
			:custom-style="{top: popupTop+'px', height: popupH + 'px'}" class="user-popup">
			<view class="sws-wh100">
				<view class="user-popup-header">组员列表</view>
				<scroll-view scroll-y="true" :style="`height: ${ scrollH }px`">
					<u-cell-group :border="false">
						<u-cell-item v-for="(user, index) in userList" :key="index" title="" :arrow="false"
							@click="user.checked = !user.checked">
							<view slot="title" :class="user.checked ? 'u-type-primary': ''">
								<text class="u-font-30">{{ user.userName }}</text>
								<text class="u-font-24">（{{ user.account }}）</text>
							</view>
							<view slot="right-icon" v-show="user.checked">
								<u-icon name="checkbox-mark" color="#2979ff" size="38"></u-icon>
							</view>
						</u-cell-item>
					</u-cell-group>
				</scroll-view>
				<view class="user-popup-btnGroup u-flex">
					<u-button type="primary" class="user-popup-btnGroup-btn sws-letter-spacing u-m-r-40"
						@click="toPScorePage">确定</u-button>
					<u-icon name="arrow-rightward" label="关闭" color="#2979ff" label-color="#2979ff" label-pos="left"
						@click="showPopup = false"></u-icon>
				</view>
			</view>
		</u-popup>
		<u-top-tips ref="uTips" z-index="999"></u-top-tips>
	</view>

</template>

<script>
	import {
		mapState
	} from 'vuex'
	export default {
		name: 'scoringList',
		//componentType  score用于评分项选员工  staff 用于员工选评分项（多选）  update 审核变更（单选）
		props: {
			scrollTop: {
				type: [Number, String],
				default: 0
			},
			heightObj: {
				type: Object,
				default () {
					return {
						headerH: 0,
						headerUpH: 0,
						wrapH: 0
					}
				}
			},
			staffList: {
				type: Array,
				default () {
					return []
				}
			},
			dataList: {
				type: Array,
				default () {
					return []
				}
			},
			componentType: {
				type: String,
				default: 'staff'
			}
		},
		data() {
			return {
				initTop: 0,
				popupTop: 0,
				popupH: '100%',
				scrollH: '300px',
				scoreData: [],
				userList: [],
				indexList: [],
				complexList: [],
				showPopup: false,
			}
		},
		computed: mapState(['sysInfo']),
		watch: {
			heightObj: {
				handler: function(newVal) {
					if (this.componentType === 'staff') {
						this.initTop = this.heightObj.headerH
					}
				},
				deep: true
			},
			dataList: {
				handler: function(newVal, oldVal) {
					this.initData()
				},
				deep: true
			},
		},
		mounted() {
			this.initH() //初始化高度数据
		},
		methods: {
			toPScorePage() {
				const selectedUsers = this.userList.filter(user => user.checked)
				if (!selectedUsers.length) {
					this.$refs.uTips.show({
						title: '请选择评分员工！',
						type: 'warning',
						duration: 3300
					})
					return
				}
				const _self = this
				uni.navigateTo({
					url: '/pages/microApp/Sws/performanceManagement/performanceScore/index',
					events: {
						acceptDataFromOpenedPage: function(data) {
							_self.$emit('refreshPage')
						},
					},
					success: function(res) {
						res.eventChannel.emit('acceptDataFromOpenerPage', {
							data: {
								type: 'score',
								heightObj: {
									..._self.heightObj
								},
								userList: [...selectedUsers],
								scoreItem: _self.currScoreItem
							}
						})
					}
				})
				this.showPopup = false
			},
			async initH() {
				if (Object.keys(this.heightObj).length) {
					this.initTop = this.heightObj.headerH
					if (this.componentType === 'score') {
						// #ifdef APP-PLUS
						this.popupTop = this.heightObj.headerUpH
						// #endif
						// #ifdef H5
						this.popupTop = this.sysInfo.windowHeight - this.heightObj.wrapH + this.heightObj.headerUpH
						// #endif
						this.popupH = this.heightObj.wrapH - this.heightObj.headerUpH

						if (this.staffList.length) {
							this.userList = this.staffList.map(user => {
								return {
									...user,
									checked: false
								}
							})
						}

					}
				}

				this.initData()
			},
			initData() {
				this.indexList = this.dataList.map(item => item.typeCode)
				this.complexList = this.dataList.map(item => {
					return {
						code: item.typeCode,
						label: `${item.typeCode}.${item.typeName}`
					}
				})

				this.scoreData = this.dataList.map(item => {
					return {
						...item,
						scoreList: item.scoreList.map(score => {
							return {
								...score,
								checked: false
							}
						})
					}
				})

			},
			toSelectUser(score) {
				this.currScoreItem = score
				//重置员工选中状态
				this.userList.forEach(user => user.checked = false)
				this.showPopup = true
				this.$nextTick(async () => {
					const popupHeader = await this.common.getElRect(this, '.user-popup-header')
					const popupBtnGroup = await this.common.getElRect(this, '.user-popup-btnGroup')
					this.scrollH = this.popupH - popupHeader.height - popupBtnGroup.height
				})
			},
			toChecked(score) {
				if (this.componentType === 'staff') {
					score.checked = !score.checked
				} else if (this.componentType === 'update') {
					if (!score.checked) {
						this.scoreData.forEach(score => {
							score.scoreList.forEach(item => {
								if (item.checked) item.checked = false
							})
						})
					}
					score.checked = !score.checked
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	::v-deep .index-anchor .u-index-anchor {
		background-color: #3c9cff;
		color: #fff;
	}

	.list-cell {
		display: flex;
		box-sizing: border-box;
		width: 100%;
		padding: 10px 34rpx;
		overflow: hidden;
		color: #323233;
		font-size: 14px;
		line-height: 24px;
		background-color: #fff;

		.score-btn {
			width: 130rpx;
			height: 64rpx;
			line-height: 64rpx;
			letter-spacing: 10rpx;
			text-indent: 10rpx;
		}
	}

	::v-deep .u-mode-dark-success {
		border: 2rpx solid #19be6b;
	}

	::v-deep .u-mode-dark-error {
		border: 2rpx solid #fa3534;
	}

	.anchor-text {
		color: red;
	}

	::v-deep .u-index-bar__sidebar {
		top: calc(50% + 124rpx);
	}

	.scroing-tips {
		box-shadow: 0 0 2rpx 2rpx #ebebeb;
		border-radius: 12rpx;
		overflow: hidden;
		margin-left: 16rpx;

		&-up {
			background-color: #2979ff;
			color: #fff;
			padding: 8rpx 20rpx 0 20rpx;
		}
	}

	.user-popup {
		&-header {
			width: 100%;
			height: 80rpx;
			line-height: 80rpx;
			text-align: center;
			background-color: #3c9cff;
			color: #fff;
		}

		&-btnGroup {
			height: 120rpx;
			padding: 20rpx;

			&-btn {
				height: 80rpx;
				flex: 1;
			}
		}
	}

	::v-deep .u-drawer-content {
		box-shadow: 2rpx 0 2rpx 2rpx #ecf5ff;
	}

	::v-deep .u-drawer .u-cell {
		padding: 16rpx 32rpx 16rpx 40rpx;
	}
</style>