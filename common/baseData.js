/* 通用数据库 */

// 获取数据字典的值
const getDataCode = (vm, params) => {
	return new Promise((resolve, reject) => {
		vm.$u.api.getDataCode(params).then(res => {
			if (res.msgCode === '000000') {
				resolve(res.data)
			} else {
				resolve([])
			}
		}).catch(err => {
			resolve([])
		})
	})
}

// 获取拉线数据
const getLines = (vm) => {
	return new Promise((resolve, reject) => {
		vm.$u.api.getLines({
			state: 1, // 1有效的拉线数据   0 失效的拉线数据
			factoryId: vm.$store.state.factoryId
		}).then(res => {
			if (res.msgCode === '000000') {
				resolve(res.data)
			} else {
				resolve([])
			}
		}).catch(err => {
			resolve([])
		})
	})
}

// 获取主管数据
const getDirector = (vm) => { //拉线获取，已经获取过，则从从storage中获取
	return new Promise((resolve, reject) => {
		if (vm.$store.state.getDirector) {
			uni.getStorage({
				key: 'directorData',
				success: (res) => {
					resolve(res.data)
				}
			})
		} else {
			vm.$u.api.getDirector().then(res => {
				if (res.msgCode === '000000') {
					vm.$store.commit('updateGetDirector')
					uni.setStorage({
						key: 'directorData',
						data: res.data
					})
					resolve(res.data)
				} else {
					resolve([])
				}
			}).catch(err => {
				resolve([])
			})
		}
	})
}

//获取在岗信息
const getDutyInfo = (vm, account) => {
	return new Promise((resolve, reject) => {
		vm.$u.api.getOnDutyInfo(account).then(res => {
			if (res.msgCode === '000000') {
				vm.$store.commit('saveDutyInfo', res.data)
				resolve(res.data)
			} else {
				resolve({})
			}
		}).catch(err => {
			resolve({})
		})
	})
}

//获取登录人员基础信息
const getBaseUserInfo = (vm) => {
	return new Promise((resolve, reject) => {
		vm.$u.api.getUserInfo({}).then(res => {
			if (res.msgCode === '000000') {
				let userInfo = {
					...res.data
				}
				if (!res.data.avatar) { //防止第一次同步SAP数据未及时返回
					userInfo.avatar = '../../static/swd/user.png'
				}
				vm.$store.commit('updateUserInfo', userInfo)
				resolve(userInfo)
			} else {
				resolve({})
			}
		}).catch(err => {
			resolve({})
		})
	})
}

//根据人员工号获取所有微服务系统中关联的组织
const getAllFactorys = (vm, account) => {
	return new Promise(resolve => {
		vm.$u.api.getAllFactorys(account).then(res => {
			if (res.msgCode === '000000') {
				let list = res.data.map(factory => {
					return {
						label: factory.factoryName,
						value: factory.id,
						extra: 'factory'
					}
				})
				resolve(list)
			} else {
				resolve([])
			}
		}).catch(err => {
			resolve([])
		})
	})
}

const getFactorys = async (vm, account) => {
	const appNameList = ['sws', 'dips', 'qms', 'clms']
	let dataList = []
	for (let i = 0; i < appNameList.length; i++) {
		let appName = appNameList[i]
		let list = await getFactorysFromServer(vm, account, appName)
		dataList = [...dataList, ...list]
	}

	let res = duplicateRemoval(dataList)
	return (res)
}


// 获取指定系统中的组织
const getFactorysFromServer = (vm, account, appName) => {
	return new Promise(resolve => {
		vm.$u.api.getFactorys(account, {
			appName: appName
		}).then(res => {
			if (res.msgCode === '000000') {
				let list = res.data.map(factory => {
					return {
						label: factory.factoryName,
						value: factory.id,
						extra: 'factory'
					}
				})
				resolve(list)
			} else {
				resolve([])
			}
		}).catch(err => {
			resolve([])
		})
	})
}

const duplicateRemoval = list => {
	//对象数组去重
	let hash = {}
	let res = list.reduce((preVal, curVal) => {
		hash[curVal.value] ? '' : (hash[curVal
			.value] = true && preVal.push(
			curVal))
		return preVal
	}, [])

	return res
}

