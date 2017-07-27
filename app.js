"use strict";

var express = require('express');
var app = express();
var http = require('http');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var fs = require("fs");
var logger = require('morgan');
var path = require('path');

//--server ---------------------------------------------------------------------
var appName = 'robot-applications-server';  //ras
var server = app.listen(8080, function() {
	var host = server.address().address
	var port = server.address().port
	console.log(appName + ' app listening at http://%s:%s', host, port)
});

//--view engine setup-----------------------------------------------------------
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(favicon(path.join(__dirname, '/public/images', 'favicon.ico')));
app.use(logger('dev'));
app.use(cookieParser());
var jsonPath = (__dirname + '/public/json/');
app.use(express.static(path.join(__dirname, 'public')));

//--json body parser-----------------------------------------
var bodyParser = require('body-parser')
app.use( bodyParser.json() );
var urlencodedParser = app.use(bodyParser.urlencoded({
  extended: false
}));

//----application stuff---------------------------------------------------------
var helper = require('./node_modules/node-helper/node-helper.js');

//keep the order here !
const configPath = './settings/';
const configFile = 'config.json';
const config =	JSON.parse(helper.loadFile(configPath + '/' + configFile));

var appName         = config.appName;
var appsDefaultFile = config.appsDefaultFile;
var appsFreeFile 		= config.appsFreeFile;
var appsGitPath			= config.appsGitPath;
var resourcePath		= config.resourcePath;

var userAppHome			= helper.getUserHome() + '/.' + appName;
var appDataPath		  = userAppHome + '/' + config.appDataPath;
var appsFreePath    = appDataPath + '/' + appsFreeFile;

const Application = require(resourcePath).Application;

app.use(appsGitPath, express.static(userAppHome + '/' + appsGitPath + "/"));

//--preparations----------------------------------------------------------------
//TODO run ./lib/ras/preparations.js

helper.log ('start ' + appName);

//==API's=======================================================================
app.get('/' + appName + '/api/getDefaultApps', function(req, res) {
    var defaultApps = helper.loadFile(resourcesPath + appsDefaultFile);
		res.end(defaultApps);
});

app.get('/' +appName + '/api/getFreeApps', function(req, res) {
  var freeApps = helper.loadFile(appsFreePath);
  res.end(freeApps);
});

app.post('/' + appName + '/api/addFreeApp/', function (req, res) {
	try{
		var freeApplications = JSON.parse(helper.loadFile(appsFreePath));
		var freeApp =  new Application();
	  freeApp.gitPath = req.body.gitPath;
	  freeApp.localPath =  req.body.localPath;
	  freeApp.name =   req.body.name;
	  freeApp.webPath = req.body.webPath;
		freeApplications.applications.push(freeApp);
	  helper.saveFile(appsFreePath,JSON.stringify(freeApplications, null, 2));
		res.json(JSON.stringify('Success'));
	}catch (err){
		res.json(JSON.stringify('failed: ' + err));
	}
});

app.get('/' + appName + '/api/getServerIPAdresses', function(req, res) {
	var ips = helper.getLocalIPs();
	res.send(ips);
});

app.get('/' + appName + '/doShutdown',function (req, res) {
	helper.log('shutdown by the User');
	res.send(appName + ' is down');
	process.exit();
});

//TODO move api out here in the future
//--API rca-------------------------------------------------
var rca = 'rca';
app.post('/' + rca + '/api/move',function (req, res) {
	var move = req.body.move;
	//serial send
	res.send(JSON.stringify('moved ' + move));
});

app.post('/' + rca + '/api/eye/left', function (req, res) {
  var left = { posPitch:37, posYaw:37 }
	left.posPitch = req.body.posPitch;
	left.posYaw = req.body.posYaw;
	//MQTT Update
	//serial send
	res.send(left);
});

//error handlers----------------------------------------------------------

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
