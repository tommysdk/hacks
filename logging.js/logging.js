var http = require('http');
var url = require('url');
var path = require('path');

var requestCounter = 1;
var statusMap = {};

function getPath(url) {
	if (url == null || url == undefined) return 'undefined';
	if (url.indexOf('/') == -1 || url.indexOf('?') == -1) return 'undefined';
	return url.substring(url.indexOf('/') + 1, url.indexOf('?'));
}

function format(str, desiredLength) {
	if (str.length > desiredLength) return str.substring(0, desiredLength);
	else if (str.length < desiredLength) {
		var paddedStr = str;
		for (var i = str.length; i <= desiredLength; i++) {
			paddedStr += ' ';
		}
		return paddedStr;
	}
	else return str;
}

http.createServer(function (req, res) {
	var urlTokens = url.parse(req.url, true);
    	var query = urlTokens.query;
	var path = getPath(req.url);
	var uiColumnLength = 10;
	console.log('Received request to path: ' + path + ', parameters: ' + JSON.stringify(query));

	for (var queryParam in query) {
		if (!(path in statusMap)) {
			statusMap[path] = new Array();
		}
		statusMap[path][0] = queryParam;
		statusMap[path][1] = query[queryParam];
		statusMap[path][2] = new Date();
	}

	res.writeHead(200, {'Content-Type': 'text/plain'});
	var response = 'Logging glass (request #' + requestCounter++ + ')\n\n';
	response += format('PATH', uiColumnLength) + ' ' + format('KEY', uiColumnLength) + ' ' + format('VALUE', uiColumnLength) + ' TIMESTAMP\n' 
	for (var key in statusMap) {
		if (statusMap.hasOwnProperty(key)) {
			response += format(key, uiColumnLength) + ' ' + format(statusMap[key][0], uiColumnLength) + ' ' + format(statusMap[key][1], uiColumnLength) + ' ' + format(statusMap[key][2], uiColumnLength) + '\n';
		}
	}
	res.end(response);
}).listen(80, '127.0.0.1');
console.log('Logging glass server running at http://127.0.0.1:80/');

