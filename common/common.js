/* 方法库 */

// 版本校验&&下载升级
const upgradeApp = (vm, curVersion) => {
	const baseUrl = vm.$store.state.baseUrl
	let downloadUrl = 'http://dipsftp.sunwoda.com/android/sws-app-android.apk'
	if(baseUrl.includes('msplatform.sunwoda-evb.com')) {
		downloadUrl = 'http://dipsftp.sunwoda.com/evbAndroid/sws-app-android.apk'
	} 
	vm.$u.api.getUpgradeInfo().then(res => {
		if (res.msgCode === '000000' && res.data) {
			if (res.data.currentVersion > curVersion) {
				uni.showModal({
					title: '版本更新',
					content: `当前最新版本为v${ res.data.currentVersion }，请下载更新！`,
					confirmText: "下载更新",
					showCancel: false,
					success(e) {
						if (e.confirm) {
							createDownload(downloadUrl)
						} else {
							uni.showToast({
								title: '取消更新，将退出应用!',
								icon: 'none'
							})
							setTimeout(() => {
								plus.runtime.quit()
							}, 2000)
						}
					}
				})
			} else {
				uni.showToast({
					title: '当前最新版本',
					icon: 'none',
					position: 'bottom'
				})
			}
		} else {
			vm.$u.toast('版本号获取失败！', 3300)
		}
	}).catch(err => {
		sysErrToast(this, err)
	})
}

const createDownload = (apkUrl, successFuc) => {
	// const apkUrl = 'http://dipsftp.sunwoda.com/android/sws-app-android.apk'
	var dtask = plus.downloader.createDownload(apkUrl, {}, (d, status) => {
		uni.showToast({
			title: '下载完成',
			mask: false,
			duration: 1000
		})
		// 下载完成
		console.log('status: ' + status)
		if (status == 200) {
			console.log('下载成功：' + d.filename)
			plus.runtime.install(plus.io.convertLocalFileSystemURL(d.filename), {}, function(success) {
				uni.showToast({
					title: '安装成功',
					mask: false,
					duration: 1500
				})
				successFuc && successFuc()
			}, function(error) {
				uni.showToast({
					title: '安装失败-01',
					mask: false,
					duration: 1500
				})
			})
		} else {
			uni.showToast({
				title: '安装失败-02',
				mask: false,
				duration: 1500
			})
		}
	})
	try {
		dtask.start() // 开启下载的任务
		var prg = 0
		var showLoading = plus.nativeUI.showWaiting("正在下载") //创建一个showWaiting对象 
		dtask.addEventListener('statechanged', function(task, status) {
			// 给下载任务设置一个监听 并根据状态  做操作
			switch (task.state) {
				case 1:
					showLoading.setTitle("正在下载")
					break
				case 2:
					showLoading.setTitle("已连接到服务器")
					break
				case 3:
					prg = parseInt((parseFloat(task.downloadedSize) / parseFloat(task.totalSize)) * 100)
					showLoading.setTitle("  正在下载" + prg + "%  ")
					break
				case 4:
					plus.nativeUI.closeWaiting()
					//下载完成
					break
			}
		})
	} catch (err) {
		plus.nativeUI.closeWaiting()
		uni.showToast({
			title: '安装失败-03',
			mask: false,
			duration: 1500
		})
	}
}

// 获取DOM元素的信息 返回{width: 320, height: 1496}
const getElRect = (vm, elClass) => {
	return new Promise((resolve, reject) => {
		// #ifdef APP-PLUS
		const query = uni.createSelectorQuery().in(vm)
		query.select(elClass).fields({
			size: true
		}, res => {
			// 如果节点尚未生成，res值为null，循环调用执行
			if (!res) {
				setTimeout(() => {
					getElRect(elClass)
				}, 10)
				return
			}
			resolve(res)
		}).exec()
		// #endif
		// #ifdef H5
		vm.$u.getRect(elClass).then(res => {
			resolve(res)
		})
		// #endif
	})
}

// 格式化列表序号 列表下标+1+.
const serialNumFormatter = val => {
	return ++val + '.'
}

// 动态尺寸，解决有些元素不能设置rpx  参数px为元素设计尺寸
const elNotRpxToPx = (vm, px) => {
	let screenWidth = vm.$store.state.sysInfo.screenWidth
	return px * screenWidth / 320 //750/320*44/(750/screenWidth) 标准尺寸750，pda尺寸320，设计尺寸44，
}

// 系统错误统一处理
const sysErrToast = (vm, err) => {
	// 拦截器处理过的异常code不在提示系统错误
	if (err.data && ['000401', '010003', '010001'].includes(err.data.msgCode)) return
	vm.$u.toast('系统错误！', 3000)
	console.log('系统错误', err)

}

// 时间计算 d_val差值 单位天 date基础参数日期
const dateCalculator = (vm, d_val, date = new Date().getTime()) => {
	const curTime = new Date(date).getTime()
	const newTime = curTime - d_val * 24 * 60 * 60 * 1000
	return new Date(vm.$u.timeFormat(newTime) + ' 00:00:00').getTime()
}

