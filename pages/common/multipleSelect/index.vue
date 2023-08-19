<!-- 通用页面 → 选择列表 -->
<template>
	<view class="u-rela sws-wh100 u-flex sws-flex-d-column sws-overflow-hidden">
		<view class="sws-w100 u-p-20">
			<u-search placeholder="请输入检索值" shape="spuare" v-model="keyword" @change="filterListByLocal"
				@custom="filterList" @search='filterList(keyword)'>
			</u-search>
		</view>
		<view class="item-list u-rela u-flex-1 sws-w100" v-if="isRadio">
			<view class="u-p-t-26 u-p-r-40 u-p-b-26 u-p-l-40 u-border-top" v-for="(item, index) in list" :key="index"
				@click="curVal = item.name">
				<u-radio-group v-model="curVal">
					<u-radio :name="item.name">{{item.name}}</u-radio>
				</u-radio-group>
				<view v-show="item.desc" class="u-p-l-50 u-font-24 u-type-info">{{ item.desc }}</view>
			</view>
		</view>
		<view v-else class="item-list u-rela u-flex-1 sws-w100">
			<view class="u-p-t-26 u-p-r-40 u-p-b-26 u-p-l-40 u-border-top" v-for="(item, index) in list" :key="index">
				<u-checkbox-group class="sws-w100" :wrap="true" width="100%" shape="round"
					@change="checkboxGroupChange">
					<u-checkbox v-model="item.checked" :name="item.name">{{item.name}}</u-checkbox>
				</u-checkbox-group>
				<!-- <view v-show="item.desc" class="u-p-l-50 u-font-24 u-type-info">{{ item.desc }}</view> -->
			</view>
		</view>
		<view class="check-confirm u-p-28">
			<u-button type="primary" @click="confirm">确认</u-button>
		</view>
		<u-top-tips ref="uTips"></u-top-tips>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				hasSearch: false,
				keyword: '',
				curVal: '',
				isRadio: false,
				list: []
			}
		},
		onLoad() {
			let _self = this
			const eventChannel = this.getOpenerEventChannel()
			eventChannel.on('acceptDataFromOpend', ({
				title,
				items,
				hasSearch,
				isRadio,
				filterFunc
			}) => {
				uni.setNavigationBarTitle({
					title
				})
				// console.log('title', title)
				// console.log('items', items)
				console.log('filterFunc', filterFunc)
				_self.tempList = items
				_self.list = items
				console.log('_self.list', _self.list)
				_self.hasSearch = hasSearch
				_self.isRadio = isRadio
				_self.filterFunc = filterFunc
				console.log('filterFunc111', _self.filterFunc)
			})
		},
		methods: {
			checkboxGroupChange(value) {

			},
			filterListByLocal() { //本地过滤
				// if (this.filterFunc) return
				this.list = this.tempList.filter(item => {
					return item.name.includes(this.keyword)
				})
			},
			async filterList() {
				let that = this
				if (that.filterFunc) {
					that.list = await that.filterFunc(that.keyword)
				} else {
					that.filterListByLocal()
				}
			},
			confirm() {
				let selected = []
				if (this.isRadio) {
					selected = this.list.filter(item => {
						return item.name == this.curVal.trim()
					})
				} else {
					selected = this.list.filter(item => { //直接返回选中对象，便于拓展
						return item.checked
					})
					// selected = this.list.filter(item => {
					// 	return item.name == this.curVal.trim()
					// })
				}
				if (selected.length > 0) {
					const eventChannel = this.getOpenerEventChannel()
					eventChannel.emit('acceptDataFromSendPage', {
						data: selected
					})
					uni.navigateBack()
				} else {
					this.$refs.uTips.show({
						title: '请选择',
						type: 'warning',
						duration: '2300'
					})
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.item-list {
		overflow-y: scroll;
	}

	::v-deep .u-checkbox__label {
		flex: 1;
		margin-left: 20rpx;
	}

	.check-confirm {
		width: 100%;
		letter-spacing: 20rpx;
		text-indent: 20rpx;
	}
</style>