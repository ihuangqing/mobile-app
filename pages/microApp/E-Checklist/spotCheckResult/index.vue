<!-- E-Checklist → 点检确认 -->
<template>
	<u-cell-group :border="false">
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
					:disabled="true" :showText="true" size="46"></u-switch>
			</u-cell-item>
			<view class="sws-w100 u-flex u-p-b-20 u-p-r-30 u-p-l-30" v-show="+item.standardType">
				<view class="ng-reason u-flex-1 u-line-1 u-p-10">
					<text class="u-type-info u-font-24">检测值：</text>
					<text>{{ item.resultVal }}</text>
				</view>
			</view>
			<view class="sws-w100 u-flex u-p-b-20 u-p-r-30 u-p-l-30" v-show="!item.checked">
				<view class="ng-reason u-flex-1 u-line-1 u-p-10">
					<text class="u-type-info u-font-24">NG原因：</text>
					<text>{{ item.exception }}</text>
				</view>
			</view>
		</view>
	</u-cell-group>
</template>

<script>
	export default {
		name: 'spot-check-result',
		props: {
			list: {
				type: Array,
				default: ()=> {
					return []
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.ng-reason {
		background-color: #ecf5ff;
	}
</style>
