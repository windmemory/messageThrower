'use strict'

var fs = require('fs'),
	config = require('../config'),
	contentProcessor = require('./file_content_processor');
const zlib = require('zlib');

function fileReader(nameList, isFakeEnabled, cb) {
	
	var randomIndex = Math.floor(nameList.length * Math.random());
	var filePath = config.resourceDir + '/' + nameList[randomIndex];
	fs.readFile(filePath, {encoding: 'utf-8'}, function(err, content) {
		if (isFakeEnabled) {
			content = contentProcessor(content);
		}
		// cb(zlib.gzipSync(content));
        cb(content);
	})
}

module.exports = fileReader;