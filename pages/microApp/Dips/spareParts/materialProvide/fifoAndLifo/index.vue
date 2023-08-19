<!-- dips → 备品备件 → 物料发放 → 库存管理原则为先进先出或后进先出 -->
<template>
	<view class="sws-wh100 u-flex sws-flex-d-column">
		<view class="sws-w100 u-p-t-20 u-p-r-30 u-p-b-20 u-p-l-30">
			<u-search placeholder="请输入备件批次码" shape="square" v-model="keyword" @custom="queryBatchNum"></u-search>
		</view>
		<view class="sws-w100 u-flex-1 sws-overflow-scroll-y">
			<view class="u-flex u-p-t-26 u-p-r-40 u-p-b-26 u-p-l-40 u-border-top" v-for="(item, index) in list"
				:key="index">
				<view class="u-flex-1">
					<u-checkbox-group class="sws-w100" :wrap="true" width="100%" shape="round">
						<u-checkbox v-model="item.checked" :name="item.id">{{ item.batchNum }}</u-checkbox>
					</u-checkbox-group>
					<view class="u-flex u-p-l-50 u-font-24 u-type-info">
						<view class="u-flex-1">
							<text>货位：</text>
							<text>{{ item.shelfName }}</text>
						</view>
						<view class="u-m-l-30 u-p-r-60">
							<text>库存：</text>
							<text>{{ item.qty }}</text>
						</view>
					</view>
				</view>
				<view>
					<u-number-box v-model="item.num" :max="item.qty" size="32">
					</u-number-box>
				</view>
			</view>
		</view>
		<view class="btn-group sws-w100 u-flex u-p-28">
			<u-button type="primary" class="sws-w100 sws-line-h-repair" @click="toCommitProvide">确认发放</u-button>
		</view>
		<u-modal v-model="showCheck" title="授权验证" :show-cancel-button="true" @confirm="provideCheck">
			<view slot="default" class="u-p-30">
				<u-input type="text" :border="true" placeholder="请输入授权人账号" v-model="forceAccount">
				</u-input>
				<u-input class="u-m-t-20" type="password" :border="true" placeholder="请输入密码" v-model="userPassword">
				</u-input>
			</view>
		</u-modal>
		<u-modal v-model="showModal" :content="modalContent" @confirm="modalConfirm">
		</u-modal>
		<u-top-tips ref="uTips"></u-top-tips>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				keyword: '',
				list: [],
				forceAccount: '',
				userPassword: '',
				showCheck: false,
				modalContent: '',
				showModal: false
			}
		},
		onLoad({
			applyId,
			storePolicy,
			applyNum
		}) {
			this.applyNum = applyNum
			this.applyId = applyId
			this.getRecommendDetails(applyId, storePolicy) //获取推荐批次数据
		},
		methods: {
			modalConfirm() {
				const eventChannel = this.getOpenerEventChannel()
				eventChannel.emit('acceptDataFromOpenedPage')
				uni.navigateBack()
			},
			provideCheck() {
				const params = {
					id: this.applyId,
					forceAccount: this.forceAccount,
					userPassword: this.userPassword
				}

				this.$u.api.postProvideCheck(params).then(res => {
					if (res.msgCode === '000000') {
						this.commitProvide()
					} else {
						this.$refs.uTips.show({
							title: `授权验证失败，原因：${ res.message }`,
							type: 'error',
							duration: 2300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			toCommitProvide() {
				let totalNum = 0
				if (!this.list.filter(({
						checked
					}) => checked).length) {
					this.$refs.uTips.show({
						title: '请选择批次！',
						type: 'warning',
						duration: 2300
					})
					return
				}
				this.list.forEach(item => {
					if (item.checked) {
						totalNum += item.num
					}
				})
				if (this.applyNum != totalNum) {
					this.$refs.uTips.show({
						title: '总数量与申请数量不一致！',
						type: 'warning',
						duration: 2300
					})
					return
				}

				if (this.list.every(item => item.num === item.recommendQty)) {
					this.commitProvide()
				} else { //有任意批次选择数量不等于推荐数量都需三方登录验证
					this.showCheck = true //打开验证弹窗
				}
			},
			commitProvide() {
				let params = {
					id: this.applyId,
					body: []
				}
				this.list.forEach(item => {
					const arr = {
						...item,
						recommendQty: item.checked ? item.num : item.recommendQty //选中的批次使用操作之后的数量，否则就用推荐数量
					}
					params.body.push(arr)
				})
				console.log('params: ', params)
				this.$u.api.postProvideLifoAndFifo(params).then(res => {
					if (res.msgCode === '000000') {
						this.modalContent = '发放成功'
						this.showModal = true
					} else {
						this.$refs.uTips.show({
							title: `物料发放失败，原因：${ res.message }`,
							type: 'error',
							duration: 2300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			getRecommendDetails(applyId, storePolicy) {
				const params = {
					applyId,
					storePolicy
				}

				this.$u.api.getRecommendDetails(params).then(res => {
					if (res.msgCode === '000000' && res.data) {
						this.list = res.data.map(item => {
							return {
								...item,
								checked: false,
								num: item.recommendQty ? item.recommendQty : 0
							}
						})
					} else {
						this.$u.uTips.show({
							title: `获取推荐批次失败，原因：${ res.message }`,
							type: 'error',
							duration: 2300
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			queryBatchNum() {
				if (this.keyword) {
					this.list.forEach(item => {
						if (item.batchNum == this.keyword) {
							item.checked = true
						}
					})
				}
			},
			async scanCode() {
				// #ifdef APP-PLUS
				const batchNum = await this.common.scanCode()
				this.list.forEach(item => {
					if (item.batchNum == batchNum) {
						item.checked = true
					}
				})
				// #endif
			}
		},
		onNavigationBarButtonTap(btns) {
			this.scanCode()
		},
		onBackPress() {
			if (this.showCheck) {
				this.showCheck = false
				return true
			}
		}
	}
</script>

<style>

</style>
