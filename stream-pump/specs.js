#!/usr/bin/env node

var jasmine = require('jasmine-node');
var sys = require('sys');

for(var key in jasmine) {
  global[key] = jasmine[key];
}

var isVerbose = false;
var showColors = true;
process.argv.forEach(function(arg){
  switch(arg) {
  case '--color': showColors = true; break;
  case '--noColor': showColors = false; break;
  case '--verbose': isVerbose = true; break;
  }
});

var options = {
	specFolders: [__dirname + "/spec"],
	done: function(runner, log){
		process.exit(runner.results().failedCount);
	},
	isVerbose: isVerbose,
	showColors: showColors
};
console.log("Options: %j", options);
jasmine.executeSpecsInFolder(options);
