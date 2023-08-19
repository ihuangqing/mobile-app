<!-- 人员状态（人员在岗离岗状态查询）-->
<template>
	<view class="sws-wh100 u-rela sws-overflow-hidden u-flex sws-flex-d-column">
		<view class="foreman-wrap sws-w100 u-flex u-col-top u-p-24">
			<view class="u-flex-1">
				<view class="u-font-24 u-text-center u-m-b-16 text-opacity">{{ computedForeman(isForeman)[0] }}</view>
				<view class="u-font-32 u-text-center">{{ userName ? userName : '-' }}</view>
			</view>
			<view class="u-flex-1">
				<view class="u-font-24 u-text-center u-m-b-16 text-opacity">{{ computedForeman(isForeman)[1] }}</view>
				<view class="u-text-center">
					<text class="u-font-32">{{ num1 ? num1 : '-' }}</text>
					<text class="u-m-l-6 u-font-24 text-opacity">人</text>
				</view>
			</view>
			<view class="u-flex-1">
				<view class="u-font-24 u-text-center u-m-b-16 text-opacity">{{ computedForeman(isForeman)[2] }}</view>
				<view class="u-text-center">
					<text class="u-font-32">{{ num2 ? num2 : '-' }}</text>
					<text class="u-m-l-6 u-font-24 text-opacity">人</text>
				</view>
			</view>
		</view>
		<view v-show="!showNoData" class="scroll-cont sws-w100 u-flex-1 sws-overflow-scroll-y">
			<view v-for="(user, index) in list" :key="index">
				<view class="scroll-cont-item u-p-b-10">
					<view
						:class="Number(user.postState) ? 'scroll-cont-item-head u-flex' : 'scroll-cont-item-head leave-post u-flex'">
						<view class="u-m-r-10" v-show="user.shift">
							<u-icon v-if="user.shift === '1'" name="baiban" custom-prefix="sws-icon" size="42"
								color="#feac11">
							</u-icon>
							<u-icon v-else name="yeban" custom-prefix="sws-icon" size="38" color="#4d0f85"></u-icon>
						</view>
						<view class="u-flex-1">
							<text class="sws-font-bold">{{ user.userName }}</text>
							<text class="u-m-l-10 u-font-24">{{ user.account }}</text>
						</view>
						<view>
							<text :class="Number(user.postState) ? 'u-type-success' : 'u-type-error'">
								{{ Number(user.postState) ? '在岗' : (user.attendState ? user.attendState : (Number(user.isSignIn) ? '中途离岗': '已签退')) }}
							</text>
							<text v-show="+user.callState"
								:style="{color: user.callState == 1 ? '#ffaa19' : '#774aa6'}">{{ user.callState == 1 ? '（调出）' : '（支援）' }}</text>
						</view>
					</view>
					<view>
						<u-cell-group :border="false">
							<u-cell-item class="u-p-t-0 u-p-b-0" :value-style="{color: '#303133'}"
								v-show="user.lines && user.lines.length" title="拉线" :border-bottom="false"
								:value="user.lines && user.lines.map(line => line.lineName).join('、')"
								hover-class="none" :arrow="false">
							</u-cell-item>
							<u-cell-item class="u-p-t-0 u-p-b-0" :value-style="{color: '#303133'}"
								v-show="user.posts && user.posts.length" title="岗位" :border-bottom="false"
								:value="user.posts && user.posts.map(post => post.postName).join('、')"
								hover-class="none" :arrow="false">
							</u-cell-item>
							<u-cell-item class="u-p-t-0 u-p-b-0 u-border-top" :value-style="{color: '#303133'}"
								v-show="user.devices && user.devices.length" title="设备" :border-bottom="false"
								:value="user.devices && user.devices.map(device => device.deviceCode).join('、')"
								hover-class="none" :arrow="false"></u-cell-item>
							<u-cell-item class="u-p-t-0 u-p-b-0 u-border-top" :value-style="{color: '#303133'}"
								v-show="user.aioCodes" title="一体机" :border-bottom="false" :value="user.aioCodes"
								hover-class="none" :arrow="false"></u-cell-item>
						</u-cell-group>
					</view>
				</view>
				<u-gap v-show="list.length != (index + 1)" height="30" bg-color="#ffffff"></u-gap>
			</view>
		</view>
		<no-data class="no-data" v-show="showNoData"></no-data>
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
				isForeman: '', //是否为班组长 1是，0 否
				userName: '', //组长
				num1: '', //应到人数
				num2: '', //实到人数
				list: [],
				showNoData: false
			}
		},
		computed: {
			...mapState(['userInfo']),
			computedForeman(isForeman) {
				return isForeman => {
					if (isForeman != '') {
						if (+isForeman == 1) {
							return ['组长', '应到人数', '实到人数']
						} else {
							return ['主管', '白班人数', '夜班人数']
						}
					} else {
						return ['', '', '']
					}
				}
			}
		},
		onReady() {
			this.getUserList(this.userInfo.account)
		},
		methods: {
			getUserList(params) { //获取组内所有人员在岗离岗信息
				this.$u.api.getStaff(params).then(res => {
					if (res.msgCode === '000000') {
						if (Object.keys(res.data).length) {
							const temp = res.data
							this.isForeman = temp.isForeman
							this.userName = temp.username
							this.num1 = +temp.isForeman ? temp.dueNum : temp.dayNum
							this.num2 = +temp.isForeman ? temp.actualNum : temp.nightNum
							this.list = temp.staffList
							if (!this.list.length) {
								this.showNoData = true
							}
						} else {
							this.showNoData = true
						}
					} else {
						this.$refs.uTips.show({
							title: `人员在岗状态信息获取失败，原因：${res.message}`,
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
	.foreman-wrap {
		background-color: $u-type-primary;
		height: 300rpx;
		background: radial-gradient(circle at 50% -170%, #2979ff 90%, #ffffff 0);
		color: #ffffff;
	}

	.text-opacity {
		opacity: .8;
	}

	.scroll-cont {
		margin-top: -140rpx;
		padding: 0 40rpx 40rpx 40rpx;

		&-item {
			position: relative;
			background-color: #ffffff;
			border: 2rpx solid #ebebeb;
			box-shadow: 0px 4rpx 10rpx #ebebeb;
			border-radius: 8rpx;

			&-head {
				padding: 20rpx 30rpx 20rpx 20rpx;
				border-top-left-radius: 8rpx;
				border-left: 8rpx solid $u-type-success;
			}

			.leave-post {
				border-left: 8rpx solid $u-type-error;
			}
		}
	}

	.no-data {
		margin-top: -240rpx;
	}
</style>
