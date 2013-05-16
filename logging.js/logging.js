var http = require('http');
var url = require('url');
var path = require('path');

var requestCounter = 1;
var statusMap = {};
var uiColumnLength = 10;

function getPath(url) {
	if (url == null || url == undefined) return 'undefined';
	if (url.indexOf('/') == -1) return 'undefined';
	var lastIndexOfPath = url.indexOf('?');
	if (lastIndexOfPath == -1) {
		lastIndexOfPath = url.length;
	}
	console.log('lastindexofpath ' + lastIndexOfPath);
	console.log(url);
	return url.substring(url.indexOf('/') + 1, lastIndexOfPath);
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

function toUiFormattedString(str1, str2, str3, str4) {
	return format(str1, uiColumnLength) + ' ' + format(str2, uiColumnLength) + ' ' + format(str3, uiColumnLength) + ' ' + format(str4, uiColumnLength) + '\n';
}

function requestingHistory(str) {
	if (str == null || str == undefined || str.length < 'history/'.length) return false;
	else if (str.substring(0, 8) == 'history/') return true;
	else return false;
}

function logRequest(path, query) {
	for (var queryParam in query) {
		if (!(path in statusMap)) {
			statusMap[path] = new Array();
		}
		var nextArrayIndex = statusMap[path].length;
		statusMap[path][nextArrayIndex] = new Array();
		statusMap[path][nextArrayIndex][0] = queryParam;
		statusMap[path][nextArrayIndex][1] = query[queryParam];
		statusMap[path][nextArrayIndex][2] = new Date();
	}
}

function assembleStatusResponse() {
	var statusText = '';
	for (var key in statusMap) {
		if (statusMap.hasOwnProperty(key)) {
			var lastIndex = statusMap[key].length - 1;
			statusText += toUiFormattedString(key, statusMap[key][lastIndex][0], statusMap[key][lastIndex][1], statusMap[key][lastIndex][2]);
		}
	}
	return statusText;
}

function assembleHistoryResponse(path) {
	var historyText = '';
	var key = path.substring('history/'.length);
	console.log('Assembling history for: ' + key);
	if (statusMap.hasOwnProperty(key)) {
		for (var i = 0; i < statusMap[key].length; i++) {
			var historyItem = statusMap[key][i];
			historyText += toUiFormattedString(key, historyItem[0], historyItem[1], historyItem[2]);
		}
	}
	return historyText;
}

http.createServer(function (req, res) {
	var urlTokens = url.parse(req.url, true);
    var query = urlTokens.query;
	var path = getPath(req.url);
	console.log('Received request to path: ' + path + ', parameters: ' + JSON.stringify(query));

	res.writeHead(200, {'Content-Type': 'text/plain'});
	var response = 'Logging glass (request #' + requestCounter++ + ')\n\n';
	response += format('PATH', uiColumnLength) + ' ' + format('KEY', uiColumnLength) + ' ' + format('VALUE', uiColumnLength) + ' TIMESTAMP\n' 
	
	if (requestingHistory(path)) {
		console.log('Assembling history');
		response += assembleHistoryResponse(path);
	} else {
		console.log('Assembling status response');
		logRequest(path, query);
		response += assembleStatusResponse();
	}
	res.end(response);
}).listen(80, '127.0.0.1');
console.log('Logging glass server running at http://127.0.0.1:80/');
