<template>
	<view class="sws-wh100">
		<view class="header-top">
			<view class="header-wrap">
				<view class="u-flex fake-nav">
					<u-icon name="back" custom-prefix="sws-icon" size="48" color="#ffffff" class="u-p-l-20 u-p-r-20"
						@click="toBack"></u-icon>
					<view class="u-flex-1 sws-font-fff u-font-32 u-main-color sws-font-bold u-text-center u-p-r-80">
						{{ (hasLogin && type) ? '待学习' : 'SOP文件学习' }}
					</view>
				</view>
				<view class="u-flex u-row-right">
					<view class="u-flex-1 sws-font-fff u-text-center u-p-r-60" v-show="totalNum">
						<view>
							<text class="course-total">{{ totalNum }}</text>
							<text class="u-font-28 u-m-l-8">课</text>
						</view>
						<view>课程总数</view>
					</view>
					<u-image class="bg-image" width="130rpx" height="130rpx"
						:src="`../../../../static/swd/${ (hasLogin && type) ? 'bg-file' :'bg-file-sop' }.svg`">
					</u-image>
				</view>
				<view class="u-flex u-p-l-20 u-p-r-20 u-p-t-16">
					<u-search placeholder="请输入课程名称" shape="square" :action-style="{'color': '#ffffff'}"
						bg-color="#ffffff" border-color="#ffffff" v-model="keyword" @search="searchFile"
						@custom="searchFile">
					</u-search>
					<u-icon name="shaixuan" custom-prefix="sws-icon" size="30" color="#ffffff" label="筛选"
						label-color="#ffffff" class="u-m-l-20" @click="toShowFilter"></u-icon>
				</view>
			</view>
		</view>
		<view class="scroll-wrap">
			<view v-show="!showNoData">
				<view class="list-item" v-for="(course, index) in list" :key="index">
					<view class="list-item-header u-flex">
						<u-icon name="wodekecheng" custom-prefix="sws-icon" size="36" color="#ffffff"></u-icon>
						<view class="u-m-l-16 sws-font-fff u-font-28">{{ `${ course.title }(${ course.version })` }}
						</view>
					</view>
					<view class="u-p-l-30 u-p-t-10 u-p-r-30">
						<view class="u-flex u-font-26 u-content-color u-m-t-8">
							<view class="u-flex-1">应学习：{{ course.numberOfStudy ? course.numberOfStudy + '人' : '-' }}
							</view>
							<view class="u-flex-1">已学习：{{ course.numberOfDone }}人</view>
						</view>
						<view class="u-flex u-font-26 u-content-color u-m-t-8">
							<view class="u-flex-1">发布人：{{ course.publishUsername }}</view>
							<view class="u-flex-1">文件数量：{{ course.qty }}份</view>
						</view>
						<view class="u-flex u-font-26 u-content-color u-m-t-8">
							<view>发布时间：</view>
							<view class="u-flex-1">{{ course.publishTime }}</view>
						</view>
					</view>
					<view class="u-p-r-30 u-p-b-16 u-text-right" @click="goToDetail(course, index)">
						<u-icon name="arrow-rightward" label="开始学习" label-pos="left" label-color="#19be6b"
							color="#19be6b"></u-icon>
					</view>
				</view>
				<u-loadmore :status="loadStatus" bgColor="#ffffff"></u-loadmore>
			</view>
			<no-data v-show="showNoData"></no-data>
		</view>
		<u-popup v-model="showFilter" mode="right" length="80%" border-radius="24">
			<view class="popup-head">
				<u-icon name="back" custom-prefix="sws-icon" size="40" color="#323233" @click="showFilter = false">
				</u-icon>
				<view class="u-flex-1 u-text-center u-p-r-20 sws-font-bold">筛选</view>
			</view>
			<view class="popup-content">
				<scroll-view scroll-y="true" style="height: 100%;">
					<view class="u-p-l-20 u-p-r-20">
						<view class="u-m-b-30">
							<view class="u-font-28 sws-font-bold">产品</view>
							<view class="btn-group">
								<view class="btn-item" :class="prod.checked ? 'active' : ''"
									v-for="(prod, prodIndex) in filterProductList" :key="prodIndex"
									@click="prod.checked = !prod.checked">{{ prod.productName }}</view>
							</view>
						</view>
						<view class="u-m-b-30" v-if="type">
							<view class="u-font-28 sws-font-bold">通用</view>
							<view class="btn-group">
								<view class="btn-item" :class="filterCommon ? 'active' : ''"
									@click="filterCommon = !filterCommon">通用</view>
							</view>
						</view>
						<view class="u-m-b-30" v-for="(line, lineIndex) in filterSkillList" :key="lineIndex">
							<view class="u-flex">
								<view class="u-font-28 sws-font-bold">{{ line.lineCode }}</view>
								<view class="u-flex-1 u-flex u-row-left u-font-26 u-p-l-50">
									<view :class="station.checked ? 'title-item active' : 'title-item'"
										v-for="(station, stationIndex) in line.data" :key="stationIndex"
										@click="toChangeTitle(line, station, stationIndex)">{{ formatStation(station.station) }}
									</view>
								</view>
							</view>
							<view class="btn-group" v-show="stationIndexForSkill === line.currIndex"
								v-for="(station, stationIndexForSkill) in line.data" :key="stationIndexForSkill">
								<view class="btn-item" :class="skill.checked ? 'active' : ''"
									v-if="skillIndex < station.showLimitNum" v-for="(skill, skillIndex) in station.data"
									:key="skillIndex" @click="toSkillClick(line, station, skill)">
									<view class="u-line-2">{{ skill.skillName }}</view>
								</view>
								<view class="btn-item" v-show="station.data.length > skillLimitNum">
									<u-icon :name="station.showLimitNum == station.data.length ? 'up' : 'down' "
										custom-prefix="sws-icon" color="#2979ff"
										:label="station.showLimitNum == station.data.length ? '折叠' : '更多' "
										label-pos="left" label-color="#2979ff" @click="toToggleSkill(station)"></u-icon>
								</view>
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
			<view class="popup-foot">
				<u-button type="default" hover-class="none" class="u-flex-1" @click="filterReset">重置</u-button>
				<u-button type="primary" hover-class="none" class="u-flex-1 u-m-l-40" @click="filterConfirm">确认
				</u-button>
			</view>
		</u-popup>
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
				type: 0,
				page: 1,
				limit: 10,
				skillLimitNum: 5, //技能折叠个数限制
				totalNum: 0,
				list: [],
				loadStatus: 'loadmore',
				showNoData: false,
				filterCommon: true, //过滤条件 → 通用
				filterProductList: [], //过滤条件 -- 产品
				filterSkillList: [], ////过滤条件 -- 技能
				showFilter: false
			}
		},
		computed: {
			...mapState(['hasLogin']),
			formatStation(station) {
				return station => {
					let res = station
					switch (station) {
						case '前工序正极':
							res = '前正'
							break
						case '前工序负极':
							res = '前负'
							break
					}
					return res
				}
			}
		},
		onLoad({
			type
		}) {
			this.type = type ? type : 0 //设置学习类型  1是个人待学习 0是SOP学习

			if (this.type) {
				this.currParams = {
					common: 1
				}
			}
			this.toSearch()
		},
		methods: {
			filterReset() {
				// 重置产品选择
				this.filterProductList.forEach(prod => {
					prod.checked = false
				})

				// 重置通用选择
				if (this.type) this.filterCommon = false

				// 重置技能选择
				this.filterSkillList.forEach(line => {
					line.currIndex = 0
					line.checked = false
					line.data.forEach((station, stationIndex) => {
						if (stationIndex) {
							station.checked = false
						} else {
							station.checked = true
						}

						station.showLimitNum = this.skillLimitNum

						station.data.forEach(item => { //为技能添加checked属性
							item.checked = false
						})
					})
				})
			},
			filterConfirm() {
				let params = {
					productIds: [],
					skillInfos: []
				}
				// 获取筛选参数 → 产品
				this.filterProductList.forEach(prod => {
					if (prod.checked) {
						params.productIds.push(prod.id)
					}
				})

				//获取筛选参数 → 通用
				if (this.type) {
					params.common = this.filterCommon ? 1 : 0
				}

				// 获取筛选参数 → 技能
				this.filterSkillList.forEach(line => {
					const skillChecked = {}
					line.data.forEach((station, stationIndex) => {
						station.data.forEach(skill => { //为技能添加checked属性
							if (skill.checked) {
								params.skillInfos.push({
									lineId: line.lineId,
									station: station.station,
									skillId: skill.id
								})
							}
						})
					})
				})

				this.page = 1
				this.list = []
				this.currParams = {
					...this.currParams,
					...params
				}

				console.log('this.curParam: ', this.currParams)
				this.toSearch()
				this.$nextTick(() => {
					this.showFilter = false
				}, 300)
			},
			toSkillClick(line, station, skill) {
				skill.checked = !skill.checked
				if (station.data.filter(skill => skill.checked).length) {
					station.checked = true
				}
				if (line.data.filter(station => station.checked).length) {
					line.checked = true
				}
			},
			toToggleSkill(station) { //技能显示更多
				if (station.showLimitNum == station.data.length) {
					station.showLimitNum = 5
				} else {
					station.showLimitNum = station.data.length
				}
			},
			toChangeTitle(list, station, index) {
				if (!station.checked) {
					list.data.forEach(item => item.checked = false)
					list.currIndex = index //修改当前选择的工段下标
					station.checked = true
				}
			},
			toShowFilter() {
				if (!this.hasFilter) {
					this.getFilterInfo() //查询过滤条件
				} else {
					this.showFilter = true
				}
			},
			getFilterInfo() { //获取筛选条件
				this.$u.api.getFilterInfo({
					type: this.type
				}).then(res => {
					if (res.msgCode === '000000') {
						this.filterProductList = res.data.productPos.map(item => { //为产品添加checked属性
							return {
								...item,
								checked: false
							}
						})
						res.data.filterInfo.forEach(line => {
							line.currIndex = 0 // currIndex 用于记录当前选择的是哪个工段的标识，记录在当前的拉线中，初始化显示第一个工段
							line.data.forEach((station, stationIndex) => {
								if (stationIndex) { //为工段添加checked属性，默认第一个为true
									station.checked = false
								} else {
									station.checked = true
								}

								station.showLimitNum = this.skillLimitNum

								station.data.forEach(item => { //为技能添加checked属性
									item.checked = false
								})
							})
						})
						this.filterSkillList = res.data.filterInfo
						this.hasFilter = true //筛选条件获取成功标识
						this.showFilter = true
					} else {
						this.$refs.uTips.show({
							title: `筛选条件获取失败，原因：${ res.message }`,
							type: 'error',
							duration: '2300'
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			searchFile() {
				if (this.keyword.trim()) {
					this.list = []
					this.totalNum = 0
					this.page = 1
					this.currParams = {
						fileName: this.keyword,
						common: 1
					}
					this.toSearch()
				} else {
					this.$refs.uTips.show({
						title: '请输入课程名称',
						type: 'warning',
						duration: '2300'
					})
				}
			},
			toSearch() {
				if (this.hasLogin && this.type) { //登录状态，查询待学习
					this.getUserFileList()
				} else { //非登录状态 &&type为空时  查询sop学习文件
					this.getSopFileList()
				}
			},
			getUserFileList() {
				this.loadStatus = 'loading'
				let params = {
					page: this.page,
					limit: this.limit,
					...this.currParams
				}

				uni.stopPullDownRefresh() //关闭下拉刷新
				this.$u.api.getUserFileList(params).then(res => {
					if (res.msgCode === '000000') {
						this.totalNum = res.data.count
						this.dataList = [...this.list, ...res.data.data]
						this.list = this.dataList
						this.page++

						if (!res.data.data.length || res.data.data.length < this.limit) this.loadStatus = "nomore"

						if (!this.list.length) {
							this.showNoData = true
						} else {
							this.showNoData = false
						}

					} else {
						this.$refs.uTips.show({
							title: `最新课程文档获取失败，原因：${res.message}`,
							type: 'error',
							duration: '2300'
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			async getSopFileList() { // 获取学习列表
				this.loadStatus = 'loading'
				let params = {
					page: this.page,
					limit: this.limit,
					...this.currParams
				}

				this.$u.api.getSopFileList(params).then(res => {
					if (res.msgCode === '000000') {
						this.totalNum = res.data.count
						this.dataList = [...this.list, ...res.data.data]
						this.list = this.dataList
						this.page++

						if (!res.data.data.length || res.data.data.length < this.limit) this.loadStatus =
							"nomore"

						if (!this.list.length) {
							this.showNoData = true
						} else {
							this.showNoData = false
						}

						uni.stopPullDownRefresh() //关闭下拉刷新
					} else {
						this.$refs.uTips.show({
							title: `最新课程文档获取失败，原因：${res.message}`,
							type: 'error',
							duration: '2300'
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			goToDetail(item, index) {
				const _self = this
				let params = {
					type: this.type,
					...item
				}
				uni.navigateTo({
					url: `/pages/microApp/E-SOP/sop/esopDetail/index${this.$u.queryParams(params)}`,
					events: {
						acceptDataFromChildPage({
							numberOfDone
						}) {
							if (_self.type == 1) {
								_self.list.splice(index, 1)
									--_self.totalNum
								if (!_self.list.length) _self.showNoData = true
							} else { //sop列表中更新已学习人数
								_self.list[index].numberOfDone = numberOfDone
							}
						}
					}
				})
			},
			toBack() {
				uni.navigateBack()
			}
		},
		onReachBottom() {
			if (this.loadStatus != 'nomore') { //如果状态无无数据，则不再请求
				this.loadStatus = "loading"
				this.toSearch()
			}
		},
		onPullDownRefresh() {
			this.keyword = ''
			this.totalNum = 0
			this.page = 1
			this.list = []
			this.loadStatus = 'loadmore'
			if (this.type) {
				this.currParams = {
					common: 1
				}
			} else {
				this.currParams = {}
			}
			this.toSearch()
		},
		onBackPress() {
			if (this.showFilter) {
				this.showFilter = false
				return true
			}
		}
	}
</script>

<style lang="scss" scoped>
	.header-top {
		position: fixed;
		width: 100%;
		height: 340rpx;
		z-index: 1;

		.header-wrap {
			width: 100%;
			height: 100%;
			background: linear-gradient(to left, #2979ff, #65c7f7, #9cecfb);

			.fake-nav {
				height: 102rpx;
				width: 100%;
			}

			.course-total {
				font-size: 52rpx;
				font-weight: bold;
			}

			.bg-image {
				opacity: .5 !important;
				margin-right: 40rpx;
			}

			@media screen and (min-width: 520px) {
				.bg-image {
					margin-right: 80rpx;
				}
			}
		}
	}

	.scroll-wrap {
		width: 100%;
		height: 100%;
		padding: 340rpx 30rpx 0 30rpx;

		.list-item {
			border: 2rpx solid #e8e8e8;
			box-shadow: 0 0 4rpx #e8e8e8;
			border-radius: 16rpx;
			overflow: hidden;
			margin-top: 30rpx;

			&-header {
				padding: 8rpx 20rpx;
				// background: linear-gradient(to left, #2979ff, #65c7f7, #9cecfb);
				background: linear-gradient(to right, #0083fe, #00fff0);
			}
		}

	}

	.popup-head {
		display: flex;
		width: 100%;
		height: 80rpx;
		padding: 0 20rpx;
		align-items: center;
	}

	.popup-content {
		width: 100%;
		height: calc(100% - 200rpx);

		.title-item {
			margin-left: 16rpx;
		}

		.title-item.active {
			color: #2979ff;
			font-weight: bold;
			border-bottom: 2rpx solid #2979ff;
		}

		.btn-group {
			display: flex;
			justify-content: left;
			align-items: center;
			flex-wrap: wrap;
			margin-top: 20rpx;

			.btn-item {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 170rpx;
				height: 70rpx;
				background-color: #f2f2f2;
				color: #000000;
				font-size: 24rpx;
				text-align: center;
				border-radius: 36rpx;
				margin-bottom: 20rpx;
				margin-right: 20rpx;
				padding: 0 16rpx;
			}

			.btn-item:nth-child(3n+0) {
				margin-right: 0;
			}

			.btn-item.active {
				background-color: #2979ff;
				color: #ffffff;
			}
		}
	}

	.popup-foot {
		display: flex;
		width: 100%;
		height: 120rpx;
		padding: 0 40rpx;
		align-items: center;
		justify-content: space-between;

		& {
			text-indent: 28rpx;
			letter-spacing: 28rpx;
		}
	}
</style>
