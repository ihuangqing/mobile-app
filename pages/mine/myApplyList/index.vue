<!-- 我的 → 我的申请 -->
<template>
	<view class="page-wrap u-flex">
		<view class="tabs">
			<u-tabs :list="list" :is-scroll="false" :current="current" @change="change" bar-width="60"></u-tabs>
		</view>
		<view class="apply-list u-flex-1">
			<u-collapse ref="uCollapse" hover-class="none" :arrow="false" v-show="!showNoData">
				<u-collapse-item v-for="(user, index) in applyList" :key="index" :index="index" :open="false"
					class="u-border-bottom" :class="user.showCollapse ? 'collapse-all' : ''" @change="collapseChange">
					<view slot="title-all" class="u-flex u-flex-1 u-p-r-40">
						<view class="left u-flex u-row-center u-p-20 u-font-32">
							{{ common.serialNumFormatter(index) }}
						</view>
						<view class="u-flex-1 u-row-left">
							<view class="title u-flex u-flex-1">
								<text class="u-flex-1">离岗申请</text>
								<text class="u-flex-1">{{ user.reason }}</text>
							</view>
							<view class="u-flex-1 u-type-info u-font-24 u-m-t-16">
								<text>申请时间：{{ user.leaveApplyTime }}</text>
							</view>
						</view>
						<view class="u-flex u-font-38 u-p-l-20 u-p-r-20">
							<u-icon :name="user.status === '1' ? 'daishenpi' : 'yishenpi'" custom-prefix="sws-icon"
								:color="user.showCollapse ? '#ffffff' : (user.status === '1' ? '#ff9900' : '#19be6b')"
								size="80"></u-icon>
						</view>
					</view>
					<u-cell-group :border="false">
						<u-cell-item hover-class="none" :arrow="false" title="主管" :value="user.staffInfo.directorName">
						</u-cell-item>
						<u-cell-item hover-class="none" :arrow="false" title="班组长" :value="user.staffInfo.foremanName">
						</u-cell-item>
						<u-cell-item hover-class="none" :arrow="false" title="工段" :value="user.staffInfo.mesArea">
						</u-cell-item>
						<u-cell-item hover-class="none" :arrow="false" title="拉线"
							:value="user.staffInfo.lines.map(line => line.lineName).join('、')"></u-cell-item>
						<u-cell-item hover-class="none" :arrow="false" title="岗位"
							:value="user.staffInfo.posts.map(post => post.postName).join('、')"></u-cell-item>
						<u-cell-item v-show="user.staffInfo.devices.length" hover-class="none" :arrow="false"
							:border-bottom="false" title="设备"
							:value="user.staffInfo.devices.map(device => device.deviceCode).join('、')">
						</u-cell-item>
					</u-cell-group>
				</u-collapse-item>
			</u-collapse>
			<no-data v-show="showNoData"></no-data>
		</view>
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
				list: [{
					name: '全部'
				}, {
					name: '待审批'
				}, {
					name: '已审批'
				}],
				current: 0,
				applyList: [], //展示的列表数据
				showNoData: false
			}
		},
		computed: mapState(['userInfo']),
		onLoad() {
			this.getApplyList()
		},
		methods: {
			collapseChange(item) {
				this.applyList.forEach((user, index) => {
					if (item.index === index) {
						user.showCollapse = item.show
					} else {
						user.showCollapse = false
					}
				})
			},
			change(index) {
				this.current = index;
				this.applyList = []
				switch (index) {
					case 0:
						this.renderList()
						break
					case 1:
						this.renderList(['1']) //待审批
						break
					case 2:
						this.renderList(['2', '3', '4']) //2待顶岗  3待返岗  4流程走完
						break
				}
			},
			renderList(status) { //过滤数据
				this.$nextTick(function() {
					this.applyList = this.resData.filter(item => {
						return !status || status.includes(item.status)
					})

					this.applyList.forEach(user => {
						user.showCollapse = false
					})

					if (this.applyList.length) {
						this.showNoData = false
					} else {
						this.showNoData = true
					}
				})
			},
			getApplyList() {
				this.$u.api.getMyApplyList(this.userInfo.account).then(res => {
					if (res.msgCode === '000000') {
						this.resData = res.data.reverse().map(item => {
							return {
								...item,
								showCollapse: false
							}
						})
						this.renderList()
					} else {
						this.$refs.uTips.show({
							title: `申请记录获取失败，原因：${res.message}`,
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
		overflow: hidden;
		flex-direction: column;

		.tabs {
			width: 100%;
		}

		.apply-list {
			width: 100%;
			overflow-y: scroll;
		}
	}

	::v-deep .collapse-all .u-collapse-head {
		background-color: #2979ff;
		color: #fff;
	}

	.collapse-all .u-type-info {
		color: rgba(255, 255, 255, .8) !important;
	}

	::v-deep .u-cell {
		padding: 12rpx 30rpx
	}
</style>
