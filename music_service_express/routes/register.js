var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
const {
    db
} = require('../globalConfig');


//检查用户名是否可用
router.post('/user_register/checkname.music', bodyParser.json(), (req, res, next) => {
    var registerParams = req.body;
    var name = registerParams.regName;
    db.query(`SELECT * FROM users WHERE userName = '${name}'`, (err, data) => {
        if (err) {
            console.log('注册错误：', err);
            res.json({
                code: 5,
                val: '数据库查询有误'
            })
        } else {
            if (data.length == 0) {
                res.json({
                    code: 0,
                    val: 'success'
                })
            } else {
                res.json({
                    code: 1,
                    val: '用户名已经存在'
                })
            }
        }
    })
})
// 注册
router.post('/user_register.music', bodyParser.json(), (req, res, next) => {
    var registerParams = req.body;
    var name = registerParams.userName;
    var pwd = registerParams.pwd;
    var nickname = registerParams.nickname;
	let now = (new Date()).Format("yyyy-MM-dd hh:mm:ss");

    console.log(name, pwd);
    if (!name) {
        res.json({
            code: 5,
            val: '请输入有效的用户名'
        }).end();
        return;
    }
    db.query(`SELECT * FROM users WHERE userName = '${name}'`, (err, data) => {
        if (err) {
            console.log(err);
            res.json({
                code: 5,
                val: '数据库查询有误'
            }).end();
        } else {
            if (data.length == 0) {
                db.query(`INSERT INTO users (userName,password,nickname,last_login_time) VALUES('${name}','${pwd}','${nickname}','${now}')`, (err, data) => {
                    if (err) {
                        console.log(err);
                        res.json({
                            code: 5,
                            val: "插入数据库失败"
                        }).end();
                    } else {
                        res.json({
                            code: 0,
                            val: "注册成功"
                        }).end();
                    }
                })
            } else {
                res.json({
                    code: 5,
                    val: '用户名已存在，请更换'
                }).end();
            }
        }
    })
})

module.exports = router;