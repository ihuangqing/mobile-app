<!-- dips → 库位管理 → 新增编辑 -->
<template>
	<view class="sws-wh100 u-flex sws-flex-d-column sws-overflow-hidden">
		<view class="sws-w100 u-flex-1 u-p-l-20 u-p-r-20 u-p-b-30 sws-overflow-scroll-y">
			<u-form class="sws-w100" :model="model" label-width="150" label-align="center">
				<u-form-item label="父级仓储" :border-bottom="false">
					<u-input :border="true" disabled placeholder="" v-model="model.xx" type="text"></u-input>
				</u-form-item>
				<u-form-item required label="仓储名称" :border-bottom="false">
					<u-input :border="true" placeholder="请输入仓库名称" v-model="model.deviceCategory" type="text">
					</u-input>
				</u-form-item>
				<u-form-item label="仓储位置" :border-bottom="false">
					<u-input :border="true" placeholder="请选择仓储位置" v-model="model.lineName" type="select"></u-input>
				</u-form-item>
				<u-form-item required label="管理员" :border-bottom="false">
					<u-input :border="true" placeholder="请选择管理员(最多两位)" v-model="model.repairName" type="text"></u-input>
				</u-form-item>
				<u-form-item label="容量" :border-bottom="false">
					<u-input :border="true" placeholder="" v-model="model.telephone" type="number"></u-input>
				</u-form-item>
				<u-form-item label="备注" :border-bottom="false">
					<u-input height="88" type="textarea" :border="true" placeholder=""
						v-model="model.question" />
				</u-form-item>
			</u-form>
		</view>
		<view class="sws-w100 u-p-28">
			<u-button type="primary" @click="submit">确认</u-button>
		</view>
		<u-modal v-model="showModal" :content="modalContent" @confirm="modalConfirm"></u-modal>
		<u-top-tips ref="uTips"></u-top-tips>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				model: {},
				modalContent: '',
				showModal: false
			}
		},
		onLoad(options) {
			uni.setNavigationBarTitle({
				title: options.type == 1 ? '新增' : '编辑'
			})
		}
	}
</script>

<style>
</style>
