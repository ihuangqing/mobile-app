<template>
	<view class="page-wrap">
		<u-cell-group title="基础信息">
			<u-cell-item title="用户名" hover-class="none" :arrow="false" :value="baseInfo.userName"></u-cell-item>
			<u-cell-item title="账号" hover-class="none" :arrow="false" :value="baseInfo.account"></u-cell-item>
			<u-cell-item title="角色" hover-class="none" :arrow="false" :value="baseInfo.role"></u-cell-item>
			<u-cell-item title="部门" hover-class="none" :arrow="false" :value="baseInfo.deptName"></u-cell-item>
			<u-cell-item title="微信号" hover-class="none" :arrow="false" :value="baseInfo.wx"></u-cell-item>
			<u-cell-item title="手机号" hover-class="none" :arrow="false" :value="baseInfo.telephone"></u-cell-item>
			<u-cell-item title="邮箱" hover-class="none" :arrow="false" :value="baseInfo.email"></u-cell-item>
		</u-cell-group>
		<u-cell-group title="所属组织">
			<u-cell-item v-for="(item, index) in factoryList" :key="index" :title="item.factoryName"
				:title-style="item.checked ? {color: '#2979ff', 'font-weight': 'bold'} : {}" :arrow="false"
				hover-class="none" @click="changeFactory(item)">
				<u-icon slot="right-icon" name="checkbox-mark" color="#2979ff" size="32" v-show="item.checked">
				</u-icon>
			</u-cell-item>
		</u-cell-group>
		<u-modal v-model="show" :content="content" @confirm="modalConfirm"></u-modal>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'

	export default {
		data() {
			return {
				baseInfo: {
					userName: '',
					account: '',
					role: '',
					deptName: '',
					wx: '',
					telephone: '',
					email: ''
				},
				factoryList: [],
				content: '',
				show: false
			}
		},
		computed: mapState(['userInfo', 'dutyInfo', 'factoryId']),
		async onLoad() {
			let role = ''
			if (this.dutyInfo.roles.length) {
				role = this.dutyInfo.roles.map(({
					roleName
				}) => {
					return roleName
				}).join('、')
			}

			this.baseInfo = {
				...this.userInfo,
				role
			}

			const list = await this.baseData.getAllFactorys(this, this.userInfo.account) //获取系统组织
			this.factoryList = list.map(({
				label,
				value
			}) => {
				return {
					factoryName: label,
					factoryId: value,
					checked: this.factoryId === value
				}
			})
		},
		methods: {
			...mapMutations(['updateHeader']),
			changeFactory(item) {
				if (!item.checked) {
					this.factoryList.forEach(item => {
						if (item.checked) item.checked = false
					})
					item.checked = true
					this.updateHeader({
						language: 'zh',
						factoryId: item.factoryId,
						factoryName: item.factoryName
					}) //保存语言类型和所属组织到请求头

					this.content = `登录组织切换为：${ item.factoryName }`
					this.show = true
				}
			},
			modalConfirm() {
				uni.navigateBack()
			}
		}
	}
</script>

<style>
	.page-wrap {
		background-color: #ededed;
		width: 100%;
		height: 100%;
	}
</style>
