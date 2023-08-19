// 我的--基础应用列表
const mineBase = [{
	"name": "学习记录",
	"icon": "wodekecheng",
	"color": "",
	"path": "/pages/mine/myLearnRecords/index"
}, {
	"name": "我的技能",
	"icon": "wodejineng",
	"color": "",
	"path": "/pages/mine/mySkills/index"
}, {
	"name": "我的申请",
	"icon": "wodeshenqing",
	"color": "",
	"path": "/pages/mine/myApplyList/index"
}]

// 我的--扩展应用列表
const mineExtra = [{
	"name": "技能提升记录",
	"icon": "jinengtisheng",
	"color": "",
	"path": "/pages/mine/skillEnhaRecords/index"
}, {
	"name": "工作时长查询",
	"icon": "gongzuoshichang",
	"color": "",
	"path": "/pages/mine/workHours/index"
}, {
	"name": "岗位匹配记录",
	"icon": "rengangpipei",
	"color": "",
	"path": "/pages/mine/jobMatchRecords/index"
}]

/* 
	所有应用仓库,用于展示和模糊查询
	{
		"name": "应用名称",
		"icon": "引用图标名称",
		"color": "图标颜色",
		"auth": ["有权限使用的角色"],
		"path": "应用打开路径"
	}
	*/
export default {
	mineBase,
	mineExtra
}
