<template>
	<view class="sws-wh100 u-flex sws-flex-d-column sws-overflow-hidden">
		<view class="sws-w100 u-flex-1 u-p-l-20 u-p-r-20 u-p-b-30 sws-overflow-scroll-y">
			<u-form class="sws-w100" :model="dataList" label-width="200" label-align="center">

				<!--  -->

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
		<!-- 	<view class="sws-w100 u-p-28 btn-style">
			<u-button type="primary" @click="submit">确认</u-button>
		</view> -->

		<u-modal v-model="show" title="提示" :content="content" @confirm="confirm"></u-modal>
		<u-top-tips ref="uTips"></u-top-tips>
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
					picUrls: ''
				},
			}
		},

		onLoad: function() {
			let _self = this
			// 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
			this.getOpenerEventChannel().on('ddd', function(res) {
				this.model = res.data
				console.log(this.model, '1111111')
				let params = {
					id: this.model.id
				}
				_self.getAllUnchecklist(params)
			})
		},


		methods: {
			submit() {
				this.getAllUnchecklist()
			},

			getAllUnchecklist(params) {

				// let params = {
				// 	id: 319
				// }

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
			
			previewImage(dataList) {
				console.log(dataList,'item')
				// if (item.imgErr) return
				uni.previewImage({
					urls: dataList.picUrls
				})
			}




		},

	


	}
</script>

<style>
</style>
