const cosSecretId = 'AKIDoQlqeKvGsCF2XmjH7gxxQfaEbiY5p8F9';
const cosSecretKey = 'kD0bu3uWrvjhOwCBE0XtxlIZ5OQFn4Zn';
const mysql = require('mysql');
let db = mysql.createPool({
	user: 'root',
	host: 'localhost',
	password: 'Chen7349058.',
	port: '3306',
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
	cosSecretId,
	cosSecretKey,
	db,
	cscQuery,
	absPath
}