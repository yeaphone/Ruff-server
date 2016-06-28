var url = require("url");
var fs = require("fs");
var path = require("path");
var http = require('http');
var mime = require("./mime").types;
var config = require("./config");
var zlib = require("zlib");

// 本模块处理静态资源的加载

function handleStatic(pathname, req, res) {
	//加载静态资源
	if (pathname.slice(-1) === "/") {
		pathname = pathname + config.Welcome.file;

	}
	var realPath = path.join("assets", path.normalize(pathname.replace(/\.\./g, "")));

	var pathHandle = function(realPath) {

		fs.stat(realPath, function(err, stats) {

			if (err) {

				res.writeHead(404, "Not Found", {
					'Content-Type': 'text/plain'
				});

				res.write("This request URL " + pathname + " was not found on this server.");

				res.end();

			} else {

				if (stats.isDirectory()) {

					realPath = path.join(realPath, "/", config.Welcome.file);

					pathHandle(realPath);

				} else {

					var ext = path.extname(realPath);

					ext = ext ? ext.slice(1) : 'unknown';

					var contentType = mime[ext] || "text/plain";

					res.setHeader("Content-Type", contentType);



					var lastModified = stats.mtime.toUTCString();

					var ifModifiedSince = "If-Modified-Since".toLowerCase();

					res.setHeader("Last-Modified", lastModified);



					if (ext.match(config.Expires.fileMatch)) {

						var expires = new Date();

						expires.setTime(expires.getTime() + config.Expires.maxAge * 1000);

						res.setHeader("Expires", expires.toUTCString());

						res.setHeader("Cache-Control", "max-age=" + config.Expires.maxAge);

					}



					if (req.headers[ifModifiedSince] && lastModified == req.headers[ifModifiedSince]) {

						res.writeHead(304, "Not Modified");

						res.end();

					} else {

						var raw = fs.createReadStream(realPath);

						var acceptEncoding = req.headers['accept-encoding'] || "";

						var matched = ext.match(config.Compress.match);



						if (matched && acceptEncoding.match(/\bgzip\b/)) {

							res.writeHead(200, "Ok", {
								'Content-Encoding': 'gzip'
							});

							raw.pipe(zlib.createGzip()).pipe(res);

						} else if (matched && acceptEncoding.match(/\bdeflate\b/)) {

							res.writeHead(200, "Ok", {
								'Content-Encoding': 'deflate'
							});

							raw.pipe(zlib.createDeflate()).pipe(res);

						} else {

							res.writeHead(200, "Ok");

							raw.pipe(res);

						}

					}

				}

			}

		});

	};
	pathHandle(realPath);
}
exports.handleStatic = handleStatic;