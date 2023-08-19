<!-- 通用页面 → 选择列表 -->
<template>
	<view class="u-rela sws-wh100 u-flex sws-flex-d-column sws-overflow-hidden">
		<view class="sws-w100 u-p-20">
			<u-search placeholder="请输入检索值" shape="spuare" v-model="keyword" @change="filterListByLocal"
				@custom="getProjectList" @search='getProjectList(keyword)'>
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
				let params = {}
				if (data) {
					params = {
						query: {
							page: 1,
							limit: 1000
						},
						body: {
							itemCode: '',
							projectName: data,
							projectCode: '',
						}
					}
				} else {
					params = {
						query: {
							page: 1,
							limit: 1000
						},
						body: {
							itemCode: '',
							projectName: '',
							projectCode: '',
						}
					}
				}

				this.$u.api.getCustomerProjectApi(params).then(res => {
					if (res.msgCode === '000000') {
						if (res.data && res.data.data.length) {
							this.list = res.data.data.map(item => {
								return {
									name: item.projectName + '（' + item.projectCode + '）',
									value: item.projectCode,
									checked: false,
									// desc: item.projectCode
								}
							})
							this.list = this.duplicateRemoval(this.list)
							// console.log('list', list)
							this.list = this.list.filter(item => {
								return item.name && item.value
							})
							this.tempList = this.list

						}
						// console.log('项目接口返回res', res)


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
			async filterList() {
				// if (this.filterFunc) {
				// 	this.list = await this.filterFunc(this.keyword)
				// } else {
				this.filterListByLocal()
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