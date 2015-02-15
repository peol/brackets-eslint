# brackets-eslint
Use ESLint as your JavaScript linter in Adobe Brackets.

# Configuration
Open up Debug->Open preferences file...

To add global preferences:
```
"eslint.options": {
    "configFile": "path-relative-to-project-root/.eslintrc",
    "rulePaths": ["path-relative-to-project-root/foo/", "path-relative-to-project-root/bar/"]
}
```
To add project-specific preferences:
```
"eslint.options:projectname": {
    "configFile": "path-relative-to-project-root/.my-projects-eslintrc",
    "rulePaths": ["path-relative-to-project-root/foo/", "path-relative-to-project-root/bar/"]
}
```
To disable any other linters for JavaScript and only use ESLint, add:
```
"language": {
    "javascript": {
        "linting.prefer": ["ESLint"],
        "linting.usePreferredOnly": true
    }
}
```
