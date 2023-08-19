<template>
	<view class="sws-wh100 u-flex sws-flex-d-column">
		<view class="sws-w100 sws-overflow-scroll-y u-flex-1 u-p-l-20 u-p-r-20 u-p-b-30" style="padding: 20rpx">
			<u-form ref="uForm" :model="dataList" label-width="200" label-align="center">
				<!-- 	<u-form-item label="点检设备" :border-bottom="false">
					<u-input type="text" :border="true" placeholder="二氧化碳(S1001)" v-model="model.purpose" />
				</u-form-item>
				<u-form-item label="点检位置" :border-bottom="false">
					<u-input type="text" :border="true" placeholder="中工序QC室旁" v-model="model.purpose" />
				</u-form-item>
				<u-form-item label="点检人" :border-bottom="false">
					<u-input type="text" :border="true" placeholder="杜柏森" v-model="model.purpose" />
				</u-form-item> -->
				<u-form-item label="点检NG项目" :border-bottom="false">
					<u-input :border="true" disabled placeholder="" v-model="dataList.itemName" type="text"></u-input>
				</u-form-item>
				<u-form-item label="点检NG原因" :border-bottom="false">
					<u-input :border="true" disabled placeholder="" v-model="dataList.exception" type="text">
					</u-input>
				</u-form-item>
				<u-form-item required label="改善措施" :border-bottom="false">
					<u-input :border="true" disabled placeholder="请输入改善措施,最多500字" v-model="dataList.improveDesc"
						type="textarea">
					</u-input>
				</u-form-item>
				<u-form-item required label="改善证据" :border-bottom="false" disabled>
						<view class="u-flex sws-flex-d-column u-col-top u-row-center u-m-r-20"
							@click.stop="previewImage(dataList)"  v-for="(item, index) in dataList.picUrls.slice(0, 3)" :key="index">
							<u-image class="u-image" width="150" height="150" border-radius="16"
								v-if="item && item.length" :src="item"
								@error="item.imgErr = true">
								<view slot="error" class="u-flex sws-flex-d-column">
									<u-icon name="info-circle" size="44"></u-icon>
									<view class="u-font-24 u-m-t-10">加载失败</view>
								</view>
							</u-image>
							<u-icon v-else name="zhanweitu" style='margin-top: 30rpx;' custom-prefix="sws-icon" size="150"
								color="#ebebeb">
							</u-icon>
						
						</view>
				</u-form-item>
				<u-form-item :border-bottom="false" disabled style='margin-left: 200rpx;' >
						<view class="u-flex sws-flex-d-column u-col-top u-row-center u-m-r-20"
							@click.stop="previewImage(dataList)"  v-for="(item, index) in dataList.picUrls.slice(3, 6)" :key="index">
							<u-image class="u-image" width="150" height="150" border-radius="16"
								v-if="item && item.length" :src="item"
								@error="item.imgErr = true">
								<view slot="error" class="u-flex sws-flex-d-column">
									<u-icon name="info-circle" size="44"></u-icon>
									<view class="u-font-24 u-m-t-10">加载失败</view>
								</view>
							</u-image>
							<u-icon v-else name="zhanweitu" style='margin-top: 30rpx;' custom-prefix="sws-icon" size="150"
								color="#ebebeb">
							</u-icon>
						</view>
				</u-form-item>
				<u-form-item :border-bottom="false" disabled style='margin-left: 200rpx;' >
						<view class="u-flex sws-flex-d-column u-col-top u-row-center u-m-r-20"
							@click.stop="previewImage(dataList)"  v-for="(item, index) in dataList.picUrls.slice(6, 9)" :key="index">
							<u-image class="u-image" width="150" height="150" border-radius="16"
								v-if="item && item.length" :src="item"
								@error="item.imgErr = true">
								<view slot="error" class="u-flex sws-flex-d-column">
									<u-icon name="info-circle" size="44"></u-icon>
									<view class="u-font-24 u-m-t-10">加载失败</view>
								</view>
							</u-image>
							<u-icon v-else name="zhanweitu" style='margin-top: 30rpx;' custom-prefix="sws-icon" size="150"
								color="#ebebeb">
							</u-icon>
						</view>
				</u-form-item>

			</u-form>
		</view>
		<view class="btn-group sws-w100 u-flex u-row-between u-p-t-28 u-p-b-28">
			<u-button type="error" class="sws-line-h-repair" size="medium" @click="reset">驳回</u-button>
			<u-button type="primary" class="sws-line-h-repair" size="medium" @click="commit">提交</u-button>
		</view>


		<u-top-tips ref="uTips"></u-top-tips>
		<u-modal v-model="show" title="提示" :content="content" @confirm="confirm"></u-modal>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				dataList: {
					itemName: '',
					exception: '',
					improveDesc: '',
					// src:'http://10.201.88.55:8899/file-api//sws/slideShow/152/image/LN4nQORE5.jpg',
					picUrls: '',


				},
				show: false,
				content: ''
			}
		},

		onLoad: function() {
			let _self = this
			// 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
			this.getOpenerEventChannel().on('spotCheckDataList', function(res) {
				_self.model = res.data
				console.log(this.model, '1111111222222222')
				// let params = {
				// 	id: 319,
				// }
				_self.getAllUnchecklist1()
			})
		},
		methods: {
			// 确认
			commit() {
				let params = {
					id: this.model.id,
					taskStatus: 2
				}

				this.$u.api.improveTaskjudge(params).then(res => {
					if (res.msgCode === '000000') {
						this.content = '点检改善确认成功'
						this.show = true

					} else {
						this.$refs.uTips.show({
							title: `点检确认失败，原因：${res.message}`,
							type: 'error',
							duration: 2300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})

			},
			// 驳回
			reset() {
				let params = {
					id: this.model.id,
					taskStatus: 3
				}
				this.$u.api.improveTaskjudge(params).then(res => {
					if (res.msgCode === '000000') {
						this.content = '点检改善驳回成功'
						this.show = true

					} else {
						this.$refs.uTips.show({
							title: `点检驳回失败，原因：${res.message}`,
							type: 'error',
							duration: 2300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},

			previewImage(dataList) {
				console.log(dataList, 'item')
				// if (item.imgErr) return
				uni.previewImage({
					urls: dataList.picUrls
				})
			},



			getAllUnchecklist1() {
				console.log(this.model, 'this.model')
				let params = {
					id: this.model.id,
				}

				this.$u.api.improveDetailListdddd(params).then(res => {
					if (res.msgCode === '000000') {
						this.dataList = res.data
						console.log(this.dataList, 'this.dataList')

					} else {
						this.$refs.uTips.show({
							title: `点检改善详情获取失败，原因：${res.message}`,
							type: 'error',
							duration: 2300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},

			confirm() {
				const id = this.model.id
				const eventChannel = this.getOpenerEventChannel()
				eventChannel.emit('acceptDataFromOpenedPage', {
					data: id
				})
				uni.navigateBack()
			},

			goToCheckConfirm(data) {
				let _self = this
				uni.navigateTo({
					url: '/pages/microApp/E-Checklist/spotCheckConfirm/confirmDetail/index',
					events: {
						acceptDataFromOpenedPage: function(res) { // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
							_self.dataList.map((item, index) => {
								if (item.id === res.data) {
									_self.dataList.splice(index, 1)
								}
							})
						}
					},
					success: function(res) {
						res.eventChannel.emit('acceptDataFromOpenerPage', { // 通过eventChannel向被打开页面传送数据
							data
						})
					}
				})
			}




		}

	}
</script>

<style>
</style>
