<!-- dips → 备品备件 → 工治具详情	 -->
<template>
	<view class="sws-wh100">
		<u-image v-show="showImage" width="100%" height="400rpx" :src="src" @load="showImage = true"></u-image>
		<u-cell-group :border="false">
			<u-cell-item class="u-p-t-16 u-p-b-16" title="治具名称" :value="fixture.fixtureName" hover-class="none"
				:arrow="false"></u-cell-item>
			<u-cell-item class="u-p-t-16 u-p-b-16" title="治具编码" :value="fixture.fixtureCode" hover-class="none"
				:arrow="false"></u-cell-item>
			<u-cell-item class="u-p-t-16 u-p-b-16" title="治具类型" :value="fixture.fixtureType" hover-class="none"
				:arrow="false"></u-cell-item>
			<u-cell-item class="u-p-t-16 u-p-b-16" title="库存状态" :value="fixture.storeState === '0' ? '出库': '在库'"
				:value-style="fixture.storeState === '0' ? {color: '#fa3534'} : {color: '#19be6b'}" hover-class="none"
				:arrow="false"></u-cell-item>
			<u-cell-item class="u-p-t-16 u-p-b-16" title="库存数量" :value="fixture.qty" hover-class="none" :arrow="false">
			</u-cell-item>
			<u-cell-item class="u-p-t-16 u-p-b-16" title="金额" :value="fixture.price" hover-class="none" :arrow="false">
			</u-cell-item>
			<u-cell-item class="u-p-t-16 u-p-b-16" title="制作日期" :value="fixture.productionDate" hover-class="none"
				:arrow="false"></u-cell-item>
			<u-cell-item class="u-p-t-16 u-p-b-16" title="有效日期" :value="fixture.effectiveDate" hover-class="none"
				:arrow="false"></u-cell-item>
			<u-cell-item class="u-p-t-16 u-p-b-16" title="申请人" :value="fixture.applicantName" hover-class="none"
				:arrow="false"></u-cell-item>
			<u-cell-item class="u-p-t-16 u-p-b-16" title="责任人"
				:value="fixture.personResponsible ? fixture.personResponsible.map(user => user.userName).join('、') : ''"
				:value-style="{'padding-left': '40rpx'}" hover-class="none" :arrow="false"></u-cell-item>
			<u-cell-item class="u-p-t-16 u-p-b-16" title="责任主管"
				:value="fixture.personInCharge ? fixture.personInCharge.map(user => user.userName).join('、') : ''"
				hover-class="none" :arrow="false"></u-cell-item>
			<u-cell-item class="u-p-t-16 u-p-b-16" title="理论使用次数" :value="fixture.theoreticalTimes + '次'"
				hover-class="none" :arrow="false"></u-cell-item>
			<u-cell-item class="u-p-t-16 u-p-b-16" title="存放位置" :value="fixture.positionName" hover-class="none"
				:arrow="false">
			</u-cell-item>
			<u-cell-item class="u-p-t-16 u-p-b-16" title="供应商" :value="fixture.supplierName" hover-class="none"
				:arrow="false"></u-cell-item>
			<u-cell-item class="u-p-t-16 u-p-b-16" title="验收日期" :value="fixture.supplierName" hover-class="none"
				:arrow="false">
			</u-cell-item>
			<u-cell-item class="u-p-t-16 u-p-b-16" title="版本" :value="fixture.version" hover-class="none" :border-bottom="false"
				:arrow="false"></u-cell-item>
		</u-cell-group>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				src: '',
				showImage: false,
				fixture: {}
			}
		},
		onLoad() {
			let _self = this
			this.getOpenerEventChannel().on('acceptDataFromOpenerPage', function(data) {
				_self.fixture = {
					...data.fixture
				}
				_self.getDetailImages(_self.fixture.id)
			})
		},
		methods: {
			getDetailImages(id) {
				this.$u.api.getFixtureImage(id).then(res => {
					if (res.msgCode === '000000') {
						if (res.data.length) {
							// this.src = 'http://10.201.88.55:8899/file-api//dips/spareParts/642/image/hMDpufjYc.jpg'
							this.src = res.data[0].url 
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
