<!-- E-SOP → 技能矩阵 -->
<template>
	<view class="page-wrap sws-wh100 u-flex sws-flex-d-column u-p-b-20">
		<view class="u-p-20 sws-w100">
			<u-search placeholder="请输入姓名" v-model="keyword" shape="square" @custom="getSkillMatrix"
				@search="getSkillMatrix">
			</u-search>
		</view>
		<view class="u-flex-1 sws-w100" v-if="list.length">
			<swiper v-if="refreshSwiper" class="sws-wh100" :next-margin="nextMargin" :circular="true">
				<swiper-item v-for="(item, index) in list" :key="index">
					<u-card class="sws-h100" margin="0rpx 20rpx" :head-style="{background: '#2979ff', height: '104rpx'}"
						:body-style="{background: '#fafafa',height: '100%', padding: '0 0 104rpx 0'}" :show-foot="false"
						:title="item.userName" title-color="#ffffff" title-size="44" :sub-title="item.account"
						sub-title-color="#ffffff">
						<scroll-view slot="body" :scroll-top="0" scroll-y="true" class="scroll-Y sws-h100">
							<u-cell-group title="基础信息">
								<u-cell-item hover-class="none" :arrow="false" title="下一工位"
									:value="item.reachStr.split('&')[1]">
								</u-cell-item>
								<u-cell-item hover-class="none" :arrow="false" title="下一工位达标时长"
									:value="item.reachStr.split('&')[2]"></u-cell-item>
								<u-cell-item hover-class="none" :arrow="false" title="部门" :value="item.deptName">
								</u-cell-item>
							</u-cell-group>
							<u-cell-group title="可生产产品技能及等级">
								<u-cell-item class="u-p-0" hover-class="none" :arrow="false">
									<u-collapse hover-class="none" :head-style="{'padding': '40rpx'}"
										:item-style="{'border-bottom': 'solid 1px #ededed'}">
										<u-collapse-item :title="product.productName"
											v-for="(product, index) in item.productSkills" :key="index">
											<u-cell-item class="u-p-l-80 u-p-r-60" :border-top="true"
												:border-bottom="false" hover-class="none" :arrow="false"
												:title="skill.skillName" v-for="(skill, index) in product.skills"
												:key="index">
												<u-icon slot="right-icon" :name="gradeIcon(skill.grade)"
													custom-prefix="sws-icon" :color="gradeColor(skill.grade)" size="40">
												</u-icon>
											</u-cell-item>
										</u-collapse-item>
									</u-collapse>
								</u-cell-item>
							</u-cell-group>
						</scroll-view>
					</u-card>
				</swiper-item>
			</swiper>
		</view>
		<no-data v-show="showNoData"></no-data>
		<u-top-tips ref="uTips"></u-top-tips>
	</view>
</template>

<script>
	import noData from '../../../components/noData/index'

	export default {
		components: {
			noData
		},
		data() {
			return {
				keyword: '',
				list: [],
				refreshSwiper: true,
				showNoData: false,
				nextMargin: '50rpx', //多个结果集时，保证下一个引入的效果
			}
		},
		onReady() {
			this.getSkillMatrix()
		},
		computed: {
			gradeIcon(grade) {
				return grade => {
					switch (grade) {
						case '实习':
							return 'shixi'
							break
						case 'I':
							return 'zimui'
							break
						case 'L':
							return 'zimul'
							break
						case 'U':
							return 'zimuu'
							break
						case 'O':
							return 'zimuo'
							break
					}
				}
			},
			gradeColor(grade) {
				return grade => {
					switch (grade) {
						case '实习':
							return '#82848a'
							break
						case 'I':
							return '#ff9900'
							break
						case 'L':
							return '#19be6b'
							break
						case 'U':
							return '#2979ff'
							break
						case 'O':
							return '#88147f'
							break
					}
				}
			}
		},
		methods: {
			getSkillMatrix() { // 获取全量的技能矩阵数据
				const params = {
					query: {
						page: 1,
						limit: 5
					},
					body: {
						userName: this.keyword
					}
				}

				this.showNoData = false
				this.$u.api.getSkillMatrix(params).then(res => {
					if (res.msgCode === '000000') {
						this.list = res.data.data

						this.list.length > 1 ? (this.nextMargin = '50rpx') : (this.nextMargin = '0')

							!this.list.length ? (this.showNoData = true) : (this.showNoData = false)
							
						this.refreshSwiper = false
						this.$nextTick(function(){
							this.refreshSwiper = true
						})
					} else {
						this.$refs.uTips.show({
							title: `技能矩阵获取失败，原因：${res.message}`,
							type: 'error',
							duration: '2300'
						})
					}
				}).catch(err => {
					this.common.sysErrToast(this, err)
				})
			}
		}
	}
</script>
