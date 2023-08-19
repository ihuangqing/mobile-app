<!-- DIPS → 备品备件 → 库位管理 -->
<template>
	<view class="sws-wh100">
		<uni-swipe-action>
			<view class="first-level" v-for="(first, f_index) in list" :key="f_index">
				<!-- <uni-swipe-action-item :right-options="dynamic(first)" @click="swipeClick($event, f_index)"> -->
				<uni-swipe-action-item @click="swipeClick($event, f_index)">
					<view class="first-icon content-box" :class="first.hover ? 'content-box-active' : ''"
						@click="itemClick($event, f_index, list)">
						<text class="content-text">{{ first.label }}</text>
					</view>
				</uni-swipe-action-item>
				<view class="second-level" v-show="first.showChild" v-for="(second, s_index) in first.children"
					:key="s_index">
					<!-- <uni-swipe-action-item :right-options="dynamic(second)" @click="swipeClick($event, s_index)"> -->
					<uni-swipe-action-item @click="swipeClick($event, s_index)">
						<view class="second-icon content-box" :class="second.hover ? 'content-box-active' : ''"
							@click="itemClick($event, s_index, first.children)">
							<text class="content-text">{{ second.label }}</text>
						</view>
					</uni-swipe-action-item>
					<view class="third-level" v-show="second.showChild" v-for="(third, t_index) in second.children"
						:key="t_index">
						<!-- <uni-swipe-action-item :right-options="dynamic(third, true)" @click="swipeClick($event, t_index)"> -->
						<uni-swipe-action-item @click="swipeClick($event, t_index)">
							<view class="third-icon content-box" :class="third.hover ? 'content-box-active' : ''"
								@click="itemClick($event, t_index, second.children)">
								<text class="content-text">{{ third.label }}</text>
							</view>
						</uni-swipe-action-item>
					</view>
				</view>
			</view>
		</uni-swipe-action>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: [],
				rightOptions: () => {
					return [{
						text: '删除',
						style: {
							backgroundColor: '#fa3534'
						}
					}, {
						text: '编辑',
						style: {
							backgroundColor: '#2979ff'
						}
					}, {
						text: '新增',
						style: {
							backgroundColor: '#19be6b'
						}
					}]
				}
			}
		},
		computed: {
			dynamic(item, flag) { //flag = true 表示最后一个层级，不能新增子级
				return (item, flag) => {
					if (item.info.hasChildren) { //如果有子级则不能删除
						let options = this.rightOptions()
						options.shift()
						return options
					} else if (flag) {
						let options = this.rightOptions()
						options.pop()
						return options
					} else {
						return this.rightOptions()
					}
				}
			}
		},
		onLoad() {
			this.getRoot()
		},
		methods: {
			async getRoot() {
				let locationList = await this.baseData.getLocationInfo(this, false)
				this.list = locationList.map(item => {
					return {
						label: item.label,
						value: item.value,
						info: item.info,
						children: [],
						hover: false,
						showChild: false
					}
				})
			},
			async getChild(item) {
				let locationList = await this.baseData.getLocationChildInfo(this, item.value, false)
				item.children = locationList.map(item => {
					return {
						label: item.label,
						value: item.value,
						info: item.info,
						children: [],
						hover: false,
						showChild: false
					}
				})
			},
			itemClick(e, cur_index, list) {
				if (list[cur_index].showChild) { //如果已经展开则收起
					list[cur_index].showChild = false
					this.fakeHover(list[cur_index])
					return
				}
				list.forEach((item, index) => { //如果未展开则收起同级，展开自己
					if (cur_index === index) {
						if (!item.children.length && item.info.hasChildren) {
							this.getChild(item)
						}
						item.showChild = true
						this.fakeHover(item)
					} else {
						item.showChild = false
					}
				})
			},
			swipeClick(e, index) {
				console.log('swipeClick:', e)
			},
			fakeHover(item) {
				item.hover = true
				setTimeout(() => {
					item.hover = false
				}, 300)
			}
		},
		onNavigationBarButtonTap() {
			uni.navigateTo({
				url: '/pages/microApp/Dips/spareParts/locationManage/addLocation/index?type=1'
			})
		}
	}
</script>

<style lang="scss" scoped>
	.content-box {
		flex: 1;
		/* #ifdef APP-NVUE */
		justify-content: center;
		/* #endif */
		height: 100rpx;
		line-height: 100rpx;
		padding: 0 15px;
		position: relative;
		background-color: #fff;
		border-bottom-color: #f5f5f5;
		border-bottom-width: 1px;
		border-bottom-style: solid;
		transition: background-color 300ms;

		&-active {
			background-color: #e8f4ff;
			transition: background-color 300ms;
		}
	}

	.first-icon {
		position: relative;
		padding-left: 80rpx;
	}

	.first-icon::before {
		content: '';
		position: absolute;
		top: 30rpx;
		left: 30rpx;
		width: 40rpx;
		height: 40rpx;
		border-left: 4rpx solid #909399;
	}

	.first-icon::after {
		position: absolute;
		left: 38rpx;
		top: 49rpx;
		content: '';
		width: 24rpx;
		border-bottom: 4rpx solid #909399;
	}

	.second-icon {
		position: relative;
		padding-left: 110rpx;
	}

	.second-icon::before {
		position: absolute;
		content: '';
		top: 30rpx;
		left: 60rpx;
		width: 20rpx;
		height: 20rpx;
		border-left: 4rpx solid #909399;
		border-bottom: 4rpx solid #909399;
	}

	.third-icon {
		position: relative;
		padding-left: 140rpx;
	}

	.third-icon::before {
		position: absolute;
		content: '';
		top: 30rpx;
		left: 90rpx;
		width: 20rpx;
		height: 20rpx;
		border-left: 4rpx solid #909399;
		border-bottom: 4rpx solid #909399;
	}
</style>
