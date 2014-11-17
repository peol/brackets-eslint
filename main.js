/*global define, brackets, $, window*/
define(function (require, exports, module) {
	"use strict";

	var ExtensionUtils = brackets.getModule("utils/ExtensionUtils");
	var CodeInspection = brackets.getModule("language/CodeInspection");
	var ProjectManager = brackets.getModule("project/ProjectManager");
	var PreferencesManager = brackets.getModule("preferences/PreferencesManager");
	var NodeDomain = brackets.getModule("utils/NodeDomain");
	var ESLint = new NodeDomain("ESLintWrapper", ExtensionUtils.getModulePath(module, "eslint-wrapper"));
	var prefs = PreferencesManager.getExtensionPrefs("eslint");
	var DEFAULTS = {
		// add sensible defaults?
	};

	function getOptions() {
		var projectRoot = ProjectManager.getProjectRoot();
		var opts = projectRoot && prefs.get("options:" + projectRoot.name) || null;
		var root = projectRoot && projectRoot._path || "";

		if (opts) {
			window.console.log("[brackets-eslint] Using project-specific options for '%s'", projectRoot.name);
		} else {
			window.console.log("[brackets-eslint] Using global options");
			// fallback to global options:
			opts = prefs.get("options");
		}

		opts = $.extend(true, {}, DEFAULTS, opts);

		if (opts.configFile) {
			opts.configFile = root + opts.configFile;
		}

		if (opts.rulePaths) {
			opts.rulePaths = opts.rulePaths.map(function(path) {
				return root + path;
			});
		}

		return opts;
	}

	var options = getOptions();

	function done(dfd, result) {
		var errors = result[0].messages.map(function(err) {
			return {
				pos: { line: err.line - 1, ch: err.column },
				message: "[" + err.ruleId + "] " + err.message,
				type: CodeInspection.Type.WARNING
			};
		});
		dfd.resolve({ errors: errors });
	}

	function fail(dfd, err) {
		dfd.reject(JSON.stringify(err));
	}

	function validateFile(text, path) {
		var dfd = $.Deferred();

		ESLint.exec("lint", {
			files: [path],
			options: options
		}).done(function (result) {
			result = JSON.parse(result);
			if (result.errno) {
				fail(dfd, result);
			} else {
				done(dfd, result);
			}
		}).fail(function (err) {
			fail(dfd, err);
		});

		return dfd.promise();
	}

	function setOptions() {
		options = getOptions();
	}

	$(ProjectManager).on("projectOpen", setOptions);
	$(ProjectManager).on("projectClose", setOptions);

	CodeInspection.register("javascript", {
		name: "ESLint",
		scanFileAsync: validateFile
	});
});
