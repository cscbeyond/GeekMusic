const express = require('express');
const router = express.Router();
var cscQuery = require('../globalConfig').cscQuery;
const bodyParser = require('body-parser');
const {
    db
} = require('../globalConfig');
const moment = require('moment');
const {
    use
} = require('.');
moment.locale('zh-cn');

// 增
router.post('/songComments.music', bodyParser.json(), async function (req, res, next) {
    let postParams = req.body;
    let {
        userId,
        userName,
        songId,
        commentContent,
        type
    } = postParams;
    let date = moment().format('YYYY-MM-DD HH:mm:ss');
    cscQuery(`INSERT INTO comments (userId,userName, songId,commentContent,type,date) VALUES('${userId}','${userName}','${songId}','${commentContent}','${type}','${date}')`).then(r => {
        console.log(r);
        res.json({
            code: 0,
            val: '评论成功'
        }).end()
    }).catch(err => {
        console.log(err);
        res.json({
            code: 5,
            val: '错误'
        }).end()
    })
})

// 查
router.post('/getSongComments.music', bodyParser.json(), async function (req, res, next) {
    let postParams = req.body;
    let {
        songId,
        type
    } = postParams;
    cscQuery(`SELECT * FROM comments where songId = '${songId}' AND type = '${type}'`).then(r => {
        console.log(r);
        res.json({
            code: 0,
            data: r,
            val: 'success'
        }).end()
    }).catch(err => {
        console.log(err);
        res.json({
            code: 5,
            val: '错误'
        }).end()
    })

})


module.exports = router;