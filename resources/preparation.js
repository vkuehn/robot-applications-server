"use strict";

const fs = require('fs');
const helper = require('../node_modules/node-helper/node-helper.js');

const configPath = '../settings/';
const configFile = 'config.json';
const ressourceDir = '../resources/';

function prepare(){
  const config =	JSON.parse(helper.loadFile(configPath + '/' + configFile));

  var appFoldersOnce = config.directoryOnce;
  var appName        = config.appName;
  var copyFileOnce   = config.copyFileOnce;

  var userAppHome    = helper.getUserHome() + '/.' + appName;

  helper.log('Preparations for ' + appName);
  helper.log('userAppHome ' + userAppHome);

  appFoldersOnce.forEach(function(folder) {
    var mkPath = userAppHome + folder.path;
    helper.log('make dir once ' + mkPath);
    //helper.mkDirOnce(dataPath, function(result){ helper.log(result); });
  });

  // copy reources to user app home
  copyFileOnce.forEach(function(file) {
    var source      = ressourceDir + file.copy.source;
    var destination = userAppHome + file.copy.destination;
    helper.log('Copy from ' + source + ' to ' + destination);
    /*
      helper.copyFileOnce(configPath + appsFreeFile, appsTargetPath,
        function(result){ helper.log(result); } );*/

  });
}

module.exports = {
	prepare: prepare
};
