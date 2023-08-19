<!-- dips → 工治具保养 -->
<template>
	<view class="u-rela sws-wh100 u-flex sws-flex-d-column sws-overflow-hidden">
		<u-cell-group :border="false" class="check-list u-rela sws-wh100 u-flex-1">
			<view v-for="(item, index) in list" :key="index">
				<u-cell-item class="u-flex sws-w100 sws-overflow-hidden" hover-class="none" :arrow="false"
					:use-label-slot="true" :border-top="true" :border-bottom="false" :title-style="{flex: '1'}"
					:value-style="{flex: 'none'}">
					<view slot="icon" class="u-m-r-20 u-font-32">
						{{ common.serialNumFormatter(index) }}
					</view>
					<view slot="title" class="u-flex-1">
						<view class="u-main-color u-font-32">{{ item.itemName }}</view>
					</view>
					<u-switch slot="right-icon" v-model="item.checked" inactive-color="#fa3534" active-color="#19be6b"
						:showText="true" size="46" inactive-value="0" active-value="1"
						@change="switchChange($event, item)"></u-switch>
				</u-cell-item>
				<view class="sws-w100 u-flex u-p-b-20 u-p-r-30 u-p-l-30">
					<view class="tools-standard u-flex-1 u-line-1 u-p-10" @click="showDetail('保养工具', item.tools)">
						<text class="u-type-info">工具：</text>
						<text>{{ item.tools }}</text>
					</view>
					<view class="tools-standard u-flex-1 u-line-1 u-p-10" @click="showDetail('保养标准', item.standard)">
						<text class="u-type-info">标准：</text>
						<text>{{ item.standard }}</text>
					</view>
				</view>
				<view class="u-p-l-30 u-p-r-30 u-p-b-20" v-show="!item.checked">
					<u-input type="textarea" height="40" :auto-height="true" :border="true" placeholder="请输入NG原因"
						v-model="item.exception">
					</u-input>
				</view>
			</view>
		</u-cell-group>
		<view class="check-confirm u-p-28">
			<u-button type="primary" @click="commit">确认</u-button>
		</view>
		<u-modal v-model="showModal" :title="modalTitle" :content="modalContent" @confirm="confirm"></u-modal>
		<u-top-tips ref="uTips"></u-top-tips>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: [],
				modalTitle: '',
				modalContent: '',
				showModal: false,
			}
		},
		onLoad(options) {
			this.getMaintainCheckList(options.id)
		},
		methods: {
			commit() {
				for (let i in this.list) {
					if (!Number(this.list[i].state) && !this.list[i].exception.trim()) {
						this.$refs.uTips.show({
							title: '结果为NG的点检项目需要填写NG原因',
							type: 'warning',
							duration: 2300
						})
						return
					}
				}

				const params = {
					id: this.id, // 保养任务id
					itemList: this.list
				}

				this.$u.api.putMaintainCheck(params).then(res => {
					if (res.msgCode === '000000') {
						this.modalTitle = '提示'
						this.modalContent = '保养成功'
						this.showModal = true
					} else {
						this.$refs.uTips.show({
							title: `保养失败，原因：${ res.message }`,
							type: 'error',
							duration: 2300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			confirm() {
				if (this.modalContent.includes('保养成功')) {
					uni.navigateBack()
				}
			},
			switchChange(value, item) {
				item.state = value
			},
			getMaintainCheckList(id) {
				this.$u.api.getMaintainCheckList(id).then(res => {
					if (res.msgCode === '000000') {
						this.id = res.data.id
						this.list = res.data.itemList
					} else {
						this.$refs.uTips.show({
							title: `保养明细获取失败，原因：${ res.message }`,
							type: 'error',
							duration: 2300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			showDetail(title, content) {
				this.modalTitle = title
				this.modalContent = content
				this.showModal = true
			},
		}
	}
</script>

<style lang="scss" scoped>
	.check-list {
		overflow-y: scroll;
	}

	.tools-standard {
		background-color: #ecf5ff;
	}

	.check-confirm {
		width: 100%;
		letter-spacing: 20rpx;
		text-indent: 20rpx;
	}
</style>
