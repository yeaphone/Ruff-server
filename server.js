// 请求(require)一个 nodejs 自带的 http模块
// 请求(require)一个 nodejs 自带的 url解析模块
var http = require("http");
var url = require("url");
var ws = require("nodejs-websocket")
var fs = require("fs")

// 调用 http模块 提供的 createServer函数: 
// 返回一个对象,这个对象有一个 listen 方法,这个方法带一个数值参数,
// 指定这个 http 服务器监听的端口号.

function httpServerStart(route, handle) {

    function onRequest(request, response) {
        // 获取请求路径
        var pathname = url.parse(request.url).pathname;

        // 关闭nodejs 默认访问 favicon.ico
        if (!pathname.indexOf('/favicon.ico')) {
            return;
        };

        // 收到来自 pathname 的请求
        console.log("Request for " + pathname + " received.");

        // 路由器处理
        route(handle, pathname, request, response);
    }

    http.createServer(onRequest).listen(8080);
    console.log("Server has start!");
}

//webSocket 服务
var sokectServer;

function webSocketServerStart() {
    sokectServer = ws.createServer(function(connection) {
        connection.nickname = null
        connection.on("text", function(str) {
            if (connection.nickname === null) {
                connection.nickname = str
                broadcast(str + " entered")
            } else
                broadcast("[" + connection.nickname + "] " + str)
        })
        connection.on("close", function() {
            //broadcast(connection.nickname + " left")
        })
    })
    sokectServer.listen(8081)
}

function broadcast(str) {
    sokectServer.connections.forEach(function(connection) {
        connection.sendText(str)
    })
}


// 开放接口
exports.httpServerStart = httpServerStart;
exports.webSocketServerStart = webSocketServerStart;
exports.sokectServer = sokectServer;
exports.broadcast = broadcast;