// 通过物料编号获取物料信息
const getMaterialInfo = (vm, materialCode) => {
	return new Promise((resolve, reject) => {
		vm.$u.api.getMaterialInfo(materialCode).then(res => {
			if (res.msgCode === '000000' && res.data) {
				resolve(res.data)
			} else {
				resolve({})
			}
		}).catch(err => {
			resolve({})
		})
	})
}

// 通过工治具编号获取工治具信息
const getFixtureInfo = (vm, fixtureCode) => {
	return new Promise((resolve, reject) => {
		vm.$u.api.getFixtureInfo(fixtureCode).then(res => {
			if (res.msgCode === '000000' && res.data) {
				resolve(res.data)
			} else {
				resolve({})
			}
		}).catch(err => {
			resolve({})
		})
	})
}

// 获取库位（子项）信息
const getLocationChildInfo = (vm, id, getChild = true) => {
	return new Promise((resolve, reject) => {
		vm.$u.api.getLocationChildInfo(id).then(async res => {
			if (res.msgCode === '000000') {
				let data = []
				for (var i = 0; i < res.data.length; i++) {
					let item = res.data[i]
					let temp = {
						value: item.id,
						label: item.positionName,
						info: item
					}
					if (getChild && item.hasChildren) {
						const res = await getLocationChildInfo(vm, item.id)
						if (res.length) {
							temp.children = res
						}
					}
					data.push(temp)
				}
				resolve(data)
			} else {
				resolve([])
			}
		}).catch(err => {
			resolve([])
		})
	})
}

// 获取库位信息 参数：getChild 是否获取库位子集信息，默认true
const getLocationInfo = (vm, getChild = true) => {
	return new Promise((resolve, reject) => {
		vm.$u.api.getLocationInfo().then(async res => {
			if (res.msgCode === '000000') {
				let data = []
				for (let i = 0; i < res.data.length; i++) {
					let item = res.data[i]
					let temp = {
						value: item.id,
						label: item.positionName,
						info: item
					}
					if (getChild && item.hasChildren) {
						const res = await getLocationChildInfo(vm, item.id) //解决请求异常或者返回为空的问题
						if (res.length) {
							temp.children = res
						}
					}
					data.push(temp)
				}
				resolve(data)
			}
		}).catch(err => {
			resolve([])
		})
	})
}

// 上传cid 绑定用户
const postCid = (vm, {
	clientId,
	account,
	username
}) => {
	return new Promise((resolve, reject) => {
		const params = {
			clientId,
			account,
			username
		}
		vm.$u.api.postCid(params).then(res => {
			if (res.msgCode === '000000') {
				console.log('clientId上传成功！')
				resolve([])
			} else {
				console.log('clientId上传失败！')
				resolve([])
			}
		}).catch(err => {
			resolve([])
		})
	})
}

// 0-正常 1-NG 2-报废 3-重工 4-删除SN 5-待报废 6-锁定 7-解锁 8-待解锁 9-完工 A-入库 B-出货
const getProdStatus = lockStatus => {
	let status = ''
	let color = '#909399'
	switch (lockStatus) {
		case '0':
			status = '正常'
			break;
		case '1':
			status = 'NG'
			break;
		case '2':
			status = '报废'
			color = '#fa3534'
			break;
		case '3':
			status = '重工'
			break;
		case '4':
			status = '删除SN'
			break;
		case '5':
			status = '待报废'
			color = '#774aa6'
			break;
		case '6':
			status = '锁定'
			color = '#2979ff'
			break;
		case '7':
			status = '解锁'
			color = '#19be6b'
			break;
		case '8':
			status = '待解锁'
			color = '#ff9900'
			break;
		case '9':
			status = '完工'
			break;
		case 'A':
			status = '入库'
			break;
		case 'B':
			status = '出货'
			break;
	}
	return {
		status,
		color
	}
}

export default {
	getLines,
	getDirector,
	getDutyInfo,
	getDataCode,
	getBaseUserInfo,
	getMaterialInfo,
	getLocationInfo,
	getLocationChildInfo,
	getFixtureInfo,
	getAllFactorys,
	getFactorys,
	getFactorysFromServer,
	postCid,
	getProdStatus
}
