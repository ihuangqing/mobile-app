1.项目结构说明

┌─common 														 公共资源文件
	└─api         		             			└─数据接口文件
	└─locales         		             	└─国际化文件
	└─axios.js         		             	└─axios，主要用于页面端测试文件上传
	└─baseData.js                      	└─通用数据获取并存储
	└─common.js         	             	└─封装的公共方法
	└─http.api.js                      	└─接口封装方法
	└─http.interceptor.js              	└─拦截器

│─components 						             符合vue组件规范的uni-app组件
	└─ay-qrcode                        	└─二维码生成插件
	└─MDParserHighlight                	└─markdown文件展示插件
	└─drag-button                				└─视频播放可拖拽悬浮窗

│─hybrid  							             App端存放本地html文件的目录（第三方插件）
	└─html                             	└─uni-app引用插件规范文件目录结构

│─js-sdk														 第三方插件库
	└─hexiii-nfc                       	└─NFC插件
	└─ly-watermark                      └─全局水印插件

│─nativeplugins                      本地插件--第三方插件本地文件
	└─Dasu-doc_preview                 	└─office文档阅读器
	└─Mpaas-Scan-Module                	└─支付宝扫码
	└─emm-subapp-sdk                	  └─联软安全门户插件包（拍照、文件阅读）

│─node_modules                       npm依赖包
	└─vue-i18n                         	└─国际化插件
	└─xmldom                        	 	└─xml文件解析器

│─pages 					             			 业务页面文件存放的目录
	└─404 
	└─common                           	└─公用页面
		└─selectItems                    		└─单选列表页面
		└─versionInfo                    		└─应用升级弹窗
		└─videoPlayer                    		└─视频播放组件
	└─components                       	└─公共组件
		└─noData                         		└─暂无数据组件
		└─mesLogin                         	        └─mes账号二次登录组件
		└─comingSoon                     		└─敬请期待组件
	└─home                             	└─首页
	└─login                            	└─登录
	└─microApp                         	└─分类
		└─Dips		                    			└─dips-设备点检
		└─E-Checklist                    		└─点检
		└─E-SOP       		             			└─SOP
		└─Fit-PersonJob                  		└─人岗匹配       
		└─Mes                 							└─Mes       
		└─Qms                 							└─Qms       
		└─Tdms                 							└─Tdms       
	└─mine                             	└─我的
		└─jobMatchRecords					        	└─岗位匹配记录
		└─myLearnRecords						        └─我的学习记录
		└─myApplyList							        	└─我的申请记录
		└─mySkills								        	└─我的技能
		└─setting					             	 		└─设置
			└─AppVersion				             	 	└─应用版本信息
			└─editPwd				             	 		 	└─修改密码
		└─skillEnhaRecords      		      	└─技能提升记录
		└─tools      		                 		└─工具应用
			└─batchWriteDataByNFC		           	└─NFC标签写入（sws业务）
			└─batchWriteDataByNFCForDips       	└─NFC标签写入（dips业务）
			└─NFCRead				           	        └─NFC数据读取小工具
			└─writeDataByNFC				           	└─NFC数据读写工具
		└─userInfo                   		  	└─个人中心
		└─workHours                   			└─工作时长
	└─msg                              	└─消息推送
	└─visualized                       	└─可视化

│─static 						             		存放应用引用的本地静态资源（如图片、视频等）的目录，注意：静态资源只能存放于此
	└─swd                             	└─欣旺达项目静态静态图片
	└─appsDB.js                         └─分类—应用库
	└─echarts.js                        └─echarts库
	└─iconfont.css			             	  └─阿里图标库
	└─iconfont.ttf		             			└─tabbar图片需要ttf文件
	└─iconfont-colorful.css		          └─彩色字体图标
	└─mixin.js                          └─全局事件监听混合
	└─sws.scss                          └─自定义全局样式

│─store 							             	store模式 全局状态响应（VUEX）

│─uni_modules 			             		存放[uni_module](/uni_modules)规范的插件
	└─uni-swipe-action                  └─滑动组件（左滑删除、收藏等）

│─uview-ui                       		uview组件库

│─App.vue                           应用配置，用来配置App全局样式以及监听 应用生命周期  程序升级写在这里

│─main.js                           Vue初始化入口文件

│─manifest.json                     配置应用名称、appid、logo、版本等打包信息

└─pages.json                        配置页面路由、导航条、选项卡等页面类信息

2.项目打包说明	

- 修改manifest.json文件中版本号，应用版本名称和应用版本号一一对应，其中和后台服务中版本号匹配的是应用版本名称，一次升级需要保证
  		应用版本名称 === 后台服务中的版本号  &&  大于上一次的版本号
  ![](README_files/1.jpg)
- 发行 → 原生App-云打包