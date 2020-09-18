const express = require('express');
const router = express.Router();
var fs = require('fs');
var path = require('path');
var db = require('../globalConfig').db;
var absPath = require('../globalConfig').absPath
// 绝对路径前缀

// 对fs的rename进行封装
function fsRename(oldName, newName) { // 文件名是绝对路径
	console.log('oldName===, ', oldName, 'newName===', newName);
	try {
		fs.renameSync(`${oldName}`, `${newName}`);
		console.log('修改文件名成功');
	} catch (error) {
		console.log('重命名失败--------:' + err);
	}
}

// 根据文件的绝对路径，返回文件名以及文件所在的文件夹
function getFileDirAndFileName(absPath) {
	var str2 = absPath; //输入的字符串
	var index = 0; //开始查询的位置
	var key = "/"; //需要查询的字符串
	let idxArr = [];
	while ((index = str2.indexOf(key, index)) != -1) { //从角标index开始向后查询,如果角标是-1，则表示查询结束
		idxArr.push(index);
		index += key.length;
	}
	// console.log(idxArr);
	let dirName = str2.substring(idxArr[idxArr.length - 2], idxArr[idxArr.length - 1]).substring(1);
	// console.log(dirName);
	let fileName = str2.substring(idxArr[idxArr.length - 1]).substring(1)
	// console.log(dirName, fileName);
	// console.log('getFileDirAndFileName的参数：', absPath);
	return {
		dirName,
		fileName
	}
}

let statusFlag = true;

let songList = [];
let albumName, albumChinese;
router.get('/renameFile.music', async function (req, res) {
	const readDir = (entry) => {
		const dirInfo = fs.readdirSync(entry);
		console.log('dirInfo是--------:', dirInfo); // 是一个数组
		dirInfo.forEach((dirOrFile, idx) => {
			if (dirOrFile == '.DS_Store') {
				return;
			}
			console.log('dirOrFile是: ', dirOrFile);
			const location = path.join(entry, dirOrFile);
			const info = fs.statSync(location);
			if (info.isDirectory()) { // 是文件夹
				console.log('info的值是----：', info);
				// console.log(`dir-----:${location}`);
				let timeStamp = new Date().getTime() + Math.ceil((Math.random() * 1000)) + Math.ceil((Math.random() * 1000)) + Math.ceil((Math.random() * 1000));
				albumName = timeStamp;
				albumChinese = dirOrFile;
				fsRename(`${absPath}/${dirOrFile}`, `${absPath}/${timeStamp}`)
				readDir(`${absPath}/${timeStamp}`);
				// readDir(`${absPath}/${timeStamp}`);
			} else { // 是文件
				let obj = {};
				let timeStamp = new Date().getTime() + Math.ceil((Math.random() * 1000)) + Math.ceil((Math.random() * 1000)) + Math.ceil((Math.random() * 1000));
				let dirName = getFileDirAndFileName(`${location}`).dirName;
				// console.log('dirName---------------000000-------', dirName);
				let fileNameChinese = getFileDirAndFileName(`${location}`).fileName;
				fsRename(`${absPath}/${dirName}/${dirOrFile}`, `${absPath}/${dirName}/${timeStamp}.mp3`);
				// console.log(dirName, '======', fileNameChinese);
				obj.albumName = albumName + '';
				obj.albumChinese = albumChinese + '';
				obj.fileName = `${timeStamp}.mp3`;
				obj.fileNameChinese = fileNameChinese + '';
				obj.filePath = dirName + '/' + timeStamp + '.mp3'; // 这里应该是重命名之后的文件路径  现在是中文
				songList.push(obj);
			}
		})
	}
	readDir(absPath);
	console.log('songList是========：', songList);
	for (let i = 0; i < songList.length; i++) {
		let cell = songList[i];
		db.query(`INSERT INTO songsList (albumName, albumChinese,fileName, fileNameChinese,filePath) VALUES ('${cell.albumName}','${cell.albumChinese}','${cell.fileName}','${cell.fileNameChinese}','${cell.filePath}')`, (err, data) => {
			if (err) {
				statusFlag = false;
				console.log(err);
				return;
			} else {
				// console.log(data);
			}
		})
	}
	await res.json({
		code: 0,
		msg: '成功'
	})
});

module.exports = router;