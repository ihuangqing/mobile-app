<!-- E-Checklist → 点检历史查询 -->
<template>
	<view class="sws-wh100 u-flex sws-flex-d-column">
		<u-cell-group :border="false" class="u-flex-1">
			<u-cell-item hover-class="none" title="拉线" :value-style="valueStyle(lineName)" arrow-direction="down"
				:value="lineName ? lineName : '请选择拉线'" @click="showLines">
				<u-icon slot="icon" class="u-m-r-20" name="laxian" custom-prefix="sws-icon" size="32"></u-icon>
			</u-cell-item>
			<u-cell-item hover-class="none" :value-style="valueStyle(mesArea)" arrow-direction="down" title="工段"
				:value="mesArea ? mesArea : '请选择工段'" @click="showMesArea">
				<u-icon slot="icon" class="u-m-r-20" name="gongduan" custom-prefix="sws-icon" size="32"></u-icon>
			</u-cell-item>
			<u-cell-item hover-class="none" :value-style="valueStyle(postName)" arrow-direction="down" title="岗位"
				:value="postName ? postName : '请选择岗位'" @click="showPosts">
				<u-icon slot="icon" class="u-m-r-20" name="gongxu" custom-prefix="sws-icon" size="32"></u-icon>
			</u-cell-item>
			<u-cell-item hover-class="none" :value-style="valueStyle(userName)" arrow-direction="down" title="人员"
				:value="userName ? userName : '请选择人员'" @click="showUsers">
				<u-icon slot="icon" class="u-m-r-20" name="ligangqueren" custom-prefix="sws-icon" size="32"></u-icon>
			</u-cell-item>
		</u-cell-group>
		<view class="btn-group sws-w100 sws-w100 u-flex u-row-between u-p-t-28 u-p-b-28">
			<u-button type="default" size="medium" @click="reset">重置</u-button>
			<u-button type="primary" size="medium" @click="commit">确认</u-button>
		</view>
		<u-select v-model="showSelect" :list="selectList" :title="title" @confirm="confirmSelect"></u-select>
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
				lineName: '',
				mesArea: '',
				postName: '',
				userName: '',
				title: '',
				selectList: [],
				showSelect: false
			}
		},
		computed: {
			...mapState(['factoryId']),
			valueStyle(val) {
				return (val) => {
					return val ? {
						color: '#606266',
						'font-size': '28rpx'
					} : {
						'font-size': '26rpx'
					}
				}
			}
		},
		methods: {
			showLines() { //获取拉线数据,展示拉线列表
				this.title = '请选择拉线'
				this.selectList = [{
					label: 'L1',
					value: 'L1',
					extra: 'line'
				}, {
					label: 'L2',
					value: 'L2',
					extra: 'line'
				}]
				this.showSelect = true
			},
			showMesArea() {
				this.title = "请选择工段"
				this.selectList = [{
					label: '前工序正极',
					value: '前工序正极',
					extra: 'mesArea'
				}, {
					label: '前工序负极',
					value: '前工序负极',
					extra: 'mesArea'
				}, {
					label: '中工序',
					value: '中工序',
					extra: 'mesArea'
				}, {
					label: '后工序',
					value: '后工序',
					extra: 'mesArea'
				}, {
					label: '模组',
					value: '模组',
					extra: 'mesArea'
				}, {
					label: 'PACK',
					value: 'PACK',
					extra: 'mesArea'
				}]
				this.showSelect = true
			},
			showPosts() {
				this.title = "请选择岗位"
				this.selectList = [{
					label: '卷绕',
					value: '卷绕',
					extra: 'post'
				}, {
					label: '预热热压',
					value: '预热热压',
					extra: 'post'
				}, {
					label: '班组长',
					value: '班组长',
					extra: 'post'
				}]
				this.showSelect = true
			},
			showUsers() {
				this.title = "请选择岗位"
				this.selectList = [{
					label: '张三',
					value: '张三',
					extra: 'userName'
				}, {
					label: '李四',
					value: '李四',
					extra: 'userName'
				}, {
					label: '王五',
					value: '王五',
					extra: 'userName'
				}]
				this.showSelect = true
			},
			confirmSelect(res) {
				let obj = res[0]
				switch (obj.extra) {
					case 'line':
						this.lineName = obj.value
						break
					case 'post':
						this.postName = obj.value
						break
					case 'mesArea': //工段
						this.mesArea = obj.value
						break
					case 'userName': //模板
						this.userName = obj.value
						break
				}
			},
			reset() {
				this.lineName = ''
				this.mesArea = ''
				this.postName = ''
				this.userName = ''
			},

		}
	}
</script>

<style lang="scss" scoped>
	.btn-group {
		text-indent: 20rpx;
		letter-spacing: 20rpx;
	}
</style>
