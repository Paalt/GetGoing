var FileSystem = require("FuseJS/FileSystem");
var path = FileSystem.dataDirectory + "/" + "getmethereconfig.json";

function saveConfig(config) {
	var text = JSON.stringify(config);;
	FileSystem.writeTextToFileSync(path, text);
}

function loadConfig() {
	if (FileSystem.existsSync(path)) {
		var jsonText = FileSystem.readTextFromFileSync(path);
		return JSON.parse(jsonText);
	} else {
		return { home: null, work: null };
	}
}

module.exports = {
	saveConfig: saveConfig,
	loadConfig: loadConfig
};
