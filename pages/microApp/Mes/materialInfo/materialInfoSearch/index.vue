<!-- 物料信息--搜索 -->
<template>
	<view class="sws-wh100 u-flex sws-flex-d-column">
		<view class="sws-w100 u-flex-1 u-p-40 sws-overflow-scroll-y">
			<view class="input-wrap">
				<u-cell-group :border="false">
					<u-cell-item required hover-class="none" :arrow="false" title="产品条码" :value-style="{flex: 0}"
						class="u-p-r-20">
						<view slot="right-icon" class="u-flex u-flex-1">
							<u-input type="text" placeholder="请输入/扫描产品条码" inputAlign="right" v-model="productSn">
							</u-input>
							<u-icon class="u-m-l-10" name="saoma" custom-prefix="sws-icon" size="44" color="#2979ff"
								@click="scanCode">
							</u-icon>
						</view>
					</u-cell-item>
					<u-cell-item required hover-class="none" :arrow="false" :title="ifUnBinding"
						:value-style="{flex: 0}" class="u-p-r-20">
						<view slot="right-icon" class="u-flex u-flex-1 u-row-right">
							<u-switch inactive-value="N" active-value="Y" v-model="unBindChecked" :showText="true"
								okText="是" ngText="否" @change="switchBind"></u-switch>
						</view>
					</u-cell-item>

					<u-cell-item required hover-class="none" :arrow="false" :title="ifShowGroupModel"
						:value-style="{flex: 0}" class="u-p-r-20">
						<view slot="right-icon" class="u-flex u-flex-1 u-row-right">
							<u-switch inactive-value="N" active-value="Y" v-model="groupModelChecked" :showText="true"
								okText="是" ngText="否" @change="switchGroupModel"></u-switch>
						</view>
					</u-cell-item>
				</u-cell-group>
			</view>
		</view>
		<view class="sws-w100 u-p-b-40 u-p-l-40 u-p-r-40">
			<u-button type="primary" class="btn-style" @click="confirmOperate">确定
			</u-button>
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
				ifUnBinding: '是否解绑',
				ifShowGroupModel: '是否只显示模组',
				unBindChecked: false,
				groupModelChecked: false,
				productSn: '',
				GroupModelCheckedValue: '', //是否只显示模组-选中后的值
				unBindCheckedValue: '', //是否解绑-选中后的值

			}
		},
		created() {},
		computed: {
			...mapState(['userInfo']),
		},
		methods: {
			switchBind(value) {
				this.unBindCheckedValue = value
			},
			switchGroupModel(value) {
				this.GroupModelCheckedValue = value
			},

			confirmOperate() { //确定
				if (!this.productSn) {
					this.$refs.uTips.show({
						title: '请输入产品条码',
						type: 'warning',
						duration: 2300
					})
					return
				}

				const _self = this
				const eventChannel = this.getOpenerEventChannel()
				let isBindingVal = _self.unBindCheckedValue === '' ? 'N' : _self.unBindCheckedValue
				let isModuleVal = _self.GroupModelCheckedValue === '' ? 'N' : _self.GroupModelCheckedValue
				eventChannel.emit('acceptDataFromOpenedPage', {
					params: {
						productSn: _self.productSn,
						isBinding: isBindingVal,
						isModule: isModuleVal
					}
				})
				uni.navigateBack()

			},
			scanCode(type) { //扫码
				this.common.scanCode(this).then(res => {
					this.productSn = res
					// this.getProductList(this.keyword)
				})
			},
		},


	}
</script>

<style lang="scss" scoped>
	.input-wrap {
		height: 100%;
		overflow: hidden;
	}

	.btn-style {
		letter-spacing: 20rpx;
		text-indent: 20rpx;
	}

	::v-deep .u-cell_right {
		flex: 1;
	}
</style>
