const express = require('express');
const router = express.Router();
const request = require('request');
const path = require('path');
const fs = require('fs');
const mysql = require('mysql')
const bodyParser = require('body-parser');
const {
    pipeline
} = require('stream');
const {
    urlencoded
} = require('express');

var absPath = require('../globalConfig').absPath

router.get('/getSongStream.music', function (req, res) {

    let surl = (req.query.url);
    let url = `${absPath}/${surl}`
    console.log('url is=====', url);
    if (url.indexOf('mp3') == -1) {
        this.body = {
            title: '没有此文件'
        }
        return;
    }

    fs.stat(url, function (err, stats) {
        if (err) {
            res.end(err);
        }
        var range = req.headers.range;
        console.log(range);
        var positions = range.replace(/bytes=/, "").split("-");
        var start = parseInt(positions[0], 10);
        var total = stats.size;
        var end = positions[1] ? parseInt(positions[1], 10) : total - 1;
        var chunksize = (end - start) + 1;

        res.writeHead(206, {
            "Content-Range": "bytes " + start + "-" + end + "/" + total,
            "Accept-Ranges": "bytes",
            "Content-Length": chunksize,
            "Content-Type": "video/mp4"
        });

        var rs = fs.createReadStream(url);
        rs.pipe(res);
        rs.on('end', function () {
            res.end();
            console.log('end call');
        });
    })
});
module.exports = router;