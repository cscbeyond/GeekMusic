var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
const {
    db
} = require('../globalConfig');

router.post('/user_login.music', bodyParser.json(), function (req, res, next) {
    // res.render('index', { title: 'Express000' });
    var postParams = req.body;
    console.log(postParams.userName);
    console.log(postParams.pwd);
    var name = postParams.userName;
    var pwd = postParams.pwd;
	let now = (new Date()).Format("yyyy-MM-dd hh:mm:ss");

    db.query(`SELECT * FROM users WHERE userName = '${name}'`, (err, data) => {
        if (err) {
            console.log('错误：', err);
            res.json({
                code: 1,
                val: '数据库查询出现问题，请重试'
            })
        } else {
            if (data.length == 0) {
                res.json({
                    code: 5,
                    val: '不存在此用户名'
                })
            } else {
                if (data[0].password === pwd) {
                    db.query(`UPDATE users SET last_login_time='${now}' WHERE id='${data[0].id}'`,(updateErr,updateRes)=>{
                        if(updateErr){
                            console.log(updateErr);
                        } else {
                            console.log(updateRes);
                        }
                    })
                    let userInfo = data[0];
                    if (!userInfo.avatar) {
                        userInfo.avatar = "https://www.rocker.pub/staticResource/images/wanj.jpg"
                    }
                    if (!userInfo.nickName) {
                        userInfo.nickName = "B粉"
                    }
                    delete userInfo.password;
                    res.json({
                        code: 0,
                        userInfo: userInfo,
                        val: {
                            rights: userInfo.userName + '登录成功'
                        }
                    })
                } else if (data[0].password != pwd) {
                    res.json({
                        code: 4,
                        val: '密码错误'
                    })
                }
            }
        }
    })
});
module.exports = router;