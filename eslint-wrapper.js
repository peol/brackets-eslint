/*global require, exports*/
(function() {
"use strict";

	var CLIEngine = require("./node_modules/eslint/lib/cli-engine");

	function lintFile(options) {
		try {
			var engine = new CLIEngine(options.options);
			var result = engine.executeOnFiles(options.files);
			var messages = result.results.map(function(file) {
				return {
					file: file.file,
					messages: file.messages.map(function(message) {
						delete message.node;
						return message;
					})
				};
			});
			return JSON.stringify(messages);
		} catch (e) {
			return JSON.stringify(e);
		}
	}

	exports.init = function init(domainManager) {
		if (!domainManager.hasDomain("ESLintWrapper")) {
			domainManager.registerDomain("ESLintWrapper", { major: 0, minor: 1 });
		}
		domainManager.registerCommand(
			"ESLintWrapper",
			"lint",
			lintFile,
			false,
			"Returns lint warnings and errors",
			[{
				name: "options",
				type: "object",
				description: "Options to invoke ESLint with"
			}]
		);
	};
}());
