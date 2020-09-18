var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
const {
  cscQuery
} = require('../globalConfig');
/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});
router.post('/edit_avatar.music', bodyParser.json(), async (req, res, next) => {
  // let avatarBase64;
  let postParams = req.body;
  let avatarBase64 = postParams.url;
  // console.log(avatarBase64);
  let userId = postParams.userId;
  cscQuery(`UPDATE users SET avatar=('${avatarBase64}') WHERE id='${userId}'`).then(re => {
    // console.log(re);
    res.json({
      code: 0,
      msg: 'success'
    })
  }).catch(er => {
    console.log(er);
    res.json({
      code: 5,
      msg: 'error'
    })
  })
})
router.post('/edit_nickName.music', bodyParser.json(), async (req, res, next) => {
  let postParams = req.body;
  let nickName = postParams.nickName;
  let userId = postParams.userId;
  cscQuery(`UPDATE users SET nickName=('${nickName}') WHERE id='${userId}'`).then(re => {
    res.json({
      code: 0,
      msg: 'success'
    })
  }).catch(er => {
    console.log(er);
    res.json({
      code: 5,
      msg: 'error'
    })
  })
})

router.post('/get_userInfo.music', bodyParser.json(), async (req, res, next) => {
  let postParams = req.body;
  let userId = postParams.userId;
  cscQuery(`SELECT * FROM users WHERE id=${userId}`).then(userInfo => {
    console.log('==========********************',userInfo[0]);
    if (!userInfo[0].avatar) {
      userInfo[0].avatar = "https://www.rocker.pub/staticResource/images/wanj.jpg"
    }
    delete userInfo[0].password;
    res.json({
      code: 0,
      data: userInfo[0],
      msg: 'success'
    })
  }).catch(er => {
    console.log(er);
    res.json({
      code: 5,
      msg: 'error'
    })
  })
})
router.post('/edit_password.music', bodyParser.json(), async (req, res, next) => {
  let postParams = req.body;
  let userId = postParams.userId;
  let reNewPassword = postParams.reNewPassword;
  let oldPwd = postParams.oldPwd;
  cscQuery(`SELECT * FROM users WHERE id=${userId}`).then(re => {
    console.log(re);
    if (re[0].password === oldPwd) {
      cscQuery(`UPDATE users SET password=('${reNewPassword}') WHERE id=('${userId}')`).then(userInfo => {
        console.log(userInfo);
        if (!userInfo.avatar) {
          userInfo.avatar = "https://www.rocker.pub/wanj.jpg"
        }
        delete userInfo.password;
        res.json({
          code: 0,
          data: userInfo[0],
          msg: 'success'
        })
      }).catch(er => {
        console.log(er);
      })
    } else {
      res.json({
        code: 4,
        msg: '旧密码错误'
      })
    }
  }).catch(er => {
    console.log(er);
    res.json({
      code: 5,
      msg: 'error'
    })
  })
})


module.exports = router;