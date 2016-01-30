module.exports = {
	messagePerSecond: 0.2 ,
	resourceDir: './resources/all_files',
	tempraryNameFile: './resources/names.json',
	endpoint: {
		location: 'http://wwwexpediacom.taap-uploader-service.us-west-2.test.expedia.com/',
		headers: {
			'Content-Type': 'application/octet-stream'
		}
	},
	enableFakeMessage: true,
	activeDurationInMinute: 5,
	numberOfMessagePerLog: 5000
}
