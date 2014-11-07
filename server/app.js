'use strict';

var express = require('express');
var http = require('http');
var app = express();
var path = require('path');
var hbs = require('express-hbs');

var five = require("johnny-five");

var board = five.Board();

// stop gap to handle when no board is plugged in. Will switch to domain when we setup a proper server
process.on('uncaughtException', function(err) {
	  console.log('Caught exception: ' + err);
});

	//// simple log
	app.use(function(req, res, next){
	  console.log('%s %s', req.method, req.url);
	  next();
	});

	//// mount static
	app.use(express.static( path.join( __dirname, '../app') ));
	// For distributable version, comment out the above and uncomment the line below
	//app.use(express.static( path.join( __dirname, 'app') ));
	app.use(express.static( path.join( __dirname, '../.tmp') ));


	//// route index.html
	app.get('/', function(req, res){
	  res.sendfile( path.join( __dirname, '../app/index.html' ) );
	  // For distributable version, comment out the above and uncomment the line below
	  //res.sendfile( path.join( __dirname, 'app/index.html' ) );
	});
	app.get('/test', function(req, res){
		console.log(req, res);
	});


	//// start server
	var server = http.createServer(app);

	var socketIO = require('socket.io');
	var io = socketIO.listen(server);
	var sensor,
		sensor1,
		servo,
        pwm;

	var _ = require('underscore'),
		events = require('events');

	var ArduinoUnoModel = function(attributes) {
		events.EventEmitter.call(this);

		_.extend(this, {
			get: function(field) {
				return this[field];
			},
			set: function(field, value) {
				this[field] = value;
				this.emit('change', {field: field, value: this[field]});
				return ;
			},
			A0: 0,
			A1: 0,
			A2: 0,
			A3: 0,
			A4: 0,
			A5: 0,
			out9: 0,
		});

		_.extend(this, attributes);
	};

	ArduinoUnoModel.prototype.__proto__ = events.EventEmitter.prototype;

	board.on("ready", function() {
		// Create a new `sensor` hardware instance.
		sensor = new five.Sensor({
			pin: "A0",
			freq: 100,
		});
		sensor1 = new five.Sensor({
			pin: "A1",
			freq: 100,
		});
		servo = new five.Servo({
			pin: 9,
			range: [0,180],
			//range: [0,1023],
		});
        
        pwm = new five.Led({
          pin: 3, 
          type: "pwm"
        });

		board.repl.inject({
			sensor: sensor,
            led: pwm
		});

		io.on('connection', function(socket){
			console.log('a user connected');

			// Create the arduino uno instance
			var arduinoModel = new ArduinoUnoModel();
			arduinoModel.on('change', function(options) {
				if(options.field !== 'out9') {
					socket.emit('receivedModelUpdate', {modelType: 'ArduinoUno', field: options.field, value: options.value});
				}
			});

			var hardwareModels = {
				ArduinoUno: arduinoModel,
			};


			socket.on('sendModelUpdate', function(options) {
				hardwareModels[options.modelType].set('out9', parseInt(options.model.D9, 10));
			});
			arduinoModel.on('change', function(options) {
				if(options.field === 'out9') {
					//servo.to(options.value);
                    pwm.brightness(options.value);
				}
			});

			sensor.scale([0, 1023]).on("data", function() {
				arduinoModel.set('A0', Math.floor(this.value));
			});
			sensor1.scale([0, 1023]).on("data", function() {
				arduinoModel.set('A1', Math.floor(this.value));
			});

		});
	});
	server.listen(9001, function(){
		console.log('Express App started!');
	});


