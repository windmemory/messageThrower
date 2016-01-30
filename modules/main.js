'use strict'

var config = require('../config'),
	Rx = require('rx'),
	request = require('request'),
	fileReader = Rx.Observable.fromCallback(require('./file_reader')),
	fs = require('fs'),
	nameList = fs.readdirSync(config.resourceDir),
	sum = Math.floor(config.activeDurationInMinute * 60 * config.messagePerSecond),
	counter = 0,
	initialTime = new Date().getTime();

function readfileToStream(subject, timeInterval) {
	fileReader(nameList, config.enableFakeMessage, function(content) {
		subject.onNext(content);
		setTimeout(function() {
			readfileToStream(subject, timeInterval);
		}, timeInterval);
	});
}

function createReadfileStream(timeInterval) {
	var subject = new Rx.Subject();
	readfileToStream(subject, timeInterval);
	return subject;
}

function main() {
	var timeInterval = 1000 / config.messagePerSecond;
	var readFileStream = createReadfileStream(timeInterval);

	var messageThrower = readFileStream.subscribe(function(data) {
		var options = {
			url: config.endpoint.location,
			headers: config.endpoint.headers,
			body: data
		}
		request.post(options, function(err, response, body) { 
			if (err || response.statusCode !== 201) console.log('request has error with body: ' + body);
			else counter++;
			if (counter % config.numberOfMessagePerLog === 0 && counter !== 0) {
				console.log('\nalready throwed ' + counter + ' messages');
				var curTime = new Date().getTime();
				console.log('process had been running for ' + (curTime - initialTime) / 1000 + ' seconds');
				console.log('' + Math.floor(counter / (curTime - initialTime) * 1000) + ' messages per second');
			}
		});
		if (counter >= sum) {
			readFileStream.onCompleted();
			console.log('\n' + counter + ' messages sent');
			var curTime = new Date().getTime();
			console.log('process took ' + (curTime - initialTime) / 1000 + ' seconds');
			console.log('' + Math.floor(sum / (curTime - initialTime) * 1000) + ' messages per second');
			process.exit();
		}
	});
	
}

module.exports = {
	start: main
};