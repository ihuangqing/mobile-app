<template>
	<view class="search-page ">
		<view class="u-flex sws-w100 date-bar ">
			<view class="u-flex-1 u-flex u-row-center sws-flex-d-column u-border-left u-border-right"
				@click="openStartTime">
				<view class="u-type-primary u-font-24">开始日期</view>
				<view class="u-type-primary u-font-32">{{bodyParams.body.startDateIn }}</view>
			</view>
			<view class="u-flex-1 u-flex u-row-center sws-flex-d-column u-border-left u-border-right"
				@click="openEndTime">
				<view class="u-type-primary u-font-24">截止日期</view>
				<view class="u-type-primary u-font-32">{{ bodyParams.body.startDateOut }}</view>
			</view>
		</view>	
		<view class="scroll-wrap  " style='background-color: #f2f2f2;'>
			<view style=' u-m-b-20'>
				<view v-for='(item,index) in exceptionItemList ' :key='index' class="list-item sws-bg-ffffff">
					<view class="list-item-header u-flex head-box">
						<view class='list-item-content head-top u-font-28  u-m-t-8' @click='showDetail(item)'>
							<view>{{item.categoryName}}</view>
							<view class='list-item-content-right'>{{item.stageName||'结案'}}</view>
						</view>
						<u-icon :name="item.uIconName" color="#fff" size="28" @click='showDetail(item)'></u-icon>
					</view>
					<view v-show='item.show' style='display:flex;justify-content:space-between'>
						<view class=" item-left u-p-l-30 u-p-t-10 u-p-r-10 u-p-b-16">
							
							<view v-for='(each,index) in item.problemFieldValueList' :key='index'
								class=" list-item-content u-font-28 u-content-color u-m-t-8">
								<view>{{each.fieldName}}</view>
								<view class='list-item-content-right'>{{each.fieldValue}}</view>
							</view>
							<!-- 固定字段 -->
							<view v-show='(item.fixedFieldList&&item.fixedFieldList.length>0)' v-for='(every,index) in item.fixedFieldList' :key="index"
								class=" list-item-content u-font-28 u-content-color u-m-t-8">
								<view>{{every.fieldValue}}</view>
								<view class='list-item-content-right'>{{every.value}}</view>
							</view>	
							<view class=" list-item-content u-font-28 u-content-color u-m-t-8">
								<view>提报人</view>
								<view class='list-item-content-right' >{{item.handlerName}}</view>
							</view>
							<view class=" list-item-content u-font-28 u-content-color u-m-t-8">
								<view>发现日期</view>
								<view class='list-item-content-right'>{{item.startDate}}</view>
							</view>
						</view>
						<view class="u-flex u-row-center u-p-l-10 u-p-r-20 sws-flex-d-column">
							<text class="u-type-primary" @click='gotoDetail'>详情</text>
							<u-icon name="arrow-rightward" color="#2979ff"></u-icon>
						</view>
					</view>
				</view>
				<u-loadmore :status="loadStatus" bgColor="#f2f2f2"></u-loadmore>
			</view>
			<!-- <no-data v-show="showNoData"></no-data> -->
		</view>
		<u-top-tips ref="uTips"></u-top-tips>
		<u-calendar v-model="showCalendar" mode="date" @change="calendarConfirm"></u-calendar>
	</view>
</template>

