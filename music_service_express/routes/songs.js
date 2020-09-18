const express = require('express');
const router = express.Router();
var cscQuery = require('../globalConfig').cscQuery;
const bodyParser = require('body-parser');
const {
	db
} = require('../globalConfig');
const moment = require('moment');
moment.locale('zh-cn');

// 重新组织查出来的歌曲列表
function reunionSongsList(arr) {
	// arr 传过来的原数组  
	let tempArr = [];
	let endData = [];
	for (let i = 0; i < arr.length; i++) {
		if (tempArr.indexOf(arr[i].albumChinese) === -1) {
			endData.push({
				albumChinese: arr[i].albumChinese,
				children: [arr[i]]
			});
			tempArr.push(arr[i].albumChinese);
		} else {
			for (let j = 0; j < endData.length; j++) {
				if (endData[j].albumChinese == arr[i].albumChinese) {
					endData[j].children.push(arr[i]);
					break;
				}
			}
		}
	}
	// console.log(endData); // 最终输出
	return endData;
}

router.post('/getSongsList.music', bodyParser.json(), async function (req, res) {
	let list = await cscQuery(`SELECT * FROM songsList`);
	let songsList = reunionSongsList(list);
	res.send({
		title: 'success',
		songsList
	});
})

router.post('/collect.music', bodyParser.json(), async function (req, res) {
	let postParams = req.body;
	let userId = postParams.userId;
	let songId = postParams.songId;
	let date = moment().format('YYYY-MM-DD HH:mm:ss');
	console.log(date);
	console.log(userId, songId);
	cscQuery(`SELECT * FROM collections  WHERE userId=${userId} AND songId=${songId}`).then(checkRes => {
		if (checkRes.length !== 0) {
			res.json({
				code: 5,
				val: '已收藏过'
			})
			return;
		} else {
			cscQuery(`INSERT INTO collections (userId,songId,date) 
			VALUES('${userId}','${songId}','${date}')`).then(sqlRes => {
				res.json({
					code: 0,
					val: '收藏成功'
				})
			}).catch(err => {
				res.json({
					code: 5,
					val: 'error,后台服务出现问题'
				})
				console.log(err);
			})
		}
	}).catch(err => {
		console.log(err);
		res.json({
			code: 5,
			val: 'error,后台服务出现问题'
		})
		return;
	})


})

router.post('/getCollectList.music', bodyParser.json(), async function (req, res) {
	let postParams = req.body;
	let userId = postParams.userId;
	console.log(userId);
	if (!userId) {
		res.json({
			code: 0,
			songsList: [],
			val: 'success'
		})
		return;
	}
	cscQuery(`SELECT * FROM collections WHERE userId=${userId}`).then(sqlRes => {
		// console.log('收藏列表：', sqlRes);
		res.json({
			code: 0,
			songsList: sqlRes,
			val: 'success'
		})
	}).catch(err => {
		res.json({
			code: 5,
			val: 'error,请重试'
		})
		console.log(err);
	})

})


router.post('/searchByKeyWords.music', bodyParser.json(), async function (req, res) {
	let postParams = req.body;
	let keyWords = postParams.keyWords;
	cscQuery(`SELECT * FROM songsList WHERE (albumChinese 
		LIKE '%${keyWords}%' OR 
		fileNameChinese LIKE '%${keyWords}%')`).then(sqlRes => {
		console.log('搜索结果', sqlRes);
		res.json({
			code: 0,
			songsList: sqlRes,
			val: 'success'
		})
	}).catch(err => {
		res.json({
			code: 5,
			val: 'error,请重试'
		})
		console.log(err);
	})

})

module.exports = router;