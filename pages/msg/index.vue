<template>
	<view class="page-wrap u-flex">
		<view class="sub-section sws-w100 u-p-20" v-show="showSubsection">
			<u-subsection :list="list" :current="current" mode="subsection" active-color="#2979ff" @change="changeList">
			</u-subsection>
		</view>
		<view class="msg-list sws-w100 u-flex-1" v-show="showNotise">
			<no-data v-show="!notiseList.length"></no-data>
			<view class="order">
				<view class="item u-flex sws-w100 u-p-20" v-for="(item, index) in notiseList" :key="index"
					@click="goToRichText(item)">
					<view>
						<u-icon class="u-p-r-20" :name="item.showUser === '0' ? 'gonggao' : 'tongzhi' "
							custom-prefix="sws-icon" size="80" :color="item.showUser === '0' ? '#F5CD20' : '#D061FF' ">
						</u-icon>
					</view>
					<view class="content u-flex-1">
						<view class="title u-flex">
							<text class="u-flex-3 sws-font-bold">{{ item.title }}</text>
							<text class="u-flex-1 u-text-right"
								:style="item.importance == 4 ? {color: '#fa3534'} : (item.importance == 3 ? {color: '#ff9900'} : (item.importance == 2 ? {color: '#D061FF'} : {color: '#000000'}))">{{ formatImportance(item.importance) }}</text>
						</view>
						<view class="u-line-2 u-p-r-80">
							{{ item.noticeStr }}
						</view>
						<view class="type u-font-24 u-text-right">
							<text>{{ item.createName }}</text>
							<text class="u-m-l-10">{{ item.publishTime }}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="msg-list sws-w100 u-flex-1" v-show="!showNotise">
			<!-- <no-data v-show="!msgList.length"></no-data> -->
			<view class="order">
				<view class="item u-flex sws-w100 u-p-20" v-for="(item, index) in msgList" :key="index"
					@click="toReadMsg(item)">
					<view class="u-rela">
						<u-icon class="u-p-r-20" name="gongdanxiaoxi" custom-prefix="sws-icon" size="80"
							color="#2979ff"></u-icon>
						<u-badge v-show="!+item.isRead" :is-dot="true" :offset="[-6, 18]"></u-badge>
					</view>
					<view class="content u-flex-1">
						<view class="title u-flex">
							<text class="u-flex-3 sws-font-bold">{{ item.title }}</text>
							<text class="u-flex-1 u-text-right"></text>
						</view>
						<view class="u-line-2 u-p-r-80">
							{{ item.content }}
						</view>
						<view class="type u-font-24 u-text-right">
							<text>{{ item.creationDate }}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<u-top-tips ref="uTips"></u-top-tips>
	</view>
</template>
<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'
	import noData from '../components/noData/index.vue'

	export default {
		components: {
			noData,
		},
		data() {
			return {
				list: [{
					name: '公告'
				}, {
					name: '消息'
				}],
				notiseList: [], //公告消息
				msgList: [],
				showSubsection: true, //未登录状态不显示分段器
				current: 0, //初始化显示的分段器内容
				showNotise: true //初始化显示公告
			}
		},
		computed: {
			...mapState(['hasLogin', 'userInfo']),
			formatImportance(val) {
				return val => {
					switch (Number(val)) {
						case 1:
							return '普通'
							break
						case 2:
							return '一般'
							break
						case 3:
							return '重要'
							break
						case 4:
							return '非常重要'
							break
					}
				}
			}
		},
		onLoad() {
			if (this.hasLogin) {
				this.showSubsection = true
				this.getNotiseList({
					account: this.userInfo.account
				})
			} else { //如果未登录，则隐藏分段器
				this.showSubsection = false
				this.getNotiseList()
			}

			this.switchNavBtn() //隐藏清除未读按钮
		},
		methods: {
			...mapMutations(['updateMsgStatus']),
			async toReadMsg(item) {
				const res = await this.setMsgRead(item.uuid)
				if (res) {
					item.isRead = 1
				}

				this.goToRichText({
					title: item.title,
					noticeBody: item.content
				})
			},
			setMsgRead(uuid) { //设置消息已读
				return new Promise(resolve => {
					this.$u.api.postMsgState({
						uuid,
						type: 2
					}).then(res => {
						if (res.msgCode === '000000') {
							resolve(true)
						}
					}).catch(err => resolve(false))
				})
			},
			goToRichText(item) { //跳转至富文本展示页面（公告详情页面）
				uni.navigateTo({
					url: `/pages/msg/richText/index`,
					success: res => {
						res.eventChannel.emit('acceptDataFromOpenerPage', {
							data: item
						})
					}
				})
			},
			getNotiseList(params) { //获取公告列表 //普通1一般2重要3非常重要4
				this.$u.api.getNoticeList(params).then(res => {
					if (res.msgCode === '000000') {
						this.notiseList = res.data //首页公告列表最多展示5条信息
					} else {
						this.$refs.uTips.show({
							title: `公告消息获取失败，原因：${res.message}`,
							type: 'error',
							duration: '2300'
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			},
			getMsgList() { //获取消息列表
				this.$u.api.getPushMsgByAccount(this.userInfo.account).then(res => {
					if (res.msgCode === '000000') {
						this.msgList = res.data.map(msg => {
							return {
								...msg,
								...JSON.parse(msg.content)
							}
						})
					} else {
						this.$refs.uTips.show({
							title: `消息列表获取失败，原因：${ res.message }`,
							type: 'error',
							duration: 2300
						})
					}
				}).catch(err => this.common.sysErrToast(this, err))
			},
			changeList(index) {
				if (this.current !== index) {
					this.showNotise = false
					switch (index) {
						case 0:
							this.getNotiseList()
							this.switchNavBtn()
							break
						case 1:
							this.getMsgList()
							this.switchNavBtn(true)
							break
					}
				} else {
					this.showNotise = true
				}
			},
			switchNavBtn(flag = false) {
				//#ifdef APP-PLUS
				this.$scope.$getAppWebview().setTitleNViewButtonStyle(0, {
					width: flag ? '48rpx' : 0
				})
				//#endif
			}
		},
		onNavigationBarButtonTap() {
			this.msgList.forEach(async msg => {
				if (!+msg.isRead) {
					await this.setMsgRead(msg.uuid)
				}
			})
			this.updateMsgStatus(false) //修改消息状态
			this.getMsgList()
		}
	}
</script>
<style lang="scss" scoped>
	.page-wrap {
		width: 100%;
		height: 100%;
		flex-direction: column;

		.msg-list {

			.order {
				width: 100%;
				background-color: #ffffff;
				box-sizing: border-box;
				font-size: 28rpx;

				.item {
					border-top: 1px solid #f5f5f5;

					.content {
						.title {
							font-size: 28rpx;
							line-height: 50rpx;
						}

						.type {
							margin-top: 10rpx;
							font-size: 24rpx;
							color: $u-tips-color;
						}

					}
				}
			}
		}
	}
</style>
