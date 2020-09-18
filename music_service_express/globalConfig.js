const mysql = require('mysql');
let db = mysql.createPool({
	user: 'root',
	host: 'localhost',
	password: 'Your Password',
	port: 'Your port',
	database: 'geek_music'
});
const absPath = '/Users/geekchen/Desktop/musicResource';  //开发
// const absPath = '/musicResource/lizhi'; // 线上

let cscQuery = function (sql) {
	return new Promise((resolve, reject) => {
		db.query(sql, (err, data) => {
			if (err) {
				reject(err);
			} else {
				resolve(data);
			}
		})
	})
}

module.exports = {
	db,
	cscQuery,
	absPath
}
