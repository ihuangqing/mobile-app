<!-- dips → 备品备件 → 物料详情	 -->
<template>
	<view class="sws-wh100">
		<u-image v-show="showImage" width="100%" height="400rpx" :src="src" @load="showImage = true"></u-image>
		<u-cell-group :border="false">
			<u-cell-item class="u-p-t-16 u-p-b-16" title="物料名称" :value="material.itemName" hover-class="none"
				:arrow="false"></u-cell-item>
			<u-cell-item class="u-p-t-16 u-p-b-16" title="物料编码" :value="material.itemCode" hover-class="none"
				:arrow="false"></u-cell-item>
			<u-cell-item class="u-p-t-16 u-p-b-16" title="物料大类" :value="material.matCategory" hover-class="none"
				:arrow="false"></u-cell-item>
			<u-cell-item class="u-p-t-16 u-p-b-16" title="物料类型" :value="material.itemType" hover-class="none"
				:arrow="false"></u-cell-item>
			<u-cell-item class="u-p-t-16 u-p-b-16" title="库存数量" :value="material.qty + material.unit" hover-class="none"
				:arrow="false"></u-cell-item>
			<u-cell-item class="u-p-t-16 u-p-b-16" title="安全库存" :value="material.safetyQty + material.unit"
				hover-class="none" :arrow="false"></u-cell-item>
			<u-cell-item class="u-p-t-16 u-p-b-16" title="规格" :value="material.standard" hover-class="none"
				:arrow="false"></u-cell-item>
			<u-cell-item class="u-p-t-16 u-p-b-16" title="价格" :value="material.unitPrice" hover-class="none"
				:arrow="false"></u-cell-item>
			<u-cell-item class="u-p-t-16 u-p-b-16" title="设计寿命"
				:value="computedLife(material.designLife, material.lifeUnit)" hover-class="none" :arrow="false">
			</u-cell-item>
			<u-cell-item class="u-p-t-16 u-p-b-16" title="寿命类型" :value="computedLifeType(material.lifeType)"
				hover-class="none" :arrow="false"></u-cell-item>
			<u-cell-item class="u-p-t-16 u-p-b-16" title="管控方式" :value="computedCtrlMode(material.controlMode)"
				hover-class="none" :arrow="false"></u-cell-item>
			<u-cell-item class="u-p-t-16 u-p-b-16" title="所属部门" :value="material.deptName" hover-class="none"
				:arrow="false"></u-cell-item>
			<u-cell-item class="u-p-t-16 u-p-b-16" title="库位" :value="material.positionName" hover-class="none"
				:arrow="false"></u-cell-item>
			<u-cell-item class="u-p-t-16 u-p-b-16" title="货架" :value="material.shelfName" hover-class="none"
				:arrow="false"></u-cell-item>
			<u-cell-item class="u-p-t-16 u-p-b-16" title="品牌" :value="material.brand" hover-class="none" :arrow="false">
			</u-cell-item>
			<u-cell-item class="u-p-t-16 u-p-b-16" title="供应商" :value="material.supplierName" hover-class="none"
				:arrow="false"></u-cell-item>
			<u-cell-item class="u-p-t-16 u-p-b-16" title="用途" :value="material.usage" hover-class="none" :arrow="false">
			</u-cell-item>
			<u-cell-item class="u-p-t-16 u-p-b-16" title="重要性" :value="material.importance" hover-class="none"
				:arrow="false"></u-cell-item>
			<u-cell-item class="u-p-t-16 u-p-b-16" title="替代品牌" :value="material.alterMatModel" hover-class="none"
				:arrow="false"></u-cell-item>
			<u-cell-item class="u-p-t-16 u-p-b-16" title="采购周期" :value="material.alterMatPurchaseCycle"
				hover-class="none" :border-bottom="false" :arrow="false"></u-cell-item>
		</u-cell-group>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				src: '',
				showImage: false,
				material: {}
			}
		},
		onLoad(options) {
			this.material = {
				...options
			}
			this.getDetailImages(options.matId)
		},
		computed: {
			computedCtrlMode(ctrlMode) {
				return ctrlMode => {
					switch (ctrlMode) {
						case 'entity':
							return '个体'
							break;
						case 'batch':
							return '批量'
							break;
					}
				}
			},
			computedLife(life, unit) {
				return (life, unit) => {
					switch (unit) {
						case 'time':
							return life + '次'
							break;
						case 'hour':
							return life + '小时'
							break;
					}
				}
			},
			computedLifeType(lifeType) {
				return (lifeType) => {
					switch (lifeType) {
						case 'useTime':
							return '计次'
							break;
						case 'productTime':
							return '产能计时'
							break;
						case 'upTime':
							return '上机计时'
							break;
					}
				}
			}
		},
		methods: {
			getDetailImages(matId) {
				this.$u.api.getMaterialImage(matId).then(res => {
					if (res.msgCode === '000000') {
						if (res.data.length) {
							this.src = res.data[0]
								.url //'http://10.201.88.55:8899/file-api//dips/spareParts/642/image/hMDpufjYc.jpg'
						}
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			}
		}
	}
</script>

<style>
</style>
