/*global define, brackets, $*/
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
    
    function getOptions() {
        var opts = $.extend(true, {}, DEFAULTS, prefs.get("options"));
        var projectRoot = ProjectManager.getProjectRoot()._path;
        
        if (opts.configFile) {
            opts.configFile = projectRoot + opts.configFile;
        }
        
        if (opts.rulePaths) {
            opts.rulePaths = opts.rulePaths.map(function(path) {
                return projectRoot + path;
            });
        }

        return opts;
    }

	function validateFile(text, path) {
		var dfd = $.Deferred();
        var opts = getOptions();
        
		ESLint.exec("lint", {
			files: [path],
			options: opts
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

	CodeInspection.register("javascript", {
		name: "ESLint",
		scanFileAsync: validateFile
	});
});
