# brackets-eslint
Use ESLint as your JavaScript linter in Adobe Brackets.

# Configuration
Open up Debug->Open preferences file and add:
```
"eslint.options": {
    "configFile": "path-relative-to-project-root/.eslintrc",
    "rulePaths": ["path-relative-to-project-root/foo/", "path-relative-to-project-root/bar/"]
}
```

# Gotchas
Configurations are global, if you configure using the preference file, brackets-eslint will assume all your projects have those preferences.