<script>
	import noData from '../../../components/noData/index.vue'
	import {
		mapState
	} from 'vuex'
	export default {
		components: {
			noData
		},
		data() {
			return {
				fixedFieldList:[],
				LabelNameList:[],
				priorityList:[],//优先级List
				seriousList:[],//严重性
			    queryParams:{},
				showCalendar: false,
				// startDateIn: '',
				// startDateOut: '',
				bodyParams:{
					body:{
						startDateOut:'',
						startDateIn:'',
						startName:'',
						isListFieldApp:'Y',
						categoryName:'',
						categoryCode:'',
						fieldList:[],
						state:'',
						nodeState:'',
						handlerAccount:''
					}
					
				},				
				loadStatus: 'loadmore',
				page:1,
				limit:10,		
				showPop: false,			
				searchKeyWord: '',
				searchVal: '',
				showNoData: false,
				// loadStatus: 'loadmore',
				showManufactoryOrder: false,
				prod: {},
				tableList: [],
				isToday: true,
				exceptionItemList: [
					
				]


			};
		},
		async onLoad(option) {
			this.bodyParams.body.startDateOut= this.$u.timeFormat()
			this.bodyParams.body.startDateIn= this.$u.timeFormat(this.common.dateCalculator(this, 7, this.bodyParams.body.startDateOut))
			this.bodyParams.body.startName=this.userInfo.account
			await this.postProblemBook()

		},	
		computed: {
			...mapState([ 'userInfo']), //获取登录的用户信息
		},

		methods: {
			openStartTime(){
				this.flag=true
				this.showCalendar=true
			},
			openEndTime(){
				this.flag=false
				this.showCalendar=true
			},
			calendarConfirm(res) {
				if(this.flag){
					this.bodyParams.body.startDateIn=res.result				
				}else{
					this.bodyParams.body.startDateOut=res.result
				}	
			this.page=1	
		this.exceptionItemList=[]
			this.postProblemBook()
		},
		checkIsToday() {
			
		},
			gotoDetail() { //详情--跳转web端详情页面
				// let linkUrl = 'http://10.201.88.55:8887/transaction/pendingPane'
				// window.location.href = linkUrl
			},
		
			showDetail(item) {
				item.show = !item.show
				if (item.show) {
					item.uIconName = 'arrow-down'
				} else {
					item.uIconName = 'arrow-up'
				}

			},
			
			postProblemBook(val) {//查询品质异常单--问题台账		
				var that=this
				this.loadStatus = 'loadmore'
			let params={
				query: {
					page: that.page,
					limit: that.limit
				},
				body:that.bodyParams.body								
			}
				
		uni.stopPullDownRefresh() //关闭下拉刷新	
		that.$u.api.postProblemBookApi(params).then(res => {
			if (res.msgCode === '000000') {
				const temp = res.data.data											
				that.dataList = [...that.exceptionItemList, ...temp]
				that.exceptionItemList = that.dataList			
				that.exceptionItemList.forEach((item,index) => {
				that.$set(item, 'uIconName', 'arrow-up')
				// 多个处理人时 拼接显示
				let str=''
				if(item.problemHandleNodeList&&item.problemHandleNodeList.length){					
				 str=item.problemHandleNodeList.map(each=>each.handlerName).join(",")																																	
				}
				item.handlerName=str						
	   if(item.fixedFieldList&&item.fixedFieldList.length>0){//固定字段		
		// this.fixedFieldList=item.fixedFieldList
		item.fixedFieldList.forEach(t=>{
			that.$set(t,'value','')			
		if(t.fieldName === 'lableName'){//问题标签
	       //始终取第一条
	      if(item.labelManagePoList&&item.labelManagePoList.length>0){
	      t.value=item.labelManagePoList[0].lableName
	      }
	      return;
		}
			//如果是字典值						
			if(t.workbookTypeCode){//存在workbookTypeCode 则需要调字典值接口			
			 that.$u.api.getDataDictionaryApi(t.workbookTypeCode).then(resp=>{
				var findItem= resp.data.find(e=>e.workbookCode==item[t.fieldName])
				    t.value=findItem.workbookContent 
			 })
                 return;			
			}
				  //其他一般情况
			    t.value=item[t.fieldName]			
				})		
			}												
					})
					that.page++
				if (!res.data.data.length || res.data.data.length < that.limit) {
					that.loadStatus = "nomore"
				}
				if (!that.exceptionItemList.length) {
					that.showNoData = true
				} else {
					that.showNoData = false
				}
			} else {
				that.$refs.uTips.show({
					title: `数据获取失败，原因：${ res.message }`,
					type: 'error',
					duration: 2300
				})
			}
				}).catch(err => {
					that.common.sysErrToast(that, err)
				})
			},																
		},	
		onNavigationBarButtonTap(e) {
			const _self = this
			uni.navigateTo({
				url: '/pages/microApp/Qms/problemAccount/searchConfirmPage/index',
				events: {
					acceptDataFromQueryPage: params => {
						_self.page = 1
						_self.exceptionItemList = []
						_self.bodyParams = params	
						_self.postProblemBook(_self.bodyParams)
					}
				}
			})

		},
		onReachBottom() {
			let that=this
			if (that.loadStatus != 'nomore') { //如果状态无数据，则不再请求
				that.loadStatus = "loading"
				that.postProblemBook()
			}
		},
		onPullDownRefresh() {
			let that=this
			that.page = 1
			that.exceptionItemList = []
			that.loadStatus = 'loadmore'
			that.postProblemBook()
		},
	};
</script>

<style lang='scss' scoped>
	uni-page-body{
		background: #f2f2f2;
	}
	.search-page {
		.scroll-wrap {
			width: 100%;
			height: 100%;
			padding: 100rpx 24rpx 24rpx 24rpx;
			.list-item-header {
				color: #ffffff;
			}

			.head-box {
				display: flex;
				justify-content: space-between;

				.head-top {
					width: 90%;
				}

			}

			.list-item {
				border: 2rpx solid #e8e8e8;
				box-shadow: 0 0 4rpx #e8e8e8;
				/* border-radius: 16rpx; */
				overflow: hidden;
				margin-top: 30rpx;
				border-radius: 12rpx;

				&-header {
					height:80rpx;
					line-height:56rpx;
					padding: 8rpx 20rpx;
					/* background-color: #2979ff; */
					/* background: linear-gradient(to left, #2979ff, #65c7f7, #9cecfb); */
					/* background: linear-gradient(to right, #0083fe, #00fff0); */
					background: #5cb8de;
				}
			}

			::deep.u-image__image {
				margin-top: 400rpx;
			}

		}

		.date-bar {
			position: fixed;
			background-color: #ffffff;
			height: 100rpx;
			z-index: 4;
		}

		.item-left {
			/* width: 580rpx; */
			width:86%;
		}

		.list-item-content {
			display: flex;
			justify-content: space-between;
		}
.list-item-content-right{
	width:300rpx;
	text-align:center
	
}

	}
</style>
