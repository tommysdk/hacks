var server_bind_address = '127.0.0.1';
var server_bind_port = 9000;

var http = require('http');
var url = require('url');
var path = require('path');

function getPath(url) {
	if (url == null || url == undefined) return 'undefined';
	if (url.indexOf('/') == -1) return 'undefined';
	var lastIndexOfPath = url.indexOf('?');
	if (lastIndexOfPath == -1) {
		lastIndexOfPath = url.length;
	}
	console.log(url);
	return url.substring(url.indexOf('/') + 1, lastIndexOfPath);
}

http.createServer(function (req, res) {
	var urlTokens = url.parse(req.url, true);
	var query = urlTokens.query;
	var path = getPath(req.url);
	
	res.writeHead(200, {'Content-Type': 'text/plain'});
	
	response = 'Successfully handled request';
	
	res.end(response);
}).listen(server_bind_port, server_bind_address);
console.log('Web server running at ' + server_bind_address + ':' + server_bind_port);