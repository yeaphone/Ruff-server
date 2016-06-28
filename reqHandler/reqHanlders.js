var server = require("../server");
var fs = require("fs");

// 存放不同的处理程序，和请求的URL相对应
function start(req, res) {

	fs.createReadStream("./views/index.html").pipe(res);

	console.log("Request handler 'start' was called.");
}

function firelight(req, res) {

	if (server) {
		server.broadcast("show light");
	}
	//可以解决跨域的请求
	res.writeHead(200, {
		"Content-Type": 'text/plain',
		'charset': 'utf-8',
		'Access-Control-Allow-Origin': '*',
		'Access-Control-Allow-Methods': 'PUT,POST,GET,DELETE,OPTIONS'
	});

	var json = '{"key1":"value1","key2":"value2"}'

	res.write(json);

	res.end();

	console.log("Request handler 'firelight' was called.");
}

function upload(req, res) {
	console.log("Request handler 'upload' was called.");
}

exports.start = start;
exports.firelight = firelight;
exports.upload = upload;