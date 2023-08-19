<!-- 上班签到 → 删除撤回	 -->
<template>
	<view class="sws-wh100 sws-bg-ebebeb sws-overflow-hidden u-rela">
		<view class="tab-wrap sws-w100 u-flex u-row-center sws-bg-ffffff">
			<u-tabs :list="tabList" :current="tabCurrent" bar-width="60" @change="tabChange"></u-tabs>
		</view>
		<view v-show="!showNoData" class="scroll-wrap sws-wh100 sws-overflow-scroll-y">
			<u-card :margin="index == (list.length - 1) ? '0': '0 0 20rpx 0'" :border="false"
				:head-style="{background: '#2979ff',padding: '20rpx 30rpx'}" :body-style="{padding: 0}"
				:foot-style="{padding: '16rpx 30rpx'}" :show-foot="true" :full="true" v-for="(user, index) in list"
				:key="index">
				<view slot="head">
					<view class="sws-font-fff u-font-32 u-flex">
						<view>{{ user.userName }}</view>
						<view class="u-font-24">({{ user.account }})</view>
					</view>
				</view>
				<u-cell-group v-if="!tabCurrent" slot="body" :border="false">
					<u-cell-item class="u-p-t-10 u-p-b-10" hover-class="none" :arrow="false" title="签到信息"
						:title-style="{color: '#909399'}" :value-style="{color: '#303133'}" :border-bottom="false"
						:value="`${ user.lineName } → ${ user.mesArea } → ${ user.postName }`">
					</u-cell-item>
				</u-cell-group>
				<u-cell-group v-else-if="tabCurrent == 1" slot="body" :border="false">
					<u-cell-item class="u-p-t-10 u-p-b-10" hover-class="none" :arrow="false" title="请假理由"
						:title-style="{color: '#909399'}" :value-style="{color: '#303133'}"
						:border-bottom="user.reason == 'QT'" :value="reason(user.reason)">
					</u-cell-item>
					<u-cell-item v-show="user.reason == 'QT'" class="u-p-t-10 u-p-b-10" hover-class="none"
						:title-style="{color: '#909399'}" :value-style="{color: '#303133'}" :arrow="false"
						:border-bottom="false" title="备注" :value="user.remark">
					</u-cell-item>
				</u-cell-group>
				<u-cell-group v-else slot="body" :border="false">
					<u-cell-item class="u-p-t-10 u-p-b-10" hover-class="none" :arrow="false" title="删除理由"
						:title-style="{color: '#909399'}" :value-style="{color: '#303133'}"
						:border-bottom="user.attendState == 'QT'" :value="reason(user.attendState)">
					</u-cell-item>
					<u-cell-item v-show="user.attendState == 'QT'" class="u-p-t-10 u-p-b-10" hover-class="none"
						:title-style="{color: '#909399'}" :value-style="{color: '#303133'}" :arrow="false"
						:border-bottom="false" title="备注" :value="user.remark">
					</u-cell-item>
				</u-cell-group>
				<view slot="foot" class="u-text-right">
					<u-button class="u-p-l-30 u-p-r-30 btn-style" size="medium" type="success"
						@click="toUndoDel(user.userName, index)">
						{{ dealName }}
					</u-button>
				</view>
			</u-card>
		</view>
		<u-modal v-model="showModal" :content="modalContent" :show-cancel-button="showCancel" @confirm="modalConfirm">
		</u-modal>
		<no-data v-show="showNoData"></no-data>
		<u-top-tips ref="uTips"></u-top-tips>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'

	import noData from '../../../../components/noData/index.vue'

	export default {
		components: {
			noData
		},
		data() {
			return {
				tabCurrent: 0,
				tabList: [{
					name: '今日签到'
				}, {
					name: '今日请假'
				}, {
					name: '已删除'
				}],
				list: [],
				modalContent: '',
				showCancel: false,
				showNoData: false,
				showModal: false
			}
		},
		computed: {
			...mapState(['userInfo']),
			dealName() {
				return this.tabCurrent ? (this.tabCurrent == 1 ? '撤销请假' : '撤销删除') : '撤销签到'
			},
			reason(attendState) {
				return attendState => {
					switch (attendState) {
						case 'XJ':
							return '休假'
							break
						case 'QT':
							return '其他'
							break
						case 'KG':
							return '旷工'
							break
					}
				}
			}
		},
		onLoad() {
			this.getUndoDelList()
		},
		methods: {
			tabChange(index) {
				this.tabCurrent = index
				this.showNoData = false
				switch (index) {
					case 0:
						this.list = this.recallSignList
						break
					case 1:
						this.list = this.recallOtherList
						break
					case 2:
						this.list = this.recallDelList
						break
					default:
						if (!this.list.length) this.showNoData = true
						break
				}
			},
			toUndoDel(userName, index) {
				this.currIndex = index
				this.modalContent = `是否${ this.dealName } ${ userName }?`
				this.showCancel = true
				this.showModal = true
			},
			undoDel() {
				const params = {
					id: this.list[this.currIndex].id,
					type: this.tabCurrent == 2 ? 1 : 2 //删除 1  签到和请假 2
				}
				this.$u.api.postUndoDel(params).then(res => {
					if (res.msgCode === '000000' && res.data) {
						this.list.splice(this.currIndex, 1)
						this.modalContent = `${ this.dealName }成功！`
						this.showModal = true
						if (!this.list.length) this.showNoData = true
					} else {
						this.$refs.uTips.show({
							title: `${ this.dealName }失败，原因:${ res.message }`,
							type: 'error',
							duration: 2300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			modalConfirm() {
				if (this.modalContent.includes('是否')) {
					this.undoDel()
				}
			},
			getUndoDelList() {
				this.$u.api.getUndoDelList(this.userInfo.account).then(res => {
					if (res.msgCode === '000000' && res.data) {
						this.recallDelList = res.data.recallDelList //删除列表
						this.recallOtherList = res.data.recallOtherList //休假列表
						this.recallSignList = res.data.recallSignList //签到列表
						this.list = this.recallSignList
						if (!this.list.length) this.showNoData = true
					} else {
						this.$refs.uTips.show({
							title: `撤销列表获取失败，原因:${ res.message }`,
							type: 'error',
							duration: 2300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			}
		},
		onBackPress() {
			const eventChannel = this.getOpenerEventChannel()
			eventChannel.emit('acceptDataFromOpenedPage')
		}
	}
</script>

<style scoped lang="scss">
	.tab-wrap {
		position: fixed;
		width: 100%;
		left: 0;
		// top: 0;
		height: 90rpx;
		z-index: 3;
	}

	.scroll-wrap {
		padding: 110rpx 20rpx 20rpx 20rpx;
	}

	.btn-style {
		height: 60rpx;
	}
</style>
