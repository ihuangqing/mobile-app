<!-- 人岗匹配 → 上班签到 → 岗位信息 -->
<template>
	<view class="sws-wh100 u-flex sws-flex-d-column">
		<view class="sws-flex-d-column u-m-20 u-flex u-text-center">
			<view>
				<u-icon name="touxiang" custom-prefix="sws-icon" size="88" color="#909399"></u-icon>
			</view>
			<text class="u-m-t-20">{{ user.userName }}</text>
			<text class="u-m-t-20">{{ user.account }}</text>
		</view>
		<view class="u-flex-1 sws-w100">
			<u-cell-group :border="false">
				<u-cell-item v-if="isShowTemplate" class="u-p-b-0" hover-class="none" :arrow="false"
					:value-style="{fontSize: '32rpx', color: '#2979ff'}" value="签到模板" @click="toUseTemplate">
					<u-icon slot="right-icon" name="muban" custom-prefix="sws-icon" size="40" color="#2979ff"></u-icon>
				</u-cell-item>
				<u-cell-item hover-class="none" :arrow="false" title="班组长" :value="user.foremanName">
					<u-icon slot="icon" class="u-m-r-20" name="banzuzhang" custom-prefix="sws-icon" size="32"></u-icon>
				</u-cell-item>
				<u-cell-item required hover-class="none" arrow-direction="down" title="主管"
					:value="user.directorName ? user.directorName : '请选择主管'" @click="showDirector">
					<u-icon slot="icon" class="u-m-r-20" name="zhuguan" custom-prefix="sws-icon" size="32"></u-icon>
				</u-cell-item>
				<u-cell-item required hover-class="none"
					:value-style="{'padding-left': '30rpx', 'overflow-wrap': 'break-word'}" arrow-direction="down"
					title="拉线" :value="objToStr(user.lines, 'lineName') ? objToStr(user.lines, 'lineName') : '请选择拉线'"
					@click="showLines">
					<u-icon slot="icon" class="u-m-r-20" name="laxian" custom-prefix="sws-icon" size="32"></u-icon>
				</u-cell-item>
				<u-cell-item required hover-class="none" arrow-direction="down" title="工段"
					:value="user.mesArea ? user.mesArea : '请选择工段'" @click="showGd">
					<u-icon slot="icon" class="u-m-r-20" name="gongduan" custom-prefix="sws-icon" size="32"></u-icon>
				</u-cell-item>
				<u-cell-item required v-show="user.mesArea != ''" hover-class="none"
					:value-style="{'padding-left': '30rpx', 'overflow-wrap': 'break-word'}" arrow-direction="right"
					title="岗位" :value="objToStr(user.posts, 'postName') ? objToStr(user.posts, 'postName') : '请选择岗位'"
					@click="showPost">
					<u-icon slot="icon" class="u-m-r-20" name="gongxu" custom-prefix="sws-icon" size="32"></u-icon>
				</u-cell-item>
				<u-cell-item v-if="isShowPost" v-show="user.posts.length == 1" hover-class="none"
					:value-style="{'padding-left': '30rpx', 'overflow-wrap': 'break-word'}" arrow-direction="right"
					title="设备"
					:value="objToStr(user.devices, 'deviceCode') ? objToStr(user.devices, 'deviceCode') : '请选择设备'"
					@click="showDevices">
					<u-icon slot="icon" class="u-m-r-20" name="shebei" custom-prefix="sws-icon" size="32"></u-icon>
				</u-cell-item>
			</u-cell-group>
		</view>
		<view class="check-confirm sws-w100 u-flex u-row-between u-p-t-28 u-p-b-28">
			<u-button size="medium" type="default" @click="reset">重置</u-button>
			<u-button size="medium" type="primary" @click="confirm">确定</u-button>
		</view>
		<u-select v-model="show" :list="list" :title="title" @confirm="confirmSelect"></u-select>
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
					userName: '', //人员名称
					account: '', //人员工号
					directorName: '', //主管
					directorAcct: '', //主管工号
					lines: [], // 选中的拉线列表
					mesArea: '',
					posts: [], //选中的岗位列表
					devices: [], //选中的设备列表
				}, //人员信息
				directorList: [], //主管人员列表
				lineList: [], //拉线列表  因为拉线是固定的，请求一次缓存到当前组件，不需要每次去storage中取值，工段是固定写死的，工序和设备是关联查询的，所以需要每次请求接口查询
				postList: [], //岗位列表
				deviceList: [], //设备列表
				show: false, //下拉选择框显示状态
				title: '', //下拉标题
				list: [], //下拉选择列表
				templateList: [], //模板列表
				isShowTemplate: true, //是否显示模板
				isShowPost: true, //是否显示岗位
			}
		},
		computed: mapState(['userInfo']),
		onLoad(options) {
			const _self = this
			const eventChannel = this.getOpenerEventChannel();

			eventChannel.on('acceptDataFromOpenerPage', ({
				data
			}) => {
				if (data.from && data.from === 'userSign') {
					_self.from = 'userSign'
					_self.isShowPost = false
					_self.isShowTemplate = false
					_self.user = {
						...data.user
					}
				} else {
					_self.user = {
						..._self.user,
						...data.user
					}
					_self.templateList = data.list.filter(user => user.account != data.user
						.account) //模板列表为当前签到列表中除了自己的其它所有人
				}
			})
		},
		methods: {
			useTemplate(account) { //使用模板渲染
				let templateUser = this.templateList.filter(user => user.account == account)
				this.user = {
					...this.user,
					directorName: templateUser[0].directorName,
					directorAcct: templateUser[0].directorAcct,
					lines: templateUser[0].lines,
					mesArea: templateUser[0].mesArea,
					posts: templateUser[0].posts,
					devices: templateUser[0].devices
				}
			},
			toUseTemplate() { //使用模板，展示已获取的签到人员
				this.title = '请选择签到模板'
				this.list = this.templateList.map(user => {
					return {
						label: `使用${user.userName}作为签到模板`,
						value: user.account,
						extra: 'template'
					}
				})
				if (this.list.length > 0) {
					this.show = true
				} else {
					this.$refs.uTips.show({
						title: '当前暂无可使用的模板',
						type: 'warning',
						duration: '2300'
					})
				}
			},
			reset() {
				this.user.directorName = ''
				this.user.directorAcct = ''
				this.user.lines = [] // 选中的拉线列表
				this.user.mesArea = ''
				this.user.posts = [] //选中的岗位列表
				this.user.devices = [] //选中的设备列表
			},
			confirm() { //确定人员岗位信息编辑
				let checkArr = [{
					tips: '请选择主管',
					value: this.user.directorAcct
				}, {
					tips: '请选择拉线',
					value: this.user.lines.length
				}, {
					tips: '请选择工段',
					value: this.user.mesArea
				}, {
					tips: '请选择岗位',
					value: this.user.posts.length
				}]
				if (this.checkNotNull(checkArr)) {
					const eventChannel = this.getOpenerEventChannel()
					eventChannel.emit('acceptDataFromOpenedPage', {
						user: this.user
					})
					uni.navigateBack()
				}
			},
			goToSelected(title, list, type) { // title 选择列表页面标题  list 选择列表项 type赋值对象的属性名
				let _self = this
				let params = {
					title: title,
					items: list
				}
				if (type == 'posts') { //岗位单选
					params.isRadio = true
				}
				uni.navigateTo({
					url: '/pages/common/selectItems/index',
					events: {
						acceptDataFromOpenedPage(res) {
							_self.user[type] = []
							res.data.map(item => {
								let temp = {}
								switch (type) {
									case 'posts':
										temp = {
											postName: item.name,
											postId: item.value
										}
										_self.user.devices = [] //更换岗位之后，清空设备信息
										break
									case 'devices':
										temp = {
											deviceCode: item.name,
											aioDeviceId: item.value
										}
										break
								}
								_self.user[type].push(temp)
							})
						}
					},
					success: function(res) {
						// 通过eventChannel向被打开页面传送数据
						res.eventChannel.emit('acceptDataFromOpenerPage', params)
					}
				})
			},
			async showDirector() { //获取主管工号
				this.title = '请选择主管'
				if (this.directorList.length === 0) {
					let director = await this.baseData.getDirector(this)
					this.directorList = director.map(item => {
						return {
							label: item.userName,
							value: item.account,
							extra: 'director'
						}
					})
				}
				this.list = this.directorList
				this.show = true
			},
			async showLines() { //获取拉线数据,展示拉线列表
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
				this.list = this.lineList
				this.show = true
			},
			showGd() { //展示工段列表
				this.tips = '请选择工段'
				this.list = [{
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
				this.show = true
			},
			showPost() {
				let checkArr = [{
					tips: '请选择拉线',
					value: this.user.lines.length
				}, {
					tips: '请选择工段',
					value: this.user.mesArea
				}]
				if (this.checkNotNull(checkArr)) {
					let params = {
						lineId: this.user.lines[0].lineId,
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
								this.goToSelected('请选择岗位', this.postList, 'posts')
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
			showDevices() {
				let checkArr = [{
					tips: '请选择岗位',
					value: this.user.posts.length
				}]

				if (this.checkNotNull(checkArr)) {
					this.title = "请选择设备"
					this.$u.api.getDevicesByPostId(this.user.posts[0].postId).then(res => {
						if (res.msgCode === '000000') {
							this.deviceList = res.data.map(item => {
								return {
									name: item.deviceCode,
									value: item.id,
									extra: 'device'
								}
							})
							if (this.deviceList.length > 0) {
								this.goToSelected('请选择设备', this.deviceList, 'devices')
							} else {
								this.$refs.uTips.show({
									title: '设备信息为空！',
									type: 'warning',
									duration: '2300'
								})
							}
						} else {
							this.$refs.uTips.show({
								title: `设备获取失败，原因：${res.message}`,
								type: 'error',
								duration: '2300'
							})
						}
					}).catch(err => {
						this.common.sysErrToast(this, err)
					})
				}
			},
			confirmSelect(res) { //下拉选择框 确认操作，根据 extra 判断哪个下拉框
				let obj = res[0]
				switch (obj.extra) {
					case 'director':
						this.user.directorName = obj.label
						this.user.directorAcct = obj.value
						break
					case 'line': //拉线
						this.user.lines = [{
							lineName: obj.label,
							lineId: obj.value
						}]
						this.user.devices = [] //更换拉线之后，清空设备信息
						this.user.posts = [] //更换拉线之后，清空岗位信息
						break
					case 'mesArea': //工段
						this.user.mesArea = obj.value
						// 重置岗位选择
						this.user.posts = []
						break
					case 'template': //模板
						this.useTemplate(obj.value)
						break
				}
			},
			checkNotNull(arr) { // {tips: '提示类容', value: '判断条件'} 如果有校验不通过的则提示且返回false，没有则返回true
				return arr.every(item => {
					if (!item.value) { //如果为数值0 ，需要特殊处理
						this.$refs.uTips.show({
							title: item.tips,
							type: 'warning',
							duration: '2300'
						})
						return false
					} else {
						return true
					}
				})
			},
			objToStr(arr, attr) {
				return arr.map(item => {
					return item[attr]
				}).join(',')
			}
		},
		onBackPress() {
			if (this.show) {
				this.show = false
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
