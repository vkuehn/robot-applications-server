/*globals init */
/*eslint-env node */
// application as a map like funtion

// function application is needed to see it in the object name and text files !
exports.Application = function Application(gitPath, localPath, name, webPath){
	  this.gitPath = gitPath;
	  this.localPath = localPath;
	  this.name = name;
	  this.webPath = webPath;
}
