var server = require("./server");
var router = require("./routes/router");
var reqHandlers = require("./reqHandler/reqHanlders");

// handle 保存不同请求路径对应的处理方法
var handle = {};

handle["/"] = reqHandlers.start;
handle["/start"] = reqHandlers.start;
handle["/firelight"] = reqHandlers.firelight;

// 传入路由模块方法, 路径处理方法
//启动http服务
server.httpServerStart(router.route, handle);
//启动websocket 服务
server.webSocketServerStart();