// 为空校验
const checkNotNull = (vm, arr) => { // {tips: '提示类容', value: '判断条件'} 如果有校验不通过的则提示且返回false，没有则返回true
	return arr.every(item => {
		if (!item.value) { //如果为数值0 ，需要特殊处理
			vm.$refs.uTips.show({
				title: item.tips,
				type: 'warning',
				duration: '2300'
			})
			return false
		} else {
			return true
		}
	})
}

//图片文件file转base64地址
const imgFileToBase64Url = (vm, imgFile) => {
	return new Promise(resolve => {
		// #ifdef H5
		let pcReader = new FileReader()
		pcReader.onload = (e) => {
			resolve(e.target.result)
		}
		// #endif
		// #ifdef APP-PLUS
		var path = plus.io.convertLocalFileSystemURL(imgFile.path)
		plus.io.resolveLocalFileSystemURL(path, function(entry) {
			entry.file(function(file) {
				const reader = new plus.io.FileReader()
				reader.onloadend = function(e) {
					resolve(e.target.result)
				}
				reader.readAsDataURL(file)
			})
		}, function(e) {
			console.log('error:', e)
		})
		// #endif
	})
}

const copyTo = (curDirectory, targetDirectory) => { //目录拷贝
	//获取照片源文件并复制到DCIM/sunwoda目录
	plus.io.resolveLocalFileSystemURL(curDirectory, function(entry) {
		var directoryReader = entry.createReader() //获取读取目录对象
		directoryReader.readEntries(
			function(entries) { //历遍子目录即可
				for (var i = 0; i < entries.length; i++) {
					let temp = entries[i]
					plus.io.resolveLocalFileSystemURL('/storage/emulated/0/',
						entryc => { //此处根路径地址有兼容性bug，后续修改
							entryc.getDirectory(targetDirectory, {
								create: true
							}, success => {
								temp.copyTo(success, null, function(entry) {
									console.log("复制成功，新地址：" + entry.fullPath)
								}, function(e) {
									console.log(e.message)
								})
							}, fail => {
								console.error(fail)
							})
						}, fail => {
							console.error(fail.message)
						})
				}
			},
			function(err) {
				console.log("访问目录失败")
			})
	}, function(e) {
		console.log("访问目录失败：" + e.message)
	})
}

//从指定目录获取文件列表
const getFilesFromDirectory = (directory) => {
	return new Promise((resolve, reject) => {
		// #ifdef APP-PLUS
		plus.io.resolveLocalFileSystemURL(`/storage/emulated/0/${ directory }`, rootDirectoryEntry => {
			console.log('directoryEntry: ', rootDirectoryEntry.fullPath)
			let list = new Promise(childResolve => {
				const directoryReader = rootDirectoryEntry.createReader()
				directoryReader.readEntries(entries => {
					let fileList = entries.filter(({ //过滤文件目录，后续补充子目录递归
						isFile
					}) => isFile).map(({
						name,
						fullPath
					}) => {
						return {
							name,
							filePath: fullPath
						}
					})
					console.log('文件列表', fileList)
					childResolve(fileList)
				})
			})
			resolve(list)
		}, err => {
			console.log('文件目录读取失败：', err)
			resolve([])
		})
		// #endif
		// #ifdef H5
		resolve([])
		// #endif
	})
}

//拷贝文件到指定目录
const copyFileTo = (fileUrl, targetDirectory) => { //拷贝备件到指定的目录 fileUrl源文件url
	plus.io.resolveLocalFileSystemURL(fileUrl, FileEntry => {
		plus.io.resolveLocalFileSystemURL(FileEntry.fullPath.split('Android/data')[0], entryc => {
			entryc.getDirectory(targetDirectory, {
				create: true
			}, newTargetDirectory => {
				FileEntry.copyTo(newTargetDirectory, FileEntry.name, copyRes => {
					console.log('文件复制成功')
				}, copyErr => {
					console.log('文件复制失败')
				})
			}, fail => {
				console.error(fail)
			})
		}, fail => {
			console.error(fail.message)
		})
	}, err => {
		console.log('文件拷贝失败: ', err)
	})
}

const scanCode = vm => {
	return new Promise(resolve => {
		// #ifdef APP-PLUS
		if (uni.getSystemInfoSync().platform == "ios") {
			uni.scanCode({
				success: function(res) {
					console.log('扫描结果：', res)
					resolve(res.result)
				}
			})
		} else if (uni.getSystemInfoSync().platform == "android") {
			var mpaasScanModule = uni.requireNativePlugin("Mpaas-Scan-Module") //引用mapaas应用
			mpaasScanModule.mpaasScan({
				'type': 'qr', // 扫码 UI 风格，参数可为 qr、bar，默认为 qr
				'scanType': ['qrCode', 'barCode'], // 扫码识别类型，参数可多选，qrCode、barCode，不设置，默认识别所有
				'hideAlbum': false // 是否隐藏相册，默认false不隐藏
			}, (ret) => {
				console.log('扫描结果：', ret)
				if (ret.resp_code === 1000) { // resp_code 表示返回结果值，10：用户取消，11：其他错误，1000：成功
					resolve(ret.resp_result)
				} else if (ret.resp_code === 11) {
					uni.showToast({
						title: '扫码错误'
					})
				}
			})
		}
		// #endif
		// #ifdef H5
		resolve('ZF2023020322C-0780109') //web端测试数据
		// #endif
	})
}

