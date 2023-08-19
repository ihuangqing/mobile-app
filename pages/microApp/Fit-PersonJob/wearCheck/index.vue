<!-- 人岗匹配 → 穿戴确认 -->
<template>
	<view class="wear-page sws-wh100 u-flex sws-flex-d-column">
		<view class="sws-w100 u-flex-1 u-flex sws-overflow-hidden">
			<view class="sws-h100 u-flex-5 u-flex sws-flex-d-column u-row-center">
				<u-image width="100%" height="100%" v-show="src" :src="src" mode="aspectFit"
					loading-icon="more-dot-fill"></u-image>
				<view class="user-info u-font-36">{{ userName }}</view>
				<view class="user-info u-font-28">{{ account }}</view>
				<view class="user-info user-post">{{ post }}</view>
			</view>
			<view class="u-relative wrap-wear-content sws-h100 u-flex-7 u-flex u-m-l-40 u-m-r-40">
				<view class="wear-content">
					<u-cell-group title="穿戴物品" :border="false"
						:title-style="{'text-align': 'center', 'background': '#2979ff', 'color': '#ffffff', 'padding': '20rpx 40rpx'}">
						<u-checkbox-group class="sws-w100 check-box" @change="checkboxGroupChange" :wrap="true">
							<u-checkbox class="u-p-t-26 u-p-r-40 u-p-b-26 u-p-l-40" v-model="item.checked"
								:name="item.name" v-for="(item, index) in list" :key="index">
								{{ item.name }}
							</u-checkbox>
						</u-checkbox-group>
					</u-cell-group>
				</view>
			</view>
		</view>
		<view class="btn-group sws-w100 u-p-28">
			<u-button class="sws-w100" type="primary" @click="commit">确定</u-button>
		</view>
		<u-top-tips ref="uTips"></u-top-tips>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	export default {
		data() {
			return {
				src: '',
				userName: '',
				account: '',
				post: '', //岗位
				list: []
			}
		},
		computed: mapState(['userInfo']),
		onLoad(options) {
			this.userName = options.userName
			this.account = options.account
			this.post = JSON.parse(options.posts).map(post => post.postName).join('、')
			this.wearList = JSON.parse(options.wearList)
			this.okWears = this.wearList
			this.list = this.wearList.map(wear => {
				return {
					name: wear,
					checked: true
				}
			})
			this.setPic() //根据性别设置人像
		},
		methods: {
			setPic() {
				this.$u.api.getUserInfoByAccount(this.account).then(res => {
					if (res.msgCode === '000000') {
						console.log(this.src)
						if (res.data.sex === 'F') {
							this.src = '../../../../static/swd/pic_woman.png'
						} else {
							this.src = '../../../../static/swd/pic_man.png'
						}
					} else {
						// 获取性别失败,不做处理,默认男生头像
					}
				}).catch(err => {
					this.common.sysErrToast(err, this)
				})
			},
			commit() {
				this.fromCommit = true
				const _self = this
				const ngWears = _self.wearList.filter(wear => {
						return !_self.okWears.includes(wear)
				})
				let state = 0
				if (!ngWears.length) {
					state = 1
				}
				const eventChannel = this.getOpenerEventChannel()
				eventChannel.emit('acceptDataFromOpenedPage', {
					state,
					ngWears,
					okWears: _self.okWears
				})
				uni.navigateBack()
			},
			checkboxGroupChange(okWears) {
				this.okWears = okWears
			}
		},
		onBackPress() {
			if (!this.fromCommit) {
				const _self = this
				const eventChannel = this.getOpenerEventChannel()
				eventChannel.emit('acceptDataFromOpenedPage', {
					state: 1,
					ngWears: [],
					okWears: _self.wearList
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.wear-page {
		background: linear-gradient(#ff7e40, #ffb952);

		.user-info {
			color: #ffffff;
			margin-top: 14rpx;
		}

		.user-post {
			background-color: #fa9134;
			border-radius: 50px;
			display: inline;
			padding: 10rpx 30rpx;
			margin-bottom: 150rpx;
		}

		.wear-content {
			position: relative;
			background: #FFFFFF;
			border-radius: 16rpx;
			min-height: 768rpx;
			max-height: 90%;
			overflow-y: scroll;
		}

		.wrap-wear-content::before {
			content: '';
			position: absolute;
			left: -38rpx;
			top: calc(50% - 20rpx);
			width: 0;
			height: 0;
			border: 20rpx solid transparent;
			border-right-color: #FFFFFF;
		}

		.btn-group {
			letter-spacing: 20rpx;
			text-indent: 20rpx;
		}

		::v-deep .u-checkbox__label {
			flex: 1;
		}

		::v-deep .u-checkbox__icon-wrap--checked+.u-checkbox__label {
			color: #2979ff;
			font-weight: bold;
		}
	}
</style>
