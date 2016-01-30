'use strict'

var config = require('../config');

function processor(data) {
	var timestamp = new Date().getTime();
	var reg = /<event:EventId>.*<\/event:EventId>/;
	return data.replace(reg, '<event:EventId>' + timestamp + '</event:EventId>');
}

module.exports = processor;