// 照片压缩，后续增加二次判断，根据结果大小递归压缩
const compressImage = (src, quality = 10) => {
	return new Promise(resolve => {
		uni.compressImage({
			src,
			quality,
			success: res => {
				resolve(res.tempFilePath) //图片压缩成功
			},
			fail: err => {
				resolve('') //图片压缩失败
			}
		})
	})
}

const getIp = () => {
	if (uni.getSystemInfoSync().platform == 'android') {
		var NetworkInterface = plus.android.importClass("java.net.NetworkInterface")
		var InetAddress = plus.android.importClass("java.net.InetAddress")
		var Inet4Address = plus.android.importClass("java.net.Inet4Address")
		var networkInterface = NetworkInterface.getNetworkInterfaces()
		while (plus.android.invoke(networkInterface, 'hasMoreElements')) {
			var networkInterfaceElement = plus.android.invoke(networkInterface, 'nextElement')
			// 获取各个网络接口的地址
			var inetAddresses = plus.android.invoke(networkInterfaceElement, 'getInetAddresses')
			// 遍历从各个网络接口获取的地址
			while (plus.android.invoke(inetAddresses, 'hasMoreElements')) {
				var inetAddressesElement = plus.android.invoke(inetAddresses, 'nextElement')
				// 判断获取的地址不是环回接口的地址并且属于IPv4地址
				if (!plus.android.invoke(inetAddressesElement, 'isLoopbackAddress') &&
					inetAddressesElement instanceof Inet4Address) {
					const ipAddress = plus.android.invoke(inetAddressesElement, 'getHostAddress')
					return ipAddress ? ipAddress : ''
				}
			}
		}
	}
}
const getMacInfo = (wl) => {
	const macByte = wl.getHardwareAddress()
	let macAddr = []
	for (let i = 0; i < macByte.length; i++) {
		let tmp = ""
		let num = macByte[i]
		if (num < 0) {
			tmp = (255 + num + 1).toString(16)
		} else {
			tmp = num.toString(16)
		}
		if (tmp.length == 1) {
			tmp = "0" + tmp
		}
		macAddr.push(tmp)
	}
	return macAddr.join(':')
}

// 获取设备的mac地址
const getMacAddr = () => {
	if (uni.getSystemInfoSync().platform == "android") {
		try {
			const net = plus.android.importClass("java.net.NetworkInterface")
			const wl0 = net.getByName('wlan0')
			const eth0 = net.getByName('eth0')
			return {
				ethMac: eth0 && getMacInfo(eth0),
				wlanMac: wl0 && getMacInfo(wl0)
			}
		} catch (e) {
			uni.showToast({
				title: 'MAC地址获取失败！'
			})
		}
	}
}

//根据设备mac地址获取设备信息及应用权限
const getDeviceInfo = (vm, params) => {
	return new Promise((resolve, reject) => {
		vm.$u.api.getDeviceInfo(params).then(res => {
			if (res.msgCode === '000000') {
				if (Object.keys(res.data).length) {
					resolve(res.data)
				} else {
					resolve({})
					let str = '设备未授权，请联系管理员！'
					if (params.ethMac) {
						str += `以太网MAC地址：${params.ethMac}`
					} else if (params.wlanMac) {
						str += `,wlan MAC地址：${params.wlanMac}`
					}
					vm.$u.toast(str, 50000000000000) //长时间不关闭
				}
			} else {
				resolve({})
				vm.$u.toast('设备信息获取失败！', 3000)
			}
		}).catch(err => {
			resolve({})
			vm.common.sysErrToast(this, err)
		})
	})
}

const goToSelected = (item) => {
	return new Promise((resolve, reject) => {
		// title 选择列表页面标题  list 选择列表项 hasSeach是否需要本地搜索, isRadio是否单选
		let params = {
			title: item.title ? item.title : '请选择',
			items: item.list,
			hasSearch: item.hasSearch ? item.hasSearch : false,
			isRadio: item.isRadio ? item.isRadio : false,
			filterFunc: item.filterFunc ? item.filterFunc : null, //过滤函数(必须同步)，默认本地过滤
		}
		uni.navigateTo({
			url: '/pages/common/selectItems/index',
			events: {
				acceptDataFromOpenedPage(res) {
					resolve(res.data)
				}
			},
			success: function(res) {
				res.eventChannel.emit('acceptDataFromOpenerPage', params)
			}
		})
	})
}

export default {
	upgradeApp,
	createDownload,
	getElRect,
	serialNumFormatter,
	elNotRpxToPx,
	sysErrToast,
	dateCalculator,
	checkNotNull,
	imgFileToBase64Url,
	copyTo,
	getFilesFromDirectory,
	copyFileTo,
	scanCode,
	compressImage,
	getIp,
	getMacAddr,
	getDeviceInfo,
	goToSelected
}
