<!-- 线别选择列表 -->
<template>
	<view class="u-rela sws-wh100 u-flex sws-flex-d-column sws-overflow-hidden">
		<view class="sws-w100 u-p-20">
			<u-search :show-action='false' placeholder="请输入检索值" shape="spuare" v-model="keyword"
				@change="filterListByLocal(keyword)" @search="filterListByLocal(keyword)">
			</u-search>
		</view>
		<view class="item-list u-rela u-flex-1 sws-w100">
			<view class="u-p-t-26 u-p-r-40 u-p-b-26 u-p-l-40 u-border-top" v-for="(item, index) in list" :key="index"
				@click="curVal = item.name">
				<u-radio-group v-model="curVal">
					<u-radio :name="item.name">{{item.name}}</u-radio>
				</u-radio-group>
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
				list: [],
				tempList: [],
			}
		},
		onLoad() {
			this.getProjectList()
		},
		methods: {
			getProjectList(data) {
				let query = {}
				if (data) {
					query = {
						lineName: data
					}
				} else {
					query = {
						lineCode: '',
						lineName: ''
					}
				}
				this.$u.api.getAllLines(query).then(res => {
					if (res.msgCode === '000000') {
						if (res.data && res.data.length) {
							this.list = res.data.map(item => {
								return {
									name: item.lineCode + '（' + item.lineName + '）',
									// lineCode: userName + '（' + item.lineName + '）',
									value: item,
									desc: item.lineName,
									checked: false
								}
							})
							this.list = this.duplicateRemoval(this.list)
							console.log('list', this.list)
							this.list = this.list.filter(item => {
								return item.name && item.value
							})
							this.tempList = this.list
						} else {
							this.$refs.uTips.show({
								title: '线别列表获取失败',
								type: 'error',
								duration: 2300
							})
						}


					} else {

						this.$refs.uTips.show({
							title: `项目列表获取失败，原因：${ res.message }`,
							type: 'error',
							duration: 2300
						})
					}
				}).catch(err => {

					this.common.sysErrToast(this, err)
				})

			},
			filterListByLocal() { //本地过滤
				// if (this.filterFunc) return
				this.list = this.tempList.filter(item => {
					return item.name.includes(this.keyword)
				})
			},
			async filterList(data) {
				this.getProjectList(data)
				// if (this.filterFunc) {
				// 	this.list = await this.filterFunc(this.keyword)
				// } else {
				// this.filterListByLocal()
				// }
			},
			confirm() {
				let selected = []
				// 	if (this.isRadio) {
				selected = this.list.filter(item => {
					return item.name == this.curVal.trim()
				})
				// 	} else {
				// 		selected = this.list.filter(item => { //直接返回选中对象，便于拓展
				// 			return item.checked
				// 		})
				// 	}
				if (selected.length > 0) {

					const eventChannel = this.getOpenerEventChannel()
					eventChannel.emit('acceptDataFromPrjectPage', {
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

			},
			// 对象数组去重
			duplicateRemoval(array) {
				const newArray = []
				for (const item of array) {
					// 使用JSON.stringfy()方法将数组和数组元素转换为JSON字符串之后再使用includes()方法进行判断
					if (JSON.stringify(newArray).includes(JSON.stringify(item))) {
						continue
					} else {
						// 不存在的添加到数组中
						newArray.push(item)
					}
				}
				return newArray
			},
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