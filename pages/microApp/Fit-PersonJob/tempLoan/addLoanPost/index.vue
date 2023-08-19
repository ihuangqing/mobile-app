<template>
	<view class="sws-wh100 u-flex sws-flex-d-column">
		<view class="u-flex-1 sws-w100">
			<u-cell-group :border="false">
				<u-cell-item required hover-class="none" arrow-direction="right" title="班组长"
					:value="user.foremanName ? user.foremanName : '请选择班组长'" @click="toShowForeman">
					<u-icon slot="icon" class="u-m-r-20" name="zhuguan" custom-prefix="sws-icon" size="32"></u-icon>
				</u-cell-item>
				<u-cell-item required hover-class="none" arrow-direction="down" title="拉线"
					:value="user.lineName ? user.lineName : '请选择拉线'" @click="toShowLines">
					<u-icon slot="icon" class="u-m-r-20" name="laxian" custom-prefix="sws-icon" size="32"></u-icon>
				</u-cell-item>
				<u-cell-item required hover-class="none" arrow-direction="down" title="工段"
					:value="user.mesArea ? user.mesArea : '请选择工段'" @click="toShowGd">
					<u-icon slot="icon" class="u-m-r-20" name="gongduan" custom-prefix="sws-icon" size="32"></u-icon>
				</u-cell-item>
				<u-cell-item required hover-class="none"
					:value-style="{'padding-left': '30rpx', 'overflow-wrap': 'break-word'}" arrow-direction="right"
					title="岗位" :value="user.postName ? user.postName : '请选择岗位'" @click="toShowPost">
					<u-icon slot="icon" class="u-m-r-20" name="gongxu" custom-prefix="sws-icon" size="32"></u-icon>
				</u-cell-item>
			</u-cell-group>
		</view>
		<view class="sws-w100 u-flex u-row-between u-p-t-28 u-p-b-28">
			<u-button size="medium" type="default" class="check-confirm sws-line-h-repair" @click="reset">重置</u-button>
			<u-button class="sws-line-h-repair" size="medium" type="primary" @click="commitLoanOut">确认调出</u-button>
		</view>
		<u-modal v-model="showModal" :content="modalContent" @confirm="modalConfirm"></u-modal>
		<u-select v-model="showSelect" :list="selectList" :title="title" @confirm="confirmSelect"></u-select>
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
				user: {
					foremanName: '',
					callInGroup: '',
					lineName: '',
					lineId: '',
					mesArea: '',
					postName: '',
					postId: '',
				},
				lineList: [],
				title: '',
				selectList: [],
				showSelect: false,
				modalContent: '',
				showModal: false
			}
		},
		computed: mapState(['userInfo']),
		onLoad() {
			const _self = this
			const eventChannel = this.getOpenerEventChannel()
			eventChannel.on('acceptDataFromOpenerPage', ({
				data: user
			}) => {
				_self.account = user.account
			})
		},
		methods: {
			modalConfirm() {
				const eventChannel = this.getOpenerEventChannel()
				eventChannel.emit('acceptDataFromOpenedPage')
				uni.navigateBack()
			},
			commitLoanOut() {
				let checkArr = [{
					tips: '请选择班组长',
					value: this.user.foremanName
				}, {
					tips: '请选择拉线',
					value: this.user.lineName
				}, {
					tips: '请选择工段',
					value: this.user.mesArea
				}, {
					tips: '请选择岗位',
					value: this.user.postId
				}]

				if (this.common.checkNotNull(this, checkArr)) {
					this.toLoanOut()
				}
			},
			toLoanOut() {
				const temp = this.user
				const params = {
					account: this.account,
					callInGroup: temp.callInGroup,
					lineId: temp.lineId,
					mesArea: temp.mesArea,
					postId: temp.postId
				}
				this.$u.api.postLoanOut(params).then(res => {
					if (res.msgCode === '000000') {
						this.modalContent = '调出成功!'
						this.showModal = true
					} else {
						this.$refs.uTips.show({
							title: `调出失败，原因：${ res.message }`,
							type: 'error',
							duration: 2300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			toShowForeman() {
				this.$u.api.getLoanForeManList(this.userInfo.account).then(res => {
					if (res.msgCode === '000000') {
						if (res.data && res.data.length) {
							this.selectList = res.data.map(user => {
								return {
									name: `${user.foremanName}(${user.foremanAcct})`,
									value: user.id,
								}
							})

							this.goToSelected('请选择班组长', this.selectList, 'foreman', true, true)

						} else {
							this.$refs.uTips.show({
								title: '暂无可调出的班组',
								type: 'warning',
								duration: 2300
							})
						}
					} else {
						this.$refs.uTips.show({
							title: `班组长列表获取失败，原因：${ res.message }`,
							type: 'error',
							duration: 2300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			async toShowLines() { //获取拉线数据,展示拉线列表
				this.title = '请选择拉线'
				if (this.lineList.length === 0) {
					let lines = await this.baseData.getLines(this) //通过通用数据请求方法获取
					if (lines.length > 0) {
						this.lineList = lines.map(item => {
							return {
								label: item.lineName,
								value: item.id,
								extra: 'line'
							}
						})
					} else {
						this.$refs.uTips.show({
							title: '拉线列表获取失败！',
							type: 'error',
							duration: '2300'
						})
						return
					}
				}
				this.selectList = this.lineList
				this.showSelect = true
			},
			toShowGd() { //展示工段列表
				this.tips = '请选择工段'
				this.selectList = [{
					label: '前工序正极',
					value: '前工序正极',
					extra: 'mesArea'
				}, {
					label: '前工序负极',
					value: '前工序负极',
					extra: 'mesArea'
				}, {
					label: '中工序',
					value: '中工序',
					extra: 'mesArea'
				}, {
					label: '后工序',
					value: '后工序',
					extra: 'mesArea'
				}, {
					label: '模组',
					value: '模组',
					extra: 'mesArea'
				}, {
					label: 'PACK',
					value: 'PACK',
					extra: 'mesArea'
				}]
				this.showSelect = true
			},
			toShowPost() {
				let checkArr = [{
					tips: '请选择拉线',
					value: this.user.lineId
				}, {
					tips: '请选择工段',
					value: this.user.mesArea
				}]
				if (this.common.checkNotNull(this, checkArr)) {
					let params = {
						lineId: this.user.lineId,
						mesArea: this.user.mesArea
					}
					this.$u.api.getPosts(params).then(res => {
						if (res.msgCode === '000000') {
							this.postList = res.data.map(item => {
								return {
									name: item.postName,
									value: item.id,
									checked: false
								}
							})
							if (this.postList.length > 0) {
								this.goToSelected('请选择岗位', this.postList, 'posts', false, true)
							} else {
								this.$refs.uTips.show({
									title: '岗位信息为空！',
									type: 'warning',
									duration: '2300'
								})
							}
						} else {
							this.$refs.uTips.show({
								title: `岗位获取失败，原因：${res.message}`,
								type: 'error',
								duration: '2300'
							})
						}
					}).catch(err => {
						this.common.sysErrToast(this, err)
					})
				}
			},
			confirmSelect(res) {
				let obj = res[0]
				switch (obj.extra) {
					case 'line': //拉线
						this.user.lineName = obj.label
						this.user.lineId = obj.value
						this.user.postName = ''
						this.user.postId = ''
						break
					case 'mesArea': //工段
						this.user.mesArea = obj.value
						this.user.postName = ''
						this.user.postId = ''
						break
				}
			},
			goToSelected(title, list, type, hasSearch = false, isRadio = false) {
				// title 选择列表页面标题  list 选择列表项 type赋值对象的属性名, hasSeach是否需要本地搜索
				let _self = this
				let params = {
					title: title,
					items: list,
					hasSearch,
					isRadio
				}
				uni.navigateTo({
					url: '/pages/common/selectItems/index',
					events: {
						acceptDataFromOpenedPage(res) {
							const temp = res.data[0]
							if (type === 'foreman') {
								_self.user.foremanName = temp.name
								_self.user.callInGroup = temp.value
							} else {
								_self.user.postName = temp.name
								_self.user.postId = temp.value
							}
						}
					},
					success: function(res) {
						res.eventChannel.emit('acceptDataFromOpenerPage', params)
					}
				})
			},
			reset() {
				this.user = {
					foremanName: '',
					callInGroup: '',
					lineName: '',
					lineId: '',
					mesArea: '',
					postName: '',
					postId: ''
				}
			}
		},
		onBackPress() {
			if (this.showSelect) {
				this.showSelect = false
				return true
			}
		}
	}
</script>

<style lang="scss" scoped>
	.check-confirm {
		letter-spacing: 20rpx;
		text-indent: 20rpx;
	}
</style>
