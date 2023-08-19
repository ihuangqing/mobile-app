<!-- 人岗匹配 → 穿戴情况查询 -->
<template>
	<view class="page-wrap u-flex">
		<view class="plan-search u-p-20 u-flex">
			<u-search placeholder="请输入员工姓名" shape="square" v-model="keyword" @search="searchByUserName" @custom="searchByUserName"></u-search>
			<!-- <view class="u-flex u-row-center u-m-l-20 u-p-r-20" @click="goSearchMore">
				<u-icon name="more-dot-fill" color="#303133" size="30"></u-icon>
			</view> -->
		</view>
		<view class="sws-w100 u-border-bottom">
			<u-tabs :list="tabList" :is-scroll="false" count="count" :offset="[5, 56]" duration="0.3" :current="current"
				@change="change"></u-tabs>
		</view>
		<view class="plan-list sws-w100 u-flex-1">
			<u-cell-group :border="false">
				<view v-for="(item, index) in list" :key="index">
					<u-cell-item hover-class="none" :arrow="false" :title-style="{flex: 1}"
						:value-style="{flex: 'none', 'padding-left': '40rpx'}">
						<view slot="title" class="u-flex u-row-between">
							<view class="u-type-primary">{{ item.userName }}</view>
							<view class="u-font-24">{{ item.account }}</view>
							<view class="u-font-24">{{ item.posts && item.posts.map(post => post.postName).join('、') }}
							</view>
						</view>
						<view slot="label">
							<text v-for="(okWear, okIndex) in item.okWears"
								:key="okIndex">{{okWear}}{{(okIndex === item.okWears.length -1 && Number(item.state)) ? '' : '、'}}</text>
							<text v-if="item.ngWears" class="u-type-error" v-for="(ngWear, ngIndex) in item.ngWears"
								:key="ngIndex + Math.random()">{{ngWear}}{{ngIndex === item.ngWears.length -1 ? '' : '、'}}</text>
						</view>
						<u-icon :name="Number(item.state) ? 'OK' : 'NG' " custom-prefix="sws-icon"
							:color="Number(item.state) ? '#00b578' : '#ff6110' " size="42">
						</u-icon>
					</u-cell-item>
					<u-gap height="20" bg-color="#ededed"></u-gap>
				</view>
			</u-cell-group>
		</view>
		<no-data v-show="showNoData"></no-data>
		<u-top-tips ref="uTips"></u-top-tips>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'

	import noData from '../../../components/noData/index.vue'

	export default {
		components: {
			noData
		},
		data() {
			return {
				keyword: '',
				tabList: [{
					name: '全部'
				}, {
					name: 'OK'
				}, {
					name: 'NG',
					count: 0
				}],
				current: 0,
				list: [],
				showNoData: false
			}
		},
		onLoad() {
			this.getUserWearInfo()
		},
		methods: {
			getUserWearInfo() {
				this.$u.api.getUserWearInfo().then(res => {
					if (res.msgCode === '000000') {
						this.dataList = res.data
						if (this.dataList.length > 0) {
							this.renderList()
						} else {
							this.showNoData = true
						}
					} else {
						this.$refs.uTips.show({
							title: `人员穿戴情况查询失败，原因：${res.message}`,
							type: 'error',
							duration: 2300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			searchByUserName() {
				this.current = 0
				this.list = this.dataList.filter(user => {
					return !this.keyword || user.userName === this.keyword
				})
			},
			change(index) {
				this.current = index
				switch (index) {
					case 0:
						this.renderList()
						break
					case 1:
						this.renderList('1')
						break
					case 2:
						this.renderList('0')
						break
				}
			},
			renderList(state) {
				this.tabList[2].count = this.dataList.filter(item => item.state === '0').length
				this.list = this.dataList.filter(item => {
					return !state || item.state == state
				})
			},
			goSearchMore() { //跳转至更多查询页面
				let _self = this
				uni.navigateTo({
					url: `/pages/microApp/Fit-PersonJob/userWearInfo/filter/index`,
					events: {
						acceptDataFromOpenedPage: function(res) { // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
							_self.getCheckHistory(res.params)
						}
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page-wrap {
		width: 100%;
		height: 100%;
		overflow: hidden;
		flex-direction: column;


		.plan-search {
			width: 100%;
		}

		.plan-filter {
			position: relative;
			width: 100%;

			.dropdown {
				width: 100%;
			}

			.filter-more {
				position: absolute;
				right: 0;
				width: 25%;
				height: 100%;
				text-align: center;
				background-color: #fff;
				z-index: 300;
			}
		}

		.plan-list {
			background-color: #ededed;
			overflow-y: scroll;

			.list-item {
				background-color: #ffffff;
			}
		}
	}
</style>
